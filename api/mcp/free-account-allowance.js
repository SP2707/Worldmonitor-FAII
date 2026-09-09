// server/_shared/client-ip.ts
var CLOUDFLARE_IPV4_CIDRS = Object.freeze([
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22"
]);
var CLOUDFLARE_IPV6_CIDRS = Object.freeze([
  "2400:cb00::/32",
  "2606:4700::/32",
  "2803:f800::/32",
  "2405:b500::/32",
  "2405:8100::/32",
  "2a06:98c0::/29",
  "2c0f:f248::/32"
]);
function parseIpv4(value) {
  const parts = value.split(".");
  if (parts.length !== 4) return null;
  let address = 0;
  for (const part of parts) {
    if (!/^(?:0|[1-9]\d{0,2})$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    address = address * 256 + octet;
  }
  return address >>> 0;
}
function parseIpv6(value) {
  if (!value || value.includes(".") || value.includes("%")) return null;
  const halves = value.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  if (halves.length === 1 && head.length !== 8) return null;
  if (halves.length === 2 && head.length + tail.length >= 8) return null;
  const groups = halves.length === 2 ? [...head, ...Array(8 - head.length - tail.length).fill("0"), ...tail] : head;
  if (groups.some((group) => !/^[0-9a-f]{1,4}$/i.test(group))) return null;
  return groups.map((group) => Number.parseInt(group, 16));
}
function parseIpv4Cidr(cidr) {
  const [networkText = "", prefixText = ""] = cidr.split("/");
  const network = parseIpv4(networkText);
  if (network === null) throw new Error(`Invalid Cloudflare IPv4 CIDR: ${cidr}`);
  return [network, Number(prefixText)];
}
function parseIpv6Cidr(cidr) {
  const [networkText = "", prefixText = ""] = cidr.split("/");
  const network = parseIpv6(networkText);
  if (network === null) throw new Error(`Invalid Cloudflare IPv6 CIDR: ${cidr}`);
  return [network, Number(prefixText)];
}
var CLOUDFLARE_IPV4_RANGES = Object.freeze(CLOUDFLARE_IPV4_CIDRS.map(parseIpv4Cidr));
var CLOUDFLARE_IPV6_RANGES = Object.freeze(CLOUDFLARE_IPV6_CIDRS.map(parseIpv6Cidr));

// server/_shared/usage.ts
var AXIOM_DATASET = "wm_api_usage";
var AXIOM_INGEST_URL = `https://api.axiom.co/v1/datasets/${AXIOM_DATASET}/ingest`;
var CB_WINDOW_MS = 5 * 60 * 1e3;

// server/_shared/redis.ts
function parseTimeoutEnv(raw, defaultMs) {
  const parsed = Number.parseInt(raw ?? "", 10);
  return parsed > 0 ? parsed : defaultMs;
}
var REDIS_OP_TIMEOUT_MS = parseTimeoutEnv(process.env.REDIS_OP_TIMEOUT_MS, 1500);
var REDIS_PIPELINE_TIMEOUT_MS = parseTimeoutEnv(process.env.REDIS_PIPELINE_TIMEOUT_MS, 5e3);

// server/_shared/pro-mcp-token.ts
function envPrefix() {
  const env = process.env.VERCEL_ENV;
  if (!env || env === "production") return "";
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || "dev";
  return `${env}:${sha}:`;
}

// api/mcp/upgrade-constants.ts
var FREE_ACCOUNT_CALLS_PER_DAY = 5;
var FREE_ACCOUNT_REQUESTS_PER_DAY = 3;
var FREE_ACCOUNT_IDLE_GAP_MS = 15 * 60 * 1e3;

// api/mcp/free-account-allowance.ts
function utcDayKey(nowMs) {
  return new Date(nowMs).toISOString().slice(0, 10);
}
function freeAccountCallsKey(userId, nowMs) {
  return `${envPrefix()}mcp:free-acct:calls:${userId}:${utcDayKey(nowMs)}`;
}
function freeAccountRequestsKey(userId, nowMs) {
  return `${envPrefix()}mcp:free-acct:reqs:${userId}:${utcDayKey(nowMs)}`;
}
function freeAccountLastActivityKey(userId, nowMs) {
  return `${envPrefix()}mcp:free-acct:last:${userId}:${utcDayKey(nowMs)}`;
}
function dayTtlSeconds(nowMs) {
  const d = new Date(nowMs);
  const dayStart = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const endOfDay = dayStart + 24 * 60 * 60 * 1e3;
  return Math.max(60, Math.ceil((endOfDay - nowMs) / 1e3) + 3600);
}
function asFiniteNumber(raw) {
  if (typeof raw !== "number" && typeof raw !== "string") return null;
  if (typeof raw === "string" && raw.trim() === "") return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}
var RESERVE_FREE_ACCOUNT_ALLOWANCE_SCRIPT = `
local function non_negative_integer(raw)
  if raw == false or raw == nil then return 0 end
  local value = tonumber(raw)
  if value == nil or value < 0 or value ~= math.floor(value) then return nil end
  return value
end

local calls_raw = redis.call('GET', KEYS[1])
local requests_raw = redis.call('GET', KEYS[2])
local last_raw = redis.call('GET', KEYS[3])
local calls = non_negative_integer(calls_raw)
local requests = non_negative_integer(requests_raw)
local last = nil
if last_raw ~= false and last_raw ~= nil then
  last = non_negative_integer(last_raw)
end
local calls_missing = calls_raw == false or calls_raw == nil
local requests_missing = requests_raw == false or requests_raw == nil
local last_present = last_raw ~= false and last_raw ~= nil
if calls == nil or requests == nil or (last_present and last == nil) then
  return {-1}
end
if calls_missing ~= requests_missing or requests > calls or (last_present and calls == 0) then
  return {-1}
end

local now_ms = tonumber(ARGV[1])
local idle_gap_ms = tonumber(ARGV[2])
local calls_limit = tonumber(ARGV[3])
local requests_limit = tonumber(ARGV[4])
local opens_window = last == nil or now_ms - last >= idle_gap_ms
local activity_value = ARGV[1]
if last ~= nil and last > now_ms then activity_value = last_raw end

if calls >= calls_limit then return {0} end
if opens_window and requests >= requests_limit then return {0} end

calls = calls + 1
if opens_window then requests = requests + 1 end
redis.call('SET', KEYS[1], tostring(calls), 'EX', ARGV[5])
if opens_window then
  redis.call('SET', KEYS[2], tostring(requests), 'EX', ARGV[5])
end
redis.call('SET', KEYS[3], activity_value, 'PX', ARGV[2])
return {1}
`;
function validLimit(value) {
  return Number.isSafeInteger(value) && value >= 0;
}
async function reserveFreeAccountAllowance(userId, pipeline, nowMs = Date.now(), opts) {
  if (!userId || typeof userId !== "string" || !Number.isSafeInteger(nowMs) || nowMs < 0) {
    return { ok: false, reason: "redis-unavailable" };
  }
  const callsLimit = opts?.callsPerDay ?? FREE_ACCOUNT_CALLS_PER_DAY;
  const requestsLimit = opts?.requestsPerDay ?? FREE_ACCOUNT_REQUESTS_PER_DAY;
  const idleGapMs = opts?.idleGapMs ?? FREE_ACCOUNT_IDLE_GAP_MS;
  if (!validLimit(callsLimit) || !validLimit(requestsLimit) || !Number.isSafeInteger(idleGapMs) || idleGapMs < 1) {
    return { ok: false, reason: "redis-unavailable" };
  }
  const callsKey = freeAccountCallsKey(userId, nowMs);
  const reqsKey = freeAccountRequestsKey(userId, nowMs);
  const lastKey = freeAccountLastActivityKey(userId, nowMs);
  const ttl = dayTtlSeconds(nowMs);
  let response = null;
  try {
    response = await pipeline([[
      "EVAL",
      RESERVE_FREE_ACCOUNT_ALLOWANCE_SCRIPT,
      3,
      callsKey,
      reqsKey,
      lastKey,
      nowMs,
      idleGapMs,
      callsLimit,
      requestsLimit,
      ttl
    ]]);
  } catch {
    response = null;
  }
  const entry = response?.[0];
  if (!response || response.length !== 1 || !entry || entry.error !== void 0 && entry.error !== null || !Array.isArray(entry.result)) {
    return { ok: false, reason: "redis-unavailable" };
  }
  const status = asFiniteNumber(entry.result[0]);
  if (status === 1) return { ok: true };
  if (status === 0) return { ok: false, reason: "allowance-exhausted" };
  return { ok: false, reason: "redis-unavailable" };
}
export {
  FREE_ACCOUNT_CALLS_PER_DAY,
  FREE_ACCOUNT_IDLE_GAP_MS,
  FREE_ACCOUNT_REQUESTS_PER_DAY,
  freeAccountCallsKey,
  freeAccountLastActivityKey,
  freeAccountRequestsKey,
  reserveFreeAccountAllowance
};
