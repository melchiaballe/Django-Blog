$(document).ready(function(){

    var base_url = window.location.origin;
    var article_id = $('#article_id').val();
    var user_id = $('#user_id').val();

    $.get(base_url +'/api/article/details/'+article_id).done(function(data){
        articleDetails(data);
    })

    $.get(base_url +'/api/article/'+article_id+'/comments').done(function(data) {
        data.forEach(function(e){
            template = getComments(e);
            $('#comment_section').prepend(template)
        })
    })

    //bool check if user liked
    $.get(base_url +'/api/article/'+article_id+'/user/likes').done(function(data) {
        if(user_id != "None"){
            like_btn = likeButton(data);
            $('#like_button').append(like_btn)
            //get total likes
            getTotalLikes()
        }
        else{
            like_btn = NoUserlikeButton()
            $('#like_button').append(like_btn)
            //get total likes
            getTotalLikes()
        }
    })
    
    //OPEN ON MODAL
    //list all who liked the article
    $(document).on('click', '#open_like_user', function(event){

        var url = base_url +'/api/article/'+article_id+'/likes'

        $.ajax({
            url:url,
            method: 'get',
        }).done(function(data){
            data.forEach(function(e){
                template = showLikes(e);
                $('#show_user_like').append(template)
            })
        }).fail(function(error){
            console.log(error)
        })
    })

    $(document).on('click', '#like_btn', function(event){
        checkflag = $(this).val();
        checkflag = (checkflag == 'true');
        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });


        if(checkflag){
            var url = base_url + '/api/article/'+article_id+'/like/delete'

            $.ajax({
                url:url,
                method: 'post',
            }).done(function(data){
                $('#like_btn_div').html("<button id=\"like_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+!checkflag+"\">LIKE</button>")
                $("#show_user_like").empty();
                //get total likes
                getTotalLikes()
            }).fail(function(error){
                console.log(error);
            })
        }
        else{
            
            var url = base_url + '/api/article/'+article_id+'/likes'
            $.ajax({
                url:url,
                method: 'post',
                data:{
                    'likebool': true
                },
            }).done(function(data){
                $('#like_btn_div').html("<button id=\"like_btn\" class=\"btn btn-primary btn-sm\" value=\""+!checkflag+"\">LIKED</button>")
                $("#show_user_like").empty();
                //get total likes
                getTotalLikes()
            }).fail(function(error){
                console.log(error);
            })
        }
    })

    $(document).on('click', '#edit', function(event){
        var comment_id = $(this).data('id');
        $("#edit_comment_id").val(comment_id);

        var url = base_url + "/api/comment/details/" +comment_id

        $.ajax({
            url:url,
            method: 'get',
        }).done(function(data){
            $('#comment_content').attr('class', 'form-control')
            $('#invalid_comment_content').empty()
            $("#comment_content").val(data.content)
        }).fail(function(error){
            console.log(error)
        })
    })

    $(document).on('click', '#btn_edit_article', function(event){

        var url = base_url + "/api/article/details/" +article_id

        $.ajax({
            url:url,
            method: 'get',
        }).done(function(data){
            $('#title').attr('class', 'form-control')
            $('#invalid_title').empty()
            $('#display_default').html(
                "<img src=\""+data.article_image+"\" width=\"50\" height=\"50\"></img>"
                +"<a href=\"http://localhost:8000"+data.article_image+"\">"+data.article_image+"</a>"
            )
            $("#title").val(data.title)
            $("#description").val(data.description)
            tags = data.tags.join(" ");
            $("#tags").val(tags)
        }).fail(function(error){
            console.log(error)
        })
    })

    $('#editArticle').on('submit', function(event){
        event.preventDefault();

        var file_data = $('#article_image').prop('files')[0];
        var title = $('#title').val();
        var description = $('#description').val();
        var tags = $('#tags').val();

        var form_data = new FormData();

        if(file_data != undefined){
            form_data.append('article_image', file_data);
        }

        if(tags != ""){
            form_data.append('tags', tags)
        }

        form_data.append('title', title);
        form_data.append('description', description);

        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        
        url =  base_url+"/api/article/update/"+article_id;
        $.ajax({
            url:url,
            method:$(this).attr('method'),
            processData: false,
            contentType: false,
            data: form_data,
        }).done(function(data){
            $('#tags_div').empty()
            template = getTags(data.tags)
            $('#tags_div').append(template)
            $("#article_title").html(data.title);
            $("#article_description").html(data.description);
            $("#article_img").attr('src', data.article_image)
            $('#edit_article').modal('hide');
        }).fail(function(error){
            var err = error.responseJSON;
            if(err.title){
                $('#title').attr('class', 'form-control is-invalid')
                $('#invalid_title').html(err.title)
            }
        })
    })

    $("#show_users").on("hide.bs.modal", function () {
        $("#show_user_like").empty();
    });

    $('#editComment').on('submit', function(event){
        event.preventDefault();
        comment_id = $('#edit_comment_id').val();

        url =  base_url+"/api/comment/update/"+comment_id;
        $.ajax({
            url:url,
            method:$(this).attr('method'),
            data: $(this).serialize()
        }).done(function(data){
            $('#comment_content').attr('class', 'form-control')
            $('#invalid_comment_content').empty()
            $('#comment_content'+data.id).html("&nbsp"+data.content)
            $('#edit_comment').modal('hide');
        }).fail(function(error){
            var err = error.responseJSON;
            if(err.content)
            {
                $('#comment_content').attr('class', 'form-control is-invalid')
                $('#invalid_comment_content').html(err.content)
            }
        })
    })

    $('#addComment').on('submit', function(event){
        event.preventDefault();
        var url = $(this).attr('action');
        
        $.ajax({
            url:url,
            method: $(this).attr('method'),
            data: $(this).serialize()
        }).done(function(data) {
            var comment = data;
            $('#content').attr('class', 'form-control')
            $('#invalid_content').empty()
            template = getComments(comment)
            $('#content').val('')
            $('#comment_section').append(template)
        }).fail(function(error) {
            var err = error.responseJSON;
            if(err.content)
            {
                $('#content').attr('class', 'form-control is-invalid')
                $('#invalid_content').html(err.content)
            }
        })
    })

    $(document).on('click', '#delete', function(event){
        var comment_id = $(this).data('id');
        $("#delete_comment_id").val(comment_id);

    })

    $('#deleteComment').on('submit', function(event){
        event.preventDefault();
        comment_id = $('#delete_comment_id').val()

        url =  base_url+"/api/comment/"+comment_id+"/delete";
        $.ajax({
            url:url,
            method:$(this).attr('method'),
            data: $(this).serialize()
        }).done(function(){
            $("#comment"+comment_id).remove();
            $('#delete_comment').modal('hide');
        }).fail(function(error){
            console.log(error)
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
        else if(search_type == 'tags'){
            $.get(base_url+"/api/search/tags/", data).done(function(data){
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

    function getComments(data){
        name = getName(data);
        img = userAvatar(data);
        edit = enableEditDelete(data);
        var template=
        "<div class=\"row\" id=\"comment" + data.id+"\">"
        +    "<div class=\"col-md-10\">"
        +        "<div class=\"d-flex\">"
        +            img
        +            "<div>"
        +                "&nbsp<i><b>"+name+"</b></i>"
        +                "<p id=\"comment_content"+data.id+"\">&nbsp" + data.content + "</p>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +    "<div class=\"col-md-2\">"
        +        edit
        +    "</div>"
        +"</div>"

        return template
    }

    function showLikes(data){
        name = getName(data);
        img = userAvatar(data);

        var template=
        "<div class=\"row\" id=\"like\""+data.id+">"
        +    "<div class=\"col-md\">"
        +        "<div class=\"d-flex\">"
        +            img
        +            "<div>"
        +                "&nbsp <a href=\""+base_url+"/drf/user/article/"+data.owner.id+"\"><i><b>"+name+"</b></i></a>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +"</div>"

        return template;
    }

    function userAvatar(data) {
        var img = "";
        if(data.owner.avatar)
        {
            img = "<img src=\""+data.owner.avatar+"\" width=\"40\" height=\"40\">"
        }
        return img
    }

    function articleDetails(data){
        name = getName(data);
        edit = enableEdit(data);
        img = hasImage(data);
        tags = getTags(data.tags);

        var template = "<div align=\"center\">"
        +    "<h1 class=\"display-3\" id=\"article_title\">"+data.title+"</h1>"
        +       "<div id=\"tags_div\" align=\"center\">"
        +           tags
        +       "</div>"
        +       "<br/>"
        +    "<p>"
        +        "<b>Author:</b><a href=\""+base_url+"/drf/user/article/"+data.owner.id+"\">" + name + "</a>&nbsp"
        +        edit
        +    "</p>"
        +    img
        +"</div>"
        +"<div class=\"articledetails\">"
        +    "<p class=\"text-justify\" id=\"article_description\">"+data.description+"</p>"
        +"</div>";

        $('#article_details').prepend(template)
    }

    function getTags(data){
        template=""
        data.forEach(function(e){
            template += "<button class=\"btn btn-outline-primary\">" + e + "</button> &nbsp"
        });
        return template
    }

    function enableEditDelete(data){
        var edit = "";
        if(data.owner.id == user_id)
        {
            edit = 
            "<button id=\"edit\" name=\"edit\" class=\"btn btn-outline-secondary btn-sm\" data-id=\""+data.id+"\" data-toggle=\"modal\" data-target=\"#edit_comment\">Edit</button> &nbsp"
            + "<button id=\"delete\" name=\"delete\" class=\"btn btn-outline-danger btn-sm\" data-id=\""+data.id+"\" data-toggle=\"modal\" data-target=\"#delete_comment\" >Delete</button>"
        }
        return edit;
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

    function enableEdit(data){
        var edit = "";
        if(data.owner.id == user_id)
        {
            edit = "<a id=\"btn_edit_article\" href=\"\" data-toggle=\"modal\" data-target=\"#edit_article\"><i>edit</i></a>";
        }
        return edit;
    }

    function hasImage(data){
        var img = "";
        if(data.article_image)
        {
            img = "<img id=\"article_img\" class=\"img-responsive\" src=\""+data.article_image+"\" width=\"600\" height=\"320\"></img>";
        }
        return img
    }

    function likeButton(data){
        if(data){
            btn = 
                "<div class=\"row\">"
                +   "<div class=\"col-sm-1\" id=\"like_btn_div\"><button id=\"like_btn\" class=\"btn btn-primary btn-sm\" value=\""+data+"\">LIKED</button></div> &nbsp"
                +   "<div class=\"col-sm\">"
                +   "<button class=\"btn btn-outline-primary btn-sm\" id=\"open_like_user\" data-toggle=\"modal\" data-target=\"#show_users\">"
                +       "<span class=\"badge badge-light\" id=\"total_likes\">totaaaaal likes</span> people liked this article</button>"
                +"</div>"
                +"</div>";
        }
        else{
            btn = 
                "<div class=\"row\">"
                +   "<div class=\"col-sm-1\" id=\"like_btn_div\"><button id=\"like_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+data+"\">LIKE</button></div> &nbsp"
                +   "<div class=\"col-sm\">"
                +   "<button class=\"btn btn-outline-primary btn-sm\" id=\"open_like_user\" data-toggle=\"modal\" data-target=\"#show_users\">"
                +       "<span class=\"badge badge-light\" id=\"total_likes\">totaaaaal likes</span> people liked this article</button>"
                +"</div>"
                +"</div>";
        }

        return btn;
    }

    function NoUserlikeButton(){
        var btn = "<button class=\"btn btn-outline-primary btn-sm\" id=\"open_like_user\" data-toggle=\"modal\" data-target=\"#show_users\">"
               + "<span class=\"badge badge-light\" id=\"total_likes\">totaaaaal likes</span> people liked this article</button>"
        return btn;
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

    function getTotalLikes(){
        $.get(base_url +'/api/article/'+article_id+'/total/likes').done(function(data) {
            $('#total_likes').html(data)
        })
    }
})