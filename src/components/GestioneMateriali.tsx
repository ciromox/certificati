import { useState } from 'react';
import { Materiale, getMaterialiByImpianto, searchMateriali } from '../materiali';

interface MaterialeConQuantita {
  nome: string;
  quantita: number;
  unitaMisura: string;
  descrizione?: string;
  normaRiferimento?: string;
}

interface GestioneMaterialiProps {
  tipoImpianto: string;
  materiali: MaterialeConQuantita[];
  onChange: (materiali: MaterialeConQuantita[]) => void;
}

export default function GestioneMateriali({ tipoImpianto, materiali, onChange }: GestioneMaterialiProps) {
  const [showDatabase, setShowDatabase] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualMaterial, setManualMaterial] = useState<MaterialeConQuantita>({
    nome: '',
    quantita: 1,
    unitaMisura: 'pz',
    descrizione: '',
    normaRiferimento: '',
  });

  const materialiDisponibili = searchQuery 
    ? searchMateriali(searchQuery, tipoImpianto)
    : selectedCategory 
      ? getMaterialiByImpianto(tipoImpianto).filter(m => m.categoria === selectedCategory)
      : getMaterialiByImpianto(tipoImpianto);

  const categorie = Array.from(new Set(getMaterialiByImpianto(tipoImpianto).map(m => m.categoria)));

  const addMaterialeFromDatabase = (materiale: Materiale) => {
    const nuovoMateriale: MaterialeConQuantita = {
      nome: materiale.nome,
      quantita: 1,
      unitaMisura: materiale.unitaMisura,
      descrizione: materiale.descrizione,
      normaRiferimento: materiale.normaRiferimento,
    };
    onChange([...materiali, nuovoMateriale]);
  };

  const addManualMaterial = () => {
    if (manualMaterial.nome.trim()) {
      onChange([...materiali, { ...manualMaterial }]);
      setManualMaterial({
        nome: '',
        quantita: 1,
        unitaMisura: 'pz',
        descrizione: '',
        normaRiferimento: '',
      });
      setShowManualForm(false);
    }
  };

  const updateQuantita = (index: number, quantita: number) => {
    const updated = [...materiali];
    updated[index].quantita = quantita;
    onChange(updated);
  };

  const removeMateriale = (index: number) => {
    onChange(materiali.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Materiali già aggiunti */}
      {materiali.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materiali Utilizzati ({materiali.length})
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 font-medium text-gray-700">Materiale</th>
                  <th className="text-left p-2 font-medium text-gray-700 w-24">Quantità</th>
                  <th className="text-left p-2 font-medium text-gray-700 w-20">U.M.</th>
                  <th className="text-left p-2 font-medium text-gray-700 w-20">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {materiali.map((mat, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="p-2">
                      <div className="font-medium text-gray-800">{mat.nome}</div>
                      {mat.descrizione && <div className="text-xs text-gray-500">{mat.descrizione}</div>}
                      {mat.normaRiferimento && <div className="text-xs text-blue-600">{mat.normaRiferimento}</div>}
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={mat.quantita}
                        onChange={(e) => updateQuantita(i, parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="p-2 text-gray-600">{mat.unitaMisura}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => removeMateriale(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pulsanti per aggiungere materiali */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setShowDatabase(!showDatabase); setShowManualForm(false); }}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            showDatabase 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <i className="fas fa-database mr-2"></i>
          {showDatabase ? 'Nascondi Database' : 'Scegli da Database'}
        </button>
        <button
          type="button"
          onClick={() => { setShowManualForm(!showManualForm); setShowDatabase(false); }}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            showManualForm 
              ? 'bg-green-600 text-white' 
              : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
          }`}
        >
          <i className="fas fa-plus mr-2"></i>
          {showManualForm ? 'Nascondi Form' : 'Inserisci Manualmente'}
        </button>
      </div>

      {/* Database Materiali */}
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
                  <li key={mat.id} className="p-3 hover:bg-indigo-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{mat.nome}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{mat.descrizione}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span><i className="fas fa-tag mr-1"></i>{mat.categoria}</span>
                          <span><i className="fas fa-ruler mr-1"></i>{mat.unitaMisura}</span>
                          {mat.normaRiferimento && <span><i className="fas fa-book mr-1"></i>{mat.normaRiferimento}</span>}
                          {mat.certificazioneRichiesta && <span><i className="fas fa-certificate mr-1"></i>{mat.certificazioneRichiesta}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addMaterialeFromDatabase(mat)}
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
        </div>
      )}

      {/* Form Inserimento Manuale */}
      {showManualForm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Materiale *</label>
              <input
                type="text"
                value={manualMaterial.nome}
                onChange={(e) => setManualMaterial({...manualMaterial, nome: e.target.value})}
                placeholder="Es: Interruttore differenziale 30mA"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantità *</label>
              <input
                type="number"
                value={manualMaterial.quantita}
                onChange={(e) => setManualMaterial({...manualMaterial, quantita: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unità di Misura *</label>
              <select
                value={manualMaterial.unitaMisura}
                onChange={(e) => setManualMaterial({...manualMaterial, unitaMisura: e.target.value})}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="pz">Pezzi (pz)</option>
                <option value="m">Metri (m)</option>
                <option value="kg">Chilogrammi (kg)</option>
                <option value="l">Litri (l)</option>
                <option value="set">Set</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
              <input
                type="text"
                value={manualMaterial.descrizione}
                onChange={(e) => setManualMaterial({...manualMaterial, descrizione: e.target.value})}
                placeholder="Descrizione opzionale"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Norma di Riferimento</label>
              <input
                type="text"
                value={manualMaterial.normaRiferimento}
                onChange={(e) => setManualMaterial({...manualMaterial, normaRiferimento: e.target.value})}
                placeholder="Es: CEI 64-8, UNI 7129"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addManualMaterial}
            disabled={!manualMaterial.nome.trim()}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-plus mr-2"></i>
            Aggiungi Materiale
          </button>
        </div>
      )}
    </div>
  );
}
