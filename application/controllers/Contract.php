<?php 
    if(!defined('BASEPATH')) exit('No direct script access allowed');
    
    class Contract extends CI_Controller
    {
        /* Constructor de User.php */
        function __construct()
        {
            parent::__construct();
            $this->load->database();
            $this->load->library('user_agent');
            $this->load->library('session');
            $this->load->library('excel');
        }
        
        
        public function index()
        {
           
            redirect('https://trivali.ec/', 'refresh');

        }

      
        
         /* Función para mostrar contratos*/
        function show($param1 = '', $param2 = '')
        {
            $page_data['lexvault_id'] = base64_decode($param1);
            $page_data['page_name'] = 'contract_sign';
            $page_data['page_title'] = "Firmar Documento ";
            $this->load->view('backend/contract_show', $page_data);
            
        }
        
        
          /* Función para mostrar contratos*/
        function saveSing($param1 = '', $param2 = '')
        {
              if (isset($_FILES['signature']) && $_FILES['signature']['error'] === UPLOAD_ERR_OK) {
                  
                $md5 = md5(date('d-m-y H:i:s'));
                $fileTmpPath = $_FILES['signature']['tmp_name'];
                $fileName =  $md5.str_replace(' ', '', $_FILES['signature']['name']);
                $uploadFileDir = 'public/assets/signatures/';
                $dest_path = $uploadFileDir . $fileName;
        
                if(move_uploaded_file($fileTmpPath, $dest_path)) {
                    
                    $data = array(
                        'sign' => $fileName,
                        'status' => 2
                        );
                    $this->db->where('lexvault_id',base64_decode($param1));
                    $this->db->update('lexvault',$data);
                    echo 'Archivo subido con éxito.';
                    exit();
                } else {
                    echo 'Error al mover el archivo subido.';
                    exit();
                }
            } else {
                echo 'No se subió ningún archivo o hubo un error en la subida.';
                exit();
            }
            
        }
        
                
          /* Función para mostrar contratos*/
        function saveDecline($param1 = '', $param2 = '')
        {
              $data = array(
                        'decline' => $this->input->post('decline'),
                        'status' => 3
                        );
                    $this->db->where('lexvault_id',base64_decode($param1));
                    $this->db->update('lexvault',$data);
                    echo 'Archivo subido con éxito.';
                    exit();
            
        }
        
    }
?>