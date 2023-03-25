<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package cvio
 */

?>

<?php
// quick view
$portfolio_qv = get_field( 'portfolio_qv', 'option' );
$portfolio_hide_desc = get_field( 'portfolio_hide_desc', 'options' );
$portfolio_hide_single_link = get_field( 'portfolio_hide_single_link', 'options' );

// get categories
$current_categories = get_the_terms( get_the_ID(), 'portfolio_categories' );
$categories_string = '';
if ( $current_categories && ! is_wp_error( $current_categories ) ) {
	$arr_keys = array_keys( $current_categories );
	$last_key = end( $arr_keys );
	foreach ( $current_categories as $key => $value ) {
		if ( $key == $last_key ) {
			$categories_string .= $value->name . ' ';
		} else {
			$categories_string .= $value->name . ', ';
		}
	}
}

// get portfolio type
$type = get_field( 'portfolio_type' );
$popup_url = '#popup-' . get_the_ID();
$popup_class = 'has-popup-media';
$preview_icon = 'fas fa-plus';
$popup_link_target = false;
$images = false;
$btn_text = get_field( 'button_text' );
$btn_url = get_field( 'button_url' );

if ( $type == 2 ) {
	$popup_url = get_the_post_thumbnail_url( get_the_ID(), 'cvio_680x680' );
	$popup_class = 'has-popup-image';
	$preview_icon = 'fas fa-image';
} elseif ( $type == 3 ) {
	$popup_url = get_field( 'video_url' );
	$popup_class = 'has-popup-video';
	$preview_icon = 'fas fa-video';
} elseif ( $type == 4 ) {
	$popup_url = get_field( 'music_url' );
	$popup_class = 'has-popup-music';
	$preview_icon = 'fas fa-music';
} elseif ( $type == 5 ) {
	$popup_url = '#gallery-' . get_the_ID();
	$popup_class = 'has-popup-gallery';
	$preview_icon = 'fas fa-images';
	$images = get_field('gallery' );
} elseif ( $type == 6 ) {
	$popup_url = $btn_url;
	$popup_link_target = true;
	$popup_class = 'has-popup-link';
	$preview_icon = 'fas fa-link';
} else { }
?>

<div class="box-item">
	<div class="image">
		<?php if ( ($portfolio_qv && $portfolio_hide_single_link) || ($portfolio_qv && !$portfolio_hide_single_link) ) : ?>
		<a href="<?php echo esc_url( $popup_url ); ?>" class="<?php echo esc_attr( $popup_class ); ?> hover-animated"<?php if ( $popup_link_target ) : ?> target="_blank"<?php endif; ?>>
		<?php else : ?>
		<a href="<?php echo esc_url( get_permalink() ); ?>" class="hover-animated"<?php if ( $popup_link_target ) : ?> target="_blank"<?php endif; ?>>
		<?php endif; ?>
			<?php if ( has_post_thumbnail() ) : 
				the_post_thumbnail( 'cvio_680x680' );
			endif; ?>
			<span class="info circle">
				<span class="centrize full-width">
					<span class="vertical-center">
						<span class="icon <?php echo esc_attr( $preview_icon ); ?>"></span>
					</span>
				</span>
			</span>
		</a>
		<?php if( $images ) : ?>
		<div id="gallery-<?php echo esc_attr( get_the_ID() ); ?>" class="mfp-hide">
			<?php foreach( $images as $image ): ?>
				<?php $gallery_img_src = wp_get_attachment_image_src( $image['ID'], 'full' ); ?>
				<a href="<?php echo esc_url( $gallery_img_src[0] ); ?>" title="<?php echo esc_attr( $image['title'] ); ?>"></a>
			<?php endforeach; ?>
		</div>
		<?php endif; ?>
	</div>
	<?php if ( ! $portfolio_hide_desc ) : ?>
	<span class="desc">
		<?php if ( $portfolio_hide_single_link ) : ?>
		<a href="<?php echo esc_url( $popup_url ); ?>" class="name <?php echo esc_attr( $popup_class ); ?>"<?php if ( $popup_link_target ) : ?> target="_blank"<?php endif; ?>><?php the_title(); ?></a>
		<?php else : ?>
		<a href="<?php echo esc_url( get_permalink() ); ?>" class="name"<?php if ( $popup_link_target ) : ?> target="_blank"<?php endif; ?>><?php the_title(); ?></a>
		<?php endif; ?>
		<?php if ( $categories_string ) : ?>
		<span class="category"><?php echo esc_html( $categories_string ); ?></span>
		<?php endif; ?>
	</span>
	<?php endif; ?>
	<?php if ( $portfolio_qv ) : ?>
	<div id="popup-<?php the_ID(); ?>" class="popup-box mfp-fade mfp-hide">
		<div class="content">
			<div class="image">
				<?php if ( has_post_thumbnail() ) : 
					the_post_thumbnail( 'cvio_680x680' );
				endif; ?>
			</div>
			
			<div class="desc single-post-text">
				<?php if ( $categories_string ) : ?>
				<div class="category"><?php echo esc_html( $categories_string ); ?></div>
				<?php endif; ?>
				<h4><?php the_title(); ?></h4>
				<?php the_content(); ?>
				<?php if ( $btn_url || $btn_text ) : ?>
				<a href="<?php echo esc_url( $btn_url ); ?>" target="_blank" class="btn hover-animated">
					<span class="circle"></span>
					<span class="lnk">
						<?php
						
						if ( $btn_text && $btn_text != '' ) {
							echo esc_html( $btn_text );
						} else {
							echo esc_html__( 'View Project', 'cvio' );
						}

						?>	
					</span>
				</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<?php endif; ?>
</div>