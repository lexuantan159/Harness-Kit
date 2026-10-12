---
name: form-builder
description: Use for any create/edit form, wizard, or input-heavy screen. Builds forms with validation, error display, accessibility and safe submission, using the project's form library.
---

# Form Builder

Build forms that guide the user, validate consistently with the server, and submit safely.

## Anti-Pattern: "Client Validation Is Enough"

Client-side checks are a convenience; anyone can bypass them. The server stays the source of
truth, and its errors must land back on the right fields.

## Checklist

1. **Context** - use the project's form library and shared input components
2. **Schema-driven validation**
3. **Fields** - labelled and typed
4. **Errors** - per field, accessible
5. **Submission** - safe and recoverable
6. **Security**
7. **Tests**

## The Process

- **Library:** React Hook Form, Formik, VeeValidate, Angular Reactive Forms, server-side forms.
- **Validation:** one schema (zod/yup/class-validator) shared with or mirrored from the server.
- **Fields:** `<label for>` on every input, correct `type`/`inputmode`/`autocomplete`, required
  marked visually and with `aria-required`.
- **Errors:** per-field messages next to the field (`aria-describedby`, `aria-invalid`); validate
  on blur, then on change; on submit show a summary and focus the first error; map server 400/422
  field errors back onto fields.
- **Submission:** disable while submitting, prevent double submit, show success/failure, keep user
  input on failure, idempotency for payment-like actions.
- **Security:** CSRF token for cookie auth; never trust hidden fields; sanitise rich text
  server-side (`.claude/references/security.md`).
- **Tests:** happy path, each validation rule, server error mapping, keyboard-only.

See `.claude/references/accessibility.md`.

## Key Principles

- The server is the source of truth
- Every input has a label
- Never lose the user's input
- No double submits

## Transition

Server-side validation and endpoint -> `api-development`; then `@tester` and `@reviewer`.
