<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package cvio
 */

get_header();
?>

	<!-- Started -->
	<div class="section started section-title">
		<div class="video-bg">
			<div class="video-bg-mask"></div>
		</div>
		<div class="centrize full-width">
			<div class="vertical-center">
				<div class="started-content">
					<h1 class="h-title"><?php echo esc_html( get_the_archive_title() ); ?></h1>
					<div class="h-subtitles">
						<div class="h-subtitle typing-bread">
							<?php cvio_breadcrumb(); ?>
						</div>
						<span class="typed-bread"></span>
					</div>
				</div>
			</div>
		</div>
		<a href="#" class="mouse_btn" style="display: none;"><span class="icon fas fa-chevron-down"></span></a>
	</div>

	<?php
	
	//get portfolio subtitle
	$pf_subtitle = get_field( 'portfolio_subtitle', 'option' );

	?>

	<!-- Works -->
	<div class="section works">
		<div class="content">
			<?php if ( have_posts() ) : ?>

			<!-- title -->
			<div class="title">
				<div class="title_inner">
					<?php 
					
					if ( $pf_subtitle && $pf_subtitle != '' ) {
						echo esc_html( $pf_subtitle );
					} else {
						echo esc_html__( 'Recent Works', 'cvio' );
					}

					?>		
				</div>
			</div>
			
			<!-- items -->
			<div class="box-items portfolio-items">
				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					/*
					 * Include the Post-Type-specific template for the content.
					 * If you want to override this in a child theme, then include a file
					 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
					 */
					get_template_part( 'template-parts/content', get_post_type() );

				endwhile;
				?>
			</div>
			
			<!-- pagination -->
			<div class="pager">
				<?php
					echo paginate_links( array(
						'prev_text'		=> esc_html__( 'Prev', 'cvio' ),
						'next_text'		=> esc_html__( 'Next', 'cvio' ),
					) );
				?>
			</div>
			
			<?php else : get_template_part( 'template-parts/content', 'none' ); endif; ?>

			<div class="clear"></div>
		</div>
	</div>
<?php
get_footer();