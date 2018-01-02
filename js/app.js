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
    // board : 0,
    // score : 0,
    // bossState: 0 ,
    // soundValue : 1 ,
    //检测声音是否开启
    soundValueChange: function(){
        var obj =  $('.musicSetting').val()
        
        if(obj ==="1") {
            this.soundValue = 1;
            // console.log("jiancehaole");
        }
        else {
            this.soundValue = 0;
        }
        // console.log(obj);
        // console.log(this.soundValue);
    },
    bgImageChange: function() {
        var obj =  $('.bgSetting').val()
        
        if(obj ==="1") {
            document.body.style.backgroundImage="url(./img/bg_4.jpg)";
    }
    },
    planeImageChange: function() {
        var obj =  $('.planeSetting').val()
        
        if(obj ==="1") {
            this.planeColor = 'pink';
            // console.log(this.planeColor)
    }
    },
    init: function(opts) {
        var opts = Object.assign({}, opts, CONFIG); 
        //把CONFIG的属性传入opts
        this.opts = opts; 
        this.soundValue = 0;
        this.score = 0;
        this.board = 0;
        this.bossState = 0;
        this.planeColor = 'blue';
        this.soundValueChange();
        this.bgImageChange();
        this.planeImageChange();
        if(this.soundValue === 1 ) {
            
                gameSound.play();
                gameSound.loop = 1;
            
        }
        else {
            gameSound.pause();
        }
        //弄懂一下this，此处可能是将opts这个位置属性付给game这个大框架,作为GAME的一个属性

        this.planePosX = canvasWidth / 2 -opts.planeSize.width / 2;
        this.planePosY = canvasHeight - opts.planeSize.height - 50;

       // console.log(this.opts)
    },
    // createBoss: function(){
    //     this.createEnemy('boss');
    // },
    start: function(){
        var self = this;
        var opts = this.opts;
        var images = this.images;

        this.enemies = [];
        // this.score = 0;

        this.createSmallEnemyInterval = setInterval(function(){
            self.createEnemy('normal');
        },500);
        this.createBigEnemyInterval = setInterval(function(){
            self.createEnemy('big');
        },3000);
        
        this.createBigEnemyInterval = setInterval(function(){
            if(self.score >=200 ) {
            // console.log(self.score)
            self.createEnemy('boss');
            }
            },30000),
        
        
        /*this.createBossEnemy = function() {
            if(self.score >= 100) {
                self.createEnemy('boss');
            }
        }*/
        this.plane = new Plane({
            x: this.planePosX,
            y: this.planePosY,
            width: opts.planeSize.width,
            height: opts.planeSize.height,
            color: opts.planeColor,
            //子弹相关
            bulletSize: opts.bulletSize,
            bulletSpeed: opts.bulletSpeed,
            //图片资源
            icon: resourceHelper.getImage('bluePlaneIcon'),
            bulletIcon: resourceHelper.getImage('fireIcon'),
            boomIcon: resourceHelper.getImage('enemyBigBoomIcon')
        }),
        this.plane.startShoot(this.soundValue);
        if(this.planeColor === 'pink') {
            this.plane.icon = resourceHelper.getImage('pinkPlaneIcon');
        }
        this.update();



    },
    update: function(){
        var self = this;
        var opts = this.opts;
        this.updateElement();
        context.clearRect(0,0,canvasWidth,canvasHeight);
        if(this.plane.status === 'boomed') {
            this.end();
            return;
        }
        this.draw();

        requestAnimationFrame(function(){
            self.update()
        });

    },

    updateElement: function(){
        var self = this;
        var opts = this.opts;
        var enemySize = opts.enemySize;
        var enemies = this.enemies;
        var plane = this.plane;
        var i = enemies.length;
        
        //如果飞机爆炸，继续爆炸
       if(plane.status === 'booming') {
           plane.booming(this.soundValue);
           return;
       }

       // 遍历下移
        while(i--) {
            var enemy = enemies[i];
            if(enemy.type === 'boss'&& enemy.live !=0 ) {
                this.bossState = 1;
                boss = enemies[i];
            //     var  j = i-1;
            //     while(j) {
            //     var enemy2 = enemies[j];
            //     enemy2.booming();
            // }
        }
            
                enemy.down();
            
            if (enemy.y >= canvasHeight && this.bossState === 0) {
                this.enemies.splice(i,1);
            }
           
            else {
                if(enemy.y>= 0 && enemy.x>=0 &&enemy.x <= canvasWidth - enemy.width && this.bossState === 1) {
                    enemy.miao();
                }
                if (plane.status === 'normal') {
                    if (plane.hasCrash(enemy)) {
                        plane.booming(this.soundValue);
                    }
                }
                switch(enemy.status) {
                    case 'normal':
                    if(plane.hasHit(enemy)) {
                        enemy.live -= 1;
                        if(enemy.live===0) {
                            if(enemy.type === 'normal') {
                                this.score +=  10;
                            }
                            else if(enemy.type === 'big') {
                                this.score +=  110;
                                }
                            else {
                                    this.score +=  300;
                                    this.bossState = 0;
                                    }
                    
                            
                            enemy.booming(this.soundValue);
                            // console.log(this.score);
                        }
                    }
                    break;

                    case 'booming':
                    enemy.booming(this.soundValue);
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
        var flag=0;
    
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
        //鼠标控制
        

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
        $canvas.on('mousedown',function(e){
            var plane = self.plane;
            //记录首次触摸位置，可以深究！！
            startTouchX = e.offsetX;
            startTouchY = e.offsetY;
            //console.log('touchstart', startTouchX, startTouchY);
            startPlaneX = plane.x;
            startPlaneY = plane.y;
            //canvas中对滑动屏幕的操作
            flag = 1;
            $canvas.on('mouseup',function(){
                flag =  0;
            })
        })
        //鼠标控制
        $canvas.on('mousemove',function(e) {
            if (flag === 1) {var newTouchX = e.offsetX;
            var newTouchY = e.offsetY;
            // console.log('mousemove',newTouchX,newTouchY);

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
        }})
        

        


    },
   
    createEnemy: function(enemyType) {
        var enemies = this.enemies;
        var opts = this.opts;
        var images = this.images || {};
        var enemySize = opts.enemySmallSize;
        var enemySpeed = opts.enemySpeed;
        var enemyIcon = resourceHelper.getImage('enemySmallIcon');
        var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');
        // console.log(this.bossState);
        // var boss = this.bossState;
        // var enemyType = opts.type;
        
        var enemyLive = 1;

        if (enemyType ==='big') {
            enemySize  = opts.enemyBigSize;
            enemySpeed = opts.enemySpeed * 0.6;
            enemyIcon = resourceHelper.getImage('enemyBigIcon');
            enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
            enemyLive = 10;
        }
        else if(enemyType === 'boss') {
            enemySize  = opts.enemyBossSize;
            enemySpeed = opts.enemySpeed * 0.3;
            enemyIcon = resourceHelper.getImage('enemyBossIcon');
            enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
            enemyLive = 30;
        }

        var initOpts = {
            x: Math.floor(Math.random() * (canvasWidth - enemySize.width)),
            y: -enemySize.height,
            type: enemyType,
            live: enemyLive,
            width: enemySize.width,
            height: enemySize.height,
            speed: enemySpeed,
            icon: enemyIcon,
            boomIcon: enemyBoomIcon,
            //美工待添加

        }
        if(enemies.length < opts.enemyMaxNum && this.bossState === 0 ) {
            enemies.push(new Enemy(initOpts));
        }
        // console.log(enemies);

    },

    returnToIndex: function(){
        $body.attr('data-status','index')
    },

    end: function(){
        if(this.soundValue === 1) {
            endSound.play();
        }
        var info = "游戏结束！你的分数为   "+this.score+"!!!  点击回到主页";
        alert(info);
        this.returnToIndex();
        this.score = 0;
        this.bossState = 0;

    },
    draw: function(){
        this.enemies.forEach(function(enemy) {
            enemy.draw();
        })
        this.plane.draw();
        this.drawScore();
    },
    drawScore: function() {
        // var self = this;
        this.board ="分数："+ this.score;
        context.font = "30px Courier New";
        context.fillStyle = "white";
        context.fillText(this.board,20,40);
    }

}

function blindEvent() {
    var self = this;
    $('.js-start').on('click',function(){
        $body.attr('data-status','start');
        GAME.start();
    })
    $('.js-setting').on('click',function(){
        $body.attr('data-status','setting');
    })
    $('.js-rule').on('click',function(){
        $body.attr('data-status','rule')
    })
    $('.js-confirm').on('click',function(){
        $body.attr('data-status','index')
        GAME.init();
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