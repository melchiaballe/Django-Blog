$(document).ready(function(){
    var base_url = window.location.origin

    $('#updateUserForm').on('submit', function(event){
        event.preventDefault()

        var url = base_url +"/api/user/update/password";

        var new_pass = $('#new_password').val()
        var conf_new_pass = $('#confirm_new_password').val()

        if(new_pass == conf_new_pass){
            $.ajax({
                url:url,
                method:'post',
                data:$(this).serialize(),   
            }).done(function(data){
                alert("DONE CHANGING")
                $('#editModal').modal('hide')
                window.location.href = base_url+"/drf/homepage";
            }).fail(function(error){
                var err = error.responseJSON;
                console.log(err)
                if(err.old_password){
                    $('#old_password').attr('class', 'form-control is-invalid')
                    $('#invalid_old_password').html(err.old_password);
                }
                else{
                    $('#old_password').attr('class', 'form-control is-valid')
                    $('#invalid_old_password').empty();
                }

                if(err.new_password){
                    $('#new_password').attr('class', 'form-control is-invalid')
                    $('#confirm_new_password').attr('class', 'form-control is-invalid')
                    newpass = err.new_password.join(" ");
                    $('#invalid_new_password').html(newpass);
                }else{
                    $('#new_password').attr('class', 'form-control is-valid')
                    $('#confirm_new_password').attr('class', 'form-control is-valid')
                    $('#invalid_new_password').empty();
                }

                $('#editModal').modal('hide')
            })
        }
        else{
            $('#new_password').attr('class', 'form-control is-invalid')
            $('#confirm_new_password').attr('class', 'form-control is-invalid')
            $('#editModal').modal('hide')
        }
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
        name = getSearchName(data);
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
        name = getName(data)
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

    function getName(article){
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

    function getSearchName(owner){
        var name;
        
        if(owner.firstname) {
            name = owner.firstname + " " + owner.lastname;
        }
        else
        {
            name = owner.email;
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
})