class Manager {
  constructor(game, players=[]) {
    this._game = game;
    this.players = players;
  }

  get allLasers() {
    return this.players.map(player=>player.lasers);
  }

  get allPlayerSprites() {
    return this.players.map(player=>player.object);
  }

  update() {
    this.checkOverlap();
    this.players.forEach(player=>player.update());
  }

  checkOverlap() {
    this._game.physics.arcade.overlap(this.allPlayerSprites, this.allLasers, this.onScore, null, this);
    this.players.forEach(player=>{
      if (player instanceof AI) {
        this._game.physics.arcade.overlap(player.lookZone, this.allLasers.filter(lasers=>lasers.owner.id !== player.id), this.onLook, null, this);
      }
    });
  }

  onScore(playerObject, laser) {
    laser.kill();
    laser.parent.owner.onScore();
    playerObject.owner.onHit();
  }

  onLook(aiLookZone, laser) {
    aiLookZone.owner.onAlert(laser.centerX, laser.centerY);
  }
}