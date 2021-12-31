
$(document).ready(function () {


    //  메인 화면에서 배너영역 넘지않는 사이드메뉴
    var bnHeight = $('.mainBanner').height();
    $("#slidemenu").css({ "top": bnHeight });
    var currentPosition = parseInt($("#slidemenu").css("top"));
    $(window).scroll(function () {
        var position = $(window).scrollTop(); // 현재 스크롤바의 위치값을 반환.
    if (position < bnHeight) { position = bnHeight; }    //현재 스크롤의 위치가 배너 영역보다 작을 시에 슬라이드 top 을  배너 크기만큼 
        $("#slidemenu").stop().animate({ "top": position + 20 + "px" }, 1000);
    });


    //상단 배너   PC
    var swiper = new Swiper('.pc .swiper-container', {
        spaceBetween: 6,
        centeredSlides: true,
        autoHeight: true,
        autoplay: {
            delay: 8000,
            disableOnInteraction: true,
        },
        loop: true,
        pagination: false,
        resistance: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        watchOverflow: true,  //슬라이드가 한개일때 page ,button숨김 여부 
    });

    //배너 시작 재생 버튼


    $('.stop_btn').on('click', function () {
        swiper.autoplay.stop();
        $(this).hide();
        $('.play_btn').show();
    });


    $('.play_btn').on('click', function () {
        swiper.autoplay.start();
        $(this).hide();
        $('.stop_btn').show();
    })


    var swiper = new Swiper('.mob .swiper-container', {
        spaceBetween: 6,
        centeredSlides: true,
        autoHeight: true,
        autoplay: {
            delay: 8000,
            disableOnInteraction: false,
        },
        loop: true,
        pagination: false,
        resistance: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        watchOverflow: true,  //슬라이드가 한개일때 page ,button숨김 여부 
    });


   






    // $('.sec2_Wrap .sec2cont').bxSlider();



    //4번쨰 section   sec4_cont

    var swiper2 = new Swiper('.sec4_inner', {
        spaceBetween: 50,
        centeredSlides: true,
        autoHeight: false,
        loop: true,
        pagination: false,
        resistance: false,
        navigation: {
            nextEl: '.slide_btn .next',
            prevEl: '.slide_btn .prev',
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },

        watchOverflow: true,  //슬라이드가 한개일때 page ,button숨김 여부 
    });


    //fnBestseller(); //베스트셀러
    // fnMdPick(); //MD PICK
    // fnNew(); //신상
    // fnTrend(); //트렌드픽
    // fnIssue(); //이슈픽

    var innerWidth = window.innerWidth;
    if (innerWidth < 768) {
        imgresize('.sec3_inner');
    }
});//end doc ready

//MD_PICK
$(document).on('click', '.thumbs a', function (e) {
    var enableClick = true;
    e.preventDefault();
    var $explanTxt = $('.explan > div');
    //아이디가 id 인거를 'click', 클릭할때마다 이벤트가 일어난다.


    var isOn = $(this).hasClass("selected");
    if (isOn) return;


    var picture = $(this).data();

    //2 - 처음 버튼을 클릭하면 eableclick= true여서 조건문안의 함수가 호출이 됨
    var i = $(this).parent('div').index();
    imgFade(i);
    $(".thumbs a").removeClass("selected");
    $(this).addClass("selected");


    function imgFade(index) {
        $explanTxt.removeClass('on');
        $explanTxt.eq(index).addClass('on');

        $(".full img").fadeOut(60, function () {
            $(".full img").attr("src", picture.full);
        }).fadeIn(150, function () {

        });

        $('.triarrow').css({ 'top': i * 160 + 50 });

    }
});




window.onresize = function (event) {
    if (innerWidth < 768) {
        imgresize('.sec3_inner');
        imgresize('.sec2_Wrap');
        
    } else {
        return;
    }
}



function imgresize(targetpa) {
    var imgWrap = $(targetpa).find('.imgWrap');
    imgWid = imgWrap.width();
    imgWrap.height(imgWid);
}



var url = "https://violeta429.github.io/portfolio/common/data/mainproduct.json"
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200)
    {
       try{
        fnBestseller(xmlhttp.responseText);
       }
       catch(e){
        console.log('error')

       }
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();


// BEST SELLER

function fnBestseller(data) {
    var arr = JSON.parse(data);

    var sHtml = "";
    for (var i = 0 ; i < arr.length;  i++){
       sHtml += '<div class="c_area">' ;
       sHtml +=     '<a href="https://violeta429.github.io/portfolio/view/product/product_detail.html?pid='+ arr[i].page   +'">';
       sHtml +=         '<div class="pd_img">';
       sHtml +=           '<img src="https://violeta429.github.io/portfolio/common/image/main/product/00' + arr[i].img + '.jpg">'  ;
       sHtml +=         '</div>';
       sHtml +=         '<div class="pd_txt">';
       sHtml +=           '<h4 class="pd_tit">'+ arr[i].name +'</h4>';
       sHtml +=           '<div class="icon_area">';
       if (arr[i].new=="Y"){
       sHtml +=              '<span class="new">NEW</span>';
       }
      if (arr[i].best=="Y"){
        sHtml +=              '<span class="best">BEST</span>';
      }
      if (arr[i].popularity=="Y"){
        sHtml +=              '<span class="popularity">인기</span>';   
      }


       sHtml +=           '</div>';
       sHtml +=          '<div class="price">';
       sHtml +=              ' <span class="price_n">'+ arr[i].price+ '원</span>';
       if (arr[i].delprice==null ){
       }else{

       sHtml +=              ' <span class="delprice">'+ arr[i].delprice+ '원</span>';

       }
       sHtml +=          '</div>';
       sHtml +=         '</div>';
       sHtml +=      '</a>';
       sHtml += ' </div>';

    }

   
     $("#divBestSeller").html(sHtml);
     slickBestseller();
}


function slickBestseller(){
  //  section 1에 캐로셀 이미지 옵션 

    $('#divBestSeller').slick({
        slide: 'div',
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: true,
        prevArrow: $('.left_prev'),
       nextArrow: $('.right_next'),
        slidesToShow: 3,
        responsive: [ // 반응형 웹 구현 옵션
   
            {
                breakpoint: 768, //화면 사이즈 768px
                settings: {
                    slidesToShow: 3
                },
                draggable: true,
            },
   
   
            {
                breakpoint: 580,// 화면 사이즈 768px
                settings: {
                    slidesToShow: 2
                },
                draggable: true,
            }
        ]
    });

}







// //MD'S PICK
// function fnMdPick() {
//     try {

//         var hArr = new Array();
//         var hObj = new Object();
//         hObj.type = "02";
//         hArr.push(hObj);

//         var bArr = new Array();
//         var bObj = new Object();
//         bArr.push(bObj);

//         var totObj = new Object();
//         totObj.header = hArr;
//         totObj.body = bArr;

//         $.ajax({
//             method: "post",
//             url: targetUrl,
//             data: JSON.stringify(totObj),
//             dataType: "json",
//             beforeSend: function () {
//                 //로딩 창 출력X

//             },
//             success: function (data) {
//                 var result = data.RESULT; //통신결과

//                 if (data == null || data.RESULT == "N" || data.DATA.length == 0) { //에러 또는 데이터 없을때 아무 처리안함
//                     return;
//                 }


//                 var allData = data.DATA;

//                 var sHtml_list = "";
//                 var sHtml_content = "";
//                 for (var i = 0; i < allData.length; i++) {
//                     //좌측 이미지리스트
//                     sHtml_list += "<div class='preview'> ";
//                     if (i == 0) {
//                         sHtml_list += "<a href='#' class='selected'  data-full='" + allData[i]["FILEURL"] + "'> <img src='" + allData[i]["FILEURL"] + "'/> </a> ";
//                     }
//                     else {
//                         sHtml_list += "<a href='#' data-full='" + allData[i]["FILEURL"] + "'> <img src='" + allData[i]["FILEURL"] + "'/> </a> ";
//                     }

//                     sHtml_list += "</div>";

//                     //우측 컨텐츠                    
//                     if (i == 0) {
//                         $("#imgMdPick").attr("src", allData[i]["FILEURL"])
//                         sHtml_content += "   <div class='on cont_area'>";
//                     }
//                     else {
//                         sHtml_content += "   <div class='cont_area'>";

//                     }
//                     sHtml_content += "        <div >";
//                     sHtml_content += "           <h2 class='pd_sub_tit'>" + allData[i]["TITLE"] + "</h2>";
//                     sHtml_content += "           <h2 class='pd_tit'>" + allData[i]["PNM"] + "</h2>";
//                     sHtml_content += "           <p class='pd_info'>" + allData[i]["DESCRIPTION"] + "</p>";
//                     sHtml_content += "            <span class='shop_btn'><a href='/view/product/product_detail.aspx?pid=" + allData[i]["PID"] + "'>SHOP NOW</a></span>";
//                     sHtml_content += "        </div>";
//                     sHtml_content += "    </div>";


//                 }

//                 $("#divMdPick_list").html(sHtml_list);
//                 $("#divMdPick_content").html(sHtml_content);


//             },
//             error: function (data, status, err) {

//                 return;
//             }
//         });


//     }
//     catch (e) {

//     }




// }


// //NEW ARRIVALS
// function fnNew() {
//     try {

//         var hArr = new Array();
//         var hObj = new Object();
//         hObj.type = "03";
//         hArr.push(hObj);

//         var bArr = new Array();
//         var bObj = new Object();
//         bArr.push(bObj);

//         var totObj = new Object();
//         totObj.header = hArr;
//         totObj.body = bArr;

//         $.ajax({
//             method: "post",
//             url: targetUrl,
//             data: JSON.stringify(totObj),
//             dataType: "json",
//             beforeSend: function () {
//                 //로딩 창 출력X

//             },
//             success: function (data) {
//                 var result = data.RESULT; //통신결과

//                 if (data == null || data.RESULT == "N" || data.DATA.length == 0) { //에러 또는 데이터 없을때 아무 처리안함
//                     return;
//                 }


//                 var allData = data.DATA;

//                 var sHtml = "";

//                 for (var i = 0; i < allData.length; i++) {
//                     sHtml += "<div>";
//                     sHtml += "   <img src='" + allData[i]["FILEURL"] + "'/>";
//                     sHtml += "   <div >";
//                     sHtml += "      <h4 class='tit_deco pd_tit'>" + allData[i]["PNM"] + "</h4>";
//                     sHtml += "      <p class='pd_info'>" + allData[i]["SUMMARY"] + "</p>";
//                     sHtml += "      <div class='price'>";
//                     sHtml += "         <span class='price_n'>" + allData[i]["AMT"] + "</span>";
//                     sHtml += "      </div>";
//                     sHtml += "      <div class='icon_area'>";
//                     sHtml += "         <span class='best'>BEST</span>";
//                     sHtml += "         <span class='new'>NEW</span>";
//                     sHtml += "      </div>";
//                     sHtml += "   </div>";
//                     sHtml += "</div>";
//                 }
//                 $("#divNew").html(sHtml);

//             },
//             error: function (data, status, err) {

//                 return;
//             }
//         });


//     }
//     catch (e) {

//     }




// }

// //Trend PICK
// function fnTrend() {
//     try {

//         var hArr = new Array();
//         var hObj = new Object();
//         hObj.type = "04";
//         hArr.push(hObj);

//         var bArr = new Array();
//         var bObj = new Object();
//         bArr.push(bObj);

//         var totObj = new Object();
//         totObj.header = hArr;
//         totObj.body = bArr;

//         $.ajax({
//             method: "post",
//             url: targetUrl,
//             data: JSON.stringify(totObj),
//             dataType: "json",
//             beforeSend: function () {
//                 //로딩 창 출력X

//             },
//             success: function (data) {
//                 var result = data.RESULT; //통신결과

//                 console.log(data)

//                 if (data == null || data.RESULT == "N" || data.DATA.length == 0) { //에러 또는 데이터 없을때 아무 처리안함
//                     return;
//                 }


//                 var allData = data.DATA;

//                 var sHtml = "";
//                 for (var i = 0; i < allData.length; i++) {
//                     sHtml += "	<div class='swiper-slide'>";
//                     sHtml += "          <div class='sec4_slide'>";
//                     sHtml += "                <div class='imgarea' style='background:url(" + allData[i]["FILEURL"] + ") no-repeat center center; background-size:cover;'></div>";
//                     sHtml += "                <div class='txt'>";
//                     sHtml += "                    <div onclick='fnMove(\"sdf\")' >";
//                     sHtml += "                           <h2 class='title' >TREND PICK</h2>";
//                     sHtml += "                          <p class='sub_info'>요즘 유행하는 잇템들만 모아모아!</p>";
//                     sHtml += "                          <p class='pd_tit'>" + allData[i]["PNM"] + "</p>";
//                     sHtml += "                          <p class='pd_info'>" + allData[i]["DESCRIPTION"] + "</p>";
//                     sHtml += "                    </div>";
//                     sHtml += "                </div>";
//                     sHtml += "          </div>";
//                     sHtml += "   </div>";
//                 }

//                 $("#divTrend").html(sHtml);


//             },
//             error: function (data, status, err) {

//                 return;
//             }
//         });


//     }
//     catch (e) {

//     }




// }


// //Issue PICK
// function fnIssue() {
//     try {

//         var hArr = new Array();
//         var hObj = new Object();
//         hObj.type = "05";
//         hArr.push(hObj);

//         var bArr = new Array();
//         var bObj = new Object();
//         bArr.push(bObj);

//         var totObj = new Object();
//         totObj.header = hArr;
//         totObj.body = bArr;

//         $.ajax({
//             method: "post",
//             url: targetUrl,
//             data: JSON.stringify(totObj),
//             dataType: "json",
//             beforeSend: function () {
//                 //로딩 창 출력X

//             },
//             success: function (data) {
//                 var result = data.RESULT; //통신결과

//                 if (data == null || data.RESULT == "N" || data.DATA.length == 0) { //에러 또는 데이터 없을때 아무 처리안함
//                     return;
//                 }
//                 console.log(data);


//                 var allData = data.DATA;

//                 var sHtml_li = "";
//                 var sHtml_content = "";
//                 for (var i = 0; i < allData.length; i++) {
//                     //li
//                     if (i == 0) {
//                         sHtml_li += "<li class='active'>" + allData[i]["TITLE"] + "</li>";
//                     }
//                     else {
//                         sHtml_li += "<li>" + allData[i]["TITLE"] + "</li> ";
//                     }


//                     //컨텐츠                    
//                     sHtml_content += "<div class='tabInner'>";
//                     sHtml_content += "	<div class='pdarea fl'>";
//                     sHtml_content += "		<span> <img src='" + allData[i]["FILEURL"] + "'/></span>";
//                     sHtml_content += "		<div class='txtWrap'>";
//                     sHtml_content += "		    <p>" + allData[i]["TITLE"] + "</p>";
//                     sHtml_content += "		    <p>" + allData[i]["DESCRIPTION"] + "</p>";
//                     sHtml_content += "		</div>";
//                     sHtml_content += "	</div>";
//                     sHtml_content += "	<div class='pdarea pdWrap2'>";

//                     if (allData[i]["PID1"]["PID"] != "") {
//                         sHtml_content += "		<div onclick='location.href=\"/view/product/product_detail.aspx?pid=" + allData[i]["PID1"]["PID"] + "\"'>";
//                         sHtml_content += "			<img src='" + allData[i]["PID1"]["FILEURL"] + "'/>";
//                         sHtml_content += "			<div >";
//                         sHtml_content += "				<h4 class='tit_deco pd_tit'>" + allData[i]["PID1"]["PNM"] + "</h4>";
//                         sHtml_content += "				<p class='pd_info'>" + allData[i]["PID1"]["SUMMARY"] + "</p>";
//                         sHtml_content += "				<div class='price'>";
//                         sHtml_content += "					<span class='price_n'>" + allData[i]["PID1"]["AMT_SALE"] + "</span>";
//                         sHtml_content += "				</div>";
//                         sHtml_content += "				<div class='icon_area'>";
//                         sHtml_content += "					<span class='best'>BEST</span>";
//                         sHtml_content += "					<span class='new'>NEW</span>";
//                         sHtml_content += "				</div>";
//                         sHtml_content += "			</div>";
//                         sHtml_content += "		</div>";
//                     }
//                     if (allData[i]["PID2"]["PID"] != "") {
//                         sHtml_content += "		<div onclick='location.href=\"/view/product/product_detail.aspx?pid=" + allData[i]["PID2"]["PID"] + "\"'>";
//                         sHtml_content += "			<img src='" + allData[i]["PID2"]["FILEURL"] + "'/>";
//                         sHtml_content += "			<div >";
//                         sHtml_content += "				<h4 class='tit_deco pd_tit'>" + allData[i]["PID2"]["PNM"] + "</h4>";
//                         sHtml_content += "				<p class='pd_info'>" + allData[i]["PID2"]["SUMMARY"] + "</p>";
//                         sHtml_content += "				<div class='price'>";
//                         sHtml_content += "					<span class='price_n'>" + allData[i]["PID2"]["AMT_SALE"] + "</span>";
//                         sHtml_content += "				</div>";
//                         sHtml_content += "				<div class='icon_area'>";
//                         sHtml_content += "					<span class='best'>BEST</span>";
//                         sHtml_content += "					<span class='new'>NEW</span>";
//                         sHtml_content += "				</div>";
//                         sHtml_content += "			</div>";
//                         sHtml_content += "		</div>";
//                     }
//                     sHtml_content += "	</div>";
//                     sHtml_content += "</div>";
//                 }

//                 console.log(sHtml_li)
//                 $("#ulIssue").html(sHtml_li);
//                 $("#divIssue").html(sHtml_content);
                

//                 tabshow($("#mainTab"));


//             },
//             error: function (data, status, err) {

//                 return;
//             }
//         });


//     }
//     catch (e) {

//     }

                    
//  ////// tab메뉴   /////
//     function tabshow(target) {
        
//         var $wrapper = target;    

//         $allTabs = $wrapper.find('.tab-content > div'),
//         $tabMenu = $wrapper.find('.tab-menu li');

//         $allTabs.not(':first-of-type').hide();
//         $tabMenu.filter(':first-of-type').find(':first').width('100%')

//         $tabMenu.each(function (i) {
//             $(this).attr('data-tab', 'tab' + i);
//         });

//         $allTabs.each(function (i) {
//             $(this).attr('data-tab', 'tab' + i);
//         });

//         $tabMenu.on('click', function () {

//             var dataTab = $(this).data('tab'),
//                 $getWrapper = $(this).closest($wrapper);

//             $getWrapper.find($tabMenu).removeClass('active');
//             $(this).addClass('active');

//             $getWrapper.find($allTabs).hide();
//             $getWrapper.find($allTabs).filter('[data-tab=' + dataTab + ']').show();
//         });

//     }


// }

