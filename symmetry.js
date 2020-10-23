const tutorial_canvas = document.getElementById("tutorial");
const rotator = document.getElementById("rot");
const color = document.getElementById("color");
const tutorial_canvas_context = tutorial_canvas.getContext('2d');
tutorial_canvas.style.background = "black"

let flex = tutorial_canvas.getBoundingClientRect();
let tip = {}
let xs
let ys


let bigcolor = "blue"
rotator.addEventListener('input', function () {
    middle.cuts = rotator.value
    middle.cutter = (Math.PI*2)/middle.cuts
  }, false);

  color.addEventListener('input', function () {
      bigcolor = color.value
    }, false);

let oldcirc = {x: 350, y:350}
let circ = {x: 350, y:350}




window.addEventListener('mousedown', e => {
    flex = tutorial_canvas.getBoundingClientRect();
    xs = e.clientX - flex.left;
    ys = e.clientY - flex.top;
    tip.x = xs
    tip.y = ys
    tip.body = tip
    tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)


});
// window.addEventListener('mousemove', e => {
  
// });


    class Center{
        constructor(){
            this.body = new Bosscircle(tutorial_canvas.width*.5, tutorial_canvas.height*.5, 0, "transparent")
            this.cuts = 6
            this.angle = 0
            this.nodes = []
            this.cutnodes = []
            this.angleRadians = 0
            this.cutter = 0
            this.cutter = (Math.PI*2)/this.cuts
        }
        getCut(point){
            this.angleRadians = Math.atan2(this.body.y - point.y, this.body.x - point.x);
            let cutter = (Math.PI*2)/this.cuts
            this.cutter = (Math.PI*2)/this.cuts
            // console.log(cutter, this.angleRadians)
            for(let t = 0; t<this.cuts; t++){
                if(this.angleRadians > 0){
                    if(t*cutter < this.angleRadians && this.angleRadians < ((t+1)*cutter)){
                        return t
                    }
                }else{
                    if(t*-cutter > this.angleRadians && this.angleRadians > ((t-1)*-cutter)){
                        return t
                    }
                }
            }

        }
    }


    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            const xdif = this.x1-this.x2
            const ydif = this.y1-this.y2
            const hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }
    class Bosscircle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
        }       
         draw(){   
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.lineWidth = 0
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        spindraw(point){

            this.angleRadians = Math.atan2(this.y - middle.body.y, this.x - middle.body.x);
            let xhold = this.x
            let yhold = this.y

            this.angleRadiansp = Math.atan2(point.y - middle.body.y, point.x - middle.body.x);
            let xholdp = point.x
            let yholdp = point.y
            xhold = Math.abs(this.x-middle.body.x)
            yhold = Math.abs(this.y- middle.body.y)
            xholdp = Math.abs(point.x-middle.body.x)
            yholdp = Math.abs(point.y- middle.body.y)
            let link = new Line(xhold, 0, 0, yhold, "red", 1)
            let linkp = new Line(xholdp, 0, 0, yholdp, "red", 1)
            // link.draw()
            link = link.hypotenuse()
            linkp = linkp.hypotenuse()
            // (new Line(xhold, 0, 0, yhold, "red", 1)).draw()
            for(let t = 0;t<middle.cuts;t++){
                tutorial_canvas_context.fillStyle = this.color
                tutorial_canvas_context.lineWidth = 0
                tutorial_canvas_context.strokeStyle = this.color
                tutorial_canvas_context.beginPath();
                tutorial_canvas_context.arc(middle.body.x+(Math.cos((middle.cutter*t)+this.angleRadians)*link), middle.body.y+(Math.sin((middle.cutter*t)+this.angleRadians)*link), this.radius, 0, (Math.PI*2), true)
                tutorial_canvas_context.fill()
                tutorial_canvas_context.stroke(); 
                let line = new Line(middle.body.x+(Math.cos((middle.cutter*t)+this.angleRadiansp)*linkp), middle.body.y+(Math.sin((middle.cutter*t)+this.angleRadiansp)*linkp),middle.body.x+(Math.cos((middle.cutter*t)+this.angleRadians)*link), middle.body.y+(Math.sin((middle.cutter*t)+this.angleRadians)*link),  this.color, this.radius*2)
                line.draw()


            }


        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
            if(this.x > tutorial_canvas.width){
                this.x = tutorial_canvas.width
                if(this.xmom > 0){
                    this.xmom *=-1
                }
            }
            if(this.y > tutorial_canvas.height){
                this.y = tutorial_canvas.height
                if(this.ymom > 0){
                    this.ymom *=-1
                }
            }
            if(this.x < 0){
                this.x = 0
                if(this.xmom < 0){
                    this.xmom *=-1
                }
            }
            if(this.y < 0){
                this.y = 0
                if(this.ymom < 0){
                    this.ymom *=-1
                }
            }
        }
    }
class FadeLine{
    constructor(ball, bball, color, width){
        this.color = color
        this.width = width
        this.alpha = 1
        this.active = 0
        this.masterball = ball
        this.ball = bball
        this.r = Math.floor(Math.random()*255)
        this.g = Math.floor(Math.random()*255)
        this.b = Math.floor(Math.random()*255)
    }
    hypotenuse(){
        const xdif = this.masterball.x-this.ball.x
        const ydif = this.masterball.y-this.ball.y
        const hypotenuse = (xdif*xdif)+(ydif*ydif)
        return Math.sqrt(hypotenuse)
    }
    draw(){
        if(this.active == 1){
            this.alpha +=.1
            if(this.alpha > 1){
                this.alpha = 1
            }
        }else{
            this.alpha -=.01
            if(this.alpha < 0){
                this.alpha = 0
            }
        }
        if(this.masterball.radius > this.ball.radius){
            if(this.hypotenuse() < this.masterball.radius*20){
                this.active = 1
            }else{
                this.active = 0
            }
        }else{
            if(this.hypotenuse() < this.ball.radius*20){
                this.active = 1
            }else{
                this.active = 0
            } 
        }
        this.color = `rgba(${this.r},${this.g},${this.b}, ${this.alpha})`
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.lineWidth = this.width
        tutorial_canvas_context.beginPath()
        tutorial_canvas_context.moveTo(this.masterball.x, this.masterball.y)         
        tutorial_canvas_context.lineTo(this.ball.x, this.ball.y)
        tutorial_canvas_context.stroke()
        tutorial_canvas_context.lineWidth = 1
    }
}

let middle = new Center()


function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
    }
    