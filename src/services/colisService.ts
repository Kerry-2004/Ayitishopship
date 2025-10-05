import { supabase } from '../lib/supabase';

export interface ExpediteurData {
  nom_complet: string;
  telephone: string;
  email: string;
  adresse_complete: string;
  ville: string;
  etat: string;
  code_postal: string;
}

export interface DestinataireData {
  nom_complet: string;
  telephone: string;
  email?: string;
  ville_recuperation: string;
  adresse_complete: string;
}

export interface ColisData {
  type_colis: string;
  poids_lbs: number;
  longueur_cm?: number;
  largeur_cm?: number;
  hauteur_cm?: number;
  description_detaillee: string;
  quantite_articles?: number;
  instructions_speciales?: string;
}

export interface EnregistrementColisData {
  expediteur: ExpediteurData;
  destinataire: DestinataireData;
  colis: ColisData;
  agent_id?: string;
}

export const genererNumeroSuivi = (): string => {
  const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AYITI-${timestamp}-${random}`;
};

export const genererQRCode = (numeroSuivi: string): string => {
  return `QR-${numeroSuivi}-${Date.now()}`;
};

export const calculerCoutExpedition = (poids: number, destination: string): number => {
  const tarifs: Record<string, number> = {
    'Port-au-Prince': 3.5,
    'Cap-Haïtien': 4.0,
    'Les Cayes': 6.0
  };

  const fraisFixes = 10.0;
  const tarifParLb = tarifs[destination] || 3.5;

  return (poids * tarifParLb) + fraisFixes;
};

export const estimerDateArrivee = (destination: string): string => {
  const jours: Record<string, number> = {
    'Port-au-Prince': 5,
    'Cap-Haïtien': 8,
    'Les Cayes': 12
  };

  const joursAjouter = jours[destination] || 7;
  const date = new Date();
  date.setDate(date.getDate() + joursAjouter);

  return date.toISOString().split('T')[0];
};

export const gererExpediteur = async (expediteur: ExpediteurData): Promise<string> => {
  const { data: existant } = await supabase
    .from('expediteurs')
    .select('id')
    .or(`email.eq.${expediteur.email},telephone.eq.${expediteur.telephone}`)
    .maybeSingle();

  if (existant) {
    return existant.id;
  }

  const { data, error } = await supabase
    .from('expediteurs')
    .insert(expediteur)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const gererDestinataire = async (destinataire: DestinataireData): Promise<string> => {
  const { data: existant } = await supabase
    .from('destinataires')
    .select('id')
    .eq('telephone', destinataire.telephone)
    .eq('ville_recuperation', destinataire.ville_recuperation)
    .maybeSingle();

  if (existant) {
    return existant.id;
  }

  const { data, error } = await supabase
    .from('destinataires')
    .insert(destinataire)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const enregistrerColis = async (donnees: EnregistrementColisData) => {
  try {
    const expediteurId = await gererExpediteur(donnees.expediteur);
    const destinataireId = await gererDestinataire(donnees.destinataire);

    const numeroSuivi = genererNumeroSuivi();
    const qrCode = genererQRCode(numeroSuivi);

    const coutExpedition = calculerCoutExpedition(
      donnees.colis.poids_lbs,
      donnees.destinataire.ville_recuperation
    );

    const datePrevueArrivee = estimerDateArrivee(
      donnees.destinataire.ville_recuperation
    );

    const { data: colis, error: colisError } = await supabase
      .from('colis')
      .insert({
        numero_suivi: numeroSuivi,
        qr_code: qrCode,
        expediteur_id: expediteurId,
        destinataire_id: destinataireId,
        agent_enregistrement_id: donnees.agent_id || null,
        type_colis: donnees.colis.type_colis,
        poids_lbs: donnees.colis.poids_lbs,
        longueur_cm: donnees.colis.longueur_cm || null,
        largeur_cm: donnees.colis.largeur_cm || null,
        hauteur_cm: donnees.colis.hauteur_cm || null,
        description_detaillee: donnees.colis.description_detaillee,
        quantite_articles: donnees.colis.quantite_articles || 1,
        instructions_speciales: donnees.colis.instructions_speciales || null,
        statut: 'en_attente',
        date_prevue_arrivee: datePrevueArrivee,
        cout_expedition: coutExpedition
      })
      .select('id')
      .single();

    if (colisError) throw colisError;

    const { error: historiqueError } = await supabase
      .from('suivi_historique')
      .insert({
        colis_id: colis.id,
        agent_id: donnees.agent_id || null,
        statut_precedent: null,
        nouveau_statut: 'en_attente',
        localisation: 'USA - Enregistrement initial',
        commentaire: 'Colis enregistré dans le système'
      });

    if (historiqueError) throw historiqueError;

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        colis_id: colis.id,
        destinataire_telephone: donnees.destinataire.telephone,
        destinataire_email: donnees.destinataire.email || null,
        type_notification: 'enregistrement',
        titre: 'Colis enregistré - AyitiShop&Ship',
        message: `Bonjour ${donnees.destinataire.nom_complet}, votre colis ${numeroSuivi} a été enregistré et sera expédié vers ${donnees.destinataire.ville_recuperation}. Vous recevrez une notification dès son arrivée.`,
        envoyee: false
      });

    if (notificationError) throw notificationError;

    return {
      success: true,
      colis_id: colis.id,
      numero_suivi: numeroSuivi,
      qr_code: qrCode,
      cout_expedition: coutExpedition,
      date_prevue_arrivee: datePrevueArrivee
    };

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du colis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

export const obtenirColis = async (numeroSuivi: string) => {
  try {
    const { data: colis, error: colisError } = await supabase
      .from('colis')
      .select(`
        *,
        expediteur:expediteurs(*),
        destinataire:destinataires(*),
        agent:agents(nom_complet)
      `)
      .eq('numero_suivi', numeroSuivi)
      .maybeSingle();

    if (colisError) throw colisError;
    if (!colis) {
      return {
        success: false,
        error: 'Colis non trouvé'
      };
    }

    const { data: historique, error: historiqueError } = await supabase
      .from('suivi_historique')
      .select('*, agent:agents(nom_complet)')
      .eq('colis_id', colis.id)
      .order('date_scan', { ascending: true });

    if (historiqueError) throw historiqueError;

    const { data: photos, error: photosError } = await supabase
      .from('colis_photos')
      .select('*')
      .eq('colis_id', colis.id);

    if (photosError) throw photosError;

    return {
      success: true,
      data: {
        ...colis,
        historique: historique || [],
        photos: photos || []
      }
    };

  } catch (error) {
    console.error('Erreur lors de la récupération du colis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

export const mettreAJourStatut = async (
  numeroSuivi: string,
  nouveauStatut: string,
  agentId: string | null,
  commentaire: string = '',
  localisation: string = ''
) => {
  try {
    const { data: colis, error: colisError } = await supabase
      .from('colis')
      .select('id, statut')
      .eq('numero_suivi', numeroSuivi)
      .maybeSingle();

    if (colisError) throw colisError;
    if (!colis) {
      return {
        success: false,
        error: 'Colis non trouvé'
      };
    }

    const { error: updateError } = await supabase
      .from('colis')
      .update({ statut: nouveauStatut })
      .eq('id', colis.id);

    if (updateError) throw updateError;

    const { error: historiqueError } = await supabase
      .from('suivi_historique')
      .insert({
        colis_id: colis.id,
        agent_id: agentId,
        statut_precedent: colis.statut,
        nouveau_statut: nouveauStatut,
        localisation: localisation,
        commentaire: commentaire
      });

    if (historiqueError) throw historiqueError;

    if (['en_transit', 'arrive_bureau', 'pret_recuperation'].includes(nouveauStatut)) {
      const typeNotificationMap: Record<string, string> = {
        'en_transit': 'transit',
        'arrive_bureau': 'arrive',
        'pret_recuperation': 'pret_recuperation'
      };

      const typeNotification = typeNotificationMap[nouveauStatut];

      const { data: colisInfo } = await supabase
        .from('colis')
        .select(`
          numero_suivi,
          destinataire:destinataires(nom_complet, telephone, email, ville_recuperation)
        `)
        .eq('id', colis.id)
        .single();

      if (colisInfo && colisInfo.destinataire) {
        const messagesMap: Record<string, { titre: string; message: string }> = {
          'transit': {
            titre: 'Colis en transit - AyitiShop&Ship',
            message: `Votre colis ${colisInfo.numero_suivi} est maintenant en transit vers Haïti.`
          },
          'arrive': {
            titre: 'Colis arrivé - AyitiShop&Ship',
            message: `Votre colis ${colisInfo.numero_suivi} est arrivé à notre bureau de ${colisInfo.destinataire.ville_recuperation}.`
          },
          'pret_recuperation': {
            titre: 'Colis prêt - AyitiShop&Ship',
            message: `Votre colis ${colisInfo.numero_suivi} est prêt à être récupéré à notre bureau de ${colisInfo.destinataire.ville_recuperation}. Apportez une pièce d'identité.`
          }
        };

        const msg = messagesMap[typeNotification];

        await supabase
          .from('notifications')
          .insert({
            colis_id: colis.id,
            destinataire_telephone: colisInfo.destinataire.telephone,
            destinataire_email: colisInfo.destinataire.email || null,
            type_notification: typeNotification as any,
            titre: msg.titre,
            message: msg.message,
            envoyee: false
          });
      }
    }

    return { success: true };

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

export const obtenirTousColis = async () => {
  try {
    const { data, error } = await supabase
      .from('colis')
      .select(`
        *,
        expediteur:expediteurs(nom_complet),
        destinataire:destinataires(nom_complet, ville_recuperation),
        agent:agents(nom_complet)
      `)
      .order('date_enregistrement', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des colis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      data: []
    };
  }
};
