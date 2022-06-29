let canvasEl = document.querySelector("#scene")
let ctx = canvasEl.getContext("2d")

let world = new World([new Sphere(20,new Vector(0,0,30),{})])
let fieldOfView = 50

for(let i = 0; i<100;i++){
    for(let j=0; j<100;j++){
        x = i-50
        y = j-50
        let ray = new Ray(new Vector(0,0,0), new Vector(x,y,fieldOfView).normalize())
        collide = false
        dist = Infinity
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

