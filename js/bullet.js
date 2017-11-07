/*属性传入element*/
var Bullet = function(opts) {
    var opts = opts ||{};
    Element.call(this,opts);
    this.icon = opts.icon;
}

//继承element的方法
Bullet.prototype = new Element();

// 函数返回值作为状态更新
Bullet.prototype.fly = function(){
    this.move(0,-this.speed);
    return this;
}

Bullet.prototype.crash = function(target){
    var crash = false;
    //判断是否有空隙
    if (!(this.x + this.width < target.x) &&
    !(target.x + target.width < this.x) &&
    !(this.y + this.height < target.y) &&
    !(target.y + target.height < this.y)) {
      // 物体碰撞了
      crash = true;
    }
    return crash;
  };

  //绘制方法
  Bullet.prototype.draw = function(){
      context.drawImage(this.icon,this.x,this.y,this.width,this.height);
      return this;
  }

