;(function(){
	var Iori = window.Iori = Actor.extend({
		init:function(x,y){
			this.image = game.R["ioriR"];
			this.x = x;
			this.y = y;
			this.w = 60;
			this.h = 80;
			this.speedY = 0;
			this.speedX = 0;
			this.startY = y;
			this.f = 0;
			this.walkf = 0;//行走帧编号
			this.recordf = 0;//连续横向行走上次的记录帧
			this.walkSpeed = 2.6;//walk的速度
			this.direction = "R";
			this.col = 0;//精灵图上的列编号
			this.row = 0;//精灵图上的行编号
			this.alive = true;
			this.canBound = false;//是否能被反弹,脏标记反弹节流的作用,block（steel）去判断触发
			this.STATE = "follow";//有限状态机，follw跟随陆地，walk在陆地上行走，jump跳跃,fall坠落
			this.horizontalDelta = 0;//着陆时人物iori.x与land.x的水平偏差
			this.preFrameY = 0;//上一帧的y值，能判断人与land怎么相撞
			this.clickCount = 0;
			this._super();
		},
		update:function(){
			this.land = this.renewLand();//更新着陆块
			// console.log(this.land)
			if (this.STATE === "walk" && this.land) {
				!(game.f % 3)&&(this.col = ++this.col%16);//帧动画
				this.walkf++;
				var steps = this.direction === "L"? this.recordf-this.walkf : this.recordf+this.walkf;
				this.x = this.land.x+this.horizontalDelta+this.walkSpeed*steps;
				this.y = this.land.y - this.h;
				if (this.x<this.land.x-this.w || this.x > this.land.x+this.land.w) {
					this.fallDown();
				};
			}else if (this.STATE === "jump") {
				this.f++;//位移动画
				this.x += this.speedX;
				this.preFrameY = this.y;//备份上一帧的y，确定在下落过程中碰撞
				this.y = this.startY - (this.speedY*this.f-this.speedY/2/this.durationFrames*Math.pow(this.f,2));
				if (this.land && game.crashCheck(this,this.land) && this.y-this.preFrameY>0) {
					this.STATE = "follow";
					this.horizontalDelta = this.x - this.land.x;//保存，反映在fallow与状态
				};
			}else if (this.STATE === "follow" && this.land ) {//有可能land不存在
				this.y = this.land.y - this.h;
				var steps = this.direction === "L"? this.recordf-this.walkf : this.recordf+this.walkf;
				this.x = this.land.x+this.horizontalDelta+this.walkSpeed*steps;
			}else if (this.STATE === "fall") {//坠落状态
				this.f++;
				this.preFrameY = this.y;
				this.y = this.startY + 0.2*this.f*this.f;
				if (this.fall && this.land && game.crashCheck(this,this.land) && this.y-this.preFrameY>0) {
					this.STATE = "follow";
					this.fall = false;
					this.walkf = 0;//行走帧编号
					this.recordf = 0;//连续横向行走上次的记录帧
					this.horizontalDelta = this.x - this.land.x;//保存，反映在fallow与状态
				};
			};
		},
		render:function(){
			if (this.x < -this.w) {
				this.x = game.canvas.width;
			}else if (this.x > game.canvas.width) {
				this.x = -this.w;
			};

			if (this.y > game.canvas.height) {
				this.erase();
			};
			game.ctx.fillText(Math.round(this.y), this.x,this.y);
			this.land && game.ctx.fillText(Math.round(this.land.y), this.land.x+this.land.w,this.land.y);
			game.ctx.drawImage(this.image,this.row*192,this.col*192,90,110,this.x,this.y,this.w,this.h);
		},
		jump:function(x,y){//跳多高，经历多少帧到顶点,根据跳的高度自动设置跳跃帧数
			if (this.STATE === "jump" || this.STATE === "fall") return;
			this.STATE = "jump";
			this.canBound = true;//只有跳起来才会被反弹
			this.startY = this.y;
			this.f = 0;
			this.walkf = 0;//行走帧编号
			this.recordf = 0;//连续横向行走上次的记录帧
			this.durationFrames = Math.floor(Math.sqrt(this.y-y+this.h)*1.5);
			this.speedY = 2*(this.y-y+this.h)/this.durationFrames;//垂直初始速度 px/f
			this.speedX = (x-this.x)/this.durationFrames;//水平速度 px/f
		},
		bound:function(){//碰到金属砖块会反弹
			this.f += (this.durationFrames-this.f)*2;
		},
		fallDown:function(){//下落
			this.STATE = "fall";
			this.f = 0;
			this.startY = this.y;
			this.fall = false;
			if (this.alive) {//活着下落时才能被land挡住，死了就直接掉落
				var self = this;
				setTimeout(function(){//延时设置，防止要下坠时脚下的block挡住他
					self.fall = true;
				}, 300);
			};
		},
		walk:function(x,y){
			if (this.STATE === "jump" || this.STATE === "fall") return;
			this.STATE = "walk";
			if (x < this.x+this.w/2 && this.direction === "R") {
				this.direction = "L";
				this.image = game.R["ioriL"];
				this.row = 4;
				this.recordf = this.recordf + this.walkf;//**********记录行走帧,在上次的基础累加
				this.walkf = 0;
			}else if(x > this.x+this.w/2 && this.direction === "L"){
				this.direction = "R";
				this.image = game.R["ioriR"];
				this.row = 0;
				this.recordf = this.recordf - this.walkf;
				this.walkf = 0;
			};
			if (++this.clickCount%2===0) {
				this.STATE = "follow";
			};
			
		},
		renewLand:function(){//更新着陆块	
			var obj = {"index":null,"y":Infinity},
				len = game.lands.length,
				land = null;
			for(var i = 0; i < len ; i++){
				land = game.lands[i];
				if (land.y >= this.y+this.h-20 && land.y < obj.y) {
					obj = {"index":i,"y":land.y};
				};
			};
			return game.lands[obj.index];//是sprite最下面的离他最近的砖块，着陆块
		},
		erase:function(){
			game.actors = _.without(game.actors,this);
			game.scene.changeScene(2);
		}
	});
})();