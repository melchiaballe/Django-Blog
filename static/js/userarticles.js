$(document).ready(function(){
    console.log("-------------------------------------")
    var base_url = window.location.origin;

    var user_id = $('#user_id').val();
    var request_user_id = $('#request_user_id').val();
    
    $.get(base_url+'/api/article/user/'+user_id).done(function(data){
        data.forEach(function(e){
            createTemplate(e)
        })
    })

    $(document).on('click', '#edit', function(event){
        var article_id = $(this).data('id');
        console.log(article_id)
        $("#edit_article_id").val( article_id );
    })

    $(document).on('click', '#delete', function(event){
        var article_id = $(this).data('id');
        console.log(article_id)
        $("#delete_article_id").val( article_id );
    })

    $('#deleteArticle').on('submit', function(event){
        event.preventDefault();
        article_id = $('#delete_article_id').val()

        url =  base_url+"/api/article/"+article_id+"/delete";
        $.ajax({
            url:url,
            method:$(this).attr('method'),
            data: $(this).serialize()
        }).done(function(){
            console.log("done")
            $("#article"+article_id).remove();
            $('#delete_article').modal('hide');
        }).errors(function(error){
            console.log(error, 'error')
        })
    })

    function createTemplate(article) {
        var name = getName(article);
        var btn = allowEdit(article);

        var template = 
            "<div class=\"container\" id=\"article"+article.id+"\">"
            +    "<div align=\"center\" style=\"border-top:1px solid gray\">"
            +        "<div><h2><b>" 
            +            article.title
            +            "</b></h2> <p><b> Author: </b>"
            +                name
            +        "</p></div>"
            +    "<div class=\"articledetailshome\">"
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
        
        if(article.owner.id != request_user_id) {
            btn = "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span class=\"badge badge-light\"></span></button>"
            +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span class=\"badge badge-light\"></span></button>";
        }
        else
        {
            btn = 
            "<div class=\"row\">"
                +"<div class=\"col-md-6\">"
                +   "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span class=\"badge badge-light\"></span></button>"
                +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span class=\"badge badge-light\"></span></button>"
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
})