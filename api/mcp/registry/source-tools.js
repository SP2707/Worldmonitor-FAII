// shared/source-attribution-manifest.json
var source_attribution_manifest_default = {
  version: 1,
  entries: [
    {
      host: "127.0.0.1",
      provider: "Local loopback transport",
      kind: "feed+structured",
      observed: true,
      license: "Excluded: local development/desktop transport",
      attribution: "Excluded from the provider count: local-only loopback URL.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        },
        {
          path: "src/services/runtime.ts"
        }
      ]
    },
    {
      host: "24.hu",
      provider: "24.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit 24.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "247preview.foxnews.com",
      provider: "247preview.foxnews.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "36kr.com",
      provider: "36kr.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit 36kr.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "444.hu",
      provider: "444.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit 444.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "511.alberta.ca",
      provider: "Alberta 511",
      kind: "structured",
      observed: true,
      license: "Alberta 511 terms (https://511.alberta.ca/about/about): non-commercial/educational reproduction allowed; commercial reproduction needs written permission from Alberta Transportation and Economic Corridors. https://511.alberta.ca/help/terms returned 404.",
      attribution: "Alberta 511 (Alberta Transportation and Economic Corridors). https://511.alberta.ca/",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/provincial-511.mjs"
        }
      ]
    },
    {
      host: "511on.ca",
      provider: "Ontario 511",
      kind: "structured",
      observed: true,
      license: "Ontario 511 API terms; Government of Ontario data; attribution required",
      attribution: "Ontario 511 (Ministry of Transportation). https://511on.ca/",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/provincial-511.mjs"
        }
      ]
    },
    {
      host: "a16z.com",
      provider: "a16z.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit a16z.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "abacus.worldmonitor.app",
      provider: "abacus.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/check-analytics-collector.mjs"
        },
        {
          path: "src/services/analytics.ts"
        }
      ]
    },
    {
      host: "abc-iview-mediapackagestreams-2.akamaized.net",
      provider: "abc-iview-mediapackagestreams-2.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "abplivetv.pc.cdn.bitgravity.com",
      provider: "abplivetv.pc.cdn.bitgravity.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "accounts.google.com",
      provider: "Google account sign-in",
      kind: "feed",
      observed: true,
      license: "Excluded: authentication/UI link",
      attribution: "Excluded from the provider count: user sign-in redirect, not an ingested source.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "acleddata.com",
      provider: "acleddata.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit acleddata.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-conflict-intel.mjs"
        },
        {
          path: "scripts/seed-unrest-events.mjs"
        },
        {
          path: "scripts/shared/acled-oauth.mjs"
        },
        {
          path: "server/_shared/acled-auth.ts"
        },
        {
          path: "server/_shared/acled.ts"
        }
      ]
    },
    {
      host: "actualite.cd",
      provider: "actualite.cd",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit actualite.cd and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "actuniger.com",
      provider: "ActuNiger",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit ActuNiger and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ae.usembassy.gov",
      provider: "ae.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ae.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "aerotime.aero",
      provider: "aerotime.aero",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit aerotime.aero and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "agentskills.io",
      provider: "agentskills.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit agentskills.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "api/skills/fetch-agentskills.ts"
        }
      ]
    },
    {
      host: "agsi.gie.eu",
      provider: "agsi.gie.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit agsi.gie.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-gas-storage-countries.mjs"
        },
        {
          path: "scripts/seed-gie-gas-storage.mjs"
        }
      ]
    },
    {
      host: "airinfoagadez.com",
      provider: "A\xEFr Info",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit A\xEFr Info and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "airlinegeeks.com",
      provider: "airlinegeeks.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit airlinegeeks.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "amdlive-ch01-ctnd-com.akamaized.net",
      provider: "amdlive-ch01-ctnd-com.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "amg00106-france24-france24-samsunguk-qvpp8.amagi.tv",
      provider: "amg00106-france24-france24-samsunguk-qvpp8.amagi.tv",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "amna.gr",
      provider: "amna.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit amna.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "amu.tv",
      provider: "Amu TV",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Amu TV and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "angellist.com",
      provider: "angellist.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit angellist.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "annahar.com",
      provider: "Annahar",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Annahar and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "api.abuseipdb.com",
      provider: "api.abuseipdb.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.abuseipdb.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "api.adsb.lol",
      provider: "adsb.lol",
      kind: "structured",
      observed: true,
      license: "Open Database License (ODbL) 1.0",
      attribution: "adsb.lol; preserve ODbL attribution and link to https://adsb.lol/.",
      status: "reviewed",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-military-flights.mjs"
        },
        {
          path: "src/components/MapPopup.ts"
        }
      ]
    },
    {
      host: "api.airplanes.live",
      provider: "airplanes.live",
      kind: "structured",
      observed: true,
      license: "Public API restricted to non-commercial use; 1 request/second limit",
      attribution: "airplanes.live; link to https://airplanes.live/api-guide/ and comply with its non-commercial restriction.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-military-flights.mjs"
        },
        {
          path: "src/components/MapPopup.ts"
        }
      ]
    },
    {
      host: "api.alternative.me",
      provider: "Alternative.me Fear & Greed Index",
      kind: "structured",
      observed: true,
      license: "Alternative.me API terms; attribution and redistribution require review",
      attribution: "Alternative.me Crypto Fear & Greed Index; link to the API response and methodology.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-economy.mjs"
        }
      ]
    },
    {
      host: "api.aviationstack.com",
      provider: "api.aviationstack.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.aviationstack.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/_shared.ts"
        }
      ]
    },
    {
      host: "api.axiom.co",
      provider: "Axiom telemetry",
      kind: "structured",
      observed: true,
      license: "Excluded: World Monitor operational telemetry, not an external data provider",
      attribution: "Excluded from the provider count: internal usage telemetry.",
      status: "excluded",
      references: [
        {
          path: "api/_usage-telemetry.js"
        },
        {
          path: "scripts/lib/llm-telemetry.cjs"
        },
        {
          path: "scripts/seed-forecasts.mjs"
        },
        {
          path: "server/_shared/usage.ts"
        }
      ]
    },
    {
      host: "api.axios.com",
      provider: "api.axios.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit api.axios.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "api.clerk.com",
      provider: "Clerk identity service",
      kind: "structured",
      observed: true,
      license: "Excluded: authentication/control-plane service",
      attribution: "Excluded from the provider count: identity-control-plane request.",
      status: "excluded",
      references: [
        {
          path: "server/auth-session.ts"
        }
      ]
    },
    {
      host: "api.cloudflare.com",
      provider: "api.cloudflare.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.cloudflare.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_kv-storage.mjs"
        },
        {
          path: "scripts/_r2-storage.mjs"
        },
        {
          path: "scripts/seed-internet-outages.mjs"
        },
        {
          path: "scripts/seed-military-bases.mjs"
        }
      ]
    },
    {
      host: "api.coingecko.com",
      provider: "api.coingecko.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.coingecko.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "api.coinpaprika.com",
      provider: "CoinPaprika",
      kind: "structured",
      observed: true,
      license: "CoinPaprika API terms",
      attribution: "CoinPaprika; link to the market/API response.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_seed-utils.mjs"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/worldmonitor/market/v1/_shared.ts"
        }
      ]
    },
    {
      host: "api.data.gov.my",
      provider: "api.data.gov.my",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.data.gov.my and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/backfill-fuel-prices-prev.mjs"
        },
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "api.datos.gob.mx",
      provider: "api.datos.gob.mx",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.datos.gob.mx and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/backfill-fuel-prices-prev.mjs"
        }
      ]
    },
    {
      host: "api.eia.gov",
      provider: "api.eia.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.eia.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/backfill-fuel-prices-prev.mjs"
        },
        {
          path: "scripts/seed-economy.mjs"
        },
        {
          path: "scripts/seed-eia-petroleum.mjs"
        },
        {
          path: "scripts/seed-electricity-prices.mjs"
        },
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "api.elections.kalshi.com",
      provider: "Kalshi",
      kind: "structured",
      observed: true,
      license: "Kalshi API terms; commercial-use and redistribution terms require review",
      attribution: "Kalshi prediction markets; link to the relevant market/API response.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_forecast-market-settlements.mjs"
        },
        {
          path: "scripts/seed-prediction-markets.mjs"
        }
      ]
    },
    {
      host: "api.exa.ai",
      provider: "api.exa.ai",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.exa.ai and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/lib/company-monitoring-exa.mjs"
        },
        {
          path: "scripts/seed-bigmac.mjs"
        },
        {
          path: "scripts/seed-grocery-basket.mjs"
        },
        {
          path: "server/worldmonitor/market/v1/stock-news-search.ts"
        }
      ]
    },
    {
      host: "api.fas.usda.gov",
      provider: "USDA FAS PSD",
      kind: "structured",
      observed: true,
      license: "U.S. government public-domain PSD Open Data",
      attribution: "USDA Foreign Agricultural Service, Production, Supply and Distribution (PSD).",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-food-stocks.mjs"
        }
      ]
    },
    {
      host: "api.firecrawl.dev",
      provider: "Firecrawl",
      kind: "structured",
      observed: true,
      license: "Firecrawl API terms",
      attribution: "Firecrawl; link to the retrieved source page.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-grocery-basket.mjs"
        }
      ]
    },
    {
      host: "api.fiscaldata.treasury.gov",
      provider: "api.fiscaldata.treasury.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.fiscaldata.treasury.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-national-debt.mjs"
        },
        {
          path: "scripts/seed-supply-chain-trade.mjs"
        }
      ]
    },
    {
      host: "api.gdeltproject.org",
      provider: "api.gdeltproject.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.gdeltproject.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-gdelt-intel.mjs"
        },
        {
          path: "scripts/seed-unrest-events.mjs"
        }
      ]
    },
    {
      host: "api.github.com",
      provider: "api.github.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.github.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "api/_github-release.js"
        },
        {
          path: "scripts/dispatch-stale-railway-reconcile.mjs"
        },
        {
          path: "scripts/resolve-railway-reconcile-control.mjs"
        },
        {
          path: "scripts/seed-research.mjs"
        }
      ]
    },
    {
      host: "api.groq.com",
      provider: "api.groq.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "server/_shared/llm-health.ts"
        }
      ]
    },
    {
      host: "api.hyperliquid.xyz",
      provider: "Hyperliquid",
      kind: "structured",
      observed: true,
      license: "Hyperliquid API terms",
      attribution: "Hyperliquid; link to the relevant market/API response.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-hyperliquid-flow.mjs"
        }
      ]
    },
    {
      host: "api.iea.org",
      provider: "api.iea.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.iea.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-iea-oil-stocks.mjs"
        }
      ]
    },
    {
      host: "api.imf.org",
      provider: "api.imf.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.imf.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_seed-utils.mjs"
        },
        {
          path: "scripts/seed-gold-cb-reserves.mjs"
        }
      ]
    },
    {
      host: "api.indexnow.org",
      provider: "api.indexnow.org",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seo-indexnow-submit.mjs"
        }
      ]
    },
    {
      host: "api.open511.gov.bc.ca",
      provider: "BC Open511",
      kind: "structured",
      observed: true,
      license: "Open Government Licence - British Columbia (OGL-BC). Confirmed on https://api.open511.gov.bc.ca/help. API Terms of Use for OGL-BC information also apply.",
      attribution: "DriveBC Open511 (Province of British Columbia). Licensed under OGL-BC. https://api.open511.gov.bc.ca/help",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/open511.mjs"
        }
      ]
    },
    {
      host: "api.openaq.org",
      provider: "OpenAQ",
      kind: "structured",
      observed: true,
      license: "CC BY 4.0 (dataset/API terms may vary by measurement source)",
      attribution: "OpenAQ, https://openaq.org/.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-health-air-quality.mjs"
        }
      ]
    },
    {
      host: "api.opensanctions.org",
      provider: "OpenSanctions",
      kind: "structured",
      observed: true,
      license: "OpenSanctions terms; dataset-specific license varies by source",
      attribution: "OpenSanctions; link to the matching entity/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/sanctions/v1/lookup-entity.ts"
        }
      ]
    },
    {
      host: "api.ossinsight.io",
      provider: "api.ossinsight.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.ossinsight.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-research.mjs"
        }
      ]
    },
    {
      host: "api.planespotters.net",
      provider: "api.planespotters.net",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.planespotters.net and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/military/v1/get-wingbits-live-flight.ts"
        }
      ]
    },
    {
      host: "api.rainviewer.com",
      provider: "api.rainviewer.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.rainviewer.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/components/DeckGLMap.ts"
        }
      ]
    },
    {
      host: "api.reliefweb.int",
      provider: "ReliefWeb (UN OCHA)",
      kind: "structured",
      observed: true,
      license: "UN OCHA/ReliefWeb terms",
      attribution: "ReliefWeb, United Nations Office for the Coordination of Humanitarian Affairs (OCHA).",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-disasters.mjs"
        }
      ]
    },
    {
      host: "api.resend.com",
      provider: "Resend email service",
      kind: "structured",
      observed: true,
      license: "Excluded: transactional email/control-plane service",
      attribution: "Excluded from the provider count: transactional email delivery.",
      status: "excluded",
      references: [
        {
          path: "server/worldmonitor/leads/v1/register-interest.ts"
        },
        {
          path: "server/worldmonitor/leads/v1/submit-contact.ts"
        }
      ]
    },
    {
      host: "api.safecast.org",
      provider: "Safecast",
      kind: "structured",
      observed: true,
      license: "Safecast data/API terms; verify dataset license by endpoint",
      attribution: "Safecast; link to the measurement/API response.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-radiation-watch.mjs"
        }
      ]
    },
    {
      host: "api.sam.gov",
      provider: "api.sam.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.sam.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "api.scrapecreators.com",
      provider: "api.scrapecreators.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.scrapecreators.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "api.search.brave.com",
      provider: "Brave Search API",
      kind: "structured",
      observed: true,
      license: "Brave Search API terms",
      attribution: "Brave Search; link to the result and original publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/worldmonitor/market/v1/stock-news-search.ts"
        }
      ]
    },
    {
      host: "api.spdrgoldshares.com",
      provider: "api.spdrgoldshares.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.spdrgoldshares.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-gold-etf-flows.mjs"
        }
      ]
    },
    {
      host: "api.stlouisfed.org",
      provider: "api.stlouisfed.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.stlouisfed.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-economic-calendar.mjs"
        }
      ]
    },
    {
      host: "api.ted.europa.eu",
      provider: "api.ted.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.ted.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "api.telegram.org",
      provider: "api.telegram.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.telegram.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/notification-relay.cjs"
        },
        {
          path: "scripts/seed-digest-notifications.mjs"
        }
      ]
    },
    {
      host: "api.travelpayouts.com",
      provider: "Travelpayouts flight-price data",
      kind: "structured",
      observed: true,
      license: "Travelpayouts API terms; commercial use and redistribution require review",
      attribution: "Travelpayouts; link to the returned flight-price response.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/aviation/v1/_providers/travelpayouts_data.ts"
        }
      ]
    },
    {
      host: "api.tzevaadom.co.il",
      provider: "api.tzevaadom.co.il",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.tzevaadom.co.il and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "api.unhcr.org",
      provider: "api.unhcr.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.unhcr.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-displacement-summary.mjs"
        },
        {
          path: "server/worldmonitor/displacement/v1/get-displacement-summary.ts"
        }
      ]
    },
    {
      host: "api.usaspending.gov",
      provider: "api.usaspending.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.usaspending.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-usa-spending.mjs"
        }
      ]
    },
    {
      host: "api.uspto.gov",
      provider: "USPTO Open Data Portal",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; USPTO terms apply",
      attribution: "U.S. Patent and Trademark Office (USPTO) Open Data Portal.",
      status: "reviewed",
      references: [
        {
          path: "scripts/_defense-patents-source.mjs"
        }
      ]
    },
    {
      host: "api.waqi.info",
      provider: "World Air Quality Index (WAQI)",
      kind: "structured",
      observed: true,
      license: "WAQI API terms; attribution required",
      attribution: "World Air Quality Index (WAQI); link to the station/API response.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-health-air-quality.mjs"
        }
      ]
    },
    {
      host: "api.weather.gc.ca",
      provider: "Environment and Climate Change Canada (ECCC)",
      kind: "structured",
      observed: true,
      license: "ECCC Data Server End-use Licence; Government of Canada open data",
      attribution: "Environment and Climate Change Canada (ECCC) weather alerts via MSC GeoMet (https://api.weather.gc.ca/).",
      status: "reviewed",
      references: [
        {
          path: "scripts/_weather-alert-select.mjs"
        }
      ]
    },
    {
      host: "api.weather.gov",
      provider: "api.weather.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.weather.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_weather-alert-select.mjs"
        }
      ]
    },
    {
      host: "api.windy.com",
      provider: "api.windy.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.windy.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-webcams.mjs"
        },
        {
          path: "server/worldmonitor/webcam/v1/get-webcam-image.ts"
        }
      ]
    },
    {
      host: "api.worldbank.org",
      provider: "World Bank Open Data",
      kind: "structured",
      observed: true,
      license: "World Development Indicators are licensed under CC BY 4.0. UNESCO UIS indicators mirrored through WDI also require the UIS attribution stated in the public source documentation.",
      attribution: "World Bank Open Data. For education indicators: UNESCO Institute for Statistics via World Bank WDI; include the UIS source URL and extraction date.",
      status: "reviewed",
      references: [
        {
          path: "scripts/_defense-industrial-source.mjs"
        },
        {
          path: "scripts/_demographics-capability-source.mjs"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-bis-lbs.mjs"
        },
        {
          path: "scripts/seed-education-attainment.mjs"
        },
        {
          path: "scripts/seed-fossil-electricity-share.mjs"
        },
        {
          path: "scripts/seed-power-reliability.mjs"
        },
        {
          path: "scripts/seed-recovery-external-debt.mjs"
        },
        {
          path: "scripts/seed-recovery-reserve-adequacy.mjs"
        },
        {
          path: "scripts/seed-resilience-static.mjs"
        },
        {
          path: "scripts/seed-sovereign-wealth.mjs"
        },
        {
          path: "scripts/seed-wb-external-debt.mjs"
        },
        {
          path: "scripts/seed-wb-indicators.mjs"
        },
        {
          path: "server/worldmonitor/economic/v1/list-world-bank-indicators.ts"
        }
      ]
    },
    {
      host: "api.worldmonitor.app",
      provider: "World Monitor hosted API",
      kind: "structured",
      observed: true,
      license: "Excluded: World Monitor own service/control plane",
      attribution: "Excluded from the external-provider count: first-party API endpoint.",
      status: "excluded",
      references: [
        {
          path: "api/a2a.ts"
        },
        {
          path: "api/internal/mcp-grant-mint.ts"
        },
        {
          path: "api/mcp/downstream.ts"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/audit-resilience-cohorts.mjs"
        },
        {
          path: "scripts/check-seed-freshness.mjs"
        },
        {
          path: "scripts/freeze-resilience-ranking.mjs"
        },
        {
          path: "scripts/openapi-inject-servers.mjs"
        },
        {
          path: "scripts/post-pr3427-force-refresh.mjs"
        },
        {
          path: "scripts/post-pr3487-force-refresh.mjs"
        },
        {
          path: "scripts/seed-china-decision-signals.mjs"
        },
        {
          path: "scripts/seed-infra.mjs"
        },
        {
          path: "scripts/seed-insights.mjs"
        },
        {
          path: "scripts/seed-military-maritime-news.mjs"
        },
        {
          path: "scripts/seed-resilience-scores.mjs"
        },
        {
          path: "scripts/seed-service-statuses.mjs"
        },
        {
          path: "scripts/validate-seed-migration.mjs"
        },
        {
          path: "scripts/verify-import-hhi-coverage.mjs"
        },
        {
          path: "src/app/desktop-updater.ts"
        },
        {
          path: "src/components/UnifiedSettings.ts"
        },
        {
          path: "src/mcp-grant-main.ts"
        },
        {
          path: "src/services/runtime.ts"
        }
      ]
    },
    {
      host: "api.wto.org",
      provider: "api.wto.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit api.wto.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-supply-chain-trade.mjs"
        },
        {
          path: "server/worldmonitor/trade/v1/_shared.ts"
        }
      ]
    },
    {
      host: "api.x.com",
      provider: "X API",
      kind: "structured",
      observed: true,
      license: "X Developer Agreement and Policy; ingest and retain only allowed fields and honor deletion, protection, and withholding signals",
      attribution: "Credit X and preserve author and source links when the allowed use permits display.",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/company-monitoring-x-provider.mjs"
        },
        {
          path: "scripts/lib/x-news-accounts.cjs"
        },
        {
          path: "scripts/verify-x-accounts.mjs"
        }
      ]
    },
    {
      host: "apnews.com",
      provider: "apnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit apnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "apps.fas.usda.gov",
      provider: "USDA FAS PSD",
      kind: "structured",
      observed: false,
      license: "U.S. government public-domain PSD Open Data",
      attribution: "USDA Foreign Agricultural Service, Production, Supply and Distribution (PSD).",
      status: "excluded"
    },
    {
      host: "arabianbusiness.com",
      provider: "arabianbusiness.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit arabianbusiness.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "arabnews.com",
      provider: "arabnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit arabnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "archive-api.open-meteo.com",
      provider: "archive-api.open-meteo.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit archive-api.open-meteo.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_open-meteo-archive.mjs"
        }
      ]
    },
    {
      host: "arctictoday.com",
      provider: "arctictoday.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit arctictoday.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "armenpress.am",
      provider: "armenpress.am",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit armenpress.am and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "armscontrol.org",
      provider: "armscontrol.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit armscontrol.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "arxiv.org",
      provider: "arxiv.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit arxiv.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-research.mjs"
        }
      ]
    },
    {
      host: "asharq.com",
      provider: "asharq.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit asharq.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "asharqbusiness.com",
      provider: "asharqbusiness.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit asharqbusiness.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "asia.nikkei.com",
      provider: "asia.nikkei.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit asia.nikkei.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "asianews.it",
      provider: "asianews.it",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit asianews.it and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "astanatimes.com",
      provider: "astanatimes.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit astanatimes.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "atbackend.sipri.org",
      provider: "SIPRI Arms Transfers Database",
      kind: "structured",
      observed: true,
      license: "SIPRI fair use permits limited non-commercial use; commercial use requires prior authorization and may require a royalty",
      attribution: "Credit the SIPRI Arms Transfers Database and link to SIPRI terms and the public database portal.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_defense-industrial-source.mjs"
        }
      ]
    },
    {
      host: "auth.opensky-network.org",
      provider: "opensky-network.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit auth.opensky-network.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-military-flights.mjs"
        }
      ]
    },
    {
      host: "av.alarabiya.net",
      provider: "av.alarabiya.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "ayibopost.com",
      provider: "AyiboPost",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit AyiboPost and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "azertag.az",
      provider: "azertag.az",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit azertag.az and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "azure.status.microsoft",
      provider: "azure.status.microsoft",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit azure.status.microsoft and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "balkaninsight.com",
      provider: "balkaninsight.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit balkaninsight.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "bangkokpost.com",
      provider: "bangkokpost.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit bangkokpost.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "basemaps.cartocdn.com",
      provider: "basemaps.cartocdn.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/config/basemap-styles.ts"
        }
      ]
    },
    {
      host: "bcovlive-a.akamaihd.net",
      provider: "bcovlive-a.akamaihd.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "bd.usembassy.gov",
      provider: "bd.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit bd.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "bellingcat.com",
      provider: "bellingcat.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit bellingcat.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "bihus.info",
      provider: "bihus.info",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit bihus.info and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "binance.com",
      provider: "Binance",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Binance and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "bitbucket.status.atlassian.com",
      provider: "bitbucket.status.atlassian.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit bitbucket.status.atlassian.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "bitcoinmagazine.com",
      provider: "bitcoinmagazine.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit bitcoinmagazine.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "bloomberg.com",
      provider: "bloomberg.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit bloomberg.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/components/LiveNewsPanel.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "bothsidesofthetable.com",
      provider: "bothsidesofthetable.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit bothsidesofthetable.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "breakingdefense.com",
      provider: "breakingdefense.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit breakingdefense.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "brookings.edu",
      provider: "brookings.edu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit brookings.edu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "browser.mcp.cloudflare.com",
      provider: "Cloudflare Browser MCP",
      kind: "structured",
      observed: true,
      license: "Excluded: optional rendering/automation connector",
      attribution: "Excluded from the provider count: user-configured MCP connector.",
      status: "excluded",
      references: [
        {
          path: "src/services/mcp-store.ts"
        }
      ]
    },
    {
      host: "budgetlab.yale.edu",
      provider: "budgetlab.yale.edu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit budgetlab.yale.edu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_trade-parse-utils.mjs"
        }
      ]
    },
    {
      host: "calgaryherald.com",
      provider: "calgaryherald.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit calgaryherald.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "canadabuys.canada.ca",
      provider: "canadabuys.canada.ca",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit canadabuys.canada.ca and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "carnegieendowment.org",
      provider: "carnegieendowment.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit carnegieendowment.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "catalogue.data.gov.bc.ca",
      provider: "B.C. Evacuation Orders and Alerts",
      kind: "structured",
      observed: true,
      license: "Open Government Licence - British Columbia (OGL-BC). The B.C. Data Catalogue record 7efd46d0-b5d3-4dff-af80-d376c42aec33 explicitly assigns OGL-BC to this ArcGIS layer.",
      attribution: "Contains information licensed under the Open Government Licence - British Columbia. https://catalogue.data.gov.bc.ca/dataset/7efd46d0-b5d3-4dff-af80-d376c42aec33",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/bc-emergency-info.mjs"
        }
      ]
    },
    {
      host: "cbcnewshd-f.akamaihd.net",
      provider: "cbcnewshd-f.akamaihd.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "cbinsights.com",
      provider: "cbinsights.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cbinsights.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cbsn-us.cbsnstream.cbsnews.com",
      provider: "cbsn-us.cbsnstream.cbsnews.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "cdc.gov",
      provider: "cdc.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cdc.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cdn-ca2-na.lncnetworks.host",
      provider: "cdn-ca2-na.lncnetworks.host",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "cdn.debugbear.com",
      provider: "cdn.debugbear.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/bootstrap/debugbear-rum.ts"
        }
      ]
    },
    {
      host: "cdn.jsdelivr.net",
      provider: "jsDelivr asset CDN",
      kind: "structured",
      observed: true,
      license: "Excluded: presentation asset/CDN",
      attribution: "Excluded from the provider count: browser asset, not an ingested source.",
      status: "excluded",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/_shared/brief-carousel-render.ts"
        }
      ]
    },
    {
      host: "cdnlive.presstv.ir",
      provider: "cdnlive.presstv.ir",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "celestrak.org",
      provider: "celestrak.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit celestrak.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "chainwire.org",
      provider: "Chainwire",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Chainwire and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "challenges.cloudflare.com",
      provider: "challenges.cloudflare.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "server/_shared/turnstile.ts"
        }
      ]
    },
    {
      host: "changelog.com",
      provider: "changelog.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit changelog.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "chathamhouse.org",
      provider: "chathamhouse.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit chathamhouse.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "citinewsroom.com",
      provider: "citinewsroom.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit citinewsroom.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "civil.ge",
      provider: "civil.ge",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit civil.ge and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "climate.copernicus.eu",
      provider: "climate.copernicus.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit climate.copernicus.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "cloudflare-dns.com",
      provider: "cloudflare-dns.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/_notification-webhook-ssrf.ts"
        },
        {
          path: "api/mcp-proxy.ts"
        },
        {
          path: "server/_shared/email-validation.ts"
        },
        {
          path: "server/worldmonitor/shipping/v2/webhook-shared.ts"
        }
      ]
    },
    {
      host: "cnas.org",
      provider: "cnas.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cnas.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cnbc.com",
      provider: "cnbc.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cnbc.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cnn.com",
      provider: "cnn.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cnn.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cnn.gr",
      provider: "cnn.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cnn.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "co.usembassy.gov",
      provider: "co.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit co.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "coinbase.com",
      provider: "Coinbase",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Coinbase and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cointelegraph.com",
      provider: "cointelegraph.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cointelegraph.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        }
      ]
    },
    {
      host: "collisionconf.com",
      provider: "collisionconf.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit collisionconf.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        }
      ]
    },
    {
      host: "commodity.worldmonitor.app",
      provider: "commodity.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/app/panel-layout.ts"
        },
        {
          path: "src/config/variant-meta.ts"
        }
      ]
    },
    {
      host: "comtradeapi.un.org",
      provider: "comtradeapi.un.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit comtradeapi.un.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-comtrade-bilateral-hs4.mjs"
        },
        {
          path: "scripts/seed-recovery-import-hhi.mjs"
        },
        {
          path: "scripts/seed-recovery-reexport-share.mjs"
        },
        {
          path: "scripts/seed-trade-flows.mjs"
        },
        {
          path: "server/worldmonitor/supply-chain/v1/_bilateral-hs4-lazy.ts"
        }
      ]
    },
    {
      host: "confluence.status.atlassian.com",
      provider: "confluence.status.atlassian.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit confluence.status.atlassian.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "conservationoptimism.org",
      provider: "conservationoptimism.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit conservationoptimism.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "contxto.com",
      provider: "contxto.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit contxto.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "correctiv.org",
      provider: "correctiv.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit correctiv.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "corridorrisk.io",
      provider: "corridorrisk.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit corridorrisk.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "cp24.com",
      provider: "cp24.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cp24.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "cryptoslate.com",
      provider: "cryptoslate.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit cryptoslate.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "csis.org",
      provider: "csis.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit csis.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ctvnews.ca",
      provider: "ctvnews.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ctvnews.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "customer-api.wingbits.com",
      provider: "wingbits.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit customer-api.wingbits.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-military-flights.mjs"
        },
        {
          path: "server/worldmonitor/military/v1/_wingbits-aircraft-details.ts"
        }
      ]
    },
    {
      host: "customer.dodopayments.com",
      provider: "customer.dodopayments.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/services/billing.ts"
        }
      ]
    },
    {
      host: "dai2.xumo.com",
      provider: "dai2.xumo.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "dailytrust.com",
      provider: "dailytrust.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit dailytrust.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "dash4.antik.sk",
      provider: "dash4.antik.sk",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "data-api.ecb.europa.eu",
      provider: "data-api.ecb.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit data-api.ecb.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-ecb-fx-rates.mjs"
        },
        {
          path: "scripts/seed-ecb-short-rates.mjs"
        },
        {
          path: "scripts/seed-yield-curve-eu.mjs"
        }
      ]
    },
    {
      host: "data.ecb.europa.eu",
      provider: "data.ecb.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit data.ecb.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fsi-eu.mjs"
        }
      ]
    },
    {
      host: "data.humdata.org",
      provider: "data.humdata.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit data.humdata.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_conflict-hapi.mjs"
        },
        {
          path: "scripts/benchmark-resilience-external.mjs"
        },
        {
          path: "scripts/seed-resilience-static.mjs"
        }
      ]
    },
    {
      host: "data.sec.gov",
      provider: "SEC EDGAR",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; SEC terms apply",
      attribution: "U.S. Securities and Exchange Commission (SEC) EDGAR.",
      status: "reviewed",
      references: [
        {
          path: "server/_shared/sec-edgar.ts"
        }
      ]
    },
    {
      host: "data.tps.ca",
      provider: "Toronto Police Service Open Data",
      kind: "structured",
      observed: true,
      license: 'Custom licence based on the Open Government Licence - Ontario. The Major Crime Indicators FeatureServer (serviceItemId 0a239a5563a344a3bbf8452504ed8d68) and Calls for Service Attended table (serviceItemId 46c7581a136445c78831acb657a4fb0d) require: "Contains information licensed under the Open Government Licence - Ontario." Credit Toronto Police Service without crests, logos, flags, or official marks. No TPS endorsement. Locations are deliberately offset; do not present them as precise addresses. Do not merge or link the data with other databases for the purpose of identifying a person, business, or organization. Do not fill privacy exclusions from GTA Update, news, radio, or another source. Evidence: https://www.tps.ca/data-maps/open-data/ and the item-level FeatureServer descriptions on https://data.tps.ca/.',
      attribution: "Contains information licensed under the Open Government Licence - Ontario. Toronto Police Service Open Data (https://www.tps.ca/data-maps/open-data/, https://data.tps.ca/). Coordinates are approximate offset intersection nodes. No TPS endorsement.",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/tps-open-data.mjs"
        }
      ]
    },
    {
      host: "data.uspto.gov",
      provider: "USPTO Open Data Portal",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; USPTO terms apply",
      attribution: "U.S. Patent and Trademark Office (USPTO) Open Data.",
      status: "reviewed",
      references: [
        {
          path: "scripts/_defense-patents-source.mjs"
        }
      ]
    },
    {
      host: "data.weather.gov.hk",
      provider: "data.weather.gov.hk",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit data.weather.gov.hk and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/natural/western-pacific-cyclones.mjs"
        }
      ]
    },
    {
      host: "data.worldbank.org",
      provider: "data.worldbank.org",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seed-education-attainment.mjs"
        },
        {
          path: "scripts/seed-wb-external-debt.mjs"
        }
      ]
    },
    {
      host: "datalab.wto.org",
      provider: "datalab.wto.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit datalab.wto.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-hormuz.mjs"
        }
      ]
    },
    {
      host: "dataservices.icao.int",
      provider: "dataservices.icao.int",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit dataservices.icao.int and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/_shared.ts"
        }
      ]
    },
    {
      host: "de.euronews.com",
      provider: "de.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit de.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "de.usembassy.gov",
      provider: "de.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit de.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "decrypt.co",
      provider: "decrypt.co",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit decrypt.co and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "defense.gov",
      provider: "defense.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit defense.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "dev.events",
      provider: "dev.events",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit dev.events and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "dev.to",
      provider: "dev.to",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit dev.to and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "devops.com",
      provider: "devops.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit devops.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "dfrlab.org",
      provider: "dfrlab.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit dfrlab.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "dhakatribune.com",
      provider: "Dhaka Tribune",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Dhaka Tribune and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "dhs.gov",
      provider: "dhs.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit dhs.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "discord.com",
      provider: "discord.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/discord/oauth/callback.ts"
        },
        {
          path: "api/discord/oauth/start.ts"
        }
      ]
    },
    {
      host: "discord.gg",
      provider: "discord.gg",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/CommunityWidget.ts"
        }
      ]
    },
    {
      host: "discordstatus.com",
      provider: "discordstatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit discordstatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "disrupt-africa.com",
      provider: "disrupt-africa.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit disrupt-africa.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "dlnews.com",
      provider: "dlnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit dlnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "do.usembassy.gov",
      provider: "do.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit do.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "drmkc.jrc.ec.europa.eu",
      provider: "drmkc.jrc.ec.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit drmkc.jrc.ec.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/benchmark-resilience-external.mjs"
        }
      ]
    },
    {
      host: "dw.com",
      provider: "dw.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit dw.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "dwamdstream103.akamaized.net",
      provider: "dwamdstream103.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "dwamdstream104.akamaized.net",
      provider: "dwamdstream104.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "e00-elmundo.uecdn.es",
      provider: "e00-elmundo.uecdn.es",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit e00-elmundo.uecdn.es and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "earth-search.aws.element84.com",
      provider: "Element84 Earth Search STAC",
      kind: "structured",
      observed: true,
      license: "AWS Open Data and dataset-specific collection licenses",
      attribution: "Element84 Earth Search; preserve the collection license and link to the item.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/imagery/v1/search-imagery.ts"
        }
      ]
    },
    {
      host: "earthobservatory.nasa.gov",
      provider: "earthobservatory.nasa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit earthobservatory.nasa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "earthquake.usgs.gov",
      provider: "earthquake.usgs.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit earthquake.usgs.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-earthquakes.mjs"
        }
      ]
    },
    {
      host: "ec.europa.eu",
      provider: "ec.europa.eu",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ec.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_eurostat-utils.mjs"
        },
        {
          path: "scripts/seed-economic-calendar.mjs"
        },
        {
          path: "scripts/seed-eurostat-country-data.mjs"
        },
        {
          path: "scripts/seed-resilience-static.mjs"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ecfr.eu",
      provider: "ecfr.eu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ecfr.eu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ecs-api.wingbits.com",
      provider: "wingbits.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ecs-api.wingbits.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/military/v1/get-wingbits-live-flight.ts"
        }
      ]
    },
    {
      host: "edmontonjournal.com",
      provider: "edmontonjournal.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit edmontonjournal.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "efectococuyo.com",
      provider: "Efecto Cocuyo",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Efecto Cocuyo and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "eff.org",
      provider: "eff.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit eff.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "efts.sec.gov",
      provider: "SEC EDGAR Full-Text Search",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; SEC terms apply",
      attribution: "U.S. Securities and Exchange Commission (SEC) EDGAR full-text search.",
      status: "reviewed",
      references: [
        {
          path: "server/_shared/sec-edgar.ts"
        }
      ]
    },
    {
      host: "eia.gov",
      provider: "eia.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit eia.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "emergencyalert.saskatchewan.ca",
      provider: "SaskAlert",
      kind: "structured",
      observed: true,
      license: "Public SaskAlert mobile JSON at /sapublic/feed.json plus same-host CAP 1.2 JSON details. Government of Saskatchewan website terms exclude some connected subsites; this host is the official public alert feed authorized for canadaAlerts ingest under #6659. Not Pelmorex LMD.",
      attribution: "SaskAlert, Government of Saskatchewan. https://emergencyalert.saskatchewan.ca/",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/saskalert.mjs"
        },
        {
          path: "scripts/source-attribution.mjs"
        }
      ]
    },
    {
      host: "en.irna.ir",
      provider: "en.irna.ir",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit en.irna.ir and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "en.mehrnews.com",
      provider: "en.mehrnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit en.mehrnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "en.sge.com.cn",
      provider: "en.sge.com.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit en.sge.com.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-physical-premiums.mjs"
        }
      ]
    },
    {
      host: "en.sse.net.cn",
      provider: "en.sse.net.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit en.sse.net.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-supply-chain-trade.mjs"
        }
      ]
    },
    {
      host: "en.wikipedia.org",
      provider: "en.wikipedia.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit en.wikipedia.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-sovereign-wealth.mjs"
        },
        {
          path: "server/worldmonitor/intelligence/v1/get-country-facts.ts"
        }
      ]
    },
    {
      host: "energy.ec.europa.eu",
      provider: "energy.ec.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit energy.ec.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/backfill-fuel-prices-prev.mjs"
        },
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "energy.worldmonitor.app",
      provider: "energy.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/app/panel-layout.ts"
        },
        {
          path: "src/config/variant-meta.ts"
        }
      ]
    },
    {
      host: "eng.lsm.lv",
      provider: "eng.lsm.lv",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit eng.lsm.lv and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "english.alarabiya.net",
      provider: "english.alarabiya.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit english.alarabiya.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "english.customs.gov.cn",
      provider: "english.customs.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit english.customs.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-macro/source-contracts.mjs"
        }
      ]
    },
    {
      host: "english.enabbaladi.net",
      provider: "Enab Baladi English",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Enab Baladi English and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "english.nv.ua",
      provider: "english.nv.ua",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit english.nv.ua and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "english.wafa.ps",
      provider: "WAFA English",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit WAFA English and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "eonet.gsfc.nasa.gov",
      provider: "eonet.gsfc.nasa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit eonet.gsfc.nasa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-natural-events.mjs"
        }
      ]
    },
    {
      host: "ert.gr",
      provider: "ert.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ert.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ertflix.ascdn.broadpeak.io",
      provider: "ertflix.ascdn.broadpeak.io",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "es.euronews.com",
      provider: "es.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit es.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "eu-startups.com",
      provider: "eu-startups.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit eu-startups.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "euractiv.com",
      provider: "euractiv.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit euractiv.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "eurasianet.org",
      provider: "eurasianet.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit eurasianet.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "euromaidanpress.com",
      provider: "euromaidanpress.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit euromaidanpress.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "example.com",
      provider: "Example domain placeholder",
      kind: "structured",
      observed: true,
      license: "Excluded: documentation/test placeholder",
      attribution: "Excluded from the provider count: placeholder URL.",
      status: "excluded",
      references: [
        {
          path: "scripts/openapi-inject-examples.mjs"
        },
        {
          path: "src/services/mcp-store.ts"
        },
        {
          path: "src/utils/sanitize.ts"
        }
      ]
    },
    {
      host: "export.arxiv.org",
      provider: "export.arxiv.org",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit export.arxiv.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "fao.org",
      provider: "fao.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit fao.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "farsnews.ir",
      provider: "farsnews.ir",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit farsnews.ir and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fas.org",
      provider: "fas.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit fas.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fc.yahoo.com",
      provider: "fc.yahoo.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit fc.yahoo.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_yahoo-sector-valuations.cjs"
        }
      ]
    },
    {
      host: "feed.businesswire.com",
      provider: "Business Wire",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Business Wire and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feed.infoq.com",
      provider: "feed.infoq.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feed.infoq.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "feeds.abcnews.com",
      provider: "feeds.abcnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.abcnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.arstechnica.com",
      provider: "feeds.arstechnica.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.arstechnica.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "feeds.bbci.co.uk",
      provider: "BBC",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.bbci.co.uk and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.content.dowjones.io",
      provider: "feeds.content.dowjones.io",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.content.dowjones.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.elpais.com",
      provider: "feeds.elpais.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.elpais.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.feedburner.com",
      provider: "feeds.feedburner.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.feedburner.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ],
      role: "transport"
    },
    {
      host: "feeds.finra.org",
      provider: "FINRA",
      kind: "structured",
      observed: true,
      license: "FINRA feed terms",
      attribution: "Financial Industry Regulatory Authority (FINRA); link to the original notice.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-regulatory-actions.mjs"
        }
      ]
    },
    {
      host: "feeds.folha.uol.com.br",
      provider: "feeds.folha.uol.com.br",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.folha.uol.com.br and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.megaphone.fm",
      provider: "feeds.megaphone.fm",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.megaphone.fm and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.nbcnews.com",
      provider: "feeds.nbcnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.nbcnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.news24.com",
      provider: "feeds.news24.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.news24.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.nos.nl",
      provider: "feeds.nos.nl",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.nos.nl and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "feeds.npr.org",
      provider: "feeds.npr.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit feeds.npr.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fema.gov",
      provider: "fema.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit fema.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fenixservices.fao.org",
      provider: "FAOSTAT",
      kind: "structured",
      observed: true,
      license: "FAOSTAT CC-BY; attribution to FAO required",
      attribution: "FAO. FAOSTAT. https://www.fao.org/faostat/",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-food-stocks.mjs"
        }
      ]
    },
    {
      host: "feodotracker.abuse.ch",
      provider: "feodotracker.abuse.ch",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit feodotracker.abuse.ch and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "finance.worldmonitor.app",
      provider: "finance.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/app/panel-layout.ts"
        },
        {
          path: "src/config/variant-meta.ts"
        }
      ]
    },
    {
      host: "finance.yahoo.com",
      provider: "finance.yahoo.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit finance.yahoo.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "financialpost.com",
      provider: "financialpost.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit financialpost.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "finnhub.io",
      provider: "finnhub.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit finnhub.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "api/symbol-search.ts"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-earnings-calendar.mjs"
        },
        {
          path: "scripts/seed-economy.mjs"
        },
        {
          path: "scripts/shared/market-quote-provider.mjs"
        },
        {
          path: "server/worldmonitor/intelligence/v1/_company-shared.ts"
        },
        {
          path: "server/worldmonitor/market/v1/_quote-provider.ts"
        },
        {
          path: "server/worldmonitor/market/v1/_shared.ts"
        },
        {
          path: "server/worldmonitor/market/v1/get-insider-transactions.ts"
        }
      ]
    },
    {
      host: "firms.modaps.eosdis.nasa.gov",
      provider: "firms.modaps.eosdis.nasa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit firms.modaps.eosdis.nasa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fire-detections.mjs"
        }
      ]
    },
    {
      host: "focustaiwan.tw",
      provider: "focustaiwan.tw",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit focustaiwan.tw and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fonts.googleapis.com",
      provider: "fonts.googleapis.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "server/_shared/brief-render.js"
        }
      ]
    },
    {
      host: "foreignpolicy.com",
      provider: "foreignpolicy.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit foreignpolicy.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fr.africanews.com",
      provider: "fr.africanews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit fr.africanews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fr.euronews.com",
      provider: "fr.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit fr.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "freeipapi.com",
      provider: "freeipapi.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit freeipapi.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "ft.com",
      provider: "ft.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ft.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "fxempire.com",
      provider: "fxempire.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit fxempire.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "gain.nd.edu",
      provider: "gain.nd.edu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit gain.nd.edu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/benchmark-resilience-external.mjs"
        }
      ]
    },
    {
      host: "gamma-api.polymarket.com",
      provider: "gamma-api.polymarket.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit gamma-api.polymarket.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_forecast-market-settlements.mjs"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-prediction-markets.mjs"
        }
      ]
    },
    {
      host: "gcaptain.com",
      provider: "gcaptain.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit gcaptain.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "geo.tv",
      provider: "geo.tv",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit geo.tv and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "geoserver.cwfif.nrcan.gc.ca",
      provider: "CWFIS / CWFIF (NRCan)",
      kind: "structured",
      observed: true,
      license: "Open Government Licence - Canada; redistribution granted (copy, modify, publish, distribute, including commercial use) with attribution",
      attribution: "Canadian Forest Service. Canadian Wildland Fire Information System (CWFIS), Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta. https://cwfis.cfs.nrcan.gc.ca. Contains information licensed under the Open Government Licence \u2013 Canada (https://open.canada.ca/en/open-government-licence-canada). Evidence: https://cwfis.cfs.nrcan.gc.ca/downloads/licence.txt",
      status: "reviewed",
      references: [
        {
          path: "scripts/wildfire/cwfis-wfs.mjs"
        }
      ]
    },
    {
      host: "geospatial-usace.opendata.arcgis.com",
      provider: "geospatial-usace.opendata.arcgis.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit geospatial-usace.opendata.arcgis.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/fetch-mirta-bases.mjs"
        }
      ]
    },
    {
      host: "ghoapi.azureedge.net",
      provider: "ghoapi.azureedge.net",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ghoapi.azureedge.net and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-resilience-static.mjs"
        }
      ]
    },
    {
      host: "github.blog",
      provider: "github.blog",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit github.blog and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "github.com",
      provider: "github.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/download.js"
        },
        {
          path: "scripts/generate-airline-codes.mjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "src/app/desktop-updater.ts"
        },
        {
          path: "src/services/analytics.ts"
        },
        {
          path: "src/services/preferences-content.ts"
        }
      ]
    },
    {
      host: "globalenergymonitor.org",
      provider: "Global Energy Monitor",
      kind: "structured",
      observed: true,
      license: "CC BY 4.0 for published datasets unless the dataset page states otherwise",
      attribution: "Global Energy Monitor; link to the dataset page.",
      status: "reviewed",
      references: [
        {
          path: "scripts/import-gem-pipelines.mjs"
        },
        {
          path: "src/components/PipelineStatusPanel.ts"
        },
        {
          path: "src/components/StorageFacilityMapPanel.ts"
        }
      ]
    },
    {
      host: "globalinitiative.net",
      provider: "globalinitiative.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit globalinitiative.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "globalnews.ca",
      provider: "globalnews.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit globalnews.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "gmfus.org",
      provider: "gmfus.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit gmfus.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "gml.noaa.gov",
      provider: "gml.noaa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit gml.noaa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-co2-monitoring.mjs"
        }
      ]
    },
    {
      host: "goldsilverworlds.com",
      provider: "goldsilverworlds.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit goldsilverworlds.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "gpsjam.org",
      provider: "gpsjam.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit gpsjam.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/fetch-gpsjam.mjs"
        }
      ]
    },
    {
      host: "gr.euronews.com",
      provider: "gr.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit gr.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "greatergood.berkeley.edu",
      provider: "greatergood.berkeley.edu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit greatergood.berkeley.edu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "gtaupdate.com",
      provider: "GTA Update",
      kind: "structured",
      observed: true,
      license: "Reuse permission held by WorldMonitor, as confirmed by the repository owner on 2026-08-21. The private grant is not stored in this public repository. Production activation remains separately blocked on official TPS/TFS upstream provenance and the safety, cadence, capacity, and product acceptance gates in issue #7012.",
      attribution: "GTA Update (unofficial third-party TPS/TFS dispatch mirror; not official, not verified, entertainment-only per publisher). Used with permission. Production disabled pending upstream provenance and product activation. https://gtaupdate.com/about.php",
      status: "reviewed",
      catalogActive: false,
      references: [
        {
          path: "scripts/lib/gta-update.mjs"
        }
      ]
    },
    {
      host: "gtfsrt.ttc.ca",
      provider: "Toronto Transit Commission (TTC) GTFS-RT",
      kind: "structured",
      observed: true,
      license: "CKAN package_show for ttc-gtfs-realtime-gtfs-rt: license_id=notspecified, isopen=false (https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=ttc-gtfs-realtime-gtfs-rt). Portal dataset page chrome links OGL-Toronto but is not data-bound to this dataset.",
      attribution: "Toronto Transit Commission GTFS-RT service alerts. https://gtfsrt.ttc.ca and https://open.toronto.ca/dataset/ttc-gtfs-realtime-gtfs-rt/. Portal HTML cites OGL-Toronto; CKAN does not.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-ttc-alerts.mjs"
        }
      ]
    },
    {
      host: "haaretz.com",
      provider: "haaretz.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit haaretz.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "hacker-news.firebaseio.com",
      provider: "hacker-news.firebaseio.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit hacker-news.firebaseio.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-research.mjs"
        }
      ]
    },
    {
      host: "hai.stanford.edu",
      provider: "hai.stanford.edu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit hai.stanford.edu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "hapi.humdata.org",
      provider: "hapi.humdata.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit hapi.humdata.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_conflict-hapi.mjs"
        }
      ]
    },
    {
      host: "happy.worldmonitor.app",
      provider: "happy.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/config/variant-meta.ts"
        }
      ]
    },
    {
      host: "havanatimes.org",
      provider: "Havana Times",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Havana Times and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "hdr.undp.org",
      provider: "UNDP Human Development Report",
      kind: "structured",
      observed: true,
      license: "UNDP data terms; dataset-specific license applies",
      attribution: "United Nations Development Programme (UNDP) Human Development Report.",
      status: "terms-review",
      references: [
        {
          path: "scripts/benchmark-resilience-external.mjs"
        }
      ]
    },
    {
      host: "health.aws.amazon.com",
      provider: "health.aws.amazon.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit health.aws.amazon.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "hiiraan.com",
      provider: "hiiraan.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit hiiraan.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "hirado.hu",
      provider: "hirado.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit hirado.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "hnrss.org",
      provider: "hnrss.org",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit hnrss.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "hromadske.ua",
      provider: "hromadske.ua",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit hromadske.ua and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "humanprogress.org",
      provider: "humanprogress.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit humanprogress.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "hvg.hu",
      provider: "hvg.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit hvg.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ici.radio-canada.ca",
      provider: "ici.radio-canada.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ici.radio-canada.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "iea.org",
      provider: "iea.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit iea.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "in.usembassy.gov",
      provider: "in.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit in.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "inc42.com",
      provider: "inc42.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit inc42.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "index.hu",
      provider: "index.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit index.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "indianexpress.com",
      provider: "indianexpress.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit indianexpress.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "indiatodaylive.akamaized.net",
      provider: "indiatodaylive.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "insideclimatenews.org",
      provider: "insideclimatenews.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit insideclimatenews.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "insightcrime.org",
      provider: "insightcrime.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit insightcrime.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "interfax.com",
      provider: "Interfax",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Interfax and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "internal.example.com",
      provider: "Internal example placeholder",
      kind: "structured",
      observed: true,
      license: "Excluded: documentation/test placeholder",
      attribution: "Excluded from the provider count: placeholder URL.",
      status: "excluded",
      references: [
        {
          path: "api/notification-channels.ts"
        }
      ]
    },
    {
      host: "investing.com",
      provider: "investing.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit investing.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ipinfo.io",
      provider: "ipinfo.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ipinfo.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "iranintl.com",
      provider: "iranintl.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit iranintl.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "iseas.edu.sg",
      provider: "iseas.edu.sg",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit iseas.edu.sg and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "islandtimes.org",
      provider: "islandtimes.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit islandtimes.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "iss.europa.eu",
      provider: "iss.europa.eu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit iss.europa.eu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "it.euronews.com",
      provider: "it.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit it.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "it.usembassy.gov",
      provider: "it.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit it.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "jam-news.net",
      provider: "jam-news.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit jam-news.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "jamestown.org",
      provider: "jamestown.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit jamestown.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "janes.com",
      provider: "janes.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit janes.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "japantoday.com",
      provider: "japantoday.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit japantoday.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "jin10.com",
      provider: "Jin10",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Jin10 and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "jira-software.status.atlassian.com",
      provider: "jira-software.status.atlassian.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit jira-software.status.atlassian.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "jmespath.org",
      provider: "jmespath.org",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/mcp/constants.ts"
        }
      ]
    },
    {
      host: "justice.gov",
      provider: "justice.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit justice.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "kalshi.com",
      provider: "kalshi.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit kalshi.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_bet-templates-markets.mjs"
        },
        {
          path: "scripts/seed-prediction-markets.mjs"
        }
      ]
    },
    {
      host: "kan11.media.kan.org.il",
      provider: "kan11.media.kan.org.il",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "kathimerini.gr",
      provider: "kathimerini.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit kathimerini.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "kitco.com",
      provider: "kitco.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit kitco.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "kr-asia.com",
      provider: "kr-asia.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit kr-asia.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "krebsonsecurity.com",
      provider: "krebsonsecurity.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit krebsonsecurity.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "kyivindependent.com",
      provider: "kyivindependent.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit kyivindependent.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "lavca.org",
      provider: "lavca.org",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit lavca.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "lefaso.net",
      provider: "leFaso.net",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit leFaso.net and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "lequotidien.sn",
      provider: "lequotidien.sn",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit lequotidien.sn and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "liberal.gr",
      provider: "liberal.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit liberal.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "libyaherald.com",
      provider: "Libya Herald",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Libya Herald and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "linear901-oo-hls0-prd-gtm.delivery.skycdp.com",
      provider: "linear901-oo-hls0-prd-gtm.delivery.skycdp.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "linearstatus.com",
      provider: "linearstatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit linearstatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "live-gbnews.simplestreamcdn.com",
      provider: "live-gbnews.simplestreamcdn.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live-hls-apps-aje-fa.getaj.net",
      provider: "live-hls-apps-aje-fa.getaj.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live-hls-web-aja.getaj.net",
      provider: "live-hls-web-aja.getaj.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live-hls-web-ajb.getaj.net",
      provider: "live-hls-web-ajb.getaj.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live-hls-web-ajm.getaj.net",
      provider: "live-hls-web-ajm.getaj.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live-stream.skynewsarabia.com",
      provider: "live-stream.skynewsarabia.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live.alarabiya.net",
      provider: "live.alarabiya.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "live.dodopayments.com",
      provider: "live.dodopayments.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/product-catalog.js"
        },
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "liveedge-arisenews.visioncdn.com",
      provider: "liveedge-arisenews.visioncdn.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "livenewschat.eu",
      provider: "livenewschat.eu",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "lnc-abc-news.tubi.video",
      provider: "lnc-abc-news.tubi.video",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "lobste.rs",
      provider: "lobste.rs",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit lobste.rs and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "localhost",
      provider: "Local development transport",
      kind: "feed+structured",
      observed: true,
      license: "Excluded: local development/test transport",
      attribution: "Excluded from the provider count: local-only URL.",
      status: "excluded",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        },
        {
          path: "src/components/LiveNewsPanel.ts"
        },
        {
          path: "src/services/wm-session.ts"
        }
      ]
    },
    {
      host: "lorientlejour.com",
      provider: "L'Orient Today",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit L'Orient Today and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "lowyinstitute.org",
      provider: "lowyinstitute.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit lowyinstitute.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "macleans.ca",
      provider: "macleans.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit macleans.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "madamasr.com",
      provider: "Mada Masr",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Mada Masr and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "maps.worldmonitor.app",
      provider: "maps.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/services/country-geometry.ts"
        }
      ]
    },
    {
      host: "mapservices.weather.noaa.gov",
      provider: "mapservices.weather.noaa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit mapservices.weather.noaa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-natural-events.mjs"
        }
      ]
    },
    {
      host: "marketwatch.com",
      provider: "marketwatch.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit marketwatch.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mcp.linear.app",
      provider: "Linear MCP",
      kind: "structured",
      observed: true,
      license: "Excluded: optional user-configured MCP connector",
      attribution: "Excluded from the provider count: user-configured MCP connector.",
      status: "excluded",
      references: [
        {
          path: "src/services/mcp-store.ts"
        }
      ]
    },
    {
      host: "mcp.robtex.com",
      provider: "Robtex MCP",
      kind: "structured",
      observed: true,
      license: "Excluded: optional user-configured MCP connector",
      attribution: "Excluded from the provider count: user-configured MCP connector.",
      status: "excluded",
      references: [
        {
          path: "src/services/mcp-store.ts"
        }
      ]
    },
    {
      host: "meduza.io",
      provider: "meduza.io",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit meduza.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mei.edu",
      provider: "mei.edu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit mei.edu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mempool.space",
      provider: "mempool.space",
      kind: "structured",
      observed: true,
      license: "mempool.space API terms; underlying Bitcoin data is public but endpoint terms apply",
      attribution: "mempool.space; link to the mining/hashrate API response.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-economy.mjs"
        }
      ]
    },
    {
      host: "messari.io",
      provider: "messari.io",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit messari.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mexiconewsdaily.com",
      provider: "mexiconewsdaily.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit mexiconewsdaily.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "miit.gov.cn",
      provider: "miit.gov.cn",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit miit.gov.cn and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mining-journal.com",
      provider: "mining-journal.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit mining-journal.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "miningweekly.com",
      provider: "miningweekly.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit miningweekly.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mm.usembassy.gov",
      provider: "mm.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit mm.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "mofcom.gov.cn",
      provider: "mofcom.gov.cn",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit mofcom.gov.cn and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "montrealgazette.com",
      provider: "montrealgazette.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit montrealgazette.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "moxie.foxbusiness.com",
      provider: "Fox Business",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Fox Business and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "moxie.foxnews.com",
      provider: "moxie.foxnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit moxie.foxnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "mshibanami.github.io",
      provider: "mshibanami.github.io",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit mshibanami.github.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "msi.nga.mil",
      provider: "msi.nga.mil",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit msi.nga.mil and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/get-cable-health.ts"
        },
        {
          path: "server/worldmonitor/maritime/v1/list-navigational-warnings.ts"
        }
      ]
    },
    {
      host: "mx.usembassy.gov",
      provider: "mx.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit mx.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "n1info.hr",
      provider: "n1info.hr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit n1info.hr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "nasstatus.faa.gov",
      provider: "nasstatus.faa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit nasstatus.faa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/_shared.ts"
        }
      ]
    },
    {
      host: "nation.africa",
      provider: "Daily Nation",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Daily Nation and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "nationalpost.com",
      provider: "nationalpost.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit nationalpost.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ndtvindiaelemarchana.akamaized.net",
      provider: "ndtvindiaelemarchana.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "news.cgtn.com",
      provider: "news.cgtn.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "news.crunchbase.com",
      provider: "news.crunchbase.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.crunchbase.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "news.err.ee",
      provider: "news.err.ee",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.err.ee and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "news.google.com",
      provider: "news.google.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.google.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/source-catalog-identity.mjs"
        },
        {
          path: "scripts/validate-rss-feeds.mjs"
        },
        {
          path: "server/worldmonitor/market/v1/stock-news-search.ts"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ],
      role: "transport"
    },
    {
      host: "news.mit.edu",
      provider: "news.mit.edu",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.mit.edu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "news.mongabay.com",
      provider: "news.mongabay.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.mongabay.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "news.tuoitre.vn",
      provider: "news.tuoitre.vn",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.tuoitre.vn and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "news.un.org",
      provider: "news.un.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.un.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "news.usni.org",
      provider: "news.usni.org",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit news.usni.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "news.ycombinator.com",
      provider: "news.ycombinator.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit news.ycombinator.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "newsfeed.zeit.de",
      provider: "newsfeed.zeit.de",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit newsfeed.zeit.de and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "newsmaker.md",
      provider: "newsmaker.md",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit newsmaker.md and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "nhkwlive-ojp.akamaized.net",
      provider: "nhkwlive-ojp.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "noaadata.apps.nsidc.org",
      provider: "NSIDC",
      kind: "structured",
      observed: true,
      license: "U.S. government/public dataset terms; collection-specific license applies",
      attribution: "National Snow and Ice Data Center (NSIDC); link to the dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-ocean-ice.mjs"
        }
      ]
    },
    {
      host: "nominatim.openstreetmap.org",
      provider: "nominatim.openstreetmap.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit nominatim.openstreetmap.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "api/reverse-geocode.js"
        },
        {
          path: "server/worldmonitor/infrastructure/v1/reverse-geocode.ts"
        }
      ]
    },
    {
      host: "northernminer.com",
      provider: "northernminer.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit northernminer.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "novayagazeta.eu",
      provider: "novayagazeta.eu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit novayagazeta.eu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "nrk-nrk1.akamaized.net",
      provider: "nrk-nrk1.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "nti.org",
      provider: "nti.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit nti.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "oauth.reddit.com",
      provider: "oauth.reddit.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit oauth.reddit.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "oc-media.org",
      provider: "oc-media.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit oc-media.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "oecd.org",
      provider: "oecd.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit oecd.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ogcapi.bgs.ac.uk",
      provider: "British Geological Survey World Mineral Statistics",
      kind: "structured",
      observed: true,
      license: "BGS mineral statistics terms; attribution required; redistribution restricted",
      attribution: "British Geological Survey (BGS) World Mineral Production; credit BGS and link to https://www.bgs.ac.uk/mineralsuk/statistics/world-mineral-statistics/.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-mineral-production.mjs"
        }
      ]
    },
    {
      host: "oglobo.globo.com",
      provider: "oglobo.globo.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit oglobo.globo.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "oilprice.com",
      provider: "oilprice.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit oilprice.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-energy-intelligence.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "oko.press",
      provider: "OKO.press",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit OKO.press and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "onemileatatime.com",
      provider: "onemileatatime.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit onemileatatime.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "open.alberta.ca",
      provider: "open.alberta.ca",
      kind: "structured",
      observed: false,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit open.alberta.ca and link to the original upstream API/dataset.",
      status: "excluded"
    },
    {
      host: "opendata.adsb.fi",
      provider: "adsb.fi Open Data",
      kind: "structured",
      observed: true,
      license: "Public API restricted to personal, non-commercial use; 1 request/second limit",
      attribution: "adsb.fi; cite and link to https://github.com/adsbfi/opendata and comply with its non-commercial restriction.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-military-flights.mjs"
        },
        {
          path: "src/components/MapPopup.ts"
        }
      ]
    },
    {
      host: "openmaps.gov.bc.ca",
      provider: "BC Wildfire Service (OpenMaps)",
      kind: "structured",
      observed: true,
      license: "Open Government Licence - British Columbia; redistribution granted (copy, modify, publish, distribute, including commercial use) with attribution",
      attribution: "Contains information licensed under the Open Government Licence \u2013 British Columbia. BC Wildfire Service, Current Fire Locations (PROT_CURRENT_FIRE_PNTS_SP), Government of British Columbia. https://catalogue.data.gov.bc.ca/dataset/bc-wildfire-fire-locations-current. Evidence: https://www2.gov.bc.ca/gov/content/data/policy-standards/data-policies/open-data/open-government-licence-bc and https://open.canada.ca/data/en/dataset/2790e3f7-6395-4230-8545-04efb5a18800",
      status: "reviewed",
      references: [
        {
          path: "scripts/wildfire/bc-fire-points.mjs"
        }
      ]
    },
    {
      host: "openrouter.ai",
      provider: "openrouter.ai",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/lib/brief-dedup-consts.mjs"
        },
        {
          path: "scripts/lib/company-monitoring-classifier-client.mjs"
        },
        {
          path: "scripts/regional-snapshot/weekly-brief.mjs"
        }
      ]
    },
    {
      host: "opensky-network.org",
      provider: "opensky-network.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit opensky-network.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-military-flights.mjs"
        },
        {
          path: "server/worldmonitor/military/v1/list-military-flights.ts"
        },
        {
          path: "src/components/MapPopup.ts"
        }
      ]
    },
    {
      host: "openstreetmap.org",
      provider: "openstreetmap.org",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/config/basemap-styles.ts"
        }
      ]
    },
    {
      host: "ott.tv5monde.com",
      provider: "ott.tv5monde.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "ottawacitizen.com",
      provider: "ottawacitizen.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ottawacitizen.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "otx.alienvault.com",
      provider: "otx.alienvault.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit otx.alienvault.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "ourworldindata.org",
      provider: "Our World in Data",
      kind: "structured",
      observed: true,
      license: "CC BY 4.0 for the dataset unless the dataset page states otherwise",
      attribution: "Our World in Data; link to the dataset page.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-low-carbon-generation.mjs"
        }
      ]
    },
    {
      host: "outbreaknewstoday.com",
      provider: "outbreaknewstoday.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit outbreaknewstoday.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-disease-outbreaks.mjs"
        }
      ]
    },
    {
      host: "overpass-api.de",
      provider: "overpass-api.de",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit overpass-api.de and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/fetch-osm-bases.mjs"
        }
      ]
    },
    {
      host: "owid-public.owid.io",
      provider: "Our World in Data",
      kind: "structured",
      observed: true,
      license: "CC BY 4.0 for the dataset unless the dataset page states otherwise",
      attribution: "Our World in Data; link to the dataset page.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-owid-energy-mix.mjs"
        }
      ]
    },
    {
      host: "pajhwok.com",
      provider: "Pajhwok Afghan News",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Pajhwok Afghan News and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "pap.pl",
      provider: "PAP",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit PAP and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "patents.google.com",
      provider: "patents.google.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit patents.google.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_defense-patents-source.mjs"
        }
      ]
    },
    {
      host: "pe-fa-lp02a.9c9media.com",
      provider: "pe-fa-lp02a.9c9media.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "phys.org",
      provider: "phys.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit phys.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "pitchbook.com",
      provider: "pitchbook.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit pitchbook.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "pk.usembassy.gov",
      provider: "pk.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit pk.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "pl.usembassy.gov",
      provider: "pl.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit pl.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "polityka.pl",
      provider: "Polityka",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Polityka and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "polymarket.com",
      provider: "polymarket.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit polymarket.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_bet-templates-markets.mjs"
        },
        {
          path: "scripts/seed-prediction-markets.mjs"
        }
      ]
    },
    {
      host: "population.un.org",
      provider: "United Nations Population Division",
      kind: "structured",
      observed: true,
      license: "UN World Population Prospects 2024 is licensed under CC BY 3.0 IGO.",
      attribution: "United Nations, Department of Economic and Social Affairs, Population Division (2024). World Population Prospects 2024.",
      status: "reviewed",
      references: [
        {
          path: "scripts/_demographics-capability-source.mjs"
        }
      ]
    },
    {
      host: "portfolio.hu",
      provider: "portfolio.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit portfolio.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "portwatch.imf.org",
      provider: "portwatch.imf.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit portwatch.imf.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/build-chokepoint-transit-snapshot.mjs"
        },
        {
          path: "scripts/build-research-reports.mjs"
        }
      ]
    },
    {
      host: "pravda.com.ua",
      provider: "pravda.com.ua",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit pravda.com.ua and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "prnewswire.com",
      provider: "PR Newswire",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit PR Newswire and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "pro-api.coingecko.com",
      provider: "pro-api.coingecko.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit pro-api.coingecko.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "production.dataviz.cnn.io",
      provider: "production.dataviz.cnn.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit production.dataviz.cnn.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fear-greed.mjs"
        }
      ]
    },
    {
      host: "protomaps.com",
      provider: "protomaps.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/config/basemap-styles.ts"
        }
      ]
    },
    {
      host: "protothema.gr",
      provider: "protothema.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit protothema.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "proxy.worldmonitor.app",
      provider: "World Monitor proxy",
      kind: "structured",
      observed: true,
      license: "Excluded: World Monitor own service/control plane",
      attribution: "Excluded from the external-provider count: first-party proxy endpoint.",
      status: "excluded",
      references: [
        {
          path: "api/widget-agent.ts"
        },
        {
          path: "scripts/seed-security-advisories.mjs"
        },
        {
          path: "src/utils/proxy.ts"
        }
      ]
    },
    {
      host: "pt.euronews.com",
      provider: "pt.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit pt.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "public.govdelivery.com",
      provider: "public.govdelivery.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit public.govdelivery.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-regulatory-actions.mjs"
        }
      ]
    },
    {
      host: "publicacionexterna.azurewebsites.net",
      provider: "publicacionexterna.azurewebsites.net",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit publicacionexterna.azurewebsites.net and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "publicreporting.cftc.gov",
      provider: "CFTC Commitments of Traders",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; endpoint terms apply",
      attribution: "U.S. Commodity Futures Trading Commission (CFTC), Commitments of Traders.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-cot.mjs"
        }
      ]
    },
    {
      host: "purl.org",
      provider: "PURL namespace",
      kind: "structured",
      observed: true,
      license: "Excluded: schema/namespace reference",
      attribution: "Excluded from the provider count: namespace reference, not an ingested source.",
      status: "excluded",
      references: [
        {
          path: "src/services/rss.ts"
        }
      ]
    },
    {
      host: "qevdnlpgjxpwusesmtpx.supabase.co",
      provider: "qevdnlpgjxpwusesmtpx.supabase.co",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit qevdnlpgjxpwusesmtpx.supabase.co and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/fetch-pizzint-bases.mjs"
        }
      ]
    },
    {
      host: "query.sse.com.cn",
      provider: "query.sse.com.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit query.sse.com.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-corporate-disclosures/adapters.mjs"
        }
      ]
    },
    {
      host: "query.wikidata.org",
      provider: "query.wikidata.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit query.wikidata.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/intelligence/v1/get-country-facts.ts"
        }
      ]
    },
    {
      host: "query1.finance.yahoo.com",
      provider: "query1.finance.yahoo.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit query1.finance.yahoo.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_seed-utils.mjs"
        },
        {
          path: "scripts/_yahoo-fetch.mjs"
        },
        {
          path: "scripts/_yahoo-sector-valuations.cjs"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-commodity-quotes.mjs"
        },
        {
          path: "scripts/seed-economy.mjs"
        },
        {
          path: "scripts/seed-etf-flows.mjs"
        },
        {
          path: "scripts/seed-fear-greed.mjs"
        },
        {
          path: "scripts/seed-fx-yoy.mjs"
        },
        {
          path: "scripts/seed-gulf-quotes.mjs"
        },
        {
          path: "scripts/seed-market-correlation-series.mjs"
        },
        {
          path: "scripts/seed-market-quotes.mjs"
        },
        {
          path: "server/worldmonitor/market/v1/_shared.ts"
        },
        {
          path: "server/worldmonitor/market/v1/analyze-stock.ts"
        },
        {
          path: "server/worldmonitor/market/v1/get-country-stock-index.ts"
        }
      ]
    },
    {
      host: "radar.mcp.cloudflare.com",
      provider: "Cloudflare Radar MCP",
      kind: "structured",
      observed: true,
      license: "Excluded: optional user-configured MCP connector",
      attribution: "Excluded from the provider count: user-configured MCP connector.",
      status: "excluded",
      references: [
        {
          path: "src/services/mcp-store.ts"
        }
      ]
    },
    {
      host: "radnet.epa.gov",
      provider: "EPA RadNet",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; EPA terms apply",
      attribution: "U.S. Environmental Protection Agency (EPA) RadNet.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-radiation-watch.mjs"
        }
      ]
    },
    {
      host: "railway.instatus.com",
      provider: "railway.instatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit railway.instatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "rakuten-guardian-1-ie.samsung.wurl.tv",
      provider: "rakuten-guardian-1-ie.samsung.wurl.tv",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "raw.githubusercontent.com",
      provider: "raw.githubusercontent.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit raw.githubusercontent.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/fetch-country-boundary-overrides.mjs"
        },
        {
          path: "scripts/generate-airline-codes.mjs"
        },
        {
          path: "scripts/generate-oref-locations.mjs"
        },
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "scripts/seed-disease-outbreaks.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "reasonstobecheerful.world",
      provider: "reasonstobecheerful.world",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit reasonstobecheerful.world and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "reddit.com",
      provider: "reddit.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "src/services/story-share.ts"
        }
      ]
    },
    {
      host: "reliefweb.int",
      provider: "reliefweb.int",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit reliefweb.int and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "renaissancecapital.com",
      provider: "renaissancecapital.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit renaissancecapital.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "responsiblestatecraft.org",
      provider: "responsiblestatecraft.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit responsiblestatecraft.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "restcountries.com",
      provider: "restcountries.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit restcountries.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/intelligence/v1/get-country-facts.ts"
        }
      ]
    },
    {
      host: "reuters-reutersnow-1-eu.rakuten.wurl.tv",
      provider: "reuters-reutersnow-1-eu.rakuten.wurl.tv",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "reuters.com",
      provider: "reuters.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit reuters.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "review.firstround.com",
      provider: "review.firstround.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit review.firstround.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "rferl.org",
      provider: "rferl.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rferl.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rieti.go.jp",
      provider: "rieti.go.jp",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rieti.go.jp and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rsf.org",
      provider: "Reporters Without Borders (RSF)",
      kind: "structured",
      observed: true,
      license: "RSF terms; attribution required",
      attribution: "Reporters Without Borders (RSF) World Press Freedom Index.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-resilience-static.mjs"
        }
      ]
    },
    {
      host: "rss.art19.com",
      provider: "rss.art19.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rss.art19.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rss.dw.com",
      provider: "rss.dw.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rss.dw.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rss.libsyn.com",
      provider: "rss.libsyn.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rss.libsyn.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rss.politico.com",
      provider: "rss.politico.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rss.politico.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "rt-arb.rttv.com",
      provider: "rt-arb.rttv.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "rt-esp.rttv.com",
      provider: "rt-esp.rttv.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "rt-glb.rttv.com",
      provider: "rt-glb.rttv.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "ru.euronews.com",
      provider: "ru.euronews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ru.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rudaw.net",
      provider: "rudaw.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rudaw.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "rusi.org",
      provider: "rusi.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit rusi.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "sabconetanw.cdn.mangomolo.com",
      provider: "sabconetanw.cdn.mangomolo.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "sanaacenter.org",
      provider: "Sana'a Center",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Sana'a Center and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "sanctionslistservice.ofac.treas.gov",
      provider: "sanctionslistservice.ofac.treas.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit sanctionslistservice.ofac.treas.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-sanctions-pressure.mjs"
        }
      ]
    },
    {
      host: "schema.org",
      provider: "schema.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit schema.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "api/ask.ts"
        },
        {
          path: "scripts/build-crawlable-corpus.mjs"
        }
      ]
    },
    {
      host: "schemas.agentskills.io",
      provider: "schemas.agentskills.io",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/build-agent-skills-index.mjs"
        }
      ]
    },
    {
      host: "scmp.com",
      provider: "scmp.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit scmp.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "sdmx.ilo.org",
      provider: "ILOSTAT",
      kind: "structured",
      observed: true,
      license: "ILOSTAT datasets and metadata published from 3 May 2023 are licensed under CC BY 4.0.",
      attribution: "International Labour Organization, ILOSTAT database; include the dataset and extraction date.",
      status: "reviewed",
      references: [
        {
          path: "scripts/_demographics-capability-source.mjs"
        }
      ]
    },
    {
      host: "sealevel.nasa.gov",
      provider: "sealevel.nasa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit sealevel.nasa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-ocean-ice.mjs"
        }
      ]
    },
    {
      host: "search.parallel.ai",
      provider: "Parallel Search MCP",
      kind: "structured",
      observed: true,
      license: "Excluded: optional user-configured MCP connector",
      attribution: "Excluded from the provider count: user-configured MCP connector.",
      status: "excluded",
      references: [
        {
          path: "src/services/mcp-store.ts"
        }
      ]
    },
    {
      host: "search.seznam.cz",
      provider: "search.seznam.cz",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seo-indexnow-submit.mjs"
        }
      ]
    },
    {
      host: "search.worldbank.org",
      provider: "search.worldbank.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit search.worldbank.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "search.yahoo.com",
      provider: "search.yahoo.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/services/rss.ts"
        }
      ]
    },
    {
      host: "searchadvisor.naver.com",
      provider: "searchadvisor.naver.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seo-indexnow-submit.mjs"
        }
      ]
    },
    {
      host: "secure.toronto.ca",
      provider: "City of Toronto Open Data",
      kind: "structured",
      observed: true,
      license: 'CKAN package_show for road-restrictions: license_id=notspecified, license_title="License not specified" (https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=road-restrictions). Portal dataset page chrome links OGL-Toronto but is not data-bound to this dataset.',
      attribution: "City of Toronto, Road Restrictions. https://open.toronto.ca/dataset/road-restrictions/",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/toronto-road-restrictions.mjs"
        }
      ]
    },
    {
      host: "sedeaplicaciones.minetur.gob.es",
      provider: "sedeaplicaciones.minetur.gob.es",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit sedeaplicaciones.minetur.gob.es and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/backfill-fuel-prices-prev.mjs"
        },
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "seekingalpha.com",
      provider: "seekingalpha.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit seekingalpha.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "semianalysis.com",
      provider: "semianalysis.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit semianalysis.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "sequoiacap.com",
      provider: "sequoiacap.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit sequoiacap.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "serpapi.com",
      provider: "SerpAPI",
      kind: "structured",
      observed: true,
      license: "SerpAPI terms",
      attribution: "SerpAPI; link to the result and original publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/market/v1/stock-news-search.ts"
        }
      ]
    },
    {
      host: "services.arcgis.com",
      provider: "Toronto Police Service",
      kind: "structured",
      observed: true,
      license: "Open Government Licence \u2013 Ontario as published on the TPS Calls for Service Experience item a22f5295933e48a5b0a4c90cd3c4cae1 (licenseInfo), plus TPS Public Safety Data Portal terms on that item: no identification of individuals, no TPS marks. Layer C4S_Public_NoGO is the privacy-filtered public Calls-for-Service map (refresh ~20 min). Not Major Crime Indicators / YTD.",
      attribution: "Toronto Police Service, Calls for Service. Contains information licensed under the Open Government Licence \u2013 Ontario.",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/toronto-official-cad.mjs"
        },
        {
          path: "scripts/lib/tps-open-data.mjs"
        }
      ]
    },
    {
      host: "services6.arcgis.com",
      provider: "B.C. Evacuation Orders and Alerts",
      kind: "structured",
      observed: true,
      license: "Open Government Licence - British Columbia (OGL-BC). The B.C. Data Catalogue record 7efd46d0-b5d3-4dff-af80-d376c42aec33 explicitly assigns OGL-BC to this ArcGIS layer.",
      attribution: "Contains information licensed under the Open Government Licence - British Columbia. https://catalogue.data.gov.bc.ca/dataset/7efd46d0-b5d3-4dff-af80-d376c42aec33",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/bc-emergency-info.mjs"
        }
      ]
    },
    {
      host: "services7.arcgis.com",
      provider: "services7.arcgis.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit services7.arcgis.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/fetch-mirta-bases.mjs"
        }
      ]
    },
    {
      host: "services9.arcgis.com",
      provider: "services9.arcgis.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit services9.arcgis.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/build-chokepoint-transit-snapshot.mjs"
        },
        {
          path: "scripts/seed-portwatch-chokepoints-ref.mjs"
        },
        {
          path: "scripts/seed-portwatch-disruptions.mjs"
        },
        {
          path: "scripts/seed-portwatch-port-activity.mjs"
        },
        {
          path: "scripts/seed-portwatch.mjs"
        }
      ]
    },
    {
      host: "severeweather.wmo.int",
      provider: "severeweather.wmo.int",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit severeweather.wmo.int and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_weather-alert-select.mjs"
        }
      ]
    },
    {
      host: "sifted.eu",
      provider: "sifted.eu",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit sifted.eu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "simpleflying.com",
      provider: "simpleflying.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit simpleflying.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "singularityhub.com",
      provider: "singularityhub.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit singularityhub.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "slack-status.com",
      provider: "slack-status.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit slack-status.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "slack.com",
      provider: "slack.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/slack/oauth/callback.ts"
        },
        {
          path: "api/slack/oauth/start.ts"
        }
      ]
    },
    {
      host: "slidstvo.info",
      provider: "slidstvo.info",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit slidstvo.info and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "spglobal.com",
      provider: "spglobal.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit spglobal.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "state.gov",
      provider: "state.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit state.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "stats.bis.org",
      provider: "stats.bis.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit stats.bis.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-bis-data.mjs"
        },
        {
          path: "scripts/seed-bis-extended.mjs"
        },
        {
          path: "scripts/seed-bis-lbs.mjs"
        },
        {
          path: "server/worldmonitor/economic/v1/_bis-shared.ts"
        }
      ]
    },
    {
      host: "status.circleci.com",
      provider: "status.circleci.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.circleci.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.claude.com",
      provider: "status.claude.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.claude.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.cloud.google.com",
      provider: "status.cloud.google.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.cloud.google.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.datadoghq.com",
      provider: "status.datadoghq.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.datadoghq.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.digitalocean.com",
      provider: "status.digitalocean.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.digitalocean.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.gitlab.com",
      provider: "status.gitlab.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.gitlab.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.npmjs.org",
      provider: "status.npmjs.org",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.npmjs.org and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.openai.com",
      provider: "status.openai.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.openai.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.render.com",
      provider: "status.render.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.render.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.sentry.io",
      provider: "status.sentry.io",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.sentry.io and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.stripe.com",
      provider: "status.stripe.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.stripe.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.supabase.com",
      provider: "status.supabase.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.supabase.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "status.twilio.com",
      provider: "status.twilio.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit status.twilio.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "storage.googleapis.com",
      provider: "Ember electricity data",
      kind: "structured",
      observed: true,
      license: "CC BY 4.0 (Ember dataset)",
      attribution: "Ember; link to the Ember dataset and preserve its license notice.",
      status: "reviewed",
      references: [
        {
          path: "scripts/_conflict-gdelt-bulk.mjs"
        },
        {
          path: "scripts/_gdelt-bulk-materializer.mjs"
        },
        {
          path: "scripts/seed-ember-electricity.mjs"
        }
      ]
    },
    {
      host: "stratechery.com",
      provider: "stratechery.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit stratechery.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "stream.ads.ottera.tv",
      provider: "stream.ads.ottera.tv",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "streaming-live.rtp.pt",
      provider: "streaming-live.rtp.pt",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "suspilne.media",
      provider: "suspilne.media",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit suspilne.media and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "svs.itworkscdn.net",
      provider: "svs.itworkscdn.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "syriadirect.org",
      provider: "Syria Direct",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Syria Direct and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "t.me",
      provider: "t.me",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/worldmonitor/leads/v1/register-interest.ts"
        },
        {
          path: "src/services/story-share.ts"
        }
      ]
    },
    {
      host: "tagesschau.akamaized.net",
      provider: "tagesschau.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "taipeitimes.com",
      provider: "taipeitimes.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit taipeitimes.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "taiwannews.com.tw",
      provider: "taiwannews.com.tw",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit taiwannews.com.tw and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "taskandpurpose.com",
      provider: "taskandpurpose.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit taskandpurpose.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "tass.com",
      provider: "tass.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit tass.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "tchadinfos.com",
      provider: "Tchadinfos",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Tchadinfos and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "tech.eu",
      provider: "tech.eu",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit tech.eu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "tech.worldmonitor.app",
      provider: "tech.worldmonitor.app",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/app/panel-layout.ts"
        },
        {
          path: "src/config/variant-meta.ts"
        }
      ]
    },
    {
      host: "techcabal.com",
      provider: "techcabal.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit techcabal.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "techcrunch.com",
      provider: "techcrunch.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit techcrunch.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "techinasia.com",
      provider: "techinasia.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit techinasia.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "telegraaf.nl",
      provider: "telegraaf.nl",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit telegraaf.nl and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "telex.hu",
      provider: "telex.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit telex.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "test",
      provider: "test",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seed-forecasts.mjs"
        }
      ]
    },
    {
      host: "test.dodopayments.com",
      provider: "test.dodopayments.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/product-catalog.js"
        },
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "th.usembassy.gov",
      provider: "th.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit th.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "thebetterindia.com",
      provider: "thebetterindia.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thebetterindia.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "theblock.co",
      provider: "theblock.co",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit theblock.co and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thebulletin.org",
      provider: "thebulletin.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thebulletin.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thedailystar.net",
      provider: "The Daily Star",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit The Daily Star and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thedefiant.io",
      provider: "thedefiant.io",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thedefiant.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thediplomat.com",
      provider: "thediplomat.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thediplomat.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "theguardianpostcameroon.com",
      provider: "The Guardian Post",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit The Guardian Post and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thehill.com",
      provider: "thehill.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thehill.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "theinformation.com",
      provider: "theinformation.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit theinformation.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thejakartapost.com",
      provider: "thejakartapost.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thejakartapost.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thenarwhal.ca",
      provider: "thenarwhal.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thenarwhal.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thenationalnews.com",
      provider: "thenationalnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thenationalnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thenewstack.io",
      provider: "thenewstack.io",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thenewstack.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "thenextweb.com",
      provider: "thenextweb.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thenextweb.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thepointsguy.com",
      provider: "thepointsguy.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit thepointsguy.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "theprovince.com",
      provider: "theprovince.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit theprovince.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thesentry.org",
      provider: "thesentry.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thesentry.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thestar.com.my",
      provider: "thestar.com.my",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thestar.com.my and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thetyee.ca",
      provider: "thetyee.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit thetyee.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "thinkglobalhealth.github.io",
      provider: "thinkglobalhealth.github.io",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit thinkglobalhealth.github.io and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-disease-outbreaks.mjs"
        },
        {
          path: "scripts/seed-vpd-tracker.mjs"
        }
      ]
    },
    {
      host: "tiles.openfreemap.org",
      provider: "tiles.openfreemap.org",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/config/basemap.ts"
        }
      ]
    },
    {
      host: "timesca.com",
      provider: "timesca.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit timesca.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "timesofindia.indiatimes.com",
      provider: "Times of India",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Times of India and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "tools.cdc.gov",
      provider: "tools.cdc.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit tools.cdc.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-disease-outbreaks.mjs"
        }
      ]
    },
    {
      host: "travel.state.gov",
      provider: "travel.state.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit travel.state.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "treasury.gov",
      provider: "treasury.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit treasury.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "trumpstruth.org",
      provider: "trumpstruth.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit trumpstruth.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "tsimobile.viarail.ca",
      provider: "VIA Rail Tracker (unofficial)",
      kind: "structured",
      observed: true,
      license: "VIA Rail Site Terms prohibit commercial use of the Site (https://www.viarail.ca/en/terms-and-conditions). Developer Resources publish GTFS only under Open Government Licence \u2013 Canada v2 (https://www.viarail.ca/en/developer-resources); that OGL grant does not cover tsimobile.viarail.ca unofficial live JSON. Terms require review.",
      attribution: "VIA Rail Canada; unofficial live train JSON at tsimobile.viarail.ca. Not the Developer Resources GTFS feed; OGL does not apply to this host. Best-effort only.",
      status: "terms-review",
      references: [
        {
          path: "scripts/viarail-live.mjs"
        }
      ]
    },
    {
      host: "tts.baidu.com",
      provider: "tts.baidu.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/main.ts"
        }
      ]
    },
    {
      host: "tuoitrenews.vn",
      provider: "tuoitrenews.vn",
      kind: "feed",
      observed: false,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit tuoitrenews.vn and link to the original feed publisher.",
      status: "excluded"
    },
    {
      host: "turnerlive.warnermediacdn.com",
      provider: "turnerlive.warnermediacdn.com",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "tv-trtworld.medya.trt.com.tr",
      provider: "tv-trtworld.medya.trt.com.tr",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "tvn24.pl",
      provider: "tvn24.pl",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit tvn24.pl and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "tvp.info",
      provider: "TVP Info",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit TVP Info and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "twitter.com",
      provider: "twitter.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/services/story-share.ts"
        }
      ]
    },
    {
      host: "ua.usembassy.gov",
      provider: "ua.usembassy.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ua.usembassy.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "ucdpapi.pcr.uu.se",
      provider: "ucdpapi.pcr.uu.se",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit ucdpapi.pcr.uu.se and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-ucdp-events.mjs"
        }
      ]
    },
    {
      host: "ukrinform.net",
      provider: "ukrinform.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ukrinform.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "ukrinform.ua",
      provider: "ukrinform.ua",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit ukrinform.ua and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "unchainedcrypto.com",
      provider: "unchainedcrypto.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit unchainedcrypto.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "understandingwar.org",
      provider: "understandingwar.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit understandingwar.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "unhcr.org",
      provider: "unhcr.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit unhcr.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "urlhaus-api.abuse.ch",
      provider: "urlhaus-api.abuse.ch",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit urlhaus-api.abuse.ch and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-cyber-threats.mjs"
        },
        {
          path: "server/worldmonitor/cyber/v1/_shared.ts"
        }
      ]
    },
    {
      host: "user",
      provider: "Proxy URL placeholder",
      kind: "structured",
      observed: true,
      license: "Excluded: URL-format example",
      attribution: "Excluded from the provider count: credentials placeholder.",
      status: "excluded",
      references: [
        {
          path: "scripts/_proxy-utils.cjs"
        },
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "ustr.gov",
      provider: "Office of the U.S. Trade Representative",
      kind: "feed",
      observed: true,
      license: "U.S. government public information; site and document-specific notices apply",
      attribution: "Office of the U.S. Trade Representative; link to the original release.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "vancouversun.com",
      provider: "vancouversun.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit vancouversun.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "venturebeat.com",
      provider: "venturebeat.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit venturebeat.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "viewfromthewing.com",
      provider: "viewfromthewing.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit viewfromthewing.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "vnexpress.net",
      provider: "vnexpress.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit vnexpress.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "vs-hls-push-uk.live.fastly.md.bbci.co.uk",
      provider: "vs-hls-push-uk.live.fastly.md.bbci.co.uk",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "vsquare.org",
      provider: "vsquare.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit vsquare.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "wa.me",
      provider: "wa.me",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "server/worldmonitor/leads/v1/register-interest.ts"
        },
        {
          path: "src/services/story-share.ts"
        }
      ]
    },
    {
      host: "wabi-europe-north-b-api.analysis.windows.net",
      provider: "wabi-europe-north-b-api.analysis.windows.net",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit wabi-europe-north-b-api.analysis.windows.net and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-hormuz.mjs"
        }
      ]
    },
    {
      host: "warontherocks.com",
      provider: "warontherocks.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit warontherocks.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "web-api.tp.entsoe.eu",
      provider: "ENTSO-E Transparency Platform",
      kind: "structured",
      observed: true,
      license: "ENTSO-E Transparency Platform terms",
      attribution: "ENTSO-E Transparency Platform; link to the returned dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-electricity-prices.mjs"
        }
      ]
    },
    {
      host: "web.archive.org",
      provider: "web.archive.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit web.archive.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fatf-listing.mjs"
        }
      ]
    },
    {
      host: "web.cbr.ru",
      provider: "web.cbr.ru",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seed-cbr-rates.mjs"
        }
      ]
    },
    {
      host: "webcams.windy.com",
      provider: "webcams.windy.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/PinnedWebcamsPanel.ts"
        }
      ]
    },
    {
      host: "websummit.com",
      provider: "websummit.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit websummit.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        }
      ]
    },
    {
      host: "whitehouse.gov",
      provider: "whitehouse.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit whitehouse.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "wiadomosci.onet.pl",
      provider: "Onet",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Onet and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "wilsoncenter.org",
      provider: "wilsoncenter.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit wilsoncenter.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "wingbits.com",
      provider: "wingbits.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/MapPopup.ts"
        }
      ]
    },
    {
      host: "workos.com",
      provider: "workos.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/oauth-authorization-server.ts"
        }
      ]
    },
    {
      host: "worldmonitor.app",
      provider: "World Monitor web app",
      kind: "feed+structured",
      observed: true,
      license: "Excluded: World Monitor own web application",
      attribution: "Excluded from the external-provider count: first-party web origin.",
      status: "excluded",
      references: [
        {
          path: "api/_agent-metadata.ts"
        },
        {
          path: "api/a2a.ts"
        },
        {
          path: "api/ask.ts"
        },
        {
          path: "api/fwdstart.js"
        },
        {
          path: "api/not-found.ts"
        },
        {
          path: "api/oauth/authorize.js"
        },
        {
          path: "api/og-story.js"
        },
        {
          path: "api/opensky.js"
        },
        {
          path: "api/referral/me.ts"
        },
        {
          path: "api/reverse-geocode.js"
        },
        {
          path: "api/story.js"
        },
        {
          path: "scripts/_upstash-rest.mjs"
        },
        {
          path: "scripts/build-agent-skills-index.mjs"
        },
        {
          path: "scripts/capture-mcp-fixture.mjs"
        },
        {
          path: "scripts/china-coverage-health.mjs"
        },
        {
          path: "scripts/china-macro/calendar.mjs"
        },
        {
          path: "scripts/cross-strait-activity/adapters.mjs"
        },
        {
          path: "scripts/generate-sandbox-fixtures.mjs"
        },
        {
          path: "scripts/lib/brief-embedding.mjs"
        },
        {
          path: "scripts/lib/company-monitoring-classifier-client.mjs"
        },
        {
          path: "scripts/lib/x-news-accounts.cjs"
        },
        {
          path: "scripts/mcp-live-smoke.mjs"
        },
        {
          path: "scripts/measure-mobile-mainthread.mjs"
        },
        {
          path: "scripts/measure-tools-list-compression.mjs"
        },
        {
          path: "scripts/notification-relay.cjs"
        },
        {
          path: "scripts/seed-digest-notifications.mjs"
        },
        {
          path: "scripts/seed-hyperliquid-flow.mjs"
        },
        {
          path: "scripts/seed-infra.mjs"
        },
        {
          path: "scripts/seed-insights.mjs"
        },
        {
          path: "scripts/seed-military-maritime-news.mjs"
        },
        {
          path: "scripts/seed-service-statuses.mjs"
        },
        {
          path: "scripts/seed-wb-indicators.mjs"
        },
        {
          path: "scripts/validate-seed-migration.mjs"
        },
        {
          path: "server/_shared/brief-url.ts"
        },
        {
          path: "server/_shared/intel-history-embed.ts"
        },
        {
          path: "server/gateway.ts"
        },
        {
          path: "server/worldmonitor/infrastructure/v1/reverse-geocode.ts"
        },
        {
          path: "src/app/panel-layout.ts"
        },
        {
          path: "src/bootstrap/web-vitals-utils.ts"
        },
        {
          path: "src/components/LiveNewsPanel.ts"
        },
        {
          path: "src/config/web-origin.ts"
        },
        {
          path: "src/services/premium-fetch.ts"
        },
        {
          path: "src/services/runtime.ts"
        },
        {
          path: "src/settings-main.ts"
        }
      ]
    },
    {
      host: "worldmonitor.invalid",
      provider: "WorldMonitor test origin",
      kind: "structured",
      observed: true,
      license: "Excluded: test-only origin",
      attribution: "Excluded from the provider count: test-only URL.",
      status: "excluded",
      references: [
        {
          path: "src/shared/public-rpc-cache.ts"
        }
      ]
    },
    {
      host: "worldmonitor.mintlify.dev",
      provider: "worldmonitor.mintlify.dev",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/docs-mcp.ts"
        }
      ]
    },
    {
      host: "wublockchain.com",
      provider: "wublockchain.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit wublockchain.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.14ymedio.com",
      provider: "14ymedio",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit 14ymedio and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.972mag.com",
      provider: "+972 Magazine",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit +972 Magazine and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.a16z.news",
      provider: "www.a16z.news",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.a16z.news and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.aaii.com",
      provider: "www.aaii.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.aaii.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aaii-sentiment.mjs"
        },
        {
          path: "scripts/seed-fear-greed.mjs"
        }
      ]
    },
    {
      host: "www.aajtak.in",
      provider: "www.aajtak.in",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.aajtak.in and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.aaronsw.com",
      provider: "www.aaronsw.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.aaronsw.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.abc.net.au",
      provider: "www.abc.net.au",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.abc.net.au and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.africanews.com",
      provider: "www.africanews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.africanews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.afro.who.int",
      provider: "www.afro.who.int",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.afro.who.int and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "www.aftenposten.no",
      provider: "www.aftenposten.no",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.aftenposten.no and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.alarabiya.net",
      provider: "www.alarabiya.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.alarabiya.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.alberta.ca",
      provider: "Alberta Emergency Alert",
      kind: "structured",
      observed: true,
      license: "Alberta.ca terms of use. Open Government Licence - Alberta exists on the open.alberta.ca licence page but is not bound to the AEA Atom feed on a live dataset page (the alberta-emergency-alert.aspx page has no OGL statement).",
      attribution: "Alberta Emergency Alert, Government of Alberta. https://www.alberta.ca/alberta-emergency-alert.aspx",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/alberta-emergency-alert.mjs"
        },
        {
          path: "scripts/source-attribution.mjs"
        }
      ]
    },
    {
      host: "www.aljazeera.com",
      provider: "www.aljazeera.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.aljazeera.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.aljazeera.net",
      provider: "www.aljazeera.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.aljazeera.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.alphavantage.co",
      provider: "www.alphavantage.co",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.alphavantage.co and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/_shared-av.mjs"
        },
        {
          path: "server/worldmonitor/market/v1/_quote-provider.ts"
        },
        {
          path: "server/worldmonitor/market/v1/_shared.ts"
        }
      ]
    },
    {
      host: "www.alwihdainfo.com",
      provider: "Alwihda Info",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Alwihda Info and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.amarujala.com",
      provider: "www.amarujala.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.amarujala.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ansa.it",
      provider: "www.ansa.it",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ansa.it and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.asahi.com",
      provider: "www.asahi.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.asahi.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.atlanticcouncil.org",
      provider: "www.atlanticcouncil.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.atlanticcouncil.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.atv.hu",
      provider: "www.atv.hu",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.atv.hu and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.australianmining.com.au",
      provider: "www.australianmining.com.au",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.australianmining.com.au and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.aviationpros.com",
      provider: "www.aviationpros.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.aviationpros.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "www.aviationweek.com",
      provider: "www.aviationweek.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.aviationweek.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "www.bankofcanada.ca",
      provider: "Bank of Canada",
      kind: "structured",
      observed: true,
      license: "Bank of Canada Terms of Use \u2014 permission to freely use, copy, distribute and transmit website content with attribution (https://www.bankofcanada.ca/terms/)",
      attribution: "Bank of Canada Valet API; link to https://www.bankofcanada.ca/valet/ and the Terms of Use at https://www.bankofcanada.ca/terms/.",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/boc-valet.mjs"
        }
      ]
    },
    {
      host: "www.barchart.com",
      provider: "Barchart",
      kind: "structured",
      observed: true,
      license: "Barchart terms; redistribution requires review",
      attribution: "Barchart; link to the source quote or page.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fear-greed.mjs"
        },
        {
          path: "scripts/seed-market-breadth.mjs"
        }
      ]
    },
    {
      host: "www.bbc.com",
      provider: "BBC",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.bbc.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.bild.de",
      provider: "www.bild.de",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.bild.de and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.bing.com",
      provider: "www.bing.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seo-indexnow-submit.mjs"
        }
      ]
    },
    {
      host: "www.brasilparalelo.com.br",
      provider: "www.brasilparalelo.com.br",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.brasilparalelo.com.br and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.businessinsider.com",
      provider: "Business Insider",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Business Insider and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.cac.gov.cn",
      provider: "www.cac.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.cac.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-policy/adapters.mjs"
        }
      ]
    },
    {
      host: "www.caracaschronicles.com",
      provider: "Caracas Chronicles",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Caracas Chronicles and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.carbonbrief.org",
      provider: "www.carbonbrief.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.carbonbrief.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "www.cbc.ca",
      provider: "www.cbc.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.cbc.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.cbinsights.com",
      provider: "www.cbinsights.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.cbinsights.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.cbr.ru",
      provider: "www.cbr.ru",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.cbr.ru and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-cbr-rates.mjs"
        }
      ]
    },
    {
      host: "www.cbsnews.com",
      provider: "www.cbsnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.cbsnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.cftc.gov",
      provider: "CFTC public notices",
      kind: "structured",
      observed: true,
      license: "U.S. government public data; CFTC terms apply",
      attribution: "U.S. Commodity Futures Trading Commission (CFTC); link to the original notice/feed.",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-regulatory-actions.mjs"
        }
      ]
    },
    {
      host: "www.channelnewsasia.com",
      provider: "www.channelnewsasia.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.channelnewsasia.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.channelstv.com",
      provider: "www.channelstv.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.channelstv.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.chinamoney.com.cn",
      provider: "www.chinamoney.com.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.chinamoney.com.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-macro/calendar.mjs"
        }
      ]
    },
    {
      host: "www.chosun.com",
      provider: "www.chosun.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.chosun.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.cisa.gov",
      provider: "www.cisa.gov",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.cisa.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.clarin.com",
      provider: "www.clarin.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.clarin.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.climatecentral.org",
      provider: "www.climatecentral.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.climatecentral.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "www.cloudflarestatus.com",
      provider: "www.cloudflarestatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.cloudflarestatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.cnbc.com",
      provider: "www.cnbc.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.cnbc.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.cnn.gr",
      provider: "www.cnn.gr",
      kind: "feed",
      observed: false,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.cnn.gr and link to the original feed publisher.",
      status: "excluded"
    },
    {
      host: "www.coindesk.com",
      provider: "www.coindesk.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.coindesk.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        }
      ]
    },
    {
      host: "www.contractsfinder.service.gov.uk",
      provider: "www.contractsfinder.service.gov.uk",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.contractsfinder.service.gov.uk and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "www.corriere.it",
      provider: "www.corriere.it",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.corriere.it and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.crisisgroup.org",
      provider: "www.crisisgroup.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.crisisgroup.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.csis.org",
      provider: "www.csis.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.csis.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "www.dabangasudan.org",
      provider: "www.dabangasudan.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dabangasudan.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.dailygood.org",
      provider: "www.dailygood.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dailygood.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.dailysabah.com",
      provider: "www.dailysabah.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dailysabah.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.darkreading.com",
      provider: "www.darkreading.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.darkreading.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.dawn.com",
      provider: "www.dawn.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dawn.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.defensenews.com",
      provider: "www.defensenews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.defensenews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.defenseone.com",
      provider: "www.defenseone.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.defenseone.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.digi24.ro",
      provider: "www.digi24.ro",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.digi24.ro and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.dn.se",
      provider: "www.dn.se",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dn.se and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.dnevnik.bg",
      provider: "www.dnevnik.bg",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dnevnik.bg and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.dockerstatus.com",
      provider: "www.dockerstatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.dockerstatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.dr.dk",
      provider: "www.dr.dk",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.dr.dk and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.earthquakescanada.nrcan.gc.ca",
      provider: "Earthquakes Canada (NRCan)",
      kind: "structured",
      observed: true,
      license: "Earthquakes Canada citation terms; live Atom redistribution not explicitly granted (historical catalogues on the Open Government Portal are OGL-Canada)",
      attribution: "Natural Resources Canada, Earthquakes Canada; link to https://www.earthquakescanada.nrcan.gc.ca/index-en.php?tpl_region=canada. Event-metadata citation: https://www.earthquakescanada.nrcan.gc.ca/cite-en.php",
      status: "terms-review",
      references: [
        {
          path: "scripts/seismology/nrcan-atom.mjs"
        }
      ]
    },
    {
      host: "www.ecb.europa.eu",
      provider: "www.ecb.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.ecb.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-economic-calendar.mjs"
        }
      ]
    },
    {
      host: "www.ecdc.europa.eu",
      provider: "www.ecdc.europa.eu",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.ecdc.europa.eu and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "www.egyptindependent.com",
      provider: "Egypt Independent",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Egypt Independent and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.eia.gov",
      provider: "www.eia.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.eia.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.eltiempo.com",
      provider: "www.eltiempo.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.eltiempo.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.eluniverso.com",
      provider: "www.eluniverso.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.eluniverso.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.engadget.com",
      provider: "www.engadget.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.engadget.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.ethiopia-insight.com",
      provider: "www.ethiopia-insight.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ethiopia-insight.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.eu-startups.com",
      provider: "www.eu-startups.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.eu-startups.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.euronews.com",
      provider: "www.euronews.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.euronews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/main.ts"
        }
      ]
    },
    {
      host: "www.facebook.com",
      provider: "www.facebook.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "src/services/story-share.ts"
        }
      ]
    },
    {
      host: "www.fao.org",
      provider: "www.fao.org",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.fao.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fao-food-price-index.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.fatf-gafi.org",
      provider: "Financial Action Task Force (FATF)",
      kind: "structured",
      observed: true,
      license: "FATF website and publication terms",
      attribution: "Financial Action Task Force (FATF); link to the original publication.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fatf-listing.mjs"
        }
      ]
    },
    {
      host: "www.federalreserve.gov",
      provider: "www.federalreserve.gov",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.federalreserve.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-economic-calendar.mjs"
        },
        {
          path: "scripts/seed-regulatory-actions.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        }
      ]
    },
    {
      host: "www.flightglobal.com",
      provider: "www.flightglobal.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.flightglobal.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-aviation.mjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/list-aviation-news.ts"
        }
      ]
    },
    {
      host: "www.foreignaffairs.com",
      provider: "www.foreignaffairs.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.foreignaffairs.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.fpri.org",
      provider: "www.fpri.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.fpri.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.france24.com",
      provider: "www.france24.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.france24.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ft.com",
      provider: "www.ft.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ft.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.fwdstart.me",
      provider: "www.fwdstart.me",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.fwdstart.me and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "api/fwdstart.js"
        }
      ]
    },
    {
      host: "www.g4media.ro",
      provider: "www.g4media.ro",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.g4media.ro and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.gdacs.org",
      provider: "www.gdacs.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.gdacs.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-natural-events.mjs"
        }
      ]
    },
    {
      host: "www.gets.govt.nz",
      provider: "www.gets.govt.nz",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.gets.govt.nz and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "www.gitex.com",
      provider: "www.gitex.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.gitex.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        }
      ]
    },
    {
      host: "www.githubstatus.com",
      provider: "www.githubstatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.githubstatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.globenewswire.com",
      provider: "GlobeNewswire",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit GlobeNewswire and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.goldseek.com",
      provider: "www.goldseek.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.goldseek.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.good.is",
      provider: "www.good.is",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.good.is and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.goodgoodgood.co",
      provider: "www.goodgoodgood.co",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.goodgoodgood.co and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.goodnewsnetwork.org",
      provider: "www.goodnewsnetwork.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.goodnewsnetwork.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.google.com",
      provider: "www.google.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.google.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "src/components/AviationCommandBar.ts"
        },
        {
          path: "src/components/MapPopup.ts"
        }
      ]
    },
    {
      host: "www.gov.br",
      provider: "www.gov.br",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.gov.br and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "www.gov.uk",
      provider: "www.gov.uk",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.gov.uk and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fuel-prices.mjs"
        },
        {
          path: "scripts/seed-security-advisories.mjs"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.haitilibre.com",
      provider: "HaitiLibre English",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit HaitiLibre English and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.handelsblatt.com",
      provider: "Handelsblatt",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Handelsblatt and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.handybulk.com",
      provider: "www.handybulk.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.handybulk.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-supply-chain-trade.mjs"
        }
      ]
    },
    {
      host: "www.hotnews.ro",
      provider: "www.hotnews.ro",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.hotnews.ro and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.hurriyet.com.tr",
      provider: "www.hurriyet.com.tr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.hurriyet.com.tr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.iaea.org",
      provider: "www.iaea.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.iaea.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.iea.org",
      provider: "www.iea.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.iea.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-energy-intelligence.mjs"
        },
        {
          path: "src/components/EnergyCrisisPanel.ts"
        }
      ]
    },
    {
      host: "www.iefimerida.gr",
      provider: "www.iefimerida.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.iefimerida.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ifswf.org",
      provider: "International Forum of Sovereign Wealth Funds",
      kind: "structured",
      observed: true,
      license: "Provider terms; attribution and redistribution require review",
      attribution: "International Forum of Sovereign Wealth Funds (IFSWF); link to the source.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-sovereign-wealth.mjs"
        }
      ]
    },
    {
      host: "www.in.gr",
      provider: "www.in.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.in.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.index.hr",
      provider: "www.index.hr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.index.hr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.infobae.com",
      provider: "www.infobae.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.infobae.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.interfax.ru",
      provider: "Interfax",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Interfax and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.international.gc.ca",
      provider: "Global Affairs Canada (SEMA consolidated sanctions)",
      kind: "structured",
      observed: true,
      license: "Government of Canada website terms; no explicit redistribution licence on the SEMA XML. Canada.ca terms restrict commercial reproduction unless otherwise specified. The Open Government Licence page on this host covers international-assistance open data sets, not this sanctions list.",
      attribution: "Global Affairs Canada, Consolidated Canadian Autonomous Sanctions List; link to https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng",
      status: "terms-review",
      references: [
        {
          path: "scripts/_sema-sanctions.mjs"
        }
      ]
    },
    {
      host: "www.ipolitics.ca",
      provider: "www.ipolitics.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ipolitics.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.irrawaddy.com",
      provider: "www.irrawaddy.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.irrawaddy.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.jeuneafrique.com",
      provider: "www.jeuneafrique.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.jeuneafrique.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.jodidata.org",
      provider: "www.jodidata.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.jodidata.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-jodi-gas.mjs"
        },
        {
          path: "scripts/seed-jodi-oil.mjs"
        }
      ]
    },
    {
      host: "www.jpost.com",
      provider: "www.jpost.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.jpost.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.jutarnji.hr",
      provider: "www.jutarnji.hr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.jutarnji.hr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.lapresse.ca",
      provider: "www.lapresse.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.lapresse.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.lasillavacia.com",
      provider: "www.lasillavacia.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.lasillavacia.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ledevoir.com",
      provider: "www.ledevoir.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ledevoir.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.lemonde.fr",
      provider: "www.lemonde.fr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.lemonde.fr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.lennysnewsletter.com",
      provider: "www.lennysnewsletter.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.lennysnewsletter.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.liberal.gr",
      provider: "www.liberal.gr",
      kind: "feed",
      observed: false,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.liberal.gr and link to the original feed publisher.",
      status: "excluded"
    },
    {
      host: "www.lighthousereports.com",
      provider: "www.lighthousereports.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.lighthousereports.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.linkedin.com",
      provider: "www.linkedin.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "server/worldmonitor/leads/v1/register-interest.ts"
        },
        {
          path: "src/services/story-share.ts"
        }
      ]
    },
    {
      host: "www.livescience.com",
      provider: "www.livescience.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.livescience.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.lrt.lt",
      provider: "www.lrt.lt",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.lrt.lt and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.manitoba511.ca",
      provider: "Manitoba 511",
      kind: "structured",
      observed: true,
      license: "Contains information from the Government of Manitoba, licensed under the OpenMB Information and Data Use License (Manitoba.ca/OpenMB). Manitoba 511 developer copy permits creating traffic apps; no separate developer access agreement is published.",
      attribution: "Manitoba 511 (Government of Manitoba). Contains information from the Government of Manitoba, licensed under the OpenMB Information and Data Use License. https://www.manitoba511.ca/",
      status: "terms-review",
      references: [
        {
          path: "scripts/lib/provincial-511.mjs"
        }
      ]
    },
    {
      host: "www.mbie.govt.nz",
      provider: "www.mbie.govt.nz",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.mbie.govt.nz and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-fuel-prices.mjs"
        }
      ]
    },
    {
      host: "www.miit.gov.cn",
      provider: "www.miit.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.miit.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-policy/adapters.mjs"
        }
      ]
    },
    {
      host: "www.militarytimes.com",
      provider: "www.militarytimes.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.militarytimes.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.mining-technology.com",
      provider: "www.mining-technology.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.mining-technology.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.mining.com",
      provider: "www.mining.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.mining.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.mnd.gov.tw",
      provider: "www.mnd.gov.tw",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.mnd.gov.tw and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/cross-strait-activity/adapters.mjs"
        },
        {
          path: "src/components/cross-strait-activity-summary.ts"
        }
      ]
    },
    {
      host: "www.mod.go.jp",
      provider: "www.mod.go.jp",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.mod.go.jp and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/cross-strait-activity/adapters.mjs"
        },
        {
          path: "src/components/cross-strait-activity-summary.ts"
        }
      ]
    },
    {
      host: "www.myjoyonline.com",
      provider: "www.myjoyonline.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.myjoyonline.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.naftemporiki.gr",
      provider: "www.naftemporiki.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.naftemporiki.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.naharnet.com",
      provider: "Naharnet Lebanon",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Naharnet Lebanon and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.nature.com",
      provider: "www.nature.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.nature.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ncei.noaa.gov",
      provider: "www.ncei.noaa.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.ncei.noaa.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-ocean-ice.mjs"
        }
      ]
    },
    {
      host: "www.netlifystatus.com",
      provider: "www.netlifystatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.netlifystatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.newscientist.com",
      provider: "www.newscientist.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.newscientist.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.newyorkfed.org",
      provider: "www.newyorkfed.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.newyorkfed.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "www.nfx.com",
      provider: "www.nfx.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.nfx.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.northernminer.com",
      provider: "www.northernminer.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.northernminer.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.notion-status.com",
      provider: "www.notion-status.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.notion-status.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.nrc.nl",
      provider: "www.nrc.nl",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.nrc.nl and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.nrk.no",
      provider: "www.nrk.no",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.nrk.no and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.occrp.org",
      provider: "www.occrp.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.occrp.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.omanobserver.om",
      provider: "www.omanobserver.om",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.omanobserver.om and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.opec.org",
      provider: "www.opec.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.opec.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-energy-intelligence.mjs"
        }
      ]
    },
    {
      host: "www.optimistdaily.com",
      provider: "www.optimistdaily.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.optimistdaily.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.oref.org.il",
      provider: "www.oref.org.il",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.oref.org.il and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "www.oryxspioenkop.com",
      provider: "www.oryxspioenkop.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.oryxspioenkop.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.pbc.gov.cn",
      provider: "www.pbc.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.pbc.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-macro/source-contracts.mjs"
        }
      ]
    },
    {
      host: "www.pbs.org",
      provider: "www.pbs.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.pbs.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.pizzint.watch",
      provider: "www.pizzint.watch",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.pizzint.watch and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-conflict-intel.mjs"
        }
      ]
    },
    {
      host: "www.polsatnews.pl",
      provider: "www.polsatnews.pl",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.polsatnews.pl and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.positive.news",
      provider: "www.positive.news",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.positive.news and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.premiumtimesng.com",
      provider: "www.premiumtimesng.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.premiumtimesng.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.primicias.ec",
      provider: "www.primicias.ec",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.primicias.ec and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.producthunt.com",
      provider: "www.producthunt.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.producthunt.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.radiondekeluka.org",
      provider: "Radio Ndeke Luka",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Radio Ndeke Luka and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.radiookapi.net",
      provider: "www.radiookapi.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.radiookapi.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.radiotamazuj.org",
      provider: "www.radiotamazuj.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.radiotamazuj.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.rand.org",
      provider: "www.rand.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.rand.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ransomware.live",
      provider: "www.ransomware.live",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ransomware.live and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.rappler.com",
      provider: "www.rappler.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.rappler.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.reddit.com",
      provider: "www.reddit.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.reddit.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        }
      ]
    },
    {
      host: "www.replicatestatus.com",
      provider: "www.replicatestatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.replicatestatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.repubblica.it",
      provider: "www.repubblica.it",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.repubblica.it and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.rfi.fr",
      provider: "www.rfi.fr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.rfi.fr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.rigzone.com",
      provider: "www.rigzone.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.rigzone.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.rp.pl",
      provider: "www.rp.pl",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.rp.pl and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.rt.com",
      provider: "www.rt.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.rt.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.saastr.com",
      provider: "www.saastr.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.saastr.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.safe.gov.cn",
      provider: "www.safe.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.safe.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-macro/source-contracts.mjs"
        }
      ]
    },
    {
      host: "www.samr.gov.cn",
      provider: "www.samr.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.samr.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-policy/adapters.mjs"
        }
      ]
    },
    {
      host: "www.schneier.com",
      provider: "www.schneier.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.schneier.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.sciencebase.gov",
      provider: "USGS ScienceBase (Mineral Commodity Summaries)",
      kind: "structured",
      observed: true,
      license: "U.S. government public-domain mineral statistics (USGS MCS data release)",
      attribution: "U.S. Geological Survey Mineral Commodity Summaries; link to the ScienceBase data release (https://doi.org/10.5066/P1WKQ63T).",
      status: "reviewed",
      references: [
        {
          path: "scripts/seed-mineral-production.mjs"
        }
      ]
    },
    {
      host: "www.sciencedaily.com",
      provider: "www.sciencedaily.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.sciencedaily.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.scmp.com",
      provider: "www.scmp.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.scmp.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.sec.gov",
      provider: "SEC",
      kind: "feed+structured",
      observed: true,
      license: "U.S. government public data; SEC terms apply",
      attribution: "U.S. Securities and Exchange Commission (SEC).",
      status: "reviewed",
      references: [
        {
          path: "scripts/openapi-inject-examples.mjs"
        },
        {
          path: "scripts/seed-regulatory-actions.mjs"
        },
        {
          path: "scripts/seed-sec-8k-stream.mjs"
        },
        {
          path: "scripts/seed-sec-cik-map.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/finance.ts"
        }
      ]
    },
    {
      host: "www.semianalysis.com",
      provider: "www.semianalysis.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.semianalysis.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.sequoiacap.com",
      provider: "www.sequoiacap.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.sequoiacap.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.seznamzpravy.cz",
      provider: "www.seznamzpravy.cz",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.seznamzpravy.cz and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.shareable.net",
      provider: "www.shareable.net",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.shareable.net and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.silverseek.com",
      provider: "www.silverseek.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.silverseek.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.smartraveller.gov.au",
      provider: "www.smartraveller.gov.au",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.smartraveller.gov.au and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "www.spdrgoldshares.com",
      provider: "www.spdrgoldshares.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.spdrgoldshares.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-gold-etf-flows.mjs"
        }
      ]
    },
    {
      host: "www.spiegel.de",
      provider: "www.spiegel.de",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.spiegel.de and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.stats.gov.cn",
      provider: "www.stats.gov.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.stats.gov.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-macro/calendar.mjs"
        },
        {
          path: "scripts/china-macro/source-contracts.mjs"
        }
      ]
    },
    {
      host: "www.stimson.org",
      provider: "www.stimson.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.stimson.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.studiotamani.org",
      provider: "Studio Tamani",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Studio Tamani and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.submarinecablemap.com",
      provider: "TeleGeography Submarine Cable Map",
      kind: "structured",
      observed: true,
      license: "TeleGeography proprietary/provider terms",
      attribution: "TeleGeography Submarine Cable Map; link to the source map.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-submarine-cables.mjs"
        }
      ]
    },
    {
      host: "www.sunnyskyz.com",
      provider: "www.sunnyskyz.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.sunnyskyz.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.svd.se",
      provider: "www.svd.se",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.svd.se and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.svt.se",
      provider: "www.svt.se",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.svt.se and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.swfinstitute.org",
      provider: "SWF Institute",
      kind: "structured",
      observed: true,
      license: "Provider terms; attribution and redistribution require review",
      attribution: "SWF Institute; link to the source publication.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-sovereign-wealth.mjs"
        }
      ]
    },
    {
      host: "www.szse.cn",
      provider: "www.szse.cn",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.szse.cn and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/china-stock-connect/adapters.mjs"
        }
      ]
    },
    {
      host: "www.tagesschau.de",
      provider: "www.tagesschau.de",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.tagesschau.de and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.tanea.gr",
      provider: "www.tanea.gr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.tanea.gr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.techinasia.com",
      provider: "www.techinasia.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.techinasia.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.techmeme.com",
      provider: "www.techmeme.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.techmeme.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.technologyreview.com",
      provider: "www.technologyreview.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.technologyreview.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.techstars.com",
      provider: "www.techstars.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.techstars.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.telegraph.co.uk",
      provider: "The Telegraph",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit The Telegraph and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.tenders.gov.au",
      provider: "AusTender",
      kind: "structured",
      observed: true,
      license: "Australian Government data and feed terms",
      attribution: "Australian Government AusTender; link to the original notice/feed.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-global-tenders.mjs"
        }
      ]
    },
    {
      host: "www.theglobeandmail.com",
      provider: "www.theglobeandmail.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.theglobeandmail.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.theguardian.com",
      provider: "www.theguardian.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.theguardian.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.thehindu.com",
      provider: "www.thehindu.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.thehindu.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.themoscowtimes.com",
      provider: "www.themoscowtimes.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.themoscowtimes.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.thenationalnews.com",
      provider: "www.thenationalnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.thenationalnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "www.thereporterethiopia.com",
      provider: "www.thereporterethiopia.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.thereporterethiopia.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.thestar.com",
      provider: "www.thestar.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.thestar.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.theverge.com",
      provider: "www.theverge.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.theverge.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.thisdaylive.com",
      provider: "www.thisdaylive.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.thisdaylive.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.token2049.com",
      provider: "www.token2049.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.token2049.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "scripts/seed-research.mjs"
        },
        {
          path: "server/worldmonitor/research/v1/list-tech-events.ts"
        }
      ]
    },
    {
      host: "www.tomshardware.com",
      provider: "www.tomshardware.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.tomshardware.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.toronto.ca",
      provider: "Toronto Fire Services",
      kind: "structured",
      observed: true,
      license: "Direct permission: World Monitor's owner confirmed on 2026-08-21 that World Monitor holds redistribution and public-display rights for the Toronto Fire Services live CAD XML. This does not claim that the feed is licensed under the City of Toronto Open Government Licence: no data-bound CKAN package was found for toronto-fire-active-incidents or livecad.xml. City of Toronto copyright and the source-specific permission still apply. Not the historical fire-incidents CKAN datasets.",
      attribution: "Toronto Fire Services, Active Incidents (CAD). https://www.toronto.ca/community-people/public-safety-alerts/alerts-notifications/toronto-fire-active-incidents/",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/toronto-official-cad.mjs"
        }
      ]
    },
    {
      host: "www.tps.ca",
      provider: "Toronto Police Service Open Data",
      kind: "structured",
      observed: true,
      license: 'Custom licence based on the Open Government Licence - Ontario. The Major Crime Indicators FeatureServer (serviceItemId 0a239a5563a344a3bbf8452504ed8d68) and Calls for Service Attended table (serviceItemId 46c7581a136445c78831acb657a4fb0d) require: "Contains information licensed under the Open Government Licence - Ontario." Credit Toronto Police Service without crests, logos, flags, or official marks. No TPS endorsement. Locations are deliberately offset; do not present them as precise addresses. Do not merge or link the data with other databases for the purpose of identifying a person, business, or organization. Do not fill privacy exclusions from GTA Update, news, radio, or another source. Evidence: https://www.tps.ca/data-maps/open-data/ and the item-level FeatureServer descriptions on https://data.tps.ca/.',
      attribution: "Contains information licensed under the Open Government Licence - Ontario. Toronto Police Service Open Data (https://www.tps.ca/data-maps/open-data/, https://data.tps.ca/). Coordinates are approximate offset intersection nodes. No TPS endorsement.",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/tps-open-data.mjs"
        }
      ]
    },
    {
      host: "www.tvanouvelles.ca",
      provider: "www.tvanouvelles.ca",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.tvanouvelles.ca and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.twz.com",
      provider: "www.twz.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.twz.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.unep.org",
      provider: "www.unep.org",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.unep.org and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-climate-news.mjs"
        }
      ]
    },
    {
      host: "www.upworthy.com",
      provider: "www.upworthy.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.upworthy.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.vanguardngr.com",
      provider: "www.vanguardngr.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.vanguardngr.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.vercel-status.com",
      provider: "www.vercel-status.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.vercel-status.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www.visionofhumanity.org",
      provider: "Vision of Humanity / Global Peace Index",
      kind: "structured",
      observed: true,
      license: "Vision of Humanity terms; attribution required",
      attribution: "Institute for Economics & Peace, Global Peace Index / Vision of Humanity.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-resilience-static.mjs"
        }
      ]
    },
    {
      host: "www.w3.org",
      provider: "W3C schema reference",
      kind: "structured",
      observed: true,
      license: "Excluded: schema/standards reference",
      attribution: "Excluded from the provider count: standards reference, not an ingested source.",
      status: "excluded",
      references: [
        {
          path: "api/fwdstart.js"
        },
        {
          path: "src/embed/panels/fear-greed.ts"
        }
      ]
    },
    {
      host: "www.war.gov",
      provider: "www.war.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.war.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        }
      ]
    },
    {
      host: "www.weather.gov.hk",
      provider: "www.weather.gov.hk",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.weather.gov.hk and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/natural/western-pacific-cyclones.mjs"
        }
      ]
    },
    {
      host: "www.welt.de",
      provider: "Welt",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Welt and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.whitehouse.gov",
      provider: "www.whitehouse.gov",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.whitehouse.gov and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.who.int",
      provider: "www.who.int",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.who.int and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-disease-outbreaks.mjs"
        },
        {
          path: "scripts/seed-security-advisories.mjs"
        },
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.windy.com",
      provider: "www.windy.com",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit www.windy.com and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/webcam/v1/get-webcam-image.ts"
        },
        {
          path: "src/services/webcams/index.ts"
        }
      ]
    },
    {
      host: "www.winnipegfreepress.com",
      provider: "www.winnipegfreepress.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.winnipegfreepress.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.wired.com",
      provider: "Wired",
      kind: "feed",
      observed: true,
      license: "Licensed publisher content; redistribution governed by the World Monitor agreement",
      attribution: "Credit Wired and link to the original item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.worldmonitor.app",
      provider: "World Monitor web app",
      kind: "structured",
      observed: true,
      license: "Excluded: World Monitor own web application",
      attribution: "Excluded from the external-provider count: first-party web origin.",
      status: "excluded",
      references: [
        {
          path: "api/a2a.ts"
        },
        {
          path: "api/ask.ts"
        },
        {
          path: "api/not-found.ts"
        },
        {
          path: "scripts/build-crawlable-corpus.mjs"
        },
        {
          path: "scripts/build-research-reports.mjs"
        },
        {
          path: "scripts/build-sitemap.mjs"
        },
        {
          path: "scripts/build-use-cases.mjs"
        },
        {
          path: "scripts/capture-resilience-energy-v2-acceptance.mjs"
        },
        {
          path: "scripts/discover-content-corpus-pages.mjs"
        },
        {
          path: "scripts/generate-sandbox-fixtures.mjs"
        },
        {
          path: "scripts/mcp-live-smoke.mjs"
        },
        {
          path: "scripts/measure-composited-layers.mjs"
        },
        {
          path: "scripts/measure-dashboard-render-axis.mjs"
        },
        {
          path: "scripts/measure-desktop-mainthread.mjs"
        },
        {
          path: "scripts/seo-indexnow-submit.mjs"
        },
        {
          path: "scripts/verify-sitemaps.mjs"
        },
        {
          path: "src/components/RuntimeConfigPanel.ts"
        },
        {
          path: "src/config/variant-meta.ts"
        },
        {
          path: "src/embed/embed-url.ts"
        }
      ]
    },
    {
      host: "www.ycombinator.com",
      provider: "www.ycombinator.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ycombinator.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.yesmagazine.org",
      provider: "www.yesmagazine.org",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.yesmagazine.org and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.ynetnews.com",
      provider: "www.ynetnews.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.ynetnews.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.yonhapnewstv.co.kr",
      provider: "www.yonhapnewstv.co.kr",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.yonhapnewstv.co.kr and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.youtube.com",
      provider: "www.youtube.com",
      kind: "feed+structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "api/youtube/embed.js"
        },
        {
          path: "api/youtube/live.js"
        },
        {
          path: "scripts/ais-relay.cjs"
        },
        {
          path: "server/worldmonitor/aviation/v1/get-youtube-live-stream-info.ts"
        },
        {
          path: "src/components/LiveNewsPanel.ts"
        },
        {
          path: "src/components/LiveWebcamsPanel.ts"
        }
      ]
    },
    {
      host: "www.zdg.md",
      provider: "www.zdg.md",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.zdg.md and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "www.zdnet.com",
      provider: "www.zdnet.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit www.zdnet.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "www.zoomstatus.com",
      provider: "www.zoomstatus.com",
      kind: "operational-status",
      observed: true,
      license: "Provider terms for this service-status endpoint; verify before redistribution",
      attribution: "Credit www.zoomstatus.com and link to the original service-status endpoint.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/infrastructure/v1/list-service-statuses.ts"
        }
      ]
    },
    {
      host: "www150.statcan.gc.ca",
      provider: "Statistics Canada",
      kind: "structured",
      observed: true,
      license: "Statistics Canada Open Licence (Open Government Licence \u2014 Canada); use, reproduce, publish, freely distribute or sell with attribution (https://www.statcan.gc.ca/en/terms-conditions/open-licence)",
      attribution: "Statistics Canada. Web Data Service. https://www.statcan.gc.ca/en/developers/wds/user-guide",
      status: "reviewed",
      references: [
        {
          path: "scripts/lib/statcan-wds.mjs"
        }
      ]
    },
    {
      host: "wwwnc.cdc.gov",
      provider: "wwwnc.cdc.gov",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit wwwnc.cdc.gov and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/seed-security-advisories.mjs"
        }
      ]
    },
    {
      host: "wyborcza.pl",
      provider: "Gazeta Wyborcza",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Gazeta Wyborcza and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "x.com",
      provider: "x.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "server/worldmonitor/leads/v1/register-interest.ts"
        }
      ]
    },
    {
      host: "xinhuanet.com",
      provider: "xinhuanet.com",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit xinhuanet.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "yandex.com",
      provider: "yandex.com",
      kind: "structured",
      observed: true,
      license: "Excluded: first-party, control-plane, UI, or rendering transport",
      attribution: "Excluded from the external-provider count: not an ingested upstream dataset.",
      status: "excluded",
      references: [
        {
          path: "scripts/seo-indexnow-submit.mjs"
        }
      ]
    },
    {
      host: "yemenonline.info",
      provider: "Yemen Online",
      kind: "feed",
      observed: true,
      license: "Publisher-provided feed or Google News link metadata; ingest is limited to headlines, summaries, timestamps, publisher credit, and link-out",
      attribution: "Credit Yemen Online and link to the original publisher item.",
      status: "reviewed",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "yle.fi",
      provider: "yle.fi",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit yle.fi and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "your-app.convex.site",
      provider: "your-app.convex.site",
      kind: "structured",
      observed: true,
      license: "Provider terms for this upstream API/dataset; verify before redistribution",
      attribution: "Credit your-app.convex.site and link to the original upstream API/dataset.",
      status: "terms-review",
      references: [
        {
          path: "scripts/import-bounced-emails.mjs"
        }
      ]
    },
    {
      host: "yourstory.com",
      provider: "yourstory.com",
      kind: "feed+structured",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit yourstory.com and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "src/config/feeds.ts"
        },
        {
          path: "src/config/variants/tech.ts"
        }
      ]
    },
    {
      host: "zdf-hls-19.akamaized.net",
      provider: "zdf-hls-19.akamaized.net",
      kind: "feed",
      observed: true,
      license: "Excluded: live-video playback transport; channel/provider terms apply separately",
      attribution: "Excluded from the external-provider count: presentation-only HLS stream, not an ingested dataset.",
      status: "excluded",
      references: [
        {
          path: "src/components/LiveNewsPanel.ts"
        }
      ]
    },
    {
      host: "zerkalo.io",
      provider: "zerkalo.io",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit zerkalo.io and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    },
    {
      host: "zn.ua",
      provider: "zn.ua",
      kind: "feed",
      observed: true,
      license: "Provider terms for this feed publisher; verify before redistribution",
      attribution: "Credit zn.ua and link to the original feed publisher.",
      status: "terms-review",
      references: [
        {
          path: "server/worldmonitor/news/v1/_feeds.ts"
        },
        {
          path: "src/config/feeds.ts"
        }
      ]
    }
  ],
  logicalEntries: [
    {
      provider: "Fintraffic Digitraffic",
      host: "not-currently-wired",
      kind: "candidate",
      observed: false,
      license: "Not applicable: no live fetch is present in this checkout",
      attribution: "Excluded from the live-provider count: issue audit named Digitraffic, but no current source call was found.",
      status: "excluded"
    }
  ],
  logicalProviders: [
    {
      provider: "Fast Company",
      feedLabels: [
        "Fast Company"
      ],
      transportHosts: [
        "feeds.feedburner.com"
      ],
      editorialHosts: [],
      originCountry: "US",
      coveredCountries: []
    },
    {
      provider: "NDTV",
      feedLabels: [
        "NDTV",
        "NDTV India"
      ],
      transportHosts: [
        "feeds.feedburner.com"
      ],
      editorialHosts: [],
      originCountry: "IN",
      coveredCountries: [
        "IN"
      ]
    },
    {
      provider: "The Hacker News",
      feedLabels: [
        "The Hacker News"
      ],
      transportHosts: [
        "feeds.feedburner.com"
      ],
      editorialHosts: [],
      originCountry: "IN",
      coveredCountries: []
    }
  ]
};

// shared/source-provenance-declarations.ts
var CONFIGURED_SOURCE_PROVENANCE_DECLARATIONS = Object.freeze({
  "+972 Magazine": { risk: "reviewed", type: "reviewed" },
  "14ymedio": { risk: "reviewed", type: "reviewed" },
  "20VC Episodes": { risk: "unknown", type: "unknown" },
  "24.hu": { risk: "unknown", type: "reviewed" },
  "36Kr English": { risk: "unknown", type: "reviewed" },
  "444.hu": { risk: "unknown", type: "reviewed" },
  "500 Global News": { risk: "unknown", type: "unknown" },
  "a16z Blog": { risk: "unknown", type: "unknown" },
  "a16z Insights": { risk: "unknown", type: "unknown" },
  "Aaj Tak": { risk: "unknown", type: "reviewed" },
  "ABC News": { risk: "unknown", type: "unknown" },
  "ABC News Australia": { risk: "unknown", type: "unknown" },
  "Acquired Episodes": { risk: "unknown", type: "unknown" },
  "Actualite.cd": { risk: "unknown", type: "unknown" },
  "ActuNiger": { risk: "reviewed", type: "reviewed" },
  "Africa News": { risk: "unknown", type: "unknown" },
  "Africa Startups": { risk: "unknown", type: "unknown" },
  "Africa Tech News": { risk: "unknown", type: "unknown" },
  "Africanews": { risk: "unknown", type: "unknown" },
  "Aftenposten": { risk: "reviewed", type: "reviewed" },
  "Agriculture": { risk: "unknown", type: "unknown" },
  "AI Interviews": { risk: "unknown", type: "unknown" },
  "AI News": { risk: "unknown", type: "reviewed" },
  "AI Now Institute": { risk: "unknown", type: "reviewed" },
  "AI Podcasts": { risk: "unknown", type: "unknown" },
  "AI Regulation": { risk: "unknown", type: "unknown" },
  "AI Weekly": { risk: "unknown", type: "unknown" },
  "A\xEFr Info": { risk: "reviewed", type: "reviewed" },
  "Al Arabiya": { risk: "reviewed", type: "reviewed" },
  "Al Jazeera": { risk: "reviewed", type: "reviewed" },
  "All-In Podcast": { risk: "unknown", type: "reviewed" },
  "Aluminum & Zinc": { risk: "unknown", type: "unknown" },
  "Alwihda Info": { risk: "reviewed", type: "reviewed" },
  "Amar Ujala": { risk: "unknown", type: "reviewed" },
  "AMNA": { risk: "reviewed", type: "reviewed" },
  "Amu TV": { risk: "reviewed", type: "reviewed" },
  "AngelList News": { risk: "unknown", type: "unknown" },
  "Annahar": { risk: "reviewed", type: "reviewed" },
  "ANSA": { risk: "unknown", type: "reviewed" },
  "Anthropic News": { risk: "unknown", type: "unknown" },
  "AP Mexico": { risk: "unknown", type: "unknown" },
  "AP News": { risk: "reviewed", type: "reviewed" },
  "Arab News": { risk: "unknown", type: "unknown" },
  "Arabian Business": { risk: "unknown", type: "unknown" },
  "Arctic Today": { risk: "reviewed", type: "reviewed" },
  "Armenpress": { risk: "reviewed", type: "reviewed" },
  "Arms Control Assn": { risk: "unknown", type: "reviewed" },
  "Ars Technica": { risk: "unknown", type: "reviewed" },
  "ArXiv AI": { risk: "unknown", type: "reviewed" },
  "ArXiv ML": { risk: "unknown", type: "unknown" },
  "Asahi Shimbun": { risk: "unknown", type: "unknown" },
  "Asharq Business": { risk: "unknown", type: "unknown" },
  "Asharq News": { risk: "unknown", type: "unknown" },
  "Asia News": { risk: "unknown", type: "unknown" },
  "Asia Pacific Tech": { risk: "unknown", type: "unknown" },
  "Asia VC News": { risk: "unknown", type: "unknown" },
  "Atlantic Council": { risk: "unknown", type: "reviewed" },
  "ATV": { risk: "unknown", type: "reviewed" },
  "Australian Mining": { risk: "unknown", type: "unknown" },
  "AWS Status": { risk: "unknown", type: "unknown" },
  "Axios": { risk: "unknown", type: "reviewed" },
  "AyiboPost": { risk: "reviewed", type: "reviewed" },
  "Azertag": { risk: "reviewed", type: "reviewed" },
  "Balkan Insight": { risk: "unknown", type: "reviewed" },
  "Bangkok Post": { risk: "unknown", type: "unknown" },
  "Bank Research": { risk: "unknown", type: "unknown" },
  "Banking Rules": { risk: "unknown", type: "unknown" },
  "BBC Africa": { risk: "unknown", type: "unknown" },
  "BBC Afrique": { risk: "unknown", type: "unknown" },
  "BBC Asia": { risk: "unknown", type: "unknown" },
  "BBC Hindi": { risk: "unknown", type: "reviewed" },
  "BBC Latin America": { risk: "unknown", type: "unknown" },
  "BBC Middle East": { risk: "reviewed", type: "reviewed" },
  "BBC Mundo": { risk: "unknown", type: "reviewed" },
  "BBC Persian": { risk: "unknown", type: "unknown" },
  "BBC Russian": { risk: "unknown", type: "unknown" },
  "BBC Turkce": { risk: "unknown", type: "unknown" },
  "BBC World": { risk: "reviewed", type: "reviewed" },
  "Bellingcat": { risk: "reviewed", type: "reviewed" },
  "Benchmark Mineral": { risk: "unknown", type: "unknown" },
  "BHP News": { risk: "unknown", type: "unknown" },
  "Bihus.Info": { risk: "reviewed", type: "reviewed" },
  "Bild": { risk: "unknown", type: "unknown" },
  "Binance Announcements": { risk: "reviewed", type: "reviewed" },
  "Bitcoin Magazine": { risk: "unknown", type: "unknown" },
  "Blockchain Finance": { risk: "unknown", type: "unknown" },
  "Bloomberg Commodities": { risk: "unknown", type: "unknown" },
  "Bloomberg Crypto": { risk: "unknown", type: "unknown" },
  "Bloomberg Energy": { risk: "unknown", type: "unknown" },
  "Bloomberg Markets": { risk: "unknown", type: "unknown" },
  "BoE Watch": { risk: "unknown", type: "unknown" },
  "BoJ Watch": { risk: "unknown", type: "unknown" },
  "Bond Market": { risk: "unknown", type: "unknown" },
  "Brasil Paralelo": { risk: "reviewed", type: "reviewed" },
  "Brazil Tech": { risk: "unknown", type: "unknown" },
  "Breaking Defense": { risk: "reviewed", type: "reviewed" },
  "Brookings": { risk: "unknown", type: "reviewed" },
  "Brookings Tech": { risk: "unknown", type: "reviewed" },
  "Bulletin of Atomic Scientists": { risk: "unknown", type: "reviewed" },
  "Business Insider": { risk: "reviewed", type: "reviewed" },
  "Business Wire": { risk: "reviewed", type: "reviewed" },
  "Calgary Herald": { risk: "reviewed", type: "reviewed" },
  "Caracas Chronicles": { risk: "reviewed", type: "reviewed" },
  "Carnegie": { risk: "unknown", type: "reviewed" },
  "CB Insights": { risk: "unknown", type: "unknown" },
  "CB Insights Unicorn": { risk: "unknown", type: "unknown" },
  "CBC News": { risk: "reviewed", type: "reviewed" },
  "CBS News": { risk: "unknown", type: "unknown" },
  "CDC": { risk: "unknown", type: "reviewed" },
  "Central Bank Rates": { risk: "unknown", type: "unknown" },
  "Chainwire": { risk: "reviewed", type: "reviewed" },
  "Changelog": { risk: "unknown", type: "unknown" },
  "Channels TV": { risk: "unknown", type: "unknown" },
  "Chatham House": { risk: "unknown", type: "unknown" },
  "Chatham House Tech": { risk: "unknown", type: "reviewed" },
  "China Commodity Imports": { risk: "unknown", type: "unknown" },
  "China Mineral Policy": { risk: "unknown", type: "unknown" },
  "China Startups": { risk: "unknown", type: "unknown" },
  "China Tech Analysis": { risk: "unknown", type: "unknown" },
  "China Tech Giants": { risk: "unknown", type: "unknown" },
  "China Tech Policy": { risk: "unknown", type: "unknown" },
  "Chosun Ilbo": { risk: "unknown", type: "unknown" },
  "CISA": { risk: "reviewed", type: "reviewed" },
  "Citi Newsroom": { risk: "unknown", type: "unknown" },
  "Civil.ge": { risk: "reviewed", type: "reviewed" },
  "Clar\xEDn": { risk: "unknown", type: "unknown" },
  "Cloud Outages": { risk: "unknown", type: "unknown" },
  "CNA": { risk: "unknown", type: "unknown" },
  "CNAS": { risk: "unknown", type: "reviewed" },
  "CNBC": { risk: "unknown", type: "reviewed" },
  "CNBC Commodities": { risk: "unknown", type: "unknown" },
  "CNBC Tech": { risk: "unknown", type: "unknown" },
  "CNN Greece": { risk: "unknown", type: "reviewed" },
  "CNN World": { risk: "reviewed", type: "reviewed" },
  "Cobalt Market": { risk: "unknown", type: "unknown" },
  "Coinbase Blog": { risk: "reviewed", type: "reviewed" },
  "CoinDesk": { risk: "unknown", type: "unknown" },
  "Cointelegraph": { risk: "unknown", type: "unknown" },
  "Commodity Futures": { risk: "unknown", type: "unknown" },
  "Commodity Trading": { risk: "unknown", type: "unknown" },
  "Conservation Optimism": { risk: "unknown", type: "unknown" },
  "Copper Market": { risk: "unknown", type: "unknown" },
  "Corporate Bonds": { risk: "unknown", type: "unknown" },
  "Correctiv": { risk: "unknown", type: "reviewed" },
  "Corriere della Sera": { risk: "unknown", type: "reviewed" },
  "CP24": { risk: "reviewed", type: "reviewed" },
  "CrisisWatch": { risk: "unknown", type: "reviewed" },
  "Critical Mineral Companies": { risk: "unknown", type: "unknown" },
  "Crunchbase News": { risk: "unknown", type: "unknown" },
  "Crypto News": { risk: "unknown", type: "unknown" },
  "Crypto Regulation": { risk: "unknown", type: "unknown" },
  "CryptoSlate": { risk: "unknown", type: "unknown" },
  "CSIS": { risk: "unknown", type: "reviewed" },
  "CSIS Tech": { risk: "unknown", type: "reviewed" },
  "CTV News": { risk: "reviewed", type: "reviewed" },
  "Dabanga Sudan": { risk: "unknown", type: "unknown" },
  "Dagens Nyheter": { risk: "unknown", type: "reviewed" },
  "Daily Nation": { risk: "reviewed", type: "reviewed" },
  "Daily Sabah": { risk: "reviewed", type: "reviewed" },
  "Daily Trust": { risk: "unknown", type: "unknown" },
  "DailyGood": { risk: "unknown", type: "unknown" },
  "Dark Reading": { risk: "unknown", type: "unknown" },
  "Dawn": { risk: "unknown", type: "reviewed" },
  "De Telegraaf": { risk: "unknown", type: "reviewed" },
  "Decacorn News": { risk: "unknown", type: "unknown" },
  "Decrypt": { risk: "unknown", type: "unknown" },
  "Defense News": { risk: "unknown", type: "reviewed" },
  "Defense One": { risk: "reviewed", type: "reviewed" },
  "DeFi News": { risk: "unknown", type: "unknown" },
  "Demo Day News": { risk: "unknown", type: "unknown" },
  "Der Spiegel": { risk: "unknown", type: "reviewed" },
  "Dev Events": { risk: "unknown", type: "unknown" },
  "Dev.to": { risk: "unknown", type: "unknown" },
  "DevOps.com": { risk: "unknown", type: "unknown" },
  "DFRLab": { risk: "unknown", type: "reviewed" },
  "Dhaka Tribune": { risk: "reviewed", type: "reviewed" },
  "DHS": { risk: "unknown", type: "reviewed" },
  "Die Zeit": { risk: "unknown", type: "reviewed" },
  "Digi24": { risk: "reviewed", type: "reviewed" },
  "DigiChina": { risk: "unknown", type: "reviewed" },
  "DL News": { risk: "unknown", type: "unknown" },
  "Dnevnik": { risk: "reviewed", type: "reviewed" },
  "DOJ": { risk: "unknown", type: "reviewed" },
  "Dollar Watch": { risk: "unknown", type: "unknown" },
  "DR Nyheder": { risk: "reviewed", type: "reviewed" },
  "DW News": { risk: "reviewed", type: "reviewed" },
  "DW Turkish": { risk: "unknown", type: "unknown" },
  "Earnings Reports": { risk: "unknown", type: "unknown" },
  "ECB Watch": { risk: "unknown", type: "unknown" },
  "ECFR": { risk: "unknown", type: "unknown" },
  "Economic Data": { risk: "unknown", type: "unknown" },
  "Edmonton Journal": { risk: "reviewed", type: "reviewed" },
  "Efecto Cocuyo": { risk: "reviewed", type: "reviewed" },
  "EFF News": { risk: "unknown", type: "reviewed" },
  "Egypt Independent": { risk: "reviewed", type: "reviewed" },
  "EIA Reports": { risk: "unknown", type: "unknown" },
  "El Mundo": { risk: "unknown", type: "reviewed" },
  "El Pa\xEDs": { risk: "unknown", type: "reviewed" },
  "El Tiempo": { risk: "unknown", type: "unknown" },
  "El Universo": { risk: "unknown", type: "unknown" },
  "Enab Baladi English": { risk: "reviewed", type: "reviewed" },
  "Energy Crisis & Shortages": { risk: "unknown", type: "unknown" },
  "Energy Intel": { risk: "unknown", type: "unknown" },
  "Energy Sanctions": { risk: "unknown", type: "unknown" },
  "Engadget": { risk: "unknown", type: "unknown" },
  "ERR News": { risk: "reviewed", type: "reviewed" },
  "ERT": { risk: "reviewed", type: "reviewed" },
  "ESG in Mining": { risk: "unknown", type: "unknown" },
  "Ethiopia Insight": { risk: "unknown", type: "unknown" },
  "EU Commission Digital": { risk: "unknown", type: "unknown" },
  "EU Digital Policy": { risk: "unknown", type: "unknown" },
  "EU ISS": { risk: "unknown", type: "reviewed" },
  "EU Startups": { risk: "unknown", type: "reviewed" },
  "EU Tech Policy": { risk: "unknown", type: "unknown" },
  "Euractiv Digital": { risk: "unknown", type: "unknown" },
  "Eurasianet": { risk: "reviewed", type: "reviewed" },
  "EuroNews": { risk: "reviewed", type: "reviewed" },
  "EV Battery Supply": { risk: "unknown", type: "unknown" },
  "FAO GIEWS": { risk: "unknown", type: "reviewed" },
  "FAO News": { risk: "unknown", type: "unknown" },
  "Fars News": { risk: "unknown", type: "unknown" },
  "FAS": { risk: "unknown", type: "unknown" },
  "Fast Company": { risk: "unknown", type: "unknown" },
  "Federal Reserve": { risk: "unknown", type: "reviewed" },
  "FEMA": { risk: "unknown", type: "reviewed" },
  "Financial Post": { risk: "reviewed", type: "reviewed" },
  "Financial Regulation": { risk: "unknown", type: "unknown" },
  "Financial Times": { risk: "reviewed", type: "reviewed" },
  "FinTech LATAM": { risk: "unknown", type: "unknown" },
  "Fintech News": { risk: "unknown", type: "unknown" },
  "First Round Review": { risk: "unknown", type: "unknown" },
  "Focus Taiwan": { risk: "unknown", type: "reviewed" },
  "Folha de S.Paulo": { risk: "unknown", type: "unknown" },
  "Foreign Affairs": { risk: "unknown", type: "reviewed" },
  "Foreign Policy": { risk: "unknown", type: "reviewed" },
  "Forex News": { risk: "unknown", type: "unknown" },
  "Fortune Term Sheet": { risk: "unknown", type: "unknown" },
  "Fox Business": { risk: "reviewed", type: "reviewed" },
  "Fox News": { risk: "unknown", type: "unknown" },
  "FPRI": { risk: "unknown", type: "reviewed" },
  "France 24": { risk: "reviewed", type: "reviewed" },
  "France 24 LatAm": { risk: "unknown", type: "unknown" },
  "Freeport & Copper Miners": { risk: "unknown", type: "unknown" },
  "FT Energy": { risk: "unknown", type: "unknown" },
  "Futures Trading": { risk: "unknown", type: "unknown" },
  "FwdStart Newsletter": { risk: "unknown", type: "unknown" },
  "FX Empire Gold": { risk: "unknown", type: "unknown" },
  "G4Media": { risk: "reviewed", type: "reviewed" },
  "Gazeta Wyborcza": { risk: "reviewed", type: "reviewed" },
  "gCaptain": { risk: "unknown", type: "reviewed" },
  "Geo News": { risk: "unknown", type: "reviewed" },
  "GitHub Blog": { risk: "unknown", type: "unknown" },
  "GitHub Trending": { risk: "unknown", type: "unknown" },
  "GITOC": { risk: "unknown", type: "reviewed" },
  "Glencore & Vale": { risk: "unknown", type: "unknown" },
  "Global Central Banks": { risk: "unknown", type: "unknown" },
  "Global News": { risk: "reviewed", type: "reviewed" },
  "Globe and Mail": { risk: "reviewed", type: "reviewed" },
  "GlobeNewswire": { risk: "reviewed", type: "reviewed" },
  "GMF": { risk: "unknown", type: "reviewed" },
  "GNN Animals": { risk: "unknown", type: "unknown" },
  "GNN Earth": { risk: "unknown", type: "unknown" },
  "GNN Health": { risk: "unknown", type: "unknown" },
  "GNN Heroes": { risk: "unknown", type: "unknown" },
  "GNN Heroes Spotlight": { risk: "unknown", type: "unknown" },
  "GNN Science": { risk: "unknown", type: "unknown" },
  "Gold & Metals": { risk: "unknown", type: "unknown" },
  "Gold Majors": { risk: "unknown", type: "unknown" },
  "Gold Price News": { risk: "unknown", type: "unknown" },
  "Gold Silver Worlds": { risk: "unknown", type: "unknown" },
  "GoldSeek": { risk: "unknown", type: "unknown" },
  "Good Good Good": { risk: "unknown", type: "unknown" },
  "GOOD Magazine": { risk: "unknown", type: "unknown" },
  "Good News Network": { risk: "unknown", type: "unknown" },
  "Greater Good (Berkeley)": { risk: "unknown", type: "unknown" },
  "Guardian Americas": { risk: "unknown", type: "unknown" },
  "Guardian Australia": { risk: "unknown", type: "unknown" },
  "Guardian ME": { risk: "unknown", type: "reviewed" },
  "Guardian World": { risk: "reviewed", type: "reviewed" },
  "Gulf FDI": { risk: "unknown", type: "unknown" },
  "Gulf Investments": { risk: "unknown", type: "unknown" },
  "Haaretz": { risk: "reviewed", type: "reviewed" },
  "Hacker News": { risk: "unknown", type: "reviewed" },
  "HaitiLibre English": { risk: "reviewed", type: "reviewed" },
  "Handelsblatt": { risk: "reviewed", type: "reviewed" },
  "Hard Fork (NYT)": { risk: "unknown", type: "reviewed" },
  "Havana Times": { risk: "reviewed", type: "reviewed" },
  "Hedge Fund News": { risk: "unknown", type: "unknown" },
  "Hiiraan Online": { risk: "unknown", type: "unknown" },
  "H\xEDrad\xF3": { risk: "unknown", type: "reviewed" },
  "HotNews": { risk: "reviewed", type: "reviewed" },
  "Housing Market": { risk: "unknown", type: "unknown" },
  "How I Built This": { risk: "unknown", type: "reviewed" },
  "Hromadske": { risk: "reviewed", type: "reviewed" },
  "Hromadske EN": { risk: "reviewed", type: "reviewed" },
  "Human Progress": { risk: "unknown", type: "unknown" },
  "Hurriyet": { risk: "unknown", type: "unknown" },
  "HVG": { risk: "unknown", type: "reviewed" },
  "IAEA": { risk: "reviewed", type: "reviewed" },
  "IEA Critical Minerals": { risk: "unknown", type: "unknown" },
  "IEA News": { risk: "unknown", type: "unknown" },
  "iefimerida": { risk: "unknown", type: "reviewed" },
  "in.gr": { risk: "unknown", type: "reviewed" },
  "Inc42 (India)": { risk: "unknown", type: "reviewed" },
  "Index.hr": { risk: "unknown", type: "reviewed" },
  "Index.hu": { risk: "unknown", type: "reviewed" },
  "India News Network": { risk: "unknown", type: "unknown" },
  "India Startups": { risk: "unknown", type: "unknown" },
  "India Tech News": { risk: "unknown", type: "unknown" },
  "India Tech Policy": { risk: "unknown", type: "unknown" },
  "Indian Express": { risk: "unknown", type: "unknown" },
  "Indonesia Nickel Policy": { risk: "unknown", type: "unknown" },
  "Indonesia Tech": { risk: "unknown", type: "unknown" },
  "Infobae Americas": { risk: "unknown", type: "unknown" },
  "InfoQ": { risk: "unknown", type: "unknown" },
  "InSight Crime": { risk: "unknown", type: "unknown" },
  "Interfax EN": { risk: "reviewed", type: "reviewed" },
  "Interfax RU": { risk: "reviewed", type: "reviewed" },
  "Investing.com News": { risk: "unknown", type: "unknown" },
  "IPO News": { risk: "unknown", type: "unknown" },
  "iPolitics": { risk: "reviewed", type: "reviewed" },
  "Iran International": { risk: "reviewed", type: "reviewed" },
  "IRNA": { risk: "reviewed", type: "reviewed" },
  "Iron Ore Market": { risk: "unknown", type: "unknown" },
  "Irrawaddy": { risk: "unknown", type: "reviewed" },
  "ISEAS (Singapore)": { risk: "unknown", type: "unknown" },
  "Island Times (Palau)": { risk: "unknown", type: "unknown" },
  "ISW": { risk: "reviewed", type: "reviewed" },
  "Jakarta Post": { risk: "unknown", type: "reviewed" },
  "Jamestown": { risk: "unknown", type: "reviewed" },
  "JAMnews": { risk: "reviewed", type: "reviewed" },
  "Janes": { risk: "reviewed", type: "reviewed" },
  "Japan Startups": { risk: "unknown", type: "unknown" },
  "Japan Tech News": { risk: "unknown", type: "unknown" },
  "Japan Today": { risk: "unknown", type: "unknown" },
  "Jerusalem Post": { risk: "reviewed", type: "reviewed" },
  "Jeune Afrique": { risk: "unknown", type: "unknown" },
  "Jin10": { risk: "reviewed", type: "reviewed" },
  "Jutarnji list": { risk: "unknown", type: "reviewed" },
  "Kathimerini": { risk: "unknown", type: "reviewed" },
  "Kitco Gold": { risk: "unknown", type: "unknown" },
  "Kitco News": { risk: "unknown", type: "unknown" },
  "Korea Startups": { risk: "unknown", type: "unknown" },
  "Korea Tech News": { risk: "unknown", type: "unknown" },
  "KrASIA": { risk: "unknown", type: "unknown" },
  "Krebs Security": { risk: "reviewed", type: "reviewed" },
  "Kyiv Independent": { risk: "reviewed", type: "reviewed" },
  "L'Orient Today": { risk: "reviewed", type: "reviewed" },
  "La Presse": { risk: "reviewed", type: "reviewed" },
  "La Silla Vac\xEDa": { risk: "unknown", type: "unknown" },
  "LATAM Startups": { risk: "unknown", type: "unknown" },
  "Latin America": { risk: "unknown", type: "unknown" },
  "LAVCA (LATAM)": { risk: "unknown", type: "unknown" },
  "Layoffs News": { risk: "unknown", type: "reviewed" },
  "Layoffs.fyi": { risk: "unknown", type: "reviewed" },
  "Le Devoir": { risk: "reviewed", type: "reviewed" },
  "Le Monde": { risk: "reviewed", type: "reviewed" },
  "Le Quotidien": { risk: "unknown", type: "unknown" },
  "leFaso.net": { risk: "reviewed", type: "reviewed" },
  "Lenny's Newsletter": { risk: "unknown", type: "unknown" },
  "Lex Fridman Tech": { risk: "unknown", type: "unknown" },
  "Liberal GR": { risk: "unknown", type: "reviewed" },
  "Libya Herald": { risk: "reviewed", type: "reviewed" },
  "Lighthouse Reports": { risk: "unknown", type: "reviewed" },
  "Lithium Market": { risk: "unknown", type: "unknown" },
  "Live Science": { risk: "unknown", type: "unknown" },
  "LME Metals": { risk: "unknown", type: "unknown" },
  "Lobsters": { risk: "unknown", type: "unknown" },
  "Lowy Institute": { risk: "unknown", type: "reviewed" },
  "LRT English": { risk: "reviewed", type: "reviewed" },
  "LSM English": { risk: "reviewed", type: "reviewed" },
  "M&A News": { risk: "unknown", type: "unknown" },
  "Maclean's": { risk: "reviewed", type: "reviewed" },
  "Mada Masr": { risk: "reviewed", type: "reviewed" },
  "Market Outlook": { risk: "unknown", type: "unknown" },
  "MarketWatch": { risk: "unknown", type: "reviewed" },
  "MarketWatch Tech": { risk: "unknown", type: "unknown" },
  "Masters of Scale": { risk: "unknown", type: "reviewed" },
  "Meduza": { risk: "reviewed", type: "reviewed" },
  "Mehr News": { risk: "reviewed", type: "unknown" },
  "MENA Startups": { risk: "unknown", type: "unknown" },
  "MENA Tech News": { risk: "unknown", type: "unknown" },
  "Messari": { risk: "unknown", type: "unknown" },
  "Metals Bulletin": { risk: "unknown", type: "unknown" },
  "Mexico News Daily": { risk: "unknown", type: "unknown" },
  "Mexico Security": { risk: "unknown", type: "unknown" },
  "Middle East Institute": { risk: "unknown", type: "unknown" },
  "MIIT (China)": { risk: "reviewed", type: "reviewed" },
  "Military Times": { risk: "unknown", type: "reviewed" },
  "Mine Web (SNL)": { risk: "unknown", type: "unknown" },
  "Mining & Resources": { risk: "unknown", type: "unknown" },
  "Mining Journal": { risk: "unknown", type: "unknown" },
  "Mining Regulation": { risk: "unknown", type: "unknown" },
  "Mining Technology": { risk: "unknown", type: "unknown" },
  "Mining Weekly": { risk: "unknown", type: "unknown" },
  "Mining.com": { risk: "unknown", type: "unknown" },
  "MIT Research": { risk: "unknown", type: "unknown" },
  "MIT Tech Policy": { risk: "unknown", type: "unknown" },
  "MIT Tech Review": { risk: "unknown", type: "reviewed" },
  "MOFCOM (China)": { risk: "reviewed", type: "reviewed" },
  "Mongabay": { risk: "unknown", type: "unknown" },
  "Montreal Gazette": { risk: "reviewed", type: "reviewed" },
  "Moscow Times": { risk: "reviewed", type: "reviewed" },
  "MyJoyOnline": { risk: "unknown", type: "unknown" },
  "N1 Croatia": { risk: "unknown", type: "reviewed" },
  "Naftemporiki": { risk: "unknown", type: "reviewed" },
  "Naharnet Lebanon": { risk: "reviewed", type: "reviewed" },
  "National Post": { risk: "reviewed", type: "reviewed" },
  "Natural Gas & LNG": { risk: "unknown", type: "unknown" },
  "Natural Gas News": { risk: "unknown", type: "unknown" },
  "Nature News": { risk: "unknown", type: "unknown" },
  "NBC News": { risk: "unknown", type: "unknown" },
  "NDTV": { risk: "unknown", type: "unknown" },
  "NDTV India": { risk: "unknown", type: "reviewed" },
  "New Scientist": { risk: "unknown", type: "unknown" },
  "New Unicorns": { risk: "unknown", type: "unknown" },
  "News24": { risk: "unknown", type: "unknown" },
  "NewsMaker": { risk: "reviewed", type: "reviewed" },
  "NFT News": { risk: "unknown", type: "unknown" },
  "Nickel News": { risk: "unknown", type: "unknown" },
  "Nikkei Asia": { risk: "reviewed", type: "reviewed" },
  "Nikkei Tech": { risk: "unknown", type: "reviewed" },
  "Northern Miner": { risk: "unknown", type: "unknown" },
  "NOS Nieuws": { risk: "unknown", type: "reviewed" },
  "Novaya Gazeta Europe": { risk: "unknown", type: "unknown" },
  "NPR News": { risk: "unknown", type: "reviewed" },
  "NRC": { risk: "unknown", type: "reviewed" },
  "NRK": { risk: "reviewed", type: "reviewed" },
  "NTI": { risk: "unknown", type: "unknown" },
  "Nuclear Energy": { risk: "unknown", type: "unknown" },
  "NV EN": { risk: "reviewed", type: "reviewed" },
  "O Globo": { risk: "unknown", type: "unknown" },
  "OC Media": { risk: "reviewed", type: "reviewed" },
  "OCCRP": { risk: "unknown", type: "reviewed" },
  "OECD Digital": { risk: "unknown", type: "reviewed" },
  "Oil & Gas": { risk: "unknown", type: "unknown" },
  "OilPrice.com": { risk: "unknown", type: "unknown" },
  "OKO.press": { risk: "reviewed", type: "reviewed" },
  "Oman Observer": { risk: "unknown", type: "unknown" },
  "Onet": { risk: "reviewed", type: "reviewed" },
  "OPEC & Crude": { risk: "unknown", type: "unknown" },
  "OPEC News": { risk: "unknown", type: "unknown" },
  "Open Source News": { risk: "unknown", type: "unknown" },
  "OpenAI News": { risk: "unknown", type: "unknown" },
  "Optimist Daily": { risk: "unknown", type: "unknown" },
  "Options Market": { risk: "unknown", type: "unknown" },
  "ORF Tech (India)": { risk: "unknown", type: "unknown" },
  "Oryx OSINT": { risk: "unknown", type: "reviewed" },
  "Ottawa Citizen": { risk: "reviewed", type: "reviewed" },
  "Pajhwok Afghan News": { risk: "reviewed", type: "reviewed" },
  "PAP": { risk: "reviewed", type: "reviewed" },
  "Paul Graham Essays": { risk: "unknown", type: "unknown" },
  "PBoC Watch": { risk: "unknown", type: "unknown" },
  "PBS NewsHour": { risk: "unknown", type: "unknown" },
  "Pentagon": { risk: "unknown", type: "reviewed" },
  "Pipelines & Chokepoints": { risk: "unknown", type: "unknown" },
  "PitchBook News": { risk: "unknown", type: "unknown" },
  "Pivot Podcast": { risk: "unknown", type: "unknown" },
  "Politico": { risk: "unknown", type: "reviewed" },
  "Politico Tech": { risk: "unknown", type: "reviewed" },
  "Polityka": { risk: "reviewed", type: "reviewed" },
  "Polsat News": { risk: "unknown", type: "unknown" },
  "Port & Logistics": { risk: "unknown", type: "unknown" },
  "Port & Terminal": { risk: "unknown", type: "unknown" },
  "Portfolio.hu": { risk: "unknown", type: "reviewed" },
  "Positive.News": { risk: "unknown", type: "unknown" },
  "PR Newswire": { risk: "reviewed", type: "reviewed" },
  "Precious Metals": { risk: "unknown", type: "unknown" },
  "Premium Times": { risk: "unknown", type: "unknown" },
  "Primicias": { risk: "unknown", type: "unknown" },
  "Private Equity": { risk: "unknown", type: "unknown" },
  "Product Hunt": { risk: "unknown", type: "unknown" },
  "Proto Thema": { risk: "unknown", type: "reviewed" },
  "Radio Ndeke Luka": { risk: "reviewed", type: "reviewed" },
  "Radio Okapi": { risk: "unknown", type: "unknown" },
  "Radio Tamazuj": { risk: "unknown", type: "unknown" },
  "Radio-Canada": { risk: "reviewed", type: "reviewed" },
  "RAND": { risk: "unknown", type: "reviewed" },
  "Ransomware.live": { risk: "unknown", type: "unknown" },
  "Rappler": { risk: "unknown", type: "reviewed" },
  "Rare Earths News": { risk: "unknown", type: "unknown" },
  "Reasons to be Cheerful": { risk: "unknown", type: "unknown" },
  "Refinery & Disruptions": { risk: "unknown", type: "unknown" },
  "Renaissance IPO": { risk: "unknown", type: "unknown" },
  "Repubblica": { risk: "unknown", type: "reviewed" },
  "Resource World": { risk: "unknown", type: "unknown" },
  "Responsible Statecraft": { risk: "unknown", type: "reviewed" },
  "Reuters Asia": { risk: "unknown", type: "unknown" },
  "Reuters Business": { risk: "unknown", type: "reviewed" },
  "Reuters Commodities": { risk: "unknown", type: "unknown" },
  "Reuters Crypto": { risk: "unknown", type: "unknown" },
  "Reuters Energy": { risk: "unknown", type: "unknown" },
  "Reuters India": { risk: "unknown", type: "unknown" },
  "Reuters LatAm": { risk: "unknown", type: "unknown" },
  "Reuters Markets": { risk: "unknown", type: "unknown" },
  "Reuters US": { risk: "unknown", type: "unknown" },
  "Reuters World": { risk: "unknown", type: "reviewed" },
  "RFE/RL Central Asia": { risk: "reviewed", type: "reviewed" },
  "RFI Afrique": { risk: "unknown", type: "unknown" },
  "RIETI (Japan)": { risk: "unknown", type: "unknown" },
  "Rigzone": { risk: "unknown", type: "unknown" },
  "Rio Tinto News": { risk: "unknown", type: "unknown" },
  "Risk & Volatility": { risk: "unknown", type: "unknown" },
  "RT": { risk: "reviewed", type: "reviewed" },
  "RT Russia": { risk: "reviewed", type: "reviewed" },
  "Rudaw": { risk: "unknown", type: "unknown" },
  "RUSI": { risk: "unknown", type: "reviewed" },
  "Rzeczpospolita": { risk: "unknown", type: "unknown" },
  "S&P Global Commodity": { risk: "unknown", type: "unknown" },
  "S&P Global Platts": { risk: "unknown", type: "unknown" },
  "SaaStr": { risk: "unknown", type: "unknown" },
  "Sahel Crisis": { risk: "unknown", type: "unknown" },
  "Sana'a Center": { risk: "reviewed", type: "reviewed" },
  "Schneier": { risk: "unknown", type: "unknown" },
  "ScienceDaily": { risk: "unknown", type: "unknown" },
  "SEA Startups": { risk: "unknown", type: "unknown" },
  "SEA Tech News": { risk: "unknown", type: "unknown" },
  "SEC": { risk: "unknown", type: "reviewed" },
  "SEC Filings": { risk: "unknown", type: "unknown" },
  "Seed & Pre-Seed": { risk: "unknown", type: "unknown" },
  "Seeking Alpha": { risk: "unknown", type: "unknown" },
  "Seeking Alpha Metals": { risk: "unknown", type: "unknown" },
  "Seeking Alpha Tech": { risk: "unknown", type: "unknown" },
  "SemiAnalysis": { risk: "unknown", type: "unknown" },
  "Semiconductor News": { risk: "unknown", type: "unknown" },
  "Sequoia Blog": { risk: "unknown", type: "unknown" },
  "Seznam Zpr\xE1vy": { risk: "reviewed", type: "reviewed" },
  "Shareable": { risk: "unknown", type: "unknown" },
  "Shipping & Freight": { risk: "unknown", type: "unknown" },
  "Show HN": { risk: "unknown", type: "unknown" },
  "Sifted (Europe)": { risk: "unknown", type: "reviewed" },
  "Silver Price News": { risk: "unknown", type: "unknown" },
  "SilverSeek": { risk: "unknown", type: "unknown" },
  "Singularity Hub": { risk: "unknown", type: "unknown" },
  "Slidstvo.Info": { risk: "reviewed", type: "reviewed" },
  "South China Morning Post": { risk: "unknown", type: "unknown" },
  "Sovereign Wealth": { risk: "unknown", type: "unknown" },
  "Stablecoin Policy": { risk: "unknown", type: "unknown" },
  "Stanford HAI": { risk: "unknown", type: "reviewed" },
  "Startup Funding": { risk: "unknown", type: "unknown" },
  "Startup School": { risk: "unknown", type: "unknown" },
  "Startups LATAM": { risk: "unknown", type: "unknown" },
  "State Dept": { risk: "reviewed", type: "reviewed" },
  "Stimson Center": { risk: "unknown", type: "reviewed" },
  "Stratechery": { risk: "unknown", type: "reviewed" },
  "Strategic Chokepoints": { risk: "unknown", type: "unknown" },
  "Studio Tamani": { risk: "reviewed", type: "reviewed" },
  "Sunny Skyz": { risk: "unknown", type: "unknown" },
  "Suspilne": { risk: "reviewed", type: "reviewed" },
  "Svenska Dagbladet": { risk: "unknown", type: "reviewed" },
  "SVT Nyheter": { risk: "unknown", type: "reviewed" },
  "Syria Direct": { risk: "reviewed", type: "reviewed" },
  "Ta Nea": { risk: "unknown", type: "reviewed" },
  "Tagesschau": { risk: "unknown", type: "reviewed" },
  "Taipei Times": { risk: "unknown", type: "reviewed" },
  "Taiwan News": { risk: "unknown", type: "reviewed" },
  "Taiwan Tech": { risk: "unknown", type: "unknown" },
  "Tanker & Shipping": { risk: "unknown", type: "unknown" },
  "Task & Purpose": { risk: "unknown", type: "reviewed" },
  "TASS": { risk: "reviewed", type: "reviewed" },
  "Tchadinfos": { risk: "reviewed", type: "reviewed" },
  "Tech Antitrust": { risk: "unknown", type: "unknown" },
  "Tech in Asia": { risk: "unknown", type: "reviewed" },
  "Tech IPO News": { risk: "unknown", type: "unknown" },
  "Tech Newsletters": { risk: "unknown", type: "unknown" },
  "Tech.eu": { risk: "unknown", type: "reviewed" },
  "TechCabal (Africa)": { risk: "unknown", type: "reviewed" },
  "TechCrunch": { risk: "unknown", type: "unknown" },
  "TechCrunch Layoffs": { risk: "unknown", type: "reviewed" },
  "TechCrunch Startups": { risk: "unknown", type: "unknown" },
  "TechCrunch Venture": { risk: "unknown", type: "unknown" },
  "TechMeme": { risk: "unknown", type: "unknown" },
  "Techstars News": { risk: "unknown", type: "unknown" },
  "Telegraph": { risk: "reviewed", type: "reviewed" },
  "Telex": { risk: "unknown", type: "reviewed" },
  "Thai PBS": { risk: "unknown", type: "unknown" },
  "The Astana Times": { risk: "reviewed", type: "reviewed" },
  "The Better India": { risk: "unknown", type: "unknown" },
  "The Block": { risk: "unknown", type: "unknown" },
  "The Daily Star": { risk: "reviewed", type: "reviewed" },
  "The Defiant": { risk: "unknown", type: "unknown" },
  "The Diplomat": { risk: "unknown", type: "reviewed" },
  "The Guardian Post": { risk: "reviewed", type: "reviewed" },
  "The Hacker News": { risk: "reviewed", type: "reviewed" },
  "The Hill": { risk: "unknown", type: "unknown" },
  "The Hindu": { risk: "unknown", type: "unknown" },
  "The Information": { risk: "unknown", type: "unknown" },
  "The Narwhal": { risk: "reviewed", type: "reviewed" },
  "The National": { risk: "unknown", type: "unknown" },
  "The New Stack": { risk: "unknown", type: "unknown" },
  "The Next Web": { risk: "unknown", type: "reviewed" },
  "The Province": { risk: "reviewed", type: "reviewed" },
  "The Reporter Ethiopia": { risk: "unknown", type: "unknown" },
  "The Sentry": { risk: "unknown", type: "reviewed" },
  "The Star (Malaysia)": { risk: "unknown", type: "reviewed" },
  "The Times of Central Asia": { risk: "reviewed", type: "reviewed" },
  "The Tyee": { risk: "reviewed", type: "reviewed" },
  "The Verge": { risk: "unknown", type: "reviewed" },
  "The Verge AI": { risk: "unknown", type: "reviewed" },
  "The War Zone": { risk: "reviewed", type: "reviewed" },
  "ThisDay": { risk: "unknown", type: "unknown" },
  "Times of India": { risk: "reviewed", type: "reviewed" },
  "Tom's Hardware": { risk: "unknown", type: "unknown" },
  "Toronto Star": { risk: "reviewed", type: "reviewed" },
  "Trade & Tariffs": { risk: "unknown", type: "unknown" },
  "Trade Routes": { risk: "unknown", type: "unknown" },
  "Trading Tech": { risk: "unknown", type: "unknown" },
  "Treasury": { risk: "unknown", type: "reviewed" },
  "Treasury Watch": { risk: "unknown", type: "unknown" },
  "Trump - Truth Social": { risk: "unknown", type: "unknown" },
  "Tuoi Tre News": { risk: "unknown", type: "unknown" },
  "TVA Nouvelles": { risk: "reviewed", type: "reviewed" },
  "TVN24": { risk: "unknown", type: "unknown" },
  "TVP Info": { risk: "reviewed", type: "reviewed" },
  "TWIST Episodes": { risk: "unknown", type: "unknown" },
  "U.S. Trade Representative": { risk: "reviewed", type: "reviewed" },
  "UK MOD": { risk: "reviewed", type: "reviewed" },
  "UK Tech Policy": { risk: "unknown", type: "unknown" },
  "Ukrainska Pravda": { risk: "reviewed", type: "reviewed" },
  "Ukrainska Pravda EN": { risk: "reviewed", type: "reviewed" },
  "Ukrinform": { risk: "reviewed", type: "reviewed" },
  "UN News": { risk: "reviewed", type: "reviewed" },
  "Unchained": { risk: "unknown", type: "unknown" },
  "UNHCR": { risk: "unknown", type: "reviewed" },
  "Unicorn News": { risk: "unknown", type: "unknown" },
  "Upworthy": { risk: "unknown", type: "unknown" },
  "Uranium Market": { risk: "unknown", type: "unknown" },
  "USNI News": { risk: "unknown", type: "reviewed" },
  "Vancouver Sun": { risk: "reviewed", type: "reviewed" },
  "Vanguard Nigeria": { risk: "unknown", type: "unknown" },
  "VC Insights": { risk: "unknown", type: "unknown" },
  "VC News": { risk: "unknown", type: "unknown" },
  "VentureBeat": { risk: "unknown", type: "unknown" },
  "VentureBeat AI": { risk: "unknown", type: "reviewed" },
  "Verge Shows": { risk: "unknown", type: "unknown" },
  "Vietnam Tech": { risk: "unknown", type: "unknown" },
  "Vision 2030": { risk: "unknown", type: "unknown" },
  "VnExpress": { risk: "unknown", type: "unknown" },
  "VSquare": { risk: "unknown", type: "reviewed" },
  "WAFA English": { risk: "reviewed", type: "reviewed" },
  "Wall Street Journal": { risk: "reviewed", type: "reviewed" },
  "War on the Rocks": { risk: "unknown", type: "reviewed" },
  "Welt": { risk: "reviewed", type: "reviewed" },
  "White House": { risk: "unknown", type: "reviewed" },
  "White House Actions": { risk: "unknown", type: "reviewed" },
  "WHO": { risk: "unknown", type: "reviewed" },
  "Wilson Center": { risk: "unknown", type: "reviewed" },
  "Winnipeg Free Press": { risk: "reviewed", type: "reviewed" },
  "Wired": { risk: "reviewed", type: "reviewed" },
  "World Gold Council": { risk: "unknown", type: "unknown" },
  "Wu Blockchain": { risk: "unknown", type: "unknown" },
  "Xinhua": { risk: "reviewed", type: "reviewed" },
  "Y Combinator Blog": { risk: "unknown", type: "unknown" },
  "Yahoo Finance": { risk: "unknown", type: "reviewed" },
  "YC Launches": { risk: "unknown", type: "unknown" },
  "YC News": { risk: "unknown", type: "unknown" },
  "Yemen Online": { risk: "reviewed", type: "reviewed" },
  "Yes! Magazine": { risk: "unknown", type: "unknown" },
  "Yle News": { risk: "reviewed", type: "reviewed" },
  "Ynetnews": { risk: "reviewed", type: "unknown" },
  "Yonhap News": { risk: "unknown", type: "unknown" },
  "YourStory": { risk: "unknown", type: "reviewed" },
  "ZDNet": { risk: "unknown", type: "unknown" },
  "Zerkalo": { risk: "reviewed", type: "reviewed" },
  "Ziarul de Gard\u0103": { risk: "reviewed", type: "reviewed" },
  "ZN.UA": { risk: "reviewed", type: "reviewed" }
});

// shared/x-account-source-tiers.json
var x_account_source_tiers_default = {
  "Al Arabiya": 2,
  "Aurora Intel": 3,
  "BNO News": 3,
  CGTN: 3,
  "Clash Report": 3,
  CrowdStrike: 3,
  "Dark Web Informer": 3,
  DeepState: 3,
  "Department of War": 1,
  Haaretz: 2,
  IDF: 1,
  IRNA: 3,
  "Intel Crab": 3,
  "Jerusalem Post": 2,
  Kaspersky: 3,
  "Kyiv Independent": 2,
  LiveUAMap: 3,
  "Moscow Times": 2,
  NATO: 1,
  "New York Times": 2,
  "OSINT Technical": 3,
  OSINTdefender: 3,
  "Press TV": 3,
  "The CyberWire": 3,
  "The Economist": 2,
  "The Hacker News": 3,
  "Times of Israel": 2,
  "US CENTCOM": 1,
  "Washington Post": 2,
  "vx-underground": 3
};

// shared/x-account-trust.ts
var X_ACCOUNT_TRUST = [
  {
    sourceName: "Al Arabiya",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    stateAffiliated: "Saudi Arabia",
    note: "Saudi-owned Gulf newsroom; established outlet, not a wire",
    reuseRisk: true
  },
  {
    sourceName: "Aurora Intel",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "OSINT aggregator; not a major established newsroom"
  },
  {
    sourceName: "BNO News",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    note: "Breaking-news aggregator; useful speed, thinner editorial process than a wire"
  },
  {
    sourceName: "Bloomberg",
    tier: 1,
    type: "wire",
    risk: "low",
    note: "Financial wire service with editorial standards",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "Breaking Defense",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Defense trade press; specialty desk, not a wire",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "CGTN",
    tier: 3,
    type: "mainstream",
    risk: "high",
    stateAffiliated: "China",
    note: "Chinese state broadcaster",
    reuseRisk: true
  },
  {
    sourceName: "CISA",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "USA",
    note: "Official US cybersecurity agency publisher; treat statements as government claims",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "CNN World",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    note: "US cable news world desk; established outlet, not a wire",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "Clash Report",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Conflict OSINT aggregator; unverified battlefield claims are common"
  },
  {
    sourceName: "CrowdStrike",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Vendor threat-intel publisher; not independent journalism"
  },
  {
    sourceName: "Dark Web Informer",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Dark-web monitoring aggregator"
  },
  {
    sourceName: "DeepState",
    tier: 3,
    type: "intel",
    risk: "medium",
    knownBiases: ["Pro-Ukraine"],
    note: "Ukrainian OSINT mapping project; high-signal maps, not a wire service"
  },
  {
    sourceName: "Defense One",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Defense trade press; specialty desk, not a wire",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "Haaretz",
    tier: 2,
    type: "mainstream",
    risk: "low",
    knownBiases: ["Israeli left-liberal"],
    note: "Israeli newspaper of record with editorial standards"
  },
  {
    sourceName: "IAEA",
    tier: 1,
    type: "gov",
    risk: "medium",
    note: "UN nuclear watchdog official publisher; treat statements as institutional claims",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "IDF",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Israel",
    note: "Official IDF publisher on X; treat statements as government claims, not independent observation"
  },
  {
    sourceName: "IRNA",
    tier: 3,
    type: "wire",
    risk: "high",
    stateAffiliated: "Iran",
    note: "Iranian state news agency",
    reuseRisk: true
  },
  {
    sourceName: "Intel Crab",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Military OSINT aggregator; treat as a lead"
  },
  {
    sourceName: "Iran International",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    stateAffiliated: "Saudi Arabia",
    knownBiases: ["Iranian opposition"],
    note: "Saudi-funded Iranian exile broadcaster; established newsroom, not independent of a state sponsor",
    reuseTier: true
  },
  {
    sourceName: "Janes",
    tier: 3,
    type: "intel",
    risk: "low",
    note: "Defense intelligence publisher with editorial standards",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "Jerusalem Post",
    tier: 2,
    type: "mainstream",
    risk: "low",
    knownBiases: ["Israeli centre-right"],
    note: "English-language Israeli daily of record",
    reuseRisk: true
  },
  {
    sourceName: "Kaspersky",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Vendor research publisher; not independent journalism"
  },
  {
    sourceName: "Krebs Security",
    tier: 3,
    type: "intel",
    risk: "low",
    note: "Independent cybersecurity reporting",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "Kyiv Independent",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    knownBiases: ["Pro-Ukraine"],
    note: "Ukrainian English-language primary",
    reuseType: true,
    reuseRisk: true
  },
  {
    sourceName: "LiveUAMap",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Live conflict-mapping aggregator; source quality varies by incident"
  },
  {
    sourceName: "Moscow Times",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    knownBiases: ["Anti-Kremlin"],
    note: "Independent English-language Russian outlet, critical of Kremlin",
    reuseType: true,
    reuseRisk: true
  },
  {
    sourceName: "NATO",
    tier: 1,
    type: "gov",
    risk: "high",
    note: "Official NATO publisher; treat statements as alliance claims, not independent observation"
  },
  {
    sourceName: "NHK World",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    stateAffiliated: "Japan",
    note: "Japanese public broadcaster English service",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "New York Times",
    tier: 2,
    type: "mainstream",
    risk: "low",
    note: "US newspaper of record with editorial standards"
  },
  {
    sourceName: "Nikkei Asia",
    tier: 2,
    type: "market",
    risk: "low",
    note: "Nikkei English-language Asia desk",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "OSINT Technical",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Technical OSINT aggregator; treat as a lead"
  },
  {
    sourceName: "OSINTdefender",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Military OSINT aggregator; treat as a lead"
  },
  {
    // Renamed from 'Pentagon' (#6654 follow-up). @PentagonPresSec no longer
    // exists: the department rebranded and the account is now @DeptofWar.
    // Beware the neighbours — @WarDepartment, @SecretaryOfWar and @thePentagon
    // are unrelated personal accounts with three-figure follower counts, so
    // only the id verified against the API belongs in a tier-1 slot.
    sourceName: "Department of War",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "USA",
    note: "Official US Department of War publisher; treat statements as government claims"
    // No reuse flags: 'Pentagon' could borrow the existing defense.gov RSS
    // masthead's type/risk, but 'Department of War' is a new public name with
    // no masthead behind it, so this entry must emit its own keys or the
    // account falls through to the tier-4 default and is dropped from alerts.
  },
  {
    sourceName: "Press TV",
    tier: 3,
    type: "mainstream",
    risk: "high",
    stateAffiliated: "Iran",
    note: "Iranian state media",
    reuseRisk: true
  },
  {
    sourceName: "State Dept",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "USA",
    note: "Official US State Department publisher; treat statements as government claims",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "The CyberWire",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Cybersecurity briefing specialist"
  },
  {
    sourceName: "The Economist",
    tier: 2,
    type: "mainstream",
    risk: "low",
    note: "Weekly news magazine with editorial standards"
  },
  {
    sourceName: "The Hacker News",
    tier: 3,
    type: "tech",
    risk: "medium",
    note: "Cybersecurity news specialist; not a general wire"
  },
  {
    sourceName: "The War Zone",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Defense specialty desk; not a wire",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "Times of Israel",
    tier: 2,
    type: "mainstream",
    risk: "low",
    knownBiases: ["Israeli mainstream"],
    note: "English-language Israeli newspaper"
  },
  {
    sourceName: "UK MOD",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "UK",
    note: "Official UK Ministry of Defence publisher; treat statements as government claims",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "UN News",
    tier: 1,
    type: "gov",
    risk: "medium",
    note: "Official UN news publisher; treat statements as institutional claims",
    reuseType: true,
    reuseTier: true
  },
  {
    sourceName: "US CENTCOM",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "USA",
    note: "Official US Central Command publisher; treat statements as government claims"
  },
  {
    sourceName: "Wall Street Journal",
    tier: 1,
    type: "market",
    risk: "low",
    note: "US business newspaper with editorial standards",
    reuseTier: true
  },
  {
    sourceName: "Washington Post",
    tier: 2,
    type: "mainstream",
    risk: "low",
    note: "US national newspaper with editorial standards"
  },
  {
    sourceName: "vx-underground",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Malware-research archive; technical primary, not a newsroom"
  }
];
function xRiskProfile(entry) {
  return {
    risk: entry.risk,
    ...entry.stateAffiliated ? { stateAffiliated: entry.stateAffiliated } : {},
    ...entry.knownBiases ? { knownBiases: entry.knownBiases } : {},
    note: entry.note
  };
}
var X_ACCOUNT_SOURCE_TYPES = Object.fromEntries(
  X_ACCOUNT_TRUST.filter((entry) => !entry.reuseType).map((entry) => [entry.sourceName, entry.type])
);
var X_ACCOUNT_SOURCE_PROPAGANDA_RISK = Object.fromEntries(
  X_ACCOUNT_TRUST.filter((entry) => !entry.reuseRisk).map((entry) => [entry.sourceName, xRiskProfile(entry)])
);
var X_ACCOUNT_SOURCE_TIERS = x_account_source_tiers_default;

// shared/telegram-channel-trust.ts
var TELEGRAM_CHANNEL_TRUST = [
  {
    handle: "VahidOnline",
    name: "Vahid Online",
    tier: 2,
    type: "intel",
    risk: "medium",
    note: "Independent Iranian journalist. Operational Telegram priority is not a wire-service rating"
  },
  {
    handle: "abualiexpress",
    name: "Abu Ali Express",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Hebrew-language military OSINT channel; treat posts as leads, not confirmation"
  },
  {
    handle: "AuroraIntel",
    name: "Aurora Intel",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "OSINT aggregator; not a major established newsroom"
  },
  {
    handle: "BNONews",
    name: "BNO News",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    note: "Breaking-news aggregator; useful speed, thinner editorial process than a wire"
  },
  {
    handle: "ClashReport",
    name: "Clash Report",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Conflict OSINT aggregator; unverified battlefield claims are common"
  },
  {
    handle: "DeepStateUA",
    name: "DeepState",
    tier: 3,
    type: "intel",
    risk: "medium",
    knownBiases: ["Pro-Ukraine"],
    note: "Ukrainian OSINT mapping project; high-signal maps, not a wire service"
  },
  {
    handle: "DefenderDome",
    name: "The Defender Dome",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Conflict OSINT aggregator"
  },
  {
    handle: "englishabuali",
    name: "Abu Ali Express EN",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "English edition of Abu Ali Express military OSINT"
  },
  {
    handle: "IranIntl_En",
    name: "Iran International EN",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    stateAffiliated: "Saudi Arabia",
    knownBiases: ["Iranian opposition"],
    note: "Saudi-funded Iranian exile broadcaster; established newsroom, not independent of a state sponsor"
  },
  {
    handle: "kpszsu",
    name: "Air Force of the Armed Forces of Ukraine",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Ukraine",
    note: "Official Ukrainian Air Force publisher; treat statements as government claims"
  },
  {
    handle: "LiveUAMap",
    name: "LiveUAMap",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Live conflict-mapping aggregator; source quality varies by incident"
  },
  {
    handle: "OSINTdefender",
    name: "OSINTdefender",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Military OSINT aggregator; treat as a lead"
  },
  {
    handle: "OsintUpdates",
    name: "Osint Updates",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Breaking OSINT aggregator"
  },
  {
    handle: "bellingcat",
    name: "Bellingcat",
    tier: 3,
    type: "intel",
    risk: "low",
    note: "Open-source investigations, methodology transparent",
    reuseExisting: true
  },
  {
    handle: "CyberDetective",
    name: "CyberDetective",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Cyber OSINT specialist"
  },
  {
    handle: "GeopoliticalCenter",
    name: "GeopoliticalCenter",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Geopolitical commentary aggregator"
  },
  {
    handle: "Middle_East_Spectator",
    name: "Middle East Spectator",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Middle East OSINT aggregator"
  },
  {
    handle: "MiddleEastNow_Breaking",
    name: "Middle East Now Breaking",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Regional breaking-news aggregator"
  },
  {
    handle: "nexta_tv",
    name: "NEXTA",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    knownBiases: ["Belarusian opposition"],
    note: "Belarusian opposition media; useful primary, not a wire"
  },
  {
    handle: "OSINTIndustries",
    name: "OSINT Industries",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Commercial OSINT vendor channel"
  },
  {
    handle: "Osintlatestnews",
    name: "OSIntOps News",
    tier: 4,
    type: "intel",
    risk: "medium",
    note: "Anonymous OSINT news aggregator; not an editorial newsroom"
  },
  {
    handle: "osintlive",
    name: "OSINT Live",
    tier: 4,
    type: "intel",
    risk: "medium",
    note: "Anonymous OSINT aggregator"
  },
  {
    handle: "OsintTv",
    name: "OsintTV",
    tier: 4,
    type: "intel",
    risk: "medium",
    note: "Anonymous OSINT video aggregator"
  },
  {
    handle: "spectatorindex",
    name: "The Spectator Index",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Headline aggregator; speed over original reporting"
  },
  {
    handle: "wfwitness",
    name: "Witness",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Conflict-witness aggregator"
  },
  {
    handle: "war_monitor",
    name: "monitor",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Ukraine-focused conflict monitor; label matches the product-managed channel list"
  },
  {
    handle: "nayaforiraq",
    name: "Naya for Iraq",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    note: "Iraq-focused regional desk"
  },
  {
    handle: "yediotnews25",
    name: "Yedioth News",
    tier: 2,
    type: "mainstream",
    risk: "low",
    knownBiases: ["Israeli mainstream"],
    note: "Yedioth Ahronoth Telegram desk; same newsroom family as Ynetnews"
  },
  {
    handle: "DDGeopolitics",
    name: "DD Geopolitics",
    tier: 4,
    type: "intel",
    risk: "medium",
    knownBiases: ["Pro-Russia"],
    note: "Anonymous partisan aggregator; not independent journalism"
  },
  {
    handle: "FotrosResistancee",
    name: "Fotros Resistance",
    tier: 4,
    type: "intel",
    risk: "medium",
    knownBiases: ["Iran-aligned resistance"],
    note: "Partisan resistance channel; treat as advocacy, not reporting"
  },
  {
    handle: "RezistanceTrench1",
    name: "Resistance Trench",
    tier: 4,
    type: "intel",
    risk: "medium",
    knownBiases: ["Iran-aligned resistance"],
    note: "Partisan resistance channel; treat as advocacy, not reporting"
  },
  {
    handle: "geopolitics_prime",
    name: "Geopolitics Prime",
    tier: 4,
    type: "intel",
    risk: "medium",
    note: "State-adjacent geopolitical aggregator; not an independent newsroom"
  },
  {
    handle: "thecradlemedia",
    name: "The Cradle",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    knownBiases: ["West-Asia alignment"],
    note: "West Asia analytical outlet with a disclosed editorial line"
  },
  {
    handle: "LebUpdate",
    name: "Lebanon Update",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    note: "Lebanon breaking-news aggregator"
  },
  {
    handle: "middleeastobserver",
    name: "Middle East Observer",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Regional observer/OSINT desk"
  },
  {
    handle: "MiddleEastEye_TG",
    name: "Middle East Eye",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    stateAffiliated: "Qatar",
    note: "Qatar-linked Middle East newsroom; established outlet, not a wire"
  },
  {
    handle: "dragonwatch",
    name: "Dragon Watch",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Indo-Pacific OSINT aggregator"
  },
  {
    handle: "IDFofficial",
    name: "IDF Official",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Israel",
    note: "Official IDF publisher; treat statements as government claims, not independent observation"
  },
  {
    handle: "RocketAlert",
    name: "Rocket Alert",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Israel",
    note: "Official Israeli civilian rocket-alert publisher; values are primary government claims"
  },
  {
    handle: "sepah",
    name: "IRGC Official",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Iran",
    note: "Official IRGC publisher; treat statements as government claims"
  },
  {
    handle: "defapress_ir",
    name: "DefaPress (Iran MOD)",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Iran",
    note: "Iranian Ministry of Defence publisher; treat statements as government claims"
  },
  {
    handle: "TasnimNewsEN",
    name: "Tasnim News EN",
    tier: 3,
    type: "mainstream",
    risk: "high",
    stateAffiliated: "Iran",
    note: "Iranian state-affiliated outlet; not a wire service"
  },
  {
    handle: "PressTV",
    name: "PressTV (Iran State)",
    tier: 3,
    type: "mainstream",
    risk: "high",
    stateAffiliated: "Iran",
    note: 'Iranian state media Telegram desk; distinct key from RSS "Press TV"'
  },
  {
    handle: "FarsNews_EN",
    name: "Fars News EN",
    tier: 3,
    type: "mainstream",
    risk: "high",
    stateAffiliated: "Iran",
    note: 'Iranian state-affiliated outlet; distinct key from RSS "Fars News"'
  },
  {
    handle: "SaberinFa",
    name: "Saberin (IRGC Intel)",
    tier: 1,
    type: "gov",
    risk: "high",
    stateAffiliated: "Iran",
    note: "IRGC-linked intelligence publisher; treat statements as government claims"
  },
  {
    handle: "warfareanalysis",
    name: "Warfare Analysis",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Military analysis/OSINT desk"
  },
  {
    handle: "rnintel",
    name: "RN Intel",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "OSINT aggregator"
  },
  {
    handle: "bintjbeilnews",
    name: "Bint Jbeil News",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    note: "Southern Lebanon local desk in a polarized media environment"
  },
  {
    handle: "HAMASW",
    name: "Hamas-Israel War",
    tier: 4,
    type: "intel",
    risk: "medium",
    knownBiases: ["Faction-aligned"],
    note: "Faction-aligned war aggregator; not an editorial newsroom"
  },
  {
    handle: "QudsNen",
    name: "Quds News",
    tier: 4,
    type: "intel",
    risk: "medium",
    knownBiases: ["Faction-aligned"],
    note: "Faction-aligned aggregator; treat as advocacy, not reporting"
  },
  {
    handle: "Alsaa_plus_EN",
    name: "Al-Saa EN",
    tier: 3,
    type: "mainstream",
    risk: "medium",
    note: "Arabic-to-English regional desk"
  },
  {
    handle: "GeoPWatch",
    name: "GeoPol Watch",
    tier: 4,
    type: "intel",
    risk: "medium",
    note: "Anonymous geopolitical aggregator"
  },
  {
    handle: "dropsitenews",
    name: "Drop Site News",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Investigative digital outlet; specialty desk, not a wire"
  },
  {
    handle: "france24_en",
    name: "France 24 EN",
    tier: 2,
    type: "mainstream",
    risk: "medium",
    stateAffiliated: "France",
    note: 'French state-funded broadcaster Telegram desk; editorially independent charter, distinct key from RSS "France 24"'
  },
  {
    handle: "kianmeli1",
    name: "Kian Meli (Iran)",
    tier: 4,
    type: "intel",
    risk: "medium",
    note: "Unverified personal Iran desk; not a reviewed newsroom"
  },
  {
    handle: "TimesofIsrael",
    name: "Times of Israel",
    tier: 2,
    type: "mainstream",
    risk: "low",
    knownBiases: ["Israeli mainstream"],
    note: "English-language Israeli newspaper Telegram desk"
  },
  {
    handle: "thehackernews",
    name: "The Hacker News",
    tier: 3,
    type: "tech",
    risk: "medium",
    note: "Cybersecurity news specialist; not a general wire"
  },
  {
    handle: "cybersecboardrm",
    name: "Cybersecurity Boardroom",
    tier: 3,
    type: "tech",
    risk: "medium",
    note: "Cybersecurity industry aggregator"
  },
  {
    handle: "securelist",
    name: "Securelist by Kaspersky",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Kaspersky research blog; vendor research, not independent journalism"
  },
  {
    handle: "DarkWebInformer",
    name: "Dark Web Informer",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Dark-web monitoring aggregator"
  },
  {
    handle: "CYBERWARCOM",
    name: "CYBERWAR.COM",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Cyber-conflict aggregator"
  },
  {
    handle: "thecyberwire",
    name: "The CyberWire",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Cybersecurity briefing specialist"
  },
  {
    handle: "vxunderground",
    name: "vx-underground",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Malware-research archive; technical primary, not a newsroom"
  },
  {
    handle: "falconfeeds",
    name: "FalconFeeds.io",
    tier: 3,
    type: "intel",
    risk: "medium",
    note: "Commercial threat-intel feed"
  }
];
function telegramRiskProfile(entry) {
  return {
    risk: entry.risk,
    ...entry.stateAffiliated ? { stateAffiliated: entry.stateAffiliated } : {},
    ...entry.knownBiases ? { knownBiases: entry.knownBiases } : {},
    note: entry.note
  };
}
var TELEGRAM_SOURCE_TYPES = Object.fromEntries(
  TELEGRAM_CHANNEL_TRUST.filter((entry) => !entry.reuseExisting).map((entry) => [entry.name, entry.type])
);
var TELEGRAM_SOURCE_PROPAGANDA_RISK = Object.fromEntries(
  TELEGRAM_CHANNEL_TRUST.filter((entry) => !entry.reuseExisting).map((entry) => [entry.name, telegramRiskProfile(entry)])
);
var TELEGRAM_SOURCE_TIERS = Object.fromEntries(
  TELEGRAM_CHANNEL_TRUST.filter((entry) => !entry.reuseExisting).map((entry) => [entry.name, entry.tier])
);
var TELEGRAM_HANDLE_TO_PUBLIC_NAME = Object.fromEntries(
  TELEGRAM_CHANNEL_TRUST.map((entry) => [entry.handle, entry.name])
);
function normalizeTelegramHandle(handle) {
  return handle.trim().replace(/^@/, "").toLowerCase();
}
var TELEGRAM_NORMALIZED_HANDLE_TO_PUBLIC_NAME = (() => {
  const entries = /* @__PURE__ */ new Map();
  for (const entry of TELEGRAM_CHANNEL_TRUST) {
    const normalizedHandle = normalizeTelegramHandle(entry.handle);
    if (entries.has(normalizedHandle)) {
      throw new Error(`Duplicate Telegram trust handle: ${entry.handle}`);
    }
    entries.set(normalizedHandle, entry.name);
  }
  return entries;
})();

// shared/source-provenance.ts
var SOURCE_TYPES = {
  // Wire services - fastest, most authoritative
  "Reuters": "wire",
  "Reuters World": "wire",
  "Reuters Business": "wire",
  "AP News": "wire",
  "AFP": "wire",
  "Bloomberg": "wire",
  // Government & International Org sources
  "White House": "gov",
  "White House Actions": "gov",
  "State Dept": "gov",
  "Pentagon": "gov",
  "Treasury": "gov",
  "DOJ": "gov",
  "DHS": "gov",
  "CDC": "gov",
  "FEMA": "gov",
  "Federal Reserve": "gov",
  "SEC": "gov",
  "U.S. Trade Representative": "gov",
  "UN News": "gov",
  "CISA": "gov",
  // Direct official military publishers. Their claims remain publisher claims,
  // not independent ADS-B/AIS observations.
  "Taiwan Ministry of National Defense": "gov",
  "Japan Joint Staff": "gov",
  // Chinese government ministries (Tier 1 official sources — not wire/verified outlets)
  "CAC (China)": "gov",
  "SAMR (China)": "gov",
  "MIIT (China)": "gov",
  "MOFCOM (China)": "gov",
  "NDRC (China)": "gov",
  "NBS (China)": "gov",
  "PBoC (China)": "gov",
  "SAFE (China)": "gov",
  "GACC (China)": "gov",
  // Intel/Defense specialty
  "Defense One": "intel",
  "Breaking Defense": "intel",
  "The War Zone": "intel",
  "Defense News": "intel",
  "Janes": "intel",
  "Military Times": "intel",
  "Task & Purpose": "intel",
  "USNI News": "intel",
  "gCaptain": "intel",
  "Oryx OSINT": "intel",
  "UK MOD": "gov",
  "Bellingcat": "intel",
  "Krebs Security": "intel",
  "Foreign Policy": "intel",
  "The Diplomat": "intel",
  "Atlantic Council": "intel",
  "Foreign Affairs": "intel",
  "CrisisWatch": "intel",
  "CSIS": "intel",
  "RAND": "intel",
  "Brookings": "intel",
  "Carnegie": "intel",
  "IAEA": "gov",
  "WHO": "gov",
  "UNHCR": "gov",
  "Xinhua": "wire",
  "TASS": "wire",
  "RT": "wire",
  "RT Russia": "wire",
  "NHK World": "mainstream",
  "Nikkei Asia": "market",
  // Independent RU exile / UA English primary (default-eligible under #5950 balance rule)
  "Meduza": "mainstream",
  "Moscow Times": "mainstream",
  "Kyiv Independent": "mainstream",
  // Ukraine depth pack (#5951) + uk native pack (#5959)
  "Ukrinform": "wire",
  "Suspilne": "mainstream",
  "Ukrainska Pravda EN": "mainstream",
  "NV EN": "mainstream",
  "Hromadske EN": "mainstream",
  "ISW": "intel",
  "Ukrainska Pravda": "mainstream",
  "Hromadske": "mainstream",
  "Bihus.Info": "intel",
  "Slidstvo.Info": "intel",
  "ZN.UA": "mainstream",
  // Mainstream outlets
  "BBC World": "mainstream",
  "BBC Middle East": "mainstream",
  "Guardian World": "mainstream",
  "Guardian ME": "mainstream",
  "NPR News": "mainstream",
  "Al Jazeera": "mainstream",
  "CNN World": "mainstream",
  "Politico": "mainstream",
  "Axios": "mainstream",
  "EuroNews": "mainstream",
  "France 24": "mainstream",
  "Le Monde": "mainstream",
  // European Addition
  "El Pa\xEDs": "mainstream",
  "El Mundo": "mainstream",
  "BBC Mundo": "mainstream",
  "Tagesschau": "mainstream",
  "Der Spiegel": "mainstream",
  "Die Zeit": "mainstream",
  "DW News": "mainstream",
  "ANSA": "wire",
  "Corriere della Sera": "mainstream",
  "Repubblica": "mainstream",
  "Handelsblatt": "market",
  "Welt": "mainstream",
  "Telegraph": "mainstream",
  "Interfax RU": "wire",
  "Interfax EN": "wire",
  "NOS Nieuws": "mainstream",
  "NRC": "mainstream",
  "De Telegraaf": "mainstream",
  // Croatian (HR)
  "N1 Croatia": "mainstream",
  "Index.hr": "mainstream",
  "Jutarnji list": "mainstream",
  "Balkan Insight": "intel",
  // Romanian (RO) — Eastern flank (#5952)
  "Digi24": "mainstream",
  "HotNews": "mainstream",
  "G4Media": "mainstream",
  // Bulgarian (BG) — Black Sea flank (#5952)
  "Dnevnik": "mainstream",
  // Greek (EL) — locale-boosted; Kathimerini is the EN strategic default
  "Kathimerini": "mainstream",
  "Naftemporiki": "mainstream",
  "in.gr": "mainstream",
  "iefimerida": "mainstream",
  "Proto Thema": "mainstream",
  "ERT": "mainstream",
  "AMNA": "wire",
  "Ta Nea": "mainstream",
  "Liberal GR": "mainstream",
  "CNN Greece": "mainstream",
  // Baltic states — Eastern flank (#5952)
  "ERR News": "mainstream",
  "LRT English": "mainstream",
  "LSM English": "mainstream",
  // Turkey EN path (#5952)
  "Daily Sabah": "mainstream",
  // Polish (PL) depth — catalog opt-in, locale-boosted
  "PAP": "wire",
  "Gazeta Wyborcza": "mainstream",
  "Polityka": "mainstream",
  "Onet": "mainstream",
  "OKO.press": "intel",
  "TVP Info": "mainstream",
  // Czech (CS) — V4 balance (#5952)
  "Seznam Zpr\xE1vy": "mainstream",
  // Hindi (HI)
  "BBC Hindi": "mainstream",
  "Aaj Tak": "mainstream",
  "NDTV India": "mainstream",
  "Amar Ujala": "mainstream",
  // Hungarian (HU)
  "Telex": "mainstream",
  "Index.hu": "mainstream",
  "HVG": "mainstream",
  "444.hu": "mainstream",
  "24.hu": "mainstream",
  "H\xEDrad\xF3": "mainstream",
  "ATV": "mainstream",
  "Portfolio.hu": "market",
  "SVT Nyheter": "mainstream",
  "Dagens Nyheter": "mainstream",
  "Svenska Dagbladet": "mainstream",
  // Canada + Arctic/Nordic pack (#5960) + depth pack (#6604/#6605)
  "CBC News": "mainstream",
  "Globe and Mail": "mainstream",
  "Global News": "mainstream",
  "Toronto Star": "mainstream",
  "National Post": "mainstream",
  "Financial Post": "market",
  "iPolitics": "mainstream",
  "The Narwhal": "mainstream",
  "The Tyee": "mainstream",
  "Maclean's": "mainstream",
  "Radio-Canada": "mainstream",
  "La Presse": "mainstream",
  "Le Devoir": "mainstream",
  "TVA Nouvelles": "mainstream",
  "Vancouver Sun": "mainstream",
  "Calgary Herald": "mainstream",
  "Winnipeg Free Press": "mainstream",
  "Edmonton Journal": "mainstream",
  "Ottawa Citizen": "mainstream",
  "The Province": "mainstream",
  "CTV News": "mainstream",
  "CP24": "mainstream",
  "Montreal Gazette": "mainstream",
  "Yle News": "mainstream",
  "NRK": "mainstream",
  "Aftenposten": "mainstream",
  "DR Nyheder": "mainstream",
  "Arctic Today": "mainstream",
  // Brazilian Addition
  "Brasil Paralelo": "mainstream",
  // Market/Finance
  "CNBC": "market",
  "MarketWatch": "market",
  "Yahoo Finance": "market",
  "Financial Times": "market",
  "Fox Business": "market",
  "Business Insider": "market",
  "Jin10": "market",
  "Coinbase Blog": "market",
  "Binance Announcements": "market",
  // Press-release distribution is publisher-submitted content. Do not label
  // these feeds as independent wire reporting.
  "GlobeNewswire": "other",
  "Business Wire": "other",
  "PR Newswire": "other",
  "Chainwire": "other",
  "Shanghai Stock Exchange": "market",
  "Shenzhen Stock Exchange": "market",
  // Tech
  "Hacker News": "tech",
  "Ars Technica": "tech",
  "The Verge": "tech",
  "The Verge AI": "tech",
  "MIT Tech Review": "tech",
  "TechCrunch Layoffs": "tech",
  "AI News": "tech",
  "ArXiv AI": "tech",
  "VentureBeat AI": "tech",
  "Wired": "tech",
  "Layoffs.fyi": "tech",
  "Layoffs News": "tech",
  // Regional Tech Startups
  "EU Startups": "tech",
  "Tech.eu": "tech",
  "Sifted (Europe)": "tech",
  "The Next Web": "tech",
  "Tech in Asia": "tech",
  "e27 (SEA)": "tech",
  "DealStreetAsia": "tech",
  "Pandaily (China)": "tech",
  "36Kr English": "tech",
  "TechNode (China)": "tech",
  "The Bridge (Japan)": "tech",
  "Nikkei Tech": "tech",
  "Inc42 (India)": "tech",
  "YourStory": "tech",
  "TechCabal (Africa)": "tech",
  "Wamda (MENA)": "tech",
  "Magnitt": "tech",
  // Think Tanks & Policy
  "Brookings Tech": "intel",
  "CSIS Tech": "intel",
  "Stanford HAI": "intel",
  "AI Now Institute": "intel",
  "OECD Digital": "intel",
  "Bruegel (EU)": "intel",
  "Chatham House Tech": "intel",
  "DigiChina": "intel",
  "Lowy Institute": "intel",
  "EFF News": "intel",
  "Politico Tech": "intel",
  // Security/Defense Think Tanks
  "RUSI": "intel",
  "Wilson Center": "intel",
  "GMF": "intel",
  "Stimson Center": "intel",
  "CNAS": "intel",
  // Nuclear & Arms Control
  "Arms Control Assn": "intel",
  "Bulletin of Atomic Scientists": "intel",
  // Food Security & Regional
  "FAO GIEWS": "gov",
  "EU ISS": "intel",
  // Investigative journalism & accountability
  "OCCRP": "intel",
  "DFRLab": "intel",
  "Lighthouse Reports": "intel",
  "The Sentry": "intel",
  "GITOC": "intel",
  "VSquare": "intel",
  "Correctiv": "intel",
  // New verified think tanks
  "War on the Rocks": "intel",
  "AEI": "intel",
  "Responsible Statecraft": "intel",
  "FPRI": "intel",
  "Jamestown": "intel",
  // Podcasts & Newsletters
  "Acquired Podcast": "tech",
  "All-In Podcast": "tech",
  "a16z Podcast": "tech",
  "This Week in Startups": "tech",
  "The Twenty Minute VC": "tech",
  "Hard Fork (NYT)": "tech",
  "Pivot (Vox)": "tech",
  "Stratechery": "tech",
  "Benedict Evans": "tech",
  "How I Built This": "tech",
  "Masters of Scale": "tech",
  // Periphery packs (#5953) — Caucasus
  "Civil.ge": "mainstream",
  "OC Media": "mainstream",
  "JAMnews": "mainstream",
  "Azertag": "wire",
  "Armenpress": "wire",
  // Periphery packs (#5953) — Belarus / Moldova
  "Zerkalo": "mainstream",
  "NewsMaker": "mainstream",
  "Ziarul de Gard\u0103": "mainstream",
  // Periphery packs (#5953) — Central Asia
  "Eurasianet": "mainstream",
  "RFE/RL Central Asia": "mainstream",
  "The Astana Times": "mainstream",
  "The Times of Central Asia": "mainstream",
  // Indo-Pacific feeds (#5954)
  "Focus Taiwan": "wire",
  "Taipei Times": "mainstream",
  "Taiwan News": "mainstream",
  "Dawn": "mainstream",
  "Geo News": "mainstream",
  "Jakarta Post": "mainstream",
  "Rappler": "mainstream",
  "The Star (Malaysia)": "mainstream",
  "Irrawaddy": "mainstream",
  // Validated crisis desks (#6813-#6830)
  "Yemen Online": "mainstream",
  "Sana'a Center": "intel",
  "Syria Direct": "mainstream",
  "Enab Baladi English": "mainstream",
  "+972 Magazine": "mainstream",
  "WAFA English": "gov",
  "HaitiLibre English": "mainstream",
  "AyiboPost": "mainstream",
  "Amu TV": "mainstream",
  "Pajhwok Afghan News": "wire",
  "Naharnet Lebanon": "mainstream",
  "L'Orient Today": "mainstream",
  "Annahar": "mainstream",
  "Studio Tamani": "mainstream",
  "leFaso.net": "mainstream",
  "ActuNiger": "mainstream",
  "A\xEFr Info": "mainstream",
  "Caracas Chronicles": "mainstream",
  "Efecto Cocuyo": "mainstream",
  "Havana Times": "mainstream",
  "14ymedio": "mainstream",
  "Libya Herald": "mainstream",
  "Egypt Independent": "mainstream",
  "Mada Masr": "mainstream",
  "The Daily Star": "mainstream",
  "Dhaka Tribune": "mainstream",
  "Daily Nation": "mainstream",
  "Times of India": "mainstream",
  "The Guardian Post": "mainstream",
  "Tchadinfos": "mainstream",
  "Alwihda Info": "mainstream",
  "Radio Ndeke Luka": "mainstream",
  // Telegram channels (#6600). Additive keys keyed by channel display label.
  ...TELEGRAM_SOURCE_TYPES,
  // Curated X news-account overlay (#6654). Additive to Telegram.
  ...X_ACCOUNT_SOURCE_TYPES
};
function getSourceType(sourceName) {
  return SOURCE_TYPES[sourceName] ?? "unknown";
}
function hasReviewedSourceType(sourceName) {
  return Object.prototype.hasOwnProperty.call(SOURCE_TYPES, sourceName);
}
function hasDeclaredSourceType(sourceName) {
  return hasReviewedSourceType(sourceName) || Object.prototype.hasOwnProperty.call(CONFIGURED_SOURCE_PROVENANCE_DECLARATIONS, sourceName);
}
var UNREVIEWED_SOURCE_RISK = Object.freeze({
  risk: "unknown",
  note: "Provenance not yet reviewed \u2014 do not treat as independent journalism"
});
var SOURCE_PROPAGANDA_RISK = {
  // High risk - State-controlled media
  "Xinhua": { risk: "high", stateAffiliated: "China", note: "Official CCP news agency" },
  "TASS": { risk: "high", stateAffiliated: "Russia", note: "Russian state news agency" },
  "RT": { risk: "high", stateAffiliated: "Russia", note: "Russian state media, banned in EU" },
  "RT Russia": { risk: "high", stateAffiliated: "Russia", note: "Russian state media, Russia desk" },
  "Sputnik": { risk: "high", stateAffiliated: "Russia", note: "Russian state media" },
  "CGTN": { risk: "high", stateAffiliated: "China", note: "Chinese state broadcaster" },
  "Press TV": { risk: "high", stateAffiliated: "Iran", note: "Iranian state media" },
  "IRNA": { risk: "high", stateAffiliated: "Iran", note: "Iranian state news agency (Islamic Republic News Agency)" },
  "Mehr News": { risk: "high", stateAffiliated: "Iran", note: "Iranian state-affiliated, Basij-linked" },
  "KCNA": { risk: "high", stateAffiliated: "North Korea", note: "North Korean state media" },
  // Official Chinese ministry feeds (government sources, not independent media)
  "MIIT (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "Chinese Ministry of Industry and Information Technology official feed"
  },
  "MOFCOM (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "Chinese Ministry of Commerce official feed"
  },
  // Official exchange authorities. These are authoritative primary publishers,
  // not independent journalism; omit stateAffiliated so the shared validator
  // does not conflate an exchange authority with state-controlled media.
  "Shanghai Stock Exchange": {
    risk: "high",
    note: "Official mainland China exchange authority; metadata-only source"
  },
  "Shenzhen Stock Exchange": {
    risk: "high",
    note: "Official mainland China exchange authority; metadata-only source"
  },
  "Taiwan Ministry of National Defense": {
    risk: "high",
    stateAffiliated: "Taiwan",
    note: "Direct government activity reports; treat values as official publisher claims, not independent observations"
  },
  "Japan Joint Staff": {
    risk: "high",
    stateAffiliated: "Japan",
    note: "Direct government activity reports; only manually reviewed documents are admitted as regional augmentation"
  },
  "CAC (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "Cyberspace Administration of China official publication"
  },
  "SAMR (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "State Administration for Market Regulation official publication"
  },
  "NDRC (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "National Development and Reform Commission official publication"
  },
  "NBS (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "National Bureau of Statistics of China official data release"
  },
  "PBoC (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "People's Bank of China official publication"
  },
  "SAFE (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "State Administration of Foreign Exchange official data release"
  },
  "GACC (China)": {
    risk: "high",
    stateAffiliated: "China",
    note: "General Administration of Customs of China official data release"
  },
  "U.S. Trade Representative": {
    risk: "high",
    stateAffiliated: "USA",
    note: "Official U.S. government trade-policy publication; treat statements as primary government claims"
  },
  // Medium risk - State-affiliated or known bias
  "Al Jazeera": { risk: "medium", stateAffiliated: "Qatar", note: "Qatari state-funded, independent editorial" },
  "Al Arabiya": { risk: "medium", stateAffiliated: "Saudi Arabia", note: "Saudi-owned, reflects Gulf perspective" },
  "TRT World": { risk: "medium", stateAffiliated: "Turkey", note: "Turkish state broadcaster" },
  "France 24": { risk: "medium", stateAffiliated: "France", note: "French state-funded, editorially independent" },
  "EuroNews": { risk: "low", note: "European public broadcaster consortium", knownBiases: ["Pro-EU"] },
  "Le Monde": { risk: "low", note: "French newspaper of record" },
  "DW News": { risk: "medium", stateAffiliated: "Germany", note: "German state-funded, editorially independent" },
  "ERT": { risk: "medium", stateAffiliated: "Greece", note: "Greek public broadcaster" },
  "AMNA": { risk: "medium", stateAffiliated: "Greece", note: "Greek national news agency" },
  "Voice of America": { risk: "medium", stateAffiliated: "USA", note: "US government-funded" },
  "Kyiv Independent": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Ukrainian English-language primary on Russia-Ukraine war (#5950 balance: dedicated UA voice)" },
  // Ukraine depth pack (#5951) — local institutions + frontline assessment
  "Ukrinform": { risk: "high", stateAffiliated: "Ukraine", note: "Ukrainian national state news agency (UKRINFORM)" },
  "Suspilne": { risk: "medium", stateAffiliated: "Ukraine", note: "Ukrainian public broadcaster, state-funded" },
  "Ukrainska Pravda EN": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Independent Ukrainian outlet, high-signal English edition" },
  "NV EN": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "New Voice of Ukraine English edition, independent" },
  "Hromadske EN": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Ukrainian independent public broadcaster (English)" },
  // Ukrainian native outlets (#5959) — locale-boosted for uk UI
  "Ukrainska Pravda": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Independent Ukrainian outlet, Ukrainian-language edition" },
  "Hromadske": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Ukrainian independent public broadcaster (Ukrainian)" },
  "Bihus.Info": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Ukrainian investigative anti-corruption outlet" },
  "Slidstvo.Info": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Ukrainian investigative journalism project (Radio Free Europe partnership)" },
  "ZN.UA": { risk: "medium", knownBiases: ["Pro-Ukraine"], note: "Dzerkalo Tyzhnia \u2014 Ukrainian weekly analytical newspaper" },
  "ISW": { risk: "low", note: "Institute for the Study of War, nonpartisan research nonprofit, daily frontline assessments" },
  "Moscow Times": { risk: "medium", knownBiases: ["Anti-Kremlin"], note: "Independent English-language Russian outlet, critical of Kremlin" },
  "Interfax RU": { risk: "medium", note: "Russian private news agency operating under domestic media restrictions; Russian-language feed" },
  "Interfax EN": { risk: "medium", note: "Russian private news agency operating under domestic media restrictions; English-language edition" },
  "GlobeNewswire": { risk: "medium", note: "Publisher-submitted press releases; not independent reporting" },
  "Business Wire": { risk: "medium", note: "Publisher-submitted press releases; not independent reporting" },
  "PR Newswire": { risk: "medium", note: "Publisher-submitted press releases; not independent reporting" },
  "Chainwire": { risk: "medium", note: "Paid crypto press-release distribution; not independent reporting" },
  "Coinbase Blog": { risk: "medium", note: "Coinbase first-party company publication; treat statements as issuer claims" },
  "Binance Announcements": { risk: "medium", note: "Binance first-party announcement channel; treat statements as issuer claims" },
  "Jin10": { risk: "medium", note: "Chinese financial-news and market-data publisher; limited English editorial transparency" },
  // Independent RU exile press — not state media; eligible for EN defaults (#5950)
  "Meduza": { risk: "low", knownBiases: ["Anti-Kremlin"], note: "Independent Russian exile outlet (Riga); English + Russian RSS" },
  // Validated crisis desks (#6813-#6830). These declarations are editorial
  // provenance, not endorsements of every publisher claim.
  "Yemen Online": { risk: "medium", note: "Independent English-language Yemeni platform; exile and conflict-reporting context" },
  "Sana'a Center": { risk: "low", note: "Independent Yemeni policy and analysis center" },
  "Syria Direct": { risk: "low", note: "Independent nonprofit Syria newsroom" },
  "Enab Baladi English": { risk: "medium", knownBiases: ["Syrian opposition perspective"], note: "Independent Syrian newsroom founded by citizen journalists" },
  "+972 Magazine": { risk: "medium", knownBiases: ["Israeli-Palestinian human-rights perspective"], note: "Independent Israeli-Palestinian magazine" },
  "WAFA English": { risk: "high", stateAffiliated: "Palestine", note: "Official Palestinian news agency; treat statements as government claims" },
  "HaitiLibre English": { risk: "medium", note: "Translated Haiti-focused desk; retain explicit publisher attribution" },
  "AyiboPost": { risk: "low", note: "Independent Haitian investigative newsroom" },
  "Amu TV": { risk: "medium", note: "Independent Afghan exile newsroom with reporters inside Afghanistan" },
  "Pajhwok Afghan News": { risk: "medium", note: "Independent Kabul-based news agency operating under domestic restrictions" },
  "Naharnet Lebanon": { risk: "low", note: "Independent Lebanese digital outlet" },
  "L'Orient Today": { risk: "low", note: "Independent English-language Lebanese newsroom" },
  "Annahar": { risk: "low", note: "Independent Lebanese Arabic-language political newspaper" },
  "PAP": { risk: "medium", stateAffiliated: "Poland", note: "Polish national news agency (Polska Agencja Prasowa); state-owned wire" },
  "Gazeta Wyborcza": { risk: "low", note: "Independent Polish daily newspaper published by Agora" },
  "Polityka": { risk: "low", note: "Independent Polish weekly news magazine" },
  "Onet": { risk: "low", note: "Polish commercial news portal published by Ringier Axel Springer Polska" },
  "OKO.press": { risk: "low", note: "Independent Polish investigative and fact-checking outlet" },
  "TVP Info": { risk: "medium", stateAffiliated: "Poland", note: "Polish public-service news channel; state-funded broadcaster" },
  "Studio Tamani": { risk: "low", note: "Mali newsroom operated by Fondation Hirondelle; Journalism Trust Initiative certified" },
  "leFaso.net": { risk: "low", note: "Independent Burkina Faso digital newsroom" },
  "ActuNiger": { risk: "medium", note: "Niger-focused independent newsroom" },
  "A\xEFr Info": { risk: "low", note: "Independent northern Niger and Agadez newsroom" },
  "Caracas Chronicles": { risk: "medium", knownBiases: ["Opposition-leaning Venezuela analysis"], note: "Independent English-language Venezuela analysis outlet" },
  "Efecto Cocuyo": { risk: "low", note: "Independent Venezuelan newsroom" },
  "Havana Times": { risk: "medium", knownBiases: ["Independent Cuban perspective"], note: "Independent English-language Cuba-focused publication" },
  "14ymedio": { risk: "medium", knownBiases: ["Cuban opposition perspective"], note: "Independent Cuban digital newspaper" },
  "Libya Herald": { risk: "medium", note: "Independent English-language Libya newsroom in a polarized media environment" },
  "Egypt Independent": { risk: "medium", note: "Independent English-language Egypt newsroom operating under domestic restrictions" },
  "Mada Masr": { risk: "medium", note: "Independent Egyptian newsroom operating under domestic restrictions" },
  "The Daily Star": { risk: "low", note: "Independent English-language Bangladesh newspaper" },
  "Dhaka Tribune": { risk: "low", note: "Independent English-language Bangladesh newspaper" },
  "Daily Nation": { risk: "low", note: "Kenyan newspaper published by Nation Media Group" },
  "The Guardian Post": { risk: "medium", note: "Independent Cameroon English-language newspaper" },
  "Tchadinfos": { risk: "medium", note: "Chad-focused French-language newsroom" },
  "Alwihda Info": { risk: "medium", note: "Pan-African French-language publisher with Chad coverage; source mapping is not article geolocation" },
  "Radio Ndeke Luka": { risk: "low", note: "CAR-focused newsroom; Journalism Trust Initiative certified" },
  // Low risk - Independent with editorial standards (explicit)
  "Jerusalem Post": { risk: "low", knownBiases: ["Israeli centre-right"], note: "English-language Israeli daily of record" },
  "Ynetnews": { risk: "low", knownBiases: ["Israeli mainstream"], note: "Yedioth Ahronoth English edition" },
  "Digi24": { risk: "low", note: "Romanian independent news channel, member of ERNO" },
  "HotNews": { risk: "low", note: "Romanian independent online news portal" },
  "G4Media": { risk: "low", note: "Romanian independent investigative outlet" },
  "Dnevnik": { risk: "low", note: "Bulgarian independent daily newspaper" },
  "ERR News": { risk: "low", note: "Estonian Public Broadcasting English service" },
  "LRT English": { risk: "low", note: "Lithuanian Public Broadcasting English service" },
  "LSM English": { risk: "low", note: "Latvian Public Broadcasting English service" },
  // Canada + Arctic/Nordic pack (#5960) + depth pack (#6604/#6605)
  "CBC News": { risk: "medium", stateAffiliated: "Canada", note: "Canadian public broadcaster (CBC/Radio-Canada), editorially independent charter" },
  "Globe and Mail": { risk: "low", note: "Canadian newspaper of record" },
  "Global News": { risk: "low", note: "Canadian national news network (Corus Entertainment)" },
  "Toronto Star": { risk: "low", note: "Canadian metropolitan daily newspaper of record (Toronto)" },
  "National Post": { risk: "low", note: "Canadian national newspaper (Postmedia)" },
  "Financial Post": { risk: "low", note: "Canadian business newspaper (Postmedia)" },
  "iPolitics": { risk: "low", note: "Canadian political news outlet" },
  "The Narwhal": { risk: "low", note: "Canadian independent environmental investigative outlet" },
  "The Tyee": { risk: "low", note: "Canadian independent British Columbia news magazine" },
  "Maclean's": { risk: "low", note: "Canadian national news magazine" },
  "Radio-Canada": { risk: "medium", stateAffiliated: "Canada", note: "CBC/Radio-Canada French service, editorially independent charter" },
  "La Presse": { risk: "low", note: "Quebec French-language daily newspaper" },
  "Le Devoir": { risk: "low", note: "Quebec French-language newspaper of record" },
  "TVA Nouvelles": { risk: "low", note: "Quebec private television news (Quebecor); not state-affiliated" },
  "Vancouver Sun": { risk: "low", note: "Vancouver daily newspaper (Postmedia)" },
  "Calgary Herald": { risk: "low", note: "Calgary daily newspaper (Postmedia)" },
  "Winnipeg Free Press": { risk: "low", note: "Winnipeg daily newspaper" },
  "Edmonton Journal": { risk: "low", note: "Edmonton daily newspaper (Postmedia)" },
  "Ottawa Citizen": { risk: "low", note: "Ottawa daily newspaper (Postmedia)" },
  "The Province": { risk: "low", note: "Vancouver daily tabloid (Postmedia)" },
  "CTV News": { risk: "low", note: "Canadian national television news (Bell Media); GNews site: fallback, no native RSS" },
  "CP24": { risk: "low", note: "Toronto 24-hour news channel (Bell Media); GNews site: fallback, no native RSS" },
  "Montreal Gazette": { risk: "low", note: "Montreal English daily (Postmedia); GNews site: fallback, native RSS dead" },
  "Yle News": { risk: "medium", stateAffiliated: "Finland", note: "Finnish public broadcaster English service (Yle)" },
  "NRK": { risk: "medium", stateAffiliated: "Norway", note: "Norwegian public broadcaster" },
  "Aftenposten": { risk: "low", note: "Norwegian newspaper of record (Schibsted)" },
  "DR Nyheder": { risk: "medium", stateAffiliated: "Denmark", note: "Danish public broadcaster (DR)" },
  "Arctic Today": { risk: "low", note: "Independent High North / Arctic security and business news" },
  "Daily Sabah": { risk: "medium", stateAffiliated: "Turkey", note: "Turkish pro-government daily, English edition" },
  "Seznam Zpr\xE1vy": { risk: "low", note: "Czech independent online news outlet" },
  "Reuters": { risk: "low", note: "Wire service, strict editorial standards" },
  "AP News": { risk: "low", note: "Wire service, nonprofit cooperative" },
  "AFP": { risk: "low", note: "Wire service, editorially independent" },
  "BBC World": { risk: "low", note: "Public broadcaster, editorial independence charter" },
  "BBC Middle East": { risk: "low", note: "Public broadcaster, editorial independence charter" },
  "Guardian World": { risk: "low", knownBiases: ["Center-left"], note: "Scott Trust ownership, no shareholders" },
  "Financial Times": { risk: "low", note: "Business focus, Nikkei-owned" },
  "Times of India": { risk: "low", note: "Major Indian national newspaper with an established editorial newsroom" },
  "Fox Business": { risk: "low", note: "Commercial U.S. business-news publisher" },
  "Business Insider": { risk: "low", note: "Commercial business-news publisher with editorial standards" },
  "Wired": { risk: "low", note: "Technology publication with editorial standards" },
  "Handelsblatt": { risk: "low", note: "German business newspaper with editorial standards" },
  "Welt": { risk: "low", note: "German national newspaper with editorial standards" },
  "Telegraph": { risk: "low", note: "British national newspaper with editorial standards" },
  "Bellingcat": { risk: "low", note: "Open-source investigations, methodology transparent" },
  "Brasil Paralelo": { risk: "low", note: "Independent media company: no political ties, no public funding, 100% subscriber-funded." },
  // Periphery packs (#5953) — Caucasus
  "Civil.ge": { risk: "low", note: "Independent Georgian English-language news outlet" },
  "OC Media": { risk: "low", note: "Independent South Caucasus regional news outlet" },
  "JAMnews": { risk: "medium", note: "Regional Caucasus news platform, limited editorial transparency" },
  "Azertag": { risk: "high", stateAffiliated: "Azerbaijan", note: "Azerbaijani state news agency (AZERTAC)" },
  "Armenpress": { risk: "high", stateAffiliated: "Armenia", note: "Armenian state news agency" },
  // Periphery packs (#5953) — Belarus / Moldova
  "Zerkalo": { risk: "low", note: "Independent Belarusian exile news outlet (formerly TUT.BY)" },
  "NewsMaker": { risk: "medium", note: "Moldovan independent news outlet; configured Russian-language feed" },
  "Ziarul de Gard\u0103": { risk: "medium", note: "Moldovan investigative journalism outlet, Romanian-language" },
  // Periphery packs (#5953) — Central Asia
  "Eurasianet": { risk: "medium", note: "Nonprofit regional news covering Eurasia, Carnegie-funded" },
  "RFE/RL Central Asia": { risk: "medium", stateAffiliated: "USA", note: "US government-funded Central Asia desk (Radio Free Europe)" },
  "The Astana Times": { risk: "medium", stateAffiliated: "Kazakhstan", note: "Kazakhstan government-funded English-language news" },
  "The Times of Central Asia": { risk: "medium", note: "Independent English-language Central Asia news outlet" },
  // Telegram channels (#6600). Additive keys keyed by channel display label.
  ...TELEGRAM_SOURCE_PROPAGANDA_RISK,
  // Curated X news-account overlay (#6654). Additive to Telegram.
  ...X_ACCOUNT_SOURCE_PROPAGANDA_RISK
};
function getSourcePropagandaRisk(sourceName) {
  return SOURCE_PROPAGANDA_RISK[sourceName] ?? UNREVIEWED_SOURCE_RISK;
}
function hasReviewedPropagandaRisk(sourceName) {
  return Object.prototype.hasOwnProperty.call(SOURCE_PROPAGANDA_RISK, sourceName);
}
function hasDeclaredPropagandaRisk(sourceName) {
  return hasReviewedPropagandaRisk(sourceName) || Object.prototype.hasOwnProperty.call(CONFIGURED_SOURCE_PROVENANCE_DECLARATIONS, sourceName);
}
function getSourceProvenanceState(sourceName) {
  const profile = getSourcePropagandaRisk(sourceName);
  return {
    risk: profile.risk,
    type: getSourceType(sourceName),
    riskDeclared: hasDeclaredPropagandaRisk(sourceName),
    typeDeclared: hasDeclaredSourceType(sourceName),
    riskReviewed: hasReviewedPropagandaRisk(sourceName),
    typeReviewed: hasReviewedSourceType(sourceName),
    ...profile.stateAffiliated ? { stateAffiliated: profile.stateAffiliated } : {},
    ...profile.note ? { note: profile.note } : {}
  };
}

// shared/source-tiers.json
var source_tiers_default = {
  "24.hu": 2,
  "36Kr English": 3,
  "444.hu": 2,
  "ABC News": 2,
  "ABC News Australia": 2,
  AEI: 3,
  AFP: 1,
  "AI News": 4,
  "AI Now Institute": 3,
  "AI Podcast (NVIDIA)": 3,
  "AI Regulation": 3,
  ANSA: 1,
  "AP News": 1,
  ATV: 2,
  "Aaj Tak": 2,
  "Acquired Podcast": 2,
  "Actualite.cd": 3,
  Aftenposten: 2,
  "Al Jazeera": 2,
  "All-In Podcast": 2,
  "Amar Ujala": 2,
  AMNA: 1,
  "ArXiv AI": 4,
  "Arctic Today": 2,
  Armenpress: 1,
  "Arms Control Assn": 2,
  "Ars Technica": 3,
  "Atlantic Council": 3,
  Axios: 2,
  Azertag: 1,
  "BBC Hindi": 2,
  "BBC Middle East": 2,
  "BBC Mundo": 2,
  "BBC Persian": 2,
  "BBC Russian": 2,
  "BBC Turkce": 2,
  "BBC World": 2,
  "Balkan Insight": 1,
  "Bangkok Post": 2,
  Bellingcat: 3,
  "Benedict Evans": 2,
  "Bihus.Info": 2,
  "Binance Announcements": 2,
  Bloomberg: 1,
  "Brasil Paralelo": 2,
  "Brazil Tech News": 3,
  "Breaking Defense": 3,
  Brookings: 3,
  "Brookings Tech": 3,
  "Bruegel (EU)": 3,
  "Bulletin of Atomic Scientists": 2,
  "Business Insider": 2,
  "Business Wire": 3,
  "CAC (China)": 1,
  "CB Insights": 2,
  "CBC News": 1,
  "CBS News": 2,
  CDC: 2,
  CISA: 1,
  CNAS: 2,
  CNBC: 2,
  "CNN World": 2,
  "CNN Greece": 2,
  CP24: 2,
  CSIS: 3,
  "CSIS Tech": 3,
  "CTV News": 2,
  "Calgary Herald": 3,
  Carnegie: 3,
  Chainwire: 3,
  "Channels TV": 2,
  "Chatham House Tech": 3,
  "China Tech Analysis": 3,
  "China Tech News": 3,
  "China Tech Policy": 3,
  "Chosun Ilbo": 2,
  "Citi Newsroom": 3,
  "Civil.ge": 2,
  "Coinbase Blog": 2,
  "Conservation Optimism": 3,
  "Contxto (LATAM)": 3,
  Correctiv: 3,
  "Corriere della Sera": 2,
  CrisisWatch: 3,
  "Crunchbase News": 2,
  DFRLab: 2,
  DHS: 2,
  DOJ: 2,
  "DR Nyheder": 1,
  "DW News": 2,
  "DW Turkish": 2,
  "Dabanga Sudan": 3,
  "Dagens Nyheter": 2,
  "Daily Sabah": 2,
  "Daily Trust": 3,
  DailyGood: 3,
  Dawn: 2,
  "De Telegraaf": 2,
  DealStreetAsia: 3,
  "Decoder (Verge)": 3,
  "Defense News": 3,
  "Defense One": 3,
  "Der Spiegel": 2,
  "Die Zeit": 2,
  Digi24: 2,
  DigiChina: 2,
  Dnevnik: 2,
  "EFF News": 3,
  "ERR News": 2,
  ERT: 1,
  "EU Commission Digital": 2,
  "EU Digital Policy": 3,
  "EU ISS": 3,
  "EU Startups": 3,
  "Edmonton Journal": 3,
  "El Mundo": 2,
  "El Pa\xEDs": 2,
  "Entrackr (India)": 3,
  "Ethiopia Insight": 3,
  "Euractiv Digital": 3,
  Eurasianet: 2,
  EuroNews: 2,
  "Eye on AI": 3,
  "FAO GIEWS": 2,
  FEMA: 2,
  FPRI: 3,
  "Fars News": 3,
  "Federal Reserve": 3,
  "Financial Post": 2,
  "Financial Times": 2,
  "Focus Taiwan": 1,
  "Foreign Affairs": 3,
  "Foreign Policy": 3,
  "Fox Business": 2,
  "Fox News": 2,
  "France 24": 2,
  G4Media: 2,
  "Gazeta Wyborcza": 1,
  GITOC: 3,
  GMF: 3,
  "GNN Animals": 3,
  "GNN Earth": 3,
  "GNN Health": 3,
  "GNN Heroes": 3,
  "GNN Heroes Spotlight": 3,
  "GNN Science": 3,
  "GOOD Magazine": 3,
  "Geo News": 2,
  "GloNewswire (Taiwan)": 4,
  "Global News": 2,
  "Globe and Mail": 2,
  GlobeNewswire: 3,
  "Good Good Good": 3,
  "Good News Network": 2,
  "Gradient Dissent": 3,
  "Guardian Australia": 2,
  "Guardian ME": 2,
  "Guardian World": 2,
  HVG: 2,
  "Hacker News": 4,
  Handelsblatt: 2,
  "Hard Fork (NYT)": 2,
  "Hiiraan Online": 3,
  HotNews: 2,
  "How I Built This": 2,
  Hromadske: 2,
  "Hromadske EN": 2,
  Hurriyet: 2,
  H\u00EDrad\u00F3: 2,
  IAEA: 1,
  "ISEAS (Singapore)": 3,
  ISW: 2,
  "Inc42 (India)": 3,
  "Index.hr": 2,
  "Index.hu": 2,
  "India Tech News": 3,
  "India Tech Policy": 3,
  "Interfax EN": 1,
  "Interfax RU": 1,
  "Iran International": 3,
  Irrawaddy: 3,
  JAMnews: 3,
  "Jakarta Post": 2,
  Jamestown: 3,
  Janes: 3,
  "Japan Tech News": 3,
  Jin10: 2,
  "Jutarnji list": 2,
  "KED Global": 3,
  Kathimerini: 2,
  "Korea Tech News": 3,
  "Krebs Security": 3,
  "LATAM Fintech": 3,
  "LATAM Tech News": 3,
  "LRT English": 2,
  "LSM English": 2,
  "La Presse": 2,
  "La Silla Vac\xEDa": 3,
  "Layoffs News": 4,
  "Layoffs.fyi": 3,
  "Le Devoir": 2,
  "Le Monde": 2,
  "Le Quotidien": 3,
  "Lenny Newsletter": 2,
  "Lex Fridman Tech": 3,
  "Liberal GR": 2,
  "Lighthouse Reports": 3,
  "Lowy Institute": 3,
  "MIIT (China)": 1,
  "MIT Tech Policy": 3,
  "MIT Tech Review": 3,
  "MOFCOM (China)": 1,
  "Maclean's": 3,
  Magnitt: 3,
  MarketWatch: 2,
  "Masters of Scale": 2,
  Meduza: 2,
  "Mexico Tech News": 3,
  "Military Times": 2,
  Mongabay: 3,
  "Montreal Gazette": 2,
  "My Modern Met": 2,
  MyJoyOnline: 2,
  "N1 Croatia": 2,
  "NBC News": 2,
  "NDRC (China)": 1,
  "NDTV India": 2,
  "NHK World": 2,
  "NOS Nieuws": 1,
  "NPR News": 2,
  NRC: 2,
  NRK: 1,
  "NV EN": 2,
  Naftemporiki: 2,
  "National Post": 2,
  NewsMaker: 2,
  "Nikkei Asia": 2,
  "Nikkei Tech": 2,
  "Novaya Gazeta Europe": 2,
  "OC Media": 2,
  OCCRP: 2,
  "OECD Digital": 2,
  "OKO.press": 2,
  Onet: 2,
  "ORF Tech (India)": 3,
  "OpenAI News": 3,
  "Optimist Daily": 2,
  "Oryx OSINT": 2,
  "Ottawa Citizen": 3,
  "PBS NewsHour": 2,
  "PBoC (China)": 1,
  "PR Newswire": 3,
  "Pandaily (China)": 3,
  PAP: 1,
  "Paul Graham Essays": 2,
  Pentagon: 1,
  "PitchBook News": 2,
  "Pivot (Vox)": 2,
  Politico: 2,
  "Politico Tech": 2,
  Polityka: 2,
  "Polsat News": 2,
  "Portfolio.hu": 2,
  "Positive.News": 2,
  "Premium Times": 2,
  "Proto Thema": 3,
  RAND: 3,
  "RFE/RL Central Asia": 2,
  "RFI Afrique": 2,
  "RIETI (Japan)": 3,
  RT: 3,
  "RT Russia": 3,
  RUSI: 2,
  "Radio Okapi": 3,
  "Radio Tamazuj": 3,
  "Radio-Canada": 1,
  "Ransomware.live": 3,
  Rappler: 2,
  "Reasons to be Cheerful": 2,
  Repubblica: 2,
  "Responsible Statecraft": 3,
  Reuters: 1,
  "Reuters Business": 1,
  "Reuters India": 1,
  "Reuters US": 1,
  "Reuters World": 1,
  Rzeczpospolita: 2,
  "SAMR (China)": 1,
  SEC: 3,
  "SVT Nyheter": 1,
  "Sequoia Blog": 2,
  "Seznam Zpr\xE1vy": 2,
  Shareable: 3,
  "Sifted (Europe)": 3,
  "Slidstvo.Info": 2,
  "Stanford HAI": 2,
  "Startups.co (LATAM)": 3,
  "State Dept": 1,
  "Stimson Center": 3,
  Stratechery: 2,
  "Sunny Skyz": 3,
  Suspilne: 1,
  "Svenska Dagbladet": 2,
  TASS: 3,
  "TVA Nouvelles": 2,
  TVN24: 2,
  "TVP Info": 2,
  Tagesschau: 1,
  "Ta Nea": 2,
  "Taipei Times": 2,
  "Taiwan News": 2,
  "Taiwan Tech News": 3,
  "Task & Purpose": 3,
  "Tech Antitrust": 3,
  "Tech in Asia": 3,
  "Tech.eu": 3,
  "TechCabal (Africa)": 3,
  "TechCrunch Layoffs": 4,
  "TechNode (China)": 3,
  Telegraph: 2,
  Telex: 2,
  "Thai PBS": 2,
  "The Astana Times": 2,
  "The Better India": 3,
  "The Bridge (Japan)": 3,
  "The Diplomat": 3,
  "The Hill": 3,
  "The Information": 2,
  "The Narwhal": 3,
  "The National": 2,
  "The Next Web": 3,
  "The Pitch": 3,
  "The Pragmatic Engineer": 2,
  "The Province": 2,
  "The Reporter Ethiopia": 3,
  "The Sentry": 3,
  "The Star (Malaysia)": 2,
  "The Times of Central Asia": 3,
  "Times of India": 2,
  "The Twenty Minute VC": 2,
  "The Tyee": 3,
  "The Verge": 4,
  "The Verge AI": 4,
  "The Vergecast": 3,
  "The War Zone": 3,
  "This Week in Startups": 3,
  ThisDay: 2,
  "Toronto Star": 2,
  Treasury: 2,
  "Tuoi Tre News": 2,
  "U.S. Trade Representative": 1,
  "UK MOD": 1,
  "UK Tech Policy": 3,
  "UN News": 1,
  UNHCR: 1,
  "USNI News": 2,
  "Ukrainska Pravda": 2,
  "Ukrainska Pravda EN": 2,
  Ukrinform: 1,
  Upworthy: 3,
  VSquare: 3,
  "Vancouver Sun": 3,
  "Vanguard Nigeria": 2,
  "VentureBeat AI": 4,
  VnExpress: 2,
  WHO: 1,
  "Wall Street Journal": 1,
  "Wamda (MENA)": 3,
  "War on the Rocks": 2,
  Welt: 2,
  "White House": 1,
  "White House Actions": 1,
  "Wilson Center": 3,
  "Winnipeg Free Press": 3,
  Wired: 2,
  Xinhua: 3,
  "Y Combinator Blog": 2,
  "Yahoo Finance": 4,
  "Yes! Magazine": 2,
  "Yle News": 1,
  "Yonhap News": 2,
  YourStory: 3,
  "ZN.UA": 2,
  Zerkalo: 2,
  "Ziarul de Gard\u0103": 3,
  "a16z Blog": 2,
  "a16z Podcast": 2,
  "e27 (SEA)": 3,
  gCaptain: 3,
  iPolitics: 3,
  iefimerida: 3,
  "in.gr": 3,
  "14ymedio": 2,
  "+972 Magazine": 2,
  ActuNiger: 2,
  "A\xEFr Info": 2,
  "Alwihda Info": 2,
  "Amu TV": 2,
  Annahar: 2,
  AyiboPost: 2,
  "Caracas Chronicles": 2,
  "Daily Nation": 2,
  "Dhaka Tribune": 2,
  "Efecto Cocuyo": 2,
  "Egypt Independent": 2,
  "Enab Baladi English": 2,
  "HaitiLibre English": 2,
  "Havana Times": 2,
  "Libya Herald": 2,
  "L'Orient Today": 2,
  "Mada Masr": 2,
  "Naharnet Lebanon": 2,
  "Pajhwok Afghan News": 2,
  "Radio Ndeke Luka": 2,
  "Sana'a Center": 2,
  "Studio Tamani": 2,
  "Syria Direct": 2,
  Tchadinfos: 2,
  "The Daily Star": 2,
  "The Guardian Post": 2,
  "WAFA English": 3,
  "Yemen Online": 2,
  "leFaso.net": 2
};

// server/_shared/source-tiers.ts
var SOURCE_TIERS = {
  ...source_tiers_default,
  ...TELEGRAM_SOURCE_TIERS,
  ...X_ACCOUNT_SOURCE_TIERS
};

// scripts/source-origin.mjs
var INTERNATIONAL_FILTER = "intl";
var ISO2_CODES = new Set("AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CK CL CM CN CO CR CU CV CW CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET EU FI FJ FK FM FO FR GA GB GD GE GG GH GI GL GM GN GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE ZA ZM ZW".split(" "));
var REGION_NAMES = new Intl.DisplayNames(["en"], { type: "region" });
var VANITY_CC_TLDS = /* @__PURE__ */ new Set([
  "ai",
  "am",
  "cc",
  "cf",
  "cm",
  "co",
  "fm",
  "ga",
  "gd",
  "gg",
  "gl",
  "gq",
  "io",
  "is",
  "ly",
  "me",
  "ml",
  "mn",
  "nu",
  "rs",
  "sh",
  "so",
  "tk",
  "to",
  "tv",
  "vc",
  "ws",
  "zw"
]);
var GENERIC_TLDS = /* @__PURE__ */ new Set([
  "aero",
  "app",
  "arpa",
  "asia",
  "biz",
  "blog",
  "cloud",
  "coop",
  "dev",
  "edu",
  "events",
  "example",
  "gov",
  "info",
  "int",
  "invalid",
  "jobs",
  "live",
  "local",
  "mil",
  "mobi",
  "museum",
  "name",
  "net",
  "news",
  "online",
  "onion",
  "org",
  "pro",
  "site",
  "space",
  "tech",
  "tel",
  "test",
  "watch",
  "world",
  "xxx",
  "xyz"
]);
var INTERNATIONAL_HOST_SUFFIXES = [
  ".fao.org",
  ".gdacs.org",
  ".humdata.org",
  ".iaea.org",
  ".icao.int",
  ".iea.org",
  ".ilo.org",
  ".imf.org",
  ".opec.org",
  ".reliefweb.int",
  ".un.org",
  ".undp.org",
  ".unep.org",
  ".unhcr.org",
  ".who.int",
  ".worldbank.org",
  ".wto.org"
];
var HOST_ORIGINS = Object.freeze({
  // Editorial hosts used by site-scoped news searches. These are catalogued
  // as publishers in their own right; the shared search endpoint is a
  // separate provider.
  "36kr.com": "CN",
  "a16z.com": "US",
  "actuniger.com": "NE",
  "angellist.com": "US",
  "annahar.com": "LB",
  "apnews.com": "US",
  "arabianbusiness.com": "AE",
  "arabnews.com": "SA",
  "arctictoday.com": "US",
  "armenpress.am": "AM",
  "armscontrol.org": "US",
  "asia.nikkei.com": "JP",
  "ayibopost.com": "HT",
  "bangkokpost.com": "TH",
  "bellingcat.com": "NL",
  "bihus.info": "UA",
  "binance.com": null,
  "bloomberg.com": "US",
  "carnegieendowment.org": "US",
  "chathamhouse.org": "GB",
  "citinewsroom.com": "GH",
  "cnas.org": "US",
  "cnn.com": "US",
  "coinbase.com": "US",
  "cp24.com": "CA",
  "dhakatribune.com": "BD",
  "dlnews.com": "GB",
  "dw.com": "DE",
  "eff.org": "US",
  "english.alarabiya.net": "SA",
  "english.enabbaladi.net": "SY",
  "euractiv.com": "BE",
  "euromaidanpress.com": "UA",
  "fas.org": "US",
  "fxempire.com": "IL",
  "geo.tv": "PK",
  "gmfus.org": "US",
  "haaretz.com": "IL",
  "hiiraan.com": "CA",
  "interfax.com": "RU",
  "investing.com": "IL",
  "iranintl.com": "GB",
  "janes.com": "GB",
  "jin10.com": "CN",
  "kitco.com": "CA",
  "kyivindependent.com": "UA",
  "lorientlejour.com": "LB",
  "lowyinstitute.org": "AU",
  "madamasr.com": "EG",
  "marketwatch.com": "US",
  "messari.io": "US",
  "mining-journal.com": "GB",
  "miningweekly.com": "ZA",
  "montrealgazette.com": "CA",
  "nti.org": "US",
  "oecd.org": null,
  "oko.press": "PL",
  "oglobo.globo.com": "BR",
  "pajhwok.com": "AF",
  "prnewswire.com": "US",
  "renaissancecapital.com": "US",
  "reuters.com": "GB",
  "rferl.org": "US",
  "rudaw.net": "IQ",
  "rusi.org": "GB",
  "slidstvo.info": "UA",
  "spglobal.com": "US",
  "suspilne.media": "UA",
  "taipeitimes.com": "TW",
  "tass.com": "RU",
  "theblock.co": "US",
  "thebulletin.org": "US",
  "thedailystar.net": "BD",
  "theguardianpostcameroon.com": "CM",
  "theinformation.com": "US",
  "thejakartapost.com": "ID",
  "thenextweb.com": "NL",
  "tvp.info": "PL",
  "ukrinform.net": "UA",
  "understandingwar.org": "US",
  "wilsoncenter.org": "US",
  "wublockchain.com": "CN",
  "xinhuanet.com": "CN",
  "yemenonline.info": "YE",
  "zerkalo.io": "BY",
  "acleddata.com": "US",
  "adsb.lol": "NL",
  "api.adsb.lol": "NL",
  "aerotime.aero": "LT",
  "agentskills.io": "US",
  // Validated crisis-desk direct publishers (#6813-#6830).
  "airinfoagadez.com": "NE",
  "amu.tv": "AF",
  "efectococuyo.com": "VE",
  "havanatimes.org": "CU",
  "lefaso.net": "BF",
  "libyaherald.com": "LY",
  "nation.africa": "KE",
  "sanaacenter.org": "YE",
  "syriadirect.org": "SY",
  "tchadinfos.com": "TD",
  "www.14ymedio.com": "CU",
  "www.972mag.com": "IL",
  "www.alwihdainfo.com": "TD",
  "www.caracaschronicles.com": "VE",
  "www.egyptindependent.com": "EG",
  "www.haitilibre.com": "HT",
  "www.naharnet.com": "LB",
  "www.radiondekeluka.org": "CF",
  "www.studiotamani.org": "ML",
  "airlinegeeks.com": "US",
  "airplanes.live": null,
  "api.airplanes.live": null,
  "api.cloudflare.com": "US",
  "api.abuseipdb.com": "US",
  "api.alternative.me": null,
  "api.aviationstack.com": "GB",
  "api.coingecko.com": "MY",
  "api.coinpaprika.com": "PL",
  "api.elections.kalshi.com": "US",
  "api.exa.ai": "US",
  "api.firecrawl.dev": "US",
  "api.gdeltproject.org": "US",
  "api.github.com": null,
  "api.hyperliquid.xyz": "US",
  "api.openaq.org": "US",
  "api.opensanctions.org": "DE",
  "api.ossinsight.io": "CN",
  "api.planespotters.net": "DE",
  "api.rainviewer.com": "US",
  "api.safecast.org": "JP",
  "api.scrapecreators.com": "US",
  "api.search.brave.com": "US",
  "api.spdrgoldshares.com": "US",
  "api.stlouisfed.org": "US",
  "api.telegram.org": "AE",
  "api.travelpayouts.com": "CY",
  "api.tzevaadom.co.il": "IL",
  "api.waqi.info": "CN",
  "api.windy.com": "CZ",
  "api.x.com": "US",
  "archive-api.open-meteo.com": "DE",
  "asharq.com": "SA",
  "asharqbusiness.com": "SA",
  "astanatimes.com": "KZ",
  "atbackend.sipri.org": "SE",
  "auth.opensky-network.org": "CH",
  "azure.status.microsoft": "US",
  "balkaninsight.com": "BA",
  "bitcoinmagazine.com": "US",
  "bitbucket.status.atlassian.com": "AU",
  "bothsidesofthetable.com": "US",
  "breakingdefense.com": "US",
  "budgetlab.yale.edu": "US",
  "calgaryherald.com": "CA",
  "celestrak.org": "US",
  "chainwire.org": "US",
  "changelog.com": "US",
  "climate.copernicus.eu": "EU",
  "cointelegraph.com": "US",
  "collisionconf.com": "CA",
  "confluence.status.atlassian.com": "AU",
  "conservationoptimism.org": "GB",
  "contxto.com": "MX",
  "correctiv.org": "DE",
  "corridorrisk.io": null,
  "cryptoslate.com": "US",
  "customer-api.wingbits.com": "NO",
  "dailytrust.com": "NG",
  "decrypt.co": "US",
  "dev.events": "US",
  "dev.to": "US",
  "devops.com": "US",
  "dfrlab.org": "US",
  "discordstatus.com": "US",
  "disrupt-africa.com": "ZA",
  "e00-elmundo.uecdn.es": "ES",
  "earth-search.aws.element84.com": "US",
  "ecs-api.wingbits.com": "NO",
  "edmontonjournal.com": "CA",
  "en.mehrnews.com": "IR",
  "en.wikipedia.org": null,
  "eurasianet.org": null,
  "export.arxiv.org": "US",
  "feed.businesswire.com": "US",
  "feed.infoq.com": "US",
  "feeds.abcnews.com": "US",
  "feeds.arstechnica.com": "US",
  "feeds.content.dowjones.io": "US",
  "feeds.elpais.com": "ES",
  "feeds.feedburner.com": "US",
  "feeds.finra.org": "US",
  "feeds.folha.uol.com.br": "BR",
  "feeds.megaphone.fm": "US",
  "feeds.nbcnews.com": "US",
  "feeds.news24.com": "ZA",
  "feeds.npr.org": "US",
  "financialpost.com": "CA",
  "finnhub.io": "US",
  "foreignpolicy.com": "US",
  "fr.africanews.com": null,
  "freeipapi.com": null,
  "gain.nd.edu": "US",
  "gcaptain.com": "US",
  "gtaupdate.com": "CA",
  "geospatial-usace.opendata.arcgis.com": "US",
  "ghoapi.azureedge.net": null,
  "github.blog": null,
  "globalenergymonitor.org": "US",
  "globalinitiative.net": "CH",
  "goldsilverworlds.com": "BE",
  "gpsjam.org": "US",
  "greatergood.berkeley.edu": "US",
  "hacker-news.firebaseio.com": "US",
  "health.aws.amazon.com": "US",
  "hnrss.org": "US",
  "humanprogress.org": "US",
  "inc42.com": "IN",
  "indianexpress.com": "IN",
  "insideclimatenews.org": "US",
  "insightcrime.org": "US",
  "ipinfo.io": "US",
  "islandtimes.org": "PW",
  "jam-news.net": "GE",
  "jamestown.org": "US",
  "japantoday.com": "JP",
  "jira-software.status.atlassian.com": "AU",
  "kalshi.com": "US",
  "kr-asia.com": "SG",
  "krebsonsecurity.com": "US",
  "lavca.org": "US",
  "linearstatus.com": "US",
  // The Lobsters domain is a .rs domain hack; the publisher is operated from
  // Chicago, not Serbia.
  "lobste.rs": "US",
  "meduza.io": "RU",
  "mempool.space": null,
  "mexiconewsdaily.com": "MX",
  "moxie.foxbusiness.com": "US",
  "moxie.foxnews.com": "US",
  "mshibanami.github.io": "US",
  "nationalpost.com": "CA",
  "news.crunchbase.com": "US",
  "news.google.com": "US",
  "news.mit.edu": "US",
  "news.mongabay.com": "US",
  "news.ycombinator.com": "US",
  "nominatim.openstreetmap.org": null,
  "oauth.reddit.com": "US",
  "oc-media.org": "GE",
  "oilprice.com": "CA",
  "onemileatatime.com": "US",
  "opensky-network.org": "CH",
  "ottawacitizen.com": "CA",
  "otx.alienvault.com": "US",
  "outbreaknewstoday.com": "US",
  "ourworldindata.org": "GB",
  "owid-public.owid.io": "GB",
  "patents.google.com": "US",
  "phys.org": "GB",
  "pitchbook.com": "US",
  "polymarket.com": "US",
  "pro-api.coingecko.com": "MY",
  "production.dataviz.cnn.io": "US",
  "public.govdelivery.com": "US",
  "publicacionexterna.azurewebsites.net": "MX",
  "qevdnlpgjxpwusesmtpx.supabase.co": "US",
  "query.wikidata.org": null,
  "query1.finance.yahoo.com": "US",
  "railway.instatus.com": "US",
  "raw.githubusercontent.com": null,
  "reasonstobecheerful.world": "US",
  "responsiblestatecraft.org": "US",
  "restcountries.com": null,
  "review.firstround.com": "US",
  "rss.art19.com": "US",
  "rss.dw.com": "DE",
  "rss.libsyn.com": "US",
  "rss.politico.com": "US",
  "rsf.org": "FR",
  "schema.org": "US",
  "seekingalpha.com": "US",
  "serpapi.com": "US",
  "services.arcgis.com": "CA",
  "services7.arcgis.com": "US",
  "services9.arcgis.com": "US",
  "simpleflying.com": "GB",
  "singularityhub.com": "US",
  "slack-status.com": "US",
  "stats.bis.org": "CH",
  "status.circleci.com": "US",
  "status.claude.com": "US",
  "status.cloud.google.com": "US",
  "status.datadoghq.com": "US",
  "status.digitalocean.com": "US",
  "status.gitlab.com": "US",
  "status.npmjs.org": "US",
  "status.openai.com": "US",
  "status.render.com": "US",
  "status.sentry.io": "US",
  "status.stripe.com": "US",
  "status.supabase.com": "US",
  "status.twilio.com": "US",
  "storage.googleapis.com": "GB",
  "stratechery.com": "US",
  "taskandpurpose.com": "US",
  "tech.eu": "EU",
  "techcabal.com": "NG",
  "techcrunch.com": "US",
  "thebetterindia.com": "IN",
  "thedefiant.io": "US",
  "thediplomat.com": "US",
  "thehill.com": "US",
  "thenewstack.io": "US",
  "thepointsguy.com": "US",
  "theprovince.com": "CA",
  "thesentry.org": "US",
  "thinkglobalhealth.github.io": "US",
  "timesca.com": null,
  "timesofindia.indiatimes.com": "IN",
  "trumpstruth.org": "US",
  "unchainedcrypto.com": "US",
  "vancouversun.com": "CA",
  "venturebeat.com": "US",
  "viewfromthewing.com": "US",
  "vnexpress.net": "VN",
  "vsquare.org": "PL",
  "wabi-europe-north-b-api.analysis.windows.net": "US",
  "warontherocks.com": "US",
  "web.archive.org": "US",
  "websummit.com": "IE",
  "www.a16z.news": "US",
  "www.aaii.com": "US",
  "www.aaronsw.com": "US",
  "www.abc.net.au": "AU",
  "www.africanews.com": null,
  "www.aajtak.in": "IN",
  "www.alarabiya.net": "SA",
  "www.aljazeera.com": "QA",
  "www.aljazeera.net": "QA",
  "www.alphavantage.co": "US",
  "www.amarujala.com": "IN",
  "www.asahi.com": "JP",
  "www.atlanticcouncil.org": "US",
  "www.aviationpros.com": "US",
  "www.aviationweek.com": "US",
  "www.axios.com": "US",
  "api.axios.com": "US",
  "www.barchart.com": "US",
  "www.bbc.com": "GB",
  "www.businessinsider.com": "US",
  "www.carbonbrief.org": "GB",
  "www.cbinsights.com": "US",
  "www.cbsnews.com": "US",
  "www.channelnewsasia.com": "SG",
  "www.channelstv.com": "NG",
  "www.chosun.com": "KR",
  "www.clarin.com": "AR",
  "www.climatecentral.org": "US",
  "www.cloudflarestatus.com": "US",
  "www.cnbc.com": "US",
  "www.coindesk.com": "US",
  "www.crisisgroup.org": "BE",
  "www.csis.org": "US",
  "www.dabangasudan.org": "SD",
  "www.dailygood.org": "US",
  "www.dailysabah.com": "TR",
  "www.darkreading.com": "US",
  "www.dawn.com": "PK",
  "www.defensenews.com": "US",
  "www.defenseone.com": "US",
  "www.dockerstatus.com": "US",
  "www.eltiempo.com": "CO",
  "www.eluniverso.com": "EC",
  "www.engadget.com": "US",
  "www.ethiopia-insight.com": "ET",
  "www.eu-startups.com": "EU",
  "www.euronews.com": null,
  "de.euronews.com": null,
  "es.euronews.com": null,
  "fr.euronews.com": null,
  "gr.euronews.com": null,
  "it.euronews.com": null,
  "pt.euronews.com": null,
  "ru.euronews.com": null,
  "www.fatf-gafi.org": null,
  "www.flightglobal.com": "GB",
  "www.foreignaffairs.com": "US",
  "www.fpri.org": "US",
  "www.france24.com": "FR",
  "www.ft.com": "GB",
  "www.fwdstart.me": "US",
  "www.githubstatus.com": null,
  "www.gitex.com": "AE",
  "www.globenewswire.com": "US",
  "www.goldseek.com": "US",
  "www.good.is": "US",
  "www.goodgoodgood.co": "US",
  "www.goodnewsnetwork.org": "US",
  "www.google.com": "US",
  "www.handelsblatt.com": "DE",
  "www.handybulk.com": "GB",
  "www.iaea.org": null,
  "www.iea.org": null,
  "www.ifswf.org": null,
  "www.infobae.com": "AR",
  "www.irrawaddy.com": "MM",
  "www.jeuneafrique.com": "FR",
  "www.jodidata.org": null,
  "www.jpost.com": "IL",
  "www.lasillavacia.com": "CO",
  "www.ledevoir.com": "CA",
  "www.lennysnewsletter.com": "US",
  "www.lighthousereports.com": "NL",
  "www.livescience.com": "US",
  "www.militarytimes.com": "US",
  "www.mining.com": "CA",
  "www.mining-technology.com": "GB",
  "www.myjoyonline.com": "GH",
  "www.nature.com": "GB",
  "www.netlifystatus.com": "US",
  "www.newscientist.com": "GB",
  "www.newyorkfed.org": "US",
  "www.nfx.com": "US",
  "www.northernminer.com": "CA",
  "www.notion-status.com": "US",
  "www.occrp.org": null,
  "www.opec.org": null,
  "www.optimistdaily.com": "US",
  "www.oryxspioenkop.com": "NL",
  "www.pbs.org": "US",
  "www.pizzint.watch": "US",
  "www.positive.news": "GB",
  "www.premiumtimesng.com": "NG",
  "www.producthunt.com": "US",
  "www.radiookapi.net": "CD",
  "www.radiotamazuj.org": "SS",
  "www.rand.org": "US",
  "www.ransomware.live": "FR",
  "www.rappler.com": "PH",
  "www.reddit.com": "US",
  "www.replicatestatus.com": "US",
  "www.rigzone.com": "US",
  "www.rt.com": "RU",
  "www.saastr.com": "US",
  "www.schneier.com": "US",
  "www.sciencedaily.com": "US",
  "www.scmp.com": "HK",
  "www.semianalysis.com": "US",
  "www.sequoiacap.com": "US",
  "www.shareable.net": "US",
  "www.silverseek.com": "US",
  "www.spdrgoldshares.com": "US",
  "www.stimson.org": "US",
  "www.submarinecablemap.com": "US",
  "www.sunnyskyz.com": "US",
  "www.swfinstitute.org": "US",
  "www.techinasia.com": "SG",
  "www.techmeme.com": "US",
  "www.techstars.com": "US",
  "www.technologyreview.com": "US",
  "www.theglobeandmail.com": "CA",
  "www.theguardian.com": "GB",
  "www.thehindu.com": "IN",
  "www.themoscowtimes.com": "RU",
  "www.thenationalnews.com": "AE",
  "www.thereporterethiopia.com": "ET",
  "www.thestar.com": "CA",
  "www.theverge.com": "US",
  "www.thisdaylive.com": "NG",
  "www.token2049.com": "SG",
  "www.tomshardware.com": "US",
  "www.twz.com": "US",
  "www.upworthy.com": "US",
  "www.vanguardngr.com": "NG",
  "www.vercel-status.com": "US",
  "www.visionofhumanity.org": "AU",
  "www.windy.com": "CZ",
  "www.winnipegfreepress.com": "CA",
  "www.wired.com": "US",
  "www.ycombinator.com": "US",
  "www.yesmagazine.org": "US",
  "www.ynetnews.com": "IL",
  "www.zdnet.com": "US",
  "www.zoomstatus.com": "US",
  "arxiv.org": "US",
  "fc.yahoo.com": "US",
  "finance.yahoo.com": "US",
  "news.usni.org": "US",
  "sifted.eu": "EU",
  "your-app.convex.site": "US",
  "yourstory.com": "IN",
  "gamma-api.polymarket.com": "US",
  "noaadata.apps.nsidc.org": "US"
});
var PROVIDER_ORIGINS = Object.freeze({
  "B.C. Evacuation Orders and Alerts": "CA",
  "Toronto Police Service": "CA",
  "Toronto Police Service Open Data": "CA",
  "GTA Update": "CA",
  "Ember electricity data": "GB",
  "Fast Company": "US",
  "Mexico Energy Regulatory Commission (CRE)": "MX",
  NDTV: "IN",
  "Our World in Data": "GB",
  "The Hacker News": "IN",
  "World Health Organization (WHO)": null
});
function normalizeHost(host) {
  return String(host || "").trim().toLowerCase();
}
function hasOwn(map, key) {
  return Object.prototype.hasOwnProperty.call(map, key);
}
function inferOriginFromHost(host) {
  const lower = normalizeHost(host);
  if (!lower) return void 0;
  if (lower.endsWith(".usembassy.gov") || lower.endsWith(".gov") || lower.endsWith(".mil") || lower.endsWith(".fed.us")) {
    return "US";
  }
  if (lower.endsWith(".edu")) return "US";
  if (/\.(?:gov|service\.gov)\.uk$/.test(lower) || lower.endsWith(".ac.uk") || lower.endsWith(".co.uk") || lower.endsWith(".org.uk")) {
    return "GB";
  }
  if (lower.endsWith(".gov.au") || lower.endsWith(".net.au") || lower.endsWith(".com.au") || lower.endsWith(".org.au") || lower.endsWith(".edu.au")) {
    return "AU";
  }
  if (lower.endsWith(".gc.ca") || lower.endsWith(".canada.ca") || lower.endsWith(".statcan.gc.ca")) {
    return "CA";
  }
  if (lower.endsWith(".gov.cn") || lower.endsWith(".com.cn") || lower.endsWith(".net.cn") || lower.endsWith(".org.cn") || lower.endsWith(".edu.cn") || lower.endsWith(".ac.cn")) {
    return "CN";
  }
  if (lower.endsWith(".gov.tw")) return "TW";
  if (lower.endsWith(".gov.hk")) return "HK";
  if (lower.endsWith(".gov.my")) return "MY";
  if (lower.endsWith(".gob.mx")) return "MX";
  if (lower.endsWith(".gob.es")) return "ES";
  if (lower.endsWith(".govt.nz") || lower.endsWith(".co.nz")) return "NZ";
  if (lower.endsWith(".gov.br") || lower.endsWith(".com.br")) return "BR";
  if (lower.endsWith(".europa.eu")) return "EU";
  if (lower.endsWith(".gov.il") || lower.endsWith(".co.il")) return "IL";
  if (lower.endsWith(".co.kr") || lower.endsWith(".go.kr")) return "KR";
  if (lower.endsWith(".com.tr")) return "TR";
  if (INTERNATIONAL_HOST_SUFFIXES.some((suffix) => lower === suffix.slice(1) || lower.endsWith(suffix)) || lower.endsWith(".int")) {
    return null;
  }
  const tld = lower.split(".").at(-1);
  if (!tld || GENERIC_TLDS.has(tld) || VANITY_CC_TLDS.has(tld)) return void 0;
  if (tld === "uk") return "GB";
  if (tld === "eu") return "EU";
  const iso2 = tld.toUpperCase();
  return ISO2_CODES.has(iso2) ? iso2 : void 0;
}
function resolveHostOrigin(host) {
  const lower = normalizeHost(host);
  if (hasOwn(HOST_ORIGINS, lower)) return HOST_ORIGINS[lower];
  const wwwAlias = lower.startsWith("www.") ? lower.slice(4) : `www.${lower}`;
  if (hasOwn(HOST_ORIGINS, wwwAlias)) return HOST_ORIGINS[wwwAlias];
  return inferOriginFromHost(lower);
}
function resolveSourceOrigin({ provider, hosts = [] } = {}) {
  if (hasOwn(PROVIDER_ORIGINS, provider)) return PROVIDER_ORIGINS[provider];
  const resolved = (hosts.length > 0 ? hosts : [provider]).map((host) => resolveHostOrigin(host));
  const missing = resolved.some((code2) => code2 === void 0);
  if (missing) {
    throw new Error(`Source provider needs a catalog origin country: ${provider}`);
  }
  const unique = new Set(resolved.map((code2) => code2 ?? INTERNATIONAL_FILTER));
  if (unique.size !== 1) {
    throw new Error(`Source provider has conflicting origin countries: ${provider}`);
  }
  const code = [...unique][0];
  return code === INTERNATIONAL_FILTER ? null : code;
}
var ORIGIN_LABEL_OVERRIDES = Object.freeze({
  EU: "European Union",
  HK: "Hong Kong"
});
function sourceOriginLabel(code) {
  if (!code) return "International";
  if (hasOwn(ORIGIN_LABEL_OVERRIDES, code)) return ORIGIN_LABEL_OVERRIDES[code];
  return REGION_NAMES.of(code) || code;
}
function sourceOriginFilterValue(code) {
  return (code || INTERNATIONAL_FILTER).toLowerCase();
}
function assertKnownOriginCode(code, label) {
  if (code == null) return;
  if (!ISO2_CODES.has(code)) {
    throw new Error(`${label} uses unknown origin country "${code}"`);
  }
}
for (const [host, code] of Object.entries(HOST_ORIGINS)) {
  assertKnownOriginCode(code, `source-origin host ${host}`);
}
for (const [provider, code] of Object.entries(PROVIDER_ORIGINS)) {
  assertKnownOriginCode(code, `source-origin provider ${provider}`);
}

// api/mcp/filters.ts
function argNum(v) {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}
function argStr(v) {
  return typeof v === "string" ? v.toLowerCase().trim() : "";
}
function ciIncludes(hay, needle) {
  return typeof hay === "string" && hay.toLowerCase().includes(needle);
}

// api/mcp/registry/source-tools.ts
var MANIFEST_ENTRIES = source_attribution_manifest_default.entries;
var ACTIVE_PROVIDERS = MANIFEST_ENTRIES.filter((entry) => entry.observed === true && entry.catalogActive !== false && (entry.status === "reviewed" || entry.status === "terms-review"));
var EXCLUDED_COUNT = MANIFEST_ENTRIES.filter((entry) => entry.status === "excluded").length;
var PROVIDER_HOSTS = /* @__PURE__ */ new Map();
for (const entry of ACTIVE_PROVIDERS) {
  const provider = entry.provider || entry.host;
  const hosts = PROVIDER_HOSTS.get(provider) || [];
  if (!hosts.includes(entry.host)) hosts.push(entry.host);
  PROVIDER_HOSTS.set(provider, hosts);
}
var PROVIDER_ORIGINS2 = /* @__PURE__ */ new Map();
for (const [provider, hosts] of PROVIDER_HOSTS) {
  PROVIDER_ORIGINS2.set(provider, resolveSourceOrigin({ provider, hosts }));
}
function providerOrigin(entry) {
  const provider = entry.provider || entry.host;
  const origin = PROVIDER_ORIGINS2.get(provider);
  if (origin === void 0 && !PROVIDER_ORIGINS2.has(provider)) {
    throw new Error(`Missing publisher origin for provider: ${provider}`);
  }
  return origin ?? null;
}
var SOURCE_VIEWS = ["summary", "providers", "outlets"];
var SOURCE_PLATFORMS = ["telegram"];
var DEFAULT_ROW_LIMIT = 50;
var MAX_ROW_LIMIT = 200;
var PLATFORM_IDENTITIES_BY_SOURCE = /* @__PURE__ */ new Map();
for (const entry of TELEGRAM_CHANNEL_TRUST) {
  const identities = PLATFORM_IDENTITIES_BY_SOURCE.get(entry.name) || [];
  identities.push({ platform: "telegram", handle: entry.handle });
  PLATFORM_IDENTITIES_BY_SOURCE.set(entry.name, identities);
}
function resolveRowLimit(value) {
  if (value === void 0) return { limit: DEFAULT_ROW_LIMIT };
  const parsed = typeof value === "string" && /^\d+$/.test(value.trim()) ? Number(value.trim()) : value;
  if (typeof parsed !== "number" || !Number.isSafeInteger(parsed) || parsed < 1) {
    return { error: "limit must be an integer of at least 1" };
  }
  return { limit: Math.min(parsed, MAX_ROW_LIMIT) };
}
function tally(values) {
  const out = {};
  for (const v of values) {
    const key = v || "unknown";
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}
function outletRecord(name) {
  const raw = SOURCE_TIERS[name];
  const tier = typeof raw === "number" ? raw : null;
  const platformIdentities = PLATFORM_IDENTITIES_BY_SOURCE.get(name);
  return {
    name,
    tier,
    provenance: getSourceProvenanceState(name),
    ...platformIdentities ? { platformIdentities } : {}
  };
}
var SOURCE_TOOLS = [
  {
    name: "get_sources",
    _outputBudgetBytes: 65536,
    // U7 roster (R7). The selection criterion is cheap to serve, cacheable,
    // low value to bulk-scrape, AND reliably fresh. This tool satisfies all
    // four trivially: it is a committed-registry read with no network call, no
    // cache, and therefore no staleness mode at all — a data tool whose seed
    // runs late would hand an uncredentialed caller an empty envelope, which
    // reads as a dead server and defeats the point of having a free tier.
    //
    // The roster is deliberately one tool. Widening it needs per-tool
    // freshness evidence from production, not an assumption; the mechanism is
    // generic, so adding a screened tool later is this one line.
    _freeTier: true,
    description: "WorldMonitor's live source inventory, for deciding whether and how far to trust what the other tools return. Two separate populations: `providers` are upstream hosts data is fetched from (with licence and attribution status), and `outlets` are named public source identities carrying an editorial tier plus propaganda-risk and source-type provenance. Platform channels include stable platform identities instead of pretending every source is a newsroom masthead. Defaults to `summary` (counts only); pass a view to enumerate. Static registry read \u2014 no network, no cache, always current with the deployed build.",
    inputSchema: {
      type: "object",
      properties: {
        view: {
          type: "string",
          enum: [...SOURCE_VIEWS],
          description: "summary (default) returns counts only and is small. providers enumerates upstream hosts; outlets enumerates named public source identities with tier and provenance."
        },
        kind: { type: "string", description: "providers view only: restrict to one kind \u2014 feed, structured, feed+structured, or operational-status." },
        country: { type: "string", description: "providers view only: restrict by publisher origin using a two-letter country code or intl for international sources. Case-insensitive." },
        tier: { type: "integer", minimum: 1, maximum: 4, description: "outlets view only: restrict to one editorial tier. 1 is a wire or primary outlet. Outlets with no declared tier are never returned by this filter, because their tier is unknown rather than 4." },
        risk: { type: "string", enum: ["low", "medium", "high", "unknown"], description: "outlets view only: restrict to one declared propaganda-risk band." },
        platform: { type: "string", enum: [...SOURCE_PLATFORMS], description: "outlets view only: restrict to source identities configured on a platform such as telegram." },
        query: { type: "string", description: "Case-insensitive substring match \u2014 against host and provider in the providers view, against outlet name in the outlets view. Applied before limit." },
        limit: { type: "integer", minimum: 1, maximum: MAX_ROW_LIMIT, description: `Maximum rows in an enumerated view. Defaults to ${DEFAULT_ROW_LIMIT}, capped at ${MAX_ROW_LIMIT}. Ignored by the summary view. The full provider inventory does not fit one response, so a truncated result sets returned < matched.` }
      },
      required: []
    },
    outputSchema: {
      type: "object",
      required: ["view", "summary"],
      properties: {
        view: { type: "string", enum: [...SOURCE_VIEWS] },
        summary: {
          type: "object",
          description: "Always present, in every view, so counts are available without a second call.",
          required: ["providerCount", "outletCount", "excludedProviderCount", "providersByCountry"],
          properties: {
            providerCount: { type: "number", description: "Active upstream hosts. Excludes the excluded-status rows counted separately." },
            excludedProviderCount: { type: "number", description: "Manifest rows deliberately excluded from the provider count (local transports and development-only URLs). Reported rather than silently dropped." },
            outletCount: { type: "number", description: "Named news organisations carrying a declared editorial tier." },
            providersByKind: { type: "object", description: "Active provider counts keyed by kind." },
            providersByStatus: { type: "object", description: "Active provider counts keyed by attribution-review status." },
            providersByCountry: { type: "object", description: "Active provider counts keyed by the lowercase country filter value, including intl." },
            outletsByTier: { type: "object", description: "Outlet counts keyed by declared tier." },
            outletsByRisk: { type: "object", description: "Outlet counts keyed by propaganda-risk band." },
            outletsByPlatform: { type: "object", description: "Outlet counts keyed by an explicitly configured platform identity." }
          }
        },
        providers: {
          type: "array",
          description: "Present only in the providers view.",
          items: {
            type: "object",
            required: ["host", "provider", "originCountry", "originLabel"],
            properties: {
              host: { type: "string" },
              provider: { type: "string" },
              kind: { type: "string" },
              status: { type: "string" },
              license: { type: "string" },
              originCountry: { type: ["string", "null"], description: "Publisher-origin ISO 3166-1 alpha-2 code, or null for international sources." },
              originLabel: { type: "string", description: "Human-readable publisher-origin label." }
            }
          }
        },
        outlets: {
          type: "array",
          description: "Present only in the outlets view.",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              tier: { type: ["number", "null"], description: "Declared editorial tier, or null when WorldMonitor has not declared one. Never defaulted to a number." },
              provenance: { type: "object", description: "Same provenance shape the news tools attach to stories." },
              platformIdentities: {
                type: "array",
                description: "Stable platform-specific identities for this source, when configured.",
                items: {
                  type: "object",
                  required: ["platform", "handle"],
                  properties: {
                    platform: { type: "string", enum: [...SOURCE_PLATFORMS] },
                    handle: { type: "string" }
                  }
                }
              }
            }
          }
        },
        matched: { type: "number", description: "Rows matching the filters before the limit was applied. Present in enumerated views." },
        returned: { type: "number", description: "Rows actually returned. Less than matched means the limit truncated the result." },
        error: { type: "string", description: "Present when input validation fails. Required summary counts remain available." }
      }
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    _execute: async (params) => {
      const view = argStr(params.view) || "summary";
      const outletNames = Object.keys(SOURCE_TIERS);
      const summary = {
        providerCount: ACTIVE_PROVIDERS.length,
        excludedProviderCount: EXCLUDED_COUNT,
        outletCount: outletNames.length,
        providersByKind: tally(ACTIVE_PROVIDERS.map((e) => e.kind)),
        providersByStatus: tally(ACTIVE_PROVIDERS.map((e) => e.status)),
        providersByCountry: tally(ACTIVE_PROVIDERS.map((e) => sourceOriginFilterValue(providerOrigin(e)))),
        outletsByTier: tally(outletNames.map((n) => String(SOURCE_TIERS[n]))),
        outletsByRisk: tally(outletNames.map((n) => getSourceProvenanceState(n).risk)),
        outletsByPlatform: tally(
          outletNames.flatMap((name) => PLATFORM_IDENTITIES_BY_SOURCE.get(name)?.map((identity) => identity.platform) || [])
        )
      };
      if (!SOURCE_VIEWS.includes(view)) {
        return { view: "summary", summary, error: `view must be one of: ${SOURCE_VIEWS.join(", ")}` };
      }
      if (view === "summary") return { view, summary };
      const query = argStr(params.query);
      const resolvedLimit = resolveRowLimit(params.limit);
      if ("error" in resolvedLimit) return { view, summary, error: resolvedLimit.error };
      const { limit } = resolvedLimit;
      if (view === "providers") {
        const kind = argStr(params.kind);
        const country = argStr(params.country)?.toLowerCase();
        if (country && !(country in summary.providersByCountry)) {
          return {
            view,
            summary,
            error: `country must be one of: ${Object.keys(summary.providersByCountry).sort().join(", ")}`
          };
        }
        const matches2 = ACTIVE_PROVIDERS.filter((e) => (!kind || argStr(e.kind) === kind) && (!country || sourceOriginFilterValue(providerOrigin(e)) === country) && (!query || ciIncludes(e.host, query) || ciIncludes(e.provider, query)));
        const providers = matches2.slice(0, limit).map((e) => {
          const originCountry = providerOrigin(e);
          return {
            host: e.host,
            provider: e.provider || e.host,
            kind: e.kind,
            status: e.status,
            license: e.license,
            originCountry,
            originLabel: sourceOriginLabel(originCountry)
          };
        });
        return {
          view,
          summary,
          matched: matches2.length,
          returned: providers.length,
          providers
        };
      }
      const tier = argNum(params.tier);
      const risk = argStr(params.risk);
      const platform = argStr(params.platform);
      const matches = outletNames.map(outletRecord).filter((o) => (tier === null || o.tier === tier) && (!risk || o.provenance.risk === risk) && (!platform || o.platformIdentities?.some((identity) => identity.platform === platform)) && (!query || ciIncludes(o.name, query)));
      const outlets = matches.slice(0, limit);
      return {
        view,
        summary,
        matched: matches.length,
        returned: outlets.length,
        outlets
      };
    },
    // Static registry read — no HTTP endpoint. Same shape as get_commodity_geo,
    // which the RpcToolDef contract names as the valid empty-_apiPaths case.
    _apiPaths: []
  }
];
export {
  SOURCE_TOOLS,
  outletRecord
};
