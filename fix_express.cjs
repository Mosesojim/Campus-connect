const fs = require('fs');

let code = fs.readFileSync('api/index.ts', 'utf8');
code = code.replace('import express = require("express");', 'import express from "express";');
fs.writeFileSync('api/index.ts', code);

code = fs.readFileSync('api-router.ts', 'utf8');
code = code.replace('import express = require("express");', 'import express from "express";');
fs.writeFileSync('api-router.ts', code);

code = fs.readFileSync('server.ts', 'utf8');
code = code.replace('import express = require("express");', 'import express from "express";');
fs.writeFileSync('server.ts', code);

console.log("Fixed express import");
