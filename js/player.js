class Player {
  constructor(game, x, y, opts={}) {
    opts.keys = opts.keys || {};

    // Internal
    this._game = game;
    this._timeNextFire = 0;
    this._scoreCount = 0;

    // Constants
    this.SPEED_MOVE = opts.SPEED_MOVE || 400;
    this.RATE_FIRE = opts.RATE_FIRE || 200;
    this.SPEED_MOVE_LASER = opts.SPEED_MOVE_LASER || 1000;

    // Sprite
    this.object = this._game.add.sprite(x, y, "player");
    this.object.anchor.setTo(0.5, 0.5);
    this.isFacingUp = opts.isFacingUp || false;
    if (!this.isFacingUp){
      this.object.angle = 180;
    }

    // Physics
    this._game.physics.arcade.enable(this.object);
    this.object.body.collideWorldBounds = true;
    
    // Input
    this.keys = this._game.input.keyboard.addKeys({
      "left": opts.keys.left || Phaser.KeyCode.A,
      "right": opts.keys.right || Phaser.KeyCode.D,
      "fire": opts.keys.fire || Phaser.KeyCode.W
    });

    // Lasers
    this.lasers = this._game.add.group();
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(5, "laser", null, false);
    this.lasers.setAll("checkWorldBounds", true);
    this.lasers.setAll("outOfBoundsKill", true);
  }

  get score() {
    return this._scoreCount;
  }

  update() {
    //  Reset the players velocity (movement)
    this.object.body.velocity.x = 0;

    if (this.keys.left.isDown) {
      this.moveLeft();
    } else if (this.keys.right.isDown) {
      this.moveRight();
    }

    if (this.keys.fire.isDown) {
      this.fire();
    }
  }

  moveLeft() {
    this.object.body.velocity.x = -this.SPEED_MOVE;
  }

  moveRight() {
    this.object.body.velocity.x = this.SPEED_MOVE;
  }

  fire() {
    if (this._game.time.now > this._timeNextFire && this.lasers.countDead() > 0) {
      this._timeNextFire = this._game.time.now + this.RATE_FIRE;
      var laser = this.lasers.getFirstDead();
      laser.reset(this.object.x, this.object.y);
      laser.body.velocity.y = this.isFacingUp ? -this.SPEED_MOVE_LASER : this.SPEED_MOVE_LASER;
    }
  }


  onScore(otherPlayer, laser) {
    laser.kill();
    this._scoreCount++;
  }
}