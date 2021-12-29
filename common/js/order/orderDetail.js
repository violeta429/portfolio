var targetUrl = "/common/component/order/AjaxOrderDetail.aspx";

$(document).ready(function () {
    fnGetInfo();


});

//주문내역 상세조회
function fnGetInfo() {

    var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val();

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    // 주문내역 상세조회
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.orderno = orderno;
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
                return;
            }


            var allData = data.DATA;

            $("#spOrderno").text(orderno);
            $("#pDate").text(allData["ENTDTM"]);
            $("#pStatus").text(allData["STATUSNM"])
            $("#divPrdList").html(allData["PRDLIST"]);
            $("#txtRecvNm").val(allData["RECVNM"]);
            $("#txtMobile").val(allData["MOBILE"]);
            $("#txtZipcd").val(allData["ZIPCD"]);
            $("#txtAddr1").val(allData["ADDR1"]);
            $("#txtAddr2").val(allData["ADDR2"]);
            $("#txtDlvReq").val(allData["DLVREQ"]);


            $("#txtRecvNmN").val(allData["RECVNM"]);
            $("#txtMobileN").val(allData["MOBILE"]);
            $("#txtDlvReqN").val(allData["DLVREQ"]);
            $("#txtAddrN").val("(" + allData["ZIPCD"] + ") " + allData["ADDR1"] + allData["ADDR2"]);

            if (allData["STATUS"] == "01" || allData["STATUS"] == "02") {
                $("#btnChgDlv").show();
                $("#divChgN").hide();
                $("#divChgY").show();
            }
            else {
                $("#btnChgDlv").hide();
                $("#divChgY").hide();
                $("#divChgN").show();
            }
            $("#pPaytype").text(allData["PAYTYPENM"]);
            $("#spAmt_prd").text(allData["AMT_PRD"]);
            $("#spAmt_dlv").text(allData["AMT_DLV"]);
            $("#spAmt_cash").text(allData["CASH"]);
            $("#spAmt_point").text(allData["POINT"]);
            $("#spAmt_pay").text(allData["AMT_PAY"]);
            $("#spAmt_save").text(allData["AMT_SAVE"]);




        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });


}

//배송지수정
function fnChgDlvInfo() {


    var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val(); //주문번호

    //배송정보

    var recvNm = $("#txtRecvNm").val();
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var mobile = $("#txtMobile").val().replace(/[^(0-9)]/gi, "");
    var dlvreq = $("#txtDlvReq").val();

    if (recvNm == "") {
        alert("수령인을 입력해주세요")
        return;
    }
    if (mobile == "" || mobile.length != 11) {
        alert("수령인 휴대폰번호 11자리를 입력해주세요")
        return;
    }
    if (zipcd == "") {
        alert("주소찾기 버튼을 클릭하여 주소를 입력해주세요")
        return;
    }
    if (addr2 == "") {
        alert("상세주소를 입력해주세요")
        return;
    }

    if (!confirm("배송지를 변경하시겠습니까?")) {
        return;
    }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.orderno = orderno;
    bObj.recvNm = recvNm;
    bObj.zipcd = zipcd;
    bObj.addr1 = addr1;
    bObj.addr2 = addr2;
    bObj.mobile = mobile;
    bObj.dlvreq = dlvreq;
    bArr.push(bObj);

    var totObj = new Object();
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

            if (data["RESULT"] == "Y") {
                alert("수정이 완료되었습니다.");
                location.reload();
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }

            else {
                alert("수정 실패하였습니다.");
            }
        },
        error: function (data, status, err) {
            alert("서버와의 통신에 실패하였습니다.");

            $("#loading_0").hide();

            console.log(data);
            console.log(status);
            console.log(err);
            return;
        }
    });

}

function fnReview(pid) {


    var orderno = $("#ContentPlaceHolder1_MainContent_hidOrderno").val();
    location.href = "/view/mypage/review.aspx?orderno="+orderno+"&pid="+pid;
}


/*우편번호*/
function fnDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                fullAddr = data.roadAddress;

            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                fullAddr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            if (data.userSelectedType === 'R') {
                //법정동명이 있을 경우 추가한다.
                if (data.bname !== '') {
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if (data.buildingName !== '') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            //$('#divAgZipcd').text(data.zonecode);//5자리 새우편번호 사용
            $('#txtZipcd').val(data.zonecode);

            //$('#divAgAddr1').text(fullAddr);
            $('#txtAddr1').val(fullAddr);

            // 커서를 상세주소 필드로 이동한다.
            $('#txtAddr2').val("");
            document.getElementById('txtAddr2').focus();
            //type = 1 : 대표자 기본정보 우편번호

        }
    }).open();
}

