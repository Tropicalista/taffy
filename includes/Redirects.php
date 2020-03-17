<?php
namespace Tropicalista\Taffy;

require_once(ABSPATH . "wp-admin" . '/includes/file.php');

/**
 * Frontend Pages Handler
 */
class Redirects {

    protected $redirects_file;

    public function __construct() {
        $this->redirects_file = get_home_path() . get_option( 'taffy_prefix', 'go' ) . '/redirects.txt';
    }

    public function exists() {
        return file_exists( $this->redirects_file );
    }

    public function is_writeable() {
        return is_writable( $this->redirects_file );
    }


    public function read() {
        if(!$this->exists()){
            $this->write(array());
        }
        /* Map Rows and Loop Through Them */
        $rows   = array_map('str_getcsv', file( $this->redirects_file ));

        $csv    = array();
        foreach($rows as $row) {
            $csv[] = $row;
        }

        return $csv;

    }

    public function write( $data ) {
        array_push($data, [ 'slug' => 'default', 'content' => get_home_url(), 'redirect_type' => get_option('taffy_redirect_type', 301) ]);
        $csv = '';
        foreach($data as $row) {
            $row = [ $row['slug'], $row['content'], $row['redirect_type'] ];
            $csv .= implode(',', $row) . "\n";
        }
        return $this->write_to_disk($csv);
    }

    public function update( $data ) {
        $csv = '';
        $f = $this->read();

        // Search for duplicate
        $result = array_search($data['slug'],array_column($f, 0));

        if( !empty($result) ){
            $f[$result] = $data;
        }else{
            array_push($f, [ $data['slug'], $data['content'], $data['redirect_type'] ]);
        }

        $result = array_unique($f, SORT_REGULAR);

        foreach($result as $row) {
            $csv .= implode(',', $row) . "\n";
        }
        $this->write_to_disk($csv);
        return $csv;
    }

    public function write_to_disk($data) {

        $f = fopen( $this->redirects_file, 'w+' );
        fwrite( $f, rtrim($data) );            
        fclose($f);
        return $data;
    }

}
