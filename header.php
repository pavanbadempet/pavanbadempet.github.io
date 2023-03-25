<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cvio
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<!-- Mobile Specific Metas -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>

	<?php
		$cursor_follow = get_field( 'cursor_follow', 'options' );
		$header_logo = get_field( 'header_logo', 'options' );
		$header_logo_type = get_field( 'header_logo_type', 'options' );
		$header_logo_text = get_field( 'header_logo_text', 'options' );
		$header_logo_btn = get_field( 'header_logo_btn', 'options' );
		$header_logo_btn_label = get_field( 'header_logo_btn_label', 'options' );
		$header_logo_btn_link = get_field( 'header_logo_btn_link', 'options' );
	?>

	<!-- Preloader -->
	<div class="preloader">
		<div class="centrize full-width">
			<div class="vertical-center">
				<div class="spinner">
					<div class="double-bounce1"></div>
					<div class="double-bounce2"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Container -->
	<div class="container">

		<!-- Cursor -->
		<?php if ( $cursor_follow ) : ?>
		<div class="cursor-follower"><div class="cursor-follower-inner"></div></div>
		<?php endif; ?>

		<!-- Header -->
		<header class="header">
			<div class="head-top">

				<!-- menu button -->
				<a href="#" class="menu-btn"><span></span></a>

				<!-- logo -->
				<?php if ( $header_logo_type == 0  ) : ?>
				<div class="logo <?php if ( $header_logo_btn ) : ?>hover-masks-logo<?php endif; ?>">
					<a href="<?php if ( $header_logo_btn_link ) : ?><?php echo esc_url( $header_logo_btn_link['url'] ); ?><?php else : ?><?php echo esc_url( home_url() ); ?><?php endif; ?>">
						<?php if ( $header_logo_text ) : ?>
							<span class="mask-lnk"><?php echo wp_kses_post( $header_logo_text ); ?></span>
						<?php else : ?>
							<span class="mask-lnk">
								<strong><?php echo esc_html( bloginfo('name') ); ?></strong>
								<span class="mask-desc"><?php echo esc_html( bloginfo('description') ); ?></span>
							</span>
						<?php endif; ?>
						<?php if ( $header_logo_btn && $header_logo_btn_label ) : ?>
							<span class="mask-lnk mask-lnk-hover"><?php echo wp_kses_post( $header_logo_btn_label ); ?></span>
						<?php endif; ?>
					</a>
				</div>
				<?php endif; ?>
				<?php if ( $header_logo_type == 1 ) : ?>
				<div class="logo">
					<a href="<?php echo esc_url( home_url() ); ?>">
						<?php if ( $header_logo['url'] ) : ?>
							<img src="<?php echo esc_url( $header_logo['url'] ); ?>" alt="<?php echo esc_attr( bloginfo('name') ); ?>" />
						<?php else : ?>
							<span class="mask-lnk">
								<strong><?php echo esc_html( bloginfo('name') ); ?></strong>
								<span class="mask-desc"><?php echo esc_html( bloginfo('description') ); ?></span>
							</span>
						<?php endif; ?>
					</a>
				</div>
				<?php endif; ?>

				<!-- top menu -->
				<div class="top-menu hover-masks">
					<div class="top-menu-nav">
						<?php
							wp_nav_menu( array(
								'theme_location' => 'primary'
							) );
						?>
					</div>
				</div>

				<!-- Woocommerce cart -->
				<?php if ( class_exists( 'WooCommerce' ) ) : ?>
					<?php if ( true == get_theme_mod( 'cart_shop', true ) ) : ?>
						<div class="cart-btn">
							<div class="cart-icon">
								<span class="ion ion-android-cart"></span>
								<span class="cart-count"><?php echo sprintf (_n( '%d', '%d', WC()->cart->get_cart_contents_count(), 'cvio' ), WC()->cart->get_cart_contents_count() ); ?></span>
							</div>
							<div class="cart-widget">
								<?php woocommerce_mini_cart(); ?>
							</div>
						</div>
					<?php endif; ?>
				<?php endif; ?>

			</div>
		</header>

		<!-- Wrapper -->
		<div class="wrapper">
