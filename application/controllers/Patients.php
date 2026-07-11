<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Patients extends CI_Controller {

    public function __construct()
    {
        parent::__construct();

        // Validar sesión
        if ($this->session->userdata('user_login') != 1)
        {
            redirect(base_url(), 'refresh');
        }
            
        
        $this->load->database();
        $this->load->library('user_agent');
        $this->load->library('session');
        $this->load->model('Patients_model');
    }
    
    public function index( $page = 0)
    {
        $this->load->library('pagination');
        $rol_id = 8;
        $limit = 5;
        $offset = $page;
    
        // Filtro base
        $total = $this->Patients_model->get_patients_count(null, null);
    
        // Config paginación
        $config['base_url'] = base_url('portal/patients/index/' . $rol_id);
        $config['total_rows'] = $total;
        $config['per_page'] = $limit;
        $config['uri_segment'] = 5;
    
        $config['reuse_query_string'] = true;
    
        $this->pagination->initialize($config);
    
        // Datos
        $data['users'] = $this->Patients_model->get_patients($limit, $offset, null, null);
    
        $data['rol_id'] = $rol_id;
        $data['links'] = $this->pagination->create_links();
        
        
        $data['rol_id']     = 8;
        $data['page_name']  = 'patients/patients';
        $data['page_title'] = "Pacientes";
        $this->load->view('backend/index', $data);
    }
    
    public function ajax_list($page = 1)
    {
        $this->load->library('pagination');
        $this->load->helper('pagination');
        $limit = 5;
        $offset = ($page - 1) * $limit;
    
        $search = $this->input->post('search');
        $rol_id = 8;
    
        $total = $this->Patients_model->get_patients_count($search, null);
    
        // Query datos
        $data['users'] = $this->Patients_model->get_patients($limit, $offset, $search, null);
    
        // paginación manual (AJAX)
        $config['base_url'] = '#';
        $config['total_rows'] = $total;
        $config['per_page'] = $limit;
        $config['use_page_numbers'] = TRUE;
    
        $this->pagination->initialize($config);
    
        $data['links'] = ajax_pagination_links($total, $limit, $page);
    
        $this->load->view('backend/'.$this->session->userdata('login_type').'/patients/list', $data);
    }


    function patient_profile($param1 = '', $param2 = '')
    {

        $this->load->model('Background_types_model');

        $page_data['background_types'] =
        $this->Background_types_model->get_background_types(
            $this->session->userdata('current_agency')
        );
        
        $page_data['values'] =
        $this->Background_types_model->get_patient_backgrounds(
            $this->session->userdata('current_agency'),
            base64_decode($param1)
        );
        
        $page_data['user_id']       = base64_decode($param1);
        $page_data['page_name']     = 'patients/patient_profile';
        $page_data['page_title']    = "Perfil del paciente";
        $this->load->view('backend/index', $page_data);

    }
    
    public function load_more_consultations()
    {
        $offset = (int)$this->input->post('offset');
        $patient_id = (int)$this->input->post('patient_id');
        $agency_id = $this->session->userdata('current_agency');
    
        $consultations = $this->Patients_model->get_patient_consultations($patient_id, $agency_id, 5, $offset);
    
        if (empty($consultations) && $offset > 0)
        {
            echo json_encode([
                'success'  => true,
                'html'     => '',
                'has_more' => false
            ]);
            exit;
        }
    
        $html = $this->load->view(
            'backend/'.$this->session->userdata('login_type').'/patients/patient_app_chunk',
            [
                'consultations' => $consultations
            ],
            true
        );
    
        echo json_encode([
            'success'  => true,
            'html'     => $html,
            'has_more' => (count($consultations) == 5)
        ]);
        exit;
    }
    
    public function patient_backgrounds($patient_id)
    {
        $this->load->model('Background_types_model');
    
        $agency_id = $this->session->userdata('current_agency');
    
        $page_data['patient'] = $this->Patients_model->get_patient_by_id($patient_id, null);
    
        $page_data['background_types'] =
            $this->Background_types_model
            ->get_background_types($agency_id);
    
        $page_data['values'] =
            $this->Background_types_model
            ->get_patient_backgrounds($agency_id, $patient_id);
    
        $page_data['page_name'] = 'patients/backgrounds';
        $page_data['page_title'] = 'Antecedentes Médicos';
    
        $this->load->view('backend/index', $page_data);
    }
    
    public function save_patient_backgrounds($patient_id)
    {
        $this->load->model('Background_types_model');
    
        $agency_id = $this->session->userdata('current_agency');
    
        $background_types = $this->Background_types_model
            ->get_background_types($agency_id);
    
        foreach ($background_types as $field)
        {
            $this->Background_types_model->save_patient_value(
                $agency_id,
                $patient_id,
                $field['id'],
                $this->input->post('background_'.$field['id'])
            );
        }
    
        $this->session->set_flashdata(
            'success',
            'Antecedentes guardados correctamente.'
        );
    
        redirect('portal/patient_profile/'.base64_encode($patient_id));
    }
    
    function search_patient()
    {
        $search = $this->input->post('search');

        $data = $this->Patients_model->search_patients($search, 10, null);

        foreach($data as $row){
            $row->age = !empty($row->birthday) ? $this->crud_model->calcularEdad($row->birthday) : null;
        }

        echo json_encode($data);
        exit;
    }


    public function save()
    {
        if ($this->input->method() !== 'post') {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status'  => 'error',
                'message' => 'Método no permitido. Use POST.'
            ]);
            exit;
        }

        $response = $this->crud_model->save_patient();

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response);
        exit;
    }

}