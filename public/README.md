# 🔌 Gestione Certificazioni Impianti - Legge 37/2008

Applicazione web completa per la gestione delle certificazioni degli impianti secondo il **D.M. 22 gennaio 2008, n. 37** e successive modifiche.

## ✨ Funzionalità Principali

### 📊 Dashboard
- Statistiche in tempo reale
- Panoramica completa di clienti, impianti e certificati
- Accesso rapido alle funzioni principali

### 👥 Gestione Clienti
- Anagrafica completa con ricerca
- Dati fiscali (Codice Fiscale, Partita IVA)
- Contatti e indirizzi
- Dettaglio e modifica rapida

### 🏗️ Gestione Impianti
- **8 tipologie di impianto supportate:**
  - ⚡ Impianto Elettrico
  - 🚿 Impianto Idrico-Sanitario
  - 🔥 Impianto Gas
  - 🌡️ Impianto Riscaldamento
  - ❄️ Impianto Climatizzazione
  - 🧯 Impianto Antincendio
  - 🛡️ Impianto Antifurto
  - 🔼 Ascensori/Montacarichi
- Caratteristiche tecniche dettagliate
- **Mini CAD integrato** per schemi di impianto

### 📜 Certificati
- **Dichiarazione di Conformità (DiCo)** - Allegato I
- **Dichiarazione di Rispondenza (DiRi)** - Allegato II
- Certificati di verifica e manutenzione
- Stampa in formato conforme alla normativa
- Gestione stati (bozza, emesso, archiviato, scaduto)

### 📋 Schede Tecniche (NUOVO!)
**11 tipi di schede tecniche complete:**

1. **Dichiarazione di Conformità (DiCo)** - D.M. 37/08 Allegato I
2. **Dichiarazione di Rispondenza (DiRi)** - D.M. 37/08 Allegato II
3. **Relazione Tecnica** - D.M. 37/08 art. 5
4. **Progetto Impianto** - D.M. 37/08 art. 5
5. **Registro di Manutenzione** - D.M. 37/08 art. 8
6. **Libretto di Impianto** - D.P.R. 74/2013 - D.Lgs 48/2020
7. **Rapporto di Controllo Efficienza** - D.Lgs 48/2020 Allegato A1-A9
8. **Certificato di Collaudo** - D.M. 37/08
9. **Scheda Verifica Impianto Elettrico** - CEI 64-8 Cap. 61
10. **Scheda Tecnica Impianto Gas** - UNI 7129 / UNI 10683
11. **Dichiarazione Impianto Gas** - UNI 7129 - D.M. 37/08

Ogni scheda include:
- Campi specifici per la tipologia
- Normativa di riferimento
- Stampa in formato conforme
- Gestione stati (bozza, compilata, firmata, archiviata)

### 🎨 Mini CAD - Editor Grafico Impianti (NUOVO!)
Editor grafico integrato per creare schemi di impianto:

**Strumenti disponibili:**
- ✏️ Linea, Rettangolo, Cerchio
- 📝 Testo
- 🔧 Simboli predefiniti
- 🖱️ Selezione e spostamento
- 🔍 Zoom e Pan

**Simboli Elettrici (16):**
- Prese (semplici, doppie)
- Interruttori, Deviatori, Pulsanti
- Punti luce, Applique
- Quadri elettrici
- Differenziali, Magnetotermici
- Scatole derivazione
- Termostati
- Citofoni, Prese TV
- Rilevatori, Sirene

**Simboli Idraulici (13):**
- Rubinetti, Lavabi, WC, Bidet
- Vasche, Piatti doccia
- Lavelli, Lavatrici, Lavastoviglie
- Caldaie, Radiatori
- Valvole, Contatori

**Funzionalità:**
- Griglia di riferimento
- Esportazione PNG
- Salvataggio automatico per impianto
- Colori e spessori personalizzabili

### 👨‍💼 Dati Tecnico
- Configurazione del responsabile tecnico
- Abilitazione art. 3 D.M. 37/08
- Dati anagrafici e professionali
- Compilazione automatica nei certificati

### 💾 Gestione Dati
- Salvataggio automatico nel browser (localStorage)
- Esportazione backup JSON
- Importazione dati da file
- Dati persistenti tra sessioni

## 🚀 Installazione in Locale

### Prerequisiti
- Node.js v18 o superiore
- npm o yarn

### Passaggi

```bash
# 1. Installare le dipendenze
npm install

# 2. Avviare in modalità sviluppo
npm run dev

# 3. Aprire il browser all'indirizzo
# http://localhost:5173

# 4. Per la build di produzione
npm run build
# I file saranno nella cartella dist/
```

### Server per la build di produzione

```bash
# Con Node.js
npx serve dist

# Con Python
python -m http.server 8080 -d dist

# Con PHP
php -S localhost:8080 -t dist
```

## 📜 Riferimenti Normativi

### Leggi e Decreti
- **D.M. 22 gennaio 2008, n. 37** - Norme per la sicurezza degli impianti
- **D.P.R. 74/2013** - Regolamento recante definizione dei criteri generali in materia di esercizio, conduzione, controllo, manutenzione e ispezione degli impianti termici
- **D.Lgs 48/2020** - Attuazione della direttiva 2018/2002/UE sull'efficienza energetica
- **D.Lgs 81/2008** - Testo unico sulla sicurezza sul lavoro

### Norme Tecniche
- **CEI 64-8** - Impianti elettrici utilizzatori a tensione nominale non superiore a 1000 V c.a.
- **CEI 64-50** - Impianti elettrici in edifici residenziali
- **CEI 0-21** - Sistemi attivi di utenza per la connessione in parallelo
- **UNI 7129** - Impianti a gas per uso domestico
- **UNI 10683** - Generatori di calore alimentati a biomassa legnosa
- **UNI EN 12831** - Impianti di riscaldamento

## 🛠️ Tecnologie

- **React 18** - Libreria UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Font Awesome 6** - Icone
- **HTML5 Canvas** - Mini CAD

## 💾 Salvataggio Dati

I dati vengono salvati automaticamente nel **localStorage** del browser:
- Dati principali (clienti, impianti, certificati)
- Schede tecniche
- Schemi CAD per ogni impianto

### Backup e Ripristino
- **Esportare**: Usare il pulsante "Esporta Dati" nella sidebar
- **Importare**: Usare il pulsante "Importa Dati" per ripristinare un backup

> ⚠️ **Attenzione**: I dati sono salvati solo nel browser in uso. Cancellare i dati del browser o cambiare dispositivo comporterà la perdita dei dati se non esportati.

## 📂 Struttura Progetto

```
src/
├── components/
│   ├── Dashboard.tsx          # Dashboard principale
│   ├── ClientiPage.tsx        # Gestione clienti
│   ├── ImpiantiPage.tsx       # Gestione impianti
│   ├── CertificatiPage.tsx    # Lista certificati
│   ├── CertificatoForm.tsx    # Form certificato
│   ├── CertificatoPrint.tsx   # Stampa certificato
│   ├── SchedeTecnichePage.tsx # Gestione schede tecniche
│   ├── SchedaForm.tsx         # Form scheda tecnica
│   ├── SchedaPrint.tsx        # Stampa scheda tecnica
│   ├── MiniCAD.tsx            # Editor grafico CAD
│   ├── TecnicoPage.tsx        # Dati tecnico
│   └── Sidebar.tsx            # Menu laterale
├── types.ts                   # Tipi TypeScript
├── schedeTecniche.ts          # Configurazione schede
├── store.ts                   # Gestione dati
├── App.tsx                    # Componente principale
└── index.css                  # Stili globali
```

## 🎯 Casi d'Uso

### Per Tecnici Installatori
- Creazione DiCo per nuovi impianti
- Registrazione interventi di manutenzione
- Compilazione libretti di impianto
- Disegno schemi elettrici/idraulici

### Per Studi Tecnici
- Gestione portafoglio clienti
- Archiviazione certificazioni
- Stampa documentazione conforme
- Backup dati centralizzato

### Per Amministratori di Condominio
- Registro manutenzioni impianti
- Verifiche periodiche
- Rapporti controllo efficienza
- Archiviazione documentazione

## 📄 Licenza

Applicazione per uso professionale.

## 🤝 Supporto

Per segnalazioni o suggerimenti, consultare la documentazione inline nell'applicazione.

---

**Versione**: 2.0  
**Ultimo aggiornamento**: 2024  
**Conforme a**: D.M. 37/2008 e successive modifiche
