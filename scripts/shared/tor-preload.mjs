// Loaded with `node --import <this file>` (start-with-local-redis.mjs adds it to NODE_OPTIONS when
// SEED_TOR=1), so every child process - sidecar, local Redis stand-in, each seeder - routes its
// outbound traffic through Tor before any of their own code runs.
import { installTor } from './tor-fetch.mjs';
installTor(process.env);
