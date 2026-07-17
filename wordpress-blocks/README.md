# WordPress Blocks — הפטל של עופר

תיקייה זו היא ה־source of truth לגרסת WordPress.com של האתר.

## מבנה

- `site-manifest.json` — מפת עמודים, קישורים ופרטי עסק.
- `global-styles.json` — צבעים, טיפוגרפיה ורוחבי תוכן.
- `template-parts/header.html` — Header רספונסיבי כ־Gutenberg blocks.
- `template-parts/footer.html` — Footer רספונסיבי עם קישורי קשר ורשתות.
- `pages/home.html` — דף הבית כ־Gutenberg block markup.

## עקרונות

- RTL מלא בעברית.
- Mobile-first.
- צבעי מותג: שמנת, פטל עמוק, ורוד פטל, ירוק עלים ושחור רך.
- כפתורי קשר ברורים ל־WhatsApp, טלפון, Instagram, Facebook, Email ו־Waze.
- שימוש בלוגו הרשמי מתוך `assets/petel-ofer-logo.svg`.
- תוכן עונתי מנוסח ללא הבטחות שאינן ניתנות לאימות.

## סנכרון ל־WordPress

הקבצים נשמרים כ־Gutenberg serialized block markup. לאחר כל שינוי בריפו, יש לעדכן את ה־Template Parts והעמודים המקבילים ב־WordPress.com ולבצע QA במובייל ובדסקטופ.
