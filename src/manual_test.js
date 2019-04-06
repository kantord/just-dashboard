/* eslint-disable */
import {json_parser, yaml_parser} from './index.js'
import * as d3 from 'd3'

const render_dashboard = (data) => {
  const parserd_yaml = yaml_parser(data)
  const file_loader = (path, callback) => {
    callback(undefined, 'a,b\nCereals,0')
  }
  json_parser(parserd_yaml, file_loader)(d3.selection())
}

render_dashboard(`
dashboard "Cereals":
  - h1 text: 
    - attr:query: '$[0].a'
    - data: file:///foo/bar.csv
  - h2 text: "By calories"
  - dropdown my_var=~last:
    - {"value": "foo", "text": "Foo"}
    - {"value": "bar", "text": "Bar"}
  - 2 columns:
    - p text: "foo \${my_var} bar"
    - p text: "foo \${my_var} bar"
  - bar chart:
    - attr:query: 'map ($ => [$.name, $.calories * 1]) | sortBy ($ => $[1] * -1) | { "columns": $ }'
    - data: https://gist.githubusercontent.com/ZeningQu/6184eaf8faa533e320abc938c4738c3e/raw/40f237de825061faa8721c2293b79c46979780b4/cereals.csv
  - h2 text: "By nutritional profile"
  - 4 columns:
    - attr:query: 'map ($ => {"component": "rows", "data": [{"component": "text", "args": {"tagName": "h3"}, "data": .name}, {"component": "chart", "args": {"type": "pie"}, "data": {"columns": ["protein": .protein, "fat": .fat, "carbo": .carbo]}}]})'
    - data: https://gist.githubusercontent.com/ZeningQu/6184eaf8faa533e320abc938c4738c3e/raw/40f237de825061faa8721c2293b79c46979780b4/cereals.csv
`)
