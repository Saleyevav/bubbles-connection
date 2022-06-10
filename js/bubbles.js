'use strict';
const canvasBubbles = (function () {
  const defaultOptions = {
    colorSet: ['', '#d32821', '#53a66f', '#5db5f8'],
    mouseRadius: 100,
    countBubbles: 500,
    minRadius: 7,
    maxRadius: 20,
    count: 10,
  };

  function getOpacity(radius, maxRadius) {
    let per = radius / (maxRadius / 100);
    if (per >= 85) return 'E6';
    if (per >= 50 && per < 85) return 'BF';
    if (per >= 25 && per < 50) return '66';
    return '26';
  }

  function random(min, max) {
    let result = 0;
    while (!result) {
      result = Math.floor(Math.random() * (max - min)) + min;
    }
    return result;
  }
  function Connection(a, b) {
    this.x = a.x;
    this.y = a.y;
    this.x2 = b.x;
    this.y2 = b.y;
    this.distance = Math.hypot(b.x - a.x, b.y - a.y);
  }

  function Bubble(canvas, context, options) {
    const { maxRadius, minRadius } = options;
    const colorSet = options.colorSet;
    const mouseRadius = options.mouseRadius;
    let mouseX = 0;
    let mouseY = 0;
    let x = random(maxRadius, canvas.width - maxRadius);
    let y = random(maxRadius, canvas.height - maxRadius);
    let dx = random(-2, 2);
    let dy = random(-2, 2);
    let radius = random(minRadius, maxRadius);
    const startRadius = radius;
    this.x = x;
    this.y = y;
    const nativeColor = colorSet[random(1, colorSet.length)];
    let color = nativeColor + getOpacity(radius, maxRadius);
    const startColor = color;

    function draw() {
      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
    }

    function resize(mouseRadius) {
      if (
        x > mouseX - mouseRadius &&
        x < mouseX + mouseRadius &&
        y > mouseY - mouseRadius &&
        y < mouseY + mouseRadius
      ) {
        color = nativeColor;
        if (radius < 50) {
          radius += 3;
        }
      } else {
        if (radius > startRadius) {
          radius -= 3;
        } else {
          radius = startRadius;
          color = startColor;
        }
      }
    }

    this.move = function () {
      if (x > canvas.width - radius || x < radius) {
        dx = dx * -1;
      }
      if (y > canvas.height - radius || y < radius) {
        dy = dy * -1;
      }
      x += dx;
      y += dy;
      this.x = x;
      this.y = y;
      //resize(mouseRadius);
      draw();
    };

    this.setMouseXY = function (x, y) {
      mouseX = x;
      mouseY = y;
    };
  }

  //---------------------------------------------------------------------
  return function (canvasId, clientOptions) {
    const options = {
      ...defaultOptions,
      ...clientOptions,
    };

    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    let mouseX = undefined;
    let mouseY = undefined;
    canvas.addEventListener('mousemove', function (e) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    });

    window.addEventListener('resize', function () {
      canvas.height = canvas.clientHeight;
      canvas.width = canvas.clientWidth;
    });

    function generateBubbles() {
      const arr = [];
      for (let i = 0; i < options.countBubbles; i++) {
        arr.push(new Bubble(canvas, context, options));
      }
      arr.sort(function (a, b) {
        return a.radius - b.radius;
      });
      return arr;
    }
    const bubbles = generateBubbles();

    function drawLine(x, y, x2, y2, color) {
      context.beginPath();
      context.strokeStyle = color;
      context.moveTo(x, y);
      context.lineTo(x2, y2);
      context.stroke();
    }
    //let connections = [];
    function getConnections(bubbles) {
      if (bubbles.length < 2) {
        return [];
      }
      if (bubbles.length == 2) {
        return Array(new Connection(bubbles[0], bubbles[1]));
      }
      if (bubbles.length > 2) {
        let arrBub = bubbles.slice(1);
        let connections = [];
        for (let bub of arrBub) {
          connections.push(new Connection(bubbles[0], bub));
        }
        return connections.concat(getConnections(arrBub));
      }
    }
    function drawLines(connections, maxDistance, clr) {
      for (let c of connections) {
        if (c.distance < maxDistance) {
          let per = 100 - Math.round(c.distance / (maxDistance / 100));
          if (per < 10) {
            per = '0' + per;
          }
          let color = clr + per;
          drawLine(c.x, c.y, c.x2, c.y2, color);
        }
      }
    }
    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let bubble of bubbles) {
        bubble.setMouseXY(mouseX, mouseY);
        bubble.move();
      }
      drawLines(getConnections(bubbles), 200, '#000000');
      requestAnimationFrame(animate);
    }
    return function () {
      animate();
    };
  };
})();

const instance = canvasBubbles('canvasBubbles', {
  colorSet: ['', '#d32821', '#53a66f', '#5db5f8'],
  mouseRadius: 100,
  countBubbles: 100,
  minRadius: 3,
  maxRadius: 3,
  count: 10,
});

instance();
