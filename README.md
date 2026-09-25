# www.stratoweave.org
The StratoWeave web page

This git repository serves the main StratoWeave web page,
https://www.stratoweave.org.

## Serving locally

``` sh
zola serve
```

## Homepage

The content below the hero is in `templates/_home-content.html`, with scoped
styles in `sass/_home-content.scss`. Use descriptive section headings without
eyebrow labels or decorative numbering. Introduce the reference implementation
by its full name rather than assuming visitors know the SORESPO abbreviation.

The Technology page’s content is combined into the homepage. The hero
remains in `templates/index.html`; see
`docs/homepage-hero.md` before touching its markup, styles, or animation.

## Use cases

Use-case pages live under `content/use-cases/`. The section's `weight` ordering
drives the overview cards and primary dropdown.
Each page uses `title` and `description` for its introduction and metadata.

To add a screenshot, put the image under `static/images/use-cases/` and add
the following table to the page's TOML front matter, using the image's actual
dimensions and a descriptive alt text and caption:

```toml
[extra.screenshot]
src = "images/use-cases/ip-transport.png"
alt = "Backbone topology with routers and the status of their connecting links"
caption = "IP transport topology in the SORESPO web UI."
width = 1600
height = 1000
```

Without this table, the page renders without a figure or reserved image space.
Run `zola build` and inspect the pages and dropdown on desktop and mobile after
content or layout changes.

## Writing articles

Add Markdown pages under `content/articles/` with `title`, `description`, and
`date` in their TOML front matter. Under `[extra]`, set `author` to an entry in
`data/authors.toml`, plus `cover`, `cover_alt`, and `social_image` to the article's
image paths relative to `static/`. Use a PNG or JPEG for `social_image`.
The section assigns the article template and lists pages newest first.

Each author entry requires `name`, `bio`, `headshot`, `company`, `company_url`,
and `company_logo`. Add an optional `linkedin_url` for the author’s LinkedIn profile. The article template renders the profile automatically at
the bottom. Keep author details in that central file.

Use the `article_figure` component for diagrams with an accessible description
and caption. The first article is a complete example, including
source permalinks and the review date. Check `zola build` and the rendered page
at desktop and mobile widths before publishing.

## Web UI demo

The tutorial *Exploring the SORESPO Web UI* embeds an interactive demo of the
[sorespo](https://github.com/stratoweave/sorespo) webui, served from
`/demo/webui/`. The demo build is **not** committed: CI builds it from the
sorespo repository on every deploy (see `.github/workflows/main.yml`).

To preview it locally, clone sorespo next to this repository (or set
`SORESPO_DIR`), install [bun](https://bun.sh/), and stage the build into the
gitignored `static/demo/` directory:

``` sh
./scripts/update-webui-demo.sh
zola serve
```
