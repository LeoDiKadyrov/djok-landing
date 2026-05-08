# Djok Landing — Deploy Guide (No Budget)

Зеро-budget deploy. Cloudflare Pages = primary. GitHub Pages = backup. Обе бесплатные, обе дают рабочий URL без покупки domain.

---

## Option A — Cloudflare Pages (recommended)

**Why:** free `<project>.pages.dev` subdomain, free unlimited bandwidth, free Web Analytics с zero-config (no cookie banner), auto-deploy при push в main.

### Шаги

1. Зарегистрировать Cloudflare account: https://dash.cloudflare.com/sign-up — free.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize GitHub → выбрать `cs2-ddm` repo.
4. Build settings:
   - **Project name:** `djok` _(если занят — попробуй `djok-cs2`, `djok-app`. Запиши финальное имя — потом нужно обновить URL в meta-tags если ≠ `djok`.)_
   - **Production branch:** `main`
   - **Build command:** _(оставить пусто)_
   - **Build output directory:** `landing`
   - **Root directory:** _(оставить пусто = repo root)_
5. **Save and Deploy.** Через ~30 секунд → URL вида `https://djok.pages.dev/`.
6. **Web Analytics setup:**
   - Cloudflare Dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**.
   - Выбрать тот же `djok.pages.dev` URL.
   - Скопировать **beacon token** (32-char hash).
   - В `landing/index.html` найти строку с `data-cf-beacon='{"token": "TOKEN_HERE"}'`, раскомментировать её и заменить `TOKEN_HERE` на реальный token.
   - Push commit → авто-deploy.
7. **Готово.** Tracking активен, нет cookie banner, бесплатно.

### Если `djok` имя занято

Если CF Pages создал project под другим именем (например `djok-cs2.pages.dev`):

```bash
# В landing/index.html и landing/sitemap.xml + landing/robots.txt + landing/llms.txt + landing/llms-full.txt:
# заменить 'djok.pages.dev' на твой фактический <project>.pages.dev
```

Можно одной командой:
```powershell
$old = "djok.pages.dev"
$new = "<your-project>.pages.dev"
gci landing/* -Include "*.html","*.txt","*.xml" | foreach { (gc $_) -replace $old,$new | sc $_ }
```

---

## Option B — GitHub Pages (backup)

**Если CF не подходит:** GitHub Pages бесплатный, deploy через `gh-pages` branch или `/docs` folder. URL вида `https://<github-username>.github.io/cs2-ddm/`.

**Минус:** нет встроенной Web Analytics — придётся ставить Plausible Cloud ($9/мес — НЕ free) или умаmi self-hosted (требует server).

### Шаги

1. GitHub repo → **Settings** → **Pages**.
2. Source: **Deploy from a branch** → `main` branch → folder `/landing`.
3. Save → URL `https://<username>.github.io/cs2-ddm/landing/` (через 1-2 мин).
4. Tracking — defer до момента когда CF не подойдет.

---

## После deploy — обязательные шаги

### 1. Обновить URL в meta-tags (если CF имя ≠ `djok.pages.dev`)

Все упоминания `djok.pages.dev` в файлах:
- `index.html` — `og:url`, `og:image`, `twitter:image`, `canonical`
- `robots.txt` — Sitemap URL
- `sitemap.xml` — все `<loc>` URLs
- `llms.txt` — Public surface section
- `llms-full.txt` — Public surface section

### 2. Проверить OG preview

Telegram: отправь URL себе в избранное → должен показаться preview с og-image (donk 172ms / karrigan 203ms terminal-card).

Если preview ломается:
- проверь что `og-image.png` доступен по `https://<your-url>/og-image.png` напрямую
- проверь absolute URL в `og:image` meta (не относительный)
- Telegram кеширует preview 7 дней — для force-refresh добавь `?v=2` к URL поста

### 3. Submit sitemap в Google Search Console

- https://search.google.com/search-console → Add property → твой URL
- Property → Sitemaps → submit `sitemap.xml`
- Indexing активируется в течение 24-72 часов

### 4. Проверить SEO meta

Тест: https://metatags.io/ → введи свой URL → должны быть:
- title, description (без обрезаний)
- og:image preview (1200×630, не пустой)
- twitter:card preview

---

## Что DEFER

- **Custom domain** ($14/год) — после первых 3-5 paid demos
- **Streamlit Cloud deploy** — Phase 10 в ROADMAP
- **Email capture** — пока CTA через Tally form достаточно
- **A/B testing infra** — Variant A/B/C из WEEKLY.md можно делать manual через CF Pages branch deploy
- **Schema.org расширения** (`Review`, `FAQPage`) — после ≥10 отзывов

---

## Что есть out-of-the-box после deploy

- ✅ Free `<project>.pages.dev` URL (CF) или `<user>.github.io/cs2-ddm/landing/` (GH)
- ✅ HTTPS auto (CF + GH)
- ✅ HTTP/2 + HTTP/3 (CF)
- ✅ Global CDN (CF)
- ✅ Auto-deploy on push to main (CF)
- ✅ Web Analytics free (CF) — после token-paste
- ✅ OG preview (Telegram / FB / LinkedIn / Twitter)
- ✅ JSON-LD SoftwareApplication schema (Google rich results + AI agents)
- ✅ `llms.txt` + `llms-full.txt` (AI-agent-friendly product description)
- ✅ `robots.txt` + `sitemap.xml` (Google indexing)
- ✅ EN/RU bilingual (lang toggle)

---

## Регенерация OG image

Если меняешь anchor цифры (donk/karrigan numbers, n-counts):

```bash
python landing/generate_og_image.py
git add landing/og-image.png && git commit -m "regen og-image"
git push
```

Cloudflare Pages → автоматический redeploy. Telegram-кеш 7 дней — для force-refresh шарь URL с `?v=2`.

---

_Created 2026-05-08 by `/marketing-weekly` voronka completion task._
