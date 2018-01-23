import dashboard from './index.js'
import * as d3 from 'd3'

const render_dashboard = (data) =>
  dashboard(data)(d3.selection())

render_dashboard(
  {
    'component': 'root',
    'args': {'title': 'Hello World'},
    'data': [
      {'component': 'text',
        'args': {'tagName': 'h1'},
        'data': 'Hello World!'
      },
      {'component': 'text',
        'args': {'tagName': 'h2'},
        'data': 'Lorem ipsum dolor sit amet'
      },
      {'component': 'text',
        'args': {'tagName': 'p', 'loader': 'json'},
        'data': 'http://www.vizgr.org/historical-events/search.php?format=json&begin_date=-3000000&end_date=20151231&lang=pt'
      }
    ]
  })
