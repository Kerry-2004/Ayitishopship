import { supabase } from '../lib/supabase';

export const testerConnexionSupabase = async () => {
  try {
    console.log('Test de connexion à Supabase...');

    const { data: tables, error: tablesError } = await supabase
      .from('colis')
      .select('count')
      .limit(0);

    if (tablesError) {
      console.error('Erreur de connexion:', tablesError);
      return false;
    }

    console.log('Connexion réussie à Supabase!');
    return true;

  } catch (error) {
    console.error('Erreur lors du test de connexion:', error);
    return false;
  }
};

export const afficherStatistiques = async () => {
  try {
    const { data: colis, error: colisError } = await supabase
      .from('colis')
      .select('statut');

    if (colisError) throw colisError;

    const stats: Record<string, number> = {};
    colis?.forEach(c => {
      stats[c.statut] = (stats[c.statut] || 0) + 1;
    });

    console.log('Statistiques des colis:');
    console.log('- Total:', colis?.length || 0);
    Object.entries(stats).forEach(([statut, count]) => {
      console.log(`- ${statut}:`, count);
    });

    return stats;

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return null;
  }
};

export const creerColisTest = async () => {
  try {
    console.log('Création d\'un colis de test...');

    const { data: expediteur, error: expediteurError } = await supabase
      .from('expediteurs')
      .insert({
        nom_complet: 'Test Expéditeur',
        telephone: '+1234567890',
        email: 'test@example.com',
        adresse_complete: '123 Test St',
        ville: 'Miami',
        etat: 'FL',
        code_postal: '33101'
      })
      .select('id')
      .single();

    if (expediteurError) throw expediteurError;

    const { data: destinataire, error: destinataireError } = await supabase
      .from('destinataires')
      .insert({
        nom_complet: 'Test Destinataire',
        telephone: '+50912345678',
        email: 'dest@example.com',
        ville_recuperation: 'Port-au-Prince',
        adresse_complete: '45 Rue Test'
      })
      .select('id')
      .single();

    if (destinataireError) throw destinataireError;

    const numeroSuivi = `AYITI-TEST-${Date.now()}`;
    const { data: colis, error: colisError } = await supabase
      .from('colis')
      .insert({
        numero_suivi: numeroSuivi,
        qr_code: `QR-${numeroSuivi}`,
        expediteur_id: expediteur.id,
        destinataire_id: destinataire.id,
        type_colis: 'Test',
        poids_lbs: 10,
        description_detaillee: 'Colis de test',
        quantite_articles: 1,
        statut: 'en_attente',
        cout_expedition: 45.0
      })
      .select()
      .single();

    if (colisError) throw colisError;

    console.log('Colis de test créé avec succès!');
    console.log('Numéro de suivi:', numeroSuivi);

    return { success: true, numeroSuivi };

  } catch (error) {
    console.error('Erreur lors de la création du colis de test:', error);
    return { success: false, error };
  }
};
