<?php
	$title = get_sub_field( 'title' );
	$pagination = get_sub_field( 'pagination' );
	$more_btn_txt = get_sub_field( 'more_btn_txt' );
	$more_btn_url = get_sub_field( 'more_btn_url' );
	$blog_count = get_sub_field( 'count' );
	$section_id = get_sub_field( 'section_id' );
?>

<?php
if ( $blog_count ) {
	$posts_per_page = $blog_count;
} else {
	$posts_per_page = get_option( 'posts_per_page' );
}

if ( get_query_var( 'paged' ) ) {
    $paged = get_query_var( 'paged' );
} elseif ( get_query_var( 'page' ) ) {
    $paged = get_query_var( 'page' );
} else {
    $paged = 1;
}

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

?>

<!-- Blog -->
<div class="section blog" <?php if ( $section_id ) : ?>id="section-<?php echo esc_attr( $section_id ); ?>"<?php endif; ?>>
	<div class="content">
		<?php if ( $the_query->have_posts() ) : ?>
		
		<!-- Title -->
		<?php if ( $title ) : ?>
		<div class="title">
			<div class="title_inner"><?php echo esc_html( $title ); ?></div>
		</div>
		<?php endif; ?>

		<!-- Blog -->
		<div class="blog-items cols">
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

			endwhile;
			?>
		</div>

		<?php if ( $pagination == 1) : ?>
		<div class="pager">
			<?php
				$big = 999999999; // need an unlikely integer

				echo paginate_links( array(
					'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
					'format' => '?paged=%#%',
					'current' => max( 1, get_query_var('paged') ),
					'total' => $the_query->max_num_pages,
					'prev_text' => esc_html__( 'Prev', 'cvio' ),
					'next_text' => esc_html__( 'Next', 'cvio' ),
				) );
			?>
		</div>
		<?php endif; ?>
		<?php if ( $pagination == 2) : ?>
		<div class="bts bts-center">
			<a class="btn hover-animated" href="<?php echo esc_url( $more_btn_url ); ?>">
				<span class="circle"></span>
				<span class="lnk"><?php echo esc_html( $more_btn_txt ); ?></span>
			</a>
		</div>
		<?php endif; wp_reset_postdata(); ?>

		<?php endif; ?>

		<div class="clear"></div>
	</div>
</div>