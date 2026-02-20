
const emuto = async (data, query) => {
  const emuto_ = await import('emuto/lib/interpreter')
	console.log(emuto_) // eslint-disable-line
  return emuto_.default(query)(data)
}

export default emuto
