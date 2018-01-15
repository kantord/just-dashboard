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
      'component': 'columns',
      'args': {'columns': 3},
      'data': [
        {'component': 'text', 'args': {'tagName': 'p'}, 'data': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in fringilla risus. Aliquam ac efficitur risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; '},
        {'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'Lorem ipsum dolor sit amet'},
        {'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'Lorem ipsum dolor sit amet'}
      ]
    },
    {
      'component': 'columns',
      'args': {'columns': 4},
      'data': [
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
          'args': {'type': 'pie'},
          'data': {'columns': [
            ['alma', 3],
            ['korte', 1],
            ['barack', 0.5]
          ]}
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
    }
  ]
})(d3.selection())

