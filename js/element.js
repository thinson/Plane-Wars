//此js用于定义父类element对象

var Element = function(opts){
    var opts = opts || {}; //若无定义传入空对象
    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width;
    this.height = opts.height;
    this.speed = opts.speed;
};

Element.prototype = {
    move: function(x,y) {
        var addX = x || 0;
        var addY = y || 0;
        this.x+=x;
        this.y+=y;
    },
    draw: function(){

    }
    //函数写在 原型 里面 注意理解原型的含义
}