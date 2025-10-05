import React from 'react';
import { StatistiquesGenerales } from '../../services/statistiquesService';

interface Props {
  statistiques: StatistiquesGenerales;
  colisRecents: any[];
  onRefresh: () => void;
}

export const StatistiquesDashboard: React.FC<Props> = ({ statistiques, colisRecents, onRefresh }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Colis</p>
              <p className="text-3xl font-bold text-gray-900">{statistiques.totalColis}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{statistiques.totalClients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En Transit</p>
              <p className="text-3xl font-bold text-gray-900">{statistiques.colisParStatut.en_transit}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
          <div className="space-y-3">
            {Object.entries(statistiques.colisParStatut).map(([statut, count]) => (
              <div key={statut} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    statut === 'en_attente' ? 'bg-yellow-500' :
                    statut === 'en_transit' ? 'bg-blue-500' :
                    statut === 'arrive_bureau' ? 'bg-purple-500' :
                    statut === 'pret_recuperation' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{getStatutLabel(statut)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        statut === 'en_attente' ? 'bg-yellow-500' :
                        statut === 'en_transit' ? 'bg-blue-500' :
                        statut === 'arrive_bureau' ? 'bg-purple-500' :
                        statut === 'pret_recuperation' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}
                      style={{
                        width: `${statistiques.totalColis > 0 ? (count / statistiques.totalColis) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {statistiques.totalColis > 0 ? Math.round((count / statistiques.totalColis) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Colis récents</h3>
          {colisRecents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Aucun colis enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {colisRecents.map((colis) => (
                <div key={colis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{colis.numero_suivi}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {colis.expediteur?.nom_complet} → {colis.destinataire?.nom_complet}
                    </p>
                    <p className="text-xs text-gray-400">{colis.destinataire?.ville_recuperation}</p>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatutColor(colis.statut)}`}>
                    {getStatutLabel(colis.statut)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
