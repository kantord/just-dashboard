export const required = (arg_name) => (args) => {
  if (!args.hasOwnProperty(arg_name)) throw new Error(`Argument '${arg_name}' is required but not supplied.`)
}

export const regexp = (arg_name, expression) => (args) =>{
  if (!args[arg_name].match(expression)) throw new Error(`Argument '${arg_name}' is invalid`)
}
