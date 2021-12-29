var targetUrl = "/common/component/order/AjaxOrderPay.aspx";

var btnPointYn = "N";
var maxAmt;
var maxCash;
var maxPoint;


$(document).ready(function () {
    var radioContent = $(".resultArea > div");

    var indx = $(".paytab input[type='radio']:checked").index();
    radioContent.eq(indx).show();
    $(".paytab input[type='radio']").click(function () {
        $(".paytab input[type='radio']:checked").index();


        $(".paytab input[type='radio']").parent().removeClass("on");
        $(this).parent().addClass('on');
        radioContent.hide();
        radioContent.eq($("input[type='radio']").index(this)).show();
    });



    $('#ContentPlaceHolder1_ddlDlvReq').change(function () {
        var value = $('#ContentPlaceHolder1_ddlDlvReq option:selected').val();
        if (value == '99') {
            $('#txtDlvReq').val("");
            $('#txtDlvReq').show();
        } else {
            var text = $('#ContentPlaceHolder1_ddlDlvReq option:selected').text();
            $('#txtDlvReq').val(text);
            $('#txtDlvReq').hide();
        }
    });



    maxAmt = parseInt($('#ContentPlaceHolder1_spAmt_prd').text().replace(/[^0-9]/g, '')) + parseInt($('#ContentPlaceHolder1_spAmt_dlv').text().replace(/[^0-9]/g, '')); //최대금액 = 원금액 + 배송금액
    maxCash = parseInt($("#ContentPlaceHolder1_spCash").text().replace(/[^(0-9)]/gi, "")); //보유캐시
    maxPoint = parseInt($("#ContentPlaceHolder1_spPoint").text().replace(/[^(0-9)]/gi, "")); //보유포인트


    if (maxPoint < parseInt($("#ContentPlaceHolder1_hidMinAmt_p").val())) {
        btnPointYn = "N";
    }
    else {
        btnPointYn = "Y";
    }


    //캐시 금액 입력시 결제금액 변경 
    $("#txtAmt_Cash").on("propertychange change keyup paste input", function () {

        //사용할 캐시 빈값일때 0원 세팅
        if ($("#txtAmt_Cash").val() == "") { $("#txtAmt_Cash").val("0") };

        //맨앞에 0 입력시 제거 
        if ($("#txtAmt_Cash").val().length > 1) {
            $("#txtAmt_Cash").val($("#txtAmt_Cash").val().replace(/^0+/, ''));
        }

        var amt_cash_use;
        if ($("#txtAmt_Cash").val() == '') { amt_cash_use = 0; }
        else { amt_cash_use = parseInt($("#txtAmt_Cash").val().replace(/[^(0-9)]/gi, "")); } //사용할캐시
        var amt_point_use = parseInt($("#txtAmt_Point").val().replace(/[^(0-9)]/gi, "")); //사용할포인트

        //캐시최대사용금액 = 전체최대사용금액 - 포인트사용금액
        var maxAmt_c = maxAmt - amt_point_use;

        //사용캐시 > 보유캐시
        if (amt_cash_use > maxCash) {
            // 사용캐시 = 보유캐시 설정
            amt_cash_use = maxCash;
            $("#txtAmt_Cash").val(maxCash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }

        //사용캐시 > 결제금액
        if (amt_cash_use > maxAmt_c) {
            // 사용캐시 = 결제금액
            amt_cash_use = maxAmt_c;
            $("#txtAmt_Cash").val(maxAmt_c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }

        $("#spAmt_cash").text("- " + amt_cash_use.toLocaleString());
        $("#ContentPlaceHolder1_spAmt_total").text((maxAmt_c - amt_cash_use).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

        if (maxAmt_c - amt_cash_use <= 0) {
            $("#divPay").hide();
        }
        else {
            $("#divPay").show();
        }

    });

    //포인트 금액 입력시 결제금액 변경
    $("#txtAmt_Point").on("propertychange change keyup paste input", function () {
        //원금액 세팅
        //maxAmt = parseInt($("#hidAmt_original").val().replace(/[^(0-9)]/gi, "")); //최대금액 = 원금액

        //사용할 포인트 빈값일때 0원 세팅
        if ($("#txtAmt_Point").val() == "") { $("#txtAmt_Point").val("0") };

        //맨앞에 0 입력시 제거 
        if ($("#txtAmt_Point").val().length > 1) {
            $("#txtAmt_Point").val($("#txtAmt_Point").val().replace(/^0+/, ''));
        }
        var amt_point_use;
        if ($("#txtAmt_Point").val() == '') { amt_point_use = 0; }
        else { amt_point_use = parseInt($("#txtAmt_Point").val().replace(/[^(0-9)]/gi, "")); } //사용할포인트
        var amt_cash_use = parseInt($("#txtAmt_Cash").val().replace(/[^(0-9)]/gi, "")); //사용할캐시

        var usablePoint = parseInt($("#ContentPlaceHolder1_spPoint").text().replace(/[^(0-9)]/gi, ""));
        var minUsePoint = parseInt($("#ContentPlaceHolder1_hidMinAmt_p").val());


        if (usablePoint < minUsePoint) { //보유포인트 < 포인트 사용 최소금액
            $("#txtAmt_Point").val("0");
            $("#txtAmt_Point").prop('readonly', true);
        }


        //캐시최대사용금액 = 전체최대사용금액 - 캐시사용금액
        var maxAmt_p = maxAmt - amt_cash_use;

        //사용포인트 > 보유포인트
        if (amt_point_use > maxPoint) {
            // 사용포인트 = 보유포인트 설정
            amt_point_use = maxPoint;
            $("#txtAmt_Point").val(maxPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }

        //사용포인트 > 결제포인트
        if (amt_point_use > maxAmt_p) {
            // 사용포인트 = 결제포인트
            amt_point_use = maxAmt_p;
            $("#txtAmt_Point").val(maxAmt_p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }

        $("#spAmt_point").text("- " + amt_point_use.toLocaleString());
        $("#ContentPlaceHolder1_spAmt_total").text((maxAmt_p - amt_point_use).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));



        if (maxAmt_p - amt_point_use <= 0) {
            $("#divPay").hide();
        }
        else {
            $("#divPay").show();
        }
    });







    fnGetOrdererInfo(); //주문자 정보 가져오기

});



//주문자, 대표배송지정보 가져오기
function fnGetOrdererInfo() {
    //좀이따추가

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "01";
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
            $("#loading_0").show();
        },
        success: function (data) {

            $("#loading_0").hide();

            if (data["RESULT"] == "N") {
                alert(data["MSG"]);
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }


            var allData = data["DATA"];

            //구매자정보
            var buyerData = allData["BUYER"];
            $("#txtOrdererNm").val(buyerData["NAME"]);


            $("#ordererMobile1").val(buyerData["MOBILE1"]);
            $("#ordererMobile2").val(buyerData["MOBILE2"]);
            $("#ordererMobile3").val(buyerData["MOBILE3"]);
            $("#txtOrdererNm").val(buyerData["NAME"]);

            //기본배송정보
            var addrData = allData["ADDR"];
            if (addrData["RESULT"] == "Y") { //대표배송지 있을때
                $("#ContentPlaceHolder1_selAddrType").val("list");

                $("#txtRecvNm").val(addrData["ADDRNM"]);
                $("#txtZipcd").val(addrData["ZIPCD"]);
                $("#txtAddr1").val(addrData["ADDR1"]);
                $("#txtAddr2").val(addrData["ADDR2"]);
                $("#txtMobile1").val(addrData["MOBILE1"]);
                $("#txtMobile2").val(addrData["MOBILE2"]);
                $("#txtMobile3").val(addrData["MOBILE3"]);

                $("#ContentPlaceHolder1_ddlDlvReq").val(addrData["DLVREQCD"]);

                if (addrData["DLVREQCD"] == "99") {
                    $("#txtDlvReq").val(addrData["DLVREQ"]);
                    $("#txtDlvReq").show();
                }
                else {
                    $("#txtDlvReq").val("");
                    $("#txtDlvReq").hide();
                }

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


/*배송지선택 클릭*/
function fnSelAddrType(type) {

    if (type == "A") { //배송지선택
        $("#txtOrdererNm").val("");
        $("#ordererMobile1").val("");
        $("#ordererMobile2").val("");
        $("#ordererMobile3").val("");
        $("#txtRecvNm").val("");
        $("#txtMobile1").val("");
        $("#txtMobile2").val("");
        $("#txtMobile3").val("");
        $("#txtZipcd").val("");
        $("#txtAddr1").val("");
        $("#txtAddr2").val("");
        $("#ContentPlaceHolder1_ddlDlvReq option:eq(0)").prop("selected", true);
    }
    else if (type == "B") { //직접입력
        window.open('/view/delivery/deliveryInfo.aspx?type=O', '_blank', 'scrollbars=yes, resizable=no width=420 height=650, left=650,top=250');

    }


}



//캐시, 포인트 모두사용 버튼 클릭
function fnUseAll(type) {
    var amt_cash_use = parseInt($("#txtAmt_Cash").val().replace(/[^(0-9)]/gi, "")); //사용 캐시
    var amt_point_use = parseInt($("#txtAmt_Point").val().replace(/[^(0-9)]/gi, "")); //사용 포인트

    if (type == "C") { //캐시

        var maxAmt_c = maxAmt - amt_point_use; // 원금액 - 포인트 사용 금액

        amt_cash_use = parseInt($("#ContentPlaceHolder1_spCash").text().replace(/[^(0-9)]/gi, "")); //사용 캐시
        if (amt_cash_use > maxAmt_c) { //사용캐시 > 사용가능금액
            // 사용캐시 = 결제가능금액
            amt_cash_use = maxAmt_c;
            //$("#tdAmt_Cash").val("￦" + maxAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
        $("#txtAmt_Cash").val(amt_cash_use.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $("#spAmt_cash").text("- " + amt_cash_use.toLocaleString());
    }
    else if (type == "P") { //포인트

        if (btnPointYn == "N") {
            return;
        }

        var usablePoint = parseInt($("#ContentPlaceHolder1_spPoint").text().replace(/[^(0-9)]/gi, ""));
        var minUsePoint = parseInt($("#ContentPlaceHolder1_hidMinAmt_p").val());

        if (usablePoint < minUsePoint) { //보유포인트 < 포인트 사용 최소금액
            $("#txtAmt_Point").val("0");
            $("#txtAmt_Point").prop('readonly', true);
            return;
        }

        var maxAmt_p = maxAmt - amt_cash_use; // 원금액 - 캐시 사용 금액
        amt_point_use = parseInt($("#ContentPlaceHolder1_spPoint").text().replace(/[^(0-9)]/gi, "")); //사용 포인트


        if (amt_point_use > maxAmt_p) { //사용포인트 > 사용가능금액
            // 사용포인트 = 결제가능금액
            amt_point_use = maxAmt_p;
            //$("#tdAmt_Cash").val("￦" + maxAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
        $("#txtAmt_Point").val(amt_point_use.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $("#spAmt_point").text("- " + amt_point_use.toLocaleString());
    }

    $("#ContentPlaceHolder1_spAmt_total").text((maxAmt - amt_cash_use - amt_point_use).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    if (maxAmt - amt_cash_use - amt_point_use <= 0) {
        $("#divPay").hide();
    }
    else {
        $("#divPay").show();
    }
}

/*결제하기 버튼 클릭*/
function fnOrder() {


    //주문한 product 정보
    var prdArr = $("#ContentPlaceHolder1_hidPrdArr").val();

    //결제방법
    //var payType = $("#ContentPlaceHolder1_hidPayType").val();
    var payType = "C";

    //주문자
    var ordererNm = $("#txtOrdererNm").val();
    var ordererMobile1 = $("#ordererMobile1").val();
    var ordererMobile2 = $("#ordererMobile2").val();
    var ordererMobile3 = $("#ordererMobile3").val();
    var ordererMobile = ordererMobile1 + ordererMobile2 + ordererMobile3;

    //배송정보
    var recvNm = $("#txtRecvNm").val();
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var mobile1 = $("#txtMobile1").val();
    var mobile2 = $("#txtMobile2").val();
    var mobile3 = $("#txtMobile3").val();
    var mobile = mobile1 + mobile2 + mobile3;
    var dlvreq = $("#txtDlvReq").val();

    //금액
    var amt_prd = $("#ContentPlaceHolder1_spAmt_prd").text().replace(/[^(0-9)]/gi, ""); // 상품금액	AMT_PRD
    var amt_dlv = $("#ContentPlaceHolder1_spAmt_dlv").text().replace(/[^(0-9)]/gi, ""); // 배송비	AMT_DLV
    var amt_original = (parseInt(amt_prd) + parseInt(amt_dlv)).toString(); // 원금액	AMT_ORIGINAL
    var amt_cash = $("#spAmt_cash").text().replace(/[^(0-9)]/gi, ""); //캐시사용금액 AMT_CASH
    var amt_point = $("#spAmt_point").text().replace(/[^(0-9)]/gi, ""); //포인트사용금액 AMT_POINT
    var amt_discount = (parseInt(amt_cash) + parseInt(amt_point)).toString(); // 할인금액	AMT_DISCOUNT
    var amt_pay = $("#ContentPlaceHolder1_spAmt_total").text().replace(/[^(0-9)]/gi, ""); // 실결제금액	AMT_PAY

    if (ordererNm == "") {
        alert("주문자명을 입력해주세요")
        return;
    }
    if (ordererMobile == "" || ordererMobile.length != 11) {
        alert("주문자 휴대폰번호 11자리를 입력해주세요")
        return;
    }
    if (recvNm == "") {
        alert("수령인을 입력해주세요")
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
    if (mobile == "" || mobile.length != 11) {
        alert("수령인 휴대폰번호 11자리를 입력해주세요")
        return;
    }



    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.type = "P"; //쇼핑몰
    bObj.prdArr = prdArr;
    bObj.payType = payType;
    bObj.ordererNm = ordererNm;
    bObj.ordererMobile = ordererMobile;
    bObj.recvNm = recvNm;
    bObj.zipcd = zipcd;
    bObj.addr1 = addr1;
    bObj.addr2 = addr2;
    bObj.mobile = mobile;
    bObj.dlvreq = dlvreq;
    bObj.amt_prd = amt_prd;
    bObj.amt_dlv = amt_dlv;
    bObj.amt_original = amt_original;
    bObj.amt_cash = amt_cash;
    bObj.amt_point = amt_point;
    bObj.amt_discount = amt_discount;
    bObj.amt_pay = amt_pay;

    bArr.push(bObj);

    var totObj = new Object();
    totObj.header = hArr;
    totObj.body = bArr;

    console.log(totObj)
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

            console.log(data)

            if (data == null || data.RESULT == "N") {
                alert("결제실패하였습니다.");
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }



            //신용카드 연동하면 주석 지우기
            var pg_orderno = data.PG_ORDERNO;
            fnPay(amt_pay, pg_orderno);


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


/*결제O*/
function fnPay(amt, pg_orderno) {

    $("#allat_amt").val(amt);
    $("#allat_order_no").val(pg_orderno);

    ftn_approval(form1);
}


// 결제페이지 호출
function ftn_approval(form1) {
    AllatPay_Approval(form1);
    // 결제창 자동종료 체크 시작
    AllatPay_Closechk_Start();
}

// 결과값 반환( receive 페이지에서 호출 )
function approval_submit(result_cd, result_msg, enc_data) {
    // 결제창 자동종료 체크 종료
    AllatPay_Closechk_End();


    if (result_cd != '0000') {
        window.setTimeout(function () { alert(result_cd + " : " + result_msg); }, 1000);
    } else {
        form1.allat_enc_data.value = enc_data;
        form1.action = "/view/order/orderRequest.aspx";
        form1.method = "post";
        form1.target = "_self";
        form1.submit();
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
