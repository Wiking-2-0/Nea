$(document).ready(function(){
  //menu burger
  $('.main-navigation-link').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('open').blur().next('.menu-list').slideToggle('medium', function() {
      if ($(this).is(':visible'))
        $(this).css('display','flex');
    });
  });
  //click inside
  $('.center-menu-item').click(function() {
    $(this).find('a')[0].click();
  });
  $('.news-block-item .title').click(function() {
    $(this).parent().find('a')[0].click();
  });
  //catalog-tabs
  $('.catalog-tabs-caption').on('click', 'li:not(.active)', function() {
    $(this).addClass('active').siblings().removeClass('active').closest('.catalog').find('.catalog-content-item').removeClass('active').eq($(this).index()).addClass('active');
  });
   //catalog-tabs
  $('.courses-page-tabs').on('click', 'li:not(.active)', function() {
    $(this).addClass('active').siblings().removeClass('active').closest('.courses-page-info').find('.courses-page-content-item').removeClass('active').eq($(this).index()).addClass('active');
  });
  //popup button
  $('.popup-btn').click(function(e) {
    e.preventDefault();
    $('.popup').show();
    $('.overlay').show();
  });
  $('.popup-close, .overlay').click(function() {
    $('.overlay, .popup').hide();
  });

  $('.header_banner .owl-carousel').owlCarousel({
    items:1,
    nav: true,
    dots:false,
    autoplay: 2000,
    navSpeed: 1000,
    onInitialized  : counter, //When the plugin has initialized.
    onTranslated : counter //When the translation of the stage has finished.
  });

  function counter(event) {
   var element   = event.target;         // DOM element, in this example .owl-carousel
    var items     = event.item.count;     // Number of items
    var item      = event.item.index + 1;     // Position of the current item
    $('#counter').html("<span class=\"zero\">0</span>"+item+".")
  }

  $('.courses-info_gallery .owl-carousel,.review_list.owl-carousel,.courses-block_item-gallery .owl-carousel').owlCarousel({
    items:1,
    nav: true,
    dots:false,
    autoplay: 2000,
    navSpeed: 1000,
  });
  $('.gallery-page_content-list').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
  });

  $('.review-feedback-form-select').styler();

  // upload

$(".upload input[type='file']").on('change', function (e) {
  var label = $(this).siblings('label').children('span');
  var fileName = e.target.files[0].name;
  label.text(fileName);
});

if ($('.js-form').length) {
  $('.js-form').each(function () {
    $(this).validate({
      rules: {
        name: {
          required: false,
          minlength: 2
        },
        phone: {
          required: true,
          minlength: 6
        },
        email: {
          required: true,
          email: true
        },
        message: {
          required: false
        }
      },
      errorPlacement: function (error, element) {
      },

      submitHandler: function (form) {
        $.ajax({
          type: "POST",
          url: "/wp-content/themes/marketing/mail/mail.php",
          data: $(form).serialize(),
          success: function () {
            alert("Спасибо за заявку! Скоро мы с вами свяжемся.");
            $(".popup").css('opacity', '0').delay(200);
            $(".popup").css('display', 'none');
            $(".popup").dequeue();

            setTimeout(function () {
              $(form).trigger("reset");
            }, 3000);
          }
        });
      }

    });
  });
}

});
