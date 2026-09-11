# www.stratoweave.org
The StratoWeave web page

This git repository serves the main StratoWeave web page,
https://www.stratoweave.org.

## Serving locally

``` sh
zola serve
```

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
