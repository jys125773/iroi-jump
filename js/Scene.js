;(function(){
	var Scene = window.Scene = Class.extend({
		init:function(){
			this.sceneNum = 0;//暂且设置为1，游戏进行中
			this.changeScene(this.sceneNum);
            this.bgImage = game.R["sky"];
			this.text_ready = game.R["text_ready"];
			this.text_game_over = game.R["text_game_over"];
			this.score_panel = game.R["score_panel"];
			this.button_play = game.R["button_play"];
			this.bgY = 0;
			this.bgX = 0;
			this.bindEvent();
		},
		changeScene:function(num){
			this.sceneNum = num;
			switch(this.sceneNum){
				case 0://游戏开始界面
					this.text_ready_x = 82;
					this.text_ready_y = -80;
					this.button_play_x = 122;
					this.button_play_y = -80;
					break;
				case 1://游戏过程
					game.f = 0;
					game.actors = [];
					game.iori = new Iori(0,-130);
					var firstLand = new Block(0,-50,"block");//第一块陆地
					game.lands.push(firstLand);
					game.registIncident(game.f+400,function(){
						game.bird = new Bird(-200,0);
					});
					break;
				case 2://游戏结束
					this.text_game_over_x = 78;
					this.text_game_over_y = 180;
					this.score_panel_x = 61;
					this.score_panel_y = 250;
			};
		},
		render:function(){
			game.ctx.drawImage(this.bgImage,85+this.bgX,60+this.bgY,540,900,0,0,game.canvas.width , game.canvas.height);
			switch(this.sceneNum){
				case 0:
					this.button_play_y = game.bounceOut(game.f,-80,380,60);
					if (this.button_play_y>300) {
						this.button_play_y=300;
						this.text_ready_y = game.bounceOut(game.f,-80,280,100);
						if (this.text_ready_y>=200) {this.text_ready_y=200};
					};
					game.ctx.drawImage(this.text_ready,this.text_ready_x,this.text_ready_y);
					game.ctx.drawImage(this.button_play,this.button_play_x,this.button_play_y);
					break;
				case 1:
					this.bgY =  game.iori.y*0.1;
					this.bgX =  -game.iori.x*0.1;
					if (game.f%220===0) {
						game.lands.push(new Block(0,-50));
					};
					_.each(game.actors,function(actor) {
						actor.update();
						actor.render();
					});
					break;
				case 2:
					_.each(game.actors,function(actor) {actor.render()});
					game.ctx.drawImage(this.score_panel,61,250);
					game.ctx.drawImage(this.text_game_over,78,180);
					game.ctx.fillText(game.score, 112,315);
			};
		},
		bindEvent:function(){
			var self = this;
			game.canvas.addEventListener("mousedown",function(event){
				var x = event.offsetX,y=event.offsetY;
				switch(self.sceneNum){
					case 0:
						if (x>122 && x < 238 && y>300 && y<370) {
							self.changeScene(1);
						};
					 	break;
					case 1:
						if (y<game.iori.y) {//点击人物上方80才会跳
							game.iori.jump(x,y);
						} else if(y > game.iori.y && y < game.iori.y+game.iori.h){
							game.iori.walk(x,y);
						};
						break;
					case 2:
						
						break;
				};
				
			}, false);
			
		}
	});
})();
