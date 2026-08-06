const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

const regex = /user\.services\?\.substring\(0, 30\)/g;
const replacement = `(typeof user.services === 'string' ? user.services.substring(0, 30) : (Array.isArray(user.services) && user.services[0] ? user.services[0].name : ''))`;

mainTs = mainTs.replace(regex, replacement);
fs.writeFileSync('src/main.ts', mainTs);
console.log("Fixed substring");
