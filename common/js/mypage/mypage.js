var targetUrl = "/common/component/mypage/AjaxMypage.aspx";


$(document).ready(function () {

    //정보불러오기
    fnGetInfo();

});


//정보불러오기
function fnGetInfo() {

    try {

        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();

        //정보불러오기
        hObj.type = "01";
        hArr.push(hObj);

        var bArr = new Array();
        var bObj = new Object();

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
                    history.back();
                    return;
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }

                var allData = data.DATA;
                
                //캐시, 포인트 셋팅
                $("#spCash").text(allData["MEMBER"]["CASH"]);
                $("#spPoint").text(allData["MEMBER"]["POINT"]);

                //주문현황 셋팅
                var orderStatus = allData["STATUS"];
                for (var i = 0; i < orderStatus.length; i++){
                    $("#spStatus_" + orderStatus[i]["STATUS"]).text(orderStatus[i]["CNT"]);
                }

                //관심상품 셋팅
                var wish = allData["WISH"];
                if (wish.length == 0) {
                    $("#tbIsList").empty();
                    $("#tbIsList").hide();
                    $("#tbNonList").show();
                }
                else {

                    var sHtml = "";

                    for (var i = 0; i < wish.length; i++){
                        sHtml += "<tr onclick='$(location).attr(\"href\", \"/view/product/product_detail.aspx?pid=" + wish[i]["PID"] + "\");'>";
                        sHtml += "	<td>";
                        sHtml += "		<span class='wishImg'>";
                        sHtml += "		   <img src='" + wish[i]["FILEURL"] + "'/>";
                        sHtml += "		</span>";
                        sHtml += "	</td>";
                        sHtml += "	<td>";
                        sHtml += "		<p class='pd_name'>";
                        sHtml += "		    " + wish[i]["PNM_SHOP"] + "";
                        sHtml += "		</p>";
                        sHtml += "		<p class='pd_price'><span>" + wish[i]["AMT"] + "</span>원</p>";
                        sHtml += "	</td>";
                        sHtml += " </tr>";
                    }

                    $("#tbNonList").hide();
                    $("#tbIsList").html(sHtml);
                    $("#tbIsList").show();

                }
            },
            error: function (data, status, err) {
                $("#loading_0").hide();
                // console.log(err);

                alert("서버와의 통신에 실패하였습니다.");
            }
        });

    } catch (e) {
        $("#loading_0").hide();
        alert("서버와의 통신에 실패하였습니다.");
    }

}





