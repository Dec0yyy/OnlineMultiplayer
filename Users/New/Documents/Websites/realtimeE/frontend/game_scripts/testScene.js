const MAX_HP = 100;

var player_hp = MAX_HP;
var enemy_hp = MAX_HP;


class testScene extends Phaser.Scene{

	constructor(){
		super({key:"testScene"});
	}

	preload(){
		this.load.atlas('player','assets/defaultPlayerSprite.png','assets/animate_card.json'); 


		this.load.tilemapTiledJSON('walls', 'assets/tilemaps/map.json');
		this.load.image('tiles', 'assets/tilemaps/tiles.png');

		this.load.image('bullet', 'assets/bullet.png');

		this.load.image('blood', 'assets/blood.png');

	}

	create(){
		player_hp = MAX_HP;
		enemy_hp = MAX_HP;

        var map = this.make.tilemap({ key: 'walls' });

        var tiles = map.addTilesetImage('tiles','tiles');
        var background = map.createStaticLayer('Tile Layer 1', tiles, 16, 16);
        var walls = map.createStaticLayer('Tile Layer 2', tiles, 16, 16);
		walls.setCollisionBetween(0, 1000);
		

		this.socket = io("http://localhost:3000");
		this.active = false;

		this.player_bullets = this.physics.add.group();

		this.socket.on('init', data => {
			this.enemy = this.physics.add.sprite(363,1309, 'player').setOrigin(0.5,0.5);
			this.player = this.physics.add.sprite(363,1309,'player').setOrigin(0.5,0.5);
			this.enemy.setDepth(100);
			this.player.setDepth(100);
			this.cameras.main.startFollow(this.player);
			this.physics.add.collider(this.player, walls, function(){console.log("wallhit")});

			//On mouse click
			this.input.on('pointerdown', () => {
				var bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
				bullet.rotation = this.angleToPointer;
				this.player_bullets.add(bullet);
				var self = this;
				//colliders for players bullets
				this.physics.add.collider(bullet, walls, function(){
					bullet.destroy();
				});
				this.physics.add.overlap(bullet, this.enemy, function(){
					bullet.destroy();
					self.add.image(self.enemy.x, self.enemy.y, 'blood');
				});
				this.physics.velocityFromRotation(this.angleToPointer, 800, bullet.body.velocity);
			});


			//Queue
			var self = this;
			this.socket.on('gameRequest', ()=>{
				console.log("Game Request recieved");
				this.socket.emit('acceptRequest');
			});
    		this.socket.on('acceptRequest', ()=>{
				console.log("Game Request accepted. Join GameRoom");
				this.socket.emit('JoinGameRoom');
    		});




			this.active = true;
		});

		this.socket.on('updateScene', data =>{
			if(this.enemy != null){
				this.enemy.setX(data.x);
				this.enemy.setY(data.y);
				this.enemy.rotation = data.rot;
			}
		});
		this.angleToPointer;
		var scopedSocket = this.socket;
		var self = this;
		this.socket.on('updateBullets', data =>{
			let i =0;
			data.bullets.forEach(obj => {
				let newBullet = this.physics.add.sprite(data.bullets[i].x, data.bullets[i].y, 'bullet');
				newBullet.rotation = data.bullets[i].rotation;
				this.physics.velocityFromRotation(data.bullets[i].rotation, 800, newBullet.body.velocity);

				//Colliders for enemy bullets
				this.physics.add.collider(newBullet, walls, function(){
					newBullet.destroy();
				});
				this.physics.add.overlap(newBullet, this.player, function(){
					//Player is hit by bullet
					newBullet.destroy();
					player_hp -= 10;
					scopedSocket.emit('bullet_hit');
					self.add.image(self.player.x, self.player.y, 'blood');
				});
				i++;
			});					
		});

		this.socket.on('bullet_hit',() =>{
			enemy_hp-=10;
		});

		this.socket.on('GameOver', ()=>{
			this.socket.emit("leaveGameRoom");
			this.scene.start('endGameScene', {winner: "player"});
		});


		//Load health bar UI
		this.scene.wake('gameUI');

	}

	update(delta){
		var key_W = this.input.keyboard.addKey("W");
		var key_A = this.input.keyboard.addKey("A");
		var key_S = this.input.keyboard.addKey("S");
		var key_D = this.input.keyboard.addKey("D");
		let player_speed = 250;
		if(key_W.isDown){
			this.player.body.setVelocityY(-player_speed);
		}
		if(key_A.isDown){
			this.player.body.setVelocityX(-player_speed);
		}
		if(key_S.isDown){
			this.player.body.setVelocityY(player_speed);
		}
		if(key_D.isDown){
			this.player.body.setVelocityX(player_speed);
		}
		if(!key_W.isDown && !key_A.isDown && !key_S.isDown && !key_D.isDown && this.active){
			this.player.body.setVelocity(0, 0);
		}



		//Test to see if either player has reached 0 hp.
		//Will need to be moved to server side for final build.
		if(player_hp < 1){
			this.socket.emit('GameOver');
			this.scene.start('endGameScene', {winner: "enemy"});
		}



		if(this.active == true){
			let children = this.player_bullets.getChildren();
			this.input.on('pointermove', function (pointer) {
		    	this.angleToPointer = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
			}, this);
			this.player.rotation = this.angleToPointer;
			this.socket.emit('updatePlayer', {pos_x: this.player.x, pos_y: this.player.y, rotation: this.angleToPointer, bullets: children});
			this.player_bullets.clear();
		}
	}

}


