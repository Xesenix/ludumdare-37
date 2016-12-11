class Character extends Phaser.Sprite {
	constructor(game, x, y, key) {
		super(game, x, y)
		
		this.anchor.set(0.5, 1.0)
		this.scale.set(0.5)
		
		this.game.physics.enable(this, Phaser.Physics.ARCADE)
		this.body.collideWorldBounds = true
		this.enableBodyDebug = true
		
		this.spine = this.game.add.spine(0, 0, key)
		
		this.addChild(this.spine)
	}
	
	update() {
		
	}
}

export default Character