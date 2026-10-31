import { Cliente, Impianto, Tecnico } from './types';

export type TipoSchedaTecnica = 
  | 'DiCo'           // Dichiarazione di Conformità (Allegato I)
  | 'DiRi'           // Dichiarazione di Rispondenza (Allegato II)
  | 'RelazioneTecnica'
  | 'Progetto'
  | 'RegistroManutenzione'
  | 'LibrettoImpianto'
  | 'RapportoControllo'
  | 'CertificatoCollaudo'
  | 'SchedaVerificaElettrica'
  | 'SchedaGas'
  | 'DichiarazioneGas';

export interface SchedaTecnica {
  id: string;
  numero: string;
  tipo: TipoSchedaTecnica;
  impiantoId: string;
  clienteId: string;
  certificatoId?: string; // Collegamento al certificato DiCo
  dataCompilazione: string;
  dataValidita?: string;
  stato: 'bozza' | 'compilata' | 'firmata' | 'archiviata';
  tecnicoId: string;
  dati: Record<string, any>;
  allegati?: string[];
  note?: string;
  dataCreazione: string;
  dataModifica: string;
}

// Campi specifici per ogni tipo di scheda
export const CONFIG_SCHEDE: Record<TipoSchedaTecnica, {
  label: string;
  icon: string;
  color: string;
  norma: string;
  descrizione: string;
  campi: string[];
}> = {
  DiCo: {
    label: 'Dichiarazione di Conformità',
    icon: 'fas fa-file-contract',
    color: 'blue',
    norma: 'D.M. 37/08 - Allegato I',
    descrizione: 'Dichiarazione obbligatoria per impianti nuovi, ristrutturati o ampliati',
    campi: ['committente', 'ubicazione', 'tipologia', 'caratteristiche', 'materiali', 'verifiche', 'norme', 'firma'],
  },
  DiRi: {
    label: 'Dichiarazione di Rispondenza',
    icon: 'fas fa-file-signature',
    color: 'purple',
    norma: 'D.M. 37/08 - Allegato II',
    descrizione: 'Per impianti privi di dichiarazione, realizzati prima del 27/03/2008',
    campi: ['committente', 'ubicazione', 'statoImpianto', 'verifiche', 'norme', 'firma'],
  },
  RelazioneTecnica: {
    label: 'Relazione Tecnica',
    icon: 'fas fa-file-alt',
    color: 'indigo',
    norma: 'D.M. 37/08 art. 5',
    descrizione: 'Relazione tecnica per impianti soggetti a progetto',
    campi: ['descrizione', 'calcoli', 'dimensionamento', 'materiali', 'norme'],
  },
  Progetto: {
    label: 'Progetto Impianto',
    icon: 'fas fa-drafting-compass',
    color: 'cyan',
    norma: 'D.M. 37/08 art. 5',
    descrizione: 'Progetto dell\'impianto redatto da professionista abilitato',
    campi: ['descrizione', 'elaborati', 'schemi', 'calcoli', 'firmaProfessionista'],
  },
  RegistroManutenzione: {
    label: 'Registro di Manutenzione',
    icon: 'fas fa-tools',
    color: 'orange',
    norma: 'D.M. 37/08 art. 8',
    descrizione: 'Registro per interventi di manutenzione e verifica periodica',
    campi: ['dataIntervento', 'tipoIntervento', 'descrizione', 'materiali', 'tecnico', 'firma'],
  },
  LibrettoImpianto: {
    label: 'Libretto di Impianto',
    icon: 'fas fa-book',
    color: 'green',
    norma: 'D.P.R. 74/2013 - D.Lgs 48/2020',
    descrizione: 'Libretto per impianti di climatizzazione (ex D.P.R. 412/93)',
    campi: ['impianto', 'generatori', 'distribuzione', 'emissione', 'regolazione', 'efficienza'],
  },
  RapportoControllo: {
    label: 'Rapporto di Controllo Efficienza',
    icon: 'fas fa-chart-line',
    color: 'teal',
    norma: 'D.Lgs 48/2020 - Allegato A1-A9',
    descrizione: 'Rapporto di efficienza energetica per impianti termici',
    campi: ['impianto', 'generatori', 'misurazioni', 'rendimento', 'emissioni', 'esito'],
  },
  CertificatoCollaudo: {
    label: 'Certificato di Collaudo',
    icon: 'fas fa-check-double',
    color: 'emerald',
    norma: 'D.M. 37/08',
    descrizione: 'Certificato di collaudo finale dell\'impianto',
    campi: ['impianto', 'prove', 'risultati', 'conformita', 'firma'],
  },
  SchedaVerificaElettrica: {
    label: 'Scheda Verifica Impianto Elettrico',
    icon: 'fas fa-bolt',
    color: 'yellow',
    norma: 'CEI 64-8 - Cap. 61',
    descrizione: 'Verifica iniziale e periodica impianti elettrici',
    campi: ['continuita', 'isolamento', 'resistenza', 'differenziali', 'messaTerra', 'funzionali'],
  },
  SchedaGas: {
    label: 'Scheda Tecnica Impianto Gas',
    icon: 'fas fa-fire',
    color: 'red',
    norma: 'UNI 7129 / UNI 10683',
    descrizione: 'Scheda tecnica per impianti a gas per uso domestico',
    campi: ['reteDistribuzione', 'apparecchiUtilizzatori', 'ventilazione', 'scarico', 'provaTenuta'],
  },
  DichiarazioneGas: {
    label: 'Dichiarazione Impianto Gas',
    icon: 'fas fa-file-medical',
    color: 'rose',
    norma: 'UNI 7129 - D.M. 37/08',
    descrizione: 'Dichiarazione specifica per impianti gas',
    campi: ['committente', 'rete', 'apparecchi', 'provaTenuta', 'ventilazione', 'firma'],
  },
};

export const TIPI_INTERVENTO_MANUTENZIONE = [
  'Manutenzione Ordinaria',
  'Manutenzione Straordinaria',
  'Verifica Periodica',
  'Riparazione',
  'Sostituzione Componenti',
  'Pulizia',
  'Taratura',
  'Collaudo',
];

export const TIPI_GENERATORE = [
  'Caldaia a gas',
  'Caldaia a condensazione',
  'Pompa di calore',
  'Stufa a pellet',
  'Camino a legna',
  'Climatizzatore split',
  'Chiller',
  'Gruppo termico',
];

export const ESITI_CONTROLLO = [
  'Conforme',
  'Conforme con prescrizioni',
  'Non conforme',
  'Impianto non raggiungibile',
  'Impianto inattivo',
];
