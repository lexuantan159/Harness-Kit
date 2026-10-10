// Ponytail instructions injected into the model context, per mode.
'use strict';

const LADDER = `Before writing code, walk this ladder and stop at the first rung that works:
1. YAGNI - is this needed for the current task at all? If not, do not write it.
2. Reuse - does the codebase already have a function, component or pattern for it?
3. Stdlib - does the language standard library or framework already do it?
4. Existing dependency - does a library already in the project do it?
5. New code - write the smallest, plainest version. A new dependency needs the user's approval.`;

const RULES = {
  lite: `PONYTAIL (lite): prefer minimal code.
${LADDER}`,
  full: `PONYTAIL (full): minimal code is a hard rule.
${LADDER}
- No speculative abstractions: no interface with one implementation, no config option nobody asked for,
  no generic helper used once.
- No defensive code for states that cannot happen; validate at system boundaries only.
- Delete before adding: if a change makes code unused, remove it.
- Prefer a flat, boring solution over a clever one. Fewer files, fewer layers, fewer lines.
- When you skip something on purpose, say so in one line instead of building it.`,
  strict: `PONYTAIL (strict): minimal code is a hard rule and every addition must be justified.
${LADDER}
- Everything in "full" mode applies.
- Before editing, state which rung of the ladder you stopped at and why the earlier rungs failed.
- Each new function, file or dependency needs a one-line justification in your reply.
- Reject your own diff if it can be made shorter without losing clarity, then shorten it.`,
};

function instructionsFor(mode) {
  return RULES[mode] || '';
}

module.exports = { instructionsFor };
