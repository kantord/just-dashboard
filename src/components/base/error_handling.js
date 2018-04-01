const show_error_message = (message) => (selection) =>
  selection.append('p').attr('class', 'error').text(message)

export default show_error_message
