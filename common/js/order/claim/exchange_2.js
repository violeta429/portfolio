var targetUrl = "/common/component/order/claim/AjaxExchange_2.aspx";
var prdArr;
var dlvfee = 0;

$(document).ready(function () {

    prdArr = JSON.parse($("#ContentPlaceHolder1_hidPrdArr").val());
    //prdArr = JSON.parse(prdJson);

    fnGetInfo();
});

//교환정보 셋팅
function fnGetInfo() {


    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.prdArr = prdArr;
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
                sHtml += "	<div class='expd_choice'>";
                sHtml += "       <div>";
                sHtml += "           <span class='imgWrap'>";
                sHtml += "               <img src='" + prdArr[i]["img_list"] + "' />";
                sHtml += "           </span>";
                sHtml += "           <div class='pdInfo'>";
                sHtml += "               <p class='pdtit'>" + prdArr[i]["pnm"] + "</p>";
                if (prdArr[i]["optcd_p"] != "N") {
                    sHtml += "               <p class='pdoption'>" + prdArr[i]["description"] + "</p>";
                }
                sHtml += "           </div>";
                sHtml += "       </div>";
                sHtml += "       <div class='selectwrap'>";
                sHtml += allData[i]["HTML"];
                sHtml += "       </div>";
                if(prdArr[i]["optcd_p"] == "N"){
                    sHtml += "      <input type='hidden' id='optcd_p_after_" + i + "' value='N' />";
                    sHtml += "      <input type='hidden' id='amt_exchange_" + i + "' value='0' />";

                }
                else {
                    sHtml += "      <input type='hidden' id='optcd_p_after_" + i + "' />";
                    sHtml += "      <input type='hidden' id='amt_exchange_" + i + "' />";

                }
                
                sHtml += "   </div>";

            }

            $("#divPrdList").html(sHtml);
            //초기셋팅 후 바로 금액 한번 계산(옵션 없음 때문에)
            fnExchangeAmt();
        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });


}


/*옵션 변경 시*/
function fnWhenSelectOption(prdId, selectedId) {


    //'선택' 선택 시 select 초기화
    if ($("#option_" + prdId + "_" + selectedId).val() == "non") {
        fnInitSelect(prdId, selectedId);
        return;
    }


    //다음 셀렉트박스 없으면 RETURN
    var nextSelect = $("#option_"+prdId+"_" + (selectedId * 1 + 1)).attr("onchange");
    if (nextSelect === undefined) {
        getOptcd_p(prdId);
        return;
    }



    //이전 옵션
    var optionArr_before = new Array();
    var last = parseInt(selectedId);
    for (var i = 1; i <= parseInt(selectedId) ; i++) {
        var optionObj_before = new Object();
        var selectedOptcd_h = $("#option_" + prdId + "_" + (i * 1)).attr("onchange").split('"')[5];
        var selectedOptcd_b = $("#option_" + prdId + "_" + i).val();


        optionObj_before["OPTCD_H"] = selectedOptcd_h;
        optionObj_before["OPTCD_B"] = selectedOptcd_b;

        optionArr_before.push(optionObj_before);
    }
    var selectedOptcd_b = $("#option_" + prdId + "_" + selectedId).val();

    var nextOptcd_h = nextSelect.split('"')[5];

    try {
        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();
        hObj.type = "02";
        hArr.push(hObj);

        var bArr = new Array();
        var bObj = new Object();
        bObj.pid = prdArr[prdId*1]["pid"];
        bObj.option_before = optionArr_before;
        bObj.optcd_h = nextOptcd_h;
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

            },
            success: function (data) {

                console.log(data);


                if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                    return;
                }

                else if (data.RESULT == "Y") {
                    var data1 = data.DATA;
                    var sHtml = "";
                    sHtml += "<option value='non'>선택</option>";
                    for (var i = 0; i < data1.length; i++) {
                        sHtml += "<option value='" + data1[i].OPTCD_B + "'>";
                        sHtml += data1[i].OPTNM;
                        if (data1[i].AMT != "+0") {
                            sHtml += "(" + data1[i].AMT + ")";
                        }
                        sHtml += "</option>";
                    }

                    $("#option_" + prdId + "_" + (selectedId * 1 + 1)).empty();
                    $("#option_" + prdId + "_" + (selectedId * 1 + 1)).html(sHtml);

                }
                else {
                    alert("서버와의 통신에 실패하였습니다.");
                    $("#option" + (selectedId * 1 + 1)).empty();
                    var sHtml = "";
                    sHtml += "<option value='non'>선택</option>";
                    $("#option_" + prdId + "_" + (selectedId * 1 + 1)).html(sHtml);

                    return;
                }


            },
            error: function (data, status, err) {
                alert("서버와의 통신에 실패하였습니다.");
                console.log(data);
                console.log(status);
                console.log(err);
                return;
            }
        });
    }
    catch (e) {
        console.log(e);
        //alert(e);
    }
}


/*마지막 옵션 선택 시 선택한 옵션에 따라 OPTCD_P 구하기*/
function getOptcd_p(prdId) {

    var pid = prdArr[prdId * 1]["pid"];

    //이전 옵션
    var optionArr = new Array();

    var i = 1;
    while (true) {
        var optionObj_before = new Object();
        var selectedOptcd_h = $("#option_" + prdId + "_" + (i * 1)).attr("onchange").split('"')[5];

        var selectedOptcd_b = $("#option_" + prdId + "_" + i).val();

        optionObj_before["OPTCD_H"] = selectedOptcd_h;
        optionObj_before["OPTCD_B"] = selectedOptcd_b;

        optionArr.push(optionObj_before);


        var nextSelect = $("#option_" + prdId + "_" + (i * 1 + 1)).attr("onchange");  //다음 셀렉트박스 없으면 RETURN
        if (nextSelect === undefined) {
            break;
        }

        i++;
    }


    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "03";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.pid = pid;
    bObj.optionArr = optionArr;
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
        },
        success: function (data) {

            console.log(data);


            if (data["RESULT"] == "N") {
                alert("서버와의 통신에 실패하였습니다.");
                history.back();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }


            var allData = data["DATA"];
            // 조회된게없음
            if (allData["OPTCD_P"] == "") { history.back(); return; }

           
            var optcd_p = allData["OPTCD_P"]; //OPTCD_P
            var amt_sale = allData["AMT_SALE"]; //현재 상품 판매가(구매시와 금액 다를수있음)
            var amt_add = allData["AMT_ADD"]; //옵션추가금액


            //교환 후 상품조합코드
            $("#optcd_p_after_" + prdId).val(optcd_p);

            //추가금액계산

            console.log((prdArr[prdId * 1]["amt"] * 1))
            console.log((amt_sale * 1 + amt_add * 1))
            console.log((prdArr[prdId * 1]["cnt"] * 1))

            var chg_amt = ((amt_sale * 1 + amt_add * 1) - (prdArr[prdId * 1]["amt"] * 1)) * (prdArr[prdId * 1]["cnt"] * 1);
            $("#amt_exchange_" + prdId).val(chg_amt);

            fnExchangeAmt();

        },
        error: function (data, status, err) {
            alert("서버와의 통신에 실패하였습니다.");
            console.log(data);
            console.log(status);
            console.log(err);
            return;
        }

    });
}

//교환 후 상품 수량 변경 시 총 차액 보여주기(완료)
function fnExchangeAmt() {
    var tot_amt = 0;

    for (var i = 0; i < prdArr.length; i++){
        var amt = $("#amt_exchange_" + i).val();
        if(amt == ""){
            continue;
        }

    }

    tot_amt += (amt * 1);
    $("#tdAmt_Add").text(tot_amt.toLocaleString() + "원");

    tot_amt += dlvfee;
    $("#tdAmt_Total").text(tot_amt.toLocaleString() + "원");


}

/*select 초기화*/
function fnInitSelect(prdId, seq) {

    var start = seq * 1;

    var optionSelect = $("select[id^='option_" + prdId + "_']");
    for (var i = start; i <= optionSelect.length; i++) {
        $("#option_" + prdId + "_" + i).val("non");
        $("#optcd_p_after_" + prdId).val("");
        $("#amt_exchange_" + prdId).val("");
    }



}
 

//교환
function fnExchange() {
    var orderno = $("#ContentPlaceHolder1_hidOrderNo").val(); //주문번호
    var afterExcArr = new Array();
    for (var i = 0; i < prdArr.length; i++) {

        if ($("#optcd_p_after_" + i).val() == "") {
            alert("교환할 옵션을 선택해주세요");
            return;
        }

        var afterExcObj = new Object();
        afterExcObj.PID = prdArr[i]["pid"];
        afterExcObj.OPTCD_P_BEFORE =  prdArr[i]["optcd_p"];
        afterExcObj.OPTCD_P_AFTER = $("#optcd_p_after_" + i).val();
        afterExcObj.AMT = $("#amt_exchange_" + i).val().replace(/[^0-9]/g, '');
        afterExcObj.CNT = prdArr[i]["cnt"];
        afterExcArr.push(afterExcObj);
    }
   
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var reason = $("#ContentPlaceHolder1_hidReason").text(); //사유
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
    if (mobile == "" || mobile.length != 11) {
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

    hObj.type = "04";
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
    bObj.afterExcArr = afterExcArr; //배송요청사항      
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
