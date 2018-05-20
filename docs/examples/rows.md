---
layout: default
title: How to use rows
---

# How to use rows
Here's an example code regarding the use of rows: 

```yaml
dashboard "Example": 
  - 
    2 columns: 
      - 
        rows: 
          - 
            h2 text: "Lorem ipsum dolor sit amet"
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
      - 
        rows: 
          - 
            h2 text: "Lorem ipsum dolor sit amet"
          - 
            p text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dolor massa, luctus rhoncus justo vel, cursus placerat ligula. Proin pulvinar ipsum in enim rutrum, quis fermentum ex finibus. Nunc commodo urna tellus, tristique tempor magna tempor eget. Phasellus eu ex lacinia sapien viverra fermentum."

```
The code above will render a rows that looks like this:

![](../screenshots/rows.png)

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
      "component": "columns",
      "args": {
        "columns": 2
      },
      "data": [
        {
          "component": "rows",
          "data": [
            {
              "component": "text",
              "args": {
                "tagName": "h2"
              },
              "data": "Lorem ipsum dolor sit amet"
            },
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
        },
        {
          "component": "rows",
          "data": [
            {
              "component": "text",
              "args": {
                "tagName": "h2"
              },
              "data": "Lorem ipsum dolor sit amet"
            },
            {
              "component": "text",
              "args": {
                "tagName": "p"
              },
              "data": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dolor massa, luctus rhoncus justo vel, cursus placerat ligula. Proin pulvinar ipsum in enim rutrum, quis fermentum ex finibus. Nunc commodo urna tellus, tristique tempor magna tempor eget. Phasellus eu ex lacinia sapien viverra fermentum."
            }
          ]
        }
      ]
    }
  ]
}
```
