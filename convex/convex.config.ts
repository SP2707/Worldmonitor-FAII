import { defineApp } from "convex/server";

// UNIFIED-ENGINE CHANGE: no Dodo Payments backend exists in this build —
// the @dodopayments/convex component this used to mount is deleted along
// with the rest of the billing backend (convex/payments/, the Dodo webhook
// route, the product catalog). Nothing left to wire in.
const app = defineApp();

export default app;
