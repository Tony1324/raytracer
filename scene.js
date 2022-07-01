//3d objects library

class World {
    constructor(objects = []){
        this.objects = objects
    }

    add(object){
        this.objects.push(object)
    }

    remove(object){
        this.objects = this.objects.filter(o => o != object)
    }
}

class Shape {
    constructor(location,properties){
        this.properties = properties
        this.location = location
    }
}

class Sphere extends Shape {
    constructor(radius,location,properties){
        super(location, properties)
        this.radius = radius
    }

    checkCollision(ray){
        //good article: http://kylehalladay.com/blog/tutorial/math/2013/12/24/Ray-Sphere-Intersection.html
        let distRay = Vector.subtract(this.location,ray.origin)
        let distToCenter = distRay.length
        let rayDistToCenter = Vector.dot(distRay,ray.direction)
        let rayDistFromCenterSquared = distToCenter ** 2 - rayDistToCenter ** 2

        let radiusSquared = this.radius ** 2

        let distToSurface = rayDistToCenter - Math.sqrt(radiusSquared - rayDistFromCenterSquared)

        let collide = true
        
        if(rayDistToCenter < 0){ collide = false }
        if(rayDistFromCenterSquared > radiusSquared){ collide = false }

        if(collide == false){distToSurface = Infinity}
        
        return {collide:collide, dist:distToSurface}
    }

    findCollisionPoint(ray) {
        let b = -2 * (ray.direction.x * this.location.x + ray.direction.y * this.location.y + ray.direction.z * this.location.z)
        let a = ray.direction.x ** 2 + ray.direction.y ** 2 + ray.direction.z ** 2
        let c = this.location.x ** 2 + this.location.y ** 2 + this.location.z ** 2 - this.radius ** 2
        let t = (-b - Math.sqrt(b**2 - 4*a*c))/(2 * a)
        return new Vector(ray.direction.x * t, ray.direction.y * t, ray.direction.z * t)
    }
}

class Ray{
    constructor(origin, direction){
        this.origin = origin
        this.direction = direction
    }
}

class Vector{
    constructor(x,y,z){
        this.x = x
        this.y = y
        this.z = z
    }

    get length(){
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2)
    }

    set length(len){
        let scaleFactor = len / this.length
        this.scale(scaleFactor)
    }

    copy(){
        return new Vector(this.x, this.y, this.z)
    }

    normalize(){
        this.length = 1
        return this
    }

    scale(s){
        this.x *= s
        this.y *= s
        this.z *= s
        return this
    }

    add(v){
        this.x += v.x
        this.y += v.y
        this.z += v.z
        return this
    }

    subtract(v){
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
        return this
    }

    magnitude() {
        return Math.sqrt(this.x ** 2, this.y ** 2, this.z ** 2)
    }

    static add(v1,v2){
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }

    static subtract(v1,v2){
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }

    static scale(v, s){
        return new Vector(v.x * s, v.y * s, v.z * s)
    }

    static dot(v1, v2){
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
    }
}
