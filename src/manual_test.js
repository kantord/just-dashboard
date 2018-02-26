/* eslint-disable */
import {json_parser, yaml_parser} from './index.js'
import * as d3 from 'd3'

const render_dashboard = (data) => {
  const parserd_yaml = yaml_parser(data)
  json_parser(parserd_yaml)(d3.selection())
}

render_dashboard(`
dashboard "Cereals":
  - h1 text: "Cereals"
  - h2 text: "By calories"
  - bar chart:
    - attr:query: '{"columns": [(sort_by(-(.calories | tonumber)) | .[] | [.name, .calories])]}'
    - data: https://gist.githubusercontent.com/ZeningQu/6184eaf8faa533e320abc938c4738c3e/raw/40f237de825061faa8721c2293b79c46979780b4/cereals.csv
  - h2 text: "By nutritional profile"
  - 4 columns:
    - attr:query: '.[] | {"component": "rows", "data": [{"component": "text", "args": {"tagName": "h3"}, "data": .name}, {"component": "chart", "args": {"type": "pie"}, "data": {"columns": [["protein", .protein], ["carbo", .carbo], ["sugars", .sugars], ["fat", .fat]]}}]}'
    - data: https://gist.githubusercontent.com/ZeningQu/6184eaf8faa533e320abc938c4738c3e/raw/40f237de825061faa8721c2293b79c46979780b4/cereals.csv
`)
