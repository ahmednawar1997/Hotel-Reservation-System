$(function () {

    $('.rate_button').click(function (e) {
        e.preventDefault();
        if (!$(this).attr('pressed')) {
            $(this).next('.rate_visit').slideDown('slow');
            $(this).text('Submit');
        } else {
            $.ajax({
                type: 'post',
                url: '/hotels/review',
                data: {
                    reservation_id: $(this).next('.rate_visit').attr('reservation_id'),
                    customer_review: $(this).next().next('.customer_review').children('.text_area').val()
                },
                success: function (data) {
                    window.location = '/user';
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert('fail');
                }
            });

        }
    });

    $('.fa.fa-star').hover(function (e) {
        e.preventDefault();
        $(this).prevUntil('.first').addBack().prev('.first').addBack().addClass('star_checked');

    }, function () {
        $(this).prevUntil('.first').addBack().prev('.first').addBack().removeClass("star_checked");
    });


    $('.fa.fa-star').click(function (e) {
        e.preventDefault();
        $(this).parent().hide();
        $(this).parent().next('.customer_review').removeClass('visibilityClass');
        $(this).parent().prev('.rate_button').attr("pressed", "pressed");


        $.ajax({
            type: 'post',
            url: '/hotels/rate',
            data: {
                hotel_id: $(this).parent('.rate_visit').attr('hotel_id'),
                customer_rating: $(this).attr('value'),
                reservation_id: $(this).parent('.rate_visit').attr('reservation_id')
            },
            success: function (data) {
                // window.location = '/user';

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

    $.each($('.rate_button:disabled'), function (index, value) {
        $(this).text('Rated ' + $(this).attr('review') + ' stars').css({
            'color': 'grey'
        });;
    });

});