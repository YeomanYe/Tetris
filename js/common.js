//产生一个从0到参数的随机整数,不包含参数 
function rand(range){
	return Math.floor(Math.random()*range);
}
/*工具函数*/
/* requestAnimationFrame.js
 * by zhangxinxu 2013-09-30
*/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

//不断趋向于aim
function lerpDistance(aim, cur, ratio) {
    var delta = cur - aim;
    return aim + delta * ratio;
}
//不断趋向于角度
function lerpAngle(a, b, t) {
    var d = b - a;
    if (d > Math.PI) d = d - 2 * Math.PI;
    if (d < -Math.PI) d = d + 2 * Math.PI;
    return a + d * t;
}
//获取两点之间的距离
function calLength2(x1, y1, x2, y2) {
    return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
}


//阻止事件冒泡
function stopBubble(e) {
    //一般用在鼠标或键盘事件上
    if (e && e.stopPropagation) {
        //W3C取消冒泡事件
        e.stopPropagation();
    } else {
        //IE取消冒泡事件
        window.event.cancelBubble = true;
    }
}

//阻止默认行为
function preventDefault(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        window.event.returnValue = false;
    }
}
//添加事件
window.Node.prototype.addEvent = function(event, fun) {
    if (this.addEventListener) {
        this.addEventListener(event, fun, false);
    } else if (this.attachEvent) {
        this.attachEvent("on" + event, fun);
    } else {
        console.log("不支持事件绑定函数!");
    }

    return this;
};


/*添加class*/
window.Node.prototype.addClass = function(value) {
    if (!this.className) {
        this.className = value;
    } else {
        newClassName = this.className;
        newClassName += " ";
        newClassName += value;
        this.className = newClassName;
    }
    //便于连缀的操作
    return this;
};


/*移除class*/
window.Node.prototype.removeClass = function(value) {
    this.className = this.className.replace(value, "");
    return this;
};

//获取鼠标相对于元素的坐标
function captureMouse(elem) {
    var obj = {x:0,y:0};
    elem.addEvent("click", function(e) {
        var x, y;
        var event = e || window.event,
            element = event.currentTarget;

        //获取鼠标位于当前屏幕的位置， 并作兼容处理
        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        //将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置
        x -= element.offsetLeft;
        y -= element.offsetTop;
        obj.x = x;
        obj.y = y;
    });
    return obj;
}

//批量设置样式
window.Node.prototype.setStyle = function(styleObj) {
    for (var key in styleObj) {
        this.style[key] = styleObj[key];
    }
    return this;
};

//获取屏幕可视区域宽高
function getWindowSize() {
    var cHeight = document.documentElement.clientHeight || document.body.clientHeight,
        cWidth = document.documentElement.clientWidth || document.body.clientWidth,
        obj = {
            width: cWidth,
            height: cHeight
        };
    return obj;
}