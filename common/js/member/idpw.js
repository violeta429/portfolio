var targetUrl = "/common/component/member/AjaxIdpw.aspx";


//아이디찾기
function fnFindId() {
    var name = $("#txtName").val();
    var mobile = $("#txtMobile").val();

    if (name == "") { alert("이름을 입력해주세요"); return; }
    if (mobile == "") { alert("전화번호를 입력해주세요"); return; }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.name = name;
    bObj.mobile = mobile;
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

            var result = data.RESULT;

            $("[id^='divResult']").hide();
            if (result == "Y") {
                if (data.REGTYPE == "A") {
                    var id = data.ID;
                    $("#spId").text(id);
                    $("#divResultY").show();
                }
                else {

                    $("#pReason").text(data.REGTYPENM + "아이디로 회원가입 하였습니다.");
                    $("#divResultN").show();

                }
            }
            else {
                $("#pReason").text("해당되는 정보로 아이디를 찾을 수가 없습니다.");
                $("#divResultN").show();
            }

            

        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            console.log(data);
            console.log(status);
            console.log(err);
            return;

        }
    });
}


//비밀번호찾기
function fnFindPw() {
    var id = $("#txtId").val();
    var mobile = $("#txtMobile").val();
    

    if (id == "") { alert("아이디를 입력해주세요"); return; }
    if (mobile == "") { alert("전화번호를 입력해주세요"); return; }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.id = id;
    bObj.mobile = mobile;
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

            var result = data.RESULT;

            if (result == "Y") {
                var pw = data.PW;
                $("#spPw").text(pw);
            }

            $("[id^='divResult']").hide();
            $("#divResult" + result).show();


        },
        error: function (data, status, err) {
            $("#loading_0").hide();
            console.log(data);
            console.log(status);
            console.log(err);
            return;

        }
    });
}






