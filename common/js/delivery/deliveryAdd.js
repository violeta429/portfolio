var targetUrl = "/common/component/delivery/AjaxDeliveryAdd.aspx";

var sType = ""; // U수정orI등록

$(document).ready(function () {
    sType = $("#hidType").val();
    
    if (sType == "U") {
        $("#hType").text("배송지수정");
        fnGetAddrInfo()
    }
    else if (sType == "I") {
        $("#hType").text("배송지등록");

    }

});

/*배송지정보 가져오기*/
function fnGetAddrInfo() {

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.seq = $("#hidSeq").val();

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
            //$("#loading_0").show();
        },
        success: function (data) {

            //$("#loading_0").hide();

            console.log(data);

            if (data == null || data["RESULT"] == "N") {
                alert(data["MSG"]);
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
            }

            var allData = data["DATA"];

            $("#txtRecvNm").val(allData["ADDRNM"]);
            $("#txtZipcd").val(allData["ZIPCD"]);
            $("#txtAddr1").val(allData["ADDR1"]);
            $("#txtAddr2").val(allData["ADDR2"]);
            $("#txtMobile").val(allData["MOBILE"]);
            $("#txtDlvReq").val(allData["DLVREQ"]);


            var defaultyn = allData["DEFAULTYN"];
            if (defaultyn == "Y") {
                $("input:checkbox[id='saveAd']").prop("checked", true);
            }


        },
        error: function (data, status, err) {
            alert("서버와의 통신이 실패하였습니다.");

            //$("#loading_0").hide();
            history.back();
            return;
        }
    });


}



function fnUpdate(seq) {

    var seq = $("#hidSeq").val();
    //배송정보
    var recvNm = $("#txtRecvNm").val();
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var mobile = $("#txtMobile").val();
    var dlvreq = $("#txtDlvReq").val();
    var defaultYn = "N";
    if ($("input:checkbox[id=saveAd]").is(":checked") == true) {
        defaultYn = "Y";
    }

    if (recvNm == "") {
        alert("수령인을 입력해주세요");
        return;
    }
    if (mobile == "" || mobile.length != 11) {
        alert("연락처 11자리를 정확히 입력해주세요");
        return;
    }
    if (zipcd == "") {
        alert("주소찾기 버튼을 클릭 해 주소를 입력해주세요");
        return;
    }
    if (addr2 == "") {
        alert("상세주소를 입력해주세요");
        return;
    }



    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.seq = seq;

    bObj.RECVNM = recvNm;
    bObj.ZIPCD = zipcd;
    bObj.ADDR1 = addr1;
    bObj.ADDR2 = addr2;
    bObj.MOBILE = mobile;
    bObj.DLVREQ = dlvreq;
    bObj.DEFAULTYN = defaultYn;

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
            //$(".loadBody").show();
        },
        success: function (data) {

            //$(".loadBody").hide();

            console.log(data);

            if (data["RESULT"] == "Y") {
                alert("수정되었습니다.");
                history.back();
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
            }
            else {
                alert("수정 실패하였습니다.");
                return;

            }


        },
        error: function (data, status, err) {
            alert("서버와의 통신이 실패하엿습니다.");

            //$(".loadBody").hide();
            //console.log(data);
            //console.log(status);
            //console.log(err);
            return;
        }
    });

}


function fnInsert() {
    //배송정보
    var recvNm = $("#txtRecvNm").val();
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var mobile = $("#txtMobile").val();
    var dlvreq = $("#txtDlvReq").val();
    var defaultYn = "N";
    if ($("input:checkbox[id=saveAd]").is(":checked") == true) {
        defaultYn = "Y";
    }


    if (recvNm == "") {
        alert("수령인을 입력해주세요");
        return;
    }
    if (mobile == "" || mobile.length != 11) {
        alert("연락처 11자리를 정확히 입력해주세요");
        return;
    }
    if (zipcd == "") {
        alert("주소찾기 버튼을 클릭 해 주소를 입력해주세요");
        return;
    }
    if (addr2 == "") {
        alert("상세주소를 입력해주세요");
        return;
    }


    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "03";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.RECVNM = recvNm;
    bObj.ZIPCD = zipcd;
    bObj.ADDR1 = addr1;
    bObj.ADDR2 = addr2;
    bObj.MOBILE = mobile;
    bObj.DLVREQ = dlvreq;
    bObj.DEFAULTYN = defaultYn;

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
            //$(".loadBody").show();
        },
        success: function (data) {

            //$(".loadBody").hide();

            if (data["RESULT"] == "Y") {
                alert("등록되었습니다.");
                history.back();
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
            }
            else {
                alert("등록 실패하였습니다.");
                return;

            }



        },
        error: function (data, status, err) {
            alert("서버와의 통신에 실패하였습니다.");

            return;
        }
    });
}

function fnSave() {
    if (sType == "U") {
        fnUpdate()

    }
    else if (sType == "I") {
        fnInsert()
    }
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