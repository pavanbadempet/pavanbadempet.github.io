<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package cvio
 */

?>

<?php
	$blog_featured_img = get_field( 'blog_featured_img', 'option' );
?>

<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="content-box">
		<div class="single-post-text">
			<?php 
				if ( has_post_thumbnail() && ! $blog_featured_img ) : 
					the_post_thumbnail( 'full', array(
						'alt' => the_title_attribute( array(
							'echo' => false,
						)),
					) );
				endif;

				the_content(); 

				wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'cvio' ),
					'after'  => '</div>',
				) );
			?>
		</div>
		<div class="post-text-bottom">	
			<?php cvio_entry_footer(); ?>
		</div>
	</div>
</div><!-- #post-<?php the_ID(); ?> -->