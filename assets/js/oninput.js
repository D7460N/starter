import { logStage, logSuccess, requestData } from "./api.js";
import { readPersistent, writePersistent } from "./storage.js";

const STORAGE_KEY = "d7460n.app.v1";
const COOKIE_KEY = "d7460n.app.v1";
const LOAD_DELAY_MS = 10;
let isShellHydrated = false;

const PAGE_ENDPOINT_BY_INDEX = [
  "home",
  "about",
  "products",
  "events",
  "contact"
];

// Keep hidden state-machine inputs and remove injected text content.
function preserveStateInputs(el) {
  for (const child of Array.from(el.childNodes)) {
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      child.tagName.toLowerCase() === "input" &&
      child.hasAttribute("aria-hidden") &&
      (child.type === "radio" || child.type === "checkbox")
    ) {
      continue;
    }
    el.removeChild(child);
  }
}

// Prepend a text node into an element after clearing non-input children.
function injectText(el, text = "") {
  preserveStateInputs(el);
  el.prepend(document.createTextNode(text));
}

// Normalize endpoint response to the current app object shape.
function resolveShell(data) {
  const root = Array.isArray(data) ? data : [data];

  if (root[0]?.app) {
    return root[0].app;
  }

  if (root[0]?.header || root[0]?.navigation || root[0]?.footer) {
    return root[0];
  }

  return root[0]?.app ?? null;
}

// Resolve a page by nav index from the current app shape.
function resolvePage(data, index) {
  const root = Array.isArray(data) ? data : [data];

  let page = root[0]?.page ?? null;

  if (!page) {
    page = root[0]?.app?.pages?.[0] ?? null;
  }

  if (!page) {
    page = root[0]?.app?.pages?.[index] ?? null;
  }

  if (!page) {
    logStage("validation", {
      message: `Page not found at index ${index}`
    });
  }

  return page;
}

// Inject persistent shell content shared across all pages.
function injectShell(app) {
  try {
    injectText(document.querySelector("header app-logo"), app.header?.brand ?? "");
    injectText(document.querySelector("header app-user"), app.header?.user ?? "");

    document
      .querySelectorAll("nav label")
      .forEach((el, i) => injectText(el, app.navigation?.primary?.[i] ?? ""));

    injectText(document.querySelector("footer app-legal"), app.footer?.legal ?? "");
    injectText(document.querySelector("footer app-version"), app.footer?.version ?? "");
  } catch (error) {
    logStage("global-injection", {
      errorName: error.name,
      message: error.message,
      errorStack: error.stack
    });
  }
}

// Clear page content slots while preserving hidden state-machine inputs.
function clearPageSlots() {
  document
    .querySelectorAll("article h1, article > p, article section p")
    .forEach(el => preserveStateInputs(el));
}

// Wait for a defined delay to allow CSS loading-state visibility.
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Inject page-specific content into article slots.
function injectPage(page) {
  try {
    document
      .querySelector("article h1")
      .prepend(document.createTextNode(page.pageTitle ?? ""));

    const introSlots = document.querySelectorAll("article > p");

    page.intro?.forEach((text, i) => {
      if (introSlots[i]) {
        introSlots[i].prepend(document.createTextNode(text));
      }
    });

    const sectionSlots = document.querySelectorAll("article section p");

    page.sections?.[0]?.content?.forEach((text, i) => {
      if (sectionSlots[i]) {
        sectionSlots[i].prepend(document.createTextNode(text));
      }
    });

    const introCount = page.intro?.length ?? 0;

    page.outro?.forEach((text, i) => {
      const slot = introSlots[introCount + i];
      if (slot) {
        slot.prepend(document.createTextNode(text));
      }
    });
  } catch (error) {
    logStage("page-injection", {
      errorName: error.name,
      message: error.message,
      errorStack: error.stack
    });
  }
}

// Read and validate persisted selection state.
export function getInitialSelection(defaultEndpointKey = "app") {
  const state = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  const index = Number.isInteger(state?.navigation?.index) ? state.navigation.index : 0;
  const endpointKey = typeof state?.navigation?.endpointKey === "string" && state.navigation.endpointKey
    ? state.navigation.endpointKey
    : defaultEndpointKey;

  return { index, endpointKey };
}

// Persist the latest selected nav index and endpoint key.
function persistSelection(index, endpointKey) {
  const current = readPersistent(STORAGE_KEY, COOKIE_KEY, {});

  const next = {
    ...current,
    navigation: {
      index,
      endpointKey
    },
    updatedAt: new Date().toISOString()
  };

  writePersistent(STORAGE_KEY, COOKIE_KEY, next);
}

// Persist the last shell hydration context.
function persistShellHydration(endpointKey) {
  const current = readPersistent(STORAGE_KEY, COOKIE_KEY, {});

  const next = {
    ...current,
    shell: {
      endpointKey,
      hydratedAt: new Date().toISOString()
    },
    updatedAt: new Date().toISOString()
  };

  writePersistent(STORAGE_KEY, COOKIE_KEY, next);
}

// Decide whether shell needs to be injected for this lifecycle run.
function shouldInjectShell() {
  return !isShellHydrated;
}

// Resolve page endpoint key from nav index.
function endpointKeyFromIndex(index) {
  return PAGE_ENDPOINT_BY_INDEX[index] ?? PAGE_ENDPOINT_BY_INDEX[0];
}

// Universal oninput lifecycle path for API transport and DOM injection.
export async function runOnInputLifecycle(index, endpointKey = "app") {
  console.clear();

  const shellInjected = shouldInjectShell();

  let shell = null;

  if (shellInjected) {
    const shellData = await requestData("shell");

    if (!shellData) {
      return;
    }

    shell = resolveShell(shellData);

    if (!shell) {
      logStage("validation", {
        message: "Shell payload not found"
      });
      return;
    }

    injectShell(shell);
    isShellHydrated = true;
    persistShellHydration("shell");
  }

  const pageData = await requestData(endpointKey);

  if (!pageData) {
    return;
  }

  const page = resolvePage(pageData, index);

  if (!page) {
    return;
  }

  clearPageSlots();
  await wait(LOAD_DELAY_MS);
  injectPage(page);

  persistSelection(index, endpointKey);

  logSuccess("Load complete", {
    index,
    endpointKey,
    pageType: page.pageType ?? "unknown",
    shellInjected
  });
}

// Bind nav radio inputs to the shared oninput lifecycle.
function bindNavOnInput(defaultEndpointKey) {
  document
    .querySelectorAll("nav input[type='radio']")
    .forEach((el, i) => {
      el.oninput = () => runOnInputLifecycle(i, endpointKeyFromIndex(i));
    });
}

// Select and trigger the startup radio to preserve oninput-only lifecycle.
function triggerInitialSelection(index) {
  const radios = document.querySelectorAll("nav input[type='radio']");
  const target = radios[index] ?? radios[0];

  if (!target) {
    return;
  }

  target.click();
}

// Initialize nav bindings and execute startup load through oninput.
export function initializeOnInputLifecycle(defaultEndpointKey = "app") {
  bindNavOnInput(defaultEndpointKey);

  const selection = getInitialSelection(defaultEndpointKey);
  triggerInitialSelection(selection.index);
}
