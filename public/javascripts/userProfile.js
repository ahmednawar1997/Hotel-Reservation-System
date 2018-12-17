$(function () {

    $('.rate_button').click(function (e) {
        e.preventDefault();
        $(this).next('.rate_visit').slideDown('slow');
        $(this).text('Submit');
    });

    $('.fa.fa-star').hover(function (e) {
        e.preventDefault();
        $(this).prevUntil('.first').addBack().prev('.first').addBack().addClass('star_checked');

    }, function () {
        $(this).prevUntil('.first').addBack().prev('.first').addBack().removeClass("star_checked");
    });


    $('.fa.fa-star').click(function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/hotels/rate',
            data: {
                hotel_id: $(this).parent('.rate_visit').attr('hotel_id'),
                customer_rating: $(this).attr('value')
            },
            success: function (data) {
                window.location = '/user';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });

    });


    $('.approve_btn').click(function (e) {

        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/hotels/approve',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });
    $('.cancel_reservation').click(function (e) {
        alert("cancel");
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/reservation/cancel',
            data: {
                reservation_id: $(this).attr('res_id')
            },
            success: function (data) {
                window.location = '/user';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });
});