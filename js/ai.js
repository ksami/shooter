class AI extends Player {
  constructor(game, x, y, opts={}) {
    super(game, x, y, opts);
    
    this.AI_RATE_ACTION = opts.AI_RATE_ACTION || 100;

    this._isAI = true;
    this._aiTimeNextAction = 0;

    this._PROB_MOVE_LEFT = 33;
    this._PROB_MOVE_RIGHT = 33;
    this._PROB_FIRE = 33;

    this._prevHitCount = this._hitCount;
  }

  update() {
    super.update();
    this.learn();
  }

  handleMovement() {
    if (this._game.time.now <= this._aiTimeNextAction) {
      return;
    }

    this._aiTimeNextAction = this._game.time.now + this.AI_RATE_ACTION;

    var rand = this._game.rnd.integerInRange(0, this._PROB_MOVE_LEFT+this._PROB_MOVE_RIGHT+this._PROB_FIRE);
    if (rand <= this._PROB_MOVE_LEFT) {
      this.moveLeft();
    } else if(rand <= this._PROB_MOVE_RIGHT) {
      this.moveRight();
    } else {
      this.fire();
    }
  }


  learn() {
    if (this._game.time.now > this._aiTimeNextAction) {
      return;
    }

    if (this._hitCount > this._prevHitCount) {
      this.modifyDodgeProb(5);
    } else {
      this.modifyFireProb(5);
    }
  }


  modifyDodgeProb(amt) {
    if (this._PROB_MOVE_LEFT + this._PROB_MOVE_RIGHT >= 80) {
      return;
    }

    this._PROB_FIRE -= amt;
    this._PROB_MOVE_LEFT += Math.floor(amt/2);
    this._PROB_MOVE_RIGHT += amt - this._PROB_MOVE_LEFT;
  }

  modifyFireProb(amt) {
    if (this._PROB_FIRE >= 70) {
      return;
    }

    this._PROB_FIRE += amt;
    this._PROB_MOVE_LEFT -= Math.floor(amt/2);
    this._PROB_MOVE_RIGHT -= amt - this._PROB_MOVE_LEFT;
  }
}