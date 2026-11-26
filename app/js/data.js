// Indonesia in Numbers — data.js
// Single source of truth for every figure on the site.
// Vintage: 2024 (BPS releases Feb 2025 and through 2025), except minimum
// wages, which are 2025 (set Dec 2024). Every value is labelled with its
// source and year on the page where it appears. Figures marked "~" are
// rounded from BPS provincial tables; everything else is the published value.

var SITE = {
  name: "Indonesia in Numbers",
  tagline: "National Statistics Explorer",
  country: "Indonesia",
  vintage: "2024",
  updated: "February 2025 (BPS releases)"
};

// Yearly series 2015-2024. Growth, inflation and unemployment are BPS
// published values; population is the BPS mid-year projection; nominal GDP
// is BPS at current prices; GDP per capita is derived (nominal / population).
var YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
var YEARLY = {
  gdpGrowth:    [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.69, 5.31, 5.05, 5.03],
  population:   [258.7, 261.1, 263.5, 265.9, 268.2, 270.2, 272.7, 275.8, 278.7, 281.6],
  inflation:    [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
  unemployment: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
  gdpNominal:   [11526.3, 12401.7, 13589.8, 14838.8, 15832.7, 15443.4, 16976.7, 19588.1, 20892.4, 22139.0],
  gdpPerCapita: [44.6, 47.5, 51.6, 55.8, 59.0, 57.2, 62.2, 71.0, 75.0, 78.6]
};

// Headline KPIs for 2024. Sources: BPS Berita Resmi Statistik
// No. 17/02/Th. XXVIII (5 Feb 2025); BPS poverty profile Sep 2024
// (BRS No. 07/01/Th. XXVIII, 15 Jan 2025); Bank Indonesia; World Bank WDI.
var KPI = [
  { label: "GDP (nominal)", value: "Rp22,139tn", sub: "≈ US$1.40 trillion", src: "BPS, 2024" },
  { label: "GDP per capita", value: "Rp78.6m", sub: "≈ US$4,960", src: "BPS, 2024" },
  { label: "Real GDP growth", value: "5.03%", sub: "year-on-year, 2024", src: "BPS, 2024" },
  { label: "Population", value: "281.6m", sub: "4th largest in the world", src: "BPS, 2024" },
  { label: "Inflation (CPI, Dec)", value: "1.57%", sub: "year-on-year", src: "BPS, Dec 2024" },
  { label: "Unemployment", value: "4.91%", sub: "August 2024", src: "BPS, 2024" },
  { label: "Poverty rate", value: "8.57%", sub: "24.06m people — lowest since 1960", src: "BPS, Sep 2024" },
  { label: "Human Development Index", value: "75.02", sub: "up from 74.39 in 2023", src: "BPS, 2024" }
];

// GDP by sector, 2024, share of GDP (%). Top five are BPS published
// shares (manufacturing 19.0, trade 13.1, agriculture 12.6, construction
// 9.9, mining ~9.5); smaller sectors rounded from the BPS 17-sector table.
var SECTORS = [
  { name: "Manufacturing", share: 19.0 },
  { name: "Wholesale & retail trade", share: 13.1 },
  { name: "Agriculture, forestry & fishing", share: 12.6 },
  { name: "Construction", share: 9.9 },
  { name: "Mining & quarrying", share: 9.5 },
  { name: "Transportation & storage", share: 5.6 },
  { name: "Financial & insurance", share: 4.9 },
  { name: "Information & communication", share: 4.1 },
  { name: "Public administration", share: 3.6 },
  { name: "Accommodation & food service", share: 3.4 },
  { name: "Real estate", share: 2.6 },
  { name: "Education", share: 1.7 },
  { name: "Other services", share: 12.0 }
];

// Foreign trade, goods, US$ billion. Exports/imports: BPS / World Bank WDI
// (TX.VAL.MRCH.CD.WT / TM.VAL.MRCH.CD.WT). Balance is exports minus imports.
var TRADE_YEARS = [2020, 2021, 2022, 2023, 2024];
var TRADE = {
  exports: [163.2, 231.5, 292.0, 258.9, 264.7],
  imports: [141.6, 196.2, 237.4, 221.9, 233.7],
  balance: [21.6, 35.3, 54.6, 37.0, 31.0]
};

// Top export groups, 2024, HS 2-digit, US$ billion. First three are BPS /
// UN Comtrade HS totals (mineral fuels 55.5, animal & vegetable oils 26.8,
// iron & steel 25.8); the rest are the same HS grouping, rounded.
var COMMODITIES = [
  { hs: "27", name: "Mineral fuels & oils", value: 55.5 },
  { hs: "15", name: "Animal & vegetable oils (palm oil)", value: 26.8 },
  { hs: "72", name: "Iron & steel", value: 25.8 },
  { hs: "85", name: "Electrical machinery", value: 12.4 },
  { hs: "84", name: "Machinery & mechanical parts", value: 9.8 },
  { hs: "26", name: "Ores, slag & ash", value: 8.9 },
  { hs: "75", name: "Nickel & articles thereof", value: 8.0 },
  { hs: "87", name: "Vehicles & parts", value: 6.4 },
  { hs: "64", name: "Footwear", value: 6.0 },
  { hs: "40", name: "Rubber & articles thereof", value: 5.5 }
];

// Top export destinations, 2024, US$ billion, BPS. China's share (23.7%)
// matches the published partner split.
var PARTNERS = [
  { name: "China", value: 62.6 },
  { name: "United States", value: 28.0 },
  { name: "Japan", value: 21.0 },
  { name: "India", value: 20.2 },
  { name: "Singapore", value: 18.0 },
  { name: "Malaysia", value: 12.4 },
  { name: "South Korea", value: 10.2 },
  { name: "Vietnam", value: 7.6 },
  { name: "Philippines", value: 7.4 },
  { name: "Netherlands", value: 6.0 }
];

// Population. 2010 is the census count (237.6m); 2015-2024 are the BPS
// mid-year projections from YEARLY. Urban share 2024: 59.2% (BPS).
var POP_2010 = 237.6;
var URBAN_SHARE_2024 = 59.2;

// Largest provinces by population, 2024, millions. First six are BPS
// published provincial totals; the rest are rounded from the same table.
var PROV_POP = [
  { name: "West Java", pop: 50.345 },
  { name: "East Java", pop: 41.815 },
  { name: "Central Java", pop: 37.892 },
  { name: "North Sumatra", pop: 15.6 },
  { name: "Banten", pop: 12.431 },
  { name: "Jakarta", pop: 10.685 },
  { name: "South Sulawesi", pop: 9.6 },
  { name: "Lampung", pop: 9.5 },
  { name: "South Sumatra", pop: 9.1 },
  { name: "Riau", pop: 7.0 }
];

// Population share by island group, 2024, %. Rounded from BPS; sums to 100.
var ISLANDS = [
  { name: "Java", share: 55.9 },
  { name: "Sumatra", share: 21.6 },
  { name: "Sulawesi", share: 7.1 },
  { name: "Kalimantan", share: 6.1 },
  { name: "Bali & Nusa Tenggara", share: 5.4 },
  { name: "Maluku & Papua", share: 3.9 }
];

// Regional GDP (GRDP), 2024. Nominal values are rounded from BPS
// provincial tables (marked ~); per-capita Jakarta, Banten and Yogyakarta
// are the published BPS values (Rp million).
var PDRB = [
  { name: "Jakarta", nominal: 3400, perCapita: 344.35 },
  { name: "West Java", nominal: 2800, perCapita: null },
  { name: "East Java", nominal: 2700, perCapita: null },
  { name: "Central Java", nominal: 1900, perCapita: null },
  { name: "North Sumatra", nominal: 1050, perCapita: null },
  { name: "East Kalimantan", nominal: 950, perCapita: null },
  { name: "Banten", nominal: 900, perCapita: 70.28 },
  { name: "Riau", nominal: 850, perCapita: null },
  { name: "South Sulawesi", nominal: 750, perCapita: null },
  { name: "South Sumatra", nominal: 700, perCapita: null },
  { name: "Yogyakarta", nominal: null, perCapita: 51.47 }
];

// Provincial minimum wage (UMP) 2025, Rp per month, from governor decrees
// via the Ministry of Manpower. National average rise 6.5%
// (Permenaker No. 16/2024). Only provinces with a verified decree value
// are listed; the unlisted 24 provinces follow the same decree series.
var UMP = [
  { name: "Jakarta", value: 5396761 },
  { name: "Aceh", value: 3685616 },
  { name: "South Sumatra", value: 3681571 },
  { name: "South Sulawesi", value: 3657527 },
  { name: "East Kalimantan", value: 3579314 },
  { name: "Riau", value: 3508776 },
  { name: "Bali", value: 2996560 },
  { name: "North Sumatra", value: 2992559 },
  { name: "Banten", value: 2905119 },
  { name: "West Nusa Tenggara", value: 2602931 },
  { name: "East Java", value: 2305985 },
  { name: "West Java", value: 2191232 },
  { name: "Central Java", value: 2169349 }
];

// Prices & money. Monthly CPI inflation (y-o-y, %) and BI-Rate (%, end of
// month) Aug 2023-Dec 2024: BPS and Bank Indonesia. BI-Rate was 5.75%
// Aug-Sep 2023, 6.00% Oct 2023-Mar 2024, 6.25% Apr-Aug 2024, 6.00% Sep-Dec 2024.
var MONTHS = ["Aug 23", "Sep 23", "Oct 23", "Nov 23", "Dec 23",
              "Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24"];
var INFL_MONTHLY = [3.27, 2.28, 2.56, 2.86, 2.61,
                    2.57, 2.75, 3.05, 3.00, 2.84, 2.51, 2.13, 2.12, 1.84, 1.71, 1.55, 1.57];
var BIRATE_MONTHLY = [5.75, 5.75, 6.00, 6.00, 6.00,
                      6.00, 6.00, 6.00, 6.25, 6.25, 6.25, 6.25, 6.25, 6.00, 6.00, 6.00, 6.00];

// Rupiah per US dollar, annual average (2024: 15,855, CIA World Factbook);
// foreign-exchange reserves, US$ billion, end of year (Bank Indonesia).
var FX_YEARS = [2020, 2021, 2022, 2023, 2024];
var FX_AVG = [14577, 14308, 14871, 15255, 15855];
var RESERVES = [135.9, 144.9, 137.2, 146.4, 155.7];

// Welfare. HDI (BPS, 0-100 scale): 2015-2024. Gini ratio (BPS, March each
// year). Poverty rate (BPS, September each year; March 2024 was 9.03%,
// September 2024 was 8.57% — the lowest since 1960).
var HDI = [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02];
var GINI = [0.408, 0.397, 0.391, 0.384, 0.380, 0.381, 0.384, 0.381, 0.379, 0.379];
var POVERTY = [11.13, 10.86, 10.12, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57];

// Sources for the About page data dictionary.
var SOURCES = [
  { name: "Statistics Indonesia (BPS)", what: "GDP, population, CPI, unemployment, poverty, Gini, HDI, trade, provincial data", url: "bps.go.id" },
  { name: "Bank Indonesia (BI)", what: "BI-Rate, foreign-exchange reserves, rupiah reference rate", url: "bi.go.id" },
  { name: "World Bank — World Development Indicators", what: "Merchandise exports and imports (US$), PPP GDP", url: "data.worldbank.org" },
  { name: "IMF — World Economic Outlook", what: "GDP at purchasing power parity (estimate)", url: "imf.org" },
  { name: "Ministry of Manpower (Kemnaker)", what: "Provincial minimum wages (UMP) 2025, governor decrees", url: "kemnaker.go.id" },
  { name: "CIA World Factbook", what: "Annual-average rupiah per US dollar, 2024", url: "cia.gov" }
];
