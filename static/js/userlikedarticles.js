$(document).ready(function() {
    console.log("***********************************")

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
        console.log(data);
        
        var search_type = $('#search_type').val()

        if(search_type == 'user'){
            $.get(base_url+"/api/search/user/", data).done(function(data){
                console.log(data)
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
                console.log(data)
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

    function listLikedArticles(data){
        var name = getName(data)
        var total_likes = getTotalLikes(data.article.id)
        var total_comments = getTotalComments(data.article.id)

        var template="<div class=\"container\">"
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
        +    "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span id=\"total_likes"+data.article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
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
})