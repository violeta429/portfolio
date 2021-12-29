////엔터이벤트(새로고침) 막기
//$(document).on('keypress', function (e) {
//    if (e.which == 13) {
//        return false;
//    }
//});


//무한로딩일 때 뒤로가기 한번 더
window.onpageshow = function (event) {
    var currentUrl = $(location).attr('href');
    if (currentUrl.includes("#")) {
        history.go(-1);
    }
}


function goBack() {
    var currentUrl = $(location).attr('href'); 
    console.log("현재페이지: " + currentUrl);

    if (!currentUrl.includes("/main.aspx")) {
        var previousUrl = document.referrer;
        console.log("이전페이지: " + previousUrl);
        history.go(-1);
    }

   
}



//모바일 검색

function fnSearchMasterM() {

    var keyword = $("#txtSearchMasterM").val();
    if (keyword == "") {
        alert("검색어를 입력하세요");
        return
    }

    location.href = "/view/product/product_list.aspx?keyword=" + keyword;

}



$(function () {

    // tab메뉴
    var $wrapper = $('.tab-wrapper'),
    $allTabs = $wrapper.find('.tab-content > div'),
    $tabMenu = $wrapper.find('.tab-menu li');

    $allTabs.not(':first-of-type').hide();
    $tabMenu.filter(':first-of-type').find(':first').width('100%')

    $tabMenu.each(function (i) {
        $(this).attr('data-tab', 'tab' + i);
    });

    $allTabs.each(function (i) {
        $(this).attr('data-tab', 'tab' + i);
    });

    $tabMenu.on('click', function () {

        var dataTab = $(this).data('tab'),
            $getWrapper = $(this).closest($wrapper);

        $getWrapper.find($tabMenu).removeClass('active');
        $(this).addClass('active');

        $getWrapper.find($allTabs).hide();
        $getWrapper.find($allTabs).filter('[data-tab=' + dataTab + ']').show();
    });


    var width = window.outerWidth;

    //최근 본 상품 열기
    $('.rcntLayer ').on('click', function () {
        $("#rcntLayer").show();
        $("body").css({ 'height': $(window).height(), 'overflow': 'hidden' });
    })


    $('.bt-recentpd a ').on('click', function (e) {
        e.preventDefault();
        $("#rcntLayer").show();
        $("body").css({ 'height': $(window).height(), 'overflow': 'hidden' });
    })

    $('.bt-recentpd ').on('click', function (e) {
        e.preventDefault();
        $("#rcntLayer").show();
        $("body").css({ 'height': $(window).height(), 'overflow': 'hidden' });
    })

    //최근 본 상품 닫기
    $(".rcnt-md-close , .popupbg ").on("click", function () {
        $("#rcntLayer").hide();
        $("body").css({ 'height': 'auto', 'overflow': 'auto' });
    })

})



function fnLoading(div1, div2) {
    //로딩DIV생성
    try {
        $(div1).css("width", $(div2).width());     //loading 할 div의 width 가져오기
        $(div1).css("height", $(div2).height());   //loading 할 div의 height 가져오기
        $(div1 + " .masterkey_blink").css("padding-top", ($(div2).height()) / 2 - 15)  //loading 텍스트를 로딩div 가운데 맞추기
        $(div1).show();
    }
    catch (e) {
        console.log(e);
    }
    function showPage() {
        document.getElementByclass("masterkey_blink").style.display = "none";
        document.getElementById("body").style.display = "block";
    }
}



//키보드 숫자만 입력
$(document).on("keyup", "input[numberOnly]", function () { $(this).val($(this).val().replace(/[^0-9]/gi, "")); })



//function spancheck(el) {
//var checkinput = el.previousElementSibling;
//el.addEventListener('keypress', function (e) {
//    const keyCode = e.keyCode;
//    if (keyCode == 13) { // Enter key

//    } 
//})


//}



//숫자만 입력가능
function onlyNumber(obj) {
    $(obj).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ""));
    });
}

/* 달력 */
$(function () {
    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd', // 데이터는 yyyy-MM-dd로 나옴
        closeText: '닫기',
        prevText: '',
        nextText: '',
        currentText: '오늘',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        weekHeader: 'Wk',
        firstDay: 0,
        isRTL: false,
        duration: 200,
        showAnim: 'fadeIn',
        //changeMonth: true,
        //changeYear: true,
        //yearRange: 'c-10:c',
        showMonthAfterYear: true,
        yearSuffix: '년',
        showOtherMonths: true, // 나머지 날짜도 화면에 표시
        selectOtherMonths: true, // 나머지 날짜에도 선택을 하려면 true
    });

    $('.calendarButton').on('click', function () {
        $(this).prev('.datepicker').focus();

    })


});



/*POST 방식으로 값 가지고 페이지 이동*/
function post_to_url(path, params) {

    try {
        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기 

        if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
            //ios 일때 처리 
            //ios에서는 페이지이동 후 history back으로 뒤로갔을 때 로딩모달창이 남아있기 때문에 숨겨주는 것 까지 
            $("#loading_0").show();





            var form = document.createElement("form");
            form.setAttribute("method", 'post');
            form.setAttribute("action", path);

            for (var key in params) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
            document.body.appendChild(form);

            form.submit();





            setTimeout(function () {
                $("#loading_0").hide();
            }, 3000);

        }
        else {
            $("#loading_0").show();


            var form = document.createElement("form");
            form.setAttribute("method", 'post');
            form.setAttribute("action", path);

            for (var key in params) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
            document.body.appendChild(form);

            form.submit();




            return;
        }
    }
    catch (e) {
        alert(e);
    }





}



function fnSearchMaster() {

    var keyword = $("#txtSearchMaster").val();
    if (keyword == "") {
        alert("검색어를 입력하세요");
        return
    }

    location.href = "/view/product/product_list.aspx?keyword=" + keyword;

}



/*페이지이동*/
function get_to_url(url) {

    try {
        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기 

        if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
            //ios 일때 처리 
            //ios에서는 페이지이동 후 history back으로 뒤로갔을 때 로딩모달창이 남아있기 때문에 숨겨주는 것 까지 
            $("#loading_0").show();
            window.location.href = url;
            setTimeout(function () {
                $("#loading_0").hide();
            }, 3000);

        }
        else {
            $("#loading_0").show();
            window.location.href = url;
            return;
        }
    }
    catch (e) {
        alert(e);
    }


}


/*페이지이동-뒤로가기*/
function fnMoveBack() {



    $("#loading_0").show();
    javascript: history.back();
    setTimeout(function () {
        $("#loading_0").hide();
    }, 1000);


}
