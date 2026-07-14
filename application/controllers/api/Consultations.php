<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * API Consultations Controller
 * Skeleton generated from existing web controller.
 * NOTE: Reuses Consultations_model methods.
 */
class Consultations extends CI_Controller {

    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct() 
    {
        parent::__construct();
        $this->load->model('Consultations_model');
        $this->load->database();
        
        // CORS Headers for API accessibility
        $this->output->set_header('Access-Control-Allow-Origin: *');
        $this->output->set_header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $this->output->set_header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        
        // Handle CORS OPTIONS preflight request
        if (strtolower($this->input->method()) === 'options') {
            $this->output->set_status_header(200);
            $this->output->_display();
            exit;
        }

        // Set JWT secret key using existing configuration if available
        $config_jwt_key = $this->config->item('jwt_key');
        if (!empty($config_jwt_key)) {
            $this->jwt_secret = $config_jwt_key;
        } elseif (!empty($this->config->item('encryption_key'))) {
            $this->jwt_secret = $this->config->item('encryption_key');
        }
    }

    /**
     * Send a JSON response with status code and exit
     */
    private function response_json($data, $status_code = 200) 
    {
        $this->output
             ->set_content_type('application/json', 'utf-8')
             ->set_status_header($status_code)
             ->set_output(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))
             ->_display();
        exit;
    }

    /**
     * Validate JWT token from headers and return decoded token payload.
     */
    private function validate_request() 
    {
        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token no proporcionado.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Token inválido o expirado.'], 401);
        }

        return $decoded;
    }

    // TODO: Copy get_bearer_token() and validate_jwt() from Auth.php

    public function index(){
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        
        $this->response_json([
            'status'=>'success',
            'data'=>$this->Consultations_model->get_consultations($agency_id)
        ]);
    }

    public function show($id){
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        
        $row=$this->Consultations_model->get_consultation($id,$agency_id);
        if(!$row){ return $this->response_json(['status'=>'error','message'=>'Not found'],404); }
        $this->response_json(['status'=>'success','data'=>$row]);
    }

    /**
     * POST /api/consultations
     * Crear una consulta
     */
    public function store()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $doctor_id = $user_data['user_id'];


        // Validaciones básicas
        if (!$this->input->post('patient_id')) {
            return $this->response_json([
                'status' => 'error',
                'message' => 'Patient is required.'
            ], 422);
        }

        $data = [
            'agency_id'               => $agency_id,
            'patient_id'              => $this->input->post('patient_id', true),
            'doctor_id'               => $doctor_id,
            'consultation_date'       => date('Y-m-d H:i:s'),

            'chief_complaint'         => $this->input->post('chief_complaint', true),
            'history_present_illness' => $this->input->post('history_present_illness', true),
            'physical_examination'    => $this->input->post('physical_examination', true),

            'diagnosis'               => $this->input->post('diagnosis', true),
            'treatment'               => $this->input->post('treatment', true),
            'notes'                   => $this->input->post('notes', true),

            'follow_up_date'          => $this->input->post('follow_up_date', true),

            'status'                  => 1
        ];

        $consultation_id = $this->Consultations_model->save_consultation($data);

        if (!$consultation_id) {
            return $this->response_json([
                'status' => 'error',
                'message' => 'Unable to create consultation.'
            ], 500);
        }

        $consultation = $this->Consultations_model->get_consultation(
            $consultation_id,
            $agency_id
        );

        return $this->response_json([
            'status' => 'success',
            'message' => 'Consultation created successfully.',
            'data' => $consultation
        ], 201);
    }

    public function update($id){
        // Reuse update_consultation() and update_clincal_parameters().
    }

    public function destroy($id){
        $agency_id=$this->decoded['agency_id'];
        $this->Consultations_model->delete_consultation($id,$agency_id);
        $this->response_json(['status'=>'success']);
    }

    public function patient($patient_id){}
    public function doctor($doctor_id){}
    public function upload_media(){}
    public function delete_media($id){}
}
