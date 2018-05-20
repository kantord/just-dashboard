---
layout: default
title: How to use h1 text
---

# How to use h1 text
Here's an example code regarding the use of h1 text: 

```yaml
dashboard "Example": 
  - 
    h1 text: "Lorem ipsum dolor sit amet"

```
The code above will render a h1 text that looks like this:

![](../screenshots/h1_text.png)

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
        "tagName": "h1"
      },
      "data": "Lorem ipsum dolor sit amet"
    }
  ]
}
```
