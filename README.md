# Laboratorio IRT

Sitio interactivo para explicar modelos de la Teoria de Respuesta al Item:

- Rasch / 1PL, 2PL y 3PL
- PCM
- GPCM
- GRM

El laboratorio usa ejemplos academicos, controles interactivos y lecturas dinamicas para interpretar parametros como theta, dificultad, umbrales, discriminacion y azar/adivinacion.

Cada pagina de modelo incluye tres casos seleccionables con su tarea, criterios de puntuacion, interpretaciones y etiquetas de los graficos. Al cambiar de caso se restablecen los parametros hipoteticos; al alternar PCM/GPCM dentro de un mismo caso se conservan la persona y los umbrales.

Los ejemplos son simulaciones didacticas, no instrumentos validados. El control de pseudoazar se explora en 3PL con el caso de opcion multiple. Rasch/1PL y 2PL no estiman c (pseudoazar): en la ecuacion general se fija en 0. PCM, GPCM y GRM estandar no estiman c (pseudoazar), porque no forma parte de su formulacion. Esto no significa que una respuesta afortunada sea imposible. Otros modelos o extensiones para representar explicitamente la respuesta al azar quedan fuera del alcance de este sitio. Los enlaces a 3PL son comparaciones con puntuacion correcto/incorrecto, no extensiones de los modelos politomicos.

Los enlaces a casos usan `case`, y la pagina logistica admite `model`: por ejemplo, `rasch.html?case=choice&model=3pl#laboratorio` o `grm.html?case=oral#laboratorio`.

## Como verlo

Abre `index.html` en el navegador o publica el repositorio con GitHub Pages desde la rama `main`.

