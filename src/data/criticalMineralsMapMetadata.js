/**
 * Operational metadata for the critical minerals map.
 * Keep this file up to date with each dataset refresh.
 */
export const CRITICAL_MINERALS_MAP_METADATA = {
  datasetVersion: "2026.05.07",
  dataYear: 2024,
  lastUpdated: "2026-05-07",
  sourceLastVerified: "2026-05-07",
  staleAfterDays: 120,
  geometryPath: "/countries-110m.json",
  headerBadge: "USGS MCS 2025 · NRCan 2024 · Our World in Data 2026",
  sources: [
    {
      id: "usgs-mcs-2025",
      label: "USGS Mineral Commodity Summaries 2025",
      url: "https://pubs.usgs.gov/publication/mcs2025",
      cadence: "annual",
      priority: "primary",
    },
    {
      id: "usgs-fs-2025-3038",
      label: "USGS Global Maps of Critical Mineral Production in 2023",
      url: "https://pubs.usgs.gov/publication/fs20253038/full",
      cadence: "annual",
      priority: "secondary",
    },
    {
      id: "nrcan-critical-minerals-list",
      label: "NRCan Critical Minerals: An Opportunity for Canada",
      url: "https://www.canada.ca/en/campaign/critical-minerals-in-canada/critical-minerals-an-opportunity-for-canada.html",
      cadence: "event-driven",
      priority: "primary",
    },
    {
      id: "nrcan-mineral-trade-bulletin",
      label: "NRCan Mineral Trade Information Bulletin",
      url: "https://natural-resources.canada.ca/maps-tools-publications/publications/mineral-trade",
      cadence: "quarterly",
      priority: "secondary",
    },
    {
      id: "owid-critical-minerals",
      label: "Our World in Data critical minerals country dataset",
      url: "https://ourworldindata.org/countries-critical-minerals-needed-energy-transition",
      cadence: "quarterly",
      priority: "secondary",
    },
    {
      id: "iea-global-critical-minerals-outlook",
      label: "IEA Global Critical Minerals Outlook 2024",
      url: "https://www.iea.org/reports/global-critical-minerals-outlook-2024",
      cadence: "annual",
      priority: "context",
    },
    {
      id: "csis-mining-for-defense",
      label: "CSIS Mining for Defense",
      url: "https://www.csis.org/analysis/mining-defense",
      cadence: "annual",
      priority: "context",
    },
  ],
};
