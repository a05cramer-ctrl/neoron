/* ==============================================================
   NEURON ($NRN) settings. This is the only file you need to edit.
   Commit and push after editing; Vercel redeploys in about a minute.
   ============================================================== */
window.NRN_CONFIG = {
  // Paste the coin's contract (mint) address here after you create it on pump.fun.
  // While this is empty the site is in pre-launch mode: the buttons point to your
  // X and Telegram, and the contract bar says the address drops at launch.
  contractAddress: "",

  // Your socials. Full links or @handles both work.
  x: "https://x.com/",
  telegram: "https://t.me/",

  // Optional overrides. Leave empty and they are built from the contract address:
  //   buy   -> https://pump.fun/coin/<contract address>
  //   chart -> https://dexscreener.com/solana/<contract address>
  buyUrl: "",
  chartUrl: ""
};
