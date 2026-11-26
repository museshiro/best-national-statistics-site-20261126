// Indonesia in Numbers — charts.js
// Hand-rolled SVG chart builders. No library, no network. Every builder
// returns an SVG string with a fixed viewBox so it scales from a 1280 px
// desktop to a 390 px phone without clipping. Data points carry a <title>
// and a data-tip attribute for the tooltip in app.js.

var CHART_COLORS = ["#0e6b7a", "#e07b39", "#2e9e6b", "#c44569", "#7a5fb5", "#b5892e", "#4a7fb5", "#8a9a5b"];
var GRID = "#d7dee3";
var AXIS = "#5a6b76";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmt(n, dec) {
  var d = (dec === undefined) ? 1 : dec;
  return Number(n).toFixed(d).replace(/\.0$/, "");
}

function niceMax(max) {
  if (max <= 0) return 1;
  var p = Math.pow(10, Math.floor(Math.log10(max)));
  var m = max / p;
  var n = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10;
  return n * p;
}

function chartShell(w, h, inner) {
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" preserveAspectRatio="xMidYMid meet">' + inner + "</svg>";
}

// Line chart. labels: x labels, values: numbers, opts: {unit, decimals,
// color, ymin, area, endLabel}.
function lineChart(labels, values, opts) {
  var o = opts || {};
  var W = 560, H = 260, L = 46, R = 56, T = 14, B = 30;
  var dec = (o.decimals === undefined) ? 2 : o.decimals;
  var min = (o.ymin !== undefined) ? o.ymin : Math.min(0, Math.min.apply(null, values));
  var max = niceMax(Math.max.apply(null, values) * 1.08);
  if (max <= min) max = min + 1;
  var iw = W - L - R, ih = H - T - B;
  function X(i) { return L + (iw * i) / (labels.length - 1); }
  function Y(v) { return T + ih - ((v - min) / (max - min)) * ih; }
  var s = "";
  var ticks = 4;
  for (var t = 0; t <= ticks; t++) {
    var v = min + ((max - min) * t) / ticks;
    var y = Y(v);
    s += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + (W - R) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    s += '<text x="' + (L - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + AXIS + '">' + fmt(v, dec) + "</text>";
  }
  var pts = values.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
  if (o.area) {
    s += '<polygon points="' + L + "," + Y(min) + " " + pts + " " + X(values.length - 1).toFixed(1) + "," + Y(min) + '" fill="' + (o.color || CHART_COLORS[0]) + '" opacity="0.12"/>';
  }
  s += '<polyline points="' + pts + '" fill="none" stroke="' + (o.color || CHART_COLORS[0]) + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
  values.forEach(function (v, i) {
    var lab = labels[i] + ": " + fmt(v, dec) + (o.unit ? " " + o.unit : "");
    s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4" fill="#fff" stroke="' + (o.color || CHART_COLORS[0]) + '" stroke-width="2.5" data-tip="' + esc(lab) + '"><title>' + esc(lab) + "</title></circle>";
  });
  labels.forEach(function (lab, i) {
    if (labels.length > 12 && i % 2 === 1) return;
    s += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '">' + esc(lab) + "</text>";
  });
  var last = values[values.length - 1];
  s += '<text x="' + (W - R + 6) + '" y="' + (Y(last) + 4).toFixed(1) + '" font-size="12" font-weight="700" fill="' + (o.color || CHART_COLORS[0]) + '">' + fmt(last, dec) + (o.unit ? o.unit : "") + "</text>";
  return chartShell(W, H, s);
}

// Dual line chart (two series on one axis).
function dualLineChart(labels, a, b, opts) {
  var o = opts || {};
  var W = 560, H = 260, L = 46, R = 60, T = 14, B = 30;
  var all = a.concat(b);
  var min = Math.min.apply(null, all), max = niceMax(Math.max.apply(null, all) * 1.08);
  var iw = W - L - R, ih = H - T - B;
  function X(i) { return L + (iw * i) / (labels.length - 1); }
  function Y(v) { return T + ih - ((v - min) / (max - min)) * ih; }
  var s = "";
  for (var t = 0; t <= 4; t++) {
    var v = min + ((max - min) * t) / 4;
    var y = Y(v);
    s += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + (W - R) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '"/>';
    s += '<text x="' + (L - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + AXIS + '">' + fmt(v, 1) + "</text>";
  }
  function series(vals, color, name, unit) {
    var pts = vals.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
    var out = '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>';
    vals.forEach(function (v, i) {
      var lab = labels[i] + " — " + name + ": " + fmt(v, 2) + (unit || "%");
      out += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2" data-tip="' + esc(lab) + '"><title>' + esc(lab) + "</title></circle>";
    });
    return out;
  }
  s += series(a, CHART_COLORS[0], o.nameA || "Series A");
  s += series(b, CHART_COLORS[1], o.nameB || "Series B");
  labels.forEach(function (lab, i) {
    if (i % 3 !== 0 && i !== labels.length - 1) return;
    s += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '">' + esc(lab) + "</text>";
  });
  s += '<text x="' + (W - R + 6) + '" y="' + (Y(a[a.length - 1]) + 4).toFixed(1) + '" font-size="12" font-weight="700" fill="' + CHART_COLORS[0] + '">' + fmt(a[a.length - 1], 2) + "%</text>";
  s += '<text x="' + (W - R + 6) + '" y="' + (Y(b[b.length - 1]) + 4).toFixed(1) + '" font-size="12" font-weight="700" fill="' + CHART_COLORS[1] + '">' + fmt(b[b.length - 1], 2) + "%</text>";
  return chartShell(W, H, s);
}

// Vertical columns. labels, values; opts {unit, decimals, color, highlightLast}.
function columnChart(labels, values, opts) {
  var o = opts || {};
  var W = 560, H = 260, L = 52, R = 14, T = 16, B = 30;
  var dec = (o.decimals === undefined) ? 0 : o.decimals;
  var max = niceMax(Math.max.apply(null, values) * 1.1);
  var iw = W - L - R, ih = H - T - B;
  var bw = iw / labels.length;
  var s = "";
  for (var t = 0; t <= 4; t++) {
    var v = (max * t) / 4;
    var y = T + ih - (ih * t) / 4;
    s += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + (W - R) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '"/>';
    s += '<text x="' + (L - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + AXIS + '">' + fmt(v, dec) + "</text>";
  }
  values.forEach(function (v, i) {
    var bh = (v / max) * ih;
    var x = L + i * bw + bw * 0.16;
    var col = (o.highlightLast && i === values.length - 1) ? CHART_COLORS[1] : (o.color || CHART_COLORS[0]);
    var lab = labels[i] + ": " + fmt(v, dec) + (o.unit ? " " + o.unit : "");
    s += '<rect x="' + x.toFixed(1) + '" y="' + (T + ih - bh).toFixed(1) + '" width="' + (bw * 0.68).toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + col + '" data-tip="' + esc(lab) + '"><title>' + esc(lab) + "</title></rect>";
    if (bw > 44) {
      s += '<text x="' + (x + bw * 0.34).toFixed(1) + '" y="' + (T + ih - bh - 5).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#33414c">' + fmt(v, dec) + "</text>";
    }
    s += '<text x="' + (x + bw * 0.34).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '">' + esc(labels[i]) + "</text>";
  });
  return chartShell(W, H, s);
}

// Grouped columns for two series (exports vs imports).
function groupedColumnChart(labels, a, b, opts) {
  var o = opts || {};
  var W = 560, H = 260, L = 52, R = 14, T = 16, B = 30;
  var max = niceMax(Math.max.apply(null, a.concat(b)) * 1.1);
  var iw = W - L - R, ih = H - T - B;
  var bw = iw / labels.length;
  var s = "";
  for (var t = 0; t <= 4; t++) {
    var v = (max * t) / 4;
    var y = T + ih - (ih * t) / 4;
    s += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + (W - R) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '"/>';
    s += '<text x="' + (L - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + AXIS + '">' + fmt(v, 0) + "</text>";
  }
  labels.forEach(function (lab, i) {
    var x = L + i * bw;
    var w2 = bw * 0.32;
    var h1 = (a[i] / max) * ih, h2 = (b[i] / max) * ih;
    s += '<rect x="' + (x + bw * 0.14).toFixed(1) + '" y="' + (T + ih - h1).toFixed(1) + '" width="' + w2.toFixed(1) + '" height="' + h1.toFixed(1) + '" rx="2" fill="' + CHART_COLORS[0] + '" data-tip="' + esc(lab + " exports: US$" + a[i] + "bn") + '"><title>' + esc(lab + " exports: US$" + a[i] + "bn") + "</title></rect>";
    s += '<rect x="' + (x + bw * 0.50).toFixed(1) + '" y="' + (T + ih - h2).toFixed(1) + '" width="' + w2.toFixed(1) + '" height="' + h2.toFixed(1) + '" rx="2" fill="' + CHART_COLORS[1] + '" data-tip="' + esc(lab + " imports: US$" + b[i] + "bn") + '"><title>' + esc(lab + " imports: US$" + b[i] + "bn") + "</title></rect>";
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '">' + esc(lab) + "</text>";
  });
  return chartShell(W, H, s);
}

// Horizontal bars. items: [{label, value}]; opts {unit, decimals, max}.
function hbarChart(items, opts) {
  var o = opts || {};
  var W = 560, rowH = 30, T = 8, B = 8, L = 170, R = 64;
  var H = T + B + items.length * rowH;
  var dec = (o.decimals === undefined) ? 1 : o.decimals;
  var max = o.max || niceMax(Math.max.apply(null, items.map(function (d) { return d.value; })) * 1.08);
  var s = "";
  items.forEach(function (d, i) {
    var y = T + i * rowH;
    var w = ((W - L - R) * d.value) / max;
    var col = CHART_COLORS[i % CHART_COLORS.length];
    var lab = d.label + ": " + fmt(d.value, dec) + (o.unit ? " " + o.unit : "");
    s += '<text x="' + (L - 8) + '" y="' + (y + 15) + '" text-anchor="end" font-size="12" fill="#33414c">' + esc(d.label) + "</text>";
    s += '<rect x="' + L + '" y="' + (y + 3) + '" width="' + Math.max(w, 2).toFixed(1) + '" height="16" rx="3" fill="' + col + '" data-tip="' + esc(lab) + '"><title>' + esc(lab) + "</title></rect>";
    s += '<text x="' + (L + w + 6).toFixed(1) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="#33414c">' + fmt(d.value, dec) + (o.unit ? o.unit : "") + "</text>";
  });
  return chartShell(W, H, s);
}

// Donut chart with a centre label and a legend.
function donutChart(items, opts) {
  var o = opts || {};
  var W = 560, H = 250, cx = 130, cy = 125, r = 88, ir = 52;
  var total = items.reduce(function (a, d) { return a + d.value; }, 0);
  var s = "";
  var a0 = -Math.PI / 2;
  items.forEach(function (d, i) {
    var frac = d.value / total;
    var a1 = a0 + frac * Math.PI * 2;
    var large = frac > 0.5 ? 1 : 0;
    function pt(a, rr) { return (cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1); }
    s += '<path d="M ' + pt(a0, r) + " A " + r + " " + r + " 0 " + large + " 1 " + pt(a1, r) + " L " + pt(a1, ir) + " A " + ir + " " + ir + " 0 " + large + " 0 " + pt(a0, ir) + ' Z" fill="' + CHART_COLORS[i % CHART_COLORS.length] + '" data-tip="' + esc(d.label + ": " + fmt(d.value, 1) + "%") + '"><title>' + esc(d.label + ": " + fmt(d.value, 1) + "%") + "</title></path>";
    a0 = a1;
  });
  s += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="22" font-weight="800" fill="#12303d">' + esc(o.centre || "") + "</text>";
  s += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '">' + esc(o.centreSub || "") + "</text>";
  items.forEach(function (d, i) {
    var y = 30 + i * 30;
    s += '<rect x="250" y="' + (y - 10) + '" width="12" height="12" rx="2" fill="' + CHART_COLORS[i % CHART_COLORS.length] + '"/>';
    s += '<text x="268" y="' + y + '" font-size="12" fill="#33414c">' + esc(d.label) + " — " + fmt(d.value, 1) + "%</text>";
  });
  return chartShell(W, H, s);
}

// Scatter: items [{x, y, label, size}]; opts {xLabel, yLabel, xUnit, yUnit}.
function scatterChart(items, opts) {
  var o = opts || {};
  var W = 560, H = 280, L = 56, R = 20, T = 14, B = 34;
  var xs = items.map(function (d) { return d.x; }), ys = items.map(function (d) { return d.y; });
  var xmin = 0, xmax = niceMax(Math.max.apply(null, xs) * 1.1);
  var ymin = 0, ymax = niceMax(Math.max.apply(null, ys) * 1.1);
  var iw = W - L - R, ih = H - T - B;
  function X(v) { return L + ((v - xmin) / (xmax - xmin)) * iw; }
  function Y(v) { return T + ih - ((v - ymin) / (ymax - ymin)) * ih; }
  var s = "";
  for (var t = 0; t <= 4; t++) {
    var xv = xmin + ((xmax - xmin) * t) / 4;
    var yv = ymin + ((ymax - ymin) * t) / 4;
    s += '<line x1="' + X(xv).toFixed(1) + '" y1="' + T + '" x2="' + X(xv).toFixed(1) + '" y2="' + (T + ih) + '" stroke="' + GRID + '"/>';
    s += '<line x1="' + L + '" y1="' + Y(yv).toFixed(1) + '" x2="' + (W - R) + '" y2="' + Y(yv).toFixed(1) + '" stroke="' + GRID + '"/>';
    s += '<text x="' + X(xv).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '">' + fmt(xv, 0) + "</text>";
    s += '<text x="' + (L - 6) + '" y="' + (Y(yv) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + AXIS + '">' + fmt(yv, 0) + "</text>";
  }
  items.forEach(function (d, i) {
    var lab = d.label + ": pop. " + fmt(d.x, 1) + "m, GRDP Rp" + fmt(d.y, 0) + "tn";
    s += '<circle cx="' + X(d.x).toFixed(1) + '" cy="' + Y(d.y).toFixed(1) + '" r="' + (d.size || 10) + '" fill="' + CHART_COLORS[i % CHART_COLORS.length] + '" opacity="0.75" data-tip="' + esc(lab) + '"><title>' + esc(lab) + "</title></circle>";
    s += '<text x="' + (X(d.x) + 12).toFixed(1) + '" y="' + (Y(d.y) + 4).toFixed(1) + '" font-size="11" fill="#33414c">' + esc(d.label) + "</text>";
  });
  s += '<text x="' + (L + iw / 2) + '" y="' + (H - 22 + 12) + '" text-anchor="middle" font-size="11" fill="' + AXIS + '"></text>';
  return chartShell(W, H, s);
}
