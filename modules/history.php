<?php
	$items = get_sub_field( 'items' );
	$section_id = get_sub_field( 'section_id' );
?>

<!-- Resume -->
<div class="section resume" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">
		<?php if ( $items ) : ?>
		<div class="cols">
			<?php foreach ( $items as $item ) { ?>
			<div class="col col-md">
				<?php if ( $item['name'] ) : ?>
				<div class="title">
					<div class="title_inner"><?php echo esc_html( $item['name'] ); ?></div>
				</div>
				<?php endif; ?>
				<?php
				$fields = $item['fields'];
				if ( $fields ) :
				?>
				<div class="resume-items">
					<?php foreach ( $fields as $field ) { ?>
					<div class="resume-item content-box active">
						<div class="date"><?php echo esc_html( $field['years'] ); ?></div>
						<?php if( $field['image'] ) :
							if ( $field['image']['id'] ) {
								$image = wp_get_attachment_image_url( $field['image']['id'], 'cvio_160xAuto' );
							} else {
								$image = $field['image']['url'];
							}
						?>
						<div class="image">
							<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( $field['title'] ); ?>">
						</div>
						<?php endif; ?>
						<div class="name"><?php echo esc_html( $field['title'] ); ?></div>
						<div class="single-post-text"><?php echo wp_kses_post( $field['text'] ); ?></div>
					</div>
					<?php } ?>
				</div>
				<?php endif; ?>
			</div>
			<?php } ?>
		</div>
		<?php endif; ?>
	</div>
</div>