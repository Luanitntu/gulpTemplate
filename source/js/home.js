$(window).load(function () {
    console.log('load')
    let classTour = $('.list-tour').attr('class')
    let numSlideTour = 4
    let classBtnTour = 'content'
    initSlick(classTour, numSlideTour, classBtnTour)

    let classEvent = $('.list-event').attr('class')
    let numSlideEvent = 4
    let classBtnEvent = 'content'
    initSlick(classEvent, numSlideEvent, classBtnEvent)

    let classPlace = $('.list-place').attr('class')
    let numSlidePlace = 6
    let classBtnPlace = 'place'
    initSlick(classPlace, numSlidePlace, classBtnPlace)

    let classTours = $('.nav-tours').attr('class') ?? ""
    let numSlideTours = 6
    let classBtnTours = 'tab'
 
    initSlick(classTours.split(' ')[1], numSlideTours, classBtnTours)

    let classGuide = $('.list-guide').attr('class')
    let numSlideGuide = 3
    let classBtnGuide = 'guide'
    initSlick(classGuide, numSlideGuide, classBtnGuide)

    let classHotel = $('.list-hotel').attr('class')
    let numSlideHotel = 4
    let classBtnHotel = 'hotel'
    initSlick(classHotel, numSlideHotel, classBtnHotel)

    let clsLocation = $('.select-location').attr('class') ?? ""
    let clsLanguage = $('.select-language').attr('class') ?? ""

    initSelect2(clsLocation.split(' ')[1], 'Địa điểm')
    initSelect2(clsLanguage.split(' ')[1], 'Chọn ngôn ngữ dành cho hướng dẫn viên')
    handleTypeRoom()

    let idStartTour = $('#startDateTour').attr('id')
    let idEndTour = $('#endDateTour').attr('id')
    initDPR(idStartTour, idEndTour)

    let idStartService = $('#startDateService').attr('id')
    let idEndService = $('#endDateService').attr('id')
    initDPR(idStartService, idEndService)

    let idStartEvent = $('#startDateEvent').attr('id')
    let idEndEvent = $('#endDateEvent').attr('id')
    initDPR(idStartEvent, idEndEvent)

});

function initSlick(nameClass, numSlide, classBtn) {
    $("."+nameClass).slick({
        infinite: false,
        dots: false,
        slidesToShow: numSlide,
        prevArrow:
            '<button type="button" class="slick-prev slick-'+classBtn+'-prev"></button>',
        nextArrow:
            '<button type="button" class="slick-next slick-'+classBtn+'-next"></button>',
    });
}

function matchCustom(params, data) {
    // If there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
        return data;
    }

    // Do not display the item if there is no 'text' property
    if (typeof data.text === 'undefined') {
        return null;
    }

    // `params.term` should be the term that is used for searching
    // `data.text` is the text that is displayed for the data object
    if (data.text.indexOf(params.term) > -1) {
        var modifiedData = $.extend({}, data, true);

        // You can return modified objects from here
        // This includes matching the `children` how you want in nested data sets
        return modifiedData;
    }

    // Return `null` if the term should not be displayed
    return null;
}

function initSelect2(id, placeholder) {
    $('.'+id).select2({
        placeholder: placeholder,
        matcher: matchCustom,
        width: 'resolve'
    });
}

function handleTypeRoom() {
    $('.dropdown-rooms .btn-minus').click(function (e) {
        e.stopPropagation();
        var parent = $(this).closest('.dropdown-center');
        var input = parent.find('.dropdown-rooms [name=' + $(this).data('input') + ']');
        var min = parseInt(input.attr('min'));
        var old = parseInt(input.val());

        if (old <= min) {
            return;
        }
        input.val(old - 1);
        updateGuestCountText(parent);
    });

    $('.dropdown-rooms .btn-add').click(function (e) {
        e.stopPropagation();
        var parent = $(this).closest('.dropdown-center');
        var input = parent.find('.dropdown-rooms [name=' + $(this).data('input') + ']');
        var max = parseInt(input.attr('max'));
        var old = parseInt(input.val());

        if (old >= max) {
            return;
        }
        input.val(old + 1);
        updateGuestCountText(parent);
    });

    $('.dropdown-rooms input').keyup(function (e) {
        var parent = $(this).closest('.dropdown-center');
        updateGuestCountText(parent);
    });
    $('.dropdown-rooms input').change(function (e) {
        var parent = $(this).closest('.dropdown-center');
        updateGuestCountText(parent);
    });

    function updateGuestCountText(parent) {
        var adults = parseInt(parent.find('[name=adults]').val());
        var children = parseInt(parent.find('[name=children]').val());
        var rooms = parseInt(parent.find('[name=rooms]').val());

        var adultsHtml = parent.find('.render .adults .multi').data('html');
        parent.find('.render .adults .multi').html(adultsHtml.replace(':count', adults));

        var childrenHtml = parent.find('.render .children .multi').data('html');
        parent.find('.render .children .multi').html(childrenHtml.replace(':count', children));

        var roomHtml = parent.find('.render .rooms .multi').data('html');
        parent.find('.render .rooms .multi').html(roomHtml.replace(':count', rooms));


        if (adults > 1) {
            parent.find('.render .adults .multi').removeClass('d-none');
            parent.find('.render .adults .one').addClass('d-none');
        } else {
            parent.find('.render .adults .multi').addClass('d-none');
            parent.find('.render .adults .one').removeClass('d-none');
        }

        if (children > 1) {
            parent.find('.render .children .multi').removeClass('d-none');
            parent.find('.render .children .one').addClass('d-none');
        } else {
            parent.find('.render .children .multi').addClass('d-none');
            parent.find('.render .children .one').removeClass('d-none').html(parent.find('.render .children .one').data('html').replace(':count', children));
        }

        if (rooms > 1) {
            parent.find('.render .rooms .multi').removeClass('d-none');
            parent.find('.render .rooms .one').addClass('d-none');
        } else {
            parent.find('.render .rooms .multi').addClass('d-none');
            parent.find('.render .rooms .one').removeClass('d-none').html(parent.find('.render .rooms .one').data('html').replace(':count', rooms));
        }

    }
}

function initDPR(idStartDate, idEndDate) {
    $('#'+idEndDate).addClass("disable-custom");
    $('#'+idStartDate).daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        opens: 'center',
        drops: "auto",
        autoApply: true,
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " đến ",
            "applyLabel": "",
            "cancelLabel": "",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "CN",
                "T2",
                "T3",
                "T4",
                "T5",
                "T6",
                "T7"
            ],
            "monthNames": [
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12"
            ],
            "firstDay": 1
        },
    });

    $('#'+idEndDate).daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        opens: 'center',
        drops: "auto",
        showDropdowns: true,
        autoApply: true,
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " đến ",
            "applyLabel": "",
            "cancelLabel": "",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "CN",
                "T2",
                "T3",
                "T4",
                "T5",
                "T6",
                "T7"
            ],
            "monthNames": [
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12"
            ],
            "firstDay": 1
        },
    });

    $('#'+idStartDate).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        $('#'+idEndDate).removeClass("disable-custom");
        $('#'+idEndDate).data('daterangepicker').minDate = picker.startDate
    });

    $('#'+idEndDate).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    });
}
