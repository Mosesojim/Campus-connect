const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

mainTs += `
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("search") === "true") {
    window.location.hash = "#search";
    setTimeout(() => {
      document.getElementById("searchInput")?.focus();
      if ((window as any).searchProviders) {
        (window as any).searchProviders();
      }
    }, 500);
  }
});
`;
fs.writeFileSync('src/main.ts', mainTs);
console.log("Added search onload");
