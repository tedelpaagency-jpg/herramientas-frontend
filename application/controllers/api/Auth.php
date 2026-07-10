<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Auth Controller for REST API Authentication
 */
class Auth extends CI_Controller 
{
    private $jwt_secret = 'super-secret-key-change-in-production-1234567890!';
    private $jwt_expiration = 7200; // Token duration: 2 hours (in seconds)

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
     * POST /api/auth/login
     * Exposes authentication checking and generates a JWT.
     */
    public function login() 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        // Get inputs (support both JSON body and standard form post inputs)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        $username = isset($raw_input['username']) ? $raw_input['username'] : $this->input->post('username');
        $password = isset($raw_input['password']) ? $raw_input['password'] : $this->input->post('password');

        if (empty($username) || empty($password)) {
            $this->response_json(['status' => 'error', 'message' => 'Username and password are required.'], 400);
        }

        // Call the centralized login check method in Crud_model
        $auth_result = $this->crud_model->check_login($username, $password);

        if ($auth_result) {
            $user = $auth_result['user'];
            $rol = $auth_result['rol'];

            // Log entry into the binnacle
            $this->crud_model->log_binnacle($user->user_id, $rol->rol);

            // Construct payload with required tenant and authorization claims
            $token_payload = [
                'user_id'    => $user->user_id,
                'rol_id'     => $user->rol_id,
                'role_name'  => $rol->rol,
                'name'       => $user->name . ' ' . $user->last_name,
                'company_id' => $user->company_id,
                'pais_id'    => $user->pais_id,
                'agency_id'  => $user->agency_id // tenant key
            ];

            // Generate Token
            $token = $this->generate_jwt($token_payload);

            $this->response_json([
                'status'  => 'success',
                'message' => 'Authenticated successfully',
                'token'   => $token,
                'expires_in' => $this->jwt_expiration
            ], 200);
        } else {
            $this->response_json([
                'status'  => 'error',
                'message' => 'Invalid username or password'
            ], 401);
        }
    }

    /**
     * POST /api/auth/logout
     * Sign out / discard current JWT from the client side.
     */
    public function logout() 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token not provided.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Invalid or expired token.'], 401);
        }

        $this->response_json([
            'status'  => 'success',
            'message' => 'Logged out successfully. Please discard the token on the client.'
        ], 200);
    }

    /**
     * POST /api/auth/refresh
     * Generates a new token if the supplied token is valid and not expired.
     */
    public function refresh() 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token not provided.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Invalid or expired token.'], 401);
        }

        // Re-generate the token payload with fresh expiry timestamp
        unset($decoded['iat']);
        unset($decoded['exp']);

        $new_token = $this->generate_jwt($decoded);

        $this->response_json([
            'status'  => 'success',
            'token'   => $new_token,
            'expires_in' => $this->jwt_expiration
        ], 200);
    }

    /**
     * GET /api/auth/me
     * Returns profile details of the currently authenticated user.
     */
    public function me() 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token not provided.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Invalid or expired token.'], 401);
        }

        // Fetch fresh user data from database
        $user_id = $decoded['user_id'];
        $user = $this->db->get_where('user', ['user_id' => $user_id, 'status' => 1])->row();

        if (!$user) {
            $this->response_json(['status' => 'error', 'message' => 'User not found or inactive.'], 404);
        }

        $profile = [
            'user_id'    => $user->user_id,
            'name'       => $user->name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'username'   => $user->username,
            'phone'      => $user->phone,
            'rol_id'     => $user->rol_id,
            'agency_id'  => $user->agency_id,
            'company_id' => $user->company_id,
            'status'     => $user->status,
        ];

        $this->response_json([
            'status' => 'success',
            'data'   => $profile
        ], 200);
    }

    /**
     * POST /api/auth/register
     * Register a new Doctor user (inactive, status = 0).
     */
    public function register()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $name = isset($raw_input['name']) ? trim($raw_input['name']) : trim($this->input->post('name'));
        $last_name = isset($raw_input['last_name']) ? trim($raw_input['last_name']) : trim($this->input->post('last_name'));
        $email = isset($raw_input['email']) ? trim($raw_input['email']) : trim($this->input->post('email'));
        $password = isset($raw_input['password']) ? $raw_input['password'] : $this->input->post('password');
        $phone = isset($raw_input['phone']) ? trim($raw_input['phone']) : trim($this->input->post('phone'));
        $agency_id = isset($raw_input['agency_id']) ? intval($raw_input['agency_id']) : intval($this->input->post('agency_id'));

        // Basic validations
        if (empty($name) || empty($last_name) || empty($email) || empty($password)) {
            $this->response_json(['status' => 'error', 'message' => 'Los campos name, last_name, email y password son obligatorios.'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->response_json(['status' => 'error', 'message' => 'El correo electrónico no es válido.'], 400);
        }

        // Email uniqueness check
        $this->db->where('email', $email);
        if ($this->db->get('user')->num_rows() > 0) {
            $this->response_json(['status' => 'error', 'message' => 'El correo electrónico ya se encuentra registrado.'], 409);
        }

        // Username uniqueness check
        $username = isset($raw_input['username']) ? trim($raw_input['username']) : trim($this->input->post('username'));
        if (empty($username)) {
            $username = $email;
        }

        $this->db->where('username', $username);
        if ($this->db->get('user')->num_rows() > 0) {
            $this->response_json(['status' => 'error', 'message' => 'El nombre de usuario ya se encuentra registrado.'], 409);
        }

        // Token generation
        $code = sprintf("%06d", mt_rand(1, 999999));
        $expiry = date('Y-m-d H:i:s', time() + 86400); // 24 hours

        $user_data = [
            'name' => $name,
            'last_name' => $last_name,
            'email' => $email,
            'username' => $username,
            'password' => $password,
            'phone' => $phone,
            'agency_id' => $agency_id > 0 ? $agency_id : 1,
            'verification_token' => $code,
            'verification_token_expiry' => $expiry
        ];

        // Insert doctor
        $user_id = $this->crud_model->register_doctor($user_data);

        if ($user_id) {
            // Load and send email view
            $this->load->model('email_model');
            $page_data = [
                'name' => $name . ' ' . $last_name,
                'code' => $code
            ];

            $message = $this->load->view(
                'backend/emails/verify_account.php',
                $page_data,
                true
            );

            $this->email_model->send_mail_request(
                $email,
                'Verifica tu cuenta - Recetar Fácil',
                $message
            );

            $this->response_json([
                'status' => 'success',
                'message' => 'Doctor registrado con éxito. Por favor verifique su correo electrónico para activar la cuenta.'
            ], 201);
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Error al registrar el doctor.'], 500);
        }
    }

    /**
     * POST /api/auth/verify-email
     * Verify email verification code and activate account.
     */
    public function verify_email()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $code = isset($raw_input['code']) ? trim($raw_input['code']) : trim($this->input->get_post('code'));

        if (empty($code)) {
            $this->response_json(['status' => 'error', 'message' => 'El código es obligatorio.'], 400);
        }

        $result = $this->crud_model->verify_email_token($code);

        if ($result) {
            $this->response_json([
                'status' => 'success',
                'message' => 'Cuenta activada correctamente.'
            ], 200);
        } else {
            $this->response_json([
                'status' => 'error',
                'message' => 'Código inválido o expirado.'
            ], 400);
        }
    }

    /**
     * POST /api/auth/forgot-password
     * Issue password recovery email.
     */
    public function forgot_password()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $email = isset($raw_input['email']) ? trim($raw_input['email']) : trim($this->input->post('email'));

        if (empty($email)) {
            $this->response_json(['status' => 'error', 'message' => 'El correo electrónico es obligatorio.'], 400);
        }

        // Get user details
        $user = $this->db->get_where('user', ['email' => $email, 'status' => 1])->row();

        if (!$user) {
            // Avoid revealing if email exists for security (or optionally throw a 404).
            // Here we return 200 to prevent user enumeration.
            $this->response_json([
                'status' => 'success',
                'message' => 'Si el correo electrónico está registrado, se ha enviado un código de recuperación.'
            ], 200);
        }

        $code = sprintf("%06d", mt_rand(1, 999999));
        $expiry = date('Y-m-d H:i:s', time() + 3600); // 1 hour

        // Save code in DB
        $this->crud_model->set_reset_token($email, $code, $expiry);

        // Send Email
        $this->load->model('email_model');
        $page_data = [
            'name' => $user->name . ' ' . $user->last_name,
            'code' => $code
        ];

        $message = $this->load->view(
            'backend/emails/reset_password.php',
            $page_data,
            true
        );

        $this->email_model->send_mail_request(
            $email,
            'Código de Recuperación de Contraseña - Recetar Fácil',
            $message
        );

        $this->response_json([
            'status' => 'success',
            'message' => 'Si el correo electrónico está registrado, se ha enviado un código de recuperación.'
        ], 200);
    }

    /**
     * POST /api/auth/reset-password
     * Use token to reset password.
     */
    public function reset_password()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $code = isset($raw_input['code']) ? trim($raw_input['code']) : trim($this->input->get_post('code'));
        $new_password = isset($raw_input['new_password']) ? $raw_input['new_password'] : $this->input->post('new_password');
        $confirm_password = isset($raw_input['confirm_password']) ? $raw_input['confirm_password'] : $this->input->post('confirm_password');

        if (empty($code) || empty($new_password) || empty($confirm_password)) {
            $this->response_json(['status' => 'error', 'message' => 'Todos los campos son obligatorios.'], 400);
        }

        if ($new_password !== $confirm_password) {
            $this->response_json(['status' => 'error', 'message' => 'Las contraseñas no coinciden.'], 400);
        }

        // Reset password using code
        $result = $this->crud_model->reset_password_with_token($code, $new_password);

        if ($result) {
            $this->response_json([
                'status' => 'success',
                'message' => 'Contraseña restablecida correctamente.'
            ], 200);
        } else {
            $this->response_json([
                'status' => 'error',
                'message' => 'Código inválido o expirado.'
            ], 400);
        }
    }

    /**
     * POST /api/auth/verify-reset-code
     * Verify if the reset code is valid before proceeding to change the password.
     */
    public function verify_reset_code()
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        $raw_input = json_decode($this->input->raw_input_stream, true);
        $code = isset($raw_input['code']) ? trim($raw_input['code']) : trim($this->input->get_post('code'));

        if (empty($code)) {
            $this->response_json(['status' => 'error', 'message' => 'El código es obligatorio.'], 400);
        }

        $is_valid = $this->crud_model->verify_reset_token($code);

        if ($is_valid) {
            $this->response_json([
                'status' => 'success',
                'message' => 'Código válido.'
            ], 200);
        } else {
            $this->response_json([
                'status' => 'error',
                'message' => 'Código inválido o expirado.'
            ], 400);
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

    private function generate_jwt($payload) 
    {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $this->jwt_expiration;
        
        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->jwt_secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
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
