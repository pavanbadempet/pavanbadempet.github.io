<?php
	$title = get_sub_field( 'title' );
	$clients = get_sub_field( 'items' );
	$section_id = get_sub_field( 'section_id' );
?>

<!-- Clients -->
<div class="section clients" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>
		
		<?php if ( $clients ) : ?>
		<div class="content-box">
			<div class="clients-items">
				<?php foreach ( $clients as $item ) { ?>
				<div class="clients-col">
					<div class="clients-item">
						<a target="_blank" href="<?php echo esc_url( $item['url'] ); ?>">
							<?php
								$img = $item['img'];

								if ( $img ) : 

								$img_attr = wp_get_attachment_image_src( $img['id'], 'cvio_160xAuto' );
								$img_src = $img_attr[0];

								if( $img_src ) : 
							?>
							<img src="<?php echo esc_url( $img_src ); ?>" alt="<?php echo esc_attr__( 'Client', 'cvio' ); ?>" />
							<?php endif; endif; ?>
						</a>
					</div>
				</div>
				<?php } ?>
			</div>
		</div>
		<?php endif; ?>
		
		<div class="clear"></div>
	</div>
</div>