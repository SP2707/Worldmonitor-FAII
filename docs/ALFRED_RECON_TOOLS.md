# Recommended MCP tool subset for Alfred's Recon lane

The server registers ~70 tools (`api/mcp/registry/`). Exposing all of them to
an LLM wastes context and invites wrong-tool calls. This is a suggested
starting subset, chosen by name and purpose from the registry. It is a
recommendation, not something measured against Alfred.

Cache-backed tools return `-32003` until their data has been seeded
(see `/api/seed-status`). That means "works, not seeded yet", not "broken".

## Core (start here)

| Tool | Why |
|---|---|
| `get_news_intelligence` | Top stories with `credibilityScore` and `claimVerification`. Check `claimVerification.evidenceBased`: if false, the verdict rests on model knowledge alone and confidence is capped at 0.6. |
| `get_news_clusters` | Corroboration across outlets |
| `get_world_brief` | Cross-domain summary |
| `get_country_brief`, `get_country_risk` | Per-country context |
| `get_conflict_events` | Armed conflict events |
| `get_military_posture`, `get_military_surge` | Force movements |
| `get_sanctions_data` | Sanctions |
| `get_chokepoint_status`, `get_maritime_activity` | Shipping / chokepoints |
| `get_energy_intelligence`, `get_economic_data`, `get_market_data` | Economic levers |
| `get_cyber_threats` | Cyber |
| `get_signal_convergence`, `get_focal_points`, `get_hotspot_escalation` | Early-warning synthesis |
| `search_intel_history` | Past-event lookup |
| `describe_tool` | Lets the agent read a tool's schema on demand |

## Add later, by need

`get_supply_chain_data`, `get_commodity_geo`, `get_defense_industrial_base`, `get_china_decision_signals`, `get_prediction_markets`, `get_forecast_predictions`, `generate_forecasts`, `render_map` (offline map, drawn inline in chat; see docs/MAP.md), `get_natural_disasters`, `get_displacement_data`, `analyze_situation`, `extract_entities`, `classify_event`.

## Probably leave out for Recon

`search_flights`, `search_flight_prices_by_date`, `get_toronto_*`, `get_positive_events`, `get_eu_*` (housing, industrial production, quarterly debt), `get_consumer_prices`, `get_demographics_capability`, `list_x_feed`. Niche or off-mission for strategic recon.

## Wiring

Point Alfred's tool manager at `POST http://127.0.0.1:46123/api/mcp` with
`Authorization: Bearer <LOCAL_API_TOKEN>` and allow-list the tool names above
on Alfred's side (the server itself exposes everything). Acceptance test: ask
Alfred one real Recon question that needs `get_news_intelligence`, and confirm
`claimVerification` comes back non-null after a seed + verification run.
