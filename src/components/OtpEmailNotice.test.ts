import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { OtpEmailNotice } from './Feedback'

describe('OtpEmailNotice', () => {
  it.each([
    ['en', "If you don't see the e-mail, check your spam or junk folder."],
    ['vi', 'Nếu không thấy email, hãy kiểm tra thư mục thư rác (Spam/Junk).'],
  ] as const)('renders the %s reminder as an informational status', (locale, message) => {
    const markup = renderToStaticMarkup(createElement(OtpEmailNotice, { locale }))

    expect(markup).toContain('role="status"')
    expect(markup).toContain(message.replaceAll("'", '&#x27;'))
  })
})
