<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Treatments API Controller
 *
 * Módulo de Paquetes y Tratamientos para la gestión de plantillas de tratamientos,
 * asignaciones a pacientes (rol_id = 8), control de sesiones consumidas y cargos extras.
 * Toda respuesta AJAX se devuelve en JSON y se valida el JWT de la sucursal (tenant isolation).
 */
class Treatments extends CI_Controller 
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct() 
    {
        parent::__construct();
        $this->load->model('Treatments_model');
        $this->load->model('Patients_model');
        $this->load->database();

        // CORS Headers
        $this->output->set_header('Access-Control-Allow-Origin: *');
        $this->output->set_header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $this->output->set_header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');

        // Manejar CORS OPTIONS pre-vuelo (preflight)
        if (strtolower($this->input->method()) === 'options') {
            $this->output->set_status_header(200);
            $this->output->_display();
            exit;
        }

        // Configurar JWT secret desde la configuración del proyecto
        $config_jwt_key = $this->config->item('jwt_key');
        if (!empty($config_jwt_key)) {
            $this->jwt_secret = $config_jwt_key;
        } elseif (!empty($this->config->item('encryption_key'))) {
            $this->jwt_secret = $this->config->item('encryption_key');
        }
    }

    /**
     * Retorna una respuesta JSON estructurada y finaliza la ejecución.
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

    // =========================================================================
    // ENDPOINTS DE CATÁLOGO / PLANTILLAS DE TRATAMIENTOS
    // =========================================================================

    /**
     * GET /api/treatment-plans -> Listar todas las plantillas.
     * POST /api/treatment-plans -> Crear nueva plantilla.
     */
    public function plans_index() 
    {
        $method = strtolower($this->input->method());
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        if ($method === 'get') {
            $plans = $this->Treatments_model->get_plans($agency_id);
            $this->response_json([
                'status' => 'success',
                'data'   => $plans
            ], 200);
        } 
        
        if ($method === 'post') {
            $raw_input = json_decode($this->input->raw_input_stream, true);
            
            $name        = isset($raw_input['name']) ? trim($raw_input['name']) : trim($this->input->post('name'));
            $description = isset($raw_input['description']) ? trim($raw_input['description']) : trim($this->input->post('description'));
            $price       = isset($raw_input['price']) ? (float)$raw_input['price'] : (float)$this->input->post('price');
            $services    = isset($raw_input['services']) ? $raw_input['services'] : null;

            if (empty($name) || $price < 0) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'El nombre es obligatorio y el precio no puede ser negativo.'
                ], 400);
            }

            $plan_data = [
                'agency_id'   => $agency_id,
                'name'        => $name,
                'description' => !empty($description) ? $description : null,
                'price'       => $price,
                'status'      => 1
            ];

            $new_plan_id = $this->Treatments_model->create_plan($plan_data, $services);

            if ($new_plan_id) {
                $this->response_json([
                    'status'  => 'success',
                    'message' => 'Plantilla de tratamiento creada correctamente.',
                    'data'    => ['id' => $new_plan_id]
                ], 201);
            } else {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Error al crear la plantilla de tratamiento en la base de datos.'
                ], 500);
            }
        }

        $this->response_json(['status' => 'error', 'message' => 'Método no permitido.'], 405);
    }

    /**
     * GET /api/treatment-plans/{id} -> Ver detalle.
     * POST /api/treatment-plans/{id} -> Actualizar.
     * DELETE /api/treatment-plans/{id} -> Inactivar (borrado lógico).
     */
    public function plans_handle($id = null) 
    {
        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID no proporcionado.'], 400);
        }

        $method = strtolower($this->input->method());
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $plan = $this->Treatments_model->get_plan_by_id($id, $agency_id);
        if (!$plan) {
            $this->response_json(['status' => 'error', 'message' => 'La plantilla de tratamiento no existe o no tiene permisos sobre ella.'], 404);
        }

        if ($method === 'get') {
            $this->response_json([
                'status' => 'success',
                'data'   => $plan
            ], 200);
        }

        if ($method === 'post') {
            $raw_input = json_decode($this->input->raw_input_stream, true);
            
            $name        = isset($raw_input['name']) ? trim($raw_input['name']) : trim($this->input->post('name'));
            $description = isset($raw_input['description']) ? trim($raw_input['description']) : trim($this->input->post('description'));
            $price       = isset($raw_input['price']) ? (float)$raw_input['price'] : null;
            $services    = isset($raw_input['services']) ? $raw_input['services'] : null;
            $status      = isset($raw_input['status']) ? (int)$raw_input['status'] : null;

            $update_data = [];
            if ($name !== '') $update_data['name'] = $name;
            if ($description !== null) $update_data['description'] = !empty($description) ? $description : null;
            if ($price !== null && $price >= 0) $update_data['price'] = $price;
            if ($status !== null) $update_data['status'] = $status;

            $success = $this->Treatments_model->update_plan($id, $agency_id, $update_data, $services);

            if ($success) {
                $this->response_json([
                    'status'  => 'success',
                    'message' => 'Plantilla de tratamiento actualizada correctamente.'
                ], 200);
            } else {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Error al actualizar la plantilla de tratamiento.'
                ], 500);
            }
        }

        if ($method === 'delete') {
            $success = $this->Treatments_model->delete_plan($id, $agency_id);
            if ($success) {
                $this->response_json([
                    'status'  => 'success',
                    'message' => 'Plantilla de tratamiento desactivada correctamente.'
                ], 200);
            } else {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Error al desactivar la plantilla de tratamiento.'
                ], 500);
            }
        }

        $this->response_json(['status' => 'error', 'message' => 'Método no permitido.'], 405);
    }

    // =========================================================================
    // ENDPOINTS DE ASIGNACIÓN A PACIENTES
    // =========================================================================

    /**
     * GET /api/patient-treatments -> Listar tratamientos asignados.
     * POST /api/patient-treatments -> Asignar tratamiento a un paciente.
     */
    public function patient_treatments_index() 
    {
        $method = strtolower($this->input->method());
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        if ($method === 'get') {
            $patient_id = $this->input->get('patient_id', TRUE);
            $status     = $this->input->get('status', TRUE);

            $treatments = $this->Treatments_model->get_patient_treatments(
                $agency_id, 
                !empty($patient_id) ? (int)$patient_id : null, 
                !empty($status) ? $status : null
            );

            $this->response_json([
                'status' => 'success',
                'data'   => $treatments
            ], 200);
        }

        if ($method === 'post') {
            $raw_input = json_decode($this->input->raw_input_stream, true);

            $patient_id        = isset($raw_input['patient_id']) ? (int)$raw_input['patient_id'] : (int)$this->input->post('patient_id');
            $treatment_plan_id = isset($raw_input['treatment_plan_id']) ? (int)$raw_input['treatment_plan_id'] : (int)$this->input->post('treatment_plan_id');
            $name              = isset($raw_input['name']) ? trim($raw_input['name']) : trim($this->input->post('name'));
            $price             = isset($raw_input['price']) ? (float)$raw_input['price'] : (float)$this->input->post('price');
            $start_date        = isset($raw_input['start_date']) ? trim($raw_input['start_date']) : trim($this->input->post('start_date'));
            $end_date          = isset($raw_input['end_date']) ? trim($raw_input['end_date']) : trim($this->input->post('end_date'));
            $notes             = isset($raw_input['notes']) ? trim($raw_input['notes']) : trim($this->input->post('notes'));
            $services          = isset($raw_input['services']) ? $raw_input['services'] : [];

            // 1. Validaciones de entrada obligatorias
            if (empty($patient_id) || empty($name) || $price < 0) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Los campos patient_id y name son obligatorios, y el precio no puede ser negativo.'
                ], 400);
            }

            // 2. Verificar que el paciente exista y pertenezca a la misma agencia con rol_id = 8
            $patient = $this->Patients_model->get_patient_by_id($patient_id, $agency_id);
            if (!$patient) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'El paciente no existe, está inactivo o no pertenece a esta agencia.'
                ], 404);
            }

            // 3. Si se especifica una plantilla, validar e importar los servicios si no se pasaron servicios específicos
            if (!empty($treatment_plan_id) && empty($services)) {
                $plan = $this->Treatments_model->get_plan_by_id($treatment_plan_id, $agency_id);
                if ($plan && !empty($plan['services'])) {
                    foreach ($plan['services'] as $ps) {
                        $services[] = [
                            'service_id'       => $ps['service_id'],
                            'quantity_ordered' => $ps['sessions_count']
                        ];
                    }
                }
            }

            $treatment_data = [
                'agency_id'         => $agency_id,
                'patient_id'        => $patient_id,
                'treatment_plan_id' => !empty($treatment_plan_id) ? $treatment_plan_id : null,
                'name'              => $name,
                'price'             => $price,
                'status'            => 'active',
                'start_date'        => !empty($start_date) ? $start_date : date('Y-m-d'),
                'end_date'          => !empty($end_date) ? $end_date : null,
                'notes'             => !empty($notes) ? $notes : null
            ];

            $new_id = $this->Treatments_model->assign_treatment($treatment_data, $services);

            if ($new_id) {
                $this->response_json([
                    'status'  => 'success',
                    'message' => 'Tratamiento asignado correctamente al paciente.',
                    'data'    => ['id' => $new_id]
                ], 201);
            } else {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Ocurrió un error al intentar asignar el tratamiento en la base de datos.'
                ], 500);
            }
        }

        $this->response_json(['status' => 'error', 'message' => 'Método no permitido.'], 405);
    }

    /**
     * GET /api/patient-treatments/{id} -> Detalle de tratamiento asignado (sesiones + extras).
     * POST /api/patient-treatments/{id} -> Modificar cabecera de tratamiento asignado.
     * DELETE /api/patient-treatments/{id} -> Cancelar tratamiento.
     */
    public function patient_treatments_handle($id = null) 
    {
        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID no proporcionado.'], 400);
        }

        $method = strtolower($this->input->method());
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $treatment = $this->Treatments_model->get_patient_treatment_by_id($id, $agency_id);
        if (!$treatment) {
            $this->response_json(['status' => 'error', 'message' => 'El tratamiento del paciente no existe o no tiene permisos sobre él.'], 404);
        }

        if ($method === 'get') {
            $this->response_json([
                'status' => 'success',
                'data'   => $treatment
            ], 200);
        }

        if ($method === 'post') {
            $raw_input = json_decode($this->input->raw_input_stream, true);

            $status     = isset($raw_input['status']) ? trim($raw_input['status']) : trim($this->input->post('status'));
            $price      = isset($raw_input['price']) ? (float)$raw_input['price'] : null;
            $start_date = isset($raw_input['start_date']) ? trim($raw_input['start_date']) : trim($this->input->post('start_date'));
            $end_date   = isset($raw_input['end_date']) ? trim($raw_input['end_date']) : trim($this->input->post('end_date'));
            $notes      = isset($raw_input['notes']) ? trim($raw_input['notes']) : trim($this->input->post('notes'));

            $update_data = [];
            if ($status !== '') $update_data['status'] = $status;
            if ($price !== null && $price >= 0) $update_data['price'] = $price;
            if ($start_date !== '') $update_data['start_date'] = $start_date;
            if ($end_date !== '') $update_data['end_date'] = !empty($end_date) ? $end_date : null;
            if ($notes !== null) $update_data['notes'] = !empty($notes) ? $notes : null;

            $update_data['updated_at'] = date('Y-m-d H:i:s');

            $success = $this->Treatments_model->update_patient_treatment($id, $agency_id, $update_data);

            if ($success) {
                $this->response_json([
                    'status'  => 'success',
                    'message' => 'Tratamiento de paciente actualizado correctamente.'
                ], 200);
            } else {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Error al actualizar el tratamiento del paciente.'
                ], 500);
            }
        }

        if ($method === 'delete') {
            $success = $this->Treatments_model->delete_patient_treatment($id, $agency_id);
            if ($success) {
                $this->response_json([
                    'status'  => 'success',
                    'message' => 'Tratamiento cancelado correctamente.'
                ], 200);
            } else {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'Error al cancelar el tratamiento.'
                ], 500);
            }
        }

        $this->response_json(['status' => 'error', 'message' => 'Método no permitido.'], 405);
    }

    // =========================================================================
    // ENDPOINTS DE CONTROL DE SESIONES
    // =========================================================================

    /**
     * POST /api/patient-treatments/{id}/sessions -> Registrar sesión consumida.
     */
    public function patient_treatments_sessions($patient_treatment_id = null) 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Método no permitido. Use POST.'], 405);
        }

        if (empty($patient_treatment_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de tratamiento no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Validar que el tratamiento existe y pertenece a la agencia
        $treatment = $this->Treatments_model->get_patient_treatment_by_id($patient_treatment_id, $agency_id);
        if (!$treatment) {
            $this->response_json(['status' => 'error', 'message' => 'El tratamiento no existe o no tiene permisos sobre él.'], 404);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $patient_treatment_service_id = isset($raw_input['patient_treatment_service_id']) ? (int)$raw_input['patient_treatment_service_id'] : (int)$this->input->post('patient_treatment_service_id');
        $session_date                 = isset($raw_input['session_date']) ? trim($raw_input['session_date']) : trim($this->input->post('session_date'));
        $notes                        = isset($raw_input['notes']) ? trim($raw_input['notes']) : trim($this->input->post('notes'));

        if (empty($patient_treatment_service_id)) {
            $this->response_json(['status' => 'error', 'message' => 'El campo patient_treatment_service_id es obligatorio.'], 400);
        }

        if (empty($session_date)) {
            $session_date = date('Y-m-d H:i:s');
        }

        $result = $this->Treatments_model->register_session(
            $patient_treatment_id,
            $patient_treatment_service_id,
            $session_date,
            !empty($notes) ? $notes : null
        );

        if ($result['status'] === 'success') {
            $this->response_json($result, 201);
        } else {
            $this->response_json($result, 400);
        }
    }

    /**
     * DELETE /api/patient-treatments/sessions/{session_id} -> Revertir/eliminar sesión.
     */
    public function delete_session($session_id = null) 
    {
        $method = strtolower($this->input->method());
        // En CodeIgniter, a veces se emulan las peticiones DELETE vía POST. Aceptamos ambas.
        if ($method !== 'delete' && $method !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Método no permitido. Use DELETE.'], 405);
        }

        if (empty($session_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de sesión no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $result = $this->Treatments_model->delete_session($session_id, $agency_id);

        if ($result['status'] === 'success') {
            $this->response_json($result, 200);
        } else {
            $this->response_json($result, 400);
        }
    }

    // =========================================================================
    // ENDPOINTS DE CARGOS EXTRAS
    // =========================================================================

    /**
     * POST /api/patient-treatments/{id}/extras -> Agregar cargo extra.
     */
    public function patient_treatments_extras($patient_treatment_id = null) 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Método no permitido. Use POST.'], 405);
        }

        if (empty($patient_treatment_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de tratamiento no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Validar que el tratamiento existe y pertenece a la agencia
        $treatment = $this->Treatments_model->get_patient_treatment_by_id($patient_treatment_id, $agency_id);
        if (!$treatment) {
            $this->response_json(['status' => 'error', 'message' => 'El tratamiento no existe o no tiene permisos sobre él.'], 404);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $name     = isset($raw_input['name']) ? trim($raw_input['name']) : trim($this->input->post('name'));
        $price    = isset($raw_input['price']) ? (float)$raw_input['price'] : (float)$this->input->post('price');
        $quantity = isset($raw_input['quantity']) ? (int)$raw_input['quantity'] : (int)$this->input->post('quantity');
        $notes    = isset($raw_input['notes']) ? trim($raw_input['notes']) : trim($this->input->post('notes'));

        if (empty($name) || $price < 0) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'El nombre del extra es obligatorio y el precio no puede ser negativo.'
            ], 400);
        }

        if ($quantity <= 0) {
            $quantity = 1;
        }

        $extra_data = [
            'patient_treatment_id' => $patient_treatment_id,
            'name'                 => $name,
            'price'                => $price,
            'quantity'             => $quantity,
            'notes'                => !empty($notes) ? $notes : null
        ];

        $extra_id = $this->Treatments_model->add_extra($extra_data);

        if ($extra_id) {
            $this->response_json([
                'status'  => 'success',
                'message' => 'Cargo extra agregado correctamente.',
                'data'    => ['id' => $extra_id]
            ], 201);
        } else {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Ocurrió un error al insertar el cargo extra en la base de datos.'
            ], 500);
        }
    }

    /**
     * DELETE /api/patient-treatments/extras/{extra_id} -> Eliminar cargo extra.
     */
    public function delete_extra($extra_id = null) 
    {
        $method = strtolower($this->input->method());
        if ($method !== 'delete' && $method !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Método no permitido. Use DELETE.'], 405);
        }

        if (empty($extra_id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID del cargo extra no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $result = $this->Treatments_model->delete_extra($extra_id, $agency_id);

        if ($result['status'] === 'success') {
            $this->response_json($result, 200);
        } else {
            $this->response_json($result, 400);
        }
    }

    // =========================================================================
    // MÉTODOS PRIVADOS AUXILIARES PARA VALIDACIÓN JWT
    // =========================================================================

    /**
     * Valida la presencia y firma del JWT del header Authorization.
     * Retorna el payload decodificado en caso de éxito o finaliza con 401.
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

    private function validate_jwt($token) 
    {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }
        
        $header            = $tokenParts[0];
        $payload           = $tokenParts[1];
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
}
