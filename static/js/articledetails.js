$(document).ready(function(){
    console.log("+++++++++++++++++++++++++++++++++++++++++++");

    var base_url = window.location.origin;
    var article_id = $('#article_id').val();
    var user_id = $('#user_id').val();

    $.get(base_url +'/api/article/'+article_id).done(function(data){
        articleDetails(data);
    })

    $.get(base_url +'/api/article/'+article_id+'/comments').done(function(data) {
        data.forEach(function(e){
            template = getComments(e);
            $('#comment_section').prepend(template)
        })
    })

    $(document).on('click', '#edit', function(event){
        var comment_id = $(this).data('id');
        $("#edit_comment_id").val( comment_id );
    })

    $(document).on('click', '#delete', function(event){
        var comment_id = $(this).data('id');
        console.log(comment_id)
        $("#delete_comment_id").val( comment_id );
    })

    $('#addComment').on('submit', function(event){
        event.preventDefault();
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");
        var url = $(this).attr('action');
        
        $.ajax({
            url:url,
            method: $(this).attr('method'),
            data: $(this).serialize()
        }).done(function(data) {
            var comment = data;
            template = getComments(comment)
            $('#comment_section').append(template)
        }).errors(function(data) {
            console.log(error, 'error');
        })
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
            console.log("done")
            $("#comment"+comment_id).remove();
            $('#delete_comment').modal('hide');
        }).errors(function(error){
            console.log(error, 'error')
        })
    })

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
        +                "<p>&nbsp" + data.content + "</p>"
        +            "</div>"
        +        "</div>"
        +    "</div>"
        +    "<div class=\"col-md-2\">"
        +        edit
        +    "</div>"
        +"</div>"

        return template
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

        var template = "<div align=\"center\">"
        +    "<h1 class=\"display-3\">"+data.title+"</h1>"
        +    "<p>"
        +        "<b>Author:</b>" + name + "&nbsp"
        +        edit
        +    "</p>"
        +    img
        +"</div>"
        +"<div class=\"articledetails\">"
        +    "<p class=\"text-justify\">"+data.description+"</p>"
        +"</div>";

        $('#article_details').prepend(template)
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
            edit = "<a href=\"\"><i>edit</i></a>";
        }
        return edit;
    }

    function hasImage(data){
        var img = "";
        if(data.article_image)
        {
            img = "<img class=\"img-responsive\" src=\""+data.article_image+"\" width=\"600\" height=\"320\"></img>";
        }
        return img
    }
})

