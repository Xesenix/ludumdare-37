import Character from './character'

class Inhabitant extends Character {
	constructor(game, x, y, key) {
		super(game, x, y, key)
		
		this.body.width = 32
		this.body.height = 32
		this.body.bounce.set(1, 0)
		
		this.spine.setMixByName("idle", "walk", 0.2)
		this.spine.setMixByName("idle", "die", 0.2)
		this.spine.setMixByName("walk", "idle", 0.2)
		this.spine.setMixByName("walk", "die", 0.2)
		this.spine.setMixByName("die", "idle", 0.2)
		this.spine.setMixByName("die", "walk", 0.2)
		this.spine.setAnimationByName(0, 'idle', true)
		
		this.animationState = 'idle'
		
		this.onKnockOutSignal = new Phaser.Signal()
		
		this.reset()
	}
	
	reset() {
		this.speed = 100
		
		this.respawnTime = 3000
		this.decisionIntervalTime = 3000
		this.lastDecisionTime = this.game.time.now
	}
	
	isKnockOut() {
		return this.animationState === 'knockOut'
	}
	
	knockOut() {
		if (this.animationState !== 'knockOut') {
			this.spine.setAnimationByName(0, 'die', false)
			this.animationState = 'knockOut'
			
			this.onKnockOutSignal.dispatch(this)
			
			this.knockOutTime = this.game.time.now
			this.speed += 10
			this.respawnTime *= 0.9
		}
	}
	
	update() {
		this.handleMovement()
		this.handleAnimation()
	}
	
	handleMovement() {
		if (this.isKnockOut()) {
			this.body.velocity.x = 0
		}
		
		if (this.game.time.now - this.lastDecisionTime > this.decisionIntervalTime) {
			this.body.velocity.x = (this.game.rnd.integer() % 3 - 1) * this.speed
			this.lastDecisionTime = this.game.time.now
		}
	}
	
	handleAnimation() {
		if (this.animationState === 'knockOut') {
			if (this.game.time.now - this.knockOutTime > this.respawnTime) {	
				this.spine.setAnimationByName(0, 'standup', false)	
				this.spine.addAnimationByName(0, 'idle', true)

				this.animationState = 'idle'
			}
		} else {
			if (Math.abs(this.body.velocity.x) > 0) {
				if (this.animationState !== 'walk') {
					this.spine.setAnimationByName(0, 'walk', true)

					this.animationState = 'walk'
				}
			} else {
				if (this.animationState !== 'idle') {
					this.spine.setAnimationByName(0, 'idle', true)

					this.animationState = 'idle'
				}
			}
		}
		
		const direction = Math.sign(this.body.velocity.x)
		if (direction !== 0) {
			this.scale.x = direction * Math.abs(this.scale.x)
		}
	}
}

export default Inhabitant