# Embed in Repair Shop Website

## Option 1 – iframe (recommended for quick integration)

```html
<iframe
  src="https://YOUR_DOMAIN/embed"
  width="100%"
  height="720"
  style="border: none; border-radius: 16px; max-width: 480px;"
  title="خودروهای موجود"
  loading="lazy"
></iframe>
```

## Option 2 – Full page link

Simply link to:

```
https://YOUR_DOMAIN/cars
```

## Option 3 – Deep link for a specific car

```
https://YOUR_DOMAIN/cars/{carId}
```

## SEO / Traffic benefit

Embedding the car list on the main repair-shop site:
- Increases time-on-page and interaction
- Creates fresh, frequently updated content (good for SEO)
- Encourages customers who come for repair to also browse cars

Make sure the parent page has proper `title` and `description` and that the iframe is not `display:none`.
