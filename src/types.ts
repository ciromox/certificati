export interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  ragioneSociale?: string;
  codiceFiscale: string;
  partitaIva?: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  telefono?: string;
  email?: string;
  dataCreazione: string;
}

export interface Impianto {
  id: string;
  clienteId: string;
  tipologia: TipologiaImpianto;
  destinazioneUso: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  caratteristiche: string;
  potenza?: number;
  tensione?: number;
  puntiUtilizzazione?: number;
  dataInstallazione?: string;
  note?: string;
  dataCreazione: string;
}

export type TipologiaImpianto = 
  | 'elettrico'
  | 'idrico-sanitario'
  | 'gas'
  | 'riscaldamento'
  | 'climatizzazione'
  | 'fgas'
  | 'antincendio'
  | 'antifurto'
  | 'ascensori';

export type TipoCertificato = 'DiCo' | 'DiRi' | 'Verifica' | 'Manutenzione';

export interface Certificato {
  id: string;
  numero: string;
  tipo: TipoCertificato;
  impiantoId: string;
  clienteId: string;
  dataRilascio: string;
  dataValidita?: string;
  stato: 'bozza' | 'emesso' | 'archiviato' | 'scaduto';
  descrizioneLavoro: string;
  materialiUtilizzati: string[];
  verificheEffettuate: string;
  conformitaNorme: string[];
  note?: string;
  firmaTecnico: string;
  tecnicoResponsabile: string;
  abilitazioneTecnico: string;
  allegati?: string[];
  dataCreazione: string;
}

export interface Tecnico {
  id: string;
  nome: string;
  cognome: string;
  abilitazione: string;
  numeroOrdine: string;
  ordine: string;
  citta: string;
  provincia: string;
  indirizzo: string;
  cap: string;
  telefono: string;
  email: string;
  partitaIva: string;
  codiceFiscale: string;
}

export interface AppData {
  clienti: Cliente[];
  impianti: Impianto[];
  certificati: Certificato[];
  tecnico: Tecnico | null;
}
