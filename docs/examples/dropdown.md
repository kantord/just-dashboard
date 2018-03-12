---
layout: default
title: How to use dropdown
---

# How to use dropdown
Here's an example code regarding the use of dropdown: 

```yaml
---
  dashboard "Example": 
    - 
      dropdown gender=male: 
        - 
          value: "male"
          text: "Male"
        - 
          value: "female"
          text: "Female"

```
The code above will render a dropdown that looks like this:

![](../screenshots/dropdown.png)
