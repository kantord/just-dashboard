declare module 'emuto/lib/interpreter' {
  const interpreter: (query: string) => (data: unknown) => unknown
  export default interpreter
}
