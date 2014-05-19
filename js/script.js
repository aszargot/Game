// canvas element
var canvas;
var ctx;

var images = 0;
var loading = 0;

var canPlay = true;
 
window.onload = function() {
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	canvas.width = 1200;
	canvas.height = 600;
	
	if (loading == images) {
		init(); 
	}
};

function loadImg(x) {
	images++;
    var img = new Image();
	
    img.onload = function() {
		loading++;
		
		if (loading == images)
			init(); 
	};
	
    img.src = x;	
    return img;
}

var spriteSheet = loadImg('./img/character.png');
var spriteEnemy = loadImg('./img/enemy.png');
var spriteEnemyBoss = loadImg('./img/enemy_boss.png');
var bg_img = loadImg('./img/bg.jpg');

function drawPlatforms()
{
    for (i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }
}

function render() {	
	ctx.globalAlpha = 1;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
	player.draw();
	for (k in particles) {
	   particles[k].draw();
	}
	for (i in enemies) {
	    enemies[i].draw();
	}
}

function render_game_over() {
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlatforms();
	player.draw();
	ctx.fillStyle = "rgba(0,0,200,1)";
	ctx.font = "50px Verdana";
	ctx.fillText("Game OVER",250,250);
}

function createPlayer(s) {
	return {
		sprite: s,
		width: s.width,
		height: s.height,
		x: Math.random()*100,
		y: 500,
		speed: 4,
		velocity: 0,
		jumpPower: 20,
		jumping: false,
		orientation: 1,
		update: function() {
			if (this.x > 0 && keys.left in keysDown) {
				this.x -= this.speed;
				this.orientation=0;
			}

			if (this.x + this.width <= canvas.width && keys.right in keysDown) {
				this.x += this.speed;
				this.orientation=1;
			}
			
			if (keys.space in keysDown) {
			    if (can_fire) {
			 particles.push(Particle(this.x, this.y+25, this.orientation));
			    can_fire=false;
			    }
			}
				
			if (!this.jumping && keys.up in keysDown && this.velocity == 0) {
				this.velocity = this.jumpPower*-0.7;
				this.jumping = true;
			}

			if (this.velocity < 0) {
				this.velocity++;
			}
			else {
				this.velocity += 0.5;
			}
			
			this.y += this.velocity;
			
			
		    if ((this.y + this.height) > 580.5) {

				canPlay=false;
				
				this.jumping = false;
				this.velocity = 0;
			}
		},
		
		draw: function() {	
		    // dodanie zmiany oreintacji ludzika 
			ctx.drawImage(this.sprite, this.x, this.y);
		}
	}
}

var player;
var enemy;

var platforms = new Array;
var keysDown = new Array;

var keys = {left: 37, right: 39, up: 38, down: 40, space: 32, esc: 27};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var level = new Array();
function InitLevel(){
    
        level[0] = new Array();
        level[0][0]=600;
        level[0][1]=80;
        level[0][2]=300;
        level[1] = new Array();
        level[1][0]=0;
        level[1][1]=240;
        level[1][2]=250;
        level[2] = new Array();
        level[2][0]=10;
        level[2][1]=200;
        level[2][2]=650;
        level[3] = new Array();
        level[3][0]=400;
        level[3][1]=380;
        level[3][2]=300;
        level[4] = new Array();
        level[4][0]=700;
        level[4][1]=200;
        level[4][2]=80;
        level[5] = new Array();
        level[5][0]=800;
        level[5][1]=300;
        level[5][2]=200;
        level[6] = new Array();
        level[6][0]=700;
        level[6][1]=140;
        level[6][2]=150;
        level[7] = new Array();
        level[7][0]=0;
        level[7][1]=canvas.height-30;
        level[7][2]=280;
        level[8] = new Array();
        level[8][0]=380;
        level[8][1]=canvas.height-30;
        level[8][2]=canvas.width-380;
        level[9] = new Array();
        level[9][0]=280;
        level[9][1]=canvas.height-120;
        level[9][2]=120;
        level[10] = new Array();
        level[10][0]=380;
        level[10][1]=canvas.height-340;
        level[10][2]=120;
         level[11] = new Array();
        level[11][0]=750;
        level[11][1]=canvas.height-140;
        level[11][2]=100;
        level[12] = new Array();
        level[12][0]=0;
        level[12][1]=canvas.height-30;
        level[12][2]=280;
}

function init() {
    
	player = createPlayer(spriteSheet); 
	enemies.push(createEnemy(spriteEnemy, 800, 100, 3, 1));
	enemies.push(createEnemy(spriteEnemy, 800, 10, 4, 1));
	enemies.push(createEnemy(spriteEnemy, 500, 400, 2.5, 1));
	enemies.push(createEnemy(spriteEnemy, 700, 200, 4.5, 1));
	enemies.push(createEnemy(spriteEnemyBoss, 700, 200, 0.5, 5));

   InitLevel();
	for (i = 0; i < level.length; i++) {
		platforms[i] = {
			x: level[i][0],
			y: level[i][1],
			width: level[i][2],
			height: 12,	
			draw: function() {
			    ctx.fillStyle="green";
				ctx.fillRect(this.x, this.y, this.width, this.height);
			//	ctx.fillText(i,this.x, this.y)
			}
		};
	}

	setInterval(main, 18);
}

var enemies = new Array();

var particles = new Array();

var can_fire = true;

function Particle(_x, _y, _d) {
    return {
        s_x: _x,
        s_y: _y,
        x: _x,
        y: _y,
        direction: _d,
        speed: 10,
        life_time: 35,
        can_fly: true,
        update: function() {
            if (this.life_time > 0) {
                if (this.direction==1) {
                    this.x += this.speed;
                    this.life_time--;
                }  
                if (this.direction==0) {
                    this.x -= this.speed;
                    this.life_time--;
                } 
            } else {
                this.can_fly=false;
                can_fire=true;
               
            }
        },
        draw: function() {
            if (this.can_fly) {
            ctx.fillStyle="red";
            ctx.fillRect(this.x, this.y, 8, 8);
            }
        }
    }
}

function createEnemy(s, _x, _y, _speed, _strong ) {
	return {
		sprite: s,
		width: s.width,
		height: s.height,
		x: _x,
		y: _y,
		speed: _speed,
		strong: _strong,
		velocity: 0.3,
		jumping: false,
		alive: true,
		update: function() {

			var move_tmp = Math.floor(Math.random()*1000)+1;

			if (this.x + this.width <= canvas.width) {
				this.x -= this.speed;
			}
			
			if (this.x < 0) {
				this.x = _x;
				this.y = _y;
			}
			
			// update gravity
			if (this.velocity < 0) {
				this.velocity++;
			}
			else {
			    this.velocity += 0.5;
			}
			
			this.y += this.velocity+5;

		
			if (this.y + this.height >= canvas.height ) {
				this.y = canvas.height - this.height;
				
			this.jumping = false;
			this.velocity = 0;
			}
		},
		die: function() {
		  
		  this.strong--;
		  if (this.strong <=0)
		  {
		      this.alive = false;
		  }
		  
		},
		draw: function() {		
		    if (this.alive) {
			ctx.drawImage(this.sprite, this.x, this.y);
			//ctx.fillText("E", this.x, this.y)
		    }
		
		}
	};
}

function update_particles(){
    for (key in particles) {
	   particles[key].update();
	   if (particles[key].can_fly == false){
	        particles.splice(key, 1);
	   }
	}
}


function check_colission(player_in, enemy_in) {
    tmp = (player_in.x).toFixed();
    tmp_x = (player_in.x+player_in.width).toFixed();
    en = enemy_in.x;
    en_x = enemy_in.x + enemy_in.width;
    if (tmp_x > en && tmp_x < en_x 
    && enemy_in.y > player_in.y && enemy_in.y < player_in.y+player_in.height)  {
        canPlay=false;
    }
}

function check_colissions_bullets() {
      for (i in enemies) {
          e_x = enemies[i].x;
          e_y = enemies[i].y;
          e_mx = enemies[i].x + enemies[i].width;
          e_my = enemies[i].y + enemies[i].height;
          for (j=0; j<particles.length; j++)
            {
              p_x = particles[j].x;
              p_y = particles[j].y;
              
              if (p_x >= e_x && p_x < e_mx && p_y >= e_y && p_y < e_my)
               {
                   
                   enemies[i].die();
                   particles[j].can_fly=false;
                 //  ctx.fillRect(e_x, e_y, 400,4009)
                   can_fire=true;
                   if (!enemies[i].alive) {
                       enemies.splice(i,1);
                   }
               }
              
            }
      }
}

function update() {

    update_particles();
    check_colissions_bullets();
	
    
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
        check_colission(player,enemies[i]);
    }

	for (i = 0; i < platforms.length; i++) {
	    
		if	(!player.velocity >= 0){
		   
			// compare x/y values to find collision between player and platform
			if (player.y + player.height > 	platforms[i].y && 
			player.y + player.height < platforms[i].y + platforms[i].height && 
			player.x + player.width > platforms[i].x && 
			player.x < platforms[i].x + platforms[i].width) {
				// stop player
				player.y = platforms[i].y - player.height;
			
				// reset jumping/falling
				player.jumping = false;
				player.velocity = 0;
			}
						 
        }
        
        for (var j = 0; j < enemies.length; j++) {
           
            if	(!enemies[j].velocity >= 0){
		   
			// compare x/y values to find collision between player and platform
			if (enemies[j].y + enemies[j].height >  platforms[i].y && 
			enemies[j].y + player.height < platforms[i].y + platforms[i].height && 
			enemies[j].x + player.width > platforms[i].x && 
			enemies[j].x < platforms[i].x + platforms[i].width) {
				// stop player
				enemies[j].y = platforms[i].y - enemies[j].height;
			
				// reset jumping/falling
				enemies[j].jumping = false;
				enemies[j].velocity = 0;
			}
						 
        }
            
        }
	}
		player.update();

}

function main() {
  
    if (canPlay) {
	// update game logic
	update();
	// draw the game
	render(); 
}
	else {
	render_game_over();
	}
}

