<?php

if ( class_exists( 'CvioPlugin' ) ) {

function cvio_ocdi_import_files() {
	return array(
    array(
        'import_file_name'             => 'Default (Elementor)',
        'categories'                   => array( 'Elementor' ),
        'import_file_url'            => CVIO_EXTRA_PLUGINS_DIRECTORY . '/normal/ocdi-import/demo/e01/content.xml',
        'import_preview_image_url'     => CVIO_EXTRA_PLUGINS_DIRECTORY . '/normal/ocdi-import/demo/e01/preview.jpg',
        'preview_url'                  => esc_url( 'https://1.envato.market/c/1790164/275988/4415?u=https://themeforest.net/item/cvio-cv-resume-wordpress-theme/full_screen_preview/25607381' ),
    ),
		array(
        'import_file_name'             => 'Default (ACF)',
        'categories'                   => array( 'Original' ),
        'import_file_url'            => CVIO_EXTRA_PLUGINS_DIRECTORY . '/normal/ocdi-import/demo/01/content.xml',
        'import_preview_image_url'     => CVIO_EXTRA_PLUGINS_DIRECTORY . '/normal/ocdi-import/demo/01/preview.jpg',
        'preview_url'                  => esc_url( 'https://1.envato.market/c/1790164/275988/4415?u=https://themeforest.net/item/cvio-cv-resume-wordpress-theme/full_screen_preview/25607381' ),
    ),
	);
}
add_filter( 'pt-ocdi/import_files', 'cvio_ocdi_import_files' );

function cvio_ocdi_after_import_setup( $selected_import ) {

	// Assign posts page (blog page).
	$blog_page_id  = get_page_by_title( 'Blog' );
	update_option( 'page_for_posts', $blog_page_id->ID );
	update_option( 'posts_per_page', 4 );

    // options fields
	$ocdi_fields_static = array(
		'options_theme_ui' => 0,
		'_options_theme_ui' => 'field_5c5b911f422d5',
		'options_cursor_follow' => 1,
		'_options_cursor_follow' => 'field_5dfcdc2c03cee',
		'options_theme_bg_color' => '#101010',
		'_options_theme_bg_color' => 'field_5b86baa686d10',
		'options_lines_color' => 0,
		'_options_lines_color' => 'field_5e27640d06113',
		'options_theme_color' => '#4bffa5',
		'_options_theme_color' => 'field_5b68d509665d9',
		'options_heading_color' => '#ffffff',
		'_options_heading_color' => 'field_5b68d5d8665da',
		'options_subtitle_color' => '#ffffff',
		'_options_subtitle_color' => 'field_5c5b9655742c2',
		'options_text_color' => '#bbbbbb',
		'_options_text_color' => 'field_5b68d617665db',
		'options_text_link_color' => '#eeeeee',
		'_options_text_link_color' => 'field_5c5b9878742c5',
		'options_heading_font_size' => '',
		'_options_heading_font_size' => 'field_5b68d2bdef00b',
		'options_heading_font_family' => 0,
		'_options_heading_font_family' => 'field_5b68cfc4906fc',
		'options_text_font_size' => '',
		'_options_text_font_size' => 'field_5b68d31eef00c',
		'options_text_font_family' => 0,
		'_options_text_font_family' => 'field_5b68d188906fd',
		'options_menu_font_size' => '',
		'_options_menu_font_size' => 'field_5c5e6b8645610',
		'options_menu_font_color' => '',
		'_options_menu_font_color' => 'field_5e27576eb5dfb',
		'options_header_logo_type' => 0,
		'_options_header_logo_type' => 'field_5d543aa1c80d0',
        'options_header_logo_text' => 'Alejandro <strong>Abeyta</strong>',
        '_options_header_logo_text' => 'field_5d543b00c80d1',
        'options_header_logo_btn' => 1,
        '_options_header_logo_btn' => 'field_5dfcd5757398a',
        'options_header_logo_btn_label' => 'Download <strong>CV</strong>',
        '_options_header_logo_btn_label' => 'field_5dfcd6057398b',
        'options_header_logo_btn_link' => 'a:3:{s:5:"title";s:13:"Home Personal";s:3:"url";s:32:"https://cvio-demo.bslthemes.com/";s:6:"target";s:0:"";}',
        '_options_header_logo_btn_link' => 'field_5dfcea64dce33',
        'options_header_logo_font_size' => '',
        '_options_header_logo_font_size' => 'field_5d543b577867c',
        'options_header_logo_font_color' => '',
        '_options_header_logo_font_color' => 'field_5e275bd30aca4',
        'options_header_logo_font_family' => 0,
        '_options_header_logo_font_family' => 'field_5d543b4b7867b',
        'options_copyright' => '<p>E: alejandroa@gmail.com</p><p>T: +1 (234) 567 80 98</p>',
        '_options_copyright' => 'field_5b68cceac1b66',
        'options_social_links' => 4,
        '_options_social_links' => 'field_5b68ccabc1b63',
        'options_social_share' => 'a:4:{i:0;s:8:"facebook";i:1;s:7:"twitter";i:2;s:8:"linkedin";i:3;s:9:"pinterest";}',
        '_options_social_share' => 'field_5c610c399cf20',
        'options_blog_subtitle' => 'Latest Posts',
        '_options_blog_subtitle' => 'field_5b81b67430cb8',
        'options_blog_categories' => 0,
        '_options_blog_categories' => 'field_5b81b6d930cb9',
        'options_blog_excerpt' => 0,
        '_options_blog_excerpt' => 'field_5b81b7ca30cba',
        'options_blog_featured_img' => 1,
        '_options_blog_featured_img' => 'field_5b81b84430cbb',
        'options_portfolio_qv' => 1,
        '_options_portfolio_qv' => 'field_5b81d5104b42a',
        'options_portfolio_featured_img' => 1,
        '_options_portfolio_featured_img' => 'field_5c61895c95df6',
        'options_portfolio_hide_single_link' => 0,
        '_options_portfolio_hide_single_link' => 'field_5c5e7613c4e17',
        'options_portfolio_hide_desc' => 0,
        '_options_portfolio_hide_desc' => 'field_5c5e93ed40863',
        'options_social_links_0_icon' => 'fab fa-linkedin-in',
        '_options_social_links_0_icon' => 'field_5b68cccfc1b64',
        'options_social_links_0_url' => 'https://www.linkedin.com/',
        '_options_social_links_0_url' => 'field_5b68ccd7c1b65',
        'options_social_links_1_icon' => 'fab fa-github',
        '_options_social_links_1_icon' => 'field_5b68cccfc1b64',
        'options_social_links_1_url' => 'https://github.com/',
        '_options_social_links_1_url' => 'field_5b68ccd7c1b65',
        'options_social_links_2_icon' => 'fab fa-facebook-f',
        '_options_social_links_2_icon' => 'field_5b68cccfc1b64',
        'options_social_links_2_url' => 'https://www.facebook.com/',
        '_options_social_links_2_url' => 'field_5b68ccd7c1b65',
        'options_social_links_3_icon' => 'fab fa-instagram',
        '_options_social_links_3_icon' => 'field_5b68cccfc1b64',
        'options_social_links_3_url' => 'https://www.instagram.com/',
        '_options_social_links_3_url' => 'field_5b68ccd7c1b65',
        'options_p404_title' => '',
        '_options_p404_title' => 'field_5e2da2acca7bf',
        'options_p404_text' => '',
        '_options_p404_text' => 'field_5e2da2b7ca7c0',
	);
	$ocdi_fields_to_change = array();

    if( 'Default (Elementor)' === $selected_import['import_file_name'] ) {

        // Assign front page.
        $front_page_id = get_page_by_title( 'Home Personal (Elementor)' );
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $front_page_id->ID );

        // Assign menus to their locations.
        $main_menu = get_term_by( 'name', 'TopMenu (Elementor)', 'nav_menu' );
        set_theme_mod( 'nav_menu_locations', array(
                'primary' => $main_menu->term_id,
            )
        );

        // options fields
        $ocdi_fields_to_change = array();
    }

	if( 'Default (ACF)' === $selected_import['import_file_name'] ) {

        // Assign front page.
        $front_page_id = get_page_by_title( 'Home Personal' );
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $front_page_id->ID );

		// Assign menus to their locations.
		$main_menu = get_term_by( 'name', 'TopMenu', 'nav_menu' );
		set_theme_mod( 'nav_menu_locations', array(
				'primary' => $main_menu->term_id,
			)
		);

        // options fields
		$ocdi_fields_to_change = array();
	}

	global $wpdb;
	foreach ( array_merge( $ocdi_fields_static, $ocdi_fields_to_change ) as $field => $value ) {
		if ( $wpdb->get_var( 'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'options WHERE option_name = \'' . $field . '\'' ) == 0 ) {
			$wpdb->insert( $wpdb->prefix . 'options', array( 'option_value' => $value, 'option_name' => $field, 'autoload' => 'no' ), array( '%s', '%s', '%s' ) );
		} else {
			$wpdb->update( $wpdb->prefix . 'options', array( 'option_value' => $value ), array( 'option_name' => $field ) );
		}
	}

}
add_action( 'pt-ocdi/after_import', 'cvio_ocdi_after_import_setup' );

}
