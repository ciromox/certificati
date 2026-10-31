import { SchedaTecnica, CONFIG_SCHEDE } from '../schedeTecniche';
import { Cliente, Impianto } from '../types';

interface SchedaPrintProps {
  scheda: SchedaTecnica;
  cliente?: Cliente;
  impianto?: Impianto;
  onBack: () => void;
}

export default function SchedaPrint({ scheda, cliente, impianto, onBack }: SchedaPrintProps) {
  const config = CONFIG_SCHEDE[scheda.tipo];

  const handlePrint = () => window.print();

  const renderDatiSpecifici = () => {
    const dati = scheda.dati;
    const entries = Object.entries(dati).filter(([k, v]) => v !== '' && v !== null && v !== undefined);
    
    if (entries.length === 0) return <p className="text-gray-500 italic">Nessun dato specifico compilato</p>;
    
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className={typeof value === 'string' && value.length > 50 ? 'col-span-2' : ''}>
            <span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</span>
            <div className="font-medium mt-0.5">
              {typeof value === 'boolean' ? (value ? '✓ Sì' : '✗ No') : String(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <i className="fas fa-arrow-left"></i>
          <span>Torna alle schede</span>
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg shadow-blue-200">
          <i className="fas fa-print"></i>
          <span>Stampa Scheda</span>
        </button>
      </div>

      <div id="scheda-print" className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 max-w-4xl mx-auto print:shadow-none print:border-none">
        {/* Header */}
        <div className="border-b-4 border-indigo-800 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-indigo-800">{config.label}</h1>
              <p className="text-sm text-gray-600 mt-1">{config.norma}</p>
              <p className="text-xs text-gray-500 mt-1">{config.descrizione}</p>
            </div>
            <div className="text-right">
              <div className="bg-indigo-800 text-white px-4 py-2 rounded-lg">
                <p className="font-bold text-lg">{scheda.numero}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dati Generali */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">DATI GENERALI</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Numero:</span> <span className="font-medium">{scheda.numero}</span></div>
            <div><span className="text-gray-500">Data Compilazione:</span> <span className="font-medium">{new Date(scheda.dataCompilazione).toLocaleDateString('it-IT')}</span></div>
            {scheda.dataValidita && <div><span className="text-gray-500">Data Validità:</span> <span className="font-medium">{new Date(scheda.dataValidita).toLocaleDateString('it-IT')}</span></div>}
            <div><span className="text-gray-500">Stato:</span> <span className="font-medium">{scheda.stato.charAt(0).toUpperCase() + scheda.stato.slice(1)}</span></div>
          </div>
        </div>

        {/* Cliente */}
        {cliente && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">COMMITTENTE</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Nome:</span> <span className="font-medium">{cliente.nome} {cliente.cognome}</span></div>
                {cliente.ragioneSociale && <div><span className="text-gray-500">Ragione Sociale:</span> <span className="font-medium">{cliente.ragioneSociale}</span></div>}
                <div><span className="text-gray-500">Cod. Fiscale:</span> <span className="font-medium">{cliente.codiceFiscale}</span></div>
                {cliente.partitaIva && <div><span className="text-gray-500">P. IVA:</span> <span className="font-medium">{cliente.partitaIva}</span></div>}
                <div className="col-span-2"><span className="text-gray-500">Indirizzo:</span> <span className="font-medium">{cliente.indirizzo}, {cliente.citta} ({cliente.provincia}) {cliente.cap}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Impianto */}
        {impianto && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">IMPIANTO</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Tipologia:</span> <span className="font-medium">{impianto.tipologia}</span></div>
                <div><span className="text-gray-500">Destinazione:</span> <span className="font-medium">{impianto.destinazioneUso}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Ubicazione:</span> <span className="font-medium">{impianto.indirizzo}, {impianto.citta} ({impianto.provincia})</span></div>
                {impianto.caratteristiche && <div className="col-span-2"><span className="text-gray-500">Caratteristiche:</span> <span className="font-medium">{impianto.caratteristiche}</span></div>}
              </div>
            </div>
          </div>
        )}

        {/* Dati Specifici */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">DATI SPECIFICI</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {renderDatiSpecifici()}
          </div>
        </div>

        {/* Note */}
        {scheda.note && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">NOTE</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{scheda.note}</p>
            </div>
          </div>
        )}

        {/* Firma */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Data</p>
              <p className="font-bold text-gray-800">{new Date(scheda.dataCompilazione).toLocaleDateString('it-IT')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Il Tecnico Responsabile</p>
              <div className="mt-8 border-b border-gray-400 pb-1">
                <p className="text-center text-sm text-gray-600 italic">
                  {scheda.dati.tecnico || '___________________'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>Documento generato da Gestione Certificazioni - Legge 37/2008</p>
          <p className="mt-1">{config.norma}</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #scheda-print, #scheda-print * { visibility: visible; }
          #scheda-print { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
