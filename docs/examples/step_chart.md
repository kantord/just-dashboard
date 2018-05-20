---
layout: default
title: How to use step chart
---

# How to use step chart
Here's an example code regarding the use of step chart: 

```yaml
dashboard "Example": 
  - 
    step chart: 
      columns: 
        - 
          - "Apples"
          - 30
          - 29
          - 25
          - 26
          - 27
          - 10
        - 
          - "Oranges"
          - 20
          - 21
          - 22
          - 20
          - 27
          - 19

```
The code above will render a step chart that looks like this:

![](../screenshots/step_chart.png)

## JSON format
The YAML above is equivalent to this JSON:
```json
{
  "component": "root",
  "args": {
    "title": "Example"
  },
  "data": [
    {
      "component": "chart",
      "args": {
        "type": "step",
        "stacked": false
      },
      "data": {
        "columns": [
          [
            "Apples",
            30,
            29,
            25,
            26,
            27,
            10
          ],
          [
            "Oranges",
            20,
            21,
            22,
            20,
            27,
            19
          ]
        ]
      }
    }
  ]
}
```
