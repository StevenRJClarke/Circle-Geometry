(function() {

  //Model
  var data = {
    numClick: 0,
    steps: ['Step 1: Click on the canvas to start your circle.', 'Step 2: Click again to choose the size of your circle.'],
    points: [0, 0, 0, 0],
    canvasOrigin: [0, 0, 0, 0],
    pixels: [0, 0, 0, 0],
    pixelWidth: 15,
    radius: 0,
    diameter: 0,
    circumference: 0,
    area: 0
  };

  //Controller
  var controller = {
    getMouseClicks: function(canvasElement, event) {
      let rect;

      //First click
      data.numClick++;

      if(data.numClick == 1) {
        //Get area of canvas relative to viewport
        //on click
        rect = canvasElement.getBoundingClientRect();
        data.canvasOrigin[0] = rect.left;
        data.canvasOrigin[1] = rect.top;

        //Put x and y coordinates of first click
        //into first two elements of points array
        //(in pixels)
        data.points[0] = event.x;
        data.points[1] = event.y;

        //Find the coordinates of the points relative
        //to the origin of the canvas
        data.pixels[0] = data.points[0] - data.canvasOrigin[0];
        data.pixels[1] = data.points[1] - data.canvasOrigin[1];
      }

      //Second click
      if(data.numClick == 2) {
        //Get area of canvas relative to viewport
        //on click
        rect = canvasElement.getBoundingClientRect();
        data.canvasOrigin[2] = rect.left;
        data.canvasOrigin[3] = rect.top;

        //Put x and y coordinates of second click
        //into third and fourth elements of points
        //array (in pixels)
        data.points[2] = event.x;
        data.points[3] = event.y;

        //Find the coordinates of the points relative
        //to the origin of the canvas
        data.pixels[2] = data.points[2] - data.canvasOrigin[2];
        data.pixels[3] = data.points[3] - data.canvasOrigin[3];

        //Reset to 0 clicks
        data.numClick = 0;

        //Calculate the radius joining the two
        //points (using the canvas units)
        this.getRadiusFromClicks();
      }
    },

    showStep: function() {
      //Show next step
      intro.nextStep(data.steps, data.numClick);
    },

    getRadiusFromClicks: function() {
      let x1, y1, x2, y2;

      //Convert the pixels into a unit by scaling (/15)
      x1 = Math.round((data.pixels[0])/data.pixelWidth);
      y1 = Math.round((data.pixels[1])/data.pixelWidth);
      x2 = Math.round((data.pixels[2])/data.pixelWidth);
      y2 = Math.round((data.pixels[3])/data.pixelWidth);

      //Find length of line joining points
      let r = Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));

      //Round up to 1 if below
      if(r == 0) {
        r = 1
      }

      data.radius = r;

      //Output the radius
      radius.showRadius(data.radius);

      //Calculate the diameter
      this.calculateDiameter();

      //Calculate the circumference
      this.calculateCircumference();

      //Calculate the area
      this.calculateArea()
    },

    drawCircle: function(e) {
      canvas.drawCircle(data.numClick, data.canvasOrigin, data.points, data.pixels, e);
    },

    drawCircleFromBox: function() {
      canvas.drawCircleFromBox(data.radius, data.pixelWidth);
    },

    getRadiusFromBox: function(number, e) {
      //User defines the radius
      data.radius = number;

      //Show the radius
      radius.showRadius(data.radius);

      //Calculate the diameter
      this.calculateDiameter();

      //Calculate the circumference
      this.calculateCircumference();

      //Calculate the area
      this.calculateArea()

      //Draw circle
      canvas.drawCircleFromBox(data.radius, data.pixelWidth);
    },

    calculateDiameter: function() {
      //d = 2r
      data.diameter = 2*data.radius;

      //Output the diameter
      diameter.showDiameter(data.diameter);
    },

    calculateCircumference: function() {
      //C = 2πr
      data.circumference = this.roundDecimal(2*Math.PI*data.radius, 2);

      //Output the circumference
      circumference.showCircumference(data.circumference);
    },

    calculateArea: function() {
      //A = πr^2
      data.area = this.roundDecimal(Math.PI*Math.pow(data.radius, 2), 2);

      //Output the area
      area.showArea(data.area);
    },

    //This is a utility to round functions
    //to a decimal place
    roundDecimal: function(number, precision) {
      //Find power of 10 to appropriate number
      //of decimal places (e.g. if want to round
      //to 2 d.p, find 10^2)
      const factor = Math.pow(10, precision);

      //Multiply number by the power of 10 so the
      //decimal place to be rounded is the unit
      let tempValue = number*factor;

      //Round the number to the nearest unit
      tempValue = Math.round(tempValue);

      //Divide by the power of 10 to make the
      //unit the appropriate decimal place again
      return tempValue/factor;
    },

    clear: function() {
      intro.clear(data.steps);
      canvas.clear();
      radius.clear();
      diameter.clear();
      circumference.clear();
      area.clear();
    },

    init: function() {
      intro.init(data.steps);
      canvas.init();
      radius.init();
      diameter.init();
      circumference.init();
      area.init();
      clear.init();
    }
  };

  //View

  //Intro view
  var intro = {
    init: function(steps) {
      //Get step element
      this.step = document.querySelector('.instruction-step');

      //Show the first step
      this.step.innerText = steps[0];
    },

    nextStep: function(steps, clicks) {
      //Go to next step
      this.step.innerText = steps[clicks];
    },

    clear: function(steps) {
      this.step.innerText = steps[0];
    }
  };

  //Canvas view
  var canvas = {
    init: function() {
      //Get canvas elementss
      this.canvasElement = document.getElementById('canvas');
      this.context = this.canvasElement.getContext('2d');

      //Clear canvas
      this.clear();

      //Add a 'click' event listener to canvas
      this.canvasElement.addEventListener('click', function(e) {
        controller.getMouseClicks(this, e);
        controller.showStep();
        controller.drawCircle();
      })

      //Add a 'mousemove' event listener to canvas
      this.canvasElement.addEventListener('mousemove', function(e) {;
        controller.drawCircle(e);
      })
    },

    clear: function() {
      this.context.beginPath();
      this.context.rect(0, 0, 500, 500);
      this.context.closePath();
      this.context.fillStyle = '#f9f9f9';
      this.context.fill();
    },

    drawCircle: function(clicks, origins, points, pixels, e) {
      if(clicks == 1) {
        //Clear canvas
        this.clear();

        //Draw center on click
        this.context.beginPath();
        this.context.arc(pixels[0], pixels[1], 5, 0, 2*Math.PI);
        this.context.closePath();
        this.context.fillStyle = '#000000';
        this.context.fill();

        //Use 'mousemove' event to draw circle
        //up to cursor

        //Find radius from center to cursor
        let r = Math.sqrt(Math.pow(e.x - points[0], 2) + Math.pow(e.y - points[1], 2));

        //Draw circle of this radius
        this.context.beginPath();
        this.context.arc(pixels[0], pixels[1], r, 0, 2*Math.PI);
        this.context.closePath();
        this.context.fillStyle = '#2476C0';
        this.context.fill();

        //But keep the center
        this.context.beginPath();
        this.context.arc(pixels[0], pixels[1], 5, 0, 2*Math.PI);
        this.context.closePath();
        this.context.fillStyle = '#000000';
        this.context.fill();

        //Draw point on cursor
        this.context.beginPath();
        this.context.arc(e.x - origins[0], e.y - origins[1], 5, 0, 2*Math.PI);
        this.context.closePath();
        this.context.fillStyle = '#000000';
        this.context.fill();
      }
    },

    drawCircleFromBox: function(radius, pixelWidth) {
      //Clear canvas
      this.clear();

      //Draw circle centered at center of canvas
      this.context.beginPath();
      this.context.arc(250, 250, radius*pixelWidth, 0, 2*Math.PI);
      this.context.closePath();
      this.context.fillStyle = '#2476C0';
      this.context.fill();
    }
  }

  //Radius view
  var radius = {
    init: function() {
      //Get input element
      this.radiusBox = document.querySelector('input[name=\'radius\']');

      //Add event listener to input
      this.radiusBox.addEventListener('input', function(e) {
        controller.getRadiusFromBox(this.value, e);
      })
    },

    showRadius: function(radius) {
      this.radiusBox.value = controller.roundDecimal(radius, 2);
    },

    clear: function() {
      this.radiusBox.value = '';
    }
  };

  //Diameter view
  var diameter = {
    init: function() {
      //Get input element
      this.diameterBox = document.querySelector('input[name=\'diameter\']');

      //Add event listener to input
      this.diameterBox.addEventListener('input', function(e) {
        let r = this.value/2;
        controller.getRadiusFromBox(r, e);
      })
    },

    showDiameter: function(diameter) {
      this.diameterBox.value = controller.roundDecimal(diameter, 2);
    },

    clear: function() {
      this.diameterBox.value = '';
    }
  };

  //Circumference view
  var circumference = {
    init: function() {
      //Get input element
      this.circumferenceBox = document.querySelector('input[name=\'circumference\']');

      //Add event listener to input
      this.circumferenceBox.addEventListener('input', function(e) {
        let r = this.value/(2*Math.PI);
        controller.getRadiusFromBox(r, e);
      })
    },

    showCircumference: function(circumference) {
      this.circumferenceBox.value = circumference;
    },

    clear: function() {
      this.circumferenceBox.value = '';
    }
  };

  //Area view
  var area = {
    init: function() {
      //Get input element
      this.areaBox = document.querySelector('input[name=\'area\']');

      //Add event listener to input
      this.areaBox.addEventListener('input', function(e) {
        let r = Math.sqrt(this.value/(Math.PI));
        controller.getRadiusFromBox(r, e);
      })
    },

    showArea: function(area) {
      this.areaBox.value = area;
    },

    clear: function() {
      this.areaBox.value = '';
    }
  };

  var clear = {
    init: function() {
      this.clearButton = document.querySelector('.clear-button');

      //Add event listener
      this.clearButton.addEventListener('click', function() {
        controller.clear()
      })
    }
  }

  controller.init();

}());
