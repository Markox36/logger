import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("dist-cjs");
fs.mkdirSync(outDir, { recursive: true });

const pkgPath = path.join(outDir, "package.json");
const pkg = { type: "commonjs" };

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
