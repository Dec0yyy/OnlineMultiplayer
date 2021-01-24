class mainMenu extends Phaser.Scene{

	constructor(){
		super({key:"mainMenu", active: true});
	}

	preload(){

	}

	create(){
		this.add.text(35, 80, 'Find Game', { fontSize: '40px', fill: '#FFFFFF'}).setInteractive().on('pointerdown', () => {this.scene.start("testScene")});
		this.scene.sleep('gameUI');
	}

	update(delta){



	}
}


