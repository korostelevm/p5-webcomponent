# p5-webcomponent

- renderes as custom element
- framework agnostic, use with react, vue, etc
- use global mode sketches (don't have to prefix every p5 method with an instance name) 
- loads remote or local hosted sketches 
- multiple sketches in page

### how to use
include component library
```html
<script src="https://p5.cyclic.app/p5-webcomponent.js"></script>
```

use global mode sketch file as source parameter
```html
<p5-sketch name="1" src="./sketch.js"></p5-sketch>
```
* sketch can also  be remotely hosted

![](screenshot.png) 
