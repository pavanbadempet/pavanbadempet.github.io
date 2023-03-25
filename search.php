<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
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
					<h1 class="h-title">
						<?php
						/* translators: %s: search query. */
						printf( esc_html__( 'Search: %s', 'cvio' ), '<span>' . esc_html( get_search_query() ) . '</span>' );
						?>
					</h1>
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
	
	<!-- Blog -->
	<div class="section blog">
		<div class="content">

			<?php if ( have_posts() ) : ?>

			<!-- title -->
			<div class="title">
				<div class="title_inner"><?php echo esc_html__( 'Search Results', 'cvio' ); ?></div>
			</div>

			<!-- box items -->
			<div class="blog-items">
				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					/**
					 * Run the loop for the search to output the results.
					 * If you want to overload this in a child theme then include a file
					 * called content-search.php and that will be used instead.
					 */
					get_template_part( 'template-parts/content', 'search' );
				endwhile;
				?>
				<div class="pager">
					<?php
						echo paginate_links( array(
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