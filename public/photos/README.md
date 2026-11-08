# Photo slots

Drop image files here and the site picks them up. Each slot on the site already
states the shot it wants; until a file exists, the slot renders that brief as a
dashed placeholder rather than a broken image.

| File | Where it appears | Shot |
| --- | --- | --- |
| `hero-student-1.jpg` | Home hero, tall left | A student on a phone on campus, natural light, looking down at the screen |
| `hero-student-2.jpg` | Home hero, square | Two students laughing over a laptop, outdoors |
| `hero-student-3.jpg` | Home hero, tall right | A student filming something on a phone tripod |
| `track-referral.jpg` | Ways to earn | A student talking to a small business owner in a shop |
| `track-content.jpg` | Ways to earn | Phone on a gimbal filming a product |
| `track-gigs.jpg` | Ways to earn | Hands on a laptop with a design open |
| `track-tutoring.jpg` | Ways to earn | A student teaching two others at a table |
| `marketplace-hero.jpg` | Marketplace hero | Wide shot of a student working, warm light |
| `profile-1.jpg` … `profile-6.jpg` | Students page | Head-and-shoulders portraits, plain background |
| `business-hero.jpg` | For businesses | A small business owner in their shop |
| `join-side.jpg` | Join page | A student smiling at a phone, vertical |

## Specs

- **Format:** `.jpg` for photos, `.webp` if you can export it.
- **Width:** at least 1600px on the long edge. The site downsizes; it cannot upsize.
- **Crop:** shoot loose. Slots use `object-cover`, so edges get cropped at
  different screen sizes.
- **People:** get permission before publishing anyone's face. The privacy page
  commits to asking first, and that applies to marketing photos too.
