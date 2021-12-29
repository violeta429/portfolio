
$(function () {

    //사이드 네비게이션 class추가

    var nowurl = window.location.pathname;
    var linkList = $(".cslink_tab li a");

    var nowurl = window.location.href;

    if (nowurl.match('qnaedit.aspx')) {
        var linkList = $(".cslink_tab li:last-of-type").addClass('on');
    }

    if (nowurl.match('qnaDetail.aspx')) {
        var linkList = $(".cslink_tab li:last-of-type").addClass('on');
    }


    if (nowurl.match('cscenter_detail.aspx')) {
        var linkList = $(".cslink_tab li:first-of-type").addClass('on');
    }

    linkList.each(function () {

        if (this.href === nowurl) {
            $(this).parent().addClass('on');
        }
    });


})