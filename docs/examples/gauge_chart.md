---
layout: default
title: How to use gauge chart
---

# How to use gauge chart
Here's an example code regarding the use of gauge chart: 

```yaml
dashboard "Example": 
  - 
    gauge chart: 
      columns: 
        - 
          - "data"
          - 30

```
The code above will render a gauge chart that looks like this:

![](../screenshots/gauge_chart.png)

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
        "type": "gauge",
        "stacked": false
      },
      "data": {
        "columns": [
          [
            "data",
            30
          ]
        ]
      }
    }
  ]
}
```
