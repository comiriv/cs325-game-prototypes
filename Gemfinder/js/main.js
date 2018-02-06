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
        // Load an image and call it 'logo'.
        game.load.image( 'background', 'assets/background.png' );
        game.load.spritesheet( 'player', 'assets/miner.png',32,48);
        game.load.spritesheet( 'gem', 'assets/diamond.png',50,48);
    }
    
    var player;
    var cursors;
    var hud;
    var total_time;
    var total_gems;
    var gems;

    function create() {

        //Set up game enviroment
        game.add.tileSprite(0, 0, 1920, 1920, 'background');

        game.world.setBounds(0, 0, 1920, 1920);

        game.physics.startSystem(Phaser.Physics.P2JS);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        //game.physics.p2.enable(player);
        game.physics.arcade.enable(player);
        player.enableBody = true;
        player.physicsBodyType = Phaser.Physics.ARCADE;

        //player.body.fixedRotation = true;

        cursors = game.input.keyboard.createCursorKeys();

        //Create gems
        gems = game.add.group();

        gems.enableBody = true;
        gems.physicsBodyType = Phaser.Physics.ARCADE;

        for(var i=0;i<20;i++){

            var gem = gems.create(game.world.randomX, game.world.randomY, 'gem', 0);
        }

        //  Now using the power of callAll we can add the same animation to all coins in the group:
        gems.callAll('animations.add', 'animations', 'spin', [0,1,2,3,5,6,7], 10, true);

        //  And play them
        gems.callAll('animations.play', 'animations', 'spin');

        //Draw Hub Display
        var style = { font: "24px Arial", fill: "#ffffff", align: "center" }

        hud = game.add.text(32, 32, 'Timer', style);
        total_time = 6;
        total_gems = 0;

        hud.fixedToCamera = true;
        hud.cameraOffset.setTo(32, 32);

        //  Create our Timer
        timer = game.time.create(false);

        //  Set a TimerEvent to occur after 2 seconds
        timer.loop(1000, updateTime, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        timer.start();


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

        total_time--;
        if(total_time == 0){
            //  You can set your own fade color and duration
            timer.destroy();
            game.camera.fade(0x000000, 4000);

        }

    }

    function resetFade() {

        game.camera.resetFX();

    }

    function update() {

        //player.body.setZeroVelocity();
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        game.physics.arcade.collide(player, gems, gemCollision, null, this)
        hud.text = "  Timer: " + total_time + "\nGems: " + total_gems;

        if (cursors.up.isDown)
        {
            //player.body.moveUp(300);
            player.body.velocity.y = -300
            player.animations.play('up');
        }
        else if (cursors.down.isDown)
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

//  Called when player collects gems
function gemCollision(player,gem) {

    gem.kill();
    total_gems++;

}

function resetGame(){


    //DESTROY AND RESET GAME
    gems.destroy('true','true');

    total_time = 100;
    total_gems = 0;

    //  Create our Timer
    timer = game.time.create(false);
    timer.loop(1000, updateTime, this);
    timer.start();

    for(var i=0;i<20;i++){

        var gem = gems.create(game.world.randomX, game.world.randomY, 'gem', 0);
    }

    gems.callAll('animations.add', 'animations', 'spin', [0,1,2,3,5,6,7], 10, true);
    gems.callAll('animations.play', 'animations', 'spin');

    game.camera.resetFX();


}

    

};
