import { useState } from 'react';
import { Tecnico } from '../types';

interface TecnicoPageProps {
  tecnico: Tecnico | null;
  onSave: (tecnico: Tecnico) => void;
}

const emptyForm = {
  id: '',
  nome: '', cognome: '', abilitazione: '', numeroOrdine: '', ordine: '',
  citta: '', provincia: '', indirizzo: '', cap: '',
  telefono: '', email: '', partitaIva: '', codiceFiscale: '',
};

export default function TecnicoPage({ tecnico, onSave }: TecnicoPageProps) {
  const [form, setForm] = useState(tecnico || emptyForm);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: form.id || Date.now().toString(36) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dati Tecnico</h1>
        <p className="text-gray-500 mt-1">Configurazione dati del tecnico responsabile - verranno usati nei certificati</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <i className="fas fa-check-circle text-green-600"></i>
          <p className="text-green-800 font-medium">Dati salvati con successo!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        {/* Dati Anagrafici */}
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-user text-blue-500"></i>
            Dati Anagrafici
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
              <input required type="text" value={form.cognome} onChange={e => setForm({...form, cognome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
              <input required type="text" value={form.codiceFiscale} onChange={e => setForm({...form, codiceFiscale: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA</label>
              <input type="text" value={form.partitaIva} onChange={e => setForm({...form, partitaIva: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Abilitazione */}
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-certificate text-yellow-500"></i>
            Abilitazione Professionale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Abilitazione (art. 3 D.M. 37/08) *</label>
              <input required type="text" value={form.abilitazione} onChange={e => setForm({...form, abilitazione: e.target.value})}
                placeholder="Es. Lettera a) - impianti elettrici"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordine/Collegio</label>
              <input type="text" value={form.ordine} onChange={e => setForm({...form, ordine: e.target.value})}
                placeholder="Es. Ordine degli Ingegneri"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero Iscrizione</label>
              <input type="text" value={form.numeroOrdine} onChange={e => setForm({...form, numeroOrdine: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-address-book text-green-500"></i>
            Contatti e Sede
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
              <input required type="text" value={form.indirizzo} onChange={e => setForm({...form, indirizzo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
              <input required type="text" value={form.citta} onChange={e => setForm({...form, citta: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                <input required type="text" value={form.cap} onChange={e => setForm({...form, cap: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                <input required type="text" maxLength={2} value={form.provincia} onChange={e => setForm({...form, provincia: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
              <input required type="tel" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg shadow-blue-200">
            <i className="fas fa-save"></i>
            <span>Salva Dati Tecnico</span>
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle"></i>
          Informazioni sull'abilitazione
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>Secondo l'art. 3 del D.M. 37/2008, le lettere di abilitazione sono:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>a)</strong> impianti elettrici</li>
            <li><strong>b)</strong> impianti idrico-sanitari</li>
            <li><strong>c)</strong> impianti gas</li>
            <li><strong>d)</strong> impianti di riscaldamento, climatizzazione</li>
            <li><strong>e)</strong> impianti antincendio</li>
            <li><strong>f)</strong> impianti antifurto</li>
            <li><strong>g)</strong> ascensori e montacarichi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
