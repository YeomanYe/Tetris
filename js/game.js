// 屏幕宽高
var screenWidth,screenHeight;
// 初始化函数
window.onload = function() {
    var canvas1 = document.getElementById("canvas1"),
        canvas2 = document.getElementById("canvas2"),
        canvas3 = document.getElementById("canvas3");
    ctx1 = canvas1.getContext("2d");
    ctx2 = canvas2.getContext("2d");
    ctx3 = canvas3.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    if(screenWidth>screenHeight){
        canWidth = Number.parseInt(screenHeight/defaultSize) * defaultSize;
        canHeight = canWidth;
        var canWrap = document.getElementById("wrap");
        canWrap.style.marginLeft = (screenWidth - canWidth) / 2 + "px";
        var controlPanel = document.getElementById("control-panel");
        controlPanel.style.left = canWidth + "px";
        canvas3.height = canHeight;
    }else{

    }

    canvas1.width = canWidth;
    canvas1.height = canHeight;
    canvas2.width = canWidth;
    canvas2.height = canHeight;

/*    canWidth = canvas2.offsetWidth;
    canHeight = canvas2.offsetHeight;*/

    rowNum = canHeight / defaultSize;
    colNum = canWidth / defaultSize;

    var playBtn = document.getElementById("playBtn");
    playBtn.style.cursor = "pointer";
    playBtn.onclick = function(event) {
        var elem = event.currentTarget;
        console.log(elem);
        isPlay = !isPlay;
        if (!isPlay) elem.className = "pause";
        else elem.className = "";
    };

    game();
};

//ctx2是下面一层canvas绘画上下文,ctx3用于显示分数控件等
var ctx1, ctx2, ctx3;
//绘制环境的宽高
var canWidth, canHeight;
//方块单元大小
var defaultSize = 40;
//行列数
var rowNum, colNum;
//绘制方块的样式
var blockStrokeStyle = "white",
    blockFillStyle = "red";
//代表需要绘制的方块,以及下一个需要绘制的方块
var block, next;
//环境状态数组,0:代表不存在,1:代表存在
var envirStatus;
//用于计数下落的速度
var initFallCount = 20,
    fallCount = initFallCount,
    accel = 1;
//用于判断游戏是否结束
var isEnd = false;
//用于判断游戏是否是运行
var isPlay = true;

function game() {
    gameInit();
    gameLoop();
}

function gameInit() {
    //暂停位清除
    isPlay = true;
    //结束位位清除
    isEnd = false;
    //初始化下落速度
    fallCount = initFallCount;
    //数据初始化
    dataObj.init();
    //初始化环境状态
    envirStatus = new Array(rowNum);
    var i = 0,
        j = 0;
    for (i = 0; i < rowNum; i++) {
        envirStatus[i] = new Array(colNum);
        for (j = 0; j < colNum; j++) {
            envirStatus[i][j] = 0;
        }
    }
    //绑定键盘事件,left:左,right:右,up:改变状态,down:向下加速
    window.onkeydown = function(event) {
        var key = event.keyCode;
        if (key === 37) {
            if (canMove(0)) {
                block.x -= defaultSize;
                block.calMatrix();
            }
        } else if (key === 39) {
            if (canMove(1)) {
                block.x += defaultSize;
                block.calMatrix();
            }
        } else if (key === 38) {
            blockChange();
        } else if (key === 40) {
            accel = 5;
        }
        //放开加速键停止加速
        window.onkeyup = function(event) {
            var key = event.keyCode;
            if (key === 40) {
                accel = 1;
            }
        };
    };

    drawBlockEnvir(ctx2);

    //生成一个新方块
    block = BlockFactory.newInstance(rand(7) + 1, defaultSize);
    next = rand(7) + 1;
}
var timeArg;

function gameLoop() {
    cancelAnimationFrame(timeArg);
    if (isEnd) return;
    timeArg = requestAnimationFrame(gameLoop, 15);
    if (!isPlay) return;
    ctx1.clearRect(0, 0, canWidth, canHeight);
    block.draw(ctx1, defaultSize);
    //判断是否可以下落
    if (fallCount <= accel && !canFall()) {
        ctx1.clearRect(0, 0, canWidth, canHeight);
        var matrix = block.matrix;
        for (var i = 0, len = matrix.length; i < len; i++) {
            var y = +matrix[i].y,
                x = +matrix[i].x;
            envirStatus[x][y] = 1;
        }
        blockFillStyle = "rgb(" + rand(150) + "," + rand(150) + "," + rand(150) + ")";
        eraser();

        drawBlockEnvir(ctx2);
        //判断游戏是否结束
        if (isOver()) gameOver();
        block = BlockFactory.newInstance(next, defaultSize);
        next = rand(7) + 1;
    }
    fallCount -= accel;
    if (fallCount <= 0) {
        fallCount = initFallCount;
        block.y += defaultSize;
    }
    showScore();
}


//判断能否下落
function canFall() {
    var matrix = block.matrix;
    var i = 0,
        len;
    //用于判断是否能够下落
    var flag = true;
    var y, x;
    for (i = 0, len = matrix.length; i < len; i++) {
        y = matrix[i].y;
        x = matrix[i].x;
        if (y >= rowNum - 1) {
            flag = false;
            break;
        } else if (envirStatus[x][y + 1]) {
            flag = false;
            break;
        }
    }
    return flag;
}
//是否能左移或右移,左:0,右:1
function canMove(dir) {
    var matrix = block.matrix,
        len = matrix.length,
        i = 0;
    var flag = true;
    for (i = 0; i < len; i++) {
        var x = matrix[i].x,
            y = matrix[i].y;
        if (!dir) {
            if (x - 1 < 0 || envirStatus[x - 1][y]) {
                flag = false;
                break;
            }

        } else {
            if (x > colNum - 2 || envirStatus[x + 1][y]) {
                flag = false;
                break;
            }
        }
    }
    return flag;
}
//变换函数
function blockChange() {
    var flag = true;
    block.status = (++block.status) % 4;
    var tempMatrix = block.matrix;
    block.calMatrix();
    var j, i, len;
    //判断前后移动一格是否可以改变状态
    for (j = 0; j < 3; j++) {
        flag = true;
        if (j === 1) {
            block.x += defaultSize;
            block.calMatrix();
        } else if (j === 2) {
            block.x -= 2 * defaultSize;
            block.calMatrix();
        }
        //获取变换后的matrix
        var matrix = block.matrix;
        for (i = 0, len = matrix.length; i < len; i++) {
            var x = matrix[i].x,
                y = matrix[i].y;
            if (x > colNum - 1 || (x < 0) || (y > rowNum - 1) || envirStatus[x][y]) {
                flag = false;
                break;
            }
        }
        if(flag)break;
    }
    //若果不能旋转还原状态
    if (!flag) {
        //还原水平位置
        block.x += defaultSize;
        block.status = (block.status === 0) ? 3 : (block.status - 1);
        block.matrix = tempMatrix;
    }
}

//擦除填满的行
function eraser() {
    var i, j, len, len2;
    //判断是否可删除,返回可删除行号
    var flag = true;
    var num = -1;
    for (i = 0, len = envirStatus.length; i < len; i++) {
        for (j = 0, len2 = envirStatus[i].length; j < len2; j++) {
            if (!envirStatus[j][i]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            num = i;
            break;
        } else {
            flag = true;
        }
    }
    if (num !== -1) {
        for (; num > 0; num--) {
            for (i = 0; i < colNum; i++) {
                envirStatus[i][num] = envirStatus[i][num - 1];
            }
        }
        for (i = 0; i < colNum; i++) {
            envirStatus[i][0] = 0;
        }
        dataObj.cont++;
        eraser();
    }
}

//根据方块大小,绘制网格
function drawBlockEnvir(ctx) {
    var i = 0,
        len;
    ctx.clearRect(0, 0, canWidth, canHeight);
    //绘制网格的行
    ctx.beginPath();
    ctx.strokeStyle = "black";
    for (i = 1, len = rowNum; i < len; i++) {
        ctx.moveTo(0, defaultSize * i);
        ctx.lineTo(canWidth, defaultSize * i);
    }
    //绘制网格的列
    for (i = 1, len = colNum; i < len; i++) {
        ctx.moveTo(defaultSize * i, 0);
        ctx.lineTo(defaultSize * i, canHeight);
    }

    //在对应的位置画一个方块
    var j = 0,
        len2;
    for (i = 0, len = envirStatus.length; i < len; i++) {
        for (j = 0, len2 = envirStatus[i].length; j < len2; j++) {
            if (envirStatus[i][j]) {
                ctx.fillStyle = "#0867A5";
                ctx.fillRect(i * defaultSize, j * defaultSize, defaultSize, defaultSize);
            }
        }
    }
    ctx.stroke();
    ctx.closePath();
}
//用于记录分值等信息
var dataObj = {
    cont: 0,
    init: function() {
        this.cont = 0;
    }
};

//显示分数
function showScore() {
    ctx3.clearRect(0, 0, 200, canHeight);
    ctx3.beginPath();
    ctx3.fillStyle = "rgb(13,30,64)";
    ctx3.fillRect(0, 0, 200, canHeight);
    ctx3.closePath();

    var canvas3 = document.getElementById("canvas3"),
        cWidth = canvas3.offsetWidth,
        cHeight = canvas3.offsetHeight;
    ctx3.fillStyle = "white";
    ctx3.font = "50px Arial";
    ctx3.fillText("Score", cWidth / 2 - 3 * 20, 100);
    //显示得分
    if (dataObj.cont) 
        ctx3.fillText(dataObj.cont * 100, cWidth / 2 - 2 * 20,100 + cHeight/6 );
    else
        ctx3.fillText(dataObj.cont * 100, cWidth / 2 ,100 + cHeight/6 );
    ctx3.fillText("Next", cWidth / 2 - 2 * 20, 300);
    var showBlock = BlockFactory.newInstance(next, 40);
    showBlock.x = cWidth / 2;
    showBlock.y = cHeight / 2 + 2 * defaultSize;
    showBlock.draw(ctx3, 40);
}
//判断游戏是否结束
function isOver() {
    var i = 0,
        matrix = block.matrix,
        len = matrix.length;
    for (i = 0; i < len; i++) {
        if (matrix[i].y < 0) {
            isEnd = true;
        }
    }
    return isEnd;
}
//游戏结束后的一些处理
function gameOver() {
    ctx1.font = "50px Arial";
    ctx1.fillStyle = "black";
    ctx1.fillText("Game Over", canWidth / 2 - 20 * 5, canHeight / 2 - 25);
    ctx1.fillText("Click To Restart", canWidth / 2 - 20 * 8, canHeight / 2 + 25);

    var canvas1 = document.getElementById("canvas1");
    canvas1.style.cursor = "pointer";
    canvas1.onclick = function(event) {
        var elem = event.currentTarget;
        elem.onclick = false;
        elem.style.cursor = "default";
        game();
    };
}
