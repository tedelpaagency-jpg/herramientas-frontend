<?php if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Crud_model extends CI_Model 
{
    function __construct() 
    {
      parent::__construct();
    }
 
    function formatDate()
    {
        $dias = array("Dom","Lun","Mar","Mie","Jue","Vie","Sáb");
        $meses = array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        return date('d')." de ".$meses[date('n')-1]." ".date('H:iA');
    }
    
    function getInfo($cl)
    {
        $agency = $this->session->userdata('current_agency');
        $row = $this->db->get_where('agency', array('id' => $agency))->row()->$cl;
        return $row;
    }
    
    function getInfoAgency($cl,$agency)
    {
        $row = $this->db->get_where('agency', array('id' => $agency))->row()->$cl;
        return $row;
    }
    
     function getName($type, $ID)
    {
        $name = $this->db->get_where($type, array($type.'_id' => $ID))->row_array();
        return $name['name'].' '.$name['last_name'];
    }
    
    function getNotes($type, $ID)
    {
        $user = $this->db->get_where($type, array($type.'_id' => $ID))->row_array();
        return $user['notes'];
    }
    
     function getPhone($type, $ID)
    {
        $user = $this->db->get_where($type, array($type.'_id' => $ID))->row_array();
        return $user['phone'];
    }
    
     function getAgency($type, $ID)
    {
        $user = $this->db->get_where($type, array($type.'_id' => $ID))->row_array();
        return $user['agency_id'];
    }
    
    function getPhoto($type, $ID)
    {
        $user = $this->db
            ->get_where($type, array($type . '_id' => $ID))
            ->row_array();

        // Si existe foto guardada
        if (!empty($user['photo'])) {
            return base_url('public/assets/images/users/' . $user['photo']);
        }

        // Validar si el nombre inicia con número
        if (isset($user['name'][0]) && is_numeric($user['name'][0])) {
            return base_url('public/assets/images/dummy-avatar.jpg');
        }

        // Si inicia con letra, usar avatar por inicial
        return base_url('public/assets/images/avatars/' . strtoupper($user['name'][0]) . '.png');
    }
    
    function getPhoto2($type,$ID)
    {
        $photo = $this->db->get_where($type,array($type.'_id'=>$ID))->row()->photo_2;
        
        if($photo != '')
            return base_url().'public/assets/images/logo/'.$photo;
        else
            return base_url().'public/assets/images/users/dummy-avatar.jpg';
    }
    
    function getPhoto3($type,$ID)
    {
        $photo = $this->db->get_where($type,array($type.'_id'=>$ID))->row()->photo_3;
        
        if($photo != '')
            return base_url().'public/assets/images/logo/'.$photo;
        else
            return base_url().'public/assets/images/users/dummy-avatar.jpg';
    }
    
    function getPhotoCanvas($type,$ID)
    {
        $photo = $this->db->get_where($type,array('id'=>$ID))->row()->photo;
        
        if($photo != '')
            return base_url().'public/assets/images/canvas/'.$photo;
        else
            return base_url().'public/assets/images/users/dummy-avatar.jpg';
    }
    
    
    public function saveUser()
    {
        $user_id = $this->input->post('user_id');
        log_message('error',$user_id);
        /* ================= VALIDACIÓN EMAIL / USERNAME ================= */
        $this->db->where('status', 1);
        $this->db->group_start()
                 ->where('email', $this->input->post('email'))
                 ->or_where('username', $this->input->post('username'))
                 ->group_end();
    
        if ($user_id != '') {
            $this->db->where('user_id !=', $user_id);
        }
    
        $exists = $this->db->get('user')->row();
    
        if ($exists) {
            if ($exists->email == $this->input->post('email')) {
                return [
                    'status'  => 'error',
                    'message' => 'El correo electrónico ya se encuentra registrado.',
                ];
            }
    
            if ($exists->username == $this->input->post('email')) {
                return [
                    'status'  => 'error',
                    'message' => 'El nombre de usuario ya se encuentra registrado.',
                ];
            }
        }
    
        
    
        /* ================= DATA ================= */
        $data = [
            'name'               => $this->input->post('name'),
            'last_name'          => $this->input->post('last_name'),
            'ruc'                => $this->input->post('ruc'),
            'seller_code'        => $this->input->post('seller_code'),
            'email'              => $this->input->post('email'),
            'phone'              => $this->input->post('phone'),
            'username'           => $this->input->post('email'),
            'birthday'           => $this->input->post('birthday'),
            'company_id'         => $this->input->post('company_id'),
            'rol_id'             => $this->input->post('rol_id'),
            'porcent_comition'   => $this->input->post('porcent_comition'),
            'level'              => $this->input->post('level'),
            'provincia_id'       => $this->input->post('provincia'),
            'canton_id'          => $this->input->post('canton'),
            'address'            => $this->input->post('address'),
            'terms'              => $this->input->post('terms') ?? 0,
            'pais_id'            => $this->input->post('pais'),
            'agency_id'          => $this->input->post('agency_id') != ''
                                     ? $this->input->post('agency_id')
                                     : $this->session->userdata('current_agency'),
            'email_templates_id' => $this->input->post('email_templates_id') ?? 1,
            
        ];
        
        /* ================= FOTO ================= */
        $photo = '';
        if (!empty($_FILES['photo']['name'])) {
            $md5   = md5(date('d-m-y H:i:s'));
            $photo = $md5 . str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file(
                $_FILES['photo']['tmp_name'],
                'public/assets/images/users/' . $photo
            );
            
            $data['photo'] = $photo;
        }
        
        $photo = '';
        if (!empty($_FILES['photo_2']['name'])) {
            $md5   = md5(date('d-m-y H:i:s'));
            $photo = $md5 . str_replace(' ', '', $_FILES['photo_2']['name']);
            move_uploaded_file(
                $_FILES['photo_2']['tmp_name'],
                'public/assets/images/logo/' . $photo
            );
            
            log_message('error','Photo 2 '.$photo);
            $data['photo_2'] = $photo;
        }
        
        $photo = '';
        if (!empty($_FILES['photo_3']['name'])) {
            $md5   = md5(date('d-m-y H:i:s'));
            $photo = $md5 . str_replace(' ', '', $_FILES['photo_3']['name']);
            move_uploaded_file(
                $_FILES['photo_3']['tmp_name'],
                'public/assets/images/logo/' . $photo
            );
            
            $data['photo_3'] = $photo;
        }
    
        
    
        /* ================= CREATE / UPDATE ================= */
        if ($user_id == '') {
            
           
            $data['password']      = sha1($this->input->post('password'));
            $data['code']          = base64_encode($this->input->post('password'));
            $data['date_register'] = date('Y-m-d H:i:s');
    
            $this->db->insert('user', $data);
            
            if($this->input->post('rol_id') == 7)
            {
                $data = array(
                    'agency_id'         => $this->session->userdata('current_agency'),
                    'name'              => $this->input->post('name'),
                    'user_id'           => $this->db->insert_id(),
                    'date'              => date('Y-m-d H:i:s'),
                    'photo'             => $photo,
                    'ticktock_video'    => $this->input->post('ticktock_video'),
                    'type'    => 2
                ); 
                 
                
               
                    
                    $this->db->insert('forms', $data);
                    $forms_id = $this->db->insert_id();
                    
                       
                    $this->load->library('ciqrcode'); // Librería para generar QR
                            
                   
            
                    $qr_data = base_url("form?campaign=" . base64_encode($forms_id));
                    $qr_image = "qr_store_" . $forms_id . ".png";
                    $params['data'] = $qr_data;
                    $params['level'] = 'H';
                    $params['size'] = 10;
                    $params['savename'] = FCPATH . 'public/form_qr/' . $qr_image;
                    $this->ciqrcode->generate($params);
                    
                    $this->db->where('forms_id',$forms_id);
                    $this->db->update('forms',['qr'=>$qr_image]);
                    
                    
            }
            return [
                'status'  => 'success',
                'message' => 'Usuario registrado.',
            ];
        } else {
            if ($this->input->post('password') != '') {
                $data['password'] = sha1($this->input->post('password'));
                $data['code']     = base64_encode($this->input->post('password'));
            }
    
            $this->db->where('user_id', $user_id);
            $this->db->update('user', $data);
    
            return [
                'status'  => 'success',
                'message' => 'Usuario actualizado.',
            ];
        }
    }

    
     // Actualizar notas de agentes
    function user_update_notes($user_id) {
        log_message('error','Update note '.$user_id);
        $data = array(
            'notes'          => $this->input->post('notes')
        );
        $this->db->where('user_id', $user_id);
        return $this->db->update('user', $data);
    }
    
    function calcularEdad($birthday)
    {
        if (empty($birthday) || $birthday == '0000-00-00') {
            return null;
        }

        try {
            $fechaNacimiento = new DateTime($birthday);
            $hoy = new DateTime();
            $edad = $hoy->diff($fechaNacimiento);

            return $edad->y; // años
        } catch (Exception $e) {
            return null;
        }
    }

    // Eliminar un user
    function user_delete($user_id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('user_id', $user_id);
        return $this->db->update('user',$data);
    }
    
    public function getUserQr() {
         
        $user_type = 'user';
        $user_id = $this->session->userdata('login_user_id');
        
        $qr = $this->db->get_where($user_type,[$user_type.'_id'=>$user_id])->row()->qr;
        
        if($qr == '')
        {
        
            $this->load->library('ciqrcode'); // Librería para generar QR
             
            $qr_data =  base_url().'card?profile='.base64_encode($user_type.'/'.$user_id); 
            $qr_image = "qr_user_" . base64_encode($user_type.'_'.$user_id) . ".png";
            $params['data'] = $qr_data;
            $params['level'] = 'H';
            $params['size'] = 10;
            $params['savename'] = FCPATH . 'public/user_qr/' . $qr_image;
            $this->ciqrcode->generate($params);
            
            $this->db->where($user_type.'_id',$user_id);
            $this->db->update($user_type,['qr'=>$qr_image]);
            
            return base_url().'public/user_qr/'.$qr_image;
            
            
        }else
        {
            return base_url().'public/user_qr/'.$qr;
            
        }
      
    }
    
    public function getStoreQr($user_id) {
         
        $user_type = 'user';
        $qr = $this->db->get_where($user_type,[$user_type.'_id'=>$user_id])->row()->qr;
        
        if($qr == '')
        {
        
            $this->load->library('ciqrcode'); // Librería para generar QR
             
            $qr_data            =  base_url().'hunter?store='.base64_encode($user_type.'/'.$user_id); 
            $qr_image           = "qr_store_" . base64_encode($user_type.'_'.$user_id) . ".png";
            $params['data']     = $qr_data;
            $params['level']    = 'H';
            $params['size']     = 10;
            $params['savename'] = FCPATH . 'public/store_qr/' . $qr_image;
            $this->ciqrcode->generate($params);
            
            $this->db->where($user_type.'_id',$user_id);
            $this->db->update($user_type,['qr'=>$qr_image]);
            
            return base_url().'public/store_qr/'.$qr_image;
            
            
        }else
        {
            return base_url().'public/store_qr/'.$qr;
            
        }
      
    }
    
    
    public function delete_post($id)
    {
        $story_files = $this->db
            ->order_by('id','DESC')
            ->get_where('notice_image',['notice_id'=>$id])
            ->result_array();
            
        foreach($story_files as $file)
        {
            $upload_path = "./public/uploads/notices/";
            unlink($upload_path.$file['file_name']);
            
            $this->db->where('id', $file['id']);
            $this->db->delete('notice_image');
            
        }
       
        $this->db->where('id', $id);
        $this->db->delete('notice');
    
        return 'Anuncio eliminado';
    }
    
    public function crear_post()
    {
        $post    = $this->input->post('message');
        $type    = $this->input->post('type');
        $user_id = $this->session->userdata('login_user_id');
        $fecha   = date('Y-m-d H:i:s');
    
        // Validar que exista al menos un archivo
        if (!isset($_FILES['files']) || empty($_FILES['files']['name'][0])) {
            return [
                'status' => false,
                'message' => 'Debe subir al menos un archivo'
            ];
        }
    
        // Guardar post
        $this->db->insert('notice', [
            'post' => $post,
            'user_id' => $user_id,
            'created_at' => $fecha,
            'type' => $type,
            'status' => 1
        ]);
    
        $notice_id = $this->db->insert_id();
    
        // Guardar archivos
        $upload = $this->save_notice_files($notice_id);
    
        if(!$upload['status']){
            // eliminar post si falla subida
            $this->db->delete('notice', ['id'=>$notice_id]);
    
            return $upload;
        }
    
        return [
            'status' => true,
            'message' => 'Anuncio creado correctamente'
        ];
    }
    
    private function save_notice_files($notice_id)
    {
        $upload_path = "./public/uploads/notices/";
    
        if (!is_dir($upload_path)) {
            mkdir($upload_path, 0777, true);
        }
    
        $files_saved = 0;
    
        foreach ($_FILES['files']['name'] as $key => $name) {
    
            if ($_FILES['files']['error'][$key] !== UPLOAD_ERR_OK) {
                return [
                    'status'=>false,
                    'message'=>'Error al subir el archivo: '.$name
                ];
            }
    
            $file_tmp  = $_FILES['files']['tmp_name'][$key];
            $file_ext  = pathinfo($name, PATHINFO_EXTENSION);
            $file_name = time().'_'.uniqid().'.'.$file_ext;
            $destination = $upload_path.$file_name;
    
            if(!move_uploaded_file($file_tmp,$destination)){
                return [
                    'status'=>false,
                    'message'=>'No se pudo guardar el archivo: '.$name
                ];
            }
    
            $file_type = $_FILES['files']['type'][$key];
    
            if(strpos($file_type,'image') === 0){
                $type_category = 'image';
            }elseif(strpos($file_type,'video') === 0){
                $type_category = 'video';
            }else{
                $type_category = 'other';
            }
    
            $this->db->insert('notice_image',[
                'notice_id'=>$notice_id,
                'file_name'=>$file_name,
                'file_type'=>$type_category
            ]);
    
            $files_saved++;
        }
    
        if($files_saved == 0){
            return [
                'status'=>false,
                'message'=>'No se subieron archivos'
            ];
        }
    
        return [
            'status'=>true,
            'message'=>'No es un archivo valido'
        ];
    }
    
    function time_elapsed_es($datetime) 
    {
       
        $timestamp = strtotime($datetime);
        $diff = time() - $timestamp;
    
        if ($diff < 60) {
            return "hace " . $diff . " segundos";
        }
    
        $minutes = round($diff / 60);
        if ($minutes < 60) {
            return "hace " . $minutes . " minutos";
        }
    
        $hours = round($diff / 3600);
        if ($hours < 24) {
            return "hace " . $hours . " horas";
        }
    
        $days = round($diff / 86400);
        if ($days < 30) {
            return "hace " . $days . " días";
        }
    
        $months = round($diff / 2592000);
        if ($months < 12) {
            return "hace " . $months . " meses";
        }
    
        $years = round($diff / 31536000);
        return "hace " . $years . " años";
    }

    public function savePlan($id = null)
    {
        // Datos enviados por POST
        $data = [
            'name'   => $this->input->post('name', true),
            'period' => $this->input->post('period', true),
            'price'  => $this->input->post('price', true),
        ];
    
        // Validación mínima
        if (empty($data['name']) || empty($data['period']) || empty($data['price'])) {
            $this->session->set_flashdata('error', 'Todos los campos son obligatorios');
            redirect($_SERVER['HTTP_REFERER']);
        }
    
        // Si viene ID → actualizar
        if (!empty($id)) {
    
            $this->db->where('id', $id);
            $this->db->update('plans', $data);
    
            return 'Plan Actualizado';
        }
    
        // Si NO viene ID → crear
        $this->db->insert('plans', $data);
    
        return 'Plan Agregado';
    }
    
    public function savePermissions($id = null)
    {
        // Datos enviados por POST
        $data = [
            'name'   => $this->input->post('name', true),
        ];
    
        // Validación mínima
        if (empty($data['name']) ) {
            $this->session->set_flashdata('error', 'Todos los campos son obligatorios');
            redirect($_SERVER['HTTP_REFERER']);
        }
    
        // Si viene ID → actualizar
        if (!empty($id)) {
    
            $this->db->where('id', $id);
            $this->db->update('permissions', $data);
    
            return 'Permiso Actualizado';
        }
    
        // Si NO viene ID → crear
        $this->db->insert('permissions', $data);
    
        return 'Permiso Agregado';
    }
    
    
    function saveAgency() {
        
        // Verifica que haya un archivo subido
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['logo']['tmp_name'];
            $file_name = time() . '_' . $_FILES['logo']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $data['logo'] = $file_name;
                log_message('error', 'Logo actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        } 
        
        // Verifica que haya un archivo subido
        if (isset($_FILES['logo_2']) && $_FILES['logo_2']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['logo_2']['tmp_name'];
            $file_name = time() . '_' . $_FILES['logo_2']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $data['logo_2'] = $file_name;
                log_message('error', 'Logo actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        } 

        // Verifica que haya un archivo subido
        if (isset($_FILES['favicon']) && $_FILES['favicon']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['favicon']['tmp_name'];
            $file_name = time() . '_' . $_FILES['favicon']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $data['favicon'] = $file_name;
                log_message('error', 'favicon actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        }

        // Verifica que haya un archivo subido
        if (isset($_FILES['degrad']) && $_FILES['degrad']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['degrad']['tmp_name'];
            $file_name = time() . '_' . $_FILES['degrad']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $data['degrad'] = $file_name;
                log_message('error', 'degrad actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        }

        foreach ($this->input->post() as $key => $value) {
            
            if($key != 'suppliers')
            {
                $data[$key] = $value;
            }else
            {
                $data['suppliers'] =json_encode($this->input->post('suppliers'));
            }
            
        }
        
        if($this->input->post('id') != '')
        {
            $this->db->where('id', $this->input->post('id'));
            $this->db->update('agency', $data);
        }else
        {
             $this->db->insert('agency', $data);
        }
       

        return true;

    }
    
    function deleteAgency($id)
    {
        $this->db->where('id', $id);
        $this->db->update('agency', ['status'=> 0]);
        
        return true;
    }
    
    
    
    
     function saveSettings() {
        
        // Verifica que haya un archivo subido
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['logo']['tmp_name'];
            $file_name = time() . '_' . $_FILES['logo']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $data['logo'] = $file_name;
                log_message('error', 'Logo actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        } 

        // Verifica que haya un archivo subido
        if (isset($_FILES['favicon']) && $_FILES['favicon']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['favicon']['tmp_name'];
            $file_name = time() . '_' . $_FILES['favicon']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $data['favicon'] = $file_name;
                log_message('error', 'favicon actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        }

        

        foreach ($this->input->post() as $key => $value) {
            
            if($key != 'dropi_suppliers_list')
            {
                $data[$key] = $value;
            }else
            {
                $data['dropi_suppliers'] =json_encode($this->input->post('dropi_suppliers_list'));
            }
            
        }
        
        
        $this->db->where('id', $this->session->userdata('current_agency'));
        $this->db->update('agency', $data);
    
        $this->db->insert('agency', $data);
        
       

        return true;

    }
    
    function saveReport()
    {
        
        $id = $this->input->post('sale_id');
        
        $sale = $this->db->get_where('sale',['sale_id'=>$id])->row_array();
        $user = $this->db->get_where('user',['user_id'=>$sale['user_id']])->row_array();
        
        $valor_cliente   = $this->input->post('valor-cliente');
        $costo_proveedor = $this->input->post('costo-proveedor');
        $valor_adicional = $this->input->post('valor-adicional');
        $gastos_gestion  = $this->input->post('gastos-gestion');
        $client_id       = $this->input->post('client_id');
        
        
        $agency = $this->db->get_where('agency',['id'=>$user['agency_id']])->row_array();
            
        
        
        $mgt = $valor_cliente - $costo_proveedor;
        
        
        log_message('error','Nuevo reporte de la agencia  '.$user['agency_id'].' '.$agency['commition_percent'].' * '.$mgt);
        
        $taxes      = $mgt * $agency['taxes'];
        $comition   = 0;
        
        $gnt = $mgt - ($comition + $taxes);
         
         
        $commition_percent          = $gnt * ($agency['commition_percent']/100);
        $commition_percent_director = $gnt * ($agency['gerent_commition_percent']/100);
        $commition_percent_empresa  = $gnt - ($commition_percent + $commition_percent_director);  
        
       
        
        $vf = $gnt - ($gnt * $agency['fact_value']);
            
        
        $sale_details       = $this->input->post('sale_detail');
        $payment_methods    = $this->input->post('payment_method');
        
        $data = array(
            'client_id'             => $client_id,
            'total_client'          => $valor_cliente,
            'total_supplier'        => $costo_proveedor,
            'total_additional'      => $valor_adicional,
            'total_fee'             => $gastos_gestion,
            'mgt'                   => $mgt,
            'gnt'                   => $gnt,
            'commition_percent'             => $commition_percent,
            'commition_percent_director'    => $commition_percent_director,
            'commition_percent_empresa'     => $commition_percent_empresa,
            'commition_ziigo'       => $comition,
            'taxes'                 => $taxes,
            'fact_value'            => $vf,
        );
        
        log_message('error','saleddd '.$id);
        
        $this->db->where('sale_id', $id);
        $this->db->update('sale', $data);
        
        return ['status'=>'success','message'=>'Reporte de venta actualizado'];
        
    }
    
    
    function saveReward($id = '')
    {
         $data = array(
            'name'         => $this->input->post('name'),
            'description'  => $this->input->post('description'),
            'status'       => 1,
        );
        
        if($id != '')
        {
            $this->db->where('id', $id);
            $this->db->update('rewards', $data);
            
            return 'Actualizado';
        }else
        {
            $this->db->insert('rewards', $data);
            return 'Agregado';
        }
       
    }
    
    function deleteReward($id = '')
    {
         $data = array(
           
            'status'       => 0,
        );
        
        $this->db->where('id', $id);
        $this->db->update('rewards', $data);
        return 'Eliminado';
       
    }


    function saveRoulette($id = '')
    {
         $data = array(
            'title'         => $this->input->post('title'),
            'description'  => $this->input->post('description'),
            'status'       => 1,
        );
        
        if($id != '')
        {
            $this->db->where('id', $id);
            $this->db->update('roulettes', $data);
            
            return 'Actualizado';
        }else
        {
            $this->db->insert('roulettes', $data);
            return 'Agregado';
        }
       
    }
    
    function deleteRoulette($id = '')
    {
         $data = array(
           
            'status'       => 0,
        );
        
        $this->db->where('id', $id);
        $this->db->update('roulettes', $data);
        return 'Eliminado';
       
    }
    
    function saveGift($id = '')
    {
         $data = array(
            'agency_id'    => $this->input->post('agency_id'),
            'roulette_id'  => $this->input->post('roulette_id'),
            'status'       => 1,
        );
        
        if($id != '')
        {
            $this->db->where('id', $id);
            $this->db->update('agency_roulette', $data);
            
            return 'Actualizado';
        }else
        {
            $this->db->insert('agency_roulette', $data);
            return 'Agregado';
        }
       
    }
    
    function deleteGift($id = '')
    {
         $data = array(
           
            'status'       => 0,
        );
        
        $this->db->where('id', $id);
        $this->db->update('agency_roulette', $data);
        return 'Eliminado';
       
    }
    
    public function updateRequestInfo($id) {
        
            
            
            $data = [
                'service_id'        => $this->input->post('service_id'),
                'motivo'            => $this->input->post('motivo'),
                'commition'         => $this->input->post('comision'),
            ];
        
            $this->db->where('id', $id);
            $this->db->update('requests',  $data);
            
            
            return 1;
    }
    
    public function updateRequest($id) {
        
           
            $id         = $this->input->post('id');
            $statuss    = $this->input->post('status');
            $committion = $this->input->post('comision');
            $motivo     = $this->input->post('motivo');
            
             
            $data = [
                'commition' => $committion,
                'motivo'    => $motivo,
                'status'    => $statuss,
            ];
            
            $this->db->where('id', $id);
            $this->db->update('requests',  $data);
            
            
            return 1;
    }
    
    
    function saveForm()
     {
         
        $md5 = md5(date('d-m-y H:i:s'));
        $photo = '';
        if($_FILES['photo']['size'] > 0)
        {
            $photo  = $md5.str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'public/assets/images/users/' . $md5.str_replace(' ', '', $_FILES['photo']['name']));
    
        }
        
        $data = array(
            'agency_id'         => $this->session->userdata('current_agency'),
            'name'              => $this->input->post('name'),
            'user_id'           => $this->input->post('user_id'),
            'video_type'        => $this->input->post('video_type'),
            'date'              => date('Y-m-d H:i:s'),
            'photo'             => $photo,
            'type'              => 1
        ); 
         
        $video_type = $this->input->post('video_type');

        if ($video_type === 'tiktok') {
            $data['ticktock_video'] = $this->input->post('ticktock_video');
            $data['video_file'] = null;
        }
        
        if ($video_type === 'local' && !empty($_FILES['local_video']['name'])) {
            // subir video
            $voucher = $this->upload_file('local_video', 'forms');
            $data['ticktock_video'] = null;
            $data['video_file'] = $voucher;
        }
         
        
        if($this->input->post('id') == '0'):
            
            $this->db->insert('forms', $data);
            $forms_id = $this->db->insert_id();
            
               
            $this->load->library('ciqrcode'); // Librería para generar QR
    
            $qr_data = base_url("form?campaign=" . base64_encode($forms_id));
            $qr_image = "qr_store_" . $forms_id . ".png";
            $params['data'] = $qr_data;
            $params['level'] = 'H';
            $params['size'] = 10;
            $params['savename'] = FCPATH . 'public/form_qr/' . $qr_image;
            $this->ciqrcode->generate($params);
            
            $this->db->where('forms_id',$forms_id);
            $this->db->update('forms',['qr'=>$qr_image]);
            return 'Campaña creada';
        else:
            
           
            $forms_id = $this->input->post('id');
            
            $this->db->where('forms_id', $this->input->post('id'));
            $this->db->update('forms', $data);
            
            $qr = $this->db->get_where('forms',['forms_id'=> $this->input->post('id')])->row()->qr;
             
            log_message('error', $qr.' '.$forms_id);
            if($qr == '')
            {
                
                $this->load->library('ciqrcode'); // Librería para generar QR
    
                $qr_data = base_url("form?campaign=" . $forms_id);
                $qr_image = "qr_store_" . $forms_id . ".png";
                $params['data'] = $qr_data;
                $params['level'] = 'H';
                $params['size'] = 10;
                $params['savename'] = FCPATH . 'public/form_qr/' . $qr_image;
                $this->ciqrcode->generate($params);
                
                $this->db->where('forms_id', $forms_id);
                $this->db->update('forms',['qr'=>$qr_image]);
            }
            
            return 'Campaña actualizada';
        endif;
     }
     
     
    
       // Eliminar un user
    function deleteForm($forms_id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('forms_id', $forms_id);
        return $this->db->update('forms',$data);
    }
    
    
    function saveCanva()
     {
         
       
        
         $data = array(
            'name'              => $this->input->post('name'),
            'user_id'           => $this->input->post('user_id'),
            'message'           => $this->input->post('message'),
            'link'              => $this->input->post('link'),
            'datetime'          => $this->input->post('date'),
            'date'              => date('Y-m-d H:i:s'),
            
        ); 
        
        $md5 = md5(date('d-m-y H:i:s'));
       
        if($_FILES['photo']['size'] > 0)
        {
            $photo  = $md5.str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'public/assets/images/canvas/' . $md5.str_replace(' ', '', $_FILES['photo']['name']));
            
            $data['photo'] = $photo;
        }
         
        
        if($this->input->post('id') == ''):
            
            $this->db->insert('canvas', $data);
            
            $id   = $this->db->insert_id();
            $data = $this->input->post('paises');
            
            if (is_array($data)) {
                foreach ($data as $pais_id => $row) {
        
                    if (!isset($row['enabled'])) {
                        continue;
                    }
        
                    $this->db->insert('canva_pais', [
                        'canva_id' => $id,
                        'pais_id'   => $pais_id,
                    ]);
                }
            }
                
            return 'Canva creado';
            
        else:
            $this->db->where('id', $this->input->post('id'));
            $this->db->update('canvas', $data);
            
            $id   = $this->input->post('id');
            $data = $this->input->post('paises');
            
            $this->db->where('canva_id', $id)
                     ->delete('canva_pais');
        
            if (is_array($data)) {
                foreach ($data as $pais_id => $row) {
        
                    if (!isset($row['enabled'])) {
                        continue;
                    }
        
                    $this->db->insert('canva_pais', [
                        'canva_id' => $id,
                        'pais_id'   => $pais_id,
                    ]);
                }
            }
            
            
            return 'Canva actualizada';
        endif;
     }
     
     
    
       // Eliminar un user
    function deleteCanva($id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('id', $id);
        $this->db->update('canvas',$data);
        
         
        $data = array(
            'status' => 0
        );
        
        $this->db->where('canva_id', $id);
        return $this->db->update('canva_pais',$data);
        
    }
    
    function saveComission()
    
     {
         
        
        
        $data = [
                'user_type'          => 'user',
                'user_id'            => $this->input->post('user_id'),
                'type'               => $this->input->post('type'),
                'amount'             => $this->input->post('amount'),
                'sale_id'            => $this->input->post('sale_id'),
                'reject_description' => $this->input->post('reject_description'),
                'origin'             => $this->input->post('origin'),
                
                
            ];
            
        $voucher = $this->upload_file('voucher', 'vouchers');
        
        if($voucher != null)
        {
            $data["photo"] = $voucher;
        }
        
        
        if($this->input->post('id') == ''):
            
            $this->db->insert('commission', $data);
            return 'Comición agregada';
            
        else:
            $this->db->where('id', $this->input->post('id'));
            $this->db->update('commission', $data);
            return 'Comición actualizada';
        endif;
     }
     
     function savePoints()
     {
         
        
        
        $data = [
                'user_type'          => 'user',
                'user_id'            => $this->input->post('user_id'),
                'type'               => $this->input->post('type'),
                'amount'             => $this->input->post('amount'),
                'sale_id'            => $this->input->post('sale_id'),
                'reject_description' => $this->input->post('reject_description'),
                'origin'             => $this->input->post('origin'),
                
                
            ];
            
        $voucher = $this->upload_file('voucher', 'vouchers');
        
        if($voucher != null)
        {
            $data["photo"] = $voucher;
        }
        
        
        if($this->input->post('id') == ''):
            
            $this->db->insert('points', $data);
            return 'Puntos agregados';
            
        else:
            $this->db->where('id', $this->input->post('id'));
            $this->db->update('points', $data);
            return 'Puntos actualizados';
        endif;
     }
     
     
    
       // Eliminar un user
    function deleteComissions($id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('id', $id);
        return $this->db->update('canvas',$data);
    }
    
    
    private function upload_file($input, $folder, $allowed = ['pdf','jpg','jpeg','png','mp4'])
    {
        if (empty($_FILES[$input]['name'])) {
            return null;
        }
    
        $ext = strtolower(pathinfo($_FILES[$input]['name'], PATHINFO_EXTENSION));
        
        
        if (!in_array($ext, $allowed)) {
            return null;
        }
    
        $name = md5(uniqid('', true)) . '.' . $ext;
        $path = FCPATH . 'uploads/' . trim($folder, '/') . '/';
    
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
    
        if (!move_uploaded_file($_FILES[$input]['tmp_name'], $path . $name)) {
            return null;
        }
    
        return 'uploads/' . trim($folder, '/') . '/' . $name;
    }



    function agregarLogoYTexto($imagenBase, $logo, $degrad, $texto,$user_id)
    {
        // Rutas absolutas
        $texto='';
        
        $user = $this->db->get_where('user',['user_id'=>$user_id])->row_array();
        
        $rutaImagen    = FCPATH . 'public/assets/images/canvas/' . $imagenBase;
        $rutaLogo      = FCPATH . 'public/assets/images/logo/' . $logo;
        
        if($user['photo'] != ''):
            $rutaUserPhoto = FCPATH . 'public/assets/images/users/' . $user['photo'];
        else:
            $rutaUserPhoto = FCPATH . 'public/assets/images/users/dummy-avatar.jpg';
        endif;
        
        $rutaFont      = FCPATH . 'public/assets/fonts/DroidSans-Bold.ttf';
    
        if (!file_exists($rutaImagen) || !file_exists($rutaLogo) || !file_exists($rutaUserPhoto) || !file_exists($rutaFont)) {
            log_message('error', 'Archivo no encontrado');
            return false;
        }
        
        log_message('error', $rutaUserPhoto);
        
        // Nuevo nombre
        $info = pathinfo($imagenBase);
        $nuevoNombre = $info['filename'].$user_id. '_final.png';
        $rutaNueva   = FCPATH . 'public/assets/images/canvas/' . $nuevoNombre;
    
        // Imagen base
        $img = imagecreatefrompng($rutaImagen);
        imagealphablending($img, true);
        imagesavealpha($img, true);
    
        $imgW = imagesx($img);
        $imgH = imagesy($img);
    
        /* ================= FOTO USUARIO ================= */

        // detectar tipo de imagen del usuario
        $infoUserImg = getimagesize($rutaUserPhoto);
        
        switch ($infoUserImg['mime']) {
            case 'image/png':
                $userImg = imagecreatefrompng($rutaUserPhoto);
                imagealphablending($userImg, true);
                imagesavealpha($userImg, true);
                break;
        
            case 'image/jpeg':
                $userImg = imagecreatefromjpeg($rutaUserPhoto);
                break;
        
            default:
                return false;
        }
        
        $userW = imagesx($userImg);
        $userH = imagesy($userImg);
        
        // tamaño de la foto (15% del ancho del canvas)
        $photoW = (int)($imgW * 0.06);
        $photoH = (int)(($userH / $userW) * $photoW);
        
        // redimensionar
        $userResized = imagecreatetruecolor($photoW, $photoH);
        imagealphablending($userResized, false);
        imagesavealpha($userResized, true);
        
        $transparent = imagecolorallocatealpha($userResized, 0, 0, 0, 127);
        imagefill($userResized, 0, 0, $transparent);
        
        imagecopyresampled(
            $userResized,
            $userImg,
            0, 0, 0, 0,
            $photoW, $photoH,
            $userW, $userH
        );
        
        $radius = min($photoW, $photoH) / 2;

        for ($x = 0; $x < $photoW; $x++) {
            for ($y = 0; $y < $photoH; $y++) {
                $dx = $x - $photoW / 2;
                $dy = $y - $photoH / 2;
        
                if (($dx * $dx + $dy * $dy) > ($radius * $radius)) {
                    imagesetpixel(
                        $userResized,
                        $x,
                        $y,
                        imagecolorallocatealpha($userResized, 0, 0, 0, 127)
                    );
                }
            }
        }
        
        // posición: esquina inferior derecha con margen
        $margin = 20;
        $xPhoto = ($imgW * 0.75) - ($photoW / 2);
        $yPhoto = $imgH - $photoH - (int)($imgH * 0.07);
        
        // copiar al canvas
        imagecopy(
            $img,
            $userResized,
            $xPhoto,
            $yPhoto,
            0,
            0,
            $photoW,
            $photoH
        );
    
        /* ================= LOGO ================= */
        $logoImg = imagecreatefrompng($rutaLogo);
    
        $logoW = imagesx($logoImg);
        $logoH = imagesy($logoImg);
    
        $logoWidth  = min((int)($imgW * 0.2), $logoW);
        $logoHeight = (int)(($logoH / $logoW) * $logoWidth);
    
        $logoResized = imagecreatetruecolor($logoWidth, $logoHeight);
        imagealphablending($logoResized, false);
        imagesavealpha($logoResized, true);
    
        $transparent = imagecolorallocatealpha($logoResized, 0, 0, 0, 127);
        imagefill($logoResized, 0, 0, $transparent);
    
        imagecopyresampled(
            $logoResized,
            $logoImg,
            0, 0, 0, 0,
            $logoWidth,
            $logoHeight,
            $logoW,
            $logoH
        );
    
        $xLogo = ($imgW - $logoWidth) / 2;
        $yLogo = 20;
    
        imagecopy($img, $logoResized, $xLogo, $yLogo, 0, 0, $logoWidth, $logoHeight);
        
        /* ================= NOMBRE ================= */
        
        $texto = $user['name'];
        $fontSize = 16;
        $color  = imagecolorallocate($img, 0, 0, 0);
        
    
        $bbox = imagettfbbox($fontSize, 0, $rutaFont, $texto);
        $textWidth = $bbox[2] - $bbox[0];
        
        $xText = ($imgW * 0.82) - ($photoW / 2);
        $yText = $imgH - $photoH - (int)($imgH * 0.05);
    
       
        imagettftext($img, $fontSize, 0, $xText, $yText, $color, $rutaFont, $texto);
        
        /* ================= APELLIDO ================= */
        
        $texto = $user['last_name'];
        $fontSize = 16;
        $color  = imagecolorallocate($img, 0, 0, 0);
        
    
        $bbox = imagettfbbox($fontSize, 0, $rutaFont, $texto);
        $textWidth = $bbox[2] - $bbox[0];
        
        $xText = ($imgW * 0.82) - ($photoW / 2);
        $yText = $imgH - $photoH - (int)($imgH * 0.03);
    
       
        imagettftext($img, $fontSize, 0, $xText, $yText, $color, $rutaFont, $texto);
        
        /* ================= TELEFONO ================= */
        
        $texto = $user['phone'];
        $fontSize = 20;
        $color  = imagecolorallocate($img, 0, 0, 0);
        
    
        $bbox = imagettfbbox($fontSize, 0, $rutaFont, $texto);
        $textWidth = $bbox[2] - $bbox[0];
        
        $xText = ($imgW * 0.78) - ($photoW / 2);
        $yText = $imgH - $photoH - (int)($imgH * 0.00);
    
       
        imagettftext($img, $fontSize, 0, $xText, $yText, $color, $rutaFont, $texto);
    
        // Guardar
        imagepng($img, $rutaNueva, 9);
    
        // Liberar memoria
        imagedestroy($img);
        imagedestroy($logoImg);
        imagedestroy($logoResized);
        imagedestroy($degradImg);
        imagedestroy($degradResized);
    
        return $nuevoNombre;
    }


    public function insertRequest()
    {
        // Recoger datos del formulario
        $data = array(
            'name'      => $this->input->post('name'),
            'last_name' => $this->input->post('last_name'),
            'phone'     => $this->input->post('full_phone'),
            'email'     => $this->input->post('email'),
            'pais'      => $this->input->post('pais'),
            'provincia' => $this->input->post('provincia'),
            'canton'    => $this->input->post('canton'),
            'address'   => $this->input->post('address'),
            'terms'     => $this->input->post('terms'),
            'service_id'=> $this->input->post('service_id'),
            'forms_id'  => $this->input->post('forms_id'),
        );
        
     
        // Guardar en BD
        $this->db->insert('requests', $data);
    
      
        // Puedes registrar la respuesta (opcional)
        log_message('error', 'Webhook n8n respuesta: ' . $response);
    
        //$this->whatsapp_model->sendWhatsapp($number, $message);
    
        return 1;
    }
    
    public function saveRequest()
    {
        
        log_message('error','Registro de nueva agencia');
        

        // ====== AGENCY ======
        $agencyData = [
            'name'        => $this->input->post('name'),
            'razon'       => $this->input->post('razon'),
            'ruc'         => $this->input->post('ruc'),
            'address'     => $this->input->post('address'),
            'city'        => $this->input->post('city'),
            'province'    => $this->input->post('province'),
            'postal_code' => $this->input->post('postal_code'),
            'pais_id'     => $this->input->post('countrySelect'),
            'is_agency'   => $this->input->post('is_agency') ? 1 : 0,
            'legal_name'  => $this->input->post('legal_name'),
            'legal_id'    => $this->input->post('legal_id'),
            'details'     => $this->input->post('details'),
            'from_form'  => 1,
            'status'      => 2,
        ];
        
        // ====== FILES ======
        $agency_ruc_file = $this->upload_file('agency_ruc_file', 'agency');
        
        if($agency_ruc_file != null)
        {
            $agencyData['ruc_file'] = $agency_ruc_file;
        }
        
        
        // Verifica que haya un archivo subido
        if (isset($_FILES['logo_file']) && $_FILES['logo_file']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/logo/';
            $file_tmp  = $_FILES['logo_file']['tmp_name'];
            $file_name = time() . '_' . $_FILES['logo_file']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
                
                $agencyData['logo'] = $file_name;
                log_message('error', 'Logo actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        }
        
        $this->db->insert('agency',$agencyData);
        $agencyId = $this->db->insert_id();
        
         log_message('error','Agencia '.$agencyId);
        
        // ====== FILES ======
        
         
        // ====== USER (contacto) ======
        $userData = [
            'name'       => $this->input->post('contact_name'),
            'last_name'  => $this->input->post('contact_last_name'),
            'email'      => $this->input->post('contact_email'),
            'phone'      => $this->input->post('contact_phone'),
            'whatsapp'   => $this->input->post('contact_whatsapp'),
            'pais_id'    => $this->input->post('countrySelect'),
            'username'   => $this->generateUsername($this->input->post('contact_name'), $this->input->post('contact_last_name')),
            'password'   => sha1('PrimerAcceso#'),
            'rol_id'     => 3,
            'agency_id'  => $agencyId,
            'status'     => 0,
        ];
        
        $contact_ruc_file = $this->upload_file('contact_ruc_file', 'agency');
        
        if($contact_ruc_file != null)
        {
            $userData['ruc_file'] = $contact_ruc_file;
        }
        
        
        /* ================= FOTO ================= */
        $photo = '';
        if (!empty($_FILES['photo_file']['name'])) {
            $md5   = md5(date('d-m-y H:i:s'));
            $photo = $md5 . str_replace(' ', '', $_FILES['photo_file']['name']);
            move_uploaded_file(
                $_FILES['photo_file']['tmp_name'],
                'public/assets/images/users/' . $photo
            );
            
            $userData['photo'] = $photo;
        }
        
        
        $this->db->insert('user',$userData);
        $userId = $this->db->insert_id();

        return 1;
        
    }
    
        // Eliminar un user
    function approveAgencyRequest($id) {
        
        $data = array(
            'status' => 1
        );
        
        $this->db->where('id', $id);
        $this->db->update('agency',$data);
        
        $data = array(
            'status' => 1
        );
        
        $this->db->where('agency_id', $id);
        $this->db->update('user',$data);
        
        $user = $this->db->get_where('user', ['agency_id' => $id])->row();
        
        if($user && $user->email) {
                  
         
           log_message('error','Email '.$user->email);
           
           $page_data['name']     = $user->name.' '.$user->last_name;
           $page_data['username'] = $user->username;
           $page_data['password'] = 'PrimerAcceso#';
           $message = $this->load->view('backend/emails/creds_email.php', $page_data, true);
          
           $response = $this->email_model->send_mail_request($user->email,'Notificaciones Ziigo',$message);
          
           log_message('error','Aprovado '.$response);
        }
        
        
        return 'Agencia creada';
    }
    
        // Eliminar un user
    function rejectAgencyRequest() {
        
        $id     = $this->input->post('id');
        $rason  = $this->input->post('reason');
        
        $data = array(
            'status' => 0,
            'rason'  => $rason
        );
        
        $this->db->where('id', $id);
        $this->db->update('agency',$data);
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('agency_id', $id);
        $this->db->update('user',$data);
        
        $user = $this->db->get_where('user', ['agency_id' => $id])->row();
        
        if($user && $user->email) {
                  
         
           log_message('error','Email '.$user->email);
           
           $page_data['name']     = $user->name.' '.$user->last_name;
           $page_data['username'] = $user->username;
           $page_data['password'] = 'PrimerAcceso#';
           $message = $this->load->view('backend/emails/error_request_email.php', $page_data, true);
          
           $response = $this->email_model->send_mail_request($user->email,'Notificaciones Ziigo',$message);
          
           log_message('error','Aprovado '.$response);
        }
        
        return 'Solicitud eliminada';
    }
    
    function generateUsername($name, $lastName)
    {
        $name = strtolower(preg_replace('/[^a-z0-9]/', '', $name));
        $last = strtolower(preg_replace('/[^a-z0-9]/', '', substr($lastName, 0, 2)));
    
        return $name . $last . rand(100, 9999);
    }

    function generate_moodle_password($length = 12)
    {
        $upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lower   = 'abcdefghijklmnopqrstuvwxyz';
        $numbers = '0123456789';
        $special = '!@#$%^&*()-_=+[]{}';
    
        $password  = $upper[rand(0, strlen($upper)-1)];
        $password .= $lower[rand(0, strlen($lower)-1)];
        $password .= $numbers[rand(0, strlen($numbers)-1)];
        $password .= $special[rand(0, strlen($special)-1)];
    
        $all = $upper.$lower.$numbers.$special;
    
        for ($i = 4; $i < $length; $i++) {
            $password .= $all[rand(0, strlen($all)-1)];
        }
    
        return str_shuffle($password);
    }
    
    function upload_gallery_ajax($profile_id, $names)
    {
        if (empty($_FILES['gallery']['name'][0])) return [];
    
        $count = count($_FILES['gallery']['name']);
        $count = $count > 6 ? 6 : $count;
    
        $response = [];
    
        for ($i=0; $i<$count; $i++) {
    
            $name = $_FILES['gallery']['name'][$i];
            $tmp  = $_FILES['gallery']['tmp_name'][$i];
            $ext  = pathinfo($name, PATHINFO_EXTENSION);
            $file = md5(time().$name).'.'.$ext;
    
            move_uploaded_file($tmp, 'uploads/profile/'.$file);
    
            $this->db->insert('user_profile_gallery', [
                'user_profile_id' => $profile_id,
                'image' => $file,
                'name'  => $names[$i] ?? $name
            ]);
    
            $id = $this->db->insert_id();
    
            $response[] = [
                'id' => $id,
                'image' => $file,
                'name' => $names[$i] ?? $name
            ];
        }
    
        return $response;
    }

    
    public function delete_image_ajax($id)
    {
        $img = $this->db
            ->where('id', $id)
            ->get('user_profile_gallery')
            ->row();
    
        if (!$img) {
            return false;
        }
    
        $path = FCPATH . 'uploads/profile/' . $img->image;
    
        if (file_exists($path)) {
            unlink($path);
        }
    
        $this->db->where('id', $id)->delete('user_profile_gallery');
    
        return true;
    }



    public function getUserPointsTotal($user_type, $user_id)
    {
        $this->db->select('
            SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) 
            - 
            SUM(CASE WHEN type = 0 THEN amount ELSE 0 END) AS total
        ');
        $this->db->from('points');
        $this->db->where('user_type', $user_type);
        $this->db->where('user_id', $user_id);
        $this->db->where('status', 1); // opcional si solo cuentas activos
    
        $row = $this->db->get()->row();
    
        return (float) ($row->total ?? 0);
    }
    
    public function getUserBalanceTotal($user_type, $user_id)
    {
        $this->db->select('
            SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) 
            - 
            SUM(CASE WHEN type = 0 THEN amount ELSE 0 END) AS total
        ');
        $this->db->from('commission');
        $this->db->where('user_type', $user_type);
        $this->db->where('user_id', $user_id);
        $this->db->where('status', 1); // opcional si solo cuentas activos
    
        $row = $this->db->get()->row();
    
        return (float) ($row->total ?? 0);
    }
    
    
     function saveW8()
    {
       

            $data = array(
                'name'                  => $this->input->post('name'),
                'description'           => $this->input->post('description'),
                'lexvault_template_id'  => 1,
                'membrete'              => '',
                'content'               => '',
                'fields'                => '',
                'user_id'               => $this->session->userdata('login_user_id'),
                'user_type'             => $this->session->userdata('login_type'),
                'company_id'            => $this->session->userdata('current_company'),
                'status'                => 0
            );
            
            
            $id = $this->input->post('id');
            
            if($id == '')
            {
                $this->db->insert('w8', $data);
                return $this->db->insert_id();
            }
            else
            {
                $this->db->where('id',$id);
                $this->db->update('w8', $data);
                return $this->db->insert_id();
            }
            
            
    }
    
    function deleteW8($id)
    {
       
        $this->db->where('id',$id);
        $this->db->delete('w8');
        return 'success';
            
            
    }
    
    
    function updateTheme()
    {
        $id = $this->session->userdata('current_agency');
        
        log_message('error', $id.' '.$this->input->post('value'));
        $this->db->where('id',$id);
        $this->db->update('agency',[$this->input->post('cl')=>$this->input->post('value')]);
        return 'success';
            
            
    }
    
    
    function getAcademy()
    {
        $this->db->where('user_id',$this->session->userdata('login_user_id'));
        $gerente = $this->db->get('user')->row();
        
        if($gerente->rol_id != 2)
        {
           $id = $this->session->userdata('current_agency');
        
            $this->db->where('id',$id);
            $gerente_id = $this->db->get('agency')->row()->gerente_id;
            
            $this->db->where('user_id',$gerente_id);
            $academy = $this->db->get('user')->row()->academy;
            return $academy;  
        }else
        {
            return $gerente->academy;  
        }
       
            
            
    }
    
    public function get_image_library_paginated($limit = 20, $offset = 0)
        {
            $dir = FCPATH . 'public/uploads/gallery/';
            $files = glob($dir . '*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);
        
            // Ordenar por fecha de modificación descendente
            usort($files, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
        
            // Ahora usamos offset + limit
            $files_paginated = array_slice($files, $offset, $limit);
        
            // Obtener solo los nombres de archivo (sin la ruta completa)
            $imageNames = array_map('basename', $files_paginated);
        
            return $imageNames;
        }
        
    //////////////////////////////////////////////// start old
    
   
    
    
    function getNameRol($type, $ID)
    {
        $rol = $this->db->get_where($type, array($type.'_id' => $ID))->row()->rol;
        $nameRol = $this->db->get_where('rol', array('rol_id'=>$rol))->row()->name;
        return $nameRol;

    }


     // Crear un nuevo user
     function doctors_save() {
         
        $doctor_id = $this->input->post('doctor_id');
        
        $data = array(
            'name'          => $this->input->post('name'),
            'last_name'     => $this->input->post('last_name'),
            'ruc'           => $this->input->post('ruc'),
            'email'         => $this->input->post('email'),
            'username'      => $this->input->post('username'),
            'password'      => sha1($this->input->post('password')),
            'birthday'      => $this->input->post('birthday'),
            'date_register' => date('Y-m-d H:i:s'),
            'company_id'    => $this->input->post('company_id'),
        );

        $md5 = md5(date('d-m-y H:i:s'));
        if($_FILES['photo']['size'] > 0)
        {
            $data['photo']  = $md5.str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'public/assets/images/users/' . $md5.str_replace(' ', '', $_FILES['photo']['name']));
        }
        
        if($doctor_id == '')
        {
            return $this->db->insert('doctor', $data);
        }else
        {
            $this->db->where('doctor_id', $doctor_id);
            return $this->db->update('doctor', $data);
        }
    }
  

    // Eliminar un doctor
    function doctor_delete($doctor_id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('doctor_id', $doctor_id);
        return $this->db->update('doctor',$data);
    }

     // Crear un nuevo user
     function staff_save() {
         
        $staff_id = $this->input->post('staff_id');
        
        $data = array(
            'name'          => $this->input->post('name'),
            'last_name'     => $this->input->post('last_name'),
            'ruc'           => $this->input->post('ruc'),
            'email'         => $this->input->post('email'),
            'username'      => $this->input->post('username'),
            'password'      => sha1($this->input->post('password')),
            'birthday'      => $this->input->post('birthday'),
            'date_register' => date('Y-m-d H:i:s'),
            'company_id'    => $this->input->post('company_id'),
        );

        $md5 = md5(date('d-m-y H:i:s'));
        if($_FILES['photo']['size'] > 0)
        {
            $data['photo']  = $md5.str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'public/assets/images/users/' . $md5.str_replace(' ', '', $_FILES['photo']['name']));
        }
        
        if($staff_id == '')
        {
            return $this->db->insert('staff', $data);
        }else
        {
            $this->db->where('staff_id', $staff_id);
            return $this->db->update('staff', $data);
        }
    }
  

    // Eliminar un staff
    function staff_delete($staff_id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('staff_id', $staff_id);
        return $this->db->update('staff',$data);
    }

    /////////////////////////////

    // Obtener todos los admins
     function get_all_companies() {
        
        $this->db->where('status != ',2);
        $this->db->where('pais_id',$this->session->userdata('current_country'));
        $query = $this->db->get('company');
        return $query->result();
    }
    
    
    function company_create()
    {
            $data = array(
                'name'                      => $this->input->post('name'),
                'address'                   => $this->input->post('address'),
                'empresa_porcent_comition'  => $this->input->post('empresa_porcent_comition'),
                'director_id'               => $this->input->post('director_id'),
                'director_porcent_comition' => $this->input->post('director_porcent_comition'),
                'user_id'                  => $this->input->post('user_id'),
                'porcent_comition'          => $this->input->post('porcent_comition'),
                'agent_porcent_comition'    => $this->input->post('agent_porcent_comition'),
                'ticktock_video'            => $this->input->post('ticktock_video'),
                'pais_id'                   => $this->session->userdata('current_country'),
                'status'                    => 1
            );
            
            $this->db->insert('company', $data);
            $id = $this->db->insert_id();
            
            $this->load->library('ciqrcode'); // Librería para generar QR
             
            $qr_data =  base_url().'?seller='.base64_encode($id); 
            $qr_image = "qr_user_" . base64_encode($id) . ".png";
            $params['data'] = $qr_data;
            $params['level'] = 'H';
            $params['size'] = 10;
            $params['savename'] = FCPATH . 'public/user_qr/' . $qr_image;
            $this->ciqrcode->generate($params);
            
            $this->db->where('company_id',$id);
            $this->db->update('company',['qr'=>$qr_image]);
            
            return $id;
    }
    
    function createQR($url)
    {
        $this->load->library('ciqrcode'); // Librería para generar QR
             
            $qr_data =  $url; 
            $qr_image = "qr.png";
            $params['data'] = $qr_data;
            $params['level'] = 'H';
            $params['size'] = 10;
            $params['savename'] = FCPATH . 'public/user_qr/' . $qr_image;
            $this->ciqrcode->generate($params);
            
            return base_url(). 'public/user_qr/' . $qr_image;
    }
    
    function company_update($company_id)
    {
            $data = array(
                'name'                      => $this->input->post('name'),
                'address'                   => $this->input->post('address'),
                'empresa_porcent_comition'  => $this->input->post('empresa_porcent_comition'),
                'director_id'               => $this->input->post('director_id'),
                'director_porcent_comition' => $this->input->post('director_porcent_comition'),
                'user_id'                  => $this->input->post('user_id'),
                'porcent_comition'          => $this->input->post('porcent_comition'),
                'agent_porcent_comition'    => $this->input->post('agent_porcent_comition'),
                'ticktock_video'            => $this->input->post('ticktock_video'),
                'status'                    => 1
            );
            $this->db->where('company_id',$company_id);
            $this->db->update('company', $data);
            
            $qr = $this->db->get_where('company',['company_id'=>$company_id])->row()->qr;
            if($qr == '')
            {
                $this->load->library('ciqrcode'); // Librería para generar QR
             
                $qr_data =  base_url().'?team='.base64_encode($company_id); 
                $qr_image = "qr_user_" . base64_encode($company_id) . ".png";
                $params['data'] = $qr_data;
                $params['level'] = 'H';
                $params['size'] = 10;
                $params['savename'] = FCPATH . 'public/user_qr/' . $qr_image;
                $this->ciqrcode->generate($params);
                
                $this->db->where('company_id',$company_id);
                $this->db->update('company',['qr'=>$qr_image]);
            }
            
            return $company_id;
            
            
    }
    
    function company_desactivate($company_id)
    {
            $data = array(
                'status'    => 0
            );
            $this->db->where('company_id',$company_id);
            return $this->db->update('company', $data);
            
            
    }
 
    function company_delete($company_id)
    {
            $data = array(
                'status'    => 2
            );
            $this->db->where('company_id',$company_id);
            return $this->db->update('company', $data);
            
            
    }
    
    function company_products_create()
    {
            $data = array(
                'name'                      => $this->input->post('name'),
                'code'                      => $this->input->post('code'),
                'address'                   => $this->input->post('address'),
                'empresa_porcent_comition'  => $this->input->post('empresa_porcent_comition'),
                'director_id'               => $this->input->post('director_id'),
                'director_porcent_comition' => $this->input->post('director_porcent_comition'),
                'user_id'                  => $this->input->post('user_id'),
                'porcent_comition'          => $this->input->post('porcent_comition'),
                'agent_porcent_comition'    => $this->input->post('agent_porcent_comition'),
                'status'                    => 1
            );
            
            $this->db->insert('company_products', $data);
            
            return $this->db->insert_id();
    }
    
    function company_products_update($company_products_id)
    {
            $data = array(
                'name'                      => $this->input->post('name'),
                'code'                      => $this->input->post('code'),
                'address'                   => $this->input->post('address'),
                'empresa_porcent_comition'  => $this->input->post('empresa_porcent_comition'),
                'director_id'               => $this->input->post('director_id'),
                'director_porcent_comition' => $this->input->post('director_porcent_comition'),
                'user_id'                  => $this->input->post('user_id'),
                'porcent_comition'          => $this->input->post('porcent_comition'),
                'agent_porcent_comition'    => $this->input->post('agent_porcent_comition'),
                'status'                    => 1
            );
            $this->db->where('company_products_id',$company_products_id);
            return $this->db->update('company_products', $data);
    }
    
    function company_products_desactivate($company_products_id)
    {
            $data = array(
                'status'    => 0
            );
            $this->db->where('company_products_id',$company_products_id);
            return $this->db->update('company_products', $data);
            
            
    }
    
       
    function super_admin_reactivate($user_id)
    {
            $data = array(
                'status'    => 1
            );
            $this->db->where('user_id',$user_id);
            return $this->db->update('user', $data);
            
            
    }
    
    
    function admin_maps($user_id)
    {
        $this->db->where('user_id',$user_id);
        $this->db->delete('admin_maps');
        
        $ciudades = explode("|", $this->input->post('ciudades')[0]);
        foreach ($ciudades as $item) {
            list($provincia_id, $canton_id) = explode(":", $item);
            $this->db->insert('admin_maps', [
                'user_id'      => $user_id,
                'pais_id'       => 1,
                'provincia_id'  => $provincia_id,
                'canton_id'     => $canton_id
            ]);
        }

    }
 
    
    function admin_reactivate($user_id)
    {
        $data = array(
            'active'    => 1
        );
        $this->db->where('user_id',$user_id);
        return $this->db->update('user', $data);
            
    }
    
    function user_desactivate($user_id)
    {
        $data = array(
            'active'    => 0
        );
    
        $this->db->where('user_id',$user_id);
        return $this->db->update('user', $data);
    }
    
    function user_reactivate($user_id)
    {
        $data = array(
            'active'    => 1
        );
    
        $this->db->where('user_id',$user_id);
        return $this->db->update('user', $data);
    }
    
    function company_reactivate($company_id)
    {
        $data = array(
            'status'    => 1
        );
        $this->db->where('company_id',$company_id);
        return $this->db->update('company', $data);
            
    }
    
    
    // Obtener todos los admins
     function get_all_admins() {
        $this->db->where('status',1);
        $this->db->where('type',0);
        $this->db->where('pais_id',$this->session->userdata('current_country'));
        $query = $this->db->get('user');
        return $query->result();
    }
    
    // Obtener todos los admins
     function get_all_directors() {
        $this->db->where('status',1);
        $this->db->where('type',1);
        $this->db->where('pais_id',$this->session->userdata('current_country'));
        $query = $this->db->get('user');
        return $query->result();
    }
    
     // Obtener todos los ventas por estado o todas si es 'all'
     function get_sales_sa($status) {
        if($status == 'all')
        {
            
            
            $this->db->order_by('sale_id','DESC');
            $this->db->where('status !=',3);
            $query = $this->db->get('sale');
        
            
        }else
        {
            
            $this->db->order_by('sale_id','DESC');
            $this->db->where('status',$status);
            $this->db->where('status !=',3);
            $query = $this->db->get('sale');
        }
        
        return $query->result();
    }
    
    
    // Obtener todos los ventas por estado o todas si es 'all'
     function get_sales($status) {
        if($status == 'all')
        {
            
            $user_type = $this->db->get_where('user',array('user_id'=>$this->session->userdata('login_user_id')))->row()->type;
            
            if($user_type)
            {   
                
                $companies = $this->db->get_where('company',array('director_id'=>$this->session->userdata('login_user_id')))->result_array();
                $companies_id = array();
                foreach($companies as  $com)
                {
                    if($com['company_id'] != '')
                    array_push($companies_id,$com['company_id']);
                    
                }
                
                
                $company_id = $this->db->get_where('company',array('user_id'=>$this->session->userdata('login_user_id')))->row()->company_id;
                
                if($company_id != '')
                array_push($companies_id,$company_id);
                
                
                array_push($companies_id,$this->session->userdata('current_company'));
                
                log_message('error',json_encode($companies_id));
                
                if(count($companies_id)>0)
                {   
                    // Convertir el array a una cadena separada por comas
                    $companies_id_list = implode(',', array_map('intval', $companies_id));
                    $query = $this->db->query("SELECT * FROM `sale` WHERE `company_id` IN (".$companies_id_list.") AND `status` != 3 ORDER BY `sale_id` DESC");
                }
                else
                return array();
                
                
            }else
            {
                
                if($this->session->userdata('current_company') != 0)
                {
                    $this->db->where('company_id',$this->session->userdata('current_company'));
                    $this->db->where('status !=',3);
                    $this->db->order_by('sale_id','DESC');
                    $query = $this->db->get('sale');
                }
                else
                return array();
                
            }
            
           
        }else
        {
            
            
            
            $user_type = $this->db->get_where('user',array('user_id'=>$this->session->userdata('login_user_id')))->row()->type;
            
            if($user_type)
            {   
                 $companies = $this->db->get_where('company',array('director_id'=>$this->session->userdata('login_user_id')))->result_array();
                $companies_id = array();
                foreach($companies as  $com)
                {
                    array_push($companies_id,$com['company_id']);
                    
                }
                $company_id = $this->db->get_where('company',array('user_id'=>$this->session->userdata('login_user_id')))->row()->company_id;
                
                array_push($companies_id,$company_id);
                
                if(count($companies_id)>0)
                $this->db->where_in('company_id',$companies_id);
                else
                return array();
                
                
            }else
            {
                $company_id = $this->db->get_where('company',array('user_id'=>$this->session->userdata('login_user_id')))->result_array();
                
                array_push($companies_id,$company_id);
                
                if(count($companies_id)>0)
                $this->db->where_in('company_id',$companies_id);
                else
                return array();
                
            }
            
            $this->db->order_by('sale_id','DESC');
            $this->db->where('status',$status);
            $this->db->where('status !=',3);
            $query = $this->db->get('sale');
            
             
        }
        log_message('error',$this->db->last_query());
        return $query->result();
    }
    
    
    // Obtener todos los ventas por estado o todas si es 'all'
     function get_salesByUser($status) {
        if($status == 'all')
        {
            $this->db->where('user_type','user');
            $this->db->where('user_id',$this->session->userdata('login_user_id'));
            $this->db->order_by('sale_id','DESC');
            $this->db->where('status !=',3);
            $query = $this->db->get('sale');
            
        }else
        {
            $this->db->where('user_type','user');
            $this->db->where('user_id',$this->session->userdata('login_user_id'));
            $this->db->order_by('sale_id','DESC');
            $this->db->where('status',$status);
            $this->db->where('status !=',3);
            $query = $this->db->get('sale');
        }
        
        return $query->result();
    }
    

    // Obtener un admin por ID
    public function get_admin_by_id($user_id) {
        
        $query = $this->db->get_where('user', array('user_id' => $user_id));
        return $query->row();
    }

    
     // Crear un nuevo admin
     function admin_create($type) {
         
         $username_exist = $this->db->get_where('user',['username'=>$this->input->post('username'),'status'=>1])->num_rows();
         
         if($username_exist > 0)
         {
            return json_encode(['status'=>'error','message'=>'El usuario no es válido o no existe.']); 
         }
         
         $email_exist = $this->db->get_where('user',['email'=>$this->input->post('email'),'status'=>1])->num_rows();
         
         if($email_exist > 0)
         {
            return json_encode(['status'=>'error','message'=>'El correo elctrónico no es válido o no existe.']); 
         }
         
         $md5 = md5(date('d-m-y H:i:s'));
         $photo = '';
         if($_FILES['photo']['size'] > 0)
         {
            $photo  = $md5.str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'public/assets/images/users/' . $md5.str_replace(' ', '', $_FILES['photo']['name']));

        }
        
        $data = array(
            'name'          => $this->input->post('name'),
            'last_name'     => $this->input->post('last_name'),
            'ruc'           => $this->input->post('ruc'),
            'email'         => $this->input->post('email'),
            'phone'         => $this->input->post('phone'),
            'username'      => $this->input->post('username'),
            'password'      => sha1($this->input->post('password')),
            'birthday'      => $this->input->post('birthday'),
            'date_register' => date('Y-m-d H:i:s'),
            'company_id'    => $this->input->post('company_id'),
            'rol_id'        => 1,
            'photo'         => $photo,
            'porcent_comition'         => $this->input->post('porcent_comition'),
            'level'         => $this->input->post('level'),
            'type'          => $type,
            'pais_id'       => $this->session->userdata('current_country'),
        );
        
        $this->db->insert('user', $data);
        
        return json_encode(['status'=>'success','message'=>'Usuario registrado.']); 
    }
    
    // Crear un nuevo admin
     function usertoadmin($user_id) {
         
        $user = $this->db->get_where('user', array('user_id' => $user_id))->result_array();

        foreach ($user as $row) {
            // Generar nombre único para la imagen (md5)
            $md5 = md5(date('d-m-y H:i:s'));
            $photo = $row['photo']; // Mantener la foto existente si no se sube una nueva
        
            // Preparar los datos a insertar basados solo en $row
            $data = array(
                'name'             => $row['name'],
                'last_name'        => $row['last_name'],
                'ruc'              => $row['ruc'],
                'email'            => $row['email'],
                'username'         => $row['username'],
                'password'         => $row['password'], // Mantener la contraseña original
                'birthday'         => $row['birthday'],
                'date_register'    => $row['date_register'], // Mantener la fecha de registro original
                'company_id'       => $row['company_id'],
                'rol_id'           => $row['rol_id'], // Mantener rol existente
                'photo'            => $photo,
                'porcent_comition' => $row['porcent_comition'],
                'level'            => $row['level'],
                'type'             => 0 // Asegúrate de que $type esté definido en los datos del usuario
            );
        
            // Insertar los datos actualizados en la base de datos
            $this->db->insert('user', $data);
            $user_id = $this->db->insert_id();
            
            $data = array(
                
            'status' => 2
            
            );
            
            $this->db->where('user_id',$user_id);
            $this->db->update('user',$data);
            
            
            $data = array(
                'user_type' => 'user',
                'user_id'   => $user_id
            );
            
            $this->db->where('user_type','user');
            $this->db->where('user_id',$user_id);
            $this->db->update('sale',$data);
            
            $data = array(
                'user_type' => 'user',
                'user_id'   => $user_id
            );
            
            $this->db->where('user_type','user');
            $this->db->where('user_id',$user_id);
            $this->db->update('lexvault',$data);
            
            $data = array(
                'user_type' => 'user',
                'user_id'   => $user_id
            );
            
            $this->db->where('user_type','user');
            $this->db->where('user_id',$user_id);
            $this->db->update('visa',$data);
            
        }
         
         
    }

    // Actualizar un admin
    function admin_update($user_id) {
        
        $md5 = md5(date('d-m-y H:i:s'));
        
        
        if($this->input->post('password') != '')
        {
            $password = 
            
            $data = array(
                'password'          => sha1($this->input->post('password'))
            );
            $this->db->where('user_id', $user_id);
            $this->db->update('user', $data);
        }
        
        $data = array(
            'name'          => $this->input->post('name'),
            'last_name'     => $this->input->post('last_name'),
            'ruc'           => $this->input->post('ruc'),
            'email'         => $this->input->post('email'),
            'phone'         => $this->input->post('phone'),
            'birthday'      => $this->input->post('birthday'),
            'date_register' => date('Y-m-d H:i:s'),
            'company_id'    => $this->input->post('company_id'),
            'porcent_comition'         => $this->input->post('porcent_comition'),
            'level'         => $this->input->post('level'),
        );
        
         $photo = '';
         if($_FILES['photo']['size'] > 0)
         {
            $photo  = $md5.str_replace(' ', '', $_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'public/assets/images/users/' . $md5.str_replace(' ', '', $_FILES['photo']['name']));
            $data['photo'] = $photo;
        }
        
        
        $this->db->where('user_id', $user_id);
        return $this->db->update('user', $data);
    }
    
     // Actualizar un admin
    function admin_update_notes($user_id) {
        
        
            $data = array(
                'notes'          => $this->input->post('notes')
            );
            $this->db->where('user_id', $user_id);
            return $this->db->update('user', $data);
    }
    
    // Eliminar un admin
    function admin_desactivate($user_id) {
        
        $data = array(
            'active' => 0
        );
        
        $this->db->where('user_id', $user_id);
        return $this->db->update('user',$data);
    }
    

    // Eliminar un admin
    function admin_delete($user_id) {
        
        $data = array(
            'status' => 0
        );
        
        $this->db->where('user_id', $user_id);
        return $this->db->update('user',$data);
    }
    
    
    // Obtener todos los usuarios
    function get_all_users() 
    {
        $this->db->where('status', 1);
        $this->db->where('pais_id',$this->session->userdata('current_country'));
        $this->db->where('rol_id', 4);
        $query = $this->db->get('user');
        return $query->result();
    }
    
    // Obtener todos los usuarios
     function get_all_users_by_director() {
        
        $companies = $this->db->get_where('company',array('director_id'=>$this->session->userdata('login_user_id')))->result_array();
        $companies_id = array();
        foreach($companies as $companie)
        {
            array_push($companies_id,$companie['company_id']);
            
        }
        
        if(count($companies_id) > 0 )
        {
            $this->db->where_in('company_id',$company_id);
            $this->db->where('pais_id',$this->session->userdata('current_country'));
            return $query = $this->db->get('user')->result();;
            
        }else
        {
            return array();
        }
        
    }
    
    // Obtener todos los usuarios
     function get_all_users_by_gerente() {
         
        $this->db->where('pais_id',$this->session->userdata('current_country'));
        $company_id = $this->db->get_where('company',array('user_id'=>$this->session->userdata('login_user_id')))->row()->company_id;
        $this->db->where('company_id',$company_id); 
        return $query = $this->db->get('user')->result();
        
    }

    // Obtener un user por ID
    public function get_user_by_id($user_id) {
        
        $query = $this->db->get_where('user', array('user_id' => $user_id));
        return $query->row();
    }

    
    
    
    
    function getCompanyName($ID)
    {
        $name = $this->db->get_where('company', array('company_id' => $ID))->row_array();
        return $name['name'];
    }
    
     function getRolName($ID)
    {
        $name = $this->db->get_where('rol', array('rol_id' => $ID))->row_array();
        return $name['name'];
    }
    
    function getSaleCode() {
        // Iniciales del código
        $initials = "SLT";
    
        // Caracteres permitidos para el código aleatorio (solo mayúsculas y números)
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Longitud del código aleatorio (8 - 3 iniciales = 5 caracteres aleatorios)
        $length = 5;
    
        // Generar el código aleatorio
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, strlen($characters) - 1)];
        }
    
        // Concatenar las iniciales con el código aleatorio
        return $initials . $randomString;
    }
    
    
    
    function saveSale()
    {
        
        // Iniciar con $exist en 1 para entrar en el ciclo
        $exist = 1;
    
        // Bucle para generar un código único
        while($exist != 0) {
            // Generar el código
            $code = $this->getSaleCode();
    
            // Verificar si el código ya existe en la tabla 'sale'
            $exist = $this->db->get_where('sale', array('code' => $code))->num_rows();
        }
    
        $user_type = $this->session->userdata('login_type');
        $user_id = $this->session->userdata('login_user_id');
        
        
    
        $porcent_comition = $this->db->get_where('company',array('company_id'=>$this->session->userdata('current_company')))->row();
        log_message('error','Company '.$this->session->userdata('current_company').'/'.json_encode($porcent_comition));
        // Datos a insertar
        $data = array(
            'name'              => $this->input->post('name_sale'),
            'code'              => $code,
            'user_id'           => $this->session->userdata('login_user_id'),
            'user_type'         => $this->session->userdata('login_type'),
            'company_id'        => $this->session->userdata('current_company'),
            'pais_id'           => $this->session->userdata('current_country'),
            'status'            => 0, 
            'commition_percent' => $porcent_comition->agent_porcent_comition,
            'commition_percent_gerente' => $porcent_comition->porcent_comition,
            'commition_percent_director' => $porcent_comition->director_porcent_comition,
            'commition_percent_empresa' => $porcent_comition->empresa_porcent_comition,
        );
    
        // Insertar los datos en la tabla 'user'
        $this->db->insert('sale', $data);
        $sale_id = $this->db->insert_id();
        
        
        // Obtener los datos del formulario
        $type = $this->input->post('type');
        $names = $this->input->post('name');
        $last_names = $this->input->post('last_name');
    
        // Iterar sobre los datos recibidos (suponiendo que todos los arrays tienen la misma longitud)
        for ($i = 0; $i < count($type); $i++) {
            $ruc = $this->input->post('ruc')[$i];
    
            // Verificar si el cliente ya existe en la tabla 'client'
            $existing_client = $this->db->get_where('client', array('ruc' => $ruc))->row();
    
            // Variable para almacenar el ID del cliente
            $client_id = null;
    
            // Si el cliente existe, obtener su ID
            if ($existing_client) {
                $client_id = $existing_client->client_id;
            } else {
                // Si el cliente no existe, insertarlo en la tabla 'client'
                $client_data = array(
                    'ruc'       => $ruc,
                    'type'      => $type[$i],
                    'name'      => $names[$i],
                    'last_name' => $last_names[$i],
                );
    
                $this->db->insert('client', $client_data);
                $client_id = $this->db->insert_id();
            }
    
            $sale_detail_data = array(
                'sale_id'   => $sale_id,
                'client_id' => $client_id,
            );
    
            // Insertar los datos en la tabla 'sale_details'
            $this->db->insert('sale_details', $sale_detail_data);
          
        }
        
        // Retornar el ID del último registro insertado
        return $sale_id;
        
    }
    
    function getSalebyId($sale_id)
    {
        
        $sale = $this->db->get_where('sale',array('sale_id'=>$sale_id))->row_array();
        return $sale;
        
    }
    
    
    function getClientbyId($client_id)
    {
        
        $client = $this->db->get_where('client',array('client_id'=>$client_id))->row_array();
        return $client;
        
    }
    
    

    
     
     function delete_sale($sale_id)
    {
        $data = array(
            'status'            => 3,
            
        );
        
        $this->db->where('sale_id', $sale_id);
        $this->db->update('sale', $data);
        
        return 1;
    }
    
    function auth_sale($sale_id)
    {
        $data = array(
            'status'            => 1,
            
        );
        
        $this->db->where('sale_id', $sale_id);
        $this->db->update('sale', $data);
        
        return 1;
    }
    
    
     function reject_sale($sale_id)
    {
        $data = array(
            'status'            => 2,
            
        );
        
        $this->db->where('sale_id', $sale_id);
        $this->db->update('sale', $data);
        
        return 1;
    }
    
    function preauth_sale($sale_id)
    {
        $data = array(
            'status'            => 4,
            
        );
        
        $this->db->where('sale_id', $sale_id);
        $this->db->update('sale', $data);
        
        
        
        return 1;
    }
    
    
    function get_payment_metods()
    {
        return $this->db->get_where('payment_method',array('status'=>1))->result_array();
    }
    
    
     function get_products()
    {
        return $this->db->get_where('product',array('status'=>1))->result_array();
    }
    
    function get_porcet_commition()
    {
        $user_type = $this->session->userdata('login_type');
        $user_id = $this->session->userdata('login_user_id');
        $porcent = $this->db->get_where($user_type,array($user_type.'_id'=>$user_id))->row()->porcent_comition;
    
        return $porcent/100;
    }
    
    
    function update_sale_recipe($sale_id)
    {
        
         $md5 = md5(date('d-m-y H:i:s'));
         $file = '';
         if($_FILES['file']['size'] > 0)
         {
            
            $file  = $md5.str_replace(' ', '', $_FILES['file']['name']);
            move_uploaded_file($_FILES['file']['tmp_name'], 'public/assets/sales/recipes/' . $file);

         }
        
        if($this->input->post('type') == 1)
        {
            $data = array(
                'pay_document' => $file
            );
                
            $this->db->where('sale_id',$sale_id);
            $this->db->update('sale',$data);
            
        }
        
         if($this->input->post('type') == 2)
        {
            $data = array(
                
                'excel' => $file
                
                );
                
            $this->db->where('sale_id',$sale_id);
            $this->db->update('sale',$data);
            
        }
        
          if($this->input->post('type') == 3)
        {
            $data = array(
                
                'pay_document_2' => $file
                
                );
                
                $this->db->where('sale_id',$sale_id);
                $this->db->update('sale',$data);
            
        }
    }
    
    function update_sale_name()
    {
        
        $data = array(
    
        'name' => $this->input->post('name')
        
        );
        
        $this->db->where('sale_id',$this->input->post('sale_id'));
        $this->db->update('sale',$data);
                
    }
    
    function update_sale_principal()
    {
        
        $data = array(
    
        'principal' => 1
        
        );
        
        $this->db->where('sale_details_id',$this->input->post('sale_details_id'));
        $this->db->update('sale_details',$data);
        log_message('error',$this->input->post('sale_details_id'));
    }
    
     function update_product_sale_recipe($sale_id)
    {
        
         $md5 = md5(date('d-m-y H:i:s'));
         $file = '';
         if($_FILES['file']['size'] > 0)
         {
            
            $file  = $md5.str_replace(' ', '', $_FILES['file']['name']);
            move_uploaded_file($_FILES['file']['tmp_name'], 'public/assets/sales/recipes/' . $file);

         }
        
       
            $data = array(
                'foto_transferencia' => $file
            );
                
            $this->db->where('id',$sale_id);
            $this->db->update('product_sales',$data);
            
    }
    
    function download_file($file) {

        if (file_exists($file)) {
            force_download($file, NULL);
        } else {
            show_404();
        }
    }
    
    function add_lexvault()
    {
        $template = $this->db->get_where('lexvault_template', array('lexvault_template_id' => $this->input->post('lexvault_template_id')))->row();


            $fields = json_decode($template->fields);
            $nfields = array();
            foreach ($fields as $field) {
                log_message('error', 'field ' . $field);
                $nfields[$field] = "";
            }


            $data = array(
                'name'                  => $this->input->post('name'),
                'description'           => $this->input->post('description'),
                'lexvault_template_id'  => $this->input->post('lexvault_template_id'),
                'membrete'              => $template->membrete,
                'content'               => $template->content,
                'fields'                => json_encode($nfields),
                'user_id'               => $this->session->userdata('login_user_id'),
                'user_type'             => $this->session->userdata('login_type'),
                'company_id'            => $this->session->userdata('current_company'),
                'status'                => 1
            );
            $this->db->insert('lexvault', $data);
            return $this->db->insert_id();
    }
    
    
    function add_visa_ref()
    {
            $data = array(
                'name'          => $this->input->post('name'),
                'user_id'       => $this->session->userdata('login_user_id'),
                'user_type'     => $this->session->userdata('login_type'),
                'status'        => 1
            );
            $this->db->insert('visa_ref', $data);
            
            return $this->db->insert_id();
    }
    
    function update_visa_ref($visa_id)
    {
            $data = array(
                'name'          => $this->input->post('name'),
            );
            
            $this->db->where('id',$visa_id);
            return $this->db->update('visa_ref', $data);
            
            
    }
    
    function delete_visa_ref($visa_id)
    {
            $data = array(
                'status'        => 0
            );
            
            $this->db->where('id',$visa_id);
            return $this->db->update('visa_ref', $data);
            
            
    }
    
    function add_visa()
    {
            $data = array(
                'name'          => $this->input->post('name'),
                'description'   => $this->input->post('description'),
                'visa_type'     => $this->input->post('visa_type'),
                'fields'        => '',
                'user_id'       => $this->session->userdata('login_user_id'),
                'user_type'     => $this->session->userdata('login_type'),
                'company_id'    => $this->session->userdata('current_company'),
                'visa_ref_id'   => $this->input->post('visa_ref_id'),
                'status'        => 1
            );
            $this->db->insert('visa', $data);
            
            return $this->db->insert_id();
    }
    
    function update_visa($visa_id)
    {
            $data = array(
                'name'          => $this->input->post('name'),
                'description'   => $this->input->post('description'),
                'visa_type'     => $this->input->post('visa_type'),
                'fields'        => '',
                'user_id'       => $this->session->userdata('login_user_id'),
                'user_type'     => $this->session->userdata('login_type'),
                'company_id'    => $this->session->userdata('current_company'),
                'status'        => 1
            );
            
            $this->db->where('visa_id',$visa_id);
            return $this->db->update('visa', $data);
            
            
    }
    
    function delete_visa($visa_id)
    {
            $data = array(
                'status'        => 0
            );
            
            $this->db->where('visa_id',$visa_id);
            return $this->db->update('visa', $data);
            
            
    }
    
    
    function get_fees()
    {
        return $this->db->get('gain_fee_travel')->result_array();
    }
    
    
    function get_info($val)
    {
        return $this->db->get_where('settings',array('type'=>$val))->row()->description;
    }
    
    
  // Obtener un agentes por por company_id
    public function get_team($company_id) {
        
        $query = $this->db->get_where('user', array('company_id' => $company_id));
        
        return $query->result();
    }
    
    // Obtener todos los ventas por estado o todas si es 'all'
    function get_salesByUser_id($status,$user_id) {
        if($status == 'all')
        {
            
            
            $this->db->where('user_type','user');
            $this->db->where('user_id',$user_id);
            $this->db->where('status !=',3);
            $this->db->order_by('sale_id','DESC');
            $query = $this->db->get('sale');
            
        }else
        {
            
            
            
            $this->db->where('user_type','user');
            $this->db->where('user_id',$user_id);
            $this->db->order_by('sale_id','DESC');
            $this->db->where('status',$status);
            $this->db->where('status !=',3);
            $query = $this->db->get('sale');
        }
        
        return $query->result();
    }
    
    function get_totals_sales()
    {
        
        return $this->db->query("SELECT SUM((total_additional + total_fee) * commition_percent / 100) as total_agentes, SUM((total_additional + total_fee) * commition_percent_gerente / 100) as total_gerentes, SUM((total_additional + total_fee) * commition_percent_director / 100) as total_directores, SUM((total_additional + total_fee) * commition_percent_empresa / 100) as total_empresas FROM `sale` WHERE MONTH(datetime) = ".date('m')." AND total_additional != '';")->row();
        
    }
    
    function get_totals_sales_prev()
    {
        // Crear una instancia de DateTime con la fecha actual
        $date = new DateTime();
        
        // Restar 1 mes
        $date->modify('-1 month');
        
        // Obtener el mes resultante
        $month = $date->format('m');
                
        return $this->db->query("SELECT SUM((total_additional + total_fee) * commition_percent / 100) as total_agentes, SUM((total_additional + total_fee) * commition_percent_gerente / 100) as total_gerentes, SUM((total_additional + total_fee) * commition_percent_director / 100) as total_directores, SUM((total_additional + total_fee) * commition_percent_empresa / 100) as total_empresas FROM `sale` WHERE MONTH(datetime) = ".$month." AND total_additional != '';")->row();
        
    }
    
    function calc_percent($valor_anterior,$valor_actual)
    {
        
        // Verificar que el valor anterior no sea cero para evitar división por cero
        if ($valor_anterior != 0) {
            // Calcular la diferencia
            $diferencia = $valor_actual - $valor_anterior;
        
            // Calcular el porcentaje de diferencia
            $porcentaje_diferencia = ($diferencia / $valor_anterior) * 100;
            
            // Mostrar el resultado
            return number_format($porcentaje_diferencia);
        } else {
            return 0;
        }


    }
    
    
   
    
    
    function get_totals()
    {
      
       
       $totals = array();
       
       for($i = 01; $i <= 12; $i++)
       {
           $total = $this->db->query("SELECT SUM((total_additional + total_fee)) as total FROM `sale` WHERE MONTH(datetime) = ".$i." AND total_additional != '';")->row()->total;
            array_push($totals,$total);
       }
       
       echo json_encode($totals);
        
    }
    
    
        public function insertar_pais($nombre) {
        $this->db->insert('pais', ['nombre' => $nombre]);
        return $this->db->insert_id();
    }

    public function get_pais($id)
    {
        return $this->db->get_where('pais',['id'=>$id])->row()->nombre;
        
    }
    
    public function get_provincia($id)
    {
        return $this->db->get_where('provincia',['id'=>$id])->row()->nombre;
        
    }
    
    public function get_canton($id)
    {
        return $this->db->get_where('canton',['id'=>$id])->row()->nombre;
        
    }
    
    public function insertar_provincia($nombre, $pais_id) {
        $this->db->insert('provincia', ['nombre' => $nombre, 'pais_id' => $pais_id]);
        return $this->db->insert_id();
    }

    public function insertar_canton($nombre, $provincia_id) {
        $this->db->insert('canton', ['nombre' => $nombre, 'provincia_id' => $provincia_id]);
    }
    
    
     function insert_sale()
    {
        log_message('error',base64_decode($this->input->post('seller')));
        $seller = explode('-',base64_decode($this->input->post('seller')));
        $user_id   = $seller[1];
        $user_type = $seller[0];
        
        $user = $this->db->get_where($user_type,array($user_type.'_id'=>$user_id))->row();
        
        $porcent_comition = $this->db->get_where('company',array('company_id'=>$user->company_id))->row();
        
        $product = $this->db->get_where('productos',['id'=>$this->input->post('product')])->row_array();
        // Recoger datos del formulario
        $data = array(
            'name' => $this->input->post('name'),
            'last_name' => $this->input->post('last_name'),
            'phone' => $this->input->post('phone'),
            'email' => $this->input->post('email'),
            'pais' => $this->input->post('pais'),
            'provincia' => $this->input->post('provincia'),
            'canton' => $this->input->post('canton'),
            'address' => $this->input->post('address'),
            'recaudo' => $this->input->post('recaudo'),
            'numero_transferencia' => $this->input->post('numero_transferencia'),
            'seller_id' =>   $user_id,
            'seller_type' => $user_type,
            'company_id'  => $user->company_id,
            'supplier_id' => $product['supplier_id'],
            'commition_percent' => $porcent_comition->agent_porcent_comition,
            'commition_percent_gerente' => $porcent_comition->porcent_comition,
            'commition_percent_director' => $porcent_comition->director_porcent_comition,
            'commition_percent_empresa' => $porcent_comition->empresa_porcent_comition,
        );

        // Subir la imagen si "Sin Recaudo" está seleccionado
         $md5 = md5(date('d-m-y H:i:s'));
         $file = '';
         if($_FILES['foto_transferencia']['size'] > 0)
         {
            
            $file  = $md5.str_replace(' ', '', $_FILES['foto_transferencia']['name']);
            move_uploaded_file($_FILES['foto_transferencia']['tmp_name'], 'public/assets/sales/recipes/' . $file);
            $data['foto_transferencia'] = $file;
         }
        
       
        $array_products = array();
        $total_cost     = 0;
        $total_price    = 0;
        $grand_total    = 0;
        
  
        $array_products[] = $this->input->post('product');
            
        $total_cost     += $product['suggested_price']+ $product['aditional_price'] * 1;
        $total_price    += $product['suggested_price']+ $product['aditional_price'] * 1;
        $grand_total    += $product['suggested_price']+ $product['aditional_price'] * 1;
       
        
      
        $data['products']   = json_encode($array_products);
        $data['total_cost'] = $total_cost;
        $data['total_price'] = $total_price;
        $data['grand_total'] = $grand_total + $this->crud_model->getInfo('cost_delivery');
        $data['total_aditional'] = 0;
        $data['total_delivery']  = $this->crud_model->getInfo('cost_delivery');
        
        $this->db->insert('product_sales',$data);
        $sale_id = $this->db->insert_id();
        
        
       
        $dataDetails['product_id']   = $product['id'];
        $dataDetails['supplier_id']  = $product['supplier_id'];
        $dataDetails['price']        = $product['suggested_price']+ $product['aditional_price'];
        $dataDetails['sale_price']   = $product['suggested_price']+ $product['aditional_price'];
        $dataDetails['cantidad']     = 1;
        $dataDetails['sale_id']      = $sale_id;
        $dataDetails['status']       = 0;
        $this->db->insert('product_sales_details',$dataDetails);
       
        
        $message = 'Atención nueva venta, del agente '.$this->crud_model->getName($this->session->userdata('login_type'),$this->session->userdata('login_user_id')).', puedes consultar los detalles '.base_url().'admin/product_sales_details/'.base64_encode($sale_id);
        $this->whatsapp_model->sendWhatsapp('983725228',$message);
        sleep(5);
        $message = 'Atención nueva venta, del agente '.$this->crud_model->getName($this->session->userdata('login_type'),$this->session->userdata('login_user_id')).', puedes consultar los detalles '.base_url().'portal/product_sales_details/'.base64_encode($sale_id);
        $this->whatsapp_model->sendWhatsapp('983725228',$message);
        
        return 1;
    }
    
             
     function delete_product_sale($sale_id)
    {
        $data = array(
            'status'            => 3,
            
        );
        
        $this->db->where('id', $sale_id);
        $this->db->update('product_sales', $data);
        
        return 1;
    }
    
    function auth_product_sale($sale_id)
    {
        $data = array(
            'status'            => 1,
            
        );
        
        $this->db->where('id', $sale_id);
        $this->db->update('product_sales', $data);
        
        $sale = $this->db->get_where('product_sales',['id'=>$sale_id])->row_array();
        
        $supplier = $this->db->get_where('user',['user_id'=>$sale['supplier_id']])->row_array();
        $supplier_phone = $supplier['phone'];
        if (substr($supplier_phone, 0, 1) === '0') {
            $supplier_phone = substr($supplier_phone, 1);
        }        
        
        $seller = $this->db->get_where($sale['seller_type'],[$sale['seller_type'].'_id'=>$sale['seller_id']])->row_array();
        $seller_phone = $seller['phone'];
        if (substr($seller_phone, 0, 1) === '0') {
            $seller_phone = substr($seller_phone, 1);
        }
        
        if($supplier_phone != ''): 
        $message = 'Atención la venta, del agente '.$this->crud_model->getName($sale['seller_type'],$sale['seller_id']).' fue aprobada, puedes consultar los detalles '.base_url().'admin/product_sales_details/'.base64_encode($sale_id);
       
        $this->whatsapp_model->sendWhatsapp($supplier_phone,$message);
        endif;
        
         if($seller_phone != ''): 
        $message = 'Atención la venta, del agente '.$this->crud_model->getName($sale['seller_type'],$sale['seller_id']).' fue aprobada, puedes consultar los detalles '.base_url().$sale['seller_type'].'/product_sales_details/'.base64_encode($sale_id);
       
        $this->whatsapp_model->sendWhatsapp($seller_phone,$message);
        endif;
        
        return 1;
    }
    
       function send_product_sale($sale_id)
    {
        $data = array(
            'status'            => 5,
            
        );
        
        $this->db->where('id', $sale_id);
        $this->db->update('product_sales', $data);
        
        $sale = $this->db->get_where('product_sales',['id'=>$sale_id])->row_array();
        
        $message = 'Atención la venta, del agente '.$this->crud_model->getName($sale['seller_type'],$sale['seller_id']).' fue enviada por el proveedor '.$this->crud_model->getName('user',$sale['supplier_id']).', puedes consultar los detalles '.base_url().'portal/product_sales_details/'.base64_encode($sale_id);
       
        $this->whatsapp_model->sendWhatsapp('593983725228',$message);
        
        
        
        return 1;
    }
    
    
       function delivered_product_sale($sale_id)
    {
        $data = array(
            'status'            => 6,
            
        );
        
        $this->db->where('id', $sale_id);
        $this->db->update('product_sales', $data);
        
        
        $product_sale = $this->db->get_where('product_sales',['id'=>$sale_id])->row_array();
        $profit = $product_sale['total_price'] - $product_sale['total_cost'];
        
        $agent_profit = $profit * ($product_sale['commition_percent'] / 100);
           $data = [
            'user_type'   => $product_sale['seller_type'],
            'user_id'   => $product_sale['seller_id'],
            'origin'    => 1,
            'sale_id'    => $sale_id,
            'amount'    => $agent_profit,
            'type'      => 1,
            'status'    => 1,
        ];
        
        $this->db->insert('commission',  $data);
        
        if($product_sale['commition_percent_gerente'] > 0)
        {
             $agent_profit = $profit * ($product_sale['commition_percent_gerente'] / 100);
               $data = [
                'user_type'   => $product_sale['seller_type'],
                'user_id'   => $product_sale['seller_id'],
                'origin'    => 1,
                'sale_id'    => $sale_id,
                'amount'    => $agent_profit,
                'type'      => 1,
                'status'    => 1,
            ];
            
            $this->db->insert('commission',  $data);
            
        }
       
        
        
        return 1;
    }
    
    
     function reject_product_sale($sale_id)
    {
        $data = array(
            'status'            => 2,
            'reject_description' => $this->input->post('descripcion')
            
        );
        
        $this->db->where('id', $sale_id);
        $this->db->update('product_sales', $data);
        
        $sale = $this->db->get_where('product_sales',['id'=>$sale_id])->row_array();
        
        $message = 'Atención la venta, del agente '.$this->crud_model->getName($sale['seller_type'],$sale['seller_id']).' fue pre aprobada, puedes consultar los detalles '.base_url().'portal/product_sales_details/'.base64_encode($sale_id);
       
        $this->whatsapp_model->sendWhatsapp('593983725228',$message);
        
        return 1;
    }
    
    function preauth_product_sale($sale_id)
    {
        $data = array(
            'status'            => 4,
            
        );
        
        $this->db->where('id', $sale_id);
        $this->db->update('product_sales', $data);
        
        $sale = $this->db->get_where('product_sales',['id'=>$sale_id])->row_array();
        
        $message = 'Atención la venta, del agente '.$this->crud_model->getName($sale['seller_type'],$sale['seller_id']).' fue pre aprobada, puedes consultar los detalles '.base_url().'portal/product_sales_details/'.base64_encode($sale_id);
       
        $this->whatsapp_model->sendWhatsapp('593983725228',$message);
        
        return 1;
    }
    
    
     
    function insert_sale2()
    {
        
         $porcent_comition = $this->db->get_where('company',array('company_id'=>$this->session->userdata('current_company')))->row();
        
        // Recoger datos del formulario
        $data = array(
            'name' => $this->input->post('name'),
            'last_name' => $this->input->post('last_name'),
            'phone' => $this->input->post('phone'),
            'email' => $this->input->post('email'),
            'pais' => $this->input->post('pais'),
            'provincia' => $this->input->post('provincia'),
            'canton' => $this->input->post('canton'),
            'address' => $this->input->post('address'),
            'recaudo' => $this->input->post('recaudo'),
            'numero_transferencia' => $this->input->post('numero_transferencia'),
            'seller_id' => $this->session->userdata('login_user_id'),
            'seller_type' => $this->session->userdata('login_type'),
            'company_id' => $this->session->userdata('current_company'),
            'supplier_id' => $this->session->userdata('current_supplier'),
            'commition_percent' => $porcent_comition->agent_porcent_comition,
            'commition_percent_gerente' => $porcent_comition->porcent_comition,
            'commition_percent_director' => $porcent_comition->director_porcent_comition,
            'commition_percent_empresa' => $porcent_comition->empresa_porcent_comition,
            'type' => $this->input->post('type'),
        );

        // Subir la imagen si "Sin Recaudo" está seleccionado
         $md5 = md5(date('d-m-y H:i:s'));
         $file = '';
         if($_FILES['foto_transferencia']['size'] > 0)
         {
            
            $file  = $md5.str_replace(' ', '', $_FILES['foto_transferencia']['name']);
            move_uploaded_file($_FILES['foto_transferencia']['tmp_name'], 'public/assets/sales/recipes/' . $file);
            $data['foto_transferencia'] = $file;
         }
        
       
        $array_products = array();
        $total_cost     = 0;
        $total_price    = 0;
        $grand_total    = 0;
        
        
       foreach ($this->cart->contents() as $product)
        {
            $array_products[] = $product;
                
            $total_cost     += $product['sale_price'] * $product['qty'];
            $total_price    += $product['price'] * $product['qty'];
            $grand_total    += $product['price'] * $product['qty'];
            
        }
        
      
        $data['products']   = json_encode($array_products);
        $data['total_cost'] = $total_cost;
        $data['total_price'] = $total_price;
        $data['grand_total'] = $grand_total + $this->session->userdata('cart_aditional') + $this->crud_model->getInfo('cost_delivery');
        $data['total_aditional'] = $this->session->userdata('cart_aditional');
        $data['total_delivery'] = $this->crud_model->getInfo('cost_delivery');
        
        $this->db->insert('product_sales',$data);
        $sale_id = $this->db->insert_id();
        
         foreach ($this->cart->contents() as $product)
        {
            $details = $this->db->get_where('productos',['id'=>$product['id']])->row_array();
            $dataDetails['product_id']   = $product['id'];
            $dataDetails['supplier_id']  = $details['supplier_id'];
            $dataDetails['price']        = $product['price'];
            $dataDetails['sale_price']   = $product['sale_price'];
            $dataDetails['cantidad']     = $product['qty'];
            $dataDetails['sale_id']      = $sale_id;
            $dataDetails['status']       = 0;
            $this->db->insert('product_sales_details',$dataDetails);
        }
        
        
        $this->cart->destroy();
        $this->session->set_userdata('cart_aditional',0);
        $this->session->set_userdata('current_supplier','');
        
        $type = $this->input->post('type');
        if($type == 1)
        {
            //$number = '593983725228';
            $number = '47358248';
            $message = 'Atención nueva venta, del agente '.$this->crud_model->getName('user',$this->session->userdata('login_user_id')).', puedes consultar los detalles '.base_url().'portal/product_sales_details/'.base64_encode($sale_id);
            $this->whatsapp_model->sendWhatsapp($number,$message);
        }
        
        
        return 1;
    }
    
   
    

     public function saveProduct() {
            $this->db->trans_start(); // Inicia transacción
            
            $product = $this->input->post();
            
            
            // Guardar producto
            $productData = [
                'name' => $product['name'],
                'type' => $product['type'],
                'description' => $product['description'],
                'sale_price' => $product['sale_price'],
                'suggested_price' => $product['suggested_price'],
                'sku' => $product['sku'],
                'supplier_id' => $product['supplier_id']
            ];
    
            if( $product['id'] != '' ) {
                $this->db->where('id', $product['id']);
                $this->db->update('productos', $productData);
                
            }else{
                $query = $this->db->query("SELECT MAX(id) AS max_id FROM productos");
                $result = $query->row();
                $max_id = $result->max_id;
                log_message('error', 'Producto agregado'.$max_id);
                $productData['id'] = $max_id + 1;
                $this->db->insert('productos', $productData);
                $product['id'] = $productData['id'];
                log_message('error', 'Producto agregado'.$product['id']);
            }
            
            $this->db->replace('producto_warehouses', [
                    'product_id' => $product['id'],
                    'warehouse_id' => $product['user']['id'],
                    'stock' => $warehouse['stock']
                ]);
    
            // Guardar categorías
            foreach ($product['categories_id'] as $category) {
                $this->db->replace('product_categories', ['product_id' => $product['id'], 'category_id' => $category]);
            }
    
            // Guardar imágenes
            foreach (explode(',', $product['main_image']) as $image) {
                $imageData = [
                    'product_id' => $product['id'],
                    'image_url' => 'public/uploads/gallery/'.$image,
                    'is_main' => 1
                ];
    
                log_message('error', 'Producto iamgenes agregado'.json_encode($imageData));
                $this->db->replace('producto_images', $imageData);
            }
            
             log_message('error', 'Producto iamgenes extras '.json_encode($imageData));
             // Guardar imágenes
             $this->db->where('product_id',$product['id']);
             $this->db->where('is_main',0);
             $this->db->delete('producto_images');
             
            foreach (explode(',', $product['extra_images']) as $image) {
                
                $image = str_replace('public/uploads/gallery/','',$image);
                
                $imageData = [
                    'product_id' => $product['id'],
                    'image_url'  => 'public/uploads/gallery/'.$image,
                    'is_main'    => 0
                ];
    
                log_message('error', 'Producto iamgenes agregado'.json_encode($imageData));
    
                $this->db->replace('producto_images', $imageData);
            }
    
            $this->db->trans_complete(); // Finaliza transacción
            return $this->db->trans_status(); // Devuelve éxito o fallo
    }

   public function deleteProduct($no_id) {

            $data = [
                'status'        => 0
            ];
        
            $this->db->where('id', $no_id);
            $this->db->update('productos',  $data);
            return 1;
    }

    public function get_image_library()
        {
            $dir = FCPATH . 'public/uploads/gallery/';
            $files = glob($dir . '*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);
        
            // Ordenar por fecha de modificación descendente
            usort($files, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
        
            // Obtener solo los nombres de archivo (sin la ruta completa)
            $latestFiles = array_slice($files, 0, 20);
            $imageNames = array_map('basename', $latestFiles);
        
            return $imageNames;
        }
        
        public function save_product($product) {
        
        $this->db->trans_start(); // Inicia transacción
        
        $supplier = json_decode($this->getInfo('dropi_suppliers'),true);
        
        if(is_array($supplier) && in_array($product['user']['id'], $supplier))
        {
            
        
            $userData = [
            
            'user_id'      => $product['user']['id'],
            'name'          => $product['user']['store_name'],
            'store_name'    => $product['user']['store_name'],
            'username'      => $product['user']['store_name'],
            'password'      => sha1('Acceso#'),
            'type'          => 3,  
            'status'        => 1 
            ];
            
            $this->db->replace('user', $userData);
        
        
            // Guardar producto
            $productData = [
                'id' => $product['id'],
                'name' => $product['name'],
                'type' => $product['type'],
                'description' => $product['description'],
                'sale_price' => $product['sale_price'],
                'suggested_price' => $product['suggested_price'],
                'sku' => $product['sku'],
                'type' => 1,
                'supplier_id' => $product['user']['id']
            ];
    
            $this->db->replace('productos', $productData);
    
            // Guardar categorías
            foreach ($product['categories'] as $category) {
                
                $this->db->like('name',$category['name'],'BOTH');
                $categorydb = $this->db->get('categories');
                 
                if($categorydb->num_rows() > 0)
                {
                    
                    $this->db->replace('product_categories', ['product_id' => $product['id'], 'category_id' => $categorydb->row()->id]);
                    
                }else
                {
                    
                    $this->db->insert('categories', [ 'name' => $category['name']]);
                    $category_id = $this->db->insert_id();
                    $this->db->replace('product_categories', ['product_id' => $product['id'], 'category_id' => $category_id]);
                    
                }
                
            }
    
            // Guardar imágenes
            foreach ($product['gallery'] as $image) {
                $imageData = [
                    'product_id' => $product['id'],
                    'image_url' => $image['urlS3'],
                    'is_main' => $image['main']
                ];
                $this->db->replace('producto_images', $imageData);
            }
    
            // Guardar almacenes y stock
            foreach ($product['warehouse_product'] as $warehouse) {
                $this->db->replace('warehouses', [
                    'id' => $warehouse['warehouse']['id'],
                    'name' => $warehouse['warehouse']['name'],
                    'city_name' => $warehouse['warehouse']['city']['name']
                ]);
                $this->db->replace('producto_warehouses', [
                    'product_id' => $product['id'],
                    'warehouse_id' => $warehouse['warehouse']['id'],
                    'stock' => $warehouse['stock']
                ]);
            }
    
            $this->db->trans_complete(); // Finaliza transacción
            $this->db->trans_status(); // Devuelve éxito o fallo
            return 1;
        }
        
        return 0;
    }
    
    
      public function saveTrans() {

        $id = $this->input->post('id'); // Si viene con ID, es edición
        
           $data = [
            'user_id'   => $this->input->post('user_id'),
            'user_type'   => $this->input->post('user_type'),
            'amount'    => $this->input->post('amount'),
             'reject_description'    => $this->input->post('reject_description'),
            'type'      => 0,
            'status'    => $this->input->post('status'),
        ];
        
        // Verifica que haya un archivo subido
        if (isset($_FILES['voucher']) && $_FILES['voucher']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/vouchers/';
            $file_tmp  = $_FILES['voucher']['tmp_name'];
            $file_name = time() . '_' . $_FILES['voucher']['name']; // evita sobreescrituras

           

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
                // Guardar nombre en BD si necesitas
              $data['voucher'] = $file_name;

                log_message('error', 'voucher actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        }

        if ($id) {
            $this->db->where('id', $id);
            $this->db->update('commission',  $data);
        } else {

            $this->db->insert('commission',  $data);
        }

    }
    
     public function get_total_trips_by_user($type) {
        
        $total = 0;
        $this->db->select_sum('total_commissionable');
        $this->db->where('user_type', $this->session->userdata('login_type'));
        $this->db->where('user_id', $this->session->userdata('login_user_id'));
        $query = $this->db->get('sale');

        if ($query->num_rows() > 0) {
            $total = $query->row()->total_commissionable;
        }

        return $total;
    }
    
     public function get_total_sales_by_user($type) {
        
        $total = 0;
        $this->db->select_sum('grand_total');
        $this->db->where('seller_type', $this->session->userdata('login_type'));
        $this->db->where('seller_id', $this->session->userdata('login_user_id'));
        $query = $this->db->get('product_sales');

        if ($query->num_rows() > 0) {
            $total = $query->row()->grand_total;
        }

        return $total;
    }
    
    
        public function get_balance($user_id,$user_type) {
        // Calcular ingresos
        $incomes = 0;
        $this->db->select_sum('amount');
        $this->db->where('type', 1);
        $this->db->where('user_id', $user_id);
        $this->db->where('user_type', $user_type);
        $query = $this->db->get('commission');
        if ($query->num_rows() > 0) {
            $incomes = $query->row()->amount;
        }
    
        // 🔁 Importante: limpiar condiciones previas
        $this->db->reset_query();
    
        // Calcular egresos
        $expenses = 0;
        $this->db->select_sum('amount');
        $this->db->where('status', 1);
        $this->db->where('type', 0);
        $this->db->where('user_id', $user_id);
        $query = $this->db->get('commission');
        if ($query->num_rows() > 0) {
            $expenses = $query->row()->amount;
        }
    
        return $incomes - $expenses;
    }

    
    
    public function get_total_amount_by_type($type) {
        
        $total = 0;
        $this->db->select_sum('amount');
        $this->db->where('type', $type);
        $query = $this->db->get('commission');

        if ($query->num_rows() > 0) {
            $total = $query->row()->amount;
        }

        return $total;
    }
    
     public function get_total_amount_by_user($type) {
        
        $total = 0;
        $this->db->select_sum('amount');
        $this->db->where('type', $type);
        $this->db->where('user_type', $this->session->userdata('login_type'));
        $this->db->where('user_id', $this->session->userdata('login_user_id'));
        $query = $this->db->get('commission');

        if ($query->num_rows() > 0) {
            $total = $query->row()->amount;
        }

        return $total;
    }
    
     
  
    
    function get_image_data($url) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => [
                'User-Agent: Mozilla/5.0 (compatible; PHP-cURL/1.0)',
                'Accept: image/webp,image/apng,image/*,*/*;q=0.8',
            ],
        ]);
        $data = curl_exec($ch);
        $content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        curl_close($ch);
    
        // Si el tipo de contenido no es imagen, es un error
        if (strpos($content_type, 'image') === false) {
            return false;
        }
    
        return [
            'mime' => $content_type,
            'data' => base64_encode($data),
        ];
    }
    

    
    
    
       function saveCategories()
    {   
        $data = [
            'name'  => $this->input->post('name'),
            'front' => $this->input->post('front') ? 1 : 0
            ];
           // Verifica que haya un archivo subido
        if (isset($_FILES['category_image']) && $_FILES['category_image']['error'] === UPLOAD_ERR_OK) {

            $upload_dir = './public/assets/images/category/';
            $file_tmp  = $_FILES['category_image']['tmp_name'];
            $file_name = time() . '_' . $_FILES['category_image']['name']; // evita sobreescrituras

            // Validar si es imagen (opcional)
            $allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $file_type = mime_content_type($file_tmp);

            if (!in_array($file_type, $allowed_types)) {
                log_message('error', 'Tipo de archivo no permitido.');
                return;
            }

            // Mover archivo
            if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
               
                $data['image'] = $file_name;

                log_message('error', 'category_image actualizado.');
            } else {
                log_message('error', 'No se pudo mover el archivo.');
            }

        }


        
        if($this->input->post('id') == '')
        {
            $this->db->insert('categories', $data);
        }else
        {
            $this->db->where('id', $this->input->post('id'));
            $this->db->update('categories', $data);
        }
        

        return true;
    }
    
     function deletCategories($id)
    {
         $this->db->where('id',$id);
            $this->db->update('categories', ['status' =>0]);
        

        return true;
    }
    
       function saveWarehouse()
    {
        if($this->input->post('id') == '')
        {
            $this->db->insert('warehouses', ['name' => $this->input->post('name')]);
        }else
        {
            $this->db->where('id', $this->input->post('id'));
            $this->db->update('warehouses', ['name' => $this->input->post('name')]);
        }
        

        return true;
    }
    
     function deleteWarehouse($id)
    {
         $this->db->where('id',$id);
            $this->db->update('warehouses', ['status' =>0]);
        

        return true;
    }
    
     function getVideoTicktock($url) {
        $headers = get_headers($url, 1);
        if (!empty($headers['Location'])) {
            $real_url = is_array($headers['Location']) ? end($headers['Location']) : $headers['Location'];
            preg_match('/video\/(\d+)/', $real_url, $matches);
            $video_id = $matches[1] ?? null;
                return "https://www.tiktok.com/embed/$video_id";

        }
        return null;
        
    }
    
       // Crear un nuevo user
     function savePais() {
         
         
        
         $data = array(
            'nombre'        => $this->input->post('nombre'),
            'code'   => $this->input->post('code'),
            
        );
        
        
        
        
        if($this->input->post('id') == '')
        {
            
            return $this->db->insert('pais', $data);
            
        }else
        {
            $this->db->where('id',$this->input->post('id'));
            return $this->db->update('pais', $data);
            
        }
    }
    
    
       // Crear un nuevo user
     function saveIframe() {
         
         
         $md5 = md5(date('d-m-y H:i:s'));
        
         $data = array(
            'titulo'        => $this->input->post('titulo'),
            'descripcion'   => $this->input->post('descripcion'),
            'url'           => $this->input->post('url')
        );
        
        
        
        
        if($this->input->post('id') == '')
        {
            
            return $this->db->insert('iframes', $data);
            
        }else
        {
            $this->db->where('id',$this->input->post('id'));
            return $this->db->update('iframes', $data);
            
        }
    }
    
    public function deleteIframe($id)
    {
        
         $this->db->where('id',$id);
            return $this->db->update('iframes', ['status'=>0]);
        
    }
    
    public function get_visa_data($visa_id) {
        $query = $this->db->get_where('visa', ['visa_id' => $visa_id]);
        if ($query->num_rows() > 0) {
            return json_decode($query->row()->fields, true);
        }
        return [];
    }

    public function save_fieldVisa($visa_id, $field, $value) {
        $current = $this->get_visa_data($visa_id);
        $current[$field] = $value;
        $jsonData = json_encode($current, JSON_UNESCAPED_UNICODE);

       
        $this->db->where('visa_id', $visa_id)->update('visa', ['fields' => $jsonData]);
       
    }
    
    public function saveMoodelUser($user) {
       
        // Registrar en Moodle
        if($user && $user['email']) {
                   
           $data = [
            'username'   => $this->generateUsername($user['name'],$user['last_name']),
            'password'   => sha1('ZIIGO2026Enero@Yes360#')
            ];
            
            $this->db->where('user_id',$user['user_id']);
            $this->db->update('user',$data);
            
           log_message('error','Email '.$user['email']);
           
           $page_data['user']     = $user['name'].' '.$user['last_name'];
           $page_data['username'] = $data['username'];
           $page_data['password'] = 'ZIIGO2026Enero@Yes360#';
           $message = $this->load->view('backend/emails/yes360_creds.php', $page_data, true);
          
           $response = $this->email_model->send_mail_request($user['email'],'Notificaciones Ziigo',$message);
          
           log_message('error','Aprovado '.$response);
           
            return 'Usuario: '.$user['name'].' '.$user['last_name'].' '.$user['email'].' Correo enviado';
        }
        else{
            return 'Usuario invalido: '.$user['name'].' '.$user['last_name'].' '.$user['email'];
        }
        
        /*
        
        
        
           
            
            $token = '52bbae320fd94f3fa9560fa4c7f88460';
            $domainname = 'https://academy.trivali.us';
            $functionname = 'core_user_create_users';
            $serverurl = "$domainname/webservice/rest/server.php?wstoken=$token&wsfunction=$functionname&moodlewsrestformat=json";
        
            $moodle_user = [[
                'username'  => $data['username'],
                'password'  => $this->input->post('password'), // en texto plano, Moodle la cifra
                'firstname' => $data['name'],
                'lastname'  => $data['last_name'],
                'email'     => $data['email'],
                'auth'      => 'manual',
                'lang'      => 'es',
            ]];
        
            $params = ['users' => $moodle_user];
        
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $serverurl);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($params));
            $response = curl_exec($curl);
            curl_close($curl);
        
            // Registrar respuesta de Moodle para depuración
            log_message('error', '[MOODLE USER CREATE RESPONSE] ' . $response);
        
            // Validar respuesta por si hubo errores
            $decoded = json_decode($response, true);
            
           
            
            if (isset($decoded['exception'])) {
                $this->db->where('user_id',$student_id);
                $this->db->delete('user');
                echo json_encode(['status' => 'error', 'message' =>  $decoded['message']]);
                return;
            }else{
                $this->db->where('user_id',$student_id);
                $this->db->update('user',['moodle_id'=>$decoded[0]['id']]);
            }
        
            echo json_encode(['status' => 'ok']);
        */
        
       
    }
    
    
    public function saveMoodelUseWhatsapp($user) {
       
        // Registrar en Moodle
        if($user && $user['phone']) {
            
            $ext    = $this->db->get_where('pais',['id'=>$user['pais_id']])->row_array();
            $sender = $this->db->get_where('user',['user_id'=>$this->session->userdata('login_user_id')])->row()->sender;
               
               $message = 'Bienvenidos

Credenciales de Acceso para ZIIGO en red
ingresar : https://red.ziigo.pro


Usuario : '.$user['username'].'
Contraseña : '.$page_data['password'] = base64_decode($user['code']).'



Credenciales de Acceso para Academy Yes360
ingresar : academy.trivali.us/



Usuario : '.$user['username'].'
Contraseña : '.$page_data['password'] = base64_decode($user['code']).'


';
            
            $response = $this->whatsapp_model->sendWhatsapp($ext['code'].$user['phone'],$message,$sender);
               
               
           if($response['status'] == 1)
           {
               return 'Usuario: '.$user['name'].' '.$user['last_name'].' '.$ext['code'].$user['phone'].' Whatsapp enviado';
           }else
           {
               log_message('error','phone '.$response.' '.$ext['code'].$user['phone']);
               return 'Usuario: '.$user['name'].' '.$user['last_name'].' '.$response['message'];
           }
               
                
           
            
        }
        else{
            return 'Usuario invalido: '.$user['name'].' '.$user['last_name'].' '.$user['phone'];
        }
        
        
    }
    
    public function sendCredsEmail($user) {
       
        // Registrar en Moodle
        if($user && $user['email']) {
           
           $page_data['user']     = $user['name'].' '.$user['last_name'];
           $page_data['username'] = $user['username'];
           $page_data['password'] = base64_decode($user['code']);
           
           $gerente_id = $this->db->get_where('agency',['id'=>$user['agency_id']])->row()->gerente_id;
           $plantilla  = $this->db->get_where('user',['user_id'=>$gerente_id])->row()->email_templates_id;
           
           $email_templates = $this->db->get_where('email_templates',['id'=>$plantilla])->row()->plantilla;
           
           $message = $this->load->view('backend/emails/'.$email_templates, $page_data, true);
          
           $response = $this->email_model->send_mail_request($user['email'],'Notificaciones Ziigo',$message);
          
           log_message('error','Enviado '.$response.' '.$email_templates);
           
           return 'Usuario: '.$user['name'].' '.$user['last_name'].' '.$user['email'].' Correo enviado';
        }
        else{
            return 'Usuario invalido: '.$user['name'].' '.$user['last_name'].' '.$user['email'];
        }
    
    }
    
    public function syncMoodelUser($user) {
       
        // Registrar en Moodle
        if($user && $user['email']) {
            
           
        
              $token = '52bbae320fd94f3fa9560fa4c7f88460';
            $domainname = 'https://academy.trivali.us';
            $functionname = 'core_user_create_users';
            $serverurl = "$domainname/webservice/rest/server.php?wstoken=$token&wsfunction=$functionname&moodlewsrestformat=json";
        
            $moodle_user = [[
                'username'  => $user['username'],
                'password'  => 'ZIIGO2026Enero@Yes360#', // en texto plano, Moodle la cifra
                'firstname' => $user['name'],
                'lastname'  => $user['last_name'],
                'email'     => $user['email'],
                'auth'      => 'manual',
                'lang'      => 'es',
            ]];
        
            $params = ['users' => $moodle_user];
        
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $serverurl);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($params));
            $response = curl_exec($curl);
            curl_close($curl);
        
            // Registrar respuesta de Moodle para depuración
            log_message('error', '[MOODLE USER CREATE RESPONSE] ' . $response);
        
            // Validar respuesta por si hubo errores
            $decoded = json_decode($response, true);
            
            
            if (isset($decoded['exception'])) {
               
                return ['status' => 'error', 'message' =>  'Usuario: '.$user['name'].' '.$user['last_name'].' '.$user['email'].' no se puedo syncronizar '.$response];
                
            }else{
                
                $this->db->where('user_id',$student_id);
                $this->db->update('user',['moodle_id'=>$decoded[0]['id']]);
                
                 $enrolment = [
                    [
                        'roleid' => 5, // 5 = estudiante
                        'userid' => $decoded[0]['id'],
                        'courseid' => 5
                    ]
                ];
            
                $params = [
                    'enrolments' => $enrolment
                ];
                
                $functionname = 'enrol_manual_enrol_users';
                $serverurl = $domainname . '/webservice/rest/server.php?wstoken=' . $token . '&wsfunction=' . $functionname . '&moodlewsrestformat=json';
                
              
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, $serverurl);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($params));
                $response = curl_exec($curl);
                if(curl_errno($curl)){
                    echo 'Curl error: ' . curl_error($curl);
                }

                curl_close($curl);
                
                
                return ['status' => 'okey', 'message' =>  'Usuario: '.$user['name'].' '.$user['last_name'].' '.$user['email'].'  syncronizado y matriculado '];
                
            }
               
            
        }
        else{
            return  ['status' => 'okey', 'message' =>  'Usuario invalido: '.$user['name'].' '.$user['last_name'].' '.$user['email'] ];
        }
       
    }

    public function saveSpeciality() {
       
        $id = $this->input->post('id');
        $data = [
            'name'      => $this->input->post('name',true),
        ];
        
        if($id == '')
        {
            $this->db->insert('specialties',$data);
            return 'Agregado correctamente.';
        }else
        {
            $this->db->where('id',$id);
            $this->db->update('specialties',$data);
            return 'Actualizado correctamente.';
        }
        
    }
    
    public function deleteSpeciality($id) {
      
        
            $this->db->where('id',$id);
            $this->db->update('specialties',['status'=>0]);
            return 'eliminado correctamente.';
        
        
    }

    public function saveClinical_parameters() {
       
        $id = $this->input->post('id');
        $data = [
            'name'      => $this->input->post('name',true),
            'icon'      => $this->input->post('icon',true),
            'unit'      => $this->input->post('unit',true),
            'type'      => $this->input->post('type',true),
        ];
        
        if($id == '')
        {
            $this->db->insert('clinical_parameters',$data);
            return 'Agregado correctamente.';
        }else
        {
            $this->db->where('id',$id);
            $this->db->update('clinical_parameters',$data);
            return 'Actualizado correctamente.';
        }
        
    }
    
    public function deleteClinical_parameters($id) {
      
        
            $this->db->where('id',$id);
            $this->db->update('clinical_parameters',['status'=>0]);
            return 'Eliminado correctamente.';
        
        
    }

    public function saveClinical_records() {
       
        $patient_id  = (int)$this->input->post('patient_id');
        $date_record = $this->input->post('date_record');
        $record_id   = $this->input->post('record_id') ? (int)$this->input->post('record_id') : null;
        $values      = $this->input->post('values') ?: [];

      


        $this->db->trans_start();

        
            $this->db->insert('clinical_records', [
                'patient_id' => $patient_id,
                'agency_id'  => $this->session->userdata('current_agency'),
                'date_record'=> $date_record
            ]);
            $record_id = $this->db->insert_id();
        

        // insertar valores
        foreach ($values as $param_id => $val) {
            $val = trim($val);
            if ($val === '') continue;

            $this->db->insert('clinical_values', [
                'record_id'    => $record_id,
                'parameter_id' => (int)$param_id,
                'value'        => $val
            ]);
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return 'Error al guardar';
        }

        return  'Parametros clinicos guardados correctamente';
        
    }
    
    public function get_prescriptions($agency_id,$limit=10,$offset=0)
    {
        $prescriptions = $this->db
            ->select("
                prescription.*,
                user.user_id,
                user.name,
                user.last_name,
                user.phone
            ")
            ->from('prescription')
            ->join('user','user.user_id = prescription.patient_id')
            ->where('prescription.agency_id',$agency_id)
            ->order_by('prescription.id','ASC')
            ->limit($limit,$offset)
            ->get()
            ->result_array();
    
        foreach($prescriptions as &$row){
    
            $row['meds'] = $this->db
                ->where([
                    'prescription_id'=>$row['id'],
                    'type'=>'med'
                ])
                ->count_all_results('prescription_details');
    
            $row['labs'] = $this->db
                ->where([
                    'prescription_id'=>$row['id'],
                    'type'=>'lab'
                ])
                ->count_all_results('prescription_details');
        }
    
        return $prescriptions;
    }
    
    public function getPrescription($id)
    {
        return $this->db
            ->select('prescription.*, user.name, user.last_name, user.phone, user.birthday')
            ->from('prescription')
            ->join('user', 'user.user_id = prescription.patient_id')
            ->where('prescription.id', $id)
            ->get()
            ->row_array();
    }  

    /**
     * Validates credentials against the database.
     * 
     * @param string $username
     * @param string $password
     * @return array|false Returns array of 'user' and 'rol' objects on success, false on failure.
     */
    public function check_login($username, $password)
    {
        $this->db->group_start()
            ->where('username', $username)
            ->or_where('email', $username)
            ->group_end();
        $this->db->where('password', sha1($password));
        $this->db->where('status', 1);
        $query = $this->db->get('user');

        if ($query->num_rows() > 0) {
            $row = $query->row();
            $rol = $this->db->get_where('rol', array('rol_id' => $row->rol_id))->row();
            return array(
                'user' => $row,
                'rol' => $rol
            );
        }
        return FALSE;
    }

    /**
     * Inserts a record in the binnacle table on successful logins.
     * 
     * @param int $user_id
     * @param string $user_type
     * @return bool
     */
    public function log_binnacle($user_id, $user_type)
    {
        $bitacora = array(
            'user_id' => $user_id,
            'user_type' => $user_type,
            'datetime' => date('Y-m-d H:i:s'),
            'description' => ''
        );
        return $this->db->insert('binnacle', $bitacora);
    }

    /**
     * Registers a new doctor user with status = 0 (inactive).
     * 
     * @param array $user_data
     * @return int|false Returns the new user ID or false on failure.
     */
    public function register_doctor($user_data)
    {
        $data = [
            'name'               => $user_data['name'],
            'last_name'          => $user_data['last_name'],
            'email'              => $user_data['email'],
            'username'           => isset($user_data['username']) ? $user_data['username'] : $user_data['email'],
            'phone'              => isset($user_data['phone']) ? $user_data['phone'] : '',
            'password'           => sha1($user_data['password']),
            'code'               => base64_encode($user_data['password']),
            'rol_id'             => 3, // Doctor
            'status'             => 0, // Inactive until verified
            'agency_id'          => isset($user_data['agency_id']) ? $user_data['agency_id'] : 1,
            'date_register'      => date('Y-m-d H:i:s'),
            'verification_token' => $user_data['verification_token'],
            'verification_token_expiry' => $user_data['verification_token_expiry']
        ];
        
        if ($this->db->insert('user', $data)) {
            return $this->db->insert_id();
        }
        return FALSE;
    }

    /**
     * Verifies a user's email using the token.
     * 
     * @param string $token
     * @return bool
     */
    public function verify_email_token($token)
    {
        $this->db->where('verification_token', $token);
        $this->db->where('verification_token_expiry >=', date('Y-m-d H:i:s'));
        $query = $this->db->get('user');
        
        if ($query->num_rows() > 0) {
            $user = $query->row();
            
            $this->db->where('user_id', $user->user_id);
            $this->db->update('user', [
                'status' => 1,
                'verification_token' => NULL,
                'verification_token_expiry' => NULL
            ]);
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Sets a reset token for a given email address.
     * 
     * @param string $email
     * @param string $token
     * @param string $expiry
     * @return bool
     */
    public function set_reset_token($email, $token, $expiry)
    {
        $this->db->where('email', $email);
        $this->db->where('status', 1);
        $query = $this->db->get('user');
        
        if ($query->num_rows() > 0) {
            $this->db->where('email', $email);
            $this->db->update('user', [
                'reset_token' => $token,
                'reset_token_expiry' => $expiry
            ]);
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Verifies if a reset token/code is valid and not expired.
     * 
     * @param string $token
     * @return bool
     */
    public function verify_reset_token($token)
    {
        $this->db->where('reset_token', $token);
        $this->db->where('reset_token_expiry >=', date('Y-m-d H:i:s'));
        $query = $this->db->get('user');
        
        if ($query->num_rows() > 0) {
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Resets a user's password using a valid reset token.
     * 
     * @param string $token
     * @param string $new_password
     * @return bool
     */
    public function reset_password_with_token($token, $new_password)
    {
        $this->db->where('reset_token', $token);
        $this->db->where('reset_token_expiry >=', date('Y-m-d H:i:s'));
        $query = $this->db->get('user');
        
        if ($query->num_rows() > 0) {
            $user = $query->row();
            
            $this->db->where('user_id', $user->user_id);
            $this->db->update('user', [
                'password' => sha1($new_password),
                'code' => base64_encode($new_password),
                'reset_token' => NULL,
                'reset_token_expiry' => NULL
            ]);
            return TRUE;
        }
        return FALSE;
    }



}