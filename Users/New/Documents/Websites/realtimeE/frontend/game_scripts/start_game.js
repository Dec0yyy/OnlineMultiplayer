var parent = document.getElementById("game-holder");

var config = {
	type:Phaser.AUTO,
	width:800,
	height:800,
	parent: parent,
	physics: {
		default:'arcade',
		arcade: {
			debug: false
		}
	},
	scene: [mainMenu, testScene, gameUI, endGameScene]
}

var game = new Phaser.Game(config);