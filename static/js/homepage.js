$(document).ready(function(){
    console.log("<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>");
    var base_url = window.location.origin;

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

    $.get(base_url +'/api/article').done(function(data){
        data.forEach(function(e){
            articleTemplate(e)
        })
    })

    $('.article-form').on('submit', function(event) {
        event.preventDefault();
        console.log("-------------------------------------------")
        //create article
        var dt = $('#date').val(new Date($.now()));
        var url = $(this).attr('action');
        var jqhr = $.ajax({
                url:url,
                method:$(this).attr('method'),
                data: $(this).serialize()
            }).done(function(data){
                var article = data;
                articleTemplate(article)          
            }).errors(function(error) {
                console.log(error, 'error');
            });
    });

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
            +    "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span id=\"total_likes"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
            +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
            +"</div><br/>";
        $('#articles').prepend(template);
        $('#addModal').modal('hide');
    }

    function jumbotronTemplate(article) {
        var name = getName(article);
        var total_likes = getTotalFeaturedLikes(article.id);
        var total_comments = getTotalFeaturedComments(article.id);

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
        +           "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span id=\"featured_like_id"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
        +           "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"featured_total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
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
        var total_likes = getTotalThumbnailLikes(article.id);
        var total_comments = getTotalThumbnailComments(article.id);

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
        +            "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span id=\"thumbnail_like_id"+article.id+"\" class=\"badge badge-light\">"+total_likes+"</span></button>"
        +            "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span id=\"thumbnail_total_comments"+article.id+"\" class=\"badge badge-light\">"+total_comments+"</span></button>"
        +        "</div>"
        +    "</div>"
        +"</div>"

        $('#featuredthumbnail').prepend(template);
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

    function getTotalLikes(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/likes').done(function(data) {
            $('#total_likes'+article_id).html(data)
        })
    }

    function getTotalFeaturedLikes(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/likes').done(function(data) {
            $('#featured_like_id'+article_id).html(data)
        })
    }

    function getTotalThumbnailLikes(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/likes').done(function(data) {
            $('#thumbnail_like_id'+article_id).html(data)
        })
    }

    function getTotalComments(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
            $('#total_comments'+article_id).html(data)
        })
    }

    function getTotalFeaturedComments(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
            $('#featured_total_comments'+article_id).html(data)
        })
    }

    function getTotalThumbnailComments(article_id){
        $.get(base_url +'/api/article/'+article_id+'/total/comments').done(function(data) {
            $('#thumbnail_total_comments'+article_id).html(data)
        })
    }
});