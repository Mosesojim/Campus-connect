const fs = require('fs');
let profileTs = fs.readFileSync('src/profile.ts', 'utf8');

profileTs = profileTs.replace(
  `  document.getElementById("mobile-post")?.addEventListener("click", () => {
    window.location.href = "/#post";
  });`,
  `  document.getElementById("mobile-post")?.addEventListener("click", () => {
    const user = getCurrentUser();
    if (user?.role === 'provider') {
      window.location.hash = '#/my-services';
    } else {
      window.location.hash = '#/requests';
    }
  });`
);

fs.writeFileSync('src/profile.ts', profileTs);
console.log("Patched mobile nav");
