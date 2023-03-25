<?php
/**
 * Skin
 */
if ( function_exists( 'get_field' ) ) {
	/**
	 * Dark Version
	 */

	$theme_ui = get_field( 'theme_ui', 'options' );

	if ( $theme_ui ) {
		function cvio_light_stylesheets() {
			wp_enqueue_style( 'cvio-light', get_template_directory_uri() . '/assets/css/light.css', '1.0' );
		}
		add_action( 'wp_enqueue_scripts', 'cvio_light_stylesheets', 10 );

	}
}

function cvio_skin() {
	$theme_ui = get_field( 'theme_ui', 'options' );

	$bg_color = get_field( 'theme_bg_color', 'options' );
	$lines_color = get_field( 'lines_color', 'options' );
	$theme_color = get_field( 'theme_color', 'options' );
	$line_color = get_field( 'line_color', 'options' );
	$heading_color = get_field( 'heading_color', 'options' );
	$text_color = get_field( 'text_color', 'options' );
	$text_link_color = get_field( 'text_link_color', 'options' );
	$subtitle_color = get_field( 'subtitle_color', 'options' );
	$content_area_color = get_field( 'content_area_color', 'options' );

	$heading_font = get_field( 'heading_font_family', 'options' );
	$text_font = get_field( 'text_font_family', 'options' );
	$heading_font_size = get_field( 'heading_font_size', 'options' );
	$text_font_size = get_field( 'text_font_size', 'options' );
	$menu_font_size = get_field( 'menu_font_size', 'options' );
	$menu_font_color = get_field( 'menu_font_color', 'options' );

	$header_logo_type = get_field( 'header_logo_type', 'options' );
	$header_logo_font_family = get_field( 'header_logo_font_family', 'options' );
	$header_logo_font_size = get_field( 'header_logo_font_size', 'options' );
	$header_logo_font_color = get_field( 'header_logo_font_color', 'options' );

	if ( $theme_ui ) {
		$bg_color = get_field( 'theme_bg_light_color', 'options' );
		$lines_color = get_field( 'lines_light_color', 'options' );
		$line_color = get_field( 'line_light_color', 'options' );
		$heading_color = get_field( 'heading_light_color', 'options' );
		$text_color = get_field( 'text_light_color', 'options' );
		$text_link_color = get_field( 'text_link_light_color', 'options' );
		$subtitle_color = get_field( 'subtitle_light_color', 'options' );
		$content_area_color = get_field( 'content_area_light_color', 'options' );

		$menu_font_color = get_field( 'menu_font_light_color', 'options' );

		$header_logo_font_color = get_field( 'header_logo_font_light_color', 'options' );
	}
?>
	
<style>
	<?php if ( $text_color ) : ?>
	/* Text Color */
	body,
	.footer .soc a,
	.footer .soc a .icon,
	.follow-label,
	.section.started.layout-creative .started-content .h-subtitle, 
	.section.started.layout-creative .started-content .typed-subtitle, 
	.section.started.layout-creative .started-content .typed-bread, 
	.section.started.layout-creative .started-content .typed-cursor,
	.section.started.section-title .started-content .typed-bread, 
	.section.started.layout-creative .started-content .typed-bread,
	.pricing-item .amount .number .dollar, 
	.pricing-item .amount .number .period,
	.team-item .soc a .icon,
	.team-item .category,
	.reviews-item .company,
	.blog-items .blog-item .category,
	.blog-items .blog-item .date,
	.blog-items .blog-item .category a,
	.blog-items .blog-item .date a {
		color: <?php echo esc_attr( $text_color ); ?>;
	}
	<?php endif; ?>

	<?php if ( $text_link_color ) : ?>
	/* Text Link Color */
	a, 
	.section.works .filters label,
	.single-post-text p a,
	.comment-text p a,
	.post-text-bottom span.cat-links a,
	.content-sidebar .tagcloud a {
		color: <?php echo esc_attr( $text_link_color ); ?>;
	}
	<?php endif; ?>

	<?php if ( $heading_color ) : ?>
	/* Heading Color */
	.section.started .started-content .h-title, 
	.section .title .title_inner,
	h1, 
	h2, 
	h3, 
	h4, 
	h5, 
	h6,
	.section.started .started-content .h-subtitle, 
	.section.started .started-content .typed-subtitle, 
	.section.started .started-content .typed-bread,
	.section.started.section-title .started-content .typed-bread a, 
	.section.started.layout-creative .started-content .typed-bread a,
	.header .logo strong,
	.content-sidebar .widget-title,
	.blog-items .blog-item .desc .name {
		color: <?php echo esc_attr( $heading_color ); ?>;
	}
	<?php endif; ?>

	<?php if ( $subtitle_color ) : ?>
	/* Section Title Color */
	.service-items .service-item .name,
	.pricing-item .name,
	.resume-items .resume-item .name,
	.skills ul li .name,
	.team-item .name,
	.reviews-item .name,
	.service-items .service-item .name,
	.pricing-item .amount .number,
	.single-post-text .details-list li strong,
	.navigation.post-navigation .nav-links a,
	.post-comments .post-comment .desc .name,
	.box-items .box-item .name {
		color: <?php echo esc_attr( $subtitle_color ); ?>;
	}
	<?php endif; ?>

	<?php if ( $bg_color ) : ?>
	/* Background Color */
	body,
	.header.fixed,
	.header.active,
	.section .content-box,
	.skills.circles ul li .progress:after,
	.skills.circles ul li .progress,
	.popup-box,
	.sticky:before {
		background: <?php echo esc_attr( $bg_color ); ?>;
	}
	<?php endif; ?>

	<?php if ( $theme_color ) : ?>
	/* 1. Theme Colors */
	.cursor-follower-inner,
	.ink,
	button:hover,
	.skills ul li .progress .percentage,
	.skills.dotted ul li .progress .da span,
	.pricing-item .feature-list ul li strong,
	.reviews-carousel .swiper-nav .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active,
	.team-carousel .swiper-nav .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active,
	.single-post-text ul>li:before,
	.comment-text ul>li:before,
	.wp-block-button__link,
	a.wp-block-button__link,
	.is-style-outline .wp-block-button__link:hover,
	.woocommerce-js ul.products li.product .button, 
	.woocommerce-js #respond input#submit.alt, 
	.woocommerce-js a.button.alt, 
	.woocommerce-js button.button.alt, 
	.woocommerce-js input.button.alt,
	.woocommerce-js #review_form #respond .form-submit input,
	.woocommerce .cart .button, .woocommerce .cart input.button,
	.woocommerce #respond input#submit, 
	.woocommerce a.button, 
	.woocommerce button.button, 
	.woocommerce input.button,
	.woocommerce-js .cart-btn .button:hover, .woocommerce-js .edit:hover {
		background: <?php echo esc_attr( $theme_color ); ?>;
	}
	a:hover,
	a.btn, 
	.btn, 
	.single-post-text input[type="submit"],
	.section.started .started-content .h-title strong,
	.section.started .started-content .h-title b,
	.section.started .started-content .h-subtitle strong, 
	.section.started .started-content .typed-subtitle strong,
	.section.started .mouse_btn,
	.info-list ul li strong,
	.resume-items .resume-item.active .date,
	.skills.list ul li .name:before,
	.service-items .service-item .icon,
	.section.works .filters label.glitch-effect,
	.pricing-item .icon,
	.started-content .date,
	.single-post-text p a,
	.comment-text p a,
	.post-text-bottom span.cat-links a,
	.post-text-bottom .tags-links a,
	.post-text-bottom .tags-links span,
	.content-sidebar .widget ul li a:hover,
	.content-sidebar .tagcloud a,
	.footer .soc a:hover .ion,
	.box-items .box-item .name:hover,
	td#today,
	code,
	.blog-items .blog-item .desc .name:hover,
	.woocommerce-js nav.woocommerce-pagination ul li a:focus, 
	.woocommerce-js nav.woocommerce-pagination ul li a:hover, 
	.woocommerce-js nav.woocommerce-pagination ul li span.current,
	.woocommerce-js .cart-btn .button, .woocommerce-js .edit,
	.woocommerce-error a, .woocommerce-info a, .woocommerce-message a,
	.woocommerce .star-rating,
	.woocommerce ul.products li.product .star-rating {
		color: <?php echo esc_attr( $theme_color ); ?>;
	}
	input:focus, 
	textarea:focus, 
	button:focus, 
	button:hover,
	a.btn, 
	.btn, 
	.single-post-text input[type="submit"],
	.skills.circles .progress .bar,
	.skills.circles .progress.p51 .fill,
	.skills.circles .progress.p52 .fill,
	.skills.circles .progress.p53 .fill,
	.skills.circles .progress.p54 .fill,
	.skills.circles .progress.p55 .fill,
	.skills.circles .progress.p56 .fill,
	.skills.circles .progress.p57 .fill,
	.skills.circles .progress.p58 .fill,
	.skills.circles .progress.p59 .fill,
	.skills.circles .progress.p60 .fill,
	.skills.circles .progress.p61 .fill,
	.skills.circles .progress.p62 .fill,
	.skills.circles .progress.p63 .fill,
	.skills.circles .progress.p64 .fill,
	.skills.circles .progress.p65 .fill,
	.skills.circles .progress.p66 .fill,
	.skills.circles .progress.p67 .fill,
	.skills.circles .progress.p68 .fill,
	.skills.circles .progress.p69 .fill,
	.skills.circles .progress.p70 .fill,
	.skills.circles .progress.p71 .fill,
	.skills.circles .progress.p72 .fill,
	.skills.circles .progress.p73 .fill,
	.skills.circles .progress.p74 .fill,
	.skills.circles .progress.p75 .fill,
	.skills.circles .progress.p76 .fill,
	.skills.circles .progress.p77 .fill,
	.skills.circles .progress.p78 .fill,
	.skills.circles .progress.p79 .fill,
	.skills.circles .progress.p80 .fill,
	.skills.circles .progress.p81 .fill,
	.skills.circles .progress.p82 .fill,
	.skills.circles .progress.p83 .fill,
	.skills.circles .progress.p84 .fill,
	.skills.circles .progress.p85 .fill,
	.skills.circles .progress.p86 .fill,
	.skills.circles .progress.p87 .fill,
	.skills.circles .progress.p88 .fill,
	.skills.circles .progress.p89 .fill,
	.skills.circles .progress.p90 .fill,
	.skills.circles .progress.p91 .fill,
	.skills.circles .progress.p92 .fill,
	.skills.circles .progress.p93 .fill,
	.skills.circles .progress.p94 .fill,
	.skills.circles .progress.p95 .fill,
	.skills.circles .progress.p96 .fill,
	.skills.circles .progress.p97 .fill,
	.skills.circles .progress.p98 .fill,
	.skills.circles .progress.p99 .fill,
	.skills.circles .progress.p100 .fill,
	.started-content .date,
	.post-text-bottom .tags-links a,
	.post-text-bottom .tags-links span,
	.content-sidebar .tagcloud a,
	.is-style-outline .wp-block-button__link,
	.woocommerce-js .cart-btn .button, .woocommerce-js .edit {
		border-color: <?php echo esc_attr( $theme_color ); ?>;
	}
	blockquote, 
	.single-post-text blockquote {
		border-left-color: <?php echo esc_attr( $theme_color ); ?>;
	}
	<?php endif; ?>

	<?php if ( $lines_color == 1 ) : ?>
	/* Lines Color */
	.lines .line-col:before,
	.content-sidebar .widget-title:before,
	.post-comments ul.children,
	.follow-label:after {
		background: rgba(0,0,0,0.1);
	}
	.section .content-box,
	.post-comments .post-comment {
		border-color: rgba(0,0,0,0.1);
	}
	.header .top-menu-nav .sub-menu li,
	.header .top-menu-nav .children li,
	.content-sidebar .search-form input[type=text], 
	.content-sidebar .search-form input[type=email], 
	.content-sidebar .search-form input[type=password], 
	.content-sidebar .search-form input[type=datetime], 
	.content-sidebar .search-form input[type=date], 
	.content-sidebar .search-form input[type=month], 
	.content-sidebar .search-form input[type=time], 
	.content-sidebar .search-form input[type=week], 
	.content-sidebar .search-form input[type=search], 
	.content-sidebar .search-form textarea, 
	.content-sidebar .search-form textarea.form-control {
		border-bottom-color: rgba(0,0,0,0.1);
	}
	<?php endif; ?>
	
	<?php if ( $heading_font ) : ?>
	/* 5. Heading Font Family */
	.section.started .started-content .h-title {
		font-family: '<?php echo esc_attr( $heading_font['font_name'] ); ?>';
	}
	<?php endif; ?>
	
	<?php if ( $text_font ) : ?>
	/* 6. Text Font Family */
	body,
	input,
	textarea,
	button,
	label,
	legend,
	blockquote {
		font-family: '<?php echo esc_attr( $text_font['font_name'] ); ?>';
	}
	<?php endif; ?>
	
	<?php if ( $heading_font_size ) : ?>
	/* 7. Heading Font Size */
	.section.started .started-content .h-title {
		font-size: <?php echo esc_attr( $heading_font_size ); ?>px;
	}
	<?php endif; ?>
	
	<?php if ( $text_font_size ) : ?>
	/* 8. Text Font Size */
	body, p, .single-post-text ul li, .single-post-text ol li, .section.started .started-content .typed-subtitle, .section.started .started-content .typed-bread,
	.box-items .box-item, .blog-items.cols .blog-col {
		font-size: <?php echo esc_attr( $text_font_size ); ?>px;
	}
	<?php endif; ?>

	<?php if ( $menu_font_size ) : ?>
	/* 8. Menu Font Size */
	.top-menu-nav {
		font-size: <?php echo esc_attr( $menu_font_size ); ?>px;
	}
	<?php endif; ?>

	<?php if ( $menu_font_color ) : ?>
	/* 8. Menu Font Color */
	.header .top-menu ul li a,
	.header .top-menu-nav .sub-menu li a, 
	.header .top-menu-nav .children li a {
		color: <?php echo esc_attr( $menu_font_color ); ?>;
	}
	<?php endif; ?>
	
	<?php if ( $header_logo_type == 0 ) : ?>
	/* 9. Logo Text */
	<?php if ( $header_logo_font_family ) : ?>
	.header .logo a {
		font-family: '<?php echo esc_attr( $header_logo_font_family['font_name'] ); ?>';
	}
	<?php endif; ?>
	<?php if ( $header_logo_font_size ) : ?>
	.header .logo a {
		font-size: <?php echo esc_attr( $header_logo_font_size ); ?>px;
	}
	<?php endif; ?>
	<?php if ( $header_logo_font_color ) : ?>
	.header .logo a {
		color: <?php echo esc_attr( $header_logo_font_color ); ?>;
	}
	<?php endif; ?>
	<?php endif; ?>
</style>
		
<?php
}
add_action( 'wp_head', 'cvio_skin', 10 );