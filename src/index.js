import * as d3 from 'd3'
import parse from './parser/parser.js'
import loader from './loader/loader.js'
import RootComponent from './components/root'

parse((component) => ({
    "root": RootComponent
}[component]))({
    "component": "root",
    "args": {
        "title": "Hello World from RootComponent"
    }
})(d3.selection())
