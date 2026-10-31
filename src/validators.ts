// Validazioni conformi al D.M. 37/2008 e norme tecniche

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Validazione Codice Fiscale
export function validateCodiceFiscale(cf: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!cf || cf.length === 0) {
    errors.push('Codice fiscale obbligatorio');
    return { valid: false, errors, warnings };
  }
  
  if (cf.length !== 16) {
    errors.push('Il codice fiscale deve essere di 16 caratteri');
  }
  
  // Formato: 6 lettere + 2 numeri + 1 lettera + 2 numeri + 1 lettera + 3 numeri + 1 lettera
  const regex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
  if (!regex.test(cf)) {
    errors.push('Formato codice fiscale non valido');
  }
  
  // Controllo caratteri non ammessi
  if (/[OBI]/.test(cf.substring(0, 6))) {
    warnings.push('Attenzione: i caratteri O, B, I non sono ammessi nelle prime 6 posizioni');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione Partita IVA
export function validatePartitaIva(piva: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!piva || piva.length === 0) {
    return { valid: true, errors, warnings }; // Opzionale
  }
  
  if (piva.length !== 11) {
    errors.push('La partita IVA deve essere di 11 cifre');
  }
  
  if (!/^\d{11}$/.test(piva)) {
    errors.push('La partita IVA deve contenere solo numeri');
  }
  
  // Algoritmo di validazione (Luhn-like)
  if (piva.length === 11) {
    const digits = piva.split('').map(Number);
    const lastDigit = digits[10];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      let d = digits[i];
      if (i % 2 === 1) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    if (checkDigit !== lastDigit) {
      warnings.push('Il codice di controllo della partita IVA non sembra corretto');
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione CAP italiano
export function validateCAP(cap: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!cap || cap.length === 0) {
    errors.push('CAP obbligatorio');
    return { valid: false, errors, warnings };
  }
  
  if (!/^\d{5}$/.test(cap)) {
    errors.push('Il CAP deve essere di 5 cifre');
  }
  
  const capNum = parseInt(cap);
  if (capNum < 10 || capNum > 99100) {
    warnings.push('Il CAP inserito potrebbe non essere valido');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione Provincia
export function validateProvincia(prov: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const provinceValide = [
    'AG','AL','AN','AO','AP','AQ','AR','AT','AV','BA','BG','BI','BL','BN','BO','BR','BS','BT','BZ',
    'CA','CB','CE','CH','CL','CN','CO','CR','CS','CT','CZ','EN','FC','FE','FG','FI','FM','FR','GE',
    'GO','GR','IM','IS','KR','LC','LE','LI','LO','LT','LU','MB','MC','ME','MI','MN','MO','MS','MT',
    'NA','NO','NU','OR','PA','PC','PD','PE','PG','PI','PN','PO','PR','PT','PU','PV','PZ','RA','RC',
    'RE','RG','RI','RM','RN','RO','SA','SI','SO','SP','SR','SS','SU','SV','TA','TE','TN','TO','TP',
    'TR','TS','TV','UD','VA','VB','VC','VE','VI','VR','VT','VV'
  ];
  
  if (!prov || prov.length === 0) {
    errors.push('Provincia obbligatoria');
    return { valid: false, errors, warnings };
  }
  
  if (prov.length !== 2) {
    errors.push('La provincia deve essere di 2 lettere');
  }
  
  if (!provinceValide.includes(prov.toUpperCase())) {
    errors.push('Sigla provincia non valida');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione parametri impianto elettrico (CEI 64-8)
export function validateImpiantoElettrico(dati: {
  potenza?: number;
  tensione?: number;
  puntiUtilizzazione?: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Potenza
  if (dati.potenza !== undefined) {
    if (dati.potenza <= 0) {
      errors.push('La potenza deve essere maggiore di zero');
    }
    if (dati.potenza > 200) {
      warnings.push('Potenza superiore a 200 kW: verificare se serve progetto di professionista abilitato (art. 5 D.M. 37/08)');
    }
  }
  
  // Tensione
  if (dati.tensione !== undefined) {
    const tensioniStandard = [230, 400, 230/400];
    if (dati.tensione < 50) {
      warnings.push('Tensione molto bassa: verificare se si tratta di impianto SELV/PELV');
    }
    if (dati.tensione > 1000) {
      errors.push('Tensione superiore a 1000V: impianto in media/alta tensione, normativa diversa');
    }
    if (dati.tensione !== 230 && dati.tensione !== 400 && dati.tensione !== 12 && dati.tensione !== 24 && dati.tensione !== 48) {
      warnings.push('Tensione non standard: verificare i valori normali (230V monofase, 400V trifase)');
    }
  }
  
  // Punti di utilizzazione
  if (dati.puntiUtilizzazione !== undefined) {
    if (dati.puntiUtilizzazione <= 0) {
      errors.push('I punti di utilizzazione devono essere maggiori di zero');
    }
    if (dati.puntiUtilizzazione > 400) {
      warnings.push('Numero elevato di punti utilizzazione: verificare se serve progetto (art. 5 D.M. 37/08)');
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione parametri impianto gas (UNI 7129)
export function validateImpiantoGas(dati: {
  portataContatore?: number;
  pressioneProva?: number;
  durataProva?: number;
  cadutaPressione?: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Portata contatore
  if (dati.portataContatore !== undefined) {
    if (dati.portataContatore <= 0) {
      errors.push('La portata del contatore deve essere maggiore di zero');
    }
    const portateStandard = [2.5, 4, 6, 10, 16, 25];
    if (!portateStandard.includes(dati.portataContatore)) {
      warnings.push(`Portata non standard. Valori comuni: ${portateStandard.join(', ')} mc/h`);
    }
  }
  
  // Prova di tenuta
  if (dati.pressioneProva !== undefined) {
    if (dati.pressioneProva < 100 || dati.pressioneProva > 1000) {
      warnings.push('Pressione di prova fuori range tipico (100-1000 mbar secondo UNI 7129)');
    }
  }
  
  if (dati.durataProva !== undefined) {
    if (dati.durataProva < 15) {
      warnings.push('Durata prova inferiori a 15 minuti non conformi alla norma UNI 7129');
    }
  }
  
  if (dati.cadutaPressione !== undefined) {
    if (dati.cadutaPressione > 0) {
      errors.push('Caduta di pressione rilevata: la prova di tenuta NON è superata. Impianto con perdite!');
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione parametri impianto termico (D.P.R. 74/2013)
export function validateImpiantoTermico(dati: {
  potenza?: number;
  rendimento?: number;
  tempFumi?: number;
  co?: number;
  co2?: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Potenza
  if (dati.potenza !== undefined) {
    if (dati.potenza <= 0) {
      errors.push('La potenza deve essere maggiore di zero');
    }
    if (dati.potenza > 35) {
      warnings.push('Potenza superiore a 35 kW: verifica obblighi di manutenzione periodica');
    }
    if (dati.potenza > 100) {
      warnings.push('Potenza superiore a 100 kW: verifica obblighi di terzo responsabile');
    }
  }
  
  // Rendimento
  if (dati.rendimento !== undefined) {
    if (dati.rendimento < 0 || dati.rendimento > 100) {
      errors.push('Il rendimento deve essere compreso tra 0 e 100%');
    }
    if (dati.rendimento < 80) {
      warnings.push('Rendimento inferiore all\'80%: impianto poco efficiente, valutare sostituzione');
    }
    if (dati.rendimento < 70) {
      errors.push('Rendimento inferiore al 70%: impianto non conforme ai requisiti minimi di efficienza');
    }
  }
  
  // Temperatura fumi
  if (dati.tempFumi !== undefined) {
    if (dati.tempFumi < 50) {
      warnings.push('Temperatura fumi molto bassa: possibile condensa nel camino');
    }
    if (dati.tempFumi > 300) {
      warnings.push('Temperatura fumi molto alta: possibile problema di combustione o isolamento');
    }
  }
  
  // CO (Monossido di carbonio)
  if (dati.co !== undefined) {
    if (dati.co > 1000) {
      errors.push('CO superiore a 1000 ppm: PERICOLO! Combustione incompleta, intervento immediato necessario');
    }
    if (dati.co > 500) {
      warnings.push('CO superiore a 500 ppm: verificare combustione e ventilazione');
    }
  }
  
  // CO2
  if (dati.co2 !== undefined) {
    if (dati.co2 < 5 || dati.co2 > 15) {
      warnings.push('CO2 fuori range tipico (8-12% per gas metano)');
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione verifica elettrica (CEI 64-8 Cap. 61)
export function validateVerificaElettrica(dati: {
  resistenzaTerra?: number;
  correnteDifferenziale?: number;
  tempoDifferenziale?: number;
  isolamento?: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Resistenza di terra
  if (dati.resistenzaTerra !== undefined) {
    if (dati.resistenzaTerra <= 0) {
      errors.push('Resistenza di terra deve essere maggiore di zero');
    }
    if (dati.resistenzaTerra > 36) {
      errors.push('Resistenza di terra superiore a 36 Ω: NON conforme (limite per sistemi TT)');
    }
    if (dati.resistenzaTerra > 10) {
      warnings.push('Resistenza di terra superiore a 10 Ω: verificare impianto di terra');
    }
  }
  
  // Corrente differenziale
  if (dati.correnteDifferenziale !== undefined) {
    if (dati.correnteDifferenziale <= 0) {
      errors.push('Corrente di intervento differenziale deve essere maggiore di zero');
    }
    const soglieNormali = [10, 30, 100, 300, 500];
    if (!soglieNormali.includes(dati.correnteDifferenziale)) {
      warnings.push(`Soglia non standard. Valori tipici: ${soglieNormali.join(', ')} mA`);
    }
    if (dati.correnteDifferenziale > 30) {
      warnings.push('Soglia differenziale superiore a 30 mA: verificare protezione contatti diretti');
    }
  }
  
  // Tempo intervento differenziale
  if (dati.tempoDifferenziale !== undefined) {
    if (dati.tempoDifferenziale <= 0) {
      errors.push('Tempo di intervento deve essere maggiore di zero');
    }
    if (dati.tempoDifferenziale > 0.3) {
      errors.push('Tempo di intervento superiore a 300 ms: NON conforme per protezione contatti diretti');
    }
    if (dati.tempoDifferenziale > 0.2) {
      warnings.push('Tempo di intervento superiore a 200 ms: verificare tipo di differenziale');
    }
  }
  
  // Resistenza isolamento
  if (dati.isolamento !== undefined) {
    if (dati.isolamento <= 0) {
      errors.push('Resistenza di isolamento deve essere maggiore di zero');
    }
    if (dati.isolamento < 1) {
      errors.push('Resistenza di isolamento inferiore a 1 MΩ: NON conforme (minimo richiesto)');
    }
    if (dati.isolamento < 100) {
      warnings.push('Resistenza di isolamento inferiore a 100 MΩ: verificare stato isolamento');
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione abilitazione tecnico (art. 3 D.M. 37/08)
export function validateAbilitazioneTecnico(abilitazione: string, tipoImpianto: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!abilitazione || abilitazione.length === 0) {
    errors.push('Abilitazione del tecnico obbligatoria');
    return { valid: false, errors, warnings };
  }
  
  // Mappatura lettere art. 3
  const lettereAbilitazione: Record<string, string[]> = {
    'a': ['elettrico'],
    'b': ['idrico', 'sanitario', 'idrico-sanitario'],
    'c': ['gas'],
    'd': ['riscaldamento', 'climatizzazione'],
    'e': ['antincendio'],
    'f': ['antifurto'],
    'g': ['ascensori', 'montacarichi'],
  };
  
  // Verifica se l'abilitazione è compatibile con il tipo di impianto
  const letteraMatch = abilitazione.toLowerCase().match(/lettera\s*([a-g])/i);
  if (letteraMatch) {
    const lettera = letteraMatch[1];
    const impiantiCompatibili = lettereAbilitazione[lettera] || [];
    const tipoNorm = tipoImpianto.toLowerCase();
    
    if (!impiantiCompatibili.some(imp => tipoNorm.includes(imp))) {
      errors.push(`L'abilitazione lettera ${lettera.toUpperCase()} non è compatibile con impianti ${tipoImpianto}. Verificare la lettera corretta.`);
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione email
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!email || email.length === 0) {
    return { valid: true, errors, warnings }; // Opzionale
  }
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    errors.push('Formato email non valido');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione telefono italiano
export function validateTelefono(tel: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!tel || tel.length === 0) {
    return { valid: true, errors, warnings }; // Opzionale
  }
  
  // Rimuovi spazi e caratteri speciali
  const cleaned = tel.replace(/[\s\-\(\)\.]/g, '');
  
  if (!/^\+?\d{6,15}$/.test(cleaned)) {
    errors.push('Formato telefono non valido');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione completa cliente
export function validateCliente(cliente: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Campi obbligatori
  if (!cliente.nome || cliente.nome.trim().length === 0) errors.push('Nome obbligatorio');
  if (!cliente.cognome || cliente.cognome.trim().length === 0) errors.push('Cognome obbligatorio');
  if (!cliente.indirizzo || cliente.indirizzo.trim().length === 0) errors.push('Indirizzo obbligatorio');
  if (!cliente.citta || cliente.citta.trim().length === 0) errors.push('Città obbligatoria');
  
  // Validazioni specifiche
  const cfValidation = validateCodiceFiscale(cliente.codiceFiscale);
  errors.push(...cfValidation.errors);
  warnings.push(...cfValidation.warnings);
  
  if (cliente.partitaIva) {
    const pivaValidation = validatePartitaIva(cliente.partitaIva);
    errors.push(...pivaValidation.errors);
    warnings.push(...pivaValidation.warnings);
  }
  
  const capValidation = validateCAP(cliente.cap);
  errors.push(...capValidation.errors);
  warnings.push(...capValidation.warnings);
  
  const provValidation = validateProvincia(cliente.provincia);
  errors.push(...provValidation.errors);
  warnings.push(...provValidation.warnings);
  
  if (cliente.email) {
    const emailValidation = validateEmail(cliente.email);
    errors.push(...emailValidation.errors);
    warnings.push(...emailValidation.warnings);
  }
  
  if (cliente.telefono) {
    const telValidation = validateTelefono(cliente.telefono);
    errors.push(...telValidation.errors);
    warnings.push(...telValidation.warnings);
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione parametri impianto F-Gas (DPR 146/2018)
export function validateImpiantoFGas(dati: {
  caricaGas?: number;
  gwp?: number;
  co2Equivalente?: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Carica gas
  if (dati.caricaGas !== undefined) {
    if (dati.caricaGas <= 0) {
      errors.push('La carica di gas deve essere maggiore di zero');
    }
    if (dati.caricaGas >= 3) {
      warnings.push('Carica ≥ 3 kg: obbligo di registrazione e controllo perdite');
    }
    if (dati.caricaGas >= 5) {
      warnings.push('Carica ≥ 5 kg: obblighi rafforzati per impianti non ermetici');
    }
  }
  
  // GWP
  if (dati.gwp !== undefined) {
    if (dati.gwp < 0) {
      errors.push('Il GWP non può essere negativo');
    }
    if (dati.gwp > 2500) {
      warnings.push('GWP molto elevato (> 2500): gas ad alto impatto, verificare limitazioni normative');
    }
  }
  
  // CO2 equivalente
  if (dati.co2Equivalente !== undefined) {
    if (dati.co2Equivalente >= 5) {
      warnings.push('CO2 eq ≥ 5 ton: controllo perdite obbligatorio ogni 12 mesi');
    }
    if (dati.co2Equivalente >= 50) {
      warnings.push('CO2 eq ≥ 50 ton: controllo perdite ogni 6 mesi + detector obbligatorio');
    }
    if (dati.co2Equivalente >= 500) {
      errors.push('CO2 eq ≥ 500 ton: controllo perdite ogni 3 mesi + detector obbligatorio');
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// Validazione conformità impianto a norma
export function checkConformitaImpianto(tipo: string, dati: any): {
  conforme: boolean;
  richiedeProgetto: boolean;
  note: string[];
} {
  const note: string[] = [];
  let conforme = true;
  let richiedeProgetto = false;
  
  if (tipo === 'elettrico') {
    // Art. 5 D.M. 37/08 - Progetto obbligatorio per:
    // - Impianti di potenza superiore a 6 kW
    // - Impianti in condomini con più di 4 unità immobiliari
    // - Impianti con più di 400 punti luce
    if (dati.potenza && dati.potenza > 6) {
      richiedeProgetto = true;
      note.push('Potenza superiore a 6 kW: richiesto progetto di professionista abilitato');
    }
    if (dati.puntiUtilizzazione && dati.puntiUtilizzazione > 400) {
      richiedeProgetto = true;
      note.push('Più di 400 punti utilizzazione: richiesto progetto');
    }
  }
  
  if (tipo === 'gas') {
    // UNI 7129 - Progetto obbligatorio per:
    // - Portata contatore superiore a 10 mc/h
    // - Installazione in locali particolari
    if (dati.portataContatore && dati.portataContatore > 10) {
      richiedeProgetto = true;
      note.push('Portata contatore superiore a 10 mc/h: richiesto progetto');
    }
  }
  
  if (tipo === 'riscaldamento' || tipo === 'climatizzazione') {
    // D.P.R. 412/93 - Progetto per potenze superiori a 35 kW
    if (dati.potenza && dati.potenza > 35) {
      richiedeProgetto = true;
      note.push('Potenza superiore a 35 kW: richiesto progetto e libretto di impianto');
    }
  }
  
  if (tipo === 'fgas') {
    // DPR 146/2018 - Obblighi F-Gas
    if (dati.caricaGas && dati.caricaGas >= 3) {
      note.push('Carica ≥ 3 kg: obbligo registro e controllo perdite (DPR 146/2018)');
    }
    if (dati.co2Equivalente && dati.co2Equivalente >= 5) {
      note.push('CO2 eq ≥ 5 ton: controllo perdite periodico obbligatorio');
    }
    if (dati.co2Equivalente && dati.co2Equivalente >= 50) {
      richiedeProgetto = true;
      note.push('CO2 eq ≥ 50 ton: detector perdite obbligatorio');
    }
  }
  
  return { conforme, richiedeProgetto, note };
}
