<?php
namespace Tropicalista\Taffy;

require_once(ABSPATH . "wp-admin" . '/includes/file.php');

/**
 * Frontend Pages Handler
 */
class Rest_Base {

    protected $robots;

    public function __construct() {
        $this->robots = get_home_path() . get_option( 'taffy_prefix', 'go' ) . '/robots.txt';
    }

    public function permissions_check( $request ) {
        return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? true : current_user_can( 'manage_options' );
    }

    public function response( $data ) {
        return new \WP_REST_Response( $data, 200);
    }

    public function error( $message = 'An error occurred', $code = 400 ) {
        //return new \WP_REST_Response( new \WP_Error('rest_custom_error', $message, array('status' => $code) ), 200);
        return new \WP_Error( $code, $message );
    }

}
