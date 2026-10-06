# Laboratorio IRT

Sitio interactivo para explicar modelos de la Teoria de Respuesta al Item:

- Rasch / 1PL, 2PL y 3PL
- PCM
- GPCM
- GRM

El laboratorio usa ejemplos academicos, controles interactivos y lecturas dinamicas para interpretar parametros como theta, dificultad, umbrales, discriminacion y azar/adivinacion.

Cada pagina de modelo incluye tres casos seleccionables con su tarea, criterios de puntuacion, interpretaciones y etiquetas de los graficos. Al cambiar de caso se restablecen los parametros hipoteticos; al alternar PCM/GPCM dentro de un mismo caso se conservan la persona y los umbrales.

Los ejemplos son simulaciones didacticas, no instrumentos validados. El control de pseudoazar se explora en 3PL con el caso de opcion multiple. En los casos abiertos se explica por que no se usa en esta simulacion; esto no constituye una prohibicion universal. PCM, GPCM y GRM conservan sus formulaciones estandar sin un parametro de pseudoazar.

Los enlaces a casos usan `case`, y la pagina logistica admite `model`: por ejemplo, `rasch.html?case=choice&model=3pl#laboratorio` o `grm.html?case=oral#laboratorio`.

## Como verlo

Abre `index.html` en el navegador o publica el repositorio con GitHub Pages desde la rama `main`.

