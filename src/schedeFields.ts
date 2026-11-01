// Definizione completa dei campi per ogni tipologia di scheda tecnica
// Basato sulle checklist ministeriali e norme tecniche (CEI, UNI, ecc.)

export type SchedaTipo = 
  | 'dico_elettrico'
  | 'dico_gas'
  | 'dico_idrico'
  | 'dico_termico'
  | 'dico_fgas'
  | 'dico_antincendio'
  | 'dico_antifurto'
  | 'diri'
  | 'libretto_impianto'
  | 'rapporto_controllo'
  | 'registro_manutenzione'
  | 'progetto_impianto'
  | 'relazione_tecnica'
  | 'verifica_elettrica'
  | 'collaudo_impianto';

export interface CampoDefinizione {
  id: string;
  label: string;
  tipo: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'email' | 'tel';
  required?: boolean;
  placeholder?: string;
  unit?: string;
  help?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  norma?: string;
  sezione: string;
}

export interface SchedaDefinizione {
  tipo: SchedaTipo;
  titolo: string;
  norma: string;
  descrizione: string;
  sezioni: { id: string; titolo: string; icon: string; campi: CampoDefinizione[] }[];
}

// ============================================
// DICHIARAZIONE CONFORMITÀ IMPIANTO ELETTRICO
// ============================================
export const DICO_ELETTRICO: SchedaDefinizione = {
  tipo: 'dico_elettrico',
  titolo: 'Dichiarazione Conformità Impianto Elettrico',
  norma: 'D.M. 37/08 - CEI 64-8',
  descrizione: 'Dichiarazione di conformità per impianti elettrici utilizzatori a tensione non superiore a 1000V',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero_dichiarazione', label: 'Numero Dichiarazione', tipo: 'text', required: true, sezione: 'dati_generali' },
        { id: 'data_rilascio', label: 'Data Rilascio', tipo: 'date', required: true, sezione: 'dati_generali' },
        { id: 'tipo_intervento', label: 'Tipo Intervento', tipo: 'select', required: true, sezione: 'dati_generali', options: [
          { value: 'nuovo', label: 'Nuovo impianto' },
          { value: 'ristrutturazione', label: 'Ristrutturazione completa' },
          { value: 'ampliamento', label: 'Ampliamento' },
          { value: 'manutenzione_straordinaria', label: 'Manutenzione straordinaria' },
          { value: 'messa_norma', label: 'Messa a norma' }
        ]},
      ]
    },
    {
      id: 'caratteristiche_impianto',
      titolo: 'Caratteristiche Impianto',
      icon: 'fas fa-bolt',
      campi: [
        { id: 'sistema_distribuzione', label: 'Sistema di Distribuzione', tipo: 'select', required: true, sezione: 'caratteristiche_impianto', norma: 'CEI 64-8', options: [
          { value: 'TT', label: 'Sistema TT' },
          { value: 'TN-S', label: 'Sistema TN-S' },
          { value: 'TN-C', label: 'Sistema TN-C' },
          { value: 'TN-C-S', label: 'Sistema TN-C-S' },
          { value: 'IT', label: 'Sistema IT' }
        ]},
        { id: 'tensione_esercizio', label: 'Tensione di Esercizio', tipo: 'select', required: true, sezione: 'caratteristiche_impianto', options: [
          { value: '230', label: '230V Monofase' },
          { value: '400', label: '400V Trifase' },
          { value: '230/400', label: '230/400V Trifase con neutro' }
        ]},
        { id: 'frequenza', label: 'Frequenza', tipo: 'select', required: true, sezione: 'caratteristiche_impianto', options: [
          { value: '50', label: '50 Hz' }
        ]},
        { id: 'potenza_impegnata', label: 'Potenza Impegnata', tipo: 'number', required: true, unit: 'kW', min: 0, step: 0.1, sezione: 'caratteristiche_impianto' },
        { id: 'potenza_disponibile', label: 'Potenza Disponibile', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'caratteristiche_impianto' },
        { id: 'contatore_numero', label: 'Numero Matricola Contatore', tipo: 'text', sezione: 'caratteristiche_impianto' },
        { id: 'contatore_tipo', label: 'Tipo Contatore', tipo: 'select', sezione: 'caratteristiche_impianto', options: [
          { value: 'monofase', label: 'Monofase' },
          { value: 'trifase', label: 'Trifase' }
        ]},
        { id: 'punti_utilizzazione', label: 'Numero Punti Utilizzazione', tipo: 'number', min: 1, sezione: 'caratteristiche_impianto' },
        { id: 'punti_luce', label: 'Numero Punti Luce', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'prese_normali', label: 'Numero Prese Normali (10A/16A)', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'prese_forza', label: 'Numero Prese Forza (20A/25A)', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'interruttori', label: 'Numero Interruttori', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'deviatori', label: 'Numero Deviatori/Invertitori', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'linee_luce', label: 'Numero Linee Illuminazione', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'linee_forza', label: 'Numero Linee Forza', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'linee_uso_promiscuo', label: 'Numero Linee Uso Promiscuo', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'numero_quadri', label: 'Numero Quadri Elettrici', tipo: 'number', min: 0, sezione: 'caratteristiche_impianto' },
        { id: 'lunghezza_cavi', label: 'Lunghezza Totale Cavi', tipo: 'number', unit: 'm', min: 0, sezione: 'caratteristiche_impianto' },
      ]
    },
    {
      id: 'protezioni',
      titolo: 'Dispositivi di Protezione',
      icon: 'fas fa-shield-alt',
      campi: [
        { id: 'interruttore_generale', label: 'Interruttore Generale', tipo: 'text', placeholder: 'Es: 63A', sezione: 'protezioni' },
        { id: 'differenziali_numero', label: 'Numero Interruttori Differenziali', tipo: 'number', min: 0, sezione: 'protezioni' },
        { id: 'differenziali_tipo', label: 'Tipo Differenziali', tipo: 'select', sezione: 'protezioni', options: [
          { value: 'AC', label: 'Tipo AC' },
          { value: 'A', label: 'Tipo A' },
          { value: 'B', label: 'Tipo B' },
          { value: 'F', label: 'Tipo F' },
          { value: 'misto', label: 'Tipi misti' }
        ]},
        { id: 'differenziali_sensibilita', label: 'Sensibilità Differenziali', tipo: 'select', sezione: 'protezioni', options: [
          { value: '30mA', label: '30 mA' },
          { value: '300mA', label: '300 mA' },
          { value: 'mista', label: 'Sensibilità mista' }
        ]},
        { id: 'magnetotermici_numero', label: 'Numero Interruttori Magnetotermici', tipo: 'number', min: 0, sezione: 'protezioni' },
        { id: 'scaricatori', label: 'Scaricatori Sovratensioni Installati', tipo: 'checkbox', sezione: 'protezioni' },
        { id: 'scaricatori_tipo', label: 'Tipo Scaricatori', tipo: 'select', sezione: 'protezioni', options: [
          { value: 'tipo1', label: 'Tipo 1' },
          { value: 'tipo2', label: 'Tipo 2' },
          { value: 'tipo1+2', label: 'Tipo 1+2' }
        ]},
      ]
    },
    {
      id: 'componenti',
      titolo: 'Componenti e Materiali',
      icon: 'fas fa-microchip',
      campi: [
        { id: 'quadro_generale_marca', label: 'Quadro Generale - Marca', tipo: 'text', sezione: 'componenti' },
        { id: 'quadro_generale_modello', label: 'Quadro Generale - Modello', tipo: 'text', sezione: 'componenti' },
        { id: 'frutti_serie', label: 'Serie Frutti/Placche', tipo: 'text', sezione: 'componenti' },
        { id: 'canalizzazioni_tipo', label: 'Tipo Canalizzazioni', tipo: 'select', sezione: 'componenti', options: [
          { value: 'tubo_pvc', label: 'Tubo in PVC' },
          { value: 'tubo_corrugato', label: 'Tubo Corrugato' },
          { value: 'canalina', label: 'Canaletta' },
          { value: 'sottotraccia', label: 'Sottotraccia' },
          { value: 'misto', label: 'Misto' }
        ]},
        { id: 'cavi_tipo', label: 'Tipo Cavi', tipo: 'textarea', placeholder: 'Es: N07V-K, FG16OM16, ecc.', sezione: 'componenti', norma: 'CEI 20-20' },
        { id: 'cavi_sezioni', label: 'Sezioni Cavi Utilizzate', tipo: 'textarea', placeholder: 'Es: 1.5mm² luce, 2.5mm² prese, 6mm² cucina', sezione: 'componenti' },
        { id: 'certificazioni_materiali', label: 'Certificazioni Materiali', tipo: 'checkbox', sezione: 'componenti', options: [
          { value: 'IMQ', label: 'Marchio IMQ' },
          { value: 'CE', label: 'Marcatura CE' },
          { value: 'TUV', label: 'Certificazione TUV' }
        ]},
      ]
    },
    {
      id: 'sistema_terra',
      titolo: 'Impianto di Terra',
      icon: 'fas fa-globe',
      campi: [
        { id: 'dispersori_tipo', label: 'Tipo Dispersori', tipo: 'select', sezione: 'sistema_terra', norma: 'CEI 64-8', options: [
          { value: 'fondazione', label: 'Dispersore di fondazione' },
          { value: 'picchetti', label: 'Picchetti verticali' },
          { value: 'maglia', label: 'Maglia di terra' },
          { value: 'misto', label: 'Sistema misto' }
        ]},
        { id: 'dispersori_numero', label: 'Numero Picchetti', tipo: 'number', min: 0, sezione: 'sistema_terra' },
        { id: 'collettore_terra', label: 'Collettore Principale di Terra', tipo: 'text', sezione: 'sistema_terra' },
        { id: 'conduttore_terra_sezione', label: 'Sezione Conduttore di Terra', tipo: 'text', placeholder: 'Es: 16mm²', sezione: 'sistema_terra' },
        { id: 'conduttori_protezione_sezione', label: 'Sezione Conduttori di Protezione (PE)', tipo: 'text', sezione: 'sistema_terra' },
        { id: 'collegamento_equipotenziale', label: 'Collegamento Equipotenziale Principale', tipo: 'checkbox', sezione: 'sistema_terra' },
        { id: 'collegamento_equipotenziale_suppl', label: 'Collegamento Equipotenziale Supplementare', tipo: 'checkbox', sezione: 'sistema_terra' },
      ]
    },
    {
      id: 'verifiche',
      titolo: 'Verifiche e Misure Effettuate',
      icon: 'fas fa-clipboard-check',
      campi: [
        { id: 'data_verifica', label: 'Data Verifica', tipo: 'date', required: true, sezione: 'verifiche' },
        { id: 'strumento_marca', label: 'Strumento di Misura - Marca', tipo: 'text', sezione: 'verifiche' },
        { id: 'strumento_modello', label: 'Strumento di Misura - Modello', tipo: 'text', sezione: 'verifiche' },
        { id: 'strumento_matricola', label: 'Strumento di Misura - Matricola', tipo: 'text', sezione: 'verifiche' },
        { id: 'strumento_taratura', label: 'Data Ultima Taratura', tipo: 'date', sezione: 'verifiche' },
        { id: 'continuita_conduttori', label: 'Continuità Conduttori di Protezione', tipo: 'checkbox', required: true, sezione: 'verifiche' },
        { id: 'resistenza_isolamento', label: 'Resistenza di Isolamento', tipo: 'number', unit: 'MΩ', min: 0, step: 0.01, sezione: 'verifiche', norma: 'CEI 64-8', help: 'Minimo 1 MΩ' },
        { id: 'resistenza_isolamento_tensione', label: 'Tensione Prova Isolamento', tipo: 'select', sezione: 'verifiche', options: [
          { value: '500V', label: '500V DC' },
          { value: '250V', label: '250V DC' },
          { value: '1000V', label: '1000V DC' }
        ]},
        { id: 'resistenza_terra', label: 'Resistenza di Terra', tipo: 'number', unit: 'Ω', min: 0, step: 0.1, sezione: 'verifiche', norma: 'CEI 64-8', help: 'Max 36 Ω per sistemi TT' },
        { id: 'tempo_intervento_diff', label: 'Tempo Intervento Differenziale', tipo: 'number', unit: 'ms', min: 0, sezione: 'verifiche', help: 'Max 300 ms per contatti diretti' },
        { id: 'corrente_intervento_diff', label: 'Corrente Intervento Differenziale', tipo: 'number', unit: 'mA', min: 0, sezione: 'verifiche' },
        { id: 'resistenza_anello', label: 'Resistenza Anello di Guasto', tipo: 'number', unit: 'Ω', min: 0, step: 0.01, sezione: 'verifiche' },
        { id: 'corrente_cortocircuito', label: 'Corrente di Cortocircuito Presunta', tipo: 'number', unit: 'kA', min: 0, sezione: 'verifiche' },
        { id: 'caduta_tensione', label: 'Caduta di Tensione', tipo: 'number', unit: '%', min: 0, step: 0.1, sezione: 'verifiche', help: 'Max 4% per illuminazione, 5% per altri usi' },
        { id: 'verifica_funzionale', label: 'Verifica Funzionale', tipo: 'checkbox', required: true, sezione: 'verifiche' },
        { id: 'verifica_visiva', label: 'Verifica Visiva', tipo: 'checkbox', required: true, sezione: 'verifiche' },
        { id: 'note_verifiche', label: 'Note Verifiche', tipo: 'textarea', sezione: 'verifiche' },
      ]
    },
    {
      id: 'norme',
      titolo: 'Norme Tecniche Applicate',
      icon: 'fas fa-gavel',
      campi: [
        { id: 'norme_applicate', label: 'Norme Applicate', tipo: 'checkbox', required: true, sezione: 'norme', options: [
          { value: 'CEI_64-8', label: 'CEI 64-8 (Impianti utilizzatori BT)' },
          { value: 'CEI_64-50', label: 'CEI 64-50 (Impianti residenziali)' },
          { value: 'CEI_0-21', label: 'CEI 0-21 (Sistemi attivi utenza)' },
          { value: 'CEI_64-8_1', label: 'CEI 64-8/1 - Oggetto e fondamenti' },
          { value: 'CEI_64-8_3', label: 'CEI 64-8/3 - Caratteristiche generali' },
          { value: 'CEI_64-8_4', label: 'CEI 64-8/4 - Protezione per sicurezza' },
          { value: 'CEI_64-8_5', label: 'CEI 64-8/5 - Scelta componenti' },
          { value: 'CEI_64-8_6', label: 'CEI 64-8/6 - Verifiche' },
          { value: 'CEI_64-8_7', label: 'CEI 64-8/7 - Ambienti particolari' }
        ]},
        { id: 'altre_norme', label: 'Altre Norme Applicate', tipo: 'textarea', sezione: 'norme' },
      ]
    },
  ]
};

// ============================================
// DICHIARAZIONE CONFORMITÀ IMPIANTO GAS
// ============================================
export const DICO_GAS: SchedaDefinizione = {
  tipo: 'dico_gas',
  titolo: 'Dichiarazione Conformità Impianto Gas',
  norma: 'D.M. 37/08 - UNI 7129',
  descrizione: 'Dichiarazione di conformità per impianti gas per uso domestico e similare',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero_dichiarazione', label: 'Numero Dichiarazione', tipo: 'text', required: true, sezione: 'dati_generali' },
        { id: 'data_rilascio', label: 'Data Rilascio', tipo: 'date', required: true, sezione: 'dati_generali' },
        { id: 'tipo_intervento', label: 'Tipo Intervento', tipo: 'select', required: true, sezione: 'dati_generali', options: [
          { value: 'nuovo', label: 'Nuovo impianto' },
          { value: 'modifica', label: 'Modifica' },
          { value: 'ampliamento', label: 'Ampliamento' },
          { value: 'sostituzione_contatore', label: 'Sostituzione contatore' },
          { value: 'sostituzione_apparecchio', label: 'Sostituzione apparecchio' }
        ]},
        { id: 'tipo_gas', label: 'Tipo Gas Distribuito', tipo: 'select', required: true, sezione: 'dati_generali', norma: 'UNI 7129', options: [
          { value: 'metano', label: 'Metano (1ª famiglia)' },
          { value: 'gpl_mobile', label: 'GPL da recipienti mobili' },
          { value: 'gpl_serbatoio', label: 'GPL da serbatoio fisso' }
        ]},
      ]
    },
    {
      id: 'rete_distribuzione',
      titolo: 'Rete di Distribuzione Interna',
      icon: 'fas fa-project-diagram',
      campi: [
        { id: 'tipo_tubazioni', label: 'Tipo Tubazioni', tipo: 'select', required: true, sezione: 'rete_distribuzione', norma: 'UNI 7129', options: [
          { value: 'rame', label: 'Rame' },
          { value: 'acciaio', label: 'Acciaio' },
          { value: 'stratificato', label: 'Tubo Stratificato' },
          { value: 'misto', label: 'Misto' }
        ]},
        { id: 'diametri_tubazioni', label: 'Diametri Tubazioni', tipo: 'textarea', required: true, placeholder: 'Es: ø12, ø15, ø22...', sezione: 'rete_distribuzione' },
        { id: 'lunghezza_totale', label: 'Lunghezza Totale Tubazioni', tipo: 'number', unit: 'm', min: 0, sezione: 'rete_distribuzione' },
        { id: 'tipo_giunzioni', label: 'Tipo Giunzioni', tipo: 'select', required: true, sezione: 'rete_distribuzione', options: [
          { value: 'saldatura', label: 'Saldatura' },
          { value: 'brasatura', label: 'Brasatura' },
          { value: 'meccanica', label: 'Giunzioni Meccaniche' },
          { value: 'mista', label: 'Mista' }
        ]},
        { id: 'fissaggi', label: 'Tipo Fissaggi', tipo: 'textarea', sezione: 'rete_distribuzione' },
        { id: 'protezione_corrosione', label: 'Protezione Corrosione', tipo: 'text', sezione: 'rete_distribuzione' },
        { id: 'giunti_numero', label: 'Numero Giunzioni', tipo: 'number', min: 0, sezione: 'rete_distribuzione' },
        { id: 'curve_numero', label: 'Numero Curve', tipo: 'number', min: 0, sezione: 'rete_distribuzione' },
        { id: 'derivazioni_numero', label: 'Numero Derivazioni', tipo: 'number', min: 0, sezione: 'rete_distribuzione' },
      ]
    },
    {
      id: 'contatore',
      titolo: 'Gruppo di Misura',
      icon: 'fas fa-tachometer-alt',
      campi: [
        { id: 'tipo_contatore', label: 'Tipo Contatore', tipo: 'select', required: true, sezione: 'contatore', norma: 'UNI 7129', options: [
          { value: 'G4', label: 'G4 - 2.5 mc/h' },
          { value: 'G6', label: 'G6 - 4 mc/h' },
          { value: 'G10', label: 'G10 - 6 mc/h' },
          { value: 'G16', label: 'G16 - 10 mc/h' },
          { value: 'G25', label: 'G25 - 16 mc/h' },
          { value: 'G40', label: 'G40 - 25 mc/h' }
        ]},
        { id: 'matricola_contatore', label: 'Matricola Contatore', tipo: 'text', required: true, sezione: 'contatore' },
        { id: 'marca_contatore', label: 'Marca Contatore', tipo: 'text', sezione: 'contatore' },
        { id: 'pressione_rete', label: 'Pressione Rete', tipo: 'select', required: true, sezione: 'contatore', options: [
          { value: 'bassa', label: 'Bassa Pressione' },
          { value: 'media', label: 'Media Pressione' }
        ]},
        { id: 'rubinetto_valle', label: 'Rubinetto a Valle Contatore', tipo: 'checkbox', required: true, sezione: 'contatore' },
        { id: 'rubinetto_monte', label: 'Rubinetto a Monte Contatore', tipo: 'checkbox', sezione: 'contatore' },
        { id: 'tubo_flessibile', label: 'Tubo Flessibile', tipo: 'checkbox', sezione: 'contatore' },
        { id: 'tubo_flessibile_lunghezza', label: 'Lunghezza Tubo Flessibile', tipo: 'number', unit: 'm', min: 0, sezione: 'contatore' },
      ]
    },
    {
      id: 'apparecchi',
      titolo: 'Apparecchi Utilizzatori',
      icon: 'fas fa-list',
      campi: [
        { id: 'numero_apparecchi', label: 'Numero Apparecchi', tipo: 'number', required: true, min: 1, sezione: 'apparecchi' },
        { id: 'elenco_apparecchi', label: 'Elenco Apparecchi', tipo: 'textarea', required: true, placeholder: 'Es:\n1. Caldaia murale - Marca XY - 24 kW - Matricola 123\n2. Piano cottura - Marca ZW - 4 fuochi\n3. Scaldabagno - Marca AB - 50L', sezione: 'apparecchi' },
        { id: 'potenza_termica_totale', label: 'Potenza Termica Totale', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'apparecchi' },
        { id: 'tipi_apparecchi', label: 'Tipi Apparecchi Installati', tipo: 'checkbox', sezione: 'apparecchi', options: [
          { value: 'caldaia', label: 'Caldaia' },
          { value: 'scaldabagno', label: 'Scaldabagno' },
          { value: 'cucina', label: 'Cucina/Piano Cottura' },
          { value: 'termocamino', label: 'Termocamino' },
          { value: 'stufa', label: 'Stufa' },
          { value: 'funghi_riscaldanti', label: 'Funghi Riscaldanti' }
        ]},
        { id: 'tipo_accensione', label: 'Tipo Accensione', tipo: 'select', sezione: 'apparecchi', options: [
          { value: 'piezoelettrica', label: 'Piezoelettrica' },
          { value: 'elettronica', label: 'Elettronica' },
          { value: 'manuale', label: 'Manuale' }
        ]},
        { id: 'tipo_scarico', label: 'Tipo Scarico Apparecchi', tipo: 'select', sezione: 'apparecchi', options: [
          { value: 'canna_fumaria', label: 'Canna Fumaria' },
          { value: 'scarico_parete', label: 'Scarico a Parete' },
          { value: 'scarico_tetto', label: 'Scarico a Tetto' },
          { value: 'camera_aperta', label: 'Camera Aperta' }
        ]},
      ]
    },
    {
      id: 'ventilazione',
      titolo: 'Ventilazione e Aerazione',
      icon: 'fas fa-wind',
      campi: [
        { id: 'ventilazione_presente', label: 'Ventilazione Presente', tipo: 'checkbox', required: true, sezione: 'ventilazione' },
        { id: 'tipo_ventilazione', label: 'Tipo Ventilazione', tipo: 'select', sezione: 'ventilazione', norma: 'UNI 7129', options: [
          { value: 'naturale', label: 'Naturale' },
          { value: 'forzata', label: 'Forzata' },
          { value: 'mista', label: 'Mista' }
        ]},
        { id: 'superficie_fori_alto', label: 'Superficie Fori Alto', tipo: 'number', unit: 'cm²', min: 0, sezione: 'ventilazione' },
        { id: 'superficie_fori_basso', label: 'Superficie Fori Basso', tipo: 'number', unit: 'cm²', min: 0, sezione: 'ventilazione' },
        { id: 'posizione_fori', label: 'Posizione Fori', tipo: 'text', placeholder: 'Es: Parete esterna, altezza...', sezione: 'ventilazione' },
        { id: 'apertura_minima', label: 'Apertura Minima Richiesta', tipo: 'number', unit: 'cm²', min: 0, sezione: 'ventilazione' },
        { id: 'numero_fori', label: 'Numero Fori', tipo: 'number', min: 0, sezione: 'ventilazione' },
        { id: 'griglie_protette', label: 'Griglie Protette', tipo: 'checkbox', sezione: 'ventilazione' },
      ]
    },
    {
      id: 'scarico_fumi',
      titolo: 'Scarico Prodotti Combustione',
      icon: 'fas fa-smog',
      campi: [
        { id: 'tipo_scarico', label: 'Tipo Scarico', tipo: 'select', required: true, sezione: 'scarico_fumi', norma: 'UNI 7129', options: [
          { value: 'canna_fumaria', label: 'Canna Fumaria' },
          { value: 'scarico_parete', label: 'Scarico a Parete' },
          { value: 'scarico_tetto', label: 'Scarico a Tetto' }
        ]},
        { id: 'materiale_scarico', label: 'Materiale Scarico', tipo: 'select', sezione: 'scarico_fumi', options: [
          { value: 'acciaio_inox', label: 'Acciaio Inox' },
          { value: 'alluminio', label: 'Alluminio' },
          { value: 'materiale_plastico', label: 'Materiale Plastico' }
        ]},
        { id: 'diametro_scarico', label: 'Diametro Scarico', tipo: 'number', unit: 'mm', min: 0, sezione: 'scarico_fumi' },
        { id: 'lunghezza_scarico', label: 'Lunghezza Scarico', tipo: 'number', unit: 'm', min: 0, sezione: 'scarico_fumi' },
        { id: 'tiraggio', label: 'Tipo Tiraggio', tipo: 'select', sezione: 'scarico_fumi', options: [
          { value: 'naturale', label: 'Naturale' },
          { value: 'forzato', label: 'Forzato' }
        ]},
        { id: 'comignolo', label: 'Comignolo Installato', tipo: 'checkbox', sezione: 'scarico_fumi' },
        { id: 'altezza_comignolo', label: 'Altezza Comignolo dal Tetto', tipo: 'number', unit: 'm', min: 0, sezione: 'scarico_fumi' },
      ]
    },
    {
      id: 'prova_tenuta',
      titolo: 'Prova di Tenuta',
      icon: 'fas fa-check-circle',
      campi: [
        { id: 'data_prova', label: 'Data Prova', tipo: 'date', required: true, sezione: 'prova_tenuta' },
        { id: 'pressione_prova', label: 'Pressione Prova', tipo: 'number', required: true, unit: 'mbar', min: 0, sezione: 'prova_tenuta', norma: 'UNI 7129', help: 'Tipico: 100-1000 mbar' },
        { id: 'durata_prova', label: 'Durata Prova', tipo: 'number', required: true, unit: 'min', min: 15, sezione: 'prova_tenuta', help: 'Minimo 15 minuti' },
        { id: 'caduta_pressione', label: 'Caduta Pressione', tipo: 'number', unit: 'mbar', min: 0, step: 0.01, sezione: 'prova_tenuta', help: 'Deve essere 0 per prova superata' },
        { id: 'esito_prova', label: 'Esito Prova', tipo: 'radio', required: true, sezione: 'prova_tenuta', options: [
          { value: 'positivo', label: 'Positivo (Nessuna Perdita)' },
          { value: 'negativo', label: 'Negativo (Perdite Rilevate)' }
        ]},
        { id: 'strumento_utilizzato', label: 'Strumento Utilizzato', tipo: 'text', placeholder: 'Es: Manometro digitale marca XY', sezione: 'prova_tenuta' },
        { id: 'strumento_matricola', label: 'Matricola Strumento', tipo: 'text', sezione: 'prova_tenuta' },
        { id: 'note_prova', label: 'Note Prova', tipo: 'textarea', sezione: 'prova_tenuta' },
      ]
    },
    {
      id: 'sicurezza',
      titolo: 'Dispositivi di Sicurezza',
      icon: 'fas fa-shield-alt',
      campi: [
        { id: 'rubinetti_sicurezza', label: 'Rubinetti di Sicurezza', tipo: 'checkbox', required: true, sezione: 'sicurezza' },
        { id: 'valvole_sicurezza', label: 'Valvole di Sicurezza', tipo: 'checkbox', sezione: 'sicurezza' },
        { id: 'valvole_intercettazione', label: 'Valvole Intercettazione Automatica', tipo: 'checkbox', sezione: 'sicurezza' },
        { id: 'rilevatore_gas', label: 'Rilevatore Gas Installato', tipo: 'checkbox', sezione: 'sicurezza' },
        { id: 'rilevatore_marca', label: 'Rilevatore - Marca', tipo: 'text', sezione: 'sicurezza' },
        { id: 'rilevatore_modello', label: 'Rilevatore - Modello', tipo: 'text', sezione: 'sicurezza' },
        { id: 'elettrovalvola', label: 'Elettrovalvola', tipo: 'checkbox', sezione: 'sicurezza' },
        { id: 'altri_dispositivi', label: 'Altri Dispositivi', tipo: 'textarea', sezione: 'sicurezza' },
      ]
    },
  ]
};

// ============================================
// DICHIARAZIONE CONFORMITÀ IMPIANTO F-GAS
// ============================================
export const DICO_FGAS: SchedaDefinizione = {
  tipo: 'dico_fgas',
  titolo: 'Dichiarazione Conformità Impianto F-Gas',
  norma: 'D.M. 37/08 - DPR 146/2018 - Reg. UE 517/2014',
  descrizione: 'Dichiarazione di conformità per impianti di refrigerazione e climatizzazione con gas fluorurati',
  sezioni: [
    {
      id: 'dati_generali',
      titolo: 'Dati Generali',
      icon: 'fas fa-info-circle',
      campi: [
        { id: 'numero_dichiarazione', label: 'Numero Dichiarazione', tipo: 'text', required: true, sezione: 'dati_generali' },
        { id: 'data_rilascio', label: 'Data Rilascio', tipo: 'date', required: true, sezione: 'dati_generali' },
        { id: 'tipo_intervento', label: 'Tipo Intervento', tipo: 'select', required: true, sezione: 'dati_generali', options: [
          { value: 'installazione', label: 'Installazione Nuova' },
          { value: 'manutenzione', label: 'Manutenzione/Assistenza' },
          { value: 'modifica', label: 'Modifica Impianto' },
          { value: 'smontaggio', label: 'Smontaggio/Recupero' },
          { value: 'controllo_perdite', label: 'Controllo Perdite' }
        ]},
      ]
    },
    {
      id: 'apparecchiature',
      titolo: 'Apparecchiature e Componenti',
      icon: 'fas fa-microchip',
      campi: [
        { id: 'numero_apparecchiature', label: 'Numero Apparecchiature', tipo: 'number', required: true, min: 1, sezione: 'apparecchiature' },
        { id: 'tipo_apparecchiatura', label: 'Tipo Apparecchiatura', tipo: 'select', required: true, sezione: 'apparecchiature', options: [
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
        { id: 'marca_unita_esterna', label: 'Marca Unità Esterna', tipo: 'text', required: true, sezione: 'apparecchiature' },
        { id: 'modello_unita_esterna', label: 'Modello Unità Esterna', tipo: 'text', required: true, sezione: 'apparecchiature' },
        { id: 'matricola_unita_esterna', label: 'Matricola Unità Esterna', tipo: 'text', required: true, sezione: 'apparecchiature' },
        { id: 'marca_unita_interna', label: 'Marca Unità Interna', tipo: 'text', sezione: 'apparecchiature' },
        { id: 'modello_unita_interna', label: 'Modello Unità Interna', tipo: 'text', sezione: 'apparecchiature' },
        { id: 'matricola_unita_interna', label: 'Matricola Unità Interna', tipo: 'text', sezione: 'apparecchiature' },
        { id: 'numero_unita_interne', label: 'Numero Unità Interne', tipo: 'number', min: 1, sezione: 'apparecchiature' },
        { id: 'potenza_frigo', label: 'Potenza Frigorifera', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'apparecchiature' },
        { id: 'potenza_termica', label: 'Potenza Termica', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'apparecchiature' },
        { id: 'potenza_assorbita', label: 'Potenza Assorbita', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'apparecchiature' },
        { id: 'efficienza_energetica', label: 'Classe Efficienza Energetica', tipo: 'select', sezione: 'apparecchiature', options: [
          { value: 'A+++', label: 'A+++' },
          { value: 'A++', label: 'A++' },
          { value: 'A+', label: 'A+' },
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' }
        ]},
      ]
    },
    {
      id: 'gas_refrigerante',
      titolo: 'Gas Refrigerante',
      icon: 'fas fa-flask',
      campi: [
        { id: 'tipo_gas', label: 'Tipo Gas Refrigerante', tipo: 'select', required: true, sezione: 'gas_refrigerante', norma: 'Reg. UE 517/2014', options: [
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
          { value: 'R507A', label: 'R507A (GWP 3985)' }
        ]},
        { id: 'carica_gas', label: 'Carica Gas Refrigerante', tipo: 'number', required: true, unit: 'kg', min: 0, step: 0.01, sezione: 'gas_refrigerante' },
        { id: 'gwp', label: 'GWP (Global Warming Potential)', tipo: 'number', required: true, min: 0, sezione: 'gas_refrigerante' },
        { id: 'co2_equivalente', label: 'CO2 Equivalente', tipo: 'number', required: true, unit: 'ton', min: 0, step: 0.001, sezione: 'gas_refrigerante', help: 'Carica (kg) × GWP / 1000' },
        { id: 'gas_preimballato', label: 'Gas Preimballato di Fabbrica', tipo: 'radio', required: true, sezione: 'gas_refrigerante', options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No (caricato in opera)' }
        ]},
        { id: 'quantita_preimballata', label: 'Quantità Preimballata', tipo: 'number', unit: 'kg', min: 0, step: 0.01, sezione: 'gas_refrigerante' },
        { id: 'carica_aggiuntiva', label: 'Carica Aggiuntiva in Opera', tipo: 'number', unit: 'kg', min: 0, step: 0.01, sezione: 'gas_refrigerante' },
      ]
    },
    {
      id: 'circuito_frigorifero',
      titolo: 'Circuito Frigorifero',
      icon: 'fas fa-project-diagram',
      campi: [
        { id: 'numero_circuiti', label: 'Numero Circuiti Frigoriferi', tipo: 'number', required: true, min: 1, sezione: 'circuito_frigorifero' },
        { id: 'ermeticita', label: 'Circuito Ermetico', tipo: 'radio', required: true, sezione: 'circuito_frigorifero', options: [
          { value: 'ermetico', label: 'Ermetico/Sigillato' },
          { value: 'non_ermetico', label: 'Non Ermetico (aperto)' }
        ]},
        { id: 'tubazioni_tipo', label: 'Tipo Tubazioni', tipo: 'select', required: true, sezione: 'circuito_frigorifero', options: [
          { value: 'rame', label: 'Rame' },
          { value: 'acciaio', label: 'Acciaio' },
          { value: 'alluminio', label: 'Alluminio' },
          { value: 'preisolato', label: 'Tubi Preisolati' }
        ]},
        { id: 'diametro_linea_liquido', label: 'Diametro Linea Liquido', tipo: 'text', placeholder: 'Es: 3/8"', sezione: 'circuito_frigorifero' },
        { id: 'diametro_linea_gas', label: 'Diametro Linea Gas', tipo: 'text', placeholder: 'Es: 5/8"', sezione: 'circuito_frigorifero' },
        { id: 'lunghezza_tubazioni', label: 'Lunghezza Tubazioni', tipo: 'number', unit: 'm', min: 0, sezione: 'circuito_frigorifero' },
        { id: 'dislivello_max', label: 'Dislivello Max', tipo: 'number', unit: 'm', min: 0, sezione: 'circuito_frigorifero' },
        { id: 'isolamento_tipo', label: 'Tipo Isolamento', tipo: 'select', required: true, sezione: 'circuito_frigorifero', options: [
          { value: 'gomma', label: 'Guaina in Gomma' },
          { value: 'polietilene', label: 'Polietilene Espanso' },
          { value: 'altro', label: 'Altro' }
        ]},
        { id: 'spessore_isolamento', label: 'Spessore Isolamento', tipo: 'number', unit: 'mm', min: 0, sezione: 'circuito_frigorifero' },
        { id: 'vuoto_eseguito', label: 'Vuoto dell\'Impianto Effettuato', tipo: 'checkbox', required: true, sezione: 'circuito_frigorifero' },
        { id: 'tempo_vuoto', label: 'Durata Vuoto', tipo: 'number', unit: 'min', min: 0, sezione: 'circuito_frigorifero' },
        { id: 'pressione_vuoto', label: 'Pressione Raggiunta', tipo: 'number', unit: 'mbar', min: 0, sezione: 'circuito_frigorifero' },
        { id: 'prova_pressione', label: 'Prova di Pressione Effettuata', tipo: 'checkbox', required: true, sezione: 'circuito_frigorifero' },
        { id: 'prova_pressione_valore', label: 'Pressione Prova', tipo: 'number', unit: 'bar', min: 0, sezione: 'circuito_frigorifero' },
        { id: 'prova_pressione_durata', label: 'Durata Prova Pressione', tipo: 'number', unit: 'min', min: 0, sezione: 'circuito_frigorifero' },
      ]
    },
    {
      id: 'verifica_perdite',
      titolo: 'Verifica Perdite (Obbligatoria)',
      icon: 'fas fa-search',
      campi: [
        { id: 'verifica_effettuata', label: 'Verifica Perdite Effettuata', tipo: 'radio', required: true, sezione: 'verifica_perdite', options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No' },
          { value: 'non_richiesta', label: 'Non Richiesta (< 3 kg CO2 eq)' }
        ]},
        { id: 'data_verifica', label: 'Data Verifica', tipo: 'date', sezione: 'verifica_perdite' },
        { id: 'metodo_verifica', label: 'Metodo Verifica', tipo: 'select', sezione: 'verifica_perdite', options: [
          { value: 'elettronico', label: 'Rilevatore Elettronico' },
          { value: 'azoto', label: 'Prova con Azoto' },
          { value: 'schiuma', label: 'Acqua e Sapone' },
          { value: 'ultravioletti', label: 'Luce UV + Tracciante' },
          { value: 'ultrasuoni', label: 'Rilevatore a Ultrasuoni' }
        ]},
        { id: 'esito_verifica', label: 'Esito Verifica', tipo: 'radio', sezione: 'verifica_perdite', options: [
          { value: 'negativo', label: 'Negativo (Nessuna Perdita)' },
          { value: 'positivo', label: 'Positivo (Perdite Rilevate)' }
        ]},
        { id: 'frequenza_controlli', label: 'Frequenza Controlli Periodici', tipo: 'select', sezione: 'verifica_perdite', norma: 'DPR 146/2018', help: 'Obbligatoria per cariche ≥ 5 ton CO2 eq', options: [
          { value: '12mesi', label: 'Ogni 12 mesi' },
          { value: '6mesi', label: 'Ogni 6 mesi (≥ 50 ton CO2 eq)' },
          { value: '3mesi', label: 'Ogni 3 mesi (≥ 500 ton CO2 eq)' },
          { value: 'non_obbligatorio', label: 'Non Obbligatorio' }
        ]},
        { id: 'note_verifica', label: 'Note Verifica', tipo: 'textarea', sezione: 'verifica_perdite' },
      ]
    },
    {
      id: 'soglie_obblighi',
      titolo: 'Soglie e Obblighi',
      icon: 'fas fa-balance-scale',
      campi: [
        { id: 'soglia_3kg', label: 'Carica ≥ 3 kg (5 kg per ermetici)', tipo: 'checkbox', sezione: 'soglie_obblighi', help: 'Obbligo registrazione e controllo perdite' },
        { id: 'soglia_5ton', label: 'Carica ≥ 5 ton CO2 eq', tipo: 'checkbox', sezione: 'soglie_obblighi', help: 'Controllo perdite ogni 12 mesi' },
        { id: 'soglia_50ton', label: 'Carica ≥ 50 ton CO2 eq', tipo: 'checkbox', sezione: 'soglie_obblighi', help: 'Controllo perdite ogni 6 mesi + detector' },
        { id: 'soglia_500ton', label: 'Carica ≥ 500 ton CO2 eq', tipo: 'checkbox', sezione: 'soglie_obblighi', help: 'Controllo perdite ogni 3 mesi + detector' },
        { id: 'detector_perdite', label: 'Sistema Detector Perdite Installato', tipo: 'radio', sezione: 'soglie_obblighi', options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No' },
          { value: 'non_richiesto', label: 'Non Richiesto' }
        ]},
        { id: 'registro_tenuto', label: 'Registro Tenuto dal Committente', tipo: 'radio', required: true, sezione: 'soglie_obblighi', options: [
          { value: 'si', label: 'Sì' },
          { value: 'no', label: 'No (da attivare)' }
        ]},
      ]
    },
    {
      id: 'certificazioni',
      titolo: 'Certificazioni F-Gas',
      icon: 'fas fa-certificate',
      campi: [
        { id: 'certificato_tecnico', label: 'Numero Certificato F-Gas Tecnico', tipo: 'text', required: true, sezione: 'certificazioni', help: 'Obbligatorio per interventi su impianti F-Gas' },
        { id: 'data_certificato_tecnico', label: 'Data Rilascio Certificato Tecnico', tipo: 'date', sezione: 'certificazioni' },
        { id: 'ente_certificatore_tecnico', label: 'Ente Certificatore Tecnico', tipo: 'text', sezione: 'certificazioni' },
        { id: 'certificato_impresa', label: 'Numero Certificato F-Gas Impresa', tipo: 'text', required: true, sezione: 'certificazioni', help: 'Obbligatorio per l\'impresa' },
        { id: 'data_certificato_impresa', label: 'Data Rilascio Certificato Impresa', tipo: 'date', sezione: 'certificazioni' },
        { id: 'ente_certificatore_impresa', label: 'Ente Certificatore Impresa', tipo: 'text', sezione: 'certificazioni' },
        { id: 'registro_piattaforma', label: 'Registrazione su Piattaforma Nazionale', tipo: 'checkbox', sezione: 'certificazioni' },
        { id: 'codice_registro', label: 'Codice Registro Piattaforma', tipo: 'text', sezione: 'certificazioni' },
      ]
    },
  ]
};

// ============================================
// VERIFICA IMPIANTO ELETTRICO
// ============================================
export const VERIFICA_ELETTRICA: SchedaDefinizione = {
  tipo: 'verifica_elettrica',
  titolo: 'Verifica Impianto Elettrico',
  norma: 'CEI 64-8 Cap. 61',
  descrizione: 'Scheda di verifica iniziale e periodica di impianti elettrici',
  sezioni: [
    {
      id: 'dati_impianto',
      titolo: 'Dati Impianto',
      icon: 'fas fa-bolt',
      campi: [
        { id: 'data_verifica', label: 'Data Verifica', tipo: 'date', required: true, sezione: 'dati_impianto' },
        { id: 'tipo_verifica', label: 'Tipo Verifica', tipo: 'select', required: true, sezione: 'dati_impianto', options: [
          { value: 'iniziale', label: 'Verifica Iniziale' },
          { value: 'periodica', label: 'Verifica Periodica' },
          { value: 'straordinaria', label: 'Verifica Straordinaria' }
        ]},
        { id: 'motivo_verifica', label: 'Motivo Verifica', tipo: 'text', sezione: 'dati_impianto' },
        { id: 'sistema_distribuzione', label: 'Sistema di Distribuzione', tipo: 'select', sezione: 'dati_impianto', options: [
          { value: 'TT', label: 'TT' },
          { value: 'TN-S', label: 'TN-S' },
          { value: 'TN-C', label: 'TN-C' },
          { value: 'IT', label: 'IT' }
        ]},
        { id: 'tensione', label: 'Tensione', tipo: 'select', sezione: 'dati_impianto', options: [
          { value: '230', label: '230V' },
          { value: '400', label: '400V' }
        ]},
      ]
    },
    {
      id: 'verifiche',
      titolo: 'Verifiche Effettuate',
      icon: 'fas fa-clipboard-check',
      campi: [
        { id: 'esame_visivo', label: 'Esame Visivo', tipo: 'radio', required: true, sezione: 'verifiche', options: [
          { value: 'positivo', label: 'Positivo' },
          { value: 'negativo', label: 'Negativo' }
        ]},
        { id: 'continuita_conduttori', label: 'Continuità Conduttori di Protezione', tipo: 'number', unit: 'Ω', min: 0, step: 0.01, sezione: 'verifiche' },
        { id: 'resistenza_isolamento', label: 'Resistenza Isolamento', tipo: 'number', unit: 'MΩ', min: 0, step: 0.01, sezione: 'verifiche', help: 'Minimo 1 MΩ' },
        { id: 'resistenza_terra', label: 'Resistenza di Terra', tipo: 'number', unit: 'Ω', min: 0, step: 0.1, sezione: 'verifiche', help: 'Max 36 Ω per TT' },
        { id: 'tempo_intervento_diff_5in', label: 'Tempo Intervento Diff. a 5 In', tipo: 'number', unit: 'ms', min: 0, sezione: 'verifiche' },
        { id: 'tempo_intervento_diff_1in', label: 'Tempo Intervento Diff. a 1 In', tipo: 'number', unit: 'ms', min: 0, sezione: 'verifiche' },
        { id: 'corrente_intervento_diff', label: 'Corrente Intervento Diff.', tipo: 'number', unit: 'mA', min: 0, sezione: 'verifiche' },
        { id: 'corrente_non_intervento_diff', label: 'Corrente Non Intervento Diff.', tipo: 'number', unit: 'mA', min: 0, sezione: 'verifiche' },
        { id: 'resistenza_anello', label: 'Resistenza Anello Guasto', tipo: 'number', unit: 'Ω', min: 0, step: 0.01, sezione: 'verifiche' },
        { id: 'corrente_cortocircuito', label: 'Corrente Cortocircuito Presunta', tipo: 'number', unit: 'kA', min: 0, sezione: 'verifiche' },
        { id: 'caduta_tensione', label: 'Caduta Tensione', tipo: 'number', unit: '%', min: 0, step: 0.1, sezione: 'verifiche' },
        { id: 'polarita', label: 'Verifica Polarità', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'corretta', label: 'Corretta' },
          { value: 'errata', label: 'Errata' }
        ]},
        { id: 'prova_funzionamento', label: 'Prova Funzionamento', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'positivo', label: 'Positivo' },
          { value: 'negativo', label: 'Negativo' }
        ]},
      ]
    },
    {
      id: 'strumentazione',
      titolo: 'Strumentazione Utilizzata',
      icon: 'fas fa-tools',
      campi: [
        { id: 'strumento_marca', label: 'Marca Strumento', tipo: 'text', sezione: 'strumentazione' },
        { id: 'strumento_modello', label: 'Modello Strumento', tipo: 'text', sezione: 'strumentazione' },
        { id: 'strumento_matricola', label: 'Matricola Strumento', tipo: 'text', sezione: 'strumentazione' },
        { id: 'strumento_taratura', label: 'Data Taratura', tipo: 'date', sezione: 'strumentazione' },
        { id: 'strumento_scadenza', label: 'Scadenza Taratura', tipo: 'date', sezione: 'strumentazione' },
      ]
    },
    {
      id: 'esito',
      titolo: 'Esito Verifica',
      icon: 'fas fa-check-circle',
      campi: [
        { id: 'esito_complessivo', label: 'Esito Complessivo', tipo: 'radio', required: true, sezione: 'esito', options: [
          { value: 'positivo', label: 'POSITIVO - Impianto conforme' },
          { value: 'positivo_prescrizioni', label: 'POSITIVO con prescrizioni' },
          { value: 'negativo', label: 'NEGATIVO - Impianto non conforme' }
        ]},
        { id: 'prescrizioni', label: 'Prescrizioni', tipo: 'textarea', sezione: 'esito' },
        { id: 'non_conformita', label: 'Non Conformità Rilevate', tipo: 'textarea', sezione: 'esito' },
        { id: 'prossima_verifica', label: 'Data Prossima Verifica Consigliata', tipo: 'date', sezione: 'esito' },
        { id: 'note', label: 'Note', tipo: 'textarea', sezione: 'esito' },
      ]
    },
  ]
};

// ============================================
// LIBRETTO IMPIANTO
// ============================================
export const LIBRETTO_IMPIANTO: SchedaDefinizione = {
  tipo: 'libretto_impianto',
  titolo: 'Libretto di Impianto',
  norma: 'D.P.R. 74/2013 - D.Lgs 48/2020',
  descrizione: 'Libretto di impianto per climatizzazione e riscaldamento',
  sezioni: [
    {
      id: 'dati_impianto',
      titolo: 'Dati Generali Impianto',
      icon: 'fas fa-book',
      campi: [
        { id: 'codice_impianto', label: 'Codice Impianto (CURIT/Catasto)', tipo: 'text', sezione: 'dati_impianto' },
        { id: 'data_attivazione', label: 'Data Attivazione', tipo: 'date', sezione: 'dati_impianto' },
        { id: 'potenza_nominale', label: 'Potenza Nominale', tipo: 'number', required: true, unit: 'kW', min: 0, step: 0.1, sezione: 'dati_impianto' },
        { id: 'potenza_utile', label: 'Potenza Utile', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'dati_impianto' },
        { id: 'funzione_impianto', label: 'Funzione Impianto', tipo: 'checkbox', sezione: 'dati_impianto', options: [
          { value: 'riscaldamento', label: 'Riscaldamento' },
          { value: 'raffrescamento', label: 'Raffrescamento' },
          { value: 'acs', label: 'Produzione ACS' }
        ]},
        { id: 'zona_climatica', label: 'Zona Climatica', tipo: 'select', sezione: 'dati_impianto', options: [
          { value: 'A', label: 'Zona A' },
          { value: 'B', label: 'Zona B' },
          { value: 'C', label: 'Zona C' },
          { value: 'D', label: 'Zona D' },
          { value: 'E', label: 'Zona E' },
          { value: 'F', label: 'Zona F' }
        ]},
        { id: 'gradi_giorno', label: 'Gradi Giorno', tipo: 'number', min: 0, sezione: 'dati_impianto' },
      ]
    },
    {
      id: 'generatore',
      titolo: 'Generatore di Calore',
      icon: 'fas fa-fire',
      campi: [
        { id: 'tipo_generatore', label: 'Tipo Generatore', tipo: 'select', required: true, sezione: 'generatore', options: [
          { value: 'caldaia_gas', label: 'Caldaia a gas' },
          { value: 'caldaia_condensazione', label: 'Caldaia a condensazione' },
          { value: 'pompa_calore', label: 'Pompa di calore' },
          { value: 'stufa_pellet', label: 'Stufa a pellet' },
          { value: 'camino_legna', label: 'Camino a legna' },
          { value: 'climatizzatore', label: 'Climatizzatore split' },
          { value: 'chiller', label: 'Chiller' },
          { value: 'gruppo_termico', label: 'Gruppo termico' }
        ]},
        { id: 'marca', label: 'Marca', tipo: 'text', required: true, sezione: 'generatore' },
        { id: 'modello', label: 'Modello', tipo: 'text', required: true, sezione: 'generatore' },
        { id: 'matricola', label: 'Matricola', tipo: 'text', sezione: 'generatore' },
        { id: 'anno_costruzione', label: 'Anno Costruzione', tipo: 'number', min: 1900, max: 2030, sezione: 'generatore' },
        { id: 'anno_installazione', label: 'Anno Installazione', tipo: 'number', min: 1900, max: 2030, sezione: 'generatore' },
        { id: 'combustibile', label: 'Combustibile', tipo: 'select', sezione: 'generatore', options: [
          { value: 'metano', label: 'Metano' },
          { value: 'gpl', label: 'GPL' },
          { value: 'gasolio', label: 'Gasolio' },
          { value: 'legna', label: 'Legna' },
          { value: 'pellet', label: 'Pellet' },
          { value: 'elettrico', label: 'Elettrico' }
        ]},
        { id: 'potenza_focolare', label: 'Potenza al Focolare', tipo: 'number', unit: 'kW', min: 0, step: 0.1, sezione: 'generatore' },
        { id: 'rendimento', label: 'Rendimento', tipo: 'number', unit: '%', min: 0, max: 100, step: 0.1, sezione: 'generatore' },
        { id: 'classe_energetica', label: 'Classe Energetica', tipo: 'select', sezione: 'generatore', options: [
          { value: 'A+++', label: 'A+++' },
          { value: 'A++', label: 'A++' },
          { value: 'A+', label: 'A+' },
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' }
        ]},
        { id: 'tipo_camera', label: 'Tipo Camera', tipo: 'select', sezione: 'generatore', options: [
          { value: 'aperta', label: 'Camera Aperta' },
          { value: 'stagna', label: 'Camera Stagna' }
        ]},
        { id: 'tipo_scarico', label: 'Tipo Scarico Fumi', tipo: 'select', sezione: 'generatore', options: [
          { value: 'canna_fumaria', label: 'Canna Fumaria' },
          { value: 'parete', label: 'Scarico a Parete' }
        ]},
      ]
    },
    {
      id: 'distribuzione',
      titolo: 'Sistema di Distribuzione',
      icon: 'fas fa-project-diagram',
      campi: [
        { id: 'tipo_distribuzione', label: 'Tipo Distribuzione', tipo: 'select', sezione: 'distribuzione', options: [
          { value: 'radiatori', label: 'Radiatori' },
          { value: 'pavimento', label: 'Pavimento Radiante' },
          { value: 'soffitto', label: 'Soffitto Radiante' },
          { value: 'ventilconvettori', label: 'Ventilconvettori' },
          { value: 'split', label: 'Split' },
          { value: 'aria', label: 'Aria' }
        ]},
        { id: 'temperatura_mandata', label: 'Temperatura Mandata', tipo: 'number', unit: '°C', min: 0, sezione: 'distribuzione' },
        { id: 'temperatura_ritorno', label: 'Temperatura Ritorno', tipo: 'number', unit: '°C', min: 0, sezione: 'distribuzione' },
        { id: 'pressione_esercizio', label: 'Pressione Esercizio', tipo: 'number', unit: 'bar', min: 0, step: 0.1, sezione: 'distribuzione' },
        { id: 'numero_zone', label: 'Numero Zone', tipo: 'number', min: 1, sezione: 'distribuzione' },
      ]
    },
    {
      id: 'regolazione',
      titolo: 'Sistema di Regolazione',
      icon: 'fas fa-sliders-h',
      campi: [
        { id: 'termostato_ambiente', label: 'Termostato Ambiente', tipo: 'checkbox', sezione: 'regolazione' },
        { id: 'valvole_termostatiche', label: 'Valvole Termostatiche', tipo: 'checkbox', sezione: 'regolazione' },
        { id: 'centralina_meteo', label: 'Centralina Meteo', tipo: 'checkbox', sezione: 'regolazione' },
        { id: 'cronotermostato', label: 'Cronotermostato', tipo: 'checkbox', sezione: 'regolazione' },
        { id: 'sonda_esterna', label: 'Sonda Esterna', tipo: 'checkbox', sezione: 'regolazione' },
        { id: 'tipo_regolazione', label: 'Tipo Regolazione', tipo: 'select', sezione: 'regolazione', options: [
          { value: 'on_off', label: 'On/Off' },
          { value: 'modulante', label: 'Modulante' },
          { value: 'inverter', label: 'Inverter' }
        ]},
      ]
    },
    {
      id: 'manutenzioni',
      titolo: 'Storico Manutenzioni',
      icon: 'fas fa-tools',
      campi: [
        { id: 'ultima_manutenzione', label: 'Data Ultima Manutenzione', tipo: 'date', sezione: 'manutenzioni' },
        { id: 'prossima_manutenzione', label: 'Data Prossima Manutenzione', tipo: 'date', sezione: 'manutenzioni' },
        { id: 'frequenza_manutenzione', label: 'Frequenza Manutenzione', tipo: 'select', sezione: 'manutenzioni', options: [
          { value: 'annuale', label: 'Annuale' },
          { value: 'biennale', label: 'Biennale' },
          { value: 'triennale', label: 'Triennale' }
        ]},
        { id: 'ultima_verifica_fumi', label: 'Data Ultima Verifica Fumi', tipo: 'date', sezione: 'manutenzioni' },
        { id: 'prossima_verifica_fumi', label: 'Data Prossima Verifica Fumi', tipo: 'date', sezione: 'manutenzioni' },
        { id: 'note_manutenzioni', label: 'Note Manutenzioni', tipo: 'textarea', sezione: 'manutenzioni' },
      ]
    },
    {
      id: 'proprietario_responsabile',
      titolo: 'Proprietario/Responsabile Impianto',
      icon: 'fas fa-user-tie',
      campi: [
        { id: 'proprietario_nome', label: 'Nome Proprietario', tipo: 'text', required: true, sezione: 'proprietario_responsabile' },
        { id: 'proprietario_cognome', label: 'Cognome Proprietario', tipo: 'text', required: true, sezione: 'proprietario_responsabile' },
        { id: 'proprietario_cf', label: 'Codice Fiscale', tipo: 'text', sezione: 'proprietario_responsabile' },
        { id: 'proprietario_indirizzo', label: 'Indirizzo', tipo: 'text', sezione: 'proprietario_responsabile' },
        { id: 'proprietario_telefono', label: 'Telefono', tipo: 'tel', sezione: 'proprietario_responsabile' },
        { id: 'proprietario_email', label: 'Email', tipo: 'email', sezione: 'proprietario_responsabile' },
        { id: 'terzo_responsabile', label: 'Terzo Responsabile (se nominato)', tipo: 'checkbox', sezione: 'proprietario_responsabile' },
        { id: 'terzo_responsabile_nome', label: 'Nome Terzo Responsabile', tipo: 'text', sezione: 'proprietario_responsabile' },
        { id: 'terzo_responsabile_empresa', label: 'Impresa Terzo Responsabile', tipo: 'text', sezione: 'proprietario_responsabile' },
        { id: 'data_nomina_terzo', label: 'Data Nomina Terzo Responsabile', tipo: 'date', sezione: 'proprietario_responsabile' },
      ]
    },
    {
      id: 'installatore_originario',
      titolo: 'Dati Installatore Originario',
      icon: 'fas fa-hard-hat',
      campi: [
        { id: 'installatore_ragione_sociale', label: 'Ragione Sociale Installatore', tipo: 'text', sezione: 'installatore_originario' },
        { id: 'installatore_piva', label: 'Partita IVA Installatore', tipo: 'text', sezione: 'installatore_originario' },
        { id: 'installatore_indirizzo', label: 'Indirizzo Installatore', tipo: 'text', sezione: 'installatore_originario' },
        { id: 'installatore_telefono', label: 'Telefono Installatore', tipo: 'tel', sezione: 'installatore_originario' },
        { id: 'data_installazione', label: 'Data Installazione', tipo: 'date', sezione: 'installatore_originario' },
        { id: 'numero_dico_originaria', label: 'Numero DiCo Originaria', tipo: 'text', sezione: 'installatore_originario' },
        { id: 'data_dico_originaria', label: 'Data DiCo Originaria', tipo: 'date', sezione: 'installatore_originario' },
      ]
    },
    {
      id: 'locali_tecnici',
      titolo: 'Caratteristiche Locali Tecnici',
      icon: 'fas fa-home',
      campi: [
        { id: 'locale_caldaia', label: 'Locale Caldaia Presente', tipo: 'checkbox', sezione: 'locali_tecnici' },
        { id: 'volume_locale', label: 'Volume Locale Tecnico', tipo: 'number', unit: 'm³', min: 0, sezione: 'locali_tecnici' },
        { id: 'superficie_locale', label: 'Superficie Locale Tecnico', tipo: 'number', unit: 'm²', min: 0, sezione: 'locali_tecnici' },
        { id: 'altezza_locale', label: 'Altezza Locale Tecnico', tipo: 'number', unit: 'm', min: 0, step: 0.1, sezione: 'locali_tecnici' },
        { id: 'ventilazione_locale', label: 'Ventilazione Locale', tipo: 'select', sezione: 'locali_tecnici', options: [
          { value: 'naturale', label: 'Naturale' },
          { value: 'forzata', label: 'Forzata' },
          { value: 'mista', label: 'Mista' }
        ]},
        { id: 'superficie_ventilazione', label: 'Superficie Ventilazione', tipo: 'number', unit: 'cm²', min: 0, sezione: 'locali_tecnici' },
        { id: 'rilevatore_gas', label: 'Rilevatore Gas Installato', tipo: 'checkbox', sezione: 'locali_tecnici' },
        { id: 'elettrovalvola', label: 'Elettrovalvola Gas', tipo: 'checkbox', sezione: 'locali_tecnici' },
      ]
    },
    {
      id: 'trattamento_acqua',
      titolo: 'Sistema Trattamento Acqua',
      icon: 'fas fa-tint',
      campi: [
        { id: 'trattamento_acqua_presente', label: 'Trattamento Acqua Presente', tipo: 'checkbox', sezione: 'trattamento_acqua' },
        { id: 'filtro_disidratatore', label: 'Filtro Disidratatore', tipo: 'checkbox', sezione: 'trattamento_acqua' },
        { id: 'addolcitore', label: 'Addolcitore', tipo: 'checkbox', sezione: 'trattamento_acqua' },
        { id: 'dosaggio_inibitore', label: 'Dosaggio Inibitore Corrosione', tipo: 'checkbox', sezione: 'trattamento_acqua' },
        { id: 'tipo_inibitore', label: 'Tipo Inibitore', tipo: 'text', sezione: 'trattamento_acqua' },
        { id: 'data_trattamento', label: 'Data Ultimo Trattamento', tipo: 'date', sezione: 'trattamento_acqua' },
        { id: 'ph_acqua', label: 'pH Acqua Impianto', tipo: 'number', min: 0, max: 14, step: 0.1, sezione: 'trattamento_acqua' },
        { id: 'durezza_acqua', label: 'Durezza Acqua', tipo: 'number', unit: '°f', min: 0, sezione: 'trattamento_acqua' },
      ]
    },
    {
      id: 'combustione_aerazione',
      titolo: 'Sistema Combustione e Aerazione',
      icon: 'fas fa-wind',
      campi: [
        { id: 'presa_aria_combustione', label: 'Presa Aria Combustione', tipo: 'select', sezione: 'combustione_aerazione', options: [
          { value: 'diretta', label: 'Diretta dall\'esterno' },
          { value: 'locale', label: 'Dal locale tecnico' },
          { value: 'canale', label: 'Canale dedicato' }
        ]},
        { id: 'superficie_presa_aria', label: 'Superficie Presa Aria', tipo: 'number', unit: 'cm²', min: 0, sezione: 'combustione_aerazione' },
        { id: 'scarico_fumi_tipo', label: 'Tipo Scarico Fumi', tipo: 'select', sezione: 'combustione_aerazione', options: [
          { value: 'canna_fumaria', label: 'Canna Fumaria' },
          { value: 'parete', label: 'Scarico a Parete' },
          { value: 'intubamento', label: 'Intubamento Canna Fumaria' }
        ]},
        { id: 'materiale_scarico', label: 'Materiale Scarico', tipo: 'select', sezione: 'combustione_aerazione', options: [
          { value: 'acciaio_inox', label: 'Acciaio Inox' },
          { value: 'alluminio', label: 'Alluminio' },
          { value: 'materiale_plastico', label: 'Materiale Plastico' }
        ]},
        { id: 'diametro_scarico', label: 'Diametro Scarico', tipo: 'number', unit: 'mm', min: 0, sezione: 'combustione_aerazione' },
        { id: 'lunghezza_scarico', label: 'Lunghezza Scarico', tipo: 'number', unit: 'm', min: 0, sezione: 'combustione_aerazione' },
        { id: 'comignolo', label: 'Comignolo Installato', tipo: 'checkbox', sezione: 'combustione_aerazione' },
        { id: 'altezza_comignolo', label: 'Altezza Comignolo', tipo: 'number', unit: 'm', min: 0, sezione: 'combustione_aerazione' },
      ]
    },
    {
      id: 'documentazione_tecnica',
      titolo: 'Documentazione Tecnica',
      icon: 'fas fa-folder-open',
      campi: [
        { id: 'libretto_uso_manutenzione', label: 'Libretto Uso e Manutenzione Generatore', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'scheda_tecnica_generatore', label: 'Scheda Tecnica Generatore', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'certificato_conformita_generatore', label: 'Certificato Conformità Generatore (CE)', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'dichiarazione_conformita_impianto', label: 'Dichiarazione Conformità Impianto', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'progetto_impianto', label: 'Progetto Impianto', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'schema_impianto', label: 'Schema Impianto', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'manuale_utente', label: 'Manuale Utente', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'certificati_materiali', label: 'Certificati Materiali', tipo: 'checkbox', sezione: 'documentazione_tecnica' },
        { id: 'note_documentazione', label: 'Note Documentazione', tipo: 'textarea', sezione: 'documentazione_tecnica' },
      ]
    },
    {
      id: 'efficientamento_energetico',
      titolo: 'Interventi Efficientamento Energetico',
      icon: 'fas fa-leaf',
      campi: [
        { id: 'valvole_termostatiche_installate', label: 'Valvole Termostatiche Installate', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'cronotermostato_installato', label: 'Cronotermostato Installato', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'sonda_esterna_installata', label: 'Sonda Esterna Installata', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'isolamento_tubazioni', label: 'Isolamento Tubazioni', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'pompa_circolazione_efficiente', label: 'Pompa Circolazione ad Alta Efficienza', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'regolazione_clima', label: 'Sistema Regolazione Climatica', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'contabilizzazione_calore', label: 'Contabilizzazione Calore', tipo: 'checkbox', sezione: 'efficientamento_energetico' },
        { id: 'data_intervento_efficientamento', label: 'Data Intervento Efficientamento', tipo: 'date', sezione: 'efficientamento_energetico' },
        { id: 'risparmio_energetico_stimato', label: 'Risparmio Energetico Stimato', tipo: 'number', unit: '%', min: 0, max: 100, sezione: 'efficientamento_energetico' },
        { id: 'note_efficientamento', label: 'Note Interventi', tipo: 'textarea', sezione: 'efficientamento_energetico' },
      ]
    },
    {
      id: 'verifiche_controlli',
      titolo: 'Verifiche e Controlli Periodici',
      icon: 'fas fa-clipboard-check',
      campi: [
        { id: 'tipo_verifica', label: 'Tipo Verifica', tipo: 'select', sezione: 'verifiche_controlli', options: [
          { value: 'manutenzione_ordinaria', label: 'Manutenzione Ordinaria' },
          { value: 'manutenzione_straordinaria', label: 'Manutenzione Straordinaria' },
          { value: 'controllo_efficienza', label: 'Controllo Efficienza Energetica' },
          { value: 'verifica_fumi', label: 'Verifica Fumi' },
          { value: 'controllo_periodico', label: 'Controllo Periodico' }
        ]},
        { id: 'data_verifica', label: 'Data Verifica', tipo: 'date', sezione: 'verifiche_controlli' },
        { id: 'esito_verifica', label: 'Esito Verifica', tipo: 'radio', sezione: 'verifiche_controlli', options: [
          { value: 'positivo', label: 'Positivo' },
          { value: 'positivo_prescrizioni', label: 'Positivo con Prescrizioni' },
          { value: 'negativo', label: 'Negativo' }
        ]},
        { id: 'operatore_verifica', label: 'Operatore che ha effettuato la Verifica', tipo: 'text', sezione: 'verifiche_controlli' },
        { id: 'impresa_verifica', label: 'Impresa Verificatrice', tipo: 'text', sezione: 'verifiche_controlli' },
        { id: 'numero Rapporto', label: 'Numero Rapporto Verifica', tipo: 'text', sezione: 'verifiche_controlli' },
        { id: 'prossima_verifica', label: 'Data Prossima Verifica', tipo: 'date', sezione: 'verifiche_controlli' },
        { id: 'note_verifica', label: 'Note Verifica', tipo: 'textarea', sezione: 'verifiche_controlli' },
      ]
    },
  ]
};

// ============================================
// RAPPORTO CONTROLLO EFFICIENZA
// ============================================
export const RAPPORTO_CONTROLLO: SchedaDefinizione = {
  tipo: 'rapporto_controllo',
  titolo: 'Rapporto di Controllo Efficienza',
  norma: 'D.Lgs 48/2020 - Allegato A1-A9',
  descrizione: 'Rapporto di efficienza energetica per impianti termici',
  sezioni: [
    {
      id: 'dati_controllo',
      titolo: 'Dati Controllo',
      icon: 'fas fa-chart-line',
      campi: [
        { id: 'data_controllo', label: 'Data Controllo', tipo: 'date', required: true, sezione: 'dati_controllo' },
        { id: 'tipo_controllo', label: 'Tipo Controllo', tipo: 'select', required: true, sezione: 'dati_controllo', options: [
          { value: '1', label: 'Tipo 1 - Impianti < 10kW' },
          { value: '2', label: 'Tipo 2 - Impianti 10-100kW' },
          { value: '3', label: 'Tipo 3 - Impianti 100-1000kW' },
          { value: '4', label: 'Tipo 4 - Impianti > 1000kW' }
        ]},
        { id: 'numero_controllo', label: 'Numero Controllo', tipo: 'text', sezione: 'dati_controllo' },
        { id: 'codice_impianto', label: 'Codice Impianto', tipo: 'text', sezione: 'dati_controllo' },
      ]
    },
    {
      id: 'misurazioni',
      titolo: 'Misurazioni Effettuate',
      icon: 'fas fa-thermometer-half',
      campi: [
        { id: 'temp_fumi', label: 'Temperatura Fumi', tipo: 'number', unit: '°C', min: 0, sezione: 'misurazioni' },
        { id: 'temp_ambiente', label: 'Temperatura Ambiente', tipo: 'number', unit: '°C', min: 0, sezione: 'misurazioni' },
        { id: 'temp_esterna', label: 'Temperatura Esterna', tipo: 'number', unit: '°C', min: -30, max: 50, sezione: 'misurazioni' },
        { id: 'temp_mandata', label: 'Temperatura Mandata', tipo: 'number', unit: '°C', min: 0, sezione: 'misurazioni' },
        { id: 'temp_ritorno', label: 'Temperatura Ritorno', tipo: 'number', unit: '°C', min: 0, sezione: 'misurazioni' },
        { id: 'co2', label: 'CO2', tipo: 'number', unit: '%', min: 0, max: 20, step: 0.01, sezione: 'misurazioni' },
        { id: 'co', label: 'CO (Monossido)', tipo: 'number', unit: 'ppm', min: 0, sezione: 'misurazioni', help: 'Attenzione se > 500 ppm' },
        { id: 'o2', label: 'O2 (Ossigeno)', tipo: 'number', unit: '%', min: 0, max: 21, step: 0.01, sezione: 'misurazioni' },
        { id: 'no', label: 'NO', tipo: 'number', unit: 'ppm', min: 0, sezione: 'misurazioni' },
        { id: 'nox', label: 'NOx', tipo: 'number', unit: 'ppm', min: 0, sezione: 'misurazioni' },
        { id: 'soot', label: 'Fuliggine', tipo: 'number', unit: 'Bacharach', min: 0, max: 10, step: 0.1, sezione: 'misurazioni' },
        { id: 'tiraggio', label: 'Tiraggio', tipo: 'number', unit: 'Pa', min: -50, max: 50, step: 0.1, sezione: 'misurazioni' },
        { id: 'pressione_caminetto', label: 'Pressione Caminetto', tipo: 'number', unit: 'Pa', min: -50, max: 50, step: 0.1, sezione: 'misurazioni' },
      ]
    },
    {
      id: 'rendimento',
      titolo: 'Rendimento',
      icon: 'fas fa-tachometer-alt',
      campi: [
        { id: 'rendimento_combustione', label: 'Rendimento Combustione', tipo: 'number', unit: '%', min: 0, max: 100, step: 0.1, sezione: 'rendimento', help: 'Minimo 80% consigliato' },
        { id: 'rendimento_caldaia', label: 'Rendimento Caldaia', tipo: 'number', unit: '%', min: 0, max: 100, step: 0.1, sezione: 'rendimento' },
        { id: 'perdita_caminetto', label: 'Perdita al Caminetto', tipo: 'number', unit: '%', min: 0, max: 100, step: 0.1, sezione: 'rendimento' },
        { id: 'indice_efficienza', label: 'Indice Efficienza Energetica', tipo: 'number', min: 0, sezione: 'rendimento' },
        { id: 'formula_calcolo', label: 'Formula Calcolo Utilizzata', tipo: 'select', sezione: 'rendimento', options: [
          { value: 'f1', label: 'F1 (perdita al caminetto)' },
          { value: 'f2', label: 'F2 (temperatura fumi)' },
          { value: 'f3', label: 'F3 (rendimento)' },
          { value: 'f4', label: 'F4 (bassa temperatura)' }
        ]},
      ]
    },
    {
      id: 'verifiche',
      titolo: 'Verifiche Effettuate',
      icon: 'fas fa-clipboard-check',
      campi: [
        { id: 'stato_generatore', label: 'Stato Generatore', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'buono', label: 'Buono' },
          { value: 'discreto', label: 'Discreto' },
          { value: 'cattivo', label: 'Cattivo' }
        ]},
        { id: 'stato_canna_fumaria', label: 'Stato Canna Fumaria', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'buono', label: 'Buono' },
          { value: 'discreto', label: 'Discreto' },
          { value: 'cattivo', label: 'Cattivo' }
        ]},
        { id: 'stato_vaschi_espansione', label: 'Stato Vaso Espansione', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'buono', label: 'Buono' },
          { value: 'discreto', label: 'Discreto' },
          { value: 'cattivo', label: 'Cattivo' }
        ]},
        { id: 'verifica_ventilazione', label: 'Verifica Ventilazione', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'conforme', label: 'Conforme' },
          { value: 'non_conforme', label: 'Non Conforme' }
        ]},
        { id: 'verifica_scarico', label: 'Verifica Scarico Fumi', tipo: 'radio', sezione: 'verifiche', options: [
          { value: 'conforme', label: 'Conforme' },
          { value: 'non_conforme', label: 'Non Conforme' }
        ]},
        { id: 'verifica_pressione', label: 'Pressione Impianto', tipo: 'number', unit: 'bar', min: 0, step: 0.1, sezione: 'verifiche' },
      ]
    },
    {
      id: 'esito',
      titolo: 'Esito Controllo',
      icon: 'fas fa-check-circle',
      campi: [
        { id: 'esito', label: 'Esito Controllo', tipo: 'select', required: true, sezione: 'esito', options: [
          { value: 'Conforme', label: 'Conforme' },
          { value: 'Conforme con prescrizioni', label: 'Conforme con prescrizioni' },
          { value: 'Non conforme', label: 'Non conforme' },
          { value: 'Impianto non raggiungibile', label: 'Impianto non raggiungibile' },
          { value: 'Impianto inattivo', label: 'Impianto inattivo' }
        ]},
        { id: 'prescrizioni', label: 'Prescrizioni', tipo: 'textarea', sezione: 'esito' },
        { id: 'raccomandazioni', label: 'Raccomandazioni', tipo: 'textarea', sezione: 'esito' },
        { id: 'prossimo_controllo', label: 'Data Prossimo Controllo', tipo: 'date', sezione: 'esito' },
        { id: 'note', label: 'Note', tipo: 'textarea', sezione: 'esito' },
      ]
    },
  ]
};

// ============================================
// REGISTRO MANUTENZIONE
// ============================================
export const REGISTRO_MANUTENZIONE: SchedaDefinizione = {
  tipo: 'registro_manutenzione',
  titolo: 'Registro di Manutenzione',
  norma: 'D.M. 37/08 art. 8',
  descrizione: 'Registro per interventi di manutenzione e verifica periodica',
  sezioni: [
    {
      id: 'dati_intervento',
      titolo: 'Dati Intervento',
      icon: 'fas fa-tools',
      campi: [
        { id: 'data_intervento', label: 'Data Intervento', tipo: 'date', required: true, sezione: 'dati_intervento' },
        { id: 'tipo_intervento', label: 'Tipo Intervento', tipo: 'select', required: true, sezione: 'dati_intervento', options: [
          { value: 'Manutenzione Ordinaria', label: 'Manutenzione Ordinaria' },
          { value: 'Manutenzione Straordinaria', label: 'Manutenzione Straordinaria' },
          { value: 'Verifica Periodica', label: 'Verifica Periodica' },
          { value: 'Riparazione', label: 'Riparazione' },
          { value: 'Sostituzione Componenti', label: 'Sostituzione Componenti' },
          { value: 'Pulizia', label: 'Pulizia' },
          { value: 'Taratura', label: 'Taratura' },
          { value: 'Collaudo', label: 'Collaudo' }
        ]},
        { id: 'ore_intervento', label: 'Ore di Intervento', tipo: 'number', min: 0, step: 0.5, sezione: 'dati_intervento' },
        { id: 'numero_tecnici', label: 'Numero Tecnici', tipo: 'number', min: 1, sezione: 'dati_intervento' },
      ]
    },
    {
      id: 'descrizione',
      titolo: 'Descrizione Intervento',
      icon: 'fas fa-clipboard',
      campi: [
        { id: 'descrizione', label: 'Descrizione Intervento', tipo: 'textarea', required: true, sezione: 'descrizione' },
        { id: 'componenti_sostituiti', label: 'Componenti Sostituiti', tipo: 'textarea', sezione: 'descrizione' },
        { id: 'materiali_utilizzati', label: 'Materiali Utilizzati', tipo: 'textarea', sezione: 'descrizione' },
        { id: 'difficoltà_riscontrate', label: 'Difficoltà Riscontrate', tipo: 'textarea', sezione: 'descrizione' },
      ]
    },
    {
      id: 'ricambi',
      titolo: 'Ricambi e Materiali',
      icon: 'fas fa-boxes',
      campi: [
        { id: 'ricambi_elenco', label: 'Elenco Ricambi', tipo: 'textarea', sezione: 'ricambi' },
        { id: 'costo_ricambi', label: 'Costo Ricambi', tipo: 'number', unit: '€', min: 0, step: 0.01, sezione: 'ricambi' },
        { id: 'costo_manodopera', label: 'Costo Manodopera', tipo: 'number', unit: '€', min: 0, step: 0.01, sezione: 'ricambi' },
      ]
    },
    {
      id: 'tecnico',
      titolo: 'Tecnico Operatore',
      icon: 'fas fa-user-tie',
      campi: [
        { id: 'tecnico_nome', label: 'Nome Tecnico', tipo: 'text', required: true, sezione: 'tecnico' },
        { id: 'tecnico_qualifica', label: 'Qualifica', tipo: 'text', sezione: 'tecnico' },
        { id: 'tecnico_abilitazione', label: 'Abilitazione', tipo: 'text', sezione: 'tecnico' },
      ]
    },
    {
      id: 'prossimo_intervento',
      titolo: 'Prossimo Intervento',
      icon: 'fas fa-calendar-alt',
      campi: [
        { id: 'prossima_manutenzione', label: 'Data Prossima Manutenzione', tipo: 'date', sezione: 'prossimo_intervento' },
        { id: 'tipo_prossimo_intervento', label: 'Tipo Prossimo Intervento', tipo: 'text', sezione: 'prossimo_intervento' },
        { id: 'raccomandazioni', label: 'Raccomandazioni', tipo: 'textarea', sezione: 'prossimo_intervento' },
      ]
    },
  ]
};

// Esporta tutte le definizioni
export const SCHEDE_DEFINIZIONI: Record<SchedaTipo, SchedaDefinizione> = {
  'dico_elettrico': DICO_ELETTRICO,
  'dico_gas': DICO_GAS,
  'dico_idrico': DICO_GAS, // Placeholder
  'dico_termico': LIBRETTO_IMPIANTO,
  'dico_fgas': DICO_FGAS,
  'dico_antincendio': DICO_ELETTRICO, // Placeholder
  'dico_antifurto': DICO_ELETTRICO, // Placeholder
  'diri': DICO_ELETTRICO, // Placeholder
  'libretto_impianto': LIBRETTO_IMPIANTO,
  'rapporto_controllo': RAPPORTO_CONTROLLO,
  'registro_manutenzione': REGISTRO_MANUTENZIONE,
  'progetto_impianto': DICO_ELETTRICO, // Placeholder
  'relazione_tecnica': DICO_ELETTRICO, // Placeholder
  'verifica_elettrica': VERIFICA_ELETTRICA,
  'collaudo_impianto': DICO_ELETTRICO, // Placeholder
};
