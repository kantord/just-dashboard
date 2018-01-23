
const jq = async (a, b) => {
  const jq_ = await import(/* webpackChunkName: "jq" */ 'jq-web')
  return jq_(a, b)
}

export default jq
