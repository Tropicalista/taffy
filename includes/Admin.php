<?php
namespace Tropicalista\Taffy;

/**
 * Admin Pages Handler
 */
class Admin {

    public function __construct() {
        //$this->create_CPT();
        $this->my_book_cpt();
        add_action( 'admin_menu', [ $this, 'admin_menu' ] );
    }

    /**
     * Register our menu page
     *
     * @return void
     */
    public function admin_menu() {
        global $submenu;

        $capability = 'manage_options';
        $slug       = 'taffy';

        $hook = add_menu_page( __( 'Taffy Links', 'textdomain' ), __( 'Taffy Links', 'textdomain' ), $capability, $slug, [ $this, 'plugin_page' ], 'dashicons-text' );

        if ( current_user_can( $capability ) ) {
            $submenu[ $slug ][] = array( __( 'Affiliate links', 'textdomain' ), $capability, 'admin.php?page=' . $slug . '#/' );
            $submenu[ $slug ][] = array( __( 'Settings', 'textdomain' ), $capability, 'admin.php?page=' . $slug . '#/settings' );
        }

        add_action( 'load-' . $hook, [ $this, 'init_hooks'] );
    }

    /**
     * Initialize our hooks for the admin page
     *
     * @return void
     */
    public function init_hooks() {
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Load scripts and styles for the app
     *
     * @return void
     */
    public function enqueue_scripts() {
        global $wp_scripts;
        foreach( $wp_scripts->queue as $handle ) {
          if($handle != 'common'){
            wp_dequeue_script($handle);
          }
        }

        wp_enqueue_style( 'taffy-style' );
        wp_enqueue_style( 'taffy-admin' );
        wp_enqueue_script( 'taffy-admin' );
    }

    /**
     * Render our admin page
     *
     * @return void
     */
    public function plugin_page() {
    ?>
      <script type="text/javascript">
              var _nonce = "<?php echo wp_create_nonce( 'wp_rest' ); ?>";
      </script>
    <?php
        echo '<div class="wrap"><div id="vue-admin-app"></div></div>';
    }

    function my_book_cpt() {

      $prefix = get_option( 'taffy_prefix' , '' );

      $labels = array(
        'name'               => _x( 'Affiliate Links', 'post type general name', 'taffy' ),
        'singular_name'      => _x( 'Affiliate Link', 'post type singular name', 'taffy' ),
        'menu_name'          => _x( 'Links', 'admin menu', 'taffy' ),
        'name_admin_bar'     => _x( 'Link', 'add new on admin bar', 'taffy' ),
        'add_new'            => _x( 'Add New', 'link', 'taffy' ),
        'add_new_item'       => __( 'Add New Link', 'taffy' ),
        'new_item'           => __( 'New Link', 'taffy' ),
        'edit_item'          => __( 'Edit Link', 'taffy' ),
        'view_item'          => __( 'View Link', 'taffy' ),
        'all_items'          => __( 'All Links', 'taffy' ),
        'search_items'       => __( 'Search Links', 'taffy' ),
        'parent_item_colon'  => __( 'Parent Links:', 'taffy' ),
        'not_found'          => __( 'No Links found.', 'taffy' ),
        'not_found_in_trash' => __( 'No Links found in Trash.', 'taffy' )
      );
     
      $args = array(
        'labels'             => $labels,
        'description'        => __( 'Description.', 'taffy' ),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => $prefix ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => true,
        'menu_position'      => null,
        'show_in_rest'       => true,
        'exclude_from_search' => true,
        'query_var'          => true,
        'rest_base'          => 'taffylinks',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'           => array( 'title', 'editor' )
      );


      register_post_type( 'taffylink', $args );
    }


}
