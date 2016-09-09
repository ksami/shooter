class MobilePlayer extends Player {
  constructor(game, x, y, opts={}) {
    super(game, x, y, opts);

    this._isMobile = true;
  }

  update(direction) {
    this.handleMovement(direction);
  }

  handleMovement(direction) {
    if (direction === "left") {
      this.moveLeft();
    } else if (direction === "right") {
      this.moveRight();
    } else if(direction === "stop") {
      this.object.body.velocity.x = 0;
    }

    this.fire();
  }
}