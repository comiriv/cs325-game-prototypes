"use strict";

GameStates.makePreloader = function( game, shared ) {

    var poster;
    var chao;

    var chaoArray;
    var layerArray;
    var wanted_chao;
    var chosenlayer;
    var timer;

    var total_time = 7;

    function updateTime(){

        total_time--;

        if(total_time===0){
            timer.destroy();
            //game.start.state("Game");
        }

    }

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
	
    return {
    
        create: function () {
    

            poster = game.add.sprite(game.world.centerX, game.world.centerY, 'wanted_poster');
            chao = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

            //Create random chao array to pick from for wanted chao and its chosen
            //random layer to reside in
            chaoArray = new Array(4);
            layerArray = new Array(3);
            chaoArray = shuffle(chaoArray);
            wanted_chao = chaoArray.pop();
            var chosenlayer = this.rnd.integerInRange(0,3-1);

            /*shared.chaoframe = wanted_chao;
            shared.chosenlayer = chosenlayer;
            shared.chaoArray = chaoArray;
            shared.layerArray = layerArray;*/

            //  Create our Timer
            timer = game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
            timer.loop(1000, updateTime, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            timer.start();
    
        },
    
        update: function () {
    
    
        }
    
    };
};
