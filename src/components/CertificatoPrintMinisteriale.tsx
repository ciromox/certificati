import { Certificato, Cliente, Impianto, Tecnico } from '../types';

interface CertificatoPrintMinisterialeProps {
  certificato: Certificato;
  cliente?: Cliente;
  impianto?: Impianto;
  tecnico: Tecnico | null;
  onBack: () => void;
}

export default function CertificatoPrintMinisteriale({ 
  certificato, 
  cliente, 
  impianto, 
  tecnico, 
  onBack 
}: CertificatoPrintMinisterialeProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const getTipoInterventoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'nuovo': 'nuovo impianto',
      'trasformazione': 'trasformazione',
      'ampliamento': 'ampliamento',
      'manutenzione_straordinaria': 'manutenzione straordinaria',
      'altro': 'Altro'
    };
    return labels[tipo] || tipo;
  };

  const getUsoEdificioLabel = (uso: string) => {
    const labels: Record<string, string> = {
      'industriale': 'industriale',
      'civile': 'civile',
      'commercio': 'commercio',
      'altri_usi': 'altri usi'
    };
    return labels[uso] || uso;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <i className="fas fa-arrow-left"></i>
          <span>Torna ai certificati</span>
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg shadow-blue-200">
          <i className="fas fa-print"></i>
          <span>Stampa Certificato</span>
        </button>
      </div>

      {/* PAGINA 1 - DICHIARAZIONE PRINCIPALE */}
      <div id="certificato-page1" className="bg-white shadow-lg border border-gray-300 p-8 md:p-12 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 page-break">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-xl font-bold mb-2">DICHIARAZIONE DI CONFORMITÀ DELL'IMPIANTO ALLA REGOLA DELL'ARTE</h1>
          <p className="text-sm">(art. 7 del D.M. n. 37 del 22 gennaio 2008)</p>
        </div>

        {/* DATI DICHIARANTE */}
        <div className="mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 font-semibold w-1/3">Il/La sottoscritto/a</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.dichiaranteNome || ''} {certificato.dichiaranteCognome || ''}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">titolare/legale rappresentante dell'impresa</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.impresaRagioneSociale || ''}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">operante nel settore</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.impresaSettore || ''}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">con sede legale in</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.impresaSedeLegaleIndirizzo || ''} n. {certificato.impresaSedeLegaleNumero || ''}, {certificato.impresaSedeLegaleComune || ''} ({certificato.impresaSedeLegaleProvincia || ''}) CAP {certificato.impresaSedeLegaleCAP || ''}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">P. IVA</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.impresaPartitaIVA || ''}
                </td>
              </tr>
              {certificato.impresaIscrizioneCCIAA && (
                <tr>
                  <td className="py-2 font-semibold">☐ iscritta nel Registro imprese della CCIAA di</td>
                  <td className="py-2 border-b border-gray-400">
                    {certificato.impresaIscrizioneCCIAA} n. {certificato.impresaIscrizioneCCIAANumero}
                  </td>
                </tr>
              )}
              {certificato.impresaIscrizioneAlboArtigiani && (
                <tr>
                  <td className="py-2 font-semibold">☐ iscritta all'Albo Provinciale delle imprese artigiane di</td>
                  <td className="py-2 border-b border-gray-400">
                    {certificato.impresaIscrizioneAlboArtigiani} n. {certificato.impresaIscrizioneAlboArtigianiNumero}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DATI IMPIANTO */}
        <div className="mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 font-semibold w-1/3">esecutrice dell'impianto</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.descrizioneImpianto || ''}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">inteso come</td>
                <td className="py-2 border-b border-gray-400">
                  ☐ {getTipoInterventoLabel(certificato.tipoIntervento || '')}
                  {certificato.tipoIntervento === 'altro' && certificato.tipoInterventoAltro && ` (${certificato.tipoInterventoAltro})`}
                </td>
              </tr>
              {certificato.tipoGasDistribuito && (
                <tr>
                  <td className="py-2 font-semibold">tipo di gas distribuito</td>
                  <td className="py-2 border-b border-gray-400">
                    {certificato.tipoGasDistribuito}
                  </td>
                </tr>
              )}
              {certificato.potenzaMassimaImpegnabile && (
                <tr>
                  <td className="py-2 font-semibold">potenza massima impegnabile</td>
                  <td className="py-2 border-b border-gray-400">
                    {certificato.potenzaMassimaImpegnabile} kW
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-2 font-semibold">commissionato da</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.committenteNome || ''} {certificato.committenteCognome || ''} {certificato.committenteRagioneSociale || ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* UBICAZIONE IMPIANTO */}
        <div className="mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 font-semibold w-1/3">installato nei locali siti nel comune di</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.ubicazioneComune || ''} ({certificato.ubicazioneProvincia || ''})
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">indirizzo</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.ubicazioneIndirizzo || ''} n. {certificato.ubicazioneNumero || ''}
                  {certificato.ubicazioneScala && ` scala ${certificato.ubicazioneScala}`}
                  {certificato.ubicazionePiano && ` piano ${certificato.ubicazionePiano}`}
                  {certificato.ubicazioneInterno && ` int. ${certificato.ubicazioneInterno}`}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">di proprietà di</td>
                <td className="py-2 border-b border-gray-400">
                  {certificato.proprietarioNome || ''} {certificato.proprietarioCognome || ''} {certificato.proprietarioRagioneSociale || ''}
                </td>
              </tr>
              {certificato.proprietarioComune && (
                <tr>
                  <td className="py-2 font-semibold">comune</td>
                  <td className="py-2 border-b border-gray-400">
                    {certificato.proprietarioComune}
                  </td>
                </tr>
              )}
              {certificato.proprietarioIndirizzo && (
                <tr>
                  <td className="py-2 font-semibold">indirizzo</td>
                  <td className="py-2 border-b border-gray-400">
                    {certificato.proprietarioIndirizzo} {certificato.proprietarioNumero || ''}
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-2 font-semibold">in edificio adibito ad uso</td>
                <td className="py-2 border-b border-gray-400">
                  ☐ {getUsoEdificioLabel(certificato.usoEdificio || '')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DICHIARAZIONE */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
          <p className="font-bold mb-3">DICHIARA</p>
          <p className="text-sm mb-3">
            sotto la propria personale responsabilità, che l'impianto è stato realizzato in modo conforme alla regola dell'arte, 
            secondo quanto previsto dall'art. 6 del D.M. n. 37/2008, tenuto conto delle condizioni di esercizio e degli usi 
            a cui è destinato l'edificio, avendo in particolare:
          </p>
          <div className="space-y-2 text-sm">
            {certificato.rispettatoProgetto && (
              <p>☐ rispettato il progetto redatto ai sensi dell'art. 5 da {certificato.progettoRedattoDa || 'professionista abilitato'}</p>
            )}
            {certificato.seguitoNormativaTecnica && (
              <p>☐ seguito la normativa tecnica applicabile all'impiego</p>
            )}
            {certificato.installatoComponentiRegolaArte && (
              <p>☐ installato componenti e materiali costruiti a regola d'arte e adatti al luogo di installazione (artt. 5 e 6 del D.M. n. 37/2008)</p>
            )}
            {certificato.controllatoImpiantoSicurezza && (
              <p>☐ controllato l'impianto ai fini della sicurezza e della funzionalità con esito positivo, avendo eseguito le verifiche richieste dalle norme e dalle disposizioni di legge.</p>
            )}
          </div>
        </div>

        {/* FIRME PAGINA 1 */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <p className="text-sm mb-2">Data ______/____/____</p>
            <p className="text-sm font-semibold mb-8">Il responsabile tecnico</p>
            <div className="border-b border-gray-400 h-16"></div>
            <p className="text-xs text-center mt-1">(Timbro e firma)</p>
          </div>
          <div>
            <p className="text-sm mb-2">Data ______/____/____</p>
            <p className="text-sm font-semibold mb-8">Il dichiarante</p>
            <div className="border-b border-gray-400 h-16"></div>
            <p className="text-xs text-center mt-1">(Timbro e firma)</p>
          </div>
        </div>
      </div>

      {/* PAGINA 2 - ALLEGATI */}
      <div id="certificato-page2" className="bg-white shadow-lg border border-gray-300 p-8 md:p-12 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 page-break">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-xl font-bold mb-2">DICHIARAZIONE DI CONFORMITÀ DELL'IMPIANTO ALLA REGOLA DELL'ARTE</h1>
          <p className="text-sm">(art. 7 del D.M. n. 37 del 22 gennaio 2008)</p>
        </div>

        {/* ALLEGATI OBBLIGATORI */}
        <div className="mb-6">
          <h2 className="font-bold text-base mb-3">Allegati obbligatori</h2>
          <div className="space-y-2 text-sm">
            {certificato.allegatoProgetto && (
              <p>☐ progetto ai sensi degli articoli 5 e 7 del D.M. n. 37/2008</p>
            )}
            {certificato.allegatoRelazioneMateriali && (
              <p>☐ relazione con tipologie dei materiali utilizzati</p>
            )}
            {certificato.allegatoSchemaImpianto && (
              <p>☐ schema di impianto realizzato</p>
            )}
            {certificato.allegatoDichiarazioniPrecedenti && (
              <p>☐ riferimento a dichiarazioni di conformità precedenti o parziali, già esistenti</p>
            )}
            {certificato.allegatoCertificatoRequisiti && (
              <p>☐ copia del certificato di riconoscimento dei requisiti tecnico-professionali</p>
            )}
          </div>
        </div>

        {/* ALLEGATI FACOLTATIVI */}
        <div className="mb-6">
          <h2 className="font-bold text-base mb-3">Allegati facoltativi</h2>
          <div className="space-y-2 text-sm">
            {certificato.allegatiFacoltativi && certificato.allegatiFacoltativi.length > 0 ? (
              certificato.allegatiFacoltativi.map((allegato, index) => (
                <p key={index}>☐ {allegato}</p>
              ))
            ) : (
              <p className="text-gray-500 italic">Nessun allegato facoltativo</p>
            )}
          </div>
        </div>

        {/* DECLINAZIONE RESPONSABILITÀ */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
          <p className="font-bold mb-2">DECLINA</p>
          <p className="text-sm">
            ogni responsabilità per sinistri a persone o a cose derivanti da manomissione dell'impianto da parte di terzi 
            ovvero da carenze di manutenzione o riparazione.
          </p>
        </div>

        {/* FIRME PAGINA 2 */}
        <div className="grid grid-cols-2 gap-8 mt-8 mb-8">
          <div>
            <p className="text-sm mb-2">Data ____/____/____</p>
            <p className="text-sm font-semibold mb-8">Il responsabile tecnico</p>
            <div className="border-b border-gray-400 h-16"></div>
            <p className="text-xs text-center mt-1">(Timbro e firma)</p>
          </div>
          <div>
            <p className="text-sm mb-2">Data ____/____/____</p>
            <p className="text-sm font-semibold mb-8">Il dichiarante</p>
            <div className="border-b border-gray-400 h-16"></div>
            <p className="text-xs text-center mt-1">(Timbro e firma)</p>
          </div>
        </div>

        {/* AVVERTENZE */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300">
          <h3 className="font-bold text-sm mb-2">AVVERTENZE PER IL COMMITTENTE: responsabilità del committente o del proprietario - art. 8 D.M. n. 37/2008</h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Al termine dei lavori, previa effettuazione delle verifiche previste dalla normativa vigente, comprese quelle di funzionalità 
            dell'impianto, l'impresa installatrice è tenuta a rilasciare al committente la dichiarazione di conformità degli impianti 
            realizzati nel rispetto delle norme di cui all'art. 6. Di tale dichiarazione fanno parte integrante la relazione contenente 
            la tipologia dei materiali impiegati, nonché il progetto di cui all'art. 5. (D.M. n. 37/2008, art. 7). Il committente o il 
            proprietario è tenuto ad affidare i lavori di installazione, di trasformazione, di ampliamento e di manutenzione straordinaria 
            degli impianti di cui all'art. 1 comma 2 (del D.M. citato) ad imprese abilitate ai sensi dell'art. 3.
          </p>
        </div>

        {/* NUMERO DICHIARAZIONE */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Dichiarazione n. {certificato.numero}</p>
          <p>Data rilascio: {new Date(certificato.dataRilascio).toLocaleDateString('it-IT')}</p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificato-page1, #certificato-page1 *,
          #certificato-page2, #certificato-page2 * { visibility: visible; }
          #certificato-page1, #certificato-page2 { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
          }
          #certificato-page2 { top: 297mm; }
          .print\\:hidden { display: none !important; }
          .page-break { page-break-after: always; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </div>
  );
}
