import Elephant from 'js/game/objects/elephant'
import Inhabitant from 'js/game/objects/inhabitant'

class GameState {
	create() {
		this.score = 0
		this.bestScore = 0
		this.game.dataStoreManager.get('bestScore', 0).then((value) => {
			this.bestScore = value
		})
		
		this.sceneWidth = 980;
		this.sceneHeight = 640;
		this.scene = this.game.add.group()
		this.scene.x = this.game.world.centerX - this.sceneWidth / 2
		this.scene.y = this.game.world.centerY - this.sceneHeight / 2
		this.game.add.tween(this.scene).from({ y: - this.sceneHeight }, 300, Phaser.Easing.Linear.NONE, true, 0, 0, false)
		
		this.drawRoom()
		this.prepareControls()
		
		this.prepareCharacter()
		this.preparePhysics()
		
		this.enemies = this.game.add.group()
		this.scene.add(this.enemies)
		
		this.prepareJohny()
		this.prepareLisa()
		
		this.createUI()
	}
	
	drawRoom() {
		
		this.background = this.game.add.graphics(0, 0)
		this.background.beginFill(0x813716)
		this.background.drawRect(0, this.sceneHeight - 130, this.sceneWidth, 10)
		this.background.endFill()
		this.scene.add(this.background)
		
		this.wallpaperTopLayer = this.game.add.tileSprite(0, 0, this.sceneWidth, this.sceneHeight - 130, 'wallpaper00')
		this.wallpaperTopLayer.smoothed = true
		this.scene.add(this.wallpaperTopLayer)
		
		this.carpetLayer = this.game.add.tileSprite(0, this.sceneHeight - 120, this.sceneWidth, this.game.world.height + 120, 'carpet')
		this.carpetLayer.smoothed = true
		this.scene.add(this.carpetLayer)
		
		this.christmasTree = this.game.add.sprite(this.sceneWidth / 2, this.sceneHeight - 110, 'christmas_tree')
		this.christmasTree.anchor.set(0.5, 1.0)
		this.scene.add(this.christmasTree)
	}
	
	prepareControls() {
		this.controls = this.game.input.keyboard.addKeys({
			left: Phaser.Keyboard.LEFT, 
			right: Phaser.Keyboard.RIGHT, 
			up: Phaser.Keyboard.UP, 
			down: Phaser.Keyboard.DOWN, 
			a: Phaser.Keyboard.A, 
			s: Phaser.Keyboard.S, 
			d: Phaser.Keyboard.D, 
			w: Phaser.Keyboard.W,
			space: Phaser.Keyboard.SPACEBAR,
			r: Phaser.KeyCode.R,
			esc: Phaser.KeyCode.ESC
		})
		
		this.controls.esc.onDown.add(() => {
			this.game.state.start('menu')
		}, this);
		
		this.game.input.keyboard.addKeyCapture([ 
			Phaser.Keyboard.LEFT, 
			Phaser.Keyboard.RIGHT, 
			Phaser.Keyboard.UP, 
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.SPACEBAR,
			Phaser.KeyCode.ESC
		])
	}
	
	preparePhysics() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.physics.arcade.gravity.y = 1000
		
		this.game.world.bounds.setTo(0, 0, this.game.world.width, this.game.world.height - 20); 
		if (this.game.camera.bounds) {      
			this.game.camera.bounds.setTo(0, 0, this.game.world.width, this.game.world.height + 20)
		}
		
		this.game.physics.setBoundsToWorld();
	}
	
	prepareCharacter() {
		this.elephantCharacter = new Elephant(this.game, this.game.world.centerX, this.sceneHeight - 80, this.controls)
		this.scene.add(this.elephantCharacter)
		
		this.elephantCharacter.onFoundSignal.add(this.onElephantNoticed)
	}
	
	prepareJohny() {
		this.johnyCharacter = new Inhabitant(this.game, 0, this.sceneHeight - 80, 'johny')
		this.enemies.add(this.johnyCharacter)
		
		this.johnyCharacter.onKnockOutSignal.add(this.onKnockDownPoints)
	}
	
	prepareLisa() {
		this.lisaCharacter = new Inhabitant(this.game, this.sceneWidth, this.sceneHeight - 80, 'lisa')
		this.enemies.add(this.lisaCharacter)
		
		this.lisaCharacter.onKnockOutSignal.add(this.onKnockDownPoints)
	}
	
	createUI() {
		this.scoreText = this.game.add.text(this.game.world.centerX - 20, 80, 'score: 0', { font: '32px ' + this.game.theme.font, fill: '#ffffff', align: 'center', stroke: '#000000', strokeThickness: 8})
		this.scoreText.anchor.setTo(0.5, 0)
		
		this.bestScoreText = this.game.add.text(this.game.world.centerX - 20, 20, 'best score: 0', { font: '48px ' + this.game.theme.font, fill: '#ffffff', align: 'center', stroke: '#000000', strokeThickness: 8})
		this.bestScoreText.anchor.setTo(0.5, 0)
	}
	
	onElephantNoticed = () => {
		this.johnyCharacter.reset()
		this.lisaCharacter.reset()
		this.bestScore = Math.max(this.score, this.bestScore)
		this.score = 0
		
		this.game.dataStoreManager.set('bestScore', this.bestScore)
	}
	
	onKnockDownPoints = (character) => {
		console.log('knock down ', this.score, character)
		this.score += character.speed / 10
	}
	
	update() {
		this.game.physics.arcade.overlap(this.elephantCharacter, this.enemies, (elephantCharacter, otherCharacter) => {
			if (elephantCharacter.isSmashing()) {
				console.log('smash', elephantCharacter.body.velocity.y)
				if (elephantCharacter.body.velocity.y > 500) {
					otherCharacter.knockOut()
					//elephantCharacter.body.velocity.y *= -1
				}
			} else if (!otherCharacter.isKnockOut()) {
				elephantCharacter.touched()
				console.log('ouch', elephantCharacter.body.velocity.y)
			}
		})
		
		this.game.physics.arcade.collide(this.elephantCharacter, this.enemies)
		
		this.score += this.game.time.elapsed / 1000
		this.bestScore = Math.max(this.score, this.bestScore)
		this.updateScore()
	}
	
	updateScore() {
		this.scoreText.text = `score: ${this.score.toFixed(0)}`
		this.bestScoreText.text = `best score: ${this.bestScore.toFixed(0)}`
	}
	
	render() {
		//this.game.debug.bodyInfo(this.elephantCharacter, 16, 24);
		//this.game.debug.body(this.elephantCharacter)
		//this.game.debug.body(this.lisaCharacter)
		//this.game.debug.body(this.johnyCharacter)
	}
}

export default GameState