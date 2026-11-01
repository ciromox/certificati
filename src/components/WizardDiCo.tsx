import { useState } from 'react';
import { Cliente, Impianto, Tecnico } from '../types';
import { generateNumeroCertificato } from '../store';
import { Certificato } from '../types';

interface WizardDiCoProps {
  clienti: Cliente[];
  impianti: Impianto[];
  tecnico: Tecnico | null;
  certificati: Certificato[];
  onComplete: (certificato: any, allegati: File[]) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Dati Generali', icon: 'fas fa-info-circle' },
  { id: 2, title: 'Committente', icon: 'fas fa-user' },
  { id: 3, title: 'Impianto', icon: 'fas fa-building' },
  { id: 4, title: 'Lavori Eseguiti', icon: 'fas fa-tools' },
  { id: 5, title: 'Materiali', icon: 'fas fa-boxes' },
  { id: 6, title: 'Verifiche', icon: 'fas fa-clipboard-check' },
  { id: 7, title: 'Norme', icon: 'fas fa-gavel' },
  { id: 8, title: 'Allegati', icon: 'fas fa-paperclip' },
  { id: 9, title: 'Riepilogo', icon: 'fas fa-check-circle' },
];

const NORME_ELETTRICHE = [
  'CEI 64-8/1 - Oggetto, scopo e fondamenti',
  'CEI 64-8/3 - Caratteristiche generali',
  'CEI 64-8/4 - Protezione per la sicurezza',
  'CEI 64-8/5 - Scelta dei componenti elettrici',
  'CEI 64-8/6 - Verifiche',
  'CEI 64-8/7 - Ambienti e applicazioni particolari',
  'CEI 64-50 - Impianti elettrici in edifici residenziali',
];

const NORME_GAS = [
  'UNI 7129-1 - Impianti interni per distribuzione gas',
  'UNI 7129-2 - Apparecchi utilizzatori',
  'UNI 7129-3 - Sistemi di scarico prodotti combustione',
  'UNI 7129-4 - Messa in servizio e manutenzione',
];

const NORME_IDRAULICHE = [
  'UNI EN 806 - Specifiche per impianti di acqua',
  'UNI 9182 - Edifici civili e industriali - Acquedotti',
  'UNI EN 12056 - Sistemi di scarico a gravità',
];

export default function WizardDiCo({ clienti, impianti, tecnico, certificati, onComplete, onCancel }: WizardDiCoProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    numero: generateNumeroCertificato('DiCo', certificati),
    clienteId: '',
    impiantoId: '',
    dataRilascio: new Date().toISOString().split('T')[0],
    descrizioneLavoro: '',
    materialiUtilizzati: [] as string[],
    verificheEffettuate: '',
    conformitaNorme: [] as string[],
    note: '',
    tecnicoResponsabile: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
    abilitazioneTecnico: tecnico?.abilitazione || '',
    firmaTecnico: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
  });
  const [allegati, setAllegati] = useState<File[]>([]);
  const [newMateriale, setNewMateriale] = useState('');

  const cliente = clienti.find(c => c.id === formData.clienteId);
  const impianto = impianti.find(i => i.id === formData.impiantoId);

  const getNormeDisponibili = () => {
    if (!impianto) return [];
    switch (impianto.tipologia) {
      case 'elettrico': return NORME_ELETTRICHE;
      case 'gas': return NORME_GAS;
      case 'idrico-sanitario': return NORME_IDRAULICHE;
      default: return [...NORME_ELETTRICHE, ...NORME_GAS, ...NORME_IDRAULICHE];
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.numero && formData.dataRilascio;
      case 2: return formData.clienteId;
      case 3: return formData.impiantoId;
      case 4: return formData.descrizioneLavoro.length >= 20;
      case 5: return formData.materialiUtilizzati.length > 0;
      case 6: return formData.verificheEffettuate.length >= 20;
      case 7: return formData.conformitaNorme.length > 0;
      case 8: return true; // Allegati opzionali
      case 9: return formData.tecnicoResponsabile && formData.abilitazioneTecnico && formData.firmaTecnico;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 9) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    onComplete(formData, allegati);
  };

  const addMateriale = () => {
    if (newMateriale.trim()) {
      setFormData({
        ...formData,
        materialiUtilizzati: [...formData.materialiUtilizzati, newMateriale.trim()]
      });
      setNewMateriale('');
    }
  };

  const removeMateriale = (index: number) => {
    setFormData({
      ...formData,
      materialiUtilizzati: formData.materialiUtilizzati.filter((_, i) => i !== index)
    });
  };

  const toggleNorma = (norma: string) => {
    setFormData({
      ...formData,
      conformitaNorme: formData.conformitaNorme.includes(norma)
        ? formData.conformitaNorme.filter(n => n !== norma)
        : [...formData.conformitaNorme, norma]
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAllegati([...allegati, ...Array.from(e.target.files)]);
    }
  };

  const removeAllegato = (index: number) => {
    setAllegati(allegati.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Dati Generali della Dichiarazione</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numero Dichiarazione *</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Es: DC-2024-0001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Rilascio *</label>
                <input
                  type="date"
                  value={formData.dataRilascio}
                  onChange={(e) => setFormData({ ...formData, dataRilascio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Il numero deve essere univoco e seguire una sequenza progressiva annuale.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Dati del Committente</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleziona Committente *</label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value, impiantoId: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Seleziona un committente --</option>
                {clienti.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome} {c.cognome} {c.ragioneSociale ? `(${c.ragioneSociale})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {cliente && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Dati Committente</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Nome:</strong> {cliente.nome} {cliente.cognome}</div>
                  <div><strong>C.F.:</strong> {cliente.codiceFiscale}</div>
                  <div className="col-span-2"><strong>Indirizzo:</strong> {cliente.indirizzo}, {cliente.citta} ({cliente.provincia}) {cliente.cap}</div>
                  {cliente.telefono && <div><strong>Tel:</strong> {cliente.telefono}</div>}
                  {cliente.email && <div><strong>Email:</strong> {cliente.email}</div>}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Dati dell'Impianto</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleziona Impianto *</label>
              <select
                value={formData.impiantoId}
                onChange={(e) => setFormData({ ...formData, impiantoId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!formData.clienteId}
              >
                <option value="">-- Seleziona un impianto --</option>
                {impianti.filter(i => i.clienteId === formData.clienteId).map(i => (
                  <option key={i.id} value={i.id}>
                    {i.tipologia} - {i.citta}
                  </option>
                ))}
              </select>
            </div>
            {impianto && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Dati Impianto</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Tipologia:</strong> {impianto.tipologia}</div>
                  <div><strong>Destinazione:</strong> {impianto.destinazioneUso}</div>
                  <div className="col-span-2"><strong>Indirizzo:</strong> {impianto.indirizzo}, {impianto.citta} ({impianto.provincia})</div>
                  {impianto.caratteristiche && <div className="col-span-2"><strong>Caratteristiche:</strong> {impianto.caratteristiche}</div>}
                  {impianto.potenza && <div><strong>Potenza:</strong> {impianto.potenza} kW</div>}
                  {impianto.tensione && <div><strong>Tensione:</strong> {impianto.tensione} V</div>}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Descrizione dei Lavori Eseguiti</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione Dettagliata *</label>
              <textarea
                value={formData.descrizioneLavoro}
                onChange={(e) => setFormData({ ...formData, descrizioneLavoro: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descrivere in modo dettagliato i lavori eseguiti sull'impianto..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descrizioneLavoro.length}/20 caratteri minimi
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Aggiuntive</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Eventuali note o osservazioni..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Materiali e Componenti Installati</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aggiungi Materiale</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMateriale}
                  onChange={(e) => setNewMateriale(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMateriale())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Es: Interruttore differenziale 30mA"
                />
                <button
                  type="button"
                  onClick={addMateriale}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aggiungi
                </button>
              </div>
            </div>
            {formData.materialiUtilizzati.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Elenco Materiali ({formData.materialiUtilizzati.length})</h4>
                <ul className="space-y-2">
                  {formData.materialiUtilizzati.map((mat, i) => (
                    <li key={i} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                      <span className="text-sm">{mat}</span>
                      <button
                        type="button"
                        onClick={() => removeMateriale(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Verifiche e Collaudi Effettuati</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione Verifiche *</label>
              <textarea
                value={formData.verificheEffettuate}
                onChange={(e) => setFormData({ ...formData, verificheEffettuate: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Elencare tutte le verifiche e i collaudi effettuati..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.verificheEffettuate.length}/20 caratteri minimi
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Le verifiche devono essere conformi alle norme tecniche applicabili e documentate con rapporti di prova.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Norme Tecniche Applicate</h3>
            <p className="text-sm text-gray-600">Selezionare le norme tecniche alle quali l'impianto è conforme:</p>
            <div className="grid grid-cols-1 gap-2">
              {getNormeDisponibili().map((norma, i) => (
                <label key={i} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.conformitaNorme.includes(norma)}
                    onChange={() => toggleNorma(norma)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{norma}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Allegati e Documentazione</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carica File Allegati</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.dwg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formati supportati: PDF, JPG, PNG, DOC, DOCX, DWG
              </p>
            </div>
            {allegati.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">File Allegati ({allegati.length})</h4>
                <ul className="space-y-2">
                  {allegati.map((file, i) => (
                    <li key={i} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-file text-blue-600"></i>
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAllegato(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Gli allegati possono includere: schemi elettrici, planimetrie, rapporti di prova, certificati materiali, foto impianto.
              </p>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Riepilogo e Firma</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Numero:</strong> {formData.numero}</div>
                <div><strong>Data:</strong> {new Date(formData.dataRilascio).toLocaleDateString('it-IT')}</div>
                <div><strong>Committente:</strong> {cliente ? `${cliente.nome} ${cliente.cognome}` : '-'}</div>
                <div><strong>Impianto:</strong> {impianto ? impianto.tipologia : '-'}</div>
                <div className="col-span-2"><strong>Lavori:</strong> {formData.descrizioneLavoro.substring(0, 100)}...</div>
                <div><strong>Materiali:</strong> {formData.materialiUtilizzati.length} elementi</div>
                <div><strong>Norme:</strong> {formData.conformitaNorme.length} applicate</div>
                <div><strong>Allegati:</strong> {allegati.length} file</div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tecnico Responsabile *</label>
                <input
                  type="text"
                  value={formData.tecnicoResponsabile}
                  onChange={(e) => setFormData({ ...formData, tecnicoResponsabile: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Abilitazione (Art. 3 D.M. 37/08) *</label>
                <input
                  type="text"
                  value={formData.abilitazioneTecnico}
                  onChange={(e) => setFormData({ ...formData, abilitazioneTecnico: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Es: Lettera a) - Impianti elettrici"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firma Tecnico *</label>
                <input
                  type="text"
                  value={formData.firmaTecnico}
                  onChange={(e) => setFormData({ ...formData, firmaTecnico: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Wizard Dichiarazione di Conformità</h2>
              <p className="text-blue-200 text-sm mt-1">Guida passo-passo per la compilazione della DiCo</p>
            </div>
            <button onClick={onCancel} className="text-white hover:text-blue-200">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} di 9
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 9) * 100)}% completato
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 9) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id === currentStep
                    ? 'text-blue-600'
                    : step.id < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.id < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className={`${step.icon || 'fas fa-file'} text-xs`}></i>
                  )}
                </div>
                <span className="text-xs mt-1 text-center hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Indietro
          </button>
          {currentStep < 9 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Avanti
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={!canProceed()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-check mr-2"></i>
              Completa DiCo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
