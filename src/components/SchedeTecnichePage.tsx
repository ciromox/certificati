import { useState } from 'react';
import { SchedaTecnica, TipoSchedaTecnica, CONFIG_SCHEDE } from '../schedeTecniche';
import { SchedaTipo, SCHEDE_DEFINIZIONI } from '../schedeFields';
import { Cliente, Impianto } from '../types';
import SchedaFormDinamico from './SchedaFormDinamico';
import SchedaPrint from './SchedaPrint';

interface SchedeTecnichePageProps {
  schede: SchedaTecnica[];
  clienti: Cliente[];
  impianti: Impianto[];
  onAdd: (scheda: Omit<SchedaTecnica, 'id' | 'dataCreazione' | 'dataModifica'>) => void;
  onUpdate: (scheda: SchedaTecnica) => void;
  onDelete: (id: string) => void;
}

export default function SchedeTecnichePage({ schede = [], clienti = [], impianti = [], onAdd, onUpdate, onDelete }: SchedeTecnichePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SchedaTecnica | null>(null);
  const [printing, setPrinting] = useState<SchedaTecnica | null>(null);
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [filterStato, setFilterStato] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedTipoScheda, setSelectedTipoScheda] = useState<SchedaTipo | null>(null);

  const getClienteNome = (id: string) => {
    const c = clienti.find(cl => cl.id === id);
    return c ? `${c.nome} ${c.cognome}` : 'N/D';
  };

  const getImpiantoLabel = (id: string) => {
    const i = impianti.find(im => im.id === id);
    return i ? `${i.tipologia} - ${i.citta}` : 'N/D';
  };

  const getStatoBadge = (stato: string) => {
    const styles: Record<string, string> = {
      'bozza': 'bg-yellow-100 text-yellow-800',
      'compilata': 'bg-blue-100 text-blue-800',
      'firmata': 'bg-green-100 text-green-800',
      'archiviata': 'bg-gray-100 text-gray-600',
    };
    return styles[stato] || 'bg-gray-100 text-gray-800';
  };

  const filtered = schede.filter(s => {
    const matchSearch = `${s.numero} ${getClienteNome(s.clienteId)}`.toLowerCase().includes(search.toLowerCase());
    const matchTipo = !filterTipo || s.tipo === filterTipo;
    const matchStato = !filterStato || s.stato === filterStato;
    return matchSearch && matchTipo && matchStato;
  }).sort((a, b) => new Date(b.dataModifica).getTime() - new Date(a.dataModifica).getTime());

  const handleSave = (scheda: any) => {
    if (editing) {
      onUpdate({ ...editing, ...scheda, dataModifica: new Date().toISOString() });
    } else {
      onAdd({ ...scheda, dataModifica: new Date().toISOString() });
    }
    setShowForm(false);
    setEditing(null);
  };

  if (printing) {
    return (
      <SchedaPrint
        scheda={printing}
        cliente={clienti.find(c => c.id === printing.clienteId)}
        impianto={impianti.find(i => i.id === printing.impiantoId)}
        onBack={() => setPrinting(null)}
      />
    );
  }

  if (showForm && selectedTipoScheda) {
    return (
      <SchedaFormDinamico
        tipoScheda={selectedTipoScheda}
        datiIniziali={editing?.dati || {}}
        onSave={(dati) => {
          if (editing) {
            onUpdate({ ...editing, dati });
          } else {
            onAdd({
              numero: `${selectedTipoScheda.toUpperCase()}-${Date.now().toString().slice(-6)}`,
              tipo: selectedTipoScheda as any,
              impiantoId: '',
              clienteId: '',
              dataCompilazione: new Date().toISOString().split('T')[0],
              stato: 'compilata',
              tecnicoId: '',
              dati,
            });
          }
          setShowForm(false);
          setEditing(null);
          setSelectedTipoScheda(null);
        }}
        onCancel={() => { setShowForm(false); setEditing(null); setSelectedTipoScheda(null); }}
      />
    );
  }

  // Selezione tipo scheda
  if (showForm && !selectedTipoScheda) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Seleziona Tipo Scheda</h1>
            <p className="text-gray-500 mt-1">Scegli il tipo di scheda tecnica da compilare</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SCHEDE_DEFINIZIONI).map(([tipo, def]) => (
            <button
              key={tipo}
              onClick={() => setSelectedTipoScheda(tipo as SchedaTipo)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-file-alt text-blue-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{def.titolo}</h3>
                  <p className="text-xs text-blue-600 mb-2">{def.norma}</p>
                  <p className="text-sm text-gray-600">{def.descrizione}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    <i className="fas fa-list mr-1"></i>
                    {def.sezioni.length} sezioni • {def.sezioni.reduce((acc, s) => acc + s.campi.length, 0)} campi
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Schede Tecniche</h1>
          <p className="text-gray-500 mt-1">Gestione documentazione tecnica D.M. 37/2008 e successive modifiche</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-indigo-200"
        >
          <i className="fas fa-plus"></i>
          <span>Nuova Scheda</span>
        </button>
      </div>

      {/* Tipi di schede disponibili */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {(Object.keys(CONFIG_SCHEDE) as TipoSchedaTecnica[]).map(tipo => {
          const config = CONFIG_SCHEDE[tipo];
          const count = schede.filter(s => s.tipo === tipo).length;
          return (
            <button
              key={tipo}
              onClick={() => { setFilterTipo(filterTipo === tipo ? '' : tipo); }}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                filterTipo === tipo 
                  ? `border-${config.color}-500 bg-${config.color}-50` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-${config.color}-100 flex items-center justify-center mb-2`}>
                <i className={`${config.icon} text-${config.color}-600 text-sm`}></i>
              </div>
              <p className="font-medium text-xs text-gray-800 leading-tight">{config.label}</p>
              <p className="text-xs text-gray-500 mt-1">{count} schede</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input type="text" placeholder="Cerca scheda..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterStato} onChange={(e) => setFilterStato(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg">
          <option value="">Tutti gli stati</option>
          <option value="bozza">Bozza</option>
          <option value="compilata">Compilata</option>
          <option value="firmata">Firmata</option>
          <option value="archiviata">Archiviata</option>
        </select>
      </div>

      {/* Pannello Verifica Conformità Schede */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
          <i className="fas fa-clipboard-check text-indigo-500"></i>
          Stato Conformità Schede
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-700">{schede.filter(s => s.stato === 'bozza').length}</p>
            <p className="text-xs text-yellow-800">Da completare</p>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{schede.filter(s => s.stato === 'compilata').length}</p>
            <p className="text-xs text-blue-800">Da firmare</p>
          </div>
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{schede.filter(s => s.stato === 'firmata').length}</p>
            <p className="text-xs text-green-800">Conformi</p>
          </div>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-700">{schede.filter(s => s.stato === 'archiviata').length}</p>
            <p className="text-xs text-gray-800">Archiviate</p>
          </div>
        </div>
        
        {/* Avvisi schede incomplete */}
        {schede.filter(s => s.stato === 'bozza').length > 0 && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              <strong>{schede.filter(s => s.stato === 'bozza').length} schede in bozza</strong> richiedono completamento e firma per essere conformi al D.M. 37/08
            </p>
          </div>
        )}
      </div>

      {/* Lista schede */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <i className="fas fa-file-medical text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">Nessuna scheda tecnica</p>
          <p className="text-gray-400 text-sm mt-1">Crea la prima scheda tecnica per iniziare</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(scheda => {
            const config = CONFIG_SCHEDE[scheda.tipo];
            return (
              <div key={scheda.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-${config.color}-100`}>
                      <i className={`${config.icon} text-lg text-${config.color}-600`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-800">{scheda.numero}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatoBadge(scheda.stato)}`}>
                          {scheda.stato ? scheda.stato.charAt(0).toUpperCase() + scheda.stato.slice(1) : 'N/D'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-1">{config.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{config.norma}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        <i className="fas fa-user mr-1"></i> {getClienteNome(scheda.clienteId)} • 
                        <i className="fas fa-building ml-2 mr-1"></i> {getImpiantoLabel(scheda.impiantoId)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        <i className="fas fa-calendar mr-1"></i> {new Date(scheda.dataCompilazione).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setPrinting(scheda)} title="Stampa"
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                      <i className="fas fa-print"></i>
                    </button>
                    <button onClick={() => { setEditing(scheda); setShowForm(true); }} title="Modifica"
                      className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => { if (confirm('Eliminare questa scheda?')) onDelete(scheda.id); }} title="Elimina"
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
