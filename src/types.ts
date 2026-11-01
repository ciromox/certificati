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
  
  // DATI DICHIARANTE (Ditta Installatrice)
  dichiaranteNome: string;
  dichiaranteCognome: string;
  dichiaranteRuolo: 'titolare' | 'legale_rappresentante';
  impresaRagioneSociale: string;
  impresaSettore: string;
  impresaSedeLegaleIndirizzo: string;
  impresaSedeLegaleNumero: string;
  impresaSedeLegaleComune: string;
  impresaSedeLegaleProvincia: string;
  impresaSedeLegaleCAP: string;
  impresaPartitaIVA: string;
  impresaCodiceFiscale?: string;
  impresaIscrizioneCCIAA?: string;
  impresaIscrizioneCCIAANumero?: string;
  impresaIscrizioneAlboArtigiani?: string;
  impresaIscrizioneAlboArtigianiNumero?: string;
  
  // DATI IMPIANTO
  descrizioneImpianto: string;
  tipoIntervento: 'nuovo' | 'trasformazione' | 'ampliamento' | 'manutenzione_straordinaria' | 'altro';
  tipoInterventoAltro?: string;
  tipoGasDistribuito?: string;
  potenzaMassimaImpegnabile?: number;
  
  // DATI COMMITTENTE
  committenteNome: string;
  committenteCognome?: string;
  committenteRagioneSociale?: string;
  
  // DATI UBICAZIONE
  ubicazioneComune: string;
  ubicazioneProvincia: string;
  ubicazioneIndirizzo: string;
  ubicazioneNumero: string;
  ubicazioneScala?: string;
  ubicazionePiano?: string;
  ubicazioneInterno?: string;
  
  // DATI PROPRIETARIO
  proprietarioNome: string;
  proprietarioCognome?: string;
  proprietarioRagioneSociale?: string;
  proprietarioComune?: string;
  proprietarioIndirizzo?: string;
  proprietarioNumero?: string;
  
  // DATI EDIFICIO
  usoEdificio: 'industriale' | 'civile' | 'commercio' | 'altri_usi';
  
  // DICHIARAZIONE
  rispettatoProgetto: boolean;
  progettoRedattoDa?: string;
  seguitoNormativaTecnica: boolean;
  normativaTecnicaRiferimento?: string;
  installatoComponentiRegolaArte: boolean;
  controllatoImpiantoSicurezza: boolean;
  
  // ALLEGATI OBBLIGATORI
  allegatoProgetto: boolean;
  allegatoRelazioneMateriali: boolean;
  allegatoSchemaImpianto: boolean;
  allegatoDichiarazioniPrecedenti: boolean;
  allegatoCertificatoRequisiti: boolean;
  
  // ALLEGATI FACOLTATIVI
  allegatiFacoltativi?: string[];
  
  // DATI TECNICI
  descrizioneLavoro: string;
  materialiUtilizzati: Array<{
    nome: string;
    quantita: number;
    unitaMisura: string;
    descrizione?: string;
    normaRiferimento?: string;
  }>;
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
  // Campi aziendali
  azienda?: string;
  ruolo?: 'titolare' | 'legale_rappresentante' | 'dipendente';
  cciaa?: string;
  cciaaNumero?: string;
  alboArtigiani?: string;
  alboArtigianiNumero?: string;
}

export interface DittaInstallatrice {
  id: string;
  ragioneSociale: string;
  partitaIva: string;
  codiceFiscale?: string;
  indirizzo: string;
  numeroCivico: string;
  citta: string;
  provincia: string;
  cap: string;
  telefono: string;
  email: string;
  pec?: string;
  settore: string;
  // Abilitazioni D.M. 37/08
  abilitazioni: ('a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g')[];
  // Iscrizioni
  cciaa?: string;
  cciaaNumero?: string;
  alboArtigiani?: string;
  alboArtigianiNumero?: string;
  // Legale rappresentante
  legaleRappresentanteNome: string;
  legaleRappresentanteCognome: string;
  legaleRappresentanteCF: string;
  // Certificazioni
  certificatoISO9001?: boolean;
  certificatoISO14001?: boolean;
  certificatoISO45001?: boolean;
  certificatoFGas?: string;
  // Note
  note?: string;
  dataCreazione: string;
  attivo: boolean;
}

export interface AppData {
  clienti: Cliente[];
  impianti: Impianto[];
  certificati: Certificato[];
  tecnico: Tecnico | null;
  ditte: DittaInstallatrice[];
}
