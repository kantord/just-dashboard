const loader = (require_) => (component) => require_(`../components/${component}`)

export default loader
