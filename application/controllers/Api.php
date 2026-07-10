<?php if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Api extends CI_Controller 
{
    function __construct() 
    {
        parent::__construct();
        $this->load->model('crud_model');
        $this->load->database();
        $this->load->library('session');
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 2010 05:00:00 GMT");
    }

    
    
    public function index() 
    {
      	redirect(base_url(), 'refresh');
    }
    
   function orders()
    {
        // Verifica si los datos POST están presentes antes de registrarlos
        $datos = file_get_contents('php://input');
    
        log_message('error',json_encode(json_decode($datos,true)).' '.json_encode($this->input->post()));
            
        if (!empty($datos)) {
            // Registra los datos POST en los logs
            log_message('error', 'orden: ' .$datos);
        } else {
            log_message('error', 'No se recibieron datos POST.');
        }
        $datos = json_decode($datos,true);
        $postData = $datos['order'];
    
    // Preparar datos para orders_products
    $orderData = array(
        'product_order_id' => $postData['product_order_id'],
        'order_date'       => date('Y-m-d H:i:s'),
        'customer_id'      => $postData['customer_id'],
        'is_guest'         => isset($postData['is_guest']) ? $postData['is_guest'] : 0,
        'product_id'       => $postData['product_id'],
        'product_json'     => json_encode($postData['product_json']),
        'product_price'    => $postData['product_price'],
        'coupon_price'     => $postData['coupon_price'],
        'delivery_price'   => $postData['delivery_price'],
        'tax_price'        => $postData['tax_price'],
        'final_price'      => $postData['final_price'],
        'payment_comment'  => $postData['payment_comment'],
        'payment_type'     => $postData['payment_type'],
        'payment_status'   => $postData['payment_status'],
        'delivery_id'      => $postData['delivery_id'],
        'delivery_comment' => $postData['delivery_comment'],
        'delivered_status' => $postData['delivered_status'],
        'reward_points'    => $postData['reward_points'],
        'additional_note'  => $postData['additional_note'],
        'theme_id'         => $postData['theme_id'],
        'store_id'         => $postData['store_id'],
        'updated_at'       => date('Y-m-d H:i:s'),
        'created_at'       => date('Y-m-d H:i:s'),
        'user_name'        => $postData['user_name'],
        'vendedor'         => $datos['store']['slug']
    );
        $this->db->insert('orders_products', $orderData);
    // Insertar en la base de datos
   
        $order_id = $this->db->insert_id();
        $postData = $datos['order_billing'];
        // Insertar datos en order_billing
        $billingData = array(
            'order_products_id'  => $order_id,
            'product_order_id'   => $postData['product_order_id'],
            'first_name'         => $postData['first_name'],
            'last_name'          => $postData['last_name'],
            'email'              => $postData['email'],
            'telephone'          => $postData['telephone'],
            'address'            => $postData['address'],
            'postcode'           => $postData['postcode'],
            'country'            => $postData['country'],
            'state'              => $postData['state'],
            'city'               => $postData['city'],
            'theme_id'           => $postData['theme_id'],
            'delivery_address'   => $postData['delivery_address'],
            'delivery_city'      => $postData['delivery_city'],
            'delivery_postcode'  => $postData['delivery_postcode'],
            'delivery_country'   => $postData['delivery_country'],
            'delivery_state'     => $postData['delivery_state'],
            'updated_at'         => date('Y-m-d H:i:s'),
            'created_at'         => date('Y-m-d H:i:s')
        );

        $this->db->insert('order_billing', $billingData);
  
        
        // Prepara y envía una respuesta JSON
        $response = array('result' => 1);
        // Configura el encabezado para asegurar que la respuesta sea JSON
        $this->output->set_content_type('application/json')->set_output(json_encode($response));
    
        // No es necesario usar `exit()`, `return` puede ser una mejor práctica
        return;
    }

}
