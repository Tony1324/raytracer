let canvasEl = document.querySelector("#scene")
let ctx = canvasEl.getContext("2d")

let world = new World([new Sphere(20,new Vector(0,0,30),{}),new Sphere(7,new Vector(10,5,10),{}),new Sphere(7,new Vector(-15,-10,16),{})])

width = 500
height = 500

ctx.canvas.width = width
ctx.canvas.height = height

let fieldOfView = 50 * width / 100

for(let i = 0; i<width;i++){
    for(let j=0; j<height;j++){
        x = i-width/2
        y = j-height/2
        let ray = new Ray(new Vector(0,0,0), new Vector(x,y,fieldOfView).normalize())
        let collide = false
        let dist = Infinity
        for(obj of world.objects){
            result = obj.checkCollision(ray)
            dist = Math.min(dist,result.dist)
            collide = collide || result.collide
        }
        brightness = collide ? (255 - dist*10) : 0
        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`
        ctx.fillRect(i,j,1,1)
    }
}

