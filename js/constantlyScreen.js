/**
 * 大屏滚动样式
 * @returns
 */
var radius = 90;
var d = 200;
var dtr = Math.PI / 180;
var mcList = [];
var lasta = 1;
var lastb = 1;
var distr = true;
var tspeed = 3;
var size = 200;
var mouseX = 0;
var mouseY = 10;
var howElliptical = 1;
var aA = null;
var oDiv = null;
window.onload = function () {
    var i = 0;
    var oTag = null;
    oDiv = document.getElementById('tagscloud');
    aA = oDiv.getElementsByTagName('a');
    for (i = 0; i < aA.length; i++) {
        oTag = {};
        aA[i].onmouseover = (function (obj) {
            return function () {
                obj.on = true;
                this.style.zIndex = 9999;
                this.style.color = 'black';
                this.style.padding = '5px 5px';
                this.style.filter = "alpha(opacity=100)";
                this.style.opacity = 1;
            }
        })(oTag)
        aA[i].onmouseout = (function (obj) {
            return function () {
                obj.on = false;
                this.style.zIndex = obj.zIndex;
                this.style.color = '#fff';
                this.style.padding = '5px';
                this.style.filter = "alpha(opacity=" + 100 * obj.alpha + ")";
                this.style.opacity = obj.alpha;
                this.style.zIndex = obj.zIndex;
            }
        })(oTag)
        oTag.offsetWidth = aA[i].offsetWidth;
        oTag.offsetHeight = aA[i].offsetHeight;
        mcList.push(oTag);
    }
    sineCosine(0, 0, 0);
    positionAll();
    (function () {
        update();
        setTimeout(arguments.callee, 40);
    })();
};

function update() {
    var a, b, c = 0;
    a = (Math.min(Math.max(-mouseY, -size), size) / radius) * tspeed;
    b = (-Math.min(Math.max(-mouseX, -size), size) / radius) * tspeed;
    lasta = a;
    lastb = b;
    if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
        return;
    }
    sineCosine(a, b, c);
    for (var i = 0; i < mcList.length; i++) {
        if (mcList[i].on) {
            continue;
        }
        var rx1 = mcList[i].cx;
        var ry1 = mcList[i].cy * ca + mcList[i].cz * (-sa);
        var rz1 = mcList[i].cy * sa + mcList[i].cz * ca;

        var rx2 = rx1 * cb + rz1 * sb;
        var ry2 = ry1;
        var rz2 = rx1 * (-sb) + rz1 * cb;

        var rx3 = rx2 * cc + ry2 * (-sc);
        var ry3 = rx2 * sc + ry2 * cc;
        var rz3 = rz2;

        mcList[i].cx = rx3;
        mcList[i].cy = ry3;
        mcList[i].cz = rz3;

        per = d / (d + rz3);

        mcList[i].x = (howElliptical * rx3 * per) - (howElliptical * 2);
        mcList[i].y = ry3 * per;
        mcList[i].scale = per;
        var alpha = per;
        alpha = (alpha - 0.6) * (10 / 6);
        mcList[i].alpha = alpha * alpha * alpha - 0.2;
        mcList[i].zIndex = Math.ceil(100 - Math.floor(mcList[i].cz));
    }
    doPosition();
}

function positionAll() {
    var phi = 0;
    var theta = 0;
    var max = mcList.length;
    for (var i = 0; i < max; i++) {
        if (distr) {
            phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
            theta = Math.sqrt(max * Math.PI) * phi;
        } else {
            phi = Math.random() * (Math.PI);
            theta = Math.random() * (2 * Math.PI);
        }
        //坐标变换
        mcList[i].cx = radius * Math.cos(theta) * Math.sin(phi) * 2;
        mcList[i].cy = radius * Math.sin(theta) * Math.sin(phi) * 1.5;
        mcList[i].cz = radius * Math.cos(phi) * 1.5;

        aA[i].style.left = mcList[i].cx + oDiv.offsetWidth / 2 - mcList[i].offsetWidth / 2 + 'px';
        aA[i].style.top = mcList[i].cy + oDiv.offsetHeight / 2 - mcList[i].offsetHeight / 2 + 'px';
    }
}

function doPosition() {
    var l = oDiv.offsetWidth / 2;
    var t = oDiv.offsetHeight / 2;
    for (var i = 0; i < mcList.length; i++) {
        if (mcList[i].on) {
            continue;
        }
        var aAs = aA[i].style;
        if (mcList[i].alpha > 0.1) {
            if (aAs.display != '')
                aAs.display = '';
        } else {
            if (aAs.display != 'none')
                aAs.display = 'none';
            continue;
        }
        aAs.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
        if (i > mcList.length / 2) {
            aAs.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
        }

        aAs.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';
        //aAs.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';
        //aAs.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+100*mcList[i].alpha+")";
        aAs.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
        aAs.zIndex = mcList[i].zIndex;
        aAs.opacity = mcList[i].alpha;
    }
}

function sineCosine(a, b, c) {
    sa = Math.sin(a * dtr);
    ca = Math.cos(a * dtr);
    sb = Math.sin(b * dtr);
    cb = Math.cos(b * dtr);
    sc = Math.sin(c * dtr);
    cc = Math.cos(c * dtr);
}

function map() {
    /*echarts*/
    $.get('../json/福建/福建.json', function (mapJson) {
        echarts.registerMap('福建', mapJson);
        var chart = echarts.init(document
            .getElementById('fuJianMap'));//在id为mainMap的dom元素中显示地图
        var data = [
            {
                name: '福州市',
                value: 55.3061,
                per: 51
            }, {
                name: '泉州市',
                value: 66.4565,
                per: 53
            }, {
                name: '厦门市',
                value: 49.5638,
                per: 52
            }, {
                name: '漳州市',
                value: 44.0240,
                per: 66
            }, {
                name: '龙岩市',
                value: 33.2828,
                per: 65.0
            }, {
                name: '宁德市',
                value: 30.8001,
                per: 60
            }, {
                name: '三明市',
                value: 30.1333,
                per: 64
            }, {
                name: '莆田市',
                value: 25.0386,
                per: 52
            }, {
                name: '南平市',
                value: 24.8774,
                per: 62
            }];

        var geoCoordMap = {
            '福州市': [119.3, 26.08],
            '厦门市': [118.1, 24.46],
            '莆田市': [119.00, 25.44],
            '三明市': [117.61, 26.23],
            '泉州市': [118.20, 25.10],
            '漳州市': [117.35, 24.20],
            '南平市': [118.20, 27.15],
            '龙岩市': [117.01, 25.12],
            '宁德市': [119.52, 26.99],
        };
        var data1 = {
            "福州市": [{
                name: '福清市',
                value: '75862'
            }, {
                name: '长乐市',
                value: '39447'
            }, {
                name: '鼓楼区',
                value: '52487'
            }, {
                name: '台江区',
                value: '34254'
            }, {
                name: '仓山区',
                value: '65950'
            }, {
                name: '马尾区',
                value: '16024'
            }, {
                name: '晋安区',
                value: '66851'
            }, {
                name: '闽侯县',
                value: '72041'
            }, {
                name: '连江县',
                value: '41205'
            }, {
                name: '罗源县',
                value: '19649'
            }, {
                name: '闽清县',
                value: '19324'
            }, {
                name: '永泰县',
                value: '20091'
            }, {
                name: '平潭县',
                value: '29876'
            }], "漳州市": [{
                name: '芗城区',
                value: '60580'
            }, {
                name: '龙文区',
                value: '32824'
            }, {
                name: '龙海市',
                value: '70100'
            }, {
                name: '云霄县',
                value: '40853'
            }, {
                name: '漳浦县',
                value: '54597'
            }, {
                name: '诏安县',
                value: '42042'
            }, {
                name: '长泰县',
                value: '22798'
            }, {
                name: '东山县',
                value: '31985'
            }, {
                name: '南靖县',
                value: '27766'
            }, {
                name: '平和县',
                value: '43899'
            }, {
                name: '华安县',
                value: '12796'
            }], "泉州市": [{
                name: '惠安县',
                value: '76745'
            }, {
                name: '南安市',
                value: '101460'
            }, {
                name: '安溪县',
                value: '68377'
            }, {
                name: '永春县',
                value: '30023'
            }, {
                name: '德化县',
                value: '26302'
            }, {
                /*name : '金门县',
                value : '15000'*/
                name: '金门县',
                value: '0'
            }, {
                name: '鲤城区',
                value: '39859'
            }, {
                name: '丰泽区',
                value: '55179'
            }, {
                name: '洛江区',
                value: '12705'
            }, {
                name: '泉港区',
                value: '35374'
            }, {
                name: '晋江市',
                value: '153092'
            }, {
                name: '石狮市',
                value: '65449'
            }], "龙岩市": [{
                name: '长汀县',
                value: '45608'
            }, {
                name: '连城县',
                value: '32389'
            }, {
                name: '漳平市',
                value: '34734'
            }, {
                /*name : '新罗区',
                value : '102542'*/
                name: '新罗区',
                value: '97697'
            }, {
                name: '武平县',
                value: '33190'
            }, {
                name: '上杭县',
                value: '44880'
            }, {
                name: '永定区',
                value: '44330'
            }], "厦门市": [{
                name: '同安区',
                value: '75327'
            }, {
                name: '翔安区',
                value: '62148'
            }, {
                name: '集美区',
                value: '91242'
            }, {
                name: '湖里区',
                value: '111995'
            }, {
                name: '海沧区',
                value: '52021'
            }, {
                name: '思明区',
                value: '102905'
            }], "宁德市": [{
                name: '寿宁县',
                value: '14164'
            }, {
                name: '福鼎市',
                value: '59947'
            }, {
                name: '柘荣县',
                value: '10648'
            }, {
                name: '周宁县',
                value: '14774'
            }, {
                name: '福安市',
                value: '58590'
            }, {
                name: '霞浦县',
                value: '39633'
            }, {
                name: '屏南县',
                value: '16589'
            }, {
                name: '蕉城区',
                value: '65056'
            }, {
                name: '古田县',
                value: '28600'
            }], "三明市": [{
                name: '泰宁县',
                value: '13989'
            }, {
                name: '建宁县',
                value: '13202'
            }, {
                name: '将乐县',
                value: '18806'
            }, {
                name: '明溪县',
                value: '10341'
            }, {
                name: '沙县',
                value: '29656'
            }, {
                /*name : '梅列区',
                value : '56395'*/
                name: '梅列区',
                value: '55356'
            }, {
                /*name : '三元区',
                value : '56395'*/
                name: '三元区',
                value: '0'
            }, {
                name: '尤溪县',
                value: '34904'
            }, {
                name: '大田县',
                value: '36263'
            }, {
                name: '永安市',
                value: '43913'
            }, {
                name: '清流县',
                value: '16248'
            }, {
                name: '宁化县',
                value: '28655'
            }], "南平市": [{
                name: '武夷山市',
                value: '24674'
            }, {
                name: '松溪县',
                value: '11612'
            }, {
                name: '光泽县',
                value: '11562'
            }, {
                name: '浦城县',
                value: '23344'
            }, {
                name: '建阳区',
                value: '31624'
            }, {
                name: '政和县',
                value: '15375'
            }, {
                name: '邵武市',
                value: '27396'
            }, {
                name: '建瓯市',
                value: '39680'
            }, {
                name: '顺昌县',
                value: '18828'
            }, {
                name: '延平区',
                value: '44679'
            }], "莆田市": [{
                name: '仙游县',
                value: '65541'
            }, {
                name: '荔城区',
                value: '98477'
            }, {
                name: '城厢区',
                value: '58613'
            }, {
                name: '涵江区',
                value: '44631'
            }, {
                name: '秀屿区',
                value: '41737'
            }]
        };
        var geoCoordMap1 = {
            '马尾区': [119.658725, 25.991975],
            '台江区': [119.210156, 26.058616],
            '仓山区': [119.320988, 26.138912],
            '晋安区': [119.428597, 26.078837],
            '晋安区': [119.328597, 26.078837],
            '连江县': [119.538365, 26.202109],
            '福清市': [119.376992, 25.720402],
            '芗城区': [117.556461, 24.659955],
            '闽侯县': [119.045117, 26.348567],
            '鼓楼区': [119.29929, 26.282284],
            '罗源县': [119.552645, 26.487234],
            '闽清县': [118.868416, 26.223793],
            '永泰县': [118.939089, 25.864825],
            '平潭县': [119.791197, 25.503672],
            '长乐市': [119.510849, 25.860583],
            '连城县': [116.756687, 25.708506],
            '新罗区': [117.030721, 25.0918],
            '长汀县': [116.361007, 25.842278],
            '上杭县': [116.424774, 25.050019],
            '武平县': [116.100928, 25.08865],
            '永定区': [116.732691, 24.720442],
            '漳平市': [117.42073, 25.291597],
            '顺昌县': [117.80771, 26.792851],
            '光泽县': [117.337897, 27.542803],
            '建阳区': [118.12267, 27.332067],
            '松溪县': [118.783491, 27.525785],
            '浦城县': [118.536822, 27.920412],
            '延平区': [118.178918, 26.636079],
            '武夷山市': [118.032796, 27.751733],
            '邵武市': [117.491544, 27.337952],
            '建瓯市': [118.321765, 27.03502],
            '政和县': [118.858661, 27.365398],
            '屏南县': [118.987544, 26.910826],
            '蕉城区': [119.527225, 26.659253],
            '寿宁县': [119.506733, 27.457798],
            '周宁县': [119.338239, 27.103106],
            '古田县': [118.743156, 26.577491],
            '霞浦县': [120.005214, 26.882068],
            '柘荣县': [119.898226, 27.236163],
            '福安市': [119.650798, 27.084246],
            '福鼎市': [120.219761, 27.318884],
            '城厢区': [118.901028, 25.333737],
            '荔城区': [119.020047, 25.430047],
            '涵江区': [119.119102, 25.459273],
            '仙游县': [118.694331, 25.356529],
            '秀屿区': [119.092607, 25.316141],
            '鲤城区': [118.688929, 24.907645],
            '丰泽区': [118.605147, 24.856041],
            '洛江区': [118.770312, 24.941153],
            '泉港区': [118.912285, 25.226859],
            '安溪县': [117.886014, 25.056824],
            '惠安县': [118.798954, 25.028718],
            '永春县': [118.19503, 25.320721],
            '德化县': [118.242986, 25.589004],
            '金门县': [118.323221, 24.436417],
            '石狮市': [118.628402, 24.631978],
            '晋江市': [118.477338, 24.807322],
            '南安市': [118.287031, 25.059494],
            '三元区': [117.518518, 26.134191],
            '清流县': [116.815821, 26.17761],
            '梅列区': [117.63687, 26.269208],
            '大田县': [117.849355, 25.690803],
            '明溪县': [117.201845, 26.357375],
            '宁化县': [116.659725, 26.259932],
            '将乐县': [117.473558, 26.728667],
            '泰宁县': [117.177522, 26.897995],
            '建宁县': [116.845832, 26.831398],
            '永安市': [117.364447, 25.974075],
            '沙县': [117.789095, 26.397361],
            '尤溪县': [118.188577, 26.169261],
            '海沧区': [118.036364, 24.492512],
            '思明区': [118.087828, 24.462059],
            '同安区': [118.150455, 24.729333],
            '翔安区': [118.242811, 24.637479],
            '集美区': [118.100869, 24.572874],
            '湖里区': [118.10943, 24.512764],
            '龙文区': [117.771387, 24.515656],
            '云霄县': [117.340946, 23.950486],
            '长泰县': [117.755913, 24.621475],
            '诏安县': [117.176083, 23.710834],
            '漳浦县': [117.614023, 24.117907],
            '南靖县': [117.365462, 24.516425],
            '东山县': [117.427679, 23.702845],
            '平和县': [117.313549, 24.366158],
            '华安县': [117.53631, 25.001416],
            '龙海市': [118.017292, 24.345341],
        };
        var max = 235487, min = 63669; // todo
        var maxSize4Pin = 100, minSize4Pin = 20;
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                            .concat(data[i].per)
                    });
                }
            }
            return res;
        };
        var convertData1 = function (data1) {
            var res = [];

            for (var i = 0; i < data1.length; i++) {
                var geoCoord = geoCoordMap1[data1[i].name];
                if (geoCoord) {
                    res.push({
                        name: data1[i].name,
                        value: geoCoord.concat(data1[i].value)

                    });
                }
            }

            return res;
        };
        var timeout;
        chart.setOption({
            geo: {
                map: '福建',
                left: '50px',
                top: '10px',
                itemStyle: {
                    normal: {
                        borderColor: '#b1cad5',
                    }
                },
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                regions: [{
                    name: '厦门市',
                    itemStyle: {
                        normal: {
                            areaColor: '#3086ba'
                        }
                    }
                },
                    {
                        name: '三明市',
                        itemStyle: {
                            normal: {
                                areaColor: '#3086ba'
                            }
                        }
                    },
                    {
                        name: '泉州市',
                        itemStyle: {
                            normal: {
                                areaColor: '#2d6c9e'
                            }
                        }
                    },
                    {
                        name: '漳州市',
                        itemStyle: {
                            normal: {
                                areaColor: '#255a91'
                            }
                        }
                    },
                    {
                        name: '福州市',
                        itemStyle: {
                            normal: {
                                areaColor: '#255a91'
                            }
                        }
                    },
                    {
                        name: '莆田市',
                        itemStyle: {
                            normal: {
                                areaColor: '#339cc4'
                            }
                        }
                    },
                    {
                        name: '南平市',
                        itemStyle: {
                            normal: {
                                areaColor: '#3086ba'
                            }
                        }
                    },
                    {
                        name: '宁德市',
                        itemStyle: {
                            normal: {
                                areaColor: '#3086ba'
                            }
                        }
                    },
                    {
                        name: '龙岩市',
                        itemStyle: {
                            normal: {
                                areaColor: '#2d6c9e'
                            }
                        }
                    }
                ]
            },
            series: [
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return 15;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#cdd2d3'
                        }
                    }
                },
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbol: 'pin',
                    data: convertData(data).slice(0, 3),
                    symbolSize: function (val) {
                        return 70;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 11,
                            },
                            formatter: function (obj) {
                                return obj['value'][2].toFixed(1);
                            }
                        }
                    },
                    hoverAnimation: true,
                    animationDuration: 3000,
                    itemStyle: {
                        normal: {
                            color: '#F62157',
                            shadowBlur: 1,
                            shadowColor: '#fff'
                        }
                    },
                    zlevel: 3
                }, {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbol: 'pin',
                    data: convertData(data).slice(3, 6),
                    symbolSize: function (val) {
                        return 60;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 11,
                            },
                            formatter: function (obj) {
                                return obj['value'][2].toFixed(1);
                            }
                        }
                    },
                    hoverAnimation: true,
                    animationDuration: 3000,
                    itemStyle: {
                        normal: {
                            color: '#F62157',
                            shadowBlur: 1,
                            shadowColor: '#fff'
                        }
                    },
                    zlevel: 3
                }, {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbol: 'pin',
                    data: convertData(data).slice(6, 9),
                    symbolSize: function (val) {
                        return 45;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 11,
                            },
                            formatter: function (obj) {
                                return obj['value'][2].toFixed(1);
                            }
                        }
                    },
                    hoverAnimation: true,
                    animationDuration: 3000,
                    itemStyle: {
                        normal: {
                            color: '#F62157',
                            shadowBlur: 1,
                            shadowColor: '#fff'
                        }
                    },
                    zlevel: 3
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 9)),
                    symbolSize: function (val) {
                        return 10;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        period: 3,
                        scale: 8
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#46d1e8',
                            shadowBlur: 0,
                            shadowColor: '#fff'

                        }
                    },
                    zlevel: 0.1
                },

            ]
        }),

            chart.on('click', function (rel) {
                setTimeout(function () {
                    $('#fuJianMap').css('display', 'none');
                    $('#fuJianQuMap').css('display', 'block');
                }, 500);
                timeout = setTimeout(function () {
                    $('#fuJianMap').css('display', 'block');
                    $('#fuJianQuMap').css('display', 'none');
                }, 10000);
                //选择市的单击事件
                var selectCity = rel.name;
                var cityData = data1[selectCity];
//			var cityRegion = regionDatas[selectCity];

                //    调取后台数据
                $.get('../json/福建/' + selectCity + '.json', function (
                    Citymap) {
                    echarts.registerMap(selectCity, Citymap);
                    var myChartCity = echarts.init(document
                        .getElementById('fuJianQuMap'));
                    myChartCity.setOption({
                        geo: {
                            map: selectCity,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#b1cad5',
                                    areaColor: '#255a91'
                                }
                            },
                        },
                        series: [
                            {
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: convertData1(cityData),
                                symbolSize: function (val) {
                                    return 15;
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    },
                                    emphasis: {
                                        show: false
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#cdd2d3'
                                    }
                                }
                            },
                            {
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                symbol: 'pin',
                                data: convertData1(cityData).slice(0, cityData.length),
                                symbolSize: function (val) {
                                    return 45;
                                },
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        textStyle: {
                                            color: '#fff',
                                            fontSize: 11,
                                        },
                                        formatter: function (obj) {
                                            return ((obj['value'][2] / 10000).toFixed(1));
                                        }
                                    }
                                },
                                hoverAnimation: true,
                                animationDuration: 4000,
                                itemStyle: {
                                    normal: {
                                        color: '#F62157',
                                        shadowBlur: 1,
                                        shadowColor: '#fff'
                                    }
                                },
                                zlevel: 3
                            }
                        ]
                    })
                    myChartCity.on('click', function (rel) {
                        setTimeout(function () {
                            $('#fuJianMap').css('display', 'block');
                            $('#fuJianQuMap').css('display', 'none');
                        }, 500);
                        clearTimeout(timeout);
                    })
                });
            })
    });
}

/**
 * 福建条形图
 * @param jsonData
 * @returns
 */
function GetFuJianBarGraphList() {
    $.ajax({
        url: "getFuJianBarGraph",
        data: {},
        dataType: "json",
        type: "POST",
        error: function (data) {
            console.log("查询异常，请刷新后重试..." + data);
        },
        success: function (data) {

            var jsonData = [];
            for (var i = 0; i < data.length; i++) {
                var obj = {
                    value: data[i].registeredusernum,
                    name: data[i].city
                }
                jsonData.push(obj);
            }
            fuJianBarGraph(jsonData);
        }
    });
}

var testEchartFJB;

function fuJianBarGraph(jsonData) {
    testEchartFJB = echarts.init(document.getElementById('fujianbargroph'));
    var city = [];
    var cityNum = [];
    for (i = 0; i < jsonData.length; i++) {
        city.push(jsonData[i].name);
        var n = (jsonData[i].value / 10).toFixed(1);
        cityNum.push(n);
    }
    ;
    option = {
        title: {
            text: '活跃占比（%）',
            x: 'left',
            textStyle: {
                color: '#fdca31',
                fontSize: 18,
            },
        },
        textStyle: {
            color: "#198cde",          // 主标题文字颜色
        },
        color: ['#198cde'],
        grid: {
            left: '35',
            right: '18',
        },
        xAxis: {
            type: 'value',
            show: false,


        },
        yAxis: {
            type: 'category',
            data: city,

        },
        series: [
            {
                type: 'bar',
                data: cityNum,

                itemStyle: {
                    normal: {
                        barBorderRadius: [10]
                    },
                },
                barWidth: 13,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 11,
                            color: '#ccd9e2'
                        },
                        show: true,
                        position: 'right',

                    }
                },
            }
        ]
    };


    testEchartFJB.setOption(option);
}


function init_user_liveness_chart() {
    // 基于准备好的dom，初始化echarts实例
    var userLivenessChart = echarts.init(document.getElementById('divMap'));
}

$(function () {
    init_user_liveness_chart();
    setInterval(init_user_liveness_chart, 1000 * 60 * 90);
});








