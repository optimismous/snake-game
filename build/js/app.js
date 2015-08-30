var SnakeGame=function(){"use strict";var t=function(t,i){i=i||{},this.options=$.extend({},this.defaultOptions,i),this.canvas=t,this.snakeModel={body:[{x:this.options.startPointX,y:this.options.startPointY},{x:this.options.startPointX-this.options.unitSize,y:this.options.startPointY},{x:this.options.startPointX-2*this.options.unitSize,y:this.options.startPointY},{x:this.options.startPointX-3*this.options.unitSize,y:this.options.startPointY},{x:this.options.startPointX-4*this.options.unitSize,y:this.options.startPointY}],direction:"right",turnTo:null},this._rabbitPosition=null,this.init()};return t.prototype={constructor:t,_intervalId:null,defaultOptions:{snakeName:"Zed",unitSize:10,snakeColor:"#395C3A",rabbitColor:"#108690",startPointX:100,startPointY:100,speed:200,scoreWeight:100},keyMappings:{_38:"up",_40:"down",_37:"left",_39:"right"},init:function(){var t=this;this.initialSnakeLength=this.snakeModel.body.length,this.ctx=this.canvas.getContext("2d"),this.bindKeyEvents(),this.drawSnake(!0),this.drawRabbit(),this._intervalId=setInterval(function(){t.isRabbitCaught()&&(t.increaseSnake(),t.drawRabbit()),t.drawSnake()},this.options.speed)},bindKeyEvents:function(){var t=this;$("body").on("keydown",function(i){t.snakeModel.turnTo=t.keyMappings["_"+i.keyCode]})},turnSnake:function(t){var i,e=this,o=this.snakeModel;switch(e.snakeModel.body.pop(),!0){case("right"==o.direction||"left"==o.direction)&&"up"==t:i=_.clone(this.snakeModel.body[0]),i.y=this.snakeModel.body[0].y-this.options.unitSize,e.snakeModel.direction=t;break;case("right"==o.direction||"left"==o.direction)&&"down"==t:i=_.clone(this.snakeModel.body[0]),i.y=this.snakeModel.body[0].y+this.options.unitSize,e.snakeModel.direction=t;break;case("up"==o.direction||"down"==o.direction)&&"left"==t:i=_.clone(this.snakeModel.body[0]),i.x=this.snakeModel.body[0].x-this.options.unitSize,e.snakeModel.direction=t;break;case("up"==o.direction||"down"==o.direction)&&"right"==t:i=_.clone(this.snakeModel.body[0]),i.x=this.snakeModel.body[0].x+this.options.unitSize,e.snakeModel.direction=t;break;case"right"==o.direction:i=_.clone(this.snakeModel.body[0]),i.x=this.snakeModel.body[0].x+this.options.unitSize;break;case"left"==o.direction:i=_.clone(this.snakeModel.body[0]),i.x=this.snakeModel.body[0].x-this.options.unitSize;break;case"up"==o.direction:i=_.clone(this.snakeModel.body[0]),i.y=this.snakeModel.body[0].y-this.options.unitSize;break;case"down"==o.direction:i=_.clone(this.snakeModel.body[0]),i.y=this.snakeModel.body[0].y+this.options.unitSize}e.snakeModel.body.unshift(i)},isSnakeAlive:function(){var t=this,i=t.snakeModel.body[0];if(i.x>t.canvas.width-this.options.unitSize||i.x<0||i.y>t.canvas.height-this.options.unitSize||i.y<0)return!1;for(var e=t.snakeModel.body.length-1;e>0;e--)if(t.snakeModel.body[e].x==t.snakeModel.body[0].x&&t.snakeModel.body[e].y==t.snakeModel.body[0].y)return!1;return!0},isRabbitCaught:function(){var t=this.getRabbitPosition();return t.x==this.snakeModel.body[0].x&&t.y==this.snakeModel.body[0].y},increaseSnake:function(){var t,i=this.snakeModel.body.length-1;switch(!0){case this.snakeModel.body[i].x==this.snakeModel.body[i-1].x&&this.snakeModel.body[i].y>this.snakeModel.body[i-1].y:t={x:this.snakeModel.body[i].x,y:this.snakeModel.body[i].y+this.options.unitSize};break;case this.snakeModel.body[i].x==this.snakeModel.body[i-1].x&&this.snakeModel.body[i].y<this.snakeModel.body[i-1].y:t={x:this.snakeModel.body[i].x,y:this.snakeModel.body[i].y-this.options.unitSize};break;case this.snakeModel.body[i].y==this.snakeModel.body[i-1].y&&this.snakeModel.body[i].x>this.snakeModel.body[i-1].x:t={x:this.snakeModel.body[i].x+this.options.unitSize,y:this.snakeModel.body[i].y};break;default:t={x:this.snakeModel.body[i].x-this.options.unitSize,y:this.snakeModel.body[i].y}}this.snakeModel.body.push(t),$(this.canvas).trigger("updateScore.SnakeGame",{name:this.options.snakeName,score:this.getScore()})},getScore:function(){return(this.snakeModel.body.length-this.initialSnakeLength)*this.options.scoreWeight},drawSnake:function(t){var i=this,e=i.getCapturedSnakePosition();return t||i.turnSnake(i.snakeModel.turnTo),i.isSnakeAlive()?(i.eraseSnake(e),i.ctx.fillStyle=i.options.snakeColor,void $.each(i.snakeModel.body,function(t,e){i.ctx.fillRect(e.x,e.y,i.options.unitSize,i.options.unitSize)})):($(i.canvas).trigger("snakeIsDead.SnakeGame",{name:i.options.snakeName,score:i.getScore()}),alert(i.options.snakeName+" is dead, baby. Game over."),void clearInterval(i._intervalId))},getCapturedSnakePosition:function(){return this.snakeModel.body.slice()},eraseSnake:function(t){var i=this;$.each(t,function(t,e){i.ctx.clearRect(e.x,e.y,i.options.unitSize,i.options.unitSize)})},drawRabbit:function(){var t=this.setRabbitPosition();this.ctx.fillStyle=this.options.rabbitColor,this.ctx.fillRect(t.x,t.y,this.options.unitSize,this.options.unitSize)},setRabbitPosition:function(){var t=this.getRandomInt(0,(this.canvas.width-this.options.unitSize)/this.options.unitSize)*this.options.unitSize,i=this.getRandomInt(0,(this.canvas.height-this.options.unitSize)/this.options.unitSize)*this.options.unitSize,e=_.find(this.snakeModel.body,function(e){return e.x==t&&e.y==i});return e?this.setRabbitPosition():(this._rabbitPosition={x:t,y:i},this._rabbitPosition)},getRabbitPosition:function(){return this._rabbitPosition},getRandomInt:function(t,i){return Math.floor(Math.random()*(i-t+1))+t}},t}();
var ScoresStorage=function(){"use strict";var e=function(e,t){this.key=t||"highscore",this.$highScoreContainer=e,null===localStorage.getItem(this.key)&&localStorage.setItem(this.key,JSON.stringify(this._defaultScoreTable)),this.storage=JSON.parse(localStorage.getItem(this.key)),this.$highScoreContainer.trigger("refreshScores.ScoresStorage",{data:this.storage})};return e.prototype={constructor:e,_defaultScoreTable:[{name:"--",score:0},{name:"--",score:0},{name:"--",score:0}],refreshScores:function(e){this.isHighScore(e.score)&&(this.storage[this.storage.length-1]=e,this.storage=_.sortBy(this.storage,function(e){return 0-e.score}),localStorage.setItem(this.key,JSON.stringify(this.storage)),this.$highScoreContainer.trigger("refreshScores.ScoresStorage",{data:this.storage}))},isHighScore:function(e){return this.storage[this.storage.length-1].score<e}},e}();
!function(){"use strict";$(function(){var e,n=document.getElementById("snake_canvas"),a=$("#score"),t=$("#high_score_tmpl").html(),o=$("#high_score"),s=$("#name");if($(n).on("updateScore.SnakeGame",function(e,n){a.text(n.score)}),$(n).on("snakeIsDead.SnakeGame",function(e,n){c.refreshScores(n)}),o.on("refreshScores.ScoresStorage",function(e,n){var a=_.template(t);o.html(a(n))}),n){$.when($.ajax({url:"http://api.uinames.com/",dataType:"jsonp",crossDomain:!0,method:"GET",data:{amount:1,country:"United States"}})).then(function(a){e=new SnakeGame(n,{snakeName:a[0].name}),s.text(e.options.snakeName)},function(){e=new SnakeGame(n),s.text(e.options.snakeName)});var c=new ScoresStorage(o)}})}();