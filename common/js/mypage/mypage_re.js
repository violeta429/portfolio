var targetUrl = "/common/component/mypage/AjaxMypage_re.aspx";
var regType = "";


$(document).ready(function () {
    //정보불러오기
    fnGetMemberInfo(); // 회원정보 조회

});

//회원정보 조회
function fnGetMemberInfo() {
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
                var allData = data.DATA;

                if(data == null || data.RESULT == "N"){
                    history.back();
                    return;
                }
                else if (data.RESULT == "ERR") {
                    alert('장시간 미사용으로 로그인 만료되었습니다.');
                    location.href = '/view/member/login.aspx';
                }

                regType = allData["REGTYPE"];

                if (regType != "A") {
                    $("#trId").hide();
                    $("#trPw").hide();
                    $("#trPwNew").hide();
                    $("#trPwNew2").hide();
                }


                $("#txtId").text(allData["ID"]); //아이디
                $("#txtName").text(allData["NAME"]); //이름
                $("#txtMobile1").val(allData["MOBILE1"]); //번호 앞 3자리
                $("#txtMobile2").val(allData["MOBILE2"]); //번호 가운데 4자리
                $("#txtMobile3").val(allData["MOBILE3"]); //번호 끝 4자리
                $("#txtZipcd").val(allData["ZIPCD"]); //우편번호
                $("#txtAddr1").val(allData["ADDR1"]); //주소
                $("#txtAddr2").val(allData["ADDR2"]); //상세주소
                //비밀번호칸 비우기
                $("#txtPw").val("");
                $("#txtNewPw").val("");
                $("#txtNewPw2").val("");

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

//회원 정보 수정
function fnUpdateMemberInfo() {
    var id = $("#txtId").text();
    var pw = $("#txtPw").val(); //현재 비밀번호 입력 칸
    
    var newPw = $("#txtNewPw").val();
    var newPw2 = $("#txtNewPw2").val();
    var mobile = $("#txtMobile1").val() + $("#txtMobile2").val() + $("#txtMobile3").val();
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();

    if(regType == "A"){

        //기존 비밀번호 유효성검사
        if (pw == "") { alert("현재 비밀번호를 입력해주세요"); return; }


        //새로운 비밀번호 유효성 검사
        var patt = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}/;
        if (newPw != "") {
            if (!patt.test(newPw)) {
                console.log(patt.test(newPw));
                alert('비밀번호가 올바르지 않습니다.(8자 이상, 20자 이하이고 영문, 숫자, 특수문자 포함된 문자열로 구성되어야 합니다.)');
                return;
            }
        }
        if (newPw != newPw2) { alert("비밀번호와 비밀번호 확인이 일치하지 않습니다."); return; }
    }


    if (mobile.length != 11) { alert("전화번호 11자리를 정확히 입력해주세요"); return; }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.id = id;           //아이디
    bObj.pw = pw;           //기존 비밀번호
    bObj.newPw = newPw;     //새로운 비밀번호
    bObj.name = name;       //이름
    bObj.mobile = mobile;   //전화번호
    bObj.zipcd = zipcd;     //우편번호
    bObj.addr1 = addr1;     //주소
    bObj.addr2 = addr2;     //상세주소
    bObj.regtype = addr2;     //가입유형
    
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
            $("#loading_0").show();
        },
        success: function (data) {

            $("#loading_0").hide();

            var result = data.RESULT;

            if (result == "ERR") {
                alert('장시간 미사용으로 로그인 만료되었습니다.');
                location.href = '/view/member/login.aspx';
            }
            else if (result == "Y") {
                alert("회원정보가 수정되었습니다.");
                fnGetMemberInfo(); //새로고침
            }
            else if (result == "N") {
                alert("회원정보 수정에 실패하였습니다.");
                return false;
            } else if (result == 'D') {
                alert("현재 비밀번호가 일치하지 않습니다. ");
                return false;
            }

        },
        error: function (data, status, err) {
            alert("서버와의 통신에 실패하였습니다.");
            $("#loading_0").hide();
            console.log(data);
            console.log(status);
            console.log(err);
            return;

        }
    });

}


/*우편번호*/
function fnDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                fullAddr = data.roadAddress;

            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                fullAddr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            if (data.userSelectedType === 'R') {
                //법정동명이 있을 경우 추가한다.
                if (data.bname !== '') {
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if (data.buildingName !== '') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            //$('#divAgZipcd').text(data.zonecode);//5자리 새우편번호 사용
            $('#txtZipcd').val(data.zonecode);

            //$('#divAgAddr1').text(fullAddr);
            $('#txtAddr1').val(fullAddr);

            // 커서를 상세주소 필드로 이동한다.
            $('#txtAddr2').val("");
            document.getElementById('txtAddr2').focus();
            //type = 1 : 대표자 기본정보 우편번호

        }
    }).open();
}