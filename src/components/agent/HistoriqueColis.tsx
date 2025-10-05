import React, { useState, useEffect } from 'react';
import { obtenirTousColis } from '../../services/colisService';

export const HistoriqueColis: React.FC = () => {
  const [colis, setColis] = useState<any[]>([]);
  const [colisFiltre, setColisFiltre] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  useEffect(() => {
    chargerColis();
  }, []);

  useEffect(() => {
    filtrerColis();
  }, [recherche, filtreStatut, colis]);

  const chargerColis = async () => {
    setLoading(true);
    const result = await obtenirTousColis();
    if (result.success) {
      setColis(result.data);
      setColisFiltre(result.data);
    }
    setLoading(false);
  };

  const filtrerColis = () => {
    let filtered = [...colis];

    if (recherche.trim()) {
      const searchLower = recherche.toLowerCase();
      filtered = filtered.filter(c =>
        c.numero_suivi.toLowerCase().includes(searchLower) ||
        c.expediteur?.nom_complet?.toLowerCase().includes(searchLower) ||
        c.destinataire?.nom_complet?.toLowerCase().includes(searchLower) ||
        c.destinataire?.ville_recuperation?.toLowerCase().includes(searchLower)
      );
    }

    if (filtreStatut !== 'tous') {
      filtered = filtered.filter(c => c.statut === filtreStatut);
    }

    setColisFiltre(filtered);
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'en_transit': 'bg-blue-100 text-blue-800',
      'arrive_bureau': 'bg-purple-100 text-purple-800',
      'pret_recuperation': 'bg-green-100 text-green-800',
      'recupere': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      'en_attente': 'En attente',
      'en_transit': 'En transit',
      'arrive_bureau': 'Arrivé',
      'pret_recuperation': 'Prêt',
      'recupere': 'Récupéré'
    };
    return labels[statut] || statut;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historique des colis</h2>
            <p className="text-sm text-gray-600 mt-1">
              {colisFiltre.length} colis {colisFiltre.length !== colis.length && `sur ${colis.length}`}
            </p>
          </div>
          <button
            onClick={chargerColis}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualiser</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Numéro, nom, ville..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par statut
            </label>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_transit">En transit</option>
              <option value="arrive_bureau">Arrivé au bureau</option>
              <option value="pret_recuperation">Prêt à récupérer</option>
              <option value="recupere">Récupéré</option>
            </select>
          </div>
        </div>

        {colisFiltre.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">Aucun colis trouvé</p>
            <p className="text-gray-500 text-sm">
              {recherche || filtreStatut !== 'tous'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par enregistrer un colis'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Numéro de suivi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expéditeur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Destinataire
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Poids
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colisFiltre.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {c.numero_suivi}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {c.expediteur?.nom_complet || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {c.destinataire?.nom_complet || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {c.destinataire?.ville_recuperation || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {c.poids_lbs} lbs
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatutColor(c.statut)}`}>
                        {getStatutLabel(c.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(c.date_enregistrement).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
