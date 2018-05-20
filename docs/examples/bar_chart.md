---
layout: default
title: How to use bar chart
---

# How to use bar chart
Here's an example code regarding the use of bar chart: 

```yaml
dashboard "Example": 
  - 
    bar chart: 
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
The code above will render a bar chart that looks like this:

![](../screenshots/bar_chart.png)

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
        "stacked": false
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
