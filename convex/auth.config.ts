// UNIFIED-ENGINE CHANGE: this build has no Clerk backend. This file used to
// throw at deploy time if CLERK_JWT_ISSUER_DOMAIN was unset — which would
// crash a self-hosted Convex deployment for a single local user with no
// Clerk account at all. No Convex function calls ctx.auth.getUserIdentity()
// anymore (convex/lib/auth.ts::resolveUserId() always returns the fixed
// local user id instead), so an empty provider list is correct, not a stub:
// there is nothing left that needs JWT verification.
export default {
  providers: [],
};
