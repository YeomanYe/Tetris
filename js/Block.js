/**
 * 方块类型:1正方形,2:长条,3:三角形,4:左三,5:右三
 * 6:左二,7:右二
 */
BlockFactory = {

    newInstance: function(blockType,blockSize) {

        //
        var block = null;
        switch (blockType) {
            case 1:
                block = new Square(blockSize);
                break;
            case 2:
                block = new Strip(blockSize);
                break;
            case 3:
                block = new Triangle(blockSize);
                break;
            case 4:
                block = new SideThree(4,blockSize);
                break;
            case 5:
                block = new SideThree(5,blockSize);
                break;
            case 6:
                block = new SideTwo(6,blockSize);
                break;
            case 7:
                block = new SideTwo(7,blockSize);
                break;
        }
        return block;
    }
};

function Square(blockSize) {
    this.x = (Math.floor(colNum / 2) - 1) * blockSize;
    this.y = -2 * blockSize;
    this.status = 0;
    this.type = 1;
    this.xIndex;
    this.yIndex;
    this.matrix;
    if (typeof Square.prototype.draw !== "function") {
        Square.prototype.draw = function(ctx,blockSize) {
            ctx.beginPath();
            ctx.fillStyle = blockFillStyle;

            ctx.strokeStyle = blockStrokeStyle;
            //绘制方块的线
            var i = 0;
            for (i = 0, len = 2; i <= len; i++) {
                //绘制纵向的线
                ctx.moveTo(this.x-blockSize + i * blockSize, this.y-blockSize);
                ctx.lineTo(this.x- blockSize + i * blockSize, this.y +  blockSize);
                //绘制横向的线
                ctx.moveTo(this.x -blockSize, this.y + i * blockSize-blockSize);
                ctx.lineTo(this.x +  blockSize, this.y + i * blockSize-blockSize);
            }
            ctx.fillRect(this.x-blockSize, this.y-blockSize, 2 * blockSize, 2 * blockSize);
            ctx.stroke();
            ctx.closePath();

            this.calMatrix();
        };
        Square.prototype.calMatrix = function() {
            //使用点阵系统便于计算
            this.xIndex = this.x / blockSize;
            this.yIndex = this.y / blockSize;
            this.matrix = [
                { x: this.xIndex, y: this.yIndex },
                { x: this.xIndex-1, y: this.yIndex  },
                { x: this.xIndex , y: this.yIndex-1 },
                { x: this.xIndex - 1, y: this.yIndex -1 }
            ];
        };
    }
}
//长条对象
function Strip(blockSize) {
    this.x = (Math.floor(colNum / 2)) * blockSize;
    this.y = -blockSize;
    this.type = 2;
    this.status = 0;
    this.xIndex;
    this.yIndex;
    this.matrix;
    if (typeof Strip.prototype.draw !== "function") {
        Strip.prototype.draw = function(ctx,blockSize) {
            ctx.save();
            ctx.translate(this.x, this.y);
            this.status %= 2;
            ctx.rotate(this.status * 90 * Math.PI / 180);

            ctx.beginPath();
            ctx.fillStyle = blockFillStyle;
            ctx.strokeStyle = blockStrokeStyle;


            var i = 0;

            for (i = 0, len = 4; i <= len; i++) {
                ctx.moveTo(-2 * blockSize + i * blockSize, 0);
                ctx.lineTo(-2 * blockSize + i * blockSize, 0 + blockSize);
            }
            //绘制两条横向的线
            ctx.moveTo(-2 * blockSize, 0);
            ctx.lineTo(-2 * blockSize + 4 * blockSize, 0);
            ctx.moveTo(-2 * blockSize, 0 + blockSize);
            ctx.lineTo(-2 * blockSize + 4 * blockSize, 0 + blockSize);
            ctx.closePath();

            ctx.fillRect(-2 * blockSize, 0, 4 * blockSize, blockSize);
            ctx.stroke();

            ctx.restore();

            this.calMatrix();
        };
        Strip.prototype.calMatrix = function() {
            //更新点阵位置
            this.xIndex = this.x / blockSize;
            this.yIndex = this.y / blockSize;

            this.status %=2;
            if (!this.status) {
                this.matrix = [
                    { x: this.xIndex + 1, y: this.yIndex },
                    { x: this.xIndex, y: this.yIndex },
                    { x: this.xIndex - 1, y: this.yIndex },
                    { x: this.xIndex - 2, y: this.yIndex }
                ];
            } else {
                this.matrix = [
                    { x: this.xIndex - 1, y: this.yIndex },
                    { x: this.xIndex - 1, y: this.yIndex + 1 },
                    { x: this.xIndex - 1, y: this.yIndex - 1 },
                    { x: this.xIndex - 1, y: this.yIndex - 2 }
                ];
            }
        };
    }
}
//三角对象
function Triangle(blockSize) {
    this.x = Math.floor(colNum / 2) * blockSize;
    this.y = -blockSize;
    this.type = 3;
    this.status = 0;
    this.xIndex;
    this.yIndex;
    this.matrix;
    if (typeof Triangle.prototype.draw !== "function") {
        Triangle.prototype.draw = function(ctx,blockSize) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.status * 90 * Math.PI / 180);
            //绘制填充
            ctx.beginPath();
            ctx.fillStyle = blockFillStyle;



            //绘制描边
            ctx.strokeStyle = blockStrokeStyle;
            ctx.moveTo(-blockSize, 0);
            ctx.lineTo(2 * blockSize, 0);

            ctx.moveTo(-blockSize, blockSize);
            ctx.lineTo(2 * blockSize, blockSize);

            ctx.moveTo(0, -blockSize);
            ctx.lineTo(blockSize, -blockSize);

            ctx.moveTo(0, -blockSize);
            ctx.lineTo(0, blockSize);

            ctx.moveTo(blockSize, -blockSize);
            ctx.lineTo(blockSize, blockSize);

            ctx.moveTo(-blockSize, 0);
            ctx.lineTo(-blockSize, blockSize);

            ctx.moveTo(2 * blockSize, 0);
            ctx.lineTo(2 * blockSize, blockSize);

            ctx.closePath();
            ctx.fillRect(0, 0 - blockSize, blockSize, blockSize);
            ctx.fillRect(0 - blockSize, 0, blockSize * 3, blockSize);
            ctx.stroke();
            ctx.restore();

            this.calMatrix();
        };
        Triangle.prototype.calMatrix = function() {
            //更新点阵位置
            this.xIndex = this.x / blockSize;
            this.yIndex = this.y / blockSize;

            this.status %= 4;
            switch (this.status) {
                case 0:
                    this.matrix = [
                        { x: this.xIndex, y: this.yIndex },
                        { x: this.xIndex - 1, y: this.yIndex },
                        { x: this.xIndex + 1, y: this.yIndex },
                        { x: this.xIndex, y: this.yIndex - 1 }
                    ];
                    break;
                case 1:
                    this.matrix = [
                        { x: this.xIndex, y: this.yIndex },
                        { x: this.xIndex - 1, y: this.yIndex + 1 },
                        { x: this.xIndex - 1, y: this.yIndex },
                        { x: this.xIndex - 1, y: this.yIndex - 1 }
                    ];
                    break;
                case 2:
                    this.matrix = [
                        { x: this.xIndex - 1, y: this.yIndex },
                        { x: this.xIndex, y: this.yIndex - 1 },
                        { x: this.xIndex - 1, y: this.yIndex - 1 },
                        { x: this.xIndex - 2, y: this.yIndex - 1 }
                    ];
                    break;
                case 3:
                    this.matrix = [
                        { x: this.xIndex, y: this.yIndex },
                        { x: this.xIndex, y: this.yIndex - 1 },
                        { x: this.xIndex, y: this.yIndex - 2 },
                        { x: this.xIndex - 1, y: this.yIndex - 1 }
                    ];
                    break;
            }
        };
    }
}
//左三和右三
function SideThree(typeInt,blockSize) {
    this.x = (Math.floor((colNum - 3) / 2)) * blockSize;
    this.y = -blockSize;
    this.status = 0;
    this.type = typeInt;
    this.xIndex;
    this.yIndex;
    this.matrix;
    if (typeof SideThree.prototype.draw !== "function") {
        SideThree.prototype.draw = function(ctx,blockSize) {
            ctx.save();
            ctx.translate(this.x, this.y);
            if (this.type === 5) ctx.scale(-1, 1);
            ctx.rotate(this.status * 90 * Math.PI / 180);
            ctx.beginPath();

            //绘制填充样式
            ctx.fillStyle = blockFillStyle;
            //绘制描边
            ctx.strokeStyle = blockStrokeStyle;
            ctx.moveTo(-2 * blockSize, 0);
            ctx.lineTo( blockSize, 0);

            ctx.moveTo(-2 * blockSize, blockSize);
            ctx.lineTo(blockSize, blockSize);

            ctx.moveTo(0, -blockSize);
            ctx.lineTo(blockSize, -blockSize);

            ctx.moveTo(-2 * blockSize, 0);
            ctx.lineTo(-2 * blockSize, blockSize);

            ctx.moveTo(-blockSize, 0);
            ctx.lineTo(-blockSize, blockSize);

            ctx.moveTo(0, -blockSize);
            ctx.lineTo(0, blockSize);

            ctx.moveTo(blockSize, -blockSize);
            ctx.lineTo(blockSize, blockSize);


            ctx.closePath();
            ctx.fillRect(-2 * blockSize, 0, 2 * blockSize, blockSize);
            ctx.fillRect(0, -blockSize, blockSize, 2 * blockSize);
            ctx.stroke();
            ctx.restore();

            this.calMatrix();
        };

        SideThree.prototype.calMatrix = function() {
            //更新点阵位置
            this.xIndex = this.x / blockSize;
            this.yIndex = this.y / blockSize;

            this.status %= 4;
            var typeArg = this.type - 4;
            switch (this.status) {
                case 0:
                    this.matrix = [
                        { x: this.xIndex, y: this.yIndex },
                        { x: this.xIndex - 1, y: this.yIndex },
                        { x: this.xIndex - 2 + 3 * typeArg, y: this.yIndex },
                        { x: this.xIndex - typeArg, y: this.yIndex - 1 }
                    ];
                    break;
                case 1:
                    this.matrix = [
                        { x: this.xIndex - typeArg, y: this.yIndex },
                        { x: this.xIndex - 1 + typeArg, y: this.yIndex },
                        { x: this.xIndex - 1 + typeArg, y: this.yIndex - 1 },
                        { x: this.xIndex - 1 + typeArg, y: this.yIndex - 2 }
                    ];
                    break;
                case 2:
                    this.matrix = [
                        { x: this.xIndex + 1 - typeArg, y: this.yIndex - 1 },
                        { x: this.xIndex - typeArg, y: this.yIndex - 1 },
                        { x: this.xIndex - 1 - typeArg, y: this.yIndex - 1 },
                        { x: this.xIndex - 1 + typeArg, y: this.yIndex }
                    ];
                    break;
                case 3:
                    this.matrix = [
                        { x: this.xIndex - typeArg, y: this.yIndex + 1 },
                        { x: this.xIndex - typeArg, y: this.yIndex },
                        { x: this.xIndex - typeArg, y: this.yIndex - 1 },
                        { x: this.xIndex - 1 + typeArg, y: this.yIndex - 1 }
                    ];
                    break;
            }
        };
    }
}
//左二和右二
function SideTwo(typeInt,blockSize) {
    this.x = (Math.floor(colNum / 2) - 1) * blockSize;
    this.y = -blockSize;
    this.type = typeInt;
    this.status = 0;
    this.xIndex;
    this.yIndex;
    this.matrix;
    if (typeof SideTwo.prototype.draw !== "function") {
        SideTwo.prototype.draw = function(ctx,blockSize) {
            ctx.save();
            ctx.translate(this.x, this.y);
            if (this.type === 7) ctx.scale(-1, 1);
            this.status %= 2;
            ctx.rotate(this.status * 90 * Math.PI / 180);
            ctx.beginPath();

            //绘制填充样式
            ctx.fillStyle = blockFillStyle;
            //绘制描边
            ctx.strokeStyle = blockStrokeStyle;
            ctx.moveTo(-blockSize, 0);
            ctx.lineTo(2 * blockSize, 0);

            ctx.moveTo(-blockSize, blockSize);
            ctx.lineTo(blockSize, blockSize);

            ctx.moveTo(0, -blockSize);
            ctx.lineTo(2 * blockSize, -blockSize);

            ctx.moveTo(-blockSize, 0);
            ctx.lineTo(-blockSize, blockSize);

            ctx.moveTo(0, -blockSize);
            ctx.lineTo(0, blockSize);

            ctx.moveTo(blockSize, -blockSize);
            ctx.lineTo(blockSize, blockSize);

            ctx.moveTo(2 * blockSize, -blockSize);
            ctx.lineTo(2 * blockSize, 0);

            ctx.closePath();
            ctx.fillRect(-blockSize, 0, 2 * blockSize, blockSize);
            ctx.fillRect(0, -blockSize, 2 * blockSize, blockSize);
            ctx.stroke();
            ctx.restore();

            this.calMatrix();
        };
        SideTwo.prototype.calMatrix = function() {
            var typeArg = this.type - 6;
            //更新点阵位置
            this.xIndex = this.x / blockSize;
            this.yIndex = this.y / blockSize;
            //格式化状态
            this.status %= 2;
            if (!this.status) {
                this.matrix = [
                    { x: this.xIndex - 1, y: this.yIndex },
                    { x: this.xIndex - typeArg, y: this.yIndex - typeArg },
                    { x: this.xIndex, y: this.yIndex - 1 + typeArg },
                    { x: this.xIndex + 1 - 3 * typeArg, y: this.yIndex - 1 }
                ];
            } else {
                this.matrix = [
                    { x: this.xIndex - 1, y: this.yIndex - 1 + typeArg },
                    { x: this.xIndex - 1, y: this.yIndex + typeArg },
                    { x: this.xIndex, y: this.yIndex },
                    { x: this.xIndex, y: this.yIndex + 1 - 2 * typeArg }
                ];
            }
        };
    }
}
