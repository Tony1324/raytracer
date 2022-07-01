let canvasEl = document.querySelector("#scene")
let ctx = canvasEl.getContext("2d")

// let world = new World([new Sphere(20,new Vector(0,0,30),{}),new Sphere(7,new Vector(10,5,10),{}),new Sphere(7,new Vector(-15,-10,16),{})])
// let world = new World([new Sphere(3, new Vector(3,0,8),{}), new Sphere(3, new Vector(-3,0,8),{})])
let world = new World([new Sphere(3, new Vector(0, 0, 8),{})])


width = 500
height = 500
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

for(let i = 0; i < width; i++){
    for(let j = 0; j < height; j++){
        x = i-width/2
        y = j-height/2
        let ray = new Ray(new Vector(0,0,0), new Vector(x,y,fieldOfView).normalize())
        let collide = false
        let dist = Infinity
        let objectNum = 0
        for (let obj = 0; obj < world.objects.length; obj++) {
            result = world.objects[obj].checkCollision(ray)
            dist = Math.min(dist,result.dist)
            collide = collide || result.collide
            if (collide) {
                let objectNum = obj
                break
            }
        }
        // brightness = collide ? (255 - dist*10) : 0
        brightness = collide ? (255 - (shading * (dist - closestPoint))) : 0
        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`
        ctx.fillRect(i,j,1,1)
        
        if (collide && tryBounce) {
            // Step 1: find vector O to X1 (V1)
            // Step 2: find vector Camera to X1
            // Step 3: cos A = (V1*V2)/(|V1|*|V2|)
            // Step 4: |V3| = dist*cosA. V3 = (V1/|V1|)*|V3|
            // Step 5: point M = X1 + V3. Find VCM, then M + CM = R
            // Step 6: Vfinal = R - X1
            // Step 7: Scale Vfinal to width at x

            let X1 = world.objects[objectNum].findCollisionPoint(ray)

            let sphereVector = Vector.subtract(world.objects[objectNum].location, new Vector(X1))
            let rayVector = Vector.subtract(new Vector(0, 0, 0), new Vector(X1))
            let cosAngle = (Vector.dot(sphereVector, rayVector)) / (sphereVector.magnitude * rayVector.magnitude)
            let heightVector = dist * cosAngle * (sphereVector / sphereVector.magnitude)
            let rightAnglePoint = Vector.add(new Vector(X1), heightVector)
            let lengthVector = Vector.add(rightAnglePoint, Vector.subtract(new Vector(0, 0, 0), rightAnglePoint))
            let finalVector = Vector.subtract(lengthVector, new Vector(X1))
            let ray2 = new Ray(new Vector(X1), finalVector.scale(fieldOfView / Math.min(finalVector.x, finalVector.y, finalVector.z)))

            let collide = false
            let dist2 = Infinity
            objectNum = 0
            for (let obj = 0; obj < world.objects.length; obj++) {
                result = world.objects[obj].checkCollision(ray2)
                dist = Math.min(dist2, result.dist)
                collide = collide || result.collide
                if (collide) {
                    objectNum = obj
                    break
                }
            }

            let X2 = world.objects[objectNum].findCollisionPoint(ray2) // NaN if no collision
            brightness = collide ? (255 - (shading * (dist2 - closestPoint))) : 0
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`
            ctx.fillRect(X2.x, X2.y, 1, 1)
        }
    }
}
