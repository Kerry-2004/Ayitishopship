import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Tarifs {
  'Port-au-Prince': number;
  'Cap-Haïtien': number;
  'Les Cayes': number;
}

interface FraisService {
  pourcentage: number;
  montant_fixe: number;
}

interface InfoEntreprise {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  logo_url: string;
}

export const Parametres: React.FC = () => {
  const [tarifs, setTarifs] = useState<Tarifs>({
    'Port-au-Prince': 3.5,
    'Cap-Haïtien': 4.0,
    'Les Cayes': 6.0
  });

  const [fraisService, setFraisService] = useState<FraisService>({
    pourcentage: 0,
    montant_fixe: 0
  });

  const [infoEntreprise, setInfoEntreprise] = useState<InfoEntreprise>({
    nom: 'AyitiShop&Ship',
    adresse: 'Miami, FL, USA',
    telephone: '+1 (508) 246-3522',
    email: 'info@ayitishopship.com',
    logo_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    chargerParametres();
  }, []);

  const chargerParametres = async () => {
    try {
      const { data, error } = await supabase
        .from('parametres_systeme')
        .select('cle, valeur')
        .in('cle', ['tarifs_zones', 'frais_service', 'info_entreprise']);

      if (error) throw error;

      data?.forEach(param => {
        if (param.cle === 'tarifs_zones') {
          setTarifs(param.valeur as Tarifs);
        } else if (param.cle === 'frais_service') {
          setFraisService(param.valeur as FraisService);
        } else if (param.cle === 'info_entreprise') {
          setInfoEntreprise(param.valeur as InfoEntreprise);
        }
      });
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
    }
  };

  const sauvegarderParametres = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates = [
        { cle: 'tarifs_zones', valeur: tarifs },
        { cle: 'frais_service', valeur: fraisService },
        { cle: 'info_entreprise', valeur: infoEntreprise }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('parametres_systeme')
          .update({ valeur: update.valeur, derniere_modification: new Date().toISOString() })
          .eq('cle', update.cle);

        if (error) throw error;
      }

      setSuccess('Paramètres sauvegardés avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des paramètres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-600 mt-1">
            Configuration des tarifs et informations de l'entreprise
          </p>
        </div>

        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Tarifs de livraison par zone ($/lbs)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port-au-Prince
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={tarifs['Port-au-Prince']}
                    onChange={(e) => setTarifs({ ...tarifs, 'Port-au-Prince': parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cap-Haïtien
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={tarifs['Cap-Haïtien']}
                    onChange={(e) => setTarifs({ ...tarifs, 'Cap-Haïtien': parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les Cayes
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={tarifs['Les Cayes']}
                    onChange={(e) => setTarifs({ ...tarifs, 'Les Cayes': parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Frais de service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant fixe ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={fraisService.montant_fixe}
                    onChange={(e) => setFraisService({ ...fraisService, montant_fixe: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Frais fixes ajoutés à chaque envoi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={fraisService.pourcentage}
                    onChange={(e) => setFraisService({ ...fraisService, pourcentage: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Pourcentage ajouté au total</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Informations de l'entreprise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={infoEntreprise.nom}
                  onChange={(e) => setInfoEntreprise({ ...infoEntreprise, nom: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={infoEntreprise.adresse}
                  onChange={(e) => setInfoEntreprise({ ...infoEntreprise, adresse: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={infoEntreprise.telephone}
                  onChange={(e) => setInfoEntreprise({ ...infoEntreprise, telephone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={infoEntreprise.email}
                  onChange={(e) => setInfoEntreprise({ ...infoEntreprise, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du logo
                </label>
                <input
                  type="url"
                  value={infoEntreprise.logo_url}
                  onChange={(e) => setInfoEntreprise({ ...infoEntreprise, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">URL du logo pour les étiquettes et factures</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={sauvegarderParametres}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sauvegarder les paramètres</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
