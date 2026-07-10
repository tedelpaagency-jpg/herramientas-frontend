<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Form extends CI_Controller
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
        $data['campaign']    = base64_decode($this->input->get('campaign'));
		$data['page_name']	= 'company_registration';
		$data['page_title']	= 'Fromulario de Campaña';
		
		$forms = $this->db->get_where('forms',['forms_id'=> base64_decode($this->input->get('campaign'))])->row();
		
		
		if($forms->type == 0)
		{
		    $this->load->view('backend/forms/agency_requests.php' , $data);
		}
		else 
		{
		    $data['form']	= $forms;
		    $this->load->view('backend/forms/forms.php' , $data);
		}
		
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
    
     public function insertRequest($param1 = '')
    {
        $this->crud_model->insertRequest();
        $this->session->set_flashdata('success', 'Mensaje enviado.');
        redirect($this->agent->referrer(), 'refresh');
    }
    
  
    
}
