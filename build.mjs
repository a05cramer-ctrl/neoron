// Vercel runs this on every deploy (see vercel.json).
// It copies the website files into dist/ and fills in your live domain for the
// link-preview tags, so a shared link shows the NEURON card on X, Telegram and Discord.
//
// Every file at the top level of the repo is part of the website, except the ones
// listed below. Folders (like brand-kit/) are not deployed.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";

const NOT_WEBSITE = new Set(["build.mjs", "vercel.json", "README.md", "download"]);

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const name of readdirSync(".")) {
  if (name.startsWith(".") || NOT_WEBSITE.has(name) || !statSync(name).isFile()) continue;
  copyFileSync(name, `dist/${name}`);
}

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL to your custom domain, or to the
// project's vercel.app domain if you haven't added one. SITE_URL overrides it.
const domain = String(process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "")
  .trim()
  .replace(/^https?:\/\//i, "")
  .replace(/\/+$/, "");
const origin = domain ? `https://${domain}` : "";

const page = "dist/index.html";
writeFileSync(page, readFileSync(page, "utf8").replaceAll("%SITE_URL%", origin));

console.log(origin ? `Link previews point to ${origin}` : "No domain found, link preview URLs left relative.");
