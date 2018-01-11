import * as d3 from 'd3'
import default_parser from './default_parser'

default_parser({
    "component": "root",
    "args": {
        "title": "Hello World from RootComponent"
    },
    "data": [
        {
            "component": "text",
            "args": {"tagName": "h1"},
            "data": "Example dashboard"
        },
        {
            "component": "text",
            "args": {"tagName": "p"},
            "data": "Lorem ipsum dolor sit amet"
        }
    ]
})(d3.selection())
