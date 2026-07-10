<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Consultations extends CI_Controller {

    public function __construct()
    {
        parent::__construct();

        // Validar sesión
        if ($this->session->userdata('user_login') != 1)
        {
            redirect(base_url(), 'refresh');
        }
            
        $this->load->model('Consultations_model');
        $this->load->database();
        $this->load->library('user_agent');
        $this->load->library('session');
    }

    /**
     * List consultations
     * URL: portal/consultations
     */
    public function index()
    {
        $agency_id = $this->session->userdata('current_agency');

        $data['consultations'] = $this->Consultations_model->get_consultations($agency_id);

        $data['page_title'] = 'Consultations';
        $data['page_name'] = 'consultations/index';
        $this->load->view('backend/index', $data);
    }

    /**
     * Create consultation form
     * URL: portal/consultations/add
     */
    public function add($patient_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');
    
        $data['patient_id'] = $patient_id;
    
        if ($patient_id > 0) {
    
            $data['patient'] = $this->db
                ->where('agency_id', $agency_id)
                ->where('user_id', $patient_id)
                ->where('rol_id', 8)
                ->get('user')
                ->row_array();
    
        } else {
    
            $data['patients'] = $this->db
                ->where('agency_id', $agency_id)
                ->where('status', 1)
                ->where('rol_id', 8)
                ->order_by('name', 'ASC')
                ->get('user')
                ->result_array();
    
        }
        
        $data = array(
            'agency_id'                 => $agency_id,
            'doctor_id'                 => $this->session->userdata('login_user_id'),
            'consultation_date'         => date('Y-m-d H:i:s'),
            'status'                    => 0
        );

        $consultation_id = $this->Consultations_model->save_consultation($data);
        
        $data['consultation'] = $this->Consultations_model->get_consultation(
            $consultation_id,
            $agency_id
        );
        
        $data['media'] = [];
        
        $data['page_title'] = 'Nueva consulta';
        $data['page_name'] = 'consultations/consultation_form';
    
        $this->load->view('backend/index', $data);
    }

    /**
     * Save consultation
     */
    public function save()
    {
        $agency_id = $this->session->userdata('current_agency');

        $data = array(
            'agency_id'                 => $agency_id,
            'patient_id'                => $this->input->post('patient_id', true),
            'doctor_id'                 => $this->session->userdata('login_user_id'),
            'consultation_date'         => date('Y-m-d H:i:s'),

            'chief_complaint'           => $this->input->post('chief_complaint', true),
            'history_present_illness'   => $this->input->post('history_present_illness', true),
            'physical_examination'      => $this->input->post('physical_examination', true),

            'diagnosis'                 => $this->input->post('diagnosis', true),
            'treatment'                 => $this->input->post('treatment', true),
            'notes'                     => $this->input->post('notes', true),

            'follow_up_date'            => $this->input->post('follow_up_date', true),

            'status'                    => 1
        );

        $consultation_id = $this->Consultations_model->save_consultation($data);

        redirect('portal/consultations/view/'.$consultation_id);
    }

    /**
     * View consultation
     */
    public function view($consultation_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');

        $data['consultation'] = $this->Consultations_model->get_consultation(
            $consultation_id,
            $agency_id
        );

        if (!$data['consultation']) {
            show_404();
        }

        $data['page_title'] = 'Consultation Details';
        $data['page_name'] = 'consultations/view';
        $this->load->view('backend/index', $data);
    }

    /**
     * Edit form
     */
    public function edit($consultation_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');
        
        
        $data['consultation'] = $this->Consultations_model->get_consultation(
            $consultation_id,
            $agency_id
        );

        if (!$data['consultation']) {
            show_404();
        }

        $media = $this->db
            ->where('consultation_id', $consultation_id)
            ->order_by('id', 'DESC')
            ->get('consultation_media')
            ->result_array();
        
        $data['media'] = $media;
        
        $prescription = $this->db
            ->where('consultation_id', $consultation_id)
            ->order_by('id', 'DESC')
            ->get('prescription')
            ->row_array();
        
        $data['prescription'] = $prescription;
        $data['prescription_details'] = [];
        
        if(isset($prescription))
        {
            
            $prescription_details = $this->db
            ->where('prescription_id', $prescription['id'])
            ->order_by('id', 'ASC')
            ->get('prescription_details')
            ->result_array();
            
            $data['prescription_details'] = $prescription_details;
            
        }
        
        $data['patient'] = $this->db
            ->where('user_id',  $data['consultation']['patient_id'])
            ->get('user')
            ->row_array();
            

        $data['page_title'] = 'Consulta';
        $data['page_name']  = 'consultations/consultation_form';
        $this->load->view('backend/index', $data);
    }

    /**
     * Update consultation
     */
    public function update($consultation_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');
        
        $parameters = $this->Consultations_model->update_clincal_parameters(
            $consultation_id,
            $this->input->post('patient_id'),
            $this->input->post('values')
        );
        
       
        $patient_id = (int)$this->input->post('patient_id');

        if ($patient_id == 0) {
        
            
            $patient_data = json_decode(json_encode($this->input->post('patient_data')),true);
            log_message('error',json_encode($patient_data));
            
            $patient = $this->db
                ->where('agency_id', $agency_id)
                ->where('rol_id', 8)
                ->where('name', $patient_data['name'])
                ->where('last_name', $patient_data['last_name'])
                ->where('phone', $patient_data['phone'])
                ->where('birthday', $patient_data['birthday'])
                ->get('user')
                ->row();
        
            if ($patient) {
        
                $patient_id = $patient->user_id;
        
            } else {
        
                $insert = [
                    'agency_id' => $agency_id,
                    'rol_id'    => 8,
                    'name'      => $patient_data['name'],
                    'last_name' => $patient_data['last_name'],
                    'phone'     => $patient_data['phone'],
                    'birthday'  => $patient_data['birthday'],
                    'status'    => 1
                ];
        
                $this->db->insert('user', $insert);
                $patient_id = $this->db->insert_id();
            }
        }
    
    
        $data = array(
            'patient_id'               => $patient_id,

            'chief_complaint'          => $this->input->post('chief_complaint', true),
            'history_present_illness'  => $this->input->post('history_present_illness', true),
            'physical_examination'     => $this->input->post('physical_examination', true),

            'diagnosis'                => $this->input->post('diagnosis', true),
            'treatment'                => $this->input->post('treatment', true),
            'notes'                    => $this->input->post('notes', true),

            'follow_up_date'           => $this->input->post('follow_up_date', true),
            'status'                   => 1
           
        );

        $this->Consultations_model->update_consultation(
            $consultation_id,
            $agency_id,
            $data
        );
        
        $patient = $this->db
        ->where('user_id',$patient_id)
        ->get('user')
        ->row_array();
        
        echo json_encode(['status'=>'success','message'=>'Actualizado','patient'=> $patient]);
    }

    /**
     * Delete consultation
     */
    public function delete($consultation_id = 0)
    {
        
        $agency_id = $this->session->userdata('current_agency');
        $this->Consultations_model->delete_consultation(
            $consultation_id,$agency_id
        );

        redirect(base_url().'portal/consultations','refresh');
    }

    /**
     * Patient medical history
     * URL: portal/consultations/patient/15
     */
    public function patient($patient_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');

        $data['patient'] = $this->db
            ->where('id', $patient_id)
            ->where('agency_id', $agency_id)
            ->get('patients')
            ->row_array();

        if (!$data['patient']) {
            show_404();
        }

        $data['consultations'] = $this->Consultations_model
            ->get_patient_consultations($patient_id, $agency_id);

        $data['page_title'] = 'Patient Medical History';

        $this->load->view('consultations/patient_history', $data);
    }
    
    public function uploadSingleMedia()
    {
        $consultation_id = $this->input->post('consultation_id');
        $patient_id      = $this->input->post('patient_id');
        $note            = $this->input->post('note');
    
        if(!isset($_FILES['file'])){
            echo json_encode([
                'status'=>false,
                'message'=>'No se recibió el archivo'
            ]);
            return;
        }
    
        $file = $_FILES['file'];
    
        if($file['error'] != 0){
            echo json_encode([
                'status'=>false,
                'message'=>'Error en la subida del archivo'
            ]);
            return;
        }
    
        $uploadPath = FCPATH.'uploads/consultations/';
    
        if(!is_dir($uploadPath)){
            mkdir($uploadPath,0777,true);
        }
    
        // Extensión
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    
        // Nombre único
        $newName = uniqid('media_', true).'.'.$ext;
    
        $destination = $uploadPath.$newName;
    
        if(!move_uploaded_file($file['tmp_name'], $destination)){
            echo json_encode([
                'status'=>false,
                'message'=>'No se pudo mover el archivo'
            ]);
            return;
        }
    
        // Guardar en BD
        $this->db->insert('consultation_media',[
            'consultation_id' => $consultation_id,
            'patient_id'      => $patient_id,
            'file_name'       => $newName,
            'original_name'   => $file['name'],
            'mime_type'       => $file['type'],
            'file_size'       => $file['size'],
            'note'            => $note,
            'created_at'      => date('Y-m-d H:i:s')
        ]);
    
        $id = $this->db->insert_id();
    
        echo json_encode([
            'status'=>true,
            'id'=>$id,
            'file_name'=>$newName,
            'url'=>base_url('uploads/consultations/'.$newName),
            'note'=>$note
        ]);
    }
    
    public function deleteMedia()
    {
        $id = $this->input->post('id');
    
        if(empty($id)){
            echo json_encode([
                'status' => false,
                'message' => 'ID inválido'
            ]);
            return;
        }
    
        $media = $this->db
            ->get_where('consultation_media', ['id' => $id])
            ->row();
    
        if(!$media){
            echo json_encode([
                'status' => false,
                'message' => 'Archivo no encontrado'
            ]);
            return;
        }
    
        $filePath = FCPATH.'uploads/consultations/'.$media->file_name;
    
        // eliminar archivo físico
        if(file_exists($filePath)){
            unlink($filePath);
        }
    
        // eliminar registro BD
        $this->db->where('id', $id);
        $this->db->delete('consultation_media');
    
        echo json_encode([
            'status' => true,
            'message' => 'Archivo eliminado correctamente'
        ]);
    }

}