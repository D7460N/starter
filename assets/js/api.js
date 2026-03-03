// Load selected page content from API and inject into the DOM.
async function load(index, url) {

  // Keep hidden state-machine inputs; remove other injected nodes.
  function preserveInputs(el) {
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

  // Debug marker for current load cycle.
  console.clear();
  console.log(`load → index: ${index} @ ${new Date().toLocaleTimeString()}`);

  let response;
  let data;

  // Fetch API payload.
  try {
    response = await fetch(url);

    if (!response.ok) {
      console.table([{
        stage: "fetch",
        status: response.status,
        statusText: response.statusText,
        url
      }]);
      return;
    }

    console.info("Fetch successful");

  } catch (error) {
    // Network-level failure
    console.table([{
      stage: "network",
      message: error.message,
      url
    }]);
    return;
  }

  // Parse JSON payload.
  try {
    data = await response.json();
    console.info("JSON parsed successfully");
  } catch (error) {
    console.table([{
      stage: "json-parse",
      message: error.message
    }]);
    return;
  }

  // Normalize payload to array shape
  const root = Array.isArray(data) ? data : [data];

  // Pull the app object from the first element
  const app  = root[0]?.app;

  // Pull the correct page from app.pages
  const page = app?.pages?.[index];

  // Stop if page index is invalid
  if (!page) {
    console.table([{
      stage: "validation",
      message: `Page not found at index ${index}`
    }]);
    return;
  }

  console.info(`Injecting page → ${page.pageType ?? "unknown"}`);

  /* =========================
     GLOBAL CONTENT
     ========================= */

  // Inject global shell content.
  try {

    const logo = document.querySelector("header app-logo");
    preserveInputs(logo);
    logo.prepend(document.createTextNode(app.header.brand ?? ""));

    const user = document.querySelector("header app-user");
    preserveInputs(user);
    user.prepend(document.createTextNode(app.header.user ?? ""));

    document.querySelectorAll("nav label")
      .forEach((el, i) => {
        preserveInputs(el);
        el.prepend(document.createTextNode(app.navigation.primary[i] ?? ""));
      });

    const legal = document.querySelector("footer app-legal");
    preserveInputs(legal);
    legal.prepend(document.createTextNode(app.footer.legal ?? ""));

    const version = document.querySelector("footer app-version");
    preserveInputs(version);
    version.prepend(document.createTextNode(app.footer.version ?? ""));

    console.info("Global content injected successfully");

  } catch (error) {
    console.table([{
      stage: "global-injection",
      message: error.message
    }]);
  }

  /* =========================
     PAGE CONTENT
     ========================= */

  // Clear page slots so CSS :empty loading state can render.
  document.querySelectorAll("article h1, article > p, article section p")
    .forEach(el => preserveInputs(el));

  await new Promise(r => setTimeout(r, 1000));

  // Inject page-specific content
  try {
    const h1 = document.querySelector("article h1");
    h1.prepend(document.createTextNode(page.pageTitle ?? ""));

    const introSlots =
      document.querySelectorAll("article > p");

    page.intro?.forEach((text, i) => {
      if (introSlots[i]) {
        introSlots[i].prepend(document.createTextNode(text));
      }
    });

    const sectionSlots =
      document.querySelectorAll("article section p");

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

    console.info("Page content injected successfully");

  } catch (error) {
    console.table([{
      stage: "page-injection",
      message: error.message
    }]);
  }

  console.info("Load complete");
}

// API endpoint for app content.
const API = "https://6987f917780e8375a6874dcf.mockapi.io/data";

// Bind nav radios to data load.
document.querySelectorAll("nav input[type='radio']")
  .forEach((el, i) => {
    el.oninput = () => load(i, API);
  });

// Trigger initial page load.
document.querySelector("nav input[type='radio']").click();
