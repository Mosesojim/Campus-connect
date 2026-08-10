const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import \* as express from "express";/g, 'import express from "express";');
  code = code.replace(/import \* as crypto from "crypto";/g, 'import crypto from "crypto";');
  fs.writeFileSync(file, code);
}

fix('api-router.ts');
fix('api/index.ts');
fix('server.ts');
console.log("Fixed all imports back");
