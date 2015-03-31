var game = {
    init: function(){
        console.log("Initializing...");

        'use strict';

        Physijs.scripts.worker = 'physijs_worker.js';
        Physijs.scripts.ammo = '/ammo.js';

        var renderer = new THREE.WebGLRenderer ({antialias: true});
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        //var w = innerWidth;
        //var h = innerHeight;
        var w = 60;
        var h = innerHeight / innerWidth * 50;


        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //camera = new THREE.OrthographicCamera(-w/2, w/2, -h/2, h/2, 1, 1000);
        camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, -100, 1000);


        camera.position.set(200,100,200);


        //scene = new THREE.Scene();
        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
        camera.lookAt(scene.position);
        //var camera_helper = new THREE.CameraHelper(camera);
        //scene.add( camera_helper );

        var axisHelper = new THREE.AxisHelper( 5 );
        scene.add( axisHelper );


        //var object = new THREE.Object3D();
        //var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        //var material = new THREE.MeshBasicMaterial({color: 0xdd22aa});
        //mesh = new THREE.Mesh( geometry, material );
        //object.add( mesh );
        //scene.add( object );

        // Materials
        ground_material = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({ color: 0xcccccc }),
                .8, // high friction
                .4 // low restitution
                );
        //ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
        //ground_material.map.repeat.set( 3, 3 );
        var NoiseGen = new SimplexNoise;

        var ground_geometry = new THREE.PlaneGeometry( 300, 300, 100, 100 );
        for ( var i = 0; i < ground_geometry.vertices.length; i++ ) {
            var vertex = ground_geometry.vertices[i];
            vertex.z = NoiseGen.noise( vertex.x / 20, vertex.y / 20 ) * 1.5;
            //vertex.y = NoiseGen.noise( vertex.x / 30, vertex.z / 30 ) * 1;
        }
        ground_geometry.computeFaceNormals();
        ground_geometry.computeVertexNormals();
        ground = new Physijs.HeightfieldMesh(
                ground_geometry,
                ground_material,
                0, // mass
                100,
                100
                );

        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add( ground );

        var loader = new THREE.JSONLoader();
        var tank;
        var parts = ["turret", "cannon"];
        var manager = new THREE.LoadingManager();



        loader.load("/models/tank.js", function(model){
            tank_material = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({ color: 0xddbb88 }),
                .8, // high friction
                .2 // low restitution
                );
            var mesh = new Physijs.BoxMesh( model, tank_material );
            mesh.castShadow = mesh.receiveShadow = true;
            mesh.position.y = 2;
            //  tank = new Physijs.Vehicle(mesh, new Physijs.VehicleTuning(
            //    10.88,
            //    1.83,
            //    0.28,
            //    500,
            //    10.5,
            //    6000
            //    ));
            scene.add( mesh );
            window.tank = mesh;
        });


        scene.add( new THREE.AmbientLight( 0x222222 ) );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 20, 40, 15 );
        light.castShadow = true;
        light.shadowCameraLeft = -60;
        light.shadowCameraTop = -60;
        light.shadowCameraRight = 60;
        light.shadowCameraBottom = 60;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 200;
        light.shadowBias = -.0001
            light.shadowMapWidth = light.shadowMapHeight = 2048;
        light.shadowDarkness = .7;
        scene.add( light );


        window.onResize = function(){
            var h = innerHeight / innerWidth * 50;
            renderer.setSize( window.innerWidth, window.innerHeight );
            render();
        };
        var clock = new THREE.Clock(true);

        requestAnimationFrame(render);
        //scene.simulate();

        function render(){
            // if(tank !== undefined) {
            //         tank.rotateOnAxis(THREE.Vector3(0,0,1), clock.getElapsedTime() / 1000);
            // }
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            scene.simulate(); // run physics
        }
    }
};
window.game = game;
