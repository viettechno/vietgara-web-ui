/** A trimmed text field of a form. */
export function formField(form: FormData, name: string): string {
  return String(form.get(name) ?? '').trim()
}

/** A checkbox of a form. */
export function formChecked(form: FormData, name: string): boolean {
  return form.get(name) === 'on'
}

/** Every checked value of a checkbox group. */
export function formValues(form: FormData, name: string): string[] {
  return form.getAll(name).map(String)
}
