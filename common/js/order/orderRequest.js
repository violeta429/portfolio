var targetUrl_pay = "/common/component/mobilians/AjaxMobilians.aspx";

$(document).ready(function () {

    fnPay(); //결제

});

function fnPay() {

    var purpose = $("#ContentPlaceHolder1_hidPurpose").val();
    var type = "";
    if (purpose == "P") { type = "02"; } //쇼핑몰
    else if (purpose == "S") { type = "03"; } //캐시충전
    else {
        location.href = "/view/main.aspx";
        return;
    }




    var hArr = new Array();
    var hObj = new Object();
    hObj.type = type;
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.encdata = $("#ContentPlaceHolder1_hidEncdata").val();
    bObj.amt = $("#ContentPlaceHolder1_hidAmt").val();
    bArr.push(bObj);

    var totObj = new Object();
    totObj.header = hArr;
    totObj.body = bArr;

    console.log(totObj);



    $.ajax({
        method: "post",
        url: targetUrl_pay,
        data: JSON.stringify(totObj),
        dataType: "json",
        beforeSend: function () {

        },
        success: function (data) {


            if (data == null || data.RESULT == "N") {
                alert("결제실패하였습니다.");
                location.href = "/view/main.aspx";
                return;
            }

            var destPath = "/view/main.aspx";
            var purpose = $("#ContentPlaceHolder1_hidPurpose").val();
            if (purpose == "P") {
                destPath = "/view/order/orderResult.aspx";
            }
            else if (purpose == "S") {
                destPath = "/view/mypage/chargeFin.aspx";
            }

            //페이지 이동        
            post_to_url(destPath, {
                "orderno": data.ORDERNO
            });
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
