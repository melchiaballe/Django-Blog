$(document).ready(function(){
    console.log("I AM READY TO REGISTER")
    var base_url = window.location.origin;

    $('#registerForm').on('submit', function(event){
        event.preventDefault();
        var url = base_url +"/api/user"
        $.ajax({
            url:url,
            method:"post",
            data:$(this).serialize(),
        }).done(function(data){
            alert("SUCCESS")
        }).fail(function(errors){
            console.log(errors)
        })
    })
})