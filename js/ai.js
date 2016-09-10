class AI extends Player {
  constructor(game, x, y, opts={}) {
    super(game, x, y, opts);

    this.AI_RATE_ACTION = opts.AI_RATE_ACTION || 100;
    this.AI_RATE_LEARN = opts.AI_RATE_LEARN || 1000;

    this._isAI = true;
    this._aiTimeNextAction = 0;
    this._aiTimeNextLearn = 0;

    this._PROB_MOVE_LEFT = 33;
    this._PROB_MOVE_RIGHT = 33;
    this._PROB_FIRE = 33;

    this._prevHitCount = this._hitCount;
    this._state = {
      atLeftBounds: false,
      atRightBounds: false
    };

    debugTimed(()=>{
      return {
        probLeft: this._PROB_MOVE_LEFT,
        probRight: this._PROB_MOVE_RIGHT,
        probFire: this._PROB_FIRE
      };
    });
  }

  update() {
    super.update();
    this.updateState();
    this.learn();
  }

  updateState() {
    if (this.object.left === this._game.physics.arcade.bounds.x) {
      this._state.atLeftBounds = true;
      this._state.atRightBounds = false;
    } else if (this.object.right === this._game.physics.arcade.bounds.x + this._game.physics.arcade.bounds.width) {
      this._state.atLeftBounds = false;
      this._state.atRightBounds = true;
    } else {
      this._state.atLeftBounds = false;
      this._state.atRightBounds = false;      
    }
  }

  handleMovement() {
    if (this._game.time.now <= this._aiTimeNextAction) {
      return;
    }

    this._aiTimeNextAction = this._game.time.now + this.AI_RATE_ACTION;

    var rand = this._game.rnd.integerInRange(0, this._PROB_MOVE_LEFT+this._PROB_MOVE_RIGHT+this._PROB_FIRE);
    var probMoveLeft = this._state.atLeftBounds ? 0 : this._PROB_MOVE_LEFT;
    var probMoveRight = this._state.atRightBounds ? this._PROB_MOVE_LEFT : this._PROB_MOVE_RIGHT + this._PROB_MOVE_LEFT;

    if (rand <= probMoveLeft) {
      this.moveLeft();
    } else if(rand <= probMoveRight) {
      this.moveRight();
    } else {
      this.fire();
    }
  }


  learn() {
    if (this._game.time.now <= this._aiTimeNextLearn) {
      return;
    }

    this._aiTimeNextLearn = this._game.time.now + this.AI_RATE_LEARN;

    if (this._hitCount > this._prevHitCount) {
      this._prevHitCount = this._hitCount;
      console.log("modifyDodgeProb")
      this.modifyDodgeProb(10);
    } else {
      this.modifyFireProb(4);
    }
  }


  modifyDodgeProb(amt) {
    if (this._PROB_MOVE_LEFT >= 40 || this._PROB_MOVE_RIGHT >= 40) {
      return;
    }

    if (this._PROB_FIRE <= 10) {
      return;
    }

    this._PROB_FIRE -= amt;
    this._PROB_MOVE_LEFT += Math.floor(amt/2);
    this._PROB_MOVE_RIGHT += Math.ceil(amt/2);
  }

  modifyFireProb(amt) {
    if (this._PROB_FIRE >= 70) {
      return;
    }

    if (this._PROB_MOVE_LEFT <= 10 || this._PROB_MOVE_RIGHT <= 10) {
      return;
    }

    this._PROB_FIRE += amt;
    this._PROB_MOVE_LEFT -= Math.floor(amt/2);
    this._PROB_MOVE_RIGHT -= Math.ceil(amt/2);
  }
}

function debugTimed(msg) {
  setInterval(function() {
    if (typeof msg === "function") {
      console.log(msg());
    } else {
      console.log(msg);
    }
  }, 1000);
}

function debug(msg) {
  console.log(msg);
}