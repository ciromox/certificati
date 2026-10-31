// Configurazione completa schede tecniche come app commerciali (Mister DiCo, Praticus, MarioDOC)

export type TipoSchedaCompleta = 
  | 'DiCo_Elettrico'
  | 'DiCo_Gas'
  | 'DiCo_Idrico'
  | 'DiCo_Termico'
  | 'DiCo_Antincendio'
  | 'DiCo_Antifurto'
  | 'DiRi'
  | 'Libretto_Impianto'
  | 'Rapporto_Controllo'
  | 'Registro_Manutenzione'
  | 'Progetto_Impianto'
  | 'Relazione_Tecnica'
  | 'Certificato_Collaudo'
  | 'Verifica_Impianto_Elettrico'
  | 'Scheda_Impianto_Gas'
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

// Esporta tutte le configurazioni
export const SCHEDE_COMPLETE_CONFIG: Record<TipoSchedaCompleta, SchedaCompletaConfig> = {
  DiCo_Elettrico: DICO_ELETTRICO_CONFIG,
  DiCo_Gas: DICO_GAS_CONFIG,
  DiCo_Idrico: DICO_GAS_CONFIG, // Placeholder
  DiCo_Termico: DICO_GAS_CONFIG, // Placeholder
  DiCo_Antincendio: DICO_GAS_CONFIG, // Placeholder
  DiCo_Antifurto: DICO_GAS_CONFIG, // Placeholder
  DiRi: DICO_GAS_CONFIG, // Placeholder
  Libretto_Impianto: DICO_GAS_CONFIG, // Placeholder
  Rapporto_Controllo: DICO_GAS_CONFIG, // Placeholder
  Registro_Manutenzione: DICO_GAS_CONFIG, // Placeholder
  Progetto_Impianto: DICO_GAS_CONFIG, // Placeholder
  Relazione_Tecnica: DICO_GAS_CONFIG, // Placeholder
  Certificato_Collaudo: DICO_GAS_CONFIG, // Placeholder
  Verifica_Impianto_Elettrico: DICO_GAS_CONFIG, // Placeholder
  Scheda_Impianto_Gas: DICO_GAS_CONFIG, // Placeholder
  Dichiarazione_Good_Faith: DICO_GAS_CONFIG, // Placeholder
};
