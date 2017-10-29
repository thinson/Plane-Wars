var Enemy = function (opts) {
    var opts = opts || {};
    Element.call(this, opts );
    this.status = 'normal';
    this.icon = opts.icon;
    this.live = opts.live;
    this.type = opts.type;
};

Enemy.prototype = new Element();

//注意canvas的坐标，这里是向下移动
Enemy.prototype.down = function() {
    this.move(0,this.speed);
};

Enemy.prototype.draw = function(){
    // context.fillRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.icon,this.x,this.y,this.width,this.height);
}
