# Smart Suggestions + Disclaimer + Admin (Task 7)

## Smart Suggestions

- Endpoint: `GET /api/v1/cars/suggestions`
- Scoring based on:
  - Brand match (+40)
  - Model match (+30)
  - Year proximity (+5 to +20)
  - Price range (+15)
  - Good body condition (+5)
- UI: horizontal scroll cards on car detail page (`SimilarCars` component)

## Disclaimer

- Full page at `/disclaimer`
- Short version shown on every car detail page with link to full text
- Covers: role of workshop, seller duties, buyer duties, liability waiver

## Admin Panel

- Route: `/admin`
- Lists all active cars
- Allows admin soft-delete
- Currently protected by role check (`Admin`)
- Note: in-memory auth creates users as Owner; real Admin role will be assigned after Prisma integration
