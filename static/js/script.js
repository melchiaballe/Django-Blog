// var myElem =$('#myId') # hashtag for ID
// var myElem =$('.myId') # class



// myELem.on('click', function(){

// })


$(document).ready(function(){
    console.log("HELLO WORLD");
    var articleForm = $('.article-form');


    $('.article-form').on('submit', function(event) {
        event.preventDefault();
        //create article
        var url = $(this).attr('action');
        console.log($(this).serialize(), "data");
        var jqhr = $.ajax({
                url:url,
                method:$(this).attr('method'),
                data: $(this).serialize()
            }).done(function(data){
                var template =  '<div style="border-bottom:1px solid gray"><h2><b>' + data.title +
                '</b></h2><h5>'+ data.description +'</h5><div>';
                //$('.table').append(template);
                $('#articles').prepend(template);
                $('#addModal').modal('hide');
                console.log(data, 'data');
            }).errors(function(error) {
                console.log(error, 'error');
            });
    });
});