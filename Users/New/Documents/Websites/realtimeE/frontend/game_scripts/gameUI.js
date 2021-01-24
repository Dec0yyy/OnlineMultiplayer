class gameUI extends Phaser.Scene{

	constructor(){
		super({key:"gameUI", active: true});
	}

	preload(){
		this.load.image('empty_bar', 'assets/healthBar/empty_bar.png');
		this.load.image('health_bar', 'assets/healthBar/green_bar.png');


	}

	create(){
		//Player health bar
		this.add.image(496,0, 'empty_bar').setOrigin(0,0);
		this.healthBar = this.add.image(496,0, 'health_bar').setOrigin(0,0);

		//Player health bar
		this.add.image(0,0, 'empty_bar').setOrigin(0,0);
		this.enemyHealthBar = this.add.image(0,0, 'health_bar').setOrigin(0,0);
		this.enemyHealthBar.setScale(1,1)
	}

	update(delta){
		this.healthBar.setScale(player_hp/100,1);
		this.enemyHealthBar.setScale(enemy_hp/100,1);


	}
}


