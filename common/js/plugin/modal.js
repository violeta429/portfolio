//function fnopenmodal(type) {
//    // Get the modal
//    var modal = document.getElementById("divVirtModal");

//    // Get the button that opens the modal
//    var btn = document.getElementById("checkBtn");

//    // Get the <span> element that closes the modal
//    var input = document.getElementsByClassName("close")[0];

//    // When the user clicks the button, open the modal 
//    btn.onclick = function () {
//        modal.style.display = "block";
//    }

//    // When the user clicks on <span> (x), close the modal
//    input.onclick = function () {
//        modal.style.display = "none";
//    }
//}

/*모달창 만들기*/
function fnShowModal(id) {

    var zIndex = 9999;
    var modal = $('#' + id);

    // 모달 div 뒤에 희끄무레한 레이어
    var bg = $("<div id=bg>").css({
        position: 'fixed',
        zIndex: zIndex,
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        // 레이어 색갈은 여기서 바꾸면 됨
        backgroundColor: 'rgba(0,0,0,0.2)'
    }).appendTo('body');


    modal
        .css({
            position: 'fixed',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

            // 시꺼먼 레이어 보다 한칸 위에 보이기
            zIndex: zIndex + 1,

            // div center 정렬
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            msTransform: 'translate(-50%, -50%)',
            webkitTransform: 'translate(-50%, -50%)'
        })
        .show()
        // 닫기 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
        .find('.modal-close').on('click', function () {
            bg.remove();
            modal.hide();
        });
}



/*confirm 모달창 생성*/
function fnConfirmModal(content) {
    $("#confirmContent").html();
    $("#confirmContent").html(content); 
    fnShowModal("confirmModal");

}

/*alert 모달창 생성*/
function fnAlertModal(content) {
    $("#alertContent").html(content);
    fnShowModal("alertModal");
}

/*select 모달창 생성*/
function fnSelectModal(content) {
    fnShowModal("selectModal");
}




////정의
//function confirmModal(content, callback) {

//    $("#confirmContent").text(content);
//    fnShowModal("confirmModal");

//    $('#confirmOK').off().on("click", function () {
//        callback(true);
//        $("#confirmModal").hide();
//        $("#bg").hide();
//    });

//    $('#confirmCancle').off().on("click", function () {
//        callback(false);
//        $("#confirmModal").hide();
//        $("#bg").hide();
//    });



//};

////호출
//function fnConfirmModal(content) {

//    confirmModal(content, function (v) {
//        console.log(v); //무한루프
//        return v; //무한루프
//    });

//}

