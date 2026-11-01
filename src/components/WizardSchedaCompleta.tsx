import { useState } from 'react';
import { SchedaCompletaConfig, SezioneConfig } from '../schedeComplete';

interface WizardSchedaCompletaProps {
  config: SchedaCompletaConfig;
  onComplete: (dati: any) => void;
  onCancel: () => void;
}

export default function WizardSchedaCompleta({ config, onComplete, onCancel }: WizardSchedaCompletaProps) {
  const [currentSezione, setCurrentSezione] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!config) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">Configurazione scheda non disponibile</div>;
  }

  const sezioneCorrente = config.sezioni[currentSezione];
  if (!sezioneCorrente) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">Sezione non disponibile</div>;
  }
  
  const totaleSezioni = config.sezioni.length;
  const progresso = ((currentSezione + 1) / totaleSezioni) * 100;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    // Rimuovi errore quando l'utente compila
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const validateSezione = () => {
    const newErrors: Record<string, string> = {};
    
    sezioneCorrente.campi.forEach(campo => {
      if (campo.required) {
        const value = formData[campo.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[campo.id] = 'Campo obbligatorio';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateSezione()) {
      return;
    }

    if (currentSezione < totaleSezioni - 1) {
      setCurrentSezione(currentSezione + 1);
    } else {
      // Ultima sezione, completa
      onComplete(formData);
    }
  };

  const handlePrev = () => {
    if (currentSezione > 0) {
      setCurrentSezione(currentSezione - 1);
    }
  };

  const renderCampo = (campo: any) => {
    const value = formData[campo.id] || '';
    const error = errors[campo.id];

    const baseClassName = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

    switch (campo.tipo) {
      case 'text':
      case 'number':
        return (
          <div key={campo.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
              <input
                type={campo.tipo}
                value={value}
                onChange={(e) => handleFieldChange(campo.id, campo.tipo === 'number' ? parseFloat(e.target.value) || '' : e.target.value)}
                placeholder={campo.placeholder}
                min={campo.min}
                max={campo.max}
                step={campo.step}
                className={baseClassName}
              />
              {campo.unit && (
                <span className="flex items-center text-sm text-gray-500 whitespace-nowrap">{campo.unit}</span>
              )}
            </div>
            {campo.help && <p className="text-xs text-gray-500">{campo.help}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={campo.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              className={baseClassName}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={campo.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              className={baseClassName}
            >
              <option value="">Seleziona...</option>
              {campo.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={campo.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              placeholder={campo.placeholder}
              rows={4}
              className={baseClassName}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={campo.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {campo.options?.map((opt: any) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) ? value.includes(opt.value) : false}
                    onChange={(e) => {
                      const currentValue = Array.isArray(value) ? value : [];
                      const newValue = e.target.checked
                        ? [...currentValue, opt.value]
                        : currentValue.filter((v: string) => v !== opt.value);
                      handleFieldChange(campo.id, newValue);
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={campo.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {campo.options?.map((opt: any) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={campo.id}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
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
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <i className={config.icon || 'fas fa-file'}></i>
                {config.label}
              </h2>
              <p className="text-blue-200 text-sm mt-1">{config.norma}</p>
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
              Sezione {currentSezione + 1} di {totaleSezioni}: {sezioneCorrente.titolo}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progresso)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
          {/* Navigation dots */}
          <div className="flex justify-between mt-3">
            {config.sezioni.map((sezione, index) => (
              <button
                key={sezione.id}
                onClick={() => index <= currentSezione && setCurrentSezione(index)}
                disabled={index > currentSezione}
                className={`flex flex-col items-center ${
                  index === currentSezione
                    ? 'text-blue-600'
                    : index < currentSezione
                    ? 'text-green-600 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentSezione
                      ? 'bg-blue-600 text-white'
                      : index < currentSezione
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentSezione ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className={`${sezione.icon || 'fas fa-file'} text-xs`}></i>
                  )}
                </div>
                <span className="text-xs mt-1 text-center hidden md:block max-w-[80px]">
                  {sezione.titolo}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <i className={`${sezioneCorrente?.icon || 'fas fa-file'} text-blue-600`}></i>
              {sezioneCorrente?.titolo || 'Sezione'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sezioneCorrente?.campi.map(renderCampo)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSezione === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Indietro
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentSezione < totaleSezioni - 1 ? (
              <>
                Avanti
                <i className="fas fa-arrow-right ml-2"></i>
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                Completa Scheda
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
