var targetUrl = "/common/component/order/AjaxOrderInfo.aspx";

var dataPerPage = 10; //한 페이지에 나타낼 데이터 수
var pageCount = 5; //한 화면에 나타낼 페이지 수

$(document).ready(function () {
    fnSelDatepicker(3);
    fnGetList()
});

//데이트피커 변경 이벤트
function fnSelDatepicker(type) {

    var startday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    var endday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    if (type == "") { //오늘
    }
    else if (type == "2") { //일주일
        startday.setDate(startday.getDate() - 7);
    }
    else if (type == "3") { //1개월
        if (startday.getDate() == (new Date(startday.getFullYear(), startday.getMonth() + 1, 0)).getDate()) {
            startday.setDate(1);
        }
        else {
            startday.setMonth(startday.getMonth() - 1);
            startday.setDate(startday.getDate() + 1);
        }
        console.log(startday)
    }
    else if (type == "4") { //3개월
        if (startday.getDate() == (new Date(startday.getFullYear(), startday.getMonth() + 3, 0)).getDate()) {
            startday.setDate(1);
        }
        else {
            startday.setMonth(startday.getMonth() - 3);
            startday.setDate(startday.getDate() + 1);
        }
        console.log(startday)
    }
    else if (type == "5") { //6개월
        if (startday.getDate() == (new Date(startday.getFullYear(), startday.getMonth() + 6, 0)).getDate()) {
            startday.setDate(6);
        }
        else {
            startday.setMonth(startday.getMonth() - 6);
            startday.setDate(startday.getDate() + 1);
        }
    }

    $("#startDt").val($.datepicker.formatDate('yy-mm-dd', startday));
    $("#endDt").val($.datepicker.formatDate('yy-mm-dd', endday));


    //page = 1;
    //fnGetList(page);
    //page++;

}

//주문내역 조회
function fnGetList() {

    var startDt = $("#startDt").val(); //시작일
    startDt = startDt.replace(/\-/g, '');
    var endDt = $("#endDt").val(); //종료일
    endDt = endDt.replace(/\-/g, '');

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    // 주문리스트가져오기
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.startdt = startDt;
    bObj.enddt = endDt;
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
                $("#tbIsList").hide();
                $("#tbNonList").show();
                $("#paging").hide();
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }


            var allData = data.DATA;
            fnPaging(allData, allData.length, dataPerPage, pageCount, 1); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지)


        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });


}

//상태변경
function fnUpdStatus(status, orderno) {
    var msg = "";
    if (status == "10") {
        msg = "주문 취소 하시겠습니까?";
    }
    else if (status == "13") {
        msg = "구매확정 하시겠습니까? 구매확정이후 교환/환불 처리는 불가합니다. ";
    }
    else {
        return;
    }

    if (!confirm(msg)) { return; }

    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    // 상태변경
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.status = status;
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

            if (data == null || data.RESULT == "N") {
                alert("상태변경에 실패하였습니다.");
                return;
            }
            else if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }


            if (data.RESULT == "Y") {
                if(status == "10"){
                    alert("주문취소 요청되었습니다. 영업일 기준 3일 이내에 처리해드리겠습니다.");
                }
                else if (status == "13") {
                    alert("구매확정 되었습니다.");
                }
                fnGetList();
            }



        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
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
                var status = data[aArr[j]]["STATUS"];

                sHtml += "<tr>";
                sHtml += "	<td>";
                sHtml += "		<div class='orderDate'>";
                sHtml += "			<strong class='orderDate'>" + data[aArr[j]]["ENTDT"] + "</strong>";
                sHtml += "			<span>주문번호</span>";
                sHtml += "			<strong class='orderNumb'>" + data[aArr[j]]["ORDERNO"] + "</strong>";
                sHtml += "		</div>";
                sHtml += "	</td>";
                sHtml += "	<td>";
                sHtml += "		<a href='/view/order/orderDetail.aspx?orderno=" + data[aArr[j]]["ORDERNO"] + "'>";
                sHtml += "			<div class='orderWrap clearfix'>";
                sHtml += "				<div>";
                sHtml += "					<span class='orderImg'>";
                sHtml += "					    <img src='" + data[aArr[j]]["FILEURL"] + "' />";
                sHtml += "					</span>";
                sHtml += "				</div>";
                sHtml += "				<div class='orderInfo'>";
                sHtml += "					<h4>" + data[aArr[j]]["PNM_SHOP"] + "";
                sHtml += "					</h4>";
                sHtml += "					<p class='order_price'><span>" + data[aArr[j]]["AMT"] + "</span>원</p>";
                sHtml += "				</div>";
                sHtml += "			</div>";
                sHtml += "		</a>";
                sHtml += "	</td>";
                sHtml += "	<td>";
                sHtml += "		<div class='delivery_condition'>";
                sHtml += "			<p class='delivery_txt'>" + data[aArr[j]]["STATUSNM"] + "</p>";

                if (data[aArr[j]]["WAYBILLNO"] != "") {
                    sHtml += "			<a class='delivery_info' href='#' onclick='fnSelDel()'>대한통운<br />";
                    sHtml += "			    " + data[aArr[j]]["WAYBILLNO"] + " </a>";
                }
                sHtml += "		</div>";
                sHtml += "	</td>";
                sHtml += "	<td>";
                sHtml += "		<div class='delivery_set'>";

                if (status == "02") { //결제완료
                    sHtml += "			<input type='button' onclick='fnUpdStatus(\"10\", \"" + data[aArr[j]]["ORDERNO"] + "\")' value='주문취소' />";
                }
                else if (status == "04" ||status == "09") { //배송시작, 배송완료,교환완료
                    sHtml += "			<input type='button' onclick='fnUpdStatus(\"13\", \"" + data[aArr[j]]["ORDERNO"] + "\")' value='구매확정' />";
                }
                else if (status == "05") { //배송완료
                    sHtml += "			<input type='button' onclick='fnUpdStatus(\"13\", \"" + data[aArr[j]]["ORDERNO"] + "\")' value='구매확정' />";
                    sHtml += "			<input type='button' onclick='fnExchange(\"E\", \"" + data[aArr[j]]["ORDERNO"] + "\")' value='교환신청' />";
                    sHtml += "			<input type='button' onclick='fnExchange(\"R\", \"" + data[aArr[j]]["ORDERNO"] + "\")' value='반품신청' />";
                }
                sHtml += "		</div>";
                sHtml += "	</td>";
                sHtml += "</tr>";
                
            }


        }
    }


    $("#tbNonList").css("display", "none");
    $("#tbIsList").html(sHtml);
    $("#tbIsList").css("display", "");



    var last = pageGroup * pageCount;    // 화면에 보여줄 마지막 페이지 번호
    if (last > totalPage)
        last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여줄 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

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

    $("#paging li").click(function () {
        var $item = $(this);
        var $id = $item.attr("id");
        var selectedPage = $item.text();

        if ($id == "next") selectedPage = next;
        if ($id == "prev") selectedPage = prev;

        fnPaging(data, data.length, dataPerPage, pageCount, selectedPage);
    });

}

function fnExchange(type, orderno) {
    var url = "";
    if(type == "E"){ //교환
        url = "/view/order/claim/exchange_1.aspx";
    }
    else if(type == "R"){ //환불
        url = "/view/order/claim/refund.aspx";
    }
    else {
        return;
    }

    location.href = url + "?orderno=" + orderno;

}


function fnReview(pid) {

}