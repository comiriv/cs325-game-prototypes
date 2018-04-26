"use strict";

GameStates.makeGame = function( game, shared ) {


    // Create your own variables.

    var timer = null;
    var style1 = { font: "14px Arial", fill: "black", align: "left" };
    var style2 = { font: "40px Arial", fill: "black", align: "center" };
    var map = null;
    var backgroundlayer = null;
    var groundLayer = null;
    var hud = null;
    var infotext = null;
    var rolltext = null;
    var player = null;
    var player2 = null;
    var player3 = null;
    var area1_x = [32 * 11, 32 * 13, 32 * 15, 32 * 17, 32 * 19, 32 * 21, 32 * 23, 32 * 25, 32 * 27, 32 * 27, 32 * 27, 32 * 27, 32 * 27, 32 * 27, 32 * 25, 32 * 23, 32 * 21, 32 * 19, 32 * 17, 32 * 15, 32 * 13, 32 * 11, 32 * 11, 32 * 11, 32 * 11, 32 * 11];
    var area1_y = [32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 12, 32 * 14, 32 * 16, 32 * 18, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 18, 32 * 16, 32 * 14, 32 * 12];
    var area2_y = [832, 832, 832, 832, 832, 832, 832, 832, 832, 896, 960, 1024, 1088, 1152, 1152, 1152, 1152, 1152, 1152, 1152, 1152, 1152, 1088, 1024, 960, 896];
    var area3_y = [1344, 1344, 1344, 1344, 1344, 1344, 1344, 1344, 1344, 1408, 1472, 1536, 1600, 1664, 1664, 1664, 1664, 1664, 1664, 1664, 1664, 1664, 1600, 1536, 1472, 1408];
    var area1_type = ['Train','100','X','100','150','Bus','100','Start', '150', 'Plane', '100','150', '100', 'Train', '100','50','X','100','150','Bus','100', '50','Plane','100','150','100'];
    var area2_type =  ['Train','100','X','100','150','Bus','100','Start', '150', 'Plane', '100','150', '100', 'Train', '100','50','X','100','150','Bus','100', '50','Plane','100','150','100'];
    var area3_type =  ['Train','100','X','100','150','Bus','100','Start', '150', 'Plane', '100','150', '100', 'Train', '100','50','X','100','150','Bus','100', '50','Plane','100','150','100'];
    var plane_cities = ['Paris','Madrid','Bahamas','Japan','Moscow', 'London'];
    var train_cities = ['Chicago','Virginia Beach', 'Los Angeles','Philadelphia','Seattle','Miami'];
    var turn = 1;
    var key_A = null;
    var key_Enter = null;
    var round = 1;
    var MAX_ROUNDS = 1;
    var end_of_game = false;
    var end_timer = 2;

    //Quit game function
    function quitGame() {

            area1_x = [32 * 11, 32 * 13, 32 * 15, 32 * 17, 32 * 19, 32 * 21, 32 * 23, 32 * 25, 32 * 27, 32 * 27, 32 * 27, 32 * 27, 32 * 27, 32 * 27, 32 * 25, 32 * 23, 32 * 21, 32 * 19, 32 * 17, 32 * 15, 32 * 13, 32 * 11, 32 * 11, 32 * 11, 32 * 11, 32 * 11];
            area1_y = [32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 10, 32 * 12, 32 * 14, 32 * 16, 32 * 18, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 20, 32 * 18, 32 * 16, 32 * 14, 32 * 12];
            area2_y = [832, 832, 832, 832, 832, 832, 832, 832, 832, 896, 960, 1024, 1088, 1152, 1152, 1152, 1152, 1152, 1152, 1152, 1152, 1152, 1088, 1024, 960, 896];
            area3_y = [1344, 1344, 1344, 1344, 1344, 1344, 1344, 1344, 1344, 1408, 1472, 1536, 1600, 1664, 1664, 1664, 1664, 1664, 1664, 1664, 1664, 1664, 1600, 1536, 1472, 1408];
            area1_type = ['Train','100','X','100','150','Bus','100','Start', '150', 'Plane', '100','150', '100', 'Train', '100','50','X','100','150','Bus','100', '50','Plane','100','150','100'];
            area2_type =  ['Train','100','X','100','150','Bus','100','Start', '150', 'Plane', '100','150', '100', 'Train', '100','50','X','100','150','Bus','100', '50','Plane','100','150','100'];
            area3_type =  ['Train','100','X','100','150','Bus','100','Start', '150', 'Plane', '100','150', '100', 'Train', '100','50','X','100','150','Bus','100', '50','Plane','100','150','100'];
            plane_cities = ['Paris','Madrid','Bahamas','Japan','Moscow', 'London'];
            train_cities = ['Chicago','Virginia Beach', 'Los Angeles','Philadelphia','Seattle','Miami'];

            turn = 1;
            key_A = null;
            key_Enter = null;
            round = 1;
            MAX_ROUNDS = 1;
            end_of_game = false;
            end_timer = 2
            ;

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

    function rollNumber(){
        var p;
        var pname;

        //Find out who's turn it is
        if(turn == 0){
            return;
        }

        if(turn == 1){
            p = player;
            pname = 'Player 1';
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }
        else if(turn == 2){
            p = player2;
            pname = 'Player 2';
            game.camera.follow(player2, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        }
        else {
            p = player3;
            pname = 'Player 3';
            game.camera.follow(player3, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }
        p.roll = game.rnd.integerInRange(1, 12);
        rolltext.text = pname + " ROLLED A " + p.roll;
        p.hasRolled = true;
    }

    function updatePosition(){

        var p;
        var land = false;
        //Find out who's turn it is
        if(turn == 0){
            return;
        }

        if(turn == 1){
            p = player;
        }
        else if(turn == 2){
            p = player2;
        }
        else {
            p = player3;
        }

        if(p.roll > 0){
            p.roll--;
            rolltext.text = p.roll;
            if(p.roll==0){
                land = true;
            }
        }
        else if (p.roll == 0){
            p.roll--;
            return;
        }

        else{
            return;
        }

        //Calculate new n
        if(p.n+1 > 25){
           p.n = 0; 
        }
        else{
           p.n = p.n + 1;
        }

        //Calculate position in player's area
        if(p.area == 1){
            p.x = area1_x[p.n];
            p.y = area1_y[p.n];
        }
        else if(p.area == 2){
            p.x = area1_x[p.n];
            p.y = area2_y[p.n];
        }
        else if(p.area == 3){
            p.x = area1_x[p.n];
            p.y = area3_y[p.n];
        }

        if(land){
            landSpace();
        }
    }

    function landSpace(){

        var p;
        var space;
        var area_type;
        var pname;

        //Find out who's turn it is
        if(turn == 0){
            return;
        }

        if(turn == 1){
            p = player;
            pname = 'Player 1';
        }
        else if(turn == 2){
            p = player2;
            pname = 'Player 2';
        }
        else {
            p = player3;
            pname = 'Player 3';
        }

        //Calculate position in player's area
        if(p.area == 1){

            area_type = area1_type;
          
        }
        else if(p.area == 2){
            area_type = area2_type;

        }
        else if(p.area == 3){

            area_type = area3_type;
        }

        if(area_type[p.n] != null){
            space = area_type[p.n];
            console.log(space);
            if(space == '50'){
                p.money+=50;
                infotext.text = pname + ' gained 50 Dollars';
            }
            if(space == '100'){
                p.money+=100;
                infotext.text = pname + ' gained 100 Dollars';
            }
            if(space == '150'){
                p.money+=150;
                infotext.text = pname + ' gained 150 Dollars';
            }
            if(space == 'X'){
                p.score--;
                infotext.text = pname + ' lost one Souvenir';
            }

        }

    
        
    }


    function takeStation(){

        var p;
        var space;
        var area_type;
        var pname;

        //Find out who's turn it is
        if(turn == 0){
            return;
        }

        if(turn == 1){
            p = player;
            pname = 'Player 1';
        }
        else if(turn == 2){
            p = player2;
            pname = 'Player 2';
        }
        else {
            p = player3;
            pname = 'Player 3';
        }

        //Calculate position in player's area
        if(p.area == 1){

            area_type = area1_type;
          
        }
        else if(p.area == 2){
            area_type = area2_type;

        }
        else if(p.area == 3){

            area_type = area3_type;
        }

        if(area_type[p.n] != null){
            space = area_type[p.n];
            if(space == 'Train'){
                if(p.train_tickets > 0){
                    p.train_tickets--;
                    p.score+=2;
                    infotext.text = pname + ' Rode to  ' + train_cities.pop() + '\n\n';
                    infotext.text += pname + ' Gained 2 Souvenirs';
                    area_type[p.n] = null;
                }
                else if(p.money >= 150){
                    p.money-=150;
                    p.score+=2;
                    infotext.text = pname + ' Rode to  ' + train_cities.pop() + '\n\n';
                    infotext.text += pname + ' Gained 2 Souvenirs';
                    area_type[p.n] = null;
                }
                else{
                    infotext.text = 'NEED 150 for 1 Train Ticket';
                }
            }
            else if(space == 'Plane'){
                if(p.plane_tickets > 0){
                    p.plane_tickets--;
                    p.score+=3;
                    infotext.text = pname + ' Flew to  ' + plane_cities.pop() + '\n\n';
                    infotext.text += pname + ' Gained 3 Souvenirs';
                    area_type[p.n] = null;
                }
                else if(p.money >= 200){
                    p.money-=200;
                    p.score+=3;
                    infotext.text = pname + ' Flew to  ' + plane_cities.pop() + '\n\n';
                    infotext.text += pname + ' Gained 3 Souvenirs';
                    area_type[p.n] = null;
                }
                else{
                    infotext.text = 'NEED 200 for 1 Plane Ticket';
                }
            }

            else if(space == 'Bus'){
                if(p.bus_tickets > 0){
                    p.bus_tickets--;
                    if(p.x == (32 * 15) && p.y == (32 * 20)){
                        p.x = 32 * 21;
                        p.y = 32 * 26;
                        p.area = 2;
                        p.n = 5
                    }
                    else if(p.x == (32 * 21) && p.y == (32 * 26)) {
                        p.x = 32 * 15;
                        p.y = 32 * 20;
                        p.n = 19
                        p.area = 1
                    }
                    else if(p.x == (32 * 15) && p.y == (32 * 36)){
                        p.x = 32 * 21;
                        p.y = 32 * 42;
                        p.area = 3;
                        p.n = 5
                    }
                    else if(p.x == (32 * 21) && p.y == (32 * 42)) {
                        p.x = 32 * 15;
                        p.y = 32 * 36;
                        p.area = 2
                        p.n = 19;
                    }
                    else if(p.x == (32 * 15) && p.y == (32 * 52)){
                        p.x = 32 * 21;
                        p.y = 32 * 10;
                        p.area = 1;
                        p.n = 5;
                    }
                    else if(p.x == (32 * 21) && p.y == (32 * 10)) {
                        p.x = 32 * 15;
                        p.y = 32 * 52;
                        p.area = 3;
                        p.n = 19;
                    }
                }
                else if(p.money >= 100){
                    p.money-=100;
                    if(p.x == (32 * 15) && p.y == (32 * 20)){
                        p.x = 32 * 21;
                        p.y = 32 * 26;
                        p.area = 2;
                        p.n = 5
                    }
                    else if(p.x == (32 * 21) && p.y == (32 * 26)) {
                        p.x = 32 * 15;
                        p.y = 32 * 20;
                        p.n = 19
                        p.area = 1
                    }
                    else if(p.x == (32 * 15) && p.y == (32 * 36)){
                        p.x = 32 * 21;
                        p.y = 32 * 42;
                        p.area = 3;
                        p.n = 5
                    }
                    else if(p.x == (32 * 21) && p.y == (32 * 42)) {
                        p.x = 32 * 15;
                        p.y = 32 * 36;
                        p.area = 2
                        p.n = 19;
                    }
                    else if(p.x == (32 * 15) && p.y == (32 * 52)){
                        p.x = 32 * 21;
                        p.y = 32 * 10;
                        p.area = 1;
                        p.n = 5;
                    }
                    else if(p.x == (32 * 21) && p.y == (32 * 10)) {
                        p.x = 32 * 15;
                        p.y = 32 * 52;
                        p.area = 3;
                        p.n = 19;
                    }
                }
                else{
                    infotext.text = 'NEED 100 for 1 Bus Ticket';
                }
            }
          }
          else{
                infotext.text = 'Space already taken';
          }
    }

    function updateTime(){

        if(end_of_game){

            if(end_timer==2){
                infotext.text = 'GAME OVER';
            }

            if(end_timer==1){
                infotext.text = 'Player 1: ' + player.score + '\n\n' + 'Player 2: ' + player2.score + '\n\n' + 'Player 3: ' + player3.score;
            }

            if(end_timer > 0){
                end_timer--;
            }
            else{
                quitGame();
            }
        }
        else{

            infotext.text = '';
        }
    }


    return {
    
        create: function () {

            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            map = game.add.tilemap('tilemap');
            map.addTilesetImage('basic', 'basic_tiles');
            map.addTilesetImage('board', 'board_tiles');
     
            //Add both the background and ground layers. We won't be doing anything with the
            //GroundLayer though
            backgroundlayer = map.createLayer('BackgroundLayer');

            groundLayer = map.createLayer('GroundLayer');

            game.world.setBounds(0, 0, 4000, 4000);

            game.physics.startSystem(Phaser.Physics.P2JS);

            player = game.add.sprite(32 * 25, 32 * 10, 'player',0);
            player.n = 7;
            player.area = 1;
            player.score = 0;
            player.money = 200;
            player.bus_tickets = 0;
            player.train_tickets = 0;
            player.plane_tickets = 0;
            player.hasRolled = false;
            player.roll = 0;

            player2 = game.add.sprite(32 * 25, 32 * 26, 'player',1);
            player2.n = 7;
            player2.area = 2;
            player2.money = 200;
            player2.score = 0;
            player2.bus_tickets = 0;
            player2.train_tickets = 0;
            player2.plane_tickets = 0
            player2.hasRolled = false;
            player2.roll = 0;

            player3 = game.add.sprite(32 * 25, 32 * 42, 'player',2);
            player3.n = 7;
            player3.area = 3;
            player3.money = 200;
            player3.score = 0;
            player3.bus_tickets = 0;
            player3.train_tickets = 0;
            player3.plane_tickets = 0;
            player3.hasRolled = false;
            player3.roll = 0;

            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            hud = game.add.text(32, 32, '', style1);
            infotext = game.add.text(32,32, '', style2);
            rolltext = game.add.text(32,32, '', style2);

            hud.fixedToCamera = true;
            hud.cameraOffset.setTo(32, 32);

            infotext.fixedToCamera = true;
            infotext.cameraOffset.setTo(163, 150);

            rolltext.fixedToCamera = true;
            rolltext.cameraOffset.setTo(163, 200);


            //  Create our Timer
            timer = game.time.create(false);

            //  Set a TimerEvent to occur after 5 seconds
            timer.loop(5000, updateTime, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            timer.start();

            key_A = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            key_A.onDown.add(updatePosition,this);

            key_Enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            key_Enter.onDown.add(takeStation,this);


            infotext.text = 'ROUND ' + round + ' STARTS';
            rollNumber();


        },
    
    
        update: function () {
                hud.text = 'Player 1 Souvenirs: ' + player.score + '                   ' + 'Player 2 Souvenirs: ' + player2.score + '                   ' + 'Player 3 Souvenirs: ' + player3.score  + '\n'; 
                //hud.text += 'Player 1 Bus Tickets: ' + player.bus_tickets + '                '  + 'Player 2 Bus Tickets: ' + player2.bus_tickets + '                 ' + 'Player 3 Bus Tickets: ' + player3.bus_tickets + '\n';
                //hud.text += 'Player 1 Train Tickets: ' + player.train_tickets + '              ' + 'Player 2 Train Tickets: ' + player2.train_tickets + '               ' + 'Player 3 Train Tickets: ' + player3.train_tickets + '\n';
                //hud.text += 'Player 1 Plane Tickets: ' + player.plane_tickets + '             ' + 'Player 2 Plane Tickets: ' + player2.plane_tickets + '             ' + 'Player 3 Plane Tickets: ' + player3.plane_tickets + '\n';
                hud.text += 'Player 1 Money: ' + player.money + '                       ' + 'Player 2 Money: ' + player2.money + '                         ' + 'Player 3 Money: ' + player3.money + '\n';


                //The game ends once we visited all the cities or we are past MAX ROUNDS
                if((round > MAX_ROUNDS) || (plane_cities.length == 0 && train_cities.length == 0)){
                    end_of_game = true;
                    turn = 0;
                    rolltext.text = '';
                }

                //Else we alternating turns and rolling for each player
                else if(player.roll < 0 && player.hasRolled && !end_of_game){
                    player.roll = 0;
                    player.hasRolled = false;
                    turn = 2;
                    rollNumber();
                }
                else if(player2.roll < 0 && player2.hasRolled && !end_of_game){
                    player2.roll = 0;
                    player2.hasRolled = false;
                    turn = 3;
                    rollNumber();
                }
                else if(player3.roll < 0 && player3.hasRolled && !end_of_game){
                    player3.roll = 0;
                    player3.hasRolled = false;
                    turn = 1;
                    round++;
                    if(round <= MAX_ROUNDS){
                        infotext.text = 'ROUND ' + round + ' STARTS';
                        rollNumber();
                    }
                }

        }


    };
};
