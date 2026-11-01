import { useState, useRef } from 'react';

export interface Allegato {
  id: string;
  nome: string;
  tipo: string;
  dimensione: number;
  data: string;
  dataUrl: string;
  certificatoId?: string;
  schedaId?: string;
  impiantoId?: string;
  categoria: 'schema' | 'planimetria' | 'rapporto' | 'foto' | 'certificato_materiale' | 'altro';
}

const CATEGORIE = [
  { value: 'schema', label: 'Schema Elettrico/Unifilare', icon: 'fas fa-project-diagram' },
  { value: 'planimetria', label: 'Planimetria', icon: 'fas fa-map' },
  { value: 'rapporto', label: 'Rapporto di Prova', icon: 'fas fa-file-alt' },
  { value: 'foto', label: 'Foto Impianto', icon: 'fas fa-camera' },
  { value: 'certificato_materiale', label: 'Certificato Materiale', icon: 'fas fa-certificate' },
  { value: 'altro', label: 'Altro', icon: 'fas fa-paperclip' },
];

const STORAGE_KEY = 'certificazioni_allegati';

export function loadAllegati(): Allegato[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Errore caricamento allegati:', e);
  }
  return [];
}

export function saveAllegati(allegati: Allegato[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allegati));
  } catch (e) {
    console.error('Errore salvataggio allegati:', e);
    alert('Attenzione: spazio di archiviazione esaurito. Eliminare alcuni allegati.');
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

interface ArchivioAllegatiProps {
  allegati: Allegato[];
  onAdd: (allegati: Allegato[]) => void;
  onDelete: (id: string) => void;
  filtroCertificatoId?: string;
  filtroSchedaId?: string;
  filtroImpiantoId?: string;
}

export default function ArchivioAllegati({ 
  allegati, 
  onAdd, 
  onDelete,
  filtroCertificatoId,
  filtroSchedaId,
  filtroImpiantoId
}: ArchivioAllegatiProps) {
  const [categoriaUpload, setCategoriaUpload] = useState<string>('altro');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewAllegato, setPreviewAllegato] = useState<Allegato | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allegatiFiltrati = allegati.filter(a => {
    if (filtroCertificatoId && a.certificatoId !== filtroCertificatoId) return false;
    if (filtroSchedaId && a.schedaId !== filtroSchedaId) return false;
    if (filtroImpiantoId && a.impiantoId !== filtroImpiantoId) return false;
    if (filtroCategoria && a.categoria !== filtroCategoria) return false;
    return true;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const nuoviAllegati: Allegato[] = [];

    for (const file of files) {
      // Verifica dimensione max (5MB per file in localStorage)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" troppo grande (max 5MB)`);
        continue;
      }

      try {
        const dataUrl = await fileToDataUrl(file);
        nuoviAllegati.push({
          id: generateId(),
          nome: file.name,
          tipo: file.type,
          dimensione: file.size,
          data: new Date().toISOString(),
          dataUrl,
          certificatoId: filtroCertificatoId,
          schedaId: filtroSchedaId,
          impiantoId: filtroImpiantoId,
          categoria: categoriaUpload as any,
        });
      } catch (err) {
        alert(`Errore caricamento file "${file.name}"`);
      }
    }

    if (nuoviAllegati.length > 0) {
      onAdd(nuoviAllegati);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const downloadAllegato = (allegato: Allegato) => {
    const link = document.createElement('a');
    link.href = allegato.dataUrl;
    link.download = allegato.nome;
    link.click();
  };

  const getCategoriaInfo = (cat: string) => {
    return CATEGORIE.find(c => c.value === cat) || CATEGORIE[5];
  };

  const isImage = (tipo: string) => tipo.startsWith('image/');
  const isPdf = (tipo: string) => tipo === 'application/pdf';

  const spazioUsato = allegati.reduce((acc, a) => acc + a.dimensione, 0);
  const spazioMax = 10 * 1024 * 1024; // 10MB max localStorage
  const percentualeSpazio = (spazioUsato / spazioMax) * 100;

  return (
    <div className="space-y-4">
      {/* Header con statistiche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-archive text-indigo-600"></i>
            Archivio Allegati
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {allegatiFiltrati.length} file • {formatFileSize(spazioUsato)} utilizzati
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* Barra spazio utilizzato */}
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600">Spazio utilizzato</span>
          <span className={`font-medium ${percentualeSpazio > 80 ? 'text-red-600' : 'text-gray-700'}`}>
            {formatFileSize(spazioUsato)} / {formatFileSize(spazioMax)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentualeSpazio > 80 ? 'bg-red-500' : percentualeSpazio > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentualeSpazio, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-indigo-800 mb-1">Categoria</label>
            <select
              value={categoriaUpload}
              onChange={(e) => setCategoriaUpload(e.target.value)}
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm"
            >
              {CATEGORIE.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-indigo-800 mb-1">File (max 5MB ciascuno)</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="w-full text-sm"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.dwg,.dxf"
            />
          </div>
        </div>
      </div>

      {/* Filtro categoria */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroCategoria('')}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            !filtroCategoria ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Tutti
        </button>
        {CATEGORIE.map(c => (
          <button
            key={c.value}
            onClick={() => setFiltroCategoria(c.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filtroCategoria === c.value ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <i className={`${c.icon || 'fas fa-file'} mr-1`}></i>
            {c.label}
          </button>
        ))}
      </div>

      {/* Lista allegati */}
      {allegatiFiltrati.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <i className="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">Nessun allegato presente</p>
          <p className="text-xs text-gray-400 mt-1">Carica file utilizzando il form sopra</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allegatiFiltrati.map(allegato => {
            const catInfo = getCategoriaInfo(allegato.categoria);
            return (
              <div
                key={allegato.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {/* Preview */}
                <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {isImage(allegato.tipo) ? (
                    <img
                      src={allegato.dataUrl}
                      alt={allegato.nome}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setPreviewAllegato(allegato)}
                    />
                  ) : (
                    <div className="text-center">
                      <i className={`${catInfo?.icon || 'fas fa-file'} text-3xl text-gray-400`}></i>
                      <p className="text-xs text-gray-500 mt-1">{allegato.tipo.split('/')[1]?.toUpperCase()}</p>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-800 truncate" title={allegato.nome}>
                    {allegato.nome}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{formatFileSize(allegato.dimensione)}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPreviewAllegato(allegato)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Anteprima"
                      >
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      <button
                        onClick={() => downloadAllegato(allegato)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Download"
                      >
                        <i className="fas fa-download text-xs"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Eliminare questo allegato?')) onDelete(allegato.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Elimina"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {allegatiFiltrati.map(allegato => {
            const catInfo = getCategoriaInfo(allegato.categoria);
            return (
              <div
                key={allegato.id}
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition"
              >
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {isImage(allegato.tipo) ? (
                    <img src={allegato.dataUrl} alt="" className="w-full h-full object-cover rounded" />
                  ) : (
                    <i className={`${catInfo?.icon || 'fas fa-file'} text-gray-400`}></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{allegato.nome}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatFileSize(allegato.dimensione)}</span>
                    <span>•</span>
                    <span>{catInfo?.label || 'Altro'}</span>
                    <span>•</span>
                    <span>{new Date(allegato.data).toLocaleDateString('it-IT')}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPreviewAllegato(allegato)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Anteprima"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => downloadAllegato(allegato)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Download"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Eliminare questo allegato?')) onDelete(allegato.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Elimina"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewAllegato && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{previewAllegato.nome}</h3>
                <p className="text-xs text-gray-500">
                  {formatFileSize(previewAllegato.dimensione)} • {getCategoriaInfo(previewAllegato.categoria)?.label || 'Altro'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadAllegato(previewAllegato)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <i className="fas fa-download mr-1"></i> Download
                </button>
                <button
                  onClick={() => setPreviewAllegato(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
              {isImage(previewAllegato.tipo) ? (
                <img
                  src={previewAllegato.dataUrl}
                  alt={previewAllegato.nome}
                  className="max-w-full max-h-full object-contain"
                />
              ) : isPdf(previewAllegato.tipo) ? (
                <iframe
                  src={previewAllegato.dataUrl}
                  className="w-full h-full min-h-[600px] border"
                  title={previewAllegato.nome}
                />
              ) : (
                <div className="text-center">
                  <i className="fas fa-file text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Anteprima non disponibile per questo tipo di file</p>
                  <button
                    onClick={() => downloadAllegato(previewAllegato)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Scarica File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
