$(document).ready(function(){

    var base_url = window.location.origin;
    var user_id = $('#user_id').val();

    $.get(base_url+'/api/user/'+user_id).done(function(data){
        console.log(data);
        $('#email').val(data.email);
        $('#firstname').val(data.firstname);
        $('#lastname').val(data.lastname);
        $('#about_me').val(data.about_me);
    })

    $('#updateUserForm').on('submit', function(event){
        event.preventDefault();

        var file_data = $('#avatar').prop('files')[0];
        var email = $('#email').val();
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var about_me = $('#about_me').val();

        var form_data = new FormData();

        form_data.append('email', email);
        form_data.append('firstname', firstname);
        form_data.append('lastname', lastname);
        form_data.append('about_me', about_me);
        form_data.append('avatar', file_data);

        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        var url = base_url +"/api/user/update"
        $.ajax({
            url:url,
            method:'post',
            processData: false,
            contentType: false,
            data:form_data,
        }).done(function(data) {
            $('#btn_name').html(getName(data))
            alert("EDIT SUCCESS");
            $('#editModal').modal('hide');
        }).error(function(errors){
            console.log(errors);
        })
    })

    // $('#updateUserForm').on('submit', function(event){
    //     event.preventDefault();
        
    //     var url = base_url +"/api/user/update"
    //     $.ajax({
    //         url:url,
    //         method:'post',
    //         data:$(this).serialize(),
    //     }).done(function(data) {
    //         $('#btn_name').html(getName(data))
    //         alert("EDIT SUCCESS");
    //         $('#editModal').modal('hide');
    //     }).error(function(errors){
    //         console.log(errors);
    //     })
    // })


    function getName(owner){
        var name;
        
        if(owner.firstname) {
            name = owner.firstname;
        }
        else
        {
            name = owner.email;
        }
        return name;
    }
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
})