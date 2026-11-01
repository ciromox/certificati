import { useState } from 'react';
import { Cliente } from '../types';
import { validateCodiceFiscale, validatePartitaIva, validateCAP, validateProvincia, validateEmail, validateTelefono, ValidationResult } from '../validators';
import ValidationMessages from './ValidationMessages';

interface ClientiPageProps {
  clienti: Cliente[];
  onAdd: (cliente: Omit<Cliente, 'id' | 'dataCreazione'>) => void;
  onUpdate: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

const emptyForm = {
  nome: '', cognome: '', ragioneSociale: '', codiceFiscale: '', partitaIva: '',
  indirizzo: '', citta: '', cap: '', provincia: '', telefono: '', email: '',
};

export default function ClientiPage({ clienti = [], onAdd, onUpdate, onDelete }: ClientiPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState<Cliente | null>(null);
  
  // Validazioni in tempo reale
  const [validations, setValidations] = useState<{
    codiceFiscale: ValidationResult;
    partitaIva: ValidationResult;
    cap: ValidationResult;
    provincia: ValidationResult;
    email: ValidationResult;
    telefono: ValidationResult;
  }>({
    codiceFiscale: { valid: true, errors: [], warnings: [] },
    partitaIva: { valid: true, errors: [], warnings: [] },
    cap: { valid: true, errors: [], warnings: [] },
    provincia: { valid: true, errors: [], warnings: [] },
    email: { valid: true, errors: [], warnings: [] },
    telefono: { valid: true, errors: [], warnings: [] },
  });
  
  // Aggiorna validazioni quando cambia il form
  const updateValidation = (field: keyof typeof validations, value: string) => {
    let result: ValidationResult;
    switch (field) {
      case 'codiceFiscale':
        result = validateCodiceFiscale(value);
        break;
      case 'partitaIva':
        result = validatePartitaIva(value);
        break;
      case 'cap':
        result = validateCAP(value);
        break;
      case 'provincia':
        result = validateProvincia(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'telefono':
        result = validateTelefono(value);
        break;
      default:
        result = { valid: true, errors: [], warnings: [] };
    }
    setValidations(prev => ({ ...prev, [field]: result }));
  };
  
  const isFormValid = () => {
    return validations.codiceFiscale.valid &&
           validations.partitaIva.valid &&
           validations.cap.valid &&
           validations.provincia.valid &&
           validations.email.valid &&
           validations.telefono.valid &&
           form.nome && form.cognome && form.codiceFiscale && 
           form.indirizzo && form.citta && form.cap && form.provincia;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Correggi gli errori nei campi prima di salvare');
      return;
    }
    if (editing) {
      onUpdate({ ...editing, ...form });
    } else {
      onAdd(form);
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditing(cliente);
    setForm({
      nome: cliente.nome, cognome: cliente.cognome, ragioneSociale: cliente.ragioneSociale || '',
      codiceFiscale: cliente.codiceFiscale, partitaIva: cliente.partitaIva || '',
      indirizzo: cliente.indirizzo, citta: cliente.citta, cap: cliente.cap,
      provincia: cliente.provincia, telefono: cliente.telefono || '', email: cliente.email || '',
    });
    setShowForm(true);
    setShowDetail(null);
  };

  const filtered = clienti.filter(c =>
    `${c.nome} ${c.cognome} ${c.ragioneSociale || ''} ${c.codiceFiscale}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Clienti</h1>
          <p className="text-gray-500 mt-1">Gestione anagrafica clienti</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-200"
        >
          <i className="fas fa-plus"></i>
          <span>Nuovo Cliente</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Cerca cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">
                {editing ? 'Modifica Cliente' : 'Nuovo Cliente'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                  <input required type="text" value={form.cognome} onChange={e => setForm({...form, cognome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale</label>
                  <input type="text" value={form.ragioneSociale} onChange={e => setForm({...form, ragioneSociale: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
                  <input required type="text" value={form.codiceFiscale} 
                    onChange={e => {
                      const val = e.target.value.toUpperCase();
                      setForm({...form, codiceFiscale: val});
                      updateValidation('codiceFiscale', val);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      form.codiceFiscale && !validations.codiceFiscale.valid ? 'border-red-400 bg-red-50' : 
                      form.codiceFiscale && validations.codiceFiscale.warnings.length > 0 ? 'border-amber-400 bg-amber-50' :
                      'border-gray-200'
                    }`}
                    placeholder="16 caratteri alfanumerici" />
                  {form.codiceFiscale && <ValidationMessages validation={validations.codiceFiscale} compact />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA</label>
                  <input type="text" value={form.partitaIva} 
                    onChange={e => {
                      const val = e.target.value;
                      setForm({...form, partitaIva: val});
                      if (val) updateValidation('partitaIva', val);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      form.partitaIva && !validations.partitaIva.valid ? 'border-red-400 bg-red-50' : 
                      form.partitaIva && validations.partitaIva.warnings.length > 0 ? 'border-amber-400 bg-amber-50' :
                      'border-gray-200'
                    }`}
                    placeholder="11 cifre (opzionale)" />
                  {form.partitaIva && <ValidationMessages validation={validations.partitaIva} compact />}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
                  <input required type="text" value={form.indirizzo} onChange={e => setForm({...form, indirizzo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                  <input required type="text" value={form.citta} onChange={e => setForm({...form, citta: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                    <input required type="text" maxLength={5} value={form.cap} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setForm({...form, cap: val});
                        updateValidation('cap', val);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        form.cap && !validations.cap.valid ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="5 cifre" />
                    {form.cap && <ValidationMessages validation={validations.cap} compact />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                    <input required type="text" maxLength={2} value={form.provincia} 
                      onChange={e => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                        setForm({...form, provincia: val});
                        updateValidation('provincia', val);
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        form.provincia && !validations.provincia.valid ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Es: RM" />
                    {form.provincia && <ValidationMessages validation={validations.provincia} compact />}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input type="tel" value={form.telefono} 
                    onChange={e => {
                      const val = e.target.value;
                      setForm({...form, telefono: val});
                      if (val) updateValidation('telefono', val);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      form.telefono && !validations.telefono.valid ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Es: +39 06 1234567" />
                  {form.telefono && <ValidationMessages validation={validations.telefono} compact />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} 
                    onChange={e => {
                      const val = e.target.value;
                      setForm({...form, email: val});
                      if (val) updateValidation('email', val);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      form.email && !validations.email.valid ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="email@esempio.it" />
                  {form.email && <ValidationMessages validation={validations.email} compact />}
                </div>
              </div>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Dettaglio Cliente</h2>
              <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-lg">{showDetail.nome} {showDetail.cognome}</p>
                  {showDetail.ragioneSociale && <p className="text-gray-500">{showDetail.ragioneSociale}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Cod. Fiscale:</span><br/><span className="font-medium">{showDetail.codiceFiscale}</span></div>
                {showDetail.partitaIva && <div><span className="text-gray-500">P. IVA:</span><br/><span className="font-medium">{showDetail.partitaIva}</span></div>}
                <div className="col-span-2"><span className="text-gray-500">Indirizzo:</span><br/><span className="font-medium">{showDetail.indirizzo}, {showDetail.citta} ({showDetail.provincia}) {showDetail.cap}</span></div>
                {showDetail.telefono && <div><span className="text-gray-500">Telefono:</span><br/><span className="font-medium">{showDetail.telefono}</span></div>}
                {showDetail.email && <div><span className="text-gray-500">Email:</span><br/><span className="font-medium">{showDetail.email}</span></div>}
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

      {/* Clienti List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <i className="fas fa-users text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">Nessun cliente trovato</p>
          <p className="text-gray-400 text-sm mt-1">Aggiungi il primo cliente per iniziare</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cliente => (
            <div key={cliente.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setShowDetail(cliente)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{cliente.nome} {cliente.cognome}</p>
                    {cliente.ragioneSociale && <p className="text-sm text-gray-500">{cliente.ragioneSociale}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(cliente); }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(cliente.id); }}
                    className="p-2 text-gray-400 hover:text-red-600 transition">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p><i className="fas fa-map-marker-alt w-4 text-gray-400"></i> {cliente.citta} ({cliente.provincia})</p>
                <p><i className="fas fa-id-card w-4 text-gray-400"></i> {cliente.codiceFiscale}</p>
                {cliente.telefono && <p><i className="fas fa-phone w-4 text-gray-400"></i> {cliente.telefono}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
