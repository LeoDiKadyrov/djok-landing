# Djok Landing

Single-page landing for **Djok — CS2 Reaction Time Analysis**.

Live: https://djok.din02winchester25.workers.dev

## What this is

Pre-Alpha landing for a manual CS2 demo analysis service. Decomposes every duel into **T0→T1** (perception), **T1→T2** (aim), and **crosshair angle at T0** (pre-aim). Tier-classified against pro ceilings (donk-class), drill prescription per metric.

Pro reference data:
- **donk** peek: T0→T1 = 172ms, T1→T2 = 312ms, crosshair = 5.2° (n=448 FACEIT peeks)
- **karrigan** peek: 203 / 344 / 5.8° (n=224)

## Files

| file | role |
|-|-|
| `index.html` | Single-page landing, EN/RU bilingual via `data-lang` toggle |
| `style.css` | Dark terminal aesthetic, CSS custom properties |
| `data.js` | Static data (reaction time numbers, comparison table) |
| `sample-report.html` | Sample output of a single-demo report |
| `og-image.png` | 1200×630 Open Graph card |
| `generate_og_image.py` | Pillow-based OG image regen script |
| `llms.txt` / `llms-full.txt` | AI-agent-friendly product description (llmstxt.org standard) |
| `robots.txt` / `sitemap.xml` | SEO basics |
| `DEPLOY.md` | Deploy walkthrough (Cloudflare Pages primary + GitHub Pages backup) |

## Deploy

Cloudflare Pages auto-deploys from `main` branch on push. See `DEPLOY.md` for setup.

## Submit a demo

CTA on landing → Tally form → manual analysis → Telegram DM in 48h with `.html` report.

## Stack

Static HTML/CSS/JS, no build step, no framework. Designed to work as `<root>/index.html` with all assets in same folder.

## License

See `LICENSE` (MIT).
