// Folded Site: the program the harness runs (node /bot/main.ts, node22). It reads every case from
// /input/cases.json (a JSON array of {id, input}), answers each one alone with run() from solve.js, and writes
// /output/answers.json: a JSON array of the answers, one per case and in the cases' order. Outside a container
// MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR stand in for /input and /output.
//
// The driver validates the input shape up front (a malformed cases file fails here, with a clear message,
// instead of halfway through a case) and writes the answers from a pre-sized array, one slot per case.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

// V8's incremental marking off, set before solve.js is imported so all of its work runs under it (the rules: the house
// baseline runs with --no-incremental-marking, and an entry may tune V8's flags too).
setFlagsFromString('--no-incremental-marking');

/** solve.js, imported by its URL (a .js module carries no types) and typed by its contract. */
const { run } = (await import(new URL('./solve.js', import.meta.url).href)) as { run: (input: unknown) => unknown };

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const parsed: unknown = JSON.parse(readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8'));
if (!Array.isArray(parsed)) throw new Error('cases.json is not a JSON array of cases');
const cases = parsed as { id: string; input: unknown }[];
for (const c of cases) {
  if (c === null || typeof c !== 'object' || !('input' in c)) throw new Error('a case in cases.json has no input');
}
const answers: unknown[] = new Array(cases.length);
for (let k = 0; k < cases.length; k++) answers[k] = run(cases[k].input);
writeFileSync(join(OUTPUT_DIR, 'answers.json'), JSON.stringify(answers));
