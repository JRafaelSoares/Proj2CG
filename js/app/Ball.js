class Ball extends GraphicalEntity{
    
    constructor(x, y, z, radius, material, camera = null){
        super();
        
        this.radius = radius;
        this.camera = camera;
        
        /*Create Ball*/
        var geometry = new THREE.SphereGeometry(this.radius, this.radius * 1, this.radius * 1);
        var mesh = new THREE.Mesh(geometry, material);
        
        this.add(mesh);

        /*Camera of the Ball*/
        if(camera != null){
            this.add(this.camera);

            this.camera.position.set(0, this.radius * 2, this.radius * -4);
            this.camera.lookAt(0, 0, 0);
        }

        this.position.set(x, y, z);

        /*Axis helper*/
        this.axisHelper = new THREE.AxesHelper(this.radius * 1.5);
        this.axisHelper.visible = true;

        this.add(this.axisHelper);
    }

    update(t){

    }

    rotateY(w) {
        this.rotation.y = w - 0.5 * Math.PI - (0.5 * Math.PI * (0.4 * Math.PI));
    }

    rotateZ(t) {
        this.rotation.z += -(Math.abs(this.linVelocity) / this.radius) * t;
    }

    toggleAxisHelper(){
        this.axisHelper.visible = !this.axisHelper.visible;
    }
}
