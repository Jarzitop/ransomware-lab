# Regalo — 6 meses 🌌

## Visual V2

La galaxia usa un campo estelar generado en `canvas`, estrellas con brillo irregular,
nebulosas CSS, parallax suave, estrellas fugaces ocasionales y una constelación que
se ilumina progresivamente al leer cartas. Respeta `prefers-reduced-motion`.

Sitio de una sola página. La experiencia empieza directamente en una portada tipo libro,
sin cuenta regresiva. Todo el contenido vive en **`data.js`** — no necesitas tocar el resto
de los archivos para personalizarlo. La portada avanza con clic/touch o con la tecla **Enter**.

## Qué falta antes de mandárselo

1. **Fotos** — pon 14 fotos (2 por carta) en `assets/fotos/` con los nombres
   indicados en `assets/fotos/LEEME.txt`. O cambia las rutas directamente en
   `data.js`, en el campo `fotos: [...]` de cada carta.

2. **Canciones** — en Spotify: abre la canción → Compartir → Copiar link.
   Pega ese link en el campo `spotifyUrl` de la carta correspondiente en
   `data.js`. Ejemplo:
   ```js
   spotifyUrl: "https://open.spotify.com/track/xxxxxxxxxxxx"
   ```
   Si lo dejas en `null`, esa carta simplemente no muestra reproductor.

3. **Revisa el puzzle** — al final de `data.js` están `RESPUESTA_FINAL` y
   `PISTAS`. Ahora mismo arman la respuesta de 7 letras **"TE ELIJO"** usando palabras
   reales de tus cartas (Trattoria, Juan Valdez, la empanada, Olivia, la
   energía de los pulgares, lo increíble de Ratatouille, y "levanto" de la
   última carta). Si quieres cambiar la respuesta o las pistas, edita ese
   bloque — cada pista tiene `revelaEnCarta` (qué carta la desbloquea al
   leerla) y `letra` (qué letra aporta, en el orden de `orden`).

4. **La carta final** (`CARTA_FINAL`) es un borrador mío basado en el tono
   de tus 7 cartas. Léela, cámbiala, hazla tuya — es lo más importante del
   sitio.

## Cómo agregar contenido después (al año, etc.)

Solo agrega un objeto nuevo al array `CARTAS` en `data.js`, con un `id`
nuevo y su `fecha`. La constelación se actualiza sola — no hay que tocar
ningún otro archivo.

## Cómo publicarlo (gratis, sin dominio)

1. Crea una cuenta en [vercel.com](https://vercel.com) (puedes usar tu
   cuenta de GitHub).
2. Sube esta carpeta a un repositorio de GitHub (o arrastra la carpeta
   directo en Vercel con "Add New Project" → sin necesidad de Git si usas
   la opción de subir carpeta).
3. Vercel detecta que es un sitio estático — dale "Deploy" sin cambiar
   ninguna configuración (no hay build step, es HTML/CSS/JS puro).
4. Te da un link tipo `tu-proyecto.vercel.app` — ese es el que le mandas.

## Estructura de archivos

```
index.html    → estructura de las 3 escenas
style.css     → toda la identidad visual
app.js        → toda la lógica/interacción
data.js       → TODO el contenido (esto es lo único que editas normalmente)
assets/fotos/ → tus 14 fotos van aquí
```
