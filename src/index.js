import * as d3 from 'd3'
import default_parser from './default_parser'
import './style.scss'

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
      'args': {'tagName': 'p'},
      'data': 'Lorem ipsum dolor sit amet'
    },
    {
      'component': 'chart',
      'args': {'type': 'pie'},
      'data': {'columns': [
        ['alma', 3],
        ['korte', 1],
        ['barack', 0.5]
      ]}
    },
    {
      'component': 'chart',
      'args': {'type': 'bar'},
      'data': {'columns': [
        ['alma', 3.3],
        ['korte', 3],
        ['barack', 0.5]
      ]}
    }
  ]
})(d3.selection())

