import { useState } from 'react';
import { DittaInstallatrice } from '../types';

interface DitteInstallatriciPageProps {
  ditte: DittaInstallatrice[];
  onAdd: (ditta: Omit<DittaInstallatrice, 'id' | 'dataCreazione'>) => void;
  onUpdate: (ditta: DittaInstallatrice) => void;
  onDelete: (id: string) => void;
}

const emptyForm: Omit<DittaInstallatrice, 'id' | 'dataCreazione'> = {
  ragioneSociale: '',
  partitaIva: '',
  codiceFiscale: '',
  indirizzo: '',
  numeroCivico: '',
  citta: '',
  provincia: '',
  cap: '',
  telefono: '',
  email: '',
  pec: '',
  settore: '',
  abilitazioni: [],
  cciaa: '',
  cciaaNumero: '',
  alboArtigiani: '',
  alboArtigianiNumero: '',
  legaleRappresentanteNome: '',
  legaleRappresentanteCognome: '',
  legaleRappresentanteCF: '',
  certificatoISO9001: false,
  certificatoISO14001: false,
  certificatoISO45001: false,
  certificatoFGas: '',
  note: '',
  attivo: true,
};

const ABILITAZIONI_DM_37_08 = [
  { value: 'a', label: 'Lettera a) - Impianti elettrici' },
  { value: 'b', label: 'Lettera b) - Impianti idrico-sanitari' },
  { value: 'c', label: 'Lettera c) - Impianti gas' },
  { value: 'd', label: 'Lettera d) - Riscaldamento/climatizzazione' },
  { value: 'e', label: 'Lettera e) - Impianti antincendio' },
  { value: 'f', label: 'Lettera f) - Impianti antifurto' },
  { value: 'g', label: 'Lettera g) - Ascensori/montacarichi' },
];

export default function DitteInstallatriciPage({ ditte, onAdd, onUpdate, onDelete }: DitteInstallatriciPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DittaInstallatrice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState<DittaInstallatrice | null>(null);

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

  const handleEdit = (ditta: DittaInstallatrice) => {
    setEditing(ditta);
    setForm({
      ragioneSociale: ditta.ragioneSociale,
      partitaIva: ditta.partitaIva,
      codiceFiscale: ditta.codiceFiscale || '',
      indirizzo: ditta.indirizzo,
      numeroCivico: ditta.numeroCivico,
      citta: ditta.citta,
      provincia: ditta.provincia,
      cap: ditta.cap,
      telefono: ditta.telefono,
      email: ditta.email,
      pec: ditta.pec || '',
      settore: ditta.settore,
      abilitazioni: ditta.abilitazioni,
      cciaa: ditta.cciaa || '',
      cciaaNumero: ditta.cciaaNumero || '',
      alboArtigiani: ditta.alboArtigiani || '',
      alboArtigianiNumero: ditta.alboArtigianiNumero || '',
      legaleRappresentanteNome: ditta.legaleRappresentanteNome,
      legaleRappresentanteCognome: ditta.legaleRappresentanteCognome,
      legaleRappresentanteCF: ditta.legaleRappresentanteCF,
      certificatoISO9001: ditta.certificatoISO9001 || false,
      certificatoISO14001: ditta.certificatoISO14001 || false,
      certificatoISO45001: ditta.certificatoISO45001 || false,
      certificatoFGas: ditta.certificatoFGas || '',
      note: ditta.note || '',
      attivo: ditta.attivo,
    });
    setShowForm(true);
    setShowDetail(null);
  };

  const toggleAbilitazione = (abilitazione: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g') => {
    if (form.abilitazioni.includes(abilitazione)) {
      setForm({ ...form, abilitazioni: form.abilitazioni.filter(a => a !== abilitazione) });
    } else {
      setForm({ ...form, abilitazioni: [...form.abilitazioni, abilitazione] });
    }
  };

  const filtered = ditte.filter(d =>
    `${d.ragioneSociale} ${d.partitaIva} ${d.settore}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ditte Installatrici</h1>
          <p className="text-gray-500 mt-1">Gestione anagrafica ditte abilitate D.M. 37/2008</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-200"
        >
          <i className="fas fa-plus"></i>
          <span>Nuova Ditta</span>
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-600 mt-1"></i>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Requisiti D.M. 37/2008</p>
            <p>Le ditte installatrici devono essere in possesso dei requisiti tecnico-professionali di cui all'art. 3 del D.M. 37/08 e iscritte alla Camera di Commercio o all'Albo delle Imprese Artigiane.</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Cerca ditta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editing ? 'Modifica Ditta' : 'Nuova Ditta Installatrice'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Dati Anagrafici */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-building text-blue-500"></i>
                  Dati Anagrafici
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale *</label>
                    <input required type="text" value={form.ragioneSociale} onChange={e => setForm({...form, ragioneSociale: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA *</label>
                    <input required type="text" value={form.partitaIva} onChange={e => setForm({...form, partitaIva: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale</label>
                    <input type="text" value={form.codiceFiscale} onChange={e => setForm({...form, codiceFiscale: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Settore *</label>
                    <input required type="text" value={form.settore} onChange={e => setForm({...form, settore: e.target.value})}
                      placeholder="Es: Impianti elettrici, Impianti gas, ecc."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Sede Legale */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-green-500"></i>
                  Sede Legale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
                    <div className="flex gap-2">
                      <input required type="text" value={form.indirizzo} onChange={e => setForm({...form, indirizzo: e.target.value})}
                        placeholder="Via/Piazza"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      <input required type="text" value={form.numeroCivico} onChange={e => setForm({...form, numeroCivico: e.target.value})}
                        placeholder="N."
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                    <input required type="text" value={form.citta} onChange={e => setForm({...form, citta: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                      <input required type="text" maxLength={2} value={form.provincia} onChange={e => setForm({...form, provincia: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                      <input required type="text" maxLength={5} value={form.cap} onChange={e => setForm({...form, cap: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contatti */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-phone text-purple-500"></i>
                  Contatti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                    <input required type="tel" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">PEC</label>
                    <input type="email" value={form.pec} onChange={e => setForm({...form, pec: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Abilitazioni D.M. 37/08 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-certificate text-yellow-500"></i>
                  Abilitazioni D.M. 37/2008 (Art. 3)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ABILITAZIONI_DM_37_08.map(ab => (
                    <label key={ab.value} className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={form.abilitazioni.includes(ab.value as any)}
                        onChange={() => toggleAbilitazione(ab.value as any)}
                        className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{ab.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Iscrizioni */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-file-alt text-orange-500"></i>
                  Iscrizioni
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Camera di Commercio</label>
                    <input type="text" value={form.cciaa} onChange={e => setForm({...form, cciaa: e.target.value})}
                      placeholder="Es: CCIAA di Milano"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numero Iscrizione CCIAA</label>
                    <input type="text" value={form.cciaaNumero} onChange={e => setForm({...form, cciaaNumero: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Albo Artigiani</label>
                    <input type="text" value={form.alboArtigiani} onChange={e => setForm({...form, alboArtigiani: e.target.value})}
                      placeholder="Es: Albo Artigiani di Roma"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numero Iscrizione Albo</label>
                    <input type="text" value={form.alboArtigianiNumero} onChange={e => setForm({...form, alboArtigianiNumero: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Legale Rappresentante */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-user-tie text-red-500"></i>
                  Legale Rappresentante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input required type="text" value={form.legaleRappresentanteNome} onChange={e => setForm({...form, legaleRappresentanteNome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                    <input required type="text" value={form.legaleRappresentanteCognome} onChange={e => setForm({...form, legaleRappresentanteCognome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
                    <input required type="text" value={form.legaleRappresentanteCF} onChange={e => setForm({...form, legaleRappresentanteCF: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Certificazioni */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-award text-teal-500"></i>
                  Certificazioni
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.certificatoISO9001}
                      onChange={e => setForm({...form, certificatoISO9001: e.target.checked})}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Certificazione ISO 9001 (Qualità)</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.certificatoISO14001}
                      onChange={e => setForm({...form, certificatoISO14001: e.target.checked})}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Certificazione ISO 14001 (Ambiente)</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.certificatoISO45001}
                      onChange={e => setForm({...form, certificatoISO45001: e.target.checked})}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Certificazione ISO 45001 (Sicurezza)</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificato F-Gas</label>
                    <input type="text" value={form.certificatoFGas} onChange={e => setForm({...form, certificatoFGas: e.target.value})}
                      placeholder="Numero certificato"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-sticky-note text-gray-500"></i>
                  Note
                </h3>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Annulla</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  {editing ? 'Aggiorna' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Dettaglio Ditta</h2>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-building text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-lg">{showDetail.ragioneSociale}</p>
                  <p className="text-gray-500">P.IVA: {showDetail.partitaIva}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Settore:</span><br/><span className="font-medium">{showDetail.settore}</span></div>
                <div><span className="text-gray-500">Stato:</span><br/><span className={`font-medium ${showDetail.attivo ? 'text-green-600' : 'text-red-600'}`}>{showDetail.attivo ? 'Attiva' : 'Non attiva'}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Sede:</span><br/><span className="font-medium">{showDetail.indirizzo} {showDetail.numeroCivico}, {showDetail.citta} ({showDetail.provincia}) {showDetail.cap}</span></div>
                <div><span className="text-gray-500">Telefono:</span><br/><span className="font-medium">{showDetail.telefono}</span></div>
                <div><span className="text-gray-500">Email:</span><br/><span className="font-medium">{showDetail.email}</span></div>
                {showDetail.pec && <div className="col-span-2"><span className="text-gray-500">PEC:</span><br/><span className="font-medium">{showDetail.pec}</span></div>}
                <div className="col-span-2">
                  <span className="text-gray-500">Abilitazioni D.M. 37/08:</span><br/>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {showDetail.abilitazioni.map(ab => (
                      <span key={ab} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Lettera {ab.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Legale Rappresentante:</span><br/>
                  <span className="font-medium">{showDetail.legaleRappresentanteNome} {showDetail.legaleRappresentanteCognome}</span><br/>
                  <span className="text-xs text-gray-500">CF: {showDetail.legaleRappresentanteCF}</span>
                </div>
                {(showDetail.cciaa || showDetail.alboArtigiani) && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Iscrizioni:</span><br/>
                    {showDetail.cciaa && <p className="font-medium">CCIAA: {showDetail.cciaa} n. {showDetail.cciaaNumero}</p>}
                    {showDetail.alboArtigiani && <p className="font-medium">Albo Artigiani: {showDetail.alboArtigiani} n. {showDetail.alboArtigianiNumero}</p>}
                  </div>
                )}
                {(showDetail.certificatoISO9001 || showDetail.certificatoISO14001 || showDetail.certificatoISO45001 || showDetail.certificatoFGas) && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Certificazioni:</span><br/>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {showDetail.certificatoISO9001 && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">ISO 9001</span>}
                      {showDetail.certificatoISO14001 && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">ISO 14001</span>}
                      {showDetail.certificatoISO45001 && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">ISO 45001</span>}
                      {showDetail.certificatoFGas && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">F-Gas: {showDetail.certificatoFGas}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => handleEdit(showDetail)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <i className="fas fa-edit mr-1"></i> Modifica
              </button>
              <button onClick={() => { onDelete(showDetail.id); setShowDetail(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                <i className="fas fa-trash mr-1"></i> Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ditte List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <i className="fas fa-building text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">Nessuna ditta trovata</p>
          <p className="text-gray-400 text-sm mt-1">Aggiungi la prima ditta installatrice per iniziare</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ditta => (
            <div key={ditta.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setShowDetail(ditta)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-building text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{ditta.ragioneSociale}</p>
                    <p className="text-sm text-gray-500">P.IVA: {ditta.partitaIva}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(ditta); }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(ditta.id); }}
                    className="p-2 text-gray-400 hover:text-red-600 transition">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p><i className="fas fa-map-marker-alt w-4 text-gray-400"></i> {ditta.citta} ({ditta.provincia})</p>
                <p><i className="fas fa-phone w-4 text-gray-400"></i> {ditta.telefono}</p>
                <p><i className="fas fa-certificate w-4 text-gray-400"></i> {ditta.abilitazioni.length} abilitazioni</p>
                <div className="flex gap-1 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ditta.attivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {ditta.attivo ? 'Attiva' : 'Non attiva'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
