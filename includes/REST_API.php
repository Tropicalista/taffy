<?php
namespace Tropicalista\Taffy;

/**
 * REST_API Handler
 */
class REST_API extends Rest_Base {

	protected $robots;

    public function __construct() {
    	$this->register_field();
    	$this->register_routes();
    	$this->robots = new \Tropicalista\Taffy\Robots();
    }

	public function register_routes() {
		$redirects = new \Tropicalista\Taffy\Rest_Redirects(); 
		$settings = new \Tropicalista\Taffy\Rest_Settings(); 
	}

    public function register_field() {
		register_rest_field(
			'taffylink',
			'content',
			array(
				'get_callback'    => function($object){
					return get_post_meta($object['id'], '_taffy_destination');
					return get_post_meta($object['id'], 'destination', true);
					return $object['content']['raw'];
				}
			)
		);	
		register_rest_field(
			'taffylink',
			'link_type',
			array(
				'get_callback'    => [ $this, 'get_link_type' ],
				'update_callback' => [ $this, 'update_link_type' ],
			)
		);    	
	   	register_rest_field(
			'taffylink',
			'redirect_type',
			array(
				'get_callback' => [ $this, 'get_redirect_type' ],
				'update_callback' => [ $this, 'update_redirect_type' ],
			)
       );	
    }

	public function get_link_type( $object, $field_name, $request ){
		$havemetafield  = get_post_meta($object['id'], 'link_type', true);

		if(!empty($havemetafield)){
			return $havemetafield;
		}					
		return 'custom';
	}

	public function update_link_type( $value, $object, $field_name ){

        $havemetafield  = get_post_meta($object->ID, 'link_type', 'custom');
     
		if ($havemetafield) {
        	return update_post_meta($object->ID, $field_name, $value);
        } else {
        	return add_post_meta($object->ID, $field_name, $value, true);
        }
	}
	
	public function get_redirect_type( $object ){
		$havemetafield  = get_post_meta($object['id'], 'redirect_type', true);

		if(!empty($havemetafield)){
			return $havemetafield;
		}					
		return get_option('taffy_redirect_type', 301);
	}
	
	public function update_redirect_type( $value, $object, $field_name ){
        $havemetafield  = get_post_meta($object->ID, 'redirect_type', false);
        if ($havemetafield) {
        	return update_post_meta($object->ID, $field_name, $value);
        } else {
        	return add_post_meta($object->ID, $field_name, $value, true);
        }
	}

}