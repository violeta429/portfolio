var targetUrl = "/common/component/product/AjaxProduct_list.aspx";
var page = 0; //조회할 페이지
var non_data = 0; //데이터 유무 여부
var seltype_before = ""; //이전조회구분 
var searchType = ""; //검색타입 C:카테고리검색 / K:키워드검색
var searchValue = ""; //검색값
var selType = "recent"; //최신순
var dataPerPage = 12; //한 페이지에 나타낼 데이터 수
var pageCount = 5; //한 화면에 나타낼 페이지 수

$(function () {
    searchType = $("#ContentPlaceHolder1_hidSearchType").val();
    searchValue = $("#ContentPlaceHolder1_hidSearchValue").val();

    if (searchType == "C") {
        //category_cd = $("#ContentPlaceHolder1_hidCategory_cd").val();
        //seltype_before = seltype = $("#selType option:selected").val();
        ////상품리스트 메뉴조회
        //fnMenuList(category_cd);
        ////상품조회
        fnProductList_Category("recent");
    }
    else if (searchType == "K") {
        $("#hValue").text(searchValue);
        fnProductList_Keyword("recent");
    }


    $('#ulSelType li').click(function () {
        if (selType != $(this).attr("value")) {
            $("[class=on]").removeClass("on");
            $(this).addClass("on");
            selType = $(this).attr("value");

            if (searchType == "K") {
                fnProductList_Keyword(selType);

            }
            else if (searchType == "C") {
                fnProductList_Category(selType);
            }
        }

    });

})



//상품조회_keyword
function fnProductList_Keyword() {


    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    //상품조회_키워드
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.keyword = searchValue;
    bObj.selType = selType;
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

            
        if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }
            
            if (data.RESULT == "Y") {
                var allData = data["DATA"];
                $("#spCount").text(data.COUNT);

                if (allData.length == 0) {
                    $("#divNonList").show();
                    $("#divIsList").hide();
                    $("#paging").hide();

                }
                else {
                    fnPaging(allData, allData.length, dataPerPage, pageCount, 1); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지)

                }

            }
            else {

                $("#divNonList").show();
                $("#divIsList").hide();
                $("#paging").hide();
            }



        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            returnData = "서버와의 통신이 실패했습니다.";
            alert(returnData);
        }
    });

}

//상품조회_category
function fnProductList_Category() {


    var totObj = new Object();
    var hArr = new Array();
    var hObj = new Object();

    //상품조회_카테고리
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.category_cd = searchValue;
    bObj.selType = selType;
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

            
        if (data.RESULT == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
                return;
            }
            


            var allData = data["DATA"];

            if (data.RESULT == "Y") {
                $("#spCount").text(data.COUNT);

                if (allData.length == 0) {
                    $("#divNonList").show();
                    $("#divIsList").hide();
                    $("#paging").hide();

                }
                else {
                    fnPaging(allData, allData.length, dataPerPage, pageCount, 1); //데이터, 총 데이터 수, 한 페이지에 나타낼 데이터 수, 한 페이지에 나타낼 페이징 수, 현재페이지)

                }

            }
            else {

                $("#divNonList").show();
                $("#divIsList").hide();
                $("#paging").hide();
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
    if (totalData <= 45) {
        pageCount = totalPage;
    }


    var bArr = new Array(); //페이징 배열
    var bObj = null;

    var indexCnt = -1; //data index

    loof1: for (var i = 0; i < totalPage; i++) { //총 페이지수 만큼 반복

        var aArr = new Array();

        loof2: for (var j = 0; j < dataPerPage; j++) { //template 인덱스 9개씩 쪼개서 배열에 넣기

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

    //console.log(bArr);


    var sHtml = "";
    for (var i = 0; i < bArr.length; i++) {

        if (currentPage - 1 == i) {
            var aArr = bArr[i].aArr;
            //console.log(aArr);            

            for (var j = 0; j < aArr.length; j++) {
                sHtml += "<div class='c_area'>                                            ";
                sHtml += "   <a href='#' onclick='fnMoveDetail(\"" + data[aArr[j]].PID + "\")'>                                                 ";
                sHtml += "   <div class='pd_img'>                                         ";
                sHtml += "       <img src='" + data[aArr[j]].IMG_LIST + "'/>          ";
                sHtml += "   </div>                                                       ";
                sHtml += "   <div class='pd_txt'>                                         ";
                sHtml += "      <h4 class='pd_tit'>" + data[aArr[j]].PNM_SHOP + "</h4>                          ";
                if (data[aArr[j]].SUMMARY != "") {
                    sHtml += "      <p class='pd_info'>" + data[aArr[j]].SUMMARY + " </p> ";
                }
                sHtml += "      <div class='price'>                                       ";

                if (data[aArr[j]].AMT_SALE != data[aArr[j]].AMT_CUST) {
                    sHtml += "         <span class='price_del'>" + data[aArr[j]].AMT_CUST + "</span>                   ";
                }


                sHtml += "         <span class='price_n'>" + data[aArr[j]].AMT_SALE + "</span>                   ";
                sHtml += "      </div>                                                    ";
                sHtml += "      <div class='icon_area'>                                   ";
                sHtml += "          <span class='best'>BEST</span>                        ";
                sHtml += "          <span class='new'>NEW</span>                          ";
                sHtml += "      </div>                                                    ";
                sHtml += "   </div>                                                       ";
                sHtml += "   </a>                                                         ";
                sHtml += "</div>                                                          ";

            }

        }
    }
    $("#divIsList").empty();
    $("#divIsList").html(sHtml);
    $("#divNonList").hide();
    $("#divIsList").show();

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
        html += "<li><a href='#' class='prev' id='prev'></a></li> ";

    for (var i = first; i <= last; i++) {

        if (i == currentPage) {
            html += "<li><a href='#" + i + "' id=" + i + " class='active' onclick='return false'>" + i + "</a></li> ";
        }
        else {
            html += "<li><a href='#" + i + "' id=" + i + " onclick='return false'>" + i + "</a></li> ";

        }

    }

    if (last < totalPage)
        html += "<li><a href='#' class='next' id='next'></a></li>";

    $("#paging").html(html);    // 페이지 목록 생성

    //$("#paging a").css({
    //    "text-decoration": "none",
    //    "color": "#3b3b3b",
    //    "padding": "5px 12px",
    //    "transition": "background-color .2s",
    //    "border-radius": "50%",
    //    "font-size": "14px",
    //});



    $("#paging a").click(function () {

        var $item = $(this);
        var $id = $item.attr("id");
        var selectedPage = $item.text();

        if ($id == "next") selectedPage = next;
        if ($id == "prev") selectedPage = prev;

        fnPaging(data, data.length, dataPerPage, pageCount, selectedPage);


    });

}
