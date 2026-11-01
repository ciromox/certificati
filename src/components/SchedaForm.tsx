import { useState } from 'react';
import { SchedaTecnica, TipoSchedaTecnica, CONFIG_SCHEDE, TIPI_INTERVENTO_MANUTENZIONE, TIPI_GENERATORE, ESITI_CONTROLLO } from '../schedeTecniche';
import { Cliente, Impianto } from '../types';

interface SchedaFormProps {
  scheda: SchedaTecnica | null;
  clienti: Cliente[];
  impianti: Impianto[];
  onSave: (scheda: any) => void;
  onCancel: () => void;
}

export default function SchedaForm({ scheda, clienti, impianti, onSave, onCancel }: SchedaFormProps) {
  const [tipo, setTipo] = useState<TipoSchedaTecnica>(scheda?.tipo || 'DiCo');
  const [form, setForm] = useState<any>(scheda?.dati || {});
  const [numero, setNumero] = useState(scheda?.numero || `${tipo}-${Date.now().toString().slice(-6)}`);
  const [stato, setStato] = useState<'bozza' | 'compilata' | 'firmata' | 'archiviata'>(scheda?.stato || 'bozza');
  const [clienteId, setClienteId] = useState(scheda?.clienteId || '');
  const [impiantoId, setImpiantoId] = useState(scheda?.impiantoId || '');
  const [dataCompilazione, setDataCompilazione] = useState(scheda?.dataCompilazione || new Date().toISOString().split('T')[0]);
  const [dataValidita, setDataValidita] = useState(scheda?.dataValidita || '');
  const [note, setNote] = useState(scheda?.note || '');

  const config = CONFIG_SCHEDE[tipo];
  if (!config) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">Configurazione scheda non trovata per il tipo: {tipo}</div>;
  }

  // Verifica conformità scheda
  const checkSchedaConformita = (): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Verifica campi obbligatori specifici per tipo
    if (tipo === 'DiCo' || tipo === 'DiRi') {
      if (!form.descrizioneLavori || form.descrizioneLavori.length < 20) {
        issues.push('❌ Descrizione lavori troppo breve o mancante');
      }
      if (!form.tecnico) {
        issues.push('❌ Tecnico responsabile non indicato');
      }
    }
    
    if (tipo === 'LibrettoImpianto') {
      if (!form.potenza) issues.push('❌ Potenza nominale obbligatoria');
      if (!form.tipoGeneratore) issues.push('❌ Tipo generatore obbligatorio');
    }
    
    if (tipo === 'RapportoControllo') {
      if (!form.dataControllo) issues.push('❌ Data controllo obbligatoria');
      if (!form.esito) issues.push('❌ Esito controllo obbligatorio');
    }
    
    if (tipo === 'RegistroManutenzione') {
      if (!form.dataIntervento) issues.push('❌ Data intervento obbligatoria');
      if (!form.tipoIntervento) issues.push('❌ Tipo intervento obbligatorio');
      if (!form.tecnico) issues.push('❌ Tecnico operatore obbligatorio');
    }
    
    if (tipo === 'SchedaVerificaElettrica') {
      if (!form.resistenzaTerra && form.resistenzaTerra !== 0) {
        issues.push('⚠️ Resistenza di terra non misurata');
      }
      if (!form.isolamento && form.isolamento !== 0) {
        issues.push('⚠️ Resistenza isolamento non misurata');
      }
    }
    
    if (tipo === 'SchedaGas' || tipo === 'DichiarazioneGas') {
      if (!form.pressioneProva) issues.push('⚠️ Pressione prova tenuta non indicata');
      if (form.provaSuperata === false) {
        issues.push('❌ Prova di tenuta NON superata: impianto con perdite!');
      }
    }
    
    // Verifica stato
    if (stato === 'firmata' && Object.keys(form).length < 3) {
      issues.push('⚠️ Scheda con pochi dati compilati, verificare prima di firmare');
    }
    
    return { valid: issues.filter(i => i.startsWith('❌')).length === 0, issues };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const check = checkSchedaConformita();
    if (!check.valid) {
      const confirmed = confirm(
        'Problemi di conformità rilevati:\n\n' + 
        check.issues.join('\n') + 
        '\n\nVuoi procedere comunque?'
      );
      if (!confirmed) return;
    }
    
    onSave({
      numero,
      tipo,
      clienteId,
      impiantoId,
      dataCompilazione,
      dataValidita: dataValidita || undefined,
      stato,
      tecnicoId: '',
      dati: form,
      note,
    });
  };

  const updateField = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const getImpiantiByCliente = () => {
    if (!clienteId) return [];
    return impianti.filter(i => i.clienteId === clienteId);
  };

  const renderCampiSpecifici = () => {
    switch (tipo) {
      case 'DiCo':
      case 'DiRi':
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione Lavori Eseguiti *</label>
              <textarea required value={form.descrizioneLavori || ''} onChange={e => updateField('descrizioneLavori', e.target.value)}
                rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Materiali Installati</label>
              <textarea value={form.materiali || ''} onChange={e => updateField('materiali', e.target.value)}
                rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Verifiche Effettuate</label>
              <textarea value={form.verifiche || ''} onChange={e => updateField('verifiche', e.target.value)}
                rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Norme Applicate</label>
              <textarea value={form.norme || ''} onChange={e => updateField('norme', e.target.value)}
                rows={2} placeholder="CEI 64-8, UNI 7129, ..." className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tecnico Responsabile *</label>
              <input required type="text" value={form.tecnico || ''} onChange={e => updateField('tecnico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abilitazione</label>
              <input type="text" value={form.abilitazione || ''} onChange={e => updateField('abilitazione', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </>
        );

      case 'RelazioneTecnica':
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Oggetto della Relazione *</label>
              <textarea required value={form.oggetto || ''} onChange={e => updateField('oggetto', e.target.value)}
                rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione Impianto</label>
              <textarea value={form.descrizione || ''} onChange={e => updateField('descrizione', e.target.value)}
                rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Calcoli e Dimensionamento</label>
              <textarea value={form.calcoli || ''} onChange={e => updateField('calcoli', e.target.value)}
                rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </>
        );

      case 'RegistroManutenzione':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Intervento *</label>
              <input required type="date" value={form.dataIntervento || ''} onChange={e => updateField('dataIntervento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Intervento *</label>
              <select required value={form.tipoIntervento || ''} onChange={e => updateField('tipoIntervento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                {TIPI_INTERVENTO_MANUTENZIONE.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione Intervento *</label>
              <textarea required value={form.descrizione || ''} onChange={e => updateField('descrizione', e.target.value)}
                rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ricambi/Materiali Utilizzati</label>
              <textarea value={form.materiali || ''} onChange={e => updateField('materiali', e.target.value)}
                rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tecnico Operatore *</label>
              <input required type="text" value={form.tecnico || ''} onChange={e => updateField('tecnico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prossima Manutenzione</label>
              <input type="date" value={form.prossimaManutenzione || ''} onChange={e => updateField('prossimaManutenzione', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </>
        );

      case 'LibrettoImpianto':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potenza Nominale (kW) *</label>
              <input required type="number" step="0.1" value={form.potenza || ''} onChange={e => updateField('potenza', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potenza Utile (kW)</label>
              <input type="number" step="0.1" value={form.potenzaUtile || ''} onChange={e => updateField('potenzaUtile', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Generatore *</label>
              <select required value={form.tipoGeneratore || ''} onChange={e => updateField('tipoGeneratore', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                {TIPI_GENERATORE.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Combustibile</label>
              <select value={form.combustibile || ''} onChange={e => updateField('combustibile', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                <option value="metano">Metano</option>
                <option value="gpl">GPL</option>
                <option value="gasolio">Gasolio</option>
                <option value="legna">Legna</option>
                <option value="pellet">Pellet</option>
                <option value="elettrico">Elettrico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca/Modello</label>
              <input type="text" value={form.marcaModello || ''} onChange={e => updateField('marcaModello', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricola</label>
              <input type="text" value={form.matricola || ''} onChange={e => updateField('matricola', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anno Installazione</label>
              <input type="number" value={form.annoInstallazione || ''} onChange={e => updateField('annoInstallazione', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Codice Impianto (CURIT/Catasto)</label>
              <input type="text" value={form.codiceImpianto || ''} onChange={e => updateField('codiceImpianto', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Zona Climatica</label>
              <select value={form.zonaClimatica || ''} onChange={e => updateField('zonaClimatica', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                <option value="A">Zona A</option>
                <option value="B">Zona B</option>
                <option value="C">Zona C</option>
                <option value="D">Zona D</option>
                <option value="E">Zona E</option>
                <option value="F">Zona F</option>
              </select>
            </div>
          </>
        );

      case 'RapportoControllo':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Controllo *</label>
              <input required type="date" value={form.dataControllo || ''} onChange={e => updateField('dataControllo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Controllo *</label>
              <select required value={form.tipoControllo || ''} onChange={e => updateField('tipoControllo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                <option value="1">Tipo 1 - Impianti &lt; 10kW</option>
                <option value="2">Tipo 2 - Impianti 10-100kW</option>
                <option value="3">Tipo 3 - Impianti 100-1000kW</option>
                <option value="4">Tipo 4 - Impianti &gt; 1000kW</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temp. Fumi (°C)</label>
              <input type="number" step="0.1" value={form.tempFumi || ''} onChange={e => updateField('tempFumi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temp. Ambiente (°C)</label>
              <input type="number" step="0.1" value={form.tempAmbiente || ''} onChange={e => updateField('tempAmbiente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CO2 (%)</label>
              <input type="number" step="0.01" value={form.co2 || ''} onChange={e => updateField('co2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CO (ppm)</label>
              <input type="number" value={form.co || ''} onChange={e => updateField('co', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rendimento Combustione (%)</label>
              <input type="number" step="0.1" value={form.rendimento || ''} onChange={e => updateField('rendimento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiraggio (Pa)</label>
              <input type="number" step="0.1" value={form.tiraggio || ''} onChange={e => updateField('tiraggio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Esito Controllo *</label>
              <select required value={form.esito || ''} onChange={e => updateField('esito', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                {ESITI_CONTROLLO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Osservazioni</label>
              <textarea value={form.osservazioni || ''} onChange={e => updateField('osservazioni', e.target.value)}
                rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </>
        );

      case 'SchedaVerificaElettrica':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Continuità Conduttori (Ω)</label>
              <input type="number" step="0.01" value={form.continuita || ''} onChange={e => updateField('continuita', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resistenza Isolamento (MΩ)</label>
              <input type="number" step="0.01" value={form.isolamento || ''} onChange={e => updateField('isolamento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resistenza Terra (Ω)</label>
              <input type="number" step="0.01" value={form.resistenzaTerra || ''} onChange={e => updateField('resistenzaTerra', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Intervento Diff. (s)</label>
              <input type="number" step="0.01" value={form.tempoDifferenziale || ''} onChange={e => updateField('tempoDifferenziale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corrente Intervento Diff. (mA)</label>
              <input type="number" step="0.1" value={form.correnteDifferenziale || ''} onChange={e => updateField('correnteDifferenziale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resistenza Anello (Ω)</label>
              <input type="number" step="0.01" value={form.resistenzaAnello || ''} onChange={e => updateField('resistenzaAnello', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.verificaOk || false} onChange={e => updateField('verificaOk', e.target.checked)}
                  className="rounded text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Impianto conforme alla norma CEI 64-8</span>
              </label>
            </div>
          </>
        );

      case 'SchedaGas':
      case 'DichiarazioneGas':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portata Contatore (mc/h)</label>
              <input type="number" step="0.1" value={form.portataContatore || ''} onChange={e => updateField('portataContatore', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pressione Prova Tenuta (mbar)</label>
              <input type="number" step="0.1" value={form.pressioneProva || ''} onChange={e => updateField('pressioneProva', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durata Prova (min)</label>
              <input type="number" value={form.durataProva || ''} onChange={e => updateField('durataProva', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caduta Pressione (mbar)</label>
              <input type="number" step="0.01" value={form.cadutaPressione || ''} onChange={e => updateField('cadutaPressione', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.provaSuperata || false} onChange={e => updateField('provaSuperata', e.target.checked)}
                  className="rounded text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Prova di tenuta superata (nessuna perdita)</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Apparecchi Utilizzatori</label>
              <textarea value={form.apparecchi || ''} onChange={e => updateField('apparecchi', e.target.value)}
                rows={3} placeholder="Elenco apparecchi collegati..." className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ventilazione/Aerazione</label>
              <textarea value={form.ventilazione || ''} onChange={e => updateField('ventilazione', e.target.value)}
                rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </>
        );

      default:
        return (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note/Dati aggiuntivi</label>
            <textarea value={form.note || ''} onChange={e => updateField('note', e.target.value)}
              rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {scheda ? 'Modifica Scheda Tecnica' : 'Nuova Scheda Tecnica'}
          </h1>
          <p className="text-gray-500 mt-1">{config.label} - {config.norma}</p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dati Generali */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-indigo-500"></i>
            Dati Generali
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero *</label>
              <input required type="text" value={numero} onChange={e => setNumero(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Scheda *</label>
              <select required value={tipo} onChange={e => setTipo(e.target.value as TipoSchedaTecnica)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                {(Object.keys(CONFIG_SCHEDE) as TipoSchedaTecnica[]).map(t => (
                  <option key={t} value={t}>{CONFIG_SCHEDE[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Compilazione *</label>
              <input required type="date" value={dataCompilazione} onChange={e => setDataCompilazione(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
              <select value={stato} onChange={e => setStato(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="bozza">Bozza</option>
                <option value="compilata">Compilata</option>
                <option value="firmata">Firmata</option>
                <option value="archiviata">Archiviata</option>
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
              <select required value={clienteId} onChange={e => setClienteId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Seleziona...</option>
                {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impianto *</label>
              <select required value={impiantoId} onChange={e => setImpiantoId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" disabled={!clienteId}>
                <option value="">Seleziona...</option>
                {getImpiantiByCliente().map(i => <option key={i.id} value={i.id}>{i.tipologia} - {i.citta}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Validità</label>
              <input type="date" value={dataValidita} onChange={e => setDataValidita(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Campi Specifici */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className={`fas ${config.icon} text-${config.color}-500`}></i>
            Dati Specifici - {config.label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderCampiSpecifici()}
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-sticky-note text-yellow-500"></i>
            Note
          </h2>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
        </div>

        {/* Verifica Conformità */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-shield-alt text-green-500"></i>
            Verifica Conformità Scheda
          </h2>
          {(() => {
            const check = checkSchedaConformita();
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
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg">
              Annulla
            </button>
            <button type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-200">
              <i className="fas fa-save mr-2"></i>
              {scheda ? 'Aggiorna' : 'Salva'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
