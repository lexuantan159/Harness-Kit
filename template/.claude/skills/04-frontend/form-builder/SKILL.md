---
name: form-builder
description: Build forms with validation, error display, accessibility and safe submission, using the project's form library. Use for any create/edit form, wizard, or input-heavy screen.
---

# Form builder

1. Use the project's form library (React Hook Form, Formik, VeeValidate, Angular Reactive Forms,
   server-side forms) and the shared input components.
2. **Schema-driven validation** - one schema (zod/yup/class-validator) shared with or mirrored
   from the server. Server validation is still the source of truth.
3. **Fields** - `<label for>` on every input, correct `type`/`inputmode`/`autocomplete`,
   required marked visually and with `aria-required`.
4. **Errors** - show per-field messages next to the field (`aria-describedby`, `aria-invalid`),
   validate on blur then on change, summary + focus first error on submit; map server 400/422
   field errors back onto fields.
5. **Submission** - disable while submitting, prevent double submit, show success/failure,
   keep user input on failure, idempotency for payment-like actions.
6. **Security** - CSRF token for cookie auth; never trust hidden fields; sanitise rich text server-side.
7. **Tests** - fill and submit happy path, each validation rule, server error mapping, keyboard-only.
