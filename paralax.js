//html setup
var itemHTMLCllection = document.getElementsByClassName('paralax-item');
var itemsArray = Array.from(itemHTMLCllection); //make an array

// input setup
var input = {
    mouseX:{
        start:0,
        end:window.innerWidth,
        current:0,
    },
    mouseY: {
        start:0,
        end:window.innerHeight,
        current:0,
    }
};

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
    zIndex:{
        range:10000
    }
}

output.x.range = output.x.end - output.x.start;
output.y.range = output.y.end - output.y.start;

var mouse = {
    x:0,
    y:0
}

var updateOutputs = function() {
    // output x and y
    output.x.current = output.x.end - (input.mouseX.fraction * output.x.range);
    output.y.current = output.y.end - (input.mouseY.fraction * output.y.range);
}

var updateInputs = function() {
    // mouse x input
    input.mouseX.current =  mouse.x;
    input.mouseX.fraction = (input.mouseX.current - input.mouseX.start) / input.mouseX.range;

    //mouse y input
    input.mouseY.current = mouse.y;
    input.mouseY.fraction = (input.mouseY.current - input.mouseY.start) / input.mouseY.range;
}

var  updateEachParalaxItem = function () {
    //apply output to html
    itemsArray.forEach(function(item, k){
        var depth = parseFloat(item.dataset.depth, 10);
        console.log(k, 'depth', depth);
        var itemOutput = {
            x: output.x.current - (output.x.current * depth),
            y: output.y.current - (output.y.current * depth),
            zIndex: output.zIndex.range - (output.zIndex.range * depth)
        };
        item.style.zIndex = itemOutput.zIndex;
        item.style.transform = 'translate('+itemOutput.x+'px, '+itemOutput.y+'px)';
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
}

window.addEventListener('mousemove', handleMouseMove)
window.addEventListener('resize', handleResize)