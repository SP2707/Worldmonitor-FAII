export const CATEGORY_SLUGS: string[];
export function normCountry(s: unknown): string | null;
export function queryDivisions(payloads: Record<string, any>, q?: { country?: string; divisionId?: string; categories?: string[]; metrics?: string[]; limit?: number }): Record<string, any>;
export function queryCoverage(payloads: Record<string, any>, q?: { country?: string }): Record<string, any>;
export function queryNational(national: any, q?: { countries?: string[]; metrics?: string[] }): Record<string, any>;
