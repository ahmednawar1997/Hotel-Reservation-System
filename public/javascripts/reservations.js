
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
                $('#checkInDiv' + resID).html('<div class="card-footer" align="center"></div>\
                    <span>Guest Checked In ? </span>\
                    <br>\
                        <button type="button" class="btn btn-success btn-sm" style="margin-right:5px" id="yesButton<%=detailedReservations[i].reservation_id%>"\
                            onclick="guestCheckedIn('+ resID + ')"><i class="fas fa-check-circle"></i> Yes</button>\
                        <button type="button" class="btn btn-danger btn-sm" style="" id="noButton<%=detailedReservations[i].reservation_id%>" onclick="guestNotCheckedIn('+ resID + ')">\
                            <i class="fas fa-times-circle"></i>\
                            No</button>\
                        </div>')

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

function guestNotCheckedIn(resID) {
    $.ajax({
        url: '/user/owner/reservations/' + resID,
        method: 'POST',
        data: { reservation_id: resID, checked_in: 0 },
        success: () => {
            $('#checkInDiv' + resID).remove();
            $('#customerStatus' + resID).html('Missed Checkin')
        }
    });

}