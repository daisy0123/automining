/*wBox插件*/
(function($) {
	//class为.wBox_close为关闭
	$.fn.wBox = function(options) {
		var defaults = {
				wBoxURL: "wbox/",
				opacity: 0.5, //背景透明度
				callBack: null,
				noTitle: false,
				show: false,
				timeout: 0,
				target: null,
				requestType: null, //iframe,ajax,img
				title: "wBox Title",
				drag: true,
				iframeWH: { //iframe 设置高宽
					width: 400,
					height: 300
				},
				X: null,
				Y: null,
				html: '' //wBox内容
			},
			_this = this;
		this.YQ = $.extend(defaults, options);
		var wBoxHtml = '<div id="wBox"><div class="wBox_popup"><table><tbody><tr><td class="wBox_tl"/><td class="wBox_b"/><td class="wBox_tr"/></tr><tr><td class="wBox_b"><div style="width:0px;">&nbsp;</div></td><td><div class="wBox_body">' + (_this.YQ.noTitle ? '' : '<table class="wBox_title"><tr><td class="wBox_dragTitle"><div class="wBox_itemTitle">' + _this.YQ.title + '</div></td><td width="20px" title="关闭"><div class="wBox_close"></div></td></tr></table> ') +
			'<div class="wBox_content" id="wBoxContent"></div></div></td><td class="wBox_b"><div style="width:0px">&nbsp;</div></td></tr><tr><td class="wBox_bl"/><td class="wBox_b"/><td class="wBox_br"/></tr></tbody></table></div></div>',
			B = null,
			C = null,
			$win = $(window),
			$t = $(this); //B背景，C内容jquery div
		this.showBox = function() {
				$("#wBox_overlay").remove();
				$("#wBox").remove();

				B = $("<div id='wBox_overlay' class='wBox_hide'></div>").hide().addClass('wBox_overlayBG').css('opacity', _this.YQ.opacity).dblclick(function() {
					_this.close();
				}).appendTo('body').fadeIn(300);
				Cccccc = C = $(wBoxHtml).appendTo('body');
				handleClick();
			}
			/*
			 * 处理点击
			 * @param {string} what
			 */
		function handleClick() {
			var con = C.find("#wBoxContent");
			if(_this.YQ.requestType && $.inArray(_this.YQ.requestType, ['iframe', 'ajax', 'img']) != -1) {
				con.html("<div class='wBox_load'><div id='wBox_loading'><img src='" + _this.YQ.wBoxURL + "loading.gif' /></div></div>");
				if(_this.YQ.requestType === "img") {
					var img = $("<img />");
					img.attr("src", _this.YQ.target);
					img.load(function() {
						img.appendTo(con.empty());
						setPosition();
					});
				} else
				if(_this.YQ.requestType === "ajax") {
					$.get(_this.YQ.target, function(data) {
						con.html(data);
						C.find('.wBox_close').click(_this.close);
						setPosition();
					})

				} else {
					ifr = $("<iframe name='wBoxIframe' style='width:" + _this.YQ.iframeWH.width + "px;height:" + _this.YQ.iframeWH.height + "px;' scrolling='auto' frameborder='0' src='" + _this.YQ.target + "'></iframe>");
					ifr.appendTo(con.empty());
					ifr.load(function() {
						try {
							$it = $(this).contents();
							$it.find('.wBox_close').click(_this.close);
							fH = $it.height(); //iframe height
							fW = $it.width();
							w = $win;
							newW = Math.min(w.width() - 40, fW);
							newH = w.height() - 25 - (_this.YQ.noTitle ? 0 : 30);
							newH = Math.min(newH, fH);
							if(!newH)
								return;
							var lt = calPosition(newW);
							C.css({
								left: lt[0],
								top: lt[1]
							});

							$(this).css({
								height: newH,
								width: newW
							});
						} catch(e) {}
					});
				}

			} else
			if(_this.YQ.target) {
				$(_this.YQ.target).clone(true).show().appendTo(con.empty());

			} else
			if(_this.YQ.html) {
				con.html(_this.YQ.html);
			} else {
				$t.clone(true).show().appendTo(con.empty());
			}
			afterHandleClick();
		}
		/*
		 * 处理点击之后的处理
		 */
		function afterHandleClick() {
			setPosition();
			C.show().find('.wBox_close').click(_this.close).hover(function() {
				$(this).addClass("on");
			}, function() {
				$(this).removeClass("on");
			});
			$(document).unbind('keydown.wBox').bind('keydown.wBox', function(e) {
				if(e.keyCode === 27)
					_this.close();
				return true
			});
			typeof _this.YQ.callBack === 'function' ? _this.YQ.callBack() : null;
			!_this.YQ.noTitle && _this.YQ.drag ? drag() : null;
			if(_this.YQ.timeout) {
				setTimeout(_this.close, _this.YQ.timeout);
			}

		}
		/*
		 * 设置wBox的位置
		 */
		function setPosition() {
			if(!C) {
				return false;
			}

			var width = C.width(),
				lt = calPosition(width);
			C.css({
				left: lt[0],
				top: lt[1]
			});
			var $h = $("body").height(),
				$wh = $win.height(),
				$hh = $("html").height();
			$h = Math.max($h, $wh);
			//B.height($h).width($win.width())
			B.height(0).width(0);
		}
		/*
		 * 计算wBox的位置
		 * @param {number} w 宽度
		 */
		function calPosition(w) {
			l = _this.YQ.left || ($win.width() - w) / 2;
			t = _this.YQ.top || $win.scrollTop() + $win.height() / 9;
			if(l > $win.width() - C.width())
				l = $win.width() - C.width();
			return [l, t];
		}
		/*
		 * 拖拽函数drag
		 */
		function drag() {
			var dx, dy, moveout;
			var T = C.find('.wBox_dragTitle').css('cursor', 'move');
			T.bind("selectstart", function() {
				return false;
			});

			T.mousedown(function(e) {
				dx = e.clientX - parseInt(C.css("left"));
				dy = e.clientY - parseInt(C.css("top"));
				C.mousemove(move).mouseout(out).css('opacity', 0.8);
				T.mouseup(up);
			});
			/*
			 * 移动改变生活
			 * @param {Object} e 事件
			 */
			function move(e) {
				moveout = false;
				if(e.clientX - dx < 0) {
					l = 0;
				} else
				if(e.clientX - dx > $win.width() - C.width()) {
					l = $win.width() - C.width();
				} else {
					l = e.clientX - dx
				}
				C.css({
					left: l,
					top: e.clientY - dy
				});

			}
			/*
			 * 你已经out啦！
			 * @param {Object} e 事件
			 */
			function out(e) {
				moveout = true;
				setTimeout(function() {
					moveout && up(e);
				}, 10);
			}
			/*
			 * 放弃
			 * @param {Object} e事件
			 */
			function up(e) {
				C.unbind("mousemove", move).unbind("mouseout", out).css('opacity', 1);
				T.unbind("mouseup", up);
			}
		}

		/*
		 * 关闭弹出框就是移除还原
		 */
		this.close = function() {
				if(C) {
					B.remove();
					C.stop().fadeOut(300, function() {
						C.remove();
					})
				}
			}
			/*
			 * 触发click事件
			 */
		$win.resize(function() {
			setPosition();
		});
		_this.YQ.show ? _this.showBox() : $t.click(function() {
			_this.showBox();
			return false;
		});
		return this;
	};
})(jQuery);

/*******************************************************************/
require.config({
	paths: {
		echarts: 'echarts/build/dist'
	}
});

var place = [];
var good = [];
var mid = [];
var bad = [];
var data = [];
var brand;
var placeRank;
var serie;
var list;
$.ajaxSettings.async = false;

$.getJSON('./carReport', function(json) {
	place = json.place;
	good = json.good;
	mid = json.mid;
	bad = json.bad;
	data = json.data;
	brand = json.brand;
	serie = json.serie;
	placeRank = json.placeRank;
	list = json.list;
	bar = json.bar;
});
var good1 = [];
var mid1 = [];
var bad1 = [];
document.getElementById("brand").innerHTML = brand;
document.getElementById("serie").innerHTML = serie;
document.getElementById("place").innerHTML = placeRank;
document.getElementById("dataList").innerHTML = list;

function show(param) {
	province_selected = "";
	for(var p in param.selected) {
		if(param.selected[p]) {
			province_selected = p;
			break;
		}
	}
	if(province_selected == "")
		return;

	var callback = function() {
		$.ajax({
			url: "./getCarReport",
			type: "post",
			dataType: "json", //获取到的响应是json格式的字符串。
			data: "name=" + province_selected,
			success: function(data) {
				// data 就是响应返回的数据
				goodd = data.good;
				midd = data.mid;
				badd = data.bad;
			}
		});
		barChart = require('echarts').init(document.getElementById('box_in'));
		barChart.setOption({
			title: {
				text: '',
				x: 'left'

			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: ['好评', '中立', '差评'],
				y: '30'
			},
			grid: {
				x: '50',
				x2: '20'
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
				type: 'value'
			}],
			yAxis: [{
				type: 'category',
				data: ['传祺', '丰田', '本田', '菲亚特', '三菱', '吉奥', '比亚迪']
			}],
			series: [{
				name: '好评',
				type: 'bar',
				stack: '总量',
				itemStyle: {
					normal: {
						label: {
							show: false,
							position: 'insideRight'
						}
					}
				},
				data: goodd
			}, {
				name: '中立',
				type: 'bar',
				stack: '总量',
				itemStyle: {
					normal: {
						label: {
							show: false,
							position: 'insideRight'
						}
					}
				},
				data: midd
			}, {
				name: '差评',
				type: 'bar',
				stack: '总量',
				itemStyle: {
					normal: {
						label: {
							show: false,
							position: 'insideRight'
						}
					}
				},
				data: badd
			}]
		});
	}
	$().wBox({
		title: province_selected + "评价详细分析",
		left: 400,
		top: 150,
		html: "<div id='box_in' style='width:400px;height:300px;'></div>",
		callBack: callback,
	}).showBox();
}

mapOption = {
	title: {
		text: '',
		x: 'left'
	},
	tooltip: {
		trigger: 'item',
		formatter: function(params) {
			return params.name + '<br/>' + params.seriesName + ' : ' + params.value;
		}
	},
	legend: {
		show: false,
		orient: 'vertical',
		x: 'left',
		data: ['评论总数']
	},
	dataRange: {
		min: 0,
		max: 12000,
		x: '80%',
		y: '60%',
		color: ['orange', 'yellow'],
		text: ['评论', ''], // 文本，默认为数值文本
		calculable: true,
		textStyle: {
			color: '#fff'
		}
	},
	toolbox: {
		show: true,
		orient: 'horizontal',
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
			restore: {
				show: true
			},
			saveAsImage: {
				show: true
			}
		}
	},
	roamController: {
		show: false,
		x: 'right',
		mapTypeControl: {
			'广东': true
		}
	},
	series: [{
		name: '评论总数',
		type: 'map',
		mapType: '广东',
		roam: false,
		selectedMode: 'single',
		itemStyle: {
			normal: {
				label: {
					show: true
				},
				borderWidth: 2,
				borderColor: '#000',
				color: '#000',
			},
			emphasis: {
				label: {
					show: true,
					textStyle: {
						color: '#fff'
					}
				}
			}
		},
		data: [{
			name: '广州市',
			value: data[0]
		}, {
			name: '深圳市',
			value: data[1]
		}, {
			name: '东莞市',
			value: data[3]
		}, {
			name: '惠州市',
			value: data[8]
		}, {
			name: '汕尾市',
			value: data[12]
		}, {
			name: '珠海市',
			value: data[5]
		}, {
			name: '中山市',
			value: data[4]
		}, {
			name: '佛山市',
			value: data[2]
		}, {
			name: '江门市',
			value: data[6]
		}, {
			name: '揭阳市',
			value: data[11]
		}, {
			name: '韶关市',
			value: data[16]
		}, {
			name: '汕头市',
			value: data[9]
		}, {
			name: '潮州市',
			value: data[10]
		}, {
			name: '阳江市',
			value: data[15]
		}, {
			name: '茂名市',
			value: data[14]
		}, {
			name: '湛江市',
			value: data[13]
		}, {
			name: '云浮市',
			value: data[18]
		}, {
			name: '肇庆市',
			value: data[7]
		}, {
			name: '梅州市',
			value: data[19]
		}, {
			name: '河源市',
			value: data[20]
		}, {
			name: '清远市',
			value: data[17]
		}]

	}]
};

require(
	[
		'echarts',
		'echarts/chart/map',
		'echarts/chart/bar'
	],
	function(ec) {
		mapChart = ec.init(document.getElementById('block-left'));
		mapChart.setOption(mapOption);
		var ecConfig = require('echarts/config');
		mapChart.on(ecConfig.EVENT.MAP_SELECTED, show);
		gz= getMapPos(mapChart, 113.9, 22.3);
		jm = getMapPos(mapChart, 113, 23.3);
		sz= getMapPos(mapChart, 114.5, 23.0);
		zs=getMapPos(mapChart, 113.8, 23);
		zh=getMapPos(mapChart, 114, 23.5);
		dg=getMapPos(mapChart, 114.2, 22.6);
		hz=getMapPos(mapChart, 115.0, 22.4);
		sh=getMapPos(mapChart, 115.9, 22.5);
		fs=getMapPos(mapChart, 113.3, 22.6);
		jy=getMapPos(mapChart, 116.5, 22.2);
		sg=getMapPos(mapChart, 114.2, 20.8);
		st=getMapPos(mapChart, 117.1, 22.3);
		cz=getMapPos(mapChart, 117.2, 21.7);
		yj=getMapPos(mapChart, 112.2, 23.4);
		mm=getMapPos(mapChart, 111.4, 23.5);
		zj=getMapPos(mapChart, 110.7, 24.5);
		yf=getMapPos(mapChart, 112.1, 22.6);
		zq=getMapPos(mapChart, 112.5, 21.9);
		mz=getMapPos(mapChart, 116.5, 21.3);
		hy=getMapPos(mapChart, 115.3, 21.5);
		qy=getMapPos(mapChart, 113.3, 21.2);
		var data = [{
			name: "广州市",
			x: gz[0],
			y: gz[1],
			val: bar[0]
		}, {
			name: "深圳市",
			x: sz[0],
			y: sz[1],
			val: bar[1]
		}, {
			name: "东莞市",
			x: dg[0],
			y: dg[1],
			val: bar[3]
		}, {
			name: "惠州市",
			x: hz[0],
			y: hz[1],
			val: bar[8]
		}, {
			name: "汕尾市",
			x: sh[0],
			y: sh[1],
			val: bar[12]
		}, {
			name: "珠海市",
			x: zh[0],
			y: zh[1],
			val: bar[5]
		}, {
			name: "中山市",
			x: zs[0],
			y: zs[1],
			val: bar[4]
		}, {
			name: "佛山市",
			x: fs[0],
			y: fs[1],
			val: bar[2]
		}, {
			name: "江门市",
			x: jm[0],
			y: jm[1],
			val: bar[6]
		}, {
			name: "揭阳市",
			x: jy[0],
			y: jy[1],
			val: bar[11]
		}, {
			name: "韶关市",
			x: sg[0],
			y: sg[1],
			val: bar[16]
		}, {
			name: "汕头市",
			x: st[0],
			y: st[1],
			val: bar[9]
		}, {
			name: "潮州市",
			x: cz[0],
			y: cz[1],
			val: bar[10]
		}, {
			name: "阳江市",
			x: yj[0],
			y: yj[1],
			val: bar[15]
		}, {
			name: "茂名市",
			x: mm[0],
			y: mm[1],
			val: bar[14]
		}, {
			name: "湛江市",
			x: zj[0],
			y: zj[1],
			val: bar[13]
		}, {
			name: "云浮市",
			x: yf[0],
			y: yf[1],
			val: bar[18]
		}, {
			name: "肇庆市",
			x: zq[0],
			y: zq[1],
			val: bar[7]
		}, {
			name: "梅州市",
			x: mz[0],
			y: mz[1],
			val: bar[19]
		}, {
			name: "河源市",
			x: hy[0],
			y: hy[1],
			val: bar[20]
		}, {
			name: "清远市",
			x: qy[0],
			y: qy[1],
			val: bar[17]
		}];

		function barShow(type) {
			$.each(data, function(key, value) {
				var bar = $("<div class='bar-show' style='bottom:" + value.y + "px;left:" + value.x + "px'><div class='barSize' id='" + value.name + "' ></div></div>");
				$(".map-show").append(bar);
				$barName = $("#" + value.name + "");
				$barName.animate({
					"height": Math.sqrt(value.val[type]) + 'px'
				}, 1000);
			});
		}

		function barHide() {
			$.each(data, function(key, value) {
				$barName = $("#" + value.name + "");
				$barName.animate({
					"height": '0px'
				}, 1000);
			});
		}
		/*
	 * 地图bar显示
	 */
	$(".bar-all-sel").click(function() {
		$barLength = $(".bar-sel").length;
		var btn = $("<button type='button' class='btn btn-default bar-sel animated bounceInLeft' id='good-bar'>好评显示</button><button type='button' class='btn btn-default bar-sel animated bounceInLeft' id='mid-bar'>中评显示</button><button type='button' class='btn btn-default bar-sel animated bounceInLeft' id='bad-bar'>差评显示</button>");
		if($barLength > 0) {
			$(".bar-sel").remove();
			barHide();
			$(".bar-all-sel").text("柱状显示");
		} else {
			$(".section-sel").append(btn);
			setTimeout(function() {
				$(".bar-all-sel").text("柱状隐藏");
			}, 1000);
			$(".bar-sel").click(function() {
				$barId = $(this).attr("id");
				if($barId == "good-bar") {
					barShow(0);
					$(".barSize").css("background", "red");
				} else if($barId == "mid-bar") {
					barShow(1);
					$(".barSize").css("background", "green");
				} else if($barId == "bad-bar") {
					barShow(2);
					$(".barSize").css("background", "blue");
				}
			});
		}
	});
	
	}
);

function getMapPos(charts, Xpos, Ypos) {
	return charts.chart.map.getPosByGeo('广东', [Xpos, Ypos]);
}
$(function() {
	/*
	 * 图片淡入淡出效果
	 */
	$.ScrollPic = function(option) {
		var defaults = {
			ele: '.yiz-slider-1',
			Time: '2000',
			autoscrooll: true
		};
		var opts = $.extend({}, defaults, option);
		var PicObject = $(opts.ele);
		var scrollList = PicObject.find('ul');
		var listLi = scrollList.find('li');
		var index = 0;
		var picTimer;
		var len = PicObject.find("li").length;

		function picTimer() {
			showPics(index);
			index++;
			if(index == len) {
				index = 0;
			}
		}
		if(opts.autoscrooll) {
			var time = setInterval(picTimer, opts.Time)
		}

		function showPics(index) {
			listLi.hide();
			listLi.eq(index).fadeIn(500).siblings().hide();
			PicObject.find(paging).eq(index).addClass('current').siblings().removeClass('current');
		}
		PicObject.append('<div class="yiz-page-btn"></div>')
		for(i = 1; i <= len; i++) {
			PicObject.find('.yiz-page-btn').append('<span>' + i + '</span>')
		}
		var paging = PicObject.find(".yiz-page-btn span");
		paging.eq(index).addClass('current')
		PicObject.find(paging).mouseover(function() {
			index = PicObject.find(paging).index($(this));
			showPics(index)
		});
		PicObject.hover(function() {
			clearInterval(time);
		}, function() {
			if(opts.autoscrooll) {
				time = setInterval(picTimer, opts.Time);
			} else {
				clearInterval(time)
			}
			20002000
		});
	}

	$.ScrollPic({
		ele: '.yiz-slider-1', //插件应用div
		Time: '5000', //自动切换时间
		autoscrooll: true, //设置是否自动渐变
	});
	/*
	 * 排行榜进度条效果
	 */
	$(".bar").each(function() {
		var max = 20000;
		var wid = $(this).parents(".progress").siblings('p').text();
		var percent = (wid / max) * 100;
		$(this).animate({
			'width': percent + '%'
		}, 1000);
	});

	/**/

});