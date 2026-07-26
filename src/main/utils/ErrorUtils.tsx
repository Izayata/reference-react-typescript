import { ValidationError } from 'class-validator'

export const ERR_MSG_COLOR_HEXA = '#8A0017'

export const handleErrorMessages = (e: any): string => {
  const messages = getErrorMessages(e)
  console.log('error messages:', messages)
  if (Array.isArray(messages)) {
    return messages.join('\n')
  }
  
  return e.message
}

export const getErrorMessages = (e: any): string[] | string => {
  const messages: string[] = []
  console.log('e: ', e)
  if (Array.isArray(e)) {
    console.log('inside if array')
    e.forEach((err: ValidationError) => {
      console.log('err.constraints: ', err.constraints)
      if (err.constraints) {
        messages.push(...Object.values(err.constraints).map((i) => '• ' + i))
      }
    })
  }

  console.log('messages array: ', messages)

  return messages.length > 0 ? messages : e.message
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
