var targetUrl = "/common/component/order/claim/AjaxRefund.aspx";

var dlvfee;
var prdArr;

$(document).ready(function () {
    fnInfo();




});

$(document).on('click', 'input:checkbox', function () {
    fnRefundAmt();
});


$(document).on('change', 'select', function () {
    fnRefundAmt();
});

//교환가능한 상품 정보 조회
function fnInfo() {

    var orderno = $("#ContentPlaceHolder1_hidOrderno").val(); //주문번호

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

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

            if (data == null || data.RESULT == "N" || data.DATA.length == 0) {
                history.back();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }


            dlvfee = data.DLVFEE * 1;
            $("#tdAmt_Dlv").text(dlvfee.toLocaleString() + "원");
            var allData = data.DATA;

            var sHtml = "";
            for (var i = 0; i < allData.length; i++) {
                sHtml += "<div class='popupbox pdWrap'>";
                sHtml += "    <span class='imgWrap'>";
                sHtml += "        <label class='check-st-2'>";
                sHtml += "            <input type='checkbox'  id='p" + i.toString() + "'  />";
                sHtml += "            <span></span>";
                sHtml += "            <img src='" + allData[i]["IMG_LIST"] + "' alt='Alternate Text'  id='img" + i + "' />";
                sHtml += "        </label>";
                sHtml += "    </span>";
                sHtml += "    <div class='pdInfo'>";
                sHtml += "        <p class='pdtit'  id='pnm" + i + "'>" + allData[i]["PNM_SHOP"] + "</p>";
                if (allData[i]["OPTCD_P"] != "N") {
                    sHtml += "        <p class='pdoption'  id='desc" + i.toString() + "'>" + allData[i]["DESCRIPTION"] + "</p>";
                }
                else {
                    sHtml += "        <p class='pdoption'  id='desc" + i.toString() + "' style='display:none'>옵션없음</p>";
                }
                sHtml += "        <span class='pdquan'>반품요청수량<i>";
                sHtml += "<select id='sel" + i.toString() + "'>";
                for (var j = 1; j <= (allData[i]["CNT"] * 1) ; j++) {
                    sHtml += "              <option value='" + j + "'>" + j + "</option>                                         ";
                }
                sHtml += "</select></i></span>";
                sHtml += "    </div>";
                sHtml += "<input type='hidden' id='pid" + i.toString() + "' value='" + allData[i]["PID"] + "'/>";
                sHtml += "<input type='hidden' id='optcd_p" + i.toString() + "' value='" + allData[i]["OPTCD_P"] + "'/>";
                sHtml += "<input type='hidden' id='img_list" + i.toString() + "' value='" + allData[i]["IMG_LIST"] + "'/>";
                sHtml += "<input type='hidden' id='amt" + i.toString() + "' value='" + allData[i]["AMT"] + "'/>";
                sHtml += "<input type='hidden' id='amt_original" + i.toString() + "' value='" + allData[i]["AMT_ORIGINAL"] + "'/>";
                sHtml += "<input type='hidden' id='cnt_before" + i.toString() + "' value='" + allData[i]["CNT"] + "'/>";
                sHtml += "</div>";
            }
            $("#divPrdList").html(sHtml);
            fnRefundAmt();
        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });


}



//환불 금액 셋팅
function fnRefundAmt() {
    var tot_amt = 0;

    var chkCnt = $('input:checkbox').length;

    for (var i = 0; i < chkCnt; i++) {
        if ($('input:checkbox[id="p' + i.toString() + '"]').is(":checked") == true) {
            var cnt = $("#sel" + i).val() * 1; // 교환갯수
            tot_amt += ($("#amt" + i).val() * 1) * cnt; //총금액(원금액 + 옵션추가금액)
        }
    }


    $("#tdAmt_Ord").text(tot_amt.toLocaleString() + "원");

    tot_amt -= dlvfee;
    $("#tdAmt_Total").text(tot_amt.toLocaleString() + "원");


}

//환불하기
function fnRefund() {
    var orderno = $("#ContentPlaceHolder1_hidOrderno").val(); //주문번호

    var chkCnt = $('input:checkbox').length;

    var prdArr = new Array();
    for (var i = 0; i < chkCnt; i++) {
        if ($('input:checkbox[id="p' + i.toString() + '"]').is(":checked") == true) {
            var prdObj = new Object();
            prdObj.pid = $("#pid" + i).val(); //상품코드
            prdObj.pnm = $("#pnm" + i).text(); //상품명
            prdObj.optcd_p = $("#optcd_p" + i).val(); //옵션조합코드
            prdObj.img_list = $("#img_list" + i).val(); //이미지
            prdObj.amt = $("#amt" + i).val(); //옵션추가금액
            prdObj.cnt = $("#sel" + i).val(); //수량
            prdObj.description = $("#desc" + i).text(); //옵션명
            prdObj.amt_original = $("#amt_original" + i).val(); //원상품금액

            prdArr.push(prdObj);
        }
    }

    if (prdArr.length == 0) {
        alert("환불하실 상품을 선택해주세요."); //교환하실 상품을 선택해주세요
        return;
    }

    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var reason = ""; //사유

    var reason = $("#selReason").val(); //교환사유
    if (reason == 99) { //직접입력
        reason = $("#txtReason").val();
        if (reason == "") {
            alert("교환사유를 입력해주세요");
            return;
        }
    }
    else { //select 선택
        reason = $("#selReason option:checked").text();
    }



    var amt_dlv = dlvfee; //배송비


    var bankcd = $("#ContentPlaceHolder1_ddlBankcd").val();
    var virt_acntno = $("#txtVirt_acntno").val();
    var virt_acntnm = $("#txtVirt_acntnm").val();
    var tel = $("#txtTel").val();
    var recvnm = $("#txtRecvNm").val();
    var dlv_req = $("#txtDlvReq").val();


    if (zipcd == "") {
        alert("주소찾기 버튼을 클릭하여 주소를 입력해주세요");
        return;
    }
    if (addr2 == "") {
        alert("상세주소를 입력해주세요")
        return;
    }
    if (recvnm == "") {
        alert("수령인을 입력해주세요")
        return;
    }
    if (tel == "" || tel.length != 11) {
        alert("연락가능번호 11자리를 입력해주세요")
        return;
    }
    if (virt_acntno == "") {
        alert("계좌번호를 입력해주세요")
        return;
    }
    if (virt_acntnm == "") {
        alert("예금주를 입력해주세요")
        return;
    }




    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.orderno = orderno; //주문번호               
    bObj.zipcd = zipcd; //우편번호        
    bObj.addr1 = addr1; //주소            
    bObj.addr2 = addr2; //상세주소            
    bObj.bankcd = bankcd; //은행            
    bObj.virt_acntno = virt_acntno; //계좌번호        
    bObj.virt_acntnm = virt_acntnm; //예금주             
    bObj.tel = tel; //연락가능전화번호
    bObj.reason = reason; //사유       
    bObj.amt_dlv = amt_dlv; //배송비       
    bObj.dlv_req = dlv_req; //배송요청사항    
    bObj.prdArr = prdArr; //배송요청사항     
    bObj.rcvnm = recvnm; //수령인          
    bArr.push(bObj);

    totObj.header = hArr;
    totObj.body = bArr;
    console.log(totObj)
    $.ajax({
        method: "post",
        url: targetUrl,
        data: JSON.stringify(totObj), //Array를 JSON string형태로 변환
        dataType: "json",
        beforeSend: function () {
            //로딩 창 출력
            $("#loading_0").show();
        },
        success: function (data) {
            $("#loading_0").hide();


            var result = data.RESULT;

            if (result == "Y") {
                alert("교환신청이 완료되었습니다.");

                location.href = "/view/order/orderInfo.aspx";
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }
            else {
                alert("교환신청 실패하였습니다.");
            }


        },
        error: function (data, status, err) {
            alert("서버와의 통신이 실패했습니다.");
            $("#loading_0").hide();
            console.log(data);
            console.log(status);
            console.log(err);
            return;
        }

    });


}







//주소찾기
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
            document.getElementById('txtAddr2').focus();
            //type = 1 : 대표자 기본정보 우편번호

        }
    }).open();
}