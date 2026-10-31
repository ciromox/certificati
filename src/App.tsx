import { useState, useEffect } from 'react';
import { AppData, Cliente, Impianto, Certificato, Tecnico, TipoCertificato, TipologiaImpianto } from './types';
import { loadData, addCliente, updateCliente, deleteCliente, addImpianto, updateImpianto, deleteImpianto, addCertificato, updateCertificato, deleteCertificato, setTecnico, generateNumeroCertificato, exportDataAsJSON, importDataFromJSON } from './store';
import Dashboard from './components/Dashboard';
import ClientiPage from './components/ClientiPage';
import ImpiantiPage from './components/ImpiantiPage';
import CertificatiPage from './components/CertificatiPage';
import CertificatoForm from './components/CertificatoForm';
import CertificatoPrint from './components/CertificatoPrint';
import TecnicoPage from './components/TecnicoPage';
import Sidebar from './components/Sidebar';

type Page = 'dashboard' | 'clienti' | 'impianti' | 'certificati' | 'nuovo-certificato' | 'tecnico' | 'stampa';

export default function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [editingCertificato, setEditingCertificato] = useState<Certificato | null>(null);
  const [printingCertificato, setPrintingCertificato] = useState<Certificato | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setData(loadData());
  }, []);

  const handleAddCliente = (cliente: Omit<Cliente, 'id' | 'dataCreazione'>) => {
    setData(addCliente(data, cliente));
  };

  const handleUpdateCliente = (cliente: Cliente) => {
    setData(updateCliente(data, cliente));
  };

  const handleDeleteCliente = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo cliente? Verranno eliminati anche impianti e certificati associati.')) {
      setData(deleteCliente(data, id));
    }
  };

  const handleAddImpianto = (impianto: Omit<Impianto, 'id' | 'dataCreazione'>) => {
    setData(addImpianto(data, impianto));
  };

  const handleUpdateImpianto = (impianto: Impianto) => {
    setData(updateImpianto(data, impianto));
  };

  const handleDeleteImpianto = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo impianto? Verranno eliminati anche i certificati associati.')) {
      setData(deleteImpianto(data, id));
    }
  };

  const handleAddCertificato = (certificato: Omit<Certificato, 'id' | 'dataCreazione'>) => {
    setData(addCertificato(data, certificato));
    setCurrentPage('certificati');
  };

  const handleUpdateCertificato = (certificato: Certificato) => {
    setData(updateCertificato(data, certificato));
    setEditingCertificato(null);
    setCurrentPage('certificati');
  };

  const handleDeleteCertificato = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo certificato?')) {
      setData(deleteCertificato(data, id));
    }
  };

  const handleSetTecnico = (tecnico: Tecnico) => {
    setData(setTecnico(data, tecnico));
  };

  const handleExport = () => {
    exportDataAsJSON(data);
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importDataFromJSON(file);
      setData(imported);
      alert('Dati importati con successo!');
    } catch {
      alert('Errore durante l\'importazione dei dati.');
    }
  };

  const handleEditCertificato = (certificato: Certificato) => {
    setEditingCertificato(certificato);
    setCurrentPage('nuovo-certificato');
  };

  const handlePrintCertificato = (certificato: Certificato) => {
    setPrintingCertificato(certificato);
    setCurrentPage('stampa');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={data} onNavigate={(page: string) => setCurrentPage(page as Page)} />;
      case 'clienti':
        return (
          <ClientiPage
            clienti={data.clienti}
            onAdd={handleAddCliente}
            onUpdate={handleUpdateCliente}
            onDelete={handleDeleteCliente}
          />
        );
      case 'impianti':
        return (
          <ImpiantiPage
            impianti={data.impianti}
            clienti={data.clienti}
            onAdd={handleAddImpianto}
            onUpdate={handleUpdateImpianto}
            onDelete={handleDeleteImpianto}
          />
        );
      case 'certificati':
        return (
          <CertificatiPage
            certificati={data.certificati}
            clienti={data.clienti}
            impianti={data.impianti}
            onAdd={() => { setEditingCertificato(null); setCurrentPage('nuovo-certificato'); }}
            onEdit={handleEditCertificato}
            onDelete={handleDeleteCertificato}
            onPrint={handlePrintCertificato}
          />
        );
      case 'nuovo-certificato':
        return (
          <CertificatoForm
            clienti={data.clienti}
            impianti={data.impianti}
            tecnico={data.tecnico}
            certificati={data.certificati}
            editingCertificato={editingCertificato}
            onSave={editingCertificato ? handleUpdateCertificato : handleAddCertificato}
            onCancel={() => { setEditingCertificato(null); setCurrentPage('certificati'); }}
          />
        );
      case 'tecnico':
        return (
          <TecnicoPage
            tecnico={data.tecnico}
            onSave={handleSetTecnico}
          />
        );
      case 'stampa':
        return printingCertificato ? (
          <CertificatoPrint
            certificato={printingCertificato}
            cliente={data.clienti.find(c => c.id === printingCertificato.clienteId)}
            impianto={data.impianti.find(i => i.id === printingCertificato.impiantoId)}
            tecnico={data.tecnico}
            onBack={() => { setPrintingCertificato(null); setCurrentPage('certificati'); }}
          />
        ) : null;
      default:
        return <Dashboard data={data} onNavigate={(page: string) => setCurrentPage(page as Page)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page: string) => { setCurrentPage(page as Page); setSidebarOpen(false); }}
        onExport={handleExport}
        onImport={handleImport}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden bg-blue-800 text-white p-4 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-xl">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="font-bold">Certificazioni 37/2008</h1>
        </div>
        <div className="p-4 md:p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
