export function expectErrorMessages(fn: () => void, expectedMessages: string[], expectedCount: number) {
  try {
    fn()
    throw new Error('Expected error was not thrown')
  } catch (errors) {
    let allMessages: string[] = []
    if (Array.isArray(errors)) {
      allMessages = errors.flatMap((err: any) =>
        err.constraints ? Object.values(err.constraints) : []
      )
    } else if (errors && typeof errors === 'object' && 'constraints' in errors) {
      allMessages = Object.values((errors as any).constraints)
    }
    
    // Assert all expected messages are present
    expectedMessages.forEach(msg => expect(allMessages).toContain(msg))

    // Assert the number of errors matches
    expect(allMessages.length).toBe(expectedCount)
  }
}
