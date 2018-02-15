"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player = null;
    var goal = null;
    var upButton = null;
    var downButton = null;
    var rightButton = null;
    var leftButton = null;
    var music = null;
    var chicken_sound = null;

    var upButtonPressed = false;
    var downButtonPressed = false;
    var leftButtonPressed = false;
    var rightButtonPressed = false;
    var PLAYER_VELOCITY = 400;
    var cars = null;
    var carArray = ['ambulance','audi','black_viper','mini_truck','mini_van','police','taxi','truck'];
    var carVelocity = [500,800,900,550,500,700,600,450];
    var Y_DIST_BTWEEN_CARS = 500;
    var X_DIST_BTWEEN_CARS = 200;
    var restart_time = 0;
    var hud = null;
    var timer = null;

    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        //game.state.start('MainMenu');
        game.state.restart();
        //game.state.start("MainMenu");


    }

    function actionMoveLeft() {

        player.body.velocity.x -= PLAYER_VELOCITY;

        leftButtonPressed = true;

        player.animations.play('left');

    }

    function actionMoveRight() {

        player.body.velocity.x += PLAYER_VELOCITY;

        rightButtonPressed = true;

        player.animations.play('right');

    }

    function actionMoveUp() {

        player.body.velocity.y -= PLAYER_VELOCITY;

        upButtonPressed = true;

        player.animations.play('up');

    }

    function actionMoveDown() {

        player.body.velocity.y += PLAYER_VELOCITY;

        downButtonPressed = true;

        player.animations.play('down');

    }

    function stopUp(){

        upButtonPressed = false;

    }

    function stopDown(){

        downButtonPressed = false;

    }

    function stopRight(){

        rightButtonPressed = false;

    }

    function stopLeft(){

        leftButtonPressed = false;

    }

    function carCollision(player,car){
        player.visible = false;
        player.enableBody = false
        player.immovable = true;
        hud.text = "To get hit by a " + car.key;

        //Create our Timer
        timer = game.time.create(false);
        timer.loop(1000, updateTime, this);
        timer.start();
    }

    function goalCollision(player,goal){
        hud.text = "To get to the other side"

        //Create our Timer
        timer = game.time.create(false);
        timer.loop(1000, updateTime, this);
        timer.start();
    }

    function updateTime(){
        restart_time += 1;
        if(restart_time == 1){
            chicken_sound.play();
        }   
        if(restart_time == 4){
            restart_time = 0;
            music.destroy();
            timer.destroy();
            quitGame();
        }
    }

    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Create a sprite at the center of the screen using the 'logo' image.
            game.physics.startSystem(Phaser.Physics.ARCADE);
 
            //Change the background colour
            game.add.tileSprite(0, 0, 1920, 1920, 'background');

            player = game.add.sprite(250, 800, 'player' );
            goal = game.add.sprite(1880,0, 'goal');
            game.physics.arcade.enable(goal);
            goal.enableBody = true;
            goal.physicsBodyType = Phaser.Physics.ARCADE;

            game.world.setBounds(0, 0, 1920, 1920);

            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.arcade.enable(player);
            player.enableBody = true;
            player.body.collideWorldBounds = true;
            player.physicsBodyType = Phaser.Physics.ARCADE;

            //Create car groups
            cars = game.add.group();

            cars.enableBody = true;
            cars.physicsBodyType = Phaser.Physics.ARCADE;
            var distance = X_DIST_BTWEEN_CARS + 300;
            var direction = 1;

            for(var i=0;i<6;i++){

                var rand = game.world.randomX % (carArray.length - 1);

                for(var j=0;j<3;j++){
                    var car = cars.create(distance, Y_DIST_BTWEEN_CARS*j, carArray[rand], 0);
                    car.anchor.setTo(.5,.5);
                    if(direction > 0){
                        //Invert scale.y to flip up/down
                        car.scale.y *= -1;
                    }
                    car.body.velocity.y = carVelocity[rand] * direction;
                    game.world.wrap(car,0,true);
                }
                distance += X_DIST_BTWEEN_CARS;

                direction *= -1;

            }

            var style2 = { font: "30px Arial", fill: "#ffffff", align: "center" };
            hud = game.add.text(32, 32, '', style2);
            hud.fixedToCamera = true;
            hud.cameraOffset.setTo(163, 150);
            music = game.add.audio('city_music');
            chicken_sound = game.add.audio('chicken_sound');
            music.play();

            //BUTTON SYSTEM FOR LEFT RIGHT UP AND DOWN
            upButton = game.add.button(game.world.centerX + 200 , game.world.centerY + 50, 'upButton', null, this, 1, 0, 2);
            upButton.inputEnabled = true;
            upButton.events.onInputDown.add(actionMoveUp, this);
            upButton.events.onInputUp.add(stopUp, this);
            upButton.alpha = 0.5;


            upButton.fixedToCamera = true;
            upButton.cameraOffset.setTo(570, 380);

            downButton = game.add.button(game.world.centerX + 200 , game.world.centerY + 200, 'downButton', null, this, 1, 0, 2);
            downButton.inputEnabled = true;
            downButton.events.onInputDown.add(actionMoveDown, this);
            downButton.events.onInputUp.add(stopDown, this);
            downButton.alpha = 0.5;

            downButton.fixedToCamera = true;
            downButton.cameraOffset.setTo(570, 530);

            rightButton = game.add.button(game.world.centerX + 300 , game.world.centerY + 120, 'rightButton', null, this, 1, 0, 2);
            rightButton.inputEnabled = true;
            rightButton.events.onInputDown.add(actionMoveRight, this);
            rightButton.events.onInputUp.add(stopRight, this);
            rightButton.alpha = 0.5;

            rightButton.fixedToCamera = true;
            rightButton.cameraOffset.setTo(670, 450);

            leftButton = game.add.button(game.world.centerX + 100 , game.world.centerY + 120, 'leftButton', null, this, 1, 0, 2);
            leftButton.inputEnabled = true;
            leftButton.events.onInputDown.add(actionMoveLeft, this);
            leftButton.events.onInputUp.add(stopLeft, this);
            leftButton.alpha = 0.5;

            leftButton.fixedToCamera = true;
            leftButton.cameraOffset.setTo(470, 450);

            //  Our two animations, walking left and right.
            player.animations.add('left', [3, 4, 5], 10, true);
            player.animations.add('right', [6, 7, 8], 10, true);
            player.animations.add('up', [9, 10, 11], 10, true);
            player.animations.add('down', [0, 1, 2], 10, true);

            //  Notice that the sprite doesn't have any momentum at all,
            //  it's all just set by the camera follow type.
            //  0.1 is the amount of linear interpolation to use.
            //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        },
    
        update: function () {

            if((cars != null) && (player != null)){
                game.physics.arcade.collide(player, cars, carCollision, null, this);
            }
            game.physics.arcade.overlap(player,goal, goalCollision, null, this);
    
            //If no button is being pressed than stop velocity and freeze animation
            if(!upButtonPressed && !downButtonPressed && !leftButtonPressed && !rightButtonPressed){
                player.body.velocity.y = 0;
                player.body.velocity.x = 0;
                player.animations.stop();
            }

            cars.forEach(function(car) {
                game.world.wrap(car,0,true);
            }, this);

            
            

        }


    };
};
