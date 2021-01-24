class endGameScene extends Phaser.Scene{

	init(data){
	  this.winner = data.winner;
	}

	constructor(){
		super({key:"endGameScene"});
	}

	preload(){



	}

	create(){
		if(this.winner == "player")
			this.add.text(35, 80, 'You Win!', { fontSize: '40px', fill: '#FFFFFF'});
		else if(this.winner == "enemy")
			this.add.text(35, 80, 'You Lose!', { fontSize: '40px', fill: '#FFFFFF'});
		else
			this.add.text(35, 80, 'An error has occured', { fontSize: '40px', fill: '#FFFFFF'});

		this.add.text(35, 120, 'Return to menu', { fontSize: '20px', fill: '#FFFFFF'}).setInteractive().on('pointerdown', () => {this.scene.start("mainMenu")});

	}

	update(delta){


	}
}


