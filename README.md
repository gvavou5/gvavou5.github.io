# gvavou5.github.io — Personal Academic Website

Jekyll-based personal website hosted on GitHub Pages.

---

## Local Development

### First-time setup

Make sure your shell has rbenv loaded (new terminal after `.zshrc` was updated):

```bash
source ~/.zshrc
```

Install gems (only needed once, or after changing `Gemfile`):

```bash
bundle install
```

### Run the dev server

```bash
bundle exec jekyll serve --livereload
```

Then open **http://localhost:4000** in your browser.  
The site rebuilds automatically when you save any file.  
`--livereload` also refreshes the browser tab automatically.

> **Note:** `_config.yml` changes require restarting the server (Ctrl+C, then run again).

### Stop the server

Press `Ctrl+C` in the terminal, or from another tab:

```bash
pkill -f "jekyll serve"
```

---

## Updating Content

All content lives in a few YAML files — no HTML editing needed for routine updates.

| What to update | File |
|---|---|
| Papers / publications | `_data/papers.yml` |
| News items | `_data/news.yml` |
| Dissertation | `_data/dissertation.yml` |
| Name, bio, email, photo, social links | `_config.yml` |

Each file has instructions at the top explaining how to add a new entry.

### Adding a new paper

Open `_data/papers.yml`, copy the template block from the top comment, paste it before the first `-` entry, fill in the fields, save. Done.

### Adding a news item

Same pattern in `_data/news.yml`. Set `featured: true` to show it by default, `featured: false` to hide it behind the "Show older items" button.

---

## Deploying

Just push to `master` — GitHub Pages rebuilds automatically:

```bash
git add .
git commit -m "your message"
git push
```

The live site updates in ~1–2 minutes.

---

## Project Structure

```
_config.yml          ← global site settings (personal info, bio, social links)
_data/
  papers.yml         ← publications list
  news.yml           ← news items
  dissertation.yml   ← doctoral dissertation entry
_includes/
  about.html         ← About section
  news.html          ← News section
  publications.html  ← Publications section
  contact.html       ← Contact section
  nav.html           ← Navigation bar
  footer.html        ← Footer
_layouts/
  default.html       ← Main HTML shell (fonts, CSS, JS links)
assets/
  css/main.css       ← All styles (single file, design tokens at top)
  js/main.js         ← Filtering, mobile menu, scroll-active nav
  isca_2022.jpeg     ← Profile photo (change path in _config.yml → author.photo)
Documents/           ← PDFs linked from publications (CV, papers, slides)
```

---

## Customising the Style

All colors and fonts are CSS variables at the top of `assets/css/main.css`:

```css
:root {
  --accent: #8b0000;       /* dark red — main accent color */
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'DM Sans', -apple-system, sans-serif;
  ...
}
```

Change `--accent` to switch the color scheme site-wide.
