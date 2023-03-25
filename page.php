<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package cvio
 */

get_header();
?>

	<?php while ( have_posts() ) : the_post(); ?>

	<?php get_template_part( 'template-parts/start-section' ); ?>
	
	<!-- Page -->
	<div class="section blog s-page">
		<div class="content">
			<?php
				get_template_part( 'template-parts/content', 'page' );

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;
			?>
			<div class="clear"></div>
		</div>
	</div>
	
	<?php endwhile; ?>

<?php
get_footer();
