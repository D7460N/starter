// Shared API origin; endpoint suffix is the only variable.
export const API_BASE_URL = "https://6987f917780e8375a6874dcf.mockapi.io";

// Endpoint suffix registry.
export const ENDPOINT_SUFFIX = {
  shell: "shell",
  home: "home",
  about: "about",
  products: "products",
  events: "events",
  contact: "contact",
  tour: ""
};

// Build a compact timestamp for all console reporting.
function nowStamp() {
  return new Date().toISOString();
}

// Standardized stage logger for API failures.
export function logStage(stage, payload) {
  const row = {
    timestamp: nowStamp(),
    stage,
    ...payload
  };

  console.group(`FAIL [${row.timestamp}] ${stage}`);
  console.table([row]);

  if (payload?.errorStack) {
    console.error(payload.errorStack);
  }

  console.groupEnd();
}

// Minimal success reporting with timestamp.
export function logSuccess(message, payload = {}) {
  const row = {
    timestamp: nowStamp(),
    message,
    ...payload
  };

  console.table([row]);
}

// Resolve an endpoint key or URL into a concrete URL.
export function resolveEndpoint(endpointKeyOrUrl) {
  const suffix = ENDPOINT_SUFFIX[endpointKeyOrUrl];

  if (typeof suffix === "string" && suffix.length > 0) {
    return `${API_BASE_URL}/${suffix}`;
  }

  return endpointKeyOrUrl;
}

// Fetch and parse JSON from an endpoint URL.
export async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url);

    if (!response.ok) {
      logStage("fetch", {
        status: response.status,
        statusText: response.statusText,
        url
      });
      return null;
    }

  } catch (error) {
    logStage("network", {
      errorName: error.name,
      message: error.message,
      errorStack: error.stack,
      url
    });
    return null;
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    logStage("json-parse", {
      errorName: error.name,
      message: error.message,
      errorStack: error.stack
    });
    return null;
  }
}

// CRUD utility entrypoint used by oninput lifecycle.
export async function requestData(endpointKeyOrUrl) {
  const url = resolveEndpoint(endpointKeyOrUrl);

  if (!url) {
    logStage("endpoint", {
      message: `Endpoint not configured: ${endpointKeyOrUrl ?? "unknown"}`
    });
    return null;
  }

  return fetchJson(url);
}
