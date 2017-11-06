var $body = $(document.body);

var $canvas = $('#game');
var canvas = $canvas.get(0);
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 30);
};

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
        var images = this.images;

        this.enemies = [];
        this.score = 0;

        this.createSmallEnemyInterval = setInterval(function(){
            self.createEnemy('normal');
        },500);
        this.createBigEnemyInterval = setInterval(function(){
            self.createEnemy('big');
        },1500);
        this.plane = new Plane({
            x: this.planePosX,
            y: this.planePosY,
            width: opts.planeSize.width,
            height: opts.planeSize.height,
            //子弹相关
            bulletSize: opts.bulletSize,
            bulletSpeed: opts.bulletSpeed,
            //图片资源
            icon: resourceHelper.getImage('bluePlaneIcon'),
            bulletIcon: resourceHelper.getImage('fireIcon'),
            boomIcon: resourceHelper.getImage('enemyBigBoomIcon')
        });
        this.plane.startShoot();

        this.update();


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

    updateElement: function(){
        var opts = this.opts;
        var enemySize = opts.enemySize;
        var enemies = this.enemies;
        var i = enemies.length;

        while(i--) {
            var enemy = enemies[i];
            enemy.down();
            if (enemy.y >= canvasHeight) {
                this.enemies.splice(i,1);
            }
            else {

            }
        }


    },

    createEnemy: function(enemyType) {
        var enemies = this.enemies;
        var opts = this.opts;
        var images = this.images || {};
        var enemySize = opts.enemySmallSize;
        var enemySpeed = opts.enemySpeed;
        var enemyIcon = resourceHelper.getImage('enemySmallIcon');
        var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');
        
        var enemyLive = 1;

        if (enemyType ==='big') {
            enemySize  = opts.enemyBigSize;
            enemySpeed = opts.enemySpeed * 0.6;
            enemyIcon = resourceHelper.getImage('enemyBigIcon');
            enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
            enemyLive = 10;
        }

        var initOpts = {
            x: Math.floor(Math.random() * (canvasWidth - enemySize.width)),
            y: -enemySize.height,
            enemyType: enemyType,
            live: enemyLive,
            width: enemySize.width,
            height: enemySize.height,
            speed: enemySpeed,
            icon: enemyIcon,
            boomIcon: enemyBoomIcon,
            //美工待添加

        }
        if(enemies.length < opts.enemyMaxNum) {
            enemies.push(new Enemy(initOpts));
        }
        console.log(enemies);

    },
    end: function(){

    },
    draw: function(){
        this.enemies.forEach(function(enemy) {
            enemy.draw();
        })
        this.plane.draw();
    },

}

function blindEvent() {
    var self = this;
    $('.js-start').on('click',function(){
        $body.attr('data-status','start');
        GAME.start();
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



function init() {
    resourceHelper.load(CONFIG.resources, function(resources){
    GAME.init();
    blindEvent();
    })

}

init();