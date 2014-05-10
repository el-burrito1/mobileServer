$(document).on('ready' , function(){
		$.ajax({
		type: 'POST',
		url:"http://localhost:3000/ajax",
		data: {'test':'this is coming from express'},
		dataType: 'json',
		crossDomain: true,
		success: function(data){
			console.log('data is from ajax');
		},
		error: function(){
			console.log('there was an error');
		}
	});
})