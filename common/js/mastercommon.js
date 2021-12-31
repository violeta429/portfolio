
$(function () {

    master_recent_show();

window.addEventListener('load', function() {
            var allElements = document.getElementsByTagName('*');
            Array.prototype.forEach.call(allElements, function(el) {
                var includePath = el.dataset.includePath;
                if (includePath) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            el.outerHTML = this.responseText;
                        }
                    };
                    xhttp.open('GET', includePath, true);
                    xhttp.send();
                }
            });
        });
})

/*최근본상품 표시*/
function master_recent_show() {

    var targetUrl = "/common/component/master/AjaxMaster.aspx";

    try {

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

        $.ajax({
            method: "post",
            url: targetUrl,
            data: JSON.stringify(totObj),
            dataType: "json",
            beforeSend: function () {
                //로딩 창 출력X

            },
            success: function (data) {
                //console.log(data);
                var result = data.RESULT; //통신결과


                if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }


                //성공 실패에 대한 처리 안함
                if (result == "Y") {
                    var allData = data.DATA; //통신결과
                    if (allData.length == 0) {
                        $("#divMaster_isRecent").hide();
                        $("#divMaster_nonRecent").show();
                    }
                    else {
                        var sHtml = "";
                        for (var i = 0; i < allData.length; i++) {
                            sHtml += "<div class='rcnt-pd-inner'>";
                            sHtml += "  <div onclick='fnMoveDetail(\"" + allData[i]["PID"] + "\")' >";
                            sHtml += "     <span class='rctimg'>";
                            sHtml += "         <img src='" + allData[i]["URL"] + "'/>";
                            sHtml += "     </span>";
                            sHtml += "     <div>";
                            sHtml += "         <p class='rc_pdname'>" + allData[i]["PNM_SHOP"] + "</p>";
                            sHtml += "         <p class='rc_pdprice'><span>" + allData[i]["AMT_SALE"] + "</span>원</p>";
                            sHtml += "     </div>";
                            sHtml += "  </div>";
                            sHtml += "  <div class='rctbtn'>";
                            sHtml += "      <input class='rct_del' type='button' onclick='master_recent_remove(\"" + allData[i]["PID"] + "\")'/>";
                            sHtml += "  </div>";
                            sHtml += "</div>";
                        }

                        $("#divMaster_isRecent").html(sHtml);
                        $("#divMaster_isRecent").show();
                        $("#divMaster_nonRecent").hide();
                    }
                }
                else {
                    $("#divMaster_isRecent").hide();
                    $("#divMaster_nonRecent").show();
                }
            },
            error: function (data, status, err) {
                $("#divMaster_isRecent").hide();
                $("#divMaster_nonRecent").show();
                return;
            }
        });


    }
    catch (e) {

    }



}

/*최근본상품 삭제*/
function master_recent_remove(pid) {

    if(!confirm("최근 본 상품을 삭제하시겠습니까?")){
        return;
    }


    var targetUrl = "/common/component/master/AjaxMaster.aspx";

    try {

        if (pid != "" && pid != null) {
            var hArr = new Array();
            var hObj = new Object();
            hObj.type = "02";
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
                    //로딩 창 출력X

                },
                success: function (data) {
                    console.log(data);
                    var result = data.RESULT; //통신결과

                    if (data.RESULT == "ERR") {
                        alert('장시간 미사용으로 로그인 만료되었습니다.');
                        location.href = '/view/member/login.aspx';
                    }

                    //성공 실패에 대한 처리 안함
                    if (result == "Y") {
                        //최근 본 상품 삭제 성공
                        master_recent_show();
                    }
                    else {
                        //최근 본 상품 삭제 실패
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

function fnMoveDetail(pid) {
    get_to_url("/view/product/product_detail.aspx?pid=" + pid)
}

function fnMoveJoin(id, name, type) {
    var destPath = "/view/member/join_terms.aspx";
    var member = new Object();
    member.id = id;
    member.name = name;
    member.type = type;

    post_to_url(destPath, {
        "member": JSON.stringify(member)
    });
}

function fnCheckLoginMaster(type) {

    if ($("#ContentPlaceHolder1_hidIdMaster").val() == "") {
        alert("로그인 후 사용하실 수 있습니다.");
    }
    else {
        var path = "";
        if (type == "A") { path = "/view/cscenter/qna.aspx"; }
        else if (type == "B") { path = "/view/cscenter/qnalist.aspx"; }

        if (path != "") { location.href = path; }
    }

}
