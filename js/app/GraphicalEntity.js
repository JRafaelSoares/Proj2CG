class GraphicalEntity extends THREE.Object3D {

	constructor(){
		super()
        this.speed = 0;

	}

	tryUpdate(t){
		
        var linearMove = this.speed * t;

        /* Position of the ball */
        var positions = [this.position.x, this.position.z];
        
        positions[0] += linearMove * Math.sin(this.rotation.y); // x
        positions[1] += linearMove * Math.cos(this.rotation.y); // z

        return positions;
        
    }

    update(t){
    	var linearMove = this.speed * t;

        this.position.x += linearMove * Math.sin(this.rotation.y);
        this.position.z += linearMove * Math.cos(this.rotation.y);
        
        this.selfUpdate(t);
        
    }

    rotateY(w) {
        this.rotation.y = w;
    }

    incrementSpeed(s) {
        this.speed += s;
        
        if(this.speed < 0.5){
            this.speed = 0;
        }
    }

    toggleAxisHelper() {
        this.axisHelper.visible = !this.axisHelper.visible;
    }
    
    get getRotationY() {
    	return this.rotation.y;
    }

    get getSpeed() {
        return this.speed;
    }
    
    setSpeed(s) {
        this.speed = s;

        if(this.speed < 0.5){
            this.speed = 0;
        }
    }
}