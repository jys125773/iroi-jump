;(function(){
	var Block = window.Block = Actor.extend({
		init:function(x,y,type){
			this.name = "land";//为sprite寻找它打标记
			this.type = type || ["steel","block","block","block"][Math.floor(Math.random()*4)];
			this.image = game.R[this.type];
			this.x = x;
			this.y = y;
			this.startX = this.x;
			this.speedY = 0.8;
			this.len = this.type==="block"? 6 + Math.floor(Math.random()*7):4+Math.floor(Math.random()*4);//砖块个数
			this.h = 20;
			this.w = this.len*20;
			this.deltaX = game.canvas.width - this.h*this.len;//block的横向滚动量
			this.loopF = 120+Math.floor(Math.random()*20);
			this.f = 0;
			this._super();
			if (Math.floor(Math.random()*4)===0) {
				this.randomv = this.w*Math.random();
				this.coin = new Coin(this.x+this.randomv,this.y-20);
			};
		},
		update:function(){
			this.f++;
			(this.f%5===0)&&(this.loopF++);
			this.x = game.easeBoth(this.f,this.startX,this.deltaX,this.loopF);
			if (this.x <= 0 || this.x >= game.canvas.width - this.w) {
				this.startX = this.startX===0 ? game.canvas.width - this.w : 0;
				this.deltaX = -this.deltaX;
				this.f = 0;
			};
			this.speedY -= 0.0003;
			this.y +=this.speedY;
			this.checkBound();
			if (this.y > game.canvas.height+game.iori.h+80) {
				game.actors = _.without(game.actors,this);
				game.lands = _.without(game.lands,this);
			};
		},
		render:function(){
			if (this.coin) {
				this.coin.x = this.x+this.randomv;
				this.coin.y = this.y-20;
			};
			for(var i = 0 ; i < this.len ; i++){
				game.ctx.drawImage(this.image, this.x+this.h*i,this.y,this.h,this.h);
			};
		},
		checkBound:function(){//判断是否能够反弹
			if (this.type==="steel" && game.crashCheck(this,game.iori) && game.iori.y<game.iori.preFrameY && game.iori.canBound) {
				game.iori.canBound = false;
				game.iori.bound();
			};
		}
	});
})();
