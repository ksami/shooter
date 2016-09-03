class Player {
  constructor(game, opts={}) {
    opts.keys = opts.keys || {};

    // Internal
    this._game = game;
    this._timeNextFire = 0;

    // Constants
    this.SPEED_MOVE = opts.SPEED_MOVE || 400;
    this.RATE_FIRE = opts.RATE_FIRE || 200;
    this.SPEED_MOVE_LASER = opts.SPEED_MOVE_LASER || 1000;

    // Sprite
    this.object = this._game.add.sprite(0, this._game.world.height/2, "player");
    this.object.anchor.x = 0.5;
    this.object.anchor.y = 0.5;

    // Physics
    this._game.physics.arcade.enable(this.object);
    this.object.body.collideWorldBounds = true;
    
    // Input
    this.keys = this._game.input.keyboard.addKeys({
      "left": opts.keys.left || Phaser.KeyCode.A,
      "right": opts.keys.right || Phaser.KeyCode.D,
      "fire": opts.keys.fire || Phaser.KeyCode.F
    });

    // Lasers
    this.lasers = this._game.add.group();
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(10, "laser", null, false);
    this.lasers.setAll("checkWorldBounds", true);
    this.lasers.setAll("outOfBoundsKill", true);
  }

  update() {
    //  Reset the players velocity (movement)
    this.object.body.velocity.y = 0;

    if (this.keys.left.isDown) {
      this.moveUp();
    } else if (this.keys.right.isDown) {
      this.moveDown();
    }

    if (this.keys.fire.isDown) {
      this.fire();
    }
  }

  moveUp() {
    this.object.body.velocity.y = -this.SPEED_MOVE;
  }

  moveDown() {
    this.object.body.velocity.y = this.SPEED_MOVE;
  }

  fire() {
    if (this._game.time.now > this._timeNextFire && this.lasers.countDead() > 0) {
      this._timeNextFire = this._game.time.now + this.RATE_FIRE;
      var laser = this.lasers.getFirstDead();
      laser.reset(this.object.x, this.object.y);
      laser.body.velocity.x = this.SPEED_MOVE_LASER;
    }
  }
}