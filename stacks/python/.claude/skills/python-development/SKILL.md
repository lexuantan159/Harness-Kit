---
name: python-development
description: Python conventions - environments, packaging, typing, validation, testing with pytest. Use for any Python code change in this project.
---

# Python development

## Tooling
- Use the project's tool (uv, poetry, pip-tools, pipenv) and its lock file; work in a virtualenv,
  never the system interpreter.
- Respect `requires-python`. Format/lint with the configured tools (ruff, black, isort, mypy).
- New dependencies need approval; prefer the stdlib (`pathlib`, `dataclasses`, `itertools`,
  `functools`, `concurrent.futures`).

## Code
- Type hints on public functions; `dataclasses` or pydantic models for structured data.
- Validate external input (pydantic / marshmallow / framework forms).
- Context managers for resources; `pathlib` for paths; f-strings, but logging with `%s` args.
- Specific exceptions; never bare `except:`; re-raise with `raise ... from e`.
- Timeouts on every HTTP call (`requests.get(url, timeout=10)`).
- No mutable default arguments.

## Tests
pytest with fixtures and `parametrize`; `tmp_path` for files; `monkeypatch`/`freezegun` for env
and time; no real network. Run one test: `pytest path/test_x.py::test_name -q`.

## Pitfalls
Naive datetimes (use timezone-aware UTC), float money (use `Decimal`), SQL via f-strings, pickle
on untrusted data, `yaml.load` without `SafeLoader`.
