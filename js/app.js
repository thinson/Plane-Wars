var $body = $(document.body);

var $canvas = $('#game');
var canvas = $canvas.get(0);
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

// 创建游戏对象
var GAME = {
    init: function(opts) {
        var opts = Object.assign({}, opts, CONFIG); 
        //把CONFIG的属性传入opts
        this.opts = opts; 
        //弄懂一下this，此处可能是将opts这个位置属性付给game这个大框架,作为GAME的一个属性

        this.planePosX = canvasWidth / 2 -opts.planeSize.width / 2;
        this.planePosY = canvasHeight - opts.planeSize.height - 50;

       // console.log(this.opts)
    },
    start: function(){
        var self = this;
        var opts = this.opts;
        var iamges = this.images;

        this.enemies = [];
        this.score = 0;

        this.createSmallEnemyInterval = setInterval(function(){
            self.createEnemy('normal');
        },500);
        this.createBigEnemyInterval = setInterval(function(){
            self.createEnemy('big');
        },500);


    },
    update: function(){
        var self = this;
        var opts = this.opts;
        this.updateElement();
        context.clearRect(0,0,canvasWidth,canvasHeight);
        this.draw();

        requestAnimationFrame(function(){
            self.update()
        });

    },
    end: function(){

    },
    draw: function(){

    },

}

function blindEvent() {
    var self = this;
    $('.js-start').on('click',function(){
        $body.attr('data-status','start')
    })
    $('.js-setting').on('click',function(){
        $body.attr('data-status','setting')
    })
    $('.js-rule').on('click',function(){
        $body.attr('data-status','rule')
    })
    $('.js-confirm').on('click',function(){
        $body.attr('data-status','index')
    })
}

window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 30);
};

function init() {
    GAME.init();
    blindEvent();

}

init();