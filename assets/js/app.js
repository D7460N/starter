import { initializeOnInputLifecycle } from "./oninput.js";
import { logSuccess } from "./api.js";
import { readPersistent, writePersistent } from "./storage.js";
import { getTourEndpointKey, shouldUseTourEndpoint } from "./tour.js";

const STORAGE_KEY = "d7460n.app.v1";
const COOKIE_KEY = "d7460n.app.v1";
const DEFAULT_ENDPOINT_KEY = "app";

// Detect whether index.html was opened locally via file://.
function isLocalOpen() {
  return window.location.protocol === "file:";
}

// Store runtime environment metadata for future onboarding/tour flows.
function persistEnvironment() {
  const current = readPersistent(STORAGE_KEY, COOKIE_KEY, {});

  const next = {
    ...current,
    environment: {
      ...(current.environment ?? {}),
      localOpen: isLocalOpen()
    },
    updatedAt: new Date().toISOString()
  };

  return writePersistent(STORAGE_KEY, COOKIE_KEY, next);
}

// Resolve startup endpoint key; tour remains disabled until explicitly enabled.
function resolveStartupEndpointKey(state) {
  if (shouldUseTourEndpoint(state)) {
    return getTourEndpointKey();
  }

  return DEFAULT_ENDPOINT_KEY;
}

const appState = persistEnvironment();
const startupEndpointKey = resolveStartupEndpointKey(appState);

console.clear();
logSuccess("App startup", {
  endpointKey: startupEndpointKey,
  localOpen: appState?.environment?.localOpen === true
});

initializeOnInputLifecycle(startupEndpointKey);
