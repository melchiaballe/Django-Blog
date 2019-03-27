$(document).ready(function(){
    $('.article-form').on('submit', function(event) {
        event.preventDefault();
        //create article
        var dt = $('#date').val(new Date($.now()));
        var url = $(this).attr('action');
        var jqhr = $.ajax({
                url:url,
                method:$(this).attr('method'),
                data: $(this).serialize()
            }).done(function(data){
                var article = data;
                createTemplate(article)          
            }).errors(function(error) {
                console.log(error, 'error');
            });

            function createTemplate(article) {
                var template = 
                    "<div class=\"container\">"
                    +    "<div style=\"border-top:1px solid gray\">"
                    +        "<div><h2><b>" 
                    +            article.title
                    +            "</b></h2> <p><b> Author: </b>"
                    +            "<a>"
                    +                "author name or email"
                    +            "</a> <b>date published:</b>"
                    +        "</p></div>"
                    +    "<div class=\"articledetailshome\">"
                    +        "<p class=\"text-justify\">"
                    +            jQuery.trim(data.description).substring(0, 199).split(" ").slice(0, -1).join(" ") + "..."
                    +            "<a href=\"/article/details/"+article.id+"\" >"
                    +            "<b> Continue Reaing</b></a></p>"
                    +    "</div>"
                    +    "<button class=\"btn btn-primary btn-sm\" style=\"margin-right: 4px;\">Likes &nbsp<span class=\"badge badge-light\"></span></button>"
                    +    "<button class=\"btn btn-secondary btn-sm\">Comments &nbsp<span class=\"badge badge-light\"></span></button>"
                    +"</div><br/>";
                $('#articles').prepend(template);
                $('#addModal').modal('hide');
            }
    });
});