<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Patients API Controller
 */
class Patients extends CI_Controller 
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct() 
    {
        parent::__construct();
        $this->load->model('Patients_model');
        $this->load->model('crud_model');
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

    /**
     * GET /api/patients
     * List all patients with pagination and optional search filter.
     */
    public function index() 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Pagination inputs
        $page = (int)$this->input->get('page');
        if ($page <= 0) {
            $page = 1;
        }
        $limit = 5; // Reusing current project layout pagination limit
        $offset = ($page - 1) * $limit;

        // Search filter
        $search = $this->input->get('search');

        $total_results = $this->Patients_model->get_patients_count($search, $agency_id);
        $patients = $this->Patients_model->get_patients($limit, $offset, $search, $agency_id);

        // Format patient details (like age)
        $formatted_patients = [];
        foreach ($patients as $patient) {
            $formatted_patients[] = [
                'user_id' => $patient->user_id,
                'name' => $patient->name,
                'last_name' => $patient->last_name,
                'email' => $patient->email,
                'phone' => $patient->phone,
                'birthday' => $patient->birthday,
                'age' => !empty($patient->birthday) ? $this->crud_model->calcularEdad($patient->birthday) : null,
                'status' => $patient->status
            ];
        }

        $total_pages = ceil($total_results / $limit);

        $this->response_json([
            'status' => 'success',
            'data' => $formatted_patients,
            'pagination' => [
                'total_results' => $total_results,
                'per_page' => $limit,
                'current_page' => $page,
                'total_pages' => $total_pages
            ]
        ], 200);
    }

    /**
     * GET /api/patients/{id}
     * Get details of a single patient.
     */
    public function show($id = null) 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de paciente no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $patient = $this->Patients_model->get_patient_by_id($id, $agency_id);

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        $patient_profile = [
            'user_id' => $patient['user_id'],
            'name' => $patient['name'],
            'last_name' => $patient['last_name'],
            'email' => $patient['email'],
            'phone' => $patient['phone'],
            'birthday' => $patient['birthday'],
            'age' => !empty($patient['birthday']) ? $this->crud_model->calcularEdad($patient['birthday']) : null,
            'status' => $patient['status']
        ];

        $this->response_json([
            'status' => 'success',
            'data' => $patient_profile
        ], 200);
    }

    /**
     * GET /api/patients/{id}/backgrounds
     * Get patient medical backgrounds.
     */
    public function backgrounds($id = null) 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de paciente no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Verify patient exists and belongs to agency
        $patient = $this->Patients_model->get_patient_by_id($id, $agency_id);
        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        $this->load->model('Background_types_model');
        $background_types = $this->Background_types_model->get_background_types($agency_id);
        $background_values = $this->Background_types_model->get_patient_backgrounds($agency_id, $id);

        $formatted_backgrounds = [];
        foreach ($background_types as $type) {
            $formatted_backgrounds[] = [
                'background_type_id' => $type['id'],
                'name' => $type['name'],
                'value' => isset($background_values[$type['id']]) ? $background_values[$type['id']] : ''
            ];
        }

        $this->response_json([
            'status' => 'success',
            'data' => $formatted_backgrounds
        ], 200);
    }

    /**
     * POST /api/patients/{id}/backgrounds
     * Save patient medical backgrounds.
     */
    public function save_backgrounds($id = null) 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de paciente no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Verify patient exists and belongs to agency
        $patient = $this->Patients_model->get_patient_by_id($id, $agency_id);
        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        $this->load->model('Background_types_model');
        $background_types = $this->Background_types_model->get_background_types($agency_id);

        $raw_input = json_decode($this->input->raw_input_stream, true);

        // Track changes to send verification
        foreach ($background_types as $field) {
            $key = 'background_' . $field['id'];
            $val = isset($raw_input[$key]) ? $raw_input[$key] : $this->input->post($key);
            
            // If value is provided (or even if it's empty, we update/clear it)
            if ($val !== null) {
                $this->Background_types_model->save_patient_value(
                    $agency_id,
                    $id,
                    $field['id'],
                    $val
                );
            }
        }

        $this->response_json([
            'status' => 'success',
            'message' => 'Antecedentes médicos guardados correctamente.'
        ], 200);
    }

    /**
     * GET /api/patients/{id}/consultations
     * Get consultations for a patient.
     */
    public function consultations($id = null) 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de paciente no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Verify patient exists and belongs to agency
        $patient = $this->Patients_model->get_patient_by_id($id, $agency_id);
        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        // Pagination inputs
        $page = (int)$this->input->get('page');
        if ($page <= 0) {
            $page = 1;
        }
 
        
        $limit = (int)$this->input->get('limit');
        if ($limit <= 0) {
            $limit = 15; // Standard pagination limit
        }
        $offset = ($page - 1) * $limit;

        $consultations = $this->Patients_model->get_patient_consultations($id, $agency_id, $limit, $offset);

        $formatted_consultations = [];
        foreach ($consultations as $consultation) {
            $formatted_consultations[] = [
                'consultation_id' => $consultation['medical_consultations_id'],
                'consultation_date' => $consultation['consultation_date'],
                'doctor_id' => $consultation['doctor_id'],
                'doctor_name' => $consultation['doctor_name'] . ' ' . $consultation['doctor_last_name'],
                'reason' => $consultation['reason'],
                'status' => $consultation['status']
            ];
        }

        $this->response_json([
            'status' => 'success',
            'data' => $formatted_consultations
        ], 200);
    }

    /**
     * POST /api/patients/save
     * POST /api/patients/save/{id}
     * Create or update a patient via REST API.
     */
    public function save($id = null) 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Get inputs (support both JSON body and standard form post/JSON inputs)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        if (!empty($id)) {
            $_POST['patient_id'] = $id;
        }

        $response = $this->Patients_model->save_patient($agency_id);

        if ($response['status'] === 'success') {
            $this->response_json($response, 200);
        } else {
            $this->response_json($response, 400);
        }
    }

    // --- Private Helper Methods for JWT ---

    private function base64UrlEncode($text) 
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }

    private function base64UrlDecode($text) 
    {
        $base64 = str_replace(['-', '_'], ['+', '/'], $text);
        $padding = strlen($base64) % 4;
        if ($padding) {
            $base64 .= str_repeat('=', 4 - $padding);
        }
        return base64_decode($base64);
    }

    private function validate_jwt($token) 
    {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }
        
        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signatureProvided = $tokenParts[2];
        
        $signature = hash_hmac('sha256', $header . "." . $payload, $this->jwt_secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        if (!hash_equals($base64UrlSignature, $signatureProvided)) {
            return false;
        }
        
        $payloadDecoded = json_decode($this->base64UrlDecode($payload), true);
        if (!$payloadDecoded) {
            return false;
        }
        
        if (isset($payloadDecoded['exp']) && $payloadDecoded['exp'] < time()) {
            return false;
        }
        
        return $payloadDecoded;
    }

    private function get_bearer_token() 
    {
        $headers = null;
        if ($this->input->get_request_header('Authorization', TRUE)) {
            $headers = $this->input->get_request_header('Authorization', TRUE);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = $requestHeaders['Authorization'];
            }
        }
        
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
}
