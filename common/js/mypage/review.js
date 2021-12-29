var targetUrl = "/common/component/mypage/AjaxReview.aspx";
var star = "";

$(document).ready(function () {
    fnGetInfo();

    $('li').click(function () {
        star = $(this).data('value');
    });
});



//주문 상품 셋팅
function fnGetInfo() {

    var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val();
    var pid = $("#ContentPlaceHolder1_MainContent_hidPid").val();

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    // 주문내역 상세조회
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.orderno = orderno;
    bObj.pid = pid;
    bArr.push(bObj);

    totObj.header = hArr;
    totObj.body = bArr;
    console.log(totObj);

    $.ajax({
        method: "post",
        url: targetUrl,
        data: JSON.stringify(totObj),
        dataType: "json",
        beforeSend: function () {
            $("#loading_0").show();
        },
        success: function (data) {
            $("#loading_0").hide();
            console.log(data);

            if (data == null || data.RESULT == "N") {
                //history.back();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
            }

            var allData = data.DATA;
            $("#imgPrd").attr("src", allData["FILEURL"]);
            $("#pPnm").text( allData["PNM"]);

            var sHtml = "";
            for (var i = 0; i < allData["OPTION"].length; i++){
                sHtml += " <span class='opt_tit'>" + allData["OPTION"][i] + "</span>";
            }
            $("#divOption").html(sHtml);
            
        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });


}

function fnRegit() {

    var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val();
    var pid = $("#ContentPlaceHolder1_MainContent_hidPid").val();
    var content = $("#txtContent").val();

    if(content == ""){
        alert("리뷰를 작성해주세요");
        return;
    }
    if(star == ""){
        alert("별점을 선택해주세요.");
        return;
    }

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    // 수정
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.orderno = orderno;
    bObj.pid = pid;
    bObj.content = content;
    bObj.star = star;
    bArr.push(bObj);

    totObj.header = hArr;
    totObj.body = bArr;
    console.log(totObj);

    $.ajax({
        method: "post",
        url: targetUrl,
        data: JSON.stringify(totObj),
        dataType: "json",
        beforeSend: function () {
            $("#loading_0").show();
        },
        success: function (data) {
            $("#loading_0").hide();
            console.log(data);


            if (data == null || data.RESULT == "N") {
                history.back();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
            }
            if (data.RESULT == "Y") {
                alert("리뷰가 등록되었습니다.");
                history.back();
            }


        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });

}


