import { AppData, Cliente, Impianto, Certificato, Tecnico, DittaInstallatrice } from './types';
import { SchedaTecnica } from './schedeTecniche';
import { CadElement } from './components/MiniCAD';

const STORAGE_KEY = 'certificazioni_37_2008_data';
const SCHEDE_KEY = 'certificazioni_37_2008_schede';
const CAD_KEY = 'certificazioni_37_2008_cad';

const defaultData: AppData = {
  clienti: [],
  impianti: [],
  certificati: [],
  tecnico: null,
  ditte: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Errore caricamento dati:', e);
  }
  return { ...defaultData };
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function generateNumeroCertificato(tipo: string, certificati: Certificato[]): string {
  const year = new Date().getFullYear();
  const prefix = tipo === 'DiCo' ? 'DC' : tipo === 'DiRi' ? 'DR' : tipo === 'Verifica' ? 'VF' : 'MN';
  const count = certificati.filter(c => c.numero.startsWith(`${prefix}-${year}`)).length + 1;
  return `${prefix}-${year}-${String(count).padStart(4, '0')}`;
}

export function addCliente(data: AppData, cliente: Omit<Cliente, 'id' | 'dataCreazione'>): AppData {
  const newCliente: Cliente = {
    ...cliente,
    id: generateId(),
    dataCreazione: new Date().toISOString(),
  };
  const newData = { ...data, clienti: [...data.clienti, newCliente] };
  saveData(newData);
  return newData;
}

export function updateCliente(data: AppData, cliente: Cliente): AppData {
  const newData = {
    ...data,
    clienti: data.clienti.map(c => c.id === cliente.id ? cliente : c),
  };
  saveData(newData);
  return newData;
}

export function deleteCliente(data: AppData, id: string): AppData {
  const newData = {
    ...data,
    clienti: data.clienti.filter(c => c.id !== id),
    impianti: data.impianti.filter(i => i.clienteId !== id),
    certificati: data.certificati.filter(c => c.clienteId !== id),
  };
  saveData(newData);
  return newData;
}

export function addImpianto(data: AppData, impianto: Omit<Impianto, 'id' | 'dataCreazione'>): AppData {
  const newImpianto: Impianto = {
    ...impianto,
    id: generateId(),
    dataCreazione: new Date().toISOString(),
  };
  const newData = { ...data, impianti: [...data.impianti, newImpianto] };
  saveData(newData);
  return newData;
}

export function updateImpianto(data: AppData, impianto: Impianto): AppData {
  const newData = {
    ...data,
    impianti: data.impianti.map(i => i.id === impianto.id ? impianto : i),
  };
  saveData(newData);
  return newData;
}

export function deleteImpianto(data: AppData, id: string): AppData {
  const newData = {
    ...data,
    impianti: data.impianti.filter(i => i.id !== id),
    certificati: data.certificati.filter(c => c.impiantoId !== id),
  };
  saveData(newData);
  return newData;
}

export function addCertificato(data: AppData, certificato: Omit<Certificato, 'id' | 'dataCreazione'>): AppData {
  const newCertificato: Certificato = {
    ...certificato,
    id: generateId(),
    dataCreazione: new Date().toISOString(),
  };
  const newData = { ...data, certificati: [...data.certificati, newCertificato] };
  saveData(newData);
  return newData;
}

export function updateCertificato(data: AppData, certificato: Certificato): AppData {
  const newData = {
    ...data,
    certificati: data.certificati.map(c => c.id === certificato.id ? certificato : c),
  };
  saveData(newData);
  return newData;
}

export function deleteCertificato(data: AppData, id: string): AppData {
  const newData = {
    ...data,
    certificati: data.certificati.filter(c => c.id !== id),
  };
  saveData(newData);
  return newData;
}

export function setTecnico(data: AppData, tecnico: Tecnico): AppData {
  const newData = { ...data, tecnico };
  saveData(newData);
  return newData;
}

export function exportDataAsJSON(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificazioni_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Funzioni per le Schede Tecniche
export function loadSchede(): SchedaTecnica[] {
  try {
    const raw = localStorage.getItem(SCHEDE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Errore caricamento schede:', e);
  }
  return [];
}

export function saveSchede(schede: SchedaTecnica[]): void {
  localStorage.setItem(SCHEDE_KEY, JSON.stringify(schede));
}

export function addScheda(schede: SchedaTecnica[], scheda: Omit<SchedaTecnica, 'id' | 'dataCreazione' | 'dataModifica'>): SchedaTecnica[] {
  const newScheda: SchedaTecnica = {
    ...scheda,
    id: generateId(),
    dataCreazione: new Date().toISOString(),
    dataModifica: new Date().toISOString(),
  };
  const updated = [...schede, newScheda];
  saveSchede(updated);
  return updated;
}

export function updateScheda(schede: SchedaTecnica[], scheda: SchedaTecnica): SchedaTecnica[] {
  const updated = schede.map(s => s.id === scheda.id ? scheda : s);
  saveSchede(updated);
  return updated;
}

export function deleteScheda(schede: SchedaTecnica[], id: string): SchedaTecnica[] {
  const updated = schede.filter(s => s.id !== id);
  saveSchede(updated);
  return updated;
}

// Funzioni per gli schemi CAD
export function loadCadSchemi(): Record<string, CadElement[]> {
  try {
    const raw = localStorage.getItem(CAD_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Errore caricamento schemi CAD:', e);
  }
  return {};
}

export function saveCadSchema(impiantoId: string, elementi: CadElement[]): void {
  const schemi = loadCadSchemi();
  schemi[impiantoId] = elementi;
  localStorage.setItem(CAD_KEY, JSON.stringify(schemi));
}

// Funzioni per le Ditte Installatrici
export function addDitta(data: AppData, ditta: Omit<DittaInstallatrice, 'id' | 'dataCreazione'>): AppData {
  const newDitta: DittaInstallatrice = {
    ...ditta,
    id: generateId(),
    dataCreazione: new Date().toISOString(),
  };
  const newData = { ...data, ditte: [...data.ditte, newDitta] };
  saveData(newData);
  return newData;
}

export function updateDitta(data: AppData, ditta: DittaInstallatrice): AppData {
  const newData = {
    ...data,
    ditte: data.ditte.map(d => d.id === ditta.id ? ditta : d),
  };
  saveData(newData);
  return newData;
}

export function deleteDitta(data: AppData, id: string): AppData {
  const newData = {
    ...data,
    ditte: data.ditte.filter(d => d.id !== id),
  };
  saveData(newData);
  return newData;
}
