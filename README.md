# Regalo — 6 meses · V3

Sitio estático HTML/CSS/JS. La V3 prioriza estética espacial, rendimiento y microinteracciones.

## Cambios V3

- Se eliminó el loop propio que repintaba cientos de estrellas cada frame.
- Fondo con **tsParticles Slim** (CDN), limitado a 30–45 FPS según dispositivo.
- Fallback CSS si el CDN no carga.
- Parallax agrupado con `requestAnimationFrame` en lugar de escribir estilos por cada evento del mouse.
- Constelación con jerarquía visual mayor y áreas de clic grandes.
- Zoom inmersivo con Web Animations API; se ejecuta **una sola vez** y queda persistido.
- 4 easter eggs que desbloquean poemas.
- Portada y poemas con estética de papel físico + tipografía Caveat.
- Estado extendido sin romper el progreso previo de `localStorage`.

## Probar desde cero

Si el navegador ya guardó las 7 cartas como leídas, abre una sola vez:

```text
https://jarzitop.github.io/ransomware-lab/?reset=1
```

El parámetro borra el estado local y luego desaparece de la URL.

## Archivos

```text
index.html
style.css
app.js
data.js
assets/fotos/   # todavía pendiente
```

## Fotos

`data.js` espera dos fotos por carta:

```text
assets/fotos/mes0-1.jpg
assets/fotos/mes0-2.jpg
...
assets/fotos/mes6-2.jpg
```

## Canciones

Cada objeto de `CARTAS` tiene `spotifyUrl: null`. Pega ahí el enlace de Spotify cuando se defina una canción significativa para ese mes.

## Poemas secretos

Los 4 borradores están en `POEMAS` dentro de `data.js`:

- Oda a tu cuerpo
- Oda a tu cerebro
- Oda a tu corazón
- Oda a ti

La lógica no depende del texto, así que pueden reescribirse después sin tocar `app.js`.

## Easter eggs

1. Una marca diminuta en la portada.
2. Una nebulosa casi invisible que responde a la atención.
3. Una estrella pequeña que necesita una segunda señal.
4. Una estrella fugaz especial que aparece de vez en cuando.

## Dependencia externa

Se usa `@tsparticles/engine@4` + `@tsparticles/slim@4` desde jsDelivr. Si falla el CDN, el fondo espacial sigue funcionando con el fallback CSS.
