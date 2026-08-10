const fs = require('fs');
const apiRouterCode = fs.readFileSync('api-router.ts', 'utf8');

// The api-router.ts already imports express and creates apiRouter.
// We just need to append the app setup and export app at the bottom.

const vercelIndexCode = apiRouterCode + `

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", apiRouter);
export default app;
`;

fs.writeFileSync('api/index.ts', vercelIndexCode);
console.log("Updated api/index.ts");
