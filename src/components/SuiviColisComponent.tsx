import React, { useState } from 'react';
import { obtenirColis } from '../services/colisService';

interface ColisInfo {
  numero_suivi: string;
  statut: string;
  type_colis: string;
  poids_lbs: number;
  description_detaillee: string;
  date_enregistrement: string;
  date_prevue_arrivee: string | null;
  cout_expedition: number | null;
  expediteur: {
    nom_complet: string;
  };
  destinataire: {
    nom_complet: string;
    ville_recuperation: string;
  };
  historique: Array<{
    nouveau_statut: string;
    localisation: string;
    commentaire: string;
    date_scan: string;
  }>;
}

export const SuiviColisComponent: React.FC = () => {
  const [numeroSuivi, setNumeroSuivi] = useState('');
  const [colis, setColis] = useState<ColisInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const rechercherColis = async () => {
    if (!numeroSuivi.trim()) {
      setError('Veuillez entrer un numéro de suivi');
      return;
    }

    setLoading(true);
    setError('');
    setColis(null);

    try {
      const resultat = await obtenirColis(numeroSuivi.trim());

      if (resultat.success && resultat.data) {
        setColis(resultat.data as ColisInfo);
      } else {
        setError(resultat.error || 'Colis non trouvé');
      }
    } catch (err) {
      setError('Erreur lors de la recherche du colis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatutLabel = (statut: string): string => {
    const labels: Record<string, string> = {
      'en_attente': 'En attente d\'expédition',
      'en_transit': 'En transit',
      'arrive_bureau': 'Arrivé au bureau',
      'pret_recuperation': 'Prêt à récupérer',
      'recupere': 'Récupéré'
    };
    return labels[statut] || statut;
  };

  const getStatutColor = (statut: string): string => {
    const colors: Record<string, string> = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'en_transit': 'bg-blue-100 text-blue-800',
      'arrive_bureau': 'bg-purple-100 text-purple-800',
      'pret_recuperation': 'bg-green-100 text-green-800',
      'recupere': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Suivre votre colis
        </h2>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={numeroSuivi}
            onChange={(e) => setNumeroSuivi(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && rechercherColis()}
            placeholder="Entrez votre numéro de suivi (ex: AYITI-250105-1234)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={rechercherColis}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {colis && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {colis.numero_suivi}
                  </h3>
                  <p className="text-gray-600">{colis.type_colis}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatutColor(colis.statut)}`}>
                  {getStatutLabel(colis.statut)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Expéditeur</p>
                  <p className="font-semibold">{colis.expediteur.nom_complet}</p>
                </div>
                <div>
                  <p className="text-gray-600">Destinataire</p>
                  <p className="font-semibold">{colis.destinataire.nom_complet}</p>
                  <p className="text-gray-500">{colis.destinataire.ville_recuperation}</p>
                </div>
                <div>
                  <p className="text-gray-600">Poids</p>
                  <p className="font-semibold">{colis.poids_lbs} lbs</p>
                </div>
                {colis.cout_expedition && (
                  <div>
                    <p className="text-gray-600">Coût d'expédition</p>
                    <p className="font-semibold">${colis.cout_expedition.toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Date d'enregistrement</p>
                  <p className="font-semibold">
                    {new Date(colis.date_enregistrement).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {colis.date_prevue_arrivee && (
                  <div>
                    <p className="text-gray-600">Date prévue d'arrivée</p>
                    <p className="font-semibold">
                      {new Date(colis.date_prevue_arrivee).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-gray-600 text-sm">Description</p>
                <p className="text-gray-800">{colis.description_detaillee}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Historique de suivi
              </h4>
              <div className="space-y-4">
                {colis.historique.map((etape, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${index === colis.historique.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      {index < colis.historique.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800">
                          {getStatutLabel(etape.nouveau_statut)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(etape.date_scan).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      {etape.localisation && (
                        <p className="text-sm text-gray-600">{etape.localisation}</p>
                      )}
                      {etape.commentaire && (
                        <p className="text-sm text-gray-500 mt-1">{etape.commentaire}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
