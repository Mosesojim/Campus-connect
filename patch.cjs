const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The bottom part starting from "// Vite middleware for development"
const vitePartIndex = code.indexOf('// Vite middleware for development');

const topPart = code.substring(0, vitePartIndex);
const bottomPart = code.substring(vitePartIndex);

const newBottomPart = `
async function startServer() {
  const PORT = 3000;
  ${bottomPart.replace('}  app.listen', '}    app.listen').replace('startServer();', '')}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
`;

fs.writeFileSync('server.ts', topPart + newBottomPart);
