## Landing Page: Djok CS2 (`landing/`)

### Dev

```bash
python -m http.server 8000  # Serve at localhost:8000
```

### Files

| File | Role |
|-|-|
| `index.html` | Single-page landing, EN/RU bilingual via `data-lang` toggle |
| `style.css` | All styles — dark terminal aesthetic, CSS custom properties |
| `data.js` | Static data (reaction time numbers, comparison table) |

### Payment & CTA Flow

- No Gumroad. Payment via direct bank transfer (Kaspi/RU).
- CTA opens Tally form — collects SteamID + contact, triggers manual 48h delivery.
- No Stripe integration on this page (future).

### Brand

**Точный. Честный. Технический.** — data instrument, not a gaming product.

Target buyer: FACEIT level 8-10. Respects raw numbers. Distrusts marketing copy.

Anti-references: Aim Lab, Leetify, SaaS gradient heroes, Fiverr-gig feel.

### Design System

```css
--bg:        #0e0e12
--bg-card:   #16161d
--bg-border: #2a2a35
--text:      #e0e0e8
--text-muted:#7a7a90
--accent:    #e8b84b   /* primary gold — donk data, CTAs */
--accent2:   #ff6b35   /* flamez orange */
--success:   #4ecdc4   /* RachelR teal */
--font-body: Space Grotesk (Inter fallback)
--font-mono: JetBrains Mono
--max-w:     720px
```

No gradients. No drop shadows. Borders only. Monospace for numbers.

### Design Principles

1. **Numbers before claims** — every section leads with a real number
2. **One decision per screen** — single CTA, no competing actions
3. **Earn trust through specificity** — "T0→T1: 156ms (donk)" beats vague claims
4. **Terminal aesthetic** — monospace, dark, borders not shadows
5. **Honest about limits** — roadmap shows what's manual; never oversell

Full design context and user personas: `../.impeccable.md`
