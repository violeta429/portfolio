var targetUrl = "/common/component/member/AjaxLogin.aspx";
var targetJoinUrl = "/common/component/member/AjaxJoin.aspx";


$(document).ready(function () {
    $("#txtPw").keydown(function (key) {
        if (key.keyCode == 13) {
            fnLogin('', 'A');
        }
    });

    //$("#divGoogle").on("click", function () {
    //    $(".abcRioButtonContentWrapper").trigger("click");
    //});
});

//로그인
function fnLogin(id, type) {
    var pw = "";
    if(type == "A"){ //일반로그인
        id = $("#txtId").val();
        pw = $("#txtPw").val();
    }

    var saveYn = "N";
    if (type == "A") {
        if ($("input:checkbox[id='chkSaveYn']").is(":checked") == true) {
            saveYn = "Y";
        }
    }

    if (type == "A") {
        if (id == "") { alert("아이디를 입력해주세요"); return; }
        if (pw == "") { alert("비밀번호를 입력해주세요"); return; }
    }



    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();
    bObj.id = id;
    bObj.pw = pw;
    bObj.saveYn = saveYn;
    bObj.type = type;
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
            //$("#loading_0").show();
        },
        success: function (data) {
            $("#loading_0").hide();
            console.log(data);

            var result = data.RESULT;
            if (result == "Y") {
                location.href = "/view/main.aspx";
            } else {
                alert("로그인 실패하였습니다.");
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


/*간편 로그인시 회원가입 되어있는지 확인*/
function fnCheckInfo(id, name, type) {


    var hArr = new Array();
    var hObj = new Object();
    hObj.type = "01";
    hArr.push(hObj);

    var bArr = new Array();
    var bObj = new Object();

    bObj.type = "id";
    bObj.value = id;
    bArr.push(bObj);

    var totObj = new Object();
    totObj.header = hArr;
    totObj.body = bArr;

    $.ajax({
        method: "post",
        url: targetJoinUrl,
        data: JSON.stringify(totObj),
        dataType: "json",
        success: function (data) {

            console.log(data);

            if(data == null|| data.RESULT == "Y"){
                //회원가입 이동
                alert("회원가입페이지로 이동합니다.");
                fnMoveJoin(id, name, type);

                return;
            }

            fnLogin(id, type);


        },
        error: function (data, status, err) {
            alert("서버와의 통신이 실패하였습니다."); //서버와의 통신이 실패했습니다
            console.log(data);
            console.log(status);
            console.log(err);
            return;
        }
    });

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



//function onSignIn(googleUser) {
//    // 프로필 가져오기
//    var profile = googleUser.getBasicProfile();

//    var id = profile.getId();
//    var name = profile.getName();

//    //키 얻고나서 바로 로그아웃
//    var auth2 = gapi.auth2.getAuthInstance();
//    auth2.signOut().then(function () {
//    });

//    fnCheckInfo(id, name, 'G');
//}
//function onLoad() {
//    gapi.load('auth2,signin2', function () {
//        var auth2 = gapi.auth2.init();
//        auth2.then(function () {
//            // 로그인 객체 가져오기
//            var isSignedIn = auth2.isSignedIn.get();
//            // 접속되어 있는 유저
//            var currentUser = auth2.currentUser.get();
//            gapi.signin2.render('googleSigninButton', {
//                'onsuccess': 'onSignIn', // 로그인이 되면 onSignIn 함수를 호출한다.
//                'longtitle': true,
//                'theme': 'dark',
//                'width': '0'
//            });
//        });
//    });
//}


////페이스북로그인
//window.fbAsyncInit = function () {
//    FB.init({
//        appId: "1178327619339636",
//        cookie: true,  // enable cookies to allow the server to access 
//        // the session
//        xfbml: true,  // parse social plugins on this page
//        version: 'v6.0' // use graph api version 2.8
//    });
//};

//(function (d, s, id) {
//    var js, fjs = d.getElementsByTagName(s)[0];
//    if (d.getElementById(id)) return;
//    js = d.createElement(s); js.id = id;
//    js.src = "https://connect.facebook.net/en_US/sdk.js";
//    fjs.parentNode.insertBefore(js, fjs);
//}(document, 'script', 'facebook-jssdk'));


//function fb_login() {
//    FB.login(function () {

//        FB.api('/me', { fields: 'id, name' }, function (response) {
//            var id = response.id;
//            var name = response.name;

//            if ((id != null) && (id != '')) {
//                fnCheckInfo(id, name, "F");

//                //페북 로그아웃
//                FB.logout(function (response) {

//                });
//            }
//        });
//        FB.init({
//            appId: "1178327619339636",
//            cookie: true,  // enable cookies to allow the server to access 
//            // the session
//            xfbml: true,  // parse social plugins on this page
//            version: 'v6.0' // use graph api version 2.8
//        });
//    }, { scope: 'email,public_profile' });
//}