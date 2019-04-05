$(document).ready(function(){
    var base_url = window.location.origin;

    var user_id = $('#user_id').val();
    var request_user_id = $('#request_user_id').val();

    $(document).on('submit', '#addComment', function(event){
        var article_id = $('#article_id_comment').val()
        event.preventDefault();

        var url = base_url+"/api/"+article_id+"/comment"

        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        
        $.ajax({
            url:url,
            method:"post",
            data: $(this).serialize(),
        }).done(function(data){
            var comment = data;
            $('#content').attr('class', 'form-control')
            $('#invalid_content').empty()
            template = getComments(comment)
            $('#content').val('')
            $('#comment_list').append(template)
            total_comment = getTotalComments(article_id)
            $('#total_comments'+article_id).html(total_comment)
        }).fail(function(error){
            var err = error.responseJSON;
            if(err.content)
            {
                $('#content').attr('class', 'form-control is-invalid')
                $('#invalid_content').html(err.content)
            }
        })
    })

    $(document).on('click', '#homepage_comment_btn', function(event){
        var article_id = $(this).data('id');
        $('#article_id_comment').val(article_id)
        
        if(user_id != "None"){
            user = userCommentFields();
            $('#comments_base').append(user)
        }
        else{
            div = viewCommentFields()
            $('#comments_base').append(div)
        }

        $.get(base_url +'/api/article/'+article_id+'/comments').done(function(data) {
            $.get(base_url+"/api/article/details/"+article_id).done(function(data){
                $('#comment_title').html("<h3>"+data.title+"</h3>")
            })

            data.forEach(function(e){
                template = getComments(e)
                $('#comment_list').prepend(template)
            })
        })
    })

    $(document).on('click', '#homepage_like_btn', function(event){
        var article_id = $(this).data('id');

        $('#article_id_cont').val(article_id)

        $.get(base_url +'/api/article/'+article_id+'/user/likes').done(function(data) {
            if(request_user_id != "None"){
                like_btn = likeButton(data);
                $('#likes_base').append(like_btn)
            }
            else{
                div = likeListDiv()
                $('#likes_base').append(div)
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

                $.get(base_url+"/api/article/details/"+article_id).done(function(data){
                    $('#likes_title').html("<h3>"+data.title+"</h3>")
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
            if (user_id != request_user_id){
                $.ajax({
                    url:url,
                    method: 'post',
                }).done(function(data){
                    $('#like_btn_div').html("<button id=\"like_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+!checkflag+"\">LIKE</button>")
                    $('#like'+request_user_id).remove()
                    var total_likes = getTotalLikes(article_id);
                    $('#total_likes'+article_id).html(total_likes)
                }).fail(function(error){
                    console.log(error);
                })
            }
            else{
                $.ajax({
                    url:url,
                    method: 'post',
                }).done(function(data){
                    $('#like_btn_div').html("<button id=\"like_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+!checkflag+"\">LIKE</button>")
                    $('#like'+user_id).remove()
                    var total_likes = getTotalLikes(article_id);
                    $('#total_likes'+article_id).html(total_likes)
                }).fail(function(error){
                    console.log(error);
                })
            }
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
                template = showLikes(data);
                var total_likes = getTotalLikes(article_id);
                $('#total_likes'+article_id).html(total_likes)
                $('#like_list').append(template)
            }).fail(function(error){
                console.log(error);
            })
        }
    })

    if (user_id != request_user_id){
        $.get(base_url +'/api/follows/user/'+user_id).done(function(data){
            if(data){
                $('#follow_user').html("<button id=\"follow_btn\" class=\"btn btn-primary btn-sm\" value=\""+data+"\" ><b>Followed</b></button>");
            }
            else{
                $('#follow_user').html("<button id=\"follow_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+data+"\" ><b>Follow Me</b></button>");
            }
            $('#follow_container').html("<button id=\"following_btn\" class=\"btn btn-outline-info btn-sm\" style=\"margin-right:4px\" data-toggle=\"modal\" data-target=\"#following_modal\">FOLLOWING &nbsp<span id=\"following_count\" class=\"badge badge-light\"></span></button>" +
            "<button id=\"follower_btn\" class=\"btn btn-outline-info btn-sm\" data-toggle=\"modal\" data-target=\"#follower_modal\">FOLLOWERS &nbsp<span id=\"follower_count\" class=\"badge badge-light\"></span></button>");
            getTotalFollowing(user_id);
            getTotalFollower(user_id);

        });
    }
    else{
        $('#follow_container').html("<button id=\"following_btn\" class=\"btn btn-outline-info btn-sm\" style=\"margin-right:4px\" data-toggle=\"modal\" data-target=\"#following_modal\">FOLLOWING &nbsp<span id=\"following_count\" class=\"badge badge-light\"></span></button>" +
        "<button id=\"follower_btn\" class=\"btn btn-outline-info btn-sm\" data-toggle=\"modal\" data-target=\"#follower_modal\">FOLLOWERS &nbsp<span id=\"follower_count\" class=\"badge badge-light\"></span></button>");
        getTotalFollowing(user_id);
        getTotalFollower(user_id);
    }

    $(document).on('click', '#following_btn', function(event){
        var url = base_url+"/api/user/"+user_id+"/following";
        $.ajax({
            url:url,
            method:"get",
        }).done(function(data){
            data.forEach(function(e){
                template = showfollowing(e);
                $('#following_base').append(template);
            })
        }).fail(function(errors){
            console.log(errors);
        })
    })

    $(document).on('click', '#follower_btn', function(event){
        var url = base_url+"/api/user/"+user_id+"/followers";
        $.ajax({
            url:url,
            method:"get",
        }).done(function(data){
            data.forEach(function(e){
                template = showfollower(e)
                $('#follower_base').append(template)
            })
        }).fail(function(errors){
            console.log(errors);
        })
    })

    $(document).on('click', '#dismiss_follower', function(event){
        $("#follower_base").empty();
    })

    $(document).on('click', '#dismiss_following', function(event){
        $("#following_base").empty();
    })

    $("#comments_output").on("hide.bs.modal", function () {
        $("#comments_base").empty();
    });

    $(document).on('click', '#follow_btn', function(event){
        var csrftoken = getCookie('csrftoken');
        followbool = $('#follow_btn').val();
        followbool = (followbool == 'true');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        if(followbool)
        {
            var url = base_url+"/api/user/"+user_id+"/remove/follow"
            $.ajax({
                url:url,
                method:"post",
            }).done(function(data) {
                $('#follow_user').html("<button id=\"follow_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+!followbool+"\" ><b>Follow Me</b></button>");
                getTotalFollowing(user_id);
                getTotalFollower(user_id);
            }).fail(function(errors){
                console.log(errors)
            });
        }
        else{
            var url = base_url+"/api/user/"+user_id+"/follow"
            $.ajax({
                url:url,
                method:"post",
                data:{
                    'followbool':true
                },
            }).done(function(data) {
                $('#follow_user').html("<button id=\"follow_btn\" class=\"btn btn-primary btn-sm\" value=\""+!followbool+"\" ><b>Followed</b></button>");
                getTotalFollowing(user_id);
                getTotalFollower(user_id);
            }).fail(function(errors){
                console.log(errors)
            });
        }
    })

    $.get(base_url+'/api/article/user/'+user_id).done(function(data){
        data.forEach(function(e){
            createTemplate(e)
        })
    })

    $(document).on('click', '#edit', function(event){
        var article_id = $(this).data('id');
        $("#edit_article_id").val( article_id );

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
            $("#tags").val(tags);
        }).fail(function(error){
            console.log(error)
        })
    })

    $(document).on('click', '#delete', function(event){
        var article_id = $(this).data('id');
        $("#delete_article_id").val( article_id );
    })

    //---------------------------------------------------------------------------------------------------------------------------------------
    $('#editArticle').on('submit', function(event){
        event.preventDefault();
        article_id = $('#edit_article_id').val();

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
            $("#article_title"+article_id).html(data.title);
            $("#article_description"+article_id).html(
                "<p class=\"text-justify\">"
                +   jQuery.trim(data.description).substring(0, 150).split(" ").slice(0, -1).join(" ") + "..."
                +   "<a href=\""+base_url+"/drf/article/details/"+data.id+"\" >"
                +   "<b> Continue Reaing</b></a></p>"
            );
            $('#edit_article').modal('hide');
        }).fail(function(error){
            var err = error.responseJSON;
            if(err.title){
                $('#title').attr('class', 'form-control is-invalid')
                $('#invalid_title').html(err.title)
            }
        })
    })
    //---------------------------------------------------------------------------------------------------------------------------------------

    $('#deleteArticle').on('submit', function(event){
        event.preventDefault();
        article_id = $('#delete_article_id').val()

        url =  base_url+"/api/article/"+article_id+"/delete";
        $.ajax({
            url:url,
            method:$(this).attr('method'),
            data: $(this).serialize()
        }).done(function(){
            $("#article"+article_id).remove();
            $('#delete_article').modal('hide');
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

    $("#likes_output").on("hide.bs.modal", function () {
        $("#likes_base").empty();
    });

    // $("#edit_article").on("hide.bs.modal", function () {
    //     $("#title").val(" ");
    //     $("#article_image").val(" ");
    //     $("#description").val(" ");
    //     $("#tags").val(" ");
    // });

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

    function createTemplate(article) {
        var name = getName(article);
        var btn = allowEdit(article);

        var template =
            "<div class=\"container\" id=\"article"+article.id+"\">"
            +    "<div align=\"center\" style=\"border-top:1px solid gray\">"
            +        "<div><h2><b id=\"article_title"+article.id+"\">"
            +            article.title
            +            "</b></h2> <p><b> Author: </b>"
            +                name
            +        "</p></div>"
            +    "<div class=\"articledetailshome\" id=\"article_description"+article.id+"\">"
            +        "<p class=\"text-justify\">"
            +            jQuery.trim(article.description).substring(0, 150).split(" ").slice(0, -1).join(" ") + "..."
            +            "<a href=\""+base_url+"/drf/article/details/"+article.id+"\" >"
            +            "<b> Continue Reaing</b></a></p>"
            +    "</div>"
            +    "<div class=\"text-left\" style=\"margin-left:20px\">"
            +    btn
            +"</div></div></br><br/>";
        $('#articles').prepend(template);
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

    function allowEdit(article){
        var btn;
        var total_likes = getTotalLikes(article.id)
        var total_comments = getTotalComments(article.id)
        if(article.owner.id != request_user_id) {
            btn = "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\" id=\"homepage_like_btn\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#likes_output\">Likes &nbsp<span id=\"total_likes"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
            +    "<button id=\"homepage_comment_btn\" class=\"btn btn-secondary btn-sm\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#comments_output\">Comments &nbsp<span id=\"total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>";
        }
        else
        {
            btn =
            "<div class=\"row\">"
                +"<div class=\"col-md-6\">"
                +   "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\" id=\"homepage_like_btn\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#likes_output\">Likes &nbsp<span id=\"total_likes"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
                +    "<button id=\"homepage_comment_btn\" class=\"btn btn-secondary btn-sm\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#comments_output\">Comments &nbsp<span id=\"total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
                +"</div>"
                +"<div class=\"col-md-6\">"
                +    "<div class=\"text-right\">"
                    +    "<button id=\"edit\" name=\"edit\" class=\"btn btn-outline-secondary btn-sm\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#edit_article\" style=\"margin-right: 4px;\">Edit &nbsp</button>"
                    +    "<button id=\"delete\" name=\"delete\" class=\"btn btn-outline-danger btn-sm\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#delete_article\">Delete &nbsp</button>";
                +    "</div>"
                +"</div>"
            +"</div>"
        }
        return btn;
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

    //
    // FOLLOWING
    //
    function showfollowing(data){
        name = getFollowingName(data);
        img = userFollowingAvatar(data);

        var template=
        "<div class=\"row\">"
        +    "<div class=\"col-md\">"
        +        "<div class=\"d-flex\">"
        +            img
        +            "<div>"
        +                "&nbsp <a href=\""+base_url+"/drf/user/article/"+data.following.id+"\"><i><b>"+name+"</b></i></a>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +"</div>"

        return template;
    }

    function getFollowingName(article){
        var name;

        if(article.following.firstname) {
            name = article.following.firstname + " " + article.following.lastname;
        }
        else
        {
            name = article.following.email;
        }
        return name;
    }

    function userFollowingAvatar(data) {
        var img = "";
        if(data.following.avatar)
        {
            img = "<img src=\""+data.following.avatar+"\" width=\"40\" height=\"40\">"
        }
        return img
    }

    function getTotalFollowing(owner_id){
        $.get(base_url +'/api/user/'+owner_id+'/total/following').done(function(data) {
            $('#following_count').html(data)
        })
    }

    //
    //FOLLOWER
    //
    function showfollower(data){
        name = getName(data);
        img = userAvatar(data);

        var template=
        "<div class=\"row\">"
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

    function getTotalFollower(owner_id){
        $.get(base_url +'/api/user/'+owner_id+'/total/follower').done(function(data) {
            $('#follower_count').html(data)
        })
    }

    function userAvatar(data) {
        var img = "";
        if(data.owner.avatar)
        {
            img = "<img src=\""+data.owner.avatar+"\" width=\"40\" height=\"40\">"
        }
        return img
    }

    function likeButton(data){
        if(data){
            btn = "<div id=\"likes_title\" align=\"center\"></div>"
                + "<div id=\"like_btn_div\"><button id=\"like_btn\" class=\"btn btn-primary btn-sm\" value=\""+data+"\">LIKED</button></div> &nbsp"
                + "<div id=\"like_list\"></div>"
        }
        else{
            btn = "<div id=\"likes_title\" align=\"center\"></div>"
                + "<div id=\"like_btn_div\"><button id=\"like_btn\" class=\"btn btn-outline-primary btn-sm\" value=\""+data+"\">LIKE</button></div> &nbsp"
                + "<div id=\"like_list\"></div>"
        }

        return btn;
    }

    function likeListDiv(){
        div = "<div id=\"likes_title\" align=\"center\"></div>"
            +"<div id=\"like_list\"></div>"

        return div
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

    function getComments(data){
        name = getName(data);
        img = userAvatar(data);
        var template=
        "<div class=\"row\" id=\"comment" + data.id+"\">"
        +    "<div class=\"col-md-8\">"
        +        "<div class=\"d-flex\">"
        +            img
        +            "<div>"
        +                "&nbsp<i><b>"+name+"</b></i>"
        +                "<p id=\"comment_content"+data.id+"\">&nbsp" + data.content + "</p>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +"</div>"

        return template
    }

    function viewCommentFields(){
        div = "<div id=\"comment_title\" align=\"center\"></div>" 
            + "<div id=\"comment_list\"></div>"

        return div
    }

    function userCommentFields(){
        btn = "<div id=\"comment_title\" align=\"center\"></div>"
            + "<div id=\"comment_input_div\">"
            +    "<form id=\"addComment\" name=\"addComment\" novalidate>"
            +            "<div class=\"form-group\">"
            +                "<label>Comment</label>"
            +                "<input type=\"text\" id=\"content\" name=\"content\" class='form-control' placeholder='Enter a comment'>"
            +                "<div id=\"invalid_content\" class=\"invalid-feedback\">"
            +                "</div>"
            +            "</div>"
            +    "</form>"
            +    "<div class=\"text-right\">"
            +        "<button type=\"submit\" class=\"btn btn-outline-dark\" form=\"addComment\">Add Comment</button>"
            +    "</div>"
            + "</div>"
            + "<div id=\"comment_list\"></div>"

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
})