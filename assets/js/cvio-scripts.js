/**
*	Cvio - Resume / CV WordPress Theme
*	Author: bslthemes
*	Author URL: http://themeforest.net/user/bslthemes
*	Copyright © Cvio by bslthemes. All Rights Reserved.
**/

( function( $ ) {
	'use strict';

	window.onpageshow = function(event) {if (event.persisted) {window.location.reload() }};

	$(window).on("load", function() {

		/*
			Preloader
		*/
		var preload = $('.preloader');
		preload.find('.spinner').fadeOut(function(){
			preload.fadeOut();
		});

		/*
			Lines Animations
		*/
		$('.lines').addClass('finish');
		setTimeout(function(){
			$('.lines').addClass('ready');
		}, 1200);

		/*
			Typed Subtitle
		*/
		if(($('.typed-subtitle').length) && ($('.h-subtitle p').length > 1)){
			$('.typed-subtitle').each(function(){
				var typedSpeed = $(this).data('tspeed');
				var backSpeed = $(this).data('tdelay');
				var $this = $(this)[0];
				var $string = $(this).prev('.typing-subtitle')[0];
				var typed = new Typed($this, {
					typeSpeed: typedSpeed,
					backDelay: backSpeed,
					stringsElement: $string,
					loop: true
				});
			});
		}

		/*
			Typed Breadcrumbs
		*/
		setTimeout(function(){
			$('.h-subtitles').addClass('ready');
			if($('.typed-bread').length){
				var typed_b = new Typed('.typed-bread', {
					stringsElement: '.typing-bread',
					showCursor: false
				});
			}
		}, 1000);

		/*
			One Page Nav
		*/
		var url_hash = location.hash;
		var sectionElem = $(url_hash);
		if(url_hash.indexOf('#section-') == 0 && sectionElem.length){
			$('body, html').animate({scrollTop: $(url_hash).offset().top - 68}, 400);
		}

		/*
			Jarallax
		*/
		if($('.jarallax').length){
			$('.jarallax').jarallax();
		}

		/*
			Started Slider
		*/
		if($('.started-carousel').length){
			var slider_container = $('.started-carousel .swiper-container');
			var is_autoplaytime = slider_container.data('autoplaytime');
			var is_loop = slider_container.data('loop');
			var started_slider = new Swiper ('.started-carousel .swiper-container', {
				init: false,
				loop: is_loop,
				spaceBetween: 0,
				effect: 'fade',
				slidesPerView: 1,
				simulateTouch: false,
				autoplay: {
					delay: is_autoplaytime,
					disableOnInteraction: false,
					waitForTransition: false,
				},
				navigation: {
					nextEl: '.started .swiper-button-next',
					prevEl: '.started .swiper-button-prev',
				},
			});
			started_slider.on('slideChange', function () {
				var index = started_slider.realIndex;
				var total = started_slider.slides.length;

				$('.started-carousel .swiper-slide').removeClass('first');
				$('.started-carousel .swiper-slide').each(function(i, slide){
					if((index-1)>=i) {
						$(slide).addClass('swiper-clip-active');
					} else {
						$(slide).removeClass('swiper-clip-active');
					}
				});
				$('.started-carousel .swiper-slide').each(function(i, slide){
					$(slide).css({'z-index': total - i});
				});
			});
			started_slider.init();
		}

		/*
			Testimonials Slider
		*/
		if($('.reviews-carousel').length){
			var is_autoplay = true;
			var rev_slider = $('.reviews-carousel .swiper-container');
			var is_loop = rev_slider.data('loop');
			var is_autoplaytime = rev_slider.data('autoplaytime');
			if (!is_autoplaytime) {
				is_autoplay = false;
			}
			var is_slidesview = rev_slider.data('slidesview');
			var is_spacebetween = rev_slider.data('spacebetween');
			var rev_slider = new Swiper ('.reviews-carousel .swiper-container', {
				loop: is_loop,
				spaceBetween: is_spacebetween,
				slidesPerView: is_slidesview,
				autoplay: {
					delay: is_autoplaytime,
				},
				autoplay: is_autoplay,
				navigation: {
					nextEl: '.reviews-carousel .swiper-button-next',
					prevEl: '.reviews-carousel .swiper-button-prev',
				},
				pagination: {
					el: '.reviews-carousel .swiper-pagination',
					type: 'bullets',
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: is_spacebetween,
					},
					720: {
						slidesPerView: is_slidesview,
						spaceBetween: is_spacebetween,
					},
				}
			});
		}

		/*
			Team Slider
		*/
		if($('.team-carousel').length){
			var t_is_autoplay = true;
			var team_slider = $('.team-carousel .swiper-container');
			var t_is_autoplaytime = team_slider.data('autoplaytime');
			if (!t_is_autoplaytime) {
				t_is_autoplay = false;
			}
			var t_is_loop = team_slider.data('loop');
			var t_is_slidesview = team_slider.data('slidesview');
			var t_is_spacebetween = team_slider.data('spacebetween');
			var team_slider = new Swiper ('.team-carousel .swiper-container', {
				loop: t_is_loop,
				spaceBetween: t_is_spacebetween,
				slidesPerView: t_is_slidesview,
				autoplay: {
					delay: t_is_autoplaytime,
				},
				autoplay: t_is_autoplay,
				navigation: {
					nextEl: '.team-carousel .swiper-button-next',
					prevEl: '.team-carousel .swiper-button-prev',
				},
				pagination: {
					el: '.team-carousel .swiper-pagination',
					type: 'bullets',
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: t_is_spacebetween,
					},
					720: {
						slidesPerView: t_is_slidesview,
						spaceBetween: t_is_spacebetween,
					},
				}
			});
		}

		/*
			Refresh Scroll

		function scroll_refresh(){
			$(window).scrollTop($(window).scrollTop()+1);
		}
		setTimeout(scroll_refresh, 100);*/

	});

	/*
		Set full height in blocks
	*/
	var width = $(window).width();
	var height = $(window).height();

	/*
		Set Height Started Section
	*/
	$('.section.started').css({'height': height});
	$('.logged-in .section.started').css({'height': height-32});
	if(width < 783) {
		$('.section.started').css({'height': height});
		$('.logged-in .section.started').css({'height': height-46});
	}

	/*
		Set Background Enabled
	*/
	if($('.section.started').hasClass('background-enabled')) {
		$('body').addClass('background-enabled');
	}

	/*
		Grained
	*/
	if($('#grained_container').length){
	var grained_options = {
		'animate': true,
		'patternWidth': 400,
		'patternHeight': 400,
		'grainOpacity': 0.15,
		'grainDensity': 3,
		'grainWidth': 1,
		'grainHeight': 1
	}
	grained('#grained_container', grained_options);
	}

	/*
		Cursor Effects
	*/
	if((width > 1199) && $('.cursor-follower').length) {
		$(window).on('mousemove', function(e){
			var x = e.pageX;
			var y = e.pageY;
			var newposX = x;
			var newposY = y;
			$('.cursor-follower').css('transform','translate3d('+newposX+'px,'+newposY+'px,0px)');
		});
		$('a, .btn-group').on({
			mouseenter: function (e) {
				cursor_over();
			},
			mouseleave: function (e) {
				cursor_out();
			}
		});
	}
	function cursor_over(){
		$(".cursor-follower-inner").stop().animate({width: 86, height: 86, opacity: 0.1, margin: '-43px 0 0 -43px'}, 500);
	}
	function cursor_out(){
		$(".cursor-follower-inner").stop().animate({width: 26, height: 26, opacity: 0.4, margin: '-13px 0 0 -13px'}, 500);
	}

	/*
		Hover Masks
	*/
	$('.hover-masks a').each(function() {
		var mask_val = $(this).html();
		$(this).wrapInner('<span class="mask-lnk"></span>');
		$(this).append('<span class="mask-lnk mask-lnk-hover">' + mask_val + '</span>');
	});

	/*
		Hover Button Effect
	*/
	$('.hover-animated .circle').on({
		mouseenter: function (e) {
			if ($(this).find(".ink").length === 0) {
				$(this).prepend("<span class='ink'></span>");
			}
			var ink = $(this).find(".ink");
			ink.removeClass("animate");
			if (!ink.height() && !ink.width()) {
				var d = Math.max($(this).outerWidth(), $(this).outerHeight());
				ink.css({
					height: d,
					width: d
				});
			}
			var x = e.pageX - $(this).offset().left - ink.width() / 2;
			var y = e.pageY - $(this).offset().top - ink.height() / 2;
			ink.css({
				top: y + 'px',
				left: x + 'px'
			}).addClass("ink-animate");
			$('.cursor-follower').addClass('hide');
		},
		mouseleave: function (e) {
			var ink = $(this).find(".ink");
			var x = e.pageX - $(this).offset().left - ink.width() / 2;
			var y = e.pageY - $(this).offset().top - ink.height() / 2;
			ink.css({
				top: y + 'px',
				left: x + 'px'
			}).removeClass("ink-animate");
			$('.cursor-follower').removeClass('hide');
		}
	});

	/*
		Animation Between Pages
	*/
	$('header .top-menu, .typed-bread, .popup-box .bts, .animate-to-page').on('click', 'a', function(){
		var link = $(this).attr('href');
		if(link.indexOf('#section-') == 0){
			if(!$('body').hasClass('home')){
				location.href = '/'+link;
			}

			$('body, html').animate({scrollTop: $(link).offset().top - 68}, 400);
			if($('header').hasClass('active')){
				$('.menu-btn').trigger('click');
			}
		} else {
			$('.lines').removeClass('finish');
			$('.lines').removeClass('ready');
			$('.lines').addClass('no-lines');
			setTimeout(function() {
				location.href = "" + link;
			}, 2500);
		}
		return false;
	});

	/*
		On Scroll
	*/
	$(window).on('scroll', function(){

		/* add/remove background-enabled class */
		if ($(this).scrollTop() >= $('.section.started').height()) {
			$('body').removeClass('background-enabled');
		} else {
			if($('.section.started').hasClass('background-enabled')) {
				$('body').addClass('background-enabled');
			}
		}

		/* add/remove header/footer fixed class */
		if (($(this).scrollTop() >= 100) && ($('.section').length>1)) {
			$('.header').addClass('fixed');
			$('.footer').addClass('fixed');
			$('body').removeClass('background-enabled');
			$('.mouse_btn').fadeOut();
		}
		if (($(this).scrollTop() <= 100) && ($('.section').length>1)) {
			$('.header').removeClass('fixed');
			$('.footer').removeClass('fixed');
			$('.mouse_btn').fadeIn();
		}
		if (($(this).scrollTop() <= 100) && ($('.section').length>1) && ($('.section.started').hasClass('background-enabled'))) {
			$('body').addClass('background-enabled');
		}

	});

	/*
		Menu on Mobile
	*/
	$('header').on('click', '.menu-btn', function(){
		if($('header').hasClass('active')){
			$('header').removeClass('active');
			$('.footer .soc').fadeIn();
			$('body').addClass('loaded');
			if($('.video-bg').length) {
				$('body').addClass('background-enabled');
			}
		} else {
			$('header').addClass('active');
			$('.footer .soc').hide();
			$('body').removeClass('loaded');
			$('body').removeClass('background-enabled');
		}

		return false;
	});

	/*
		Menu Mobile Dropdown
	*/
	$('.top-menu li.menu-item-has-children').each(function(){
		$(this).append('<span class="open-lnk"></span>');
	});
	$('.top-menu').on( 'click', '.open-lnk', function() {
		if($(this).closest('li').hasClass('menu-item-has-children')) {
			if($(this).closest('li').hasClass('active')) {
				$(this).closest('li').removeClass('active');
				$(this).closest('li').find('> ul').slideUp();
			}
			else {
				$(this).closest('li').addClass('active');
				$(this).closest('li').find('> ul').slideDown();
			}
		}
	});

	/*
		Download CV on Mobile
	*/
	$('.section.about').on('click touchstart', '.btn', function(){
		location.href = $(this).attr('href');
	});

	/*
		Mouse Button Scroll
	*/
	$('.section').on('click', '.mouse_btn', function(){
		$('body, html').animate({
			scrollTop: height - 150
		}, 800);
	});
	if($('.section').length>1){
		$('.mouse_btn').show();
	}

	/*
		Initialize Portfolio
	*/
	var $container = $('.portfolio-items');
	$container.imagesLoaded(function() {
		$container.isotope({
			percentPosition: true,
			itemSelector: '.box-item'
		});
		$(document).on('lazyloaded', function(e){
			$container.isotope( 'reloadItems' ).isotope();
		});

		/*
			Portfolio items parallax
		*/
		if($('.portfolio-items.portfolio-new').length){
			var s_parallax = document.getElementsByClassName('wp-post-image');
			new simpleParallax(s_parallax);
		}

	});

	/*
		Filter items on button click
	*/
	$('.filters').on( 'click', '.btn-group', function() {
		var filterValue = $(this).find('input').val();
		$container.isotope({ filter: filterValue });
		$('.filters .btn-group label').removeClass('glitch-effect');
		$(this).find('label').addClass('glitch-effect');
	});

	/*
		Gallery popup
	*/
	if(/\.(?:jpg|jpeg|gif|png)$/i.test($('.gallery-item:first a').attr('href'))){
		$('.gallery-item a').magnificPopup({
			gallery: {
				enabled: true
			},
			type: 'image',
			closeBtnInside: false,
			mainClass: 'mfp-fade'
		});
	}

	/*
		Media popup
	*/
	$('.has-popup-media').magnificPopup({
		type: 'inline',
		overflowY: 'auto',
		closeBtnInside: true,
		mainClass: 'mfp-fade'
	});

	/*
		Image popup
	*/
	$('.has-popup-image').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		mainClass: 'mfp-fade',
		image: {
			verticalFit: true
		}
	});

	/*
		Video popup
	*/
	$('.has-popup-video').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		iframe: {
            patterns: {
                youtube_short: {
                  index: 'youtu.be/',
                  id: 'youtu.be/',
                  src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                }
            }
        },
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'mfp-fade',
		callbacks: {
			markupParse: function(template, values, item) {
				template.find('iframe').attr('allow', 'autoplay');
			}
		}
	});

	/*
		Music popup
	*/
	$('.has-popup-music').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'mfp-fade'
	});

	/*
		Gallery popup
	*/
	$('.has-popup-gallery').on('click', function() {
        var gallery = $(this).attr('href');

        $(gallery).magnificPopup({
            delegate: 'a',
            type:'image',
            closeOnContentClick: false,
            mainClass: 'mfp-fade',
            removalDelay: 160,
            fixedContentPos: false,
            gallery: {
                enabled: true
            },
			callbacks: {
				markupParse: function(template, values, item) {
					values.title = item.el.attr('title');
				}
			}
        }).magnificPopup('open');

        return false;
    });

	/*
		Background enabled
	*/
	if($('.jarallax-video').length) {
		$('body').addClass('background-enabled');
		$('.jarallax-video').jarallax();
	}

	/*
		One Page Menu Nav
	*/
	if($('.section').length && $('.top-menu li a').length) {
		$(window).on('scroll', function(){
			var scrollPos = $(window).scrollTop();
			$('.top-menu ul li a').each(function () {
				if($(this).attr('href').indexOf('#section-') == 0){
					var currLink = $(this);
					var refElement = $(currLink.attr("href"));
					if(refElement.length){
						if (refElement.offset().top <= scrollPos + 70) {
							$('.top-menu ul li').removeClass("current-menu-item");
							currLink.closest('li').addClass("current-menu-item");
						}
					}
					if(scrollPos == 0) {
						$('.top-menu ul li').removeClass("current-menu-item");
					}
				}
			});
		});
	}

	/*
		Iframe margins
	*/
	$('.single-post-text').each(function(){
		$(this).find('iframe').wrap('<div class="embed-container"></div>');
	});

	/*
		Dotted Skills Line
	*/
	function skills(){
		var skills_dotted = $('.skills.dotted .progress');
		var skills_dotted_w = skills_dotted.width();
		if(skills_dotted.length){
			skills_dotted.append('<span class="dg"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>');
			skills_dotted.find('.percentage').append('<span class="da"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>');
			skills_dotted.find('.percentage .da').css({'width':skills_dotted_w});
		}
	}
	skills();

	/*
		Circle Skills Line
	*/
	var skills_circles = $('.skills.circles .progress');
	if(skills_circles.length){
		skills_circles.append('<div class="slice"><div class="bar"></div><div class="fill"></div></div>');
	}

	/**
		Cart Mobile
	**/
	if(width < 1024) {
	$('.header').on('click', '.cart-btn', function(){
		if($(this).hasClass('active')) {
			$(this).find('.cart-widget').removeClass('is-active');
			$(this).removeClass('active');
		}
		else {
			$(this).find('.cart-widget').addClass('is-active');
			$(this).addClass('active');
		}
	});
	}

	/*
		Resize
	*/
	$(window).resize(function() {

		/* Set full height in blocks */
		var width = $(window).width();
		var height = $(window).height();

		/* Set full height in started blocks */
		$('.section.started').css({'height': height});
		$('.logged-in .section.started').css({'height': height-32});
		if(width < 783) {
			$('.section.started').css({'height': height});
			$('.logged-in .section.started').css({'height': height-46});
		}

		/* Dotted skills line on resize */
		var skills_dotted = $('.skills-list.dotted .progress');
		var skills_dotted_w = skills_dotted.width();
		if(skills_dotted.length){
			skills_dotted.find('.percentage .da').css({'width':skills_dotted_w+1});
		}

	});

	/*
		Google Maps
	*/
	if($('#map').length) {
		initMap();
	}

} )( jQuery );

/*
	Google Map Options
*/
function initMap() {
	var myLatlng = new google.maps.LatLng(48.859003, 2.345275); // <- Your latitude and longitude
	var styles = [
		{
			"stylers": [
				{
					"hue": "#ff1a00"
				},
				{
					"invert_lightness": true
				},
				{
					"saturation": -100
				},
				{
					"lightness": 33
				},
				{
					"gamma": 0.5
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#2D333C"
				}
			]
		},
		{
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
	    	]
	  	},
		{
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.neighborhood",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
	]

	var mapOptions = {
		zoom: 16,
		center: myLatlng,
		mapTypeControl: false,
		disableDefaultUI: true,
		zoomControl: false,
		scrollwheel: false,
		styles: styles
	}

	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	/*var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title: 'We are here!'
	});*/
}
