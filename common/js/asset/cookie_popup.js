
//하루동안 배너 보이지않기


function getCookie(name) {
    var cookie = document.cookie;
    if (document.cookie != "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "popupYN") {
                return cookie_name[1]
                ;
            }
        }
    } return;
}

$(function () {
    //배너 감추기
    $('.b_close').on("click", function () {
        $('.head_banner').animate({ 'height': '0' }, function () {
            $('.head_banner').hide();
        })

    });
})


// 배너 설정

function openPopup() {
    var cookieCheck = getCookie("popupYN");
    if (cookieCheck != "N") {
        //팝업조회

        var targetUrl = "/common/component/master/AjaxMaster.aspx";

        try {

            var hArr = new Array();
            var hObj = new Object();
            hObj.type = "03"; //배너 조회
            hArr.push(hObj);

            var bArr = new Array();
            var bObj = new Object();
            bArr.push(bObj);

            var totObj = new Object();
            totObj.header = hArr;
            totObj.body = bArr;

            $.ajax({
                method: "post",
                url: targetUrl,
                data: JSON.stringify(totObj),
                dataType: "json",
                beforeSend: function () {
                    //로딩 창 출력X

                },
                success: function (data) {
                    var result = data.RESULT; //통신결과

                    if (data.RESULT == "Y") {

                        var allData = data.DATA;
                        for (var i = 0; i < allData.length; i++) {
                            if (allData[i]["FILETYPE"] == "ST01") { $("#masterBanner_P").attr("src", allData[i]["FILEPATH"]); }
                            else if (allData[i]["FILETYPE"] == "ST02") { $("#masterBanner_M").attr("src", allData[i]["FILEPATH"]); }
                        }

                        //document.querySelector(".head_banner").style.display = 'block';

                        //$('.head_banner').fadeIn(300, function () {
                        //    $(this).slideDown();
                        //})
                    }

                },
                error: function (data, status, err) {
                    return;
                }
            });
        }
        catch (e) {

        }
    } else {
        document.querySelector(".head_banner").style.display = 'none';
    }
}


//쿠키 설정
function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString();
}                           

//배너닫기
function closePopup() {
    if (document.getElementById("bnerck").checked) {
        setCookie("popupYN", "N", 1);
        $('.head_banner').animate({ 'height': '0' }, function () {
            $('.head_banner').hide();
        })
    }

    if (document.getElementById("bnerck2").checked) {
        setCookie("popupYN", "N", 1);
        $('.head_banner').animate({ 'height': '0' }, function () {
            $('.head_banner').hide();
        })
    }

}

//배너 호출

document.addEventListener("DOMContentLoaded", function () {
    openPopup();
});




