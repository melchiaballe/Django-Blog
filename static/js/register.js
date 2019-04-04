$(document).ready(function(){
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
            }).fail(function(error){
                var err = error.responseJSON;
                if(err.password){
                    $('#password').attr('class', 'form-control is-invalid')
                    $('#password2').attr('class', 'form-control is-invalid')
                }
                else{
                    $('#password').attr('class', 'form-control is-valid')
                    $('#password2').attr('class', 'form-control is-valid')
                }

                if(err.email){
                    $('#email').attr('class', 'form-control is-invalid')
                }
                else{
                    $('#email').attr('class', 'form-control is-valid')
                }
            })
        }
        else{
            $('#password').attr('class', 'form-control is-invalid')
            $('#password2').attr('class', 'form-control is-invalid')
        }
    })
})