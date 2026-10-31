import { useRef } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, onNavigate, onExport, onImport, isOpen }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'clienti', label: 'Clienti', icon: 'fas fa-users' },
    { id: 'impianti', label: 'Impianti', icon: 'fas fa-building' },
    { id: 'certificati', label: 'Certificati', icon: 'fas fa-file-certificate' },
    { id: 'schede', label: 'Schede Tecniche', icon: 'fas fa-file-medical' },
    { id: 'allegati', label: 'Archivio Allegati', icon: 'fas fa-archive' },
    { id: 'tecnico', label: 'Dati Tecnico', icon: 'fas fa-user-tie' },
  ];

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-40
      w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      flex flex-col shadow-xl
    `}>
      <div className="p-5 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <i className="fas fa-bolt text-blue-900 text-lg"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Certificazioni</h1>
            <p className="text-blue-200 text-xs">Legge 37/2008</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-full flex items-center gap-3 px-5 py-3 text-left transition-all
              ${currentPage === item.id
                ? 'bg-blue-700/50 border-r-4 border-yellow-400 text-yellow-100'
                : 'hover:bg-blue-700/30 text-blue-100'
              }
            `}
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700 space-y-2">
        <button
          onClick={onExport}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-700/50 hover:bg-blue-700 transition text-sm"
        >
          <i className="fas fa-download"></i>
          <span>Esporta Dati</span>
        </button>
        <button
          onClick={handleImportClick}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-700/50 hover:bg-blue-700 transition text-sm"
        >
          <i className="fas fa-upload"></i>
          <span>Importa Dati</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="p-4 border-t border-blue-700 text-xs text-blue-300 text-center">
        <p>Gestione Certificazioni v1.0</p>
        <p className="mt-1">D.M. 22/01/2008 n. 37</p>
      </div>
    </aside>
  );
}
