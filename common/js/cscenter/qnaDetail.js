var targetUrl = "/common/component/cscenter/AjaxQnaDetail.aspx";


function fnModify() {

    var seq = $("#ContentPlaceHolder1_CsContent_hidSeq").val(); //타이틀
    location.href = "/view/cscenter/qnaEdit.aspx?seq="+seq;
}


/*상담수정*/
function fnWriteQna() {

    var title = $("#txtTitle").val(); //타이틀
    var contreq = $("#txtReq").val(); //접수내용

    if (title == "") { alert("제목을 입력해주세요"); return; }
    if (contreq == "") { alert("문의내용을 입력해주세요"); return; }

    if (!confirm("수정하시겠습니까?")) { return; }

    var totObj = new Object();

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.contreq = contreq;
    bObj.title = title;

    bArr.push(bObj);

    totObj.header = hArr;
    totObj.body = bArr;


    $.ajax({
        method: "post",
        url: targetUrl,
        data: JSON.stringify(totObj), //Array를 JSON string형태로 변환
        dataType: "json",
        async: false,
        beforeSend: function () {
            $("#loading_0").show();

        },
        success: function (data) {
            $("#loading_0").hide();

            if (data == null || data.RESULT == "N") {
                alert("수정실패하였습니다.");
            } else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
            }
            else {
                alert("수정되었습니다.")
                history.back();
            }



        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            alert("서버와의 통신에 실패하였습니다.");
        }
    }); //Ajax End
}







