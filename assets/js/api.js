export async function load(index, url) {
  
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
  
  console.log(`load → index: ${index}`);

  let response;
  let data;

  try {
    response = await fetch(url);

    if (!response.ok) {
      console.table([{
        stage: "fetch",
        status: response.status,
        statusText: response.statusText,
        url
      }]);
      console.log();
      return;
    }

    console.info("Fetch successful");

  } catch (error) {
    console.table([{
      stage: "network",
      message: error.message,
      url
    }]);
console.log();
    return;
  }

  try {
    data = await response.json();
    console.info("JSON parsed successfully");
  } catch (error) {
    console.table([{
      stage: "json-parse",
      message: error.message
    }]);
console.log();
    return;
  }

  // If the response is an array, take the first element
  const root = Array.isArray(data) ? data : [data];

  if (!root?.app?.pages) {
    console.table([{
      stage: "validation",
      message: "Invalid JSON structure → app.pages missing"
    }]);
    console.log();
    return;
  }

  const app = root.app;           // ✅ use root, not data
  const page = root[index];

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

  try {

    document.querySelector("header app-logo").preserveInputs =
      app.header.brand.name ?? "";

    document.querySelector("header app-user").preserveInputs =
      app.header.brand.tagline ?? "";

    document.querySelectorAll("nav label")
      .forEach((el, i) => {
        el.preserveInputs = app.navigation.primary[i] ?? "";
      });

    document.querySelector("footer app-legal").preserveInputs =
      app.footer.legal?.[0] ?? "";

    document.querySelector("footer app-version").preserveInputs =
      app.footer.version?.[0] ?? "";

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

  try {

    document.querySelector("article h1").preserveInputs =
      page.pageTitle ?? "";

    const introSlots =
      document.querySelectorAll("article > p");

    introSlots.forEach(p => p.preserveInputs = "");

    page.intro?.forEach((text, i) => {
      if (introSlots[i]) {
        introSlots[i].preserveInputs = text;
      }
    });

    const sectionSlots =
      document.querySelectorAll("article section p");

    sectionSlots.forEach(p => p.preserveInputs = "");

    page.sections?.[0]?.content?.forEach((text, i) => {
      if (sectionSlots[i]) {
        sectionSlots[i].preserveInputs = text;
      }
    });

    const introCount = page.intro?.length ?? 0;

    page.outro?.forEach((text, i) => {
      const slot = introSlots[introCount + i];
      if (slot) {
        slot.preserveInputs = text;
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
  console.groupEnd();
}

// ⚡ Add the real URL here:
load(0, "https://6987f917780e8375a6874dcf.mockapi.io/data");

