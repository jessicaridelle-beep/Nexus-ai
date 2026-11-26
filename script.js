const ORIVANE_API_URL = "https://nexus-ai-api.jessicaridelle.workers.dev";
/* Local app language: UI strings only; messages, file contents and account names are never translated. */
const ORIVANE_LANG_KEY="orivane-language-v1",ORIVANE_LANGS=["en","fr","nl","de","es"];
const ORIVANE_UI_ROWS=[["Device language (Automatic)","Langue de l’appareil (Automatique)","Apparaattaal (automatisch)","Gerätesprache (automatisch)","Idioma del dispositivo (automático)"],["New conversation","Nouvelle conversation","Nieuw gesprek","Neue Unterhaltung","Nueva conversación"],["YOUR SPACE","VOTRE ESPACE","JOUW RUIMTE","DEIN BEREICH","TU ESPACIO"],["Chat","Discussion","Chat","Chat","Chat"],["Projects","Projets","Projecten","Projekte","Proyectos"],["GIF Studio","Studio GIF","GIF-studio","GIF-Studio","Estudio GIF"],["Plugins","Extensions","Plug-ins","Plugins","Complementos"],["Prompt library","Bibliothèque de prompts","Promptbibliotheek","Prompt-Bibliothek","Biblioteca de prompts"],["RECENT CHATS","DISCUSSIONS RÉCENTES","RECENTE GESPREKKEN","LETZTE CHATS","CHATS RECIENTES"],["Connected · Preview","Connecté · Aperçu","Verbonden · Preview","Verbunden · Vorschau","Conectado · Vista previa"],["Workspace","Espace de travail","Werkruimte","Arbeitsbereich","Espacio de trabajo"],["Profile / Sign in","Profil / Connexion","Profiel / Inloggen","Profil / Anmelden","Perfil / Iniciar sesión"],["⚙ Settings","⚙ Paramètres","⚙ Instellingen","⚙ Einstellungen","⚙ Ajustes"],["Settings","Paramètres","Instellingen","Einstellungen","Ajustes"],["Fast","Rapide","Snel","Schnell","Rápido"],["Thinking","Réflexion","Nadenken","Denken","Razonamiento"],["⚡ Fast","⚡ Rapide","⚡ Snel","⚡ Schnell","⚡ Rápido"],["◈ Thinking","◈ Réflexion","◈ Nadenken","◈ Denken","◈ Razonamiento"],["Quick replies for everyday chat","Réponses rapides au quotidien","Snelle antwoorden voor elke dag","Schnelle Antworten im Alltag","Respuestas rápidas para el día a día"],["More careful, step-by-step answers","Réponses réfléchies, étape par étape","Zorgvuldige antwoorden, stap voor stap","Sorgfältige Antworten, Schritt für Schritt","Respuestas detalladas paso a paso"],["Detailed responses for complex tasks","Réponses détaillées aux tâches complexes","Uitgebreide antwoorden voor complexe taken","Ausführliche Antworten für komplexe Aufgaben","Respuestas detalladas para tareas complejas"],["🟠 YOUR CURIOSITY HAS ENTERED THE CHAT","🟠 VOTRE CURIOSITÉ ENTRE EN SCÈNE","🟠 JE NIEUWSGIERIGHEID IS HIER","🟠 DEINE NEUGIER IST HIER","🟠 TU CURIOSIDAD HA ENTRADO AL CHAT"],["Where will your","Où votre","Waar brengt je","Wohin führt dich deine","¿Hasta dónde te llevará"],["curiosity take you?","curiosité vous mènera-t-elle ?","nieuwsgierigheid je?","Neugier?","tu curiosidad?"],["Ideas, questions, weird what-ifs — bring the chaos. I’ll bring the orange energy. 🧡","Idées, questions, scénarios improbables : place à la créativité. 🧡","Ideeën, vragen en gekke scenario’s: laat je creativiteit de vrije loop. 🧡","Ideen, Fragen und verrückte Szenarien: Lass deiner Kreativität freien Lauf. 🧡","Ideas, preguntas y situaciones curiosas: deja volar tu creatividad. 🧡"],["Idea explosion","Explosion d'idées","Ideeënexplosie","Ideenexplosion","Explosión de ideas"],["10 unexpected ideas","10 idées inattendues","10 onverwachte ideeën","10 unerwartete Ideen","10 ideas inesperadas"],["Teach me anything","Apprends-moi quelque chose","Leer me iets","Bring mir etwas bei","Enséñame algo"],["A quick mind-expander","Une découverte rapide","Een snelle ontdekking","Eine schnelle Entdeckung","Un descubrimiento rápido"],["Build an idea","Développer une idée","Werk een idee uit","Eine Idee entwickeln","Desarrollar una idea"],["Turn a thought into a plan","Transformer une idée en plan","Maak een plan van een idee","Mach aus einer Idee einen Plan","Convierte una idea en un plan"],["Reality check","Vérification des faits","Realiteitscheck","Realitätscheck","Comprobación de hechos"],["Facts, clearly labelled","Des faits bien identifiés","Duidelijke feiten","Klar gekennzeichnete Fakten","Hechos bien identificados"],["What-if machine","Machine à scénarios","Wat-als-machine","Was-wäre-wenn-Maschine","Máquina de escenarios"],["Wild alternate possibilities","Possibilités inattendues","Onverwachte mogelijkheden","Verrückte Möglichkeiten","Posibilidades inesperadas"],["10-minute challenge","Défi de 10 minutes","Uitdaging van 10 minuten","10-Minuten-Challenge","Reto de 10 minutos"],["Make something right now","Créer quelque chose maintenant","Maak nu iets","Mach jetzt etwas","Crea algo ahora"],["WORKSPACE TOOLS","OUTILS DE TRAVAIL","WERKRUIMTETOOLS","WERKZEUGE","HERRAMIENTAS"],["Make more with ORIVANE","Faites plus avec ORIVANE","Doe meer met ORIVANE","Mach mehr mit ORIVANE","Haz más con ORIVANE"],["Research, learn, create and organise without leaving your chat.","Recherchez, apprenez, créez et organisez sans quitter le chat.","Onderzoek, leer, creëer en organiseer zonder de chat te verlaten.","Recherchiere, lerne, erstelle und organisiere direkt im Chat.","Investiga, aprende, crea y organiza sin salir del chat."],["Research mode","Mode recherche","Onderzoeksmodus","Recherchemodus","Modo investigación"],["Study mode","Mode étude","Studiemodus","Lernmodus","Modo estudio"],["Voice typing","Dictée vocale","Spraakinvoer","Spracheingabe","Dictado por voz"],["Attach text","Joindre du texte","Tekst toevoegen","Text anhängen","Adjuntar texto"],["Step-by-step teaching, examples and recaps","Explications étape par étape, exemples et résumés","Uitleg stap voor stap, voorbeelden en samenvattingen","Schritt-für-Schritt-Erklärungen, Beispiele und Zusammenfassungen","Explicaciones paso a paso, ejemplos y resúmenes"],["Dictate a message with your microphone","Dictez un message avec le micro","Dicteer een bericht met je microfoon","Diktiere eine Nachricht per Mikrofon","Dicta un mensaje con el micrófono"],["Add a TXT, MD, CSV, JSON or LOG file","Ajouter un fichier TXT, MD, CSV, JSON ou LOG","Voeg een TXT-, MD-, CSV-, JSON- of LOG-bestand toe","TXT-, MD-, CSV-, JSON- oder LOG-Datei hinzufügen","Añade un archivo TXT, MD, CSV, JSON o LOG"],["Action Studio","Studio d'actions","Actiestudio","Aktionsstudio","Estudio de acciones"],["Image Studio","Studio d'images","Afbeeldingsstudio","Bildstudio","Estudio de imágenes"],["Code Studio","Studio de code","Codestudio","Code-Studio","Estudio de código"],["↓ Export chat","↓ Exporter la discussion","↓ Chat exporteren","↓ Chat exportieren","↓ Exportar chat"],["＋ Save prompt","＋ Enregistrer le prompt","＋ Prompt opslaan","＋ Prompt speichern","＋ Guardar prompt"],["↻ Regenerate last","↻ Régénérer la réponse","↻ Antwoord opnieuw genereren","↻ Antwort neu erstellen","↻ Regenerar respuesta"],["Your projects and files stay on this device.","Vos projets et fichiers restent sur cet appareil.","Je projecten en bestanden blijven op dit apparaat.","Deine Projekte und Dateien bleiben auf diesem Gerät.","Tus proyectos y archivos permanecen en este dispositivo."],["Message Orivane…","Écrivez à Orivane…","Bericht aan Orivane…","Nachricht an Orivane…","Envía un mensaje a Orivane…"],["Curiosity welcome. Be yourself.","La curiosité est bienvenue.","Nieuwsgierigheid is welkom.","Neugier ist willkommen.","La curiosidad es bienvenida."],["+ File","+ Fichier","+ Bestand","+ Datei","+ Archivo"],["Folder","Dossier","Map","Ordner","Carpeta"],["Image","Image","Afbeelding","Bild","Imagen"],["Web","Web","Web","Web","Web"],["Attach text or code files","Joindre des fichiers texte ou code","Tekst- of codebestanden toevoegen","Text- oder Codedateien anhängen","Adjuntar archivos de texto o código"],["Attach text files from a folder","Joindre les fichiers texte d'un dossier","Tekstbestanden uit een map toevoegen","Textdateien aus einem Ordner anhängen","Adjuntar archivos de texto de una carpeta"],["Create an image directly in chat","Créer une image dans la discussion","Maak een afbeelding in de chat","Ein Bild direkt im Chat erstellen","Crear una imagen en el chat"],["Toggle live research for the next answer","Activer la recherche web","Webonderzoek aan- of uitzetten","Webrecherche umschalten","Activar o desactivar búsqueda web"],["Memory on","Mémoire activée","Geheugen aan","Speicher an","Memoria activada"],["Memory off","Mémoire désactivée","Geheugen uit","Speicher aus","Memoria desactivada"],["Orivane is thinking…","Orivane réfléchit…","Orivane denkt na…","Orivane denkt nach…","Orivane está pensando…"],["AI responses can be wrong. Check important information.","L’IA peut se tromper. Vérifiez les informations importantes.","AI kan fouten maken. Controleer belangrijke informatie.","KI kann Fehler machen. Prüfe wichtige Informationen.","La IA puede equivocarse. Comprueba la información importante."],["New conversation started.","Nouvelle discussion lancée.","Nieuw gesprek gestart.","Neue Unterhaltung gestartet.","Nueva conversación iniciada."],["Make ORIVANE feel like yours.","Personnalisez ORIVANE.","Maak ORIVANE van jou.","Passe ORIVANE an.","Personaliza ORIVANE."],["Personalisation","Personnalisation","Personalisatie","Personalisierung","Personalización"],["Appearance","Apparence","Weergave","Darstellung","Apariencia"],["Privacy","Confidentialité","Privacy","Datenschutz","Privacidad"],["App language","Langue de l’application","App-taal","App-Sprache","Idioma de la aplicación"],["Use your device language automatically, or choose one manually. English is the fallback.","Utilisez automatiquement la langue de votre appareil ou choisissez-en une. L’anglais est la langue de secours.","Gebruik automatisch de apparaattaal of kies zelf een taal. Engels is de terugvaltaal.","Verwende automatisch die Gerätesprache oder wähle eine Sprache aus. Englisch ist die Ausweichsprache.","Usa automáticamente el idioma del dispositivo o elige uno manualmente. El inglés es el idioma alternativo."],["What should ORIVANE call you?","Comment ORIVANE doit-il vous appeler ?","Hoe moet ORIVANE je noemen?","Wie soll ORIVANE dich nennen?","¿Cómo debería llamarte ORIVANE?"],["Your preferred name","Votre prénom préféré","Je gewenste naam","Dein bevorzugter Name","Tu nombre preferido"],["Custom instructions","Instructions personnalisées","Aangepaste instructies","Benutzerdefinierte Anweisungen","Instrucciones personalizadas"],["How should ORIVANE respond?","Comment ORIVANE doit-il répondre ?","Hoe moet ORIVANE antwoorden?","Wie soll ORIVANE antworten?","¿Cómo debería responder ORIVANE?"],["Response style","Style de réponse","Antwoordstijl","Antwortstil","Estilo de respuesta"],["Balanced","Équilibré","Evenwichtig","Ausgewogen","Equilibrado"],["Friendly and casual","Amical et détendu","Vriendelijk en informeel","Freundlich und locker","Amable e informal"],["Short and concise","Court et concis","Kort en bondig","Kurz und knapp","Breve y conciso"],["Detailed and thorough","Détaillé et complet","Uitgebreid en grondig","Ausführlich und gründlich","Detallado y completo"],["Use my preferred name in replies","Utiliser mon prénom dans les réponses","Gebruik mijn naam in antwoorden","Meinen Namen in Antworten verwenden","Usar mi nombre en las respuestas"],["Theme","Thème","Thema","Design","Tema"],["Dark","Sombre","Donker","Dunkel","Oscuro"],["Light","Clair","Licht","Hell","Claro"],["Your appearance preference is saved on this device.","Votre préférence d’apparence est enregistrée sur cet appareil.","Je weergavevoorkeur wordt op dit apparaat opgeslagen.","Deine Darstellungseinstellung wird auf diesem Gerät gespeichert.","Tu preferencia de apariencia se guarda en este dispositivo."],["Save recent chats on this device","Enregistrer les discussions récentes sur cet appareil","Recente chats op dit apparaat opslaan","Letzte Chats auf diesem Gerät speichern","Guardar chats recientes en este dispositivo"],["Local memory stores up to 30 recent messages in this browser. It is not cloud-synced.","La mémoire locale conserve jusqu’à 30 messages récents dans ce navigateur, sans synchronisation cloud.","Lokaal geheugen bewaart maximaal 30 recente berichten in deze browser, zonder cloudsynchronisatie.","Der lokale Speicher speichert bis zu 30 letzte Nachrichten in diesem Browser, ohne Cloud-Synchronisierung.","La memoria local guarda hasta 30 mensajes recientes en este navegador, sin sincronización en la nube."],["Clear saved memory","Effacer la mémoire","Geheugen wissen","Speicher löschen","Borrar memoria"],["Changes save on this device.","Les modifications sont enregistrées sur cet appareil.","Wijzigingen worden op dit apparaat opgeslagen.","Änderungen werden auf diesem Gerät gespeichert.","Los cambios se guardan en este dispositivo."],["Save settings","Enregistrer","Instellingen opslaan","Einstellungen speichern","Guardar ajustes"],["Saved!","Enregistré !","Opgeslagen!","Gespeichert!","¡Guardado!"],["Copy","Copier","Kopiëren","Kopieren","Copiar"],["Copied!","Copié !","Gekopieerd!","Kopiert!","¡Copiado!"],["Read aloud","Lire à voix haute","Voorlezen","Vorlesen","Leer en voz alta"],["Stop","Arrêter","Stoppen","Stoppen","Detener"],["Answer","Répondre","Antwoorden","Antworten","Responder"],["Type your answer…","Saisissez votre réponse…","Typ je antwoord…","Gib deine Antwort ein…","Escribe tu respuesta…"],["Download file","Télécharger le fichier","Bestand downloaden","Datei herunterladen","Descargar archivo"],["Download folder (.zip)","Télécharger le dossier (.zip)","Map downloaden (.zip)","Ordner herunterladen (.zip)","Descargar carpeta (.zip)"],["Copy code","Copier le code","Code kopiëren","Code kopieren","Copiar código"],["Download image","Télécharger l’image","Afbeelding downloaden","Bild herunterladen","Descargar imagen"],["Remove","Retirer","Verwijderen","Entfernen","Quitar"],["Preparing response…","Préparation de la réponse…","Antwoord voorbereiden…","Antwort wird vorbereitet…","Preparando respuesta…"],["Writing response…","Rédaction de la réponse…","Antwoord schrijven…","Antwort wird geschrieben…","Redactando respuesta…"],["Searching the web…","Recherche sur le web…","Zoeken op het web…","Websuche läuft…","Buscando en internet…"],["✓ Response received","✓ Réponse reçue","✓ Antwoord ontvangen","✓ Antwort erhalten","✓ Respuesta recibida"],["✓ Web sources received","✓ Sources web reçues","✓ Webbronnen ontvangen","✓ Webquellen erhalten","✓ Fuentes recibidas"],["? ORIVANE needs a detail","? ORIVANE a besoin d'une précision","? ORIVANE heeft een detail nodig","? ORIVANE benötigt ein Detail","? ORIVANE necesita un detalle"],["◉ Choose an option","◉ Choisissez une option","◉ Kies een optie","◉ Wähle eine Option","◉ Elige una opción"],["✓ Interactive checklist","✓ Liste interactive","✓ Interactieve checklist","✓ Interaktive Checkliste","✓ Lista interactiva"],["Send message","Envoyer le message","Bericht verzenden","Nachricht senden","Enviar mensaje"],["Your message","Votre message","Je bericht","Deine Nachricht","Tu mensaje"],["Close","Fermer","Sluiten","Schließen","Cerrar"],["Voice mode","Mode vocal","Spraakmodus","Sprachmodus","Modo de voz"],["🎙 Start listening","🎙 Commencer à écouter","🎙 Begin met luisteren","🎙 Zuhören starten","🎙 Empezar a escuchar"],["Send message ↑","Envoyer ↑","Verzenden ↑","Senden ↑","Enviar ↑"]];
const ORIVANE_UI_MAP=new Map(ORIVANE_UI_ROWS.map(row=>[row[0],row]));
function orivaneLanguagePreference(){try{const value=localStorage.getItem(ORIVANE_LANG_KEY);return ORIVANE_LANGS.includes(value)?value:"auto";}catch{return "auto";}}
function orivaneDeviceLanguage(){try{const candidates=[...(Array.isArray(navigator.languages)?navigator.languages:[]),navigator.language];for(const candidate of candidates){const lang=String(candidate||"").toLowerCase().split(/[-_]/)[0];if(ORIVANE_LANGS.includes(lang))return lang;}}catch{}return "en";}
function orivaneLanguage(){const preference=orivaneLanguagePreference();return preference==="auto"?orivaneDeviceLanguage():preference;}
function orivaneT(value,lang=orivaneLanguage()){const row=ORIVANE_UI_MAP.get(value);return row?.[ORIVANE_LANGS.indexOf(lang)]||value;}
const orivaneOriginalText=new WeakMap(),orivaneOriginalAttrs=new WeakMap();
function orivaneTranslateNode(node,lang){const current=node.nodeValue||"",trimmed=current.trim();let entry=orivaneOriginalText.get(node);if(!entry||current!==entry.last){if(!ORIVANE_UI_MAP.has(trimmed))return;entry={key:trimmed,before:current.match(/^\s*/)[0],after:current.match(/\s*$/)[0],last:current};}const next=entry.before+orivaneT(entry.key,lang)+entry.after;entry.last=next;orivaneOriginalText.set(node,entry);if(current!==next)node.nodeValue=next;}
function orivaneTranslateRoot(root,lang=orivaneLanguage()){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||p.closest("script,style,#chatContent,#chatHistory,#profileName,#displayName,#customInstructions,textarea,pre,code"))return NodeFilter.FILTER_REJECT;if(p.closest("#profileOpen")&&typeof signedInUser!=="undefined"&&signedInUser)return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});while(walker.nextNode())orivaneTranslateNode(walker.currentNode,lang);for(const el of [root,...root.querySelectorAll("[placeholder],[title],[aria-label]")]){if(el.closest("#chatContent,#chatHistory"))continue;let attrs=orivaneOriginalAttrs.get(el)||{};for(const attr of ["placeholder","title","aria-label"]){const current=el.getAttribute(attr);if(current===null)continue;let entry=attrs[attr];if(!entry||current!==entry.last){if(!ORIVANE_UI_MAP.has(current))continue;entry={key:current,last:current};}const next=orivaneT(entry.key,lang);entry.last=next;attrs[attr]=entry;if(current!==next)el.setAttribute(attr,next);}orivaneOriginalAttrs.set(el,attrs);}}
function orivaneApplyLanguage(){const lang=orivaneLanguage();document.documentElement.lang=lang;for(const selector of ["#sidebar",".topbar","#welcome",".tool-dock","#voiceMode",".composer-wrap","#settingsOverlay","#profileOverlay","#commandPaletteOverlay","#promptOverlay","#earlyAccessOverlay","#earlyAccessBanner",".feature-strip","footer"]){orivaneTranslateRoot(document.querySelector(selector),lang);}const select=document.getElementById("appLanguage");if(select)select.value=orivaneLanguagePreference();const mode=document.getElementById("modePickerLabel");if(mode)mode.textContent=orivaneT(modeNames[responseMode],lang);const memory=document.getElementById("memoryButton");if(memory)memory.textContent=orivaneT(memoryEnabled?"Memory on":"Memory off",lang);for(const button of document.querySelectorAll(".orivane-chat-tools [data-orivane-label],#chatContent .orivane-artifact-button[data-orivane-label]"))button.textContent=orivaneT(button.dataset.orivaneLabel,lang);}

const form=document.getElementById("chatForm"),input=document.getElementById("promptInput"),content=document.getElementById("chatContent"),sendButton=form.querySelector('[type="submit"]'),chatNote=document.querySelector(".chat-note"),welcome=document.getElementById("welcome"),sidebar=document.getElementById("sidebar");
const MEMORY_KEY="orivane-memory-v1",MEMORY_FLAG="orivane-memory-enabled";
const conversation=[];
let memoryEnabled=localStorage.getItem(MEMORY_FLAG)==="true";
let researchEnabled=(function(){try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}").research===true}catch{return false}})(),studyEnabled=false;
let attachedContext="";
const MODE_KEY="orivane-response-mode";
let responseMode=localStorage.getItem(MODE_KEY)||(function(){try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}").defaultMode||"fast"}catch{return "fast"}})();
const modePicker=document.getElementById("modePicker"),modeMenu=document.getElementById("modeMenu"),modePickerLabel=document.getElementById("modePickerLabel");
const modeNames={fast:"Fast",thinking:"Thinking",pro:"Pro"};
function setResponseMode(mode){if(!modeNames[mode])return;responseMode=mode;localStorage.setItem(MODE_KEY,mode);modePickerLabel.textContent=orivaneT(modeNames[mode]);modeMenu.hidden=true;modePicker.setAttribute("aria-expanded","false");document.querySelectorAll(".mode-option").forEach(option=>{const active=option.dataset.mode===mode;option.classList.toggle("active",active);option.setAttribute("aria-selected",String(active));});}
window.addEventListener("orivane-admin-settings-updated",()=>{try{const c=JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}");if(modeNames[c.defaultMode])setResponseMode(c.defaultMode);researchEnabled=c.research===true;if(researchButton)setMode(researchButton,researchEnabled,"⌕ Research");}catch{}});
modePicker?.addEventListener("click",()=>{modeMenu.hidden=!modeMenu.hidden;modePicker.setAttribute("aria-expanded",String(!modeMenu.hidden));});
modeMenu?.querySelectorAll("[data-mode]").forEach(option=>option.addEventListener("click",()=>setResponseMode(option.dataset.mode)));
document.addEventListener("click",event=>{if(!event.target.closest(".mode-picker-wrap")&&modeMenu&&!modeMenu.hidden){modeMenu.hidden=true;modePicker.setAttribute("aria-expanded","false");}});
setResponseMode(responseMode);
const emojiChoices=["😀","😂","✨","🧡","🔥","👀","🤔","🎮","🚀","😭","💀","😎","🎉","🤖","🔑"];
function saveMemory(){if(memoryEnabled)try{localStorage.setItem(MEMORY_KEY,JSON.stringify(conversation.slice(-30)));}catch{chatNote.textContent="Local memory storage is full; chat still works.";}}
function renderMemoryButton(){const b=document.getElementById("memoryButton");if(!b)return;b.textContent=orivaneT(memoryEnabled?"Memory on":"Memory off");b.classList.toggle("memory-on",memoryEnabled);b.title=memoryEnabled?"Memory is on: conversations are saved on this device. Tap to turn off and erase saved memory.":"Memory is off: tap to save conversations on this device.";}
function appendLink(parent,url,label){const shown=String(label||url);try{const u=new URL(String(url));if(!["http:","https:"].includes(u.protocol)||u.username||u.password)throw Error();const a=document.createElement("a");a.href=u.href;a.target="_blank";a.rel="noopener noreferrer";a.textContent=shown;a.className="message-link";parent.appendChild(a);return a;}catch{parent.append(document.createTextNode(shown));return null;}}
function orivaneTrimURL(value){let raw=String(value).replace(/[.,!?;:]+$/,"");const extra=Math.max(0,(raw.match(/\)/g)||[]).length-(raw.match(/\(/g)||[]).length),trailing=raw.match(/\)+$/)?.[0].length||0;return raw.slice(0,raw.length-Math.min(extra,trailing));}
function getGifUrlFromText(text){const urls=String(text).match(/https?:\/\/[^\s<>"']+/g)||[];return urls.map(raw=>raw.replace(/[),.!?]+$/,"")).find(raw=>{try{const u=new URL(raw),h=u.hostname.toLowerCase(),p=u.pathname.toLowerCase();return u.protocol==="https:"&&(h==="media.tenor.com"||h==="media.giphy.com"||h==="static.klipy.com"||h==="static1.klipy.com"||h==="static2.klipy.com"||(h.endsWith(".giphy.com")&&(p.endsWith(".gif")||p.endsWith(".webp")||p.endsWith(".mp4")))||(h.endsWith(".tenor.com")&&(p.endsWith(".gif")||p.endsWith(".webp")||p.endsWith(".mp4")))||(h.endsWith(".klipy.com")&&(p.endsWith(".gif")||p.endsWith(".webp")||p.endsWith(".mp4"))));}catch{return false;}})||null;}
function orivaneArtifactButton(label,action){const b=document.createElement("button");b.type="button";b.className="orivane-artifact-button";b.dataset.orivaneLabel=label;b.textContent=orivaneT(label);b.addEventListener("click",action);return b;}
function orivaneDownload(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function orivaneSafePath(path){return typeof path==="string"&&path.length<=180&&path.split("/").every(p=>/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(p)&&p!=="."&&p!=="..");}
function orivaneZip(files){
 const enc=new TextEncoder(),chunks=[],central=[];let offset=0,centralSize=0;
 const crc=bytes=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
 for(const [path,value] of files){if(!orivaneSafePath(path))continue;const name=enc.encode(path),data=enc.encode(value),sum=crc(data),local=new Uint8Array(30+name.length),l=new DataView(local.buffer);
 l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint16(12,33,true);l.setUint32(14,sum,true);l.setUint32(18,data.length,true);l.setUint32(22,data.length,true);l.setUint16(26,name.length,true);local.set(name,30);
 const dir=new Uint8Array(46+name.length),d=new DataView(dir.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint16(14,33,true);d.setUint32(16,sum,true);d.setUint32(20,data.length,true);d.setUint32(24,data.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);dir.set(name,46);chunks.push(local,data);central.push(dir);offset+=local.length+data.length;centralSize+=dir.length;}
 const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,central.length,true);e.setUint16(10,central.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);return new Blob([...chunks,...central,end],{type:"application/zip"});
}
function orivaneImageLink(parent,url,label){let parsed;try{parsed=new URL(url);if(parsed.protocol!=="https:"||parsed.username||parsed.password)throw Error();}catch{parent.append(document.createTextNode(label+" ("+url+")"));return;}
 const card=document.createElement("span");card.className="orivane-inline-image";const load=orivaneArtifactButton("Preview image: "+(label||parsed.hostname),()=>{const img=document.createElement("img");img.className="chat-gif";img.alt=label||"Image";img.referrerPolicy="no-referrer";img.onerror=()=>{img.remove();load.textContent="Preview unavailable";load.hidden=false;};img.src=parsed.href;load.hidden=true;card.append(img);});card.append(load,document.createTextNode(" "));appendLink(card,parsed.href,"Open image");parent.append(card);
}
function orivaneInline(parent,text,depth=0,preview=false){
 const s=String(text);if(depth>4){parent.append(document.createTextNode(s));return;}
 const pattern=/\\([\\*_[\]~])|\x60([^\x60\n]+)\x60|\*\*\*([^*\n]+)\*\*\*|(?<!\*)\*(?:\*|(?=[^\s*](?:[^*\n]*[^\s*])?\*\*(?!\*)))([^\s*](?:[^*\n]*[^\s*])?)\*\*?(?!\*)|__([^_\n]+)__|~~([^~\n]+)~~|<u>([^<\n]+)<\/u>|\*([^*\n]+)\*|(?<!\w)_([^_\n]+)_(?!\w)|(!?)\[([^\]\n]+)\]\((https?:\/\/(?:[^\s()<>"']|\([^\s()<>"']*\))+)\)|(<https?:\/\/[^\s<>]+>|(?<![\w@])(?:https?:\/\/|www\.)[^\s<>"']+)/gi;
 let end=0;
 for(const m of s.matchAll(pattern)){parent.append(document.createTextNode(s.slice(end,m.index)));end=m.index+m[0].length;
 if(m[1]){parent.append(document.createTextNode(m[1]));continue;}
 if(m[11]){if(m[10]){if(preview)parent.append(document.createTextNode(m[11]));else orivaneImageLink(parent,m[12],m[11]);}else{try{const u=new URL(m[12]);if(u.username||u.password)throw Error();appendLink(parent,u.href,m[11]);}catch{parent.append(document.createTextNode(m[0]));}}continue;}
 if(m[13]){const original=m[13],angle=original.startsWith("<")&&original.endsWith(">"),raw=angle?original.slice(1,-1):orivaneTrimURL(original);try{const u=new URL(/^www\./i.test(raw)?"https://"+raw:raw);if(u.username||u.password)throw Error();appendLink(parent,u.href,raw);if(!angle)parent.append(document.createTextNode(original.slice(raw.length)));}catch{parent.append(document.createTextNode(original));}continue;}
 const n=document.createElement(m[2]?"code":m[3]||m[4]||m[5]?"strong":m[6]?"del":m[7]?"u":"em");
 if(m[2])n.textContent=m[2];else if(m[3]){const em=document.createElement("em");orivaneInline(em,m[3],depth+1,preview);n.append(em);}else orivaneInline(n,m[4]||m[5]||m[6]||m[7]||m[8]||m[9],depth+1,preview);parent.append(n);}
 parent.append(document.createTextNode(s.slice(end)));
}
function orivaneStreamPreview(container,text){
  if(/^\s*\x60\x60\x60(?:orivane-ui|file:)/im.test(text)){container.textContent=text;return;}
  const fragment=document.createDocumentFragment();let fenced=false;
  const lines=String(text).split("\n");
  for(let i=0;i<lines.length;i++){
    const line=lines[i];if(i)fragment.append(document.createTextNode("\n"));
    if(/^\s*\x60\x60\x60/.test(line)){fenced=!fenced;fragment.append(document.createTextNode(line));continue;}
    if(fenced)fragment.append(document.createTextNode(line));else orivaneInline(fragment,line,0,true);
  }
  container.classList.remove("orivane-markdown");container.replaceChildren(fragment);
}
function orivanePlainText(text){
  let fenced=false;return String(text).split("\n").map(line=>{
    if(/^\s*\x60\x60\x60/.test(line)){fenced=!fenced;return line;}
    if(fenced)return line;
    const tokens=[];const keep=value=>{tokens.push(value);return "\u0001"+(tokens.length-1)+"\u0002";};
    return line.replace(/\x60([^\x60\n]+)\x60/g,(_,value)=>keep(value))
      .replace(/!?\[([^\]\n]+)\]\((https?:\/\/(?:[^\s()]|\([^\s()]*\))+)\)/gi,(_,label,url)=>keep(label+" ("+url+")"))
      .replace(/\\([\\*_[\]~])/g,(_,char)=>keep(char))
      .replace(/\*\*\*([^*\n]+)\*\*\*/g,"$1").replace(/(?<!\*)\*(?:\*|(?=[^\s*](?:[^*\n]*[^\s*])?\*\*(?!\*)))([^\s*](?:[^*\n]*[^\s*])?)\*\*?(?!\*)/g,"$1")
      .replace(/__([^_\n]+)__/g,"$1").replace(/~~([^~\n]+)~~/g,"$1")
      .replace(/<u>([^<\n]+)<\/u>/gi,"$1").replace(/\*([^*\n]+)\*/g,"$1")
      .replace(/(?<!\w)_([^_\n]+)_(?!\w)/g,"$1").replace(/^\s*#{1,6}\s+/,"")
      .replace(/\u0001(\d+)\u0002/g,(_,i)=>tokens[Number(i)]??"");
  }).join("\n");
}

function orivaneMarkdown(container,text){
  container.classList.add("orivane-markdown");
  const lines=String(text).replace(/\r\n?/g,"\n").split("\n");
  const add=(tag,body,parent=container)=>{const n=document.createElement(tag);if(body!==undefined)orivaneInline(n,body);parent.append(n);return n;};
  const cells=s=>s.trim().replace(/^\||\|$/g,"").split("|").map(x=>x.trim());
  const tableAt=i=>i+1<lines.length&&lines[i].includes("|")&&lines[i+1].includes("|")&&cells(lines[i+1]).every(x=>/^:?-{3,}:?$/.test(x))&&cells(lines[i]).length===cells(lines[i+1]).length;
  const list=/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/;
  const artifacts=new Map();let i=0;
  while(i<lines.length){
    const l=lines[i];if(!l.trim()){i++;continue;}
    const fence=l.match(/^\s*\x60\x60\x60(?:file:([A-Za-z0-9._/-]+)|([\w+-]*))\s*$/);
    if(fence){const buf=[];i++;while(i<lines.length&&!/^\s*\x60\x60\x60\s*$/.test(lines[i]))buf.push(lines[i++]);const closed=i<lines.length;if(closed)i++;const value=buf.join("\n"),path=fence[1];const bar=add("div");bar.className="orivane-code-tools";const name=add("span",path||fence[2]||"Code",bar);const copy=orivaneArtifactButton("Copy code",async()=>{try{await navigator.clipboard.writeText(value);copy.textContent="Copied";setTimeout(()=>copy.textContent="Copy code",1200);}catch{copy.textContent="Select code to copy";}});bar.append(copy);if(path&&closed&&orivaneSafePath(path)&&!artifacts.has(path)){artifacts.set(path,value);bar.append(orivaneArtifactButton("Download file",()=>orivaneDownload(new Blob([value],{type:"application/octet-stream"}),path.split("/").pop())));}else if(path&&!closed)name.textContent=path+" (incomplete)";const pre=add("pre"),code=add("code",undefined,pre);code.textContent=value;if(fence[2])code.dataset.language=fence[2];continue;}
    const flash=l.match(/^>\s*\[!FLASHCARD\]\s+(.+)$/i);
    if(flash){const node=add("details");node.className="orivane-answer-callout orivane-callout-details";add("summary",flash[1],node);i++;while(i<lines.length&&/^\s*>/.test(lines[i]))add("p",lines[i++].replace(/^\s*>\s?/,""),node);continue;}
    const progress=l.match(/^\[!PROGRESS\]\s+(\d{1,3})%\s+(.+)$/i);
    if(progress&&Number(progress[1])<=100){const node=add("div");node.className="orivane-answer-callout";add("strong",progress[2]+" · "+progress[1]+"%",node);const meter=add("progress",undefined,node);meter.max=100;meter.value=Number(progress[1]);meter.setAttribute("aria-label",progress[2]);meter.style.width="100%";i++;continue;}
    const h=l.match(/^\s*(#{1,6})\s+(.+)$/);
    if(h){add("h"+Math.min(h[1].length+2,6),h[2]);i++;continue;}
    if(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l)){add("hr");i++;continue;}
    if(tableAt(i)){const wrap=add("div");wrap.className="orivane-table-scroll";const table=add("table",undefined,wrap),head=add("thead",undefined,table),tr=add("tr",undefined,head),headers=cells(l);headers.forEach(c=>add("th",c,tr));const body=add("tbody",undefined,table);i+=2;while(i<lines.length&&lines[i].trim()&&lines[i].includes("|")&&cells(lines[i]).length===headers.length){const row=add("tr",undefined,body);cells(lines[i++]).forEach(c=>add("td",c,row));}continue;}
    const item=l.match(list);
    if(item){const ordered=!!item[2],node=add(ordered?"ol":"ul");if(ordered)node.start=Number(item[2]);while(i<lines.length){const m=lines[i].match(list);if(!m||!!m[2]!==ordered)break;const check=m[3].match(/^\[([ xX])\]\s+(.*)$/);if(check){const li=add("li",undefined,node),box=document.createElement("input");box.type="checkbox";box.disabled=true;box.checked=check[1]!==" ";box.setAttribute("aria-label",box.checked?"Completed":"Not completed");li.append(box,document.createTextNode(" "));orivaneInline(li,check[2]);}else add("li",m[3],node);i++;}continue;}
    if(/^\s*>/.test(l)){
      const buf=[];while(i<lines.length&&/^\s*>/.test(lines[i]))buf.push(lines[i++].replace(/^\s*>\s?/,""));
      const callout=buf[0]?.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|SPOILER|DETAILS)\](?:\s+(.+))?$/i);
      if(callout){
        const type=callout[1].toLowerCase(),label=callout[2]||({note:"Note",tip:"Tip",important:"Important",warning:"Warning",spoiler:"Reveal spoiler",details:"Show details"})[type];
        const node=add(type==="spoiler"||type==="details"?"details":"aside");
        node.className="orivane-answer-callout orivane-callout-"+type;
        add(node.tagName==="DETAILS"?"summary":"strong",label,node);
        const body=add("div",undefined,node);body.className="orivane-callout-body";
        for(const paragraph of buf.slice(1).join("\n").split(/\n\s*\n/))if(paragraph.trim())add("p",paragraph,body);
      }else add("blockquote",buf.join("\n"));continue;
    }
    const buf=[l];i++;while(i<lines.length&&lines[i].trim()&&!/^\s*(```|#{1,6}\s|>|(?:-{3,}|\*{3,}|_{3,})\s*$)/.test(lines[i])&&!list.test(lines[i])&&!tableAt(i))buf.push(lines[i++]);add("p",buf.join("\n"));
  }
  if(artifacts.size>1){const group=add("div");group.className="orivane-artifact-group";group.append(document.createTextNode("Folder · "+artifacts.size+" files "),orivaneArtifactButton("Download folder (.zip)",()=>orivaneDownload(orivaneZip(artifacts),"orivane-files.zip")));}
}

/* ORIVANE interactive chat cards: no generated HTML or automatic model actions. */
function orivaneParseCard(raw,streaming=false) {
  let text=String(raw||"").replace(/\r\n?/g,"\n");
  if(/^\s*\x60\x60\x60orivane-ui\b/im.test(text))return {text,card:null};
  // Models sometimes fence the card protocol. Unwrap only an exact card envelope,
  // not ordinary JSON examples, code snippets or Canvas content.
  text=text.replace(/^[ \t]*\x60{3}(?:json|orivane-card)?[ \t]*\n([ \t]*\[ORIVANE_CARD\][\s\S]*?\[\/ORIVANE_CARD\][ \t]*)\n[ \t]*\x60{3}[ \t]*(?=\n|$)/gim,"$1");
  if(streaming){
    text=text.replace(/^[ \t]*\x60{3}(?:json|orivane-card)?[ \t]*\n([ \t]*\[ORIVANE_CARD\][\s\S]*?)(?:\n[ \t]*\x60{0,2})?$/im,"$1");
  }
  let card=null,invalid=false,fenced=false,plain="",kept=[];
  const open="[ORIVANE_CARD]",close="[/ORIVANE_CARD]";
  function accept(payload){
    try{
      if(payload.length>3500)throw Error();
      const data=JSON.parse(payload);
      if(!data||!["poll","clarification","checklist"].includes(data.type)||typeof data.question!=="string"||!data.question.trim()||data.question.length>300||!Array.isArray(data.options)||data.options.length>(data.type==="checklist"?8:6)||data.options.some(v=>typeof v!=="string"||!v.trim()||v.length>160))throw Error();
      const options=[...new Set(data.options.map(v=>v.trim()))];
      if(options.length<(data.type==="poll"?2:data.type==="checklist"?1:0))throw Error();
      if(!card)card={type:data.type,question:data.question.trim(),options};else invalid=true;
    }catch{invalid=true;}
  }
  function flush(){
    if(!plain)return;
    let rest=plain,out="";
    while(rest){
      const start=rest.indexOf(open),orphan=rest.indexOf(close);
      if(orphan!==-1&&(start===-1||orphan<start)){out+=rest.slice(0,orphan);rest=rest.slice(orphan+close.length);invalid=true;continue;}
      if(start===-1){out+=rest;break;}
      out+=rest.slice(0,start);
      const end=rest.indexOf(close,start+open.length);
      if(end===-1){if(!streaming)invalid=true;break;}
      accept(rest.slice(start+open.length,end).trim());
      rest=rest.slice(end+close.length);
    }
    if(streaming){for(const marker of [open,close]){for(let n=marker.length-1;n>=1;n--){if(out.endsWith(marker.slice(0,n))){out=out.slice(0,-n);break;}}}}
    kept.push(out);plain="";
  }
  for(const line of text.split("\n")){
    if(/^\s*\x60\x60\x60/.test(line)){flush();fenced=!fenced;kept.push(line+"\n");}
    else if(fenced)kept.push(line+"\n");else plain+=line+"\n";
  }
  if(streaming)plain=plain.replace(/\n$/,"");
  flush();
  let visible=kept.join("").trim();
  // Plain questions stay plain; explicitly emitted valid clarification envelopes remain interactive.
  if(invalid&&!streaming&&!visible&&!card)visible="I couldn't display that question correctly. Please ask me to try again.";
  return {text:visible,card,invalid};
}
function orivaneReadableReply(raw){const parsed=orivaneParseCard(raw);return [parsed.text,parsed.card?.question,parsed.card?.options?.join("\n")].filter(Boolean).join("\n\n");}
function orivaneChatElement(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function orivaneCardHost(row){return row?.querySelector(".message-body");}
function orivaneRenderCard(row,card,preview=false){
  const host=orivaneCardHost(row);if(!host||!card)return;
  host.querySelector(".orivane-interactive-card")?.remove();
  const panel=orivaneChatElement("section","orivane-chat-card orivane-interactive-card"+(card.type==="clarification"?" orivane-clarification":""));
  panel.setAttribute("aria-label",card.type==="clarification"?"Clarification":card.type==="poll"?"Poll":"Checklist");
  const tag=orivaneChatElement("small","orivane-card-label",orivaneT(card.type==="clarification"?"? ORIVANE needs a detail":card.type==="poll"?"◉ Choose an option":"✓ Interactive checklist"));
  const title=orivaneChatElement("strong","",card.question), choices=orivaneChatElement("div","orivane-card-choices"), status=orivaneChatElement("small","orivane-card-status",preview?"Preparing question…":"");
  status.setAttribute("role","status");panel.append(tag,title,choices,status);host.append(panel);
  if(card.type==="checklist"){
    const boxes=[];const meter=document.createElement("progress");meter.max=card.options.length;meter.value=0;meter.style.width="100%";meter.setAttribute("aria-label","Checklist progress");panel.insertBefore(meter,status);
    const update=()=>{const count=boxes.filter(b=>b.checked).length;meter.value=count;status.textContent=count===boxes.length?"✓ All tasks checked":count+" / "+boxes.length+" completed";};
    for(const option of card.options){const label=orivaneChatElement("label","orivane-task-row");const box=document.createElement("input");box.type="checkbox";box.disabled=preview;box.addEventListener("change",update);boxes.push(box);label.append(box,document.createTextNode(option));choices.append(label);}
    if(!preview)update();return;
  }
  const controls=[];
  let answered=false;
  async function submit(value,selected){
    value=String(value||"").trim();if(!value||answered||preview)return;
    if(sendButton.disabled){status.textContent="The current response is still finishing. Try again shortly.";return;}
    answered=true;controls.forEach(b=>b.disabled=true);selected?.classList.add("selected");status.textContent="✓ Answer: "+value;
    try{const reply=await sendMessage("My answer to "+card.question+": "+value);if(reply==null)throw Error("No reply");}catch{answered=false;controls.forEach(b=>b.disabled=false);status.textContent="Could not send. Try again.";}
  }
  for(const option of card.options){const button=orivaneChatElement("button","",option);button.type="button";button.disabled=preview;controls.push(button);button.addEventListener("click",()=>submit(option,button));choices.append(button);}
  if(card.type==="clarification"){
    const field=document.createElement("input");field.type="text";field.maxLength=500;field.placeholder=orivaneT("Type your answer…");field.setAttribute("aria-label","Your clarification");field.disabled=preview;
    const button=orivaneChatElement("button","",orivaneT("Answer"));button.type="button";button.disabled=preview;controls.push(field,button);button.addEventListener("click",()=>submit(field.value,button));field.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();submit(field.value,button);}});choices.append(field,button);
  }
}
function orivaneStatus(row,text){
  const host=orivaneCardHost(row);if(!host)return;
  let el=host.querySelector(".orivane-live-status");
  if(!el){el=orivaneChatElement("div","orivane-live-status");el.setAttribute("role","status");host.insertBefore(el,host.querySelector(".assistant-message-content"));}
  el.textContent=orivaneT(text);
}
function orivaneSources(row,sources){
  const host=orivaneCardHost(row);if(!host||!Array.isArray(sources))return;
  const panel=orivaneChatElement("section","orivane-chat-card orivane-source-card"), title=orivaneChatElement("strong","","Web sources");
  panel.append(title);let count=0;
  for(const item of sources.slice(0,5)){try{const u=new URL(String(item.url||""));if(!["http:","https:"].includes(u.protocol)||u.username||u.password)continue;const a=orivaneChatElement("a","orivane-source-link");a.href=u.href;a.target="_blank";a.rel="noopener noreferrer";a.append(orivaneChatElement("b","",String(item.title||u.hostname).slice(0,180)),orivaneChatElement("small","",u.hostname+" · "+String(item.description||"").slice(0,220)));panel.append(a);count++;}catch{}}
  if(count){title.textContent="✓ Web sources ("+count+")";host.append(panel);}
}
function orivaneImagePrompt(value){
  const command=String(value).trim().match(/^\/image\s+(.+)$/is);if(command)return command[1].trim();
  const match=String(value).trim().match(/^(?:(?:please|can you|could you|would you)\s+)?(?:generate|create|make|draw|render)\s+(?:me\s+)?(?:(?:an?|the)\s+)?(?:image|picture|illustration|artwork|photo)\s+(?:of|showing|depicting|with|for|:)\s*(.+)$/is);
  return match?match[1].trim():null;
}
async function orivaneGenerateImage(prompt){
  const row=addMessage("assistant",""),host=orivaneCardHost(row);
  const card=orivaneChatElement("section","orivane-chat-card orivane-image-card"),status=orivaneChatElement("div","orivane-card-status","✦ Generating image…");status.setAttribute("role","status");
  card.append(status);host.append(card);
  try{
    if(prompt.length>500)throw Error("Please shorten the image prompt to 500 characters.");
    const response=await fetch(ORIVANE_API_URL+"?action=create-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
    const data=await response.json();if(!response.ok)throw Error(data.error||"Image generation failed.");
    const url=data.image_data_url;
    if(typeof url!=="string"||url.length>6000030||!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(url))throw Error("The image service returned no usable preview.");
    const img=orivaneChatElement("img","");img.alt=prompt;img.src=url;
    if(typeof img.decode==="function")await img.decode();
    const download=orivaneChatElement("a","",orivaneT("Download image"));download.href=url;download.download="orivane-image."+(url.startsWith("data:image/png")?"png":url.startsWith("data:image/webp")?"webp":"jpg");
    card.append(img,download);status.textContent="✓ Image generated";return "Image generated: "+prompt;
  }catch(error){status.textContent="Image generation failed: "+String(error.message||"Try again.").slice(0,250);return "Image generation failed.";}
}

function renderMessageText(container,text){try{orivaneRenderMessageText(container,text);}catch{container.textContent=String(text||"");if(typeof orivaneBrowserReport==="function")orivaneBrowserReport(["browser_render_error"]);}}
function orivaneRenderMessageText(container,text){if(/\x60\x60\x60orivane-ui\b/i.test(text)){container.textContent=text;return;}const url=getGifUrlFromText(text);if(!url||/\x60\x60\x60|!\[[^\]]*\]\(https?:\/\//.test(text)){orivaneMarkdown(container,text);return;}const clean=text.replace(url,"").trim();if(clean)orivaneMarkdown(container,clean);const img=document.createElement("img");img.className="chat-gif";img.src=url;img.alt="GIF";img.loading="lazy";img.referrerPolicy="no-referrer";img.onerror=()=>{img.remove();appendLink(container,url,"Open GIF");};container.appendChild(img);}
const orivaneMessageSources=new WeakMap();
function addMessage(role,text,restore=false){if(role==="user"){const el=document.createElement("div");el.className="user-message";orivaneMessageSources.set(el,String(text));renderMessageText(el,text);content.appendChild(el);return;}
 const row=document.createElement("div");row.className="assistant-message";const icon=document.createElement("span");icon.className="message-icon";icon.textContent="O";const body=document.createElement("div");body.className="message-body";const title=document.createElement("b");title.textContent=(()=>{try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}").assistantName||"ORIVANE"}catch{return "ORIVANE"}})()+" 🟠";const p=document.createElement("div");p.className="assistant-message-content";const parsed=orivaneParseCard(text);orivaneMessageSources.set(row,String(text));renderMessageText(p,orivaneUnclosedBold(parsed.text,true).text);const actions=document.createElement("div");actions.className="message-actions";const copy=document.createElement("button");copy.type="button";copy.textContent=orivaneT("Copy");copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(orivanePlainText(orivaneReadableReply(text)));copy.textContent=orivaneT("Copied!");setTimeout(()=>copy.textContent=orivaneT("Copy"),1400);}catch{copy.textContent="Select text to copy";}});actions.append(copy);const speak=document.createElement("button");speak.type="button";speak.textContent=orivaneT("Read aloud");speak.addEventListener("click",()=>{if(!("speechSynthesis" in window)){speak.textContent="Not supported";return;}if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();speak.textContent=orivaneT("Read aloud");return;}const utterance=new SpeechSynthesisUtterance(orivanePlainText(orivaneReadableReply(text)));utterance.onend=()=>speak.textContent=orivaneT("Read aloud");utterance.onerror=()=>speak.textContent="Try again";speak.textContent=orivaneT("Stop");window.speechSynthesis.speak(utterance);});actions.append(speak);body.append(title,p,actions);row.append(icon,body);content.appendChild(row);if(parsed.card)orivaneRenderCard(row,parsed.card);return row;}
function restoreMemory(){if(!memoryEnabled)return;try{const saved=JSON.parse(localStorage.getItem(MEMORY_KEY)||"[]");if(Array.isArray(saved)){saved.slice(-30).forEach(m=>{if(m&&["user","assistant"].includes(m.role)&&typeof m.content==="string"){conversation.push(m);addMessage(m.role,m.content,true);}});if(conversation.length)welcome.hidden=true;}}catch{localStorage.removeItem(MEMORY_KEY);}}

/* Local reply watchdog. Only fixed diagnostic codes are saved or sent by the authenticated owner. */
const ORIVANE_LOCAL_REPORT="orivane-report-local-v1";
const ORIVANE_BROWSER_CODES=new Set(["browser_empty_stream","browser_retry_ok","browser_retry_failed","browser_reply_error","browser_invalid_card","browser_render_error","browser_render_unresolved","browser_report_upload_failed","browser_unclosed_bold","browser_runtime_error","browser_network_error","browser_reply_checked"]);
function orivaneLocalReport(){
  try{const rows=JSON.parse(localStorage.getItem(ORIVANE_LOCAL_REPORT)||"[]");return Array.isArray(rows)?rows.filter(r=>r&&ORIVANE_BROWSER_CODES.has(r.code)&&/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&["fast","thinking","pro","unknown"].includes(r.mode)&&Number.isSafeInteger(r.count)&&r.count>0).slice(0,300):[];}catch{return [];}
}
function orivaneBrowserReport(codes,localOnly=false){
  const day=new Date().toISOString().slice(0,10),mode=["fast","thinking","pro"].includes(responseMode)?responseMode:"unknown",known=[...new Set(codes)].filter(c=>ORIVANE_BROWSER_CODES.has(c));
  if(!known.length)return;
  try{const rows=orivaneLocalReport().filter(r=>r.day>=new Date(Date.now()-30*86400000).toISOString().slice(0,10));for(const code of known){const row=rows.find(r=>r.day===day&&r.mode===mode&&r.code===code);if(row)row.count=Math.min(row.count+1,1000000000);else rows.unshift({day,mode,code,count:1});}localStorage.setItem(ORIVANE_LOCAL_REPORT,JSON.stringify(rows.slice(0,300)));}catch{}
  // No anonymous uploads. The Worker independently checks the authenticated owner role.
  if(!localOnly&&typeof signedInUser!=="undefined"&&signedInUser?.role==="owner")fetch(ORIVANE_API_URL+"?action=orivane-report",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({codes:known,mode}),keepalive:true}).then(r=>{if(!r.ok)throw Error("Report upload failed");}).catch(()=>orivaneBrowserReport(["browser_report_upload_failed"],true));
}
// Check the actual message DOM, not merely the model's valid Markdown.
function orivaneUnclosedBold(text,repair=false){
  let fence=null,found=false;
  const result=String(text||"").split("\n").map(line=>{
    const f=line.match(/^\s*(\x60{3,}|~{3,})/);
    if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length)fence=null;return line;}
    if(fence||/^\s{4,}\S|^\t/.test(line))return line;
    let masked=line.replace(/(\x60+)(.*?)\1/g,m=>" ".repeat(m.length)).replace(/\\./g,m=>" ".repeat(m.length)).replace(/https?:\/\/[^\s<>]+/gi,m=>" ".repeat(m.length));
    const edits=[];
    // Preserve all matched emphasis, including recoverable asymmetric delimiters.
    masked=masked.replace(/(?<!\*)\*{3}[^*\n]+\*{3}(?!\*)/g,m=>" ".repeat(m.length));
    masked=masked.replace(/(?<!\*)(\*{1,2})([^\s*](?:[^*\n]*[^\s*])?)(\*{1,2})(?!\*)/g,(m,left,body,right,index)=>{
      if(left.length!==right.length){found=true;edits.push({start:index,end:index+m.length,value:"**"+line.slice(index+left.length,index+m.length-right.length)+"**"});}
      return " ".repeat(m.length);
    });
    let open=null;
    for(const run of masked.matchAll(/(?<!\*)\*{2,3}(?!\*)/g)){
      const i=run.index,n=run[0].length,before=masked[i-1]||"",after=masked[i+n]||"";
      if(open&&n===open[0].length&&before&&!/\s/.test(before)){open=null;continue;}
      if(!open&&(!before||/[\s([{:>"'—–-]/.test(before))&&after&&!/[\s*]/.test(after))open=run;
    }
    if(open){found=true;const i=line.trimEnd().length;edits.push({start:i,end:i,value:open[0]});}
    if(!repair)return line;
    for(const e of edits.sort((a,b)=>b.start-a.start))line=line.slice(0,e.start)+e.value+line.slice(e.end);
    return line;
  }).join("\n");
  return {found,text:result};
}

function orivaneRenderIssues(row,reply){
  const body=row?.querySelector(".assistant-message-content"),parsed=orivaneParseCard(reply);
  if(!body)return ["missing_body"];
  const source=String(parsed.text||"");
  if(/^\s*\x60\x60\x60orivane-ui\b/im.test(source))return [];
  const copy=body.cloneNode(true);
  copy.querySelectorAll("pre,code").forEach(node=>node.remove());
  const visible=copy.textContent||"";
  const issues=[];
  if(orivaneUnclosedBold(visible).found)issues.push("unclosed_bold");
  if(parsed.card&&!row.querySelector(".orivane-interactive-card"))issues.push("missing_card");
  if(/\[\/?ORIVANE_CARD\]/.test(visible))issues.push("raw_card");
  const prose=source.replace(/^\s*\x60\x60\x60[^\n]*\n[\s\S]*?(?:^\s*\x60\x60\x60[^\n]*$|(?![\s\S]))/gm,"").replace(/\x60[^\x60\n]+\x60/g,"").replace(/\\[\\*_[\]~]/g,"");
  for(const match of prose.matchAll(/(?:^|[^*])(\*\*[^*\r\n]+\*\*)(?!\*)/g)){
    if(visible.includes(match[1])){issues.push("raw_bold");break;}
  }
  return issues;
}
function orivaneCheckRenderedReply(row,reply){
  try{
    if(!orivaneRenderIssues(row,reply).length)return;
    orivaneBrowserReport(["browser_render_error"]);
    const body=row?.querySelector(".assistant-message-content"),parsed=orivaneParseCard(reply);
    if(body){body.replaceChildren();renderMessageText(body,orivaneUnclosedBold(parsed.text,true).text);}
    if(parsed.card&&!row?.querySelector(".orivane-interactive-card"))orivaneRenderCard(row,parsed.card);
    if(orivaneRenderIssues(row,reply).length)orivaneBrowserReport(["browser_render_unresolved"]);
  }catch{orivaneBrowserReport(["browser_runtime_error"]);}
}

function orivaneCheckReply(reply){
  const value=String(reply||"").trim(),codes=["browser_reply_checked"];
  if(/^(?:Error:\s*)?(?:The AI stream returned an empty response\.?|The AI returned an empty response\.?|The AI model did not return a response\.?|The response did not complete\.?|The live response was interrupted\.[\s\S]*)$/i.test(value))codes.push("browser_reply_error");
  const parsed=orivaneParseCard(value);
  if(parsed.invalid)codes.push("browser_invalid_card");
  if(orivaneUnclosedBold(parsed.text).found)codes.push("browser_unclosed_bold");
  orivaneBrowserReport(codes);
}
window.addEventListener("error",event=>{if(event.error)orivaneBrowserReport(["browser_runtime_error"]);});
window.addEventListener("unhandledrejection",()=>orivaneBrowserReport(["browser_runtime_error"]));

function orivaneStreamToken(packet){
  if(!packet||typeof packet!=="object")return "";
  if(typeof packet.response==="string")return packet.response;
  if(typeof packet.token==="string")return packet.token;
  if(packet.type==="response.output_text.delta"&&typeof packet.delta==="string")return packet.delta;
  const content=packet.choices?.[0]?.delta?.content;
  if(typeof content==="string")return content;
  if(Array.isArray(content))return content.filter(part=>part?.type==="text"||part?.type==="output_text").map(part=>typeof part.text==="string"?part.text:"").join("");
  if(packet.type==="content_block_delta"&&packet.delta?.type==="text_delta")return typeof packet.delta.text==="string"?packet.delta.text:"";
  return "";
}
function orivaneUsageLimit(status,code){
  if(code==="model_quota")return "ORIVANE has reached its daily free AI usage limit. Your prompt is kept in the composer for retry after the allocation resets.";
  if(Number(status)===429||code==="model_rate_limited")return "The AI provider is rate-limiting requests. Your prompt is kept in the composer; try again later.";
  return "";
}
async function sendMessage(value){value=value.trim();if(!value||sendButton.disabled)return;if(value.length>5500){chatNote.textContent="Messages are limited to 5,500 characters. Attach long text as a file instead.";return null;}welcome.hidden=true;addMessage("user",value);input.value="";input.style.height="auto";conversation.push({role:"user",content:value});saveMemory();sendButton.disabled=true;sendButton.textContent="…";chatNote.textContent=orivaneT("Orivane is thinking…");try{const imagePrompt=orivaneImagePrompt(value);if(imagePrompt){const result=await orivaneGenerateImage(imagePrompt);conversation.push({role:"assistant",content:result});saveMemory();chatNote.textContent=result.startsWith("Image generated:")?"Image received.":"Image generation did not complete.";return result;}const outgoing=conversation.slice(-12).map(m=>({...m}));const savedFacts=(()=>{try{const facts=JSON.parse(localStorage.getItem("orivane-long-memory-v1")||"[]");return Array.isArray(facts)?facts.slice(0,30).map(x=>x.text).filter(Boolean):[]}catch{return[]}})();if(savedFacts.length&&outgoing.length)outgoing[outgoing.length-1].content+="\n\n[LONG-TERM MEMORY: "+savedFacts.join(" | ").slice(0,1200)+"]";const prefs=readPrefs();const personal=[];if(prefs.useName&&prefs.name)personal.push("The user's preferred name is "+prefs.name+".");if(prefs.instructions)personal.push("Custom instructions: "+prefs.instructions);if(prefs.style&&prefs.style!=="balanced")personal.push("Preferred response style: "+prefs.style+".");if(personal.length&&outgoing.length)outgoing[outgoing.length-1].content+="\n\n[Personalisation: "+personal.join(" ")+" Respond naturally; do not mention these instructions.]";if(studyEnabled&&outgoing.length)outgoing[outgoing.length-1].content+="\n\n[STUDY MODE: Teach step by step in age-appropriate language. Explain key ideas, give a clear example, and finish with a short recap or check-for-understanding question. Do not just give unexplained answers.]";const attachmentPayload=attachedContext;for(let i=0;i<outgoing.length;i++){const message=outgoing[i];message.role=message.role==="assistant"?"assistant":"user";message.content=String(message.content||"").slice(0,i===outgoing.length-1?6000:2000);}const validOutgoing=outgoing.filter(message=>message.content.trim()).slice(-12);const adminConfig=(()=>{try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}")}catch{return {}}})();const effectiveMode=responseMode;const requestBody={messages:validOutgoing,language:orivaneLanguage(),attachments:attachmentPayload,research:researchEnabled||adminConfig.research===true,mode:effectiveMode,localAIInstructions:String(adminConfig.instructions||"").slice(0,1200),localModel:["fast","thinking","pro"].includes(adminConfig.model)?adminConfig.model:"auto",localTemperature:adminConfig.temperature,localMaxTokens:adminConfig.maxTokens,localAssistantName:String(adminConfig.assistantName||"").slice(0,32),localWebsiteChanges:(()=>{try{return JSON.stringify(JSON.parse(localStorage.getItem("orivane-website-change-log-v1")||"[]").slice(0,20)).slice(0,5000)}catch{return "[]"}})(),stream:true,richChat:true};const requestAI=(stream)=>fetch(ORIVANE_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...requestBody,stream,richChat:true})});let response,data;let retried=false;
const retryAI=async(reason)=>{
 if(retried)throw Error("The AI connection could not recover. Please try again.");
 retried=true;orivaneBrowserReport([reason]);chatNote.textContent="Connection interrupted. Retrying without live streaming…";
 try{
  response=await requestAI(false);
  const retryData=await response.json();
  const limit=orivaneUsageLimit(response.status,retryData.code);if(limit){const e=new Error(limit);e.orivaneUsageLimit=true;throw e;}
  if(!response.ok||typeof retryData.reply!=="string"||!retryData.reply.trim())throw Error(retryData.error||"The AI returned no answer.");
  orivaneBrowserReport(["browser_retry_ok"]);return retryData;
 }catch(error){orivaneBrowserReport(["browser_retry_failed"]);if(error.orivaneUsageLimit)throw error;throw Error("The AI could not reconnect. Your prompt is still available to retry.");}
};
try{response=await requestAI(true);}catch(error){data=await retryAI("browser_network_error");}
let sources=[];let websiteStatus=response.headers.get("X-Orivane-Visit-Status")||"not-requested";let searchStatus=response.headers.get("X-Orivane-Search-Status")||"not-needed";let streamedError="",streamedLimit="";let richDone=false;let richSeen=false;if(!data&&response.headers.get("content-type")?.includes("text/event-stream")){if(!response.ok||!response.body){data=await retryAI("browser_reply_error");}else{const streamRow=addMessage("assistant","");const streamContent=streamRow?.querySelector(".assistant-message-content");let streamedReply="";let buffer="";let previewCard=null;const reader=response.body.getReader();const decoder=new TextDecoder();const consumeLine=line=>{if(!line.startsWith("data:"))return;const raw=line.slice(5).trim();if(!raw||raw==="[DONE]")return;try{const packet=JSON.parse(raw);if(packet.orivaneEvent){richSeen=true;switch(packet.orivaneEvent){case "request-started":orivaneStatus(streamRow,"Preparing response…");break;case "website-started":orivaneStatus(streamRow,"Reading the supplied website…");break;case "website-status":websiteStatus=packet.status;break;case "search-started":orivaneStatus(streamRow,"Searching the web…");break;case "search-status":searchStatus=packet.status;sources=Array.isArray(packet.sources)?packet.sources:[];orivaneStatus(streamRow,searchStatus==="searched"?"✓ Web sources received":searchStatus==="billing-required"?"Web search requires billing setup":searchStatus==="no-results"?"No web results":"Web search unavailable");break;case "answer-started":orivaneStatus(streamRow,"Preparing answer…");break;case "done":richDone=true;break;case "error":streamedError=String(packet.message||"The response failed.");streamedLimit=orivaneUsageLimit(packet.status,packet.code);break;}}const token=orivaneStreamToken(packet);if(token){streamedReply+=token;const parsed=orivaneParseCard(streamedReply,true);if(streamContent)orivaneStreamPreview(streamContent,parsed.text);if(parsed.card&&!previewCard){previewCard=parsed.card;orivaneRenderCard(streamRow,previewCard,true);orivaneStatus(streamRow,"Question received…");}else if(!previewCard)orivaneStatus(streamRow,"Writing response…");}}catch{}};try{while(true){const part=await reader.read();if(part.done)break;buffer+=decoder.decode(part.value,{stream:true});const lines=buffer.split("\n");buffer=lines.pop()||"";for(const line of lines)consumeLine(line.replace(/\r$/,""));}buffer+=decoder.decode();if(buffer.trim())consumeLine(buffer.replace(/\r$/,""));}catch(streamError){streamedError="The live response was interrupted.";}finally{try{reader.releaseLock();}catch{}streamRow?.remove();}
if(streamedLimit)throw Error(streamedLimit);
if(streamedError||(richSeen&&!richDone)){data=await retryAI("browser_reply_error");}
else if(!streamedReply.trim()){data=await retryAI("browser_empty_stream");}
else{data={reply:streamedReply,webSearchStatus:searchStatus,webSources:sources,websiteVisitStatus:websiteStatus};}}}
else if(!data){try{data=await response.json();}catch{data=await retryAI("browser_reply_error");}
const limit=orivaneUsageLimit(response.status,data?.code);if(limit)throw Error(limit);
if(!retried&&(response.status>=500||(response.ok&&(typeof data.reply!=="string"||!data.reply.trim())))){data=await retryAI("browser_reply_error");}}if(!response.ok)throw new Error(data.error||"The AI service returned an error.");if(typeof data.reply!=="string"||!data.reply.trim())throw new Error("The AI returned an empty response.");const reply=data.reply;orivaneCheckReply(reply);conversation.push({role:"assistant",content:reply});saveMemory();const finalRow=addMessage("assistant",reply);orivaneCheckRenderedReply(finalRow,reply);requestAnimationFrame(()=>{if(finalRow?.isConnected)orivaneCheckRenderedReply(finalRow,reply);});orivaneStatus(finalRow,"✓ Response received");if(data.websiteVisitStatus==="visited")orivaneStatus(finalRow,"✓ Website read · Response received");else if(data.websiteVisitStatus==="unavailable")orivaneStatus(finalRow,"Website could not be read · Response received");orivaneSources(finalRow,data.webSources);if(attachmentPayload===attachedContext){attachedContext="";orivaneAttachmentNames=[];orivaneAttachmentLabel();}const searchState=data.webSearchStatus;if(researchEnabled||searchState&&searchState!=="not-needed"){const labels={searched:"Web search completed · check cited sources in the reply.",unavailable:"Live web search is temporarily unavailable.", "billing-required":"Live search needs Cloudflare AI Gateway billing or a provider API key.", "no-results":"Live search returned no usable results."};chatNote.textContent=labels[searchState]||"Research mode is on · search availability depends on the Worker.";}else{chatNote.textContent=orivaneT("AI responses can be wrong. Check important information.");}return reply;}catch(error){orivaneBrowserReport([error instanceof TypeError?"browser_network_error":"browser_reply_error"]);if(conversation.at(-1)?.role==="user")conversation.pop();saveMemory();if(!input.value.trim()){input.value=value;input.dispatchEvent(new Event("input",{bubbles:true}));}addMessage("assistant",error.message||"I couldn't reach the AI service. Please try again.");chatNote.textContent="Connection issue — please try again in a moment.";return null;}finally{sendButton.disabled=false;sendButton.textContent="↑";content.scrollIntoView({behavior:"smooth",block:"end"});}}
let voiceModeActive=false,voiceRecognition=null,voiceFinalText="",voiceListening=false;
const voicePanel=document.getElementById("voiceMode"),voiceStatus=document.getElementById("voiceModeStatus"),voiceTranscript=document.getElementById("voiceTranscript"),voiceListenButton=document.getElementById("voiceListen"),voiceSendButton=document.getElementById("voiceSend"),voiceOrb=document.getElementById("voiceOrb");
function setVoiceStatus(message,state=""){voiceStatus.textContent=message;voiceOrb.classList.toggle("is-listening",state==="listening");voiceOrb.classList.toggle("is-speaking",state==="speaking");}
function startVoiceListening(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){setVoiceStatus("Speech recognition isn't supported here. Try Chrome.");return;}if(!voiceModeActive||voiceListening)return;try{voiceRecognition=new SR();voiceRecognition.lang=navigator.language||"en-US";voiceRecognition.continuous=true;voiceRecognition.interimResults=true;voiceRecognition.maxAlternatives=1;voiceListening=true;voiceListenButton.textContent="■ Stop listening";setVoiceStatus("Listening… speak naturally.", "listening");voiceRecognition.onresult=e=>{let interim="";for(let i=e.resultIndex;i<e.results.length;i++){const phrase=e.results[i][0]?.transcript||"";if(e.results[i].isFinal)voiceFinalText+=(voiceFinalText?" ":"")+phrase.trim();else interim+=phrase;}voiceTranscript.textContent=(voiceFinalText+" "+interim).trim()||"Listening…";voiceSendButton.disabled=!voiceFinalText.trim();};voiceRecognition.onerror=e=>{voiceListening=false;voiceListenButton.textContent="🎙 Start listening";setVoiceStatus("Microphone issue: "+e.error+". Try starting again.");};voiceRecognition.onend=()=>{voiceListening=false;voiceListenButton.textContent="🎙 Start listening";if(voiceModeActive&&voiceStatus.textContent.startsWith("Listening"))setVoiceStatus("Paused. Send your message or start listening again.");};voiceRecognition.start();}catch{voiceListening=false;voiceListenButton.textContent="🎙 Start listening";setVoiceStatus("Couldn't start the microphone. Check browser permission.");}}
function stopVoiceListening(){if(voiceRecognition){try{voiceRecognition.stop();}catch{}voiceRecognition=null;}voiceListening=false;voiceListenButton.textContent="🎙 Start listening";voiceOrb.classList.remove("is-listening");}
function speakVoiceReply(text){return new Promise(resolve=>{if(!("speechSynthesis" in window)){resolve();return;}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=navigator.language||"en-US";utterance.rate=1.6;utterance.onstart=()=>setVoiceStatus("ORIVANE is speaking…","speaking");utterance.onend=()=>resolve();utterance.onerror=()=>resolve();window.speechSynthesis.speak(utterance);});}
function closeVoiceMode(){voiceModeActive=false;stopVoiceListening();if("speechSynthesis"in window)window.speechSynthesis.cancel();voicePanel.hidden=true;setVoiceStatus("Voice mode closed.");}
document.getElementById("voiceInput")?.addEventListener("click",()=>{voiceModeActive=true;voiceFinalText="";voiceTranscript.textContent="Your speech will appear here…";voiceSendButton.disabled=true;voicePanel.hidden=false;setVoiceStatus("Tap Start listening when you're ready.");});
document.getElementById("voiceModeClose")?.addEventListener("click",closeVoiceMode);
voiceListenButton?.addEventListener("click",()=>{if(voiceListening)stopVoiceListening();else startVoiceListening();});
voiceSendButton?.addEventListener("click",async()=>{const spoken=voiceFinalText.trim();if(!spoken)return;stopVoiceListening();voiceFinalText="";voiceTranscript.textContent="Sending: "+spoken;voiceSendButton.disabled=true;setVoiceStatus("ORIVANE is thinking…");const reply=await sendMessage(spoken);if(!voiceModeActive)return;if(reply){await speakVoiceReply(reply);}if(voiceModeActive){voiceTranscript.textContent="Ready for your next message.";startVoiceListening();}});
form.addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value);});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,160)+"px";});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
document.querySelectorAll("[data-prompt]").forEach(button=>button.addEventListener("click",()=>sendMessage(button.dataset.prompt)));
document.getElementById("newChat").addEventListener("click",()=>{conversation.length=0;content.replaceChildren();if(memoryEnabled)localStorage.removeItem(MEMORY_KEY);welcome.hidden=false;chatNote.textContent=orivaneT("New conversation started.");input.value="";sidebar.classList.remove("open");document.getElementById("currentPage").textContent="Chat";window.scrollTo({top:0,behavior:"smooth"});});
const desktopSidebarQuery=window.matchMedia("(min-width: 801px)");
if(localStorage.getItem("orivane-sidebar-collapsed")==="true"&&desktopSidebarQuery.matches)document.body.classList.add("sidebar-collapsed");
document.getElementById("menuButton").setAttribute("aria-label","Toggle navigation");
document.getElementById("menuButton").setAttribute("title","Collapse or open navigation");
document.getElementById("menuButton").addEventListener("click",()=>{
 if(desktopSidebarQuery.matches){
  const collapsed=document.body.classList.toggle("sidebar-collapsed");
  localStorage.setItem("orivane-sidebar-collapsed",String(collapsed));
 }else{
  sidebar.classList.toggle("open");
 }
});
document.getElementById("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("orivane-theme",document.body.classList.contains("light")?"light":"dark");});
if(localStorage.getItem("orivane-theme")==="light")document.body.classList.add("light");
document.querySelectorAll(".side-link").forEach(button=>button.addEventListener("click",()=>{if(button.dataset.view!=="chat"){chatNote.textContent=button.dataset.view==="projects"?"Projects workspace opened.":"Saved ideas are planned for a future update.";setTimeout(()=>{if(chatNote.textContent.includes("planned for a future update"))chatNote.textContent="Orivane can make mistakes. Check important information.";},3500);}else document.getElementById("currentPage").textContent="Chat";document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b===button));sidebar.classList.remove("open");}));
document.getElementById("memoryButton").addEventListener("click",()=>{memoryEnabled=!memoryEnabled;localStorage.setItem(MEMORY_FLAG,String(memoryEnabled));if(memoryEnabled){saveMemory();chatNote.textContent="Memory on: this device will remember up to 30 recent messages.";}else{localStorage.removeItem(MEMORY_KEY);chatNote.textContent="Memory off: saved conversation data was cleared from this device.";}renderMemoryButton();});
document.getElementById("emojiButton").addEventListener("click",()=>{const emoji=emojiChoices[Math.floor(Math.random()*emojiChoices.length)];const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.value=input.value.slice(0,start)+emoji+input.value.slice(end);input.focus();input.setSelectionRange(start+emoji.length,start+emoji.length);input.dispatchEvent(new Event("input"));});
renderMemoryButton();restoreMemory();

/* Profile and personalisation settings */
const PREF_KEY="orivane-preferences-v1",PROFILE_KEY="orivane-profile-v1";
const readPrefs=()=>{try{return JSON.parse(localStorage.getItem(PREF_KEY)||"{}")}catch{return {}}};
function openDialog(id){document.getElementById(id).hidden=false;document.body.classList.add("dialog-open");}
function closeDialog(id){document.getElementById(id).hidden=true;if(!document.querySelector(".overlay:not([hidden])"))document.body.classList.remove("dialog-open");}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeDialog(b.dataset.close)));
document.querySelectorAll(".overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)closeDialog(o.id);}));
let profileMode="register";
let signedInUser=null;
const authUrl="https://nexus-ai-api.jessicaridelle.workers.dev/";
 async function authIframeRequest(action,values={},method="POST"){
  const url=new URL(authUrl);url.searchParams.set("action",action);
  const options={method,credentials:"include",cache:"no-store"};
  if(method!=="GET"){const body=new URLSearchParams();for(const [key,value] of Object.entries(values))body.set(key,String(value));options.headers={"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"};options.body=body.toString();}
  let response;
  try{response=await fetch(url.toString(),options);}catch(error){console.warn("ORIVANE account network request failed:",error);throw new Error("Secure account connection failed. Please check your connection and reload.");}
  let data={};try{data=await response.json();}catch{}
  if(!response.ok)throw new Error(data.error||"Secure account request failed ("+response.status+").");
  return data;
 }
 function profileStatus(message){document.getElementById("profileStatus").textContent=message;}
function setProfileMode(mode){profileMode=mode;document.getElementById("profileSubmit").textContent=mode==="register"?"Create account":"Sign in";document.getElementById("profilePassword").autocomplete=mode==="register"?"new-password":"current-password";document.getElementById("profileModeSwitch").textContent=mode==="register"?"Already have an account? Sign in":"Need an account? Create one";profileStatus(mode==="register"?"Create a username and a password of at least 10 characters.":"Enter your username and password to sign in.");}
function showSignedIn(user){signedInUser=user;localStorage.setItem(PROFILE_KEY,user.username);document.getElementById("profileOpen").textContent=user.username;document.getElementById("profileSignout").hidden=false;document.getElementById("profileSubmit").hidden=true;document.getElementById("profileModeSwitch").hidden=true;document.getElementById("profileName").value=user.username;document.getElementById("profileName").disabled=true;document.getElementById("profilePassword").hidden=true;profileStatus("Signed in as "+user.username+(user.role==="owner"?" · Owner account":"")+".");window.dispatchEvent(new CustomEvent("orivane-auth-updated",{detail:{user}}));}
async function checkAuth(){try{const d=await authIframeRequest("auth-me",{},"GET");if(d.authenticated&&d.user)showSignedIn(d.user);}catch(error){console.warn("ORIVANE account status could not be checked:",error.message);}}
document.getElementById("profileOpen").addEventListener("click",()=>{document.getElementById("profileName").value=localStorage.getItem(PROFILE_KEY)||"";openDialog("profileOverlay");if(signedInUser)showSignedIn(signedInUser);else setProfileMode("register");});
document.getElementById("profileModeSwitch").addEventListener("click",()=>setProfileMode(profileMode==="register"?"login":"register"));
document.getElementById("profileForm").addEventListener("submit",async e=>{e.preventDefault();const username=document.getElementById("profileName").value.trim(),password=document.getElementById("profilePassword").value;const button=document.getElementById("profileSubmit");button.disabled=true;profileStatus(profileMode==="register"?"Creating your account…":"Signing in…");try{const d=await authIframeRequest(profileMode==="register"?"auth-register":"auth-login",{username,password});if(!d.ok||!d.user)throw new Error(d.error||"Authentication failed.");document.getElementById("profilePassword").value="";showSignedIn(d.user);}catch(err){profileStatus(err.message||"The account request failed. Please try again.");}finally{button.disabled=false;}});
document.getElementById("profileSignout").addEventListener("click",async()=>{try{await authIframeRequest("auth-logout",{});}catch(error){profileStatus(error.message);}signedInUser=null;localStorage.removeItem(PROFILE_KEY);document.getElementById("profileOpen").textContent="Profile / Sign in";document.getElementById("profileName").disabled=false;document.getElementById("profilePassword").hidden=false;document.getElementById("profileSubmit").hidden=false;document.getElementById("profileModeSwitch").hidden=false;document.getElementById("profileSignout").hidden=true;setProfileMode("login");window.dispatchEvent(new CustomEvent("orivane-auth-updated",{detail:{user:null}}));});
document.getElementById("googleSignin").addEventListener("click",()=>profileStatus("Google sign-in is waiting for the ORIVANE Google OAuth credentials. No account was created."));
checkAuth();
function loadSettings(){const p=readPrefs();document.getElementById("appLanguage").value=orivaneLanguagePreference();document.getElementById("displayName").value=p.name||"";document.getElementById("customInstructions").value=p.instructions||"";document.getElementById("responseStyle").value=p.style||"balanced";document.getElementById("useName").checked=!!p.useName;document.getElementById("themeChoice").value=localStorage.getItem("orivane-theme")||"dark";document.getElementById("memorySetting").checked=memoryEnabled;}
document.getElementById("settingsOpen").addEventListener("click",()=>{loadSettings();openDialog("settingsOverlay");});
document.querySelectorAll("[data-settings-tab]").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll("[data-settings-tab]").forEach(t=>t.classList.toggle("active",t===tab));document.querySelectorAll("[data-settings-pane]").forEach(p=>p.hidden=p.dataset.settingsPane!==tab.dataset.settingsTab);}));
function hasOffensivePreferredName(value){
  const normal=value.normalize("NFKD").toLowerCase().replace(/[\\u0300-\\u036f]/g,"").replace(/[0@]/g,"o").replace(/[1!|]/g,"i").replace(/[3]/g,"e").replace(/[4]/g,"a").replace(/[5$]/g,"s").replace(/[7]/g,"t").replace(/[^a-z]/g,"");
  const blocked=["fuck","shit","bitch","bastard","asshole","motherfucker","cunt","nigger","nigga","fag","faggot","retard","whore","slut"];
  return blocked.some(word=>normal.includes(word));
}
document.getElementById("saveSettings").addEventListener("click",()=>{const p={name:document.getElementById("displayName").value.trim(),instructions:document.getElementById("customInstructions").value.trim(),style:document.getElementById("responseStyle").value,useName:document.getElementById("useName").checked};if(hasOffensivePreferredName(p.name)){document.getElementById("settingsStatus").textContent="Please choose a respectful preferred name. That name can't be saved.";return;}localStorage.setItem(PREF_KEY,JSON.stringify(p));localStorage.setItem(ORIVANE_LANG_KEY,document.getElementById("appLanguage").value);orivaneApplyLanguage();const theme=document.getElementById("themeChoice").value;document.body.classList.toggle("light",theme==="light");localStorage.setItem("orivane-theme",theme);memoryEnabled=document.getElementById("memorySetting").checked;localStorage.setItem(MEMORY_FLAG,String(memoryEnabled));if(!memoryEnabled)localStorage.removeItem(MEMORY_KEY);else saveMemory();renderMemoryButton();document.getElementById("settingsStatus").textContent=orivaneT("Saved!");setTimeout(()=>document.getElementById("settingsStatus").textContent=orivaneT("Changes save on this device."),1800);});
document.getElementById("clearMemory").addEventListener("click",()=>{localStorage.removeItem(MEMORY_KEY);conversation.length=0;content.replaceChildren();document.getElementById("settingsStatus").textContent="Saved chat memory cleared.";});
const savedProfile=localStorage.getItem(PROFILE_KEY);if(savedProfile)document.getElementById("profileOpen").textContent=savedProfile;


/* ORIVANE power tools */
const researchButton=document.getElementById("researchMode"),studyButton=document.getElementById("studyMode");
function setMode(button,on,label){button.setAttribute("aria-pressed",String(on));button.classList.toggle("mode-active",on);button.classList.toggle("tool-card-active",on);button.title=label+(on?" is enabled":" is disabled");}
researchButton?.addEventListener("click",()=>{researchEnabled=!researchEnabled;setMode(researchButton,researchEnabled,"⌕ Research");chatNote.textContent=researchEnabled?"Research mode on: this message will request live web search when available.":"Research mode off.";});
studyButton?.addEventListener("click",()=>{studyEnabled=!studyEnabled;setMode(studyButton,studyEnabled,"▤ Study");chatNote.textContent=studyEnabled?"Study mode on: explanations will be step-by-step with examples and a recap.":"Study mode off.";});
document.getElementById("commandPaletteOpen")?.addEventListener("click",()=>openDialog("commandPaletteOverlay"));
document.querySelectorAll("[data-command]").forEach(b=>b.addEventListener("click",()=>{const prefix=b.dataset.command;input.value=(input.value.trim()?input.value.trim()+"\n\n":"")+prefix;input.focus();input.dispatchEvent(new Event("input"));closeDialog("commandPaletteOverlay");}));
document.getElementById("attachTextButton")?.addEventListener("click",()=>document.getElementById("attachTextInput").click());
let orivaneAttachmentNames=[];
function orivaneAttachmentLabel(){const bar=document.getElementById("orivaneAttachmentTray");if(!bar)return;bar.replaceChildren();bar.hidden=!attachedContext;if(attachedContext){bar.append(document.createTextNode(orivaneAttachmentNames.join(", ")+" · "+attachedContext.length.toLocaleString()+" characters · sent with next message"),orivaneArtifactButton("Remove",()=>{attachedContext="";orivaneAttachmentNames=[];orivaneAttachmentLabel();}));}}
async function orivaneAttachFiles(files){if(!files.length)return;const accepted=[],names=[];let size=0,skipped=0;for(const file of Array.from(files).slice(0,100)){const path=file.webkitRelativePath||file.name;if(!/\.(txt|md|csv|json|log|html?|css|js|ts|jsx|tsx|py|xml|yaml|yml|sql|ini|toml|java|cpp|c|h|rs|go|sh|svg)$/i.test(file.name)||/(^|\/)(\.git|node_modules|\.env|secrets?)(\/|\.|$)/i.test(path)||file.size>500000||size>=12000){skipped++;continue;}try{const value=await file.text();if(!value.trim()||value.includes("\u0000")){skipped++;continue;}const part="\n--- "+path.replace(/[\r\n]/g," ")+" ---\n"+value;const remain=12000-size;if(part.length>remain)skipped++;accepted.push(part.slice(0,remain));size+=Math.min(part.length,remain);names.push(path);}catch{skipped++;}}
if(!accepted.length){chatNote.textContent="No supported text files found. Images and binary files are not included.";return;}attachedContext=accepted.join("");orivaneAttachmentNames=names;orivaneAttachmentLabel();chatNote.textContent="Ready to attach "+names.length+" text file(s). Contents will be sent to the AI when you send a message."+(skipped||files.length>100?" Some files or text were skipped to respect the limit.":"");}
document.getElementById("attachTextInput")?.addEventListener("change",async e=>{await orivaneAttachFiles(e.target.files||[]);e.target.value="";});
(()=>{const tools=form.querySelector(".composer-tools");if(!tools)return;const tray=document.createElement("div");tray.id="orivaneAttachmentTray";tray.className="orivane-attachment-tray";tray.hidden=true;form.prepend(tray);const file=document.getElementById("attachTextInput");if(file){file.multiple=true;file.accept=".txt,.md,.csv,.json,.log,.html,.css,.js,.ts,.jsx,.tsx,.py,.xml,.yaml,.yml,.sql,.ini,.toml,.java,.cpp,.c,.h,.rs,.go,.sh,.svg";}
const folder=document.createElement("input");folder.type="file";folder.multiple=true;folder.setAttribute("webkitdirectory","");folder.hidden=true;form.append(folder);folder.addEventListener("change",async()=>{await orivaneAttachFiles(folder.files||[]);folder.value="";});
const picker=document.createElement("div");picker.className="orivane-chat-tools";const addTool=(label,title,action)=>{const b=orivaneArtifactButton(label,action);b.title=title;picker.append(b);return b;};addTool("+ File","Attach text or code files",()=>file?.click());addTool("Folder","Attach text files from a folder",()=>folder.click());addTool("Image","Create an image directly in chat",()=>{input.value="/image "+input.value.replace(/^\/image\s*/i,"");input.focus();input.dispatchEvent(new Event("input"));});const web=addTool("Web","Toggle live research for the next answer",()=>researchButton?.click());const sync=()=>{web.setAttribute("aria-pressed",String(researchEnabled));web.classList.toggle("mode-active",researchEnabled);};researchButton?.addEventListener("click",sync);window.addEventListener("orivane-admin-settings-updated",sync);sync();form.insertBefore(picker,form.querySelector(".composer-bottom"));document.getElementById("newChat")?.addEventListener("click",()=>{attachedContext="";orivaneAttachmentNames=[];orivaneAttachmentLabel();});})();



/* ORIVANE WIP access gate — verified against the server-side Early Access entitlement */
(()=>{
 const API="https://nexus-ai-api.jessicaridelle.workers.dev/";
 let gateOverlay=null,gateFeature=null;
 function buildGate(){
  if(gateOverlay)return;
  const overlay=document.createElement("div");overlay.className="wip-access-overlay";overlay.id="wipAccessOverlay";overlay.hidden=true;
  const modal=document.createElement("section");modal.className="wip-access-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","wipAccessTitle");
  const close=document.createElement("button");close.type="button";close.className="wip-access-close";close.setAttribute("aria-label","Close");close.textContent="×";
  const mark=document.createElement("div");mark.className="wip-access-mark";mark.textContent="⚙";
  const eyebrow=document.createElement("span");eyebrow.className="early-access-kicker";eyebrow.textContent="ORIVANE · EXPERIMENTAL FEATURE";
  const title=document.createElement("h2");title.id="wipAccessTitle";title.textContent="Work in Progress";
  const message=document.createElement("p");message.className="wip-access-message";
  const note=document.createElement("p");note.className="wip-access-note";note.textContent="This feature is still being built and may contain bugs or incomplete parts. Early Access lets you try WIP features before their public release.";
  const buy=document.createElement("button");buy.type="button";buy.className="early-access-buy";buy.textContent="Get Early Access · €0.99";
  const foot=document.createElement("small");foot.className="wip-access-foot";foot.textContent="One-time payment · No subscription · Features may become public later.";
  const hide=()=>{overlay.hidden=true;document.body.style.overflow="";};
  close.addEventListener("click",hide);overlay.addEventListener("click",e=>{if(e.target===overlay)hide();});
  buy.addEventListener("click",()=>{hide();document.getElementById("earlyAccessOpen")?.click();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)hide();});
  modal.append(close,mark,eyebrow,title,message,note,buy,foot);overlay.append(modal);document.body.append(overlay);gateOverlay=overlay;gateFeature=message;
 }
 window.orivaneWipGate=async function(feature,onGranted){
  try{
   const response=await fetch(API+"?action=early-access-status",{credentials:"include",cache:"no-store"});
   const data=await response.json();
   if(response.ok&&data.earlyAccess===true){if(typeof onGranted==="function")onGranted();return true;}
  }catch(error){console.warn("ORIVANE WIP access check unavailable:",error);}
  buildGate();gateFeature.textContent=(feature||"This feature")+" is currently in Work in Progress and is available only to verified Early Access members.";
  gateOverlay.hidden=false;document.body.style.overflow="hidden";return false;
 };
})();
 
/* ORIVANE Early Access UI — checkout opens only when server secrets are configured */
(()=>{
 const overlay=document.getElementById("earlyAccessOverlay");
 const open=document.getElementById("earlyAccessOpen");
 const close=document.getElementById("earlyAccessClose");
 const buy=document.getElementById("earlyAccessBuy");
 const status=document.getElementById("earlyAccessAccountStatus");
 if(!overlay||!open||!close||!buy||!status)return;
 const api="https://nexus-ai-api.jessicaridelle.workers.dev/";
 const returned=new URLSearchParams(location.search).get("early_access");
 function show(){overlay.hidden=false;document.body.style.overflow="hidden";refresh();}
 function hide(){overlay.hidden=true;document.body.style.overflow="";}
 async function refresh(){
  status.textContent="Checking secure account and purchase status…";
  buy.disabled=true;buy.textContent="Checking checkout…";
  try{
   const r=await fetch(api+"?action=early-access-status",{credentials:"include",cache:"no-store"});
   const d=await r.json();
   if(!r.ok)throw new Error(d.error||"Status unavailable.");
   status.textContent=d.authenticated?(d.earlyAccess?"✓ Early Access is active on this account.":"Signed in as "+d.username+". No verified Early Access purchase is linked to this account."):"Sign in to link Early Access to your ORIVANE account.";
   if(returned==="success"&&!d.earlyAccess)status.textContent="Stripe returned you successfully. Waiting for the secure payment confirmation to activate Early Access — refresh in a moment.";
   if(d.checkoutReady){
    buy.disabled=!d.authenticated||d.earlyAccess;
    buy.textContent=d.earlyAccess?"Early Access unlocked":"Get Early Access · €0.99";
   }else{
    buy.disabled=true;buy.textContent="Checkout not configured yet";
   }
  }catch{
   status.textContent="Secure purchase verification is not available right now. No payment status could be confirmed.";
   buy.disabled=true;buy.textContent="Checkout unavailable";
  }
 }
 async function startCheckout(){
  if(buy.disabled)return;
  buy.disabled=true;buy.textContent="Opening secure checkout…";
  status.textContent="Creating your secure Stripe Checkout session…";
  try{
   const r=await fetch(api+"?action=early-access-checkout",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:"{}"});
   const d=await r.json();
   if(!r.ok||!d.checkoutUrl)throw new Error(d.error||"Checkout couldn't be started.");
   location.assign(d.checkoutUrl);
  }catch(error){
   status.textContent=error&&error.message?error.message:"Checkout couldn't be started. Try again.";
   buy.disabled=false;buy.textContent="Try checkout again · €0.99";
  }
 }
 open.addEventListener("click",show);close.addEventListener("click",hide);
 buy.addEventListener("click",startCheckout);
 overlay.addEventListener("click",e=>{if(e.target===overlay)hide();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)hide();});
 window.orivaneEarlyAccess={refresh,hasAccess:async()=>{try{const r=await fetch(api+"?action=early-access-status",{credentials:"include",cache:"no-store"});const d=await r.json();return !!(r.ok&&d.earlyAccess===true);}catch{return false;}}};
 if(returned==="success"||returned==="cancelled")show();
})();

/* Apply after all initial UI controls exist. Preserve English source strings when switching. */
window.addEventListener("DOMContentLoaded",orivaneApplyLanguage,{once:true});

window.addEventListener("languagechange",()=>{if(orivaneLanguagePreference()==="auto")orivaneApplyLanguage();});
