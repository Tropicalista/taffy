<?php
namespace Tropicalista\Taffy;

/**
 * REST_API Handler
 */
class Rest_Redirects extends Rest_Base {

	protected $redirects;

    public function __construct() {
    	$this->register_routes();
    	$this->redirects = new \Tropicalista\Taffy\Redirects();
    }

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$version = '1';
		$namespace = 'taffy' . '/api';

		register_rest_route( $namespace, 'redirects', array(
			array(
				'methods'         => \WP_REST_Server::READABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'read'),
			)
		) );
		register_rest_route( $namespace, 'redirects', array(
			array(
				'methods'         => \WP_REST_Server::CREATABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'create'),
			)
		) );
		register_rest_route( $namespace, 'redirects', array(
			array(
				'methods'         => \WP_REST_Server::EDITABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'update'),
			)
		) );
	}

	public function read() {
    	return $this->redirects->read();
	}

	public function create($request) {
		$req = $request->get_params();

    	return $this->redirects->write($req);
	}

	public function update($request) {
		$req = $request->get_params();

    	return $this->redirects->update($req);
	}
	
}