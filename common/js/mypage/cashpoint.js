var targetUrl = "/common/component/mypage/AjaxCashpoint.aspx";
var dataPerPage = 10; //한 페이지에 나타낼 데이터 수
var pageCount = 5; //한 화면에 나타낼 페이지 수


$(document).ready(function () {
    //정보불러오기
    fnSelDatepicker('3', 'C'); //캐쉬조회 기본 1개월 설정
    fnSelDatepicker('3', 'P'); //포인트조회 기본 1개월 설정
    fnGetMember(); // 캐쉬,포인트 조회
    fnGetCash(); // 캐쉬 사용내역 조회

    //캐쉬 날짜 선택 색상 변경
    $('.C span').on('click', function () {
        $('.C span').removeClass();
        $(this).addClass('active')
    })


    // 포인트 날짜 선택 색상 변경
    $('.P span').on('click', function () {
        $('.P span').removeClass();
        $(this).addClass('active')
    })




});

//캐쉬, 포인트 조회
function fnGetMember() {

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


                if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }

                var allData = data.DATA;
               
                $("#my-cash").text(allData["CASH"]);
                $("#my-point").text(allData["POINT"]);
            },
            error: function (data, status, err) {
            $("#loading_0").hide();

            alert("서버와의 통신에 실패하였습니다.");
        }

        });

    } catch (e) {
        $("#loading_0").hide();
        alert("서버와의 통신에 실패하였습니다.");
    }

}

// 캐쉬 사용내역 조회
function fnGetCash() {
    try {
        
        var startDt = $("#cStartDt").val().replace(/[^0-9]/g, ''); // 조회 시작 일자
        var endDt = $("#cEndDt").val().replace(/[^0-9]/g, ''); // 조회 끝 일자
        
        
        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();

        //정보불러오기
        hObj.type = "02";
        hArr.push(hObj);

        var bArr = new Array();
        var bObj = new Object();
        
        bObj.startDt = startDt;
        bObj.endDt = endDt;

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
                var allData = data.DATA;

                var listHtml = "";
                if (data == null || data.RESULT == "N" || allData.length == 0) {
                    $("#cTbIsList").hide();
                    $("#pagingC").hide();
                    $("#cTbNonList").show();
                    
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                } else {
                    var type = 'C'; //타입 캐쉬
                    fnPaging(allData, allData.length, dataPerPage, pageCount, 1, type); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지, 타입)
                }
               
            },
            error: function (data, status, err) {
                $("#loading_0").hide();

                alert("서버와의 통신에 실패하였습니다.");
            }

        });


    }
    catch (e) {
        $("#loading_0").hide();
        alert("서버와의 통신에 실패하였습니다.");
    }
    
}


// 포인트 사용내역 조회
function fnGetPoint() {
    try {
        
        var startDt = $("#pStartDt").val().replace(/[^0-9]/g, ''); // 조회 시작 일자
        var endDt = $("#pEndDt").val().replace(/[^0-9]/g, ''); // 조회 끝 일자

        var totObj = new Object();
        var hArr = new Array();
        var hObj = new Object();

        //정보불러오기
        hObj.type = "03";
        hArr.push(hObj);

        var bArr = new Array();
        var bObj = new Object();

        bObj.startDt = startDt;
        bObj.endDt = endDt;

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

                
            if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
            }

                var allData = data.DATA;
                var listHtml = "";
                if (data == null || data.RESULT == "N" || allData.length == 0) {
                    $("#pTbIsList").hide();
                    $("#pagingP").hide();
                    $("#pTbNonList").show();
                } else {
                    var type = 'P'; //타입 포인트
                    fnPaging(allData, allData.length, dataPerPage, pageCount, 1, type); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지, 타입)
                }
                
            },
            error: function (data, status, err) {
                $("#loading_0").hide();

                alert("서버와의 통신에 실패하였습니다.");
            }

        });


    }
    catch (e) {
        $("#loading_0").hide();
        alert("서버와의 통신에 실패하였습니다.");
    }

}

function fnSelDatepicker(type, btn) {

    if (btn == 'C') { //캐시 일자 버튼 클랙

    }
    else if (btn == "P") { //포인트 버튼 클릭

    }
    else {
        return;
    }

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

        
    if (btn == 'C') {
        //캐시
        $("#cStartDt").val($.datepicker.formatDate('yy-mm-dd', startday));
        $("#cEndDt").val($.datepicker.formatDate('yy-mm-dd', endday));
    } else if (btn == 'P') {
        //포인트
        $("#pStartDt").val($.datepicker.formatDate('yy-mm-dd', startday));
        $("#pEndDt").val($.datepicker.formatDate('yy-mm-dd', endday));
    }
    


    //page = 1;
    //fnGetList(page);
    //page++;

}



/*페이징*/
function fnPaging(data, totalData, dataPerPage, pageCount, currentPage, type) {


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
            //$("#pTbIsList").empty();
            var sHtml = "";
            for (var j = 0; j < aArr.length; j++) {
                
                sHtml += "<tr>";
                sHtml += "<td>" + data[aArr[j]]["entDt"] + "</td>";
                sHtml += "<td>" + data[aArr[j]]["orderType"] + "</td>";
                if (data[aArr[j]]["amt"].substring(0, 1) == '-') { // 마이너스 색상 변경
                    sHtml += "<td class='listminus'>" + data[aArr[j]]["amt"] + "</td>";
                } else {
                    sHtml += "<td>" + data[aArr[j]]["amt"] + "</td>";
                }
                sHtml += "<td>" + data[aArr[j]]["amtAfter"] + "</td>";
                sHtml += "</tr>";
                sHtml += "</tr>";
                
            }
            
        }
    }

    if (type == 'C') {
        $(".pointtab").hide();
        $("#cTbNonList").hide();
        $("#cTbIsList").html(sHtml).show();
    } else if (type == 'P') {
        $(".cashtab").hide();
        $("#pTbNonList").hide();
        $("#pTbIsList").html(sHtml).show();
    } else {
        return;
    }
    

    var last = pageGroup * pageCount;    // 화면에 보여줄 마지막 페이지 번호
    if (last > totalPage)
        last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여줄 첫번째 페이지 번호
    if (first <= 0) {
        first = 1;
    }
    var next = last + 1;
    var prev = first - 1;
    
    //var $pingingView = $("#paging");
    //캐쉬 페이징
    if (type == 'C') {
        var html = "";
        var test = "";

        html += "<ul class='pagination modal-1'>"
        if (prev > 0)
            html += "<li><a href='#' id='prevC' class='prev'> </a></li>";

        for (var i = first; i <= last; i++) {
            html += "<li><a href='#" + i + "' id=" + i + " onclick='return false'>" + i + "</a></li> ";
        }

        if (last < totalPage)
            html += "<li><a href=# id='nextC' class='next' style='text-decoration: none'></a><li>";
        html += "</ul>"
        $("#pagingC").html(html);// 캐쉬 페이지 목록 생성


        $("#pagingC a#" + currentPage).addClass("active"); //현재 페이지 클래스 추가

        $("#pagingC li a").click(function () {
            var $item = $(this);
            var $id = $item.attr("id");
            var selectedPage = $item.text();

            if ($id == "nextC") selectedPage = next;
            if ($id == "prevC") selectedPage = prev;

            fnPaging(data, data.length, dataPerPage, pageCount, selectedPage, type);
        });
    }

    // 포인트 페이징
    if (type == 'P') {
        var html = "";
        var test = "";

        html += "<ul class='pagination modal-1'>"
        if (prev > 0)
            html += "<li><a href='#' id='prevP' class='prev'> </a></li>";

        for (var i = first; i <= last; i++) {
            html += "<li><a href='#" + i + "' id=" + i + " onclick='return false'>" + i + "</a></li> ";
        }

        if (last < totalPage)
            html += "<li><a href=# id='nextP' class='next' style='text-decoration: none'></a><li>";
        html += "</ul>"
        $("#pagingP").html(html);    //포인트 페이지 목록 생성


        $("#pagingP a#" + currentPage).addClass("active"); //현재 페이지 클래스 추가

        $("#pagingP li a").click(function () {
            var $item = $(this);
            var $id = $item.attr("id");
            var selectedPage = $item.text();

            if ($id == "nextP") selectedPage = next;
            if ($id == "prevP") selectedPage = prev;

            fnPaging(data, data.length, dataPerPage, pageCount, selectedPage, type);
        });
    }
    

}