import _ from 'lodash'

const create_state_handler = () => {
  const state = {}
  let subscriptions = []

  const update_state = (variable, value) => {
    // Replace old state with new state, report if value has actually changed
    const old_state = Object.assign({}, state)
    state[variable] = value
    if (_.isEqual(old_state, state)) return false
    return true
  }

  const handle_change = (variable, value) => {
    // Return early if state didn't actually change
    if (!update_state(variable, value)) return
    const old_subscriptions = subscriptions.slice()
    subscriptions = []
    old_subscriptions.map(callback => callback(state_handler, callback))
  }

  const state_handler = {
    'get_state': () => state,
    'init_variable': (variable, value) => {
      if (state[variable] === undefined) {
        handle_change(variable, value)
      }
    },
    'set_variable': (variable, value) => {
      handle_change(variable, value)
    },
    'subscribe': (callback) => {
      subscriptions.push(callback)
    }
  }

  return state_handler
}

export default create_state_handler
