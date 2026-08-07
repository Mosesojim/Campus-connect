const fs = require('fs');
let authTs = fs.readFileSync('src/auth.ts', 'utf8');

authTs = authTs.replace(
  `const endpoint = isProvider ? \`/api/client-requests/\${user.email}\` : \`/api/my-requests/\${user.email}\`;`,
  `if (!user.email) return;\n    const endpoint = isProvider ? \`/api/client-requests/\${user.email}\` : \`/api/my-requests/\${user.email}\`;`
);

fs.writeFileSync('src/auth.ts', authTs);
console.log("Patched auth.ts");
