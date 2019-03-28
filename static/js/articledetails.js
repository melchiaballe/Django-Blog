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
            getComments(e);
        })
    })

    // $('#deletecomment').on('click', function(event) {
    //     $.ajax({
    //         url: base_url+"/api/comment/"+data.id+"/delete"
    //     })
    // })

    function getComments(data){
        name = getName(data);
        img = userAvatar(data);
        edit = enableEditDelete(data);
        var template="<div class=\"row\">"
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

        $('#comment_section').prepend(template)
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
            edit = "<button class=\"btn btn-outline-secondary btn-sm\" type=\"button\" data-toggle=\"modal\" data-target=\"#edit_comment\">Edit</button> &nbsp"
            + "<button id=\"deletecomment\" class=\"btn btn-outline-danger btn-sm\" >Delete</button>"
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

