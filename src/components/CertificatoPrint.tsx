import { Certificato, Cliente, Impianto, Tecnico } from '../types';

interface CertificatoPrintProps {
  certificato: Certificato;
  cliente?: Cliente;
  impianto?: Impianto;
  tecnico: Tecnico | null;
  onBack: () => void;
}

export default function CertificatoPrint({ certificato, cliente, impianto, tecnico, onBack }: CertificatoPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'DiCo': 'DICHIARAZIONE DI CONFORMITÀ',
      'DiRi': 'DICHIARAZIONE DI RISPONDENZA',
      'Verifica': 'VERIFICA IMPIANTO',
      'Manutenzione': 'CERTIFICATO DI MANUTENZIONE',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      {/* Controls - hidden in print */}
      <div className="flex items-center justify-between print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
          <i className="fas fa-arrow-left"></i>
          <span>Torna ai certificati</span>
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition shadow-lg shadow-blue-200">
          <i className="fas fa-print"></i>
          <span>Stampa Certificato</span>
        </button>
      </div>

      {/* Certificato Document */}
      <div id="certificato-print" className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 max-w-4xl mx-auto print:shadow-none print:border-none print:p-4">
        {/* Header */}
        <div className="border-b-4 border-blue-800 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              {tecnico && (
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-gray-800">{tecnico.nome} {tecnico.cognome}</h2>
                  <p className="text-sm text-gray-600">{tecnico.partitaIva && `P.IVA: ${tecnico.partitaIva}`}</p>
                  <p className="text-sm text-gray-600">{tecnico.indirizzo}, {tecnico.citta} ({tecnico.provincia})</p>
                  <p className="text-sm text-gray-600">Tel: {tecnico.telefono} | Email: {tecnico.email}</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="bg-blue-800 text-white px-4 py-2 rounded-lg">
                <p className="font-bold text-lg">{certificato.numero}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-blue-800">{getTipoLabel(certificato.tipo)}</h1>
            <p className="text-sm text-gray-600 mt-1">ai sensi del D.M. 22 gennaio 2008, n. 37</p>
          </div>
        </div>

        {/* Committente */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fas fa-user text-blue-600"></i> COMMITTENTE
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {cliente && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Nome:</span> <span className="font-medium">{cliente.nome} {cliente.cognome}</span></div>
                {cliente.ragioneSociale && <div><span className="text-gray-500">Ragione Sociale:</span> <span className="font-medium">{cliente.ragioneSociale}</span></div>}
                <div><span className="text-gray-500">Cod. Fiscale:</span> <span className="font-medium">{cliente.codiceFiscale}</span></div>
                {cliente.partitaIva && <div><span className="text-gray-500">P. IVA:</span> <span className="font-medium">{cliente.partitaIva}</span></div>}
                <div className="col-span-2"><span className="text-gray-500">Residenza/Sede:</span> <span className="font-medium">{cliente.indirizzo}, {cliente.citta} ({cliente.provincia}) {cliente.cap}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Impianto */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fas fa-building text-green-600"></i> IMPIANTO
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {impianto && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Tipologia:</span> <span className="font-medium">{impianto.tipologia}</span></div>
                <div><span className="text-gray-500">Destinazione d'uso:</span> <span className="font-medium">{impianto.destinazioneUso}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Ubicazione:</span> <span className="font-medium">{impianto.indirizzo}, {impianto.citta} ({impianto.provincia}) {impianto.cap}</span></div>
                {impianto.potenza && <div><span className="text-gray-500">Potenza:</span> <span className="font-medium">{impianto.potenza} kW</span></div>}
                {impianto.tensione && <div><span className="text-gray-500">Tensione:</span> <span className="font-medium">{impianto.tensione} V</span></div>}
                {impianto.puntiUtilizzazione && <div><span className="text-gray-500">Punti utilizzazione:</span> <span className="font-medium">{impianto.puntiUtilizzazione}</span></div>}
              </div>
            )}
          </div>
        </div>

        {/* Descrizione */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fas fa-clipboard-list text-purple-600"></i> DESCRIZIONE DEL LAVORO ESEGUITO
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{certificato.descrizioneLavoro}</p>
          </div>
        </div>

        {/* Materiali */}
        {certificato.materialiUtilizzati.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <i className="fas fa-boxes text-orange-600"></i> MATERIALI UTILIZZATI
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {certificato.materialiUtilizzati.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Verifiche */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fas fa-check-circle text-teal-600"></i> VERIFICHE EFFETTUATE
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{certificato.verificheEffettuate}</p>
          </div>
        </div>

        {/* Norme */}
        {certificato.conformitaNorme.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <i className="fas fa-gavel text-indigo-600"></i> NORME DI RIFERIMENTO
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {certificato.conformitaNorme.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Dichiarazione */}
        <div className="mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              Il sottoscritto <strong>{certificato.tecnicoResponsabile}</strong>, abilitato ai sensi dell'art. 3 del D.M. 37/2008 
              con {certificato.abilitazioneTecnico}, installatore dell'impresa sopra indicata, <strong>DICHIARA</strong> sotto la propria 
              responsabilità che la dichiarazione è conforme alle disposizioni vigenti e che l'impianto è stato realizzato 
              in conformità alla regola dell'arte.
            </p>
          </div>
        </div>

        {/* Firma e Data */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Data di rilascio</p>
              <p className="font-bold text-gray-800">{new Date(certificato.dataRilascio).toLocaleDateString('it-IT')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Il Tecnico Responsabile</p>
              <div className="mt-8 border-b border-gray-400 pb-1">
                <p className="text-center text-sm text-gray-600 italic">{certificato.firmaTecnico}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>Dichiarazione resa ai sensi del D.P.R. 28 dicembre 2000, n. 445 e s.m.i.</p>
          <p className="mt-1">Documento generato da Gestione Certificazioni - Legge 37/2008</p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificato-print, #certificato-print * { visibility: visible; }
          #certificato-print { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
