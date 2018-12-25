
function approveReservation(res) {
    $(function () {
        var reservation = JSON.parse(res);
        $.ajax({
            url: '/user/owner/reservations',
            method: 'POST',
            data: { reservation_id: reservation.reservation_id, hotel_approval: 1 },
            success: () => {

                $('#approveButton' + reservation.reservation_id).remove();
                $('#cancelButton' + reservation.reservation_id).remove();
                $('#color' + reservation.reservation_id).toggleClass('pending_circle checkmark_circle');
                $('.check1' + reservation.reservation_id).addClass('checkmark_stem')
                $('.check2' + reservation.reservation_id).addClass('checkmark_kick')

                var now = new Date();
                var date = new Date(reservation.check_in_date);

                if (reservation.checked_in === null && date < now) {
                    $('#checkInDiv' + reservation.reservation_id).html(
                        '<div class="card-footer" align="center">\
                    <span>Guest Checked In ? </span>\
                    <br>\
                        <button type="button" class="btn btn-success btn-sm" style="margin-right:5px" id="yesButton<%=detailedReservations[i].reservation_id%>"\
                            onclick="guestCheckedIn('+ reservation.reservation_id + ')"><i class="fas fa-check-circle"></i> Yes</button>\
                        <button type="button" class="btn btn-danger btn-sm" style="" id="noButton<%=detailedReservations[i].reservation_id%>" onclick="guestNotCheckedIn('+ reservation.reservation_id + ')">\
                            <i class="fas fa-times-circle"></i>\
                            No</button>\
                        </div>')
                }

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

function guestCheckedIn(resID) {
    $.ajax({
        url: '/user/owner/reservations/' + resID,
        method: 'POST',
        data: { reservation_id: resID, checked_in: 1 },
        success: () => {
            $('#checkInDiv' + resID).remove();
        }
    });

}

function guestNotCheckedIn(resID, customerID) {
    $.ajax({
        url: '/user/owner/reservations/' + resID,
        method: 'POST',
        data: { reservation_id: resID, checked_in: 0, customer_id: customerID },
        success: () => {
            $('#checkInDiv' + resID).remove();
            $('#customerStatus' + resID).html('Missed Checkin')
        }
    });

}