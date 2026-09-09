// api/mcp/bounded-body.ts
async function readBoundedResponseText(response, maxBytes) {
  const reader = response.body?.getReader();
  if (!reader) {
    const text2 = typeof response.text === "function" ? await response.text().catch(() => "") : "";
    return text2.slice(0, maxBytes);
  }
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";
  try {
    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      const remaining = maxBytes - bytesRead;
      const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
      text += decoder.decode(chunk, { stream: bytesRead + chunk.byteLength < maxBytes });
      bytesRead += chunk.byteLength;
      if (chunk.byteLength < value.byteLength) break;
    }
    text += decoder.decode();
    return text;
  } catch {
    return "";
  } finally {
    await reader.cancel().catch(() => {
    });
  }
}

// api/mcp/billing-denial.ts
var BILLING_VERIFICATION_CODES = /* @__PURE__ */ new Set([
  "subscription_lapsed",
  "renewal_verification_pending",
  "renewal_verification_failed",
  "entitlement_verification_unavailable"
]);
var BillingDenialError = class extends Error {
  operation;
  status;
  billingCode;
  retryAfterSeconds;
  constructor(label, status, billingCode, retryAfterSeconds) {
    super(`${label} HTTP ${status} (${billingCode})`);
    this.name = "BillingDenialError";
    this.operation = label;
    this.status = status;
    this.billingCode = billingCode;
    this.retryAfterSeconds = retryAfterSeconds;
  }
};
var MAX_VALIDATION_BODY_BYTES = 16384;
var MAX_VALIDATION_VIOLATIONS = 8;
var MAX_VIOLATION_FIELD_LEN = 64;
var MAX_VIOLATION_DESCRIPTION_LEN = 200;
var SAFE_VIOLATION_FIELD = /^[A-Za-z_][A-Za-z0-9_.]{0,63}$/;
var UNSAFE_VIOLATION_DESCRIPTION = /[<>]|authorization\s*:|bearer\s/i;
var RpcValidationError = class extends Error {
  operation;
  status;
  violations;
  constructor(label, violations) {
    super(`${label} HTTP 400`);
    this.name = "RpcValidationError";
    this.operation = label;
    this.status = 400;
    this.violations = violations;
  }
};
function throwIfBillingDenial(response, label) {
  if (response.ok) return;
  const marker = response.headers?.get("X-Billing-Verification");
  if (!marker || !BILLING_VERIFICATION_CODES.has(marker)) return;
  const retryHeader = response.headers?.get("Retry-After");
  const rawRetryAfter = retryHeader == null ? Number.NaN : Number(retryHeader);
  throw new BillingDenialError(
    label,
    response.status,
    marker,
    Number.isFinite(rawRetryAfter) ? rawRetryAfter : void 0
  );
}
function sanitizeViolationField(value) {
  if (typeof value !== "string") return null;
  const field = value.trim().slice(0, MAX_VIOLATION_FIELD_LEN);
  return SAFE_VIOLATION_FIELD.test(field) ? field : null;
}
function sanitizeViolationDescription(value) {
  if (typeof value !== "string") return null;
  const description = value.replace(/\s+/g, " ").trim().slice(0, MAX_VIOLATION_DESCRIPTION_LEN);
  if (!description || UNSAFE_VIOLATION_DESCRIPTION.test(description)) return null;
  return description;
}
function parseSafeRpcViolations(parsed) {
  if (!parsed || typeof parsed !== "object" || !("violations" in parsed)) return [];
  const raw = parsed.violations;
  if (!Array.isArray(raw)) return [];
  const violations = [];
  for (const item of raw) {
    if (violations.length >= MAX_VALIDATION_VIOLATIONS) break;
    if (!item || typeof item !== "object") continue;
    const record = item;
    const field = sanitizeViolationField(record.field);
    const description = sanitizeViolationDescription(record.description);
    if (!field || !description) continue;
    violations.push({ field, description });
  }
  return violations;
}
async function extractSafeRpcViolations(response) {
  const type = (response.headers?.get("Content-Type") ?? "").toLowerCase();
  if (type.includes("html")) return [];
  const detail = await readBoundedResponseText(response, MAX_VALIDATION_BODY_BYTES);
  if (!detail) return [];
  try {
    return parseSafeRpcViolations(JSON.parse(detail));
  } catch {
    return [];
  }
}
async function assertToolFetchOk(response, label) {
  if (response.ok) return;
  throwIfBillingDenial(response, label);
  if (response.status === 400) {
    const violations = await extractSafeRpcViolations(response);
    if (violations.length > 0) {
      throw new RpcValidationError(label, violations);
    }
  }
  throw new Error(`${label} HTTP ${response.status}`);
}
export {
  BillingDenialError,
  MAX_VALIDATION_BODY_BYTES,
  RpcValidationError,
  assertToolFetchOk,
  extractSafeRpcViolations,
  parseSafeRpcViolations,
  throwIfBillingDenial
};
