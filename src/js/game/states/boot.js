class BootState {
	preload() {
		console.log('boot state')
	
		this.game.add.plugin(Fabrique.Plugins.Spine)
		
		// setup fonts and interface apperance
		this.game.theme = {
			font: 'Luckiest Guy'
		}
		
		document.querySelector('canvas').oncontextmenu = (e) => {
			e.preventDefault();
			return false;
		}
		
		window.WebFontConfig = {
			active: () => { this.game.time.events.add(Phaser.Timer.SECOND, this.onFontsReady)},
			google: {
				families: [ this.game.theme.font ]
			}
		}
		
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this)
		this.load.image('preloader', 'assets/preloader.png')
		this.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js")
	}
	
	onLoadComplete() {
		this.game.state.start('preload');
	}
}

export default BootState