var targetUrl = "/common/component/delivery/AjaxDeliveryInfo.aspx";
var sType = ""; // M : 마이페이지 / O : 주문
var editType = ""; // U수정orI등록
$(document).ready(function () {
    sType = $("#hidType").val();

    if (sType != "") {
        fnSearch()
    }
    else {

    }
});



/*배송지조회*/
function fnSearch() {

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

            if (data == null || data["RESULT"] == "N") {
                alert(data["MSG"]);
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
            }


            var allData = data["DATA"];

            var sHtml = "";
            for (var i = 0; i < allData.length; i++) {

                if (allData[i]["DEFAULTYN"] == "Y") {
                    sHtml += "<div class='address_card default'>";

                }
                else {
                    sHtml += "<div class='address_card'>";
                }

                sHtml += "	<div class='address_card_wrap'>";
                sHtml += "	    <p class='address_title'><span id='spName_" + i + "'>" + allData[i]["ADDRNM"] + "</span></p>"; //수령인
                sHtml += "	    <p class='address_info'><span id='spZipcd_" + i + "'>" + allData[i]["ZIPCD"] + "</span></p>"; //우편번호
                sHtml += "	    <p class='address_info'><span id='spAddr1_" + i + "'>" + allData[i]["ADDR1"] + "</span> <span id='spAddr2_" + i + "'>" + allData[i]["ADDR2"] + "</span></p>"; //주소
                sHtml += "	    <p class='address_cellphone'><span id='spMobile1_" + i + "'>" + allData[i]["MOBILE1"] + "</span>-<span id='spMobile2_" + i + "'>" + allData[i]["MOBILE2"] + "</span>-<span id='spMobile3_" + i + "'>" + allData[i]["MOBILE3"] + "</span></p>";

                if (allData[i]["DLVREQCD"] == "99") { //직접입력
                    sHtml += "	    <p class='address_message'><span id='spDlvreq_"+i+"'>" + allData[i]["DLVREQ"] + "</span></p>";
                }
                else {
                    sHtml += "	    <p class='address_message'><span>" + allData[i]["DLVREQNM"] + "</span></p>";
                }
                sHtml += "<span id='spDlvreqcd_" + i + "' style='display:none'>" + allData[i]["DLVREQCD"] + "</span>";
                sHtml += "	</div>";
                sHtml += "	<p class='address_btnWarp'>";

                if (sType == "M") { //마이페이지
                    sHtml += "	    <input  onclick='fnUpdAddr(" + allData[i]["SEQ"] + ")' type='button' value='수정' />";
                }
                else if (sType == "O") { //주문
                    sHtml += "	    <input type='button' onclick='fnSelFin("+i+")' value='선택' />";
                }
                sHtml += "	</p>";
                sHtml += "</div>";
            }

            $("#divNonList").hide();
            $("#divAddrList").empty();
            $("#divAddrList").html(sHtml);
            $("#divAddrList").show();

            if (sType == "M") {
                $("#divAddAddr").show();
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


//배송지선택
function fnSelFin(dlvSeq) {

    $("#txtRecvNm", opener.document).val($("#spName_" + dlvSeq).text());
    $("#txtZipcd", opener.document).val($("#spZipcd_" + dlvSeq).text());
    $("#txtAddr1", opener.document).val($("#spAddr1_" + dlvSeq).text());
    $("#txtAddr2", opener.document).val($("#spAddr2_" + dlvSeq).text());
    $("#txtMobile1", opener.document).val($("#spMobile1_" + dlvSeq).text());
    $("#txtMobile2", opener.document).val($("#spMobile2_" + dlvSeq).text());
    $("#txtMobile3", opener.document).val($("#spMobile3_" + dlvSeq).text());

    var dlvreqcd = $("#spDlvreqcd_" + dlvSeq).text();
    $("#ContentPlaceHolder1_ddlDlvReq", opener.document).val(dlvreqcd);

    if (dlvreqcd == "99") {
        $("#txtDlvReq", opener.document).val($("#spDlvreq_" + dlvSeq).text());
        $("#txtDlvReq", opener.document).show();
    }
    else {
        $("#txtDlvReq", opener.document).val("");
        $("#txtDlvReq", opener.document).hide();
    }

    window.close();
}



function fnUpdAddr(seq) {
    window.open('/view/delivery/deliveryadd.aspx?type=U&seq=' + seq, '_self', 'scrollbars=yes, resizable=no width=420 height=650, left=650,top=250')
}

function fnInstAddr() {
    window.open('/view/delivery/deliveryadd.aspx?type=I', '_self', 'scrollbars=yes, resizable=no width=420 height=650, left=650,top=250')
}


