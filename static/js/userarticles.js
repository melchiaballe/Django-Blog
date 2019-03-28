$(document).ready(function(){
    console.log("-------------------------------------")
    var base_url = window.location.origin;
    var user_id = $('#user_id').val();
    $.get(base_url+'/api/article/user/'+user_id).done(function(data){
        data.forEach(function(e){
            createTemplate(e)
        })
    })

    function createTemplate(article) {
        var name = GetName(article);
        var template = 
            "<div class=\"container\">"
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
            +    "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span class=\"badge badge-light\"></span></button>"
            +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span class=\"badge badge-light\"></span></button>"
            +"</div></div><br/>";
        $('#articles').prepend(template);
        $('#addModal').modal('hide');
    }

    function GetName(article){
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