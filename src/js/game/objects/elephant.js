import Character from './character'

class Elephant extends Character {
	constructor(game, x, y, controls) {
		super(game, x, y, 'elephant')
		
		this.controls = controls
		
		this.body.offset.x = -48;
		this.body.offset.y = -16;
		this.body.width = 84;
		this.body.height = 32;
		
		this.spine.setMixByName("walk", "power_jump", 0.2)
		this.spine.setMixByName("walk", "jump", 0.2)
		this.spine.setMixByName("walk", "idle", 0.2)
		this.spine.setMixByName("idle", "walk", 0.2)
		this.spine.setMixByName("idle", "jump", 0.2)
		this.spine.setMixByName("idle", "power_jump", 0.2)
		this.spine.setMixByName("jump", "walk", 0.2)
		this.spine.setMixByName("jump", "fall", 0.2)
		this.spine.setMixByName("fall", "idle", 0.2)
		this.spine.setMixByName("fall", "walk", 0.2)
		
		this.onFoundSignal = new Phaser.Signal()
		
		this.smashing = false
	}
	
	isSmashing() {
		return this.body.velocity.y > 100
	}
	
	update() {
		this.body.velocity.x = 0
		this.body.acceleration.y = this.game.physics.arcade.gravity.y
		
		this.handleControls()
		this.handleAnimation()
	}
	
	handleControls() {
		const up = this.controls.up.isDown || this.controls.w.isDown || this.controls.space.isDown
		const left = this.controls.left.isDown || this.controls.a.isDown
		const right = this.controls.right.isDown || this.controls.d.isDown
		const down = this.controls.down.isDown || this.controls.s.isDown
		
		if (left) {
			this.body.velocity.x = -300
		} else if (right) {
			this.body.velocity.x = 300
		}
		
		if (up) {
			if (Math.abs(this.body.velocity.x) === 0) {
				this.jumpPower += this.game.time.elapsed
			}
			
		} else if (this.jumpPower > 0) {
			this.body.velocity.y = -Math.min(this.jumpPower, 1200)
			this.jumpPower = 0
		}
		
		if (down) {
			if (this.body.velocity.y < 400) {
				this.body.velocity.y = 400
			} else {
				//this.body.acceleration.y = 2 * this.game.physics.arcade.gravity.y
			}
		}
	}
	
	handleAnimation() {
		const grounded = this.body.blocked.down
		
		if (grounded) {
			if (Math.abs(this.body.velocity.x) > 0) {
				if (this.animationState !== 'walk') {
					this.spine.setAnimationByName(0, 'walk', true)
					this.animationState = 'walk'
				}
			} else {
				if (this.jumpPower > 0) {
					if (this.animationState !== 'powerup') {
						this.spine.setAnimationByName(0, 'power_jump', false)
						this.animationState = 'powerup'
					}
				} else if (this.animationState !== 'idle') {
					this.spine.setAnimationByName(0, 'idle', true)
					this.animationState = 'idle'
				}
			}
		} else {
			this.jumpPower = 0
			
			if (this.body.velocity.y > 0) {
				if (this.animationState !== 'fall') {
					this.spine.setAnimationByName(0, 'fall', false)
					this.animationState = 'fall'
				}
			} else {
				if (this.animationState !== 'jump') {
					this.spine.setAnimationByName(0, 'jump', false)
					this.animationState = 'jump'
				}
			}
		}
		
		const direction = Math.sign(this.body.velocity.x)
		if (direction !== 0) {
			this.scale.x = - direction * Math.abs(this.scale.x)
		}
	}
	
	touched() {
		this.onFoundSignal.dispatch()
	}
}

export default Elephant