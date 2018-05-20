import yaml_parser from '../src/yaml-format/parser'
import getStdin from 'get-stdin'

getStdin().then(str => {
    console.log(JSON.stringify(yaml_parser(str), null, 2));
});
