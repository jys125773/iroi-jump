;(function(){
	var Bird = window.Bird = Actor.extend({
		init:function(x,y){
			this.image = game.R["bird"];
			this.x = x;
			this.y = y;
			this.speedX = 0.6;
			this.startY = this.y;
			this.w = 76;
			this.h = 60;
			this.collideFlag = true;//脏标记
			this.vertivalH = 60;//上下摆动量
			this.deltaY = this.vertivalH;
			this.flyf = 0;//动画帧
			this.movef = 0;//移动帧
			this.deltaX = game.canvas.width - 110;//block的横向滚动量
			this._super();
		},
		update:function(){
			(game.f % 3===0) && (this.flyf = ++this.flyf % 16);
			this.movef++;
			this.y = game.easeBoth(this.movef,this.startY,this.deltaY,100);
			if (this.y <= 0 || this.y >= this.vertivalH) {
				this.startY = this.y;
				this.deltaY = -this.deltaY;
				this.movef = 0;
			};
			this.x +=this.speedX;
			if (this.x < -400 || this.x > game.canvas.width + 400 - this.w){
				this.speedX = -this.speedX;
				this.image = this.image === game.R["bird"] ? game.R["bird1"]:game.R["bird"];
			};
		},
		render:function(){
			if (game.f % 300===0 && this.x > 60 && this.x < game.canvas.width-60) {
				new Bullet(this.x,this.y);
			};
			if (game.crashCheck(this,game.iori) && game.iori.alive) {
				game.iori.alive = false;//死亡
				game.iori.fallDown();//没有阻挡的掉落
			};
			game.ctx.drawImage(this.image, 77*this.flyf+1,0,76,60,this.x,this.y,this.w,this.h);
		}
	});
})();
