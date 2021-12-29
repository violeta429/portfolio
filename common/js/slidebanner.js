var slideIndex = 0;

window.onload = function () {
    mdnCheckFg = "0";
    showSlides(slideIndex);
    
    carousel();
}

/* 슬라이드 배너 */
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
                                              
    //slides[slideIndex - 1].style.display = "block";
    //dots[slideIndex - 1].className += " active";
    

}
/*슬라이드쇼 타임 */
function carousel() {
    plusSlides(1);
    setTimeout(carousel, 2500);
}
