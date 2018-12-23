// var i;
// emptyHotels();
// for (i = 0; i < 10; i++) {  
//     addCardView2();
// } 

function addCardView1(name, review, location, description, stars) {
    $('.hotels_container .inner_container').append(
        '<div class="card col-sm-4 col-md-4 col-lg-3" >\
        <img class="card-img-top" src="/images/photo2.jpg" alt="Card image cap">\
        <div class="card-body">\
            <h5 class="card-title">'+ name + '</h5>\
            <p class="card-text">'+ description + '</p>\
        </div>\
        <ul class="list-group list-group-flush">\
            <li class="list-group-item">Review: '+ review + '</li>\
            <li class="list-group-item">Stars: '+ stars + '</li>\
            <li class="list-group-item">Location: '+ location + '</li>\
        </ul>\
        <div class="card-body">\
            <a href="#" class="card-link">Check Hotel</a>\
            <a href="#" class="card-link">Reserve</a>\
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
    )
};


function emptyHotels() {
    $('.hotels_container .row').empty();
}

$('.horizontal_view').click(function () {
    var i;
    emptyHotels();
    for (i = 0; i < 10; i++) {
        addCardView2();
    }
});

$('.stacked_view').click(function () {
    var i;
    emptyHotels();
    for (i = 0; i < 10; i++) {
        addCardView1();
    }
});



// $(function () {

//         $('#pickDate').on('submit', function (e) {
//             e.preventDefault();
//             $.ajax({
//                 type: 'get',
//                 url: '/hotels/getHotels',
//                 data: $('form').serialize(),
//                 success: function (data) {
//                     emptyHotels();
//                     data.forEach(function(hotel){
//                         addCardView1(hotel.name, hotel.review, hotel.location, hotel.description, hotel.stars);
//                     });
//                 },
//                 error: function(xhr, textStatus, errorThrown){
//                     alert('erroor while fetching hotels');
//                 }
//             });
//         });


//     });






// $(function () {

//     $('.filter_checkbox').change(function(e) {
//             //e.preventDefault();
//             var facilities = [];
//             $.each($(".filter_checkbox:checked"), function(){            
//                 facilities.push($(this).attr('name'));
//             });
//             console.log(facilities.join(", "));
//             $.ajax({
//                 type: 'get',
//                 url: '/hotels/fetchHotelsWithFilter',
//                 data: $('form').serialize(),
//                 success: function (hotels) {
//                     alert('hey');
//                 },
//                 error: function(xhr, textStatus, errorThrown){
//                     alert('erroor while fetching hotels');
//                 }
//             });
//         });


//     });
function showRoomsForm(hotel_id) {
    $(function () {
        //$('#showRoomForm').on('click', () => {
        console.log("TESTINGGGGG");
        $('#roomFormDiv').append(
            '<div class="container">\
        <div class= "jumbotron">\
        <form class="reg-form" action="/user/owner/'+ hotel_id + '" method="POST">\
            <div class="form-group">\
                <div class="form-group row">\
                    <label for="roomType" class="col-2 col-form-label">Room Type</label>\
                    <div class="col-6">\
                        <input class="form-control" name="roomType" type="text" id="roomType" required />\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <label for="view" class="col-2 col-form-label">View</label>\
                    <div class="col-6">\
                        <input class="form-control" name="view" type="text" required />\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <label for="price" class="col-2 col-form-label">Price</label>\
                    <div class="col-6">\
                        <input class="form-control" name="price" type="text" required />\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <label for="quantity" class="col-2 col-form-label">Identical Rooms Quantity</label>\
                    <div class="col-6">\
                        <input class="form-control" name="quantity" type="text" required />\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <div class="col-2 col-form-label"></div>\
                    <div class="col-6">\
                        <button type="submit" class="btn btn-dark btn-block">Add Room</button>\
                    </div>\
                </div>\
            </div>\
        </form>\
        </div>\
    </div>'
        );
        $("#roomFormDiv").ready(function () {
            $("html, body").delay(50).animate({
                scrollTop: $('#roomFormDiv').offset().top
            }, 2000);
        });
    });
    //});
}
function roomView(roomObj) {
    $('#roomViewDiv').append(
        '<div class="card mb-3">\
            <div class="row"  style="overflow:hidden">\
                <img class=" hotel-image col-3 img-fluid" src="/images/photo2.jpg" alt="Hotel image cap">\
                <div class="col-4"><strong>Facilities</strong><ul><li>'+ roomObj.roomType + '</li><li>item</li><li>item</li></ul></div>\
                <div class="col-4"><ul><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li><li>item</li></ul></div>\
            </div>\
            <div class="card-body">\
                <h5 class="card-title">Hotel title</h5>\
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to\
                    additional content. This content is a little bit longer.</p>\
            </div>\
        </div>'
    );
}

function showMap(url, id) {
    $(function () {
        if ($('#mapiframe' + id).html() === '') {
            $('#mapiframe' + id).html('<iframe src="' + url + '"\
                            width = "100%" height = "300" frameborder = "0" style = "margin-top: 10px;" allowfullscreen ></iframe >');
        } else {
            $('#mapiframe' + id).toggle('slow');
        }
    });


}

$('#addRoomModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var hotelID = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('#addRoomForm').attr('action', '/user/owner/' + hotelID)
})