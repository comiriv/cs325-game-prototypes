window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.spritesheet( 'player', 'assets/miner.png',32,48);
        game.load.spritesheet( 'gem', 'assets/diamond.png',50,48);
        game.load.audio('escape_music', 'assets/escape_from_ganon_castle.mp3');
        game.load.audio('gem_music', 'assets/cb_crystal.mp3');
        game.load.tilemap('tilemap', 'assets/mine_background.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('border_tiles', 'assets/mine_borders2.png');
        game.load.image('basic_tiles', 'assets/basic_tiles.png');
    }
    
    var player;
    var cursors;
    var hud;
    var TOTAL_TIME = 200;
    var MESSAGE_TIME = 5;
    var TOTAL_GEMS = 0;
    var MAX_GEMS = 15;
    var total_time;
    var total_gems;
    var gems;
    var infotext;
    var music;
    var gem_music;
    var BEGINTEXT = 'FIND 15 \nGEMS BEFORE\nMINE COLLAPSES';
    var border;
    var map;

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
        map.addTilesetImage('border', 'border_tiles');
 
        //Add both the background and ground layers. We won't be doing anything with the
        //GroundLayer though
        backgroundlayer = map.createLayer('BackgroundLayer');

        groundLayer = map.createLayer('GroundLayer');
 
        //Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(0, 4000, true, 'GroundLayer');
        /**********************************************************************************/


        game.world.setBounds(0, 0, 1920, 1920);

        game.physics.startSystem(Phaser.Physics.P2JS);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        game.physics.arcade.enable(player);
        player.enableBody = true;
        player.body.collideWorldBounds = true;
        player.physicsBodyType = Phaser.Physics.ARCADE;

        cursors = game.input.keyboard.createCursorKeys();

        //Create gems
        gems = game.add.group();

        gems.enableBody = true;
        gems.physicsBodyType = Phaser.Physics.ARCADE;

        for(var i=0;i<20;i++){

            var gem = gems.create(game.world.randomX, game.world.randomY, 'gem', 0);
        }


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
        if(total_time % 10 === 0){
            game.camera.shake(0.05, 500);
        }
        if(total_time === 0){
            //  You can set your own fade color and duration
            timer.destroy();
            game.camera.fade(0x000000, 4000);
            infotext.text = '    GAME OVER';

        }

    }

    function resetFade() {

        game.camera.resetFX();

    }

    function update() {

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        game.physics.arcade.collide(player, gems, gemCollision, null, this)
        game.physics.arcade.collide(player, groundLayer);

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

//Called when player collects gems
function gemCollision(player,gem) {

    gem.kill();
    gem_music.play();
    total_gems++;

}

//Called when game needs to be reset
function resetGame(){


    //DESTROY AND RESET GAME
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

        var gem = gems.create(game.world.randomX, game.world.randomY, 'gem', 0);
    }

    gems.callAll('animations.add', 'animations', 'spin', [0,1,2,3,5,6,7], 10, true);
    gems.callAll('animations.play', 'animations', 'spin');

    game.camera.resetFX();


    }

    
};
