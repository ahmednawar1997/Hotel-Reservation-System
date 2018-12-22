
$(function () {
    $('#approveButton').on('click', () => {
        var resID = $('#approveButton').val();
        $.ajax({
            url: '/user/owner/reservations',
            method: 'POST',
            data: { reservation_id: resID, hotel_approval: 1 },
            success: () => {
                $('#approveButton').remove();
                $('#cancelButton').remove();
                $('#color' + resID).toggleClass('pending_circle checkmark_circle');
                $('.check1' + resID).addClass('checkmark_stem')
                $('.check2' + resID).addClass('checkmark_kick')

            }
        });
    });

});


$(function () {
    $('#cancelButton').on('click', () => {
        var resID = $('#cancelButton').val();
        $.ajax({
            url: '/user/owner/reservations',
            method: 'POST',
            data: { reservation_id: resID, hotel_approval: 0 },
            success: () => {
                $('#approveButton').remove();
                $('#cancelButton').remove();
                $('#color' + resID).toggleClass('pending_circle canceled_circle');
            }
        });
    });

});