//html setup
var itemHTMLCllection = document.getElementsByClassName('paralax-item');
var itemsArray = Array.from(itemHTMLCllection); //make an array
var html = document.documentElement;

// input setup
var input = {
    scrollY: {
        start: 0,
        end: html.scrollHeight - window.innerHeight,
        current: 0,
    },
    mouseX: {
        start: 0,
        end: window.innerWidth,
        current: 0,
    },
    mouseY: {
        start: 0,
        end: window.innerHeight,
        current: 0,
    }
};
input.scrollY.range = input.scrollY.end - input.scrollY.start;
input.mouseX.range = input.mouseX.end - input.mouseX.start;
input.mouseY.range = input.mouseY.end - input.mouseY.start;

// output setup
var output = {
    x:{
        start: -150,
        end: 150,
        current: 0,
    },
    y:{
        start: -150,
        end: 150,
        current: 0,
    },
    scrollY:{
        start: 0, //  start: -150,
        end: 800,
        current: 0,
    },
    zIndex:{
        range:10000,
    },
    scale:{
        start: 1,
        end: 0.2,
    },
    blur:{
        startingDepth: 0.1,
        range: 40,//how blurry
    }
}
output.scale.range = output.scale.end - output.scale.start;
output.x.range = output.x.end - output.x.start;
output.y.range = output.y.end - output.y.start;
output.scrollY.range = output.scrollY.end - output.scrollY.start;

var mouse = {
    // in the middle of the window
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
}

var updateInputs = function() {
    // mouse x input
    input.mouseX.current =  mouse.x;
    input.mouseX.fraction = (input.mouseX.current - input.mouseX.start) / input.mouseX.range;

    //mouse y input
    input.mouseY.current = mouse.y;
    input.mouseY.fraction = (input.mouseY.current - input.mouseY.start) / input.mouseY.range;

    // scroll y input
    input.scrollY.current = html.scrollTop;
    input.scrollY.fraction = (input.scrollY.current - input.scrollY.start) / input.scrollY.range;
    console.log('scroll', input.scrollY.current);
}

var updateOutputs = function() {
    // output x and y
    output.x.current = output.x.end - (input.mouseX.fraction * output.x.range);
    output.y.current = output.y.end - (input.mouseY.fraction * output.y.range);

    output.scrollY.current = output.scrollY.start + (input.scrollY.fraction * output.scrollY.range);
}


var  updateEachParalaxItem = function () {
  //apply output to html
  itemsArray.forEach(function (item, i) {
    var depth = parseFloat(item.dataset.depth, 10);
    
    var itemInput = {
      scrollY: {
        start: item.offsetParent.offsetTop,
        end: item.offsetParent.offsetTop + window.innerHeight,
      }
    }
    itemInput.scrollY.range = itemInput.scrollY.end - itemInput.scrollY.start;
    itemInput.scrollY.fraction = (input.scrollY.current - itemInput.scrollY.start) / itemInput.scrollY.range;
    
    var itemOutputYCurrent = output.scrollY.start + (itemInput.scrollY.fraction * output.scrollY.range);
    
    var itemOutput = {
      x: output.x.current - (output.x.current * depth),
      y: (itemOutputYCurrent * depth) + (output.y.current - (output.y.current * depth)),
      zIndex: output.zIndex.range - (output.zIndex.range * depth),
      scale: output.scale.start + (output.scale.range * depth),
      blur: (depth - output.blur.startingDepth) * output.blur.range
    };
    console.log(i, 'fraction', itemInput.scrollY.fraction)
    item.style.filter = 'blur('+itemOutput.blur+'px)'
    item.style.zIndex = itemOutput.zIndex;
    item.style.transform = ' scale('+itemOutput.scale+') translate('+itemOutput.x+'px, '+itemOutput.y+'px)';
  });
}

// make fraction values range from 0 to 1
var handleMouseMove = function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    updateInputs();
    updateOutputs();
    updateEachParalaxItem();
}

var handleResize = function (){
    input.mouseX.end = window.innerWidth;
    input.mouseX.range = input.mouseX.end - input.mouseX.start;

    input.mouseY.end = window.innerHeight;
    input.mouseY.range = input.mouseY.end - input.mouseY.start;

    input.scrollY.end = html.scrollHeight - window.innerHeight;
    input.scrollY.range = input.scrollY.end - input.scrollY.start;
}

var handleScroll = function(){
    updateInputs();
    updateOutputs();
    updateEachParalaxItem();
}

window.addEventListener('mousemove', handleMouseMove)
document.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);

// at the start
updateInputs();
updateOutputs();
updateEachParalaxItem();