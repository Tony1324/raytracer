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

    collision(ray){
        //good article: http://kylehalladay.com/blog/tutorial/math/2013/12/24/Ray-Sphere-Intersection.html
        let distRay = Vector.subtract(this.location,ray.origin)
        let distToCenter = distRay.magnitude
        let rayDistToCenter = Vector.dot(distRay,ray.direction)
        let rayDistFromCenterSquared = distToCenter ** 2 - rayDistToCenter ** 2

        let radiusSquared = this.radius ** 2

        let distToSurface = rayDistToCenter - Math.sqrt(Math.abs(radiusSquared - rayDistFromCenterSquared))

        let collide = true
        
        if(rayDistToCenter < 0){ collide = false }
        if(rayDistFromCenterSquared > radiusSquared){ collide = false }

        if(collide == false){distToSurface = Infinity}

        let point =  Vector.scale(ray.direction,distToSurface)
        
        return {collide:collide, dist:distToSurface, point:point, normal:Vector.subtract(point,this.location).normalize(),obj:this}
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

    get magnitude(){
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2)
    }

    set magnitude(len){
        let scaleFactor = len / this.magnitude
        this.scale(scaleFactor)
    }

    copy(){
        return new Vector(this.x, this.y, this.z)
    }

    normalize(){
        this.magnitude = 1
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
