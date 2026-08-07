const fs = require('fs');

function addNavHighlight(file, isMain) {
  let ts = fs.readFileSync(file, 'utf8');
  
  if (isMain) {
    // In main.ts, mobile-search scrolls to top
    ts = ts.replace(
      /document\.getElementById\("mobile-profile"\)\?\.addEventListener\("click", \(\) => \{\n\s*window\.location\.href = "profile\.html#\/profile";\n\s*\}\);/,
      `document.getElementById("mobile-profile")?.addEventListener("click", () => {
    document.getElementById("mobile-profile").innerHTML = '<div class="w-6 h-6 mb-1 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div><span class="text-[10px] font-medium">Loading</span>';
    window.location.href = "profile.html#/profile";
  });`
    );
    
    ts = ts.replace(
      /document\.getElementById\("mobile-requests"\)\?\.addEventListener\("click", \(\) => \{\n\s*window\.location\.href = "profile\.html#\/requests";\n\s*\}\);/,
      `document.getElementById("mobile-requests")?.addEventListener("click", () => {
    document.getElementById("mobile-requests").innerHTML = '<div class="w-6 h-6 mb-1 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div><span class="text-[10px] font-medium">Loading</span>';
    window.location.href = "profile.html#/requests";
  });`
    );
    
    ts = ts.replace(
      /document\.getElementById\("mobile-post"\)\?\.addEventListener\("click", \(\) => \{\n\s*window\.location\.href = "profile\.html#\/post-service";\n\s*\}\);/,
      `document.getElementById("mobile-post")?.addEventListener("click", () => {
    document.getElementById("mobile-post").innerHTML = '<div class="w-6 h-6 mb-1 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div><span class="text-[10px] font-medium">Loading</span>';
    window.location.href = "profile.html#/post-service";
  });`
    );

    // active highlight logic in main.ts
    // Home is always highlighted in index.html except when search hash is active
    ts += `
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  const homeBtn = document.getElementById("mobile-home");
  const searchBtn = document.getElementById("mobile-search");
  
  if (homeBtn && searchBtn) {
    if (hash === "#search") {
      homeBtn.className = "flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";
      searchBtn.className = "flex flex-col items-center p-2 text-orange-600";
    } else {
      homeBtn.className = "flex flex-col items-center p-2 text-orange-600";
      searchBtn.className = "flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";
    }
  }
});
`;

  } else {
    // In profile.ts
    ts = ts.replace(
      /document\.getElementById\("mobile-home"\)\?\.addEventListener\("click", \(\) => \{\n\s*window\.location\.href = "\/";\n\s*\}\);/,
      `document.getElementById("mobile-home")?.addEventListener("click", () => {
    document.getElementById("mobile-home").innerHTML = '<div class="w-6 h-6 mb-1 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div><span class="text-[10px] font-medium">Loading</span>';
    window.location.href = "/";
  });`
    );
    
    // search should go to home search
    ts = ts.replace(
      /document\.getElementById\("mobile-search"\)\?\.addEventListener\("click", \(\) => \{\n\s*window\.location\.hash = "#\/services";\n\s*\}\);/,
      `document.getElementById("mobile-search")?.addEventListener("click", () => {
    document.getElementById("mobile-search").innerHTML = '<div class="w-6 h-6 mb-1 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div><span class="text-[10px] font-medium">Loading</span>';
    window.location.href = "/?search=true";
  });`
    );
    
    ts += `
function updateProfileMobileNav() {
  const hash = window.location.hash;
  const btns = {
    "/post-service": document.getElementById("mobile-post"),
    "/requests": document.getElementById("mobile-requests"),
    "/client-requests": document.getElementById("mobile-requests"),
    "/profile": document.getElementById("mobile-profile"),
    "/services": document.getElementById("mobile-profile") // fallback?
  };
  
  // reset all
  Object.values(btns).forEach(btn => {
    if (btn) btn.className = "flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";
  });
  
  if (hash.includes("/post-service") && btns["/post-service"]) {
    btns["/post-service"].className = "flex flex-col items-center p-2 text-orange-600";
  } else if ((hash.includes("/requests") || hash.includes("/client-requests")) && btns["/requests"]) {
    btns["/requests"].className = "flex flex-col items-center p-2 text-orange-600";
  } else if (btns["/profile"]) {
    btns["/profile"].className = "flex flex-col items-center p-2 text-orange-600";
  }
}
window.addEventListener("hashchange", updateProfileMobileNav);
document.addEventListener("DOMContentLoaded", updateProfileMobileNav);
`;
  }
  
  fs.writeFileSync(file, ts);
}

addNavHighlight('src/main.ts', true);
addNavHighlight('src/profile.ts', false);
console.log("Patched mobile nav highlight logic");
