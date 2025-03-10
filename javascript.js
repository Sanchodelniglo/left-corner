function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript("./js/hamburger.js", () => console.log("Loaded!"));