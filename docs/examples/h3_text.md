---
layout: default
title: How to use h3 text
---

# How to use h3 text
Here's an example code regarding the use of h3 text: 

```yaml
dashboard "Example": 
  - 
    h3 text: "Lorem ipsum dolor sit amet"

```
The code above will render a h3 text that looks like this:

![](../screenshots/h3_text.png)

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
      "component": "text",
      "args": {
        "tagName": "h3"
      },
      "data": "Lorem ipsum dolor sit amet"
    }
  ]
}
```
