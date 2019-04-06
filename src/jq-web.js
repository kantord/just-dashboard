
const emuto = async (data, query) => {
  const emuto_ = await import(/* webpackChunkName: "emuto" */ 'emuto/lib/interpreter')
	console.log(emuto_) // eslint-disable-line
  return emuto_.default(query)(data)
}

export default emuto
