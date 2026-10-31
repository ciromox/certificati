import { AppData } from '../types';
import { SchedaTecnica } from '../schedeTecniche';

interface DashboardProps {
  data: AppData;
  schede?: SchedaTecnica[];
  onNavigate: (page: string) => void;
}

export default function Dashboard({ data, schede = [], onNavigate }: DashboardProps) {
  const { clienti, impianti, certificati } = data;
  
  const certificatiAttivi = certificati.filter(c => c.stato === 'emesso');
  const certificatiBozza = certificati.filter(c => c.stato === 'bozza');
  const certificatiScaduti = certificati.filter(c => c.stato === 'scaduto');
  
  const stats = [
    { label: 'Clienti', value: clienti.length, icon: 'fas fa-users', color: 'bg-blue-500', page: 'clienti' },
    { label: 'Impianti', value: impianti.length, icon: 'fas fa-building', color: 'bg-green-500', page: 'impianti' },
    { label: 'Certificati Emessi', value: certificatiAttivi.length, icon: 'fas fa-file-circle-check', color: 'bg-emerald-500', page: 'certificati' },
    { label: 'In Bozza', value: certificatiBozza.length, icon: 'fas fa-file-pen', color: 'bg-yellow-500', page: 'certificati' },
    { label: 'Schede Tecniche', value: schede.length, icon: 'fas fa-file-medical', color: 'bg-indigo-500', page: 'schede' },
    { label: 'Totale Certificati', value: certificati.length, icon: 'fas fa-folder-open', color: 'bg-purple-500', page: 'certificati' },
  ];

  const ultimiCertificati = [...certificati]
    .sort((a, b) => new Date(b.dataCreazione).getTime() - new Date(a.dataCreazione).getTime())
    .slice(0, 5);

  const getClienteNome = (id: string) => {
    const c = clienti.find(cl => cl.id === id);
    return c ? `${c.nome} ${c.cognome}${c.ragioneSociale ? ` (${c.ragioneSociale})` : ''}` : 'N/D';
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'DiCo': 'Dich. Conformità',
      'DiRi': 'Dich. Rispondenza',
      'Verifica': 'Verifica',
      'Manutenzione': 'Manutenzione',
    };
    return labels[tipo] || tipo;
  };

  const getStatoBadge = (stato: string) => {
    const styles: Record<string, string> = {
      'bozza': 'bg-yellow-100 text-yellow-800',
      'emesso': 'bg-green-100 text-green-800',
      'archiviato': 'bg-gray-100 text-gray-800',
      'scaduto': 'bg-red-100 text-red-800',
    };
    return styles[stato] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Panoramica gestione certificazioni - Legge 37/2008</p>
        </div>
        <button
          onClick={() => onNavigate('nuovo-certificato')}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-200"
        >
          <i className="fas fa-plus"></i>
          <span>Nuovo Certificato</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <button
            key={i}
            onClick={() => onNavigate(stat.page)}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <i className={`${stat.icon} text-white`}></i>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-info-circle text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">D.M. 22 gennaio 2008, n. 37</h3>
            <p className="text-blue-100 mt-1 text-sm leading-relaxed">
              Norme per la sicurezza degli impianti. La dichiarazione di conformità è obbligatoria per tutti gli impianti 
              installati dopo il 27/03/2008. Gli impianti tipizzati sono: elettrici, idrico-sanitari, gas, riscaldamento, 
              climatizzazione, antincendio, antifurto e ascensori/montacarichi.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Certificates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-800">
            <i className="fas fa-clock text-blue-500 mr-2"></i>
            Ultimi Certificati
          </h2>
          <button onClick={() => onNavigate('certificati')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Vedi tutti <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        {ultimiCertificati.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <i className="fas fa-file-circle-xmark text-4xl mb-3"></i>
            <p>Nessun certificato creato</p>
            <button
              onClick={() => onNavigate('nuovo-certificato')}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              Crea il primo certificato
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {ultimiCertificati.map(cert => (
              <div key={cert.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-alt text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{cert.numero}</p>
                    <p className="text-sm text-gray-500">{getClienteNome(cert.clienteId)} • {getTipoLabel(cert.tipo)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatoBadge(cert.stato)}`}>
                    {cert.stato.charAt(0).toUpperCase() + cert.stato.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">{new Date(cert.dataRilascio).toLocaleDateString('it-IT')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('clienti')}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
              <i className="fas fa-user-plus text-blue-600"></i>
            </div>
            <div>
              <p className="font-medium text-gray-800">Nuovo Cliente</p>
              <p className="text-xs text-gray-500">Aggiungi un nuovo cliente</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('impianti')}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
              <i className="fas fa-plus-circle text-green-600"></i>
            </div>
            <div>
              <p className="font-medium text-gray-800">Nuovo Impianto</p>
              <p className="text-xs text-gray-500">Registra un nuovo impianto</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('nuovo-certificato')}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
              <i className="fas fa-file-signature text-purple-600"></i>
            </div>
            <div>
              <p className="font-medium text-gray-800">Nuovo Certificato</p>
              <p className="text-xs text-gray-500">Crea DiCo o DiRi</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('schede')}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
              <i className="fas fa-file-medical text-indigo-600"></i>
            </div>
            <div>
              <p className="font-medium text-gray-800">Nuova Scheda Tecnica</p>
              <p className="text-xs text-gray-500">DiCo, Libretto, Rapporti</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
