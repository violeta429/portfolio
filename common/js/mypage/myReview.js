var targetUrl = "/common/component/mypage/AjaxMyReview.aspx";


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
                    $("#divIsList").hide();
                    $("#paging").hide();
                    $("#divNonList").show();
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

//수정
function fnUpdate(orderno, pid) {

    location.href = "/view/mypage/myReview_re.aspx?orderno=" + orderno + "&pid=" + pid;
}

//삭제
function fnDelete(orderno, pid) {
    try {

        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();

        //정보불러오기
        hObj.type = "02";
        hArr.push(hObj);

        var bArr = new Array();
        var bObj = new Object();
        bObj.orderno = orderno;
        bObj.pid = pid;

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
                    alert("삭제 실패하였습니다.");
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }
                else{
                    alert("삭제되었습니다.");
                    location.reload();
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

                sHtml += "	<div class='reviewWrap'>                                                                               ";
                sHtml += "      <div class='reviewTop'>                                                                            ";
                sHtml += "          <p class='pd_l'>                                                                               ";
                sHtml += "              <span class='imgWrap'>                                                                     ";
                sHtml += "                  <img src='" + data[aArr[j]]["FILEURL"] + "' />                                       ";
                sHtml += "              </span>                                                                                    ";
                sHtml += "              <span class='pd_tit'>" + data[aArr[j]]["PNM"] + "</span>  ";
                sHtml += "          </p>                                                                                           ";
                sHtml += "          <p class='pd_r'>                                                                               ";
                sHtml += "              <span class='pd_eidit'>                                                                    ";
                sHtml += "                  <input type='button' name='name' value='수정' onclick='fnUpdate(\"" + data[aArr[j]]["ORDERNO"] + "\",\"" + data[aArr[j]]["PID"] + "\")' />                                       ";
                sHtml += "                  <input type='button' name='name' value='삭제' onclick='fnDelete(\"" + data[aArr[j]]["ORDERNO"] + "\",\"" + data[aArr[j]]["PID"] + "\")' />                                       ";
                sHtml += "              </span>                                                                                    ";
                sHtml += "          </p>                                                                                           ";
                sHtml += "      </div>                                                                                             ";
                sHtml += "      <div class='reviewMd'>                                                                             ";
                sHtml += "          <div class='Mystar'>                                                                           ";
                sHtml += "              <div class='rating-stars text-center'>                                                     ";
                sHtml += "                  <ul>                                                                                   ";

                for (var k = 0; k < (data[aArr[j]]["STAR"] * 1) ; k++) { //색깔별
                    sHtml += "                      <li class='star fill' data-value='1'>                                              ";
                    sHtml += "                          <i class='fa fa-star fa-fw'></i>                                               ";
                    sHtml += "                      </li>                                                                              ";
                }
                for (var k = (data[aArr[j]]["STAR"] * 1) ; k < 5 ; k++) { //회색별
                    sHtml += "                      <li class='star' data-value='1'>                                              ";
                    sHtml += "                          <i class='fa fa-star fa-fw'></i>                                               ";
                    sHtml += "                      </li>                                                                              ";
                }
                sHtml += "                  </ul>                                                                                  ";
                sHtml += "              </div>                                                                                     ";
                sHtml += "          </div>                                                                                         ";
                sHtml += "          <span class='date'>" + data[aArr[j]]["ENTDT"] + "</span>                                                           ";
                sHtml += "      </div>                                                                                             ";
                sHtml += "                                                                                                         ";
                sHtml += "      <div class='reviewTxt' escapeXml='false'>" + data[aArr[j]]["CONTENT"] + "</div>                                                                                             ";
                sHtml += "  </div>                                                                                                 ";

            }


        }
    }
    console.log(sHtml)

    $("#divNonList").css("display", "none");

    $("#divIsList").css("display", "");
    $("#divIsList").html(sHtml);
    $("#paging").css("display", "");
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



