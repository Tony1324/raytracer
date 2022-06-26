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

class Thing {
    constructor(location,{color, reflectivity, roughness, luminosity}){
        this.properties = {color, reflectivity, roughness, luminosity}
        this.location = location
    }
}

class Sphere extends Thing {
    constructor(radius,location,properties){
        super(location, properties)
        this.radius = radius
    }
}

class Vector{
    constructor(x,y){
        this.x = x
        this.y = y
    }

    get length(){
        return Math.sqrt(this.x**2 + this.y**2)
    }

    set length(len){
        let scaleFactor = len / this.length
        this.scale(scaleFactor)
    }

    copy(){
        return new Vector(this.x, this.y)
    }

    normalize(){
        this.length = 1
    }

    scale(s){
        this.x *= s
        this.y *= s
    }

    add(v){
        this.x += v.x
        this.y += v.y
    }

    static add(v1,v2){
        return new Vector(v1.x + v2.x, v1.y + v2.y)
    }
    static scale(v, s){
        return new Vector(v.x * s, v.y * s)
    }

}
