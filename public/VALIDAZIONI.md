# 🔒 Sistema di Validazione e Conformità

## Panoramica

L'applicazione include un sistema completo di validazione conforme al **D.M. 37/2008** e alle normative tecniche italiane (CEI, UNI).

## 📋 Validazioni Implementate

### 1. Validazione Dati Anagrafici

#### Codice Fiscale
- ✅ Controllo lunghezza (16 caratteri)
- ✅ Verifica formato alfanumerico
- ✅ Controllo caratteri non ammessi (O, B, I)
- ✅ Validazione algoritmo

#### Partita IVA
- ✅ Controllo lunghezza (11 cifre)
- ✅ Verifica solo numeri
- ✅ Algoritmo di validazione (Luhn-like)
- ✅ Controllo codice di controllo

#### CAP
- ✅ Controllo 5 cifre
- ✅ Range valido (00010-99100)
- ✅ Verifica formato numerico

#### Provincia
- ✅ Controllo 2 lettere
- ✅ Verifica contro lista ufficiale 107 province italiane
- ✅ Conversione automatica in maiuscolo

#### Email
- ✅ Validazione formato RFC
- ✅ Controllo dominio

#### Telefono
- ✅ Validazione formato italiano
- ✅ Supporto prefisso internazionale
- ✅ Controllo lunghezza (6-15 cifre)

### 2. Validazione Parametri Tecnici Impianti

#### Impianto Elettrico (CEI 64-8)
- ✅ **Potenza**: verifica valori standard (3-6 kW abitazioni)
- ✅ **Tensione**: controllo valori standard (230V, 400V, SELV)
- ✅ **Punti utilizzazione**: verifica soglia 400 (progetto obbligatorio)
- ✅ **Art. 5 D.M. 37/08**: avviso progetto obbligatorio per:
  - Potenza > 6 kW
  - Punti utilizzazione > 400

#### Impianto Gas (UNI 7129)
- ✅ **Portata contatore**: verifica valori standard (G4-G40)
- ✅ **Pressione prova tenuta**: range 100-1000 mbar
- ✅ **Durata prova**: minimo 15 minuti
- ✅ **Caduta pressione**: controllo perdite (deve essere 0)
- ✅ **Art. 5 D.M. 37/08**: avviso progetto per portata > 10 mc/h

#### Impianto Termico (D.P.R. 74/2013)
- ✅ **Potenza termica**: verifica soglie (35 kW, 100 kW)
- ✅ **Rendimento**: controllo minimo 70% (conforme), 80% (efficiente)
- ✅ **Temperatura fumi**: range tipico 50-300°C
- ✅ **CO (Monossido)**: allarme > 1000 ppm, avviso > 500 ppm
- ✅ **CO2**: range tipico 8-12% per metano
- ✅ **Libretto impianto**: obbligatorio per potenza > 35 kW

#### Verifica Elettrica (CEI 64-8 Cap. 61)
- ✅ **Resistenza terra**: massimo 36 Ω (sistemi TT)
- ✅ **Corrente differenziale**: verifica soglie standard (10-500 mA)
- ✅ **Tempo intervento**: massimo 300 ms (contatti diretti)
- ✅ **Resistenza isolamento**: minimo 1 MΩ (conforme), 100 MΩ (ottimale)

### 3. Validazione Abilitazione Tecnico

#### Art. 3 D.M. 37/08
- ✅ **Verifica lettera abilitazione** compatibile con tipo impianto:
  - a) → impianti elettrici
  - b) → impianti idrico-sanitari
  - c) → impianti gas
  - d) → riscaldamento, climatizzazione
  - e) → antincendio
  - f) → antifurto
  - g) → ascensori, montacarichi
- ✅ **Controllo formato** abilitazione
- ✅ **Avviso incompatibilità** tecnico/impianto

### 4. Validazione Certificati

#### Dichiarazione di Conformità (DiCo)
- ✅ Tecnico responsabile obbligatorio
- ✅ Abilitazione tecnico obbligatoria
- ✅ Verifica compatibilità abilitazione/tipo impianto
- ✅ Descrizione lavori minima 50 caratteri
- ✅ Materiali utilizzati obbligatori
- ✅ Norme di riferimento obbligatorie

#### Dichiarazione di Rispondenza (DiRi)
- ✅ Verifiche effettuate dettagliate (minimo 20 caratteri)
- ✅ Stato impianto documentato
- ✅ Norme applicate

#### Schede Tecniche
- ✅ Campi obbligatori specifici per tipologia
- ✅ Verifica completezza dati prima della firma
- ✅ Controllo stato (bozza → compilata → firmata)

### 5. Verifica Conformità Sistema

#### Dashboard
- ✅ **Pannello verifica conformità** con 4 indicatori:
  - Dati tecnico configurati
  - Clienti registrati
  - Impianti registrati
  - Certificati emessi
- ✅ **Avvisi automatici**:
  - Certificati scaduti
  - Certificati in bozza
  - Scadenze imminenti (30 giorni)

#### Pagina Certificati
- ✅ **Indicatore validità** per ogni certificato:
  - Scaduto (rosso)
  - In scadenza ≤ 30 giorni (ambra)
  - Valido (verde)
- ✅ **Calcolo giorni** alla scadenza
- ✅ **Filtro per stato** e validità

#### Pagina Schede Tecniche
- ✅ **Pannello stato conformità**:
  - Da completare (giallo)
  - Da firmare (blu)
  - Conformi (verde)
  - Archiviate (grigio)
- ✅ **Avviso schede in bozza**

### 6. Verifica Pre-Salvataggio

#### Form Clienti
- ✅ Validazione in tempo reale di tutti i campi
- ✅ Feedback visivo (bordi rossi/ambra)
- ✅ Messaggi di errore specifici
- ✅ Blocco salvataggio se errori critici

#### Form Impianti
- ✅ Validazione parametri tecnici
- ✅ Avviso progetto obbligatorio
- ✅ Messaggi normativi contestuali
- ✅ Suggerimenti valori standard

#### Form Certificati
- ✅ **Checklist conformità** prima del salvataggio
- ✅ Verifica campi obbligatori
- ✅ Controllo compatibilità tecnico/impianto
- ✅ Conferma con lista problemi rilevati
- ✅ Possibilità di procedere comunque (con warning)

#### Form Schede Tecniche
- ✅ **Verifica conformità specifica** per tipo scheda
- ✅ Controllo campi obbligatori per normativa
- ✅ Avviso dati insufficienti per firma
- ✅ Conferma con lista problemi

## 🎨 Interfaccia Utente

### Feedback Visivo
- ✅ **Bordi colorati**: rosso (errore), ambra (avviso), verde (ok)
- ✅ **Icone di stato**: check, warning, error
- ✅ **Badge di validità**: valido, con avvisi, non valido
- ✅ **Messaggi contestuali**: sotto ogni campo

### Tooltip Informativi
- ✅ **InfoTooltip**: informazioni normative al passaggio del mouse
- ✅ **HelperText**: suggerimenti sotto i campi
- ✅ **NormativaRef**: riferimenti normativi inline

### Pannelli di Verifica
- ✅ **Dashboard**: panoramica conformità sistema
- ✅ **Certificati**: stato validità
- ✅ **Schede Tecniche**: stato compilazione
- ✅ **Form**: checklist pre-salvataggio

## 📜 Riferimenti Normativi

### Leggi e Decreti
- **D.M. 22 gennaio 2008, n. 37** - Norme per la sicurezza degli impianti
- **D.P.R. 74/2013** - Impianti termici
- **D.Lgs 48/2020** - Efficienza energetica
- **D.Lgs 81/2008** - Sicurezza sul lavoro

### Norme Tecniche
- **CEI 64-8** - Impianti elettrici utilizzatori
- **CEI 64-50** - Impianti elettrici residenziali
- **UNI 7129** - Impianti gas domestici
- **UNI 10683** - Generatori biomassa
- **UNI EN 12831** - Impianti riscaldamento

### Requisiti Professionali
- **Art. 3 D.M. 37/08** - Abilitazioni tecnico
- **Art. 5 D.M. 37/08** - Obbligo progetto
- **Art. 7 D.M. 37/08** - Responsabilità tecnico
- **Art. 10 D.M. 37/08** - Responsabilità penale
- **Art. 13 D.M. 37/08** - Sanzioni

## 🔐 Sicurezza e Privacy

### GDPR
- ✅ Dati salvati solo nel browser (localStorage)
- ✅ Nessun invio a server esterni
- ✅ Possibilità esportazione/backup
- ✅ Informativa privacy integrata

### Responsabilità
- ✅ Disclaimer legale integrato
- ✅ Avvisi responsabilità tecnico
- ✅ Riferimenti sanzioni
- ✅ Conferma operazioni critiche

## 📊 Statistiche Validazione

### Controlli Automatici
- **11 tipi** di validazione dati anagrafici
- **4 categorie** di validazione tecnica impianti
- **7 lettere** abilitazione tecnico
- **11 tipi** di schede tecniche
- **4 stati** conformità certificati
- **100+** regole di validazione implementate

### Messaggi Utente
- **Errori critici** (blocco salvataggio)
- **Avvisi** (procedere con cautela)
- **Suggerimenti** (miglioramenti)
- **Informazioni** (riferimenti normativi)

---

**Versione**: 2.0  
**Ultimo aggiornamento**: 2024  
**Conforme a**: D.M. 37/2008 e successive modifiche
