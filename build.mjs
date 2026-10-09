// Vercel runs this on every deploy (see vercel.json).
// It copies site/ into dist/ and fills in your live domain for the link-preview
// tags, so a shared link shows the NEURON card on X, Telegram and Discord.
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
cpSync("site", "dist", { recursive: true });

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
