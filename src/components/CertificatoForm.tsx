import { useState } from 'react';
import { Certificato, Cliente, Impianto, Tecnico, TipoCertificato } from '../types';
import { generateNumeroCertificato } from '../store';
import { validateAbilitazioneTecnico, ValidationResult } from '../validators';
import ValidationMessages from './ValidationMessages';

interface CertificatoFormProps {
  clienti: Cliente[];
  impianti: Impianto[];
  tecnico: Tecnico | null;
  certificati: Certificato[];
  editingCertificato: Certificato | null;
  onSave: (certificato: any) => void;
  onCancel: () => void;
}

const normeRiferimento = [
  'CEI 64-8 (Impianti elettrici utilizzatori a tensione nominale non superiore a 1000 V c.a.)',
  'CEI EN 61439 (Quadri per bassa tensione)',
  'CEI 64-50 (Impianti elettrici in edifici residenziali)',
  'CEI 0-21 (Sistemi attivi di utenza per la connessione in parallelo con sistemi di distribuzione)',
  'D.M. 37/2008 (Norme per la sicurezza degli impianti)',
  'D.Lgs. 81/2008 (Testo unico sulla sicurezza)',
  'CEI 64-8/7 (Ambienti residenziali - Prestazioni dell\'impianto)',
  'CEI 64-8/6 (Locali contenenti bagni o docce)',
  'Legge 46/90 (Impianti tecnologici)',
  'UNI 7129 (Impianti a gas per uso domestico)',
  'UNI 10683 (Generatori di calore alimentati a biomassa legnosa)',
  'UNI EN 12831 (Impianti di riscaldamento)',
];

export default function CertificatoForm({ clienti, impianti, tecnico, certificati, editingCertificato, onSave, onCancel }: CertificatoFormProps) {
  const [form, setForm] = useState({
    numero: editingCertificato?.numero || generateNumeroCertificato(editingCertificato?.tipo || 'DiCo', certificati),
    tipo: (editingCertificato?.tipo || 'DiCo') as TipoCertificato,
    clienteId: editingCertificato?.clienteId || '',
    impiantoId: editingCertificato?.impiantoId || '',
    dataRilascio: editingCertificato?.dataRilascio || new Date().toISOString().split('T')[0],
    dataValidita: editingCertificato?.dataValidita || '',
    stato: (editingCertificato?.stato || 'bozza') as 'bozza' | 'emesso' | 'archiviato' | 'scaduto',
    descrizioneLavoro: editingCertificato?.descrizioneLavoro || '',
    materialiUtilizzati: editingCertificato?.materialiUtilizzati || [],
    verificheEffettuate: editingCertificato?.verificheEffettuate || '',
    conformitaNorme: editingCertificato?.conformitaNorme || [],
    note: editingCertificato?.note || '',
    firmaTecnico: editingCertificato?.firmaTecnico || '',
    tecnicoResponsabile: editingCertificato?.tecnicoResponsabile || (tecnico ? `${tecnico.nome} ${tecnico.cognome}` : ''),
    abilitazioneTecnico: editingCertificato?.abilitazioneTecnico || (tecnico?.abilitazione || ''),
  });

  const [newMateriale, setNewMateriale] = useState('');
  const [selectedNorme, setSelectedNorme] = useState<string[]>(form.conformitaNorme);

  // Verifica di conformità prima del salvataggio
  const checkConformita = (): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Verifica che ci sia almeno una norma di riferimento
    if (selectedNorme.length === 0) {
      issues.push('⚠️ Nessuna norma di riferimento selezionata');
    }
    
    // Verifica abilitazione tecnico
    if (form.abilitazioneTecnico && form.tecnicoResponsabile) {
      const impianto = impianti.find(i => i.id === form.impiantoId);
      if (impianto) {
        const abVal = validateAbilitazioneTecnico(form.abilitazioneTecnico, impianto.tipologia);
        if (!abVal.valid) {
          issues.push(...abVal.errors.map(e => '❌ ' + e));
        }
      }
    }
    
    // Verifica che la descrizione del lavoro sia sufficientemente dettagliata
    if (form.descrizioneLavoro.length < 50) {
      issues.push('⚠️ Descrizione del lavoro troppo breve (minimo 50 caratteri consigliati)');
    }
    
    // Verifica che ci siano materiali
    if (form.materialiUtilizzati.length === 0) {
      issues.push('⚠️ Nessun materiale utilizzato indicato');
    }
    
    // Verifica DiCo/DiRi specifiche
    if (form.tipo === 'DiCo') {
      if (!form.tecnicoResponsabile) issues.push('❌ Tecnico responsabile obbligatorio per DiCo');
      if (!form.abilitazioneTecnico) issues.push('❌ Abilitazione tecnico obbligatoria per DiCo');
    }
    
    if (form.tipo === 'DiRi') {
      if (!form.verificheEffettuate || form.verificheEffettuate.length < 20) {
        issues.push('⚠️ Per DiRi è necessario descrivere dettagliatamente le verifiche effettuate');
      }
    }
    
    return { valid: issues.filter(i => i.startsWith('❌')).length === 0, issues };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const check = checkConformita();
    if (!check.valid) {
      const confirmed = confirm(
        'Sono stati rilevati problemi di conformità:\n\n' + 
        check.issues.join('\n') + 
        '\n\nVuoi procedere comunque?'
      );
      if (!confirmed) return;
    } else if (check.issues.length > 0) {
      const confirmed = confirm(
        'Avvisi:\n\n' + 
        check.issues.join('\n') + 
        '\n\nVuoi procedere comunque?'
      );
      if (!confirmed) return;
    }
    
    const dataToSave = {
      ...form,
      conformitaNorme: selectedNorme,
    };
    if (editingCertificato) {
      onSave({ ...editingCertificato, ...dataToSave });
    } else {
      onSave(dataToSave);
    }
  };

  const addMateriale = () => {
    if (newMateriale.trim()) {
      setForm({ ...form, materialiUtilizzati: [...form.materialiUtilizzati, newMateriale.trim()] });
      setNewMateriale('');
    }
  };

  const removeMateriale = (index: number) => {
    setForm({ ...form, materialiUtilizzati: form.materialiUtilizzati.filter((_, i) => i !== index) });
  };

  const toggleNorma = (norma: string) => {
    setSelectedNorme(prev =>
      prev.includes(norma) ? prev.filter(n => n !== norma) : [...prev, norma]
    );
  };

  const getImpiantiByCliente = () => {
    if (!form.clienteId) return [];
    return impianti.filter(i => i.clienteId === form.clienteId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {editingCertificato ? 'Modifica Certificato' : 'Nuovo Certificato'}
          </h1>
          <p className="text-gray-500 mt-1">
            {form.tipo === 'DiCo' ? 'Dichiarazione di Conformità' : form.tipo === 'DiRi' ? 'Dichiarazione di Rispondenza' : 'Certificato'} - D.M. 37/2008
          </p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {!tecnico && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
          <div>
            <p className="font-medium text-yellow-800">Dati tecnico non configurati</p>
            <p className="text-sm text-yellow-700">Configura i dati del tecnico nella sezione "Dati Tecnico" per compilare automaticamente i certificati.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dati Certificato */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-file-alt text-blue-500"></i>
            Dati Certificato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero *</label>
              <input required type="text" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value as TipoCertificato})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="DiCo">Dichiarazione di Conformità (DiCo)</option>
                <option value="DiRi">Dichiarazione di Rispondenza (DiRi)</option>
                <option value="Verifica">Verifica Impianto</option>
                <option value="Manutenzione">Manutenzione</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Rilascio *</label>
              <input required type="date" value={form.dataRilascio} onChange={e => setForm({...form, dataRilascio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
              <select value={form.stato} onChange={e => setForm({...form, stato: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="bozza">Bozza</option>
                <option value="emesso">Emesso</option>
                <option value="archiviato">Archiviato</option>
                <option value="scaduto">Scaduto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cliente e Impianto */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-users text-green-500"></i>
            Cliente e Impianto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
              <select required value={form.clienteId} onChange={e => setForm({...form, clienteId: e.target.value, impiantoId: ''})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Seleziona cliente...</option>
                {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}{c.ragioneSociale ? ` (${c.ragioneSociale})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impianto *</label>
              <select required value={form.impiantoId} onChange={e => setForm({...form, impiantoId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!form.clienteId}>
                <option value="">Seleziona impianto...</option>
                {getImpiantiByCliente().map(i => <option key={i.id} value={i.id}>{i.tipologia} - {i.indirizzo}, {i.citta}</option>)}
              </select>
              {!form.clienteId && <p className="text-xs text-gray-400 mt-1">Seleziona prima un cliente</p>}
            </div>
          </div>
        </div>

        {/* Descrizione Lavoro */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-clipboard-list text-purple-500"></i>
            Descrizione del Lavoro
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione lavoro eseguito *</label>
              <textarea required value={form.descrizioneLavoro} onChange={e => setForm({...form, descrizioneLavoro: e.target.value})}
                rows={4} placeholder="Descrivere dettagliatamente il lavoro eseguito sull'impianto..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verifiche effettuate *</label>
              <textarea required value={form.verificheEffettuate} onChange={e => setForm({...form, verificheEffettuate: e.target.value})}
                rows={3} placeholder="Descrivere le verifiche e i collaudi effettuati..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Materiali */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-boxes text-orange-500"></i>
            Materiali Utilizzati
          </h2>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newMateriale} onChange={e => setNewMateriale(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMateriale(); } }}
              placeholder="Aggiungi materiale (es. Interruttore differenziale 30mA)"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={addMateriale}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          {form.materialiUtilizzati.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.materialiUtilizzati.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200">
                  {m}
                  <button type="button" onClick={() => removeMateriale(i)} className="text-orange-400 hover:text-orange-600">
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Norme */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-gavel text-indigo-500"></i>
            Norme di Riferimento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {normeRiferimento.map((norma, i) => (
              <label key={i} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition ${
                selectedNorme.includes(norma) ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'
              }`}>
                <input type="checkbox" checked={selectedNorme.includes(norma)} onChange={() => toggleNorma(norma)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-700">{norma}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dati Tecnico */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-user-tie text-teal-500"></i>
            Tecnico Responsabile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tecnico Responsabile *</label>
              <input required type="text" value={form.tecnicoResponsabile} onChange={e => setForm({...form, tecnicoResponsabile: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abilitazione *</label>
              <input required type="text" value={form.abilitazioneTecnico} onChange={e => setForm({...form, abilitazioneTecnico: e.target.value})}
                placeholder="Es. Lettera a) art. 3 D.M. 37/08"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma Tecnico *</label>
              <input required type="text" value={form.firmaTecnico} onChange={e => setForm({...form, firmaTecnico: e.target.value})}
                placeholder="Nome e cognome per la firma"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data validità</label>
              <input type="date" value={form.dataValidita} onChange={e => setForm({...form, dataValidita: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-sticky-note text-yellow-500"></i>
            Note Aggiuntive
          </h2>
          <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})}
            rows={3} placeholder="Eventuali note aggiuntive..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-shield-alt text-green-500"></i>
            Verifica Conformità
          </h2>
          {(() => {
            const check = checkConformita();
            return (
              <div className="space-y-2">
                {check.issues.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-green-800 font-medium">Tutti i controlli di conformità superati</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {check.issues.map((issue, i) => (
                      <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                        issue.startsWith('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg transition">
              Annulla
            </button>
            <button type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg shadow-blue-200">
              <i className="fas fa-save mr-2"></i>
              {editingCertificato ? 'Aggiorna Certificato' : 'Salva Certificato'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
