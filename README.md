<h1 align="center">just-dashboard</h1>


<p align="center">
  <a href="https://kantord.github.io/just-dashboard/">Documentation</a> •
  <a href="https://kantord.github.io/just-dashboard/getting-started">Getting started</a> •
  <a href="https://kantord.github.io/just-dashboard/components.html">Chart types</a>
</p>

 [![Travis](https://img.shields.io/travis/kantord/just-dashboard/master.svg)]() ![Codecov](https://img.shields.io/codecov/c/github/kantord/just-dashboard/master.svg)

just-dashboard turns this:
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
