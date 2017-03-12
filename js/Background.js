;(function(){
	var Background = window.Background = Actor.extend({
		init:function(){
			this.image = game.R["sky"];
			this._super();
		},
		update:function(){
			this.y = -game.iori.y*0.1;
		},
		render:function(){
			game.ctx.drawImage(this.image,0, this.y-game.canvas.height ,game.canvas.width , game.canvas.height);
			game.ctx.drawImage(this.image,0, this.y,game.canvas.width , game.canvas.height);
			game.ctx.drawImage(this.image,0, game.canvas.height+this.y,game.canvas.width , game.canvas.height);
		}
	});
})();