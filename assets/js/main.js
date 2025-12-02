/**
	}
	function cursor_out() {
		$(".cursor-follower").stop().animate({ width: 26, height: 26, opacity: 0.4, margin: '-13px 0 0 -13px' }, 500);
	}


	/*
		Animation Between Pages
	*/
$('header .top-menu, .typed-bread, .popup-box .bts, .animate-to-page').on('click', 'a', function () {
	var link = $(this).attr('href');
	if (link.indexOf('#section-') == 0) {
	} else {
		if ((!$('header').hasClass('active')) && $('.video-bg').length) {
			$('body').addClass('background-enabled');
		}
	}

	/* add/remove header/footer fixed class */
	if (($(this).scrollTop() >= 100) && ($('.section').length > 1)) {
		$('.header').addClass('fixed');
		$('.footer').addClass('fixed');
		$('.mouse_btn').fadeOut();
	}
	if (($(this).scrollTop() <= 100) && ($('.section').length > 1)) {
		$('.header').removeClass('fixed');
		$('.footer').removeClass('fixed');
		$('.mouse_btn').fadeIn();
	}

});

/*
	Menu on Mobile
*/
$('header').on('click', '.menu-btn', function () {
	if ($('header').hasClass('active')) {
		$('header').removeClass('active');
		$('.footer .soc').fadeIn();
		$('body').addClass('loaded');
		if ($('.video-bg').length) {
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
	Download CV on Mobile
*/
$('.section.about').on('click touchstart', '.btn', function () {
	location.href = $(this).attr('href');
});

/*
	Mouse Button Scroll
*/
$('.section').on('click', '.mouse_btn', function () {
	$('body, html').animate({
		scrollTop: $(window).height() - 150
	}, 800);
});
if ($('.section').length > 1) {
	$('.mouse_btn').show();
}

/*
	Sidebar Show/Hide
*/
$('header').on('click', '.sidebar_btn', function () {
	$('.s_overlay').fadeIn();
	$('.content-sidebar').addClass('active');
	$('body').addClass('scroll_hidden');

	return false;
});
$('.content-sidebar, .container').on('click', '.close, .s_overlay', function () {
	$('.s_overlay').fadeOut();
	$('.content-sidebar').removeClass('active');
	$('body').removeClass('scroll_hidden');
});

/*
	Resize
*/
$(window).resize(function () {

	/* Set full height in blocks */
	var width = $(window).width();
	var height = $(window).height();

	/* Set full height in started blocks */
	$('.section.started').not('.section-title').css({ 'height': height });
	if (width < 783) {
		$('.section.started').not('.section-title').css({ 'height': height });
	}

	/* Dotted skills line on resize */
	var skills_dotted = $('.skills-list.dotted .progress');
	var skills_dotted_w = skills_dotted.width();
	if (skills_dotted.length) {
		skills_dotted.find('.percentage .da').css({ 'width': skills_dotted_w + 1 });
	}

});

}) (jQuery);

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