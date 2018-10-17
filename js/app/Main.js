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
       
        this.createScene();
        this.createCamera();

        this.clock = new THREE.Clock();
        
        this.animate();
    }

    createScene() {
        'use strict';
        
        this.scene = new THREE.Scene();
        
        this.axisHelper = new THREE.AxesHelper(40);

        this.axisHelper.visible = true;

        this.scene.add(this.axisHelper);
    }

    createCamera() {
        'use strict';

        this.cameraList = new Array(3);
        this.cameraNum = 0;
        
        //Camera 1: Ortogonal Top View
        this.cameraList[0] = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        
        this.cameraList[0].position.y = 600;
        this.cameraList[0].lookAt(this.scene.position);
        
        //Camera 2: Perspective Camera, must see all the playing field;
        //Camera 3: Perspective Camera that moves with the ball
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
        
        //Does this still work with moveable camera?
        if(window.innerWidth < window.innerHeight){
            this.scene.scale.set(window.innerWidth / this.defaultWidth, window.innerWidth / this.defaultWidth, window.innerWidth / this.defaultWidth);
        }
        else {
            this.scene.scale.set(window.innerHeight / this.defaultHeight, window.innerHeight / this.defaultHeight, window.innerHeight / this.defaultHeight);
        }
        
        //Does this still apply to Perspective cameras?
        if (window.innerHeight > 0 && window.innerWidth > 0) {
            for (var i = 0; i < this.cameraList.length; i++){
                
                this.cameraList[i].left = window.innerWidth / -2;
                this.cameraList[i].right = window.innerWidth / 2;

                this.cameraList[i].top = window.innerHeight / 2;
                this.cameraList[i].bottom = window.innerHeight / -2;

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
            /*
            Not needed anymore, but can be added
            case 97: //a
                this.toggleWireframe();
                break;
            */
        }
    }


    update() {
    }
}

