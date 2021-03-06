# Bubbles-connection

This is javascript module that draws cool effect on the canvas

### Screenshot

![Screenshot](./images/screenshot.png)

### Demo

[codesandbox.io](https://codesandbox.io/s/bubbles-connect-usdzj9)

### Installation

1. Put bubbles-connection.js in your project
2. HTML:
   ```html
   <canvas id="canvasId"></canvas>
   <script src="bubbles-connection.js"></script>
   ```
3. Javascript:
   ```javascript
   const instance = bubblesConnection('canvasId');
   instance();
   ```
   More styling options:

```javascript
const instance = bubblesConnection('canvasId', {
  colorSet: ['', '#d32821', '#53a66f', '#5db5f8'],
  countBubbles: 100,
  maxSpeed: 0.5,
  minRadius: 3,
  maxRadius: 3,
  threshold: 200,
  lineColor: '#000000',
});
instance();
```

**Properties**

- **colorSet**: `Array` (`['', '#d32821', '#53a66f', '#5db5f8']` by default) Array of bubble colors in HEX format
- **countBubbles**: `Number` (`100` by default) Number of bubbles
- **maxSpeed**: `Number` (`3` by default) Maximum bubble speed
- **minRadius**: `Number` (`3` by default) Minimum bubble radius
- **maxRadius**: `Number` (`3` by default) Maximum bubble radius
- **threshold**: `Number` (`200` by default) Threshold where connections between bubbles disappear
- **lineColor**: `String` (`#000000` by default) Color of the connectins
