
// Configuración
const CHANNEL_NAME = 'liiukiin';

// Lista de bots a excluir del conteo
const EXCLUDED_BOTS = [
    'wizebot',
    'nightbot',
    'streamelements',
    'streamlabs',
    'moobot',
    'fossabot',
    'botisimo',
    'streamhollow',
    'coebot',
    'deepbot',
    'ankhbot',
    'vivbot',
    'ohbot',
    'stay_hydrated_bot',
    'commanderroot',
    'soundalerts',
    'sery_bot',
    'lurxx',
    'virgoproz',
    'liiukiin'
];

// Verificar si tmi.js cargó
if (typeof tmi === 'undefined') {
    document.getElementById('viewerName').textContent = 'Error: tmi.js no cargó';
    throw new Error('tmi.js not loaded');
}

// Configuración del cliente de Twitch
const client = new tmi.Client({
    options: {
        debug: true,
        messagesLogLevel: "info"
    },
    connection: {
        reconnect: true,
        secure: true,
        timeout: 10000,
        reconnectDecay: 1.5,
        reconnectInterval: 1000
    },
    channels: ['#' + CHANNEL_NAME]
});

// Elementos del DOM
const viewerNameElement = document.getElementById('viewerName');
const messageCountElement = document.getElementById('messageCount');
const viewerRankElement = document.getElementById('viewerRank');
const widgetContainer = document.querySelector('.pit-lane-container');

// Configuración de timing del widget
const SHOW_DURATION = 45000; // 45 segundos visible
const CYCLE_INTERVAL = 405000; // 6 minutos 45 segundos (6 min oculto + 45 seg visible)

// Control de visibilidad del widget
function showWidget() {
    console.log('🎬 Mostrando widget...');

    // Actualizar datos antes de mostrar
    updateTopViewer();

    widgetContainer.classList.remove('hidden');
    widgetContainer.classList.remove('slide-out');
    widgetContainer.classList.add('slide-in');

    // Después de 45 segundos, ocultar el widget
    setTimeout(() => {
        hideWidget();
    }, SHOW_DURATION);
}

function hideWidget() {
    console.log('🎬 Ocultando widget...');
    widgetContainer.classList.remove('slide-in');
    widgetContainer.classList.add('slide-out');

    // Después de la animación, marcar como hidden
    setTimeout(() => {
        widgetContainer.classList.remove('slide-out');
        widgetContainer.classList.add('hidden');
    }, 800);
}

// Iniciar el ciclo de visibilidad
function startVisibilityCycle() {
    // Asegurar que empieza oculto
    widgetContainer.classList.add('hidden');

    // Esperar un momento antes de mostrar la primera vez
    setTimeout(() => {
        showWidget();
    }, 500);

    // Repetir cada 6 minutos 45 segundos
    setInterval(() => {
        showWidget();
    }, CYCLE_INTERVAL);
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Widget iniciado - DOM listo');
    startVisibilityCycle();
});

// Estado interno
let chatStats = new Map();
let topViewer = null;
let isConnected = false;
let lastShownUser = null; // Para evitar repetir el mismo usuario consecutivamente

// Cargar estadísticas guardadas (si la fecha coincide)
function loadSavedStats() {
    const stored = localStorage.getItem('viewerStats');
    if (!stored) return;
    try {
        const data = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) {
            // Restaurar datos
            chatStats = new Map(data.chatStats);
            topViewer = data.topViewer;
        } else {
            // Fecha distinta: iniciar limpio
            console.log('🔄 Nuevo día detectado al cargar, reiniciando estadísticas.');
            localStorage.removeItem('viewerStats');
        }
    } catch (e) {
        console.error('Error al leer datos guardados:', e);
    }
}

loadSavedStats();

// Conectar al chat
console.log(`🔌 Intentando conectar al canal: ${CHANNEL_NAME}...`);
client.connect()
    .then(() => {
        console.log('✅ Conexión iniciada correctamente');
    })
    .catch((error) => {
        console.error('❌ Error al conectar:', error);
    });

// Evento: Conexión exitosa
client.on('connected', (address, port) => {
    isConnected = true;
    console.log(`✅ Conectado al chat de ${CHANNEL_NAME} en ${address}:${port}`);
});

// Evento: Mensaje recibido
client.on('message', (channel, tags, message, self) => {
    const username = tags['display-name'] || tags['username'];

    // Filtrar bots
    if (EXCLUDED_BOTS.includes(username.toLowerCase())) {
        return;
    }

    const currentCount = chatStats.get(username) || 0;
    chatStats.set(username, currentCount + 1);
    console.log(`💬 Mensaje de ${username} (Total: ${currentCount + 1})`);

    saveStats();
});

// Función para seleccionar y mostrar un espectador aleatorio del Top 5
function updateTopViewer() {
    if (chatStats.size === 0) {
        updateUI('ESPECTADOR', 0, 1);
        lastShownUser = null;
        return;
    }

    // Convertir a array y ordenar
    const sortedViewers = Array.from(chatStats.entries())
        .sort((a, b) => b[1] - a[1]);

    // Tomar el top 5 (o menos si no hay 5)
    let top5 = sortedViewers.slice(0, 5);

    if (top5.length === 0) return;

    // Si hay más de un usuario, filtrar el último mostrado
    if (top5.length > 1 && lastShownUser) {
        const filtered = top5.filter(([username]) => username !== lastShownUser);
        // Solo usar la lista filtrada si tiene elementos
        if (filtered.length > 0) {
            top5 = filtered;
        }
    }

    // Seleccionar uno aleatorio
    const randomIndex = Math.floor(Math.random() * top5.length);
    const [username, count] = top5[randomIndex];

    // Encontrar el rango real en la lista completa ordenada
    const rank = sortedViewers.findIndex(([user]) => user === username) + 1;

    // Guardar el usuario mostrado para evitar repetición
    lastShownUser = username;

    updateUI(username, count, rank);
}

// Guardar estadísticas en localStorage
function saveStats() {
    const data = {
        chatStats: Array.from(chatStats.entries()),
        topViewer: topViewer,
        date: new Date().toISOString().split('T')[0]
    };
    try {
        localStorage.setItem('viewerStats', JSON.stringify(data));
    } catch (e) {
        console.error('Error guardando estadísticas en localStorage:', e);
    }
}

// Verificar cambio de día
function checkNewDay() {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('viewerStats');
    if (!stored) return;
    try {
        const data = JSON.parse(stored);
        if (data.date !== today) {
            console.log('🔄 Nuevo día detectado, reiniciando estadísticas.');
            chatStats.clear();
            topViewer = null;
            saveStats();
        }
    } catch (e) {
        console.error('Error al parsear datos para reset diario:', e);
    }
}
setInterval(checkNewDay, 60000);

// Función para actualizar la interfaz
function updateUI(username, messageCount, rank) {
    viewerNameElement.textContent = username;
    messageCountElement.textContent = messageCount;
    if (viewerRankElement) {
        viewerRankElement.textContent = rank;
    }

    console.log(`🏆 Mostrando: ${username} (Top ${rank}) con ${messageCount} mensajes`);
}

// Eventos de conexión
client.on('disconnected', (reason) => {
    isConnected = false;
    console.log(`❌ Desconectado: ${reason}`);
});

client.on('reconnect', () => {
    console.log('🔄 Reconectando...');
});

client.on('error', (error) => {
    console.error('❌ Error:', error);
});
