# just-dashboard [![Travis](https://img.shields.io/travis/kantord/just-dashboard/master.svg)]() ![Codecov](https://img.shields.io/codecov/c/github/kantord/just-dashboard/master.svg)

## Documentation
Documentation is available at: [https://kantord.github.io/just-dashboard/](https://kantord.github.io/just-dashboard/)

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
