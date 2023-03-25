<?php
	$title = get_sub_field( 'title' );
	$testimonials = get_sub_field( 'items' );
	$section_id = get_sub_field( 'section_id' );
	$is_autoplay = get_sub_field( 'is_autoplay' );
	$is_autoplaytime = get_sub_field( 'is_autoplaytime' );
	$is_dots = get_sub_field( 'is_dots' );
	$is_navs = get_sub_field( 'is_navs' );
	$is_loop = get_sub_field( 'is_loop' );
	$is_slidesview = get_sub_field( 'is_slidesview' );
	$is_spacebetween = get_sub_field( 'is_spacebetween' );
?>

<!-- Section Testimonials -->
<div class="section testimonials" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">

		<!-- title -->
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>

		<?php if ( $testimonials ) : ?>
		<!-- testimonials items -->
		<div class="reviews-carousel">
			<div class="swiper-container" <?php if ( $is_autoplay ) : ?>data-autoplaytime="<?php echo esc_attr( $is_autoplaytime ); ?>"<?php endif; ?> <?php if (! $is_autoplay ) : ?>data-autoplaytime="false"<?php endif; ?> data-slidesview="<?php echo esc_attr((int) $is_slidesview ); ?>" data-spacebetween="<?php echo esc_attr((int) $is_spacebetween ); ?>" data-loop="<?php echo esc_attr((int) $is_loop ); ?>">
				<div class="swiper-wrapper">
					<?php foreach ( $testimonials as $item ) { ?>
					<div class="swiper-slide">
						<div class="reviews-item content-box">
							<?php
								$img = $item['img'];
								
								if ( $img ) : 

								$img_attr = wp_get_attachment_image_src( $img['id'], 'cvio_160xAuto' );
								$img_src = $img_attr[0];

								if( $img_src ) : 
							?>
							<div class="image">
								<img src="<?php echo esc_url( $img_src ); ?>" alt="<?php echo esc_attr( $item['name'] ); ?>" />
							</div>
							<?php endif; endif; ?>
							<div class="info">
								<?php if( $item['name'] ) : ?>
								<div class="name"><?php echo esc_html( $item['name'] ); ?></div>
								<?php endif; ?>
								<?php if( $item['subname'] ) : ?>
								<div class="company"><?php echo esc_html( $item['subname'] ); ?></div>
								<?php endif; ?>
							</div>
							<?php if( $item['text'] ) : ?>
							<div class="text">
								<?php echo esc_html( $item['text'] ); ?>
							</div>
							<?php endif; ?>
						</div>
					</div>
					<?php } ?>
				</div>
			</div>

			<!-- navigation -->
			<div class="swiper-nav">
				<?php if ( $is_navs ) : ?>
				<a class="prev swiper-button-prev fas fa-long-arrow-alt-left"></a>
				<?php endif; ?>
				<?php if ( $is_dots ) : ?>
				<div class="swiper-pagination"></div>
				<?php endif; ?>
				<?php if ( $is_navs ) : ?>
				<a class="next swiper-button-next fas fa-long-arrow-alt-right"></a>
				<?php endif; ?>
			</div>

		</div>
		<?php endif; ?>
		
	</div>
</div>