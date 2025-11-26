# 🏆 Espectador del Día - Widget para OBS

Widget estilo F1 que muestra en tiempo real el espectador con más mensajes en el chat de Twitch.

## 📋 Características

- ✅ Diseño inspirado en F1 "Driver of the Day"
- ✅ Conexión anónima al chat de Twitch (sin necesidad de autenticación)
- ✅ Actualización en tiempo real del espectador más activo
- ✅ Contador de mensajes desde que se inicia el widget
- ✅ Animaciones suaves al cambiar de líder
- ✅ Fondo transparente para OBS

## 🚀 Cómo usar en OBS

1. **Abrir OBS Studio**

2. **Añadir una fuente de navegador:**
   - Click en el botón `+` en "Fuentes"
   - Selecciona "Navegador"
   - Dale un nombre (ej: "Espectador del Día")

3. **Configurar la fuente:**
   - **URL**: Ruta completa al archivo `index.html`
     ```
     file:///D:/Drive/PCSOLUCION/Twitch/espectador del dia/index.html
     ```
   - **Ancho**: 1024
   - **Alto**: 576
   - ✅ Marcar "Actualizar navegador cuando la escena se vuelve activa"
   - ✅ Marcar "Controlar audio mediante OBS" (opcional)

4. **Click en OK** y ajusta la posición/tamaño en tu escena

## 🎨 Personalización

### Cambiar el canal de Twitch
Edita `script.js` línea 2:
```javascript
const CHANNEL_NAME = 'tu_canal_aqui';
```

### Ajustar colores
Edita `style.css` para cambiar el esquema de colores del fondo:
```css
background: linear-gradient(135deg, #1a2332 0%, #2d3e50 50%, #3a4f63 100%);
```

### Cambiar el tamaño del texto
En `style.css`, busca `.viewer-name` y ajusta el `font-size`:
```css
.viewer-name {
    font-size: 120px; /* Ajusta este valor */
}
```

## 🔧 Requisitos

- OBS Studio (versión 28.0 o superior recomendada)
- Conexión a Internet (para cargar tmi.js y las fuentes)

## 📊 Funcionamiento

1. El widget se conecta automáticamente al chat de Twitch del canal configurado
2. Cuenta los mensajes de cada usuario desde que se inicia
3. Actualiza en tiempo real mostrando siempre al usuario con más mensajes
4. Los contadores se reinician cada vez que se recarga la fuente en OBS

## 🐛 Solución de problemas

### El widget muestra "Cargando..." indefinidamente
- Verifica que el nombre del canal sea correcto
- Comprueba tu conexión a Internet
- Abre la consola del navegador en OBS (click derecho → Interactuar → F12) para ver errores

### No se actualiza el nombre
- Asegúrate de que hay actividad en el chat
- Verifica que la fuente esté activa en OBS
- Recarga la fuente del navegador

### El fondo no es transparente
- Asegúrate de NO marcar "Apagar fuente cuando no es visible" en las propiedades de la fuente

## 📝 Notas

- El widget usa conexión anónima (solo lectura) al chat de Twitch
- Los contadores se reinician cada vez que se recarga el widget
- El widget muestra el nombre tal como aparece en Twitch (con mayúsculas/minúsculas originales)

## 🎯 Canal configurado

**Canal actual**: [liiukiin](https://www.twitch.tv/liiukiin)

---

Creado con ❤️ para streams de Twitch
