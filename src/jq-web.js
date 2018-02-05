const jq = async (data, query) => {
  const jq_ = (await import(/* webpackChunkName: "jq" */ 'jq-in-the-browser')).default
  return jq_(query)(data)
}

export default jq
