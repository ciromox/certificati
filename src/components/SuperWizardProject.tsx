import { useState } from 'react';
import { Cliente, Impianto, Certificato, Tecnico, TipologiaImpianto } from '../types';
import { SchedaTecnica } from '../schedeTecniche';
import { SchedaTipo, SCHEDE_DEFINIZIONI } from '../schedeFields';
import SchedaFormDinamico from './SchedaFormDinamico';
import { generateNumeroCertificato } from '../store';

interface SuperWizardProjectProps {
  clienti: Cliente[];
  impianti: Impianto[];
  tecnico: Tecnico | null;
  certificati: Certificato[];
  schede: SchedaTecnica[];
  ditte: any[];
  onComplete: (projectData: {
    cliente: Cliente;
    impianto: Impianto;
    certificato: any;
    schede: SchedaTecnica[];
  }) => void;
  onCancel: () => void;
  onCreaCliente: (cliente: Omit<Cliente, 'id' | 'dataCreazione'>) => void;
  onCreaImpianto: (impianto: Omit<Impianto, 'id' | 'dataCreazione'>) => void;
  onCreaDitta: (ditta: any) => void;
}

type Step = 'dati-base' | 'checklist' | 'compilazione' | 'completa';

// Definisce quali schede sono necessarie per ogni tipo di impianto
const SCHEDE_NECESSARIE: Record<TipologiaImpianto, SchedaTipo[]> = {
  'elettrico': ['dico_elettrico', 'verifica_elettrica', 'registro_manutenzione'],
  'gas': ['dico_gas', 'registro_manutenzione'],
  'idrico-sanitario': ['dico_idrico', 'registro_manutenzione'],
  'riscaldamento': ['dico_termico', 'libretto_impianto', 'rapporto_controllo', 'registro_manutenzione'],
  'climatizzazione': ['dico_termico', 'libretto_impianto', 'rapporto_controllo', 'registro_manutenzione'],
  'fgas': ['dico_fgas', 'registro_manutenzione'],
  'antincendio': ['dico_antincendio', 'registro_manutenzione'],
  'antifurto': ['dico_antifurto', 'registro_manutenzione'],
  'ascensori': ['registro_manutenzione'],
};

export default function SuperWizardProject({
  clienti,
  impianti,
  tecnico,
  certificati,
  ditte,
  onComplete,
  onCancel,
  onCreaCliente,
  onCreaImpianto,
  onCreaDitta,
}: SuperWizardProjectProps) {
  const [currentStep, setCurrentStep] = useState<Step>('dati-base');
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [selectedImpiantoId, setSelectedImpiantoId] = useState<string>('');
  const [selectedDittaId, setSelectedDittaId] = useState<string>('');
  const [showCreaCliente, setShowCreaCliente] = useState(false);
  const [showCreaImpianto, setShowCreaImpianto] = useState(false);
  const [showCreaDitta, setShowCreaDitta] = useState(false);
  
  // Schede da compilare
  const [schedeDaCompilare, setSchedeDaCompilare] = useState<SchedaTipo[]>([]);
  const [schedeCompletate, setSchedeCompletate] = useState<Record<string, any>>({});
  const [schedaCorrente, setSchedaCorrente] = useState<number>(0);
  
  // Dati certificato
  const [descrizioneLavoro, setDescrizioneLavoro] = useState('');
  const [materialiUtilizzati, setMaterialiUtilizzati] = useState<any[]>([]);
  const [verificheEffettuate, setVerificheEffettuate] = useState('');

  const clienteSelezionato = clienti.find(c => c.id === selectedClienteId);
  const impiantoSelezionato = impianti.find(i => i.id === selectedImpiantoId);
  const dittaSelezionata = ditte.find(d => d.id === selectedDittaId);

  // Determina le schede necessarie in base al tipo di impianto
  const determinaSchedeNecessarie = () => {
    if (!impiantoSelezionato) return;
    const tipoImpianto = impiantoSelezionato.tipologia;
    const schedeNecessarie = SCHEDE_NECESSARIE[tipoImpianto] || ['registro_manutenzione'];
    setSchedeDaCompilare(schedeNecessarie);
  };

  const handleImpiantoSelect = (id: string) => {
    setSelectedImpiantoId(id);
    // Reset schede quando cambia impianto
    setSchedeCompletate({});
    setSchedaCorrente(0);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'dati-base':
        if (selectedClienteId && selectedImpiantoId && selectedDittaId) {
          determinaSchedeNecessarie();
          setCurrentStep('checklist');
        }
        break;
      case 'checklist':
        setCurrentStep('compilazione');
        setSchedaCorrente(0);
        break;
      case 'compilazione':
        setCurrentStep('completa');
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case 'checklist':
        setCurrentStep('dati-base');
        break;
      case 'compilazione':
        if (schedaCorrente > 0) {
          setSchedaCorrente(schedaCorrente - 1);
        } else {
          setCurrentStep('checklist');
        }
        break;
      case 'completa':
        setCurrentStep('compilazione');
        break;
    }
  };

  // Quando una scheda viene completata
  const handleSchedaCompletata = (tipoScheda: SchedaTipo, dati: any) => {
    setSchedeCompletate(prev => ({
      ...prev,
      [tipoScheda]: dati,
    }));
    
    // Passa alla scheda successiva
    if (schedaCorrente < schedeDaCompilare.length - 1) {
      setSchedaCorrente(schedaCorrente + 1);
    } else {
      setCurrentStep('completa');
    }
  };

  const handleCompleteProject = () => {
    const numeroCertificato = generateNumeroCertificato('DiCo', certificati);
    
    // Crea il certificato con i dati inseriti
    const certificato = {
      numero: numeroCertificato,
      tipo: 'DiCo' as const,
      impiantoId: selectedImpiantoId,
      clienteId: selectedClienteId,
      dataRilascio: new Date().toISOString().split('T')[0],
      stato: 'emesso' as const,
      
      // Dati Dichiarante (Ditta)
      dichiaranteNome: dittaSelezionata?.legaleRappresentanteNome || '',
      dichiaranteCognome: dittaSelezionata?.legaleRappresentanteCognome || '',
      dichiaranteRuolo: 'titolare' as const,
      impresaRagioneSociale: dittaSelezionata?.ragioneSociale || '',
      impresaSettore: dittaSelezionata?.settore || '',
      impresaSedeLegaleIndirizzo: dittaSelezionata?.indirizzo || '',
      impresaSedeLegaleNumero: dittaSelezionata?.numeroCivico || '',
      impresaSedeLegaleComune: dittaSelezionata?.citta || '',
      impresaSedeLegaleProvincia: dittaSelezionata?.provincia || '',
      impresaSedeLegaleCAP: dittaSelezionata?.cap || '',
      impresaPartitaIVA: dittaSelezionata?.partitaIva || '',
      impresaCodiceFiscale: dittaSelezionata?.codiceFiscale || '',
      impresaIscrizioneCCIAA: dittaSelezionata?.cciaa || '',
      impresaIscrizioneCCIAANumero: dittaSelezionata?.cciaaNumero || '',
      impresaIscrizioneAlboArtigiani: dittaSelezionata?.alboArtigiani || '',
      impresaIscrizioneAlboArtigianiNumero: dittaSelezionata?.alboArtigianiNumero || '',
      
      // Dati Impianto
      descrizioneImpianto: impiantoSelezionato?.tipologia || '',
      tipoIntervento: 'nuovo' as const,
      
      // Dati Committente
      committenteNome: clienteSelezionato?.nome || '',
      committenteCognome: clienteSelezionato?.cognome || '',
      committenteRagioneSociale: clienteSelezionato?.ragioneSociale || '',
      
      // Dati Ubicazione
      ubicazioneComune: impiantoSelezionato?.citta || '',
      ubicazioneProvincia: impiantoSelezionato?.provincia || '',
      ubicazioneIndirizzo: impiantoSelezionato?.indirizzo || '',
      ubicazioneNumero: '',
      
      // Dati Proprietario
      proprietarioNome: clienteSelezionato?.nome || '',
      proprietarioCognome: clienteSelezionato?.cognome || '',
      proprietarioRagioneSociale: clienteSelezionato?.ragioneSociale || '',
      
      // Dati Edificio
      usoEdificio: 'civile' as const,
      
      // Dichiarazione
      rispettatoProgetto: true,
      seguitoNormativaTecnica: true,
      installatoComponentiRegolaArte: true,
      controllatoImpiantoSicurezza: true,
      
      // Allegati
      allegatoProgetto: true,
      allegatoRelazioneMateriali: true,
      allegatoSchemaImpianto: true,
      allegatoDichiarazioniPrecedenti: false,
      allegatoCertificatoRequisiti: true,
      
      // Dati Tecnici
      descrizioneLavoro,
      materialiUtilizzati,
      verificheEffettuate,
      conformitaNorme: [],
      tecnicoResponsabile: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
      abilitazioneTecnico: tecnico?.abilitazione || '',
      firmaTecnico: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
    };

    // Crea le schede tecniche collegate
    const schedeCollegate: SchedaTecnica[] = Object.entries(schedeCompletate).map(([tipo, dati], index) => ({
      id: Date.now().toString() + index,
      numero: `${numeroCertificato}-ALL-${index + 1}`,
      tipo: tipo as any,
      impiantoId: selectedImpiantoId,
      clienteId: selectedClienteId,
      dataCompilazione: new Date().toISOString().split('T')[0],
      stato: 'firmata' as const,
      tecnicoId: '',
      dati,
      dataCreazione: new Date().toISOString(),
      dataModifica: new Date().toISOString(),
    }));

    onComplete({
      cliente: clienteSelezionato!,
      impianto: impiantoSelezionato!,
      certificato,
      schede: schedeCollegate,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'dati-base':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Dati Base della Pratica</h3>
            
            {/* Selezione Ditta */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-industry text-cyan-500"></i>
                1. Seleziona Ditta Installatrice
              </h4>
              <div className="flex gap-2">
                <select
                  value={selectedDittaId}
                  onChange={(e) => setSelectedDittaId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleziona una ditta --</option>
                  {ditte.filter(d => d.attivo).map(d => (
                    <option key={d.id} value={d.id}>
                      {d.ragioneSociale} - {d.settore} ({d.citta})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCreaDitta(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fas fa-plus"></i> Nuova
                </button>
              </div>
              {dittaSelezionata && (
                <div className="mt-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-sm">
                  <p><strong>{dittaSelezionata.ragioneSociale}</strong></p>
                  <p className="text-xs text-gray-600">P.IVA: {dittaSelezionata.partitaIva}</p>
                  <p className="text-xs text-gray-600">{dittaSelezionata.indirizzo} {dittaSelezionata.numeroCivico}, {dittaSelezionata.citta}</p>
                </div>
              )}
            </div>

            {/* Selezione Committente */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-user text-blue-500"></i>
                2. Seleziona Committente
              </h4>
              <div className="flex gap-2">
                <select
                  value={selectedClienteId}
                  onChange={(e) => {
                    setSelectedClienteId(e.target.value);
                    setSelectedImpiantoId('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleziona un committente --</option>
                  {clienti.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome} {c.cognome} {c.ragioneSociale ? `(${c.ragioneSociale})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCreaCliente(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fas fa-plus"></i> Nuovo
                </button>
              </div>
              {clienteSelezionato && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p><strong>{clienteSelezionato.nome} {clienteSelezionato.cognome}</strong></p>
                  <p className="text-xs text-gray-600">CF: {clienteSelezionato.codiceFiscale}</p>
                  <p className="text-xs text-gray-600">{clienteSelezionato.indirizzo}, {clienteSelezionato.citta}</p>
                </div>
              )}
            </div>

            {/* Selezione Impianto */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-building text-green-500"></i>
                3. Seleziona Impianto
              </h4>
              <div className="flex gap-2">
                <select
                  value={selectedImpiantoId}
                  onChange={(e) => handleImpiantoSelect(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedClienteId}
                >
                  <option value="">-- Seleziona un impianto --</option>
                  {impianti.filter(i => i.clienteId === selectedClienteId).map(i => (
                    <option key={i.id} value={i.id}>
                      {i.tipologia} - {i.citta}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCreaImpianto(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fas fa-plus"></i> Nuovo
                </button>
              </div>
              {impiantoSelezionato && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <p><strong>{impiantoSelezionato.tipologia}</strong></p>
                  <p className="text-xs text-gray-600">{impiantoSelezionato.destinazioneUso}</p>
                  <p className="text-xs text-gray-600">{impiantoSelezionato.indirizzo}, {impiantoSelezionato.citta}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Checklist Schede da Compilare</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-info-circle mr-2"></i>
                In base al tipo di impianto <strong>{impiantoSelezionato?.tipologia}</strong>, devi compilare manualmente le seguenti {schedeDaCompilare.length} schede tecniche.
                Ogni scheda verrà aperta in compilazione completa con tutti i campi specifici.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Schede Necessarie:</h4>
              <div className="space-y-3">
                {schedeDaCompilare.map((tipo, index) => {
                  const def = SCHEDE_DEFINIZIONI[tipo];
                  return (
                    <div key={tipo} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{def?.titolo || tipo}</p>
                        <p className="text-xs text-gray-600 mt-1">{def?.norma || ''}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {def?.sezioni.length || 0} sezioni • {def?.sezioni.reduce((acc, s) => acc + s.campi.length, 0) || 0} campi da compilare
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-lightbulb mr-2"></i>
                <strong>Prossimo passo:</strong> Compilerai OGNI scheda manualmente, sezione per sezione, con tutti i campi specifici richiesti dalla normativa.
              </p>
            </div>
          </div>
        );

      case 'compilazione':
        const tipoSchedaCorrente = schedeDaCompilare[schedaCorrente];
        const defSchedaCorrente = SCHEDE_DEFINIZIONI[tipoSchedaCorrente];
        
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  Compilazione Scheda {schedaCorrente + 1} di {schedeDaCompilare.length}
                </h3>
                <span className="text-sm text-gray-500">
                  {Math.round(((schedaCorrente + 1) / schedeDaCompilare.length) * 100)}% completato
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((schedaCorrente + 1) / schedeDaCompilare.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-sm text-indigo-800">
                <i className="fas fa-edit mr-2"></i>
                <strong>Stai compilando:</strong> {defSchedaCorrente?.titolo || tipoSchedaCorrente}
              </p>
              <p className="text-xs text-indigo-700 mt-1">
                {defSchedaCorrente?.norma || ''} - {defSchedaCorrente?.descrizione || ''}
              </p>
            </div>

            {/* Form di compilazione scheda */}
            <SchedaFormDinamico
              tipoScheda={tipoSchedaCorrente}
              datiIniziali={schedeCompletate[tipoSchedaCorrente] || {}}
              onSave={(dati) => handleSchedaCompletata(tipoSchedaCorrente, dati)}
              onCancel={() => {}}
            />
          </div>
        );

      case 'completa':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Dati Finali e Completamento</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <i className="fas fa-check-circle mr-2"></i>
                <strong>Tutte le {schedeDaCompilare.length} schede sono state compilate!</strong> Ora inserisci i dati finali per completare la pratica.
              </p>
            </div>

            {/* Dati finali certificato */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-800 mb-3">Dati Finali Dichiarazione</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione Lavori Eseguiti *</label>
                <textarea
                  value={descrizioneLavoro}
                  onChange={(e) => setDescrizioneLavoro(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrivi dettagliatamente i lavori eseguiti sull'impianto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verifiche e Collaudi Effettuati *</label>
                <textarea
                  value={verificheEffettuate}
                  onChange={(e) => setVerificheEffettuate(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrivi le verifiche e i collaudi effettuati..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materiali Utilizzati</label>
                <p className="text-xs text-gray-500 mb-2">I materiali sono stati già inseriti nelle schede tecniche. Qui puoi aggiungere note aggiuntive se necessario.</p>
              </div>
            </div>

            {/* Riepilogo */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3">Riepilogo Pratica</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Ditta:</strong> {dittaSelezionata?.ragioneSociale}</p>
                <p><strong>Committente:</strong> {clienteSelezionato?.nome} {clienteSelezionato?.cognome}</p>
                <p><strong>Impianto:</strong> {impiantoSelezionato?.tipologia} - {impiantoSelezionato?.citta}</p>
                <p><strong>Schede compilate:</strong> {Object.keys(schedeCompletate).length} di {schedeDaCompilare.length}</p>
                <ul className="ml-6 list-disc text-xs space-y-1">
                  {schedeDaCompilare.map((tipo, i) => (
                    <li key={i}>
                      {SCHEDE_DEFINIZIONI[tipo]?.titolo || tipo}
                      {schedeCompletate[tipo] && <span className="text-green-600 ml-2">✓ Completata</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Cliccando su "Completa Pratica" verrà generato:
              </p>
              <ul className="mt-2 ml-6 list-disc text-xs text-blue-700 space-y-1">
                <li>Dichiarazione di Conformità principale con numero univoco</li>
                <li>Tutte le schede tecniche come allegati numerati</li>
                <li>Pratica completa e conforme al D.M. 37/08</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'dati-base': return !!selectedClienteId && !!selectedImpiantoId && !!selectedDittaId;
      case 'checklist': return true;
      case 'compilazione': return false; // Gestito dal SchedaFormDinamico
      case 'completa': return !!descrizioneLavoro && !!verificheEffettuate;
      default: return false;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <i className="fas fa-magic"></i>
                  Wizard Creazione Pratica Completa
                </h2>
                <p className="text-purple-200 text-sm mt-1">
                  Compilazione guidata di tutte le schede necessarie per la dichiarazione di conformità
                </p>
              </div>
              <button onClick={onCancel} className="text-white hover:text-purple-200">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-100 p-4 border-b">
            <div className="flex items-center justify-between">
              {['dati-base', 'checklist', 'compilazione', 'completa'].map((step, index) => {
                const stepNames = ['Dati Base', 'Checklist', 'Compilazione', 'Completamento'];
                const isActive = currentStep === step;
                const isPast = ['dati-base', 'checklist', 'compilazione', 'completa'].indexOf(currentStep) > index;
                
                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-purple-600 text-white' :
                      isPast ? 'bg-green-600 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isPast ? <i className="fas fa-check"></i> : <span>{index + 1}</span>}
                    </div>
                    <span className="text-xs mt-1 text-center">{stepNames[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStep()}
          </div>

          {/* Footer */}
          {currentStep !== 'compilazione' && (
            <div className="border-t p-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 'dati-base'}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Indietro
              </button>
              {currentStep === 'completa' ? (
                <button
                  type="button"
                  onClick={handleCompleteProject}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-check mr-2"></i>
                  Completa Pratica
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Avanti
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Crea Cliente */}
      {showCreaCliente && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Crea Nuovo Committente</h2>
              <button onClick={() => setShowCreaCliente(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onCreaCliente({
                nome: formData.get('nome') as string,
                cognome: formData.get('cognome') as string,
                ragioneSociale: formData.get('ragioneSociale') as string || undefined,
                codiceFiscale: formData.get('codiceFiscale') as string,
                partitaIva: formData.get('partitaIva') as string || undefined,
                indirizzo: formData.get('indirizzo') as string,
                citta: formData.get('citta') as string,
                cap: formData.get('cap') as string,
                provincia: formData.get('provincia') as string,
                telefono: formData.get('telefono') as string || undefined,
                email: formData.get('email') as string || undefined,
              });
              setShowCreaCliente(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input required name="nome" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                  <input required name="cognome" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale</label>
                  <input name="ragioneSociale" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
                  <input required name="codiceFiscale" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA</label>
                  <input name="partitaIva" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
                  <input required name="indirizzo" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                  <input required name="citta" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                    <input required name="cap" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                    <input required name="provincia" type="text" maxLength={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input name="telefono" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowCreaCliente(false)} className="px-4 py-2 text-gray-600">
                  Annulla
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <i className="fas fa-save mr-2"></i>
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crea Impianto */}
      {showCreaImpianto && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Crea Nuovo Impianto</h2>
              <button onClick={() => setShowCreaImpianto(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onCreaImpianto({
                tipologia: formData.get('tipologia') as any,
                destinazioneUso: formData.get('destinazioneUso') as string,
                indirizzo: formData.get('indirizzo') as string,
                citta: formData.get('citta') as string,
                cap: formData.get('cap') as string,
                provincia: formData.get('provincia') as string,
                caratteristiche: formData.get('caratteristiche') as string || '',
                clienteId: selectedClienteId,
              });
              setShowCreaImpianto(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipologia *</label>
                  <select required name="tipologia" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Seleziona...</option>
                    <option value="elettrico">Elettrico</option>
                    <option value="gas">Gas</option>
                    <option value="idrico-sanitario">Idrico-Sanitario</option>
                    <option value="riscaldamento">Riscaldamento</option>
                    <option value="climatizzazione">Climatizzazione</option>
                    <option value="fgas">F-Gas</option>
                    <option value="antincendio">Antincendio</option>
                    <option value="antifurto">Antifurto</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinazione d'uso *</label>
                  <input required name="destinazioneUso" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
                  <input required name="indirizzo" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                  <input required name="citta" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                    <input required name="cap" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                    <input required name="provincia" type="text" maxLength={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caratteristiche</label>
                  <textarea name="caratteristiche" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowCreaImpianto(false)} className="px-4 py-2 text-gray-600">
                  Annulla
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <i className="fas fa-save mr-2"></i>
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crea Ditta */}
      {showCreaDitta && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Crea Nuova Ditta Installatrice</h2>
              <button onClick={() => setShowCreaDitta(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onCreaDitta({
                ragioneSociale: formData.get('ragioneSociale') as string,
                partitaIva: formData.get('partitaIva') as string,
                codiceFiscale: formData.get('codiceFiscale') as string || undefined,
                indirizzo: formData.get('indirizzo') as string,
                numeroCivico: formData.get('numeroCivico') as string,
                citta: formData.get('citta') as string,
                provincia: formData.get('provincia') as string,
                cap: formData.get('cap') as string,
                telefono: formData.get('telefono') as string,
                email: formData.get('email') as string,
                settore: formData.get('settore') as string,
                abilitazioni: [],
                legaleRappresentanteNome: formData.get('legaleNome') as string,
                legaleRappresentanteCognome: formData.get('legaleCognome') as string,
                legaleRappresentanteCF: formData.get('legaleCF') as string,
                attivo: true,
              });
              setShowCreaDitta(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale *</label>
                  <input required name="ragioneSociale" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA *</label>
                  <input required name="partitaIva" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale</label>
                  <input name="codiceFiscale" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Settore *</label>
                  <input required name="settore" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
                  <div className="flex gap-2">
                    <input required name="indirizzo" type="text" placeholder="Via/Piazza" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <input required name="numeroCivico" type="text" placeholder="N." className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                  <input required name="citta" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                    <input required name="provincia" type="text" maxLength={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                    <input required name="cap" type="text" maxLength={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input required name="telefono" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2 border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Legale Rappresentante</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input required name="legaleNome" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                  <input required name="legaleCognome" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
                  <input required name="legaleCF" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowCreaDitta(false)} className="px-4 py-2 text-gray-600">
                  Annulla
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <i className="fas fa-save mr-2"></i>
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
