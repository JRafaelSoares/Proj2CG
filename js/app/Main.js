class Main {

    constructor(){
        'use strict';
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.defaultWidth = window.innerWidth;
        this.defaultHeight = window.innerHeight;

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

        this.diagonal = 500;

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
        
        //Camera 1: Ortogonal Top View
        this.cameraList[0] = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        
        this.cameraList[0].position.y = 600;
        this.cameraList[0].lookAt(0, 0, 0);
        
        //Camera 2: Perspective Camera, must see all the playing field;
        
        this.cameraList[1] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        
        //Camera 3: Perspective Camera that moves with the ball
        
        this.cameraList[2] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        
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
        
        var window_ratio = window.innerWidth / window.innerHeight;        
        
        if (window.innerHeight > 0 && window.innerWidth > 0) {

            
            if(window.innerWidth < window.innerHeight){
                this.scene.scale.set(window.innerWidth / this.defaultWidth, window.innerWidth / this.defaultWidth, window.innerWidth / this.defaultWidth);
            }
            else {
                this.scene.scale.set(window.innerHeight / this.defaultHeight, window.innerHeight / this.defaultHeight, window.innerHeight / this.defaultHeight);
            }
            

            if(window.innerWidth > this.defaultWidth){
                this.scene.scale.set(window.innerWidth / this.defaultWidth, window.innerWidth / this.defaultWidth, window.innerWidth / this.defaultWidth);

                //Ortogonal camera 1
                this.cameraList[0].left = (window.innerWidth / -2); //* (this.defaultWidth / this.defaultHeight);
                this.cameraList[0].right = (window.innerWidth / 2); //* (this.defaultWidth / this.defaultHeight);

                this.cameraList[0].top = window.innerHeight / 2;
                this.cameraList[0].bottom = window.innerHeight / -2;
            }
            else {
                this.scene.scale.set(window.innerHeight / this.defaultHeight, window.innerHeight / this.defaultHeight, window.innerHeight / this.defaultHeight);
                //Ortogonal camera 1
                this.cameraList[0].left = window.innerWidth / -2;
                this.cameraList[0].right = window.innerWidth / 2;

                this.cameraList[0].top = (window.innerHeight / 2); //* (this.defaultHeight / this.defaultWidth);
                this.cameraList[0].bottom = (window.innerHeight / -2); //* (this.defaultHeight / this.defaultWidth);
            }
            

            //Perspective camera 2
            this.cameraList[1].aspect = window_ratio;

            //Perspective camera 3
            this.cameraList[2].aspect = window_ratio;


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


    update() {
        var t = this.clock.getDelta();

        this.timer += t;
        
        /* Ball Speed */
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

                if(positions[i][0]+this.ballRadius >= field_width/2 || positions[i][0]-this.ballRadius <= -field_width/2){
                    num_colisions++;
                    
                    this.balls[i].rotateY(2*Math.PI - rotation);
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
                            console.log('ola');

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
                            
                            var new_rotation = ball2Rotation;//Math.atan(speedX / speedZ) + Math.PI * (Math.cos(Math.atan(speedX / speedZ)) < 0 ? 1 : 0);
                            var new_ball2Rotation = rotation;//Math.atan(ball2SpeedX / ball2SpeedZ) + Math.PI * (Math.cos(Math.atan(ball2SpeedX / ball2SpeedZ)) < 0 ? 1 : 0);
                            this.balls[i].rotateY(new_rotation);
                            this.balls[k].rotateY(new_ball2Rotation);

                            positions[k] = this.balls[k].tryUpdate(t);
                            break;
                        }
                    }
                }
                
                
                positions[i] = this.balls[i].tryUpdate(t);
            }
            
        }while(num_colisions>0);
        
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

