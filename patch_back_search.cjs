const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

mainTs += `
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("backFromSearchBtn")?.addEventListener("click", () => {
    window.location.hash = "#";
    const mainInput = document.getElementById("searchInput") as HTMLInputElement;
    if (mainInput) mainInput.value = "";
    const navInput = document.getElementById("navSearchInput") as HTMLInputElement;
    if (navInput) navInput.value = "";
  });
});
`;
fs.writeFileSync('src/main.ts', mainTs);
console.log("Wired up backFromSearchBtn");
