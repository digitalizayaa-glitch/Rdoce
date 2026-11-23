# Sitio web R Doce

Sitio de R Doce S.A. (mecánica de precisión, Alajuela, Costa Rica). HTML, CSS y
JavaScript sin frameworks, dentro de `página web R doce/`. Responder siempre en
español.

## Público y prioridades de diseño

- El sitio lo usan sobre todo **señores y personas adultas, desde el celular**.
- Prioridad en todo cambio: **diseño para celular primero, escalable, accesible
  e intuitivo** para ese público.
  - Texto legible: cuerpo de 16 px como mínimo en celular; nada por debajo de
    12–13 px, ni siquiera en etiquetas.
  - Botones y enlaces grandes: área táctil de 48 × 48 px como mínimo.
  - Buen contraste, acciones claras con texto (no solo íconos), sin gestos
    escondidos.
  - Animaciones cortas y discretas que nunca demoren la lectura; respetar
    `prefers-reduced-motion`.
- Probar cada cambio en ancho de celular (unos 390 px) además de escritorio.

## Cómo presentar propuestas

Cuando se pidan propuestas o variantes de diseño, entregar **archivos HTML
independientes**: `index-1.html`, `index-2.html`, `index-3.html`, uno por
propuesta, cada uno con todo incluido (CSS, JS e imágenes adentro) para abrirlo
directamente. No armar páginas de comparación ni selectores dentro del sitio.

## Estructura

- `config.js`: datos de contacto (WhatsApp, correo, ubicación, redes), estilo de
  animación y botones flotantes. Lo cargan todas las páginas.
- `animaciones.js`: animaciones de entrada, aparición al bajar y contadores.
  Estilo elegido: **Taller, intensidad media**.
- `interacciones.js`: animación del menú del celular (☰ / ✕), efecto al tocar
  botones y enlaces (se ponen rojos con un pequeño "pop" y la página cambia
  tras ~130 ms) y un pequeño "pop" en el lugar de los botones flotantes al
  entrar a Contacto (los flotantes no tienen animación de aparición).
- Imágenes en WebP: `img/r12-logo.webp` (logo recortado al óvalo) e
  `img/certificacion/iso-9001.webp`.
- `movil.css`: legibilidad y accesibilidad (tamaños mínimos, áreas táctiles,
  contraste) y el encabezado del celular. Se carga en todas las páginas
  después de su CSS propio y usa `!important` a propósito.
- El único contacto con botones son los flotantes (Correo / WhatsApp) de
  `config.js`. La franja "Hablemos de su proyecto" y los botones del pie se
  quitaron a pedido.
- Cada página tiene en su `<head>` un script corto que agrega `rd-cargando`
  (oculta el bloque principal hasta que `animaciones.js` lo prepara, máximo
  1,5 s). No quitarlo sin quitar también esa regla de `movil.css`.
