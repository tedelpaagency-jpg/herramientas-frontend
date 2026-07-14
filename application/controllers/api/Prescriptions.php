<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Prescriptions API Controller
 */
class Prescriptions extends CI_Controller 
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
     * Router method for /api/prescriptions
     */
    public function index() 
    {
        $method = strtolower($this->input->method());
        if ($method === 'get') {
            $this->list_prescriptions();
        } elseif ($method === 'post') {
            $this->store();
        } else {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET or POST.'], 405);
        }
    }

    /**
     * Router method for /api/prescriptions/{id}
     */
    public function handle_prescription($id = null) 
    {
        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de receta no proporcionado.'], 400);
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
     * GET /api/prescriptions
     * List prescriptions with filters and pagination.
     */
    private function list_prescriptions() 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

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
            'patient_id' => $this->input->get('patient_id'),
            'doctor_id'  => $this->input->get('doctor_id'),
            'search'     => $this->input->get('search'),
            'date_from'  => $this->input->get('date_from'),
            'date_to'    => $this->input->get('date_to'),
            'order_by'   => $this->input->get('order_by'),
            'order'      => $this->input->get('order')
        ];

        $response = $this->crud_model->get_prescriptions_filtered($agency_id, $filters, $limit, $offset);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows'],
            'pagination' => [
                'total_results' => $response['total'],
                'per_page'      => $limit,
                'current_page'  => $page,
                'total_pages'   => ceil($response['total'] / $limit)
            ]
        ], 200);
    }

    /**
     * GET /api/prescriptions/{id}
     * Get details of a single prescription.
     */
    private function show($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $prescription = $this->db
            ->where('id', $id)
            ->where('agency_id', $agency_id)
            ->get('prescription')
            ->row_array();

        if (!$prescription) {
            $this->response_json(['status' => 'error', 'message' => 'Receta no encontrada.'], 404);
        }

        // Fetch patient
        $patient = $this->db
            ->where('user_id', $prescription['patient_id'])
            ->get('user')
            ->row_array();

        if ($patient) {
            $patient['age'] = !empty($patient['birthday'])
                ? $this->crud_model->calcularEdad($patient['birthday'])
                : 'N/A';
        }

        // Fetch doctor via consultation if consultation_id is set
        $doctor = null;
        if (!empty($prescription['consultation_id'])) {
            $consultation = $this->db
                ->where('id', $prescription['consultation_id'])
                ->get('medical_consultations')
                ->row_array();
            if ($consultation) {
                $doctor = $this->db
                    ->where('user_id', $consultation['doctor_id'])
                    ->get('user')
                    ->row_array();
            }
        }

        // Fetch details (meds & labs)
        $details = $this->db
            ->where('prescription_id', $id)
            ->order_by('id', 'ASC')
            ->get('prescription_details')
            ->result_array();

        $meds = [];
        $labs = [];

        foreach ($details as $d) {
            if ($d['type'] == 'med') {
                $meds[] = $d;
            } else {
                $labs[] = $d;
            }
        }

        $this->response_json([
            'status' => 'success',
            'data' => [
                'prescription' => $prescription,
                'patient'      => $patient,
                'doctor'       => $doctor,
                'meds'         => $meds,
                'labs'         => $labs
            ]
        ], 200);
    }

    /**
     * POST /api/prescriptions
     * Create a new prescription.
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

        $patient_id      = $this->input->post('patient_id');
        $consultation_id = $this->input->post('consultation_id');
        $comment         = $this->input->post('comment');
        $next_appointment = $this->input->post('next_appointment');
        $medications     = $this->input->post('medications');
        $labs            = $this->input->post('labs');

        if (empty($patient_id)) {
            $this->response_json(['status' => 'error', 'message' => 'El paciente es requerido.'], 400);
        }

        // Verify patient exists in the same agency
        $patient = $this->db->get_where('user', [
            'user_id' => $patient_id,
            'agency_id' => $agency_id,
            'rol_id' => 8 // Patient
        ])->row();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'El paciente no existe o pertenece a otra sucursal.'], 404);
        }

        // Start transaction
        $this->db->trans_start();

        $prescription_id = null;

        if (!empty($consultation_id)) {
            // Find if there's already a prescription for the consultation
            $prescription = $this->db
                ->where('consultation_id', $consultation_id)
                ->get('prescription')
                ->row_array();
            
            if ($prescription) {
                $prescription_id = $prescription['id'];
                
                // Update header
                $this->db->where('id', $prescription_id);
                $this->db->update('prescription', [
                    'comment'          => $comment,
                    'next_appointment' => $next_appointment
                ]);
                
                // Delete previous details
                $this->db->where('prescription_id', $prescription_id);
                $this->db->delete('prescription_details');
            } else {
                // Create header
                $this->db->insert('prescription', [
                    'agency_id'        => $agency_id,
                    'patient_id'       => $patient_id,
                    'consultation_id'  => $consultation_id,
                    'comment'          => $comment,
                    'next_appointment' => $next_appointment,
                    'created_at'       => date('Y-m-d H:i:s')
                ]);
                $prescription_id = $this->db->insert_id();
            }
        } else {
            // Create header without consultation
            $this->db->insert('prescription', [
                'agency_id'        => $agency_id,
                'patient_id'       => $patient_id,
                'comment'          => $comment,
                'next_appointment' => $next_appointment,
                'created_at'       => date('Y-m-d H:i:s')
            ]);
            $prescription_id = $this->db->insert_id();
        }

        // Insert medications
        if (!empty($medications) && is_array($medications)) {
            foreach ($medications as $med) {
                $this->db->insert('prescription_details', [
                    'prescription_id' => $prescription_id,
                    'type'            => 'med',
                    'product_id'      => $med['id'] ?? null,
                    'name'            => $med['n'] ?? $med['name'],
                    'dose'            => $med['d'] ?? $med['dose'] ?? null
                ]);
            }
        }

        // Insert labs
        if (!empty($labs) && is_array($labs)) {
            foreach ($labs as $lab) {
                $this->db->insert('prescription_details', [
                    'prescription_id' => $prescription_id,
                    'type'            => 'lab',
                    'name'            => $lab['n'] ?? $lab['name'],
                    'dose'            => $lab['o'] ?? $lab['dose'] ?? null // o represents observation/dose in view logic
                ]);
            }
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            $this->response_json(['status' => 'error', 'message' => 'Error al guardar la receta.'], 500);
        }

        // Log to binnacle
        $this->crud_model->log_binnacle($user_id, $role_name);

        $this->response_json([
            'status' => 'success',
            'message' => 'Receta médica creada correctamente.',
            'prescription_id' => $prescription_id
        ], 201);
    }

    /**
     * PUT /api/prescriptions/{id}
     * Update an existing prescription.
     */
    private function update($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $role_name = $user_data['role_name'];

        // Get prescription
        $prescription = $this->db
            ->where('id', $id)
            ->where('agency_id', $agency_id)
            ->get('prescription')
            ->row_array();

        if (!$prescription) {
            $this->response_json(['status' => 'error', 'message' => 'Receta no encontrada.'], 404);
        }

        // Get inputs (support both JSON body and standard form post inputs)
        $raw_input = json_decode($this->input->raw_input_stream, true);
        if (is_array($raw_input)) {
            foreach ($raw_input as $key => $val) {
                $_POST[$key] = $val;
            }
        }

        $comment          = $this->input->post('comment');
        $next_appointment = $this->input->post('next_appointment');
        $medications      = $this->input->post('medications');
        $labs             = $this->input->post('labs');

        $this->db->trans_start();

        // Update header
        $this->db->where('id', $id);
        $this->db->update('prescription', [
            'comment'          => $comment !== null ? $comment : $prescription['comment'],
            'next_appointment' => $next_appointment !== null ? $next_appointment : $prescription['next_appointment']
        ]);

        // Re-insert details if provided
        if (isset($medications) || isset($labs)) {
            // Delete old details
            $this->db->where('prescription_id', $id);
            $this->db->delete('prescription_details');

            // Re-insert medications
            if (!empty($medications) && is_array($medications)) {
                foreach ($medications as $med) {
                    $this->db->insert('prescription_details', [
                        'prescription_id' => $id,
                        'type'            => 'med',
                        'product_id'      => $med['id'] ?? null,
                        'name'            => $med['n'] ?? $med['name'],
                        'dose'            => $med['d'] ?? $med['dose'] ?? null
                    ]);
                }
            }

            // Re-insert labs
            if (!empty($labs) && is_array($labs)) {
                foreach ($labs as $lab) {
                    $this->db->insert('prescription_details', [
                        'prescription_id' => $id,
                        'type'            => 'lab',
                        'name'            => $lab['n'] ?? $lab['name'],
                        'dose'            => $lab['o'] ?? $lab['dose'] ?? null
                    ]);
                }
            }
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            $this->response_json(['status' => 'error', 'message' => 'Error al actualizar la receta.'], 500);
        }

        $this->crud_model->log_binnacle($user_id, $role_name);

        $this->response_json([
            'status' => 'success',
            'message' => 'Receta médica actualizada correctamente.',
            'prescription_id' => $id
        ], 200);
    }

    /**
     * DELETE /api/prescriptions/{id}
     * Delete prescription (only if permitted). In this system, we do a physical delete of prescription & details.
     */
    private function delete($id) 
    {
        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];
        $user_id   = $user_data['user_id'];
        $role_name = $user_data['role_name'];

        $prescription = $this->db
            ->where('id', $id)
            ->where('agency_id', $agency_id)
            ->get('prescription')
            ->row_array();

        if (!$prescription) {
            $this->response_json(['status' => 'error', 'message' => 'Receta no encontrada.'], 404);
        }

        $this->db->trans_start();
        $this->db->where('prescription_id', $id)->delete('prescription_details');
        $this->db->where('id', $id)->delete('prescription');
        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            $this->response_json(['status' => 'error', 'message' => 'Error al eliminar la receta.'], 500);
        }

        $this->crud_model->log_binnacle($user_id, $role_name);

        $this->response_json([
            'status' => 'success',
            'message' => 'Receta médica eliminada correctamente.'
        ], 200);
    }

    /**
     * GET /api/prescriptions/patient/{patient_id}
     * List patient prescriptions.
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

        // Verify patient belongs to agency
        $patient = $this->db->get_where('user', [
            'user_id' => $patient_id,
            'agency_id' => $agency_id,
            'rol_id' => 8
        ])->row();

        if (!$patient) {
            $this->response_json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        $filters = ['patient_id' => $patient_id];
        $response = $this->crud_model->get_prescriptions_filtered($agency_id, $filters);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows']
        ], 200);
    }

    /**
     * GET /api/prescriptions/doctor/{doctor_id}
     * List doctor prescriptions.
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

        $filters = ['doctor_id' => $doctor_id];
        $response = $this->crud_model->get_prescriptions_filtered($agency_id, $filters);

        $this->response_json([
            'status' => 'success',
            'data' => $response['rows']
        ], 200);
    }

    /**
     * GET /api/prescriptions/{id}/pdf
     * Stream prescription PDF.
     */
    public function pdf($id = null) 
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use GET.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de receta no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        // Get header
        $p = $this->db
            ->where('id', $id)
            ->where('agency_id', $agency_id)
            ->get('prescription')
            ->row();

        if (!$p) {
            $this->response_json(['status' => 'error', 'message' => 'Receta no encontrada.'], 404);
        }

        // Fetch patient details
        $patient = $this->db->where('user_id', $p->patient_id)->get('user')->row();
        if (is_object($patient)) {
            $p->age = !empty($patient->birthday) 
                ? $this->crud_model->calcularEdad($patient->birthday) 
                : 'N/A';
        } else {
            $p->age = 'N/A';
        }

        // Fetch details
        $details = $this->db->where('prescription_id', $id)->get('prescription_details')->result();

        $meds = [];
        $labs = [];

        foreach ($details as $d) {
            if ($d->type == 'med') {
                $meds[] = $d;
            } else {
                $labs[] = $d;
            }
        }

        $this->load->library('dom_pdf');
        
        $this->dom_pdf->load_view('pdf/prescription', [
            'p'       => $p,
            'patient' => $patient,
            'meds'    => $meds,
            'labs'    => $labs
        ])
        ->set_paper('A4', 'portrait')
        ->render()
        ->stream("receta_{$id}.pdf", ["Attachment" => true]);
    }

    /**
     * POST /api/prescriptions/{id}/share
     * Share prescription via WhatsApp.
     */
    public function share($id = null) 
    {
        if (strtolower($this->input->method()) !== 'post') {
            $this->response_json(['status' => 'error', 'message' => 'Method Not Allowed. Use POST.'], 405);
        }

        if (empty($id)) {
            $this->response_json(['status' => 'error', 'message' => 'ID de receta no proporcionado.'], 400);
        }

        $user_data = $this->validate_request();
        $agency_id = $user_data['agency_id'];

        $p = $this->db
            ->where('id', $id)
            ->where('agency_id', $agency_id)
            ->get('prescription')
            ->row();

        if (!$p) {
            $this->response_json(['status' => 'error', 'message' => 'Receta no encontrada.'], 404);
        }

        $patient = $this->db->where('user_id', $p->patient_id)->get('user')->row();
        if (!$patient || empty($patient->phone)) {
            $this->response_json(['status' => 'error', 'message' => 'El paciente no tiene un número de teléfono válido para compartir.'], 400);
        }

        $p->age = !empty($patient->birthday) 
            ? $this->crud_model->calcularEdad($patient->birthday) 
            : 'N/A';

        // Fetch details
        $details = $this->db->where('prescription_id', $id)->get('prescription_details')->result();

        $meds = [];
        $labs = [];

        foreach ($details as $d) {
            if ($d->type == 'med') {
                $meds[] = $d;
            } else {
                $labs[] = $d;
            }
        }

        $this->load->library('dom_pdf');
        
        $this->dom_pdf->load_view('pdf/prescription', [
            'p'       => $p,
            'patient' => $patient,
            'meds'    => $meds,
            'labs'    => $labs
        ])
        ->set_paper('A4', 'portrait')
        ->render();

        $pdf_content = $this->dom_pdf->dompdf->output();
        
        $file_name = 'receta_' . $id . '_' . time() . '.pdf';
        $folder = FCPATH . 'uploads/temp/';
        
        if (!is_dir($folder)) {
            mkdir($folder, 0777, true);
        }
        
        file_put_contents($folder . $file_name, $pdf_content);
        $pdf_url = base_url('uploads/temp/' . $file_name);

        $this->load->model('whatsapp_model');
        $responseWhatsapp = $this->whatsapp_model->sendWhatsappFile(
            $patient->phone,
            $file_name,
            $pdf_url,
            $file_name,
            'document'
        );

        if ($responseWhatsapp['status']) {
            $this->response_json([
                'status'  => 'success',
                'message' => 'Receta compartida exitosamente.',
                'pdf_url' => $pdf_url
            ], 200);
        } else {
            $this->response_json([
                'status'  => 'error',
                'message' => 'No se pudo enviar la receta por WhatsApp.',
                'detail'  => $responseWhatsapp['message'] ?? ''
            ], 500);
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

    /**
     * GET /api/medicines/search?term=para
     */
    public function search_medicines()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json([
                'status' => 'error',
                'message' => 'Method Not Allowed. Use GET.'
            ], 405);
        }

        $user_data = $this->validate_request();

        $term = trim($this->input->get('term', true));

        if (strlen($term) < 2) {
            $this->response_json([
                'status' => 'success',
                'data' => []
            ]);
        }

        $medicines = $this->db
            ->select('id, name')
            ->like('name', $term)
            ->limit(20)
            ->get('medicines')
            ->result_array();

        $this->response_json([
            'status' => 'success',
            'data' => $medicines
        ]);
    }
    
    /**
     * GET /api/medicines/dose-suggestions?product_id=25
     */
    public function get_dose_suggestions()
    {
        if (strtolower($this->input->method()) !== 'get') {
            $this->response_json([
                'status' => 'error',
                'message' => 'Method Not Allowed. Use GET.'
            ], 405);
        }

        $this->validate_request();

        $product_id = (int)$this->input->get('product_id');

        if (!$product_id) {
            $this->response_json([
                'status' => 'error',
                'message' => 'Product ID is required.'
            ], 400);
        }

        $sql = "
            SELECT
                dose,
                COUNT(*) AS total
            FROM prescription_details
            WHERE product_id = ?
            AND type = 'med'
            AND dose IS NOT NULL
            AND dose <> ''
            GROUP BY dose
            ORDER BY total DESC
            LIMIT 5
        ";

        $suggestions = $this->db
            ->query($sql, [$product_id])
            ->result_array();

        $this->response_json([
            'status' => 'success',
            'data' => $suggestions
        ]);
    }
}
