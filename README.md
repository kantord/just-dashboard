# just-dashboard [![Travis](https://img.shields.io/travis/kantord/just-dashboard/master.svg)]() ![Codecov](https://img.shields.io/codecov/c/github/kantord/just-dashboard/master.svg)

Turn this:
```yaml
dashboard "Food":
  - h1 text: Food
  - h2 text: By caloric content
  - 3 columns:
    - rows:
      - h3 text: Bananas
      - pie chart: {
          "columns": [
            ["Protein", 5], ["Sugar", 10], ["Other carbs", 40], ["Fat", 1]
          ]
        }
    - rows:
      - h3 text: Tofu
      - pie chart: {
          "columns": [
            ["Protein", 30], ["Sugar", 0], ["Other carbs", 40], ["Fat", 3]
          ]
        }
    - rows:
      - h3 text: Peanut butter
      - pie chart: {
          "columns": [
            ["Protein", 20], ["Sugar", 2], ["Other carbs", 20], ["Fat", 50]
          ]
}
```

Into this:

![Screenshot of a dashboard that compares the macronutrients in bananas, tofu and peanut butter.](https://github.com/kantord/just-dashboard/raw/master/screenshot.png "")

To host your dashboard, you can roll your own backend, or:

- Create a public GitHub gist with a file named dashboard.yml or dashboard.json (depending on your preferred format)
- Access it as a shareable dashboard at: `http://bottoml.in/e/{Github username}/{Gist ID}`

In fact, I've created a Gist with the example above: [https://gist.github.com/kantord/2973bdd4ad689642562018bb4091ffbd](https://gist.github.com/kantord/2973bdd4ad689642562018bb4091ffbd); 
thus it's accessible as a dashboard at: [http://bottoml.in/e/kantord/2973bdd4ad689642562018bb4091ffbd](http://bottoml.in/e/kantord/2973bdd4ad689642562018bb4091ffbd)

## Don't repeat yourself
As your dashboard is just data, you can generate it instead of repeating yourself. You can do that by generating the YAML or JSON file yourself, or you can use [jq queries](https://stedolan.github.io/jq/) in your YAML file.

To illustrate that, I've created two separate GitHub Gists. One with only the
data:

```json
{
  "Bananas": [["Protein", 5], ["Sugar", 10], ["Other carbs", 40], ["Fat", 1]],
  "Tofu" : [["Protein", 30], ["Sugar", 0], ["Other carbs", 40], ["Fat", 3]],
  "Peanut butter": [["Protein", 20], ["Sugar", 2], ["Other carbs", 20], ["Fat", 50]]
}
```

And one with a dashboard that contains a component that can fetch the data from
other other gist and turn it into 3 different charts, just like in the manually
created example above:

```yaml
dashboard "Food":
  - h1 text: Food
  - h2 text: By caloric content
  - 3 columns:
    - attr:query: '[to_entries | .[] | {"component": "rows", "data": [
      {"component": "text", "args": {"tagName": "h3"}, "data": .key},
      {"component": "chart", "args": {"type": "pie"}, "data": {"columns": .value}}
    ]}]'
    - data: https://gist.githubusercontent.com/kantord/2b2e3b22cb70be0415a7d50c395fa411/raw/47542f8a3db0d65aeeb48e28ddfaa8feabbc72b5/nutri.json
```

You can see the results for yourself here: [http://bottoml.in/e/kantord/aa4a30d09343f0527b8969ad0810946e](http://bottoml.in/e/kantord/aa4a30d09343f0527b8969ad0810946e)

Using the same principle, you can also loads parts from your dashboard from
other files, or just JSON/CSV data for specific charts.

## Variables
Suppose you are only interested in comparing foods by how much they contain of
a single macronutrient. However, you want to be able to decide which
macronutrient.

In this case, you can use a variable to store which nutrient you're interested
in, and a dropdown to make that variable configurable on your page. Then you
can use some jq magic to transform your date for your chart.

```yaml
dashboard "Food":
  - h1 text: Food
  - dropdown macro=Protein:
    - {"value": "Protein", "text": "Protein"}
    - {"value": "Fat", "text": "Fat"}
    - {"value": "Sugar", "text": "Sugar"}
    - {"value": "Other carbs", "text": "Other carbs"}
  - h2 text: By ${macro} content
  - bar chart:
    - attr:query: '{"columns": [to_entries | .[] | [.key, (.value | .[] | select(.[0] == "${macro}"))[1] ]]}'
- data: https://gist.githubusercontent.com/kantord/2b2e3b22cb70be0415a7d50c395fa411/raw/47542f8a3db0d65aeeb48e28ddfaa8feabbc72b5/nutri.json
```

![Screenshot of a dashboard that uses a dropdown to configure charts](https://github.com/kantord/just-dashboard/raw/master/screenshot_variables.png "")

Try it live: [https://bottoml.in/e/kantord/866ebc270b4e0db5389b7de9bf181430](https://bottoml.in/e/kantord/866ebc270b4e0db5389b7de9bf181430)

## Documentation

Documentation is available at: [https://kantord.github.io/just-dashboard/](https://kantord.github.io/just-dashboard/)
Here's a gallery of supported components: [https://github.com/kantord/just-dashboard/blob/master/component_gallery/component_gallery.md](https://github.com/kantord/just-dashboard/blob/master/component_gallery/component_gallery.md])

## Using your own backend

If you want to create a public dashboard, it's enough to simply link resources that you host, for example:
```yaml
dashboard "Hello World":
  bar chart:
    https://my-awesome-backend.com/api/get_data
```

If Gists don't work for you, for example because you need to implement authentication, you'll have to host a frontend for yourself.

Install just-dashboard from npm:
```npm install --save just-dashboard```

Here's a minimal example on using it as your project's frontend:
```javascript
import { json_parser, yaml_parser } from 'just-dashboard'
import * as d3 from 'd3'

// Load data
const dashboard_yaml = ... // Load your YAML here
const dashboard = yaml_parser(dashboard_yaml)

// Create render function
const render_dashboard = json_parser(dashboard)

// Render dashboard
render_dashboard(d3.select("body"))

```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkantord%2Fjust-dashboard.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkantord%2Fjust-dashboard?ref=badge_large)
