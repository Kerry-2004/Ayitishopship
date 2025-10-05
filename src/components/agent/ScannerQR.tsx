import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { mettreAJourStatut } from '../../services/colisService';

interface Props {
  agentId: string;
  onSuccess: () => void;
}

export const ScannerQR: React.FC<Props> = ({ agentId, onSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [numeroSuivi, setNumeroSuivi] = useState('');
  const [nouveauStatut, setNouveauStatut] = useState('en_transit');
  const [localisation, setLocalisation] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'qr-scanner';

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setCameraPermission(null);
      setError('');

      const scanner = new Html5Qrcode(scannerDivId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          setNumeroSuivi(decodedText);
          stopScanner();
        },
        () => {}
      );

      setScanning(true);
      setCameraPermission(true);
    } catch (err) {
      console.error('Erreur lors du démarrage du scanner:', err);
      setCameraPermission(false);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error('Erreur lors de l\'arrêt du scanner:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await mettreAJourStatut(
        numeroSuivi.trim(),
        nouveauStatut,
        agentId,
        commentaire,
        localisation
      );

      if (result.success) {
        setSuccess(true);
        setNumeroSuivi('');
        setCommentaire('');
        setLocalisation('');
        onSuccess();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Scanner et mettre à jour le statut</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-800">Statut mis à jour avec succès!</h3>
                <p className="text-sm text-green-700 mt-1">Le colis a été mis à jour en temps réel.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanner le code QR</h3>

              {!scanning && (
                <button
                  onClick={startScanner}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Activer la caméra</span>
                </button>
              )}

              <div id={scannerDivId} className="mt-4 rounded-lg overflow-hidden"></div>

              {scanning && (
                <button
                  onClick={stopScanner}
                  className="w-full mt-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Arrêter le scanner
                </button>
              )}

              {cameraPermission === false && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Permission refusée:</strong> Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de suivi *
                </label>
                <input
                  type="text"
                  required
                  value={numeroSuivi}
                  onChange={(e) => setNumeroSuivi(e.target.value)}
                  placeholder="AYITI-250105-1234 ou scanner QR"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau statut *
                </label>
                <select
                  required
                  value={nouveauStatut}
                  onChange={(e) => setNouveauStatut(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_transit">En transit</option>
                  <option value="arrive_bureau">Arrivé au bureau</option>
                  <option value="pret_recuperation">Prêt à récupérer</option>
                  <option value="recupere">Récupéré</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="Ex: Miami - Port de départ"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire
                </label>
                <textarea
                  rows={3}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Ajoutez un commentaire..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !numeroSuivi.trim()}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour le statut'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Conseils</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Scannez le code QR ou saisissez le numéro manuellement</li>
                <li>• Sélectionnez le nouveau statut approprié</li>
                <li>• Ajoutez une localisation pour un meilleur suivi</li>
                <li>• Les mises à jour sont enregistrées en temps réel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
