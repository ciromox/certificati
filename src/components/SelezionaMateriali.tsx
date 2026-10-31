import { useState } from 'react';
import { Materiale, getMaterialiByImpianto, searchMateriali } from '../materiali';

interface SelezionaMaterialiProps {
  tipoImpianto: string;
  materialiSelezionati: string[];
  onAdd: (materiale: string) => void;
  onRemove: (index: number) => void;
}

export default function SelezionaMateriali({ tipoImpianto, materialiSelezionati, onAdd, onRemove }: SelezionaMaterialiProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDatabase, setShowDatabase] = useState(false);

  const materialiDisponibili = searchQuery 
    ? searchMateriali(searchQuery, tipoImpianto)
    : selectedCategory 
      ? getMaterialiByImpianto(tipoImpianto).filter(m => m.categoria === selectedCategory)
      : getMaterialiByImpianto(tipoImpianto);

  const categorie = Array.from(new Set(getMaterialiByImpianto(tipoImpianto).map(m => m.categoria)));

  const handleAddMateriale = (materiale: Materiale) => {
    const descrizione = `${materiale.nome} - ${materiale.descrizione}${materiale.normaRiferimento ? ` (${materiale.normaRiferimento})` : ''}`;
    onAdd(descrizione);
  };

  return (
    <div className="space-y-4">
      {/* Materiali già selezionati */}
      {materialiSelezionati.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materiali Selezionati ({materialiSelezionati.length})
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {materialiSelezionati.map((mat, i) => (
                <li key={i} className="flex items-start justify-between bg-white p-2 rounded border border-gray-200">
                  <span className="text-sm flex-1">{mat}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Toggle database */}
      <button
        type="button"
        onClick={() => setShowDatabase(!showDatabase)}
        className="w-full px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-100 transition flex items-center justify-center gap-2"
      >
        <i className="fas fa-database"></i>
        {showDatabase ? 'Nascondi Database Materiali' : 'Seleziona da Database Materiali (Allegato 1 D.M. 37/08)'}
      </button>

      {/* Database materiali */}
      {showDatabase && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-indigo-800">
            <i className="fas fa-info-circle"></i>
            <span>Database conforme all'Allegato 1 del D.M. 37/08 e successive modifiche</span>
          </div>

          {/* Ricerca */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(''); }}
              placeholder="Cerca materiale..."
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtro categoria */}
          {!searchQuery && (
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tutte le categorie</option>
                {categorie.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Lista materiali */}
          <div className="max-h-64 overflow-y-auto bg-white rounded-lg border border-indigo-200">
            {materialiDisponibili.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nessun materiale trovato
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {materialiDisponibili.map(mat => (
                  <li key={mat.id} className="p-3 hover:bg-indigo-50 transition cursor-pointer" onClick={() => handleAddMateriale(mat)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{mat.nome}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{mat.descrizione}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span><i className="fas fa-tag mr-1"></i>{mat.categoria}</span>
                          {mat.normaRiferimento && <span><i className="fas fa-book mr-1"></i>{mat.normaRiferimento}</span>}
                          {mat.certificazioneRichiesta && <span><i className="fas fa-certificate mr-1"></i>{mat.certificazioneRichiesta}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAddMateriale(mat); }}
                        className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 flex-shrink-0"
                      >
                        <i className="fas fa-plus"></i> Aggiungi
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Inserimento manuale */}
          <div className="pt-3 border-t border-indigo-200">
            <p className="text-xs text-indigo-700 mb-2">
              <i className="fas fa-pencil-alt mr-1"></i>
              Oppure inserisci manualmente un materiale non presente nel database:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Descrizione materiale personalizzato..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    onAdd((e.target as HTMLInputElement).value.trim());
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
