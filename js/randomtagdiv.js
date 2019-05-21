/****
 * 在div中随机展示tag元素
 * 
 * 参数
 * boxWidth：div盒子宽度
 * boxHeight：div盒子高度
 * tagWidth：tagDiv宽度
 * tagHeight：tagDiv高度
 * tagObjs：tagDiv内容
 * tagColor：tagDiv里的字体颜色
 * tagBackColor：tagDiv的背景色数组，tagDiv按该数组中的颜色显示
 *
 */
//用闭包形式来写，前面加;是防止跟其他js压缩时报错
; (function () {
    //默认属性
    var defaults = {
        boxWidth: 500,
        boxHeight: 350,
        tagWidth: 75,
        tagHeight: 20,
        tagObjs: new Array(),
        tagColor: "#ffffff",
        tagBackColor: ["#CD7D2F", "#65B180", "#238EDE", "#65B180","#CD7D2F", "#1576A3"],
        arrayX: new Array(),
        arrayY: new Array(),
        maxXLimit: 0,
        maxYLimit: 0,
        isInteract: false,
        loopSafeValue: 5000 //理想情况下，代码会循环获取新的tagDiv的值以确保不和已有tagDiv不重叠。但当tagDiv很多时，不可能不重叠（boxDiv空间有限）。此时循环就会一直找不到不重叠的值而进入死循环。为了防止死循环，设置一个最大循环次数值。超过此值后循环终止
    };
 
    var randomTagDiv = function (options) {
        this.init(options);
    }
 
    randomTagDiv.prototype = {
        init: function (options) {
            let _this = this;
            _this.options = $.extend(defaults, options);//传参覆盖以后的属性
        },
        //divObj为tagDiv盒子的对象
        show: function (divObj) {
            let _this = this;
            //tagDiv盒子的样式和大小设置
            $(divObj).css({
                position: 'relative',
                cursor: 'default'
            });
	    //如果盒子已经有大小了则按盒子的大小显示
            if($(divObj).width()<1){
               $(divObj).width(_this.options.boxWidth);
            }else{
			_this.options.boxWidth=$(divObj).width();
			}
            if($(divObj).height()<1){
                $(divObj).height(_this.options.boxHeight);
            }else{
			_this.options.boxHeight=$(divObj).height();
			}
	    //计算randomTagDiv的坐标最大x和y值
            _this.options.maxXLimit = _this.options.boxWidth - _this.options.tagWidth - 1;//-1防止压边，距离边线1px
            _this.options.maxYLimit = _this.options.boxHeight - _this.options.tagHeight - 1;
			
	    $(divObj).html("");
            for (var i = 0; _this.options.tagObjs && i < _this.options.tagObjs.length; i++) {
                var tagObj = _this.getTag(); //获取图片xy轴的坐标
                // 追加到div容器中
                $("<span style='border-radius: 3px;padding: 1px 3px;position: absolute;text-align: center;font-weight: 500;font-size: 14px;line-height: 20px;font-family: FZLTHJW--GB1-0'>" + _this.options.tagObjs[i] + "</span>")
                    .appendTo(divObj)
                    .css({
                        top: tagObj.y,
                        left: tagObj.x,
                        height: _this.options.tagHeight,
                        backgroundColor: _this.getTagBackColor(i),
                        color: _this.options.tagColor
                    });
            }
 
            //有重叠
            if (_this.options.isInteract) {
                $(".randomTagDiv").css({ cursor: 'pointer' });
                _this.mountAction();
            }
        },
        //绑定事件，使得被点击的tagDiv在最上层
        mountAction: function () {
            $(".randomTagDiv").on('click', function () {
                $('.randomTagDiv').css({ zIndex: 99 });
                $(this).css({ zIndex: 100 });
            }
            );
        },
        //获取背景颜色
        getTagBackColor: function (num) {
            var _thisOpt = this.options;
            var index = num % _thisOpt.tagBackColor.length;
            return _thisOpt.tagBackColor[index];
        },
        getTag: function () {
            let _this = this;
            var tagObj = new Object();
            tagObj.x = 0;
            tagObj.y = 0;
            var i = 0;
            while (i < _this.options.loopSafeValue) {
                tagObj.x = Math.ceil(Math.random() * _this.options.maxXLimit);
                tagObj.y = Math.ceil(Math.random() * _this.options.maxYLimit);
                if (!_this.isInteractOnEachOther(tagObj)) {
                    break;
                }
                i++;
            }
            if (i >= _this.options.loopSafeValue) {
                _this.options.isInteract = true;
            }
 
            return tagObj;
        },
        //是否和已有DIV重叠
        isInteractOnEachOther: function (oPos) {
            var _thisOpt = this.options,
                bIsInteract = false;
 
            for (var i = 0; _thisOpt.arrayX && i < _thisOpt.arrayX.length; i++) {
                if (
                    oPos.x > _thisOpt.arrayX[i] - _thisOpt.tagWidth &&
                    oPos.x < _thisOpt.arrayX[i] + _thisOpt.tagWidth &&
                    (oPos.y > _thisOpt.arrayY[i] - _thisOpt.tagHeight &&
                        oPos.y < _thisOpt.arrayY[i] + _thisOpt.tagHeight)
                ) {
                    //有重复，break
                    bIsInteract = true;
                    break;
                }
            }
 
            //无重复
            if (!bIsInteract) {
                _thisOpt.arrayX[_thisOpt.arrayX.length] = oPos.x;
                _thisOpt.arrayY[_thisOpt.arrayY.length] = oPos.y;
            }
 
            return bIsInteract;
        }
    };
 
    window.randomTagDiv = randomTagDiv;
})();
