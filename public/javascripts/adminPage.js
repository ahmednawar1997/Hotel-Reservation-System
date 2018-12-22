$(document).ready(function () {

    $('.pending_circle').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/approve',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.non_premium_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/premium',

            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.premium_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/removepremium',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.suspend_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/suspend',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });

    $('.reactivate_button').click(function () {
        $.ajax({
            type: 'post',
            url: '/hotels/reactivate',
            data: {
                hotel_id: $(this).attr('hotel_id')
            },
            success: function (data) {
                window.location = '/user/admin/hotels';
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('fail');
            }
        });
    });




    $("#customer_input").autocomplete({

        source: function (request, response) {
            $.ajax({
                url: "/user/customers",
                dataType: "json",
                data: {
                    customer_name: request.term
                },
                success: function (data) {
                    response(
                        $.map(data, function (customer, key) {
                            return {
                                label: customer.name,
                                value: customer.id
                            }
                        })
                    );
                }
            });
        },
        select: function (event, ui) {
            $('#customer_id').val(ui.item.value);
            $('#customer_input').val(ui.item.label);
            $('#user_search').prop('disabled', false);;

            return false;

        }
    });
});
