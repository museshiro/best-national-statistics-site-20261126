// Indonesia in Numbers — app.js
// All interactivity, offline and synchronous on DOMContentLoaded:
// theme toggle, year filter, tabs, sortable tables, live search,
// chart/table toggle, SVG tooltips and hash routing (#tab= / #yr=).
// No fetch, no network, no modules: classic scripts only.

(function () {
  "use strict";

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  // ---------- theme ----------
  var root = document.documentElement;
  var savedTheme = null;
  try { savedTheme = window.localStorage.getItem("iin-theme"); } catch (e) { savedTheme = null; }
  if (savedTheme === "dark") root.setAttribute("data-theme", "dark");
  function setTheme(t) {
    if (t === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { window.localStorage.setItem("iin-theme", t); } catch (e) {}
    var b = $("#theme-toggle");
    if (b) b.textContent = (t === "dark") ? "☀ Light" : "◐ Dark";
  }
  var themeBtn = $("#theme-toggle");
  if (themeBtn) {
    themeBtn.textContent = (root.getAttribute("data-theme") === "dark") ? "☀ Light" : "◐ Dark";
    themeBtn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  // ---------- table builder (chart <-> table toggle) ----------
  function tableHtml(headers, rows) {
    var h = '<table class="data-table"><thead><tr>';
    headers.forEach(function (x) { h += "<th>" + esc(x) + "</th>"; });
    h += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (c) { h += "<td>" + esc(c) + "</td>"; });
      h += "</tr>";
    });
    return h + "</tbody></table>";
  }

  function idxOf(year) { return YEARS.indexOf(year); }

  // ---------- chart registry: id -> {svg, table} ----------
  var CHARTS = {
    "growth-mini": {
      svg: function () { return lineChart(["2019", "2020", "2021", "2022", "2023", "2024"], YEARLY.gdpGrowth.slice(4), { unit: "%", decimals: 2, ymin: -3 }); },
      table: function () { return tableHtml(["Year", "Real GDP growth (%)"], YEARS.slice(4).map(function (y, i) { return [String(y), YEARLY.gdpGrowth[i + 4].toFixed(2)]; })); }
    },
    "sectors-donut": {
      svg: function () {
        var top = SECTORS.slice(0, 5).map(function (d) { return { label: d.name, value: d.share }; });
        var rest = SECTORS.slice(5).reduce(function (a, d) { return a + d.share; }, 0);
        top.push({ label: "All other sectors", value: Math.round(rest * 10) / 10 });
        return donutChart(top, { centre: "19.0%", centreSub: "manufacturing" });
      },
      table: function () { return tableHtml(["Sector", "Share of GDP 2024 (%)"], SECTORS.map(function (d) { return [d.name, d.share.toFixed(1)]; })); }
    },
    "prov-bar": {
      svg: function () { return hbarChart(PROV_POP.slice(0, 6).map(function (d) { return { label: d.name, value: d.pop }; }), { unit: "m", decimals: 1 }); },
      table: function () { return tableHtml(["Province", "Population 2024 (million)"], PROV_POP.slice(0, 6).map(function (d) { return [d.name, d.pop.toFixed(3)]; })); }
    },
    "fx-line": {
      svg: function () { return lineChart(FX_YEARS.map(String), FX_AVG, { unit: "", decimals: 0, ymin: 13000 }); },
      table: function () { return tableHtml(["Year", "Rp per US$ (annual average)"], FX_YEARS.map(function (y, i) { return [String(y), FX_AVG[i].toLocaleString("en-US")]; })); }
    },
    "gdp-nominal": {
      svg: function () { return columnChart(YEARS.map(String), YEARLY.gdpNominal, { unit: "", decimals: 0, highlightLast: true }); },
      table: function () { return tableHtml(["Year", "Nominal GDP (Rp trillion)"], YEARS.map(function (y, i) { return [String(y), YEARLY.gdpNominal[i].toLocaleString("en-US")]; })); }
    },
    "growth-line": {
      svg: function () { return lineChart(YEARS.map(String), YEARLY.gdpGrowth, { unit: "%", decimals: 2, ymin: -3 }); },
      table: function () { return tableHtml(["Year", "Real GDP growth (%)"], YEARS.map(function (y, i) { return [String(y), YEARLY.gdpGrowth[i].toFixed(2)]; })); }
    },
    "sectors-full": {
      svg: function () { return hbarChart(SECTORS.map(function (d) { return { label: d.name, value: d.share }; }), { unit: "%", decimals: 1 }); },
      table: function () { return tableHtml(["Sector", "Share of GDP 2024 (%)"], SECTORS.map(function (d) { return [d.name, d.share.toFixed(1)]; })); }
    },
    "trade-grouped": {
      svg: function () { return groupedColumnChart(TRADE_YEARS.map(String), TRADE.exports, TRADE.imports, {}); },
      table: function () { return tableHtml(["Year", "Exports (US$bn)", "Imports (US$bn)", "Balance (US$bn)"], TRADE_YEARS.map(function (y, i) { return [String(y), TRADE.exports[i].toFixed(1), TRADE.imports[i].toFixed(1), TRADE.balance[i].toFixed(1)]; })); }
    },
    "balance-line": {
      svg: function () { return lineChart(TRADE_YEARS.map(String), TRADE.balance, { unit: "", decimals: 1, ymin: 0 }); },
      table: function () { return tableHtml(["Year", "Trade balance (US$bn)"], TRADE_YEARS.map(function (y, i) { return [String(y), TRADE.balance[i].toFixed(1)]; })); }
    },
    "commodities-hbar": {
      svg: function () { return hbarChart(COMMODITIES.map(function (d) { return { label: d.name, value: d.value }; }), { unit: "", decimals: 1 }); },
      table: function () { return tableHtml(["HS", "Commodity group", "Exports 2024 (US$bn)"], COMMODITIES.map(function (d) { return [d.hs, d.name, d.value.toFixed(1)]; })); }
    },
    "partners-hbar": {
      svg: function () { return hbarChart(PARTNERS.map(function (d) { return { label: d.name, value: d.value }; }), { unit: "", decimals: 1 }); },
      table: function () { return tableHtml(["Destination", "Exports 2024 (US$bn)", "Share (%)"], PARTNERS.map(function (d) { return [d.name, d.value.toFixed(1), (d.value / 264.7 * 100).toFixed(1)]; })); }
    },
    "pop-line": {
      svg: function () {
        var labels = ["2010"].concat(YEARS.map(String));
        var vals = [POP_2010].concat(YEARLY.population);
        return lineChart(labels, vals, { unit: "m", decimals: 1, ymin: 200 });
      },
      table: function () {
        var rows = [["2010", POP_2010.toFixed(1)]];
        YEARS.forEach(function (y, i) { rows.push([String(y), YEARLY.population[i].toFixed(1)]); });
        return tableHtml(["Year", "Population (million)"], rows);
      }
    },
    "prov-bar-10": {
      svg: function () { return hbarChart(PROV_POP.map(function (d) { return { label: d.name, value: d.pop }; }), { unit: "m", decimals: 1 }); },
      table: function () { return tableHtml(["Province", "Population 2024 (million)"], PROV_POP.map(function (d) { return [d.name, d.pop.toFixed(3)]; })); }
    },
    "islands-donut": {
      svg: function () { return donutChart(ISLANDS.map(function (d) { return { label: d.name, value: d.share }; }), { centre: "55.9%", centreSub: "live on Java" }); },
      table: function () { return tableHtml(["Island group", "Share of population 2024 (%)"], ISLANDS.map(function (d) { return [d.name, d.share.toFixed(1)]; })); }
    },
    "java-donut": {
      svg: function () { return donutChart([{ label: "Java", value: 55.9 }, { label: "Outside Java", value: 44.1 }], { centre: "157m", centreSub: "people on Java" }); },
      table: function () { return tableHtml(["Region", "Share of population 2024 (%)"], [["Java", "55.9"], ["Outside Java", "44.1"]]); }
    },
    "pdrb-hbar": {
      svg: function () { return hbarChart(PDRB.filter(function (d) { return d.nominal; }).map(function (d) { return { label: d.name, value: d.nominal }; }), { unit: "", decimals: 0 }); },
      table: function () { return tableHtml(["Province", "GRDP 2024 (Rp trillion, ~)", "GRDP per capita (Rp million)"], PDRB.map(function (d) { return [d.name, d.nominal ? "≈" + d.nominal.toLocaleString("en-US") : "—", d.perCapita ? d.perCapita.toFixed(2) : "—"]; })); }
    },
    "ump-hbar": {
      svg: function () { return hbarChart(UMP.map(function (d) { return { label: d.name, value: d.value / 1000000 }; }), { unit: "m", decimals: 2 }); },
      table: function () { return tableHtml(["Province", "UMP 2025 (Rp/month)"], UMP.map(function (d) { return [d.name, d.value.toLocaleString("en-US")]; })); }
    },
    "scatter-pdrb": {
      svg: function () {
        var pts = PDRB.filter(function (d) { return d.nominal; }).slice(0, 6).map(function (d, i) {
          var pop = (PROV_POP.filter(function (p) { return p.name === d.name; })[0] || { pop: 10 }).pop;
          return { x: pop, y: d.nominal, label: d.name, size: 9 + i * 0 };
        });
        return scatterChart(pts, {});
      },
      table: function () { return tableHtml(["Province", "Population (million)", "GRDP 2024 (Rp trillion, ~)"], PDRB.filter(function (d) { return d.nominal; }).slice(0, 6).map(function (d) { var pop = (PROV_POP.filter(function (p) { return p.name === d.name; })[0] || { pop: 0 }).pop; return [d.name, pop.toFixed(1), "≈" + d.nominal]; })); }
    },
    "dual-money": {
      svg: function () { return dualLineChart(MONTHS, INFL_MONTHLY, BIRATE_MONTHLY, { nameA: "CPI inflation", nameB: "BI-Rate" }); },
      table: function () { return tableHtml(["Month", "CPI inflation y-o-y (%)", "BI-Rate (%)"], MONTHS.map(function (m, i) { return [m, INFL_MONTHLY[i].toFixed(2), BIRATE_MONTHLY[i].toFixed(2)]; })); }
    },
    "reserves-area": {
      svg: function () { return lineChart(FX_YEARS.map(String), RESERVES, { unit: "", decimals: 1, ymin: 100, area: true }); },
      table: function () { return tableHtml(["Year", "FX reserves, end of year (US$bn)"], FX_YEARS.map(function (y, i) { return [String(y), RESERVES[i].toFixed(1)]; })); }
    },
    "infl-monthly": {
      svg: function () { return lineChart(MONTHS, INFL_MONTHLY, { unit: "%", decimals: 2, ymin: 0 }); },
      table: function () { return tableHtml(["Month", "CPI inflation y-o-y (%)"], MONTHS.map(function (m, i) { return [m, INFL_MONTHLY[i].toFixed(2)]; })); }
    },
    "hdi-line": {
      svg: function () { return lineChart(YEARS.map(String), HDI, { unit: "", decimals: 2, ymin: 65 }); },
      table: function () { return tableHtml(["Year", "HDI"], YEARS.map(function (y, i) { return [String(y), HDI[i].toFixed(2)]; })); }
    },
    "gini-line": {
      svg: function () { return lineChart(YEARS.map(String), GINI, { unit: "", decimals: 3, ymin: 0.3 }); },
      table: function () { return tableHtml(["Year", "Gini ratio (March)"], YEARS.map(function (y, i) { return [String(y), GINI[i].toFixed(3)]; })); }
    },
    "poverty-line": {
      svg: function () { return lineChart(YEARS.map(String), POVERTY, { unit: "%", decimals: 2, ymin: 0 }); },
      table: function () { return tableHtml(["Year", "Poverty rate, September (%)"], YEARS.map(function (y, i) { return [String(y), POVERTY[i].toFixed(2)]; })); }
    },
    "unemp-line": {
      svg: function () { return lineChart(YEARS.map(String), YEARLY.unemployment, { unit: "%", decimals: 2, ymin: 0 }); },
      table: function () { return tableHtml(["Year", "Open unemployment rate, August (%)"], YEARS.map(function (y, i) { return [String(y), YEARLY.unemployment[i].toFixed(2)]; })); }
    }
  };

  // Render every chart placeholder on this page.
  $all("[data-chart]").forEach(function (el) {
    var c = CHARTS[el.getAttribute("data-chart")];
    if (c) el.innerHTML = c.svg();
  });

  // Chart <-> table toggle. Button text flips; the table is built from the
  // same data as the chart, so the two always agree.
  $all(".chart-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-for"));
      var c = target && CHARTS[target.getAttribute("data-chart")];
      if (!target || !c) return;
      var showingTable = target.getAttribute("data-mode") === "table";
      if (showingTable) {
        target.innerHTML = c.svg();
        target.setAttribute("data-mode", "chart");
        btn.textContent = "View as table";
      } else {
        target.innerHTML = c.table();
        target.setAttribute("data-mode", "table");
        btn.textContent = "View as chart";
      }
      wireTooltips(target);
    });
  });

  // ---------- tabs ----------
  function activateTab(group, name) {
    $all('.tabs[data-group="' + group + '"] .tab-btn').forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === name);
      b.setAttribute("aria-selected", b.getAttribute("data-tab") === name ? "true" : "false");
    });
    $all('.tab-panel[data-group="' + group + '"]').forEach(function (p) {
      p.hidden = p.getAttribute("data-panel") !== name;
    });
    // Charts that live inside a tab panel render when the tab opens.
    $all('.tab-panel[data-group="' + group + '"][data-panel="' + name + '"] [data-chart]').forEach(function (el) {
      var c = CHARTS[el.getAttribute("data-chart")];
      if (c && !el.innerHTML) el.innerHTML = c.svg();
    });
  }
  $all(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateTab(btn.closest(".tabs").getAttribute("data-group"), btn.getAttribute("data-tab"));
    });
  });

  // ---------- year filter ----------
  var yearSelect = $("#year-filter");
  function applyYear(year) {
    var i = idxOf(year);
    if (i < 0) return;
    var focus = $("#year-focus");
    if (focus) {
      focus.innerHTML =
        "<tr><th>Real GDP growth</th><td>" + YEARLY.gdpGrowth[i].toFixed(2) + "%</td></tr>" +
        "<tr><th>Nominal GDP</th><td>Rp" + YEARLY.gdpNominal[i].toLocaleString("en-US") + " trillion</td></tr>" +
        "<tr><th>GDP per capita</th><td>Rp" + YEARLY.gdpPerCapita[i].toFixed(1) + " million</td></tr>" +
        "<tr><th>Population</th><td>" + YEARLY.population[i].toFixed(1) + " million</td></tr>" +
        "<tr><th>Inflation (CPI, Dec)</th><td>" + YEARLY.inflation[i].toFixed(2) + "%</td></tr>" +
        "<tr><th>Unemployment (Aug)</th><td>" + YEARLY.unemployment[i].toFixed(2) + "%</td></tr>";
    }
    var note = $("#year-note");
    if (note) note.textContent = "Showing " + year + " — change the year to compare any year from 2015 to 2024.";
    if (yearSelect) yearSelect.value = String(year);
  }
  if (yearSelect) {
    YEARS.forEach(function (y) {
      var opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearSelect.appendChild(opt);
    });
    yearSelect.value = "2024";
    yearSelect.addEventListener("change", function () { applyYear(Number(yearSelect.value)); });
    applyYear(2024);
  }

  // ---------- sortable tables ----------
  $all("table.sortable th[data-sort]").forEach(function (th) {
    th.addEventListener("click", function () {
      var table = th.closest("table");
      var col = Number(th.getAttribute("data-sort"));
      var asc = th.getAttribute("data-dir") !== "asc";
      $all("th", table).forEach(function (x) { x.removeAttribute("data-dir"); x.classList.remove("sorted"); });
      th.setAttribute("data-dir", asc ? "asc" : "desc");
      th.classList.add("sorted");
      var body = table.tBodies[0];
      var rows = $all("tr", body);
      rows.sort(function (a, b) {
        var va = a.cells[col].textContent.trim();
        var vb = b.cells[col].textContent.trim();
        var na = parseFloat(va.replace(/[^\d.\-]/g, ""));
        var nb = parseFloat(vb.replace(/[^\d.\-]/g, ""));
        var cmp;
        if (!isNaN(na) && !isNaN(nb) && va.match(/\d/) && vb.match(/\d/)) cmp = na - nb;
        else cmp = va.localeCompare(vb);
        return asc ? cmp : -cmp;
      });
      rows.forEach(function (r) { body.appendChild(r); });
    });
  });

  // ---------- live search ----------
  $all("input[data-search-for]").forEach(function (input) {
    input.addEventListener("input", function () {
      var table = document.getElementById(input.getAttribute("data-search-for"));
      if (!table) return;
      var q = input.value.trim().toLowerCase();
      var shown = 0, total = 0;
      $all("tr", table.tBodies[0]).forEach(function (tr) {
        total++;
        var hit = !q || tr.textContent.toLowerCase().indexOf(q) !== -1;
        tr.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      var count = document.getElementById(input.getAttribute("data-search-for") + "-count");
      if (count) count.textContent = "Showing " + shown + " of " + total;
    });
  });

  // ---------- tooltips ----------
  var tip = document.createElement("div");
  tip.id = "tooltip";
  tip.setAttribute("role", "status");
  document.body.appendChild(tip);
  function wireTooltips(scope) {
    $all("[data-tip]", scope).forEach(function (el) {
      el.addEventListener("mousemove", function (ev) {
        tip.textContent = el.getAttribute("data-tip");
        tip.style.display = "block";
        tip.style.left = Math.min(ev.clientX + 12, window.innerWidth - 190) + "px";
        tip.style.top = (ev.clientY + 14) + "px";
      });
      el.addEventListener("mouseleave", function () { tip.style.display = "none"; });
    });
  }
  wireTooltips(document);

  // ---------- hash routing: #tab=<group>:<name> and #yr=<year> ----------
  function applyHash() {
    var h = window.location.hash.replace(/^#/, "");
    if (!h) return;
    h.split("&").forEach(function (part) {
      var kv = part.split("=");
      if (kv[0] === "yr" && kv[1]) applyYear(Number(kv[1]));
      if (kv[0] === "tab" && kv[1]) {
        var bits = kv[1].split(":");
        if (bits.length === 2) activateTab(bits[0], bits[1]);
      }
    });
  }
  window.addEventListener("hashchange", applyHash);
  applyHash();

  // ---------- footer year ----------
  var fy = $("#foot-year");
  if (fy) fy.textContent = String(new Date().getFullYear());
})();
