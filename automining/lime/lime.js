function test1(){
	var comment = document.getElementById("commentBox").value;
	console.log(comment);
	var result;
	var word;
	$.ajax({
			url:"/servlet/commentData",
			type:"post",
			async : false ,
			dataType:"json", //获取到的响应是json格式的字符串。
			data:"comment=" + comment,
			success:function(data) {
            // data 就是响应返回的数据
					result = data.comment;
					word = data.word;
			}
		});
	document.getElementById("comment").innerHTML = result;
	document.getElementById("word").innerHTML = word;
}

function test2(){
	var comment = document.getElementById("commentBox").value;
	var evaluation;
	$.ajax({
		url:"/servlet/evaluation",
		type:"post",
		async:false,
		dataType:"json",
		data:"comment="+comment,
		success:function(data){
			evaluation = data.evaluation;
		}
	});
	document.getElementById("evaluation").innerHTML = evaluation;
}