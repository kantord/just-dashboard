/* eslint-disable */
import {json_parser, yaml_parser} from './index'
import * as d3 from 'd3'

const cereals_csv = `name,calories,protein,fat,carbo
Corn Flakes,100,2,0,21
Frosted Flakes,110,1,0,26
Raisin Bran,120,3,1,14
Cheerios,110,6,2,17
Special K,110,6,0,16
Rice Krispies,130,2,0,22
Grape Nuts,110,3,0,17
Froot Loops,110,2,1,25`

const render_dashboard = (data: string) => {
  const parserd_yaml = yaml_parser(data)
  const file_loader = (_path: string, callback: (error: unknown, data: string) => void) => {
    callback(undefined, cereals_csv)
  }
  json_parser(parserd_yaml as any, file_loader)(d3.selection())
}

render_dashboard(`
dashboard "Cereals":
  - h1 text:
    - attr:query: '$[0].name'
    - data: file:///cereals.csv
  - h2 text: "By calories"
  - dropdown my_var=~last:
    - {"value": "foo", "text": "Foo"}
    - {"value": "bar", "text": "Bar"}
  - 2 columns:
    - p text: "foo \${my_var} bar"
    - p text: "foo \${my_var} bar"
  - bar chart:
    - attr:query: 'map ($ => [$.name, $.calories * 1]) | sortBy ($ => $[1] * -1) | { "columns": $ }'
    - data: file:///cereals.csv
  - h2 text: "By nutritional profile"
  - 4 columns:
    - attr:query: 'map ($ => {"component": "rows", "data": [{"component": "text", "args": {"tagName": "h3"}, "data": .name}, {"component": "chart", "args": {"type": "pie"}, "data": {"columns": ["protein": .protein, "fat": .fat, "carbo": .carbo]}}]})'
    - data: file:///cereals.csv
`)
