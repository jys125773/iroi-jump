;(function(){
	var Coin = window.Coin = Actor.extend({
		init:function(x,y){
			this.x = x;
			this.y = y;
			this.w = 20;
			this.h = 20;
			this.f = 0;
			this.image = game.R["coin"];
			this.collect = false;
			this._super();
		},
		update:function(){
			!(game.f % 12) && (this.f = ++this.f % 4);
			if (game.crashCheck(this,game.iori) && !this.collect) {
				this.collect = true;
				game.actors = _.without(game.actors,this);
				game.score++;
			};
		},
		render:function(){
			game.ctx.drawImage(this.image,this.f*13,0,13,16,this.x,this.y,this.w,this.h);
		}
	});
})();