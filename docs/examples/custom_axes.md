---
layout: default
title: How to use custom axes
---

# How to use custom axes
Here's an example code regarding the use of custom axes: 

```yaml
---
  dashboard "Example": 
    - 
      line chart: 
        - 
          attr:axis: 
            x: 
              label: "Year"
              type: "timeseries"
              tick: 
                format: "%Y"
            y: 
              label: "Amount consumed (tonnes)"
        - 
          data: 
            x: "x"
            xFormat: "%Y"
            columns: 
              - 
                - "x"
                - "1999"
                - "2001"
                - "2002"
                - "2004"
                - "2007"
                - "2008"
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
The code above will render a custom axes that looks like this:

![](../screenshots/custom_axes.png)
