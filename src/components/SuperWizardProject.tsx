import { useState } from 'react';
import { Cliente, Impianto, Certificato, Tecnico, TipologiaImpianto } from '../types';
import { SchedaTecnica } from '../schedeTecniche';
import { TipoSchedaCompleta, SCHEDE_COMPLETE_CONFIG } from '../schedeComplete';
import WizardSchedaCompleta from './WizardSchedaCompleta';
import { generateNumeroCertificato } from '../store';

interface SuperWizardProjectProps {
  clienti: Cliente[];
  impianti: Impianto[];
  tecnico: Tecnico | null;
  certificati: Certificato[];
  schede: SchedaTecnica[];
  onComplete: (data: {
    cliente: Cliente;
    impianto: Impianto;
    certificato: any;
    schede: SchedaTecnica[];
  }) => void;
  onCancel: () => void;
  onCreaCliente: (cliente: Omit<Cliente, 'id' | 'dataCreazione'>) => void;
  onCreaImpianto: (impianto: Omit<Impianto, 'id' | 'dataCreazione'>) => void;
}

type Step = 'cliente' | 'impianto' | 'certificato' | 'schede' | 'completa';

export default function SuperWizardProject({
  clienti,
  impianti,
  tecnico,
  certificati,
  schede,
  onComplete,
  onCancel,
  onCreaCliente,
  onCreaImpianto,
}: SuperWizardProjectProps) {
  const [currentStep, setCurrentStep] = useState<Step>('cliente');
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [selectedImpiantoId, setSelectedImpiantoId] = useState<string>('');
  const [showCreaCliente, setShowCreaCliente] = useState(false);
  const [showCreaImpianto, setShowCreaImpianto] = useState(false);
  const [schedeDaCompilare, setSchedeDaCompilare] = useState<TipoSchedaCompleta[]>([]);
  const [schedaCorrenteIndex, setSchedaCorrenteIndex] = useState(0);
  const [schedeCompletate, setSchedeCompletate] = useState<any[]>([]);
  const [certificatoData, setCertificatoData] = useState<any>({});

  const clienteSelezionato = clienti.find(c => c.id === selectedClienteId);
  const impiantoSelezionato = impianti.find(i => i.id === selectedImpiantoId);

  // Determina quali schede sono necessarie in base al tipo di impianto
  const getSchedeNecessarie = (tipoImpianto: string): TipoSchedaCompleta[] => {
    const schedeBase: TipoSchedaCompleta[] = [];
    
    switch (tipoImpianto) {
      case 'elettrico':
        schedeBase.push('DiCo_Elettrico', 'Verifica_Impianto_Elettrico');
        break;
      case 'gas':
        schedeBase.push('DiCo_Gas', 'Scheda_Impianto_Gas');
        break;
      case 'idrico-sanitario':
        schedeBase.push('DiCo_Idrico');
        break;
      case 'riscaldamento':
      case 'climatizzazione':
        schedeBase.push('DiCo_Termico', 'Libretto_Impianto', 'Rapporto_Controllo');
        break;
      case 'fgas':
        schedeBase.push('DiCo_FGas', 'Registro_FGas', 'Dichiarazione_FGas');
        break;
      case 'antincendio':
        schedeBase.push('DiCo_Antincendio');
        break;
      case 'antifurto':
        schedeBase.push('DiCo_Antifurto');
        break;
      default:
        schedeBase.push('DiCo_Elettrico');
    }
    
    // Schede comuni a tutti
    schedeBase.push('Registro_Manutenzione', 'Progetto_Impianto', 'Relazione_Tecnica');
    
    return schedeBase;
  };

  const handleClienteSelect = (id: string) => {
    setSelectedClienteId(id);
    setSelectedImpiantoId(''); // Reset impianto quando cambia cliente
  };

  const handleImpiantoSelect = (id: string) => {
    setSelectedImpiantoId(id);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'cliente':
        if (selectedClienteId) setCurrentStep('impianto');
        break;
      case 'impianto':
        if (selectedImpiantoId) {
          const impianto = impianti.find(i => i.id === selectedImpiantoId);
          if (impianto) {
            const schedeNecessarie = getSchedeNecessarie(impianto.tipologia);
            setSchedeDaCompilare(schedeNecessarie);
            setCurrentStep('certificato');
          }
        }
        break;
      case 'certificato':
        setCurrentStep('schede');
        setSchedaCorrenteIndex(0);
        break;
      case 'schede':
        setCurrentStep('completa');
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case 'impianto':
        setCurrentStep('cliente');
        break;
      case 'certificato':
        setCurrentStep('impianto');
        break;
      case 'schede':
        if (schedaCorrenteIndex > 0) {
          setSchedaCorrenteIndex(schedaCorrenteIndex - 1);
        } else {
          setCurrentStep('certificato');
        }
        break;
      case 'completa':
        setCurrentStep('schede');
        break;
    }
  };

  const handleSchedaComplete = (dati: any) => {
    const nuovaScheda = {
      id: Date.now().toString(),
      numero: `${schedeDaCompilare[schedaCorrenteIndex]}-${Date.now().toString().slice(-6)}`,
      tipo: schedeDaCompilare[schedaCorrenteIndex],
      impiantoId: selectedImpiantoId,
      clienteId: selectedClienteId,
      dataCompilazione: new Date().toISOString().split('T')[0],
      stato: 'firmata' as const,
      tecnicoId: '',
      dati,
      dataCreazione: new Date().toISOString(),
      dataModifica: new Date().toISOString(),
    };
    
    setSchedeCompletate([...schedeCompletate, nuovaScheda]);
    
    if (schedaCorrenteIndex < schedeDaCompilare.length - 1) {
      setSchedaCorrenteIndex(schedaCorrenteIndex + 1);
    } else {
      setCurrentStep('completa');
    }
  };

  const handleCompleteProject = () => {
    const numeroCertificato = generateNumeroCertificato('DiCo', certificati);
    
    // Crea il certificato con tutti i campi obbligatori del modello ministeriale
    const certificato = {
      numero: numeroCertificato,
      tipo: 'DiCo' as const,
      impiantoId: selectedImpiantoId,
      clienteId: selectedClienteId,
      dataRilascio: new Date().toISOString().split('T')[0],
      stato: 'emesso' as const,
      
      // Dati Dichiarante (Ditta Installatrice)
      dichiaranteNome: tecnico?.nome || '',
      dichiaranteCognome: tecnico?.cognome || '',
      dichiaranteRuolo: 'titolare' as const,
      impresaRagioneSociale: tecnico?.azienda || '',
      impresaSettore: impiantoSelezionato?.tipologia || '',
      impresaSedeLegaleIndirizzo: tecnico?.indirizzo || '',
      impresaSedeLegaleNumero: '',
      impresaSedeLegaleComune: tecnico?.citta || '',
      impresaSedeLegaleProvincia: tecnico?.provincia || '',
      impresaSedeLegaleCAP: tecnico?.cap || '',
      impresaPartitaIVA: tecnico?.partitaIva || '',
      impresaCodiceFiscale: tecnico?.codiceFiscale || '',
      impresaIscrizioneCCIAA: '',
      impresaIscrizioneCCIAANumero: '',
      impresaIscrizioneAlboArtigiani: '',
      impresaIscrizioneAlboArtigianiNumero: '',
      
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
      
      // Dati Proprietario (stesso del committente se non specificato)
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
      
      // Allegati Obbligatori
      allegatoProgetto: true,
      allegatoRelazioneMateriali: true,
      allegatoSchemaImpianto: true,
      allegatoDichiarazioniPrecedenti: false,
      allegatoCertificatoRequisiti: true,
      
      // Dati Tecnici
      descrizioneLavoro: certificatoData.descrizioneLavoro || '',
      materialiUtilizzati: certificatoData.materialiUtilizzati || [],
      verificheEffettuate: certificatoData.verificheEffettuate || '',
      conformitaNorme: certificatoData.conformitaNorme || [],
      tecnicoResponsabile: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
      abilitazioneTecnico: tecnico?.abilitazione || '',
      firmaTecnico: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
    };

    // Collega tutte le schede allo stesso numero DiCo
    const schedeCollegate = schedeCompletate.map(scheda => ({
      ...scheda,
      certificatoId: numeroCertificato,
      numero: `${numeroCertificato}-ALL-${schedeCompletate.indexOf(scheda) + 1}`
    }));

    onComplete({
      cliente: clienteSelezionato!,
      impianto: impiantoSelezionato!,
      certificato,
      schede: schedeCollegate,
    });
  };

  const handleCreaClienteInline = (clienteData: Omit<Cliente, 'id' | 'dataCreazione'>) => {
    onCreaCliente(clienteData);
    setShowCreaCliente(false);
    // Il nuovo cliente verrà selezionato automaticamente dopo il refresh
  };

  const handleCreaImpiantoInline = (impiantoData: Omit<Impianto, 'id' | 'dataCreazione'>) => {
    onCreaImpianto({ ...impiantoData, clienteId: selectedClienteId });
    setShowCreaImpianto(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'cliente':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Seleziona Committente</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={selectedClienteId}
                  onChange={(e) => handleClienteSelect(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleziona un cliente --</option>
                  {clienti.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome} {c.cognome} {c.ragioneSociale ? `(${c.ragioneSociale})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCreaCliente(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  title="Crea nuovo cliente"
                >
                  <i className="fas fa-plus"></i> Nuovo
                </button>
              </div>
              {clienteSelezionato && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Dati Cliente Selezionato</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Nome:</strong> {clienteSelezionato.nome} {clienteSelezionato.cognome}</div>
                    <div><strong>C.F.:</strong> {clienteSelezionato.codiceFiscale}</div>
                    <div className="col-span-2"><strong>Indirizzo:</strong> {clienteSelezionato.indirizzo}, {clienteSelezionato.citta}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'impianto':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Seleziona Impianto</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={selectedImpiantoId}
                  onChange={(e) => handleImpiantoSelect(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  title="Crea nuovo impianto"
                >
                  <i className="fas fa-plus"></i> Nuovo
                </button>
              </div>
              {impiantoSelezionato && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Dati Impianto Selezionato</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Tipologia:</strong> {impiantoSelezionato.tipologia}</div>
                    <div><strong>Destinazione:</strong> {impiantoSelezionato.destinazioneUso}</div>
                    <div className="col-span-2"><strong>Indirizzo:</strong> {impiantoSelezionato.indirizzo}, {impiantoSelezionato.citta}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700">
                      <i className="fas fa-info-circle mr-1"></i>
                      Schede necessarie: {getSchedeNecessarie(impiantoSelezionato.tipologia).length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'certificato':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Dati Certificato</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-list-check mr-2"></i>
                Verranno compilate automaticamente {schedeDaCompilare.length} schede tecniche necessarie per questo progetto.
              </p>
              <ul className="mt-2 ml-6 list-disc text-xs text-yellow-700 space-y-1">
                {schedeDaCompilare.map((tipo, i) => (
                  <li key={i}>{SCHEDE_COMPLETE_CONFIG[tipo]?.label || tipo}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione Lavori</label>
                <textarea
                  value={certificatoData.descrizioneLavoro || ''}
                  onChange={(e) => setCertificatoData({...certificatoData, descrizioneLavoro: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrizione sintetica dei lavori eseguiti..."
                />
              </div>
            </div>
          </div>
        );

      case 'schede':
        const tipoSchedaCorrente = schedeDaCompilare[schedaCorrenteIndex] as TipoSchedaCompleta;
        const configScheda = SCHEDE_COMPLETE_CONFIG[tipoSchedaCorrente];
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Compilazione Scheda {schedaCorrenteIndex + 1} di {schedeDaCompilare.length}
              </h3>
              <span className="text-sm text-gray-500">
                {configScheda?.label || tipoSchedaCorrente}
              </span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-sm text-indigo-800">
                <i className="fas fa-info-circle mr-2"></i>
                Progresso: {Math.round(((schedaCorrenteIndex + 1) / schedeDaCompilare.length) * 100)}%
              </p>
            </div>
            {configScheda && (
              <WizardSchedaCompleta
                config={configScheda}
                onComplete={handleSchedaComplete}
                onCancel={() => {}}
              />
            )}
          </div>
        );

      case 'completa':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Riepilogo Progetto</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">
                <i className="fas fa-check-circle mr-2"></i>
                Progetto Pronto per la Finalizzazione
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Committente:</strong> {clienteSelezionato?.nome} {clienteSelezionato?.cognome}</p>
                <p><strong>Impianto:</strong> {impiantoSelezionato?.tipologia} - {impiantoSelezionato?.citta}</p>
                <p><strong>Schede Compilate:</strong> {schedeCompletate.length}</p>
                <ul className="ml-6 list-disc text-xs space-y-1">
                  {schedeCompletate.map((s, i) => (
                    <li key={i}>{SCHEDE_COMPLETE_CONFIG[s.tipo as TipoSchedaCompleta]?.label || s.tipo}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Cliccando su "Completa Progetto" verrà generato:
              </p>
              <ul className="mt-2 ml-6 list-disc text-xs text-blue-700 space-y-1">
                <li>Dichiarazione di Conformità principale</li>
                <li>Tutte le schede tecniche come allegati</li>
                <li>Elenco materiali conforme D.M. 37/08</li>
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
      case 'cliente': return !!selectedClienteId;
      case 'impianto': return !!selectedImpiantoId;
      case 'certificato': return true;
      case 'schede': return false; // Gestito dal WizardSchedaCompleta
      case 'completa': return true;
      default: return false;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <i className="fas fa-magic"></i>
                  Super Wizard Progetto Completo
                </h2>
                <p className="text-purple-200 text-sm mt-1">
                  Compilazione automatica di tutte le schede necessarie
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
              {['cliente', 'impianto', 'certificato', 'schede', 'completa'].map((step, index) => {
                const stepNames = ['Committente', 'Impianto', 'Certificato', 'Schede', 'Completa'];
                const isActive = currentStep === step;
                const isPast = ['cliente', 'impianto', 'certificato', 'schede', 'completa'].indexOf(currentStep) > index;
                
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
            {currentStep !== 'schede' && renderStep()}
          </div>

          {/* Footer */}
          {currentStep !== 'schede' && (
            <div className="border-t p-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 'cliente'}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Indietro
              </button>
              {currentStep === 'completa' ? (
                <button
                  type="button"
                  onClick={handleCompleteProject}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fas fa-check mr-2"></i>
                  Completa Progetto
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

      {/* Modal Crea Cliente Inline */}
      {showCreaCliente && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Crea Nuovo Cliente</h2>
              <button onClick={() => setShowCreaCliente(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreaClienteInline({
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
                  Crea e Seleziona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crea Impianto Inline */}
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
              const nuovoImpianto: Omit<Impianto, 'id' | 'dataCreazione'> = {
                tipologia: formData.get('tipologia') as TipologiaImpianto,
                destinazioneUso: formData.get('destinazioneUso') as string,
                indirizzo: formData.get('indirizzo') as string,
                citta: formData.get('citta') as string,
                cap: formData.get('cap') as string,
                provincia: formData.get('provincia') as string,
                caratteristiche: (formData.get('caratteristiche') as string) || '',
                clienteId: selectedClienteId,
              };
              handleCreaImpiantoInline(nuovoImpianto);
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
                  Crea e Seleziona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
