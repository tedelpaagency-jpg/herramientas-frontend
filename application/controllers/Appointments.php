<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Appointments extends CI_Controller {

    
    public function __construct()
    {
        parent::__construct();

        // Validar sesión
        if ($this->session->userdata('user_login') != 1)
        {
            redirect(base_url(), 'refresh');
        }
        
        $this->load->model('Appointments_model');
        $this->load->model('Consultations_model');
        $this->load->database();
        $this->load->library('user_agent');
        $this->load->library('session');
    }

    public function index()
    {
        $agency_id = $this->session->userdata('current_agency');
        $data['page_title'] = 'Appointments';
        $data['page_name']  = 'appointments/index';

        $this->load->view('backend/index',$data);
    }
    
    public function getAppointments()
    {
        $mode = $this->input->get('mode');
    
        if($mode == 'list'){
    
            $page = max(1, (int)$this->input->get('page'));
            $limit = 15;
            $offset = ($page-1) * $limit;
    
        }else{
    
            $limit = null;
            $offset = null;
    
        }
    
        $filters = [
            'mode'   => $mode,
            'page'   => $page ?? 1,
            'search' => $this->input->get('search'),
            'status' => $this->input->get('status'),
            'day'    => $this->input->get('day'),
            'month'  => $this->input->get('month'),
            'year'   => $this->input->get('year'),
        ];
    
        echo json_encode(
            $this->Appointments_model->getAppointments($filters,$limit,$offset)
        );
    }


    public function add($patient_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');

        $data['patient_id'] = $patient_id;

        $data['patients'] = $this->db
            ->where('agency_id',$agency_id)
            ->where('rol_id',8)
            ->where('status',1)
            ->get('user')
            ->result_array();

        $data['doctors'] = $this->db
            ->where('agency_id',$agency_id)
            ->where('rol_id',2)
            ->where('status',1)
            ->get('user')
            ->result_array();

        $data['page_title'] = 'New Appointment';
        $data['page_name']  = 'appointments/add';

        $this->load->view('backend/index',$data);
    }

    public function store()
    {
        $data = [
            'agency_id'          => $this->session->userdata('current_agency'),
            'patient_id'         => $this->input->post('patient_id'),
            'doctor_id'          => $this->input->post('doctor_id'),
            'appointment_date'   => $this->input->post('appointment_date'),
            'appointment_time'   => $this->input->post('appointment_time'),
            'duration_minutes'   => $this->input->post('duration_minutes'),
            'reason'             => $this->input->post('reason'),
            'notes'              => $this->input->post('notes'),
            'created_by'         => $this->session->userdata('login_user_id')
        ];

        $this->Appointments_model->create($data);

        redirect('portal/appointments');
    }

    public function edit($id)
    {
        $agency_id = $this->session->userdata('current_agency');

        $data['appointment'] =
            $this->Appointments_model->get_by_id($id);

        $data['patients'] = $this->db
            ->where('agency_id',$agency_id)
            ->where('rol_id',8)
            ->where('status',1)
            ->get('user')
            ->result_array();

        $data['doctors'] = $this->db
            ->where('agency_id',$agency_id)
            ->where('status',1)
            ->where('rol_id',7)
            ->get('user')
            ->result_array();

        $data['page_title'] = 'Edit Appointment';
        $data['page_name']  = 'appointments/edit';

        $this->load->view('backend/index',$data);
    }

    public function update($id)
    {
        $this->Appointments_model->update($id,[
            'patient_id'        => $this->input->post('patient_id'),
            'doctor_id'         => $this->input->post('doctor_id'),
            'appointment_date'  => $this->input->post('appointment_date'),
            'appointment_time'  => $this->input->post('appointment_time'),
            'duration_minutes'  => $this->input->post('duration_minutes'),
            'reason'            => $this->input->post('reason'),
            'notes'             => $this->input->post('notes'),
            'updated_at'        => date('Y-m-d H:i:s')
        ]);

        redirect('portal/appointments');
    }

    public function delete($id)
    {
        $this->Appointments_model->delete($id);

        redirect('portal/appointments');
    }
    
    public function updateStatus()
    {
        $id = $this->input->post('id');
        $status = (int) $this->input->post('status');
    
        if (!$id || $status < 1 || $status > 5) {
    
            echo json_encode([
                'success' => false,
                'message' => 'Datos inválidos'
            ]);
            return;
        }
    
        $updated = $this->Appointments_model->updateStatus($id, $status);
    
        echo json_encode([
            'success' => $updated
        ]);
    }
    
}