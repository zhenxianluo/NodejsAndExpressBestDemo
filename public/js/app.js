$(function(){
	$('.login').on('click', function(event){
		if($('.username').val() == '' || $('.password').val() == '')
			$('.tip').text('用户名或密码不能为空');
		$.post('/login', {username: $('.username').val(), password: $('.password').val()}, function(res){
			if(res.status == 'error'){
				$('.tip').text(res.msg);
			}else if(res.status == 'success'){
				$('.tip').text(res.msg + ' 3秒后跳转');
				setTimeout(function(){
					window.location.href = '/';
				}, 3000);
			}
		}, 'json');
	});
	$('.register').on('click', function(event){
		if($('.username').val() == '' || $('.password').val() == '' || $('.passwordagain').val() == '')
			$('.tip').text('用户名或密码不能为空');
		if($('.username').val() != $('.usernameagain').val())
			$('.tip').text('两次密码输入不一致');
		$.ajax({
			type: 'POST',
			url: '/register',
			dataType: 'json',
			data: {
				username: $('.username').val(),
				password: $('.password').val()
			},
			success: function(res){
				if(res.status == 'error'){
					$('.tip').text(res.msg);
				}else if(res.status == 'success'){
					$('.tip').text(res.msg + '3秒后跳转');
					setTimeout(function(){
						window.location.href = '/login';
					}, 3000);
				}
			}
		});
	});
});
