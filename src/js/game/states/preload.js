class PreloadState {
	construct() {
		this.asset = null;
		this.ready = false;
	}

	preload() {
		this.asset = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader')
		this.asset.anchor.setTo(0.5, 0.5)

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this)
		this.load.setPreloadSprite(this.asset)
		this.load.image('game-logo', 'assets/logo.png')
		this.load.image('button', 'assets/button.png')
		
		this.load.image('wallpaper00', 'assets/wallpaper00.png')
		this.load.image('wallpaper01', 'assets/wallpaper01.png')
		this.load.image('carpet', 'assets/carpet.png')
		this.load.image('christmas_tree', 'assets/christmas_tree.png')
		
		this.load.spritesheet('mute', 'assets/mute.png', 64, 64)
		
		this.load.audio('melody', 'assets/soundtrack.ogg')
		
		this.game.load.spine('elephant', 'assets/elephant/elephant.json')
		this.game.load.spine('johny', 'assets/johny/johny.json')
		this.game.load.spine('lisa', 'assets/lisa/lisa.json')
	}
	
	create() {
		this.asset.cropEnabled = false
	}
	
	onLoadComplete() {
		this.game.state.start('intro')
	}
}

export default PreloadState