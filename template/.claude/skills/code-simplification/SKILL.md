---
name: code-simplification
description: Simplify existing code without changing behaviour - remove duplication, dead code, needless abstraction and nesting. Use when code is hard to follow, after a feature works, or when asked to clean up.
---

# Code simplification

Behaviour must not change. Tests are the safety net.

1. **Safety net** - make sure tests cover the code you'll touch; add characterisation tests if not.
2. **Find** - dead code (unused functions, params, flags, branches), duplication, deep nesting,
   long functions, one-implementation interfaces, pass-through layers, clever one-liners.
3. **Simplify, one move at a time**, running tests after each:
   - delete dead code; inline single-use helpers/variables;
   - guard clauses instead of nested ifs; early returns;
   - replace hand-written loops with stdlib (map/filter/stream/comprehension) when clearer;
   - merge duplicates only when they change for the same reason (rule of three);
   - rename for intent.
4. **Stop** when the next change would be a matter of taste.
5. Keep simplification commits separate from behaviour changes (`refactor:`).
