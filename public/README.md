# Gestione Certificazioni Impianti - Legge 37/2008

Applicazione web completa per la gestione delle certificazioni degli impianti secondo il **D.M. 22 gennaio 2008, n. 37**.

## 📋 Funzionalità

- **Dashboard** con statistiche e panoramica
- **Gestione Clienti** - Anagrafica completa con ricerca
- **Gestione Impianti** - 8 tipologie di impianto supportate
- **Certificati** - Creazione DiCo, DiRi, Verifiche e Manutenzioni
- **Stampa Certificati** - Formato conforme alla normativa
- **Esporta/Importa Dati** - Backup e ripristino in JSON
- **Dati Tecnico** - Configurazione del responsabile tecnico
- **Salvataggio Locale** - Dati persistenti nel browser

## 🏗️ Tipologie Impianto Supportate

1. ⚡ Impianto Elettrico
2. 🚿 Impianto Idrico-Sanitario
3. 🔥 Impianto Gas
4. 🌡️ Impianto Riscaldamento
5. ❄️ Impianto Climatizzazione
6. 🧯 Impianto Antincendio
7. 🛡️ Impianto Antifurto
8. 🔼 Ascensori/Montacarichi

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

## 💾 Salvataggio Dati

I dati vengono salvati automaticamente nel **localStorage** del browser.

- **Esportare**: Usare il pulsante "Esporta Dati" nella sidebar per creare un backup JSON
- **Importare**: Usare il pulsante "Importa Dati" per ripristinare un backup

> ⚠️ **Attenzione**: I dati sono salvati solo nel browser in uso. Cancellare i dati del browser o cambiare dispositivo comporterà la perdita dei dati se non esportati.

## 📜 Riferimenti Normativi

- **D.M. 22 gennaio 2008, n. 37** - Norme per la sicurezza degli impianti
- **CEI 64-8** - Impianti elettrici utilizzatori
- **UNI 7129** - Impianti a gas per uso domestico
- **UNI 10683** - Generatori di calore alimentati a biomassa legnosa

## 🛠️ Tecnologie

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Font Awesome 6

## 📄 Licenza

Applicazione per uso professionale.
