import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deconnexionAgent, obtenirUtilisateurActuel, obtenirProfilAgent, AgentProfile } from '../services/authService';
import { obtenirStatistiquesGenerales, surveillerChangementsColis, obtenirColisRecents, StatistiquesGenerales } from '../services/statistiquesService';
import { EnregistrementColis } from '../components/agent/EnregistrementColis';
import { ScannerQR } from '../components/agent/ScannerQR';
import { HistoriqueColis } from '../components/agent/HistoriqueColis';
import { StatistiquesDashboard } from '../components/agent/StatistiquesDashboard';

type TabType = 'dashboard' | 'enregistrer' | 'scanner' | 'historique' | 'parametres';


export const AgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [statistiques, setStatistiques] = useState<StatistiquesGenerales | null>(null);
  const [colisRecents, setColisRecents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initialiserDashboard();
  }, []);

  useEffect(() => {
    const channel = surveillerChangementsColis(() => {
      chargerStatistiques();
      chargerColisRecents();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const initialiserDashboard = async () => {
    const user = await obtenirUtilisateurActuel();

    if (!user) {
      navigate('/agent-space');
      return;
    }

    const profil = await obtenirProfilAgent(user.email!);
    if (!profil || !profil.actif) {
      navigate('/agent-space');
      return;
    }

    setAgent(profil);
    await chargerStatistiques();
    await chargerColisRecents();
    setLoading(false);
  };

  const chargerStatistiques = async () => {
    const stats = await obtenirStatistiquesGenerales();
    setStatistiques(stats);
  };

  const chargerColisRecents = async () => {
    const result = await obtenirColisRecents(5);
    if (result.success) {
      setColisRecents(result.data);
    }
  };

  const handleDeconnexion = async () => {
    await deconnexionAgent();
    navigate('/agent-space');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">AyitiShop&Ship</h1>
                <p className="text-xs text-gray-500">Agent Space</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{agent?.nom_complet}</p>
                <p className="text-xs text-gray-500 capitalize">{agent?.role}</p>
                <button onClick={() => setActiveTab('parametres')}>
                  Paramètres
                </button>
              </div>
              <button
                onClick={handleDeconnexion}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Tableau de bord</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('enregistrer')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'enregistrer'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Enregistrer colis</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('scanner')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'scanner'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span>Scanner QR</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('historique')}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'historique'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Historique</span>
                </span>
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'dashboard' && statistiques && (
            <StatistiquesDashboard
              statistiques={statistiques}
              colisRecents={colisRecents}
              onRefresh={() => {
                chargerStatistiques();
                chargerColisRecents();
              }}
            />
          )}

          {activeTab === 'enregistrer' && agent && (
            <EnregistrementColis
              agentId={agent.id}
              onSuccess={() => {
                chargerStatistiques();
                chargerColisRecents();
                setActiveTab('dashboard');
              }}
            />
          )}

          {activeTab === 'scanner' && agent && (
            <ScannerQR
              agentId={agent.id}
              onSuccess={() => {
                chargerStatistiques();
                chargerColisRecents();
              }}
            />
          )}

          {activeTab === 'historique' && (
            <HistoriqueColis />
          )}
        </div>
      </div>
    </div>
  );
};
