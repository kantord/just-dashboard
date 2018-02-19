/* eslint-disable no-alert, no-console */
import {json_parser, yaml_parser} from './index.js'
import * as d3 from 'd3'

const render_dashboard = (data) => {
  const parserd_yaml = yaml_parser(data)
  json_parser(parserd_yaml)(d3.selection())
}

render_dashboard(`
dashboard "Cereals":
  - h1 text: "Cereals"
  - dropdown foo=h2:
    - {"value": "h2", "text": "h2"}
    - {"value": "p", "text": "p"}
  - \${foo} text: "By calories"
  - h3 text: "Cereals \${foo}"
  - columns:
    - h3 text: "Cereals \${foo}"
    - h3 text: "Cereals \${foo}"
`)
