// 飞机作为子类 继承element

var Plane = function(opts){
    var opts = opts || {};
    //调用父类？？？
    Element.call(this,opts);

    //特有
    this.status = 'normal';
    this.icon = opts.icon;

    //bullet相关
    this.bullets = [];
    this.bulletSize = opts.bulletSize;
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletIcon = opts.bulletIcon;


};
//继承方法
Plane.prototype = new Element();
//飞机是否发生碰撞——>游戏结束
Plane.prototype.hasCeash = function(target) {
    var crash = false;
    if (!(this.x + this.width < target.x) &&
    !(target.x + target.width < this.x) &&
    !(this.y + this.height < target.y) &&
    !(target.y + target.height < this.y)) {
      // 物体碰撞了
      crash = true;
    }
    return crash;
  };
//子弹是否击中目标
Plane.prototype.hasHit = function(target) {
    var bullets = this.bullets;
    var hasHit = false;
    for (var j = bullets.length - 1; j >= 0;j--) {
        if (bullets[j].hasCeash(target)){
            //遍历清楚子弹操作
            this.bullets.splice(j,1);
            hasHit = true;
            break;
        }
    }
    return hasHit;
}

//PLANE中的修改位置函数
Plane.prototype.setPosition = function(newPlaneX, newPlaneY) {
    this.x = newPlaneX;
    this.y = newPlaneY;
    return this;
};

//开始射击

Plane.prototype.startShoot = function(){
    var self = this;
    var bulletWidth = this.bulletSize.width;
    var bulletHeight = this.bulletSize.height;

    //定时发射子弹
    this.shootingInterval = setInterval(function(){
        //定义子弹初始位置
        var bulletX = self.x + self.width / 2 -bulletWidth / 2;
        var bulletY = self.y - bulletHeight;
        //初始化完成后执行push函数定时创建子弹
        self.bullets.push (new Bullet({
            x: bulletX,
            y: bulletY,
            width: bulletWidth,
            height: bulletHeight,
            speed: self.bulletSpeed,
            icon: self.bulletIcon,
        }));
        },200)
};

// 绘制子弹
Plane.prototype.drawBullets = function() {
    var bullets = this.bullets;
    var i = bullets.length;
    while (i--) {
        var bullet = bullets[i];
        //用函数更新子单位制
        bullet.fly();
        if (bullet.y <= 0) {
            //bullets下降到底部，消除这个子弹对象
            bullets.splice(i,1);
        }else {
            bullet.draw();
        }
    }

};
// 方法: draw 方法
Plane.prototype.draw = function() {
    // 绘制飞机
    switch(this.status) {
      case 'booming':
        context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
        break;
      default:
        context.drawImage(this.icon, this.x, this.y, this.width, this.height);
        break;
    }
    // 绘制子弹
    this.drawBullets();
    return this;
  };




