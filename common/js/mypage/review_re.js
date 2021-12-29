var targetUrl = "/common/component/mypage/AjaxMyReview_re.aspx";

var star = "";

$(document).ready(function () {

    //정보불러오기
    fnGetInfo();


});

$(document).on('click', 'li', function () {
    //아이디가 id 인거를 'click', 클릭할때마다 이벤트가 일어난다.
    star = $(this).data('value');
});

//정보불러오기
function fnGetInfo() {

    try {

        var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val();
        var pid = $("#ContentPlaceHolder1_MainContent_hidPid").val();

        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();

        //정보불러오기
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
                    alert("잘못된 접근입니다.");
                    history.back();
                    return;
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }

                var allData = data.DATA;

                $("#pPnm").text(allData["PNM"]);
                $("#imgPrd").attr("src", allData["FILEURL"]);

                var sHtml = "";
                for (var i = 0; i < allData["OPTION"].length; i++) {
                    sHtml += " <span class='opt_tit'>" + allData["OPTION"][i] + "</span>";
                }
                $("#divOption").html(sHtml);

                star = allData["STAR"];

                sHtml = "";
                for (var i = 0; i < (allData["STAR"] * 1) ; i++) { //색깔별
                    sHtml += "<li class='star selected' data-value='"+(i+1)+"'>";
                    sHtml += "    <i class='fa fa-star fa-fw'></i> ";
                    sHtml += "</li>";
                }
                for (var i = (allData["STAR"] * 1) ; i < 5 ; i++) { //회색별
                    sHtml += "<li class='star' data-value='" + (i + 1) + "'>    ";
                    sHtml += "    <i class='fa fa-star fa-fw'></i>";
                    sHtml += "</li>                               ";
                }
                console.log(sHtml)
                $("#stars").html(sHtml);


                $("#txtContent").html(allData["CONTENT"]);




            },
            error: function (data, status, err) {
                $("#loading_0").hide();

                alert("서버와의 통신에 실패하였습니다.");
            }
        });

    } catch (e) {
        $("#loading_0").hide();
        alert("서버와의 통신에 실패하였습니다.");
    }

}

function fnUpdate() {

    var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val();
    var pid = $("#ContentPlaceHolder1_MainContent_hidPid").val();
    var content = $("#txtContent").val();

    if (content == "") {
        alert("리뷰를 작성해주세요");
        return;
    }
    if (star == "") {
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
                alert("리뷰가 수정되었습니다.");
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
