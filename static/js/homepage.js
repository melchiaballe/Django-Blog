$(document).ready(function(){
    var base_url = window.location.origin;
    var user_id = $('#user_id').val();

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
                $('#like'+user_id).remove()
                var total_likes = getTotalLikes(article_id);
                $('#total_likes'+article_id).html(total_likes)
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
                template = showLikes(data);
                var total_likes = getTotalLikes(article_id);
                $('#total_likes'+article_id).html(total_likes)
                $('#like_list').append(template)
            }).fail(function(error){
                console.log(error);
            })
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

    $('#add_article').on('click', function(event){
        event.preventDefault();
        $('#title').attr('class', 'form-control')
        $('#invalid_title').empty()
    })

    $("#search_output").on("hide.bs.modal", function () {
        $("#search_base").empty();
    });

    $("#likes_output").on("hide.bs.modal", function () {
        $("#likes_base").empty();
    });

    $("#pagination_form").on('submit', function(event){
        event.preventDefault()
        url = document.activeElement.getAttribute('value')

        $.ajax({
            url:url,
            method:'get',
        }).done(function(data){
            $('#articles').empty();
            $('#pagination_ul').empty()

            data.results.forEach(function(e){
                template = articleTemplate(e)
                $('#articles').append(template);
            })
            if(data.pagination.has_prev){
                template = paginationHasPrev(data.pagination.has_prev)
                $('#pagination_ul').append(template)
            }
            for(i=1; i <= data.pagination.total_pages; i++){
                template = pagination(i)
                $('#pagination_ul').append(template)
            }
            if(data.pagination.has_next){
                template = paginationHasNext(data.pagination.has_next)
                $('#pagination_ul').append(template)
            }
        })
    })

    $.get(base_url +'/api/article/featured').done(function(data){
        var i;
        for (i = 0; i < data.length; i++) {
            if (i==0)
            {
                jumbotronTemplate(data[i]);
            }
            else
            {
                thumbnailTemplate(data[i]);
            }
        }
    })

    $.get(base_url + "/api/article/random").done(function(data){
        data.forEach(function(e){
            listRandomArticles(e);
        })
    })

    function listRandomArticles(data){
        template = "<li><b><a href=\""+base_url+"/drf/article/details/"+data.id+"\">"+data.title+"</a></b></li>"

        $('#random_read_list').append(template)
    }

    $.get(base_url +'/api/article').done(function(data){
        data.results.forEach(function(e){
            template = articleTemplate(e)
            $('#articles').append(template);
        })
        if(data.pagination.has_prev){
            template = paginationHasPrev(data.pagination.has_prev)
            $('#pagination_ul').append(template)
        }
        for(i=1; i <= data.pagination.total_pages; i++){
            template = pagination(i)
            $('#pagination_ul').append(template)
        }
        if(data.pagination.has_next){
            template = paginationHasNext(data.pagination.has_next)
            $('#pagination_ul').append(template)
        }
    })

    $('.article-form').on('submit', function(event) {
        event.preventDefault();
        //create article
        var dt = $('#date').val(new Date($.now()));

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

        var url = $(this).attr('action');

        var jqhr = $.ajax({
                url:url,
                method:$(this).attr('method'),
                processData: false,
                contentType: false,
                data: form_data,
            }).done(function(data){
                var article = data;
                template = articleTemplate(article)
                $('#articles').prepend(template);
                $('#addModal').modal('hide');
                clearUserInputFields();        
            }).fail(function(error) {
                var err = error.responseJSON;
                if(err.title){
                    $('#title').attr('class', 'form-control is-invalid')
                    $('#invalid_title').html(err.title)
                }
            });
    });

    function pagination(page){
        var template = "<li class=\"page-item\"><button type=\"submit\" class=\"page-link\" value=\""+base_url+"/api/article?page="+page+"\">"+page+"</button></li>"
        return template
    }
    function paginationHasPrev(has_prev){
        var template = "<li class=\"page-item\"><button type=\"submit\" class=\"page-link\" value=\""+has_prev+"\">Prev</button></li>"
        return template
    }
    function paginationHasNext(has_next){
        var template = "<li class=\"page-item\"><button type=\"submit\" class=\"page-link\" value=\""+has_next+"\">Next</button></li>"
        return template
    }

    function articleTemplate(article) {
        var name = getName(article);
        var total_likes = getTotalLikes(article.id);
        var total_comments = getTotalComments(article.id);

        var template = 
            "<div class=\"container\">"
            +    "<div style=\"border-top:1px solid gray\">"
            +        "<div><h2><b>" 
            +            article.title
            +            "</b></h2> <p><b> Author: </b>"
            +            "<a href=\"user/article/"+article.owner.id+"\">"
            +               name
            +            "</a>"
            +        "</p></div>"
            +    "<div class=\"articledetailshome\">"
            +        "<p class=\"text-justify\">"
            +            jQuery.trim(article.description).substring(0, 150).split(" ").slice(0, -1).join(" ") + "..."
            +            "<a href=\"article/details/"+article.id+"\" >"
            +            "<b> Continue Reaing</b></a></p>"
            +    "</div>"
            +    "<button id=\"homepage_like_btn\" class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#likes_output\">Likes &nbsp<span id=\"total_likes"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
            +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
            +"</div><br/>";
        
        return template
    }

    function jumbotronTemplate(article) {
        var name = getName(article);
        var total_likes = getTotalLikes(article.id);
        var total_comments = getTotalComments(article.id);

        var template = "<div class=\"row\">"
        +   "<div class=\"col-md-4\">"
        +       "<h2><b> "+article.title+" </b></h2>"
        +           "<p>"
        +               "<b>Author:</b>" 
        +               "<a href=\"user/article/"+article.owner.id+"\">"
        +                  name
        +               "</a>"
        +           "</p>"
        +           "<p>" + jQuery.trim(article.description).substring(0, 150).split(" ").slice(0, -1).join(" ") + "..." + "</p>"
        +           "<a href=\"article/details/"+article.id+"\">"
        +               "<b>Continue reading</b>"
        +           "</a>"
        +       "<div class=\"caption\">"
        +           "<button id=\"homepage_like_btn\" class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#likes_output\">Likes &nbsp<span id=\"total_likes"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
        +           "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
        +       "</div>"
        +   "</div>"
        +   "<div class=\"col-md-8\">"
        +       "<img src=\""+article.article_image+"\" style=\"width:100%; height:300px\">"  
        +   "</div>"
        +"</div>"

        $('#jumbotron').prepend(template);
    }

    function thumbnailTemplate(article) {
        var name = getName(article);
        var total_likes = getTotalLikes(article.id);
        var total_comments = getTotalComments(article.id);

        var template = "<div class=\"col-md-6\">"
        +    "<div class=\"thumbnail\">"
        +            "<div class=\"row\">"
        +                "<div class=\"col-md-6\">"
        +                    "<h2><b>" +article.title+ "</b></h2>"
        +                    "<p>"
        +                        "<b>Author:</b>" 
        +                        "<a href=\"user/article/"+article.owner.id+"\">"
        +                            name
        +                        "</a>"
        +                    "</p>"
        +                    jQuery.trim(article.description).substring(0, 150).split(" ").slice(0, -1).join(" ") + "..."
        +                    "<a href=\"article/details/"+article.id+"\">"
        +                        "<b>Continue reading</b>"
        +                    "</a>"
        +                "</div>"
        +                "<div class=\"col-md-6\">"
        +                        "<img src=\""+article.article_image+"\" style=\"width:100%; height:200px\">"
        +                "</div>"
        +            "</div>"
        +        "<div class=\"caption\">"
        +            "<button id=\"homepage_like_btn\" class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\" data-id=\""+article.id+"\" data-toggle=\"modal\" data-target=\"#likes_output\">Likes &nbsp<span id=\"total_likes"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
        +            "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
        +        "</div>"
        +    "</div>"
        +"</div>"

        $('#featuredthumbnail').prepend(template);
    }

    function clearUserInputFields(){
        
        $('#title').val('');
        $('#description').val('');
        $('#article_image').val('');
        $('#tags').val('')
    }

    function getTotalLikes(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/likes').done(function(data) {
            $('#total_likes'+article_id).html(data)
        })
    }

    function getTotalComments(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
            $('#total_comments'+article_id).html(data)
        })
    }

    // function getTotalFeaturedComments(article_id){
    //     $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
    //         $('#featured_total_comments'+article_id).html(data)
    //     })
    // }

    // function getTotalThumbnailComments(article_id){
    //     $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
    //         $('#thumbnail_total_comments'+article_id).html(data)
    //     })
    // }

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
        +                   "<a href=\"article/details/"+data.id+"\">"
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

});