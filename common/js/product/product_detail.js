
var fotorama;
var optionSeq = 0;
var optionYn = "N";
var amt_original = 0;
var img_list = 0;
var optionCnt = 0;
var max_cnt2 = 0; //옵션없을때 사용


var dataPerPage = 10; //한 페이지에 나타낼 데이터 수
var pageCount = 5; //한 화면에 나타낼 페이지 수



//페이지로드시
$(document).ready(function () {
    

 
    // fnUpdateView();
    // fnSearch();
    // fnSearchReview();
});

// $(function () {
//     // 1. Initialize fotorama manually.
//     var $fotoramaDiv = $('#fotorama').fotorama();
//     // 2. Get the API object.
//     fotorama = $fotoramaDiv.data('fotorama');
// });



/*최근본상품*/
function fnUpdateView() {
    try {
        var pid = $("#ContentPlaceHolder1_hidPid").val();

        if (pid != "" && pid != null) {
            var hArr = new Array();
            var hObj = new Object();
            hObj.type = "01";
            hArr.push(hObj);

            var bArr = new Array();
            var bObj = new Object();
            bObj.pid = pid;

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
                    //로딩 창 출력

                },
                success: function (data) {

                    var result = data.RESULT; //통신결과

                    //조회와 동시에 실행되는 INSERT기 때문에 페이지 이용에 불편함이 없게 성공 실패에 대한 처리 안함
                    if (result == "Y") {
                        //최근 본 상품 등록 성공
                    }
                    else if (data.RESULT == "ERR") {
                        alert('장시간 미사용으로 로그인 만료되었습니다.');
                        location.href = '/view/member/login.aspx';
                        return;
                    }
                    else {
                        //최근 본 상품 등록 실패
                    }

                },
                error: function (data, status, err) {

                    return;
                }
            });
        }

    }
    catch (e) {

    }


}
var url = "https://violeta429.github.io/portfolio/common/data/mainproduct.json"
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200)
    {
       try{
        fnSearch(xmlhttp.responseText);
       }
       catch(e){
        console.log(e)
       }
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
/*상품상세조회*/
function fnSearch(data) {
    var arr = JSON.parse(data);
    var arr =Object.values(arr);
    var Allarr =[];
    for (i = 0 ; i<arr.length ;i++){
    Allarr.push(...arr[i]);
    }
   const url = new URL(window.location.href); 
   console.log(url);
   var urlParams = url.searchParams;
   var pid =urlParams.getAll('pid');
   var numb  = pid -1 ;
   $('#tdPnm').text(Allarr[numb].name);
   $('#tdAmt').text(Allarr[numb].price);
   if (numb<10){
    $('#fotorama').html('<img src="https://violeta429.github.io/portfolio/common/image/main/product/00' + Allarr[numb].img + '.jpg">');
   }
   else{
    $('#fotorama').html('<img src="https://violeta429.github.io/portfolio/common/image/main/product/0' + Allarr[numb].img + '.jpg">');
   }
   




    // var pid = $("#ContentPlaceHolder1_hidPid").val()

    // var hArr = new Array();
    // var hObj = new Object();
    // hObj.type = "02";
    // hArr.push(hObj);

    // var bArr = new Array();
    // var bObj = new Object();
    // bObj.pid = pid;
    // bArr.push(bObj);

    // var totObj = new Object();
    // totObj.header = hArr;
    // totObj.body = bArr;

    // console.log(JSON.stringify(totObj));
    // $.ajax({
    //     method: "post",
    //     url: targetUrl,
    //     data: JSON.stringify(totObj),
    //     dataType: "json",
    //     beforeSend: function () {
    //         $("#loading_0").show();
    //     },
    //     success: function (data) {
    //         $("#loading_0").hide();

    //         console.log(data);

    //         if (data["RESULT"] == "N") {
    //             alert("잘못된 접근입니다.");
    //             //history.back();
    //             return;
    //         }
    //         else if (data.RESULT == "ERR") {
    //             alert('장시간 미사용으로 로그인 만료되었습니다.');
    //             location.href = '/view/member/login.aspx';
    //             return;
    //         }


    //         var allData = data["DATA"];

    //         // 조회된게없음
    //         if (allData["PNM"] == "") { history.back(); return; }

    //         var imgArr = allData["IMG"];

    //         for (var i = 0; i < imgArr.length; i++) {
    //             var fileType = imgArr[i]["FILETYPE"];
    //             var fileUrl = imgArr[i]["URL"];
    //             if (fileType == "M") { //사진이미지슬라이드
    //                 fotorama.push({ img: fileUrl, thumb: fileUrl });
    //             }
    //             else if (fileType == "D") {
    //                 var sHtml = "<img src='" + fileUrl + "'>";
    //                 $("#divDetail").append(sHtml);
    //             }
    //             else if (fileType == "L") {
    //                 img_list = fileUrl;
    //             }
    //             else if (fileType == "G") {
    //                 var sHtml = "<img src='" + fileUrl + "'>";
    //                 $("#divDetail").append(sHtml);
    //             }
    //         }



    //         //관심상품여부
    //         if (allData["WISHYN"] == "Y") {
    //             $("#lbWish").addClass("is-active");
    //         }
            
    //         //원금액 저장
    //         amt_original = allData["AMT_SALE"] * 1;
    //         optionYn = allData["OPTYN"];
            
    //         var dlvfee = allData["DLVFEE"]*1;

    //         $("#hPnm").text(allData["PNM"]);
    //         $("#tdPnm").text(allData["PNM"]);

    //         if (allData["AMT_CUST"] != allData["AMT_SALE"]) {
    //             $("#tdAmt_cust").text((allData["AMT_CUST"] * 1).toLocaleString() + "원");
    //             $("#trAmt_cust").show();
    //         }

    //         $("#tdAmt").text(amt_original.toLocaleString() + "원");
    //         $("#tdDlvfee").text(dlvfee.toLocaleString() + "원");


    //         if (optionYn == "Y") {
    //             $(".dpOptionN").hide();
    //             $(".dpOptionY").show();

    //             if (allData["OPTION_YN"] == "Y") {
    //                 optionYn = "Y";
    //                 optionCnt = allData["OPTION_CNT"] * 1;
    //                 //fnWhenSelectOption('1');
    //             }
    //         }
    //         else {
    //             $(".dpOptionY").hide();
    //             $(".dpOptionN").show();
    //             $("#hidAmt_Total_N").val(amt_original);
    //             $("#spAmt_Total").text((amt_original + dlvfee).toLocaleString());
    //             max_cnt2 = allData["MAX_CNT"] * 1;
    //         }

    //         $("#tbOption").html(allData["OPTION"]);


    //     },
    //     error: function (data, status, err) {
    //         $("#loading_0").hide();
    //         alert("서버와의 통신에 실패하였습니다.");
    //         console.log(data);
    //         console.log(status);
    //         console.log(err);
    //         return;
    //     }

    // });

}

/*옵션 변경 시*/
function fnWhenSelectOption(selectedId) {

    //다음 셀렉트박스 없으면 RETURN
    var nextSelect = $("#option" + (selectedId * 1 + 1)).attr("onchange");  
    if (nextSelect === undefined) {
        getOptcd_p();
        return;
    }

    //'선택' 선택 시 select 초기화
    if ($("#option" + selectedId).val() == "non") {
        fnInitSelect(selectedId);
        return;
    }






    //이전 옵션
    var optionArr_before = new Array();
    var last = parseInt(selectedId);
    for (var i = 1; i <= parseInt(selectedId) ; i++) {
        var optionObj_before = new Object();
        var selectedOptcd_h = $("#option" + (i * 1)).attr("onchange").split('"')[3];

        var selectedOptcd_b = $("#option" + i).val();

        optionObj_before["OPTCD_H"] = selectedOptcd_h;
        optionObj_before["OPTCD_B"] = selectedOptcd_b;

        optionArr_before.push(optionObj_before);
    }

    var selectedOptcd_b = $("#option" + selectedId).val();

    var nextOptcd_h = nextSelect.split('"')[3];

    var lastYn = "N";
    if (optionCnt - 1 == selectedId * 1) {
        lastYn = "Y";
    }


    try {
        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();
        hObj.type = "03";
        hArr.push(hObj);

        var bArr = new Array();
        var bObj = new Object();
        bObj.pid = $("#ContentPlaceHolder1_hidPid").val();
        bObj.option_before = optionArr_before;
        bObj.optcd_h = nextOptcd_h;
        bObj.lastYn = lastYn;
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


                if (data.RESULT == "Y") {
                    var data1 = data.DATA;
                    console.log(data1)
                    var sHtml = "";
                    sHtml += "<option value='non'>선택</option>";
                    if (lastYn == "Y") {
                        for (var i = 0; i < data1.length; i++) {
                            if (data1[i].CNT == "0") {

                                sHtml += "<option value='" + data1[i].OPTCD_B + "' disabled>";
                            }
                            else {

                                sHtml += "<option value='" + data1[i].OPTCD_B + "'>";
                            }
                            sHtml += data1[i].OPTNM;
                            if (data1[i].AMT != "0") {
                                sHtml += "(" + data1[i].AMT + ")";
                            }
                            sHtml += "</option>";
                        }
                    }
                    else {
                        for (var i = 0; i < data1.length; i++) {
                            sHtml += "<option value='" + data1[i].OPTCD_B + "'>";
                            sHtml += data1[i].OPTNM;
                            if (data1[i].AMT != "0") {
                                sHtml += "(" + data1[i].AMT + ")";
                            }
                            sHtml += "</option>";
                        }
                    }


                    $("#option" + (selectedId * 1 + 1)).empty();
                    $("#option" + (selectedId * 1 + 1)).html(sHtml);

                }
                else {
                    alert("서버와의 통신에 실패하였습니다.");
                    $("#option" + (selectedId * 1 + 1)).empty();
                    var sHtml = "";
                    sHtml += "<option value='non'>선택</option>";
                    $("#option" + (selectedId * 1 + 1)).html(sHtml);

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
function getOptcd_p() {

    var pid = $("#ContentPlaceHolder1_hidPid").val();

    //이전 옵션
    var optionArr = new Array();

    var i = 1;
    while (true) {
        var optionObj_before = new Object();
        var selectedOptcd_h = $("#option" + (i * 1)).attr("onchange").split('"')[3];

        var selectedOptcd_b = $("#option" + i).val();

        optionObj_before["OPTCD_H"] = selectedOptcd_h;
        optionObj_before["OPTCD_B"] = selectedOptcd_b;

        optionArr.push(optionObj_before);


        var nextSelect = $("#option" + (i * 1 + 1)).attr("onchange");  //다음 셀렉트박스 없으면 RETURN
        if (nextSelect === undefined) {
            break;
        }

        i++;
    }


    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "04";
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

            
         if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }
            

            if (data["RESULT"] == "N") {
                alert("서버와의 통신에 실패하였습니다.");
                history.back();
                return;
            }

            var allData = data["DATA"];
            // 조회된게없음
            if (allData["OPTCD_P"] == "") { history.back(); return; }

            $("#hidOptcd_P").val(allData["OPTCD_P"]);
            var optcd_p = allData["OPTCD_P"]; //OPTCD_P
            var amt_add = allData["AMT"].replace(/[^0-9]/g, ''); //옵션 추가금액
            var max_cnt = allData["CNT"]; //최대주문가능수량


            fnSetOptionList(optcd_p, amt_add, max_cnt);

            //tbOptionList




            //fnCalPrdAmt();

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

/*마지막 옵션 선택 시 optionList 만들기*/
function fnSetOptionList(optcd_p, amt, max_cnt) {

    //기존에 선택한 옵션 있는지 조회 후 있으면 alert하고 수량변경 유도

    var optionNm = "";
    var optionSelect = $("select[id^='option'] option:selected");

    for (var i = 0; i < optionSelect.length; i++) {
        var name = $(optionSelect[i]).text();
        if(name.indexOf("(")!= -1){
            name = name.substring(0, name.indexOf("("));
        }
        optionNm += name + "/";
    }
    optionNm = optionNm.substring(0, optionNm.length - 1);

    var amt_total = (amt_original + amt * 1);

    var sHtml = "";
    sHtml += "<tr class='addoption' id='trOption_" + optionSeq + "'>                                     ";
    sHtml += "  <td >                                                ";
    sHtml += "      <p class='selctit' id='pOptnm_" + optionSeq + "'>" + optionNm + "</p>  ";
    sHtml += "  </td>                                                ";
    sHtml += "  <td>                                                 ";
    sHtml += "      <div class='quan'>                             ";
    sHtml += "          <input type='button' value='-' onclick='fnChgCnt(\"" + optionSeq + "\", \"-\", \"" + max_cnt + "\")' />            ";
    sHtml += "          <input type='text' value='1' id='txtCnt_" + optionSeq + "'  readonly />    ";
    sHtml += "          <input type='button' value='+' onclick='fnChgCnt(\"" + optionSeq + "\", \"+\", \"" + max_cnt + "\")')' />            ";
    sHtml += "      </div>                                           ";
    sHtml += "  </td>                                                ";
    sHtml += "  <td >                                                ";
    sHtml += "      <p class='op_price'><span id='spAmt_Sub_" + optionSeq + "'>" + amt_total.toLocaleString() + "</span>원</p>    ";
    sHtml += "      <span class='xbtn' onclick='fnDelOption(\"" + optionSeq + "\")' ></span>                       ";
    sHtml += "  </td>                                                ";
    sHtml += "  <td style='display:none;' >                                                ";
    sHtml += "      <input type='hidden' id='hidOptcd_P_" + optionSeq + "' value = '" + optcd_p + "'> ";
    sHtml += "      <input type='hidden' id='hidAmt_Add_" + optionSeq + "' value = '" + amt + "'> ";
    sHtml += "      <input type='hidden' id='hidAmt_Total_" + optionSeq + "' value = '" + amt_total + "'> ";
    sHtml += "  </td>                                                ";
    sHtml += "</tr>                                                    ";

    $("#tbOptionList").append(sHtml);
    optionSeq++;

    fnCalPrdAmt();
}

/*수량변경*/
function fnChgCnt(seq, type, max) {

    var id = "";
    if (optionYn == "Y") { //옵션 있을경우
        id = "txtCnt_" + seq;
    }
    else {
        id = "txtCnt_N";
    }

    var cnt = 0;
    cnt = $("#" + id).val() * 1;

    if (type == "+") {

        var max_cnt = 9999;

        if (optionYn == "Y" ) {max_cnt = max * 1;}
        else { max_cnt = max_cnt2;}

        var cnt_chg = cnt + 1;

        if (cnt_chg > max_cnt) {
            return;

        }
        cnt++;
    }
    else if(type == "-"){
        if ((cnt - 1) == 0) {
            /*
            옵션 있을경우 옵션 삭제 묻기
                옵션삭제O : list에서 삭제
                옵션삭제X : 아무 이벤트 없음(0으로 변경불가하기때문)
            옵션 없을 경우 아무 이벤트 없음(0으로 변경불가하기때문)
            */
            if (optionYn == "Y") { //옵션 있을경우 옵션 삭제 묻기(ok: 옵션 삭제) / 옵션 없을경우 아무 이벤트 없음(0으로 변경 불가)
                if (confirm("해당옵션을 삭제하시겠습니까?")) {
                    fnDelOption(seq);
                }
                else {
                    return;
                }
            }
            else {
                return;
            }
        }
        else {
            cnt--;

        }
    }

    $("#" + id).val(cnt.toLocaleString());

    if (optionYn == "Y") { //옵션있을경우 sub금액 변경
        var amt = $("#hidAmt_Total_" + seq).val() * 1 * cnt;
        $("#spAmt_Sub_" + seq).text(amt.toLocaleString());
    }

    fnCalPrdAmt();

}

/*선택한 옵션 삭제*/
function fnDelOption(seq) {
    //tr 삭제 후 금액계산
    $("#trOption_" + seq).remove();
    fnCalPrdAmt();
}

/*상품 Total 금액 계산*/
function fnCalPrdAmt() {

    var amt = 0;

    if (optionYn == "Y") { //옵션있을경우
        for (var i = 0; i < optionSeq; i++) {
            if ($("#hidAmt_Total_" + i).val() == undefined) {
                continue;
            }
            amt += ($("#hidAmt_Total_" + i).val() * 1) * ($("#txtCnt_" + i).val().replace(/[^0-9]/g, '') * 1);
        }
    }
    else { //옵션없을경우
        amt += ($("#hidAmt_Total_N").val() * 1) * ($("#txtCnt_N").val().replace(/[^0-9]/g, '') * 1);
    }

    //배송비 더하기
    amt += $("#tdDlvfee").text().replace(/[^0-9]/g, '') * 1;

    $("#spAmt_Total").text(amt.toLocaleString());
}


/*장바구니에 넣기*/
function fnInstCart() {

    var pid = $("#ContentPlaceHolder1_hidPid").val(); //PID
    var id = $("#ContentPlaceHolder1_hidId").val(); //ID

    if (id == "") {
        alert("로그인 후 이용가능합니다.");
        return;
    }


    var optionArr = new Array();

    if (optionYn == "Y") {
        for (var i = 0; i < optionSeq; i++) {
            if ($("#hidAmt_Total_" + i).val() == undefined) {
                continue;
            }

            var optcd_p = $("#hidOptcd_P_" + i).val();
            var cnt = $("#txtCnt_" + i).val();

            var optionObj = new Object();
            optionObj.optcd_p = optcd_p;
            optionObj.cnt = cnt;
            optionArr.push(optionObj);
        }
    }
    else {
        var cnt = $("#txtCnt_N").val();

        var optionObj = new Object();
        optionObj.optcd_p = "N";
        optionObj.cnt = cnt;
        optionArr.push(optionObj);

    }

    if (optionArr.length == 0) {
        alert("옵션을 선택해주세요");
        return;
    }

    for (var i = 0; i < optionArr.length; i++){
        console.log(i)
        console.log(optionArr[i])
    }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "05";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.pid = pid;
    bObj.id = id;
    bObj.option = optionArr;
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
            $("#loading_0").show();
        },
        success: function (data) {
            console.log(data);
            
        if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }
            
            alert(data["MSG"]);
            $("#loading_0").hide();
        },
        error: function (data, status, err) {
            alert("서버와의 연결에 실패하였습니다.");
            $("#loading_0").hide();
            console.log(data);
            console.log(status);
            console.log(err);
            return;
        }

    });

}

/*select 초기화*/
function fnInitSelect(seq) {

    var start = seq * 1;

    var optionSelect = $("select[id^='option'] option:selected");

    for (var i = start; i < optionSelect.length; i++) {
        console.log($(optionSelect[i]).text())
        $("#option"+(i+1)).val("non");
    }

}

/*위시리스트(찜) 추가*/
function fnWish() {
    $("#lbWish").toggleClass('is-active');
    // try {
    //     var pid = $("#ContentPlaceHolder1_hidPid").val();
    //     var id = $("#ContentPlaceHolder1_hidId").val(); //ID

    //     if (id == "") {

    //         alert("로그인 후 이용가능합니다.");
    //         return;
    //     }

    //     if (pid != "" && pid != null) {

    //         var type = "";

    //         if ($("#lbWish").hasClass("is-active")) {
    //             type = "D";
    //         }
    //         else {
    //             type = "I";
    //         }
            


    //         var hArr = new Array();
    //         var hObj = new Object();
    //         hObj.type = "07";
    //         hArr.push(hObj);

    //         var bArr = new Array();
    //         var bObj = new Object();
    //         bObj.pid = pid;
    //         bObj.id = id;
    //         bObj.type = type;

    //         bArr.push(bObj);

    //         var totObj = new Object();
    //         totObj.header = hArr;
    //         totObj.body = bArr;

    //         console.log(totObj)
    //         $.ajax({
    //             method: "post",
    //             url: targetUrl,
    //             data: JSON.stringify(totObj),
    //             dataType: "json",
    //             beforeSend: function () {
    //                 //로딩 창 출력

    //             },
    //             success: function (data) {

    //                 var result = data.RESULT; //통신결과
                    
    //             if (data.RESULT == "ERR") {
    //                     alert('장시간 미사용으로 로그인 만료되었습니다.');
    //                     location.href = '/view/member/login.aspx';
    //                     return;
    //                 }
            
    //                 if (result == "Y") {
    //                     $("#lbWish").toggleClass('is-active');
    //                 }
    //                 else {
    //                     alert(data.MSG);
    //                 }

    //             },
    //             error: function (data, status, err) {

    //                 return;
    //             }
    //         });
    //     }

    // }
    // catch (e) {

    // }


}

/*주문하기*/
function fnMove() {

    var id = $("#ContentPlaceHolder1_hidId").val(); //ID
    if (id == "") {
        alert("로그인 후 이용가능합니다.");
        return;
    }

    var pid = $("#ContentPlaceHolder1_hidPid").val(); //PI
    var pnm = $("#tdPnm").text(); //상품명
    var dlvfee = $("#tdDlvfee").text().replace(/[^0-9]/g, '') //배송비
    var amt_original = $("#tdAmt").text().replace(/[^0-9]/g, ''); //원금액

    
    var prdArr = new Array();



    if (optionYn == "Y") {

        for (var i = 0; i < optionSeq; i++) {
            if ($("#hidAmt_Total_" + i).val() == undefined) {
                continue;
            }

            var optcd_p = $("#hidOptcd_P_" + i).val();
            var cnt = $("#txtCnt_" + i).val();
            var optnm = $("#pOptnm_" + i).text();
            var amt_add = $("#hidAmt_Add_" + i).val();
            var amt_pay = $("#spAmt_Sub_" + i).text().replace(/[^0-9]/g, ''); //총상품금액(원금액+옵션추가금액)


            var prdObj = new Object();
            prdObj.pid = pid; //상품코드
            prdObj.pnm = pnm; //상품명
            prdObj.optcd_p = optcd_p;
            prdObj.cnt = cnt;
            prdObj.amt_original = amt_original; //상품원금액
            prdObj.amt_add = amt_add;
            prdObj.amt_pay = amt_pay; //상품금액+옵션추가금액
            prdObj.dlvfee = dlvfee; //배송비
            prdObj.img_list = img_list; //이미지
            prdObj.optnm = optnm;
            prdArr.push(prdObj);
        }
    }
    else {
        var optcd_p = "N";
        var cnt = $("#txtCnt_N").val();
        var optnm = "옵션없음";
        var amt_add = "0";


        var prdObj = new Object();
        prdObj.pid = pid; //상품코드
        prdObj.pnm = pnm; //상품명
        prdObj.optcd_p = optcd_p;
        prdObj.cnt = cnt;
        prdObj.amt_original = amt_original; //상품원금액
        prdObj.amt_add = amt_add;
        prdObj.amt_pay = (amt_original * 1 )* (cnt*1); //상품금액+옵션추가금액
        prdObj.dlvfee = dlvfee; //배송비
        prdObj.img_list = img_list; //이미지
        prdObj.optnm = optnm;
        prdArr.push(prdObj);
    }

    if (optionYn == "Y" && prdArr.length == 0) {
        alert("옵션을 선택해주세요.");
    }


    //페이지 이동        
    var destPath = "/view/order/orderPay.aspx";
    post_to_url(destPath, {
        "prdArr": JSON.stringify(prdArr)
    });
}



/*리뷰조회*/
function fnSearchReview() {

    var pid = $("#ContentPlaceHolder1_hidPid").val()

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "08";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.pid = pid;
    bArr.push(bObj);

    var totObj = new Object();
    totObj.header = hArr;
    totObj.body = bArr;

    console.log(JSON.stringify(totObj));
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
            if (data == "" || data["RESULT"] == "N" || data["DATA"].length == 0) {
                $("#paging").hide();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }


            var allData = data["DATA"];

            $("#spReviewCnt").text(data["DATA"].length.toLocaleString());
            
            fnPaging(allData, allData.length, dataPerPage, pageCount, 1); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지)


        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            alert("서버와의 통신에 실패하였습니다.");
            console.log(data);
            console.log(status);
            console.log(err);
            return;
        }

    });

}


/*페이징*/
function fnPaging(data, totalData, dataPerPage, pageCount, currentPage) {

    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹


    if (totalData <= dataPerPage) { //총 데이터수가 한 페이지에 나타낼 데이터 수 보다 같거나 작을 경우
        totalPage = 1; //총 페이지수
        pageGroup = 1; //총 데이터 그룹 
        pageCount = 1; //한 화면에 나타낼 페이지 수
    }
    if (totalData <= 10) {
        pageCount = totalPage;
    }

    console.log("totalPage : " + totalPage + " / pageGroup : " + pageGroup + " / pageCount : " + pageCount);

    var bArr = new Array(); //페이징 배열
    var bObj = null;

    var indexCnt = -1; //data index

    loof1: for (var i = 0; i < totalPage; i++) { //총 페이지수 만큼 반복

        var aArr = new Array();

        loof2: for (var j = 0; j < 10; j++) { //template 인덱스 10개씩 쪼개서 배열에 넣기

            indexCnt++;

            aArr.push(indexCnt);

            if (indexCnt == data.length - 1) {
                break loof2;
            }

        }

        bObj = new Object();
        bObj.aArr = aArr;
        bArr.push(bObj);

        if (indexCnt == data.length - 1) {
            break loof1;
        }

    }

    var sHtml = "";
    for (var i = 0; i < bArr.length; i++) {

        if (currentPage - 1 == i) {
            var aArr = bArr[i].aArr;
            $("#divIsList").empty();
            var sHtml = "";
            for (var j = 0; j < aArr.length; j++) {
                sHtml += "<div class='review_list'>															";
                sHtml += "                                                      ";
                sHtml += "       <div class='fl-view'>                          ";
                sHtml += "           <div class='point-type'>                   ";
                sHtml += "               <span class='point'>";

                for (var k = 0; k < (data[aArr[j]]["STAR"] * 1) ; k++){
                    sHtml += "★";
                }

                sHtml += "</span>  ";
                sHtml += "           </div>                                     ";
                sHtml += "           <p class='review_txt'>                     ";
                sHtml += "" + data[aArr[j]]["CONTENT"] + "";

                sHtml += "           </p>                                       ";
                sHtml += "       </div>                                         ";
                sHtml += "       <div class='fr-view'>                          ";
                sHtml += "           <p class='userName'>" + data[aArr[j]]["NAME"] + "</p>             ";
                sHtml += "           <p class='buypd'>" + data[aArr[j]]["ENTDT"] + "</p>            ";
                sHtml += "       </div>                                         ";
                sHtml += "   </div>                                             ";


            }


        }
    }


    $("#divNonList").css("display", "none");
    $("#divIsList").css("display", "");
    $("#divIsList").html(sHtml);


    var last = pageGroup * pageCount;    // 화면에 보여줄 마지막 페이지 번호
    if (last > totalPage)
        last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여줄 첫번째 페이지 번호
    if (first <= 0) {
        first = 1;
    }
    var next = last + 1;
    var prev = first - 1;


    console.log("last : " + last + " / first : " + first + " / next : " + next + " / prev : " + prev);

    var $pingingView = $("#paging");

    var html = "";
    var test = "";

    if (prev > 0)
        html += "<li><a href='#' id='prev' class='prev'> </a></li>";

    for (var i = first; i <= last; i++) {
        html += "<li><a href='#" + i + "' id=" + i + " onclick='return false'>" + i + "</a></li> ";
    }

    if (last < totalPage)
        html += "<li><a href=# id='next' class='next' style='text-decoration: none'></a><li>";

    $("#paging").html(html);    // 페이지 목록 생성


    $("#paging a#" + currentPage).addClass("active"); //현재 페이지 클래스 추가

    $("#paging li a").click(function () {
        var $item = $(this);
        var $id = $item.attr("id");
        var selectedPage = $item.text();

        if ($id == "next") selectedPage = next;
        if ($id == "prev") selectedPage = prev;


        fnPaging(data, data.length, dataPerPage, pageCount, selectedPage);
    });

}

