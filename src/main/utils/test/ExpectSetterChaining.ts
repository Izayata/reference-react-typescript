export function expectSetterReturnsSameInstance<T>(builder: T, invokeSetter: (builder: T) => T) {
  expect(invokeSetter(builder)).toBe(builder)
}
