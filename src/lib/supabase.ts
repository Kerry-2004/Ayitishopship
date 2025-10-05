import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          nom_complet: string;
          email: string;
          mot_de_passe: string;
          telephone: string;
          role: 'admin' | 'agent' | 'scanner';
          bureau_localisation: string;
          actif: boolean;
          date_creation: string;
          derniere_connexion: string | null;
        };
        Insert: Omit<Database['public']['Tables']['agents']['Row'], 'id' | 'date_creation'>;
        Update: Partial<Database['public']['Tables']['agents']['Insert']>;
      };
      expediteurs: {
        Row: {
          id: string;
          nom_complet: string;
          telephone: string;
          email: string;
          adresse_complete: string;
          ville: string;
          etat: string;
          code_postal: string;
          date_creation: string;
        };
        Insert: Omit<Database['public']['Tables']['expediteurs']['Row'], 'id' | 'date_creation'>;
        Update: Partial<Database['public']['Tables']['expediteurs']['Insert']>;
      };
      destinataires: {
        Row: {
          id: string;
          nom_complet: string;
          telephone: string;
          email: string | null;
          ville_recuperation: string;
          adresse_complete: string;
          date_creation: string;
        };
        Insert: Omit<Database['public']['Tables']['destinataires']['Row'], 'id' | 'date_creation'>;
        Update: Partial<Database['public']['Tables']['destinataires']['Insert']>;
      };
      colis: {
        Row: {
          id: string;
          numero_suivi: string;
          qr_code: string;
          expediteur_id: string;
          destinataire_id: string;
          agent_enregistrement_id: string | null;
          type_colis: string;
          poids_lbs: number;
          longueur_cm: number | null;
          largeur_cm: number | null;
          hauteur_cm: number | null;
          description_detaillee: string;
          quantite_articles: number;
          instructions_speciales: string | null;
          statut: 'en_attente' | 'en_transit' | 'arrive_bureau' | 'pret_recuperation' | 'recupere';
          date_enregistrement: string;
          date_prevue_arrivee: string | null;
          cout_expedition: number | null;
        };
        Insert: Omit<Database['public']['Tables']['colis']['Row'], 'id' | 'date_enregistrement'>;
        Update: Partial<Database['public']['Tables']['colis']['Insert']>;
      };
      suivi_historique: {
        Row: {
          id: string;
          colis_id: string;
          agent_id: string | null;
          statut_precedent: string | null;
          nouveau_statut: string;
          localisation: string;
          commentaire: string;
          date_scan: string;
        };
        Insert: Omit<Database['public']['Tables']['suivi_historique']['Row'], 'id' | 'date_scan'>;
        Update: Partial<Database['public']['Tables']['suivi_historique']['Insert']>;
      };
      colis_photos: {
        Row: {
          id: string;
          colis_id: string;
          nom_fichier: string;
          chemin_fichier: string;
          taille_fichier: number;
          date_upload: string;
        };
        Insert: Omit<Database['public']['Tables']['colis_photos']['Row'], 'id' | 'date_upload'>;
        Update: Partial<Database['public']['Tables']['colis_photos']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          colis_id: string;
          destinataire_telephone: string;
          destinataire_email: string | null;
          type_notification: 'enregistrement' | 'transit' | 'arrive' | 'pret_recuperation';
          titre: string;
          message: string;
          envoyee: boolean;
          date_creation: string;
          date_envoi: string | null;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'date_creation'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
};
