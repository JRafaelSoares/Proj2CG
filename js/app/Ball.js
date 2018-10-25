class Ball extends GraphicalEntity{
    
    constructor(x, y, z, radius, material, camera = null){

        super();
        
        this.radius = radius;
        
        /* Create Ball */
        var geometry = new THREE.SphereGeometry(this.radius, this.radius * 0.2, this.radius * 0.2);
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.add(this.mesh);

        /* If there is a camera associated with the ball */
        if(camera != null){
            this.camera = camera;
            this.add(this.camera);

            this.camera.position.set(0, this.radius * 2, this.radius * -4);
            this.camera.lookAt(0, 0, 0);
        }

        this.position.set(x, y, z);

        /* Create axis helper */
        this.axisHelper = new THREE.AxesHelper(this.radius * 1.5);
        this.axisHelper.visible = true;

        this.add(this.axisHelper);
    }

    selfUpdate(t){
        /* Rotate mesh around itself according to its speed */
        this.mesh.rotation.x += this.speed * t / this.radius;
    }
}
