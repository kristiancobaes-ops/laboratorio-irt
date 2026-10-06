window.IRTExamples = (() => {
  "use strict";

  const level = (name, detail, short = name) => ({ name, detail, short });
  const algebraReadings = [
    "El estudiante reconoce algunas operaciones, pero necesita apoyo para organizar la solución.",
    "El estudiante resuelve transformaciones conocidas, aunque puede perder el hilo del procedimiento.",
    "El estudiante coordina los pasos de una ecuación lineal y revisa su resultado.",
    "El estudiante resuelve y justifica transformaciones con flexibilidad."
  ];
  const oralReadings = [
    "El estudiante utiliza palabras o fragmentos y necesita apoyo para comunicar una idea.",
    "El estudiante comunica información sencilla, con pausas y recursos lingüísticos limitados.",
    "El estudiante desarrolla sus ideas y mantiene un intercambio comprensible.",
    "El estudiante se expresa con precisión, flexibilidad y matices."
  ];
  const writingReadings = [
    "El estudiante presenta enunciados aislados y pierde el hilo temático.",
    "El estudiante mantiene una idea central, aunque algunas conexiones quedan implícitas.",
    "El estudiante conecta y desarrolla ideas con una progresión generalmente clara.",
    "El estudiante organiza la progresión temática y utiliza conexiones precisas."
  ];
  const posterReadings = [
    "El estudiante presenta información aislada sin una explicación reconocible.",
    "El estudiante identifica la idea principal, pero algunas relaciones quedan sin explicar.",
    "El estudiante organiza las relaciones del proceso y las explica de forma comprensible.",
    "El estudiante integra texto e imágenes para explicar el proceso con precisión."
  ];
  const oralLevels = [
    level("Producción inicial", "Palabras aisladas o fragmentos; necesita apoyo constante.", "Inicial"),
    level("Comunicación básica", "Expresa información sencilla, aunque el intercambio es limitado.", "Básico"),
    level("Conversación funcional", "Sostiene el intercambio y comunica sus ideas principales.", "Funcional"),
    level("Desempeño competente", "Desarrolla respuestas, mantiene fluidez y repara dificultades.", "Competente"),
    level("Comunicación avanzada", "Se expresa con precisión, flexibilidad y matices.", "Avanzado")
  ];
  const writingLevels = [
    level("Fragmentario", "Enunciados aislados sin una idea central reconocible."),
    level("Idea reconocible", "Se identifica una idea, todavía poco organizada."),
    level("Idea central", "Mantiene el tema, con conexiones aún limitadas."),
    level("Desarrollo conectado", "Conecta y desarrolla las proposiciones."),
    level("Cohesión fluida", "La progresión es clara y las conexiones son precisas.")
  ];
  const posterLevels = [
    level("Información aislada", "No se reconoce una explicación del proceso.", "Aislado"),
    level("Idea identificable", "Presenta elementos relevantes, pero sin relaciones claras.", "Idea"),
    level("Secuencia comprensible", "Ordena las etapas principales del proceso.", "Secuencia"),
    level("Relaciones explicadas", "Explica cómo se conectan las etapas.", "Relaciones"),
    level("Explicación integrada", "Texto e imágenes explican las relaciones con precisión.", "Integrado")
  ];
  const oral = {
    key: "oral", label: "Examen oral de inglés", construct: "competencia oral en inglés",
    task: "Examen oral: explicar un plan y responder preguntas en inglés",
    description: "El estudiante explica qué hará el fin de semana y responde preguntas de seguimiento. Se evalúa su competencia comunicativa oral con una rúbrica, no si se siente seguro.",
    levels: oralLevels, readings: oralReadings,
    method: "Un estudiante puede ensayar una expresión sin estar seguro y formularla bien. Aquí las categorías califican su desempeño comunicativo, no su confianza al responder."
  };
  const writing = {
    key: "writing", label: "Coherencia de un párrafo", construct: "habilidad de coherencia escrita",
    task: "Escritura: explicar por qué el transporte público reduce la congestión",
    description: "El estudiante redacta un párrafo con una idea central, un desarrollo y conexiones. La rúbrica evalúa coherencia escrita; no cuenta respuestas correctas de opción múltiple.",
    levels: writingLevels, readings: writingReadings,
    method: "La rúbrica valora la organización del párrafo completo, no solamente una frase bien formulada."
  };
  const poster = {
    key: "poster", label: "Cartel explicativo de ciencias", construct: "habilidad de explicación científica",
    task: "Cartel: explicar las relaciones entre las etapas del ciclo del agua",
    description: "El estudiante elabora un cartel con texto e imágenes. Esta rúbrica se centra en la calidad de la explicación de un proceso, no en la belleza del diseño ni en múltiples rasgos independientes.",
    levels: posterLevels, readings: posterReadings,
    method: "La rúbrica valora la explicación de las relaciones del proceso completo, no solamente la presencia de un dato correcto."
  };
  const math = {
    key: "math", label: "Solución matemática con crédito parcial", construct: "habilidad algebraica",
    task: "Matemáticas: resolver 2x + 6 = 18 y justificar",
    description: "Se otorgan puntos por avances en el procedimiento, la solución y su justificación. No basta con marcar una alternativa ni con escribir únicamente el resultado.",
    levels: [
      level("Sin avance", "No presenta un procedimiento pertinente."),
      level("Procedimiento iniciado", "Identifica que debe aislar la incógnita."),
      level("Transformación correcta", "Obtiene 2x = 12 mediante una operación válida."),
      level("Solución correcta", "Obtiene x = 6."),
      level("Justificación completa", "Resuelve y justifica correctamente las transformaciones.")
    ], readings: algebraReadings,
    method: "La rúbrica otorga crédito por el procedimiento, el resultado y la justificación. Escribir x = 6 sin mostrar esos avances no da automáticamente la puntuación máxima."
  };
  const cases = {
    rasch: [
      {
        key: "choice", label: "Álgebra de opción múltiple", construct: "habilidad algebraica",
        task: "Opción múltiple: resolver 3(x − 2) = 12",
        description: "¿Cuánto vale x? A: 2 · B: 4 · C: 6 · D: 12. Se asigna 1 punto únicamente a C y 0 a las demás opciones. Estas opciones ilustran el ítem; no son una prueba para el lector.",
        levels: [level("0 · Incorrecto", "Marca una alternativa distinta de C."), level("1 · Correcto", "Marca C: x = 6.")],
        readings: algebraReadings, guessing: true,
        method: "La elección entre alternativas ofrece un mecanismo plausible de acierto sin dominio suficiente. Eso permite explorar 3PL, pero no obliga a elegirlo: la selección del modelo debe respaldarse con datos."
      },
      {
        key: "constructed", label: "Álgebra sin opciones: correcto/incorrecto", construct: "habilidad algebraica",
        task: "Respuesta abierta: resolver 2x + 6 = 18 sin opciones",
        description: "El estudiante escribe su respuesta. Este caso asigna 1 punto a x = 6 y 0 a cualquier otro resultado; no otorga crédito parcial por el procedimiento.",
        levels: [level("0 · Incorrecto", "No obtiene x = 6."), level("1 · Correcto", "Escribe x = 6.")],
        readings: algebraReadings, guessing: false,
        method: "En esta simulación comparamos Rasch y 2PL para una respuesta abierta con puntuación binaria. Para puntuar avances del procedimiento, conviene el ejemplo matemático de PCM."
      },
      {
        key: "listening", label: "Comprensión oral: criterio binario", construct: "habilidad de comprensión oral",
        task: "Comprensión oral: identificar la idea principal de una noticia",
        description: "Tras escuchar una noticia breve, el estudiante expresa su idea principal. Se asigna 1 si identifica la idea central definida en la clave del evaluador y 0 si no lo hace. Aquí no se califica fluidez ni se usan niveles de una rúbrica oral.",
        levels: [level("0 · Criterio no logrado", "No identifica la idea principal."), level("1 · Criterio logrado", "Identifica la idea principal esperada.")],
        readings: ["El estudiante reconoce palabras aisladas, pero pierde el sentido global.", "El estudiante identifica información explícita, aunque puede confundir la idea central con un detalle.", "El estudiante integra la información relevante para reconocer el sentido global.", "El estudiante comprende el sentido global y distingue los detalles secundarios."],
        guessing: false,
        method: "La respuesta se evalúa con un criterio binario, sin opciones ofrecidas. Para explorar niveles de producción oral, consulta la rúbrica de GRM."
      }
    ],
    pcm: [
      { ...math, levels: [math.levels[0], math.levels[1], math.levels[3], math.levels[4]] },
      { ...oral, levels: [oralLevels[0], oralLevels[1], oralLevels[2], oralLevels[4]] },
      { ...poster, levels: [posterLevels[0], posterLevels[1], posterLevels[2], posterLevels[4]] }
    ],
    gpcm: [writing, math, poster],
    grm: [oral, writing, poster]
  };

  function link(page, key, model) {
    const params = new URLSearchParams({ v: "accordion-nav-17", case: key });
    if (model) params.set("model", model);
    return `${page}.html?${params.toString()}#laboratorio`;
  }

  function initial(page) {
    const key = new URLSearchParams(window.location.search).get("case");
    return cases[page].find(example => example.key === key) || cases[page][0];
  }

  function setup(page) {
    const select = document.getElementById("caseSelect");
    cases[page].forEach(example => {
      const option = document.createElement("option");
      option.value = example.key;
      option.textContent = example.label;
      select.appendChild(option);
    });
    const example = initial(page);
    select.value = example.key;
    return example;
  }

  function names(example, first = 0) {
    return example.levels.map((item, i) => `${i + first} · ${item.name}`);
  }

  function describe(example, theta) {
    const index = theta < -1.5 ? 0 : theta < .5 ? 1 : theta < 2 ? 2 : 3;
    return example.readings[index];
  }

  function expectedReading(page, example, expected) {
    const first = page === "grm" ? 1 : 0;
    const last = first + example.levels.length - 1;
    return `Para la habilidad seleccionada y los parámetros actuales, el modelo predice un puntaje promedio de ${expected.toFixed(2)} puntos, en una escala de ${first} a ${last}.`;
  }

  function renderMethod(page, example, model) {
    if (page !== "rasch") return;
    let note = model === "3pl"
        ? "El 3PL permite estimar c (pseudoazar), la asíntota inferior de la curva de acierto. No es la probabilidad de que una persona esté adivinando ni una medida de su confianza."
        : "";
    note += `${note ? " " : ""}${example.method}`;
    if (example.guessing) {
      note += model === "3pl"
        ? " Cuatro opciones no implican automáticamente c (pseudoazar) = 0.25."
        : " Como comparación, el 3PL sí incorpora c (pseudoazar); puedes seleccionarlo para explorar este mismo caso.";
    } else {
      note += " El botón 3PL está bloqueado por la definición didáctica de este caso, no por una prohibición universal para las respuestas abiertas. Otras formulaciones para modelar explícitamente la respuesta al azar quedan fuera del alcance de este sitio.";
    }
    document.getElementById("caseMethod").textContent = note;
    const anchor = document.getElementById("caseLink");
    anchor.setAttribute("href", link("rasch", "choice", "3pl"));
    anchor.textContent = "Comparar con 3PL: correcto/incorrecto";
    anchor.hidden = page === "rasch" && example.guessing && model === "3pl";
    const related = document.getElementById("caseRelated");
    related.hidden = page !== "rasch" || example.guessing;
    related.setAttribute("href", example.key === "listening" ? link("grm", "oral") : link("pcm", "math"));
    related.textContent = example.key === "listening" ? "Ver rúbrica oral en GRM" : "Ver crédito parcial en PCM";
  }

  function render(page, example, model) {
    document.getElementById("taskTitle").textContent = example.task;
    document.getElementById("caseDescription").textContent = example.description;
    document.getElementById("thetaName").textContent = `θ (${example.construct})`;
    const help = document.getElementById("thetaContext");
    if (help) help.textContent = `Ajusta θ (${example.construct}) en una escala distinta de los puntajes del caso. θ = 0 es un punto de referencia: no significa ausencia de habilidad ni un puntaje de 0. No mide la seguridad subjetiva al responder.`;
    const accessibleHelp = document.getElementById("thetaHelp");
    if (accessibleHelp) accessibleHelp.textContent = `Nivel de ${example.construct} del estudiante hipotético.`;
    example.levels.slice(1).forEach((item, i) => {
      const step = document.getElementById(`d${i + 1}Context`);
      if (step) step.textContent = `${i}→${i + 1}: ${item.detail}`;
    });
    const rubric = document.getElementById("caseRubric");
    rubric.innerHTML = "";
    example.levels.forEach((item, i) => {
      const row = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = page === "rasch" ? item.name : `${page === "grm" ? "Nivel" : "Puntaje"} ${i + (page === "grm" ? 1 : 0)} · ${item.name}`;
      const detail = document.createElement("span");
      detail.textContent = item.detail;
      row.appendChild(title);
      row.appendChild(detail);
      const modeTag = document.createElement("span");
      modeTag.classList.add("case-mode-tag");
      modeTag.hidden = true;
      row.appendChild(modeTag);
      rubric.appendChild(row);
    });
    renderMethod(page, example, model);
    const otherLab = document.getElementById("otherCreditLab");
    if (otherLab) {
      const otherPage = page === "pcm" ? "gpcm" : "pcm";
      const matchingCase = cases[otherPage].find(item => item.key === example.key);
      const otherCase = matchingCase || cases[otherPage][0];
      otherLab.setAttribute("href", link(otherPage, otherCase.key));
      otherLab.textContent = `Ir al laboratorio ${otherPage.toUpperCase()}${matchingCase ? "" : " (otro caso)"}`;
    }
  }

  function renderResponse(page, example, probabilities) {
    const highest = Math.max(...probabilities);
    const winners = probabilities.map((probability, i) => ({ probability, i }))
      .filter(item => Math.abs(item.probability - highest) < 1e-12);
    const labels = page === "rasch" ? example.levels.map(item => item.name) : names(example, page === "grm" ? 1 : 0);
    const tied = winners.length > 1;
    const outcome = page === "rasch" ? "la respuesta" : page === "grm" ? "la calificación exacta" : "el puntaje";
    const criterion = page === "rasch" ? "Según el criterio del caso" : "Según la rúbrica, ese resultado describe";
    document.getElementById("rubricReading").textContent = tied
      ? `Con los parámetros actuales hay un empate: ${winners.map(item => labels[item.i]).join(" / ")} (${Math.round(highest * 100)}% cada uno). No hay un único resultado más probable; consulta los criterios de las tarjetas resaltadas.`
      : `Con los parámetros actuales, ${outcome} más probable es ${labels[winners[0].i]} (${Math.round(highest * 100)}%). ${criterion}: ${example.levels[winners[0].i].detail}`;
    document.getElementById("rubricNote").textContent = page === "grm"
      ? "Es una probabilidad de calificación exacta, incluso al ver curvas acumulativas: no es la probabilidad de alcanzar ese nivel o uno superior, ni una calificación observada o garantizada. El puntaje promedio esperado pondera los valores de las categorías por sus probabilidades; puede tener decimales y no es necesariamente la calificación más probable. No asigna automáticamente un nivel a θ."
      : page === "rasch"
        ? "El porcentaje es la probabilidad del resultado indicado, no un porcentaje de habilidad. Es una predicción del modelo, no una respuesta observada o garantizada. Se comparan dos resultados binarios; no se identifica la causa de un acierto o de un error."
        : "El porcentaje corresponde a obtener exactamente ese puntaje, no a obtenerlo o superarlo. El puntaje promedio esperado pondera todos los puntajes por sus probabilidades; puede tener decimales y no es necesariamente el puntaje más probable. Es una predicción del modelo, no un puntaje observado ni un nivel de habilidad garantizado.";
    Array.from(document.getElementById("caseRubric").children).forEach((row, i) => {
      const highlighted = winners.some(item => item.i === i);
      row.classList.toggle("is-most-likely", highlighted);
      const tag = row.children[row.children.length - 1];
      tag.hidden = !highlighted;
      tag.textContent = highlighted ? `${Math.round(probabilities[i] * 100)}% · ${tied ? "Empate: más probable" : "Más probable"}` : "";
    });
  }

  return { cases, setup, initial, names, describe, expectedReading, render, renderMethod, renderResponse, link };
})();
