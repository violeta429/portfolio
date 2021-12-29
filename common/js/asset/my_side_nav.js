
$(function () {

     //사이드 네비게이션 class추가
   
    var nowurl = window.location.pathname;
    var linkList = $(".mypage_nav >div ul:not(.user_wrap) li a");

    var nowurl = window.location.href;
    if (nowurl == '') {
        nowurl = 'view/mypage/mypage.aspx';
    }

    linkList.each(function () {
        if (this.href === nowurl) {
            $(this).parent().addClass('is-current');
        }
    });


})