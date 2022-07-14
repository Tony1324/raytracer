//3d objects library

class World {
    constructor(objects = []) {
        this.objects = objects
    }

    add(object) {
        this.objects.push(object)
    }

    remove(object) {
        this.objects = this.objects.filter(o => o != object)
    }
}

class Shape {
    constructor(properties) {
        this.properties = properties
    }
}

class Sphere extends Shape {
    constructor(radius, location, properties) {
        super(properties)
        this.radius = radius
        this.location = location
    }

    collision(ray) {
        //good article: http://kylehalladay.com/blog/tutorial/math/2013/12/24/Ray-Sphere-Intersection.html
        let distRay = Vector.subtract(this.location, ray.origin)
        let distToCenter = distRay.magnitude
        let rayDistToCenter = Vector.dot(distRay, ray.direction)
        let rayDistFromCenterSquared = distToCenter ** 2 - rayDistToCenter ** 2

        let radiusSquared = this.radius ** 2

        let distToSurface = rayDistToCenter - Math.sqrt(Math.abs(radiusSquared - rayDistFromCenterSquared))

        let collide = true

        if (rayDistToCenter < 0) { collide = false }
        if (rayDistFromCenterSquared > radiusSquared) { collide = false }

        if (!collide) { distToSurface = Infinity }

        let point = Vector.add(Vector.scale(ray.direction, distToSurface), ray.origin)
        // let point =  Vector.scale(ray.direction,distToSurface)

        return { collide: collide, dist: distToSurface, point: point, normal: Vector.subtract(point, this.location).normalize(), obj: this }
    }
}

class Triangle extends Shape {
    constructor(points, properties) {
        super(properties)
        this.points = points
    }

    collision(ray) {
        let planeVector = Vector.cross(Vector.subtract(this.points[1], this.points[0]), Vector.subtract(this.points[2], this.points[0])).normalize()
        let planeOffset = Vector.dot(planeVector, this.points[0])
        let distToSurface = (planeOffset - Vector.dot(planeVector, ray.origin)) / Vector.dot(planeVector, ray.direction)
        let point = Vector.add(Vector.scale(ray.direction, distToSurface), ray.origin)
        let c1 = Vector.dot(Vector.cross(Vector.subtract(this.points[1], this.points[0]), Vector.subtract(point, this.points[0])), planeVector) >= 0
        let c2 = Vector.dot(Vector.cross(Vector.subtract(this.points[2], this.points[1]), Vector.subtract(point, this.points[1])), planeVector) >= 0
        let c3 = Vector.dot(Vector.cross(Vector.subtract(this.points[0], this.points[2]), Vector.subtract(point, this.points[2])), planeVector) >= 0
        let collide = c1 && c2 && c3

        if (!collide || distToSurface <= 0) { distToSurface = Infinity }

        return { collide: collide, dist: distToSurface, point: point, normal: planeVector, obj: this }
    }
}

class Ray {
    constructor(origin, direction) {
        this.origin = origin
        this.direction = direction
    }
}

class Vector {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
    }

    set magnitude(len) {
        let scaleFactor = len / this.magnitude
        this.scale(scaleFactor)
    }

    copy() {
        return new Vector(this.x, this.y, this.z)
    }

    normalize() {
        this.magnitude = 1
        return this
    }

    scale(s) {
        this.x *= s
        this.y *= s
        this.z *= s
        return this
    }

    add(v) {
        this.x += v.x
        this.y += v.y
        this.z += v.z
        return this
    }

    subtract(v) {
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
        return this
    }

    static normalize(v) {
        return v.copy().normalize()
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }

    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }

    static scale(v, s) {
        return new Vector(v.x * s, v.y * s, v.z * s)
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
    }

    static cross(v1, v2) {
        return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x)
    }
}
