# NEURON ($NRN)

The NEURON website. Plain HTML, CSS and JS, deployed on Vercel from this repo.

## Before launch

Open `config.js` (on GitHub: click the file, then the pencil icon to edit it):

- `x` and `telegram`: your links (full links or @handles both work)
- `contractAddress`: paste the mint address after you create the coin on pump.fun

Commit the change and Vercel redeploys in about a minute. Until the contract address is in, the buttons send people to your X and Telegram instead of pump.fun, so nobody buys a copycat. Once it's in, Buy opens the coin's pump.fun page, View chart opens DexScreener, and the address gets copy buttons.

## How it's set up

- Every file at the top level of the repo is part of the website, except `README.md`, `build.mjs` and `vercel.json`. Keep the site files at the top level, not in folders.
- `build.mjs` runs on each Vercel deploy and fills in your domain for link previews on X, Telegram and Discord. If a shared link ever shows no preview image, add an environment variable `SITE_URL` set to your domain in Vercel (Settings → Environment Variables) and redeploy.
- `brand-kit/` holds the images for pump.fun, X and Telegram. It isn't deployed.

| Brand kit file | Use |
|---|---|
| `neuron-token-1000.png` | pump.fun coin image, X and Telegram profile picture |
| `neuron-x-header-1500x500.jpg` | X header |
| `neuron-social-card-1200x630.jpg` | Link preview card (the site already uses `og.jpg`, the same image) |
| `neuron-logo-full.png` | Full-resolution logo |
| `neuron-banner-full.jpg` | Full-resolution banner |

## Keep the copy accurate

The site describes a standard pump.fun launch: 1B supply, zero buy and sell tax, no presale or team allocation, and liquidity that moves to PumpSwap when the coin graduates. If your launch differs (for example a dev buy you want to disclose), edit the Tokenomics and FAQ sections in `index.html`.
