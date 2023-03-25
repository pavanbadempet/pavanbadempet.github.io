<?php
/**
 * This file represents an example of the code that themes would use to register
 * the required plugins.
 *
 * It is expected that theme authors would copy and paste this code into their
 * functions.php file, and amend to suit.
 *
 * @see http://tgmpluginactivation.com/configuration/ for detailed documentation.
 *
 * @package	TGM-Plugin-Activation
 * @subpackage Example
 * @version	2.5.0
 * @author	 Thomas Griffin, Gary Jones, Juliette Reinders Folmer
 * @copyright  Copyright (c) 2011, Thomas Griffin
 * @license	http://opensource.org/licenses/gpl-2.0.php GPL v2 or later
 * @link	   https://github.com/TGMPA/TGM-Plugin-Activation
 */

/**
 * Include the TGM_Plugin_Activation class.
 */
require_once get_template_directory() . '/inc/plugins/class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'cvio_register_required_plugins' );
/**
 * Register the required plugins for this theme.
 *
 * In this example, we register five plugins:
 * - one included with the TGMPA library
 * - two from an external source, one from an arbitrary source, one from a GitHub repository
 * - two from the .org repo, where one demonstrates the use of the `is_callable` argument
 *
 * The variable passed to tgmpa_register_plugins() should be an array of plugin
 * arrays.
 *
 * This function is hooked into tgmpa_init, which is fired within the
 * TGM_Plugin_Activation class constructor.
 */
function cvio_register_required_plugins() {
	/*
	 * Array of plugin arrays. Required keys are name and slug.
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins = array(

		// This is an example of how to include a plugin bundled with a theme.
		array(
			'name'		=> esc_html__( 'Cvio Plugin', 'cvio'),
			'slug'		=> 'cvio-plugin',
			'source'	=> CVIO_EXTRA_PLUGINS_DIRECTORY . '/normal/cvio-plugin/111122/' . 'cvio-plugin.zip',
			'required'	=> true,
			'version'	=> '3.2.0',
		),

		array(
			'name'      => esc_attr__( 'Elementor', 'cvio' ),
			'slug'      => 'elementor',
			'required'  => false,
		),

		array(
			'name'		=> esc_html__( 'Envato Market', 'cvio' ),
			'slug'		=> 'envato-market',
			'source'	=> get_template_directory() . '/inc/plugins/envato-market.zip',
			'required'	=> false,
			'version'	=> '2.0.7',
		),

		array(
			'name'		=> esc_html__( 'Contact Form 7', 'cvio'),
			'slug'		=> 'contact-form-7',
			'required'  => true,
		),

		array(
			'name'		=> esc_html__( 'One Click Demo Import', 'cvio'),
			'slug'		=> 'one-click-demo-import',
			'required'	=> false,
		),

		array(
	        'name'      => esc_attr__( 'WooCommerce', 'cvio' ),
	        'slug'      => 'woocommerce',
	        'required'  => false
	  ),

	);

	if ( class_exists( 'CvioPlugin' ) ) {
		$plugins[] = array(
			'name'					=> esc_html__( 'Advanced Custom Fields Pro', 'trueman' ),
			'slug'					=> 'advanced-custom-fields-pro',
			'source'				=> CVIO_EXTRA_PLUGINS_DIRECTORY . '/normal/acf/111122/' . 'advanced-custom-fields-pro.zip',
			'required'			=> true,
			'version'				=> '6.0.5',
		);

	}

	/**
	 * Print notice if helper plugin is not installed
	 */
	if ( ! function_exists( 'cvio_plugin_notice' ) ) {
		function cvio_plugin_notice() {
			if ( class_exists( 'CvioPlugin' ) ) {
				return;
			} ?>
			<div class="notice notice-info">
				<p><?php echo sprintf( __( 'Please install / activate <strong>%s</strong> before your work with this Cvio theme.', 'cvio' ), 'Cvio Plugin' ); ?></p>
				<p><?php echo sprintf( __( '<a href="%s" class="button button-primary">Install / Activate</a>', 'cvio' ), admin_url( 'themes.php?page=tgmpa-install-plugins' ) ); ?></p>
			</div>
		<?php }
	}
	add_action( 'admin_notices', 'cvio_plugin_notice' );

	/*
	 * Array of configuration settings. Amend each line as needed.
	 *
	 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
	 * strings available, please help us make TGMPA even better by giving us access to these translations or by
	 * sending in a pull-request with .po file(s) with the translations.
	 *
	 * Only uncomment the strings in the config array if you want to customize the strings.
	 */
	$config = array(
		'id'			=> 'tgmpa',				 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path'	=> '',					  // Default absolute path to bundled plugins.
		'menu'			=> 'tgmpa-install-plugins', // Menu slug.
		'parent_slug'	=> 'themes.php',			// Parent menu slug.
		'capability'	=> 'edit_theme_options',	// Capability needed to view plugin install page, should be a capability associated with the parent menu used.
		'has_notices'	=> true,					// Show admin notices or not.
		'dismissable'	=> true,					// If false, a user cannot dismiss the nag message.
		'dismiss_msg'	=> '',					  // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic'	=> false,				   // Automatically activate plugins after installation or not.
		'message'		=> '',					  // Message to output right before the plugins table.
	);

	tgmpa( $plugins, $config );
}
