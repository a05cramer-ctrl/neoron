# NEURON ($NRN)

The NEURON website, ready to push to GitHub and deploy on Vercel. Plain HTML, CSS and JS, no framework.

## Launch steps

1. **Socials.** In `site/config.js`, add your X and Telegram links.
2. **Push to GitHub.** This folder is the repo root.
3. **Deploy on Vercel.** Add New → Project → import the repo → Deploy. There are no settings to change; `vercel.json` handles it.
4. **After you create the coin on pump.fun,** paste the contract address into `site/config.js`, then commit and push. Vercel redeploys in about a minute and the site goes live: Buy opens the coin's pump.fun page, View chart opens DexScreener, and the contract address gets copy buttons.

Until the contract address is in, the site runs in pre-launch mode: the buttons send people to your X and Telegram instead of pump.fun, so nobody buys a copycat.

Link previews on X, Telegram and Discord use your Vercel domain automatically, and switch to your custom domain once you add one in Vercel and redeploy. If a shared link ever shows no preview image, add an environment variable `SITE_URL` set to your domain (Vercel → Settings → Environment Variables) and redeploy.

To preview locally, open `site/index.html` in a browser.

## What's in here

| Path | What it is |
|---|---|
| `site/` | The website. Vercel serves this. |
| `site/config.js` | Contract address and socials. The only file you need to edit. |
| `brand-kit/` | Images for pump.fun, X and Telegram. Not deployed. |
| `vercel.json`, `build.mjs` | Vercel settings, and the step that fills in your domain for link previews. |

## Brand kit

| File | Use |
|---|---|
| `neuron-token-1000.png` | pump.fun coin image, X and Telegram profile picture |
| `neuron-x-header-1500x500.jpg` | X header |
| `neuron-social-card-1200x630.jpg` | Link preview card (the site already uses it) |
| `neuron-logo-full.png` | Full-resolution logo |
| `neuron-banner-full.jpg` | Full-resolution banner |

## Keep the copy accurate

The site describes a standard pump.fun launch: 1B supply, zero buy and sell tax, no presale or team allocation, and liquidity that moves to PumpSwap when the coin graduates. If your launch differs (for example a dev buy you want to disclose), edit the Tokenomics and FAQ sections in `site/index.html`.
