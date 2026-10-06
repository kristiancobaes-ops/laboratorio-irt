# Laboratorio IRT

Sitio interactivo para explicar modelos de la Teoria de Respuesta al Item:

- Rasch / 1PL, 2PL y 3PL
- PCM
- GPCM
- GRM

El laboratorio usa ejemplos academicos, controles interactivos y lecturas dinamicas para interpretar parametros como theta, dificultad, umbrales, discriminacion y azar/adivinacion.

Cada pagina de modelo incluye tres casos seleccionables con su tarea, criterios de puntuacion, interpretaciones y etiquetas de los graficos. Al cambiar de caso se restablecen los parametros hipoteticos. PCM y GPCM tienen laboratorios separados: PCM conserva a (discriminacion) fija en 1 y GPCM permite explorar una discriminacion propia del item. El enlace entre laboratorios cambia de pagina y abre el mismo contexto si esta disponible; de lo contrario indica que se abre otro caso. La pagina de destino carga su propia rubrica y valores iniciales, por lo que no es una comparacion controlada con la misma persona y umbrales.

Los ejemplos son simulaciones didacticas, no instrumentos validados. El control de pseudoazar se explora en 3PL con el caso de opcion multiple. Rasch/1PL y 2PL no estiman c (pseudoazar): en la ecuacion general se fija en 0. PCM, GPCM y GRM estandar no estiman c (pseudoazar), porque no forma parte de su formulacion. Esto no significa que una respuesta afortunada sea imposible. Otros modelos o extensiones para representar explicitamente la respuesta al azar quedan fuera del alcance de este sitio. Los enlaces a 3PL son comparaciones con puntuacion correcto/incorrecto, no extensiones de los modelos politomicos.

Los enlaces a casos usan `case`, y la pagina logistica admite `model`: por ejemplo, `rasch.html?case=choice&model=3pl#laboratorio` o `grm.html?case=oral#laboratorio`.

Cada laboratorio muestra al inicio la respuesta o calificacion exacta mas probable. Los criterios de puntuacion aparecen encima de la grafica principal y resaltan esa respuesta; si hay empate se muestran todas las opciones igualmente probables. En GRM este resumen se calcula con categorias exactas, incluso al ver curvas acumulativas. Rasch/1PL, 2PL y 3PL muestran dos resultados binarios, no niveles de una rubrica.

Las restricciones de parametros se presentan en tarjetas rojas junto a los fundamentos de cada modelo; PCM, GPCM y GRM no repiten la nota de c debajo del caso. La pagina logistica conserva las aclaraciones necesarias sobre la eleccion del modelo segun la tarea. Todas las paginas incluyen un explorador flotante de secciones, con indicador de ubicacion y enlaces internos. En pantallas amplias ocupa el margen lateral; en las demas se inicia plegado. Conserva el desplazamiento normal, respeta movimiento reducido y ajusta el espacio de los destinos a la altura del encabezado. Las comparaciones ocultas no aparecen en el explorador.

## Como verlo

Abre `index.html` en el navegador o publica el repositorio con GitHub Pages desde la rama `main`.

