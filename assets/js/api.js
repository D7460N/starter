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

function clearData(selector) {
  document.querySelectorAll(selector)
    .forEach(el => preserveInputs(el));
}

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.table([{ stage: "fetch", status: response.status, statusText: response.statusText, url }]);
      return null;
    }

    return await response.json();

  } catch (error) {
    console.table([{ stage: "network", message: error.message, url }]);
    return null;
  }
}

function injectData(el, text) {
  el.prepend(document.createTextNode(text ?? ""));
}

const API = "https://6987f917780e8375a6874dcf.mockapi.io/data";

// Page load — header, nav, footer (once)
(async () => {
  clearData("header app-logo, header app-user, nav label, footer app-legal, footer app-version");

  const data = await fetchData(API);
  if (!data) return;

  const app = (Array.isArray(data) ? data : [data])[0]?.app;
  if (!app) return;

  // Header
  injectData(document.querySelector("header app-logo"), app.header.brand);
  injectData(document.querySelector("header app-user"), app.header.user);

  // Nav labels
  document.querySelectorAll("nav label")
    .forEach((el, i) => injectData(el, app.navigation.primary[i]));

  // Footer
  injectData(document.querySelector("footer app-legal"), app.footer.legal);
  injectData(document.querySelector("footer app-version"), app.footer.version);
})();

// oninput — article content (every nav switch)
document.querySelectorAll("nav input[type='radio']")
  .forEach((el, i) => {
    el.oninput = async () => {
      console.clear();
      console.log(`page → ${i} @ ${new Date().toLocaleTimeString()}`);

      clearData("article h1, article > p, article section p");

      const data = await fetchData(API);
      if (!data) return;

      const page = (Array.isArray(data) ? data : [data])[0]?.app?.pages?.[i];
      if (!page) return;

      injectData(document.querySelector("article h1"), page.pageTitle);

      document.querySelectorAll("article > p")
        .forEach((el, i) => { if (page.intro?.[i]) injectData(el, page.intro[i]); });

      document.querySelectorAll("article section p")
        .forEach((el, i) => { if (page.sections?.[0]?.content?.[i]) injectData(el, page.sections[0].content[i]); });

      const introSlots = document.querySelectorAll("article > p");
      const introCount = page.intro?.length ?? 0;

      page.outro?.forEach((text, i) => {
        if (introSlots[introCount + i]) injectData(introSlots[introCount + i], text);
      });

      console.info("Load complete");
    };
  });

// Programmatic first click
document.querySelector("nav input[type='radio']").click();
