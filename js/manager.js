class Manager {
  constructor(game, players=[]) {
    this._game = game;
    this.players = players;
  }

  update() {
    this.checkOverlap();
    this.players.forEach(player=>player.update());
  }

  checkOverlap() {
    this._game.physics.arcade.overlap(this.players.map(player=>player.object), this.players.map(player=>player.lasers), this.onScore, null, this);
  }

  onScore(playerObject, laser) {
    laser.kill();
    laser.parent.owner.onScore();
    playerObject.owner.onHit();
  }
}