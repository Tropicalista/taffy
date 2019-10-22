<?php
namespace Tropicalista\Taffy;

/**
 * REST_API Handler
 */
class REST_API {

    public function __construct() {
    	$this->register_field();
    	$this->register_routes();
    }

	public function register_routes() {
		$robots = new \Tropicalista\Taffy\Rest_Robots(); 
		$redirects = new \Tropicalista\Taffy\Rest_Redirects(); 
	}

    public function register_field() {
	   register_rest_field(
	          'taffylink',
	          'content',
	          array(
	                 'get_callback'    => [ $this, 'do_raw_shortcodes' ],
	          )
	       );    	
	   	register_rest_field(
				'taffylink',
				'redirect_type',
				array(
					'get_callback'    => function( $object ){
        					$havemetafield  = get_post_meta($object['id'], 'redirect_type', true);
							if(!empty($havemetafield)){
								return $havemetafield;
							}
							return get_option('taffy_redirect_type', 301);
						},
					'update_callback' => [ $this, 'do_redirect_type' ],
				)
	       );	
    }

	public function do_raw_shortcodes( $object, $field_name, $request ){
		return $object['content']['raw'];
	}
	
	public function do_redirect_type( $value, $object, $field_name ){
        $havemetafield  = get_post_meta($object->ID, 'redirect_type', false);
        if ($havemetafield) {
        	return update_post_meta($object->ID, $field_name, $value);
        } else {
        	return add_post_meta($object->ID, $field_name, $value, true);
        }
	}
	
}