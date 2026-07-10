<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Card extends CI_Controller {

    function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
		$this->output->set_header('Pragma: no-cache');
		$this->load->library('user_agent');
		$this->load->library('session');
    }

	public function index()
    {
        log_message('error','Usuario '.base64_decode($this->input->get('user_id')));
        
        $data['user_id']    = base64_decode($this->input->get('user_id'));
		$data['page_name']	= 'card';
		$data['page_title']	= 'Perfil público';
		$this->load->view('backend/card/card.php' , $data);
    }

    // Agregar un producto al carrito
    public function add_to_cart($product_id) {
        
        log_message('error','Cantidad '.$this->input->post('ec_qtybtn'));
        
        $quantity   = $this->input->post('ec_qtybtn') != ''? $this->input->post('ec_qtybtn') : 1;

        $product = $this->db->get_where('productos',['id'=>$product_id])->row();

        if ($product) {
            $data = array(
                'id'      => $product->id,
                'qty'     => $quantity,
                'price'   => $product->suggested_price  + $this->crud_model->getInfo('cost_sale_price'),
                'sale_price'   => $product->sale_price + $this->crud_model->getInfo('cost_price'),
                'name'    => 'Producto',
                'options' => array('nombre_real' => $product->name) // con tildes
            );

            $this->cart->insert($data);
        }
        
        $this->session->set_userdata('current_supplier',$product->supplier_id);

        echo json_encode(['success' => true,'items'=>count($this->cart->contents())]);
       exit();
    }

   

    public function procesar_pedido() {
        $cart_data = $this->input->post('cart');
    
        if (!empty($cart_data)) {
            foreach ($cart_data as $rowid => $item) {
                $data = array(
                    'rowid' => $rowid,
                    'qty'   => $item['qty'],  // Se actualiza la cantidad
                    'price'   => $item['price']
                );
    
                $this->cart->update($data);
            }
        }
        
       
    
        $this->session->set_flashdata('success', 'Carrito actualizado');
        redirect($this->agent->referrer(), 'refresh');
    }

    // Eliminar un producto del carrito
    public function remove($rowid) {
        $this->cart->remove($rowid);
        
        if(count($this->cart->contents()) == 0)
        {
            $this->session->set_userdata('current_supplier','');
        }
        
        $this->session->set_flashdata('success', 'Eliminado del carrito');
        redirect($this->agent->referrer(), 'refresh');
    }

    // Vaciar el carrito
    public function clear() {
        $this->cart->destroy();
        $this->session->set_flashdata('success', 'Carrito limpio');
        redirect($this->agent->referrer(), 'refresh');
    }
    
         
    function saveSale()
    {
       $seller = explode('_',base64_decode($this->input->post('seller')));
       log_message('error','seler '.$seller);
        // Recoger datos del formulario
        $data = array(
            'name' => $this->input->post('name'),
            'last_name' => $this->input->post('last_name'),
            'phone' => $this->input->post('phone'),
            'email' => $this->input->post('email'),
            'pais' => $this->input->post('pais'),
            'provincia' => $this->input->post('provincia'),
            'canton' => $this->input->post('canton'),
            'address' => $this->input->post('address'),
            'recaudo' => $this->input->post('recaudo'),
            'numero_transferencia' => $this->input->post('numero_transferencia'),
            'seller_id' => $seller[1],
            'seller_type' => $seller[0],
            'status' => 0
        );
       
        $array_products = array();
        $total_cost     = 0;
        $total_price    = 0;
        $grand_total    = 0;
        
        
       foreach ($this->cart->contents() as $product)
        {
            $details = $this->db->get_where('productos',['id'=>$product['id']])->row_array();
            
            $array_products[] = $product;
                
            $total_cost     += $details['costo'];
            $total_price    += $product['price'];
            $grand_total    += $product['price'] * $product['qty'];
            
        }
        
        $data['products']       = json_encode($array_products);
        $data['total_cost']     = $total_cost;
        $data['total_price']    = $total_price;
        $data['grand_total']    = $grand_total;
        $data['total_delivery'] = $this->crud_model->getInfo('cost_delivery');
        
        $this->db->insert('product_sales',$data);
        
        $sale_id = $this->db->insert_id();
        
         foreach ($this->cart->contents() as $product)
        {
            $details = $this->db->get_where('productos',['id'=>$product['id']])->row_array();
            $dataDetails['product_id']   = $product['id'];
            $dataDetails['supplier_id']  = $details['supplier_id'];
            $dataDetails['price']        = $product['price'];
            $dataDetails['sale_price']   = $product['sale_price'];
            $dataDetails['cantidad']     = $product['qty'];
            $dataDetails['sale_id']      = $sale_id;
            $dataDetails['status']       = 0;
            $this->db->insert('product_sales_details',$dataDetails);
        }
        
        $this->cart->destroy();
        
         $this->session->set_userdata('cart_aditional','');
        
        $this->session->set_flashdata('success', 'Pedido enviado');
        redirect($this->agent->referrer(), 'refresh');
    }
    
    
    
    function getProducts()
    {
         $this->load->view('backend/'.$this->session->userdata('login_type').'/pos_products.php', $page_data);
        
    }
    
      function getProducts2($param1 = '')
    {
        $page_data['seller'] = $param1;
         $this->load->view('frontend/cart.php', $page_data);
        
    }
}
?>
