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
        var template="<li>"+
        "<a href=\""+base_url+"/drf/article/details/"+data.article.id+"\"><b>" +data.article.title+ "</b></a>"
        +"</li>"

        $('#likedarticles').prepend(template);
    }
})