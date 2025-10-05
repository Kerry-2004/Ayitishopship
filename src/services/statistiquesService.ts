import { supabase } from '../lib/supabase';

export interface StatistiquesGenerales {
  totalColis: number;
  totalClients: number;
  colisParStatut: {
    en_attente: number;
    en_transit: number;
    arrive_bureau: number;
    pret_recuperation: number;
    recupere: number;
  };
}

export const obtenirStatistiquesGenerales = async (): Promise<StatistiquesGenerales> => {
  try {
    const { data: colis, error: colisError } = await supabase
      .from('colis')
      .select('statut');

    if (colisError) throw colisError;

    const { data: expediteurs, error: expediteursError } = await supabase
      .from('expediteurs')
      .select('id', { count: 'exact', head: true });

    if (expediteursError) throw expediteursError;

    const { data: destinataires, error: destinatairesError } = await supabase
      .from('destinataires')
      .select('id', { count: 'exact', head: true });

    if (destinatairesError) throw destinatairesError;

    const colisParStatut = {
      en_attente: 0,
      en_transit: 0,
      arrive_bureau: 0,
      pret_recuperation: 0,
      recupere: 0
    };

    colis?.forEach((c) => {
      if (c.statut in colisParStatut) {
        colisParStatut[c.statut as keyof typeof colisParStatut]++;
      }
    });

    return {
      totalColis: colis?.length || 0,
      totalClients: ((expediteurs?.length || 0) + (destinataires?.length || 0)),
      colisParStatut
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      totalColis: 0,
      totalClients: 0,
      colisParStatut: {
        en_attente: 0,
        en_transit: 0,
        arrive_bureau: 0,
        pret_recuperation: 0,
        recupere: 0
      }
    };
  }
};

export const surveillerChangementsColis = (callback: () => void) => {
  const channel = supabase
    .channel('colis-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'colis'
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return channel;
};

export const obtenirColisRecents = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('colis')
      .select(`
        id,
        numero_suivi,
        type_colis,
        statut,
        poids_lbs,
        date_enregistrement,
        expediteur:expediteurs(nom_complet),
        destinataire:destinataires(nom_complet, ville_recuperation)
      `)
      .order('date_enregistrement', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur lors de la récupération des colis récents:', error);
    return { success: false, data: [] };
  }
};
