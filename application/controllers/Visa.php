<?php 
    if(!defined('BASEPATH')) exit('No direct script access allowed');
    
    class Visa extends CI_Controller
    {
        /* Constructor de User.php */
        function __construct()
        {
            parent::__construct();
            $this->load->database();
            $this->load->library('user_agent');
            $this->load->library('session');
        }
        
        
        public function index()
        {
           
            redirect('https://trivali.ec/', 'refresh');

        }

      
                
         /* Función para mostrar formulario de usa*/
        function show($param1 = '', $param2 = '')
        {
            $visa = $this->db->get_where('visa',array('visa_id'=>base64_decode($param1)))->row_array();
            
            
            if($visa['visa_type'] == 'USA')
            {
                $page_data['visa_id'] = base64_decode($param1);
                $page_data['page_name'] = 'form_usa';
                $page_data['page_title'] = "Solicitud de visa Americana ";
                $this->load->view('backend/visas/form_usa_update.php', $page_data);
                
            }else if($visa['visa_type'] == 'CANADA')
            {
                $page_data['visa_id'] = base64_decode($param1);
                $page_data['page_name'] = 'form_canada';
                $page_data['page_title'] = "Solicitud de visa Canadiense ";
                $this->load->view('backend/visas/form_canada.php', $page_data);
            }else
                {
                    
                    redirect('https://trivali.ec/','refresh');
                    
                }
            
            
        }
        
         /* Función para mostrar formulario de usa*/
        function show2($param1 = '', $param2 = '')
        {
            $visa = $this->db->get_where('visa',array('visa_id'=>base64_decode($param1)))->row_array();
            
            
            if($visa['visa_type'] == 'USA')
            {
                $page_data['visa_id'] = base64_decode($param1);
                $page_data['page_name'] = 'form_usa';
                $page_data['page_title'] = "Solicitud de visa Americana ";
                $this->load->view('backend/visas/form_usa_update.php', $page_data);
            }else if($visa['visa_type'] == 'CANADA')
            {
                $page_data['visa_id'] = base64_decode($param1);
                $page_data['page_name'] = 'form_canada';
                $page_data['page_title'] = "Solicitud de visa Canadiense ";
                $this->load->view('backend/visas/form_canada.php', $page_data);
            }else
                {
                    
                    redirect('https://trivali.ec/','refresh');
                    
                }
            
            
        }
        
         /* Función para mostrar formulario de usa*/
        function form_usa($param1 = '', $param2 = '')
        {
            $page_data['visa_id'] = base64_decode($param1);
            $page_data['page_name'] = 'form_usa';
            $page_data['page_title'] = "Solicitud de visa Americana ";
            $this->load->view('backend/visas/form_usa.php', $page_data);
            
        }
        
        
         /* Función para mostrar formulario de canada*/
        function form_canada($param1 = '', $param2 = '')
        {
            $page_data['visa_id'] = base64_decode($param1);
            $page_data['page_name'] = 'form_canada';
            $page_data['page_title'] = "Solicitud de visa Canadiense";
            $this->load->view('backend/visas/form_canada.php', $page_data);
            
        }
        
        
        // Cargar datos del usuario (para rellenar el formulario)
        public function get_data($visa_id) {
            $data = $this->crud_model->get_visa_data($visa_id);
            echo json_encode($data);
        }
    
        // Guardar un campo específico (AJAX)
        public function save_field() {
            $visa_id = $this->input->post('visa_id');
            $field   = $this->input->post('field');
            $value   = $this->input->post('value');
    
            $this->crud_model->save_fieldVisa($visa_id, $field, $value);
    
            echo json_encode(['status' => 'Guardado']);
        }
        
        public function upload_file()
        {
            // Verificar que sea petición AJAX
            if (!$this->input->is_ajax_request()) {
                show_error('Acceso no autorizado', 403);
            }
        
            $visa_id = $this->input->post('visa_id');
            $field   = $this->input->post('field');
        
            if (empty($_FILES['file']['name'])) {
                echo json_encode(['success' => false, 'message' => 'No se ha seleccionado archivo.']);
                return;
            }
        
            $file       = $_FILES['file'];
            $upload_dir = FCPATH . 'uploads/visa/';
        
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
        
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $new_name  = md5($file['name'] . time()) . '.' . $extension;
            $destination = $upload_dir . $new_name;
        
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $filePath = 'uploads/visa/' . $new_name;
        
                // Actualizar tabla visa
                $this->crud_model->save_fieldVisa($visa_id, $field, $filePath);
        
                echo json_encode(['success' => true, 'file' => $filePath]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al mover el archivo.']);
            }
        }

        function enableVisa($visa_id,$status)
        {
            
            // Actualizar tabla visa
            $this->db->where('visa_id', base64_decode($visa_id));
            $this->db->update('visa', ['status' => $status]);
            $this->session->set_flashdata('success','Visa actualizada');
            redirect($this->agent->referrer(),'refresh');
            
        }
        
        
        
    }
?>