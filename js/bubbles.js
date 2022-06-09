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

  function Bubble(canvas, context, options) {
    const { maxRadius, minRadius } = options;
    const colorSet = options.colorSet;
    const mouseRadius = options.mouseRadius;
    let mouseX = 0;
    let mouseY = 0;
    let x = random(maxRadius, canvas.width - maxRadius);
    let y = random(maxRadius, canvas.height - maxRadius);
    let dx = random(-3, 3);
    let dy = random(-3, 3);
    let radius = random(minRadius, maxRadius);
    const startRadius = radius;

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

      resize(mouseRadius);
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

    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let bubble of bubbles) {
        bubble.setMouseXY(mouseX, mouseY);
        bubble.move();
      }
      requestAnimationFrame(animate);
    }

    return function () {
      generateBubbles();
      animate();
    };
  };
})();

const instance = canvasBubbles('canvasBubbles', {
  colorSet: ['', '#d32821', '#53a66f', '#5db5f8'],
  mouseRadius: 100,
  countBubbles: 100,
  minRadius: 7,
  maxRadius: 20,
  count: 10,
});

const instance2 = canvasBubbles('canvasBubbles2');

instance();
instance2();
