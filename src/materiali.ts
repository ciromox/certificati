// Database Materiali conforme Allegato 1 D.M. 37/08 e successive modifiche
// Organizzato per tipologia impianto e categoria

export interface Materiale {
  id: string;
  categoria: string;
  sottocategoria: string;
  nome: string;
  descrizione: string;
  unitaMisura: string;
  normaRiferimento?: string;
  certificazioneRichiesta?: string;
  impianto: string[]; // Tipologie impianto compatibili
}

// Materiali Impianto Elettrico (CEI 64-8)
export const MATERIALI_ELETTRICO: Materiale[] = [
  // Cavi e Conduttori
  { id: 'e001', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'N07V-K', descrizione: 'Cavo unipolare isolato in PVC per impianti fissi', unitaMisura: 'm', normaRiferimento: 'CEI 20-20', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e002', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'N07VH-H', descrizione: 'Cavo unipolare isolato in PVC flessibile', unitaMisura: 'm', normaRiferimento: 'CEI 20-20', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e003', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'FG16OM16', descrizione: 'Cavo multipolare isolato in gomma antiossidante', unitaMisura: 'm', normaRiferimento: 'CEI 20-22', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e004', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'FROR', descrizione: 'Cavo multipolare isolato in gomma per uso industriale', unitaMisura: 'm', normaRiferimento: 'CEI 20-22', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e005', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'Cavi sezione 1.5mm²', descrizione: 'Conduttore per circuiti illuminazione', unitaMisura: 'm', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  { id: 'e006', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'Cavi sezione 2.5mm²', descrizione: 'Conduttore per circuiti prese', unitaMisura: 'm', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  { id: 'e007', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'Cavi sezione 4mm²', descrizione: 'Conduttore per circuiti potenza', unitaMisura: 'm', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  { id: 'e008', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'Cavi sezione 6mm²', descrizione: 'Conduttore per circuiti cucina/forno', unitaMisura: 'm', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  { id: 'e009', categoria: 'Cavi e Conduttori', sottocategoria: 'Cavi Energia', nome: 'Cavi sezione 10mm²', descrizione: 'Conduttore per linee principali', unitaMisura: 'm', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  
  // Tubi e Canalette
  { id: 'e010', categoria: 'Tubi e Canalette', sottocategoria: 'Tubi', nome: 'Tubo in PVC ø16', descrizione: 'Tubo corrugato in PVC per impianti sottotraccia', unitaMisura: 'm', normaRiferimento: 'CEI 23-29', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e011', categoria: 'Tubi e Canalette', sottocategoria: 'Tubi', nome: 'Tubo in PVC ø20', descrizione: 'Tubo corrugato in PVC diametro 20mm', unitaMisura: 'm', normaRiferimento: 'CEI 23-29', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e012', categoria: 'Tubi e Canalette', sottocategoria: 'Tubi', nome: 'Tubo in PVC ø25', descrizione: 'Tubo corrugato in PVC diametro 25mm', unitaMisura: 'm', normaRiferimento: 'CEI 23-29', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e013', categoria: 'Tubi e Canalette', sottocategoria: 'Canalette', nome: 'Canaletta 40x25', descrizione: 'Canaletta in PVC per posa a vista', unitaMisura: 'm', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  { id: 'e014', categoria: 'Tubi e Canalette', sottocategoria: 'Canalette', nome: 'Canaletta 60x40', descrizione: 'Canaletta in PVC per posa a vista', unitaMisura: 'm', certificazioneRichiesta: 'IMQ', impianto: ['elettrico'] },
  
  // Apparecchi di Manovra e Protezione
  { id: 'e015', categoria: 'Apparecchi Protezione', sottocategoria: 'Interruttori', nome: 'Interruttore Differenziale 30mA', descrizione: 'Salvavita ad alta sensibilità', unitaMisura: 'pz', normaRiferimento: 'CEI EN 61008', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e016', categoria: 'Apparecchi Protezione', sottocategoria: 'Interruttori', nome: 'Interruttore Differenziale 300mA', descrizione: 'Differenziale per protezione incendi', unitaMisura: 'pz', normaRiferimento: 'CEI EN 61008', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e017', categoria: 'Apparecchi Protezione', sottocategoria: 'Interruttori', nome: 'Interruttore Magnetotermico 16A', descrizione: 'Protezione circuiti prese', unitaMisura: 'pz', normaRiferimento: 'CEI EN 60898', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e018', categoria: 'Apparecchi Protezione', sottocategoria: 'Interruttori', nome: 'Interruttore Magnetotermico 10A', descrizione: 'Protezione circuiti illuminazione', unitaMisura: 'pz', normaRiferimento: 'CEI EN 60898', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e019', categoria: 'Apparecchi Protezione', sottocategoria: 'Interruttori', nome: 'Interruttore Magnetotermico 25A', descrizione: 'Protezione circuiti potenza', unitaMisura: 'pz', normaRiferimento: 'CEI EN 60898', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e020', categoria: 'Apparecchi Protezione', sottocategoria: 'Scaricatori', nome: 'Scaricatore Sovratensioni Tipo 2', descrizione: 'Protezione contro sovratensioni', unitaMisura: 'pz', normaRiferimento: 'CEI EN 61643-11', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  
  // Frutti e Placche
  { id: 'e021', categoria: 'Frutti e Placche', sottocategoria: 'Prese', nome: 'Presa 2P+T 16A', descrizione: 'Presa con terra Schuko/Bipasso', unitaMisura: 'pz', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e022', categoria: 'Frutti e Placche', sottocategoria: 'Prese', nome: 'Presa 2P+T 10A', descrizione: 'Presa con terra piccola', unitaMisura: 'pz', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e023', categoria: 'Frutti e Placche', sottocategoria: 'Interruttori', nome: 'Interruttore semplice', descrizione: 'Interruttore unipolare', unitaMisura: 'pz', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e024', categoria: 'Frutti e Placche', sottocategoria: 'Interruttori', nome: 'Deviatore', descrizione: 'Interruttore deviatore', unitaMisura: 'pz', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e025', categoria: 'Frutti e Placche', sottocategoria: 'Interruttori', nome: 'Invertitore', descrizione: 'Interruttore invertitore', unitaMisura: 'pz', certificazioneRichiesta: 'IMQ/CE', impianto: ['elettrico'] },
  { id: 'e026', categoria: 'Frutti e Placche', sottocategoria: 'Placche', nome: 'Placca 1 modulo', descrizione: 'Copertura per frutti', unitaMisura: 'pz', impianto: ['elettrico'] },
  { id: 'e027', categoria: 'Frutti e Placche', sottocategoria: 'Placche', nome: 'Placca 2 moduli', descrizione: 'Copertura doppia', unitaMisura: 'pz', impianto: ['elettrico'] },
  { id: 'e028', categoria: 'Frutti e Placche', sottocategoria: 'Placche', nome: 'Placca 3 moduli', descrizione: 'Copertura tripla', unitaMisura: 'pz', impianto: ['elettrico'] },
  
  // Quadri Elettrici
  { id: 'e029', categoria: 'Quadri Elettrici', sottocategoria: 'Quadri', nome: 'Quadro da incasso 12 moduli', descrizione: 'Quadro distribuzione incasso', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  { id: 'e030', categoria: 'Quadri Elettrici', sottocategoria: 'Quadri', nome: 'Quadro da incasso 24 moduli', descrizione: 'Quadro distribuzione incasso', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  { id: 'e031', categoria: 'Quadri Elettrici', sottocategoria: 'Quadri', nome: 'Quadro da muro 36 moduli', descrizione: 'Quadro distribuzione esterno', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  
  // Illuminazione
  { id: 'e032', categoria: 'Illuminazione', sottocategoria: 'Apparecchi', nome: 'Punto luce plafoniera', descrizione: 'Apparecchio illuminazione soffitto', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  { id: 'e033', categoria: 'Illuminazione', sottocategoria: 'Apparecchi', nome: 'Faretto incasso LED', descrizione: 'Faretto LED da incasso', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  { id: 'e034', categoria: 'Illuminazione', sottocategoria: 'Apparecchi', nome: 'Applique da parete', descrizione: 'Apparecchio illuminazione parete', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['elettrico'] },
  
  // Sistemi di Terra
  { id: 'e035', categoria: 'Sistema Terra', sottocategoria: 'Dispersori', nome: 'Dispersore fondazione', descrizione: 'Conduttore di terra in fondazione', unitaMisura: 'm', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  { id: 'e036', categoria: 'Sistema Terra', sottocategoria: 'Dispersori', nome: 'Picchetto di terra', descrizione: 'Elettrodo di terra in acciaio ramato', unitaMisura: 'pz', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  { id: 'e037', categoria: 'Sistema Terra', sottocategoria: 'Collettori', nome: 'Collettore di terra', descrizione: 'Morsettiera di equipotenzialità', unitaMisura: 'pz', normaRiferimento: 'CEI 64-8', impianto: ['elettrico'] },
  
  // Scatole di Derivazione
  { id: 'e038', categoria: 'Scatole', sottocategoria: 'Derivazione', nome: 'Scatola derivazione 4 moduli', descrizione: 'Scatola per connessioni', unitaMisura: 'pz', impianto: ['elettrico'] },
  { id: 'e039', categoria: 'Scatole', sottocategoria: 'Derivazione', nome: 'Scatola derivazione 6 moduli', descrizione: 'Scatola per connessioni', unitaMisura: 'pz', impianto: ['elettrico'] },
  { id: 'e040', categoria: 'Scatole', sottocategoria: 'Incasso', nome: 'Scatola 503 incasso', descrizione: 'Scatola rettangolare da incasso', unitaMisura: 'pz', impianto: ['elettrico'] },
  { id: 'e041', categoria: 'Scatole', sottocategoria: 'Incasso', nome: 'Scatola rotonda ø60', descrizione: 'Scatola rotonda da incasso', unitaMisura: 'pz', impianto: ['elettrico'] },
];

// Materiali Impianto Gas (UNI 7129)
export const MATERIALI_GAS: Materiale[] = [
  { id: 'g001', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø12', descrizione: 'Tubo in rame per gas', unitaMisura: 'm', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g002', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø15', descrizione: 'Tubo in rame per gas', unitaMisura: 'm', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g003', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø22', descrizione: 'Tubo in rame per gas', unitaMisura: 'm', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g004', categoria: 'Tubazioni', sottocategoria: 'Stratificato', nome: 'Tubo stratificato ø16', descrizione: 'Tubo multistrato per gas', unitaMisura: 'm', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g005', categoria: 'Rubinetteria', sottocategoria: 'Sicurezza', nome: 'Rubinetto a sfera', descrizione: 'Rubinetto intercettazione gas', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g006', categoria: 'Rubinetteria', sottocategoria: 'Sicurezza', nome: 'Valvola di sicurezza', descrizione: 'Valvola di intercettazione automatica', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g007', categoria: 'Rubinetteria', sottocategoria: 'Sicurezza', nome: 'Elettrovalvola', descrizione: 'Valvola gas comandata elettricamente', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g008', categoria: 'Apparecchi Utilizzazione', sottocategoria: 'Cottura', nome: 'Piano cottura 4 fuochi', descrizione: 'Piano cottura a gas', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', certificazioneRichiesta: 'CE', impianto: ['gas'] },
  { id: 'g009', categoria: 'Apparecchi Utilizzazione', sottocategoria: 'Cottura', nome: 'Cucina a gas', descrizione: 'Cucina completa a gas', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', certificazioneRichiesta: 'CE', impianto: ['gas'] },
  { id: 'g010', categoria: 'Apparecchi Utilizzazione', sottocategoria: 'Produzione ACS', nome: 'Scaldabagno a gas 50L', descrizione: 'Scaldacqua istantaneo', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', certificazioneRichiesta: 'CE', impianto: ['gas'] },
  { id: 'g011', categoria: 'Ventilazione', sottocategoria: 'Fori', nome: 'Griglia ventilazione', descrizione: 'Griglia aerazione naturale', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g012', categoria: 'Ventilazione', sottocategoria: 'Fori', nome: 'Griglia aerazione', descrizione: 'Griglia aerazione bassa', unitaMisura: 'pz', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g013', categoria: 'Scarico Fumi', sottocategoria: 'Canne', nome: 'Canna fumaria acciaio inox', descrizione: 'Condotto scarico fumi', unitaMisura: 'm', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g014', categoria: 'Scarico Fumi', sottocategoria: 'Canne', nome: 'Tubo scarico parete', descrizione: 'Scarico fumi a parete', unitaMisura: 'm', normaRiferimento: 'UNI 7129', impianto: ['gas'] },
  { id: 'g015', categoria: 'Sicurezza', sottocategoria: 'Rilevamento', nome: 'Rilevatore gas metano', descrizione: 'Rilevatore fughe gas', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['gas'] },
];

// Materiali Impianto Idrico-Sanitario
export const MATERIALI_IDRICO: Materiale[] = [
  { id: 'i001', categoria: 'Tubazioni Acqua', sottocategoria: 'Rame', nome: 'Tubo rame ø15', descrizione: 'Tubo rame per acqua', unitaMisura: 'm', normaRiferimento: 'UNI EN 806', impianto: ['idrico-sanitario'] },
  { id: 'i002', categoria: 'Tubazioni Acqua', sottocategoria: 'Rame', nome: 'Tubo rame ø18', descrizione: 'Tubo rame per acqua', unitaMisura: 'm', normaRiferimento: 'UNI EN 806', impianto: ['idrico-sanitario'] },
  { id: 'i003', categoria: 'Tubazioni Acqua', sottocategoria: 'Multistrato', nome: 'Tubo multistrato ø16', descrizione: 'Tubo multistrato per acqua', unitaMisura: 'm', normaRiferimento: 'UNI EN 806', impianto: ['idrico-sanitario'] },
  { id: 'i004', categoria: 'Tubazioni Acqua', sottocategoria: 'Multistrato', nome: 'Tubo multistrato ø20', descrizione: 'Tubo multistrato per acqua', unitaMisura: 'm', normaRiferimento: 'UNI EN 806', impianto: ['idrico-sanitario'] },
  { id: 'i005', categoria: 'Tubazioni Scarico', sottocategoria: 'PVC', nome: 'Tubo PVC ø40', descrizione: 'Tubo scarico', unitaMisura: 'm', normaRiferimento: 'UNI EN 12056', impianto: ['idrico-sanitario'] },
  { id: 'i006', categoria: 'Tubazioni Scarico', sottocategoria: 'PVC', nome: 'Tubo PVC ø50', descrizione: 'Tubo scarico', unitaMisura: 'm', normaRiferimento: 'UNI EN 12056', impianto: ['idrico-sanitario'] },
  { id: 'i007', categoria: 'Tubazioni Scarico', sottocategoria: 'PVC', nome: 'Tubo PVC ø110', descrizione: 'Colonna scarico', unitaMisura: 'm', normaRiferimento: 'UNI EN 12056', impianto: ['idrico-sanitario'] },
  { id: 'i008', categoria: 'Sanitari', sottocategoria: 'Bagno', nome: 'Lavabo', descrizione: 'Lavabo con colonna', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i009', categoria: 'Sanitari', sottocategoria: 'Bagno', nome: 'WC sospeso', descrizione: 'Water con cassetta incasso', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i010', categoria: 'Sanitari', sottocategoria: 'Bagno', nome: 'Bidet', descrizione: 'Bidet con piletta', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i011', categoria: 'Sanitari', sottocategoria: 'Bagno', nome: 'Piatto doccia', descrizione: 'Piatto doccia in ceramica', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i012', categoria: 'Sanitari', sottocategoria: 'Bagno', nome: 'Vasca da bagno', descrizione: 'Vasca in acrilico', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i013', categoria: 'Rubinetteria', sottocategoria: 'Miscelatori', nome: 'Rubinetto miscelatore', descrizione: 'Miscelatore monocomando', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i014', categoria: 'Rubinetteria', sottocategoria: 'Valvole', nome: 'Valvola intercettazione', descrizione: 'Rubinetto d\'arresto', unitaMisura: 'pz', impianto: ['idrico-sanitario'] },
  { id: 'i015', categoria: 'Cucina', sottocategoria: 'Lavelli', nome: 'Lavello inox', descrizione: 'Lavello cucina 1 vasca', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i016', categoria: 'Cucina', sottocategoria: 'Lavelli', nome: 'Lavello 2 vasche', descrizione: 'Lavello cucina doppia', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['idrico-sanitario'] },
  { id: 'i017', categoria: 'Isolamento', sottocategoria: 'Tubi', nome: 'Guaina isolante', descrizione: 'Isolamento tubazioni', unitaMisura: 'm', impianto: ['idrico-sanitario'] },
];

// Materiali Impianto Termico
export const MATERIALI_TERMICO: Materiale[] = [
  { id: 't001', categoria: 'Generatori', sottocategoria: 'Caldaie', nome: 'Caldaia a condensazione 24kW', descrizione: 'Caldaia murali a condensazione', unitaMisura: 'pz', normaRiferimento: 'DPR 412/93', certificazioneRichiesta: 'CE', impianto: ['riscaldamento', 'climatizzazione'] },
  { id: 't002', categoria: 'Generatori', sottocategoria: 'Caldaie', nome: 'Caldaia a condensazione 35kW', descrizione: 'Caldaia murali a condensazione', unitaMisura: 'pz', normaRiferimento: 'DPR 412/93', certificazioneRichiesta: 'CE', impianto: ['riscaldamento', 'climatizzazione'] },
  { id: 't003', categoria: 'Generatori', sottocategoria: 'Pompe Calore', nome: 'Pompa di calore aria-acqua', descrizione: 'Pompa di calore elettrica', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['riscaldamento', 'climatizzazione', 'fgas'] },
  { id: 't004', categoria: 'Corpi Scaldanti', sottocategoria: 'Radiatori', nome: 'Radiatore acciaio 600x800', descrizione: 'Termoarredo in acciaio', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['riscaldamento'] },
  { id: 't005', categoria: 'Corpi Scaldanti', sottocategoria: 'Radiatori', nome: 'Radiatore alluminio 600x1000', descrizione: 'Radiatore in alluminio', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['riscaldamento'] },
  { id: 't006', categoria: 'Corpi Scaldanti', sottocategoria: 'Pavimento', nome: 'Tubo pavimento radiante', descrizione: 'Tubo PEX per pavimento', unitaMisura: 'm', impianto: ['riscaldamento'] },
  { id: 't007', categoria: 'Regolazione', sottocategoria: 'Termostati', nome: 'Termostato ambiente', descrizione: 'Termostato programmabile', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['riscaldamento', 'climatizzazione'] },
  { id: 't008', categoria: 'Regolazione', sottocategoria: 'Valvole', nome: 'Valvola termostatica', descrizione: 'Valvola per radiatore', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['riscaldamento'] },
  { id: 't009', categoria: 'Tubazioni', sottocategoria: 'Riscaldamento', nome: 'Tubo rame ø15 riscaldamento', descrizione: 'Tubo per impianto termico', unitaMisura: 'm', impianto: ['riscaldamento'] },
  { id: 't010', categoria: 'Tubazioni', sottocategoria: 'Riscaldamento', nome: 'Tubo multistrato ø20', descrizione: 'Tubo per impianto termico', unitaMisura: 'm', impianto: ['riscaldamento'] },
  { id: 't011', categoria: 'Isolamento', sottocategoria: 'Tubi', nome: 'Guaina isolante ø20', descrizione: 'Isolamento tubazioni', unitaMisura: 'm', impianto: ['riscaldamento'] },
];

// Materiali Impianto F-Gas
export const MATERIALI_FGAS: Materiale[] = [
  { id: 'f001', categoria: 'Unità', sottocategoria: 'Esterne', nome: 'Unità esterna split 2.5kW', descrizione: 'Motore condensante monosplit', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f002', categoria: 'Unità', sottocategoria: 'Esterne', nome: 'Unità esterna split 3.5kW', descrizione: 'Motore condensante monosplit', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f003', categoria: 'Unità', sottocategoria: 'Esterne', nome: 'Unità esterna multisplit', descrizione: 'Motore multisplit', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f004', categoria: 'Unità', sottocategoria: 'Interne', nome: 'Unità interna split a parete', descrizione: 'Evaporatore split', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f005', categoria: 'Unità', sottocategoria: 'Interne', nome: 'Unità interna canalizzabile', descrizione: 'Evaporatore canalizzabile', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f006', categoria: 'Unità', sottocategoria: 'Interne', nome: 'Unità interna a cassetta', descrizione: 'Evaporatore a cassetta', unitaMisura: 'pz', certificazioneRichiesta: 'CE', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f007', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø3/8" linea liquido', descrizione: 'Tubo linea liquido', unitaMisura: 'm', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f008', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø5/8" linea gas', descrizione: 'Tubo linea gas', unitaMisura: 'm', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f009', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø1/2" linea liquido', descrizione: 'Tubo linea liquido', unitaMisura: 'm', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f010', categoria: 'Tubazioni', sottocategoria: 'Rame', nome: 'Tubo rame ø3/4" linea gas', descrizione: 'Tubo linea gas', unitaMisura: 'm', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f011', categoria: 'Gas Refrigerante', sottocategoria: 'R32', nome: 'Gas R32', descrizione: 'Refrigerante R32 (GWP 675)', unitaMisura: 'kg', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f012', categoria: 'Gas Refrigerante', sottocategoria: 'R410A', nome: 'Gas R410A', descrizione: 'Refrigerante R410A (GWP 2088)', unitaMisura: 'kg', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f013', categoria: 'Componenti', sottocategoria: 'Valvole', nome: 'Valvola di espansione', descrizione: 'Valvola termostatica', unitaMisura: 'pz', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f014', categoria: 'Componenti', sottocategoria: 'Filtri', nome: 'Filtro disidratatore', descrizione: 'Filtro per circuito frigo', unitaMisura: 'pz', impianto: ['fgas', 'climatizzazione'] },
  { id: 'f015', categoria: 'Isolamento', sottocategoria: 'Tubi', nome: 'Guaina isolante tubo frigo', descrizione: 'Isolamento tubazioni frigorifere', unitaMisura: 'm', impianto: ['fgas', 'climatizzazione'] },
];

// Esporta tutti i materiali
export const TUTTI_MATERIALI: Materiale[] = [
  ...MATERIALI_ELETTRICO,
  ...MATERIALI_GAS,
  ...MATERIALI_IDRICO,
  ...MATERIALI_TERMICO,
  ...MATERIALI_FGAS,
];

// Funzione per filtrare materiali per impianto
export function getMaterialiByImpianto(tipoImpianto: string): Materiale[] {
  return TUTTI_MATERIALI.filter(m => m.impianto.includes(tipoImpianto));
}

// Funzione per cercare materiali
export function searchMateriali(query: string, tipoImpianto?: string): Materiale[] {
  const normalizedQuery = query.toLowerCase();
  let materiali = TUTTI_MATERIALI;
  
  if (tipoImpianto) {
    materiali = materiali.filter(m => m.impianto.includes(tipoImpianto));
  }
  
  return materiali.filter(m => 
    m.nome.toLowerCase().includes(normalizedQuery) ||
    m.descrizione.toLowerCase().includes(normalizedQuery) ||
    m.categoria.toLowerCase().includes(normalizedQuery)
  );
}
