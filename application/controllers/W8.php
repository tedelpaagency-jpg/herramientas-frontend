<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class W8 extends CI_Controller
{
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
        $data['id']    = base64_decode($this->input->get('campaign'));
		$data['page_name']	= 'company_registration';
		$data['page_title']	= 'Fromulario de Campaña';
		
		$forms = $this->db->get_where('w8',['id'=> base64_decode($this->input->get('campaign'))])->row();
		$this->load->view('backend/forms/w8_form.php' , $data);
		
    }
    
    
    public function details($param1 = '')
    {
        $data['service_id']	= base64_decode($param1);
		$data['page_name']	= 'service_details';
		$data['page_title']	= 'Detalles';
		$this->load->view('frontend/index' , $data);
    }
    
    public function sing_up()
    {
        $this->crud_model->user_create();
        $this->session->set_flashdata('success','1');
        redirect($this->agent->referrer(),'refresh');
    }
    
    public function request($param1 = '')
    {
        $this->crud_model->insertRequest();
        $this->session->set_flashdata('success', 'Mensaje enviado.');
        redirect($this->agent->referrer(), 'refresh');
    }
    
    public function saveRequest($param1 = '')
    {
        $this->crud_model->saveRequest();
        echo json_encode(['status'=>'success','message'=>'Solicitud enviado.']);
        exit();
    }
    
    
    /* Función para mostrar contratos*/
    function saveSing($param1 = '', $param2 = '')
    {
          if (isset($_FILES['signature']) && $_FILES['signature']['error'] === UPLOAD_ERR_OK) {
              
            $md5 = md5(date('d-m-y H:i:s'));
            $fileTmpPath = $_FILES['signature']['tmp_name'];
            $fileName =  $md5.str_replace(' ', '', $_FILES['signature']['name']);
            $uploadFileDir = 'public/assets/signatures/';
            $dest_path = $uploadFileDir . $fileName;
    
            if(move_uploaded_file($fileTmpPath, $dest_path)) {
                
                $data = array(
                    'signature' => $fileName,
                    'status' => 1,
                    );
                    
                $this->db->where('id',$param1);
                $this->db->update('w8',$data);
                echo 'Archivo subido con éxito.';
                exit();
            } else {
                echo 'Error al mover el archivo subido.';
                exit();
            }
        } else {
            echo 'No se subió ningún archivo o hubo un error en la subida.';
            exit();
        }
        
    }
    
    
  
    
}
