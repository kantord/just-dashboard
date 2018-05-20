---
layout: default
title: How to use spline chart
---

# How to use spline chart
Here's an example code regarding the use of spline chart: 

```yaml
dashboard "Example": 
  - 
    spline chart: 
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
        - 
          - "Pears"
          - 10
          - 9
          - 8
          - 8
          - 7
          - 8

```
The code above will render a spline chart that looks like this:

![](../screenshots/spline_chart.png)

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
        "type": "spline",
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
          ],
          [
            "Pears",
            10,
            9,
            8,
            8,
            7,
            8
          ]
        ]
      }
    }
  ]
}
```
