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
        var plane = this.plane;
        var i = enemies.length;
       // 遍历下移
        while(i--) {
            var enemy = enemies[i];
            enemy.down();
            if (enemy.y >= canvasHeight) {
                this.enemies.splice(i,1);
            }
            else {
                switch(enemy.status) {
                    case 'normal':
                    if(plane.hasHit(enemy)) {
                        enemy.live -= 1;
                        if(enemy.live===0) {
                            enemy.booming();
                        }
                    }
                    break;

                    case 'booming':
                    enemy.booming();
                    break;

                    case 'boomed':
                    enemies.splice(i,1);
                    break;
                }

            }
        }


    },

    //触摸控制飞机模块
    bindTouchAction: function() {
        var opts = this.opts || {};
        var self = this;
        //飞机极限坐标
        var planeMinX = 0;
        var planeMinY = 0;
        var planeMaxX = canvasWidth - opts.planeSize.width;
        var planeMaxY = canvasHeight - opts.planeSize.height;
        //手指初始位置
        var startTouchX;
        var startTouchY;
        //飞机初始位置定义
        var startPlaneX;
        var startPlaneY;

        //第一次触摸到屏幕
        $canvas.on('touchstart',function(e){
            var plane = self.plane;
            //记录首次触摸位置，可以深究！！
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
            //console.log('touchstart', startTouchX, startTouchY);
            startPlaneX = plane.x;
            startPlaneY = plane.y;
        });

        //canvas中对滑动屏幕的操作
        $canvas.on('touchmove',function(e) {
            var newTouchX = e.touches[0].clientX;
            var newTouchY = e.touches[0].clientY;
            // console.log('touchmove',newTouchX,newTouchY);

            //新飞机等于手指滑动距离+飞机初始位置
            var newPlaneX = startPlaneX + newTouchX - startTouchX;
            var newPlaneY = startPlaneY + newTouchY - startTouchY;
            //是否越界的判断
            if(newPlaneX < planeMinX){
                newPlaneX = planeMinX;
              }
              if(newPlaneX > planeMaxX){
                newPlaneX = planeMaxX;
              }
              if(newPlaneY < planeMinY){
                newPlaneY = planeMinY;
              }
              if(newPlaneY > planeMaxY){
                newPlaneY = planeMaxY;
              }
            //   调用飞机类中的设置位置的函数
              self.plane.setPosition(newPlaneX,newPlaneY);
              e.preventDefault();
        })

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
        //console.log(enemies);

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
    GAME.bindTouchAction();
    blindEvent();
    })

}

init();