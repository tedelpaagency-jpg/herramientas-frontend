<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Services API Controller
 *
 * Módulo de Catálogo de Servicios para usuarios de la sucursal/agencia autenticada.
 */
class Services extends CI_Controller 
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct() 
    {
        parent::__construct();
        $this->load->model('Services_model');
        $this->load->database();

        // CORS Headers
        $this->output->set_header('Access-Control-Allow-Origin: *');
        $this->output->set_header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $this->output->set_header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

        // Handle CORS OPTIONS preflight
        if (strtolower($this->input->method()) === 'options') {
            $this->output->set_status_header(200);
            $this->output->_display();
            exit;
        }

        // Configurar JWT secret key desde config si existe
        $config_jwt_key = $this->config->item('jwt_key');
        if (!empty($config_jwt_key)) {
            $this->jwt_secret = $config_jwt_key;
        } elseif (!empty($this->config->item('encryption_key'))) {
            $this->jwt_secret = $this->config->item('encryption_key');
        }
    }

    /**
     * Enrutador principal para /api/services
     * GET  -> Obtener servicios
     * POST -> Crear servicio
     */
    public function index() 
    {
        $method = strtolower($this->input->method());
        if ($method === 'get') {
            $this->get_all();
        } elseif ($method === 'post') {
            $this->create();
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Método no permitido. Use GET o POST.'], 405);
        }
    }

    /**
     * Enrutador para /api/services/{id}
     * GET    -> Obtener servicio específico
     * PUT    -> Actualizar servicio
     * DELETE -> Soft delete de servicio
     */
    public function handle_service($id = null) 
    {
        if (empty($id) || !is_numeric($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de servicio no válido o no proporcionado.'], 400);
        }

        $method = strtolower($this->input->method());
        if ($method === 'get') {
            $this->get_one($id);
        } elseif ($method === 'put') {
            $this->update($id);
        } elseif ($method === 'delete') {
            $this->delete($id);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Método no permitido. Use GET, PUT o DELETE.'], 405);
        }
    }

    /**
     * GET /api/services
     * Obtener todos los servicios activos de la agencia autenticada (con búsqueda opcional).
     */
    private function get_all() 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $search = $this->input->get('search', TRUE);

        $services = $this->Services_model->get_services($agency_id, $search);

        $this->response_json([
            'status' => 'success',
            'data'   => $services
        ], 200);
    }

    /**
     * GET /api/services/{id}
     * Obtener un servicio específico por ID.
     */
    private function get_one($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $service = $this->Services_model->get_by_id($id, $agency_id);

        if (!$service) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Servicio no encontrado o no pertenece a la agencia.'
            ], 404);
        }

        $this->response_json([
            'status' => 'success',
            'data'   => $service
        ], 200);
    }

    /**
     * POST /api/services
     * Crear un nuevo servicio.
     */
    private function create() 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $data = $this->get_request_data();

        $name        = isset($data['name']) ? trim($data['name']) : '';
        $description = isset($data['description']) ? trim($data['description']) : '';
        $price       = isset($data['price']) ? $data['price'] : null;

        if (empty($name)) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'El campo "name" es obligatorio.'
            ], 400);
        }

        if ($price === null || $price === '' || !is_numeric($price) || $price < 0) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'El campo "price" debe ser un número válido mayor o igual a 0.'
            ], 400);
        }

        $insert_data = [
            'agency_id'   => $agency_id,
            'name'        => $name,
            'description' => $description,
            'price'       => number_format((float)$price, 2, '.', ''),
            'status'      => 1,
            'created_at'  => date('Y-m-d H:i:s'),
            'updated_at'  => date('Y-m-d H:i:s')
        ];

        $service_id = $this->Services_model->create($insert_data);

        if ($service_id) {
            $new_service = $this->Services_model->get_by_id($service_id, $agency_id);
            $this->response_json([
                'status'  => 'success',
                'message' => 'Servicio creado correctamente.',
                'data'    => $new_service
            ], 201);
        } else {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Error al crear el servicio.'
            ], 500);
        }
    }

    /**
     * PUT /api/services/{id}
     * Actualizar un servicio existente.
     */
    private function update($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Verificar que el servicio exista y pertenezca a la agencia
        $service = $this->Services_model->get_by_id_any_status($id, $agency_id);
        if (!$service) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Servicio no encontrado o no pertenece a la agencia.'
            ], 404);
        }

        $data = $this->get_request_data();

        $update_data = [];

        if (isset($data['name'])) {
            $name = trim($data['name']);
            if (empty($name)) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'El campo "name" no puede estar vacío.'
                ], 400);
            }
            $update_data['name'] = $name;
        }

        if (array_key_exists('description', $data)) {
            $update_data['description'] = trim($data['description']);
        }

        if (isset($data['price'])) {
            if (!is_numeric($data['price']) || $data['price'] < 0) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'El campo "price" debe ser un número válido mayor o igual a 0.'
                ], 400);
            }
            $update_data['price'] = number_format((float)$data['price'], 2, '.', '');
        }

        if (isset($data['status'])) {
            $status = (int)$data['status'];
            if (!in_array($status, [0, 1], true)) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => 'El campo "status" debe ser 0 o 1.'
                ], 400);
            }
            $update_data['status'] = $status;
        }

        if (empty($update_data)) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'No se enviaron campos válidos para actualizar.'
            ], 400);
        }

        $update_data['updated_at'] = date('Y-m-d H:i:s');

        $this->Services_model->update($id, $agency_id, $update_data);
        $updated_service = $this->Services_model->get_by_id_any_status($id, $agency_id);

        $this->response_json([
            'status'  => 'success',
            'message' => 'Servicio actualizado correctamente.',
            'data'    => $updated_service
        ], 200);
    }

    /**
     * DELETE /api/services/{id}
     * Realiza Soft Delete (status = 0).
     */
    private function delete($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $service = $this->Services_model->get_by_id($id, $agency_id);
        if (!$service) {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Servicio no encontrado o ya ha sido eliminado.'
            ], 404);
        }

        $success = $this->Services_model->soft_delete($id, $agency_id);

        if ($success) {
            $this->response_json([
                'status'  => 'success',
                'message' => 'Servicio eliminado correctamente.'
            ], 200);
        } else {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Error al eliminar el servicio.'
            ], 500);
        }
    }

    // --- Helpers privados ---

    private function get_request_data() 
    {
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (!is_array($raw_input)) {
            $raw_input = json_decode(file_get_contents('php://input'), true);
        }
        if (is_array($raw_input)) {
            return $raw_input;
        }
        return $this->input->post() ? $this->input->post() : [];
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

        if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function response_json($data, $status_code = 200) 
    {
        $this->output
             ->set_content_type('application/json', 'utf-8')
             ->set_status_header($status_code)
             ->set_output(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))
             ->_display();
        exit;
    }
}
