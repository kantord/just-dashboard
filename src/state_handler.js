const create_state_handler = () => {
  const state = {}
  let subscriptions = []

  const handle_change = () => {
    const old_subscriptions = subscriptions.slice()
    subscriptions = []
    old_subscriptions.map(callback => callback(state_handler, callback))
  }

  const state_handler = {
    'get_state': () => state,
    'init_variable': (variable, value) => {
      state[variable] = value
      handle_change()
    },
    'set_variable': (variable, value) => {
      state[variable] = value
      handle_change()
    },
    'subscribe': (callback) => {
      subscriptions.push(callback)
    }
  }

  return state_handler
}

export default create_state_handler
