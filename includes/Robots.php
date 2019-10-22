<?php
namespace Tropicalista\Taffy;

require_once(ABSPATH . "wp-admin" . '/includes/file.php');

/**
 * Frontend Pages Handler
 */
class Robots {

    protected $robots;

    public function __construct() {
        $this->robots = get_home_path() . 'robots.txt';
    }

    public function create($path) {

        if( 'wp-admin' == $path || 'wp-content' == $path || 'wp-includes' == $path ){
            return 'You\'re not allowed to create those folders!';
        }

        $content = $this->read_to_Array();
        $new_content = $this->modify( $content, $path );
        $this->create_folder( $path );
        return $this->write($new_content);
    }

    public function exists() {
        return file_exists( $this->robots );
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
            $robots_content = file_get_contents( $this->robots );

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

    public function modify( $content, $path ) {
        $myRule = 'Disallow: /' . $path . '/';
        // check if rule is already present
        $check = false;

        foreach($content as $i => $item) {
            if( $content[$i] == $myRule  ){
                $check = true;
            }
        }
        if(!$check){
            // Add comment to robots
            array_push($content, '# created by Taffy ' . ' prefix: ' . $path );
            array_push($content, $myRule);
        }

        return array_filter($content);
    }

    public function write($content) {
        $content = implode("\n", $content);

        if(!$this->exists()){
            $f = fopen( $this->robots, 'x' );
            fwrite( $f, $content );            
        }
        if ( is_writable( $this->robots ) ) {
            $f = fopen( $this->robots, 'w+' );

            fwrite( $f, $content );
            fclose( $f );
        }else{
            return 'robots.txt is not writeable';
        }
        return 'robots.txt created.';
    }

    public function create_folder( $path ) {
        $taffy_folder = get_home_path() . $path;
        if (!file_exists( $taffy_folder )) {
            mkdir( $taffy_folder, 0777, true );
        }
        $this->add_default();
        $this->copy_files( $path, $taffy_folder );
    }

    public function copy_files( $path_name, $taffy_folder ) {

        foreach (new \DirectoryIterator( TAFFY_PATH . '/presets' ) as $fileInfo) {
            if (!$fileInfo->isDot()) {
                copy( $fileInfo->getPathname(), $taffy_folder . '/' . $fileInfo->getFilename() );
            }
        }

    }

    public function add_default () {
        $f = fopen( TAFFY_PATH . '/presets/redirects.txt', 'w+' );

        fwrite( $f, 'default,' . get_home_url() );
        fclose( $f );
    }

}
