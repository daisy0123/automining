var id = 1;
var serieId = 23;
var start = 0;

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
}

function car01(id) {
	location.href = "/automining/brand.html?id=" + id + "#车系简介";
}

function car02(id) {
	location.href = "/automining/series.html?id=" + id + "#车系简介";
}
$(function() {
	var url = window.location.href;
	/*
	 * 标签替换和进度条加载
	 */
	$('.crop-sinal').click(function() {
		$text = $(this).parent().siblings().find('.crop-sinal-text').text();
		showProgress($text);
		return false;
	});
	$('.brand-sinal').click(function() {
		$text = $(this).find('.brand-sinal-text').text();
		showProgress($text);
		return false;
	});
	$('.series-sinal>li').click(function() {
		$text = $(this).children('a').text();
		showProgress($text);
		return false;
	});

	function showProgress($text) {
		$('.progress-fixed').show();
		$('.progress-show').animate({
			"width": '100%'
		}, 2000, function() {
			$('.progress-fixed').hide();
			$('.progress-show').width(0);
			$('.sinal-show').html($text);
		});
	}

	if(GetQueryString("id")) {
		id = GetQueryString("id");
	}
	if(url.indexOf("corp") != -1) {
		getData(1, id);
	}
	if(url.indexOf("brand") != -1) {
		getData(2, id);
	}
	if(url.indexOf("series") != -1) {
		getData(3, serieId);
	}

	/*导航滚动*/
	$(".navbar-scroll>ul>li>a").click(function() {
		$("html, body").animate({
			scrollTop: $($(this).attr("href")).offset().top + "px"
		}, {
			duration: 500,
			easing: "swing"
		});

	});
	/**/
	$(".more").click(function() {
		$("span.text-hidden").toggle();
		if($(this).html() == "收起") {
			$(this).html("<span class='more-sinal'>...</span>详细》</span>");
		} else {
			$(this).html("收起");
		}
	});
});

function getData(type, iid) {
	id = iid;
	var all;
	$.ajax({
		url: "./car0" + type,
		type: "post",
		async: false,
		dataType: "json",
		data: "id=" + iid,
		success: function(data) {
			all = data;
		}
	});
	if(type == "1" & iid == "1") {
		document.getElementsByClassName("row crop-intro-container list1")[0].style.display = "block";
		document.getElementsByClassName("row crop-intro-container list2")[0].style.display = "none";
	} else if(type == "1" & iid == "2") {
		document.getElementsByClassName("row crop-intro-container list2")[0].style.display = "block";
		document.getElementsByClassName("row crop-intro-container list1")[0].style.display = "none";
	}

	if(type == "2") {
		document.getElementById("carList").innerHTML = all.carlist;
	}

	document.getElementById("introduce").innerHTML = all.information;
	document.getElementById("comment").innerHTML = all.comments;
	document.getElementById("picture").innerHTML = all.picture;
	require.config({
		paths: {
			echarts: 'echarts/build/dist'
		}
	});
	require(
		[
			'echarts',
			'echarts/chart/bar',
			'echarts/chart/pie',
			'echarts/chart/funnel',
			'echarts/chart/wordCloud',
			'echarts/chart/line'
		],
		function(ec) {
			//          	if(type == "3"){
			//          		cropbarChart = ec.init(document.getElementById('crop-comment-anlyse'));		//属性分析
			//      			cropbarChart.setOption(cropbarOption1());
			//          	}
			//          	else {
			cropbarChart = ec.init(document.getElementById('crop-comment-anlyse')); //属性分析
			cropbarChart.setOption(cropbarOption(all.eight));
			//          	}
			cropPieChart = ec.init(document.getElementById('crop-area-anlyse')); //地区分布
			cropPieChart.setOption(croppieOption(all.placeNum));
			cropRankChart = ec.init(document.getElementById('crop-rank-anlyse')); //旗下排行
			cropRankChart.setOption(cropRankOption(all.topName, all.topNum));
			cropCloudChart = ec.init(document.getElementById('crop-information-anlyse')); //关键词条
			cropCloudChart.setOption(cropCloudOption(all.words));
			if(document.getElementById('crop-love-tread')) {
				cropLoveChart = ec.init(document.getElementById('crop-love-tread')); //企业趋势
				cropLoveChart.setOption(cropLineOption(all.month));
			}
			if(document.getElementById('brand-love-tread')) {
				brandLoveChart = ec.init(document.getElementById('brand-love-tread')); //品牌趋势
				brandLoveChart.setOption(tendOption(all.month));
			}
			if(document.getElementById('serie-love-tread')) {
				serieLoveChart = ec.init(document.getElementById('serie-love-tread')); //车系趋势
				serieLoveChart.setOption(tendOption(all.month));
			}

			if(document.getElementById('crop-price-tread')) {
				cropPriceChart = ec.init(document.getElementById('crop-price-tread')); //车系价格
				cropPriceChart.setOption(priceOption(all.price));
			}
		});

}

function changeData(type, year) {
	var all;
	$.ajax({
		url: "./change0" + type,
		type: "post",
		async: false,
		dataType: "json",
		data: "year=" + year + "&id=" + id,
		success: function(data) {
			all = data;
		}
	});
	require.config({
		paths: {
			echarts: 'echarts/build/dist'
		}
	});
	require(
		[
			'echarts',
			'echarts/chart/bar',
			'echarts/chart/pie',
			'echarts/chart/funnel',
			'echarts/chart/wordCloud',
			'echarts/chart/line'
		],
		function(ec) {
			if(document.getElementById('crop-love-tread')) {
				cropLoveChart = ec.init(document.getElementById('crop-love-tread')); //企业趋势
				cropLoveChart.setOption(cropLineOption(all.month));
			}
			if(document.getElementById('brand-love-tread')) {
				brandLoveChart = ec.init(document.getElementById('brand-love-tread')); //品牌趋势
				brandLoveChart.setOption(tendOption(all.month));
			}
			if(document.getElementById('serie-love-tread')) {
				serieLoveChart = ec.init(document.getElementById('serie-love-tread')); //车系趋势
				serieLoveChart.setOption(tendOption(all.month));
			}
		});
}

function changePicture(type) {
	$.ajax({
		url: "./updatePicture",
		type: "post",
		async: false,
		dataType: "json",
		data: "type=" + type + "&id=" + id + "&num=" + start,
		success: function(data) {
			document.getElementById("picture").innerHTML = data.picture;
			start++;
			if(start == 3) {
				start = 0;
			}
		}
	});
}

function changeComment(type) {
	$.ajax({
		url: "./changeComment",
		type: "post",
		async: false,
		dataType: "json",
		data: "type=" + type + "&id=" + id,
		success: function(data) {
			document.getElementById("comment").innerHTML = data.comments;
		}
	});
}

function changePrice(year) {
	var all;
	$.ajax({
		url: "./priceChange",
		type: "post",
		async: false,
		dataType: "json",
		data: "year=" + year + "&id=" + id,
		success: function(data) {
			all = data;
		}
	});
	require.config({
		paths: {
			echarts: 'echarts/build/dist'
		}
	});
	require(
		[
			'echarts',
			'echarts/chart/bar',
			'echarts/chart/pie',
			'echarts/chart/funnel',
			'echarts/chart/wordCloud',
			'echarts/chart/line'
		],
		function(ec) {
			cropPriceChart = ec.init(document.getElementById('crop-price-tread')); //车系价格
			cropPriceChart.setOption(priceOption(all.price));
		});
}

function cropbarOption(data) {
	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: '{b}<br/>{a0}:{c0}%<br/>{a1}:{c1}%<br/>{a2}:{c2}%'
		},
		legend: {
			data: ['好评', '中立', '差评'],
			y: '30',
			textStyle: {
				color: '#fff'
			}
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 'bottom',
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			name: '性能指数',
			type: 'value',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			}

		}],
		yAxis: [{
			name: '性能',
			type: 'category',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
			data: ['空间', '动力', '操控', '油耗', '舒适性', '外观', '内饰', '性价比']
		}],
		series: [{
			name: '好评',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'insideLeft',
//						                          formatter: '{c}%'
					}
				}
			},
			data: data[0]
		}, {
			name: '中立',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'insideLeft',
//						                          formatter: '{c}%'
					}
				}
			},
			data: data[1]
		}, {
			name: '差评',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'insideLeft',
//						                          formatter: '{c}%'
					}
				}
			},
			data: data[2]
		}]
	}
};

function cropbarOption1() {
	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: '{b}<br/>{a0}:{c0}%<br/>{a1}:{c1}%<br/>{a2}:{c2}%'
		},
		legend: {
			data: ['好评', '中立', '差评'],
			y: '30',
			textStyle: {
				color: '#fff'
			}
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 'bottom',
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			name: '性能指数',
			type: 'value',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			}

		}],
		yAxis: [{
			name: '性能',
			type: 'category',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
			data: ['空间', '动力', '操控', '油耗', '舒适性', '外观', '内饰', '性价比']
		}],
		series: [{
			name: '好评',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'insideLeft',
						formatter: '{c}%'
					}
				}
			},
			data: [70, 40, 40, 35, 5, 30, 20, 10]
		}, {
			name: '中立',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'insideLeft',
						formatter: '{c}%'
					}
				}
			},
			data: [20, 30, 10, 35, 5, 30, 50, 50]
		}, {
			name: '差评',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'insideLeft',
						formatter: '{c}%'
					}
				}
			},
			data: [10, 30, 50, 30, 90, 40, 30, 40]
		}]
	}
};

function croppieOption(placeNum) {
	return {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			x: 'left',
			textStyle: {
				color: '#fff'
			},
			data: ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
			selected: {
				'韶关': false,
				'湛江': false,
				'肇庆': false,
				'江门': false,
				'茂名': false,
				'惠州': false,
				'梅州': false,
				'汕尾': false,
				'河源': false,
				'阳江': false,
				'清远': false,
				'东莞': false,
				'中山': false,
				'潮州': false,
				'揭阳': false,
				'云浮': false
			}
		},
		toolbox: {
			show: true,
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['pie', 'funnel'],
					option: {
						funnel: {
							x: '25%',
							width: '50%',
							funnelAlign: 'left',
							max: 1548
						}
					}
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		series: [{
			name: '访问来源',
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: placeNum[0],
				name: '广州'

			}, {
				value: placeNum[1],
				name: '深圳'
			}, {
				value: placeNum[5],
				name: '珠海'
			}, {
				value: placeNum[9],
				name: '汕头'
			}, {
				value: placeNum[2],
				name: '佛山'
			}, {
				value: placeNum[16],
				name: '韶关'

			}, {
				value: placeNum[13],
				name: '湛江'
			}, {
				value: placeNum[7],
				name: '肇庆'
			}, {
				value: placeNum[6],
				name: '江门'
			}, {
				value: placeNum[14],
				name: '茂名'
			}, {
				value: placeNum[8],
				name: '惠州'
			}, {
				value: placeNum[19],
				name: '梅州'
			}, {
				value: placeNum[12],
				name: '汕尾'
			}, {
				value: placeNum[20],
				name: '河源'
			}, {
				value: placeNum[15],
				name: '阳江'
			}, {
				value: placeNum[17],
				name: '清远'
			}, {
				value: placeNum[3],
				name: '东莞'
			}, {
				value: placeNum[4],
				name: '中山'
			}, {
				value: placeNum[10],
				name: '潮州'
			}, {
				value: placeNum[11],
				name: '揭阳'
			}, {
				value: placeNum[18],
				name: '云浮'
			}]
		}]
	}
};

function cropRankOption(name, num) {
	return {
		title: {
			x: 'center',
			text: '',
		},
		tooltip: {
			trigger: 'item'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		grid: {
			borderWidth: 0,
			y: 80,
			y2: 60
		},
		xAxis: [{
			name: '品牌',
			type: 'category',
			show: false,
			//              data: ['广汽', '广汽', '广汽', '广汽', '广汽', '广汽', '广汽']
			data: name
		}],
		yAxis: [{
			type: 'value',
			show: false
		}],
		series: [{
			name: '',
			type: 'bar',
			itemStyle: {
				normal: {
					color: function(params) {
						// build a color map as your need.
						var colorList = [
							'#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
							'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
							'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
						];
						return colorList[params.dataIndex]
					},
					label: {
						show: true,
						position: 'top',
						formatter: '{b}\n{c}'
					}
				}
			},
			data: num,
			markPoint: {
				tooltip: {
					trigger: 'item',
					backgroundColor: 'rgba(0,0,0,0)',
				},
				data: [{
					xAxis: 0,
					y: 350,
					name: 'Line',
					symbolSize: 0
				}, {
					xAxis: 1,
					y: 350,
					name: 'Bar',
					symbolSize: 0
				}, {
					xAxis: 2,
					y: 350,
					name: 'Scatter',
					symbolSize: 0
				}, {
					xAxis: 3,
					y: 350,
					name: 'K',
					symbolSize: 0
				}, {
					xAxis: 4,
					y: 350,
					name: 'Pie',
					symbolSize: 0
				}, {
					xAxis: 5,
					y: 350,
					name: 'Radar',
					symbolSize: 0
				}, {
					xAxis: 6,
					y: 350,
					name: 'Chord',
					symbolSize: 0
				}]
			}
		}]
	}
};

function cropLineOption(data) {
	return {
		title: {
			text: '',
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['广汽', '比亚迪'],
			textStyle: {
				color: '#fff'
			}
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 'bottom',
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: false,
		xAxis: [{
			name: '月份',
			type: 'category',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
			boundaryGap: false,
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{
			name: '关注指数',
			type: 'value',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
		}],
		series: [{
			name: '广汽',
			type: 'line',
			data: data[0]
		}, {
			name: '比亚迪',
			type: 'line',
			data: data[1]
		}]
	}
};

function cropCloudOption(words) {
	return {
		title: {
			text: '',
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 'bottom',
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: false,
					readOnly: false
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		series: [{
			name: '关键词',
			type: 'wordCloud',
			size: ['90%', '90%'],
			textRotation: [0, 45, 90, -45],
			textPadding: 0,
			autoSize: {
				enable: true,
				minSize: 14
			},
			data: [{
				name: words[0],
				value: 6181,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[1],
				value: 5386,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[2],
				value: 5055,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[3],
				value: 4860,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[4],
				value: 4660,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[5],
				value: 4560,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[6],
				value: 4560,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[7],
				value: 4160,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[8],
				value: 4160,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[9],
				value: 4160,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[10],
				value: 4160,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[11],
				value: 4160,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[12],
				value: 3984,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[13],
				value: 3884,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[14],
				value: 3884,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[15],
				value: 3884,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[16],
				value: 3884,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[17],
				value: 3554,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[18],
				value: 3604,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[19],
				value: 3784,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[20],
				value: 3784,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[21],
				value: 3784,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[22],
				value: 3784,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[23],
				value: 3784,
				itemStyle: createRandomItemStyle()
			}, {
				name: words[24],
				value: 3784,
				itemStyle: createRandomItemStyle()
			}]
		}]

	}
};

function priceOption(price) {
	return {
		title: {
			text: '',
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			x: 30,
			padding: 5,
			textStyle: {
				color: '#fff'
			},
			data: ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
			selected: {
				'韶关': false,
				'湛江': false,
				'肇庆': false,
				'江门': false,
				'茂名': false,
				'惠州': false,
				'梅州': false,
				'汕尾': false,
				'河源': false,
				'阳江': false,
				'清远': false,
				'东莞': false,
				'中山': false,
				'潮州': false,
				'揭阳': false,
				'云浮': false
			}
		},
		grid: {
			x: 50,
			x2: 50,
			y: 80,
			y2: 60
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 'bottom',
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			name: '月份',
			type: 'category',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
			boundaryGap: false,
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{
			name: '车系价格',
			type: 'value',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
		}],
		series: [{
			name: '广州',
			type: 'line',
			data: price[0]
		}, {
			name: '深圳',
			type: 'line',
			data: price[1]
		}, {
			name: '珠海',
			type: 'line',
			data: price[5]
		}, {
			name: '汕头',
			type: 'line',
			data: price[9]
		}, {
			name: '佛山',
			type: 'line',
			data: price[2]
		}, {
			name: '韶关',
			type: 'line',
			data: price[16]
		}, {
			name: '湛江',
			type: 'line',
			data: price[13]
		}, {
			name: '肇庆',
			type: 'line',
			data: price[7]
		}, {
			name: '江门',
			type: 'line',
			data: price[6]
		}, {
			name: '茂名',
			type: 'line',
			data: price[14]
		}, {
			name: '惠州',
			type: 'line',
			data: price[8]
		}, {
			name: '梅州',
			type: 'line',
			data: price[19]
		}, {
			name: '汕尾',
			type: 'line',
			data: price[12]
		}, {
			name: '河源',
			type: 'line',
			data: price[20]
		}, {
			name: '阳江',
			type: 'line',
			data: price[15]
		}, {
			name: '清远',
			type: 'line',
			data: price[17]
		}, {
			name: '东莞',
			type: 'line',
			data: price[3]
		}, {
			name: '中山',
			type: 'line',
			data: price[4]
		}, {
			name: '潮州',
			type: 'line',
			data: price[10]
		}, {
			name: '揭阳',
			type: 'line',
			data: price[11]
		}, {
			name: '云浮',
			type: 'line',
			data: price[18]
		}]
	}
};

function tendOption(data) {
	return {
		title: {
			text: '',
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			x: 30,
			padding: 5,
			textStyle: {
				color: '#fff'
			},
			data: ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
			selected: {
				'韶关': false,
				'湛江': false,
				'肇庆': false,
				'江门': false,
				'茂名': false,
				'惠州': false,
				'梅州': false,
				'汕尾': false,
				'河源': false,
				'阳江': false,
				'清远': false,
				'东莞': false,
				'中山': false,
				'潮州': false,
				'揭阳': false,
				'云浮': false
			}
		},
		grid: {
			x: 50,
			x2: 50,
			y: 80,
			y2: 60
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 'bottom',
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			name: '月份',
			type: 'category',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			},
			boundaryGap: false,
			data: ['13年1月', '13年2月', '13年3月', '13年4月', '13年5月', '13年6月', '13年7月', '13年8月', '13年9月', '13年10月', '13年11月', '13年12月',
			'14年1月', '14年2月', '14年3月', '14年4月', '14年5月', '14年6月', '14年7月', '14年8月', '14年9月', '14年10月', '14年11月', '14年12月',
			'15年1月', '15年2月', '15年3月', '15年4月', '15年5月', '15年6月', '15年7月', '15年8月', '15年9月', '15年10月', '15年11月', '15年12月',
			'16年1月', '16年2月', '16年3月', '16年4月', '16年5月', '16年6月', '16年7月', '16年8月', '16年9月', '16年10月', '16年11月', '16年12月']
		}],
		yAxis: [{
			name: '关注指数',
			type: 'value',
			nameTextStyle: {
				color: '#fff'
			},
			axisLabel: {
				textStyle: {
					color: '#fff'
				}
			}
		}],
		series: [{
			name: '广州',
			type: 'line',
			data: data[0]
		}, {
			name: '深圳',
			type: 'line',
			data: data[1]
		}, {
			name: '珠海',
			type: 'line',
			data: data[5]
		}, {
			name: '汕头',
			type: 'line',
			data: data[9]
		}, {
			name: '佛山',
			type: 'line',
			data: data[2]
		}, {
			name: '韶关',
			type: 'line',
			data: data[16]
		}, {
			name: '湛江',
			type: 'line',
			data: data[13]
		}, {
			name: '肇庆',
			type: 'line',
			data: data[7]
		}, {
			name: '江门',
			type: 'line',
			data: data[6]
		}, {
			name: '茂名',
			type: 'line',
			data: data[14]
		}, {
			name: '惠州',
			type: 'line',
			data: data[8]
		}, {
			name: '梅州',
			type: 'line',
			data: data[19]
		}, {
			name: '汕尾',
			type: 'line',
			data: data[12]
		}, {
			name: '河源',
			type: 'line',
			data: data[20]
		}, {
			name: '阳江',
			type: 'line',
			data: data[15]
		}, {
			name: '清远',
			type: 'line',
			data: data[17]
		}, {
			name: '东莞',
			type: 'line',
			data: data[3]
		}, {
			name: '中山',
			type: 'line',
			data: data[4]
		}, {
			name: '潮州',
			type: 'line',
			data: data[10]
		}, {
			name: '揭阳',
			type: 'line',
			data: data[11]
		}, {
			name: '云浮',
			type: 'line',
			data: data[18]
		}]
	}
};

function createRandomItemStyle() {
	return {
		normal: {
			color: 'rgb(' + [
				Math.round(50 + Math.random() * 255),
				Math.round(50 + Math.random() * 255),
				Math.round(50 + Math.random() * 255)
			].join(',') + ')'
		}
	};
}