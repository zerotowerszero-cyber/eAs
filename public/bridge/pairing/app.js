function params() {
  const hash = new URLSearchParams(String(location.hash || "").replace(/^#/, "").replace(/^\?/, ""));
  const query = new URLSearchParams(location.search);
  return {
    pin: hash.get("pin") || query.get("pin") || "",
    name: hash.get("name") || query.get("name") || "",
  };
}

function formatPin(pin) {
  const s = String(pin || "").replace(/\s+/g, "");
  if (s.length === 6) return s.slice(0, 3) + "  " + s.slice(3);
  return s || "------";
}

function render() {
  const { pin, name } = params();
  document.getElementById("pin").textContent = formatPin(pin);
  document.getElementById("name").textContent = name || "—";
  if (pin) {
    document.getElementById("headline").textContent = "This PC is ready.";
    document.getElementById("lede").textContent =
      "Open bridge on your Mac, click Add, and type this code.";
    document.title = (name || "bridge") + " · pairing";
  }
}

window.addEventListener("hashchange", render);
render();
