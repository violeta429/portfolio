

$(function () {

//전체카테고리
var $allcategory = $('.allCategory');
var $nav_btn = $('.cate_btn');
var $sub_cate = $('.allCate-list');
var $close_nav = $('.close_btn');


$nav_btn.on('click', function (e) {
    e.preventDefault();
    $allcategory.toggleClass('on');
    $sub_cate.slideToggle(400);

});


$close_nav.on('click', function () {
    $allcategory.removeClass('on');
    $sub_cate.slideUp(400);
});


//카테고리 depth
/* lnb */ (function ($) {
var lnbUI = {
    click: function (target, speed) {
        var _self = this, $target = $(target); _self.speed = speed || 300;
        $target.each(function () { if (findChildren($(this))) { return; } $(this).addClass('noDepth'); });
        function findChildren(obj) { return obj.find('> ul').length > 0; }

        $target.on('click', 'span', function (e) {
            e.stopPropagation();
            var $this = $(this),
            $depthTarget = $this.next(),
            $siblings = $this.parent().siblings();
            $siblings.parent('li').find('ul li').removeClass('on');
            $this.parent('li').find('ul li').removeClass('on');
            $siblings.removeClass('on');

            $siblings.find('ul').slideUp(250);

            if ($depthTarget.css('display') == 'none') {
                _self.activeOn($this);
                $depthTarget.slideDown(_self.speed);
            } else { $depthTarget.slideUp(_self.speed); _self.activeOff($this); }
        })
    },
    activeOff: function ($target) {
        $target.parent().removeClass('on');
    },
    activeOn: function ($target) { $target.parent().addClass('on'); }
};
// Call lnbUI 
$(function () { lnbUI.click('#ulMasterCategory .sub-category2 li ', 300) });
}(jQuery));





    //카테고리 depth
    /* lnb */ (function ($) {
        var lnbUI = {
            click: function (target, speed) {
                var _self = this,
                  $target = $(target);
                  _self.speed = speed || 300;

                $target.each(function () {

                    if (findChildren($(this))) {
                        return;
                    }

                    $(this).addClass('noDepth');
                });

                function findChildren(obj) {
                    return obj.find('ul').length > 0;
                }

                $target.on('click', '.arrowDowm', function (e) {
                    e.stopPropagation();
                    var $this = $(this),

                    $depthTarget = $this.next().find('ul'),
                    $siblings = $this.siblings();

                    $siblings.find('ul li').removeClass('on');
                    $this.find('ul li').removeClass('on');
                    $siblings.removeClass('on');

                    $siblings.find('ul').slideUp(250);

                    if ( $depthTarget.css('display') == 'none') {
                        _self.activeOn($this);
                        $depthTarget.slideDown(_self.speed);
                    } else { $depthTarget.slideUp(_self.speed); _self.activeOff($this); }
                })
            },
            activeOff: function ($target) {
                $target.parent().removeClass('on');
            },
            activeOn: function ($target) { $target.parent().addClass('on'); }
        };
        // Call lnbUI 
        $(function () { lnbUI.click('#ulMasterCategory_M .cate_wrap', 300) });
    }(jQuery));
























 //사이드 네비게이션
var currentPosition = parseInt($("#slidemenu").css("top"));
$(window).scroll(function () {
    var position = $(window).scrollTop(); // 현재 스크롤바의 위치값을 반환합니다.
    $("#slidemenu").stop().animate({ "top": position + currentPosition + "px" }, 1500);
});


$('.gotop').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, 1000);
});

menuState = false

// 모바일 gnb열린 후 창 크게했을때 스크롤바 생성
$(window).resize(function () {
    var win_width = $(window).outerWidth();
    if (menuState) {
        if (win_width > 1200) {
            $("body").css({ 'height': 'auto', 'overflow': 'auto' });
        }
    }
});
    


    /* 탑버튼 */

jQuery(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#go-top').fadeIn(500);
        } else {
            $('#go-top').fadeOut('slow');
        }
    });
    $('#go-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 200);
    });
});


    var mobile_nav = $('.mobile_nav');


//모바일
$(' .menu_btn').on('click', function () {
    mobile_nav.show();
    //모바일 네비게이션 보일 때 body 스크롤 막기
    if (mobile_nav.css('display') === 'block') {
        $('body').css({ 'height': '100vh', 'overflow': 'hidden' });

    } else {
           
    }
})
$('.nav_close').on('click', function () { 
    mobile_nav.hide();

    //모바일 네비게이션 보일 때 body 스크롤 auto
    if (mobile_nav.css('display') === 'none') {
        $('body').css({ 'height': 'unset', 'overflow': 'auto' });
    } 

})


    //모바일 화면 상단으로


var btn = $('#mob_go_top');
var deviceHt = $(window).innerHeight();

$(window).scroll(function () {
    if ($(window).scrollTop() > deviceHt / 1.3) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});


btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
});


$('.bt-search a').on('click', function (e) {
    e.preventDefault();
    $('.mob_search').toggleClass('show')
});

 
})  


       