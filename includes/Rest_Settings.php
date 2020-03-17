<?php
namespace Tropicalista\Taffy;

/**
 * REST_API Handler
 */
class Rest_Settings extends Rest_Base {

	protected $robots;
	protected $redirects;
	
    public function __construct() {
    	$this->register_routes();
    	$this->robots = new \Tropicalista\Taffy\Robots();
    	$this->redirects = new \Tropicalista\Taffy\Redirects();
    }

	public function register_routes() {

		$version = '1';
		$namespace = 'taffy' . '/api';

		register_rest_route( $namespace, 'config', array(
			array(
				'methods'         => \WP_REST_Server::READABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'config'),
			)
		) );
		register_rest_route( $namespace, 'settings', array(
			array(
				'methods'         => \WP_REST_Server::READABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'read'),
			)
		) );
		register_rest_route( $namespace, 'settings', array(
			array(
				'methods'         => \WP_REST_Server::CREATABLE,
				'permission_callback' => array( $this, 'permissions_check' ),
				'callback'        => array($this, 'update'),
			)
		) );
	}

	public function config() {
		return get_option( 'taffy_config', [] );
	}
	
	public function read() {
		$check = [
			'is_home_writeable' => $this->robots->is_home_writeable(),
			'prefix' => get_option( 'taffy_prefix', 'go' ),
			'redirect_type' => get_option( 'taffy_redirect_type', '' ),
			'robots' => $this->robots->read(),
			'redirects' => $this->redirects->read()
		];
		return $this->response($check);
	}
	
	public function update($request) {
		$req = $request->get_params();

		$prefix = preg_replace("/[^A-Za-z0-9 ]/", '', $req['path']);
		if( empty($prefix) || "custom" == $prefix ){
			return $this->error( 'The path cannot be empty', 400 );
		}
        if( 'wp-admin' == $prefix || 'wp-content' == $prefix || 'wp-includes' == $prefix ){
			return $this->error( 'You\'re not allowed to create this folder!', 400 );
        }
		if( !$this->exists( $prefix ) ){
			$this->addDefault( $req['redirect_type'] );
			$this->copyFolder( $prefix );
		}
		$robots = $this->robots->create( $prefix );
		update_option( 'taffy_prefix', $prefix );
		update_option( 'taffy_redirect_type', $req['redirect_type'] );
		update_option( 'taffy_config', [
			'path' => $prefix,
			'rebrandly' => $req['rebrandly'],
			'redirect_type' => $req['redirect_type']
		] );

		$req['robots'] = $robots;

		return $this->response($req);
	}
	
	public function copyFolder( $prefix ) {
		$finalPath = get_home_path() . $prefix;
		$basePath = TAFFY_PATH . '/presets';

		if(!file_exists( $finalPath )){
            mkdir( $finalPath, 0777, true );
		}		
		$this->copy_files( $basePath, $finalPath );	
	}

    public function addDefault( $redirect_type ) {
        $f = fopen( TAFFY_PATH . '/presets/redirects.txt', 'w+' );

        fwrite( $f, 'default,' . get_home_url() . ',' . $redirect_type );
        fclose( $f );
    }

    public function copy_files( $path_name, $taffy_folder ) {

        foreach (new \DirectoryIterator( TAFFY_PATH . '/presets' ) as $fileInfo) {
            if (!$fileInfo->isDot()) {
                copy( $fileInfo->getPathname(), $taffy_folder . '/' . $fileInfo->getFilename() );
            }
        }

    }

    public function exists( $prefix ){
		$finalPath = get_home_path() . $prefix;
		$basePath = TAFFY_PATH . '/presets';

		if(!file_exists( $finalPath )){
			return false;
		}
		return true;
    }

}