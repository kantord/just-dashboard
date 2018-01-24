import dashboard from './index.js'
import * as d3 from 'd3'

const render_dashboard = (data) =>
  dashboard(data)(d3.selection())

render_dashboard(
  {
    'component': 'root',
    'args': {'title': 'Cereals'},
    'data': [
      {'component': 'text',
        'args': {'tagName': 'h1'},
        'data': 'Cereals'
      },
      {'component': 'text',
        'args': {'tagName': 'h2'},
        'data': 'By calories'
      },
      {'component': 'chart',
        'args': {'type': 'bar', 'loader': 'csv', 'query': '{"columns": [(sort_by(-(.calories | tonumber)) | .[] | [.name, .calories])]}'},
        'data': 'https://gist.githubusercontent.com/ZeningQu/6184eaf8faa533e320abc938c4738c3e/raw/40f237de825061faa8721c2293b79c46979780b4/cereals.csv'
      },
      {'component': 'text',
        'args': {'tagName': 'h2'},
        'data': 'By nutritional profile'
      },
      {'component': 'columns',
        'args': {'loader': 'csv', 'columns': 4, 'query': '.[] | {"component": "rows", "data": [{"component": "text", "args": {"tagName": "h3"}, "data": .name}, {"component": "chart", "args": {"type": "pie"}, "data": {"columns": [["protein", .protein], ["carbo", .carbo], ["sugars", .sugars], ["fat", .fat]]}}]}'},
        'data': 'https://gist.githubusercontent.com/ZeningQu/6184eaf8faa533e320abc938c4738c3e/raw/40f237de825061faa8721c2293b79c46979780b4/cereals.csv'
      }
    ]
  })
