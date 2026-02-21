import { createRoot } from 'react-dom/client'
import { Dashboard } from './Dashboard'
import type { ComponentDef, FileLoader } from './types'
import yaml_parser from './yaml-format/parser'

const cereals_csv = `name,calories,protein,fat,carbo
Corn Flakes,100,2,0,21
Frosted Flakes,110,1,0,26
Raisin Bran,120,3,1,14
Cheerios,110,6,2,17
Special K,110,6,0,16
Rice Krispies,130,2,0,22
Grape Nuts,110,3,0,17
Froot Loops,110,2,1,25`

const fileLoader: FileLoader = (_path, callback) => {
  callback(undefined, cereals_csv)
}

const definition = yaml_parser(`
dashboard "Cereals":
  - h1 text:
    - attr:query: '$[0].name'
    - data: file:///cereals.csv
  - h2 text: "Nutrition overview"
  - dropdown nutrient=calories:
    - {"value": "calories", "text": "Calories"}
    - {"value": "protein", "text": "Protein"}
    - {"value": "fat", "text": "Fat"}
    - {"value": "carbo", "text": "Carbohydrates"}
  - 2 columns:
    - bar chart:
      - attr:query: 'map ($ => {"x": $.name, "y": $.\${nutrient} * 1}) | sortBy ($ => $.y * -1)'
      - data: file:///cereals.csv
    - line chart:
      - attr:query: 'map ($ => {"x": $.name, "y": $.\${nutrient} * 1})'
      - data: file:///cereals.csv
  - 2 columns:
    - area chart:
      - attr:query: 'map ($ => {"x": $.name, "y": $.\${nutrient} * 1})'
      - data: file:///cereals.csv
    - scatter chart:
      - attr:query: 'map ($ => {"x": $.calories * 1, "y": $.protein * 1})'
      - data: file:///cereals.csv
  - 2 columns:
    - step chart:
      - attr:query: 'map ($ => {"x": $.name, "y": $.\${nutrient} * 1})'
      - data: file:///cereals.csv
    - spline chart:
      - attr:query: 'map ($ => {"x": $.name, "y": $.\${nutrient} * 1})'
      - data: file:///cereals.csv
`) as ComponentDef

const root = createRoot(document.getElementById('app')!)
root.render(<Dashboard definition={definition} fileLoader={fileLoader} />)
