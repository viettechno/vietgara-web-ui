import { describe, expect, it } from 'vitest'
import { formChecked, formField, formValues } from './form'
import { formatSeconds } from './useCountdown'
import { useDebouncedValue } from './useDebouncedValue'

describe('shared form helpers', () => {
  it('normalizes text and checkbox values', () => {
    const form = new FormData()
    form.set('name', '  Mai  ')
    form.append('roles', 'owner')
    form.append('roles', 'staff')
    form.set('enabled', 'on')
    expect(formField(form, 'name')).toBe('Mai')
    expect(formValues(form, 'roles')).toEqual(['owner', 'staff'])
    expect(formChecked(form, 'enabled')).toBe(true)
  })
})

describe('shared time helpers', () => {
  it('formats whole seconds', () => expect(formatSeconds(65)).toBe('1:05'))
  it('exports the debounce hook', () => expect(useDebouncedValue).toBeTypeOf('function'))
})
