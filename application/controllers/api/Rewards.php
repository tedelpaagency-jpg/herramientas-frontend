<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Rewards API Controller
 */
class Rewards extends CI_Controller 
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';

    public function __construct() 
    {
        parent::__construct();
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
     * GET /api/rewards
     *
     * List all available rewards/prizes of the authenticated user's agency.
     */
    public function index()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        // Authenticate request
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Query active rewards for the agency
        $rewards = $this->crud_model->getAgencyRewardsWithDetails($agency_id);

        $formatted_rewards = [];
        foreach ($rewards as $row) {
            $formatted_rewards[] = [
                'agency_reward_id' => (int)$row['id'],
                'reward_id'        => (int)$row['reward_id'],
                'name'             => $row['name'],
                'description'      => $row['description'],
                'points'           => (float)$row['points'],
                'status'           => (int)$row['status']
            ];
        }

        $this->response_json([
            'status'  => 'success',
            'rewards' => $formatted_rewards
        ], 200);
    }

    /**
     * GET /api/rewards/points
     *
     * Retrieve the current point balance of the authenticated agency.
     */
    public function points()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        // Authenticate request
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Get points total using model method for the agency
        $points_total = $this->crud_model->getUserPointsTotal('agency', $agency_id);

        $this->response_json([
            'status' => 'success',
            'points' => (float)$points_total
        ], 200);
    }

    /**
     * POST /api/rewards/redeem
     *
     * Request redemption of a specific agency reward.
     */
    public function redeem()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        // Authenticate request
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Get POST/JSON inputs
        $raw_input = json_decode(file_get_contents('php://input'), true);
        $agency_reward_id = isset($raw_input['agency_reward_id']) ? (int)$raw_input['agency_reward_id'] : (int)$this->input->post('agency_reward_id');

        if (!$agency_reward_id) {
            $this->response_json(['status' => 'error', 'message' => 'Falta el parámetro agency_reward_id.'], 400);
        }

        $result = $this->crud_model->requestAgencyRewardRedemption($agency_reward_id, $agency_id);

        if ($result['status'] === 'success') {
            $this->response_json($result, 200);
        } else {
            $this->response_json($result, 400);
        }
    }

    /**
     * GET /api/rewards/roulette
     *
     * Check if the authenticated user's agency has an active roulette.
     */
    public function roulette()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        // Authenticate request
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Query active roulette spin for this agency
        $ruleta = $this->db
            ->where('agency_id', $agency_id)
            ->where('status', 1)
            ->get('agency_roulette')
            ->row();

        if ($ruleta) {
            // Get roulette wheel config details
            $roulette_config = $this->db
                ->where('id', $ruleta->roulette_id)
                ->get('roulettes')
                ->row();

            $this->response_json([
                'status'       => 'success',
                'has_roulette' => true,
                'roulette'     => [
                    'id'               => (int)$ruleta->id,
                    'roulette_id'      => (int)$ruleta->roulette_id,
                    'title'            => $roulette_config ? $roulette_config->title : 'Ruleta',
                    'description'      => $roulette_config ? $roulette_config->description : '',
                    'assigned_at'      => $ruleta->assigned_at
                ]
            ], 200);
        } else {
            $this->response_json([
                'status'       => 'success',
                'has_roulette' => false,
                'roulette'     => null
            ], 200);
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
