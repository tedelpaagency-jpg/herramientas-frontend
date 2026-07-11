<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Appointments API Controller
 */
class Appointments extends CI_Controller 
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct() 
    {
        parent::__construct();
        $this->load->model('Appointments_model');
        $this->load->model('crud_model');
        $this->load->database();
        
        // CORS Headers for API accessibility
        $this->output->set_header('Access-Control-Allow-Origin: *');
        $this->output->set_header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $this->output->set_header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH');
        
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
     * Router method for /api/appointments
     */
    public function index() 
    {
        $method = strtolower($this->input->method());
        if ($method === 'get') {
            $this->list_appointments();
        } elseif ($method === 'post') {
            $this->store();
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET or POST.'], 405);
        }
    }

    /**
     * Router method for /api/appointments/{id}
     */
    public function handle_appointment($id = null) 
    {
        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de cita no proporcionado.'], 400);
        }

        $method = strtolower($this->input->method());
        if ($method === 'get') {
            $this->show($id);
        } elseif ($method === 'put') {
            $this->update($id);
        } elseif ($method === 'delete') {
            $this->delete($id);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed.'], 405);
        }
    }

    /**
     * GET /api/appointments
     * List all appointments with pagination and advanced filtering.
     */
    private function list_appointments() 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $page = (int)$this->input->get('page');
        if ($page <= 0) {
            $page = 1;
        }

        $limit = (int)$this->input->get('limit');
        if ($limit <= 0) {
            $limit = 15; // Standard pagination limit
        }
        $offset = ($page - 1) * $limit;

        $filters = [
            'mode'      => 'list',
            'page'      => $page,
            'search'    => $this->input->get('search'),
            'doctor_id' => $this->input->get('doctor_id'),
            'patient_id'=> $this->input->get('patient_id'),
            'status'    => $this->input->get('status'),
            'date'      => $this->input->get('date'),
            'date_from' => $this->input->get('date_from'),
            'date_to'   => $this->input->get('date_to'),
            'order_by'  => $this->input->get('order_by'),
            'order'     => $this->input->get('order')
        ];

        $response = $this->Appointments_model->getAppointments($agency_id, $filters, $limit, $offset);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows'],
            'pagination' => [
                'total_results' => $response['total'],
                'per_page'      => $response['per_page'],
                'current_page'  => $response['page'],
                'total_pages'   => $response['last_page']
            ]
        ], 200);
    }

    /**
     * GET /api/appointments/{id}
     * Get details of a single appointment.
     */
    private function show($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $appointment = $this->Appointments_model->get_details_by_id($id, $agency_id);

        if (!$appointment) {
            $this->response_json(['status' => 'error', 'message' => 'Cita no encontrada.'], 404);
        }

        $this->response_json([
            'status' => 'success',
            'data' => $appointment
        ], 200);
    }

    /**
     * POST /api/appointments
     * Create a new appointment.
     */
    private function store() 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $role_name = $user_data['role_name'];

        // Get inputs (support both JSON body and standard form post inputs)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        $patient_id       = $this->input->post('patient_id');
        $doctor_id        = $this->input->post('doctor_id');
        $appointment_date = $this->input->post('appointment_date');
        $appointment_time = $this->input->post('appointment_time');
        $duration_minutes = (int)$this->input->post('duration_minutes');
        $reason           = $this->input->post('reason');
        $notes            = $this->input->post('notes');
        $status           = $this->input->post('status');

        if (empty($patient_id) || empty($doctor_id) || empty($appointment_date) || empty($appointment_time) || empty($duration_minutes)) {
            $this->response_json(['status' => 'error', 'message' => 'Los campos patient_id, doctor_id, appointment_date, appointment_time y duration_minutes son obligatorios.'], 400);
        }

        // Validate patient existence in same agency
        $patient = $this->db->get_where('user', [
            'user_id' => $patient_id,
            'rol_id' => 8, // Patient
            'agency_id' => $agency_id,
            'status' => 1
        ])->row();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'El paciente no existe, no está activo o pertenece a otra sucursal.'], 404);
        }

        // Validate doctor existence in same agency (roles 2 or 7)
        $this->db->group_start();
        $this->db->where('rol_id', 2);
        $this->db->or_where('rol_id', 7);
        $this->db->group_end();
        $this->db->where('user_id', $doctor_id);
        $this->db->where('agency_id', $agency_id);
        $this->db->where('status', 1);
        $doctor = $this->db->get('user')->row();

        if (!$doctor) {
            $this->response_json(['status' => 'error', 'message' => 'El doctor no existe, no está activo o pertenece a otra sucursal.'], 404);
        }

        // Validate agenda conflict/availability
        $conflict = $this->Appointments_model->check_conflict($doctor_id, $patient_id, $appointment_date, $appointment_time, $duration_minutes);
        if ($conflict) {
            $msg = $conflict === 'doctor' 
                ? 'El doctor tiene un conflicto de agenda en el horario seleccionado.' 
                : 'El paciente tiene un conflicto de agenda en el horario seleccionado.';
            $this->response_json(['status' => 'error', 'message' => $msg], 409);
        }

        $insert_data = [
            'agency_id'        => $agency_id,
            'patient_id'       => $patient_id,
            'doctor_id'        => $doctor_id,
            'appointment_date' => $appointment_date,
            'appointment_time' => $appointment_time,
            'duration_minutes' => $duration_minutes,
            'reason'           => !empty($reason) ? $reason : '',
            'notes'            => !empty($notes) ? $notes : '',
            'status'           => !empty($status) ? (int)$status : 1, // Default to Pending (1)
            'created_by'       => $user_id,
            'created_at'       => date('Y-m-d H:i:s')
        ];

        $appointment_id = $this->Appointments_model->create($insert_data);

        if ($appointment_id) {
            $this->crud_model->log_binnacle($user_id, $role_name);
            $this->response_json([
                'status' => 'success',
                'message' => 'Cita médica creada correctamente.',
                'appointment_id' => $appointment_id
            ], 201);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Error interno al guardar la cita.'], 500);
        }
    }

    /**
     * PUT /api/appointments/{id}
     * Update an existing appointment.
     */
    private function update($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $role_name = $user_data['role_name'];

        // Get inputs (support both JSON body and standard form post inputs)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        $appointment = $this->Appointments_model->get_by_id($id);
        if (!$appointment || $appointment['agency_id'] != $agency_id) {
            $this->response_json(['status' => 'error', 'message' => 'Cita no encontrada.'], 404);
        }

        $patient_id       = $this->input->post('patient_id');
        $doctor_id        = $this->input->post('doctor_id');
        $appointment_date = $this->input->post('appointment_date');
        $appointment_time = $this->input->post('appointment_time');
        $duration_minutes = $this->input->post('duration_minutes');
        $reason           = $this->input->post('reason');
        $notes            = $this->input->post('notes');
        $status           = $this->input->post('status');

        $update_data = [];

        // Validate values if provided
        if ($patient_id !== null) {
            $patient = $this->db->get_where('user', [
                'user_id' => $patient_id,
                'rol_id' => 8,
                'agency_id' => $agency_id,
                'status' => 1
            ])->row();
            if (!$patient) {
                $this->response_json(['status' => 'error', 'message' => 'El paciente no existe, no está activo o pertenece a otra sucursal.'], 404);
            }
            $update_data['patient_id'] = $patient_id;
        } else {
            $patient_id = $appointment['patient_id'];
        }

        if ($doctor_id !== null) {
            $this->db->group_start();
            $this->db->where('rol_id', 2);
            $this->db->or_where('rol_id', 7);
            $this->db->group_end();
            $this->db->where('user_id', $doctor_id);
            $this->db->where('agency_id', $agency_id);
            $this->db->where('status', 1);
            $doctor = $this->db->get('user')->row();
            if (!$doctor) {
                $this->response_json(['status' => 'error', 'message' => 'El doctor no existe, no está activo o pertenece a otra sucursal.'], 404);
            }
            $update_data['doctor_id'] = $doctor_id;
        } else {
            $doctor_id = $appointment['doctor_id'];
        }

        if ($appointment_date !== null) {
            $update_data['appointment_date'] = $appointment_date;
        } else {
            $appointment_date = $appointment['appointment_date'];
        }

        if ($appointment_time !== null) {
            $update_data['appointment_time'] = $appointment_time;
        } else {
            $appointment_time = $appointment['appointment_time'];
        }

        if ($duration_minutes !== null) {
            $update_data['duration_minutes'] = (int)$duration_minutes;
        } else {
            $duration_minutes = (int)$appointment['duration_minutes'];
        }

        // Validate conflicts if date/time/duration/doctor/patient is updated
        $conflict = $this->Appointments_model->check_conflict($doctor_id, $patient_id, $appointment_date, $appointment_time, $duration_minutes, $id);
        if ($conflict) {
            $msg = $conflict === 'doctor' 
                ? 'El doctor tiene un conflicto de agenda en el horario seleccionado.' 
                : 'El paciente tiene un conflicto de agenda en el horario seleccionado.';
            $this->response_json(['status' => 'error', 'message' => $msg], 409);
        }

        if ($reason !== null) $update_data['reason'] = $reason;
        if ($notes !== null) $update_data['notes'] = $notes;
        if ($status !== null) $update_data['status'] = (int)$status;

        $update_data['updated_at'] = date('Y-m-d H:i:s');

        if ($this->Appointments_model->update($id, $update_data)) {
            $this->crud_model->log_binnacle($user_id, $role_name);
            $this->response_json([
                'status' => 'success',
                'message' => 'Cita médica actualizada correctamente.',
                'appointment_id' => $id
            ], 200);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Error al actualizar la cita.'], 500);
        }
    }

    /**
     * PATCH /api/appointments/{id}/cancel
     * Cancel an appointment.
     */
    public function cancel($id = null) 
    {
        if (strtolower($this->input->method()) !== 'patch') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use PATCH.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de cita no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $role_name = $user_data['role_name'];

        // Get inputs
        $raw_input = json_decode($this->input->raw_input_stream, true);
        $cancel_reason = isset($raw_input['cancel_reason']) ? $raw_input['cancel_reason'] : $this->input->post('cancel_reason');

        if (empty($cancel_reason)) {
            $this->response_json(['status' => 'error', 'message' => 'El motivo de cancelación (cancel_reason) es obligatorio.'], 400);
        }

        $appointment = $this->Appointments_model->get_by_id($id);
        if (!$appointment || $appointment['agency_id'] != $agency_id) {
            $this->response_json(['status' => 'error', 'message' => 'Cita no encontrada.'], 404);
        }

        $cancel_data = [
            'cancel_reason' => $cancel_reason,
            'cancelled_by' => $user_id
        ];

        if ($this->Appointments_model->cancel($id, $cancel_data)) {
            $this->crud_model->log_binnacle($user_id, $role_name);
            $this->response_json([
                'status' => 'success',
                'message' => 'Cita médica cancelada correctamente.',
                'appointment_id' => $id
            ], 200);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Error al cancelar la cita.'], 500);
        }
    }

    /**
     * DELETE /api/appointments/{id}
     * Soft delete / cancel an appointment.
     */
    private function delete($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $role_name = $user_data['role_name'];

        $appointment = $this->Appointments_model->get_by_id($id);
        if (!$appointment || $appointment['agency_id'] != $agency_id) {
            $this->response_json(['status' => 'error', 'message' => 'Cita no encontrada.'], 404);
        }

        // Soft delete sets status to 4 (Cancelled) and updates cancelled_by
        $cancel_data = [
            'cancel_reason' => 'Eliminado por API',
            'cancelled_by' => $user_id
        ];

        if ($this->Appointments_model->cancel($id, $cancel_data)) {
            $this->crud_model->log_binnacle($user_id, $role_name);
            $this->response_json([
                'status' => 'success',
                'message' => 'Cita médica eliminada correctamente.'
            ], 200);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Error al eliminar la cita.'], 500);
        }
    }

    /**
     * GET /api/appointments/doctor/{doctor_id}
     * Get agenda of a doctor.
     */
    public function doctor($doctor_id = null) 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($doctor_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de doctor no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $date      = $this->input->get('date');
        $date_from = $this->input->get('date_from');
        $date_to   = $this->input->get('date_to');

        $filters = [
            'mode'      => 'all', // No limits
            'doctor_id' => $doctor_id,
            'date'      => $date,
            'date_from' => $date_from,
            'date_to'   => $date_to
        ];

        $response = $this->Appointments_model->getAppointments($agency_id, $filters);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows']
        ], 200);
    }

    /**
     * GET /api/appointments/patient/{patient_id}
     * Get appointments of a patient.
     */
    public function patient($patient_id = null) 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($patient_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de paciente no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $filters = [
            'mode'       => 'all',
            'patient_id' => $patient_id
        ];

        $response = $this->Appointments_model->getAppointments($agency_id, $filters);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows']
        ], 200);
    }

    /**
     * GET /api/appointments/today
     * Get appointments of today.
     */
    public function today() 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $filters = [
            'mode' => 'all',
            'date' => date('Y-m-d')
        ];

        $response = $this->Appointments_model->getAppointments($agency_id, $filters);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows']
        ], 200);
    }

    /**
     * GET /api/appointments/upcoming
     * Get upcoming appointments.
     */
    public function upcoming() 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $filters = [
            'mode' => 'all',
            'date_from' => date('Y-m-d')
        ];

        $response = $this->Appointments_model->getAppointments($agency_id, $filters);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows']
        ], 200);
    }

    // --- Private Helper Methods for JWT & Response ---

    private function response_json($data, $status_code = 200) 
    {
        $this->output
             ->set_content_type('application/json', 'utf-8')
             ->set_status_header($status_code)
             ->set_output(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))
             ->_display();
        exit;
    }

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
