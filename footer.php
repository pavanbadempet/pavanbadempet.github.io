<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cvio
 */

?>

		</div>

		<?php
			$social_links = get_field( 'social_links', 'options' );
			$copyright = get_field( 'copyright', 'options' );
		?>

		<!-- Footer -->
		<footer class="footer">
			<?php if ( $copyright ) : ?>
			<div class="copy">
				<?php echo wp_kses_post( $copyright ); ?>
			</div>
			<?php else : ?>
			<div class="copy">
				<p><?php echo esc_html__( '&copy; 2020. All rights reserved', 'cvio' ); ?></p>
			</div>
			<?php endif; ?>
			<?php if ( $social_links ) : ?>
			<div class="soc-box">
				<div class="follow-label"><?php echo esc_html__( 'Follow Me', 'cvio' ); ?></div>
				<div class="soc">
					<?php foreach ( $social_links as $link ) { ?>
					<a target="_blank" href="<?php echo esc_url( $link['url'] ); ?>">
						<?php echo wp_kses_post( str_replace( 'class="', 'class="ion ', $link['icon'] ) ); ?>
					</a>
				<?php } ?>
				</div>
			</div>
			<?php endif; ?>
			<div class="clear"></div>
		</footer>

		<!-- Lines -->
		<div class="lines">
			<div class="content">
				<div class="line-col"></div>
				<div class="line-col"></div>
				<div class="line-col"></div>
				<div class="line-col"></div>
				<div class="line-col"></div>
			</div>
		</div>

	</div>

<?php wp_footer(); ?>

</body>
</html>
