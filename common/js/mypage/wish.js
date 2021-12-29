var targetUrl = "/common/component/mypage/AjaxWish.aspx";


var dataPerPage = 10; //한 페이지에 나타낼 데이터 수
var pageCount = 5; //한 화면에 나타낼 페이지 수


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

                if (data == null || data.RESULT == "N" || data.DATA.length == 0) {
                    $("#thChk").hide();
                    $("#tbIslist").hide();
                    $("#paging").hide();
                    $("#tbNonlist").show();
                    return;
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }

                var allData = data.DATA;
                fnPaging(allData, allData.length, dataPerPage, pageCount, 1); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지)
                
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


//개별삭제
$(document).on("click", ".delbtn", function () {

    var id = $(this).attr('id'); //클릭한 버튼 아이디
    var id_num = id.replace(/[^0-9]/g, ''); //몇번째 버튼인지 알기


    var pid = $("#pid_" + id_num + "").val(); //상품금액


    if (!confirm("해당 상품을 삭제하시겠습니까?")) {
        return;
    }

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    var bArr = new Array();
    var bObj = new Object();

    // 관심상품 개별삭제
    hObj.type = "03";
    hArr.push(hObj);

    bObj.pid = pid; //상품번호
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
            if (data.RESULT == "Y") {
                fnGetInfo();
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
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

//선택삭제
function fnSelDel() {

    var length = $("#tbIslist tr").length;

    var pidArr = new Array(); //상품번호 배열
    var optcd_pArr = new Array(); //옵션조합코드 배열
    var cntArr = new Array(); //상품수량 배열

    //상품 갯수만큼 반복해서 정보 가져오기
    for (var i = 0; i < length; i++) {

        if (document.getElementsByName("chk")[i].checked == true) {
            var pid = $("#pid_" + i + "").val(); //상품금액

            var prdObj = new Object();
            prdObj.pid = pid;

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
            if (data.RESULT == "Y") {

                fnGetInfo();
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
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



//체크박스 선택시
function fnCheck() {
    

    var totlength = $("#tbIslist tr").length;

    if ($('input:checkbox[name="chk"]:checked').length == totlength) {
        $("input[name='chkTotal']").prop("checked", true);
    }
    else {
        $("input[name='chkTotal']").prop("checked", false);
    }


}

//체크박스 전체 해제
function totalCheck() {


    if ($("input[id='chkTotal']").is(":checked")) {
        $("input[name='chk']").prop("checked", true);
    } else {
        $("input[name='chk']").prop("checked", false);
    }
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
            $("#tbIslist").empty();
            var sHtml = "";
            for (var j = 0; j < aArr.length; j++) {

                sHtml += "<tr>";
                sHtml += "     <td>";
                sHtml += "        <label class='check-st-2'>";
                sHtml += "            <input type='checkbox' id='chk" + i + "' name='chk' value=''  onclick='fnCheck();' checked />";
                sHtml += "            <span></span>";
                sHtml += "        </label>";
                sHtml += "     </td>";
                sHtml += "     <td  onclick='$(location).attr(\"href\", \"/view/product/product_detail.aspx?pid=" + data[aArr[j]]["PID"] + "\");'>";
                sHtml += "         <span class='wishImg'>";
                sHtml += "            <img src='" + data[aArr[j]]["FILEURL"] + "'/>";
                sHtml += "         </span>";
                sHtml += "     </td>";
                sHtml += "     <td>";
                sHtml += "         <p class='pd_name'>";
                sHtml += "             " + data[aArr[j]]["PNM_SHOP"] + "";
                sHtml += "         </p>";
                sHtml += "         <p class='pd_price'><span>" + data[aArr[j]]["AMT"] + "</span>원</p>";
                sHtml += "     </td>";
                sHtml += "  <td>";
                sHtml += "      <input type='button' id='btnDel_"+j+"' class='wishdel delbtn' name='name'  />";
                sHtml += "  </td>";
                sHtml += " <td style='display:none'>";
                sHtml += " <input type='text' id='pid_" + j + "' value='" + data[aArr[j]]["PID"] + "'>";
                sHtml += " </td>";

                sHtml += " </tr>";
            }


        }
    }


    $("#tbNonlist").css("display", "none");
    $("#thChk").css("display", "");
    $("#tbIslist").css("display", "");
    $("#paging").css("display", "");
    $("#tbIslist").html(sHtml);
    //$("#isTable").empty();
    //$("#isTable").html(sHtml);
    //$("#nonTable").hide();
    //$("#isTable").show();



    var last = pageGroup * pageCount;    // 화면에 보여줄 마지막 페이지 번호
    if (last > totalPage)
        last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여줄 첫번째 페이지 번호
    if (first <= 0) {
        first = 1;
    }
    var next = last + 1;
    var prev = first - 1;


    console.log("last : " + last + " / first : " + first + " / next : " + next+ " / prev : " + prev);

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



