<?php
/**
 * Template Name: Blog
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
					<h1 class="h-title glitch-effect"><?php single_post_title(); ?></h1>
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

	$posts_per_page = get_option( 'posts_per_page' );
	$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;

	$posts = wp_count_posts( 'post' );
	$total_posts = $posts->publish;

	$args = array(
		'post_type' => 'post',
		'posts_per_page' => $posts_per_page,
		'paged' => $paged,
		'post_status' => 'publish',
		'order' => 'desc'
	);
	$the_query = new WP_Query($args);

	//get blog subtitle
	$blog_subtitle = get_field( 'blog_subtitle', 'option' );
	
	?>

	<!-- Blog -->
	<div class="section blog">
		<div class="content">
			
			<?php if ( $the_query->have_posts() ) : ?>
			
			<!-- title -->
			<div class="title">
				<div class="title_inner">
					<?php 
					
					if ( $blog_subtitle && $blog_subtitle != '' ) {
						echo esc_html( $blog_subtitle );
					} else {
						echo esc_html__( 'Latest Posts', 'cvio' );
					}

					?>
				</div>
			</div>

			<!-- blog items -->
			<div class="blog-items">
				<?php
				/* Start the Loop */
				while ( $the_query->have_posts() ) :
					$the_query->the_post();

					/*
					 * Include the Post-Type-specific template for the content.
					 * If you want to override this in a child theme, then include a file
					 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
					 */
					get_template_part( 'template-parts/content', get_post_type() );

				endwhile; wp_reset_postdata();
				?>
				<div class="pager">
					<?php
						$big = 999999999; // need an unlikely integer

						echo paginate_links( array(
							'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
							'format' => '?paged=%#%',
							'current' => max( 1, get_query_var('paged') ),
							'total' => $the_query->max_num_pages,
							'prev_text'		=> esc_html__( 'Prev', 'cvio' ),
							'next_text'		=> esc_html__( 'Next', 'cvio' ),
						) );
					?>
				</div>
			</div>

			<!-- sidebar -->
			<?php get_sidebar(); ?>

			<?php else : get_template_part( 'template-parts/content', 'none' ); endif; ?>

			<div class="clear"></div>
		</div>
	</div>
<?php
get_footer();