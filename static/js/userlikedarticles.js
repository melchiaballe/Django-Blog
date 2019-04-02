$(document).ready(function() {
    console.log("***********************************")

    var base_url = window.location.origin;
    var user_id = $('#user_id').val();
    
    $.get(base_url+'/api/article/user/'+user_id+'/likes').done(function(data){
        data.forEach(function(e){
            listLikedArticles(e)
        })
    })

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