# Acton syntax highlighting

`acton.json` is the native Acton TextMate grammar from the
[Acton VS Code extension](https://github.com/actonlang/vscode-acton), version
0.7.0, converted from its `syntaxes/acton.tmLanguage` property list to JSON
without changing its rules. The upstream BSD license is in `ACTON-LICENSE.txt`.

Zola loads it through `markdown.highlighting.extra_grammars` in `config.toml`.
Use `acton` as the fenced code block language for Acton examples. Existing
light and dark highlighting themes apply automatically.
