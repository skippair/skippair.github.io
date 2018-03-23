$(document).ready(function() {
    $('.booking-gift-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if (e.target.id == 'booking-tab') {
            $('.reservation-panel').addClass('color-booking');
            $('.reservation-panel').removeClass('color-gift');
        } else {
            $('.reservation-panel').removeClass('color-booking');
            $('.reservation-panel').addClass('color-gift');
        }
    });
});
