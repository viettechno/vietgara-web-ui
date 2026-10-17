import type { ChangeEvent } from 'react'
import { Field } from './Field'
import { Input } from './Input'

type OtpInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/** A six-digit field configured for e-mail and authenticator-app one-time passwords. */
export function OtpInput({ label, value, onChange, disabled }: OtpInputProps) {
  const change = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))

  return (
    <Field label={label}>
      <Input
        className="h-12 text-center font-mono text-title tracking-[0.5em]"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        required
        autoFocus
        value={value}
        onChange={change}
        disabled={disabled}
      />
    </Field>
  )
}
