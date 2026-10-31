import { SchedaTecnica, CONFIG_SCHEDE } from '../schedeTecniche';
import { Cliente, Impianto, Tecnico } from '../types';

interface StampaMultiplaSchedeProps {
  schede: SchedaTecnica[];
  cliente?: Cliente;
  impianto?: Impianto;
  tecnico: Tecnico | null;
  onClose: () => void;
}

export default function StampaMultiplaSchede({ schede, cliente, impianto, tecnico, onClose }: StampaMultiplaSchedeProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls - hidden in print */}
      <div className="flex items-center justify-between print:hidden">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
          <i className="fas fa-arrow-left"></i>
          <span>Torna indietro</span>
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition shadow-lg shadow-blue-200">
          <i className="fas fa-print"></i>
          <span>Stampa Tutte le Schede ({schede.length})</span>
        </button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
        <p className="text-blue-800 text-sm">
          <i className="fas fa-info-circle mr-2"></i>
          Verranno stampate {schede.length} schede tecniche come allegati della certificazione.
        </p>
      </div>

      {/* Schede da stampare */}
      <div id="schede-print-container" className="space-y-8">
        {schede.map((scheda, index) => {
          const config = CONFIG_SCHEDE[scheda.tipo];
          return (
            <div key={scheda.id} className="scheda-print-page bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 print:shadow-none print:border-none print:p-4 page-break">
              {/* Header */}
              <div className="border-b-4 border-indigo-800 pb-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    {tecnico && (
                      <div className="mb-3">
                        <h2 className="text-lg font-bold text-gray-800">{tecnico.nome} {tecnico.cognome}</h2>
                        <p className="text-sm text-gray-600">{tecnico.partitaIva && `P.IVA: ${tecnico.partitaIva}`}</p>
                        <p className="text-sm text-gray-600">{tecnico.indirizzo}, {tecnico.citta} ({tecnico.provincia})</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="bg-indigo-800 text-white px-4 py-2 rounded-lg">
                      <p className="font-bold text-lg">{scheda.numero}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h1 className="text-2xl font-bold text-indigo-800">{config.label}</h1>
                  <p className="text-sm text-gray-600 mt-1">{config.norma}</p>
                  <p className="text-xs text-gray-500 mt-1">Allegato n. {index + 1} di {schede.length}</p>
                </div>
              </div>

              {/* Committente */}
              {cliente && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <i className="fas fa-user text-blue-600"></i> COMMITTENTE
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Nome:</span> <span className="font-medium">{cliente.nome} {cliente.cognome}</span></div>
                      {cliente.ragioneSociale && <div><span className="text-gray-500">Ragione Sociale:</span> <span className="font-medium">{cliente.ragioneSociale}</span></div>}
                      <div><span className="text-gray-500">Cod. Fiscale:</span> <span className="font-medium">{cliente.codiceFiscale}</span></div>
                      {cliente.partitaIva && <div><span className="text-gray-500">P. IVA:</span> <span className="font-medium">{cliente.partitaIva}</span></div>}
                      <div className="col-span-2"><span className="text-gray-500">Residenza/Sede:</span> <span className="font-medium">{cliente.indirizzo}, {cliente.citta} ({cliente.provincia}) {cliente.cap}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Impianto */}
              {impianto && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <i className="fas fa-building text-green-600"></i> IMPIANTO
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Tipologia:</span> <span className="font-medium">{impianto.tipologia}</span></div>
                      <div><span className="text-gray-500">Destinazione d'uso:</span> <span className="font-medium">{impianto.destinazioneUso}</span></div>
                      <div className="col-span-2"><span className="text-gray-500">Ubicazione:</span> <span className="font-medium">{impianto.indirizzo}, {impianto.citta} ({impianto.provincia}) {impianto.cap}</span></div>
                      {impianto.caratteristiche && <div className="col-span-2"><span className="text-gray-500">Caratteristiche:</span> <span className="font-medium">{impianto.caratteristiche}</span></div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Dati Specifici */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <i className={`fas ${config.icon} text-${config.color}-600`}></i> DATI SPECIFICI
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {Object.keys(scheda.dati).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(scheda.dati).map(([key, value]) => {
                        if (value === '' || value === null || value === undefined) return null;
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                        return (
                          <div key={key} className={typeof value === 'string' && value.length > 50 ? 'col-span-2' : ''}>
                            <span className="text-gray-500">{label}:</span>
                            <div className="font-medium mt-0.5">
                              {typeof value === 'boolean' ? (value ? '✓ Sì' : '✗ No') : 
                               Array.isArray(value) ? value.join(', ') : 
                               String(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Nessun dato specifico compilato</p>
                  )}
                </div>
              </div>

              {/* Note */}
              {scheda.note && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <i className="fas fa-sticky-note text-yellow-600"></i> NOTE
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{scheda.note}</p>
                  </div>
                </div>
              )}

              {/* Firma */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Data di compilazione</p>
                    <p className="font-bold text-gray-800">{new Date(scheda.dataCompilazione).toLocaleDateString('it-IT')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Il Tecnico Responsabile</p>
                    <div className="mt-8 border-b border-gray-400 pb-1">
                      <p className="text-center text-sm text-gray-600 italic">
                        {scheda.dati.tecnico || tecnico ? `${tecnico?.nome} ${tecnico?.cognome}` : '___________________'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Allegato n. {index + 1} di {schede.length} - {config.label}</p>
                <p className="mt-1">{config.norma}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #schede-print-container, #schede-print-container * { visibility: visible; }
          #schede-print-container { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
          .page-break { page-break-after: always; }
          .page-break:last-child { page-break-after: auto; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}
