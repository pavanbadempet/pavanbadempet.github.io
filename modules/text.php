<?php
	$title = get_sub_field( 'title' );
	$content = get_sub_field( 'text' ); 
	$section_id = get_sub_field( 'section_id' );
?>

<!-- About -->
<div class="section custom-text" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">

		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>

		<?php if ( $content ) : ?>
		<div class="content-box">
			<div class="single-post-text">
				<?php the_sub_field( 'text' ); ?>
			</div>
		</div>
		<?php endif; ?>

		<div class="clear"></div>
	</div>
</div>