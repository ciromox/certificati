import { useState } from 'react';
import { SchedaTipo, SCHEDE_DEFINIZIONI, SchedaDefinizione } from '../schedeFields';

interface SchedaFormDinamicoProps {
  tipoScheda: SchedaTipo;
  datiIniziali?: Record<string, any>;
  onSave: (dati: Record<string, any>) => void;
  onCancel: () => void;
}

export default function SchedaFormDinamico({ tipoScheda, datiIniziali = {}, onSave, onCancel }: SchedaFormDinamicoProps) {
  const definizione = SCHEDE_DEFINIZIONI[tipoScheda];
  const [dati, setDati] = useState<Record<string, any>>(datiIniziali);
  const [sezioneCorrente, setSezioneCorrente] = useState(0);

  if (!definizione) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Tipo scheda non valido: {tipoScheda}</p>
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setDati({ ...dati, [fieldId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dati);
  };

  const renderCampo = (campo: any) => {
    const value = dati[campo.id];
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500";

    switch (campo.tipo) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={campo.id}>
            <label className={labelClass}>
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
              {campo.unit && <span className="text-gray-500 ml-1">({campo.unit})</span>}
            </label>
            <input
              type={campo.tipo}
              value={value || ''}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              placeholder={campo.placeholder}
              required={campo.required}
              min={campo.min}
              max={campo.max}
              step={campo.step}
              className={inputClass}
            />
            {campo.help && <p className="text-xs text-gray-500 mt-1">{campo.help}</p>}
            {campo.norma && <p className="text-xs text-blue-600 mt-1"><i className="fas fa-gavel mr-1"></i>{campo.norma}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={campo.id}>
            <label className={labelClass}>
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
              {campo.unit && <span className="text-gray-500 ml-1">({campo.unit})</span>}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleFieldChange(campo.id, parseFloat(e.target.value) || 0)}
              placeholder={campo.placeholder}
              required={campo.required}
              min={campo.min}
              max={campo.max}
              step={campo.step || 1}
              className={inputClass}
            />
            {campo.help && <p className="text-xs text-gray-500 mt-1">{campo.help}</p>}
            {campo.norma && <p className="text-xs text-blue-600 mt-1"><i className="fas fa-gavel mr-1"></i>{campo.norma}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={campo.id}>
            <label className={labelClass}>
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value || ''}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              required={campo.required}
              className={inputClass}
            />
          </div>
        );

      case 'select':
        return (
          <div key={campo.id}>
            <label className={labelClass}>
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value || ''}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              required={campo.required}
              className={inputClass}
            >
              <option value="">Seleziona...</option>
              {campo.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {campo.help && <p className="text-xs text-gray-500 mt-1">{campo.help}</p>}
            {campo.norma && <p className="text-xs text-blue-600 mt-1"><i className="fas fa-gavel mr-1"></i>{campo.norma}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={campo.id}>
            <label className={labelClass}>
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(campo.id, e.target.value)}
              placeholder={campo.placeholder}
              required={campo.required}
              rows={4}
              className={inputClass}
            />
            {campo.help && <p className="text-xs text-gray-500 mt-1">{campo.help}</p>}
          </div>
        );

      case 'checkbox':
        if (campo.options) {
          // Multiple checkboxes
          const selectedValues = Array.isArray(value) ? value : [];
          return (
            <div key={campo.id}>
              <label className={labelClass}>
                {campo.label}
                {campo.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {campo.options.map((opt: any) => (
                  <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(opt.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, opt.value]
                          : selectedValues.filter((v: string) => v !== opt.value);
                        handleFieldChange(campo.id, newValues);
                      }}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div key={campo.id}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) => handleFieldChange(campo.id, e.target.checked)}
                  required={campo.required}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {campo.label}
                  {campo.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </label>
              {campo.help && <p className="text-xs text-gray-500 mt-1 ml-6">{campo.help}</p>}
            </div>
          );
        }

      case 'radio':
        return (
          <div key={campo.id}>
            <label className={labelClass}>
              {campo.label}
              {campo.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {campo.options?.map((opt: any) => (
                <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={campo.id}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                    required={campo.required}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
            {campo.help && <p className="text-xs text-gray-500 mt-1">{campo.help}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const sezioneCorrenteDef = definizione.sezioni[sezioneCorrente];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{definizione.titolo}</h1>
          <p className="text-gray-500 mt-1">{definizione.norma}</p>
          <p className="text-sm text-gray-600 mt-1">{definizione.descrizione}</p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {definizione.sezioni.map((sezione, index) => (
            <button
              key={sezione.id}
              onClick={() => setSezioneCorrente(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                sezioneCorrente === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={sezione.icon || 'fas fa-file'}></i>
              <span className="text-sm font-medium">{sezione.titolo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className={`${sezioneCorrenteDef?.icon || 'fas fa-file'} text-blue-500`}></i>
            {sezioneCorrenteDef?.titolo || 'Sezione'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sezioneCorrenteDef.campi.map(campo => renderCampo(campo))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setSezioneCorrente(Math.max(0, sezioneCorrente - 1))}
            disabled={sezioneCorrente === 0}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Sezione Precedente
          </button>
          
          <div className="flex gap-3">
            {sezioneCorrente < definizione.sezioni.length - 1 ? (
              <button
                type="button"
                onClick={() => setSezioneCorrente(sezioneCorrente + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Sezione Successiva
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                <i className="fas fa-save mr-2"></i>
                Salva Scheda
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Sezione {sezioneCorrente + 1} di {definizione.sezioni.length}</span>
          <span>{Math.round(((sezioneCorrente + 1) / definizione.sezioni.length) * 100)}% completato</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((sezioneCorrente + 1) / definizione.sezioni.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
