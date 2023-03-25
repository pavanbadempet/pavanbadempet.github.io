<?php
/**
 * Template Name: Elementor builder
 * Template Post Type: page, portfolio
 *
 * @package cvio
*/

get_header(); 
?>

<?php
	while ( have_posts() ) : the_post(); ?>
		<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<?php the_content(); ?>
		</div><!-- #post-<?php the_ID(); ?> -->
<?php endwhile; ?>
	
<?php
get_footer();