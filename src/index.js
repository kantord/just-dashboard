import * as d3 from 'd3'
import './style.scss'
import '../dist/fonts.css'
import default_parser from './default_parser'

default_parser({
  'component': 'root',
  'args': {
    'title': 'Hello World from RootComponent'
  },
  'data': [
    {
      'component': 'text',
      'args': {'tagName': 'h1'},
      'data': 'Example dashboard'
    },
    {
      'component': 'text',
      'args': {'tagName': 'h2'},
      'data': 'Nutritional facts'
    },
    {
      'component': 'columns',
      'args': {
        'columns': 4,
        'query': '.[] | { \
          "component": "rows", \
          "data": [\
            {"component": "text", "args": {"tagName": "h3", "align": "center"}, "data": .[0]}, \
            {"component": "chart", "args": {"type": "bar"}, "data": {"columns": [["carbs", .[1]], ["protein", .[2]], ["fat", .[3]]]}} \
          ]\
        }',
      },
      'data': [
        ['tofu', 3, 10, 6],
        ['fried eggs', .8, 14, 15],
        ['black beans', 16, 5, .3],
        ['tomatoes', 4, 1, .2],
      ]
    },
    {
      'component': 'chart',
      'args': {'type': 'bar', 'query': '[.ticker.markets[] | [.market, .price]] | {"columns": .}', 'loader': 'json'},
      'data': 'https://api.cryptonator.com/api/full/btc-usd'
    }
  ]
})(d3.selection())

