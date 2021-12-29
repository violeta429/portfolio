var targetUrl = "/common/component/member/AjaxJoin.aspx";
var idFg = "N"; //ID중복확인
var mobileFg = "N"; //전화번호 중복확인


//페이지로드시
$(document).ready(function () {

    var referrer = document.referrer;


    //아이디 : 영어, 숫자만 입력가능하도록
    $("#ContentPlaceHolder1_txtId").keyup(function (event) {
        idFg = "N";
        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
            var inputVal = $(this).val();
            $(this).val(inputVal.replace(/[^a-z0-9]/gi, ''));
        }
    });
    //이름 : 이름 한글 또는 영어로만 입력하도록 처리 (띄어쓰기가능)
    $("#ContentPlaceHolder1_txtName").keyup(function (event) {
        var inputVal = $(this).val();
        inputVal = inputVal.replace(/[^가-힣ㄱ-ㅎa-zA-Z\s]+$/gi, '').replace(/\'/gi, '');
        $(this).val(inputVal);
    });

    ////소셜 로그인 시
    //if ($("#hidType").val() != 'A') {

    //    //아이디, 비번, 이름 셋팅
    //    $("#txtId").val($("#hidBid").val());
    //    idFg = "y";
    //    $("#txtPw").val("");
    //    $("#txtPw2").val("");
    //    $("#txtname").val($("#hidName").val());


    //    $("#divSimpleLogin").hide();

    //    //아이디 비밀번호 유효성검사 통과
    //    idFg = "Y"; //아이디 중복검사 여부
    //    checkId = "Y"; //아이디 유효성검사 결과
    //    checkPw = "Y"; //비밀번호 유효성검사 결과
    //    checkPwEqual = "Y"; //비밀번호 확인 유효성검사 결과
    //}
});

//아이디, 전화번호 중복확인
function fnDupCheck(type) {
    var value = "";

    if (type == "id") {
        value = $("#ContentPlaceHolder1_txtId").val();
    }
    else if (type == "mobile") {
        value = $("#txtMobile1").val() + $("#txtMobile2").val() + $("#txtMobile3").val();
        if (value.length != 11) { alert("전화번호 11자리를 정확히 입력해주세요"); return;}
    }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.type = type;
    bObj.value = value;
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
            //console.log(JSON.stringify(totObj));
        },
        success: function (data) {
            $("#loading_0").hide();

            console.log(data);

            var result = data.RESULT;
            var msg = "";

            if (result == "Y") {
                if (type == "id") {
                    msg = "등록가능한 아이디입니다.";
                    idFg = "Y";
                }
                else if (type == "mobile") {
                    msg = "등록가능한 전화번호입니다.";
                    mobileFg = "Y";
                }

            } else {
                if (type == "id") {
                    msg = "이미 가입된 아이디입니다.";
                    idFg = "N";
                }
                else if (type == "mobile") {
                    msg = "이미 가입된 전화번호입니다.";
                    mobileFg = "N";
                }
            }

            alert(msg);

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

//회원등록
function fnRegit() {

    var regType = $("#ContentPlaceHolder1_hidRegType").val();

    var id = $("#ContentPlaceHolder1_txtId").val();
    var pw = $("#txtPw").val();
    var pw2 = $("#txtPw2").val();
    var name = $("#ContentPlaceHolder1_txtName").val();
    var mobile = $("#txtMobile1").val() + $("#txtMobile2").val() + $("#txtMobile3").val();
    var zipcd = $("#txtZipcd").val();
    var addr1 = $("#txtAddr1").val();
    var addr2 = $("#txtAddr2").val();
    var addrYn = "N"; //기본배송지저장여부
    if ($("#chkAddr").is(":checked") == true) {
        addrYn = "Y";
    }

    //유효성검사
    if (regType == "A") {
        if (id == "") { alert("아이디를 입력해주세요"); return; }
        if (idFg != "Y") { alert("아이디 중복확인을 해주세요"); return; }
        if (pw == "") { alert("비밀번호를 입력해주세요"); return; }
        if (pw.length < 8 || pw.length > 20) {
            alert('비밀번호가 올바르지 않습니다.(8자 이상, 20자 이하이고 영문, 숫자, 특수문자 포함된 문자열로 구성되어야 합니다.)');
            return;
        }
        //비밀번호 유효성검사
        var patt = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}/;
        if (!patt.test(pw)) {
            console.log(patt.test(pw));
            alert('비밀번호가 올바르지 않습니다.(8자 이상, 20자 이하이고 영문, 숫자, 특수문자 포함된 문자열로 구성되어야 합니다.)');
            return;
        }
        if (pw == "") { alert("비밀번호 확인을 입력해주세요"); return; }
        if (pw != pw2) { alert("비밀번호와 비밀번호 확인이 일치하지 않습니다."); return; }
    }

   
    if (name == "") { alert("이름을 입력해주세요"); return; }
    if (mobile.length != 11) { alert("전화번호 11자리를 정확히 입력해주세요"); return; }
    if (mobileFg != "Y") { alert("전화번호 중복확인을 해주세요"); return; }
    if (addrYn == "Y") {
        if (zipcd == "") { alert("주소찾기 버튼을 클릭하여 기본배송지로 저장할 주소를 검색해주세요"); return; }
        if (addr2 == "") { alert("상세주소를 입력해주세요"); return; }
    }

    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "02";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.id = id;           //아이디
    bObj.pw = pw;           //비밀번호
    bObj.name = name;       //이름
    bObj.mobile = mobile;   //전화번호
    bObj.zipcd = zipcd;     //우편번호
    bObj.addr1 = addr1;     //주소
    bObj.addr2 = addr2;     //상세주소
    bObj.addrYn = addrYn;   //기본배송지저장여부(Y/N)
    bObj.regType = regType; //가입유형(A:일반/G:구글/F:페이스북)
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

            if (result == "Y") {
                location.href = "/view/member/join_result.aspx";
            }
            else if (result == "N") {
                alert("회원가입에 실패하였습니다.");
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

//중복검사 다시
function fnDupAgain(type) {
    if (type == "id") { idFg = "N"; }
    else if (type == "mobile") { mobileFg = "N"; }
}



//주소찾기
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
            //type = 0 : 가맹점 기본정보 우편번호

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            //$('#divAgZipcd').text(data.zonecode);//5자리 새우편번호 사용
            $('#txtZipcd').val(data.zonecode);

            //$('#divAgAddr1').text(fullAddr);
            $('#txtAddr1').val(fullAddr);

            // 커서를 상세주소 필드로 이동한다.
            document.getElementById('txtAddr2').focus();
            //type = 1 : 대표자 기본정보 우편번호

        }
    }).open();
}