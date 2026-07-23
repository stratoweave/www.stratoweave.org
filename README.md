# www.stratoweave.org
The StratoWeave web page

This git repository serves the main StratoWeave web page,
https://www.stratoweave.org.

## Serving locally

``` sh
zola serve
```

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
