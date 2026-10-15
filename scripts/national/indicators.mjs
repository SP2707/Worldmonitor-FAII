// National-level indicators for every country, from the World Bank Indicators API (open, no key). Grouped by the same ten
// categories as the subnational layer so the two can be compared. All values are NATIONAL; nothing here is subnational.
// Indicator codes for the first 24 are already used by the subnational seeders; the others (marked +) are standard WDI
// codes that this fork has not queried before - an invalid code is reported as an error for that indicator, never guessed.
export const CATEGORY_ORDER = Object.freeze(['grp', 'fiscal', 'population', 'infrastructure', 'energy', 'hdi', 'patents', 'rule-of-law', 'fdi', 'military']);

export const INDICATORS = Object.freeze({
  grp: [
    ['gdp_usd', 'NY.GDP.MKTP.CD', 'USD'], ['gdp_per_capita_usd', 'NY.GDP.PCAP.CD', 'USD'],
    ['gdp_growth_pct', 'NY.GDP.MKTP.KD.ZG', '% annual'], // +
  ],
  fiscal: [
    ['govt_revenue_pct_gdp', 'GC.REV.XGRT.GD.ZS', '% of GDP'], ['tax_revenue_pct_gdp', 'GC.TAX.TOTL.GD.ZS', '% of GDP'],
    ['govt_expense_pct_gdp', 'GC.XPN.TOTL.GD.ZS', '% of GDP'],
  ],
  population: [
    ['population', 'SP.POP.TOTL', 'persons'], ['working_age_share', 'SP.POP.1564.TO.ZS', '% of total'],
    ['elderly_share', 'SP.POP.65UP.TO.ZS', '% of total'], ['age_dependency_ratio', 'SP.POP.DPND', 'per 100 working-age'],
    ['fertility_rate', 'SP.DYN.TFRT.IN', 'births per woman'],
  ],
  infrastructure: [ // all +
    ['electricity_access_pct', 'EG.ELC.ACCS.ZS', '% of population'], ['internet_users_pct', 'IT.NET.USER.ZS', '% of population'],
    ['air_passengers', 'IS.AIR.PSGR', 'passengers carried'], ['rail_lines_km', 'IS.RRS.TOTL.KM', 'route-km'],
    ['logistics_performance_index', 'LP.LPI.OVRL.XQ', '1-5 score'],
  ],
  energy: [
    ['energy_imports_net_pct_use', 'EG.IMP.CONS.ZS', '% of energy use'], ['energy_use_per_capita', 'EG.USE.PCAP.KG.OE', 'kg oil eq.'],
    ['renewable_electricity_pct', 'EG.ELC.RNEW.ZS', '% of electricity output'], ['electric_consumption_per_capita', 'EG.USE.ELEC.KH.PC', 'kWh'],
  ],
  hdi: [
    ['life_expectancy', 'SP.DYN.LE00.IN', 'years'], ['gni_per_capita_ppp', 'NY.GNP.PCAP.PP.CD', 'intl $'],
    ['school_enrollment_tertiary', 'SE.TER.ENRR', '% gross'], ['human_capital_index', 'HD.HCI.OVRL', '0-1 index'], // HCI +
  ],
  patents: [
    ['patent_applications_residents', 'IP.PAT.RESD', 'applications'], ['patent_applications_nonresidents', 'IP.PAT.NRES', 'applications'],
    ['rnd_pct_gdp', 'GB.XPD.RSDV.GD.ZS', '% of GDP'], ['hightech_exports_pct', 'TX.VAL.TECH.MF.ZS', '% of manufactured exports'],
  ],
  'rule-of-law': [
    ['rule_of_law_estimate', 'GOV_WGI_RL.EST', 'z-score'], ['political_stability_estimate', 'GOV_WGI_PV.EST', 'z-score'],
    ['control_of_corruption_estimate', 'GOV_WGI_CC.EST', 'z-score'], ['govt_effectiveness_estimate', 'GOV_WGI_GE.EST', 'z-score'],
    ['homicide_rate', 'VC.IHR.PSRC.P5', 'per 100k'],
  ],
  fdi: [['fdi_net_inflow_usd', 'BX.KLT.DINV.CD.WD', 'USD'], ['fdi_net_inflow_pct_gdp', 'BX.KLT.DINV.WD.GD.ZS', '% of GDP']],
  military: [
    ['military_spend_pct_gdp', 'MS.MIL.XPND.GD.ZS', '% of GDP'], ['military_spend_usd', 'MS.MIL.XPND.CD', 'USD'],
    ['armed_forces_personnel', 'MS.MIL.TOTL.P1', 'persons'],
  ],
});
export const ALL = Object.freeze(CATEGORY_ORDER.flatMap((cat) => INDICATORS[cat].map(([metric, code, unit]) => ({ cat, metric, code, unit }))));
