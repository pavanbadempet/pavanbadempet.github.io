<?php
	$title = get_sub_field( 'title' );
	$photo = get_sub_field( 'photo' );
	$description = get_sub_field( 'text' ); 
	$info = get_sub_field( 'info' );
	$button = get_sub_field( 'button' );
	$additional_buttons = get_sub_field( 'additional_buttons' );
	$section_id = get_sub_field( 'section_id' );
?>

<!-- About -->
<div class="section about" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content content-box">
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>
		
		<?php

		if ( $photo ) :
		
		$photo_attr = wp_get_attachment_image_src( $photo['id'], 'cvio_160xAuto' );
		$photo_src = $photo_attr[0];

		if ( $photo_src ) :
		?>
		<div class="image">
			<img src="<?php echo esc_url( $photo_src ); ?>" alt="<?php echo esc_attr( $title ); ?>" />
		</div>
		<?php endif; endif; ?>
		
		<?php if ( $description || $info || $button ) : ?>
		<div class="desc">
			<?php if ( $description ) : ?>
			<?php echo wp_kses_post( $description ); ?>
			<?php endif; ?>
			<?php if ( $info ) : ?>
			<div class="info-list">
				<ul>
					<?php foreach ( $info as $item ) { ?>
					<li><strong><?php echo esc_html( $item['label'] ); ?>:</strong> <?php echo esc_html( $item['value'] ); ?></li>
					<?php } ?>
				</ul>
			</div>
			<?php endif; ?>
			<?php if ( $button || $additional_buttons ) : ?>
			<div class="bts bts-list">
				<?php if ( $button['url'] || $button['label'] ) : ?>
				<a href="<?php echo esc_url( $button['url'] ); ?>" class="btn hover-animated">
					<span class="circle"></span>
					<span class="lnk"><?php echo esc_html( $button['label'] ); ?></span>
				</a>
				<?php endif; ?>
				<?php if ( $additional_buttons ) : ?>
					<?php foreach ( $additional_buttons as $btn ) { ?>
						<?php if ( $btn['url'] || $btn['label'] ) : ?>
						<a href="<?php echo esc_url( $btn['url'] ); ?>" class="btn hover-animated">
							<span class="circle"></span>
							<span class="lnk"><?php echo esc_html( $btn['label'] ); ?></span>
						</a>
						<?php endif; ?>
					<?php } ?>
				<?php endif; ?>
			</div>
			<?php endif; ?>
		</div>
		<?php endif; ?>
		<div class="clear"></div>
	</div>
</div>