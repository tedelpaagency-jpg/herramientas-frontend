<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Plans extends CI_Controller {

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
       
		$data['page_name']	= 'plans';
		$data['page_title']	= 'Planes';
		$this->load->view('backend/plans/plans.php' , $data);
    }

    
}
?>
