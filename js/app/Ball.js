class Ball extends GraphicalEntity{
    
    constructor(x, y, z, radius, material, camera = null){
        super();
        
        this.radius = radius;

        var geometry = new THREE.SphereGeometry(this.radius, this.radius*10, this.radius*10);
        var mesh = new THREE.Mesh(geometry, material);
        
        this.add(mesh);

        if(camera != null){
            this.add(camera);
        }

        this.position.set(x, y, z);
    }

    update(t){

    }

    rotateY(w) {
        this.rotation.y = w - 0.5 * Math.PI - (0.5 * Math.PI * (0.4 * Math.PI));
    }

    rotateZ(t) {
        this.rotation.z += -(Math.abs(this.linVelocity) / this.radius) * t;
    }
}
