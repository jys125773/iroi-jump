;(function(){
	var Bullet = window.Bullet = Actor.extend({
		init:function(x,y){
			this.image = game.R["bullet"];
			this.x = x;
			this.y = y;
			this.startY = y;
			this.w = 60;
			this.h = 60;
			this.f = 0;//运动帧编号
			this.animatef = 0;//动画帧编号
			this._super();
		},
		update:function(){
			this.f++;
			this.y = this.startY + 0.005 * this.f * this.f;
			!(game.f%6)&&(this.animatef = ++this.animatef%23);
			if (this.y > game.canvas.height) {
				this.erase();
			};
		},
		render:function(){
			if (game.crashCheck(this,game.iori) && game.iori.alive) {
				game.iori.alive = false;//死亡
				game.iori.fallDown();//没有阻挡的掉落
			};
			game.ctx.save();
			game.ctx.translate(this.x + this.w/2,this.y + this.h/2);
			game.ctx.rotate(-Math.PI/2);
			game.ctx.drawImage(this.image,192*(this.animatef%5),192*Math.floor(this.animatef/5),192,192,-this.w/2,-this.h/2,this.w,this.h);
			game.ctx.restore(); 
		},
		erase:function(){
			game.actors = _.without(game.actors,this);
		}
	});
})();