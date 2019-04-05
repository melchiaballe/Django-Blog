$(document).ready(function() {

    var base_url = window.location.origin;
    var user_id = $('#user_id').val();
    
    $.get(base_url+'/api/article/user/'+user_id+'/likes').done(function(data){
        data.forEach(function(e){
            listLikedArticles(e)
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

    $("#likes_output").on("hide.bs.modal", function () {
        $("#likes_base").empty();
    });

    $(document).on('click', '#homepage_like_btn', function(event){
        var article_id = $(this).data('id');

        $('#article_id_cont').val(article_id)

        $.get(base_url +'/api/article/'+article_id+'/user/likes').done(function(data) {
            if(user_id != "None"){
                like_btn = likeButton(data);
                $('#likes_base').append(like_btn)
            }

            var url = base_url +'/api/article/'+article_id+'/likes'
            $.ajax({
                url:url,
                method: 'get',
            }).done(function(data){
                data.forEach(function(e){
                    template = showLikes(e);
                    $('#like_list').append(template)
                })
            }).fail(function(error){
                console.log(error)
            })
        })
    })

    $(document).on('click', '#like_btn', function(event){
        checkflag = $(this).val();
        checkflag = (checkflag == 'true');
        var article_id = $('#article_id_cont').val();
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
                $('#articlediv'+article_id).remove()
                $('#likes_output').modal('hide');
            }).fail(function(error){
                console.log(error);
            })
        }
    })

    function likeButton(data){
        if(data){
            btn = "<div id=\"like_btn_div\"><button id=\"like_btn\" class=\"btn btn-primary btn-sm\" value=\""+data+"\">LIKED</button></div> &nbsp"
                + "<div id=\"like_list\"></div>"
        }
        else{
            btn = "<div id=\"like_btn_div\"><button id=\"like_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+data+"\">LIKE</button></div> &nbsp"
                + "<div id=\"like_list\"></div>"
        }

        return btn;
    }

    function showLikes(data){
        name = getName(data);
        img = userAvatar(data);

        var template=
        "<div class=\"row\" id=\"like"+data.owner.id+"\">"
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

    function listLikedArticles(data){
        var name = getName(data)
        var total_likes = getTotalLikes(data.article.id)
        var total_comments = getTotalComments(data.article.id)

        var template="<div id=\"articlediv"+data.article.id+"\" class=\"container\">"
        +    "<div style=\"border-top:1px solid gray\">"
        +        "<div><h2><b>" 
        +            data.article.title
        +            "</b></h2> <p><b> Author: </b>"
        +            "<a href=\""+base_url +"/drf/user/article/"+data.owner.id+"\">"
        +               name
        +            "</a>"
        +        "</p></div>"
        +    "<div class=\"articledetailshome\">"
        +        "<p class=\"text-justify\">"
        +            jQuery.trim(data.article.description).substring(0, 200).split(" ").slice(0, -1).join(" ") + "..."
        +            "<a href=\""+base_url +"/drf/article/details/"+data.article.id+"\" >"
        +            "<b> Continue Reaing</b></a></p>"
        +    "</div>"
        +    "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\" id=\"homepage_like_btn\" data-id=\""+data.article.id+"\" data-toggle=\"modal\" data-target=\"#likes_output\">Likes &nbsp<span id=\"total_likes"+data.article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
        +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"total_comments"+data.article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
        +"</div><br/>";
        
        // $('#likedarticles').prepend(template);
        $('#likedarticles').prepend(template);
    }

    function getTotalComments(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
            $('#total_comments'+article_id).html(data)
        })
    }

    function getTotalLikes(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/likes').done(function(data) {
            $('#total_likes'+article_id).html(data)
        })
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