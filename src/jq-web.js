
const jq = async (...args) => {
  const jq_ = await import(/* webpackChunkName: "jq-web" */ 'jq-web')
console.log(jq_) // eslint-disable-line
  return jq_.default(...args)
}

export default jq
