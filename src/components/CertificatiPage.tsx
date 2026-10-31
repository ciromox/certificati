import { useState } from 'react';
import { Certificato, Cliente, Impianto } from '../types';
import { SchedaTecnica } from '../schedeTecniche';
import StampaMultiplaSchede from './StampaMultiplaSchede';

interface CertificatiPageProps {
  certificati: Certificato[];
  clienti: Cliente[];
  impianti: Impianto[];
  schede: SchedaTecnica[];
  onAdd: () => void;
  onEdit: (certificato: Certificato) => void;
  onDelete: (id: string) => void;
  onPrint: (certificato: Certificato) => void;
  onWizard?: () => void;
}

export default function CertificatiPage({ certificati, clienti, impianti, schede, onAdd, onEdit, onDelete, onPrint, onWizard }: CertificatiPageProps) {
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterStato, setFilterStato] = useState('');
  const [stampaMultipla, setStampaMultipla] = useState<Certificato | null>(null);

  const getClienteNome = (id: string) => {
    const c = clienti.find(cl => cl.id === id);
    return c ? `${c.nome} ${c.cognome}${c.ragioneSociale ? ` (${c.ragioneSociale})` : ''}` : 'N/D';
  };

  const getImpiantoLabel = (id: string) => {
    const i = impianti.find(im => im.id === id);
    return i ? `${i.tipologia} - ${i.citta}` : 'N/D';
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'DiCo': 'Dichiarazione di Conformità',
      'DiRi': 'Dichiarazione di Rispondenza',
      'Verifica': 'Verifica Impianto',
      'Manutenzione': 'Manutenzione',
    };
    return labels[tipo] || tipo;
  };

  const getTipoBadge = (tipo: string) => {
    const styles: Record<string, string> = {
      'DiCo': 'bg-blue-100 text-blue-800 border-blue-200',
      'DiRi': 'bg-purple-100 text-purple-800 border-purple-200',
      'Verifica': 'bg-orange-100 text-orange-800 border-orange-200',
      'Manutenzione': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return styles[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getStatoBadge = (stato: string) => {
    const styles: Record<string, string> = {
      'bozza': 'bg-yellow-100 text-yellow-800',
      'emesso': 'bg-green-100 text-green-800',
      'archiviato': 'bg-gray-100 text-gray-600',
      'scaduto': 'bg-red-100 text-red-800',
    };
    return styles[stato] || 'bg-gray-100 text-gray-800';
  };

  // Verifica validità certificato
  const checkValidita = (cert: Certificato) => {
    if (!cert.dataValidita) return { valida: true, giorni: null, label: 'Nessuna scadenza' };
    
    const oggi = new Date();
    const scadenza = new Date(cert.dataValidita);
    const diffTime = scadenza.getTime() - oggi.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { valida: false, giorni: diffDays, label: `Scaduto da ${Math.abs(diffDays)} giorni` };
    } else if (diffDays <= 30) {
      return { valida: true, giorni: diffDays, label: `Scade tra ${diffDays} giorni` };
    } else {
      return { valida: true, giorni: diffDays, label: `Valido per ${diffDays} giorni` };
    }
  };

  const filtered = certificati.filter(c => {
    const matchSearch = `${c.numero} ${getClienteNome(c.clienteId)}`.toLowerCase().includes(search.toLowerCase());
    const matchTipo = !filterTipo || c.tipo === filterTipo;
    const matchStato = !filterStato || c.stato === filterStato;
    return matchSearch && matchTipo && matchStato;
  }).sort((a, b) => new Date(b.dataCreazione).getTime() - new Date(a.dataCreazione).getTime());

  // Render stampa multipla schede
  if (stampaMultipla) {
    const schedeCollegate = schede.filter(s => s.impiantoId === stampaMultipla.impiantoId);
    const cliente = clienti.find(c => c.id === stampaMultipla.clienteId);
    const impianto = impianti.find(i => i.id === stampaMultipla.impiantoId);
    
    return (
      <StampaMultiplaSchede
        schede={schedeCollegate}
        cliente={cliente}
        impianto={impianto}
        tecnico={null}
        onClose={() => setStampaMultipla(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Certificati</h1>
          <p className="text-gray-500 mt-1">Gestione dichiarazioni di conformità e rispondenza</p>
        </div>
        <div className="flex gap-2">
          {onWizard && (
            <button onClick={onWizard}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-200">
              <i className="fas fa-magic"></i>
              <span>Wizard DiCo</span>
            </button>
          )}
          <button onClick={onAdd}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-purple-200">
            <i className="fas fa-plus"></i>
            <span>Nuovo Certificato</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input type="text" placeholder="Cerca certificato..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
          <option value="">Tutti i tipi</option>
          <option value="DiCo">DiCo</option>
          <option value="DiRi">DiRi</option>
          <option value="Verifica">Verifica</option>
          <option value="Manutenzione">Manutenzione</option>
        </select>
        <select value={filterStato} onChange={(e) => setFilterStato(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
          <option value="">Tutti gli stati</option>
          <option value="bozza">Bozza</option>
          <option value="emesso">Emesso</option>
          <option value="archiviato">Archiviato</option>
          <option value="scaduto">Scaduto</option>
        </select>
      </div>

      {/* Certificati List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <i className="fas fa-file-certificate text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">Nessun certificato trovato</p>
          <p className="text-gray-400 text-sm mt-1">Crea il primo certificato per iniziare</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(cert => (
            <div key={cert.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    cert.tipo === 'DiCo' ? 'bg-blue-100' : cert.tipo === 'DiRi' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <i className={`fas fa-file-alt text-lg ${
                      cert.tipo === 'DiCo' ? 'text-blue-600' : cert.tipo === 'DiRi' ? 'text-purple-600' : 'text-orange-600'
                    }`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-800">{cert.numero}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTipoBadge(cert.tipo)}`}>
                        {cert.tipo}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatoBadge(cert.stato)}`}>
                        {cert.stato.charAt(0).toUpperCase() + cert.stato.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{getClienteNome(cert.clienteId)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{getImpiantoLabel(cert.impiantoId)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <i className="fas fa-calendar mr-1"></i>
                      Rilasciato: {new Date(cert.dataRilascio).toLocaleDateString('it-IT')}
                    </p>
                    {cert.dataValidita && (() => {
                      const validita = checkValidita(cert);
                      return (
                        <p className={`text-xs mt-0.5 font-medium ${
                          !validita.valida ? 'text-red-600' : 
                          validita.giorni !== null && validita.giorni <= 30 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>
                          <i className={`fas ${!validita.valida ? 'fa-times-circle' : validita.giorni !== null && validita.giorni <= 30 ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-1`}></i>
                          {validita.label}
                        </p>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => onPrint(cert)} title="Stampa Certificato"
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                    <i className="fas fa-print"></i>
                  </button>
                  <button onClick={() => {
                    const schedeCollegate = schede.filter(s => s.impiantoId === cert.impiantoId);
                    if (schedeCollegate.length > 0) {
                      setStampaMultipla(cert);
                    } else {
                      alert('Nessuna scheda tecnica collegata a questo impianto. Crea prima le schede tecniche.');
                    }
                  }} title="Stampa Schede Collegate come Allegati"
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <button onClick={() => onEdit(cert)} title="Modifica"
                    className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => onDelete(cert.id)} title="Elimina"
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
