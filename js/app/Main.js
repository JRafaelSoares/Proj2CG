class Main {

    constructor(){
        'use strict';
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);


        this.defaultWidth = 600;
        this.defaultHeight = 1200;

        this.defaultAspectRatio = this.defaultWidth / this.defaultHeight;


        document.body.appendChild(this.renderer.domElement);
        

        this.createCamera();
        this.createScene();

        this.clock = new THREE.Clock();

        this.timer = 0;
        
        this.animate();

    }

    createScene() {
        'use strict';
        
        this.scene = new THREE.Scene();
        

        this.axisHelper = new THREE.AxesHelper(40);
        this.axisHelper.visible = false;
        this.scene.add(this.axisHelper);

        this.numBalls = 10;

        this.diagonal = 1000;

        this.ballRadius = this.diagonal / 20;


        this.baseMaterial = new THREE.MeshBasicMaterial({color: 0x009933, wireframe: false});
        this.wallMaterial = new THREE.MeshBasicMaterial({color: 0x734d26, wireframe: false});

        this.field = new Field(0, 0, 0, this.diagonal, [this.baseMaterial, this.wallMaterial], this.cameraList[1]);
        
        this.ballMaterial = new THREE.MeshBasicMaterial({color: 0xcc3300, wireframe: true});

        this.balls = Array(this.numBalls);

        var radiusSumSquared = (this.ballRadius * 2) * (this.ballRadius * 2);

        for(var i = 0; i < this.numBalls; i++){

            var posValid = true;

            do {

                posValid = true;

                var x = -this.field.getWidth / 2 + this.ballRadius + Math.random() * (this.field.getWidth - 2 * this.ballRadius);
                var z = -this.field.getHeight / 2 + this.ballRadius + Math.random() * (this.field.getHeight - 2 * this.ballRadius);

                for(var j = 0; j < i; j++){

                    var distance = (x - this.balls[j].position.x) * (x - this.balls[j].position.x) + (z - this.balls[j].position.z) * (z - this.balls[j].position.z)

                    posValid = (distance >= radiusSumSquared);

                    if(!posValid){
                        break;
                    }
                }

            } while(!posValid);
            
           
            this.balls[i] = new Ball(x, this.ballRadius, z, this.ballRadius, this.ballMaterial, (i == 0 ? this.cameraList[2] : null));
            
            this.balls[i].incrementSpeed(150 * Math.random());
            this.balls[i].rotateY(Math.random() * 2 * Math.PI);
            
            this.scene.add(this.balls[i]);
        }

        this.scene.add(this.field);
    }

    createCamera() {
        'use strict';

        this.cameraList = new Array(3);
        this.cameraNum = 0;

        this.windowRatio = window.innerWidth / window.innerHeight;

        this.far = 2000;

        /*  Scene Size: 200 * 100 * 200  */

        //Camera 1: Ortogonal Top View
        this.cameraList[0] = new THREE.OrthographicCamera(-this.defaultWidth / 2, this.defaultWidth / 2, this.defaultHeight / 2, -this.defaultHeight / 2, 0.1, 1000);
        
        

        this.cameraList[0].position.y = 800;
        this.cameraList[0].lookAt(0, 0, 0);
        

        //Camera 2: Perspective Camera, must see all the playing field;
        this.cameraList[1] = new THREE.PerspectiveCamera(90, this.windowRatio, 0.1, this.far); //2 * Math.atan2(this.defaultHeight, 2 * this.far) * (180 / Math.PI)


        //Camera 3: Perspective Camera that moves with the ball
        this.cameraList[2] = new THREE.PerspectiveCamera(90, this.windowRatio, 0.1, this.far);

        this.resizeEvent();
        
    }

    render() {
        'use strict';
        
        this.renderer.render(this.scene, this.cameraList[this.cameraNum]);
    }


    animate() {
        'use strict';

        this.update();
        
        this.render();
        
        requestAnimationFrame(() => this.animate());
    }


    resizeEvent() {
        'use strict';

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.windowRatio = window.innerWidth / window.innerHeight;
        
        if (window.innerHeight > 0 && window.innerWidth > 0) {

            
            if(this.defaultAspectRatio >= this.windowRatio){

                //Ortogonal camera 1
                this.cameraList[0].top = (this.defaultWidth * (1 / this.windowRatio)) / 2;
                this.cameraList[0].bottom = -(this.defaultWidth * (1 / this.windowRatio)) / 2;


                /*var oldHeight1 = Math.tan((this.cameraList[1].fov / 2) * (Math.PI / 180)) * 2 * this.far;
                var oldHeight2 = Math.tan((this.cameraList[2].fov / 2) * (Math.PI / 180)) * 2 * this.far;


                //Perspective camera 2
                this.cameraList[1].fov = 2 * Math.atan2(oldHeight1 * this.windowRatio, 2 * this.far * this.cameraList[1].aspect) * (180 / Math.PI);

                //Perspective camera 3
                this.cameraList[2].fov = 2 * Math.atan2(oldHeight2 * this.windowRatio, 2 * this.far * this.cameraList[2].aspect) * (180 / Math.PI);*/

            }
            else {

                //Ortogonal camera 1
                this.cameraList[0].left = -(this.defaultHeight * this.windowRatio) / 2; //* (this.defaultWidth / this.defaultHeight);
                this.cameraList[0].right = (this.defaultHeight * this.windowRatio) / 2; //* (this.defaultWidth / this.defaultHeight);

            }

            //Perspective camera 2
            this.cameraList[1].aspect = this.windowRatio;

            //Perspective camera 3
            this.cameraList[2].aspect = this.windowRatio;
            

            //Updates all cameras
            for(var i = 0; i<3; i++){
                this.cameraList[i].updateProjectionMatrix();
            }
        }

    }

    keyboardDownEvent(k) {
        'use strict';

        switch(k) {
            case 49: //1
                this.cameraNum = 0;
                break;
            case 50: //2
                this.cameraNum = 1;
                break;
            case 51: //3
                this.cameraNum = 2;
                break;
            case 69: //e
                //Show/Hide balls axis
                this.toggleAxisHelpers();
                break;
            /*
            Not needed anymore, but can be added
            case 97: //a
                this.toggleWireframe();
                break;
            */
        }
    }


    toggleAxisHelpers(){
        for(var i = 0; i < this.numBalls; i++) {
            this.balls[i].toggleAxisHelper();
        }
    }


    update(){
        
        var t = this.clock.getDelta();

        this.timer += t;
        
        //Ball Speed
        var positions = new Array(this.numBalls);
        
        var field_height = this.field.getHeight;
        var field_width = this.field.getWidth;
        
        for(var i = 0; i < this.numBalls; i++){
            positions[i] = this.balls[i].tryUpdate(t); 
        }
        
        do{
            var num_colisions = 0;
            
            for(var i = 0; i < this.numBalls; i++){
                var rotation = this.balls[i].getRotationY;

                if(positions[i][0] + this.ballRadius >= field_width / 2 || positions[i][0] - this.ballRadius <= -field_width / 2){
                    num_colisions++;
                    
                    this.balls[i].rotateY(2 * Math.PI - rotation);
                    //this.balls[i].rotateY(rotation - 2*(0.5*Math.PI - (2 * Math.PI - rotation)));
                    //console.log(rotation - 2*(0.5*Math.PI - (2 * Math.PI - rotation)));
                    //this.balls[i].addRotationY(-2*(0.5*Math.PI - (2 * Math.PI - rotation)) + 2*Math.PI);
                }
                
                
                else if(positions[i][1] + this.ballRadius >= field_height / 2 || positions[i][1] - this.ballRadius <= -field_height / 2){
                    num_colisions++;
                    
                    this.balls[i].rotateY(Math.PI - rotation);
                    //this.balls[i].rotateY(rotation + 2*(rotation - Math.PI) + 2*Math.PI)
                    //this.balls[i].addRotationY(2*(rotation - Math.PI) + 2*Math.PI);
                }
                
                else{
                    var speed = this.balls[i].getSpeed;
                    var speedX = speed * Math.sin(rotation);
                    var speedZ = speed * Math.cos(rotation);

                    for(var k = i+1; k < this.numBalls; k++){
                        var distance = (positions[i][0] - positions[k][0]) * (positions[i][0] - positions[k][0]) + (positions[i][1] - positions[k][1]) * (positions[i][1] - positions[k][1])
                        
                        if (distance < 4 * this.ballRadius * this.ballRadius){
                            num_colisions++;

                            var ball2Rotation = this.balls[k].getRotationY;
                            var ball2Speed = this.balls[k].getSpeed;
                            var ball2SpeedX = ball2Speed * Math.sin(ball2Rotation);
                            var ball2SpeedZ = ball2Speed * Math.cos(ball2Rotation);
                            
                            var aux = ((speedX - ball2SpeedX) * (positions[i][0] - positions[k][0]) + (speedZ - ball2SpeedZ) * (positions[i][1] - positions[k][1])) / (4 * this.ballRadius * this.ballRadius);

                            speedX -= aux * (positions[i][0] - positions[k][0]);
                            speedZ -= aux * (positions[i][1] - positions[k][1]);

                            ball2SpeedX -= aux * (positions[k][0] - positions[i][0]);
                            ball2SpeedZ -= aux * (positions[k][1] - positions[i][1]);

                            this.balls[i].setSpeed(Math.sqrt(speedX * speedX + speedZ * speedZ));
                            this.balls[k].setSpeed(Math.sqrt(ball2SpeedX * ball2SpeedX + ball2SpeedZ * ball2SpeedZ));
                            
                            var new_rotation = Math.atan2(speedX, speedZ);
                            var new_ball2Rotation = Math.atan2(ball2SpeedX, ball2SpeedZ);
                            
                            this.balls[i].rotateY(new_rotation);
                            this.balls[k].rotateY(new_ball2Rotation);

                            positions[k] = this.balls[k].tryUpdate(t);
                            break;
                        }
                    }
                }
                
                
                positions[i] = this.balls[i].tryUpdate(t);
            }
            
        }while(num_colisions > 0);
        
        for(var i = 0; i < this.numBalls; i++){
            this.balls[i].update(t);
            
            if(this.timer > 10){
                this.balls[i].incrementSpeed(20);
            }
            
        }
        
        if(this.timer > 10){
            this.timer = 0;
        }
    }

}
