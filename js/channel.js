(function () {
    'use strict';

    $(document).ready(function (){

        function color_rgb(){
            var r=Math.floor(Math.random()*256);
            var g=Math.floor(Math.random()*256);
            var b=Math.floor(Math.random()*256);
            return "rgb("+r+','+g+','+b+")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
        }

        let videotypeArr = ['直播','点播','回看'];


        function table_list_html(data,id) {
            data.forEach(function(item, index, arr){
                let tableList = '';

                let num = index+1;

                let indexClass='';
                if(num<=3){
                    indexClass = 'circle';
                }else{
                    indexClass = 'normal';
                };

                let up_down_icon='';
                if(item.comparerate>0){
                    up_down_icon = 'up_row';
                }else if(item.comparerate<0){
                    up_down_icon = 'down_row';
                };

                let comparerate = (item.comparerate*100)+'%';

                tableList = '\n' +
                    '                                <li>\n' +
                    '                                    <a class="tableTD_a"><span class="'+ indexClass +'">'+ num+'</span></a>\n' +
                    '                                    <a class="tableTD_b">'+item.videoname+'</a>\n' +
                    '                                    <a class="tableTD_c">'+item.watchnum+'</a>\n' +
                    '                                    <a class="tableTD_d"><span>'+comparerate+'</span> <img class="row_btn" src="./images/'+up_down_icon+'.png"></a>\n' +
                    '                                </li>';

                $(id).append(tableList);

            });
        }


        // 收视类型分析
        function channelType() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"channelType",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        let viewing_type_data = [];
                        res.data.forEach(function(item, index, arr){
                            this.push({
                                value:item.typenum,
                                name:videotypeArr[item.videotype-1]
                            });
                        }, viewing_type_data);
                        viewing_type(viewing_type_data);
                    }
                }
            })
        };
        // 收视频道分布,   直播频道分布
        function ratingChannel() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"ratingChannel",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){

                        let rate_channel_data = [];
                        var lookback_channel_data = [];

                        res.data.forEach(function(item, index, arr){
                            if(item.videotype==1){
                                rate_channel_data.push({
                                    value:item.watchnum,
                                    name:item.channel
                                });
                            }else if(item.videotype==3){
                                lookback_channel_data.push({
                                    value:item.watchnum,
                                    name:item.channel
                                });
                            }
                        });
                        //直播频道分布
                        rate_channel(rate_channel_data);
                        //回看频道分布
                        lookback_channel(lookback_channel_data);

                    }
                }
            })
        };
        //点播分屏点击关注度
        function demandItems() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"demandItems",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){

                        let demand_focus_data = {
                            value:[],
                            value99:[],
                            value100:[],
                            name:[]
                        };
                        res.data.forEach(function(item, index, arr){
                            this.value.push(item.demandclicknum);
                            this.value99.push(99.9);
                            this.value100.push(100);
                            this.name.push(item.demandclicktype);
                        },demand_focus_data);
                        demand_focus(demand_focus_data);

                    }
                }
            })
        };
        //Epg访问占比
        function epgRatio() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"epgRatio",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){

                        let EPG_access_data = [];
                        res.data.forEach(function(item, index, arr){
                            this.push({
                                value:item.epgnum,
                                name:item.epginfo,
                            });
                        },EPG_access_data);
                        EPG_access(EPG_access_data);


                    }
                }
            })
        };
        //热门epg访问情况
        function hotEpgRatio() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"hotEpgRatio",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        $('#EPG_statu_cheart').empty();

                        res.data.forEach(function(items, indexs, arrs){
                            // EPG_statu_cheart
                            let cheartID = 'EPG_hot_'+indexs;
                            let cheartHtml = '<div class="EPG_statu" id="'+cheartID+'"></div>';

                            $('#EPG_statu_cheart').append(cheartHtml);

                            let EPG_hot_data = {
                                value:[],
                                value99:[],
                                value100:[],
                                name:[],
                                title:'',
                            };
                            items.forEach(function(item, index, arr){
                                EPG_hot_data['value'].push(item.epgnum);
                                EPG_hot_data['value99'].push(99.9);
                                EPG_hot_data['value100'].push(100);
                                EPG_hot_data['name'].push(item.epginfo);
                                EPG_hot_data['title'] = item.videocate;
                            });

                            EPG_hot(cheartID,EPG_hot_data);

                        });

                    }
                }
            })
        };
        //直播频道top10
        $('#marquee_B').height(($('#live_list_bar').height() - 70));
        function liveChannelTopTen() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"liveChannelTopTen",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        table_list_html(res.data,'#live_list');
                        $("#marquee_B").kxbdMarquee({direction:"up",scrollDelay:100});
                    }
                }
            })
        };
        //点播节目top10
        $('#marquee_A').height(($('#marquee_A_bar').height() - 70));
        function demandChannelTopTen() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"demandChannelTopTen",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        table_list_html(res.data,'#on_demand_list');
                        $("#marquee_A").kxbdMarquee({direction:"up",scrollDelay:100});
                    }
                }
            })
        };
        //热门收藏
        function hotCollection() {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: channelUrl+"hotCollection",
                data: {province:"福建",city:"福州"},
                success: function (res){
                    if(res.response_code == 100){
                        res.data.forEach(function (item,index) {
                            let labelHtml ='<a style=" background-color: '+color_rgb()+'">'+item+'</a>';
                            $('#tagscloud').append(labelHtml);
                        });
                        PersonalityLabel();
                    }
                }
            })
        }







        demandChannelTopTen();
        liveChannelTopTen();
        hotCollection();

        function allRequest() {
            channelType();
            ratingChannel();
            demandItems();
            epgRatio();
            hotEpgRatio();
        };
        allRequest();


        setInterval(function () {
            allRequest();
        },30000);




        //-----收视类型分析
        function viewing_type(data) {
            let dom = document.getElementById("viewing_type");
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
                    textStyle: {color: '#fff',fontWeight : 'bold',fontSize:'12px'},
                    data: videotypeArr
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '90%',
                        center: ['45%', '50%'],
                        label:{            //饼图图形上的文本标签
                            normal:{
                                show:true,
                                position:'inner', //标签的位置
                                textStyle : {
                                    textBorderColor:'transparent',
                                    fontWeight : 'bold',
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
                                    var colorList = ['#00A1E4','#E5CE10','#21E7F9'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };

            myChart.setOption(option, true);
        }





        // 直播频道分布
        function rate_channel(data) {
            let dom = document.getElementById("live_channel");
            let myChart = echarts.init(dom);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    show:false
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['30%', '45%'],
                        label: {
                            normal: {
                                position: 'outside',
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
                            },
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
        };




        //回看频道分布
        function lookback_channel(data) {
            let dom = document.getElementById("lookback_channel");
            let myChart = echarts.init(dom);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    show:false
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['30%', '45%'],
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
        };



        /*  ------------------------------用户点播业务------------------------------ */
        // 点播分屏点击关注度
        function demand_focus(data) {
            /*var data = {
                value:[50, 66, 33, 25, 25],
                value99:[99.9, 99.9, 99.9, 99.9, 99.9],
                value100:[100, 100, 100, 100, 100],
                name:['TOP1智能科技', 'TOP1人工科技', 'TOP1智能装备', 'TOP1核能科技', 'TOP1核能科技']
            };*/

            let city_ARPU_dom = document.getElementById('demand_focus');
            let myChart = echarts.init(city_ARPU_dom);
            // var myColor = ['#012767'];
            var option = {
                textStyle:{
                    fontSize: 14,
                    color:'#D0DCFE'
                },
                grid: {
                    left: 0,
                    top: 0,
                    right: 20,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [{
                    show: false
                }],
                yAxis: [
                    {
                    axisTick: 'none',
                    axisLine: 'none',
                    axisLabel:{
                        margin:15,
                    },
                    data: data.name
                }, {
                    axisTick: 'none',
                    axisLine: 'none',
                    show: false,
                    data: data.value
                }, {
                    axisTick: 'none',
                    axisLine: 'none',
                    show: false,
                    data: []
                }],
                series: [
                    {
                    name: '条',
                    type: 'bar',
                    stack: '圆',
                    yAxisIndex: 0,
                    data: data.value,
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: function(param) {
                                return param.value + '%'
                            },
                        }
                    },
                    barWidth: 20,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 10,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#315D9C'
                            }, {
                                offset: 1,
                                color: '#02F0E4'
                            }]),
                        }
                    },
                    z: 2
                }, {
                    name: '白框',
                    type: 'bar',
                    yAxisIndex: 1,
                    barGap: '-100%',
                    data: data.value99,
                    barWidth: 20,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 10,
                            color:'#012767'
                        }
                    },
                    z: 1
                },
                    {
                        name: '外框',
                        type: 'bar',
                        yAxisIndex: 2,
                        barGap: '-100%',
                        data: data.value100,
                        barWidth: 20,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: function(thisData) {
                                    return data.value[thisData.dataIndex] +"%";
                                },
                            }
                        },
                        itemStyle: {
                            normal: {
                                color:'#012767',
                                barBorderRadius: 10
                            }
                        },
                        z: 0
                    }]
            }
            myChart.setOption(option, true);
        }



        //EPG访问占比
        function EPG_access(data) {
            let dom = document.getElementById("EPG_access");
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



        // 点播分屏点击关注度
        function EPG_hot(id,data) {
            /*var data = {
                value:[50, 66, 33, 25, 25],
                value99:[99.9, 99.9, 99.9, 99.9, 99.9],
                value100:[100, 100, 100, 100, 100],
                name:['TOP1      智能科技', 'TOP1      人工科技', 'TOP1      智能装备', 'TOP1      核能科技', 'TOP1      核能科技'],
                title:'电影',
            };*/

            let city_ARPU_dom = document.getElementById(id);
            let myChart = echarts.init(city_ARPU_dom);
            // var myColor = ['#012767'];
            var option = {
                title:{
                    text:data.title,
                    textStyle:{
                        fontSize:16,
                        color:'#21E7F9',
                        fontWeight:'normal'
                    }
                },
                textStyle:{
                    fontSize: 14,
                    color:'#D0DCFE'
                },
                grid: {
                    left: 0,
                    top: 30,
                    right: 15,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [{
                    show: false,
                }],
                yAxis: [{
                    triggerEvent:true,
                    inverse:true,
                    offset:100,
                    axisTick: 'none',
                    axisLine: 'none',
                    axisLabel:{
                        formatter: function (value, index) {
                            let nameStr = 'TOP'+(index+1)+'    '+value;

                            if (nameStr.length > 12) {
                                nameStr = nameStr.substring(0, 12) + '...';
                            } else if (nameStr.length < 12) {
                                let nullStr = '                       ';
                                nameStr = nameStr + nullStr.substr(0, 15 - nameStr.length);
                            } else {
                                nameStr = nameStr + '   ';
                            }
                            return nameStr;
                        },
                        textStyle: {
                            align:'left',
                        },
                        margin:25
                    },
                    data: data.name
                }, {
                    axisTick: 'none',
                    axisLine: 'none',
                    show: false,
                    data: data.value
                }, {
                    axisTick: 'none',
                    axisLine: 'none',
                    show: false,
                    data: []
                }],
                series: [{
                    name: '条',
                    type: 'bar',
                    stack: '圆',
                    yAxisIndex: 0,
                    data: data.value,
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: function(param) {
                                return param.value + '%'
                            },
                        }
                    },
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#02C768'
                            }, {
                                offset: 1,
                                color: '#1A73F8'
                            }]),
                        }
                    },
                    z: 2
                }, {
                    name: '白框',
                    type: 'bar',
                    yAxisIndex: 1,
                    barGap: '-100%',
                    data: data.value99,
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color:'#012767'
                        }
                    },
                    z: 1
                },
                    {
                        name: '外框',
                        type: 'bar',
                        yAxisIndex: 2,
                        barGap: '-100%',
                        data: data.value100,
                        barWidth: 10,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: function(thisData) {
                                    return data.value[thisData.dataIndex] +"%";
                                },
                                barBorderRadius: 5
                            }
                        },
                        itemStyle: {
                            normal: {
                                color:'#012767',
                                barBorderRadius: 5
                            }
                        },
                        z: 0
                    }]
            }
            myChart.setOption(option, true);

            myChart.on('mouseover', function (params) {
                if (params.componentType === 'yAxis') {
                    let offsetX = params.event.offsetX + 10;
                    let offsetY = params.event.offsetY + 10;
                    myChart.setOption({
                        tooltip: {
                            alwaysShowContent: true,
                            formatter: function () {
                                return params.value
                            }
                        }
                    })
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: 0,
                        position: [offsetX, offsetY]
                    })
                }
            });

            myChart.on('mouseout', function (params) {
                if (params.componentType === 'yAxis') {
                    myChart.setOption({
                        tooltip: {
                            alwaysShowContent: false
                        }
                    })
                }
            })


        }
/*        function EPG_hotAA(id,data) {
            var data = {
                value:[50, 66, 33, 25, 25],
                value99:[99.9, 99.9, 99.9, 99.9, 99.9],
                value100:[100, 100, 100, 100, 100],
                name:['TOP1技', 'TOP', 'TO装备', 'TOP1e科技', 'TOP143科技'],
                title:'电影',
            };

            let city_ARPU_dom = document.getElementById('EPG_statu_cheart');
            let myChart = echarts.init(city_ARPU_dom);
            var option = {
                title:{
                    text:data.title,
                    textStyle:{
                        fontSize:16,
                        color:'#21E7F9',
                        fontWeight:'normal'
                    }
                },
                textStyle:{
                    fontSize: 14,
                    color:'#D0DCFE'
                },
                grid: {
                    left: 0,
                    top: 30,
                    right: 15,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [{
                    show: false,
                }],
                yAxis: [{
                    triggerEvent:true,
                    inverse:true,
                    offset:100,
                    axisTick: 'none',
                    axisLine: 'none',
                    axisLabel:{
                        formatter: function (value, index) {
                            let nameStr = 'TOP'+(index+1)+'    '+value;

                            if (nameStr.length > 12) {
                                nameStr = nameStr.substring(0, 12) + '...';
                            } else if (nameStr.length < 12) {
                                let nullStr = '                       ';
                                nameStr = nameStr + nullStr.substr(0, 15 - nameStr.length);
                            } else {
                                nameStr = nameStr + '   ';
                            }
                            return nameStr;
                        },
                        textStyle: {
                            align:'left',
                        },
                        margin:25
                    },
                    data: data.name
                }, {
                    axisTick: 'none',
                    axisLine: 'none',
                    show: false,
                    data: data.value
                }, {
                    axisTick: 'none',
                    axisLine: 'none',
                    show: false,
                    data: []
                }],
                series: [{
                    name: '条',
                    type: 'bar',
                    stack: '圆',
                    yAxisIndex: 0,
                    data: data.value,
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: function(param) {
                                return param.value + '%'
                            },
                        }
                    },
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#02C768'
                            }, {
                                offset: 1,
                                color: '#1A73F8'
                            }]),
                        }
                    },
                    z: 2
                }, {
                    name: '白框',
                    type: 'bar',
                    yAxisIndex: 1,
                    barGap: '-100%',
                    data: data.value99,
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color:'#012767'
                        }
                    },
                    z: 1
                },
                    {
                        name: '外框',
                        type: 'bar',
                        yAxisIndex: 2,
                        barGap: '-100%',
                        data: data.value100,
                        barWidth: 10,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: function(thisData) {
                                    return data.value[thisData.dataIndex] +"%";
                                },
                                barBorderRadius: 5
                            }
                        },
                        itemStyle: {
                            normal: {
                                color:'#012767',
                                barBorderRadius: 5
                            }
                        },
                        z: 0
                    }]
            }
            myChart.setOption(option, true);

            myChart.on('mouseover', function (params) {
                if (params.componentType === 'yAxis') {
                    let offsetX = params.event.offsetX + 10;
                    let offsetY = params.event.offsetY + 10;
                    myChart.setOption({
                        tooltip: {
                            alwaysShowContent: true,
                            formatter: function () {
                                return params.value
                            }
                        }
                    })
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: 0,
                        position: [offsetX, offsetY]
                    })
                }
            });

            myChart.on('mouseout', function (params) {
                if (params.componentType === 'yAxis') {
                    myChart.setOption({
                        tooltip: {
                            alwaysShowContent: false
                        }
                    })
                }
            })

            
        }

        EPG_hotAA()*/









    })
})();



