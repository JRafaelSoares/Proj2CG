class Field extends GraphicalEntity {

	constructor(x, y, z, diagonal, materials){
        super();

        this.baseMaterial = materials[0];

        if(materials.length == 1) {
        	this.wallMaterial = materials[0];
        }
        else {
        	this.wallMaterial = materials[1];
        }
        
        // Base Left Right Near Far
        this.walls = new Array(5);

        this.baseWidth = 2 * diagonal / Math.sqrt(5);
        this.baseLength = this.baseLength / 2;

        var geometry = new THREE.CubeGeometry(this.baseLength, 10, this.baseWidth);
        this.walls[0] = new THREE.Mesh(geometry, this.baseMaterial);

        this.walls[0].position.set(0, -10, 0);
        
        //Left Right
        for(var i = 1; i < 3; i++){
            geometry = new THREE.CubeGeometry(10, diagonal / 10, this.baseWidth);
            this.walls[i] = new THREE.Mesh(geometry, this.wallMaterial);

            this.walls[i].position.set((i == 1 ? -1 : 1) * (this.baseWidth / 2), 0, 0);

            this.add(this.walls[i]);
        }

        //Near Far
        for(var i = 3; i < 5; i++){
            geometry = new THREE.CubeGeometry(this.baseLength, diagonal / 10, 10);
            this.walls[i] = new THREE.Mesh(geometry, this.wallMaterial);

            this.walls[i].position.set((i == 3 ? -1 : 1) * (this.baseWidth / 2), 0, 0);

            this.add(this.walls[i]);
        }
        
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        
    }
}