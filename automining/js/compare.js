function change(id){
	if(id == 1){
		$(".attr_1_1").val($(".attr_1").val());
	}
	else{
		$(".attr_1").val($(".attr_1_1").val());
	}
}
$(function(){
	var company;
	var brand;
	var serie;
	var attrid;
	var br_name;
//	$("select[class^='brand']").css("display", "none");
	$("select[class^='company']").bind("change", function(){
		if($(this).val() != 0){
			company = $(this).val();
//			alert($(this).attr("class"));
			if($(this).attr("class") == "company"){
				$(".brand_" + company).css("display", "block").siblings().val(0).css("display", "none");
			}else{
				$(".brand_1_" + company).css("display", "block").siblings().val(0).css("display", "none");
			}
		}else{
			$("select[class^='brand']").val(0).css("display", "none");
			$("select[class^='serie']").val(0).css("display", "none");
		}
	});
	
	$("select[class^='brand']").bind("change", function(){
		if($(this).val() != 0){
			brand = $(this).val();
			var b = $(this).attr("class");
			if(b.indexOf("brand_1_") != -1){
				$(".serie_1_" + brand).css("display", "block").siblings().val(0).css("display", "none");
			}else{
				$(".serie_" + brand).css("display", "block").siblings().val(0).css("display", "none");
			}
		}else{
			$("select[class^='serie']").val(0).css("display", "none");
		}
	});
	
	
	$(".con-1").bind("click", function(){
		var id = 0;
		var name = "";
		if($(".company").val() == 0){
			alert("请选择！");
		}else{
			attrid = $(".attr_1").val();
			id = $(".company").val();
			if($(".brand_" + id).val() == 0){
				name = "car01";
				getData(name, id, 1, attrid);
			}else{
				id = $(".brand_" + id).val();
				if($(".serie_" + id).val() == 0){
					name = "car02";
					getData(name, id, 1, attrid);
				}else{
					id = $(".serie_" + id).val();
					name = "car03";
					getData(name, id, 1, attrid);
				}
			}
			$(".block1").children(".crop-intro-container").css("opacity", "1");
//			alert(name + " " + id);
		}
	});
	
	$(".con-2").bind("click", function(){
		var id = 0;
		var name = "";
		if($(".company_1").val() == 0){
			alert("请选择！");
		}else{
			attrid = $(".attr_1_1").val();
			id = $(".company_1").val();
			if($(".brand_1_" + id).val() == 0){
				name = "car01";
				getData(name, id, 2, attrid);
			}else{
				id = $(".brand_1_" + id).val();
				if($(".serie_1_" + id).val() == 0){
					name = "car02";
					getData(name, id, 2, attrid);
				}else{
					id = $(".serie_1_" + id).val();
					name = "car03";
//					console.log(id);
					getData(name, id, 2, attrid);
				}
			}
//			alert(name + " " + id);
			$(".block2").children(".crop-intro-container").css("opacity", "1");
//			alert($(this).parent().child.attr("class"));
		}
	});
	
	function getData(name, id, num, attrid){
		$.ajax({
			type:"get",
			url:"./" + name,
			async:false,
			data:"id=" + id,
			dataType:"json",
			success:function(data){
				parse(data, num, name, attrid);
			},
			error:function(err){
				alert(err);
			}
		});
	}
	
	function changeComment(name, id, attrid, br_name, name) {
		var type;
		if(name.indexOf("01") != -1){
			type = 1;
		}else if(name.indexOf("02") != -1){
			type = 2;
		}else{
			type =3;
		}
		$.ajax({
			url: "./changeCompareComment",
			type: "post",
			async: false,
			dataType: "json",
			data: "type=" + type + "&attrid=" + (attr - 1) + "&name=" + br_name,
			success: function(data) {
				if(name.indexOf("1") != -1){
				document.getElementById("comment_1").innerHTML = data.comments;
			}
			else if(name.indexOf("2") != -1){
				document.getElementById("comment_2").innerHTML = data.comments;
			}
			}
		});
	}
	
	function parse(data, num, name, attrid){
		var attrname = ['空间', '动力', '操控', '油耗', '舒适性', '外观', '内饰', '性价比'];
//		console.log(data);
		document.getElementById("introduce intro" + num).innerHTML = data.information;
		
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
			'echarts/chart/funnel',
			'echarts/chart/line'
		],
		function(ec) {
			cropbarChart = ec.init(document.getElementById("crop-comment-anlyse ana" + num)); //属性分析
			cropbarChart.setOption(cropbarOption(data.eight));
//			console.log(data.month);
			if(name.indexOf("1") != -1){
				document.getElementById("picture_1").innerHTML = data.picture;
				document.getElementById("comment_1").innerHTML = data.comments;
			}
			else if(name.indexOf("2") != -1){
				document.getElementById("picture_2").innerHTML = data.picture;
				document.getElementById("comment_2").innerHTML = data.comments;
			}
			if(attrid == 0){
				$(".attr" + num).css("display", "none");
				$(".ana_block1").css("display", "block");
				$(".ana_block2").css("display", "block");
			}
			else{
				$(".attr" + num).css("display", "block");
				$(".ana_block1").css("display", "none");
				$(".ana_block2").css("display", "none");
				cropAttrChart = ec.init(document.getElementById("crop-attr-anlyse attr" + num));
				cropAttrChart.setOption(cropAttrOption(data.eight, attrid));
				$(".attr" + num).css("display", "block");
				$(".attrname" + num).text(attrname[attrid - 1] + "分析");
			}
			if(name.indexOf("car01") != -1) {
				console.log(111);
				cropLoveChart = ec.init(document.getElementById("brand-love-tread tend" + num)); //企业趋势
				cropLoveChart.setOption(cropLineOption(data.month));
			}
			else{
				console.log(222);
				brandLoveChart = ec.init(document.getElementById("brand-love-tread tend" + num)); //品牌趋势
				brandLoveChart.setOption(tendOption(data.month));
			}
		});
	}
});
