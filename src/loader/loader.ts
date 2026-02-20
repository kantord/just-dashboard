const loader = (require_: (path: string) => unknown) => (component: string) =>
  require_(`../components/${component}`)

export default loader
