import { useState } from 'react';

interface InfoTooltipProps {
  text: string;
  title?: string;
  type?: 'info' | 'warning' | 'help';
}

export default function InfoTooltip({ text, title, type = 'info' }: InfoTooltipProps) {
  const [show, setShow] = useState(false);

  const colors = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'fa-info-circle text-blue-500' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'fa-exclamation-triangle text-amber-500' },
    help: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'fa-question-circle text-purple-500' },
  };

  const color = colors[type];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className={`ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full ${color.bg} ${color.border} border`}
      >
        <i className={`fas ${color.icon} text-xs`}></i>
      </button>
      
      {show && (
        <div className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 ${color.bg} ${color.border} border rounded-lg shadow-lg`}>
          {title && <p className={`font-bold text-xs ${color.text} mb-1`}>{title}</p>}
          <p className={`text-xs ${color.text} leading-relaxed`}>{text}</p>
          <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 ${color.bg} ${color.border} border-t-0 border-l-0 rotate-45 -mt-1`}></div>
        </div>
      )}
    </div>
  );
}

// Helper text sotto i campi
interface HelperTextProps {
  text: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export function HelperText({ text, type = 'info' }: HelperTextProps) {
  const colors = {
    info: 'text-blue-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    success: 'text-green-600',
  };

  const icons = {
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle',
    success: 'fa-check-circle',
  };

  return (
    <p className={`text-xs ${colors[type]} mt-1 flex items-start gap-1`}>
      <i className={`fas ${icons[type]} mt-0.5 flex-shrink-0`}></i>
      <span>{text}</span>
    </p>
  );
}

// Normativa di riferimento inline
interface NormativaRefProps {
  norma: string;
  articolo?: string;
  descrizione: string;
}

export function NormativaRef({ norma, articolo, descrizione }: NormativaRefProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs">
      <div className="flex items-start gap-2">
        <i className="fas fa-gavel text-gray-400 mt-0.5"></i>
        <div>
          <p className="font-medium text-gray-700">
            {norma}{articolo && ` - Art. ${articolo}`}
          </p>
          <p className="text-gray-600 mt-0.5">{descrizione}</p>
        </div>
      </div>
    </div>
  );
}
