const fs = require('fs');

let code = fs.readFileSync('src/profile.ts', 'utf8');

// Replace all window.location.assign('/...') with window.navigate('/...')
code = code.replace(/window\.location\.assign\('\/settings'\)/g, "window.navigate('/settings')");
code = code.replace(/window\.location\.assign\('\/my-services'\)/g, "window.navigate('/my-services')");
code = code.replace(/window\.location\.assign\('\/profile'\)/g, "window.navigate('/profile')");
code = code.replace(/window\.location\.assign\('\/requests'\)/g, "window.navigate('/requests')");

// Just to be thorough, check for double quotes as well
code = code.replace(/window\.location\.assign\("\/settings"\)/g, "window.navigate('/settings')");
code = code.replace(/window\.location\.assign\("\/my-services"\)/g, "window.navigate('/my-services')");
code = code.replace(/window\.location\.assign\("\/profile"\)/g, "window.navigate('/profile')");
code = code.replace(/window\.location\.assign\("\/requests"\)/g, "window.navigate('/requests')");

fs.writeFileSync('src/profile.ts', code);
console.log("Patched src/profile.ts location assignments");
