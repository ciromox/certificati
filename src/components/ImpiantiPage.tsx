import { useState } from 'react';
import { Impianto, Cliente, TipologiaImpianto } from '../types';
import { validateImpiantoElettrico, validateImpiantoGas, checkConformitaImpianto, ValidationResult } from '../validators';
import ValidationMessages from './ValidationMessages';
import { CadElement } from './MiniCAD';

interface ImpiantiPageProps {
  impianti: Impianto[];
  clienti: Cliente[];
  schemiCad: Record<string, CadElement[]>;
  onAdd: (impianto: Omit<Impianto, 'id' | 'dataCreazione'>) => void;
  onUpdate: (impianto: Impianto) => void;
  onDelete: (id: string) => void;
  onOpenCAD: (impiantoId: string) => void;
}

const tipologie: { value: TipologiaImpianto; label: string; icon: string }[] = [
  { value: 'elettrico', label: 'Impianto Elettrico', icon: 'fas fa-bolt' },
  { value: 'idrico-sanitario', label: 'Impianto Idrico-Sanitario', icon: 'fas fa-faucet' },
  { value: 'gas', label: 'Impianto Gas', icon: 'fas fa-fire' },
  { value: 'riscaldamento', label: 'Impianto Riscaldamento', icon: 'fas fa-thermometer-half' },
  { value: 'climatizzazione', label: 'Impianto Climatizzazione', icon: 'fas fa-snowflake' },
  { value: 'fgas', label: 'Impianto F-Gas (Refrigerazione)', icon: 'fas fa-snowflake' },
  { value: 'antincendio', label: 'Impianto Antincendio', icon: 'fas fa-fire-extinguisher' },
  { value: 'antifurto', label: 'Impianto Antifurto', icon: 'fas fa-shield-alt' },
  { value: 'ascensori', label: 'Ascensori/Montacarichi', icon: 'fas fa-elevator' },
];

const emptyForm = {
  clienteId: '', tipologia: 'elettrico' as TipologiaImpianto, destinazioneUso: '',
  indirizzo: '', citta: '', cap: '', provincia: '', caratteristiche: '',
  potenza: undefined as number | undefined, tensione: undefined as number | undefined,
  puntiUtilizzazione: undefined as number | undefined, dataInstallazione: '', note: '',
};

const getTipologiaLabel = (t: string) => tipologie.find(x => x.value === t)?.label || t;
const getTipologiaIcon = (t: string) => tipologie.find(x => x.value === t)?.icon || 'fas fa-cog';

export default function ImpiantiPage({ impianti = [], clienti = [], schemiCad = {}, onAdd, onUpdate, onDelete, onOpenCAD }: ImpiantiPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Impianto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [techValidation, setTechValidation] = useState<ValidationResult>({ valid: true, errors: [], warnings: [] });
  const [conformita, setConformita] = useState<{ conforme: boolean; richiedeProgetto: boolean; note: string[] }>({ conforme: true, richiedeProgetto: false, note: [] });
  
  // Aggiorna validazioni tecniche quando cambiano i parametri
  const updateTechValidation = () => {
    let result: ValidationResult;
    if (form.tipologia === 'elettrico') {
      result = validateImpiantoElettrico({
        potenza: form.potenza,
        tensione: form.tensione,
        puntiUtilizzazione: form.puntiUtilizzazione,
      });
    } else if (form.tipologia === 'gas') {
      result = validateImpiantoGas({
        portataContatore: form.potenza, // riusiamo potenza come portata per gas
      });
    } else {
      result = { valid: true, errors: [], warnings: [] };
    }
    setTechValidation(result);
    
    // Verifica conformità
    const conf = checkConformitaImpianto(form.tipologia, {
      potenza: form.potenza,
      puntiUtilizzazione: form.puntiUtilizzazione,
      portataContatore: form.potenza,
    });
    setConformita(conf);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      onUpdate({ ...editing, ...form });
    } else {
      onAdd(form);
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (impianto: Impianto) => {
    setEditing(impianto);
    setForm({
      clienteId: impianto.clienteId, tipologia: impianto.tipologia,
      destinazioneUso: impianto.destinazioneUso, indirizzo: impianto.indirizzo,
      citta: impianto.citta, cap: impianto.cap, provincia: impianto.provincia,
      caratteristiche: impianto.caratteristiche, potenza: impianto.potenza,
      tensione: impianto.tensione, puntiUtilizzazione: impianto.puntiUtilizzazione,
      dataInstallazione: impianto.dataInstallazione || '', note: impianto.note || '',
    });
    setShowForm(true);
  };

  const getClienteNome = (id: string) => {
    const c = clienti.find(cl => cl.id === id);
    return c ? `${c.nome} ${c.cognome}` : 'N/D';
  };

  const filtered = impianti.filter(i => {
    const matchSearch = `${i.indirizzo} ${i.citta} ${getClienteNome(i.clienteId)}`.toLowerCase().includes(search.toLowerCase());
    const matchTipo = !filterTipo || i.tipologia === filterTipo;
    return matchSearch && matchTipo;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Impianti</h1>
          <p className="text-gray-500 mt-1">Gestione impianti secondo D.M. 37/2008</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-green-200"
        >
          <i className="fas fa-plus"></i>
          <span>Nuovo Impianto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input type="text" placeholder="Cerca impianto..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        </div>
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
          <option value="">Tutte le tipologie</option>
          {tipologie.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">{editing ? 'Modifica Impianto' : 'Nuovo Impianto'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select required value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Seleziona cliente...</option>
                    {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}{c.ragioneSociale ? ` (${c.ragioneSociale})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipologia *</label>
                  <select required value={form.tipologia} onChange={e => {
                    const newForm = {...form, tipologia: e.target.value as TipologiaImpianto};
                    setForm(newForm);
                    // Reset validazioni tecniche
                    setTechValidation({ valid: true, errors: [], warnings: [] });
                    setConformita({ conforme: true, richiedeProgetto: false, note: [] });
                  }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
                    {tipologie.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinazione d'uso *</label>
                  <input required type="text" value={form.destinazioneUso} onChange={e => setForm({...form, destinazioneUso: e.target.value})}
                    placeholder="Es. Abitazione civile, Ufficio, Negozio..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo impianto *</label>
                  <input required type="text" value={form.indirizzo} onChange={e => setForm({...form, indirizzo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                  <input required type="text" value={form.citta} onChange={e => setForm({...form, citta: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                    <input required type="text" value={form.cap} onChange={e => setForm({...form, cap: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                    <input required type="text" maxLength={2} value={form.provincia} onChange={e => setForm({...form, provincia: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caratteristiche tecniche</label>
                  <textarea value={form.caratteristiche} onChange={e => setForm({...form, caratteristiche: e.target.value})}
                    rows={3} placeholder="Descrizione caratteristiche dell'impianto..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                {/* Campi tecnici specifici per tipologia */}
                {(form.tipologia === 'elettrico') && (
                  <>
                    <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800 font-medium mb-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Parametri impianto elettrico (CEI 64-8)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Potenza (kW)</label>
                      <input type="number" step="0.1" value={form.potenza || ''} 
                        onChange={e => {
                          const newForm = {...form, potenza: e.target.value ? Number(e.target.value) : undefined};
                          setForm(newForm);
                          // Validazione immediata
                          const result = validateImpiantoElettrico({
                            potenza: newForm.potenza,
                            tensione: newForm.tensione,
                            puntiUtilizzazione: newForm.puntiUtilizzazione,
                          });
                          setTechValidation(result);
                          const conf = checkConformitaImpianto('elettrico', { potenza: newForm.potenza, puntiUtilizzazione: newForm.puntiUtilizzazione });
                          setConformita(conf);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Es: 6" />
                      <p className="text-xs text-gray-500 mt-1">Standard: 3-6 kW per abitazioni</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tensione (V)</label>
                      <select value={form.tensione || ''} onChange={e => {
                          const newForm = {...form, tensione: e.target.value ? Number(e.target.value) : undefined};
                          setForm(newForm);
                          const result = validateImpiantoElettrico({
                            potenza: newForm.potenza,
                            tensione: newForm.tensione,
                            puntiUtilizzazione: newForm.puntiUtilizzazione,
                          });
                          setTechValidation(result);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
                        <option value="">Seleziona...</option>
                        <option value="230">230V (Monofase)</option>
                        <option value="400">400V (Trifase)</option>
                        <option value="12">12V (SELV)</option>
                        <option value="24">24V (SELV)</option>
                        <option value="48">48V (SELV)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Punti utilizzazione</label>
                      <input type="number" value={form.puntiUtilizzazione || ''} 
                        onChange={e => {
                          const newForm = {...form, puntiUtilizzazione: e.target.value ? Number(e.target.value) : undefined};
                          setForm(newForm);
                          const result = validateImpiantoElettrico({
                            potenza: newForm.potenza,
                            tensione: newForm.tensione,
                            puntiUtilizzazione: newForm.puntiUtilizzazione,
                          });
                          setTechValidation(result);
                          const conf = checkConformitaImpianto('elettrico', { potenza: newForm.potenza, puntiUtilizzazione: newForm.puntiUtilizzazione });
                          setConformita(conf);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Es: 50" />
                      <p className="text-xs text-gray-500 mt-1">Sopra 400 serve progetto</p>
                    </div>
                  </>
                )}
                
                {(form.tipologia === 'gas') && (
                  <>
                    <div className="md:col-span-2 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs text-red-800 font-medium mb-2">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        Impianto gas - Normativa UNI 7129
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Portata contatore (mc/h)</label>
                      <select value={form.potenza || ''} onChange={e => {
                          const newForm = {...form, potenza: e.target.value ? Number(e.target.value) : undefined};
                          setForm(newForm);
                          const result = validateImpiantoGas({ portataContatore: newForm.potenza });
                          setTechValidation(result);
                          const conf = checkConformitaImpianto('gas', { portataContatore: newForm.potenza });
                          setConformita(conf);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
                        <option value="">Seleziona...</option>
                        <option value="2.5">G4 - 2.5 mc/h</option>
                        <option value="4">G6 - 4 mc/h</option>
                        <option value="6">G10 - 6 mc/h</option>
                        <option value="10">G16 - 10 mc/h</option>
                        <option value="16">G25 - 16 mc/h</option>
                        <option value="25">G40 - 25 mc/h</option>
                      </select>
                    </div>
                  </>
                )}
                
                {(form.tipologia === 'riscaldamento' || form.tipologia === 'climatizzazione') && (
                  <>
                    <div className="md:col-span-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-800 font-medium mb-2">
                        <i className="fas fa-thermometer-half mr-1"></i>
                        Impianto termico - D.P.R. 74/2013
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Potenza termica (kW)</label>
                      <input type="number" step="0.1" value={form.potenza || ''} 
                        onChange={e => {
                          const newForm = {...form, potenza: e.target.value ? Number(e.target.value) : undefined};
                          setForm(newForm);
                          const conf = checkConformitaImpianto(form.tipologia, { potenza: newForm.potenza });
                          setConformita(conf);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Es: 24" />
                      <p className="text-xs text-gray-500 mt-1">Sopra 35 kW serve libretto</p>
                    </div>
                  </>
                )}
                
                {(form.tipologia === 'fgas') && (
                  <>
                    <div className="md:col-span-2 bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                      <p className="text-xs text-cyan-800 font-medium mb-2">
                        <i className="fas fa-snowflake mr-1"></i>
                        Impianto F-Gas - DPR 146/2018 - Reg. UE 517/2014
                      </p>
                      <p className="text-xs text-cyan-700">
                        Obblighi specifici per gas fluorurati ad effetto serra. Certificato F-Gas obbligatorio per tecnici e imprese.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Gas Refrigerante</label>
                      <select value={form.tensione || ''} onChange={e => setForm({...form, tensione: e.target.value ? Number(e.target.value) : undefined})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
                        <option value="">Seleziona...</option>
                        <option value="32">R32 (GWP 675)</option>
                        <option value="410">R410A (GWP 2088)</option>
                        <option value="407">R407C (GWP 1774)</option>
                        <option value="134">R134a (GWP 1430)</option>
                        <option value="1234">R1234yf (GWP &lt;1)</option>
                        <option value="290">R290 - Propano (GWP 3)</option>
                        <option value="744">R744 - CO2 (GWP 1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carica Gas (kg)</label>
                      <input type="number" step="0.01" value={form.potenza || ''} 
                        onChange={e => {
                          const newForm = {...form, potenza: e.target.value ? Number(e.target.value) : undefined};
                          setForm(newForm);
                          const conf = checkConformitaImpianto('fgas', { caricaGas: newForm.potenza });
                          setConformita(conf);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Es: 1.5" />
                      <p className="text-xs text-gray-500 mt-1">≥ 3 kg: obbligo registro</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Apparecchiatura</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
                        <option value="">Seleziona...</option>
                        <option value="split">Split/Single Split</option>
                        <option value="multisplit">Multi-Split</option>
                        <option value="vrv">VRV/VRF</option>
                        <option value="chiller">Chiller</option>
                        <option value="pompa_calore">Pompa di Calore</option>
                        <option value="cella">Cella Frigorifera</option>
                      </select>
                    </div>
                  </>
                )}
                
                {/* Messaggi di validazione tecnica */}
                {(techValidation.errors.length > 0 || techValidation.warnings.length > 0) && (
                  <div className="md:col-span-2">
                    <ValidationMessages validation={techValidation} />
                  </div>
                )}
                
                {/* Avviso conformità */}
                {conformita.richiedeProgetto && (
                  <div className="md:col-span-2 bg-amber-50 border border-amber-300 rounded-lg p-3">
                    <p className="text-sm text-amber-800 font-medium">
                      <i className="fas fa-hard-hat mr-2"></i>
                      <strong>Progetto obbligatorio</strong> (art. 5 D.M. 37/08)
                    </p>
                    <ul className="mt-2 ml-6 list-disc text-xs text-amber-700 space-y-1">
                      {conformita.note.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data installazione</label>
                  <input type="date" value={form.dataInstallazione} onChange={e => setForm({...form, dataInstallazione: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                    rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Annulla</button>
                <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                  {editing ? 'Aggiorna' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Impianti List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <i className="fas fa-building text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">Nessun impianto trovato</p>
          <p className="text-gray-400 text-sm mt-1">Registra il primo impianto per iniziare</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(impianto => (
            <div key={impianto.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className={`${getTipologiaIcon(impianto.tipologia)} text-green-600`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{getTipologiaLabel(impianto.tipologia)}</p>
                    <p className="text-xs text-gray-500">{getClienteNome(impianto.clienteId)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onOpenCAD(impianto.id)} title="Schema Impianto"
                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition">
                    <i className="fas fa-drafting-compass text-sm"></i>
                  </button>
                  <button onClick={() => handleEdit(impianto)} className="p-1.5 text-gray-400 hover:text-blue-600 transition">
                    <i className="fas fa-edit text-sm"></i>
                  </button>
                  <button onClick={() => onDelete(impianto.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition">
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p><i className="fas fa-map-marker-alt w-4 text-gray-400"></i> {impianto.indirizzo}, {impianto.citta}</p>
                <p><i className="fas fa-home w-4 text-gray-400"></i> {impianto.destinazioneUso}</p>
                {impianto.potenza && <p><i className="fas fa-bolt w-4 text-gray-400"></i> {impianto.potenza} kW</p>}
                {schemiCad[impianto.id] && schemiCad[impianto.id].length > 0 && (
                  <p className="text-indigo-600 font-medium"><i className="fas fa-drafting-compass w-4"></i> Schema CAD presente ({schemiCad[impianto.id].length} elementi)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
