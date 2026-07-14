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

    // =========================================================================
    // Perfil del usuario autenticado
    // =========================================================================

    /**
     * PUT /api/auth/profile
     *
     * Actualiza los datos del usuario autenticado.
     * Campos permitidos: name, last_name, email, username, phone, password, photo (file)
     * Campos protegidos (nunca se modifican): rol_id, agency_id, company_id, status
     * Nota: cuando se sube foto, usar Content-Type: multipart/form-data
     */
    public function update_profile()
    {
        if (strtolower($this->input->method()) !== 'put') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use PUT.'], 405);
        }

        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token no proporcionado.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Token inválido o expirado.'], 401);
        }

        $user_id   = $decoded['user_id'];
        $agency_id = $decoded['agency_id'];

        // Verificar que el usuario existe y está activo
        $user = $this->db->get_where('user', ['user_id' => $user_id, 'status' => 1])->row();
        if (!$user) {
            $this->response_json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
        }

        // Leer body (soporte JSON y form-data)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        // Solo los campos editables por el propio usuario
        $data = [];

        $name      = trim($this->input->post('name'));
        $last_name = trim($this->input->post('last_name'));
        $email     = trim($this->input->post('email'));
        $username  = trim($this->input->post('username'));
        $phone     = trim($this->input->post('phone'));
        $password  = $this->input->post('password');

        if (!empty($name))      $data['name']      = $name;
        if (!empty($last_name)) $data['last_name']  = $last_name;
        if (!empty($phone))     $data['phone']      = $phone;

        // Validar unicidad de email si se cambia
        if (!empty($email) && $email !== $user->email) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->response_json(['status' => 'error', 'message' => 'El correo electrónico no es válido.'], 400);
            }
            $exists = $this->db->where('email', $email)->where('user_id !=', $user_id)->get('user')->num_rows();
            if ($exists > 0) {
                $this->response_json(['status' => 'error', 'message' => 'El correo electrónico ya está en uso.'], 409);
            }
            $data['email'] = $email;
        }

        // Validar unicidad de username si se cambia
        if (!empty($username) && $username !== $user->username) {
            $exists = $this->db->where('username', $username)->where('user_id !=', $user_id)->get('user')->num_rows();
            if ($exists > 0) {
                $this->response_json(['status' => 'error', 'message' => 'El nombre de usuario ya está en uso.'], 409);
            }
            $data['username'] = $username;
        }

        // Cambio de contraseña (solo si se envía)
        if (!empty($password)) {
            $data['password'] = $password;
        }

        // Foto de perfil (opcional) — guardada en public/assets/images/users/
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $file     = $_FILES['photo'];
            $allowed  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $max_size = 2 * 1024 * 1024; // 2 MB

            if (!in_array(mime_content_type($file['tmp_name']), $allowed)) {
                $this->response_json(['status' => 'error', 'message' => 'Formato de imagen no permitido. Use JPG, PNG, WEBP o GIF.'], 400);
            }

            if ($file['size'] > $max_size) {
                $this->response_json(['status' => 'error', 'message' => 'La imagen no debe superar 2 MB.'], 400);
            }

            $upload_dir = FCPATH . 'public/assets/images/users/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'user_' . $user_id . '_' . time() . '.' . $ext;

            if (!move_uploaded_file($file['tmp_name'], $upload_dir . $filename)) {
                $this->response_json(['status' => 'error', 'message' => 'No se pudo guardar la imagen.'], 500);
            }

            $data['photo'] = $filename;
        }

        if (empty($data)) {
            $this->response_json(['status' => 'error', 'message' => 'No se proporcionaron campos para actualizar.'], 400);
        }

        // Campos protegidos: rol_id, agency_id, company_id, status — NUNCA se tocan
        $this->db->where('user_id', $user_id)->update('user', $data);

        // Retornar perfil actualizado
        $updated = $this->db->get_where('user', ['user_id' => $user_id])->row();

        $this->response_json([
            'status'  => 'success',
            'message' => 'Perfil actualizado correctamente.',
            'data'    => [
                'user_id'   => $updated->user_id,
                'name'      => $updated->name,
                'last_name' => $updated->last_name,
                'email'     => $updated->email,
                'username'  => $updated->username,
                'phone'     => $updated->phone,
                'rol_id'    => $updated->rol_id,
                'agency_id' => $updated->agency_id,
                'status'    => $updated->status,
                'photo_url' => !empty($updated->photo)
                    ? base_url('public/assets/images/users/' . $updated->photo)
                    : null
            ]
        ], 200);
    }

    // =========================================================================
    // Configuración de la clínica
    // =========================================================================

    /**
     * GET /api/auth/clinic
     *
     * Retorna la configuración actual de la agencia/clínica del usuario autenticado.
     */
    public function get_clinic()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token no proporcionado.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Token inválido o expirado.'], 401);
        }

        $agency_id = $decoded['agency_id'];

        $agency = $this->db->get_where('agency', ['id' => $agency_id])->row_array();

        if (!$agency) {
            $this->response_json(['status' => 'error', 'message' => 'Clínica no encontrada.'], 404);
        }

        $this->response_json([
            'status' => 'success',
            'data'   => [
                'id'                   => $agency['id'],
                'name'                 => $agency['name']                 ?? null,
                'description'          => $agency['description']          ?? null,
                'address'              => $agency['address']              ?? null,
                'phone'                => $agency['phone']                ?? null,
                'email'                => $agency['email']                ?? null,
                'facebook'             => $agency['facebook']             ?? null,
                'instagram'            => $agency['instagram']            ?? null,
                'ticktock'             => $agency['ticktock']             ?? null,
                'cost_sale_price'      => $agency['cost_sale_price']      ?? null,
                'cost_delivery'        => $agency['cost_delivery']        ?? null,
                'cost_delivery_aditional' => $agency['cost_delivery_aditional'] ?? null,
                'opening_time'         => $agency['opening_time']         ?? null,
                'closing_time'         => $agency['closing_time']         ?? null,
            ]
        ], 200);
    }

    /**
     * PUT /api/auth/clinic
     *
     * Actualiza la configuración de la agencia/clínica.
     * Campos disponibles (todos opcionales):
     *   name, description, address, phone, email,
     *   facebook, instagram, ticktock,
     *   cost_sale_price, cost_delivery, cost_delivery_aditional,
     *   opening_time (HH:MM), closing_time (HH:MM)
     *
     * Campos protegidos: id, logo, favicon (se actualizan por otros medios)
     */
    public function update_clinic()
    {
        if (strtolower($this->input->method()) !== 'put') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use PUT.'], 405);
        }

        $token = $this->get_bearer_token();
        if (!$token) {
            $this->response_json(['status' => 'error', 'message' => 'Token no proporcionado.'], 401);
        }

        $decoded = $this->validate_jwt($token);
        if (!$decoded) {
            $this->response_json(['status' => 'error', 'message' => 'Token inválido o expirado.'], 401);
        }

        $agency_id = $decoded['agency_id'];

        // Verificar que la agencia existe
        $agency = $this->db->get_where('agency', ['id' => $agency_id])->row();
        if (!$agency) {
            $this->response_json(['status' => 'error', 'message' => 'Clínica no encontrada.'], 404);
        }

        // Leer body (soporte JSON y form-data)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        // Campos editables — alineados con settings.php + los dos nuevos
        $allowed = [
            'name', 'description', 'address', 'phone', 'email',
            'facebook', 'instagram', 'ticktock',
            'cost_sale_price', 'cost_delivery', 'cost_delivery_aditional',
            'opening_time', 'closing_time'
        ];

        // Campos protegidos que nunca se deben modificar vía API
        $protected = ['id', 'logo', 'favicon', 'dropi_suppliers', 'taxes',
                      'commition_percent', 'gerent_commition_percent', 'fact_value'];

        $data = [];
        foreach ($allowed as $field) {
            $value = $this->input->post($field);
            if ($value !== null && $value !== false) {
                $data[$field] = trim($value);
            }
        }

        // Validar formato HH:MM para horarios si se envían
        foreach (['opening_time', 'closing_time'] as $time_field) {
            if (!empty($data[$time_field]) && !preg_match('/^\d{2}:\d{2}$/', $data[$time_field])) {
                $this->response_json([
                    'status'  => 'error',
                    'message' => "El campo {$time_field} debe tener el formato HH:MM (ej. 08:00)."
                ], 400);
            }
        }

        if (empty($data)) {
            $this->response_json(['status' => 'error', 'message' => 'No se proporcionaron campos para actualizar.'], 400);
        }

        $this->db->where('id', $agency_id)->update('agency', $data);

        // Retornar la configuración actualizada
        $updated = $this->db->get_where('agency', ['id' => $agency_id])->row_array();

        $this->response_json([
            'status'  => 'success',
            'message' => 'Configuración de la clínica actualizada correctamente.',
            'data'    => [
                'id'                      => $updated['id'],
                'name'                    => $updated['name']                    ?? null,
                'description'             => $updated['description']             ?? null,
                'address'                 => $updated['address']                 ?? null,
                'phone'                   => $updated['phone']                   ?? null,
                'email'                   => $updated['email']                   ?? null,
                'facebook'                => $updated['facebook']                ?? null,
                'instagram'               => $updated['instagram']               ?? null,
                'ticktock'                => $updated['ticktock']                ?? null,
                'cost_sale_price'         => $updated['cost_sale_price']         ?? null,
                'cost_delivery'           => $updated['cost_delivery']           ?? null,
                'cost_delivery_aditional' => $updated['cost_delivery_aditional'] ?? null,
                'opening_time'            => $updated['opening_time']            ?? null,
                'closing_time'            => $updated['closing_time']            ?? null,
            ]
        ], 200);
    }
}

