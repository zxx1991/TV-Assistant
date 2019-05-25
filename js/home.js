(function () {
    'use strict';

    $(document).ready(function () {


        //显示当前时间
        function getDate() {
            var today = new Date();
            var date = today.getFullYear() + "-" + twoDigits(today.getMonth() + 1) + "-" + twoDigits(today.getDate()) + " ";
            var time = twoDigits(today.getHours()) + ": " + twoDigits(today.getMinutes()) + ": " + twoDigits(today.getSeconds());
            $(".show_time").html(date +" "+time);
        }
        function twoDigits(val) {
            if (val < 10) return "0" + val; return val;
        }
//宽带日均新增用户
        function dayAddUser(){
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"netProgrames",
                data: {province:"福建",city:"福州"},
                success: function (res){
                   if(res.response_code == 100){
                       $("#averNetUser").html(res.data.averNetUser);
                       $("#smartNetUser").html(res.data.smartNetUser);
                       $("#homeNetUser").html(res.data.homeNetUser);
                   }
                }
            })
        };
// 地市用户ARPU
        function cityUserARPU() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"cityDistribution",
                data: {
                    province:"福建",
                    city:"福州"
                },
                success: function (res){
                    if(res.response_code == 100){
                        var city_ARPU_List = res.data;
                        var city_ARPU_List_label = [];
                        var city_ARPU_List_data = [];
                        var city_ARPU_List_data2 = [];
                        for(let i = 0;i< city_ARPU_List.length;i++){
                            city_ARPU_List_label.push(city_ARPU_List[i].city);
                            city_ARPU_List_data.push(city_ARPU_List[i].cityarpu);//地市用户ARPU
                            city_ARPU_List_data2.push(city_ARPU_List[i].cityincoming);//地市收入
                        }
                        var city_ARPU_data = {
                            label:city_ARPU_List_label,
                            value:city_ARPU_List_data
                        }
                        city_ARPU(city_ARPU_data);//地市用户ARPU

                        var mapValueChart = {
                            label:city_ARPU_List_label,
                            value:city_ARPU_List_data2
                        }
                        map_chart_data(mapValueChart);//地市收入

                    }
                }
            })
        };
//用户ARPU
        function userARPU() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"userArpu",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    var user_ARPU_list = res.data;
                    var time = [];
                    var dataArrive = [];
                    var dataPay = [];
                    for(let i = 0;i<user_ARPU_list.length;i++){
                        time.push(new Date(user_ARPU_list[i].time).getMonth()+1+'月');
                        dataArrive.push(user_ARPU_list[i].arrivinguser);
                        dataPay.push(user_ARPU_list[i].paymentuser)
                    }
                    user_ARPU_chart(time,dataArrive,dataPay);
                }
            })
        };
// 魔百盒用户周到达
        function userArriving() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"userArriving",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    var time = [];
                    var data_week = [];
                    var data_week2 = [];
                    for(var i = 0;i< res.data.length;i++){
                        time.push(new Date(res.data[i].time).getMonth()+1+'月');
                        data_week.push(res.data[i].mobilearrveweek);
                        data_week2.push(res.data[i].mobileaccuweek);
                    }
                    var mobile_user_week_data = {
                        label:time,
                        value:data_week
                    };
                    mobile_user_week(mobile_user_week_data);//魔百盒用户周到达
                    var add_user_box_data = {
                        label:time,
                        value:data_week2
                    };
                    add_user_box(add_user_box_data);//增值用户周到达
                }
            })
        };
//魔百盒到达用户(万)
        function mobileBoxUser() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"mobileBoxUser",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        $("#mobileArriveUser").html(res.data.mobileArriveUser);
                        $("#mobileMonthIncreUser").html(res.data.mobileMonthIncreUser);
                        $("#valueArriveUser").html(res.data.valueArriveUser);
                        $("#monthPaymentUser").html(res.data.monthPaymentUser);
                    }
                }
            })
        };
//用户付费结构
        function userPaymentDistribution() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"userPaymentDistribution",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        var user_pay_data = [
                            {value:res.data.monthpay, name:'包月'},
                            {value:res.data.singlepay, name:'单点'},
                            {value:res.data.yearpay, name:'包年'},
                        ];
                        user_pay(user_pay_data);
                    }
                }
            })
        };
//分版块收入结构
        function platePaymentDitriution() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"platePaymentDitriution",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        var plate_pay_data = [
                            {value:res.data.movie, name:'电影'},
                            {value:res.data.series, name:'电视剧'},
                            {value:res.data.childs, name:'少儿'},
                            {value:res.data.variety, name:'综艺'},
                            {value:res.data.entertainment, name:'娱乐'},
                            {value:res.data.sports, name:'体育'},
                            {value:res.data.education, name:'教育'},
                            {value:res.data.life, name:'生活'},
                            {value:res.data.record, name:'纪实'}

                        ];
                        plate_pay(plate_pay_data);
                    }
                }
            })
        };
//电视淘宝电商增长情况
        function growthEc() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"growthEc",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        $("#pv").html(res.data.pv);
                        $("#payNum").html(res.data.payNum);
                        $("#payCash").html(res.data.payCash);
                    }
                }
            })
        };
        //地图-省
        function mapArriveUser() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"mapArriveUser",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        var map_data_A = [];
                        res.data.forEach(function (item, index, arr) {
                            var thisItem = {};
                            thisItem.name = item.city+'市';
                            thisItem.value = item.arriveruser;
                            thisItem.per = item.id;
                            this.push(thisItem);
                        }, map_data_A);
                        fujianMap(map_data_A);

                    }
                }
            })
        };
        //地图-市
        function mapCountUser(city) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl+"mapCountUser",
                data: {province:"福建",city:city.slice(0,city.length-1)},
                success: function (res){
                    if(res.response_code == 100){
                        map_data_B = {};
                        map_data_B[city] = [];
                        res.data.forEach(function (item, index, arr) {
                            var thisItem = [];
                            thisItem.name = item.county;
                            thisItem.value = item.countyuser;
                            this.push(thisItem);
                        }, map_data_B[city]);

                        fujian_city_Map(city,map_data_B[city]);

                    }
                }
            })
        };


        function allRequest() {
            mapArriveUser();
            dayAddUser();
            cityUserARPU();
            userARPU();
            userArriving();
            mobileBoxUser();
            userPaymentDistribution();
            platePaymentDitriution();
            growthEc();
        };
        allRequest();

        setInterval(function () {
            allRequest();
        },30000);



        var city_ARPU_height = $('#city_ARPU_chart').parent().height();
        $('#city_ARPU_chart').css({
            height:city_ARPU_height*0.8+'px',
            marginTop:city_ARPU_height*0.1+'px',
        });
        $('#user_ARPU_chart').css({
            height:city_ARPU_height*0.8+'px',
            marginTop:city_ARPU_height*0.1+'px',
        });

        var mobile_user_height = $('#mobile_user_week').parent().height();
        $('#mobile_user_week').css({
            height:mobile_user_height*0.8+'px',
            marginTop:mobile_user_height*0.1+'px',
        });
        $('#add_user_box').css({
            height:mobile_user_height*0.8+'px',
            marginTop:mobile_user_height*0.1+'px',
        });

        var user_pay_height = $('#user_pay_chart').parent().height();
        $('#user_pay_chart').css({
            height:user_pay_height*0.8+'px',
            marginTop:user_pay_height*0.1+'px',
        });
        $('#plate_pay_chart').css({
            height:user_pay_height*0.8+'px',
            marginTop:user_pay_height*0.1+'px',
        });




        /*---------------main_left-----------------------------------------------*/
        /*  city_ARPU  */
        function city_ARPU(data) {
            let city_ARPU_dom = document.getElementById("city_ARPU_chart");
            let myChart = echarts.init(city_ARPU_dom);
            let option = {
                textStyle:{
                    color:'#fff'
                },
                grid: {
                    containLabel: false,
                    left:50,
                    top:0,
                    bottom:0,
                },
                xAxis : [
                    {
                        show: false,
                        type : 'value'
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        axisTick : {show: false},
                        axisLine : {show: false},
                        data : data.label,
                        axisLabel:{
                            fontSize:14,
                            interval:0,
                        },
                    }
                ],
                series : [
                    {
                        type:'bar',
                        barMaxWidth:8,
                        itemStyle:{
                            color:'#37CBFB',
                        },
                        label: {
                            show: true,
                            position:'right',
                            color:'#fff',
                            fontSize:10
                        },
                        data:data.value,
                    }
                ]
            };
            myChart.setOption(option, true);
        }

        /*  user_ARPU  */
        function user_ARPU_chart(time,dataArrive,dataPay) {
            let dom = document.getElementById("user_ARPU_chart");
            let myChart = echarts.init(dom);
            let option = {
                title: {
                    left:10,
                    text: '单位：万人',
                    textStyle:{
                        color:'#6691BC',
                        fontSize:10
                    }
                },
                textStyle:{
                    color:'#6691BC'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
                legend: {
                    orient:'vertical',
                    icon: 'rect',
                    itemWidth: 15,
                    itemHeight: 4,
                    itemGap: 2,
                    data: ['到达用户', '付费用户'],
                    right: 0,
                    textStyle: {
                        fontSize: 10,
                        color: '#6691BC'
                    }
                },
                grid: {
                    top: 40,
                    left: 10,
                    right: 15,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#57617B',
                        }
                    },
                    data: time
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show:false,
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                }],
                series: [
                    {
                    name: '到达用户',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: 'rgba(77,0,217,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(31,240,149,1)'
                            }])
                        },
                        emphasis: {
                            color: 'rgb(0,196,132)',
                            borderColor: 'rgba(0,196,132,0.2)',
                            extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                            borderWidth: 10
                        }
                    },
                    data: dataArrive
                }, {
                    name: '付费用户',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: 'rgba(0,224,238,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(0,103,198,1)'
                            }])
                        },
                        emphasis: {
                            color: 'rgb(99,250,235)',
                            borderColor: 'rgba(99,250,235,0.2)',
                            extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                            borderWidth: 10
                        }
                    },
                    data: dataPay
                }]
            };
            myChart.setOption(option, true);
        }


        /*---------------main_right-----------------------------------------------*/

        /*  user_pay */
        function user_pay(data) {
            let dom = document.getElementById("user_pay_chart");
            let myChart = echarts.init(dom);
            let option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: 'center',
                    left:'80%',
                    itemWidth:13,
                    itemHeight:13,
                    textStyle: {color: '#6691BC',fontSize:'12px'},
                    data: ['包月','单点','包年']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '70%',
                        center: ['45%', '50%'],
                        label:{            //饼图图形上的文本标签
                            normal:{
                                show:true,
                                position:'inner', //标签的位置
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 12    //文字的字体大小
                                },
                                formatter:'{d}%'
                            }
                        },
                        data:data,
                        itemStyle: {
                            normal:{
                                color:function(params) {
                                    //自定义颜色
                                    var colorList = [
                                        '#2274DA','#01D9F3','#3FEDCE'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };

            myChart.setOption(option, true);
        }

        /*  plate_pay */
        function plate_pay(data) {
            let dom = document.getElementById("plate_pay_chart");
            let myChart = echarts.init(dom);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                grid: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: false
                },
                legend: {
                    show:false
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '55%'],
                        label: {
                            normal: {
                                formatter: '{b|{b}}\n{hr|} \n {per|{d}%}  ',
                                rich: {
                                    hr: {
                                        borderColor: '#aaa',
                                        width: '100%',
                                        borderWidth: 0.3,
                                        height: 0,
                                    },
                                    b: {
                                        fontSize: 12,
                                        color:'#14D2F3',
                                        lineHeight:15
                                    },
                                    per: {
                                        color: '#eee',
                                        fontSize:12,
                                    }
                                }
                            }
                        },
                        data:data,
                        itemStyle: {
                            normal:{
                                color:function(params) {
                                    //自定义颜色
                                    var colorList = [
                                        '#55B6A5','#B8D2C3','#6AD8F8','#079AEE','#6AD8F8','#68769E','#95B6DE','#68769E'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option, true);
        }



        /*-----------------main_chart-----------------------------------------*/

        /*  mobile_user_week  */
        function mobile_user_week(data) {
            let dom = document.getElementById("mobile_user_week");
            let myChart = echarts.init(dom);
            let option = {
                title: {
                    text: '单位：万人',
                    left:10,
                    textStyle:{
                        color:'#6691BC',
                        fontSize:10
                    }
                },
                textStyle:{
                    color:'#6691BC'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
                grid: {
                    top: 40,
                    left: 10,
                    right: 10,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    },
                    data: data.label
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show:false,
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                }],
                series: [
                    {
                        name: '到达用户',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: 'rgba(0,224,238,1)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(0,103,198,1)'
                                }])
                            },
                            emphasis: {
                                color: 'rgb(99,250,235)',
                                borderColor: 'rgba(99,250,235,0.2)',
                                extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                                borderWidth: 10
                            }
                        },
                        data: data.value
                    }]
            };
            myChart.setOption(option, true);
        }


        /*  add_user_box  */
        function add_user_box(data) {
            let dom = document.getElementById("add_user_box");
            let myChart = echarts.init(dom);
            let option = {
                title: {
                    text: '单位：万人',
                    left:10,
                    textStyle:{
                        color:'#6691BC',
                        fontSize:10
                    }
                },
                textStyle:{
                    color:'#6691BC'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
                grid: {
                    top: 40,
                    left: 10,
                    right: 10,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    },
                    data: data.label
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show:false,
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                }],
                series: [
                    {
                        name: '到达用户',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: 'rgba(77,0,217,1)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(31,240,149,1)'
                                }])
                            },
                            emphasis: {
                                color: 'rgb(0,196,132)',
                                borderColor: 'rgba(0,196,132,0.2)',
                                extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                                borderWidth: 10
                            }
                        },
                        data: data.value
                    }]
            };
            myChart.setOption(option, true);
        }





        /*---------------main_map-----------------------------------------------*/
        /*  地图  */
        var setMapTimeout;
/*
        var map_data_A = [
            {
                name : '福州市',
                value : 55.3061 ,
                per : 51
            }, {
                name : '泉州市',
                value : 66.4565,
                per : 53
            }, {
                name : '厦门市',
                value : 49.5638,
                per : 52
            }, {
                name : '漳州市',
                value : 44.0240,
                per : 66
            }, {
                name : '龙岩市',
                value : 33.2828,
                per : 65.0
            }, {
                name : '宁德市',
                value : 30.8001,
                per : 60
            }, {
                name : '三明市',
                value : 30.1333,
                per : 99
            }, {
                name : '莆田市',
                value : 25.0386,
                per : 52
            } ,{
                name : '南平市',
                value : 24.8774,
                per : 62
            }
        ];
*/
        var geoCoordMap = {
            '福州市' : [ 119.3, 26.08 ],
            '厦门市' : [ 118.1, 24.46 ],
            '莆田市' : [ 119.00, 25.44 ],
            '三明市' : [ 117.61, 26.23 ],
            '泉州市' : [ 118.20, 25.10 ],
            '漳州市' : [ 117.35, 24.20 ],
            '南平市' : [ 118.20, 27.15 ],
            '龙岩市' : [ 117.01, 25.12 ],
            '宁德市' : [ 119.52, 26.99 ],
        };
/*
        var map_data_B = {
            "福州市":[{
                name : '福清市',
                value : '75862'
            },{
                name : '长乐市',
                value : '39447'
            }, {
                name : '鼓楼区',
                value : '52487'
            }, {
                name : '台江区',
                value : '34254'
            }, {
                name : '仓山区',
                value : '65950'
            }, {
                name : '马尾区',
                value : '16024'
            }, {
                name : '晋安区',
                value : '66851'
            }, {
                name : '闽侯县',
                value : '72041'
            }, {
                name : '连江县',
                value : '41205'
            }, {
                name : '罗源县',
                value : '19649'
            }, {
                name : '闽清县',
                value : '19324'
            }, {
                name : '永泰县',
                value : '20091'
            }, {
                name : '平潭县',
                value : '29876'
            }], "漳州市":[ {
                name : '芗城区',
                value : '60580'
            },{
                name : '龙文区',
                value : '32824'
            }, {
                name : '龙海市',
                value : '70100'
            }, {
                name : '云霄县',
                value : '40853'
            }, {
                name : '漳浦县',
                value : '54597'
            }, {
                name : '诏安县',
                value : '42042'
            }, {
                name : '长泰县',
                value : '22798'
            }, {
                name : '东山县',
                value : '31985'
            }, {
                name : '南靖县',
                value : '27766'
            }, {
                name : '平和县',
                value : '43899'
            }, {
                name : '华安县',
                value : '12796'
            }],"泉州市":[{
                name : '惠安县',
                value : '76745'
            } , {
                name : '南安市',
                value : '101460'
            } , {
                name : '安溪县',
                value : '68377'
            }, {
                name : '永春县',
                value : '30023'
            }, {
                name : '德化县',
                value : '26302'
            }, {
                /!*name : '金门县',
                value : '15000'*!/
                name : '金门县',
                value : '0'
            }, {
                name : '鲤城区',
                value : '39859'
            }, {
                name : '丰泽区',
                value : '55179'
            } , {
                name : '洛江区',
                value : '12705'
            },{
                name : '泉港区',
                value : '35374'
            } , {
                name : '晋江市',
                value : '153092'
            } , {
                name : '石狮市',
                value : '65449'
            } ],"龙岩市":[{
                name : '长汀县',
                value : '45608'
            } , {
                name : '连城县',
                value : '32389'
            } , {
                name : '漳平市',
                value : '34734'
            } , {
                /!*name : '新罗区',
                value : '102542'*!/
                name : '新罗区',
                value : '97697'
            } , {
                name : '武平县',
                value : '33190'
            } , {
                name : '上杭县',
                value : '44880'
            } , {
                name : '永定区',
                value : '44330'
            } ],"厦门市":[{
                name : '同安区',
                value : '75327'
            } , {
                name : '翔安区',
                value : '62148'
            }, {
                name : '集美区',
                value : '91242'
            }, {
                name : '湖里区',
                value : '111995'
            }, {
                name : '海沧区',
                value : '52021'
            }, {
                name : '思明区',
                value : '102905'
            }],"宁德市":[{
                name : '寿宁县',
                value : '14164'
            }, {
                name : '福鼎市',
                value : '59947'
            }, {
                name : '柘荣县',
                value : '10648'
            }, {
                name : '周宁县',
                value : '14774'
            }, {
                name : '福安市',
                value : '58590'
            }, {
                name : '霞浦县',
                value : '39633'
            }, {
                name : '屏南县',
                value : '16589'
            }, {
                name : '蕉城区',
                value : '65056'
            }, {
                name : '古田县',
                value : '28600'
            }],"三明市":[ {
                name : '泰宁县',
                value : '13989'
            }, {
                name : '建宁县',
                value : '13202'
            } , {
                name : '将乐县',
                value : '18806'
            } , {
                name : '明溪县',
                value : '10341'
            } , {
                name : '沙县',
                value : '29656'
            } , {
                /!*name : '梅列区',
                value : '56395'*!/
                name : '梅列区',
                value : '55356'
            } , {
                /!*name : '三元区',
                value : '56395'*!/
                name : '三元区',
                value : '0'
            } , {
                name : '尤溪县',
                value : '34904'
            } , {
                name : '大田县',
                value : '36263'
            },{
                name : '永安市',
                value : '43913'
            } , {
                name : '清流县',
                value : '16248'
            } , {
                name : '宁化县',
                value : '28655'
            }  ],"南平市":[{
                name : '武夷山市',
                value : '24674'
            } , {
                name : '松溪县',
                value : '11612'
            } , {
                name : '光泽县',
                value : '11562'
            } , {
                name : '浦城县',
                value : '23344'
            }, {
                name : '建阳区',
                value : '31624'
            } , {
                name : '政和县',
                value : '15375'
            } , {
                name : '邵武市',
                value : '27396'
            } , {
                name : '建瓯市',
                value : '39680'
            } , {
                name : '顺昌县',
                value : '18828'
            } , {
                name : '延平区',
                value : '44679'
            } ],"莆田市":[{
                name : '仙游县',
                value : '65541'
            } , {
                name : '荔城区',
                value : '98477'
            } , {
                name : '城厢区',
                value : '58613'
            } , {
                name : '涵江区',
                value : '44631'
            } , {
                name : '秀屿区',
                value : '41737'
            } ]
        };
*/
        var map_data_B = {};
        var geoCoordMap1 = {
            '马尾区' :  [119.658725,25.991975],
            '台江区' :  [119.210156,26.058616],
            '仓山区' :  [119.320988,26.138912],
            '晋安区' :  [119.328597,26.078837],
            '连江县' :  [119.538365,26.202109],
            '福清市' :  [119.376992,25.720402],
            '芗城区' :  [117.556461,24.659955],
            '闽侯县' :  [119.045117,26.348567],
            '鼓楼区' :  [119.29929,26.282284],
            '罗源县' :  [119.552645,26.487234],
            '闽清县' :  [118.868416,26.223793],
            '永泰县' :  [118.939089,25.864825],
            '平潭县' :  [119.791197,25.503672],
            '长乐市' :  [119.510849,25.860583],
            '连城县' :  [116.756687,25.708506],
            '新罗区' :  [117.030721,25.0918],
            '长汀县' :  [116.361007,25.842278],
            '上杭县' :  [116.424774,25.050019],
            '武平县' :  [116.100928,25.08865],
            '永定区' :  [116.732691,24.720442],
            '漳平市' :  [117.42073,25.291597],
            '顺昌县' :  [117.80771,26.792851],
            '光泽县' :  [117.337897,27.542803],
            '建阳区' :  [118.12267,27.332067],
            '松溪县' :  [118.783491,27.525785],
            '浦城县' :  [118.536822,27.920412],
            '延平区' :  [118.178918,26.636079],
            '武夷山市' :  [118.032796,27.751733],
            '邵武市' :  [117.491544,27.337952],
            '建瓯市' :  [118.321765,27.03502],
            '政和县' :  [118.858661,27.365398],
            '屏南县' :  [118.987544,26.910826],
            '蕉城区' :  [119.527225,26.659253],
            '寿宁县' :  [119.506733,27.457798],
            '周宁县' :  [119.338239,27.103106],
            '古田县' :  [118.743156,26.577491],
            '霞浦县' :  [120.005214,26.882068],
            '柘荣县' :  [119.898226,27.236163],
            '福安市' :  [119.650798,27.084246],
            '福鼎市' :  [120.219761,27.318884],
            '城厢区' :  [118.901028,25.333737],
            '荔城区' :  [119.020047,25.430047],
            '涵江区' :  [119.119102,25.459273],
            '仙游县' :  [118.694331,25.356529],
            '秀屿区' :  [119.092607,25.316141],
            '鲤城区' :  [118.688929,24.907645],
            '丰泽区' :  [118.605147,24.856041],
            '洛江区' :  [118.770312,24.941153],
            '泉港区' :  [118.912285,25.226859],
            '安溪县' :  [117.886014,25.056824],
            '惠安县' :  [118.798954,25.028718],
            '永春县' :  [118.19503,25.320721],
            '德化县' :  [118.242986,25.589004],
            '金门县' :  [118.323221,24.436417],
            '石狮市' :  [118.628402,24.631978],
            '晋江市' :  [118.477338,24.807322],
            '南安市' :  [118.287031,25.059494],
            '三元区' :  [117.518518,26.134191],
            '清流县' :  [116.815821,26.17761],
            '梅列区' :  [117.63687,26.269208],
            '大田县' :  [117.849355,25.690803],
            '明溪县' :  [117.201845,26.357375],
            '宁化县' :  [116.659725,26.259932],
            '将乐县' :  [117.473558,26.728667],
            '泰宁县' :  [117.177522,26.897995],
            '建宁县' :  [116.845832,26.831398],
            '永安市' :  [117.364447,25.974075],
            '沙县' :  [117.789095,26.397361],
            '尤溪县' :  [118.188577,26.169261],
            '海沧区' :  [118.036364,24.492512],
            '思明区' :  [118.087828,24.462059],
            '同安区' :  [118.150455,24.729333],
            '翔安区' :  [118.242811,24.637479],
            '集美区' :  [118.100869,24.572874],
            '湖里区' :  [118.10943,24.512764],
            '龙文区' :  [117.771387,24.515656],
            '云霄县' :  [117.340946,23.950486],
            '长泰县' :  [117.755913,24.621475],
            '诏安县' :  [117.176083,23.710834],
            '漳浦县' :  [117.614023,24.117907],
            '南靖县' :  [117.365462,24.516425],
            '东山县' :  [117.427679,23.702845],
            '平和县' :  [117.313549,24.366158],
            '华安县' :  [117.53631,25.001416],
            '龙海市' :  [118.017292,24.345341],
        };

        var convertData = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name : data[i].name,
                        value : geoCoord.concat(data[i].value).concat(data[i].per)
                    });
                }
            }
            return res;
        };
        var convertData1 = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap1[data[i].name];
                if (geoCoord) {
                    res.push({
                        name : data[i].name,
                        value : geoCoord.concat(data[i].value)

                    });
                }
            }
            return res;
        };

        function fujian_city_Map(selectCity,cityData) {
            // var cityData = map_data_B[selectCity];
            $.get('./public/map/' + selectCity + '.json', function(Citymap) {
                echarts.registerMap(selectCity, Citymap);
                var myChartCity = echarts.init(document.getElementById('fujian_city_map'));
                myChartCity.setOption({
                    geo : {
                        map : selectCity,
                        left : 50,
                        top : 20,
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
                    series : [
                        {
                            type : 'scatter',
                            coordinateSystem : 'geo',
                            data : convertData1(cityData),
                            symbolSize : function(val) {
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
                            type : 'scatter',
                            coordinateSystem : 'geo',
                            symbol : 'pin',
                            data : convertData1(cityData).slice(0, cityData.length),
                            symbolSize : function(val) {
                                return 45;
                            },
                            rippleEffect : {
                                brushType : 'stroke'
                            },
                            label : {
                                normal : {
                                    show : true,
                                    textStyle : {
                                        color : '#fff',
                                        fontSize : 11,
                                    },
                                    formatter : function(obj) {
                                        return (obj['value'][2].toFixed(1));
                                    }
                                }
                            },
                            hoverAnimation : true,
                            animationDuration: 4000,
                            itemStyle : {
                                normal : {
                                    color : '#F62157',
                                    shadowBlur : 1,
                                    shadowColor : '#fff'
                                }
                            },
                            zlevel : 3
                        }
                    ]
                })
                myChartCity.on('click', function(rel) {
                    $("#fujian_city_map").empty().removeAttr("_echarts_instance_");
                    clearTimeout(setMapTimeout);
                    $('#fujian_map').css('display', 'block');
                    $('#fujian_city_map').css('display', 'none');
                })
            });
        };

        function fujianMap(map_data_A) {
            var fujian_map_data = "./public/map/福建.json";
            $.get(fujian_map_data, function(mapJson) {
                echarts.registerMap('福建', mapJson);
                var chart = echarts.init(document.getElementById('fujian_map'));

                chart.setOption({
                    geo : {
                        map : '福建',
                        left : 20,
                        top : 20,
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
                        regions: [
                            {
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
                    series : [
                        {
                        type : 'scatter',
                        coordinateSystem : 'geo',
                        data : convertData(map_data_A),
                        symbolSize : function(val) {
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
                            type : 'scatter',
                            coordinateSystem : 'geo',
                            symbol : 'pin',
                            data : convertData(map_data_A).slice(0, 3),
                            symbolSize : function(val) {
                                return 70;
                            },
                            showEffectOn : 'render',
                            rippleEffect : {
                                brushType : 'stroke'
                            },
                            label : {
                                normal : {
                                    show : true,
                                    textStyle : {
                                        color : '#fff',
                                        fontSize : 11,
                                    },
                                    formatter : function(obj) {
                                        return obj['value'][2].toFixed(1);
                                    }
                                }
                            },
                            hoverAnimation : true,
                            animationDuration: 3000,
                            itemStyle : {
                                normal : {
                                    color : '#F62157',
                                    shadowBlur : 1,
                                    shadowColor : '#fff'
                                }
                            },
                            zlevel : 3
                        }, {
                            type : 'scatter',
                            coordinateSystem : 'geo',
                            symbol : 'pin',
                            data : convertData(map_data_A).slice(3, 6),
                            symbolSize : function(val) {
                                return 60;
                            },
                            showEffectOn : 'render',
                            rippleEffect : {
                                brushType : 'stroke'
                            },
                            label : {
                                normal : {
                                    show : true,
                                    textStyle : {
                                        color : '#fff',
                                        fontSize : 11,
                                    },
                                    formatter : function(obj) {
                                        return obj['value'][2].toFixed(1) ;
                                    }
                                }
                            },
                            hoverAnimation : true,
                            animationDuration: 3000,
                            itemStyle : {
                                normal : {
                                    color : '#F62157',
                                    shadowBlur : 1,
                                    shadowColor : '#fff'
                                }
                            },
                            zlevel : 3
                        }, {
                            type : 'scatter',
                            coordinateSystem : 'geo',
                            symbol : 'pin',
                            data : convertData(map_data_A).slice(6, 9),
                            symbolSize : function(val) {
                                return 45;
                            },
                            showEffectOn : 'render',
                            rippleEffect : {
                                brushType : 'stroke'
                            },
                            label : {
                                normal : {
                                    show : true,
                                    textStyle : {
                                        color : '#fff',
                                        fontSize : 11,
                                    },
                                    formatter : function(obj) {
                                        return obj['value'][2].toFixed(1) ;
                                    }
                                }
                            },
                            hoverAnimation : true,
                            animationDuration: 3000,
                            itemStyle : {
                                normal : {
                                    color : '#F62157',
                                    shadowBlur : 1,
                                    shadowColor : '#fff'
                                }
                            },
                            zlevel : 3
                        },
                        {
                            type : 'effectScatter',
                            coordinateSystem : 'geo',
                            data : convertData(map_data_A.sort(function(a, b) {
                                return b.value - a.value;
                            }).slice(0, 9)),
                            symbolSize : function(val) {
                                return 10;
                            },
                            showEffectOn : 'render',
                            rippleEffect : {
                                brushType : 'stroke',
                                period:3,
                                scale:8
                            },
                            hoverAnimation : true,
                            itemStyle : {
                                normal : {
                                    color : '#46d1e8',
                                    shadowBlur : 0,
                                    shadowColor : '#fff'

                                }
                            },
                            zlevel : 0.1
                        },
                    ]
                });
                chart.on('click', function(rel) {

                    $('#fujian_map').css('display', 'none');
                    $('#fujian_city_map').css('display', 'block');

                    mapCountUser(rel.name);

                    setMapTimeout = setTimeout(function () {
                        $("#fujian_city_map").empty().removeAttr("_echarts_instance_");
                        $('#fujian_map').css('display', 'block');
                        $('#fujian_city_map').css('display', 'none');
                    }, 5000);
                })

            });
        };


        /*  map_chart_data  */
        function map_chart_data(data) {
            let dom = document.getElementById("map_chart_data");
            let myChart = echarts.init(dom);
            let option = {
                title: {
                    text: '地市收入分布（万元）',
                    textStyle:{
                        color:'#FDCA31',
                        fontSize:16,
                    },
                    top:0,
                    left:0
                },
                textStyle:{
                    color:'#fff'
                },
                grid: {
                    containLabel: true,
                    left:0,
                    right:20,
                    top:30,
                    bottom:0,
                },
                xAxis : [
                    {
                        show: false,
                        type : 'value'
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        axisTick : {show: false},
                        axisLine : {show: false},
                        data : data.label,
                        axisLabel:{
                            fontSize:14,
                            interval:0,
                        },
                    }
                ],
                series : [
                    {
                        type:'bar',
                        barMaxWidth:9,
                        itemStyle:{
                            color:'#547CD3',
                        },
                        label: {
                            show: true,
                            position:'right',
                            color:'#fff',
                            fontSize:10
                        },
                        data:data.value,
                    }
                ]
            };

            myChart.setOption(option, true);
        }


    })
})();



