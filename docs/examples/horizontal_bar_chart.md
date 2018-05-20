---
layout: default
title: How to use horizontal bar chart
---

# How to use horizontal bar chart
Here's an example code regarding the use of horizontal bar chart: 

```yaml
dashboard "Example": 
  - 
    horizontal bar chart: 
      columns: 
        - 
          - "Apples"
          - 3
        - 
          - "Oranges"
          - 2
        - 
          - "Pears"
          - 2

```
The code above will render a horizontal bar chart that looks like this:

![](../screenshots/horizontal_bar_chart.png)

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
        "type": "bar",
        "stacked": false,
        "axis": {
          "rotated": true
        }
      },
      "data": {
        "columns": [
          [
            "Apples",
            3
          ],
          [
            "Oranges",
            2
          ],
          [
            "Pears",
            2
          ]
        ]
      }
    }
  ]
}
```
