var targetUrl = "/common/component/cscenter/AjaxCscenter.aspx";

var dataPerPage = 10; //한 페이지에 나타낼 데이터 수
var pageCount = 5; //한 화면에 나타낼 페이지 수

$(document).ready(function () {

    fnSearch();
});

/*공지사항조회*/
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
            $("#loading_0").show();
        },
        success: function (data) {

            $("#loading_0").hide();

            console.log(data);

            if (data == null || data.RESULT == "N" || data.DATA.length == 0) {

                $("#tbIsList").hide();
                $("#paging").hide();
                $("#tbNonList").show();
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
            alert("서버와의 통신이 실패하였습니다.");

            //$("#loading_0").hide();
            history.back();
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
            $("#tbIsList").empty();
            var sHtml = "";
            for (var j = 0; j < aArr.length; j++) {


                sHtml += "<tr onclick='$(location).attr(\"href\", \"/view/cscenter/cscenter_detail.aspx?seq=" + data[aArr[j]]["SEQ"] + "\");' >";
                sHtml += "  <td>" + data[aArr[j]]["SEQ"] + "</td>";
                sHtml += "  <td>" + data[aArr[j]]["TITLE"] + "</td>";
                sHtml += "  <td>" + data[aArr[j]]["ENTDT"] + "</td>";
                sHtml += "  <td>" + data[aArr[j]]["ENTID"] + "</td>";
                sHtml += "</tr>";


            }


        }
    }


    $("#tbNonList").css("display", "none");
    $("#tbIsList").css("display", "");
    $("#paging").css("display", "");
    $("#tbIsList").html(sHtml);
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
