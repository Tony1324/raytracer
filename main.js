let canvasEl = document.querySelector("#scene")
let ctx = canvasEl.getContext("2d")

// let world = new World([new Sphere(20,new Vector(0,0,30),{}),new Sphere(7,new Vector(10,5,10),{}),new Sphere(7,new Vector(-15,-10,16),{})])
//let world = new World([
//new Sphere(3, new Vector(4,3,2),{reflectivity:{r:1,g:1,b:1},glow:{r:200,g:200,b:200}}), 
//new Sphere(3, new Vector(-4,3,8),{reflectivity:{r:1,g:0.5,b:0.5},glow:{r:100,g:10,b:10}}),
//new Sphere(3, new Vector(0,-3,8),{reflectivity:{r:1,g:0.5,b:0.5},glow:{r:100,g:10,b:10}})
//])
// let world = new World([
//     new Sphere(3, new Vector(4,-30,50),{reflectivity:{r:1,g:1,b:1},glow:{r:255,g:255,b:255}}), 
//     new Sphere(10, new Vector(-4,10,50),{reflectivity:{r:1,g:0.5,b:0.5},glow:{r:0,g:0,b:0}}),
//     new Sphere(1000, new Vector(0,1020,50),{reflectivity:{r:1,g:1,b:1},glow:{r:0,g:0,b:0}})
// ])
//let world = new World([
//new Sphere(200, new Vector(0,205,50),{reflectivity:{r:1,g:1,b:1},glow:{r:100,g:100,b:100}}),
//new Sphere(200, new Vector(0,-205,50),{reflectivity:{r:1,g:1,b:1},glow:{r:10,g:10,b:10}})
// ])
// let world = new World([
// new Sphere(30, new Vector(0,0,50),{reflectivity:{r:1,g:0.8,b:0.4},glow:{r:50,g:25,b:10}}),
// new Sphere(500, new Vector(0,-700,50),{reflectivity:{r:1,g:1,b:1},glow:{r:200,g:200,b:200}}),
// new Sphere(500, new Vector(0,700,50),{reflectivity:{r:1,g:1,b:1},glow:{r:200,g:200,b:200}})
// ])
let world = new World([
    // new Triangle([new Vector(-3, 1, 10), new Vector(3, 1, 10), new Vector(-3, 7, 10)], { reflectivity: { r: 1, g: 0.5, b: 1 }, glow: { r: 0, g: 0, b: 0 } }),
    // new Triangle([new Vector(3, 7, 10), new Vector(-3, 7, 10), new Vector(3, 1, 10)], { reflectivity: { r: 1, g: 0.5, b: 1 }, glow: { r: 0, g: 0, b: 0 } }),
    // new Triangle([new Vector(-3, 1, 13), new Vector(3, 1, 13), new Vector(-3, 7, 13)], { reflectivity: { r: 0.5, g: 1, b: 1 }, glow: { r: 0, g: 0, b: 0 } }),
    // new Triangle([new Vector(3, 7, 13), new Vector(-3, 7, 13), new Vector(3, 1, 13)], { reflectivity: { r: 0.5, g: 1, b: 1 }, glow: { r: 0, g: 0, b: 0 } }),
    // new Triangle([new Vector(-3, 1, 10), new Vector(-3, 1, 13), new Vector(3, 1, 13)], { reflectivity: { r: 1, g: 1, b: 0.5 }, glow: { r: 0, g: 0, b: 0 } }),
    // new Triangle([new Vector(3, 1, 10), new Vector(-3, 1, 10), new Vector(3, 1, 13)], { reflectivity: { r: 1, g: 1, b: 0.5 }, glow: { r: 0, g: 0, b: 0 } }),
    // new Sphere(0.1, new Vector(4, 0, 7), { reflectivity: { r: 1, g: 1, b: 1 }, glow: { r: 255, g: 255, b: 255 } })
    new Triangle([new Vector(-10,-10,-10), new Vector(-10,10,-10), new Vector(10,-10,-10)], {reflectivity: {r: 1, g: 1, b: 1}, glow: {r:0,g:0,b:0}}),
    new Triangle([new Vector(10,-10,-10), new Vector(10,10,-10), new Vector(-10,10,-10)], {reflectivity: {r: 1, g: 1, b: 1}, glow: {r:0,g:0,b:0}}),
    new Triangle([new Vector(-10,-10,10), new Vector(-10,10,10), new Vector(10,-10,10)], {reflectivity: {r: 1, g: 1, b: 1}, glow: {r:0,g:0,b:0}}),
    new Triangle([new Vector(10,-10,10), new Vector(10,10,10), new Vector(-10,10,-10)], {reflectivity: {r: 1, g: 1, b: 1}, glow: {r:0,g:0,b:0}}),
    new Sphere(0.1, new Vector(0,0,6), {reflectivity: {r:1, g:1, b:1}, glow: {r:255,b:255,g:255}})
])


let width = 500
let height = 500

ctx.canvas.width = width
ctx.canvas.height = height

ctx.fillStyle = "rgb(0,0,0)"
ctx.fillRect(0, 0, width, height)

let fieldOfView = 50 * width / 100

let samples = 100

let pixelGrid = Array(width).fill(0).map(() => new Array(height).fill(0).map(() => { return { r: 0, g: 0, b: 0 } }))

function trace(ray, depth, currentObj) {
    if (depth <= 0) { return { r: 0, g: 0, b: 0 } }
    results = world.objects.filter(o => o != currentObj).map(o => o.collision(ray))
    let result = results
        .filter(a => a.collide)
        .reduce((a, b) => {
            return a.dist < b.dist ? a : b
        }, { collide: false, dist: Infinity })

    if (!result.collide) { return { r: 0, g: 0, b: 0 } }

    let glow = result.obj.properties.glow

    let reflectivity = result.obj.properties.reflectivity

    let reflection = trace(reflect(result.point, ray, result.normal), depth - 1, result.obj)

    return ({
        r: glow.r + reflectivity.r * reflection.r,
        g: glow.g + reflectivity.g * reflection.g,
        b: glow.b + reflectivity.b * reflection.b
    })
}

function reflect(point, ray, normal) {
    let roughness = 1
    let newDirection = Vector.subtract(ray.direction, Vector.scale(normal, 2 * Vector.dot(ray.direction, normal)))
    newDirection.x += (Math.random() - 0.5) * roughness
    newDirection.y += (Math.random() - 0.5) * roughness
    newDirection.z += (Math.random() - 0.5) * roughness
    return (new Ray(point, newDirection))
}

function render(sample) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            x = i - width / 2
            y = j - height / 2
            let ray = new Ray(new Vector(0, 0, 0), new Vector(x, y, fieldOfView).normalize())
            color = trace(ray, 10)
            pixelGrid[i][j].r += color.r / samples
            pixelGrid[i][j].g += color.g / samples
            pixelGrid[i][j].b += color.b / samples
        }
    }
    paint(pixelGrid, sample)
}

function paint(pixels, sample) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            color = pixels[i][j]
            colorScaleFactor = samples / (sample + 1)
            ctx.fillStyle = `rgb(${color.r * colorScaleFactor},${color.g * colorScaleFactor},${color.b * colorScaleFactor})`
            ctx.fillRect(i, j, 1, 1)
        }
    }
}


for (let i = 0; i < samples; i++) {
    setTimeout(() => { render(i) }, 0)
}
