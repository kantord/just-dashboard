---
layout: default
title: How to use stacked spline chart
---

# How to use stacked spline chart
Here's an example code regarding the use of stacked spline chart: 

```yaml
---
  dashboard "Example": 
    - 
      stacked spline chart: 
        columns: 
          - 
            - "Apples"
            - 3
            - 2
            - 3
            - 4
            - 2
          - 
            - "Oranges"
            - 2
            - 1
            - 0
            - 1
            - 1
          - 
            - "Pears"
            - 2
            - 0
            - 0
            - 3
            - 4

```
The code above will render a stacked spline chart that looks like this:

![](../screenshots/stacked_spline_chart.png)
