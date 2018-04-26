"use strict";

GameStates.makeGame = function( game, shared ) {


    // Create your own variables.
    var MAX_HEALTH = 20;
    var HEALTH_GAIN = 8;
    var NUM_ROUNDS = 3;
    var COOL_DOWN = 3 + 1;


    //Game variables
    var style1 = { font: "25px Arial", fill: "#ffffff", align: "center" };
    var style2 = { font: "16px Arial", fill: "#ffffff", align: "center" };
    var music = null;
    var timer = null;
    var timer2 = null;
    var fulldeck = null;
    var firedeck = null;
    var waterdeck = null;
    var airdeck = null;
    var earthdeck = null;
    var turn = 0;
    var player1 = null;
    var player2 = null;
    var end_of_game = false;
    var maintext = null;
    var cooldowntext = null;
    var click = true;
    var rounds = 1;
    var p1_first = true;



    //Quit game function
    function quitGame() {

        //Go back to main menu
        game.state.start("MainMenu");


    }

    /*************************************************************************************************/
    /*************************************************************************************************/

    function cardAction(player,cardeck){
        var frame = cardeck.frame;

        if(frame >= 0 && frame <= 6){
            player.element = "fire";
        }
        else if(frame >= 7 && frame <= 13){
            player.element = "water";
        }
        else if(frame >= 14 && frame <= 20){
            player.element = "air";
        }
        else if(frame >= 21 && frame <= 27){
            player.element = "earth";
        }

        if(frame==0 || frame==7 || frame==14 || frame==21){
            player.attack = 2;
        }
        else if(frame==1 || frame==8 || frame==15 || frame==22){
            player.attack = 3;
        }
        else if(frame==2 || frame==9 || frame==16 || frame==23){
            player.attack = 4;
        }
        else if(frame==3 || frame==10 || frame==17 || frame==24){
            player.defense = 2;
        }
        else if(frame==4 || frame==11 || frame==18 || frame==25){
            player.defense = 3;
        }
        else if(frame==5 || frame==12 || frame==19 || frame==26){
            player.defense = 4;
        }

        if(frame == 6){
            player.attack = 8;
        }
        else if(frame == 13){
            player.heal = true;
        }
        else if(frame == 20){
            player.dodge = true;
        }
        else if(frame == 27){
            player.attack = 4;
            player.defense = 4;
        }

        return player;



    }

    function onDown(cardeck){

        var p;
        var x;

        if(!click){
            return;
        }

        if(turn == 1){
            p = player1;
            x = 10;
        }
        else if(turn == 2){
            p = player2;
            x = 710;
        }
        else{
            return;
        }

        if(cardeck.deckType != "full"){
            p.cooldown = COOL_DOWN;
        }

        p.card = game.add.sprite(x, 450, 'card' , cardeck.frame);
        p = cardAction(p,cardeck);

        if(p1_first){
            if(turn==1){
                turn=2;
                maintext.text = "Player 2's Turn";
                timer.add(5000, updateTime, this);
            }

            else if(turn==2){
                turn=1;
                maintext.text = "READY";
                timer.add(5000, duel, this);
                click = false;
            
            }
        }
        else{

            if(turn==2){
                turn=1;
                maintext.text = "Player 1's Turn";
                timer.add(5000, updateTime, this);
            }

            else if(turn==1){
                turn=2;
                maintext.text = "READY";
                timer.add(5000, duel, this);
                click = false;
            
            }
        }

    }

    function duel(){

        //P1 picks Air and P2 picks Earth 
        //P1 picks Earth and P2 picks Water 
        //P1 picks Water and P2 picks Fire
        //P1 picks Fire and P2 picks Air
        //      P2's attacks are nullified
        //THIS HAPPENS VICE VERSA

        var player1_reduction = 1;
        var player2_reduction = 1;
        maintext.text = "";
        var player1_weak = false;
        var player2_weak = false;

        if((player1.element == "air" && player2.element == "earth") || (player1.element == "earth" && player2.element == "water") || (player1.element == "water" && player2.element == "fire") || (player1.element == "fire" && player2.element == "air") ) {
            player2_reduction = 2;
            player2_weak = true;
            maintext.text += "PLAYER 2's " + player2.element + " WAS HALFED BY PLAYER 1's " + player1.element + "\n";


        }
        else if((player2.element == "air" && player1.element == "earth") || (player2.element == "earth" && player1.element == "water") || (player2.element == "water" && player1.element == "fire") || (player2.element == "fire" && player1.element == "air") ) {
            player1_reduction = 2;
            player1_weak= true;
            maintext.text += "PLAYER 1's " + player1.element + " WAS HALFED BY PLAYER 2's " + player2.element + "\n";
        }

        player1.attack /= player1_reduction;
        player2.attack /= player2_reduction;
        player1.defense /= player1_reduction;
        player2.defense /= player2_reduction;

        var p1_outcome = player2.attack - player1.defense;
        var p2_outcome = player1.attack - player2.defense;
        

        var health;

        //Check if special cards were chosen
       
        if(player1.dodge == true){
            p1_outcome = 0;
            if(player1_weak){
               maintext.text += "FIRE HAS NO EFFECT ON DODGE\n"; 
            }
            maintext.text += "PLAYER 1 DODGED\n";
        }

        if(player2.dodge == true){
            p2_outcome = 0;
            if(player2_weak){
               maintext.text += "FIRE HAS NO EFFECT ON DODGE\n"; 
            }
            maintext.text += "PLAYER 2 DODGED\n";
        }


        //Determine outcome
        if(p1_outcome > 0){
            maintext.text += "PLAYER 1 WAS DEALT " + p1_outcome + " DAMAGE\n";
            player1.health -= p1_outcome;
        }
        else{
            maintext.text += "PLAYER 1 RECEIVED NO DAMAGE\n";
        }

        if(p2_outcome > 0){
            maintext.text += "PLAYER 2 WAS DEALT " + p2_outcome + " DAMAGE\n";
            player2.health -= p2_outcome;
        }
        else{
            maintext.text += "PLAYER 2 RECEIVED NO DAMAGE\n";
        }

        if(player1.heal == true){
            health = HEALTH_GAIN / player1_reduction;
            player1.health += health;
            if(player1.health > MAX_HEALTH){
                player1.health = MAX_HEALTH;
            }
            maintext.text += "PLAYER 1 HEALED " + health + " LIFE POINTS\n";
        }
        if(player2.heal == true){
            health = HEALTH_GAIN / player2_reduction;
            player2.health += health;
            if(player2.health > MAX_HEALTH){
                player2.health = MAX_HEALTH;
            }
            maintext.text += "PLAYER 2 HEALED " + health + " LIFE POINTS\n";
        }

        timer.add(5000, resetPlayers, this);
    }

    function resetPlayers(){

        player1.attack = 0;
        player1.defense = 0;
        player1.dodge = false;
        player1.heal = false;
        player1.element = "";
        player1.card.destroy();
        player1.card = null;
       

        player2.attack = 0;
        player2.defense = 0;
        player2.dodge = false;
        player2.heal = false;
        player2.element = "";
        player2.card.destroy();
        player2.card = null;

        //Every three rounds Switch order Player 1 and 2 starts
        if(rounds % NUM_ROUNDS == 0){
            if(p1_first){
                p1_first = false;
                maintext.text = "SWITCH\nPlayer 2's Turn";
                turn = 2;
            }
            else{
                p1_first = true;
                maintext.text = "SWITCH\nPlayer 1's Turn";
                turn = 1;
            }
            
        }
        else{

            if(p1_first){
                maintext.text = "Player 1's Turn";
            }
            else{
                maintext.text = "Player 2's Turn";
            }

        }

        rounds++;

        if(player1.cooldown > 0){
            player1.cooldown--;
        }

        if(player2.cooldown > 0){
            player2.cooldown--;
        }
    
        click = true;
        timer.add(5000, updateTime, this);
        
    }

     function updateTime(){

        if(end_of_game){
            quitGame();
        }
        else{
            maintext.text = "";
        }

     }

     function updateMusic(){
        music.play();
     }



    
    return {
    
        create: function () {

            click = true;
            end_of_game = false;
            rounds = 1;
            p1_first = true;
            
            fulldeck = game.add.sprite(350, 400, 'card' );
            fulldeck.animations.add('fulldeck', null, 25, true);
            fulldeck.animations.play('fulldeck');
            fulldeck.inputEnabled = true;
            fulldeck.deckType = "full";
            fulldeck.events.onInputDown.add(onDown, this); 


            firedeck = game.add.sprite(125, 10, 'card' );
            firedeck.animations.add('firedeck', [0,1,2,3,4,5,6] , 15, true);
            firedeck.animations.play('firedeck');
            firedeck.inputEnabled = true;
            firedeck.deckType = "fire";
            firedeck.events.onInputDown.add(onDown, this); 

            airdeck = game.add.sprite(275, 10, 'card' );
            airdeck.animations.add('airdeck', [14,15,16,17,18,19,20] , 15, true);
            airdeck.animations.play('airdeck');
            airdeck.inputEnabled = true;
            airdeck.deckType = "air";
            airdeck.events.onInputDown.add(onDown, this); 

            earthdeck = game.add.sprite(425, 10, 'card' );
            earthdeck.animations.add('earthdeck', [21,22,23,24,25,26,27] , 15, true);
            earthdeck.animations.play('earthdeck');
            earthdeck.inputEnabled = true;
            earthdeck.deckType = "earth";
            earthdeck.events.onInputDown.add(onDown, this); 

            waterdeck = game.add.sprite(575, 10, 'card' );
            waterdeck.animations.add('waterdeck', [7,8,9,10,11,12,13] , 15, true);
            waterdeck.animations.play('waterdeck');
            waterdeck.inputEnabled = true;
            waterdeck.deckType = "water";
            waterdeck.events.onInputDown.add(onDown, this); 

            

            

            player1 = game.add.sprite(10, 400, 'player' ,0);
            player1.health = MAX_HEALTH;
            player1.attack = 0;
            player1.defense = 0;
            player1.dodge = false;
            player1.heal = false;
            player1.element = "";
            player1.card = null;
            player1.halfdeck = true;
            player1.cooldown = 0;
            player1.hud = game.add.text(50,407, '', style2);

            player2 = game.add.sprite(700, 400, 'player' ,1);
            player2.health = MAX_HEALTH;
            player2.attack = 0;
            player2.defense = 0;
            player2.dodge = false;
            player2.heal = false;
            player2.element = "";
            player2.card = null;
            player2.halfdeck = true;
            player2.cooldown = 0;
            player2.hud = game.add.text(740, 407, '', style2);

            maintext = game.add.text(50,200, "Player 1's Turn", style1);
            cooldowntext = game.add.text(100,50, "", style1);

            music = game.add.audio('jazz_music');
            music.play();


             //  Create our Timer
            timer = game.time.create(false);

            //  Set a TimerEvent to occur after 5 seconds
            timer.add(5000, updateTime, this);
            timer.loop(53000,updateMusic,this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            timer.start();

            turn = 1;


        },
    
        //Keep updating wrap function for each layer
        update: function () {

            player1.hud.text = player1.health + " / " + MAX_HEALTH;
            player2.hud.text = player2.health + " / " + MAX_HEALTH;

            if(turn == 1){

                if(player1.cooldown == 0){
                    firedeck.visible = true;
                    waterdeck.visible = true;
                    earthdeck.visible = true;
                    airdeck.visible = true;
                    firedeck.inputEnabled = true;
                    waterdeck.inputEnabled = true;
                    earthdeck.inputEnabled = true;
                    airdeck.inputEnabled = true;
                    cooldowntext.text = "";
                }

                else if(click == true){

                    firedeck.visible = false;
                    waterdeck.visible = false;
                    earthdeck.visible = false;
                    airdeck.visible = false;
                    firedeck.inputEnabled = false;
                    waterdeck.inputEnabled = false;
                    earthdeck.inputEnabled = false;
                    airdeck.inputEnabled = false;
                    cooldowntext.text = "PLAYER 1 ELEMENT DECK COOL DOWN " + player1.cooldown + " ROUNDS";
                }

            }
            else if(turn == 2){

                if(player2.cooldown == 0){
                    firedeck.visible = true;
                    waterdeck.visible = true;
                    earthdeck.visible = true;
                    airdeck.visible = true;
                    firedeck.inputEnabled = true;
                    waterdeck.inputEnabled = true;
                    earthdeck.inputEnabled = true;
                    airdeck.inputEnabled = true;
                    cooldowntext.text = "";
                }

                else if(click == true){
                    
                    firedeck.visible = false;
                    waterdeck.visible = false;
                    earthdeck.visible = false;
                    airdeck.visible = false;
                    firedeck.inputEnabled = false;
                    waterdeck.inputEnabled = false;
                    earthdeck.inputEnabled = false;
                    airdeck.inputEnabled = false;
                    cooldowntext.text = "PLAYER 2 ELEMENT DECK COOL DOWN " + player2.cooldown + " ROUNDS";
                }

            }


            if(player1.health <= 0 || player2.health <= 0){

                if(player1.health < 0){
                    player1.health = 0;
                }

                if(player2.health < 0){
                    player2.health = 0;
                }

                turn = 0;
                click = false;
                maintext.text = "GAME OVER";
                end_of_game = true;
                timer.add(5000, updateTime, this);
            }

            

        }


    };
};
