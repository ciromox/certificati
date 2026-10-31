import { useState } from 'react';
import { Certificato, Cliente, Impianto, Tecnico, TipoCertificato } from '../types';
import { generateNumeroCertificato } from '../store';

interface CertificatoFormMinisterialeProps {
  clienti: Cliente[];
  impianti: Impianto[];
  tecnico: Tecnico | null;
  certificati: Certificato[];
  editingCertificato: Certificato | null;
  onSave: (certificato: any) => void;
  onCancel: () => void;
}

export default function CertificatoFormMinisteriale({
  clienti,
  impianti,
  tecnico,
  certificati,
  editingCertificato,
  onSave,
  onCancel
}: CertificatoFormMinisterialeProps) {
  const [form, setForm] = useState<any>(editingCertificato || {
    numero: generateNumeroCertificato('DiCo', certificati),
    tipo: 'DiCo' as TipoCertificato,
    dataRilascio: new Date().toISOString().split('T')[0],
    stato: 'bozza',
    
    // Dati Dichiarante
    dichiaranteNome: tecnico?.nome || '',
    dichiaranteCognome: tecnico?.cognome || '',
    dichiaranteRuolo: 'titolare',
    impresaRagioneSociale: tecnico?.azienda || '',
    impresaSettore: '',
    impresaSedeLegaleIndirizzo: tecnico?.indirizzo || '',
    impresaSedeLegaleNumero: '',
    impresaSedeLegaleComune: tecnico?.citta || '',
    impresaSedeLegaleProvincia: tecnico?.provincia || '',
    impresaSedeLegaleCAP: tecnico?.cap || '',
    impresaPartitaIVA: tecnico?.partitaIva || '',
    impresaCodiceFiscale: tecnico?.codiceFiscale || '',
    impresaIscrizioneCCIAA: '',
    impresaIscrizioneCCIAANumero: '',
    impresaIscrizioneAlboArtigiani: '',
    impresaIscrizioneAlboArtigianiNumero: '',
    
    // Dati Impianto
    impiantoId: '',
    clienteId: '',
    descrizioneImpianto: '',
    tipoIntervento: 'nuovo',
    
    // Dati Committente
    committenteNome: '',
    committenteCognome: '',
    committenteRagioneSociale: '',
    
    // Dati Ubicazione
    ubicazioneComune: '',
    ubicazioneProvincia: '',
    ubicazioneIndirizzo: '',
    ubicazioneNumero: '',
    
    // Dati Proprietario
    proprietarioNome: '',
    proprietarioCognome: '',
    proprietarioRagioneSociale: '',
    
    // Dati Edificio
    usoEdificio: 'civile',
    
    // Dichiarazione
    rispettatoProgetto: true,
    seguitoNormativaTecnica: true,
    installatoComponentiRegolaArte: true,
    controllatoImpiantoSicurezza: true,
    
    // Allegati
    allegatoProgetto: true,
    allegatoRelazioneMateriali: true,
    allegatoSchemaImpianto: true,
    allegatoDichiarazioniPrecedenti: false,
    allegatoCertificatoRequisiti: true,
    
    // Dati Tecnici
    descrizioneLavoro: '',
    materialiUtilizzati: [],
    verificheEffettuate: '',
    conformitaNorme: [],
    tecnicoResponsabile: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
    abilitazioneTecnico: tecnico?.abilitazione || '',
    firmaTecnico: tecnico ? `${tecnico.nome} ${tecnico.cognome}` : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const updateField = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {editingCertificato ? 'Modifica Dichiarazione di Conformità' : 'Nuova Dichiarazione di Conformità'}
          </h1>
          <p className="text-gray-500 mt-1">Modello conforme D.M. 37/08 - Allegato I</p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEZIONE 1: DATI DICHIARANTE (DITTA INSTALLATRICE) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-building text-blue-500"></i>
            Sezione A - Dati Dichiarante (Ditta Installatrice)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Dichiarante *</label>
              <input required type="text" value={form.dichiaranteNome} onChange={e => updateField('dichiaranteNome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cognome Dichiarante *</label>
              <input required type="text" value={form.dichiaranteCognome} onChange={e => updateField('dichiaranteCognome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo *</label>
              <select required value={form.dichiaranteRuolo} onChange={e => updateField('dichiaranteRuolo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="titolare">Titolare</option>
                <option value="legale_rappresentante">Legale Rappresentante</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale Impresa *</label>
              <input required type="text" value={form.impresaRagioneSociale} onChange={e => updateField('impresaRagioneSociale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Settore di Attività *</label>
              <input required type="text" value={form.impresaSettore} onChange={e => updateField('impresaSettore', e.target.value)}
                placeholder="Es: Impianti elettrici, Impianti gas, ecc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo Sede Legale *</label>
              <input required type="text" value={form.impresaSedeLegaleIndirizzo} onChange={e => updateField('impresaSedeLegaleIndirizzo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero Civico *</label>
              <input required type="text" value={form.impresaSedeLegaleNumero} onChange={e => updateField('impresaSedeLegaleNumero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comune *</label>
              <input required type="text" value={form.impresaSedeLegaleComune} onChange={e => updateField('impresaSedeLegaleComune', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
              <input required type="text" maxLength={2} value={form.impresaSedeLegaleProvincia} onChange={e => updateField('impresaSedeLegaleProvincia', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
              <input required type="text" maxLength={5} value={form.impresaSedeLegaleCAP} onChange={e => updateField('impresaSedeLegaleCAP', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA *</label>
              <input required type="text" value={form.impresaPartitaIVA} onChange={e => updateField('impresaPartitaIVA', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale</label>
              <input type="text" value={form.impresaCodiceFiscale} onChange={e => updateField('impresaCodiceFiscale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="font-semibold text-gray-700 mb-3">Iscrizioni</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CCIAA</label>
              <input type="text" value={form.impresaIscrizioneCCIAA} onChange={e => updateField('impresaIscrizioneCCIAA', e.target.value)}
                placeholder="Camera di Commercio"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero Iscrizione CCIAA</label>
              <input type="text" value={form.impresaIscrizioneCCIAANumero} onChange={e => updateField('impresaIscrizioneCCIAANumero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Albo Artigiani</label>
              <input type="text" value={form.impresaIscrizioneAlboArtigiani} onChange={e => updateField('impresaIscrizioneAlboArtigiani', e.target.value)}
                placeholder="Albo Provinciale Artigiani"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero Iscrizione Albo</label>
              <input type="text" value={form.impresaIscrizioneAlboArtigianiNumero} onChange={e => updateField('impresaIscrizioneAlboArtigianiNumero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* SEZIONE 2: DATI IMPIANTO */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-cogs text-green-500"></i>
            Sezione B - Dati Impianto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione Schematica Impianto *</label>
              <input required type="text" value={form.descrizioneImpianto} onChange={e => updateField('descrizioneImpianto', e.target.value)}
                placeholder="Es: Impianto elettrico civile, Impianto gas domestico, ecc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Intervento *</label>
              <select required value={form.tipoIntervento} onChange={e => updateField('tipoIntervento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="nuovo">Nuovo Impianto</option>
                <option value="trasformazione">Trasformazione</option>
                <option value="ampliamento">Ampliamento</option>
                <option value="manutenzione_straordinaria">Manutenzione Straordinaria</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Committente *</label>
              <select required value={form.clienteId} onChange={e => updateField('clienteId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Seleziona committente...</option>
                {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}{c.ragioneSociale ? ` (${c.ragioneSociale})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impianto *</label>
              <select required value={form.impiantoId} onChange={e => updateField('impiantoId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!form.clienteId}>
                <option value="">Seleziona impianto...</option>
                {impianti.filter(i => i.clienteId === form.clienteId).map(i => <option key={i.id} value={i.id}>{i.tipologia} - {i.citta}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SEZIONE 3: UBICAZIONE */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-map-marker-alt text-red-500"></i>
            Sezione C - Ubicazione Impianto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comune *</label>
              <input required type="text" value={form.ubicazioneComune} onChange={e => updateField('ubicazioneComune', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
              <input required type="text" maxLength={2} value={form.ubicazioneProvincia} onChange={e => updateField('ubicazioneProvincia', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
              <input required type="text" value={form.ubicazioneIndirizzo} onChange={e => updateField('ubicazioneIndirizzo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero Civico *</label>
              <input required type="text" value={form.ubicazioneNumero} onChange={e => updateField('ubicazioneNumero', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uso Edificio *</label>
              <select required value={form.usoEdificio} onChange={e => updateField('usoEdificio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="civile">Civile</option>
                <option value="industriale">Industriale</option>
                <option value="commercio">Commercio</option>
                <option value="altri_usi">Altri Usi</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEZIONE 4: DICHIARAZIONE */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-check-circle text-purple-500"></i>
            Sezione D - Dichiarazione di Conformità
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.rispettatoProgetto} onChange={e => updateField('rispettatoProgetto', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Ho rispettato il progetto redatto ai sensi dell'art. 5</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.seguitoNormativaTecnica} onChange={e => updateField('seguitoNormativaTecnica', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Ho seguito la normativa tecnica applicabile all'impiego</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.installatoComponentiRegolaArte} onChange={e => updateField('installatoComponentiRegolaArte', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Ho installato componenti e materiali costruiti a regola d'arte</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.controllatoImpiantoSicurezza} onChange={e => updateField('controllatoImpiantoSicurezza', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Ho controllato l'impianto ai fini della sicurezza e funzionalità con esito positivo</span>
            </label>
          </div>
        </div>

        {/* SEZIONE 5: ALLEGATI */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-paperclip text-orange-500"></i>
            Sezione E - Allegati Obbligatori
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.allegatoProgetto} onChange={e => updateField('allegatoProgetto', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Progetto ai sensi degli articoli 5 e 7 del D.M. n. 37/2008</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.allegatoRelazioneMateriali} onChange={e => updateField('allegatoRelazioneMateriali', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Relazione con tipologie dei materiali utilizzati</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.allegatoSchemaImpianto} onChange={e => updateField('allegatoSchemaImpianto', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Schema di impianto realizzato</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.allegatoDichiarazioniPrecedenti} onChange={e => updateField('allegatoDichiarazioniPrecedenti', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Riferimento a dichiarazioni di conformità precedenti o parziali</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.allegatoCertificatoRequisiti} onChange={e => updateField('allegatoCertificatoRequisiti', e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Copia del certificato di riconoscimento dei requisiti tecnico-professionali</span>
            </label>
          </div>
        </div>

        {/* SEZIONE 6: DATI TECNICI */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-user-tie text-teal-500"></i>
            Sezione F - Tecnico Responsabile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tecnico Responsabile *</label>
              <input required type="text" value={form.tecnicoResponsabile} onChange={e => updateField('tecnicoResponsabile', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abilitazione *</label>
              <input required type="text" value={form.abilitazioneTecnico} onChange={e => updateField('abilitazioneTecnico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma Tecnico *</label>
              <input required type="text" value={form.firmaTecnico} onChange={e => updateField('firmaTecnico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg transition">
            Annulla
          </button>
          <button type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg shadow-blue-200">
            <i className="fas fa-save mr-2"></i>
            {editingCertificato ? 'Aggiorna Certificato' : 'Salva Certificato'}
          </button>
        </div>
      </form>
    </div>
  );
}
