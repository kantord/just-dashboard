---
layout: default
title: How to use pie chart
---

# How to use pie chart
Here's an example code regarding the use of pie chart: 

```yaml
dashboard "Example": 
  - 
    pie chart: 
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
The code above will render a pie chart that looks like this:

![](../screenshots/pie_chart.png)

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
        "type": "pie",
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
