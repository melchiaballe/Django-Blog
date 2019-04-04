$(document).ready(function(){

    var base_url = window.location.origin;
    var user_id = $('#user_id').val();

    $.get(base_url+'/api/user/'+user_id).done(function(data){
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

        if(file_data == undefined){
            form_data.append('email', email);
            form_data.append('firstname', firstname);
            form_data.append('lastname', lastname);
            form_data.append('about_me', about_me);
        }
        else{
            form_data.append('email', email);
            form_data.append('firstname', firstname);
            form_data.append('lastname', lastname);
            form_data.append('about_me', about_me);
            form_data.append('avatar', file_data);
        }

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
            $('#display_default').html(
                "<img src=\""+data.avatar+"\" width=\"50\" height=\"50\"></img>"
                +"<a href=\"http://localhost:8000"+data.avatar+"\">"+data.avatar+"</a>"
            )
            $('#profile_picture').attr("src", data.avatar)
            $('#btn_name').html(getName(data))
            $('#editModal').modal('hide');
        }).fail(function(errors){
            console.log(errors);
        })
    })

    $('form[name=search_form]').on('submit', function(event) {
        event.preventDefault();
        var data = $(this).serialize();
        
        var search_type = $('#search_type').val()

        if(search_type == 'user'){
            $.get(base_url+"/api/search/user/", data).done(function(data){
                data.forEach(function(e){
                    template = showSearchedUser(e);
                    $('#search_base').append(template)
                })
                $('#search_output').modal('show');
            }).fail(function(error){
                console.log(error)
                $('#search_output').modal('show');
            })
        }
        else{
            $.get(base_url+"/api/search/article/", data).done(function(data){
                data.forEach(function(e){
                    template = showSearchedArticle(e);
                    $('#search_base').append(template)
                })
                $('#search_div').attr('class', 'modal-dialog modal-lg');
                $('#search_output').modal('show');
            }).fail(function(error){
                console.log(error)
                $('#search_output').modal('show');
            })
        }
    })

    $("#search_output").on("hide.bs.modal", function () {
        $("#search_base").empty();
    });

    function showSearchedUser(data){
        name = getName(data);
        img = getSearchAvatar(data);

        var template=
        "<div class=\"row\" style=\"border-bottom:1px solid gray\">"
        +    "<div class=\"col-md\">"
        +        "<div class=\"d-flex\">"
        +            img
        +            "<div>"
        +                "&nbsp <a href=\""+base_url+"/drf/user/article/"+data.id+"\"><i><b>"+name+"</b></i></a>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +"</div>"

        return template;
    }

    function showSearchedArticle(data){
        name = getSearchName(data)
        var template=
        "<div class=\"row\" style=\"border-bottom:1px solid gray\">"
        +    "<div class=\"col-md\">"
        +        "<div>"
        +            "<b>"+data.title+"</b>"
        +            "&nbsp <i>Author:<a href=\""+base_url+"/drf/user/article/"+data.owner.id+"\"><b>"+name+"</b></a></i>"
        +            "<div>"
        +                "<p>&nbsp&nbsp"+jQuery.trim(data.description).substring(0, 50).split(" ").slice(0, -1).join(" ") + "..."
        +                   "<a href=\""+base_url+"/drf/article/details/"+data.id+"\">"
        +                       "<b> Continue reading</b>"
        +                   "</a>"+"</p>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +"</div>"
        return template;
    }

    function getSearchName(article){
        var name;
        
        if(article.owner.firstname) {
            name = article.owner.firstname + " " + article.owner.lastname;
        }
        else
        {
            name = article.owner.email;
        }
        return name;
    }

    function getSearchAvatar(data) {
        var img = "";
        if(data.avatar)
        {
            img = "<img src=\""+data.avatar+"\" width=\"40\" height=\"40\">"
        }
        return img
    }

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