import LabelButton from 'js/game/ui/components/label_button'

class MenuState {
	init() {
		this.menuItems = []
	}
	
	create() {
		this.createBackground()
		this.createUi()
	}
	
	createBackground() {
		this.game.stage.backgroundColor = '#000000';
		
		this.wallpaperLayer = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'wallpaper01')
		this.wallpaperLayer.smoothed = true
		
		this.sprite = this.game.add.sprite(160, 220, 'game-logo')
		this.sprite.anchor.setTo(0.5, 0.5)

		this.sprite.angle = -20
		this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true)
		
		this.characters = this.game.add.group()
		this.characters.x = this.game.world.width - 200;
		this.characters.scale.setTo(-1, 1);
		
		this.lisa = this.game.add.spine(0, this.game.world.height - 40, 'lisa')
		this.lisa.setAnimationByName(0, 'idle', true)
		this.characters.add(this.lisa)
		
		this.johny = this.game.add.spine(120, this.game.world.height - 40, 'johny')
		this.johny.setAnimationByName(0, 'idle', true)
		this.characters.add(this.johny)
	}
	
	createUi() {
		this.titleText = this.game.add.text(this.game.world.width - 20, 60, 'Elephant', { font: '128px ' + this.game.theme.font, fill: '#ffffff', align: 'right'})
		this.titleText.anchor.setTo(1.0, 0)
		
		this.subTitleText = this.game.add.text(this.game.world.width - 20, 220, 'in "The Room"', { font: '64px ' + this.game.theme.font, fill: '#ffffff', align: 'right'})
		this.subTitleText.anchor.setTo(1.0, 0)
		
		this.featuringText = this.game.add.text(this.game.world.width - 20, 320, 'featuring Johny and Lisa', { font: '32px ' + this.game.theme.font, fill: '#ffffff', align: 'right'})
		this.featuringText.anchor.setTo(1.0, 0)
		
		this.featuringText = this.game.add.text(this.game.world.width - 20, 360, 'as really bad art', { font: '16px ' + this.game.theme.font, fill: '#ffffff', align: 'right'})
		this.featuringText.anchor.setTo(1.0, 0)
		
		this.helpText = this.game.add.text(20, this.game.world.height - 150, 'Use left, right arrows to move\npress and hold up to power up jump\nyou get points for crushing your roomates\nwithout beeing spoted (you can only hit them from above and run)', { font: '18px ' + this.game.theme.font, fill: '#ffffff', align: 'left', stroke: '#000000', strokeThickness: 8})
		this.helpText.anchor.setTo(0, 0)
		
		this.createMenuItem('start', () => {
			this.game.state.start('play')
		})
	}
	
	createMenuItem(label, callback) {
		const menuItem = new LabelButton(this.game, this.menuItems.length * 200 + 20, this.game.world.height - 240, 'button', label, callback)
		menuItem.width = 192;
		menuItem.height = 80;
		menuItem.label.setStyle({ font: '24px ' + this.game.theme.font, fill: '#000000', align: 'center' }, true);
		
		this.world.add(menuItem)
		this.menuItems.push(menuItem)
	}
}

export default MenuState