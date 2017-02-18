/*
	main.js
	author : discoNeko
	created : 2016/02/11
	purpose : 

	TODO : 
		- discoNeko 2016/02/11
*/

(function($) {

/* check maxlength */
	$('.cmd').on('keyup change', function(){
		var target = '#' + $(this).attr("id");
		checkLimitLength(target);
	});

/* tooltips */
	$(".copy").on({
		'click':function(){
			var text = $(this).attr('data-text');
			$(this).after('<div class="tooltips">'+text+'</div>');
		},
		'mouseleave':function(){
			$('.tips').find(".tooltips").remove();
		}
	});

/* generate language */
	$('#gen').on('click', function(){
	/* 単語チェック */
		fillCommandWord();
		var value = getCommandWord();

	/* 単語重複チェック */
		var overlap = [];
		var overlength = false;
		overlap.fill(false);
		for(var i = 0; i < 7; i++){
			for(var j = i + 1; j < 7; j++){
				if(value[i] == value[j]){
					overlap[i] = true;
					overlap[j] = true;
				}
			}
			var target = '#c' + i;
			if(overlap[i]){
				$(target).addClass("err_color");
			}else{
				$(target).removeClass("err_color");
				overlength = checkLimitLength(target) || overlength;
			}
		}
		$('#err_message').text("");
		if(overlap.indexOf(true)!=-1){
			$('#err_message').append("※重複している単語があります。");
		}else if(overlength){
			$('#err_message').append("※字数オーバーしている単語があります。");
		}

	/* 組み合わせ重複チェック */
		//TODO

		if(overlap.indexOf(true)==-1){
		/* Hello world 生成 */
			var helloworld_src = makeHelloWorld();
			$('#hw_src').val(helloworld_src);

		/* インタプリタ生成 */
			makeInterpreter();

		/* show download button */
			$('.dlb').css('display','block');
		}
	});

/* reset button */
	$('#reset').on('click', function(){
		for(var i = 0; i < 7; i++){
			$('#c'+i).val("");
			$('#c'+i).removeClass("err_color");
		}
		$('#err_message').text("");
		$('#lang_name').val("");
	});

/* downlaod button */
	$('.download').on('click', function(){
		var a = document.querySelector('.download');
		var obj = $('#ip_src').val();
		if(obj.length==0){
			return 0;
		}
		var blob = new Blob([obj],{ type: 'text/html' });
		var url = URL.createObjectURL(blob);

		a.download = 'index.html';
		a.href = url;
		a.classList.remove('disabled');
	});

	//TODO
	function searchConvOverlap(wd,conv){
	}

	function checkLimitLength(cmd){
		var len = $(cmd).val().length;
		if(len > 20){
			$(cmd).addClass("err_color");
			$('.'+$(cmd).attr("id")).remove();
			$(cmd).after('<div class=\"'+$(cmd).attr("id")+' err_message\">※20文字以内。['+len+'文字]</div>');
			return true;
		}else{
			$(cmd).removeClass("err_color");
			$('.'+$(cmd).attr("id")).remove();
			return false;
		}
	}

	function getCommandWord(){
		var value = [];
		for(var i = 0; i < 7; i++){
			value[i] = $('#c'+i).val();
		}
		return value;
	}

	function fillCommandWord(){
		var value = getCommandWord();
		var bf_value = ['>','<','.','+','-','[',']'];
		for(var i = 0; i < 7; i++){
			if(value[i] == ""){
				value[i] = bf_value[i];
				$('#c'+i).val(bf_value[i]);
			}
		}
		var lang = $('#lang_name').val();
		if(lang == ""){
			$('#lang_name').val('オリジナル言語');
		}
	}

	function makeHelloWorld(){
		var value = getCommandWord();
		var src = "33333333350333333330333333333330333331114602033233333332233320424444444444442133333333244444444233324444442444444442032"
		var transrated = "";
		for(var i = 0, len = src.length; i < len; i++){
			transrated += value[src.charAt(i)];
		}
		return transrated;
	}

	function makeInterpreter(){
		var value = getCommandWord();
		var src = loadInterpreterTemplete();
		return src;
	}

	function loadInterpreterTemplete(){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET","src/templete.txt",true);
		xmlhttp.responseType = 'text';
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState == 4 && xmlhttp.status==200){
				var str = new String(xmlhttp.responseText).toString();
				replaceCommandWord(str);
			}
		}
		xmlhttp.send(null);
	}
	function replaceCommandWord(str){
		var value = getCommandWord();
		var bf_value = ['>','<','.','+','-','[',']'];
		var tmp = [];
		for(var i = 0, len = value.length; i < len; i++){
			tmp[i] = value[i];
		}
		tmp.sort(function(a, b){return b.length - a.length;});
		for(var i = 0, len = value.length; i < len; i++){
			var pos = value.indexOf(tmp[i]);
			str = str.replace(new RegExp("_" + pos,"g"), tmp[i]);
			var p = 0;
			var tar = tmp[i];
			var tlen = tmp[i].length;
			for(var j = 0, tlen = tmp[i].length; j < tlen; j++){
				var c = tmp[i].charAt(j);
				if(c.match(/[\/\\\+\<\>\.\^\$\*\{\}\[\]\?\|]/)){
					tmp[i] = tmp[i].slice(0, j) + "\\\\" + tmp[i].slice(j);
					tlen += 2;
					j += 2;
				}else if(c.match(/[\"]/)){
					tmp[i] = tmp[i].slice(0, j) + "\\" + tmp[i].slice(j);
					tlen += 1;
					j += 1;
				}

			}
			str = str.replace(new RegExp("_rg" + i,"g"), tmp[i]);
			str = str.replace(new RegExp("_cmd" + i,"g"), bf_value[pos]);
		}
		var name = $('#lang_name').val();
		str = str.replace(/_lang/g, name);
		var src = $('#hw_src').val();
		str = str.replace(/_src/g, src);
		$('#ip_src').val(str);
	}

})(jQuery);