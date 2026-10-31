// Configurazione completa schede tecniche come app commerciali (Mister DiCo, Praticus, MarioDOC)

export type TipoSchedaCompleta = 
  | 'DiCo_Elettrico'
  | 'DiCo_Gas'
  | 'DiCo_Idrico'
  | 'DiCo_Termico'
  | 'DiCo_Antincendio'
  | 'DiCo_Antifurto'
  | 'DiCo_FGas'
  | 'DiRi'
  | 'Libretto_Impianto'
  | 'Rapporto_Controllo'
  | 'Registro_Manutenzione'
  | 'Progetto_Impianto'
  | 'Relazione_Tecnica'
  | 'Certificato_Collaudo'
  | 'Verifica_Impianto_Elettrico'
  | 'Scheda_Impianto_Gas'
  | 'Registro_FGas'
  | 'Dichiarazione_FGas'
  | 'Dichiarazione_Good_Faith';

export interface SchedaCompletaConfig {
  tipo: TipoSchedaCompleta;
  label: string;
  icon: string;
  color: string;
  norma: string;
  descrizione: string;
  sezioni: SezioneConfig[];
}

export interface SezioneConfig {
  id: string;
  titolo: string;
  icon: string;
  campi: CampoConfig[];
}

export interface CampoConfig {
  id: string;
  label: string;
  tipo: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  help?: string;
  validation?: string;
  defaultValue?: any;
}

// Configurazione completa DiCo Elettrico
export const DICO_ELETTRICO_CONFIG: SchedaCompletaConfig = {
  tipo: 'DiCo_Elettrico',
  label: 'Dichiarazione Conformità Impianto Elettrico',
  icon: 'fas fa-bolt',
  color: 'yellow',
  norma: 'D.M. 37/08 - CEI 64-8',
  descrizione: 'Dichiarazione di conformità per impianti elettrici utilizzatori',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero', label: 'Numero Dichiarazione', tipo: 'text', required: true, placeholder: 'DC-2024-0001' },
        { id: 'data', label: 'Data Rilascio', tipo: 'date', required: true },
        { id: 'tipo_dichiarazione', label: 'Tipo Dichiarazione', tipo: 'select', required: true, options: [
          { value: 'nuovo', label: 'Impianto Nuovo' },
          { value: 'ristrutturazione', label: 'Ristrutturazione Completa' },
          { value: 'ampliamento', label: 'Ampliamento' },
          { value: 'manutenzione_straordinaria', label: 'Manutenzione Straordinaria' }
        ]},
      ]
    },
    {
      id: 'committente',
      titolo: 'Dati Committente',
      icon: 'fas fa-user',
      campi: [
        { id: 'committente_tipo', label: 'Tipo Committente', tipo: 'radio', required: true, options: [
          { value: 'privato', label: 'Persona Fisica' },
          { value: 'azienda', label: 'Persona Giuridica' }
        ]},
        { id: 'committente_nome', label: 'Nome/Ragione Sociale', tipo: 'text', required: true },
        { id: 'committente_cf', label: 'Codice Fiscale', tipo: 'text', required: true, placeholder: '16 caratteri' },
        { id: 'committente_piva', label: 'Partita IVA', tipo: 'text', placeholder: '11 cifre (se azienda)' },
        { id: 'committente_indirizzo', label: 'Indirizzo', tipo: 'text', required: true },
        { id: 'committente_citta', label: 'Città', tipo: 'text', required: true },
        { id: 'committente_cap', label: 'CAP', tipo: 'text', required: true, placeholder: '5 cifre' },
        { id: 'committente_provincia', label: 'Provincia', tipo: 'text', required: true, placeholder: '2 lettere' },
        { id: 'committente_telefono', label: 'Telefono', tipo: 'text' },
        { id: 'committente_email', label: 'Email', tipo: 'text' },
      ]
    },
    {
      id: 'ubicazione',
      titolo: 'Ubicazione Impianto',
      icon: 'fas fa-map-marker-alt',
      campi: [
        { id: 'indirizzo_impianto', label: 'Indirizzo', tipo: 'text', required: true },
        { id: 'citta_impianto', label: 'Città', tipo: 'text', required: true },
        { id: 'cap_impianto', label: 'CAP', tipo: 'text', required: true },
        { id: 'provincia_impianto', label: 'Provincia', tipo: 'text', required: true },
        { id: 'piano', label: 'Piano', tipo: 'text', placeholder: 'Es: 1° piano' },
        { id: 'interno', label: 'Interno', tipo: 'text', placeholder: 'Es: Int. 5' },
        { id: 'destinazione_uso', label: 'Destinazione d\'Uso', tipo: 'select', required: true, options: [
          { value: 'residenziale', label: 'Abitazione Civile' },
          { value: 'ufficio', label: 'Ufficio' },
          { value: 'commerciale', label: 'Locale Commerciale' },
          { value: 'industriale', label: 'Capannone Industriale' },
          { value: 'condominio', label: 'Condominio' }
        ]},
      ]
    },
    {
      id: 'caratteristiche_impianto',
      titolo: 'Caratteristiche Impianto',
      icon: 'fas fa-cogs',
      campi: [
        { id: 'potenza_impegnata', label: 'Potenza Impegnata', tipo: 'number', required: true, unit: 'kW', min: 0, step: 0.1 },
        { id: 'potenza_disponibile', label: 'Potenza Disponibile', tipo: 'number', unit: 'kW', min: 0, step: 0.1 },
        { id: 'tensione_alimentazione', label: 'Tensione Alimentazione', tipo: 'select', required: true, options: [
          { value: '230', label: '230V Monofase' },
          { value: '400', label: '400V Trifase' },
          { value: '230_400', label: '230/400V Trifase' }
        ]},
        { id: 'frequenza', label: 'Frequenza', tipo: 'select', required: true, options: [
          { value: '50', label: '50 Hz' },
          { value: '60', label: '60 Hz' }
        ]},
        { id: 'punti_utilizzazione', label: 'Numero Punti Utilizzazione', tipo: 'number', required: true, min: 1 },
        { id: 'punti_luce', label: 'Numero Punti Luce', tipo: 'number', min: 0 },
        { id: 'prese', label: 'Numero Prese', tipo: 'number', min: 0 },
        { id: 'interruttori', label: 'Numero Interruttori', tipo: 'number', min: 0 },
        { id: 'data_installazione', label: 'Data Installazione', tipo: 'date', required: true },
        { id: 'sistema_terra', label: 'Sistema di Terra', tipo: 'select', required: true, options: [
          { value: 'TT', label: 'Sistema TT' },
          { value: 'TN-S', label: 'Sistema TN-S' },
          { value: 'TN-C', label: 'Sistema TN-C' },
          { value: 'IT', label: 'Sistema IT' }
        ]},
      ]
    },
    {
      id: 'componenti_principali',
      titolo: 'Componenti Principali',
      icon: 'fas fa-microchip',
      campi: [
        { id: 'quadro_generale', label: 'Quadro Generale', tipo: 'text', placeholder: 'Marca e modello' },
        { id: 'contatore', label: 'Contatore Enel', tipo: 'text', placeholder: 'Numero matricola' },
        { id: 'interruttore_generale', label: 'Interruttore Generale', tipo: 'text', placeholder: 'Es: 63A' },
        { id: 'differenziali', label: 'Interruttori Differenziali', tipo: 'textarea', placeholder: 'Elenco differenziali con caratteristiche' },
        { id: 'magnetotermici', label: 'Interruttori Magnetotermici', tipo: 'textarea', placeholder: 'Elenco magnetotermici con caratteristiche' },
        { id: 'scaricatori', label: 'Scaricatori Sovratensioni', tipo: 'text', placeholder: 'Se installati' },
      ]
    },
    {
      id: 'materiali',
      titolo: 'Materiali e Componenti Installati',
      icon: 'fas fa-boxes',
      campi: [
        { id: 'cavi_tipo', label: 'Tipo Cavi', tipo: 'textarea', required: true, placeholder: 'Es: N07V-K, N07VH-H, FG16OM16...' },
        { id: 'cavi_sezioni', label: 'Sezioni Cavi', tipo: 'textarea', required: true, placeholder: 'Es: 1.5mm² illuminazione, 2.5mm² prese, 6mm² cucina...' },
        { id: 'tubi', label: 'Tubi e Canalette', tipo: 'textarea', placeholder: 'Es: Tubi in PVC ø16, ø20, canaline...' },
        { id: 'frutti', label: 'Frutti e Placche', tipo: 'text', placeholder: 'Marca e serie' },
        { id: 'apparecchi_utilizzatori', label: 'Apparecchi Utilizzatori', tipo: 'textarea', placeholder: 'Elenco apparecchi collegati' },
        { id: 'certificazioni_materiali', label: 'Certificazioni Materiali', tipo: 'checkbox', options: [
          { value: 'imq', label: 'Marchio IMQ' },
          { value: 'ce', label: 'Marcatura CE' },
          { value: 'tuv', label: 'Certificazione TUV' }
        ]},
      ]
    },
    {
      id: 'verifiche',
      titolo: 'Verifiche Effettuate',
      icon: 'fas fa-clipboard-check',
      campi: [
        { id: 'continuita_conduttori', label: 'Continuità Conduttori di Protezione', tipo: 'checkbox', required: true },
        { id: 'resistenza_isolamento', label: 'Resistenza di Isolamento', tipo: 'number', unit: 'MΩ', min: 0, step: 0.01 },
        { id: 'resistenza_terra', label: 'Resistenza di Terra', tipo: 'number', unit: 'Ω', min: 0, step: 0.1 },
        { id: 'intervento_differenziali', label: 'Tempo Intervento Differenziali', tipo: 'number', unit: 'ms', min: 0 },
        { id: 'corrente_intervento_diff', label: 'Corrente Intervento Differenziali', tipo: 'number', unit: 'mA', min: 0 },
        { id: 'resistenza_anello', label: 'Resistenza Anello di Guasto', tipo: 'number', unit: 'Ω', min: 0, step: 0.01 },
        { id: 'verifica_funzionale', label: 'Verifica Funzionale', tipo: 'checkbox', required: true },
        { id: 'note_verifiche', label: 'Note Verifiche', tipo: 'textarea', placeholder: 'Eventuali osservazioni...' },
      ]
    },
    {
      id: 'norme',
      titolo: 'Norme Tecniche Applicate',
      icon: 'fas fa-gavel',
      campi: [
        { id: 'norme_principali', label: 'Norme Principali', tipo: 'checkbox', required: true, options: [
          { value: 'cei_64-8', label: 'CEI 64-8 (Impianti utilizzatori BT)' },
          { value: 'cei_64-50', label: 'CEI 64-50 (Impianti residenziali)' },
          { value: 'cei_0-21', label: 'CEI 0-21 (Sistemi attivi utenza)' }
        ]},
        { id: 'altre_norme', label: 'Altre Norme Applicate', tipo: 'textarea', placeholder: 'Eventuali altre norme...' },
      ]
    },
    {
      id: 'documentazione',
      titolo: 'Documentazione Allegata',
      icon: 'fas fa-paperclip',
      campi: [
        { id: 'schema_unifilare', label: 'Schema Unifilare', tipo: 'checkbox', required: true },
        { id: 'planimetria', label: 'Planimetria Impianto', tipo: 'checkbox', required: true },
        { id: 'rapporto_prove', label: 'Rapporto Prove', tipo: 'checkbox', required: true },
        { id: 'certificati_materiali', label: 'Certificati Materiali', tipo: 'checkbox' },
        { id: 'foto_impianto', label: 'Foto Impianto', tipo: 'checkbox' },
        { id: 'progetto', label: 'Progetto (se obbligatorio)', tipo: 'checkbox' },
        { id: 'altri_documenti', label: 'Altri Documenti', tipo: 'textarea', placeholder: 'Elenco altri documenti allegati...' },
      ]
    },
    {
      id: 'tecnico',
      titolo: 'Dati Tecnico Responsabile',
      icon: 'fas fa-user-tie',
      campi: [
        { id: 'tecnico_nome', label: 'Nome e Cognome', tipo: 'text', required: true },
        { id: 'tecnico_cf', label: 'Codice Fiscale', tipo: 'text', required: true },
        { id: 'tecnico_abilitazione', label: 'Abilitazione (Art. 3 D.M. 37/08)', tipo: 'select', required: true, options: [
          { value: 'a', label: 'Lettera a) - Impianti elettrici' },
          { value: 'b', label: 'Lettera b) - Impianti idrico-sanitari' },
          { value: 'c', label: 'Lettera c) - Impianti gas' },
          { value: 'd', label: 'Lettera d) - Riscaldamento/climatizzazione' },
          { value: 'e', label: 'Lettera e) - Impianti antincendio' },
          { value: 'f', label: 'Lettera f) - Impianti antifurto' },
          { value: 'g', label: 'Lettera g) - Ascensori/montacarichi' }
        ]},
        { id: 'tecnico_ordine', label: 'Ordine/Collegio', tipo: 'text' },
        { id: 'tecnico_numero_iscrizione', label: 'Numero Iscrizione', tipo: 'text' },
        { id: 'impresa_nome', label: 'Nome Impresa', tipo: 'text', required: true },
        { id: 'impresa_piva', label: 'Partita IVA Impresa', tipo: 'text', required: true },
        { id: 'impresa_indirizzo', label: 'Indirizzo Impresa', tipo: 'text', required: true },
        { id: 'impresa_camera_commercio', label: 'Camera di Commercio', tipo: 'text' },
        { id: 'impresa_numero_iscrizione', label: 'Numero Iscrizione CCIAA', tipo: 'text' },
        { id: 'firma_tecnico', label: 'Firma Tecnico', tipo: 'text', required: true },
      ]
    },
  ]
};

// Configurazione completa DiCo Gas
export const DICO_GAS_CONFIG: SchedaCompletaConfig = {
  tipo: 'DiCo_Gas',
  label: 'Dichiarazione Conformità Impianto Gas',
  icon: 'fas fa-fire',
  color: 'red',
  norma: 'D.M. 37/08 - UNI 7129',
  descrizione: 'Dichiarazione di conformità per impianti gas per uso domestico',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero', label: 'Numero Dichiarazione', tipo: 'text', required: true },
        { id: 'data', label: 'Data Rilascio', tipo: 'date', required: true },
        { id: 'tipo_intervento', label: 'Tipo Intervento', tipo: 'select', required: true, options: [
          { value: 'nuovo', label: 'Impianto Nuovo' },
          { value: 'modifica', label: 'Modifica' },
          { value: 'ampliamento', label: 'Ampliamento' },
          { value: 'sostituzione', label: 'Sostituzione Contatore' }
        ]},
      ]
    },
    {
      id: 'rete_distribuzione',
      titolo: 'Rete di Distribuzione Interna',
      icon: 'fas fa-project-diagram',
      campi: [
        { id: 'tipo_tubi', label: 'Tipo Tubazioni', tipo: 'select', required: true, options: [
          { value: 'rame', label: 'Rame' },
          { value: 'acciaio', label: 'Acciaio' },
          { value: 'stratificato', label: 'Tubo Stratificato' },
          { value: 'misto', label: 'Misto' }
        ]},
        { id: 'diametri_tubi', label: 'Diametri Tubazioni', tipo: 'textarea', required: true, placeholder: 'Es: ø12, ø15, ø22...' },
        { id: 'lunghezza_totale', label: 'Lunghezza Totale', tipo: 'number', unit: 'm', min: 0 },
        { id: 'giunzioni', label: 'Tipo Giunzioni', tipo: 'select', required: true, options: [
          { value: 'saldatura', label: 'Saldatura' },
          { value: 'brasatura', label: 'Brasatura' },
          { value: 'meccanica', label: 'Giunzioni Meccaniche' },
          { value: 'mista', label: 'Mista' }
        ]},
        { id: 'fissaggi', label: 'Fissaggi', tipo: 'textarea', placeholder: 'Descrizione fissaggi...' },
        { id: 'protezione_corrosione', label: 'Protezione Corrosione', tipo: 'text' },
      ]
    },
    {
      id: 'contatore',
      titolo: 'Gruppo di Misura',
      icon: 'fas fa-tachometer-alt',
      campi: [
        { id: 'tipo_contatore', label: 'Tipo Contatore', tipo: 'select', required: true, options: [
          { value: 'G4', label: 'G4 - 2.5 mc/h' },
          { value: 'G6', label: 'G6 - 4 mc/h' },
          { value: 'G10', label: 'G10 - 6 mc/h' },
          { value: 'G16', label: 'G16 - 10 mc/h' },
          { value: 'G25', label: 'G25 - 16 mc/h' },
          { value: 'G40', label: 'G40 - 25 mc/h' }
        ]},
        { id: 'matricola_contatore', label: 'Matricola Contatore', tipo: 'text', required: true },
        { id: 'pressione_rete', label: 'Pressione Rete', tipo: 'select', required: true, options: [
          { value: 'bassa', label: 'Bassa Pressione' },
          { value: 'media', label: 'Media Pressione' }
        ]},
        { id: 'rubinetto_contatore', label: 'Rubinetto a Valle Contatore', tipo: 'checkbox', required: true },
      ]
    },
    {
      id: 'apparecchi',
      titolo: 'Apparecchi Utilizzatori',
      icon: 'fas fa-list',
      campi: [
        { id: 'numero_apparecchi', label: 'Numero Apparecchi', tipo: 'number', required: true, min: 1 },
        { id: 'elenco_apparecchi', label: 'Elenco Apparecchi', tipo: 'textarea', required: true, placeholder: 'Es:\n1. Caldaia murali - Marca XY - 24 kW\n2. Piano cottura - Marca ZW - 4 fuochi\n3. Scaldabagno - Marca AB - 50L' },
        { id: 'potenza_totale', label: 'Potenza Termica Totale', tipo: 'number', unit: 'kW', min: 0, step: 0.1 },
        { id: 'tipo_apparecchi', label: 'Tipo Apparecchi', tipo: 'checkbox', options: [
          { value: 'caldaia', label: 'Caldaia' },
          { value: 'scaldabagno', label: 'Scaldabagno' },
          { value: 'cucina', label: 'Cucina/Piano Cottura' },
          { value: 'termocamino', label: 'Termocamino' },
          { value: 'stufa', label: 'Stufa' }
        ]},
      ]
    },
    {
      id: 'ventilazione',
      titolo: 'Ventilazione e Aerazione',
      icon: 'fas fa-wind',
      campi: [
        { id: 'ventilazione_presente', label: 'Ventilazione Presente', tipo: 'checkbox', required: true },
        { id: 'tipo_ventilazione', label: 'Tipo Ventilazione', tipo: 'select', options: [
          { value: 'naturale', label: 'Naturale' },
          { value: 'forzata', label: 'Forzata' },
          { value: 'mista', label: 'Mista' }
        ]},
        { id: 'superficie_fori', label: 'Superficie Fori Ventilazione', tipo: 'number', unit: 'cm²', min: 0 },
        { id: 'posizione_fori', label: 'Posizione Fori', tipo: 'text', placeholder: 'Es: Alto/basso, pareti esterne...' },
        { id: 'apertura_minima', label: 'Apertura Minima', tipo: 'number', unit: 'cm²', min: 0 },
      ]
    },
    {
      id: 'scarico',
      titolo: 'Scarico Prodotti Combustione',
      icon: 'fas fa-smog',
      campi: [
        { id: 'tipo_scarico', label: 'Tipo Scarico', tipo: 'select', required: true, options: [
          { value: 'canna_fumaria', label: 'Canna Fumaria' },
          { value: 'scarico_parete', label: 'Scarico a Parete' },
          { value: 'scarico_tetto', label: 'Scarico a Tetto' }
        ]},
        { id: 'materiale_scarico', label: 'Materiale Scarico', tipo: 'select', options: [
          { value: 'acciaio_inox', label: 'Acciaio Inox' },
          { value: 'alluminio', label: 'Alluminio' },
          { value: 'materiale_plastico', label: 'Materiale Plastico' }
        ]},
        { id: 'diametro_scarico', label: 'Diametro Scarico', tipo: 'number', unit: 'mm', min: 0 },
        { id: 'lunghezza_scarico', label: 'Lunghezza Scarico', tipo: 'number', unit: 'm', min: 0 },
        { id: 'tiraggio', label: 'Tiraggio', tipo: 'select', options: [
          { value: 'naturale', label: 'Naturale' },
          { value: 'forzato', label: 'Forzato' }
        ]},
      ]
    },
    {
      id: 'prova_tenuta',
      titolo: 'Prova di Tenuta',
      icon: 'fas fa-check-circle',
      campi: [
        { id: 'data_prova', label: 'Data Prova', tipo: 'date', required: true },
        { id: 'pressione_prova', label: 'Pressione Prova', tipo: 'number', required: true, unit: 'mbar', min: 0 },
        { id: 'durata_prova', label: 'Durata Prova', tipo: 'number', required: true, unit: 'min', min: 15 },
        { id: 'caduta_pressione', label: 'Caduta Pressione', tipo: 'number', unit: 'mbar', min: 0, step: 0.01 },
        { id: 'esito_prova', label: 'Esito Prova', tipo: 'radio', required: true, options: [
          { value: 'positivo', label: 'Positivo (Nessuna Perdita)' },
          { value: 'negativo', label: 'Negativo (Perdite Rilevate)' }
        ]},
        { id: 'strumento_utilizzato', label: 'Strumento Utilizzato', tipo: 'text', placeholder: 'Es: Manometro digitale marca XY' },
        { id: 'note_prova', label: 'Note Prova', tipo: 'textarea' },
      ]
    },
    {
      id: 'sicurezza',
      titolo: 'Dispositivi di Sicurezza',
      icon: 'fas fa-shield-alt',
      campi: [
        { id: 'rubinetti_sicurezza', label: 'Rubinetti di Sicurezza', tipo: 'checkbox', required: true },
        { id: 'valvole_sicurezza', label: 'Valvole di Sicurezza', tipo: 'checkbox' },
        { id: 'rilevatore_gas', label: 'Rilevatore Gas', tipo: 'checkbox' },
        { id: 'elettrovalvola', label: 'Elettrovalvola', tipo: 'checkbox' },
        { id: 'altri_dispositivi', label: 'Altri Dispositivi', tipo: 'textarea' },
      ]
    },
    {
      id: 'norme',
      titolo: 'Norme Tecniche Applicate',
      icon: 'fas fa-gavel',
      campi: [
        { id: 'norme_principali', label: 'Norme Principali', tipo: 'checkbox', required: true, options: [
          { value: 'uni_7129-1', label: 'UNI 7129-1 (Rete distribuzione)' },
          { value: 'uni_7129-2', label: 'UNI 7129-2 (Apparecchi)' },
          { value: 'uni_7129-3', label: 'UNI 7129-3 (Scarico)' },
          { value: 'uni_7129-4', label: 'UNI 7129-4 (Messa in servizio)' }
        ]},
      ]
    },
    {
      id: 'tecnico',
      titolo: 'Dati Tecnico Responsabile',
      icon: 'fas fa-user-tie',
      campi: [
        { id: 'tecnico_nome', label: 'Nome e Cognome', tipo: 'text', required: true },
        { id: 'tecnico_cf', label: 'Codice Fiscale', tipo: 'text', required: true },
        { id: 'tecnico_abilitazione', label: 'Abilitazione', tipo: 'text', required: true, defaultValue: 'Lettera c) - Impianti gas' },
        { id: 'impresa_nome', label: 'Nome Impresa', tipo: 'text', required: true },
        { id: 'impresa_piva', label: 'Partita IVA Impresa', tipo: 'text', required: true },
        { id: 'firma_tecnico', label: 'Firma Tecnico', tipo: 'text', required: true },
      ]
    },
  ]
};

// Configurazione completa DiCo F-Gas (DPR 146/2018 - Regolamento UE 517/2014)
export const DICO_FGAS_CONFIG: SchedaCompletaConfig = {
  tipo: 'DiCo_FGas',
  label: 'Dichiarazione Conformità Impianto F-Gas (Refrigerazione/Climatizzazione)',
  icon: 'fas fa-snowflake',
  color: 'cyan',
  norma: 'DPR 146/2018 - Reg. UE 517/2014 - D.M. 37/08',
  descrizione: 'Dichiarazione di conformità per impianti di refrigerazione e climatizzazione con gas fluorurati',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero', label: 'Numero Dichiarazione', tipo: 'text', required: true, placeholder: 'DC-FGAS-2024-0001' },
        { id: 'data', label: 'Data Rilascio', tipo: 'date', required: true },
        { id: 'tipo_intervento', label: 'Tipo Intervento', tipo: 'select', required: true, options: [
          { value: 'installazione', label: 'Installazione Nuova' },
          { value: 'manutenzione', label: 'Manutenzione/Assistenza' },
          { value: 'modifica', label: 'Modifica Impianto' },
          { value: 'smontaggio', label: 'Smontaggio/Recupero' },
          { value: 'controllo_perdite', label: 'Controllo Perdite' }
        ]},
      ]
    },
    {
      id: 'committente',
      titolo: 'Dati Committente',
      icon: 'fas fa-user',
      campi: [
        { id: 'committente_tipo', label: 'Tipo Committente', tipo: 'radio', required: true, options: [
          { value: 'privato', label: 'Persona Fisica' },
          { value: 'azienda', label: 'Persona Giuridica' }
        ]},
        { id: 'committente_nome', label: 'Nome/Ragione Sociale', tipo: 'text', required: true },
        { id: 'committente_cf', label: 'Codice Fiscale', tipo: 'text', required: true },
        { id: 'committente_piva', label: 'Partita IVA', tipo: 'text' },
        { id: 'committente_indirizzo', label: 'Indirizzo', tipo: 'text', required: true },
        { id: 'committente_citta', label: 'Città', tipo: 'text', required: true },
        { id: 'committente_cap', label: 'CAP', tipo: 'text', required: true },
        { id: 'committente_provincia', label: 'Provincia', tipo: 'text', required: true },
        { id: 'committente_telefono', label: 'Telefono', tipo: 'text' },
        { id: 'committente_email', label: 'Email', tipo: 'text' },
      ]
    },
    {
      id: 'ubicazione',
      titolo: 'Ubicazione Impianto',
      icon: 'fas fa-map-marker-alt',
      campi: [
        { id: 'indirizzo_impianto', label: 'Indirizzo', tipo: 'text', required: true },
        { id: 'citta_impianto', label: 'Città', tipo: 'text', required: true },
        { id: 'cap_impianto', label: 'CAP', tipo: 'text', required: true },
        { id: 'provincia_impianto', label: 'Provincia', tipo: 'text', required: true },
        { id: 'destinazione_uso', label: 'Destinazione d\'Uso', tipo: 'select', required: true, options: [
          { value: 'residenziale', label: 'Abitazione Civile' },
          { value: 'ufficio', label: 'Ufficio' },
          { value: 'commerciale', label: 'Locale Commerciale' },
          { value: 'industriale', label: 'Capannone Industriale' },
          { value: 'alberghiero', label: 'Struttura Alberghiera' },
          { value: 'sanitario', label: 'Struttura Sanitaria' }
        ]},
      ]
    },
    {
      id: 'apparecchiature',
      titolo: 'Apparecchiature e Componenti',
      icon: 'fas fa-microchip',
      campi: [
        { id: 'numero_apparecchiature', label: 'Numero Apparecchiature', tipo: 'number', required: true, min: 1 },
        { id: 'tipo_apparecchiatura', label: 'Tipo Apparecchiatura', tipo: 'select', required: true, options: [
          { value: 'split', label: 'Split/Single Split' },
          { value: 'multisplit', label: 'Multi-Split' },
          { value: 'vrv_vrf', label: 'VRV/VRF' },
          { value: 'chiller', label: 'Chiller/Refrigeratore' },
          { value: 'unita_condensante', label: 'Unità Condensante' },
          { value: 'centrale_frigo', label: 'Centrale Frigorifera' },
          { value: 'armadio_frigo', label: 'Armadio Frigorifero' },
          { value: 'banco_frigo', label: 'Banco Frigorifero' },
          { value: 'cella_frigo', label: 'Cella Frigorifera' },
          { value: 'pompa_calore', label: 'Pompa di Calore' }
        ]},
        { id: 'marca', label: 'Marca', tipo: 'text', required: true },
        { id: 'modello', label: 'Modello', tipo: 'text', required: true },
        { id: 'matricola', label: 'Matricola/Serial Number', tipo: 'text', required: true },
        { id: 'potenza_frigo', label: 'Potenza Frigorifera', tipo: 'number', unit: 'kW', min: 0, step: 0.1 },
        { id: 'potenza_termica', label: 'Potenza Termica (se pompa calore)', tipo: 'number', unit: 'kW', min: 0, step: 0.1 },
        { id: 'unita_esterna_modello', label: 'Modello Unità Esterna', tipo: 'text' },
        { id: 'unita_esterna_matricola', label: 'Matricola Unità Esterna', tipo: 'text' },
        { id: 'unita_interne_numero', label: 'Numero Unità Interne', tipo: 'number', min: 1 },
      ]
    },
    {
      id: 'gas_refrigerante',
      titolo: 'Gas Refrigerante',
      icon: 'fas fa-flask',
      campi: [
        { id: 'tipo_gas', label: 'Tipo Gas Refrigerante', tipo: 'select', required: true, options: [
          { value: 'R32', label: 'R32 (GWP 675)' },
          { value: 'R410A', label: 'R410A (GWP 2088)' },
          { value: 'R407C', label: 'R407C (GWP 1774)' },
          { value: 'R134a', label: 'R134a (GWP 1430)' },
          { value: 'R1234yf', label: 'R1234yf (GWP <1)' },
          { value: 'R1234ze', label: 'R1234ze (GWP <1)' },
          { value: 'R290', label: 'R290 - Propano (GWP 3)' },
          { value: 'R600a', label: 'R600a - Isobutano (GWP 3)' },
          { value: 'R744', label: 'R744 - CO2 (GWP 1)' },
          { value: 'R717', label: 'R717 - Ammoniaca (GWP 0)' },
          { value: 'R22', label: 'R22 (GWP 1810) - VIETATO' },
          { value: 'R404A', label: 'R404A (GWP 3922)' },
          { value: 'R507A', label: 'R507A (GWP 3985)' },
          { value: 'altro', label: 'Altro (specificare)' }
        ]},
        { id: 'tipo_gas_altro', label: 'Specificare Tipo Gas', tipo: 'text', placeholder: 'Se "Altro", specificare il tipo' },
        { id: 'carica_gas', label: 'Carica Gas Refrigerante', tipo: 'number', required: true, unit: 'kg', min: 0, step: 0.01 },
        { id: 'gwp', label: 'GWP (Global Warming Potential)', tipo: 'number', required: true, min: 0 },
        { id: 'co2_equivalente', label: 'CO2 Equivalente', tipo: 'number', required: true, unit: 'ton', min: 0, step: 0.001, help: 'Calcolato: carica (kg) × GWP / 1000' },
        { id: 'gas_preimballato', label: 'Gas Preimballato di Fabbrica', tipo: 'radio', required: true, options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No (caricato in opera)' }
        ]},
        { id: 'quantita_preimballata', label: 'Quantità Preimballata', tipo: 'number', unit: 'kg', min: 0, step: 0.01 },
      ]
    },
    {
      id: 'circuito_frigorifero',
      titolo: 'Circuito Frigorifero',
      icon: 'fas fa-project-diagram',
      campi: [
        { id: 'numero_circuiti', label: 'Numero Circuiti Frigoriferi', tipo: 'number', required: true, min: 1 },
        { id: 'ermeticita', label: 'Circuito Ermetico', tipo: 'radio', required: true, options: [
          { value: 'ermetico', label: 'Ermetico/Sigillato' },
          { value: 'non_ermetico', label: 'Non Ermetico (aperto)' }
        ]},
        { id: 'tubazioni_tipo', label: 'Tipo Tubazioni', tipo: 'select', required: true, options: [
          { value: 'rame', label: 'Rame' },
          { value: 'acciaio', label: 'Acciaio' },
          { value: 'alluminio', label: 'Alluminio' },
          { value: 'preisolato', label: 'Tubi Preisolati' }
        ]},
        { id: 'diametro_linea_liquido', label: 'Diametro Linea Liquido', tipo: 'text', placeholder: 'Es: 3/8"' },
        { id: 'diametro_linea_gas', label: 'Diametro Linea Gas', tipo: 'text', placeholder: 'Es: 5/8"' },
        { id: 'lunghezza_tubazioni', label: 'Lunghezza Tubazioni', tipo: 'number', unit: 'm', min: 0 },
        { id: 'dislivello_max', label: 'Dislivello Max', tipo: 'number', unit: 'm', min: 0 },
        { id: 'isolamento_tubazioni', label: 'Isolamento Tubazioni', tipo: 'select', required: true, options: [
          { value: 'gomma', label: 'Guaina in Gomma' },
          { value: 'polietilene', label: 'Polietilene Espanso' },
          { value: 'altro', label: 'Altro' }
        ]},
        { id: 'spessore_isolamento', label: 'Spessore Isolamento', tipo: 'number', unit: 'mm', min: 0 },
      ]
    },
    {
      id: 'verifiche_perdite',
      titolo: 'Verifica Perdite (Obbligatoria)',
      icon: 'fas fa-search',
      campi: [
        { id: 'verifica_perdite_effettuata', label: 'Verifica Perdite Effettuata', tipo: 'radio', required: true, options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No' },
          { value: 'non_richiesta', label: 'Non Richiesta (< 3 kg CO2 eq)' }
        ]},
        { id: 'data_verifica_perdite', label: 'Data Verifica', tipo: 'date' },
        { id: 'metodo_verifica', label: 'Metodo Verifica', tipo: 'select', options: [
          { value: 'elettronico', label: 'Rilevatore Elettronico' },
          { value: 'azoto', label: 'Prova con Azoto' },
          { value: 'schiuma', label: 'Acqua e Sapone' },
          { value: 'ultravioletti', label: 'Luce UV + Tracciante' },
          { value: 'ultrasuoni', label: 'Rilevatore a Ultrasuoni' }
        ]},
        { id: 'esito_verifica', label: 'Esito Verifica', tipo: 'radio', options: [
          { value: 'negativo', label: 'Negativo (Nessuna Perdita)' },
          { value: 'positivo', label: 'Positivo (Perdite Rilevate)' }
        ]},
        { id: 'frequenza_controlli', label: 'Frequenza Controlli Periodici', tipo: 'select', help: 'Obbligatoria per cariche ≥ 5 ton CO2 eq', options: [
          { value: '12mesi', label: 'Ogni 12 mesi' },
          { value: '6mesi', label: 'Ogni 6 mesi (≥ 50 ton CO2 eq)' },
          { value: '3mesi', label: 'Ogni 3 mesi (≥ 500 ton CO2 eq)' },
          { value: 'non_obbligatorio', label: 'Non Obbligatorio' }
        ]},
        { id: 'note_perdite', label: 'Note Verifica', tipo: 'textarea' },
      ]
    },
    {
      id: 'soglia_obblighi',
      titolo: 'Soglie e Obblighi',
      icon: 'fas fa-balance-scale',
      campi: [
        { id: 'soglia_3kg', label: 'Carica ≥ 3 kg (5 kg per ermetici)', tipo: 'checkbox', help: 'Obbligo registrazione e controllo perdite' },
        { id: 'soglia_5ton', label: 'Carica ≥ 5 ton CO2 eq', tipo: 'checkbox', help: 'Controllo perdite ogni 12 mesi' },
        { id: 'soglia_50ton', label: 'Carica ≥ 50 ton CO2 eq', tipo: 'checkbox', help: 'Controllo perdite ogni 6 mesi + detector' },
        { id: 'soglia_500ton', label: 'Carica ≥ 500 ton CO2 eq', tipo: 'checkbox', help: 'Controllo perdite ogni 3 mesi + detector' },
        { id: 'detector_perdite', label: 'Sistema Detector Perdite Installato', tipo: 'radio', options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No' },
          { value: 'non_richiesto', label: 'Non Richiesto' }
        ]},
        { id: 'registro_tenuto', label: 'Registro Tenuto dal Committente', tipo: 'radio', required: true, options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No (da attivare)' }
        ]},
      ]
    },
    {
      id: 'installazione',
      titolo: 'Dettagli Installazione',
      icon: 'fas fa-tools',
      campi: [
        { id: 'data_installazione', label: 'Data Installazione', tipo: 'date', required: true },
        { id: 'messa_servizio', label: 'Data Messa in Servizio', tipo: 'date', required: true },
        { id: 'vuoto_impianto', label: 'Vuoto dell\'Impianto Effettuato', tipo: 'checkbox', required: true },
        { id: 'carica_aggiuntiva', label: 'Carica Aggiuntiva di Gas', tipo: 'number', unit: 'kg', min: 0, step: 0.01 },
        { id: 'prova_pressione', label: 'Prova di Pressione Effettuata', tipo: 'checkbox', required: true },
        { id: 'pressione_prova', label: 'Pressione Prova', tipo: 'number', unit: 'bar', min: 0 },
        { id: 'tempo_prova', label: 'Durata Prova', tipo: 'number', unit: 'min', min: 0 },
        { id: 'note_installazione', label: 'Note Installazione', tipo: 'textarea' },
      ]
    },
    {
      id: 'tecnico',
      titolo: 'Dati Tecnico e Impresa (Certificato F-Gas)',
      icon: 'fas fa-user-tie',
      campi: [
        { id: 'tecnico_nome', label: 'Nome e Cognome Tecnico', tipo: 'text', required: true },
        { id: 'tecnico_cf', label: 'Codice Fiscale Tecnico', tipo: 'text', required: true },
        { id: 'certificato_fgas', label: 'Numero Certificato F-Gas Personale', tipo: 'text', required: true, help: 'Obbligatorio per interventi su impianti F-Gas' },
        { id: 'data_certificato', label: 'Data Rilascio Certificato', tipo: 'date' },
        { id: 'ente_certificatore', label: 'Ente Certificatore', tipo: 'text' },
        { id: 'impresa_nome', label: 'Nome Impresa', tipo: 'text', required: true },
        { id: 'impresa_piva', label: 'Partita IVA Impresa', tipo: 'text', required: true },
        { id: 'impresa_certificato_fgas', label: 'Certificato F-Gas Impresa', tipo: 'text', required: true, help: 'Obbligatorio per l\'impresa' },
        { id: 'impresa_indirizzo', label: 'Indirizzo Impresa', tipo: 'text', required: true },
        { id: 'impresa_cciaa', label: 'Iscrizione CCIAA', tipo: 'text' },
        { id: 'firma_tecnico', label: 'Firma Tecnico', tipo: 'text', required: true },
      ]
    },
    {
      id: 'documentazione',
      titolo: 'Documentazione Allegata',
      icon: 'fas fa-paperclip',
      campi: [
        { id: 'libretto_impianto', label: 'Libretto di Impianto', tipo: 'checkbox', required: true },
        { id: 'libretto_fgas', label: 'Libretto F-Gas / Registro', tipo: 'checkbox', required: true },
        { id: 'scheda_tecnica', label: 'Scheda Tecnica Apparecchiatura', tipo: 'checkbox', required: true },
        { id: 'dichiarazione_conformita_gas', label: 'Dichiarazione Conformità Gas', tipo: 'checkbox' },
        { id: 'rapporto_prove', label: 'Rapporto Prove Perdite', tipo: 'checkbox' },
        { id: 'foto_impianto', label: 'Foto Impianto', tipo: 'checkbox' },
        { id: 'schema_frigo', label: 'Schema Frigorifero', tipo: 'checkbox' },
        { id: 'certificato_gas', label: 'Certificato Qualità Gas', tipo: 'checkbox' },
        { id: 'altri_documenti', label: 'Altri Documenti', tipo: 'textarea' },
      ]
    },
  ]
};

// Configurazione Registro F-Gas
export const REGISTRO_FGAS_CONFIG: SchedaCompletaConfig = {
  tipo: 'Registro_FGas',
  label: 'Registro Apparecchiature F-Gas',
  icon: 'fas fa-book',
  color: 'cyan',
  norma: 'DPR 146/2018 art. 9',
  descrizione: 'Registro delle apparecchiature contenenti gas fluorurati',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali Registro',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero_registro', label: 'Numero Registro', tipo: 'text', required: true },
        { id: 'data_apertura', label: 'Data Apertura', tipo: 'date', required: true },
        { id: 'numero_apparecchiature', label: 'Numero Apparecchiature', tipo: 'number', required: true, min: 1 },
      ]
    },
    {
      id: 'detentore',
      titolo: 'Dati Detentore/Approprietario',
      icon: 'fas fa-user',
      campi: [
        { id: 'detentore_nome', label: 'Nome/Ragione Sociale', tipo: 'text', required: true },
        { id: 'detentore_cf', label: 'Codice Fiscale', tipo: 'text', required: true },
        { id: 'detentore_piva', label: 'Partita IVA', tipo: 'text' },
        { id: 'detentore_indirizzo', label: 'Indirizzo', tipo: 'text', required: true },
        { id: 'detentore_telefono', label: 'Telefono', tipo: 'text' },
        { id: 'detentore_email', label: 'Email', tipo: 'text' },
      ]
    },
    {
      id: 'apparecchiature_registro',
      titolo: 'Elenco Apparecchiature',
      icon: 'fas fa-list',
      campi: [
        { id: 'elenco_apparecchiature', label: 'Elenco Apparecchiature', tipo: 'textarea', required: true, placeholder: 'Per ogni apparecchiatura:\n- Marca/Modello\n- Matricola\n- Tipo gas\n- Carica (kg)\n- GWP\n- CO2 eq (ton)\n- Ubicazione' },
      ]
    },
    {
      id: 'interventi',
      titolo: 'Registro Interventi',
      icon: 'fas fa-tools',
      campi: [
        { id: 'registro_interventi', label: 'Registro Interventi', tipo: 'textarea', required: true, placeholder: 'Per ogni intervento:\n- Data\n- Tipo intervento\n- Ditta esecutrice\n- Certificato F-Gas\n- Gas utilizzato/recuperato (kg)\n- Note' },
      ]
    },
  ]
};

// Esporta tutte le configurazioni
export const SCHEDE_COMPLETE_CONFIG: Record<TipoSchedaCompleta, SchedaCompletaConfig> = {
  DiCo_Elettrico: DICO_ELETTRICO_CONFIG,
  DiCo_Gas: DICO_GAS_CONFIG,
  DiCo_Idrico: DICO_GAS_CONFIG, // Placeholder
  DiCo_Termico: DICO_GAS_CONFIG, // Placeholder
  DiCo_Antincendio: DICO_GAS_CONFIG, // Placeholder
  DiCo_Antifurto: DICO_GAS_CONFIG, // Placeholder
  DiCo_FGas: DICO_FGAS_CONFIG,
  DiRi: DICO_GAS_CONFIG, // Placeholder
  Libretto_Impianto: DICO_GAS_CONFIG, // Placeholder
  Rapporto_Controllo: DICO_GAS_CONFIG, // Placeholder
  Registro_Manutenzione: DICO_GAS_CONFIG, // Placeholder
  Progetto_Impianto: DICO_GAS_CONFIG, // Placeholder
  Relazione_Tecnica: DICO_GAS_CONFIG, // Placeholder
  Certificato_Collaudo: DICO_GAS_CONFIG, // Placeholder
  Verifica_Impianto_Elettrico: DICO_GAS_CONFIG, // Placeholder
  Scheda_Impianto_Gas: DICO_GAS_CONFIG, // Placeholder
  Registro_FGas: REGISTRO_FGAS_CONFIG,
  Dichiarazione_FGas: DICO_FGAS_CONFIG, // Placeholder
  Dichiarazione_Good_Faith: DICO_GAS_CONFIG, // Placeholder
};
