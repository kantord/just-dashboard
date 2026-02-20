export const required =
  (arg_name: string) =>
  (args: Record<string, unknown>): void => {
    if (!Object.hasOwn(args, arg_name)) throw new Error(`Argument '${arg_name}' is required but not supplied.`)
  }

export const regexp =
  (arg_name: string, expression: RegExp) =>
  (args: Record<string, unknown>): void => {
    if (!(args[arg_name] as string).match(expression)) throw new Error(`Argument '${arg_name}' is invalid`)
  }
