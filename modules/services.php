<?php
	$title = get_sub_field( 'title' );
	$services = get_sub_field( 'items' );
	$section_id = get_sub_field( 'section_id' );
?>

<!-- Service -->
<div class="section service" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>
		
		<?php if ( $services ) : ?>
		<div class="service-items">
			<?php foreach ( $services as $item ) { ?>
			<div class="service-col">
				<div class="service-item content-box">
					<div class="icon"><span class="ion <?php echo esc_attr( $item['icon'] ); ?>"></span></div>
					<div class="name"><?php echo esc_html( $item['name'] ); ?></div>
					<div class="text"><?php echo wp_kses_post( $item['text'] ); ?></div>
				</div>
			</div>
			<?php } ?>
		</div>
		<?php endif; ?>
	</div>
</div>