$(function () {
    $('#reservation_button').click(function (e) {
        let submit = false;
        $.each($('.number_of_rooms'), function (key, value) {
            if ($(this).val() > 0) {
                submit = true;
            }
        });
        if (submit)
            $('#reservation_form').submit();
            else
            $('#error_msg').html('Please add rooms');
    });


    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var hotel_id = button.data('hotel_id');
        $.ajax({
            type: 'GET',
            url: '/hotels/' + hotel_id + '/book',
            data: {
                checkin: $("#checkin").val(),
                checkout: $("#checkout").val()
            },
            success: function (data) {
                updateReservationForm(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('exampleModal fail');
            }
        });
    });


    function updateReservationForm(data) {
        console.log(data);
        $('#reservation_hotel_name').text(data.hotel.name);
        $('#reservation_checkin').val(data.checkin);
        $('#reservation_checkout').val(data.checkout);
        $('#reservation_rooms_div').empty();

        $.each(data.rooms, function (index, room) {
            $('#reservation_rooms_div').append(
                '<div class="form-group row">\
            <label class="col-4 col-form-label">' +
                room.room_type + ' Room, ' + room.room_view + ' View, $' + room.price +
                '/night</label>\
            <div class="col-4">\
                <input class="form-control number_of_rooms" name="numberOfRooms" type="number" placeholder="Number of rooms required" value="0"  min="0" max="' +
                room.free_rooms + '"/> Available Rooms on these dates: ' + room.free_rooms +
                '\
            </div>\
            </div>\
            <input class="form-control" name="room_types" type="text" value="' +
                room.room_type + '" hidden/>\
                <input class="form-control" name="room_views" type="text"  value="' +
                room.room_view + '" hidden/>'
                
                );
        });
        $('#reservation_form').attr('action', '/hotels/' + data.hotel.id + '/reserve');
    }

});