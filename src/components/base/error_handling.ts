import type { D3Selection } from '../../types'

const show_error_message = (message: string) => (selection: D3Selection) =>
  selection.append('p').attr('class', 'error').text(message)

export default show_error_message
