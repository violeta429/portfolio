
$(function () {
    $("input[type=checkbox]").change(function () {
        var chkId = $(this).attr('id');
        if (chkId == "chkAll") {
            if ($("#chkAll").prop("checked")) {
                $("input[type=checkbox]").prop("checked", true);
            }
            else {
                $("input[type=checkbox]").prop("checked", false);
            }
        }
        else {
            if ($("#chk1").prop("checked") && $("#chk2").prop("checked")) {
                $("#chkAll").prop("checked", true);
            }
            else {
                $("#chkAll").prop("checked", false);
            }
        }
    });
})

function fnMove() {
    if ($("#chk1").prop("checked") && $("#chk2").prop("checked")) {

        var destPath = "/view/member/join.aspx";
        var member = $("#ContentPlaceHolder1_hidMember").val();

        post_to_url(destPath, {
            "member": member
        });
    }
    else {
        alert("이용약관에 동의하셔야 다음 단계로 진행 가능합니다.");
    }

}


/*POST 방식으로 값 가지고 페이지 이동*/
function post_to_url(path, params) {

    try {
        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기 

        if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
            //ios 일때 처리 
            //ios에서는 페이지이동 후 history back으로 뒤로갔을 때 로딩모달창이 남아있기 때문에 숨겨주는 것 까지 
            $("#loading_0").show();





            var form = document.createElement("form");
            form.setAttribute("method", 'post');
            form.setAttribute("action", path);

            for (var key in params) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
            document.body.appendChild(form);

            form.submit();





            setTimeout(function () {
                $("#loading_0").hide();
            }, 3000);

        }
        else {
            $("#loading_0").show();


            var form = document.createElement("form");
            form.setAttribute("method", 'post');
            form.setAttribute("action", path);

            for (var key in params) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
            document.body.appendChild(form);

            form.submit();




            return;
        }
    }
    catch (e) {
        alert(e);
    }





}


