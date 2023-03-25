<?php
	$title = get_sub_field( 'title' );
	$team = get_sub_field( 'items' );
	$section_id = get_sub_field( 'section_id' );
	$is_autoplay = get_sub_field( 'is_autoplay' );
	$is_autoplaytime = get_sub_field( 'is_autoplaytime' );
	$is_dots = get_sub_field( 'is_dots' );
	$is_navs = get_sub_field( 'is_navs' );
	$is_loop = get_sub_field( 'is_loop' );
	$is_slidesview = get_sub_field( 'is_slidesview' );
	$is_spacebetween = get_sub_field( 'is_spacebetween' );
?>

<!-- Section Team -->
<div class="section team" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">

		<!-- title -->
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>

		<?php if ( $team ) : ?>
		<!-- team items -->
		<div class="team-carousel">
			<div class="swiper-container" <?php if ( $is_autoplay ) : ?>data-autoplaytime="<?php echo esc_attr( $is_autoplaytime ); ?>"<?php endif; ?> data-slidesview="<?php echo esc_attr((int) $is_slidesview ); ?>" data-spacebetween="<?php echo esc_attr((int) $is_spacebetween ); ?>" data-loop="<?php echo esc_attr((int) $is_loop ); ?>">
				<div class="swiper-wrapper">
					<?php foreach ( $team as $item ) { ?>
					<div class="swiper-slide">
						<div class="team-item content-box">
							<?php
								$img = $item['img'];
								
								if ( $img ) : 

								$img_attr = wp_get_attachment_image_src( $img['id'], 'cvio_500x500' );
								$img_src = $img_attr[0];

								if( $img_src ) : 
							?>
							<div class="image">
								<img src="<?php echo esc_url( $img_src ); ?>" alt="<?php echo esc_attr( $item['name'] ); ?>" />
							</div>
							<?php endif; endif; ?>
							<div class="desc">
								<?php if( $item['name'] ) : ?>
								<div class="name"><?php echo esc_html( $item['name'] ); ?></div>
								<?php endif; ?>
								<?php if( $item['subname'] ) : ?>
								<div class="category"><?php echo esc_html( $item['subname'] ); ?></div>
								<?php endif; ?>
								<?php
								$soc_items = $item['soc_items'];
								if ( $soc_items ) :
								?>
								<div class="soc">
									<?php foreach ( $soc_items as $soc_item ) { ?>
									<a target="_blank" href="<?php echo esc_url( $soc_item['url'] ); ?>">
										<span class="icon ion <?php echo esc_attr( $soc_item['icon'] ); ?>"></span>
									</a>
									<?php } ?>
								</div>
								<?php endif; ?>
							</div>
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