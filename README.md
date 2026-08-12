# يويو (YouYou) — Website

The official website for **يويو / YouYou World** — a static site, no build step required.

## Files

- `index.html` — the homepage
- `style.css` — all styles
- `script.js` — all interactive behavior (products, games hub, values, etc.)
- `matching-game.html` — the standalone interactive matching/memory game

## How to host this on GitHub Pages (free)

1. **Create a new GitHub repository** (e.g. `youyou-website`).
2. **Upload all 4 files** in this folder to the root of the repository
   (keep them all in the same folder — don't put them in subfolders).
3. In the repository, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to **"Deploy from a branch"**.
5. Set **Branch** to `main` (or `master`) and folder to **`/ (root)`**, then **Save**.
6. GitHub will give you a live URL after a minute or two, typically:
   `https://YOUR-USERNAME.github.io/youyou-website/`

That's it — no build tools, no npm, no React needed. It's a plain static site,
which is the simplest and most reliable way to host it.

## Using a custom domain (e.g. youyou.tn)

1. In your domain's DNS settings, add a **CNAME record** pointing to
   `YOUR-USERNAME.github.io`.
2. In the repo, go to **Settings → Pages → Custom domain**, enter your domain,
   and save. GitHub will create a `CNAME` file in your repo automatically.
3. Wait for DNS to propagate (can take a few minutes to a few hours), then
   check "Enforce HTTPS" once available.

## Important

- `index.html` and `matching-game.html` **must stay in the same folder** —
  the "play" links on the homepage point to `matching-game.html` directly
  (a relative link), and will break if the files are separated.
- QR codes in the printed book/cards currently point to a placeholder
  domain — once your GitHub Pages (or custom domain) URL is live, generate
  a new QR pointing to it (ideally straight to `/matching-game.html` for
  the fastest "scan and play" experience).

## Local preview

You don't need a server to preview — just double-click `index.html` and it
opens in your browser. If you want to preview with a local server (optional):

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```
