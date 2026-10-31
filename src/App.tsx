import { useState, useEffect } from 'react';
import { AppData, Cliente, Impianto, Certificato, Tecnico } from './types';
import { SchedaTecnica } from './schedeTecniche';
import { CadElement } from './components/MiniCAD';
import { loadData, addCliente, updateCliente, deleteCliente, addImpianto, updateImpianto, deleteImpianto, addCertificato, updateCertificato, deleteCertificato, setTecnico, exportDataAsJSON, importDataFromJSON, loadSchede, addScheda, updateScheda, deleteScheda, loadCadSchemi, saveCadSchema } from './store';
import Dashboard from './components/Dashboard';
import ClientiPage from './components/ClientiPage';
import ImpiantiPage from './components/ImpiantiPage';
import CertificatiPage from './components/CertificatiPage';
import CertificatoForm from './components/CertificatoForm';
import CertificatoPrint from './components/CertificatoPrint';
import TecnicoPage from './components/TecnicoPage';
import SchedeTecnichePage from './components/SchedeTecnichePage';
import MiniCAD from './components/MiniCAD';
import WizardDiCo from './components/WizardDiCo';
import ArchivioAllegati, { Allegato, loadAllegati, saveAllegati } from './components/ArchivioAllegati';
import Sidebar from './components/Sidebar';

type Page = 'dashboard' | 'clienti' | 'impianti' | 'certificati' | 'nuovo-certificato' | 'tecnico' | 'stampa' | 'schede' | 'cad' | 'allegati';

export default function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [schede, setSchede] = useState<SchedaTecnica[]>(loadSchede());
  const [schemiCad, setSchemiCad] = useState<Record<string, CadElement[]>>(loadCadSchemi());
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [editingCertificato, setEditingCertificato] = useState<Certificato | null>(null);
  const [printingCertificato, setPrintingCertificato] = useState<Certificato | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cadImpiantoId, setCadImpiantoId] = useState<string | null>(null);
  const [showWizardDiCo, setShowWizardDiCo] = useState(false);
  const [allegati, setAllegati] = useState<Allegato[]>(loadAllegati());

  useEffect(() => {
    setData(loadData());
    setSchede(loadSchede());
    setSchemiCad(loadCadSchemi());
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

  // Gestione Schede Tecniche
  const handleAddScheda = (scheda: Omit<SchedaTecnica, 'id' | 'dataCreazione' | 'dataModifica'>) => {
    setSchede(addScheda(schede, scheda));
  };

  const handleUpdateScheda = (scheda: SchedaTecnica) => {
    setSchede(updateScheda(schede, scheda));
  };

  const handleDeleteScheda = (id: string) => {
    setSchede(deleteScheda(schede, id));
  };

  // Gestione CAD
  const handleOpenCAD = (impiantoId: string) => {
    setCadImpiantoId(impiantoId);
    setCurrentPage('cad');
  };

  const handleCADChange = (elementi: CadElement[]) => {
    if (cadImpiantoId) {
      const newSchemi = { ...schemiCad, [cadImpiantoId]: elementi };
      setSchemiCad(newSchemi);
      saveCadSchema(cadImpiantoId, elementi);
    }
  };

  // Gestione Wizard DiCo
  const handleWizardDiCoComplete = (certificato: any, allegatiFile: File[]) => {
    handleAddCertificato(certificato);
    setShowWizardDiCo(false);
    // TODO: Gestire upload allegati
  };

  // Gestione Archivio Allegati
  const handleAddAllegati = (nuoviAllegati: Allegato[]) => {
    const updated = [...allegati, ...nuoviAllegati];
    setAllegati(updated);
    saveAllegati(updated);
  };

  const handleDeleteAllegato = (id: string) => {
    const updated = allegati.filter(a => a.id !== id);
    setAllegati(updated);
    saveAllegati(updated);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={data} schede={schede} onNavigate={(page: string) => setCurrentPage(page as Page)} />;
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
            schemiCad={schemiCad}
            onAdd={handleAddImpianto}
            onUpdate={handleUpdateImpianto}
            onDelete={handleDeleteImpianto}
            onOpenCAD={handleOpenCAD}
          />
        );
      case 'certificati':
        return (
          <CertificatiPage
            certificati={data.certificati}
            clienti={data.clienti}
            impianti={data.impianti}
            schede={schede}
            onAdd={() => { setEditingCertificato(null); setCurrentPage('nuovo-certificato'); }}
            onEdit={handleEditCertificato}
            onDelete={handleDeleteCertificato}
            onPrint={handlePrintCertificato}
            onWizard={() => setShowWizardDiCo(true)}
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
      case 'schede':
        return (
          <SchedeTecnichePage
            schede={schede}
            clienti={data.clienti}
            impianti={data.impianti}
            onAdd={handleAddScheda}
            onUpdate={handleUpdateScheda}
            onDelete={handleDeleteScheda}
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
      case 'cad':
        return cadImpiantoId ? (
          <MiniCAD
            elementi={schemiCad[cadImpiantoId] || []}
            onChange={handleCADChange}
            onClose={() => { setCadImpiantoId(null); setCurrentPage('impianti'); }}
            impiantoId={cadImpiantoId}
          />
        ) : null;
      case 'allegati':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Archivio Allegati</h1>
              <p className="text-gray-500 mt-1">Gestione file allegati a certificati, schede tecniche e impianti</p>
            </div>
            <ArchivioAllegati
              allegati={allegati}
              onAdd={handleAddAllegati}
              onDelete={handleDeleteAllegato}
            />
          </div>
        );
      default:
        return <Dashboard data={data} schede={schede} onNavigate={(page: string) => setCurrentPage(page as Page)} />;
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
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 overflow-auto">
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

      {/* Wizard DiCo Modal */}
      {showWizardDiCo && (
        <WizardDiCo
          clienti={data.clienti}
          impianti={data.impianti}
          tecnico={data.tecnico}
          certificati={data.certificati}
          onComplete={handleWizardDiCoComplete}
          onCancel={() => setShowWizardDiCo(false)}
        />
      )}
    </div>
  );
}
