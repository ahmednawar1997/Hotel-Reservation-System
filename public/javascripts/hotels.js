// var i;
// emptyHotels();
// for (i = 0; i < 10; i++) {  
//     addCardView2();
// } 

function addCardView1() {
$('.hotels_container .inner_container').append(
    '<div class="card col-sm-4 col-md-4 col-lg-3" >\
        <img class="card-img-top" src="/images/photo2.jpg" alt="Card image cap">\
        <div class="card-body">\
            <h5 class="card-title">Hotel title</h5>\
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card\'s content.</p>\
        </div>\
        <ul class="list-group list-group-flush">\
            <li class="list-group-item">Cras justo odio</li>\
            <li class="list-group-item">Dapibus ac facilisis in</li>\
        </ul>\
        <div class="card-body">\
            <a href="#" class="card-link">Card link</a>\
            <a href="#" class="card-link">Another link</a>\
        </div>\
    </div>'
);
}

function addCardView2() {
$('.hotels_container .inner_container').append('\
    <div class="card mb-3">\
        <div class="row"  style="overflow:hidden">\
            <img class=" hotel-image col-3 img-fluid" src="/images/photo2.jpg" alt="Hotel image cap">\
            <div class="col-4"><strong>Facilities</strong><ul><li>item</li><li>item</li><li>item</li></ul></div>\
            <div class="col-4"><ul><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li></ul></div>\
        </div>\
        <div class="card-body">\
            <h5 class="card-title">Hotel title</h5>\
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to\
                additional content. This content is a little bit longer.</p>\
        </div>\
    </div>'
)};


function emptyHotels() {
    $('.hotels_container .row').empty();
}

$('.horizontal_view').click(function(){
    var i;
    emptyHotels();
    for (i = 0; i < 10; i++) {
        addCardView2();
    } 
});

$('.stacked_view').click(function(){
    var i;
    emptyHotels();
    for (i = 0; i < 10; i++) {
    addCardView1();
    } 
});


$(function () {

        $('#pickDate').on('submit', function (e) {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: '/hotels',
                data: $('form').serialize(),
                success: function (data) {
                    var i;
                    emptyHotels();
                    for (i = 0; i < 10; i++) {
                    addCardView1();
                    } 
                    alert("");

                },
                error: function(xhr, textStatus, errorThrown){

                }
            });
        });


    });