<?php
namespace Tropicalista\Taffy;

/**
 * REST_API Handler
 */
class Rest_Robots {

	protected $robots;

    public function __construct() {
    	$this->register_routes();
    	$this->robots = new \Tropicalista\Taffy\Robots();
    }

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$version = '1';
		$namespace = 'taffy' . '/api';

		register_rest_route( $namespace, 'robots', array(
			array(
				'methods'         => \WP_REST_Server::CREATABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'create'),
			)
		) );
		register_rest_route( $namespace, 'check', array(
			array(
				'methods'         => \WP_REST_Server::READABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'check'),
			)
		) );
	}

	public function create($request) {
		$req = $request->get_params();

		if( !empty($req['path']) ){
			$sanPath = preg_replace("/[^A-Za-z0-9 ]/", '', $req['path']);
      		$prefix = update_option( 'taffy_prefix' , $sanPath );

			return $this->robots->create($sanPath);
		}
		return false;
	}

	public function check() {
		$check = [
			'is_home_writeable' => $this->robots->is_home_writeable(),
			'prefix' => get_option( 'taffy_prefix', '' ),
			'robots' => $this->robots->read()
		];
		return $check;
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function permissions_check( $request ) {
        return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? true : current_user_can( 'manage_options' );
		//return current_user_can( 'manage_options' );
	}
	
}