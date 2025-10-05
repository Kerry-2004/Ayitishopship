import React, { useState } from 'react';
import { enregistrerColis, EnregistrementColisData } from '../services/colisService';

export const EnregistrementColisComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resultat, setResultat] = useState<any>(null);

  const [formData, setFormData] = useState<EnregistrementColisData>({
    expediteur: {
      nom_complet: '',
      telephone: '',
      email: '',
      adresse_complete: '',
      ville: '',
      etat: '',
      code_postal: ''
    },
    destinataire: {
      nom_complet: '',
      telephone: '',
      email: '',
      ville_recuperation: '',
      adresse_complete: ''
    },
    colis: {
      type_colis: 'Colis standard',
      poids_lbs: 0,
      description_detaillee: '',
      quantite_articles: 1,
      instructions_speciales: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await enregistrerColis(formData);

      if (result.success) {
        setSuccess(true);
        setResultat(result);
        setFormData({
          expediteur: {
            nom_complet: '',
            telephone: '',
            email: '',
            adresse_complete: '',
            ville: '',
            etat: '',
            code_postal: ''
          },
          destinataire: {
            nom_complet: '',
            telephone: '',
            email: '',
            ville_recuperation: '',
            adresse_complete: ''
          },
          colis: {
            type_colis: 'Colis standard',
            poids_lbs: 0,
            description_detaillee: '',
            quantite_articles: 1,
            instructions_speciales: ''
          }
        });
      } else {
        setError(result.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du colis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const villesHaiti = [
    'Port-au-Prince',
    'Cap-Haïtien',
    'Les Cayes',
    'Gonaïves',
    'Saint-Marc',
    'Jacmel'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Enregistrer un nouveau colis
        </h2>

        {success && resultat && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Colis enregistré avec succès!
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Numéro de suivi:</span> {resultat.numero_suivi}</p>
              <p><span className="font-semibold">Coût d'expédition:</span> ${resultat.cout_expedition?.toFixed(2)}</p>
              <p><span className="font-semibold">Date prévue d'arrivée:</span> {new Date(resultat.date_prevue_arrivee).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Informations de l'expéditeur (USA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expediteur.nom_complet}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, nom_complet: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.expediteur.telephone}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, telephone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.expediteur.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expediteur.ville}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, ville: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  État *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expediteur.etat}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, etat: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  value={formData.expediteur.code_postal}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, code_postal: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expediteur.adresse_complete}
                  onChange={(e) => setFormData({
                    ...formData,
                    expediteur: { ...formData.expediteur, adresse_complete: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Informations du destinataire (Haïti)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.destinataire.nom_complet}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinataire: { ...formData.destinataire, nom_complet: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.destinataire.telephone}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinataire: { ...formData.destinataire, telephone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.destinataire.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinataire: { ...formData.destinataire, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville de récupération *
                </label>
                <select
                  required
                  value={formData.destinataire.ville_recuperation}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinataire: { ...formData.destinataire, ville_recuperation: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une ville</option>
                  {villesHaiti.map(ville => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  required
                  value={formData.destinataire.adresse_complete}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinataire: { ...formData.destinataire, adresse_complete: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Informations du colis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de colis *
                </label>
                <select
                  required
                  value={formData.colis.type_colis}
                  onChange={(e) => setFormData({
                    ...formData,
                    colis: { ...formData.colis, type_colis: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Colis standard">Colis standard</option>
                  <option value="Colis fragile">Colis fragile</option>
                  <option value="Document">Document</option>
                  <option value="Vêtements">Vêtements</option>
                  <option value="Électronique">Électronique</option>
                  <option value="Nourriture">Nourriture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids (lbs) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.colis.poids_lbs || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    colis: { ...formData.colis, poids_lbs: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité d'articles *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.colis.quantite_articles}
                  onChange={(e) => setFormData({
                    ...formData,
                    colis: { ...formData.colis, quantite_articles: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.colis.description_detaillee}
                  onChange={(e) => setFormData({
                    ...formData,
                    colis: { ...formData.colis, description_detaillee: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions spéciales
                </label>
                <textarea
                  rows={2}
                  value={formData.colis.instructions_speciales}
                  onChange={(e) => setFormData({
                    ...formData,
                    colis: { ...formData.colis, instructions_speciales: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le colis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
