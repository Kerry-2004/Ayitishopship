import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface AgentProfile {
  id: string;
  nom_complet: string;
  email: string;
  telephone: string;
  role: 'admin' | 'agent' | 'scanner';
  bureau_localisation: string;
  actif: boolean;
}

export const connexionAgent = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      await supabase
        .from('agents')
        .update({ derniere_connexion: new Date().toISOString() })
        .eq('email', email);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion'
    };
  }
};

export const deconnexionAgent = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de déconnexion'
    };
  }
};

export const obtenirSessionActuelle = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const obtenirUtilisateurActuel = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const obtenirProfilAgent = async (email: string): Promise<AgentProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('id, nom_complet, email, telephone, role, bureau_localisation, actif')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};

export const creerCompteAgent = async (
  email: string,
  password: string,
  nom_complet: string,
  telephone: string,
  role: 'admin' | 'agent' | 'scanner' = 'agent',
  bureau_localisation: string = ''
) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    if (authData.user) {
      const passwordHash = await hashPassword(password);

      const { error: insertError } = await supabase
        .from('agents')
        .insert({
          id: authData.user.id,
          nom_complet,
          email,
          mot_de_passe: passwordHash,
          telephone,
          role,
          bureau_localisation,
          actif: true
        });

      if (insertError) throw insertError;
    }

    return { success: true, data: authData };
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la création du compte'
    };
  }
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const surveillerAuthState = (callback: (session: Session | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return subscription;
};
