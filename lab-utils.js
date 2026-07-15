window.IRT = (() => {
  "use strict";

  const colors = ["#438bd2", "#7b6be8", "#e3ad36", "#f46f5f", "#2aa89a"];

  function fmt(value, digits = 2) {
    const n = Number(value);
    return (n < 0 ? "−" : "") + Math.abs(n).toFixed(digits);
  }

  function logistic(x) {
    return 1 / (1 + Math.exp(-x));
  }

  function softmax(values) {
    const max = Math.max(...values);
    const exps = values.map(v => Math.exp(v - max));
    const total = exps.reduce((sum, value) => sum + value, 0);
    return exps.map(value => value / total);
  }

  function svgEl(tag, attrs = {}, text = "") {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (text) el.textContent = text;
    return el;
  }

  function setupChart(svg, options = {}) {
    const yMax = options.yMax || 1;
    const yTicks = options.yTicks || [0, .25, .5, .75, 1];
    const width = Math.max(520, svg.clientWidth || 700);
    const height = svg.clientHeight || 410;
    const margin = { top: 25, right: 18, bottom: 49, left: 52 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const xScale = x => margin.left + ((x + 4) / 8) * innerW;
    const yScale = y => margin.top + (1 - y / yMax) * innerH;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = "";
    const plot = svgEl("g");
    svg.appendChild(plot);

    yTicks.forEach(tick => {
      plot.appendChild(svgEl("line", {
        x1: margin.left, x2: width - margin.right,
        y1: yScale(tick), y2: yScale(tick),
        stroke: "#dcd9d0", "stroke-width": 1
      }));
      plot.appendChild(svgEl("text", {
        x: margin.left - 9, y: yScale(tick) + 4, "text-anchor": "end",
        fill: "#7c8495", "font-size": 10, "font-family": "system-ui"
      }, tick.toFixed(tick === 0 || tick === yMax ? 0 : 2)));
    });

    [-4,-3,-2,-1,0,1,2,3,4].forEach(tick => {
      plot.appendChild(svgEl("line", {
        x1: xScale(tick), x2: xScale(tick),
        y1: margin.top, y2: height - margin.bottom,
        stroke: tick === 0 ? "#b9b6ae" : "#ebe8e1",
        "stroke-width": tick === 0 ? 1.4 : 1
      }));
      plot.appendChild(svgEl("text", {
        x: xScale(tick), y: height - margin.bottom + 21, "text-anchor": "middle",
        fill: "#7c8495", "font-size": 10, "font-family": "system-ui"
      }, String(tick).replace("-", "−")));
    });

    plot.appendChild(svgEl("text", {
      x: margin.left + innerW / 2, y: height - 8, "text-anchor": "middle",
      fill: "#647087", "font-size": 11, "font-family": "system-ui", "font-weight": 750
    }, options.xLabel || "Habilidad θ"));

    return { width, height, margin, innerW, innerH, xScale, yScale, plot };
  }

  function path(points, xScale, yScale) {
    return points.map((point, index) =>
      `${index ? "L" : "M"}${xScale(point.x).toFixed(2)},${yScale(point.y).toFixed(2)}`
    ).join(" ");
  }

  function drawLine(plot, points, chart, color, width = 3.2) {
    plot.appendChild(svgEl("path", {
      d: path(points, chart.xScale, chart.yScale),
      fill: "none", stroke: color, "stroke-width": width,
      "stroke-linecap": "round", "stroke-linejoin": "round"
    }));
  }

  function drawVertical(chart, x, label, color = "#17233b", dashed = false) {
    chart.plot.appendChild(svgEl("line", {
      x1: chart.xScale(x), x2: chart.xScale(x),
      y1: chart.margin.top, y2: chart.height - chart.margin.bottom,
      stroke: color, "stroke-width": dashed ? 1.3 : 2.3,
      "stroke-dasharray": dashed ? "5 5" : ""
    }));
    chart.plot.appendChild(svgEl("text", {
      x: chart.xScale(x), y: chart.margin.top + 11, "text-anchor": "middle",
      fill: color, "font-size": 10, "font-family": "system-ui", "font-weight": 850
    }, label));
  }

  function updateProgress() {
    const bar = document.querySelector("[data-progress]");
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });

  return { colors, fmt, logistic, softmax, svgEl, setupChart, drawLine, drawVertical, updateProgress };
})();
