export async function load(index, url) {

  console.group(`load → index: ${index}`);

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
      console.groupEnd();
      return;
    }

    console.info("Fetch successful");

  } catch (error) {
    console.table([{
      stage: "network",
      message: error.message,
      url
    }]);
    console.groupEnd();
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
    console.groupEnd();
    return;
  }

  // If the response is an array, take the first element
  const root = Array.isArray(data) ? data[0] : data;

  if (!root?.app?.pages) {
    console.table([{
      stage: "validation",
      message: "Invalid JSON structure → app.pages missing"
    }]);
    console.groupEnd();
    return;
  }

  const app = data.app;
  const page = app.pages[index];

  if (!page) {
    console.table([{
      stage: "validation",
      message: `Page not found at index ${index}`
    }]);
    console.groupEnd();
    return;
  }

  console.info(`Injecting page → ${page.pageType ?? "unknown"}`);

  /* =========================
     GLOBAL CONTENT
     ========================= */

  try {

    document.querySelector("header app-logo").textContent =
      app.header.brand.name ?? "";

    document.querySelector("header app-user").textContent =
      app.header.brand.tagline ?? "";

    document.querySelectorAll("nav label")
      .forEach((el, i) => {
        el.textContent = app.navigation.primary[i] ?? "";
      });

    document.querySelector("footer app-legal").textContent =
      app.footer.legal?.[0] ?? "";

    document.querySelector("footer app-version").textContent =
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

    document.querySelector("article h1").textContent =
      page.pageTitle ?? "";

    const introSlots =
      document.querySelectorAll("article > p");

    introSlots.forEach(p => p.textContent = "");

    page.intro?.forEach((text, i) => {
      if (introSlots[i]) {
        introSlots[i].textContent = text;
      }
    });

    const sectionSlots =
      document.querySelectorAll("article section p");

    sectionSlots.forEach(p => p.textContent = "");

    page.sections?.[0]?.content?.forEach((text, i) => {
      if (sectionSlots[i]) {
        sectionSlots[i].textContent = text;
      }
    });

    const introCount = page.intro?.length ?? 0;

    page.outro?.forEach((text, i) => {
      const slot = introSlots[introCount + i];
      if (slot) {
        slot.textContent = text;
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
load(0, "https://69895237c04d974bc69ee681.mockapi.io/data");

