
const jq = async (...args) => {
  const jq_ = await import(/* webpackChunkName: "jq" */ 'jq-web')
  return jq_(...args)
}

export default jq
