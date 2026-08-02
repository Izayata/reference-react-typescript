import { ValidationError } from 'class-validator'

export const ERR_MSG_COLOR_HEXA = '#8A0017'

export const handleErrorMessages = (e: unknown): string => {
  const messages = getErrorMessages(e)
  if (Array.isArray(messages)) {
    return messages.map((i) => '• ' + i).join('\n')
  }

  return messages
}

export const getErrorMessages = (e: unknown): string[] | string => {
  const messages: string[] = []
  if (Array.isArray(e)) {
    e.forEach((err: ValidationError) => {
      if (err.constraints) {
        messages.push(...Object.values(err.constraints))
      }
    })
  }

  if (messages.length > 0) {
    return messages
  }

  return e instanceof Error ? e.message : String(e)
}

export function DisplayErrors({ error }: { error: string[] | string }) {
  if (!error) return <></>

  if (typeof error === 'string') {
    return <li>{error}</li>
  }

  return (
    <>
      {error.map((msg, idx) => (
        <li key = {idx}>{msg}</li>
      ))
      }
    </>
  )
}
