var targetUrl = "/common/component/shop/AjaxCart.aspx";
var dlvAmt = 0; //배송비
var prd_cnt = 0;

$(document).ready(function () {
    dlvAmt = parseInt($("#ContentPlaceHolder1_hidDlvfee").val());

    //장바구니 상품 불러오기
    fnGetProduct();

});


//상품 수량빼기
$(document).on("click", ".minus", function () {

    var id = $(this).attr('id'); //클릭한 버튼 아이디
    var id_num = id.replace(/[^0-9]/g, ''); //몇번째 버튼인지 알기
    var order_mincnt = $(this).attr('min'); //최소주문수량

    var stat = $("#ord_cnt_" + id_num + "").val();
    var num = parseInt(stat);
    num--; //상품수량 -

    if (num < order_mincnt) {
        alert("현재 상품의 최소 주문수량은 " + order_mincnt + "개 입니다.");
        return;
    }

    $("#ord_cnt_" + id_num + "").val(num);
    fnCalOrderAmt();
});

//상품 수량더하기
$(document).on("click", ".plus", function () {

    var id = $(this).attr('id'); //클릭한 버튼 아이디
    var id_num = id.replace(/[^0-9]/g, ''); //몇번째 버튼인지 알기
    var order_maxcnt = $(this).attr('max'); //최대주문수량

    var stat = $("#ord_cnt_" + id_num + "").val();
    var num = parseInt(stat);
    num++; //상품수량 +

    if (num > order_maxcnt) {
        alert("현재 상품의 최대 주문수량은 " + order_maxcnt + "개 입니다.");
        return;
    }

    $("#ord_cnt_" + id_num + "").val(num);
    fnCalOrderAmt();

});



//장바구니 상품 불러오기
function fnGetProduct() {

    try {

        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();

        // 장바구니 상품 가져오기
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

                if (data == null || data.RESULT == "N" || data.DATA.length == 0) {
                    $("#noCart").show();
                    $("#cart").hide();
                    return;
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                    return;
                }

                $("#cart").show();
                $("#noCart").hide();


                var allData = data.DATA;
                console.log(allData)

                var sHtml = "";
                var amt_tot = 0; //상품금액 총합계
                prd_cnt = allData.length;
                for (var i = 0; i < allData.length; i++) {
                    amt_tot += parseInt(parseInt(allData[i]["AMT_SALE"].replace(/[^0-9]/g, '')) * parseInt(allData[i]["CNT"]));

                    sHtml += "	<tr>                                                                                        ";
                    sHtml += "      <td>                                                                                    ";
                    sHtml += "          <label class='check-st-2'  for='chk" + i + "'>                                      ";
                    sHtml += "              <input type='checkbox' id='chk" + i + "' name='chk' onclick='fnCheck();' />     ";
                    sHtml += "              <span></span>                                                                   ";
                    sHtml += "          </label>                                                                            ";
                    sHtml += "      </td>                                                                                   ";
                    sHtml += "      <td class='imgtd'><span class='cartimg'>             ";
                    sHtml += "          <img id='img_list_" + i + "' src='" + allData[i]["IMG_LIST"] + "' /></span>  ";
                    sHtml += "      </td>                                                ";
                    sHtml += "      <td class='detail_info'>																																									";
                    sHtml += "          <p id='pPnm_" + i + "'>" + allData[i]["PNM_SHOP"] + "</p>                                                                ";
                    if (allData[i]["OPTCD_P"] != "N") {
                        sHtml += "          <span class='optionInfo'>(옵션 : <span id='optnm_" + i + "'>" + allData[i]["OPTNM"] + "</span>+" + allData[i]["AMT_ADD"] + " )</span> ";
                    }
                    sHtml += "      </td>                                                                                                    ";
                    sHtml += "      <td class='pricetd'>																															";
                    sHtml += "          <p class='price' id='amt_sale_" + i + "'>" + allData[i]["AMT_SALE"] + "원</p>                                                 ";
                    sHtml += "          <div class='quan clearfix'>                                                   ";
                    sHtml += "              <input type='button' min='" + allData[i]["ORDER_MINCNT"] + "' value='-' class='minus' id='minusBtn_" + i + "' value='-' />   ";
                    sHtml += "              <input type='text'  id='ord_cnt_" + i + "' value='" + allData[i]["CNT"] + "' readonly />                                  ";
                    sHtml += "              <input type='button' max='" + allData[i]["ORDER_MAXCNT"] + "' value='+' class='plus' id='plusBtn_" + i + "' value='+' />    ";
                    sHtml += "          </div>                                                                        ";
                    sHtml += "      </td>                                                                             ";
                    sHtml += "      <td class='cartbtn'>                                        ";
                    sHtml += "          <input type='button' value='주문하기' onclick='fnOrder(\"" + allData[i]["PID"] + "\"," + i + ",\"" + allData[i]["OPTCD_P"] + "\")' />    ";
                    sHtml += "          <input type='button' value='상품삭제' class='delete' id='btnDelete_" + i + "'/>    ";
                    sHtml += "      </td>                                                       ";
                    sHtml += "      <td style='display:none'> ";
                    sHtml += "<input type='text' id='amt_original_" + i + "' value='" + allData[i]["AMT_ORIGINAL"].replace(/[^0-9]/g, '') + "'/>";
                    sHtml += "<input type='text' id='amt_add_" + i + "' value='" + allData[i]["AMT_ADD"].replace(/[^0-9]/g, '') + "'/>";
                    sHtml += "<input type='text' id='pid_" + i + "' value='" + allData[i]["PID"] + "'/>";
                    sHtml += "<input type='text' id='optcd_p_" + i + "' value='" + allData[i]["OPTCD_P"] + "'/>";
                    sHtml += "      </td>                                                       ";
                    sHtml += "	</tr>                                                                                        ";
                }

                $("#tbCart").html(sHtml);

                $("input[name='chk']").prop("checked", true); //체크박스 전체선택 해놓기

                $("#spAmt_prd").text(amt_tot.toLocaleString()); //총 상품금액
                //dlvAmt = 2500; //배송비 추가해야됨
                $("#spAmt_dlv").text(dlvAmt.toLocaleString());
                var amt_pay = amt_tot + dlvAmt; //배송비 + 총 상품금액
                $("#spAmt_pay").text(amt_pay.toLocaleString()); //결제예정금액


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

//체크박스 선택시
function fnCheck() {
    if ($('input:checkbox[name="chk"]:checked').length == prd_cnt) {
        $("input[name='chkTotal']").prop("checked", true);
    }
    else {
        $("input[name='chkTotal']").prop("checked", false);
    }


    fnCalOrderAmt()
}


//체크박스 전체 해제
function totalCheck() {


    if ($("input[id='chkTotal']").is(":checked")) {
        $("input[name='chk']").prop("checked", true);
    } else {
        $("input[name='chk']").prop("checked", false);
    }
    fnCalOrderAmt();
}



//주문금액 구하기
function fnCalOrderAmt() {

    var tot_amt = 0;
    //상품 갯수만큼 반복해서 정보 가져오기
    for (var num = 0; num < prd_cnt; num++) {

        if (document.getElementsByName("chk")[num].checked == true) {

            var amt_sale = parseInt($("#amt_sale_" + num).text().replace(/[^0-9]/g, '')); //판매가
            var amt_cnt = parseInt($("#ord_cnt_" + num).val().replace(/[^0-9]/g, '')); //수량

            console.log(amt_sale)
            console.log(amt_cnt)


            tot_amt += amt_sale * amt_cnt;

        }
    }

    $("#spAmt_prd").text(tot_amt.toLocaleString());

    if (tot_amt == 0) {

        $("#spAmt_dlv").text("0");
        $("#spAmt_pay").text(tot_amt.toLocaleString());
    }
    else {
        tot_amt += dlvAmt; //배송비
        $("#spAmt_dlv").text(dlvAmt.toLocaleString());
        $("#spAmt_pay").text(tot_amt.toLocaleString());

    }

}


//선택삭제
function fnSelDel() {


    var pidArr = new Array(); //상품번호 배열
    var optcd_pArr = new Array(); //옵션조합코드 배열
    var cntArr = new Array(); //상품수량 배열

    //상품 갯수만큼 반복해서 정보 가져오기
    for (var i = 0; i < prd_cnt; i++) {

        if (document.getElementsByName("chk")[i].checked == true) {


            var pid = $("#pid_" + i + "").val(); //상품금액
            var optcd_p = $("#optcd_p_" + i + "").val(); //옵션조합코드

            var prdObj = new Object();
            prdObj.pid = pid;
            prdObj.optcd_p = optcd_p;

            pidArr.push(prdObj);
        }
    }

    if (!$("input[name='chk']").is(":checked")) { //체크 하나도 없을때
        alert("삭제할 상품을 선택해주세요.");
        return;
    }

    if (!confirm("선택된 상품을 삭제하시겠습니까?")) {
        return;
    }


    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    var bArr = new Array();
    var bObj = new Object();

    // 장바구니 상품 선택삭제
    hObj.type = "02";
    hArr.push(hObj);

    bObj.pidArr = pidArr; //상품번호
    bArr.push(bObj);


    totObj.header = hArr;
    totObj.body = bArr;
    console.log(JSON.stringify(totObj));


    $.ajax({
        method: "post",
        url: targetUrl,
        data: JSON.stringify(totObj),
        dataType: "json",
        beforeSend: function () {
        },
        success: function (data) {
            //console.log(data);
            //장바구니 상품 불러오기

            
        if (data.RESULT == "ERR") {
            alert('장시간 미사용으로 로그인 만료되었습니다.');
            location.href = '/view/member/login.aspx';
            return;
        }
            

            if (data.RESULT == "Y") {
                alert("삭제되었습니다.");

                fnGetProduct();
            }
            else {
                alert("삭제 실패하였습니다.");
            }
        },
        error: function (data, status, err) {


            alert("서버와의 통신에 실패하였습니다.");
        }
    });
}

//개별삭제
$(document).on("click", ".delete", function () {

    var id = $(this).attr('id'); //클릭한 버튼 아이디
    var id_num = id.replace(/[^0-9]/g, ''); //몇번째 버튼인지 알기

    var pid = $("#pid_" + id_num + "").val(); //상품금액
    var optcd_p = $("#optcd_p_" + id_num + "").val(); //옵션조합코드

    if (!confirm("해당 상품을 삭제하시겠습니까?")) {
        return;
    }

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    var bArr = new Array();
    var bObj = new Object();

    // 장바구니 상품 개별삭제
    hObj.type = "03";
    hArr.push(hObj);

    bObj.pid = pid; //상품번호
    bObj.optcd_p = optcd_p; //옵션조합코드
    bArr.push(bObj);


    totObj.header = hArr;
    totObj.body = bArr;
    console.log(JSON.stringify(totObj));

    $.ajax({
        method: "post",
        url: targetUrl,
        data: JSON.stringify(totObj),
        dataType: "json",
        beforeSend: function () {
        },
        success: function (data) {
            //console.log(data);
            //장바구니 상품 불러오기

            
        if (data.RESULT == "ERR") {
            alert('장시간 미사용으로 로그인 만료되었습니다.');
            location.href = '/view/member/login.aspx';
            return;
        }
            

            if (data.RESULT == "Y") {
                alert("삭제되었습니다.");
                fnGetProduct();
            } else {
                alert("삭제 실패하였습니다.");
            }
        },
        error: function (data, status, err) {
            // console.log(err);

            alert("서버와의 통신에 실패하였습니다.");
        }
    });
});

//전체주문
function fnTotalOrder() {

    var prdArr = new Array();
    for (var num = 0; num < cntPrd; num++) {
        var pid = $("#pid_" + num).val();//상품코드
        var optcd_p = $("#optcd_p_" + num).val();//상품명
        var cnt = $("#ord_cnt_" + num).val();//수량
        var pnm = $("#pPnm_" + num).text();//상품명
        var amt_original = $("#amt_sale_" + num).val().replace(/[^0-9]/g, '');//상품원금액
        var amt_add = $("#amt_opt_" + num).val().replace(/[^0-9]/g, '');//옵션조합코드 추가금액
        var dlvfee = $("#dlv_amt").text().replace(/[^0-9]/g, '');//옵션조합코드 추가금액
        var option = $("#pOptionNm_" + num).text();//옵션명
        var amt_pay = $("#sel_amt_" + num).text().replace(/[^0-9]/g, '');//옵션명


        var prdObj = new Object();
        prdObj.pid = pid; //상품코드
        prdObj.pnm = pnm; //상품명
        prdObj.optcd_p = optcd_p; //옵션조합코드
        prdObj.cnt = cnt; //수량
        prdObj.amt_original = amt_original; //상품원금액
        prdObj.amt_add = amt_add; //옵션조합코드 추가금액
        prdObj.amt_pay = amt_pay; //상품 최종금액
        prdObj.dlvfee = dlvfee; //배송비
        prdObj.option = option; //옵션명
        prdArr.push(prdObj);
    }
    console.log(prdArr)

    //상품번호, 수량, 옵션조합코드 json post전송
    post_to_url('/view/merge/shop/order/order.aspx', { 'prdArr': JSON.stringify(prdArr) });


    //var Arr = new Array();
    //var bObj = new Object();

    //for (var i = 0; i < prd_data.length; i++) {

    //    bObj = new Object();
    //    bObj.pid = prd_data[i][0]["PID"]; //상품번호
    //    bObj.cnt = $("#ord_cnt_" + i + "").val(); //수량
    //    bObj.optcd_p = prd_data[i][0]["OPTCD_P"]; //옵션조합코드
    //    Arr.push(bObj);
    //}

    ////상품번호, 수량, 옵션조합코드 json post전송
    //var data = JSON.stringify(Arr);

    //post_to_url('/view/merge/shop/order/order.aspx', { 'data': data });

}

//선택주문
function fnSelOrder() {

    var prdArr = new Array();
    //상품 갯수만큼 반복해서 정보 가져오기
    for (var num = 0; num < prd_cnt; num++) {

        if (document.getElementsByName("chk")[num].checked == true) {

            var pid = $("#pid_" + num).val();//상품코드
            var optcd_p = $("#optcd_p_" + num).val();//상품명
            var cnt = $("#ord_cnt_" + num).val();//수량
            var pnm = $("#pPnm_" + num).text();//상품명
            var amt_original = $("#amt_original_" + num).val().replace(/[^0-9]/g, '');//상품원금액
            var amt_add = $("#amt_add_" + num).val().replace(/[^0-9]/g, '');//옵션조합코드 추가금액
            var dlvfee = $("#spAmt_dlv").text().replace(/[^0-9]/g, '');//옵션조합코드 추가금액
            var optnm = $("#optnm_" + num).text();//옵션명
            var amt_pay = parseInt($("#amt_sale_" + num).text().replace(/[^0-9]/g, '')) * parseInt(cnt);//판매금액*수량
            var img_list = $("#img_list_" + num).attr("src"); //이미지경로


            var prdObj = new Object();
            prdObj.pid = pid; //상품코드
            prdObj.optcd_p = optcd_p; //옵션조합코드
            prdObj.cnt = cnt; //수량
            prdObj.pnm = pnm; //상품명
            prdObj.amt_original = amt_original; //상품원금액
            prdObj.amt_add = amt_add; //옵션조합코드 추가금액
            prdObj.amt_pay = amt_pay; //상품 최종금액
            prdObj.dlvfee = dlvfee; //배송비
            prdObj.optnm = optnm; //옵션명
            prdObj.img_list = img_list; //이미지경로
            prdArr.push(prdObj);



        }
    }

    if (!$("input[name='chk']").is(":checked")) { //체크 하나도 없을때
        alert("주문할 상품을 선택해주세요");  //주문할 상품을 선택해주세요.
        return;
    }


    //상품번호, 수량, 옵션조합코드 json post전송
    post_to_url('/view/order/orderPay.aspx', { 'prdArr': JSON.stringify(prdArr) });
}

//개별주문

//개별 주문하기 버튼
function fnOrder(pid, num, optcd_p) {

    var pid = $("#pid_" + num).val();//상품코드
    var optcd_p = $("#optcd_p_" + num).val();//상품명
    var cnt = $("#ord_cnt_" + num).val();//수량
    var pnm = $("#pPnm_" + num).text();//상품명
    var amt_original = $("#amt_original_" + num).val().replace(/[^0-9]/g, '');//상품원금액
    var amt_add = $("#amt_add_" + num).val().replace(/[^0-9]/g, '');//옵션조합코드 추가금액
    var dlvfee = $("#spAmt_dlv").text().replace(/[^0-9]/g, '');//옵션조합코드 추가금액
    var optnm = $("#optnm_" + num).text();//옵션명
    var amt_pay = parseInt($("#amt_sale_" + num).text().replace(/[^0-9]/g, '')) * parseInt(cnt);//판매금액*수량
    var img_list = $("#img_list_" + num).attr("src"); //이미지경로


    var prdArr = new Array();
    var prdObj = new Object();
    prdObj.pid = pid; //상품코드
    prdObj.optcd_p = optcd_p; //옵션조합코드
    prdObj.cnt = cnt; //수량
    prdObj.pnm = pnm; //상품명
    prdObj.amt_original = amt_original; //상품원금액
    prdObj.amt_add = amt_add; //옵션조합코드 추가금액
    prdObj.amt_pay = amt_pay; //상품 최종금액
    prdObj.dlvfee = dlvfee; //배송비
    prdObj.optnm = optnm; //옵션명
    prdObj.img_list = img_list; //이미지경로
    prdArr.push(prdObj);
    console.log(prdArr);

    //var data = JSON.stringify(Arr);
    //상품번호, 수량, 옵션조합코드 json post전송
    post_to_url('/view/order/orderPay.aspx', { 'prdArr': JSON.stringify(prdArr) });


}
