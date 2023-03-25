<?php
	$title = get_sub_field( 'title' );
	$fields = get_sub_field( 'items' );
	$contact_form_title = get_sub_field( 'form_title' );
	$contact_form = get_sub_field( 'form' );
	$disable_form = get_sub_field( 'disable_form' );
	$section_id = get_sub_field( 'section_id' );
?>

<!-- Contacts Info -->
<div class="section contacts" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">

		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>
		
		<?php if ( $fields ) : ?>
		<div class="service-items">
			<?php foreach ( $fields as $item ) { ?>
			<div class="service-col">
				<div class="service-item content-box">
					<?php if ( $item['icon'] ) : ?>
					<div class="icon"><span class="ion <?php echo esc_attr( $item['icon'] ); ?>"></span></div>
					<?php endif; ?>
					<?php if ( $item['name'] ) : ?>
					<div class="name"><?php echo esc_html( $item['name'] ); ?></div>
					<?php endif; ?>
					<?php if ( $item['text'] ) : ?>
					<div class="text"><?php echo wp_kses_post( $item['text'] ); ?></div>
					<?php endif; ?>
				</div>
			</div>
			<?php } ?>
		</div>
		<?php endif; ?>

	</div>
</div>

<?php if ( $contact_form && !$disable_form ) : ?>
<!-- Section Contacts Form -->
<div class="section contacts">
	<div class="content">

		<?php if ( $contact_form_title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $contact_form_title ); ?></div>
		</div>
		<?php endif; ?>

		<?php if ( ! empty( $contact_form ) ) : ?>
		<!-- form -->
		<div class="contact_form content-box">
			<?php the_sub_field( 'form' ); ?>
		</div>
		<?php endif; ?>
	</div>
</div>
<?php endif; ?>