import { ValidationResult } from '../validators';

interface ValidationMessagesProps {
  validation: ValidationResult;
  compact?: boolean;
}

export default function ValidationMessages({ validation, compact = false }: ValidationMessagesProps) {
  if (validation.valid && validation.warnings.length === 0) return null;

  return (
    <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
      {validation.errors.map((err, i) => (
        <div key={`err-${i}`} className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
          <span>{err}</span>
        </div>
      ))}
      {validation.warnings.map((warn, i) => (
        <div key={`warn-${i}`} className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <i className="fas fa-exclamation-triangle mt-0.5 flex-shrink-0"></i>
          <span>{warn}</span>
        </div>
      ))}
    </div>
  );
}

// Hook per validazione inline di un campo
interface FieldValidationProps {
  validation: ValidationResult;
  children: React.ReactNode;
}

export function FieldWithValidation({ validation, children }: FieldValidationProps) {
  return (
    <div>
      {children}
      <ValidationMessages validation={validation} compact />
    </div>
  );
}

// Badge di stato validazione
export function ValidationBadge({ valid, hasWarnings }: { valid: boolean; hasWarnings?: boolean }) {
  if (valid && !hasWarnings) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <i className="fas fa-check-circle"></i> Valido
      </span>
    );
  }
  if (valid && hasWarnings) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <i className="fas fa-exclamation-triangle"></i> Con avvisi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <i className="fas fa-times-circle"></i> Non valido
    </span>
  );
}
