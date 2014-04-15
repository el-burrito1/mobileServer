$(document).on('ready' , function(){
		$.ajax({
		type: 'POST',
		url:"http://localhost:3000/test",
		data: {'test':'test'},
		dataType: 'jsonp',
		crossDomain: true,
		success: function(data){
			console.log('data successfully sent');
		},
		error: function(){
			console.log('there was an error');
		}
	});
})