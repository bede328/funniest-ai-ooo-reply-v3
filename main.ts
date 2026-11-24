// The Funniest AI Out-of-Office Reply — Round 3 entry (make.fun).
// Stdlib-only Node program: validates the one-line reply, writes it to
// output/entry.txt next to this file, then reads it back and compares it
// byte-for-byte so a truncated or altered write can never slip through.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "Out of office. The intern model is covering for me. It has already replied to your email. Twice. Differently.";

const MAX_CHARS = 160;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The reply must be one clean line, 1-160 characters, with no stray
// whitespace at either end — exactly what the sealed scorer checks.
if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  fail(`entry is ${ENTRY.length} characters, must be 1-${MAX_CHARS}`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not start or end with whitespace");
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be only whitespace");
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), "output");
const outFile = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, ENTRY, "utf8");

// Read-back: the file on disk must match the entry byte-for-byte.
const written = readFileSync(outFile, "utf8");
if (written !== ENTRY) {
  fail("read-back mismatch: output/entry.txt differs from the entry");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  fail("read-back mismatch: byte length differs");
}

console.log(`wrote ${outFile} (${ENTRY.length} characters)`);
console.log(ENTRY);
