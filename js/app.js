var $body = $(document.body);

var $cavas = $('#game');
var cavas = $cavas.get(0);
var context = cavas.getContext('2d');

cavas.width = window.innerWidth;
cavas.height = window.innerHeight;

var cavasWidth = cavas.clientWidth;
var cavasHeught = cavas.clientHeight;

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
    blindEvent();

}

init();