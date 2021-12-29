var targetUrl = "/common/component/order/AjaxOrderPay.aspx";
var targetUrl2 = "/common/component/mobilians/AjaxMobilians.aspx";


/*결제하기 버튼 클릭*/
function fnOrder() {

    var cnt = $("#selAmt").val();
    var amt = 10000 * parseInt(cnt);

    //주문한 상품 정보
    var prdArr = new Array();
    var prdObj = new Object();
    prdObj.pid = "10000";
    prdObj.pnm = "캐시충전";
    prdObj.optcd_p = "N";
    prdObj.cnt = cnt;
    prdObj.amt_original = "10000";
    prdObj.amt_add = "0";
    prdObj.amt_pay = amt.toString();
    prdObj.dlvfee = "0";
    prdObj.img_list = "";
    prdObj.optnm = "옵션없음";
    prdArr.push(prdObj);


    $("#ContentPlaceHolder1_MainContent_hidPrdArr").val(JSON.stringify(prdArr));


    //결제방법
    //var payType = $("#ContentPlaceHolder1_hidPayType").val();
    var payType = "C";

    //주문자
    var ordererNm = "";
    var ordererMobile = "";

    //배송정보
    var recvNm = "";
    var zipcd = "";
    var addr1 = "";
    var addr2 = "";
    var mobile = "";
    var dlvreq = "";

    //금액
    var amt_prd = amt.toString(); // 상품금액	AMT_PRD
    var amt_dlv = "0"; // 배송비	AMT_DLV
    var amt_original = amt.toString(); // 원금액	AMT_ORIGINAL
    var amt_cash = "0"; //캐시사용금액 AMT_CASH
    var amt_point = "0"; //포인트사용금액 AMT_POINT
    var amt_discount = "0"; // 할인금액	AMT_DISCOUNT
    var amt_pay = amt.toString(); // 실결제금액	AMT_PAY



    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.type = "S"; //캐시충전
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



