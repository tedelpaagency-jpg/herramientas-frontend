<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Consultations API Controller
 *
 * Endpoints REST construidos sobre el módulo Consultations existente.
 * Reutiliza completamente los métodos de Consultations_model sin duplicar SQL.
 *
 * Autenticación: JWT Bearer Token (mismo esquema que Prescriptions y Patients API).
 * Multitenancy:  Todos los endpoints filtran por agency_id extraído del token.
 */
class Consultations extends CI_Controller
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct()
    {
        parent::__construct();

        $this->load->model('Consultations_model');
        $this->load->database();

        // CORS Headers
        $this->output->set_header('Access-Control-Allow-Origin: *');
        $this->output->set_header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $this->output->set_header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');

        // Handle CORS OPTIONS preflight
        if (strtolower($this->input->method()) === 'options') {
            $this->output->set_status_header(200);
            $this->output->_display();
            exit;
        }

        // JWT secret desde config si está disponible
        $config_jwt_key = $this->config->item('jwt_key');
        if (!empty($config_jwt_key)) {
            $this->jwt_secret = $config_jwt_key;
        } elseif (!empty($this->config->item('encryption_key'))) {
            $this->jwt_secret = $this->config->item('encryption_key');
        }
    }

    // =========================================================================
    // Helpers privados: JWT + respuesta JSON
    // =========================================================================

    /**
     * Envía una respuesta JSON y termina la ejecución.
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
     * Valida el Bearer Token JWT y retorna el payload decodificado.
     * Termina la ejecución con 401 si el token es inválido o está ausente.
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

        $header             = $tokenParts[0];
        $payload            = $tokenParts[1];
        $signatureProvided  = $tokenParts[2];

        $signature          = hash_hmac('sha256', $header . '.' . $payload, $this->jwt_secret, true);
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
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );
            if (isset($requestHeaders['Authorization'])) {
                $headers = $requestHeaders['Authorization'];
            }
        }

        if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }

        return null;
    }

    // =========================================================================
    // Routers públicos
    // =========================================================================

    /**
     * Router para /api/consultations
     * GET  -> list_consultations()
     * POST -> create_consultation()
     */
    public function index()
    {
        $method = strtolower($this->input->method());

        if ($method === 'get') {
            $this->list_consultations();
        } elseif ($method === 'post') {
            $this->create_consultation();
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET or POST.'], 405);
        }
    }

    /**
     * Router para /api/consultations/{id}
     * GET    -> show_consultation()
     * POST   -> update_consultation()
     * DELETE -> delete_consultation()
     */
    public function handle_consultation($id = null)
    {
        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de consulta no proporcionado.'], 400);
        }

        $method = strtolower($this->input->method());

        if ($method === 'get') {
            $this->show_consultation($id);
        } elseif ($method === 'post') {
            $this->update_consultation($id);
        } elseif ($method === 'delete') {
            $this->delete_consultation($id);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET, POST o DELETE.'], 405);
        }
    }

    // =========================================================================
    // Endpoints CRUD principales
    // =========================================================================

    /**
     * GET /api/consultations
     *
     * Lista todas las consultas activas de la agencia.
     * Query params opcionales:
     *   search    -> busca en nombre, chief_complaint, diagnosis, treatment
     *   date_from + date_to -> filtra por rango de fechas (Y-m-d)
     *
     * Modelo: get_consultations() | search_medical_consultations() | get_by_date_range()
     * Origen web: Consultations::index()
     */
    private function list_consultations()
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $page = (int)$this->input->get('page');
        if ($page <= 0) {
            $page = 1;
        }

        $limit = (int)$this->input->get('limit');
        if ($limit <= 0) {
            $limit = 10;
        }
        $offset = ($page - 1) * $limit;

        $filters = [
            'search'    => $this->input->get('search'),
            'date_from' => $this->input->get('date_from'),
            'date_to'   => $this->input->get('date_to'),
            'patient_id'=> $this->input->get('patient_id'),
            'doctor_id' => $this->input->get('doctor_id')
        ];

        $result = $this->Consultations_model->get_consultations_filtered($agency_id, $filters, $limit, $offset);

        $formatted_data = [];
        foreach ($result['rows'] as $row) {
            $patient_name = $row['patient_name'] ?? '';
            $patient_last_name = $row['patient_last_name'] ?? '';
            $full_patient_name = trim($patient_name . ' ' . $patient_last_name);

            // Maintain the patient name (full name) at flat level for compatibility
            $row['patient_name'] = $full_patient_name;

            // Form nested patient details
            $row['patient'] = [
                'user_id'   => $row['patient_id'],
                'name'      => $patient_name,
                'last_name' => $patient_last_name,
                'email'     => $row['patient_email'] ?? '',
                'phone'     => $row['patient_phone'] ?? '',
                'birthday'  => $row['patient_birthday'] ?? '',
                'status'    => isset($row['patient_status']) ? (int)$row['patient_status'] : null
            ];

            // Maintain doctor name at flat level for compatibility
            $doctor_name = $row['doctor_name'] ?? '';
            $doctor_last_name = $row['doctor_last_name'] ?? '';
            $row['doctor_name'] = trim($doctor_name . ' ' . $doctor_last_name);

            // Clean up extra flat fields to keep the response output clean
            unset($row['patient_last_name']);
            unset($row['patient_email']);
            unset($row['patient_phone']);
            unset($row['patient_birthday']);
            unset($row['patient_status']);
            unset($row['doctor_last_name']);

            $formatted_data[] = $row;
        }

        $total_pages = ceil($result['total'] / $limit);

        $this->response_json([
            'status' => 'success',
            'data'   => $formatted_data,
            'pagination' => [
                'total_results' => $result['total'],
                'per_page'      => $limit,
                'current_page'  => $page,
                'total_pages'   => $total_pages
            ]
        ], 200);
    }

    /**
     * POST /api/consultations
     *
     * Crea una nueva consulta médica.
     * Acepta JSON body o form-data.
     *
     * Body requerido:
     *   patient_id (int)
     *
     * Body opcional:
     *   chief_complaint, history_present_illness, physical_examination,
     *   diagnosis, treatment, notes, follow_up_date, status (default: 1)
     *
     * Modelo: save_consultation()
     * Origen web: Consultations::save()
     */
    private function create_consultation()
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        // Soporte JSON body + form-data
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        $patient_id = (int) $this->input->post('patient_id');

        if (empty($patient_id)) {
            $this->response_json(['status' => 'error', 'message' => 'El campo patient_id es obligatorio.'], 400);
        }

        // Verificar que el paciente pertenece a la agencia y tiene rol_id = 8
        $patient = $this->db->get_where('user', [
            'user_id'   => $patient_id,
            'agency_id' => $agency_id,
            'rol_id'    => 8
        ])->row();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado o pertenece a otra sucursal.'], 404);
        }

        $data = [
            'agency_id'               => $agency_id,
            'patient_id'              => $patient_id,
            'doctor_id'               => $user_id,
            'consultation_date'       => date('Y-m-d H:i:s'),
            'chief_complaint'         => $this->input->post('chief_complaint',         true),
            'history_present_illness' => $this->input->post('history_present_illness', true),
            'physical_examination'    => $this->input->post('physical_examination',    true),
            'diagnosis'               => $this->input->post('diagnosis',               true),
            'treatment'               => $this->input->post('treatment',               true),
            'notes'                   => $this->input->post('notes',                   true),
            'follow_up_date'          => $this->input->post('follow_up_date',          true),
            'status'                  => (int) $this->input->post('status') ?: 1
        ];

        $consultation_id = $this->Consultations_model->save_consultation($data);

        if (!$consultation_id) {
            $this->response_json(['status' => 'error', 'message' => 'Error al crear la consulta.'], 500);
        }

        $this->response_json([
            'status'          => 'success',
            'message'         => 'Consulta creada correctamente.',
            'consultation_id' => $consultation_id
        ], 201);
    }

    /**
     * POST /api/consultations/blank
     *
     * Crea una consulta médica en blanco asociada a un paciente.
     * Retorna el ID de la consulta creada para posterior actualización.
     */
    public function create_blank_consultation()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        // Soporte JSON body + form-data
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        $patient_id = (int) $this->input->post('patient_id');

        if (empty($patient_id)) {
            $this->response_json(['status' => 'error', 'message' => 'El campo patient_id es obligatorio.'], 400);
        }

        // Verificar que el paciente pertenece a la agencia y tiene rol_id = 8
        $patient = $this->db->get_where('user', [
            'user_id'   => $patient_id,
            'agency_id' => $agency_id,
            'rol_id'    => 8
        ])->row();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado o pertenece a otra sucursal.'], 404);
        }

        $data = [
            'agency_id'               => $agency_id,
            'patient_id'              => $patient_id,
            'doctor_id'               => $user_id,
            'consultation_date'       => date('Y-m-d H:i:s'),
            'chief_complaint'         => null,
            'history_present_illness' => null,
            'physical_examination'    => null,
            'diagnosis'               => null,
            'treatment'               => null,
            'notes'                   => null,
            'follow_up_date'          => null,
            'status'                  => 1
        ];

        $consultation_id = $this->Consultations_model->save_consultation($data);

        if (!$consultation_id) {
            $this->response_json(['status' => 'error', 'message' => 'Error al crear la consulta en blanco.'], 500);
        }

        $this->response_json([
            'status'          => 'success',
            'message'         => 'Consulta en blanco creada correctamente.',
            'consultation_id' => (int) $consultation_id
        ], 201);
    }

    /**
     * GET /api/consultations/{id}
     *
     * Detalle completo de una consulta:
     * datos de la consulta + paciente + doctor + media adjunta + receta (si existe).
     *
     * Modelo: get_consultation()
     * Origen web: Consultations::view() + Consultations::edit()
     */
    public function show_consultation($id)
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $consultation = $this->Consultations_model->get_consultation($id, $agency_id);

        if (!$consultation) {
            $this->response_json(['status' => 'error', 'message' => 'Consulta no encontrada.'], 404);
        }

        // Media adjunta — misma consulta que usa edit() en el controlador web
        $media = $this->db
            ->where('consultation_id', $id)
            ->order_by('id', 'DESC')
            ->get('consultation_media')
            ->result_array();

        foreach ($media as &$item) {
            $item['url'] = base_url('uploads/consultations/' . $item['file_name']);
        }
        unset($item);

        // Receta asociada — misma consulta que usa edit() en el controlador web
        $prescription = $this->db
            ->where('consultation_id', $id)
            ->order_by('id', 'DESC')
            ->get('prescription')
            ->row_array();

        $prescription_details = [];

        if (!empty($prescription)) {
            $prescription_details = $this->db
                ->where('prescription_id', $prescription['id'])
                ->order_by('id', 'ASC')
                ->get('prescription_details')
                ->result_array();
        }

        // Obtener clinical records de la consulta
        $clinical_records = $this->Consultations_model->get_clinical_records_by_consultation($id, $agency_id);

        $this->response_json([
            'status' => 'success',
            'data'   => [
                'consultation'         => $consultation,
                'media'                => $media,
                'prescription'         => $prescription         ?: null,
                'prescription_details' => $prescription_details,
                'clinical_records'     => $clinical_records
            ]
        ], 200);
    }

    /**
     * POST /api/consultations/{id}
     *
     * Actualiza los campos clínicos y, opcionalmente, los parámetros EAV.
     *
     * Body requerido:
     *   patient_id (int)
     *
     * Body opcional:
     *   chief_complaint, history_present_illness, physical_examination,
     *   diagnosis, treatment, notes, follow_up_date
     *   values (array) — parámetros clínicos EAV: { "param_id": "valor" }
     *
     * Modelo: exists(), update_consultation(), update_clincal_parameters()
     * Origen web: Consultations::update()
     */
    private function update_consultation($id)
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        if (!$this->Consultations_model->exists($id, $agency_id)) {
            $this->response_json(['status' => 'error', 'message' => 'Consulta no encontrada.'], 404);
        }

        // Soporta lectura del cuerpo JSON o variables de la petición POST
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        $patient_id = (int) $this->input->post('patient_id');

        if (empty($patient_id)) {
            $this->response_json(['status' => 'error', 'message' => 'El campo patient_id es obligatorio.'], 400);
        }

        $patient = $this->db
            ->where('user_id',   $patient_id)
            ->where('agency_id', $agency_id)
            ->where('rol_id',    8)
            ->get('user')
            ->row_array();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado o pertenece a otra sucursal.'], 404);
        }

        // Campos clínicos — mismo conjunto que usa update() en el controlador web
        $data = [
            'patient_id'              => $patient_id,
            'chief_complaint'         => $this->input->post('chief_complaint',         true),
            'history_present_illness' => $this->input->post('history_present_illness', true),
            'physical_examination'    => $this->input->post('physical_examination',    true),
            'diagnosis'               => $this->input->post('diagnosis',               true),
            'treatment'               => $this->input->post('treatment',               true),
            'notes'                   => $this->input->post('notes',                   true),
            'follow_up_date'          => $this->input->post('follow_up_date',          true),
            'status'                  => 1
        ];

        $this->Consultations_model->update_consultation($id, $agency_id, $data);

        // Parámetros clínicos EAV (opcionales)
        $values            = $this->input->post('values');
        $parameters_result = null;

        if (!empty($values) && is_array($values)) {
            $parameters_result = $this->Consultations_model->update_clincal_parameters(
                $id,
                $patient_id,
                $values,
                $agency_id
            );
        }

        $response = [
            'status'  => 'success',
            'message' => 'Consulta actualizada correctamente.',
            'patient' => [
                'user_id'   => $patient['user_id'],
                'name'      => $patient['name'],
                'last_name' => $patient['last_name'] ?? '',
                'phone'     => $patient['phone']     ?? ''
            ]
        ];

        if ($parameters_result !== null) {
            $response['clinical_parameters'] = $parameters_result;
        }

        $this->response_json($response, 200);
    }

    /**
     * DELETE /api/consultations/{id}
     *
     * Soft-delete: status=0. No elimina físicamente el registro.
     *
     * Modelo: exists(), delete_consultation()
     * Origen web: Consultations::delete()
     */
    private function delete_consultation($id)
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        if (!$this->Consultations_model->exists($id, $agency_id)) {
            $this->response_json(['status' => 'error', 'message' => 'Consulta no encontrada.'], 404);
        }

        $this->Consultations_model->delete_consultation($id, $agency_id);

        $this->response_json([
            'status'  => 'success',
            'message' => 'Consulta eliminada correctamente.'
        ], 200);
    }

    // =========================================================================
    // Endpoints de filtros especiales
    // =========================================================================

    /**
     * GET /api/consultations/patient/{patient_id}
     *
     * Historia clínica de un paciente (todas sus consultas).
     *
     * Modelo: get_patient_medical_consultations()
     * Origen web: Consultations::patient()
     */
    public function patient_consultations($patient_id = null)
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($patient_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de paciente no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $patient = $this->db->get_where('user', [
            'user_id'   => $patient_id,
            'agency_id' => $agency_id,
            'rol_id'    => 8
        ])->row_array();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        $consultations = $this->Consultations_model->get_patient_medical_history_detailed($patient_id, $agency_id);

        $this->response_json([
            'status'  => 'success',
            'patient' => [
                'user_id'   => $patient['user_id'],
                'name'      => $patient['name'],
                'last_name' => $patient['last_name'] ?? '',
                'email'     => $patient['email']     ?? '',
                'phone'     => $patient['phone']     ?? ''
            ],
            'total'         => count($consultations),
            'consultations' => $consultations
        ], 200);
    }

    /**
     * GET /api/consultations/doctor/{doctor_id}
     *
     * Consultas atendidas por un doctor.
     *
     * Modelo: get_by_doctor()
     */
    public function doctor_consultations($doctor_id = null)
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($doctor_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de doctor no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $consultations = $this->Consultations_model->get_by_doctor($doctor_id, $agency_id);

        $this->response_json([
            'status' => 'success',
            'total'  => count($consultations),
            'data'   => $consultations
        ], 200);
    }

    /**
     * GET /api/consultations/search?q={keyword}
     *
     * Busca en nombre del paciente, motivo, diagnóstico y tratamiento.
     *
     * Query params:
     *   q (string, requerido) — mínimo 2 caracteres
     *
     * Modelo: search_medical_consultations()
     */
    public function search_consultations()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $keyword = trim($this->input->get('q', true));

        if (strlen($keyword) < 2) {
            $this->response_json(['status' => 'error', 'message' => 'El parámetro q debe tener al menos 2 caracteres.'], 400);
        }

        $consultations = $this->Consultations_model->search_medical_consultations($agency_id, $keyword);

        $this->response_json([
            'status'  => 'success',
            'keyword' => $keyword,
            'total'   => count($consultations),
            'data'    => $consultations
        ], 200);
    }

    /**
     * GET /api/consultations/recent?limit={n}
     *
     * Retorna las N consultas más recientes.
     *
     * Query params:
     *   limit (int, opcional, default: 10)
     *
     * Modelo: get_recent_medical_consultations()
     */
    public function recent_consultations()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $limit = (int) $this->input->get('limit');
        if ($limit <= 0) {
            $limit = 10;
        }

        $consultations = $this->Consultations_model->get_recent_medical_consultations($agency_id, $limit);

        $this->response_json([
            'status' => 'success',
            'limit'  => $limit,
            'total'  => count($consultations),
            'data'   => $consultations
        ], 200);
    }

    /**
     * GET /api/consultations/by-date?date_from=Y-m-d&date_to=Y-m-d
     *
     * Consultas dentro de un rango de fechas.
     *
     * Query params requeridos:
     *   date_from (Y-m-d)
     *   date_to   (Y-m-d)
     *
     * Modelo: get_by_date_range()
     */
    public function by_date_range()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $date_from = trim($this->input->get('date_from'));
        $date_to   = trim($this->input->get('date_to'));

        if (empty($date_from) || empty($date_to)) {
            $this->response_json(['status' => 'error', 'message' => 'Los parámetros date_from y date_to son obligatorios (formato Y-m-d).'], 400);
        }

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date_from) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date_to)) {
            $this->response_json(['status' => 'error', 'message' => 'Formato de fecha inválido. Use Y-m-d.'], 400);
        }

        if ($date_from > $date_to) {
            $this->response_json(['status' => 'error', 'message' => 'date_from no puede ser mayor que date_to.'], 400);
        }

        $consultations = $this->Consultations_model->get_by_date_range($agency_id, $date_from, $date_to);

        $this->response_json([
            'status'    => 'success',
            'date_from' => $date_from,
            'date_to'   => $date_to,
            'total'     => count($consultations),
            'data'      => $consultations
        ], 200);
    }

    /**
     * GET /api/consultations/clinical-parameters
     *
     * Obtiene el listado de parámetros clínicos activos en el sistema.
     * Mismo esquema de autenticación (JWT) que los demás endpoints del API.
     */
    public function clinical_parameters()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $parameters = $this->Consultations_model->get_clinical_parameters();

        $this->response_json([
            'status' => 'success',
            'total'  => count($parameters),
            'data'   => $parameters
        ], 200);
    }

    // =========================================================================
    // Endpoints de Media adjunta
    // =========================================================================

    /**
     * GET /api/consultations/{id}/media
     *
     * Lista archivos adjuntos de una consulta.
     * Retorna URL pública de cada archivo.
     *
     * Origen web: Consultations::edit() — $data['media']
     */
    public function get_media($consultation_id = null)
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($consultation_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de consulta no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        if (!$this->Consultations_model->exists($consultation_id, $agency_id)) {
            $this->response_json(['status' => 'error', 'message' => 'Consulta no encontrada.'], 404);
        }

        $media = $this->db
            ->where('consultation_id', $consultation_id)
            ->order_by('id', 'DESC')
            ->get('consultation_media')
            ->result_array();

        foreach ($media as &$item) {
            $item['url'] = base_url('uploads/consultations/' . $item['file_name']);
        }
        unset($item);

        $this->response_json([
            'status' => 'success',
            'total'  => count($media),
            'data'   => $media
        ], 200);
    }

    /**
     * POST /api/consultations/{id}/upload-media
     *
     * Sube un archivo adjunto a la consulta (multipart/form-data).
     *
     * Form fields:
     *   file       (file,   requerido)
     *   patient_id (int,    requerido)
     *   note       (string, opcional)
     *
     * Origen web: Consultations::uploadSingleMedia()
     */
    public function upload_media($consultation_id = null)
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        if (empty($consultation_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de consulta no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        if (!$this->Consultations_model->exists($consultation_id, $agency_id)) {
            $this->response_json(['status' => 'error', 'message' => 'Consulta no encontrada.'], 404);
        }

        $patient_id = (int) $this->input->post('patient_id');
        $note       = $this->input->post('note', true);

        if (!isset($_FILES['file'])) {
            $this->response_json(['status' => 'error', 'message' => 'No se recibió el archivo.'], 400);
        }

        $file = $_FILES['file'];

        if ($file['error'] != 0) {
            $this->response_json(['status' => 'error', 'message' => 'Error en la subida del archivo.'], 400);
        }

        $uploadPath = FCPATH . 'uploads/consultations/';

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $ext     = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newName = uniqid('media_', true) . '.' . $ext;

        if (!move_uploaded_file($file['tmp_name'], $uploadPath . $newName)) {
            $this->response_json(['status' => 'error', 'message' => 'No se pudo guardar el archivo.'], 500);
        }

        // Guardar en BD — misma estructura que uploadSingleMedia() del controlador web
        $this->db->insert('consultation_media', [
            'consultation_id' => $consultation_id,
            'patient_id'      => $patient_id,
            'file_name'       => $newName,
            'original_name'   => $file['name'],
            'mime_type'       => $file['type'],
            'file_size'       => $file['size'],
            'note'            => $note,
            'created_at'      => date('Y-m-d H:i:s')
        ]);

        $media_id = $this->db->insert_id();

        $this->response_json([
            'status'    => 'success',
            'message'   => 'Archivo subido correctamente.',
            'id'        => $media_id,
            'file_name' => $newName,
            'url'       => base_url('uploads/consultations/' . $newName),
            'note'      => $note
        ], 201);
    }

    /**
     * DELETE /api/consultations/media/{media_id}
     *
     * Elimina archivo físico + registro en BD.
     * Verifica que el archivo pertenezca a una consulta de la misma agencia (multitenancy).
     *
     * Origen web: Consultations::deleteMedia()
     */
    public function delete_media($media_id = null)
    {
        if (strtolower($this->input->method()) !== 'delete') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use DELETE.'], 405);
        }

        if (empty($media_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de archivo no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $rol_id    = $user_data['rol_id'];

        $media = $this->db->get_where('consultation_media', ['id' => $media_id])->row();

        if (!$media) {
            $this->response_json(['status' => 'error', 'message' => 'Archivo no encontrado.'], 404);
        }

        // Verificar multitenancy: el archivo debe pertenecer a una consulta de esta agencia
        if (!$this->Consultations_model->exists($media->consultation_id, $agency_id)) {
            $this->response_json(['status' => 'error', 'message' => 'No tiene permiso para eliminar este archivo.'], 403);
        }

        // Eliminar archivo físico
        $filePath = FCPATH . 'uploads/consultations/' . $media->file_name;
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        // Eliminar registro BD
        $this->db->where('id', $media_id)->delete('consultation_media');

        $this->response_json([
            'status'  => 'success',
            'message' => 'Archivo eliminado correctamente.'
        ], 200);
    }
}
