# 💌 Ask Out

A cute little static site to ask someone on a date, with a **No button that runs away**, a date-gift picker (food, League RP, Sanrio plushies), a date/time picker, and a summary they can send back to you.

Plain HTML5, CSS and JavaScript. No build step.

## Customize

Open `script.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  crushName: "cutie",  // their name
  yourName: "me",      // your name
  phone: "",           // optional: shows a "Text me" button
  email: "",           // optional: shows an "Email me" button
};
```

You can also put their name in the link instead: `https://<you>.github.io/ask-out/?to=Alex`

The gift options are in the `GIFTS` object in the same file. Add, remove or rename anything you like.

## Host on GitHub Pages

1. Create a new public repo on GitHub (for example `ask-out`).
2. Upload `index.html`, `style.css` and `script.js` (or push them with git).
3. In the repo, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, pick `main` and `/ (root)`, then save.
4. After a minute your site will be live at `https://<your-username>.github.io/ask-out/`.

## Preview locally

Just double-click `index.html`. Copy-to-clipboard works best over `https://` (GitHub Pages) or `localhost`.
