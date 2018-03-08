window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update,} );
    
    function preload() {
        game.load.spritesheet( 'player', 'assets/miner.png',32,32);
        game.load.spritesheet( 'gem', 'assets/diamond.png',50,48);
        game.load.audio('escape_music', 'assets/escape_from_ganon_castle.mp3');
        game.load.audio('gem_music', 'assets/cb_crystal.mp3');
        game.load.tilemap('tilemap', 'assets/mine_background.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('mine_tiles', 'assets/mineassets.png');
        game.load.image('basic_tiles', 'assets/basic_tiles.png');
        game.load.spritesheet( 'door', 'assets/door.png',64,16);
        game.load.spritesheet( 'key', 'assets/key.png',30,15);
        game.load.spritesheet( 'arrow', 'assets/arrow.png',18,62);
        game.load.spritesheet( 'boulder', 'assets/boulder.png',59,59);
    }
    
    var player;
    var cursors;
    var hud;
    var TOTAL_TIME = 10;
    var MESSAGE_TIME = 5;
    var TOTAL_GEMS = 0;
    var MAX_GEMS = 20;
    var total_time;
    var total_gems;
    var gems;
    var arrows;
    var arrow;
    var infotext;
    var music;
    var gem_music;
    var BEGINTEXT = 'FIND ALL 20 \nGEMS BEFORE\nMINE COLLAPSES';
    var border;
    var map;
    var red_key = false;
    var green_key = false;
    var yellow_key = false;
    var blue_key = false;
    var keys;
    var RED  = 0;
    var BLUE = 1;
    var GREEN = 2;
    var YELLOW  = 3;
    var boulders;
    var boulder;
    var x_coord = [38*32,33*32,35*32,7*32,13*32,29*32,42*32,92*32,92*32,95*32,92*32,81*32,64*32,57*32,39*32,45*32,17*32,22*32,3*32,5*32];
    var y_coord = [11*32,9*32,23*32,17*32,49*32,39*32,49*32,50*32,25*32,13*32,71*32,92*32,92*32,67*32,89*32,90*32,83*32,95*32,88*32,64*32];



    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
 
        //Change the background colour
        game.stage.backgroundColor = "#a9f0ff";
 

        /**TAKEN FROM JOSH MORONY Create a Running Platformer Game in Phaser with Tilemaps**/
        /** *************************************************************************    **/
        //Add the tilemap and tileset image. The first parameter in addTilesetImage
        //is the name you gave the tilesheet when importing it into Tiled, the second
        //is the key to the asset in Phaser
        map = game.add.tilemap('tilemap');
        map.addTilesetImage('basic', 'basic_tiles');
        map.addTilesetImage('mine', 'mine_tiles');
 
        //Add both the background and ground layers. We won't be doing anything with the
        //GroundLayer though
        backgroundlayer = map.createLayer('BackgroundLayer');

        groundLayer = map.createLayer('GroundLayer');
 
        //Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(0, 4000, true, 'GroundLayer');
        /**********************************************************************************/


        game.world.setBounds(0, 0, 4000, 4000);

        game.physics.startSystem(Phaser.Physics.P2JS);

        player = game.add.sprite(100, 200, 'player');
        player.anchor.setTo( 0.5, 0.5 );


        game.physics.arcade.enable(player);
        player.enableBody = true;
        player.body.collideWorldBounds = true;
        player.physicsBodyType = Phaser.Physics.ARCADE; 
        player.body.setSize(32, 32, 0, 0);

        cursors = game.input.keyboard.createCursorKeys();

        //Create gems
        gems = game.add.group();

        gems.enableBody = true;
        gems.physicsBodyType = Phaser.Physics.ARCADE;

        for(var i=0;i<20;i++){

            var gem = gems.create(x_coord[i], y_coord[i], 'gem', 0);
        }

        //Create Doors
        doors = game.add.group();
        doors.enableBody = true;
        doors.physicsBodyType = Phaser.Physics.ARCADE;
        var door = doors.create(35*32,32*32,'door',RED);
        door.body.immovable = true;
        door = doors.create(49*32,49*32,'door',BLUE);
        door.body.immovable = true;
        door.angle += 90;
        door.body.setSize(16, 64, 0, 0);
        door = doors.create(87*32,59*32,'door',GREEN);
        door.body.immovable = true;
        door = doors.create(36*32,59*32,'door',YELLOW);
        door.body.immovable = true;

        //Create Keys
        keys = game.add.group();
        keys.enableBody = true;
        keys.physicsBodyType = Phaser.Physics.ARCADE;

        var key = keys.create(55*32,92*32,'key',RED);
        key = keys.create(23*32,8*32,'key',BLUE);
        key = keys.create(54*32,4*32,'key',GREEN);
        key = keys.create(3*32,81*32,'key',YELLOW);

        //Create arrow group
        arrows = game.add.group();
        arrows.enableBody = true;
        arrows.physicsBodyType = Phaser.Physics.ARCADE;

        //Create boulders and set them to move back and forth
        boulders = game.add.group();
        boulders.enableBody = true;
        boulders.physicsBodyType = Phaser.Physics.ARCADE;

        boulder = boulders.create(72*32,66*32,'boulder',0);

        boulder.scale.setTo(2,2);

        var boulder1tween = game.add.tween(boulder).to({y:94*32}, 6000).to({y: 66*32}, 8000).repeatAll(-1).start(); 


        boulder = boulders.create(86*32,94*32,'boulder',0);

        boulder.scale.setTo(2,2);

        var boulder2tween = game.add.tween(boulder).to({x: 53*32}, 6000).to({x: 86*32}, 8000).repeatAll(-1).start(); 


        boulder = boulders.create(86*32,62*32,'boulder',0);

        boulder.scale.setTo(2,2);

        var boulder3tween = game.add.tween(boulder).to({y:94*32}, 6000).to({y: 62*32}, 8000).repeatAll(-1).start(); 

        
        //  Now using the power of callAll we can add the same animation to all gems in the group:
        gems.callAll('animations.add', 'animations', 'spin', [0,1,2,3,5,6,7], 10, true);

        //  And play them
        gems.callAll('animations.play', 'animations', 'spin');

        //Draw Hub Display
        var style1 = { font: "24px Arial", fill: "#ffffff", align: "center" };
        var style2 = { font: "60px Arial", fill: "#ffffff", align: "center" };

        hud = game.add.text(32, 32, 'Timer', style1);
        infotext = game.add.text(32,32, BEGINTEXT, style2);
        total_time = TOTAL_TIME;
        total_gems = TOTAL_GEMS;

        

        hud.fixedToCamera = true;
        hud.cameraOffset.setTo(32, 32);

        infotext.fixedToCamera = true;
        infotext.cameraOffset.setTo(163, 150);



        //  Create our Timer
        timer = game.time.create(false);

        //  Set a TimerEvent to occur after 2 seconds
        timer.loop(1000, updateTime, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        timer.start();

        music = game.add.audio('escape_music');
        gem_music = game.add.audio('gem_music');

        music.play();

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

        //  Listen for this signal to reset the Game once the fade is over
        game.camera.onFadeComplete.add(resetGame, this);

    }

    function updateTime() {

        if(!music.isPlaying){   
         music.play(); 
        }

        total_time--;
        if(total_time === (TOTAL_TIME - MESSAGE_TIME)){
            infotext.text = '';
        }

        //Create some arrows
        if(total_time % 10 === 0){

             game.camera.shake(0.05, 500);

             arrow = arrows.create(61*32,3*32,'arrow',0);
             arrow.angle += 180;
             arrow.body.velocity.y = 400;
             arrow.body.setSize(19, 62, 0, -65);

             arrow = arrows.create(63*32,3*32,'arrow',0);
             arrow.angle += 180;
             arrow.body.velocity.y = 400;
             arrow.body.setSize(19, 62, 0, -65);
           
             arrow = arrows.create(69*32,3*32,'arrow',0);
             arrow.angle += 180;
             arrow.body.velocity.y = 400;
             arrow.body.setSize(19, 62, 0, 0);

             arrow = arrows.create(71*32,3*32,'arrow',0);
             arrow.angle += 180;
             arrow.body.velocity.y = 400;
             arrow.body.setSize(19, 62, 0, 0);
       
             arrow = arrows.create(77*32,3*32,'arrow',0);
             arrow.angle += 180;
             arrow.body.velocity.y = 400;
             arrow.body.setSize(19, 62, 0, 0);

             arrow = arrows.create(79*32,3*32,'arrow',0);
             arrow.angle += 180;
             arrow.body.velocity.y = 400;
             arrow.body.setSize(19, 62, 0, 0);
   
        }

        if(total_time === 0){
            //  You can set your own fade color and duration
            timer.destroy();
            game.camera.fade(0x000000, 4000);
            infotext.text = '    GAME OVER';

        }

    }


    function resetFade() {

        //Reset position
        player.x = 100;
        player.y = 200;
        game.camera.resetFX();

    }

    function update() {

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        game.physics.arcade.collide(player, gems, gemCollision, null, this);
        game.physics.arcade.collide(player, doors, doorCollision, null, this);
        game.physics.arcade.collide(player, keys, keyCollision, null, this);
        game.physics.arcade.collide(player, groundLayer, Death, null, this);
        game.physics.arcade.collide(player, boulders, BoulderDeath, null, this);
        game.physics.arcade.overlap(arrows, groundLayer, ArrowWallCollision, null, this);
        game.physics.arcade.collide(player, arrows, ArrowPlayerCollision, null, this);

        hud.text = "  Timer: " + total_time + "\nGems: " + total_gems;

        if(total_gems===MAX_GEMS){
            //  You can set your own fade color and duration
            timer.destroy();
            game.camera.fade(0x000000, 4000);
            infotext.text = '    YOU WIN';
        }

        if (cursors.up.isDown)
        {
            player.body.velocity.y = -300
            player.animations.play('up');
        }
        else if (cursors.down.isDown && !player.body.blocked.down)
        {
            player.body.velocity.y = 300
            player.animations.play('down');
        }

        else if (cursors.left.isDown)
        {
            player.body.velocity.x = -300;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 300
            player.animations.play('right');
        }
        else {
            player.animations.stop();
            player.frame = 1;
        }
          
    }

function Death(player, tile){
    // You can set your own fade color and duration
    //infotext.text = 'Tile Index: ' + tile.index;

    //If the tile is lava
    if(tile.index === 97){
        player.visible = false;
        player.immovable = true;
        timer.destroy();
        game.camera.fade(0x000000, 4000);
        infotext.text = '    YOU DIED';
    }
}

function BoulderDeath(player, boulder){
    player.visible = false;
    player.immovable = true;
    timer.destroy();
    game.camera.fade(0x000000, 4000);
    infotext.text = '    YOU DIED';
}

function ArrowPlayerCollision(player, arrow){
   arrow.destroy();
   player.visible = false;
   player.immovable = true;
   timer.destroy();
   game.camera.fade(0x000000, 4000);
   infotext.text = '    YOU DIED';
}

function ArrowWallCollision(arrow,tile){
    //If the tile is lava
    if(tile.index === 489){
        arrow.destroy();
    }
}

//Called when player collects gems
function gemCollision(player,gem) {

    gem.kill();
    gem_music.play();
    total_gems++;

}

//Called when player collects keys
function keyCollision(player,key) {

    gem_music.play();

    if(key.frame === 0){
        red_key = true;
    }
    if(key.frame === 1){
        blue_key = true;
    }
    if(key.frame === 2){
        green_key = true;
    }
    if(key.frame === 3){
        yellow_key = true;
    }

    key.kill();
}


//Called when player collects doors
function doorCollision(player,door) {

    if(red_key === true && door.frame === 0){
        door.kill();
        infotext.text = "";
    }
    else if(blue_key === true && door.frame === 1){
        door.kill();
        infotext.text = "";
    }
    else if(green_key === true && door.frame === 2){
        door.kill();
        infotext.text = "";
    }
    else if(yellow_key === true && door.frame === 3){
        door.kill();
        infotext.text = "";
    }
    else{
        infotext.text = "Find the Key";
    }


}


//Called when game needs to be reset
function resetGame(){

    //DESTROY AND RESET GAME
    player.visible = true;
    player.immovable = false;

    gems.destroy('true','true');

    total_time = TOTAL_TIME;
    total_gems = TOTAL_GEMS;
    infotext.text = BEGINTEXT;

    //  Create our Timer
    timer = game.time.create(false);
    timer.loop(1000, updateTime, this);
    timer.start();

    music.restart();

    for(var i=0;i<20;i++){

         var gem = gems.create(x_coord[i], y_coord[i], 'gem', 0);
    }

    gems.callAll('animations.add', 'animations', 'spin', [0,1,2,3,5,6,7], 10, true);
    gems.callAll('animations.play', 'animations', 'spin');

    resetFade();


    }
    
};
