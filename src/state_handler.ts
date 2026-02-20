import isEqual from 'fast-deep-equal'
import type { StateHandler, SubscriptionCallback } from './types'

const create_state_handler = (): StateHandler => {
  const state: Record<string, unknown> = {}
  let subscriptions: SubscriptionCallback[] = []

  const update_state = (variable: string, value: unknown): boolean => {
    // Replace old state with new state, report if value has actually changed
    const old_state = Object.assign({}, state)
    state[variable] = value
    if (isEqual(old_state, state)) return false
    return true
  }

  const handle_change = (variable: string, value: unknown): void => {
    // Return early if state didn't actually change
    if (!update_state(variable, value)) return
    const old_subscriptions = subscriptions.slice()
    subscriptions = []
    old_subscriptions.map((callback) => callback(state_handler, callback))
  }

  const state_handler: StateHandler = {
    get_state: () => state,
    reset: () => {
      subscriptions = []
    },
    init_variable: (variable: string, value: unknown) => {
      if (state[variable] === undefined) {
        handle_change(variable, value)
      }
    },
    set_variable: (variable: string, value: unknown) => {
      handle_change(variable, value)
    },
    subscribe: (callback: SubscriptionCallback) => {
      subscriptions.push(callback)
    },
  }

  return state_handler
}

export default create_state_handler
