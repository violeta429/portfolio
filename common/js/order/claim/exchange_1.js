var targetUrl = "/common/component/order/claim/AjaxExchange_1.aspx";

$(document).ready(function () {
    fnInfo()


    $("#selReason").change(function () {
        if($(this).val() == "99"){
            $("#divTxtReason").show();
        }
        else {
            $("#txtReason").val("");
            //$("#divTxtReason").hide();
        }

    });


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

            if(data == null || data.RESULT == "N" || data.DATA.length == 0){
                history.back();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }

            var allData = data.DATA;

            var sHtml = "";
            for (var i = 0; i < allData.length; i++){
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
                sHtml += "        <span class='pdquan'>교환요청수량<i>";
                sHtml += "<select id='sel" + i.toString() + "'>";
                for (var j = 1; j <= (allData[i]["CNT"] * 1) ;j++) {
                    sHtml += "              <option value='" + j + "'>" + j + "</option>                                         ";
                }
                sHtml += "</select></i></span>";
                sHtml += "    </div>";
                sHtml += "<input type='hidden' id='pid" + i.toString() + "' value='" + allData[i]["PID"] + "'/>";
                sHtml += "<input type='hidden' id='optcd_p" + i.toString() + "' value='" + allData[i]["OPTCD_P"] + "'/>";
                sHtml += "<input type='hidden' id='img_list" + i.toString() + "' value='" + allData[i]["IMG_LIST"] + "'/>";
                sHtml += "<input type='hidden' id='amt" + i.toString() + "' value='" + allData[i]["AMT"] + "'/>";
                sHtml += "<input type='hidden' id='amt_original" + i.toString() + "' value='" + allData[i]["AMT_ORIGINAL"] + "'/>";
                sHtml += "</div>";
            }
            $("#divPrdList").html(sHtml);

        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });


}




function fnMove() {

    var orderno = $("#ContentPlaceHolder1_hidOrderno").val(); //주문번호
    var prdArr = new Array();




    var chkCnt = $('input:checkbox').length;

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
        alert("교환하실 상품을 선택해주세요."); //교환하실 상품을 선택해주세요
        return;
    }


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

    console.log(prdArr);

    //페이지 이동        
    var destPath = "/view/order/claim/exchange_2.aspx";

    post_to_url(destPath, {
        "prdArr": JSON.stringify(prdArr), "orderno": orderno, "reason" : reason

    });


}
