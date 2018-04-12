"use strict";

GameStates.makeGame = function( game, shared ) {


    // Create your own variables.
    var INITIAL_TIME = 30;
    var INITIAL_SPEED = 200;

    var player = null;
    var velocityArray = [-1,1];
    var layerArray = null;
    var chaoArray = null;
    var group_x_velocity = 0;
    var group_y_velocity = 0;
    var NUM_CHAO = 4;
    var NUM_LAYERS = 3;
    var NUM_PER_LAYER = 10;
    var wanted_chao = 0;
    var hud = null;
    var tutorial = null;
    var numberCaught = 0;
    var total_time = INITIAL_TIME;
    var remaining_time = INITIAL_TIME;
    var first_time = true;
    var music = null;
    var saved_music = null;
    var wanted_sound = null;
    var nonwanted_sound = null;

    var next_round_time = 5;
    var wanted_poster_time = 15;
    var music_time = 53;
    var isWaitingForRound = false;
    var isDisplayingWantedPoster = false;
    var poster = null;
    var chao = null;

    var timer = null;
    var style1 = { font: "24px Arial", fill: "#ffffff", align: "center" };
    var style2 = { font: "60px Arial", fill: "#ffffff", align: "center" };
    var directionArray = ["N","NE","E","SE","S", "SW", "W", "NW"];

    //Quit game function
    function quitGame() {

        //Go back to main menu
        game.state.start("MainMenu");


    }

    //Function to wrap each child to world
    function wrap_World(child){
        game.world.wrap(child);
    }


    /****RANDOM NUMBER GENERATOR FUNCTION IS BORROWED CODE********************************************/
    /***https://stackoverflow.com/questions/5836833/create-a-array-with-random-values-in-javascript***/
    //This function shuffels array to random order of numbers from 0 to array.length-1 in array
    function shuffle(array) {

        for (var i=0;i<array.length;i++){ 
            array[i]=i;
        }

        var tmp, current, top = array.length;

        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
          }

        return array;
    }

    /*************************************************************************************************/
    /*************************************************************************************************/

    function onDown(sprite,pointer){


        var pos_x;     
        var pos_y;

        //If this is the chao we are looking for
        if(sprite.frame === wanted_chao){

            pos_x = sprite.x;
            pos_y = sprite.y;

            for(var i=0;i<layerArray.length;i++){
                game.world.removeAll(layerArray[i]);
            }

            //Draw Hub Display
            numberCaught++;

            wanted_sound.play();

            hud = game.add.text(32, 32, "Chao Caught: " + numberCaught + "\nTime: " + total_time, style1);

            game.add.sprite(pos_x,pos_y,'player',wanted_chao);

            total_time +=5

            remaining_time = total_time;

            isWaitingForRound = true;

            music.pause();
            saved_music = music;
            music_time = 53;


            //Every 5 catches add a layer to increase difficulty of game
            if(numberCaught % 5 === 0){
                NUM_LAYERS++;
                NUM_CHAO++;
            }


        }
        else{

            nonwanted_sound.play();

            total_time -=10;

            sprite.destroy();

            if(total_time < 0){

                total_time = 1;
            }

            hud.text = "Chao Caught: " + numberCaught + "\nTime: " + total_time;


        }


    }

    function enableInput(child){
        child.inputEnabled = true;
        child.alpha = 1;
    }

     function updateTime() {

        music_time--;
        if(music_time===0){
            music.play();
            music_time=53;
        }

        if(isWaitingForRound){
          next_round_time--;
        }

        else if(isDisplayingWantedPoster){
          wanted_poster_time--;
        }
        else{
          total_time--;
        }

        if(total_time > 0 && !isDisplayingWantedPoster){

            hud.text = "Chao Caught: " + numberCaught + "\nTime: " + total_time;
        }

        if(total_time === 0){
            for(var i=0;i<layerArray.length;i++){
                game.world.removeAll(layerArray[i]);
            }

            hud = game.add.text(100, 100, "GAME OVER\n NUMBER CAUGHT: " + numberCaught, style2);
            music.stop();
        }

        if(total_time === -5){
            timer.destroy();
            total_time = INITIAL_TIME;
            remaining_time = INITIAL_TIME;
            numberCaught = 0;
            music.destroy();
            saved_music = null;
            NUM_LAYERS = 3;
            NUM_CHAO = 4;
            wanted_poster_time = 14;
            game.state.start('MainMenu');
        }

        if(next_round_time=== 0){

            //Reset waiting time and start the next round
            isWaitingForRound = false;
            next_round_time = 5;
            game.state.start('Game');
        }

        if(wanted_poster_time === 6){
            tutorial.text = "";
            displayWantedPoster();
        }

        if(wanted_poster_time === 0){
            isDisplayingWantedPoster = false
            wanted_poster_time = 5;
            poster.destroy();
            chao.destroy();

            hud = game.add.text(32, 32, "Chao Caught: " + numberCaught + "\nTime: " + total_time, style1);

            for(var i=0;i<NUM_LAYERS;i++){
                var group = layerArray[i];
                group.inputEnableChildren = true;
                group.alpha = 1;
                group.forEach(enableInput, this, true);
                layerArray[i] = group;
            }



        }

    }

    //Display wanted poster of chosen chao
    function displayWantedPoster(){
            isDisplayingWantedPoster = true;
            poster = game.add.sprite(230,100, 'wanted_poster');
            chao = game.add.sprite(360,230, 'player',wanted_chao);
    }



    
    return {
    
        create: function () {
            

            //Create random chao array to pick from for wanted chao and its chosen
            //random layer to reside in
            chaoArray = new Array(NUM_CHAO);
            layerArray = new Array(NUM_LAYERS);
            chaoArray = shuffle(chaoArray);
            wanted_chao = chaoArray.pop();
            var chosenlayer = this.rnd.integerInRange(0,NUM_LAYERS-1);

            if(saved_music==null){
                music = game.add.audio('jazz_music');
            }
            else{
                music = saved_music;
            }
            
            wanted_sound = game.add.audio('screaming');
            nonwanted_sound = game.add.audio('laugh');
            music.play();
            
             //  Create our Timer
            timer = game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
            timer.loop(1000, updateTime, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            timer.start();

            total_time = remaining_time;

            //Display our wanted poster

            if(wanted_poster_time===5){
                displayWantedPoster();
            }
            else{

                isDisplayingWantedPoster = true;
                var text = "Click on chao that matches wanted chao on poster\n   If wanted chao is clicked: +1 score, +5 sec\n   If non-wanted chao is clicked: -5 sec\nGame ends when time reaches 0";
                tutorial = game.add.text(game.world.centerX - 300,game.world.centerY - 100,text, style1);
            }
            

            //Start adding layers with random moving chaos in each layer
            for(var i=0;i<NUM_LAYERS;i++){

                var group = game.add.group();
                group.inputEnableChildren = false;
                group.alpha = 0;
                layerArray[i] = group;

                //Pick a direction for group to go
                var direction = directionArray[this.rnd.integerInRange(0,directionArray.length-1)]
                if(direction === "N"){
                    group_x_velocity = 0;
                    group_y_velocity = -INITIAL_SPEED;
                }
                else if(direction === "NE"){
                    group_x_velocity = INITIAL_SPEED;
                    group_y_velocity = -INITIAL_SPEED;
                }
                else if(direction === "E"){
                    group_x_velocity = INITIAL_SPEED;
                    group_y_velocity = 0;
                }
                else if(direction === "SE"){
                    group_x_velocity = INITIAL_SPEED;
                    group_y_velocity = INITIAL_SPEED;
                }
                else if(direction === "S"){
                    group_x_velocity = 0;
                    group_y_velocity = INITIAL_SPEED;
                }
                else if(direction === "SW"){
                    group_x_velocity = -INITIAL_SPEED;
                    group_y_velocity = INITIAL_SPEED;
                }
                else if(direction === "W"){
                    group_x_velocity = -INITIAL_SPEED;
                    group_y_velocity = 0;
                }
                else if(direction === "NW"){
                    group_x_velocity = -INITIAL_SPEED;
                    group_y_velocity = -INITIAL_SPEED;
                }

                var chao_frame = chaoArray.pop();

                //If this is the chosenlayer of the wanted chao
                if(i===chosenlayer){

                   player = layerArray[i].create(game.world.randomX, game.world.randomY, 'player', wanted_chao);
                   game.physics.arcade.enable(player);
                   player.enableBody = true;
                   player.physicsBodyType = Phaser.Physics.ARCADE;
                   player.body.velocity.x = group_x_velocity - 50;
                   player.body.velocity.y = group_y_velocity - 50;
                   player.events.onInputDown.add(onDown, this); 


                   for(var j=0;j<NUM_PER_LAYER - 1;j++){
                        player = layerArray[i].create(game.world.randomX, game.world.randomY, 'player', chao_frame);
                        game.physics.arcade.enable(player);
                        player.enableBody = true;
                        player.physicsBodyType = Phaser.Physics.ARCADE;
                        player.body.velocity.x = group_x_velocity;
                        player.body.velocity.y = group_y_velocity;
                        player.events.onInputDown.add(onDown, this); 
                    }
                }

                else{

                    for(var j=0;j<NUM_PER_LAYER;j++){
                        player = layerArray[i].create(game.world.randomX, game.world.randomY, 'player', chao_frame);
                        game.physics.arcade.enable(player);
                        player.enableBody = true;
                        player.physicsBodyType = Phaser.Physics.ARCADE;
                        player.body.velocity.x = group_x_velocity;
                        player.body.velocity.y = group_y_velocity;
                        player.events.onInputDown.add(onDown, this); 
                    }
                }
            }
        },
    
        //Keep updating wrap function for each layer
        update: function () {

            for(var i=0;i<layerArray.length;i++){
                layerArray[i].forEach(wrap_World, this);
            }

        }


    };
};
