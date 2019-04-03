$(document).ready(function(){
    console.log("I AM READY TO REGISTER")
    var base_url = window.location.origin;

    $('#registerForm').on('submit', function(event){
        event.preventDefault();
        var url = base_url +"/api/user";
        var pass1 = $('#password').val();
        var pass2 = $('#password2').val();

        if(pass1 == pass2){
            $.ajax({
                url:url,
                method:"post",
                data:$(this).serialize(),
            }).done(function(data){
                alert("SUCCESS")
                window.location.href = base_url+"/users/accounts/login";
            }).fail(function(errors){
                console.log(errors)
            })
        }
        else{
            alert("PASSWORD DO NOT MATCH")
        }
    })
})