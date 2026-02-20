const emuto = async (data: unknown, query: string): Promise<unknown> => {
  const emuto_ = await import('emuto/lib/interpreter')
  console.log(emuto_) // eslint-disable-line
  return emuto_.default(query)(data)
}

export default emuto
