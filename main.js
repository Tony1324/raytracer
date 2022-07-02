let canvasEl = document.querySelector("#scene")
let ctx = canvasEl.getContext("2d")

// let world = new World([new Sphere(20,new Vector(0,0,30),{}),new Sphere(7,new Vector(10,5,10),{}),new Sphere(7,new Vector(-15,-10,16),{})])
 //let world = new World([
     //new Sphere(3, new Vector(4,3,2),{reflectivity:{r:1,g:1,b:1},glow:{r:200,g:200,b:200}}), 
     //new Sphere(3, new Vector(-4,3,8),{reflectivity:{r:1,g:0.5,b:0.5},glow:{r:100,g:10,b:10}}),
     //new Sphere(3, new Vector(0,-3,8),{reflectivity:{r:1,g:0.5,b:0.5},glow:{r:100,g:10,b:10}})
 //])
 let world = new World([
     new Sphere(3, new Vector(4,-30,50),{reflectivity:{r:1,g:1,b:1},glow:{r:255,g:255,b:255}}), 
     new Sphere(10, new Vector(-4,10,50),{reflectivity:{r:1,g:0.5,b:0.5},glow:{r:0,g:0,b:0}}),
     new Sphere(1000, new Vector(0,1020,50),{reflectivity:{r:1,g:1,b:1},glow:{r:0,g:0,b:0}})
 ])
 //let world = new World([
     //new Sphere(200, new Vector(0,205,50),{reflectivity:{r:1,g:1,b:1},glow:{r:100,g:100,b:100}}),
     //new Sphere(200, new Vector(0,-205,50),{reflectivity:{r:1,g:1,b:1},glow:{r:10,g:10,b:10}})
 //])
 //let world = new World([
     //new Sphere(30, new Vector(0,0,50),{reflectivity:{r:1,g:0.8,b:0.4},glow:{r:50,g:25,b:10}}),
     //new Sphere(500, new Vector(0,-700,50),{reflectivity:{r:1,g:1,b:1},glow:{r:200,g:200,b:200}}),
     //new Sphere(500, new Vector(0,700,50),{reflectivity:{r:1,g:1,b:1},glow:{r:200,g:200,b:200}})
 //])


width = 2000
height = 2000
tryBounce = true

ctx.canvas.width = width
ctx.canvas.height = height

let fieldOfView = 50 * width / 100

let farthestPoint = 0
let closestPoint = fieldOfView
for(obj of world.objects) {  // calculate shading gradient. All points will be seen according to depth
    farthestPoint = Math.max(farthestPoint, obj.location.z)  // only spheres supported fn
    closestPoint = Math.min(closestPoint, obj.location.z - obj.radius)
}

let shading = 255 / (farthestPoint - closestPoint)

function trace(ray,depth,currentObj){
    if(depth <= 0){return {r:0,g:0,b:0}}
    results = world.objects.filter(o => o != currentObj).map(o => o.collision(ray))
    let result = results
        .filter(a=>a.collide)
        .reduce((a,b)=>{
            return a.dist < b.dist ? a : b
        },{collide:false,dist:Infinity})

    if(!result.collide){return {r:0,g:0,b:0}}

    let glow = result.obj.properties.glow
    let reflectivity = result.obj.properties.reflectivity

    let reflection = trace(reflect(result.point,ray,result.normal),depth-1,result.obj)

    return ({
        r:glow.r + reflectivity.r * reflection.r, 
        g:glow.g + reflectivity.g * reflection.g,
        b:glow.b + reflectivity.b * reflection.b
    })
}

function reflect(point,ray,normal){
    let roughness = 3
    let newDirection = Vector.subtract(ray.direction, Vector.scale(normal, 2 * Vector.dot(ray.direction,normal)))
    newDirection.x += (Math.random()-0.5)*roughness
    newDirection.y += (Math.random()-0.5)*roughness
    newDirection.z += (Math.random()-0.5)*roughness
    return(new Ray(point,newDirection))
}

for(let i = 0; i < width; i++){
    for(let j = 0; j < height; j++){
        x = i-width/2
        y = j-height/2
        let ray = new Ray(new Vector(0,0,0), new Vector(x,y,fieldOfView).normalize())
        color = trace(ray,10)
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`
        ctx.fillRect(i,j,1,1)
    }
}
