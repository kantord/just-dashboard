const emuto = async (data: unknown, query: string): Promise<unknown> => {
  const emuto_ = await import('emuto/lib/interpreter')
  return emuto_.default(query)(data)
}

export default emuto
