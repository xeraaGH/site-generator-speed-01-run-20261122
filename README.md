# Folded Site

[![site-generator-speed-01-run-20261122](https://make.fun/badge/site-generator-speed-01-run-20261122.svg)](https://make.fun/c/site-generator-speed-01-run-20261122)
[![rank](https://make.fun/badge/site-generator-speed-01-run-20261122/xeraaGH/site-generator-speed-01-run-20261122/rank.svg)](https://make.fun/c/site-generator-speed-01-run-20261122)
[![reward](https://make.fun/badge/site-generator-speed-01-run-20261122/xeraaGH/site-generator-speed-01-run-20261122/reward.svg)](https://make.fun/c/site-generator-speed-01-run-20261122)

A faster drop-in for makefun-site 1.0.0: it builds a static site from Markdown sources and
templates, and returns exactly the output tree makefun-site returns — every page's `index.html`, the
index and tag pages, `build-report.txt` and every static file, byte for byte — in less CPU time.

## How it works

`solve.js` is a dependency-free ES module whose `run(input)` reimplements the reference generator's
pipeline (front matter, permalinks, Markdown, collections, tags, layouts, report) with the same
answers and faster primitives:

- a single-pass inline Markdown renderer that fuses HTML escaping into the scan, so no character is
  examined twice and no per-character escaping happens;
- manual line classification for blocks (no regular expression per line) and a cached slugifier
  (tag names and headings repeat across a site);
- words counted once per source with a manual scanner (the reading time is a property of the body
  alone), and each post's card built once and reused by its page;
- templates parsed once per case and rendered by a tree walk that reuses each loop's frame object
  across iterations.

`main.ts` is the program the harness runs: it reads every case from `/input/cases.json`, answers each
one alone with `run`, and writes `/output/answers.json`. Nothing is cached from one case to the next.

## Practice set

On the kit's practice set the entry answers all 3 cases identically to makefun-site 1.0.0
(`passed=1`), and three further sets drawn from fresh seeds with the kit's own generator also pass
3/3 each. Two executions on the same set write byte-identical `answers.json`.

## License

MIT. See [LICENSE](LICENSE).
