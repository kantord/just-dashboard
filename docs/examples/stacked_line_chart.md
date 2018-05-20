---
layout: default
title: How to use stacked line chart
---

# How to use stacked line chart
Here's an example code regarding the use of stacked line chart: 

```yaml
dashboard "Example": 
  - 
    stacked line chart: 
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
The code above will render a stacked line chart that looks like this:

![](../screenshots/stacked_line_chart.png)
