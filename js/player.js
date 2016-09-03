class Player {
  constructor(game, x, y, opts={}) {
    opts.keys = opts.keys || {};

    // Internal
    this._isAI = opts.isAI || false;
    this._isAutoFire = opts.isAutoFire || false;
    this._game = game;
    this._timeNextFire = 0;
    this._scoreCount = 0;
    this._facingUpNegator = -1;

    // Constants
    this.SPEED_MOVE = opts.SPEED_MOVE || 400;
    this.RATE_FIRE = opts.RATE_FIRE || 200;
    this.SPEED_MOVE_LASER = opts.SPEED_MOVE_LASER || 1000;

    // Sprite
    this.object = this._game.add.sprite(x, y, "player");
    this.object.owner = this;
    this.object.anchor.setTo(0.5, 0.5);
    this.isFacingUp = opts.isFacingUp || false;
    if (!this.isFacingUp) {
      this._facingUpNegator *= -1;
      this.object.angle = 180;
    }

    // Physics
    this._game.physics.arcade.enable(this.object);
    this.object.body.collideWorldBounds = true;
    
    // Input
    if (!this._isAI) {
      this.keys = this._game.input.keyboard.addKeys({
        "left": opts.keys.left || Phaser.KeyCode.A,
        "right": opts.keys.right || Phaser.KeyCode.D,
        "fire": opts.keys.fire || Phaser.KeyCode.W
      });
    } else {
      this._aiTimeNextAction = 0;
      this.AI_RATE_ACTION = opts.AI_RATE_ACTION || 100;
    }

    // Lasers
    this.lasers = this._game.add.group();
    this.lasers.owner = this;
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(5, "laser", null, false);
    this.lasers.setAll("checkWorldBounds", true);
    this.lasers.setAll("outOfBoundsKill", true);
  }

  get score() {
    return this._scoreCount;
  }

  update(direction) {
    if (!this._isAI && !this._isAutoFire) {
      this.handleMovement();
    } else if (this._isAutoFire) {
      this.mobileHandleMovement(direction);
    } else {
      this.aiHandleMovement();
    }
  }

  handleMovement() {
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

  mobileHandleMovement(direction) {
    if (direction === "left") {
      this.moveLeft();
    } else if (direction === "right") {
      this.moveRight();
    } else if(direction === "stop") {
      this.object.body.velocity.x = 0;
    }

    this.fire();
  }

  aiHandleMovement() {
    if (this._game.time.now > this._aiTimeNextAction) {
      this._aiTimeNextAction = this._game.time.now + this.AI_RATE_ACTION;

      var rand = this._game.rnd.integerInRange(0, 100);
      if (rand <= 25) {
        this.moveLeft();
      } else if(rand <= 50) {
        this.moveRight();
      } else if (rand <= 90) {
        this.fire();
      } else {
        this.flipDirection();
      }
    }
  }


  flipDirection() {
    this._facingUpNegator *= -1;
    this.isFacingUp = !this.isFacingUp;
    this.object.angle = (Math.abs(this.object.angle) >= 180) ? 0 : 180;
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
      laser.reset(this.object.x, this.object.y + (16*this._facingUpNegator));
      laser.body.velocity.y = this.SPEED_MOVE_LASER * this._facingUpNegator;
    }
  }


  onScore() {
    this._scoreCount++;
  }
}