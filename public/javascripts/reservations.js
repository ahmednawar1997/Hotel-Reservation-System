
function approveReservation(resID) {
    $(function () {

        $.ajax({
            url: '/user/owner/reservations',
            method: 'POST',
            data: { reservation_id: resID, hotel_approval: 1 },
            success: () => {
                $('#approveButton' + resID).remove();
                $('#cancelButton' + resID).remove();
                $('#color' + resID).toggleClass('pending_circle checkmark_circle');
                $('.check1' + resID).addClass('checkmark_stem')
                $('.check2' + resID).addClass('checkmark_kick')

            }
        });


    });
}


function cancelReservation(resID) {
    $(function () {

        $.ajax({
            url: '/user/owner/reservations',
            method: 'POST',
            data: { reservation_id: resID, hotel_approval: 0 },
            success: () => {
                $('#approveButton' + resID).remove();
                $('#cancelButton' + resID).remove();
                $('#color' + resID).toggleClass('pending_circle canceled_circle');
            }
        });

    });
}