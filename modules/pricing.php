<?php
	$title = get_sub_field( 'title' );
	$pricing = get_sub_field( 'items' );
	$section_id = get_sub_field( 'section_id' );
?>

<!-- Section Pricing -->
<div class="section pricing" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">

		<!-- title -->
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>

		<?php if ( $pricing ) : ?>
		<!-- pricing items -->
		<div class="pricing-items">

			<?php foreach ( $pricing as $item ) { ?>
			<div class="pricing-col">
				<div class="pricing-item content-box">
					<div class="icon"><span class="ion <?php echo esc_attr( $item['icon'] ); ?>"></span></div>
					<div class="name"><?php echo esc_html( $item['name'] ); ?></div>
					<div class="amount">
						<span class="number">
							<span class="dollar"><?php echo esc_html( $item['price']['before'] ); ?></span>
							<span><?php echo esc_html( $item['price']['value'] ); ?></span>
							<span class="period"><?php echo esc_html( $item['price']['after'] ); ?></span>
						</span>
					</div>
					<?php if ( $item['list'] ) : ?>
					<div class="feature-list">
						<ul>
							<?php foreach ( $item['list'] as $row ) { ?>
							<li <?php if ( $row['line'] ) : ?>class="disable"<?php endif; ?>><?php echo esc_html( $row['text'] ); ?> <?php if ( $row['new'] ) : ?><strong><?php echo esc_html__( 'new', 'cvio' ); ?></strong><?php endif; ?></li>
							<?php } ?>
						</ul>
					</div>
					<?php endif; ?>
					<?php if ( $item['button']['url'] || $item['button']['label'] ) : ?>
					<div class="bts">
						<a href="<?php echo esc_url( $item['button']['url'] ); ?>" class="btn hover-animated">
							<span class="circle"></span>
							<span class="lnk"><?php echo esc_html( $item['button']['label'] ); ?></span>
						</a>
					</div>
					<?php endif; ?>
				</div>
			</div>
			<?php } ?>

		</div>
		<?php endif; ?>

	</div>
</div>