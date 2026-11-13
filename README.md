# Portfolio site

Static site, no build step. Open `index.html` in a browser to preview.

## Editing content

Everything is in `data/content.js`: your profile, projects, papers and patents.
Text in `[square brackets]` is a placeholder and shows in amber on the site until you replace it.

- **Add a project:** copy a block in `PROJECTS`, give it a new `id`, and create `assets/img/<id>/`.
- **Feature a project on the landing page:** set `featured: true`.
- **Mark a group project:** set `group: true` and add the tag `"Group project"`.

## Adding images

Drop files in with these names and they appear automatically (jpg, png or webp):

| File | Where it shows |
|---|---|
| `assets/img/profile.jpg` | Landing page and About |
| `assets/img/additive.jpg` | Landing page, workflow section (21:9) |
| `assets/img/<id>/cover.jpg` | Project card (16:10) |
| `assets/img/<id>/hero.jpg` | Top of the project page (21:9) |
| `assets/img/<id>/1.jpg` to `6.jpg` | Project gallery (square) |

Project ids: `mars`, `noark-plus`, `dynabo`, `hoist`, `him`, `atobot`, `finger-orthosis`.

Add `cv.pdf` next to `index.html` for the CV link on the Contact page.

## Colours and fonts

Change the variables at the top of `css/style.css`.

## Publishing on GitHub Pages

1. Create a public repo named `<username>.github.io`.
2. Upload the contents of this folder (not the folder itself) to the repo root.
3. Repo Settings, Pages, deploy from branch `main`, folder `/ (root)`.
