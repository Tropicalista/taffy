<?php
namespace Tropicalista\Taffy;

require_once(ABSPATH . "wp-admin" . '/includes/file.php');

/**
 * Frontend Pages Handler
 */
class Robots {

    protected $robots_file;

    public function __construct() {
        $this->robots_file = get_home_path() . 'robots.txt';
    }

    public function create( $prefix ) {
        $content = $this->read_to_Array();
        $new_content = $this->modify( $content, $prefix );

        return $this->write($new_content);
    }

    public function exists() {
        return file_exists( $this->robots_file );
    }

    public function is_home_writeable() {
        return is_writable( get_home_path() );
    }

    public function read() {

        if(!$this->exists()){
            // read default
            ob_start();
            error_reporting( 0 );
            do_robots();
            $robots_content = ob_get_clean();
        }else{
            $robots_content = file_get_contents( $this->robots_file );

        }
        return $robots_content;

    }

    public function read_to_Array() {

        $robots_content = $this->read();
        return $this->to_array($robots_content);

    }

    public function to_array( $content ) {
        $robots_content = explode("\n", $content );

        return $robots_content;
    }

    public function modify( $content, $prefix ) {
        $myRule = 'Disallow: /' . $prefix . '/';
        // check if rule is already present
        $check = false;

        foreach($content as $i => $item) {
            if( $content[$i] == $myRule  ){
                $check = true;
            }
        }
        if(!$check){
            // Add comment to robots
            array_push($content, '# created by Taffy ' . ' prefix: ' . $prefix );
            array_push($content, $myRule);
        }

        return array_filter($content);
    }

    public function write($content) {
        $content = implode("\n", $content);

        $f = fopen( $this->robots_file, 'w+' );

        fwrite( $f, $content );
        fclose( $f );

        return $content;
    }

}
