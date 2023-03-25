<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package cvio
 */

get_header();
?>
	
	<?php

	$p404_title = get_field( 'p404_title', 'option' );	
	$p404_text = get_field( 'p404_text', 'option' );

	?>

	<!-- Started -->
	<div class="section started section-title">
		<div class="video-bg">
			<div class="video-bg-mask"></div>
		</div>
		<div class="centrize full-width">
			<div class="vertical-center">
				<div class="started-content">
					<h1 class="h-title">
						<?php
						
						if ( $p404_title && $p404_title != '' ) {
							echo esc_html( $p404_title );
						} else {
							echo esc_html__( '404', 'cvio' );
						}

						?>		
					</h1>
					<div class="h-subtitles">
						<div class="h-subtitle typing-bread">
							<p>
								<?php

								if ( $p404_text && $p404_text != '' ) {
									echo esc_html( $p404_text );
								} else {
									echo esc_html__( 'Oops! That page can&rsquo;t be found.', 'cvio' );
								}

								?>
							</p>
						</div>
						<span class="typed-bread"></span>
					</div>
				</div>
			</div>
		</div>
	</div>

<?php
get_footer();