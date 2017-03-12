(function(){
	var Game = window.Game = Class.extend({
		init:function(paras){
			this.canvas = document.querySelector(paras.id);
			this.url = paras.url;
			this.ctx = this.canvas.getContext("2d");
			this.dataObj = null;//数据json
			this.R = {};//用于存放drawImage的对象
			this.f = 0;//初始帧编号
			this.f0 = 0;//初始帧节点
			this.t0 = new Date();//初始时间
			this.fps = 60;//初始fps
			this.score = 0;
			this.registedIncidentArray = [];
			this.actors = [];
			this.lands = [];//block数组
			this.define();
			this.load(function(){
				this.start();
			});
		},
		load:function(callback){
			this.ctx.font= "20px 微软雅黑";
			this.ctx.textAlign = "center";
			this.ctx.fillText('正在加载...',this.canvas.width/2,214);
			var xhr = new XMLHttpRequest(),self = this,imgAmount=0,count=0;
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4) {
					var status = xhr.status;
					if (status >= 200 && status < 300 || status === 304) {
						self.dataObj = JSON.parse(xhr.responseText);
						for(var k in self.dataObj){
							imgAmount++;
							self.R[k] = new Image();
							self.R[k].src = self.dataObj[k];
							self.R[k].onload = function(){
								self.ctx.clearRect(0, 0,self.canvas.width , self.canvas.height);
								count++;
								self.ctx.fillText('正在加载'+count+"/"+imgAmount,self.canvas.width/2,214);
								count === imgAmount && callback.call(self);
								self.ctx.font= "12px 微软雅黑";
								self.ctx.textAlign = "left";
								self.ctx.fillStyle = "#fff";
							};
						};
					};
				};
			};
			xhr.open("get",this.url,true);
			xhr.send(null);
		},
		start:function(){
			this.scene = new Scene();
			this.mainLoop();
		},
		mainLoop:function(){
			this.f++;
			var self = this;
			_.each(this.registedIncidentArray,function(obj){
	            if(obj.frameNumber == self.f){
	                obj.fn.call(self);
	                self.registedIncidentArray = _.without(self.registedIncidentArray,obj);
	         };
	        });
			if (new Date() - this.t0 >= 1000) {
				this.t0 = new Date();
				this.fps = this.f - this.f0;
				this.f0 = this.f;
			};
			this.ctx.clearRect(0, 0,this.canvas.width , this.canvas.height);
			
			this.scene.render();
			this.ctx.fillText('FNO:'+this.f,10,20);
			this.ctx.fillText('FPS:'+this.fps,10,40);
			this.ctx.fillText('SCORE:'+this.score,280,20);
			window.requestAnimationFrame(function(){self.mainLoop()});
			
			// window.setTimeout(function(){self.mainLoop()}, 8)
		},
		registIncident : function(frameNumber , fn){
	        this.registedIncidentArray.push({
	            "frameNumber" : frameNumber,
	            "fn" : fn
	        });
	    },
	    define:function(){
	    	this.easeBoth = function(t, b, c, d) {
				if ((t /= d / 2) < 1) {
					return c / 2 * t * t + b;
				};
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			};//缓冲
			this.crashCheck = function(obj1,obj2){
				if (obj1.x + obj1.w > obj2.x && obj1.x < obj2.x+obj2.w && obj1.y+obj1.h > obj2.y && obj1.y < obj2.y + obj2.h) return true;
			};//碰撞检测
			this.bounceOut = function(t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
				}
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
			};
	    }
	});
})();