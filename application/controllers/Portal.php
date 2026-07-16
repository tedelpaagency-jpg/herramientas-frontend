<?php 
    if(!defined('BASEPATH')) exit('No direct script access allowed');
    
    class Portal extends CI_Controller
    {
        /* Constructor de Admin.php */
        function __construct()
        {
            parent::__construct();
            $this->load->database();
            $this->load->library('user_agent');
            $this->load->library('session');
            
        }
        
        
        public function index()
        {
            $this->is_login();
            redirect(base_url() . 'portal/feed/', 'refresh');

        }
        
         /* Función feed principal validar el login */
        function is_login()
        {
            if ($this->session->userdata('user_login') != 1)
            {
                redirect(base_url(), 'refresh');
            }
        }
        
         /* Función feed principal las noticias */
        function feed($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'crear_post')
            {
                $response = $this->crud_model->crear_post();
                
                $this->session->set_flashdata($response['status'],$response['message']);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete_post')
            {
                $response = $this->crud_model->delete_post(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'load_more_posts')
            {
                // Opcional: permitir solo AJAX
               
            
                $offset = intval($this->input->post('offset'));
            
                $posts = $this->db
                    ->order_by('id','DESC')
                    ->where(['status' => 1, 'type' => 'post'])
                    ->limit(3, $offset)
                    ->get('notice')
                    ->result_array();
            
                $html = $this->load->view('backend/'.$this->session->userdata('login_type').'/'.'posts_chunk.php', ['notices' => $posts], TRUE);
            
                // Respuesta limpia JSON
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['success' => true, 'html' => $html]);
                exit; // asegura que no se añada nada más
               
            }
           
            $page_data['page_name']  = 'feed';
            $page_data['page_title'] = "Panel principal";
            $this->load->view('backend/index', $page_data);
        }

        
        function agencies($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveAgency')
            {
                $response = $this->crud_model->saveAgency();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'deleteAgency')
            {
                $response = $this->crud_model->deleteAgency(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'updateTheme')
            {
                $response = $this->crud_model->updateTheme();
                exit();
            }
           
            $page_data['page_name']  = 'agencies';
            $page_data['page_title'] = "Agencias";
            $this->load->view('backend/index', $page_data);
        } 
        
        function agency_profile($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            $page_data['id']  = base64_decode($param1);
            $page_data['page_name']  = 'agency_profile';
            $page_data['page_title'] = "Perfil de Agencia";
            $this->load->view('backend/index', $page_data);
        } 
        
        
        /* Función llamar los usuarios*/
        function users($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'save')
            {
                $response = $this->crud_model->saveUser();
                $this->session->set_flashdata('success','Registrado.');
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode($response);
                exit;
            }
            
            if($param1 == 'update_notes')
            {
                $this->crud_model->user_update_notes($param2);
                $this->session->set_flashdata('success','Notas actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete')
            {
                $this->crud_model->user_delete(base64_decode($param2));
                $this->session->set_flashdata('success','Usuario eliminado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'desactivate')
            {
                $this->crud_model->user_desactivate($param2);
                $this->session->set_flashdata('success','Usuario activo');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'reactivate')
            {
                $this->crud_model->user_reactivate($param2);
                $this->session->set_flashdata('success','Usuario activo');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'upgrade')
            {
                $this->crud_model->usertoadmin($param2);
                $this->session->set_flashdata('success','Usuario promovido');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'sendCreds')
            {
                $user = $this->db->get_where('user',['user_id'=>base64_decode($param2)])->row_array();
                $response = $this->crud_model->saveMoodelUseWhatsapp($user);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'sendCredsEmail')
            {
                $user = $this->db->get_where('user',['user_id'=>base64_decode($param2)])->row_array();
                $response = $this->crud_model->sendCredsEmail($user);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['rol_id']     = base64_decode($param1);
            $page_data['page_name']  = 'users';
            $page_data['page_title'] = "Usuarios";
            $this->load->view('backend/index', $page_data);
        }

        public function user_profile($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            $page_data['user_id']       = base64_decode($param1);
            $page_data['page_name']     = 'user_profile';
            $page_data['page_title']    = "Perfil de usuario";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function my_profile($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            $page_data['user_id']       = $this->session->userdata('login_user_id');
            $page_data['page_name']     = 'user_profile';
            $page_data['page_title']    = "Perfil de usuario";
            $this->load->view('backend/index', $page_data);
    
        }
        
        // Controlador
        public function obtener_cursos_usuario($user_id,$user_type) {
            $subquery = $this->db
                ->select('iframe_id')
                ->from('user_iframes')
                ->where('user_id', $user_id)
                ->where('user_type', $user_type)
                ->where('status', 1)
                ->get_compiled_select();
        
            $this->db->select('iframes.id, iframes.titulo');
            $this->db->select("IF(iframes.id IN ($subquery), 1, 0) as seleccionado", FALSE);
            $this->db->where('status', 1);
            $this->db->from('iframes');
            
            $result = $this->db->get()->result();
            
            header('Content-Type: application/json');
            echo json_encode($result);
        }

        public function guardar_cursos_usuario() {
            $user_id    = $this->input->post('user_id');
            $user_type  = $this->input->post('user_type');
            $cursos     = $this->input->post('iframes'); // array de IDs
        
            // Borra los anteriores
            $this->db->where('user_id', $user_id)->where('user_type', $user_type)->delete('user_iframes');
        
            // Inserta los nuevos
            if (!empty($cursos)) {
                foreach ($cursos as $iframe_id) {
                    $this->db->insert('user_iframes', [
                        'user_type'     => $user_type,
                        'user_id'       => $user_id,
                        'iframe_id'     => $iframe_id
                    ]);
                }
            }
        
            $this->session->set_flashdata('success','Cursos actualizados');
            redirect($this->agent->referrer(),'refresh');
        }
        
          
        function pais($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'save')
            {
                $sale_id = $this->crud_model->savePais();
                $this->session->set_flashdata('success','Pais guardado.');
                redirect($this->agent->referrer(),'refresh');
            }
            
            
        }
        
        function iframes($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'saveIframe')
            {
                $sale_id = $this->crud_model->saveIframe();
                $this->session->set_flashdata('success','Iframe guardado.');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'deleteIframe')
            {
                $sale_id = $this->crud_model->deleteIframe($param2);
                $this->session->set_flashdata('success','Iframe eliminado.');
                redirect($this->agent->referrer(),'refresh');
            }
            
        }
        
    function pos($param1 = '', $param2 = '') 
    {
        $this->is_login();
        $limit = 40;
        $page = $this->input->get('page');
        $offset = ($page) ? ($page - 1) * $limit : 0;
    
        // Recoger filtros
        $supplier_id = $this->input->get('supplier');
        $company_id = $this->input->get('company');
        $exclude_category_id = $this->input->get('category'); // se excluyen productos con esta categoría
        $search = $this->input->get('search');
        $price_min = $this->input->get('price_min');
        $price_max = $this->input->get('price_max');
    
        // ===================
        // Subconsulta para conteo
        // ===================
        $this->db->from('productos p');
        $this->db->where('p.status', 1);
        $this->db->where('p.pais_id', $this->session->userdata('current_c'));
        
        
        if ($supplier_id) {
           
            $this->db->where('p.supplier_id', $supplier_id);
        }
        
        if ($company_id) {
            $this->db->join('producto_warehouses pw', 'p.id = pw.product_id', 'left');
            $this->db->where('pw.warehouse_id', $company_id);
        }
        
        
        if ($company_id) {
            $this->db->join('producto_warehouses pw', 'p.id = pw.product_id', 'left');
            $this->db->where('pw.warehouse_id', $company_id);
        }
    
        if ($exclude_category_id) {
            $this->db->join('product_categories pc', 'p.id = pc.product_id', 'left');
            $this->db->where('pc.category_id', $exclude_category_id); // excluir
        }
    
        if ($search) {
            $this->db->like('p.name', $search);
        }
    
        if ($price_min !== null && $price_min !== '') {
            $this->db->where('p.price >=', floatval($price_min));
        }
    
        if ($price_max !== null && $price_max !== '') {
            $this->db->where('p.price <=', floatval($price_max));
        }
    
        $this->db->select('p.id');
        $this->db->group_by('p.id');
        $subquery = $this->db->get_compiled_select(); // arma la subconsulta
    
        // Ejecutar COUNT(*) sobre subconsulta
        $this->db->reset_query();
        $this->db->from("($subquery) as counted");
        $total_rows = $this->db->count_all_results();
    
        // ===================
        // Consulta de productos (paginada)
        // ===================
        $this->db->from('productos p');
        $this->db->where('p.status', 1);
        $this->db->where('p.pais_id', $this->session->userdata('current_country'));
            
        if ($supplier_id) {
           
            $this->db->where('p.supplier_id', $supplier_id);
        }
    
        if ($company_id) {
            $this->db->join('producto_warehouses pw', 'p.id = pw.product_id', 'left');
            $this->db->where('pw.warehouse_id', $company_id);
        }
    
        if ($exclude_category_id) {
            $this->db->join('product_categories pc', 'p.id = pc.product_id', 'left');
            $this->db->where('pc.category_id', $exclude_category_id); // excluir
        }
    
        if ($search) {
            $this->db->like('p.name', $search);
        }
    
        if ($price_min !== null && $price_min !== '') {
            $this->db->where('p.price >=', floatval($price_min));
        }
    
        if ($price_max !== null && $price_max !== '') {
            $this->db->where('p.price <=', floatval($price_max));
        }
    
        $this->db->select('p.*'); // aquí sí puedes usar * porque solo se usa para mostrar
        $this->db->group_by('p.id');
        $this->db->order_by('p.id', 'desc');
        $this->db->limit($limit, $offset);
        $products = $this->db->get()->result_array();
    
        $total_pages = ceil($total_rows / $limit);
    
        // Enviar datos a la vista
        $page_data['products'] = $products;
        $page_data['current_page'] = ($page) ? $page : 1;
        $page_data['total_pages'] = $total_pages;
        $page_data['page_name'] = 'pos';
        $page_data['page_title'] = "Punto de venta";
        $page_data['filters'] = [
            'supplier' => $supplier_id,
            'company' => $company_id,
            'category' => $exclude_category_id,
            'search' => $search,
            'price_min' => $price_min,
            'price_max' => $price_max
        ];
    
        $this->load->view('backend/index', $page_data);
    }
    
    
      /* Todos los reportes*/
    function product_sales($param1 = '', $param2 = '')
    {
        $this->is_login();
       
        if($param1 == 'store')
        {
           
            $response = $this->crud_model->insert_sale();

            // Insertar en la base de datos
            if ($response) {
                $this->session->set_flashdata('success', 'Venta agregada correctamente.');
            } else {
                $this->session->set_flashdata('success', 'Hubo un problema al agregar la venta.');
            }
    
            redirect($this->agent->referrer(), 'refresh');
            
            
        }
        
          if($param1 == 'store_2')
        {
           
            $response = $this->crud_model->insert_sale2();

            // Insertar en la base de datos
            if ($response) {
                $this->session->set_flashdata('success', 'Venta agregada correctamente.');
            } else {
                $this->session->set_flashdata('success', 'Hubo un problema al agregar la venta.');
            }
            
           header('Content-Type: application/json');
           echo json_encode(['status'=>'success']);
           exit();
            
            
        }
        
        $page_data['status']     = $param1;
        $page_data['page_name']  = 'product_sales';
        $page_data['page_title'] = "Ventas de productos";
        $this->load->view('backend/index', $page_data);
    }
        
    public function lexvault($param1 = '', $param2 = '')
    {

        $this->is_login();

        if ($param1 == 'delete') {
            $data = array(
                'status' => 0
            );
            $this->db->where('lexvault_id', $param2);
            $this->db->update('lexvault', $data);
            $this->session->set_flashdata('success', 'Eliminado');
            redirect(base_url() . 'portal/lexvault', 'refresh');
        }


        if ($param1 == 'add') {
            
            $this->crud_model->add_lexvault();
            $this->session->set_flashdata('success', 'Agregado');
            redirect(base_url() . 'portal/lexvault', 'refresh');

        }
        
        

        $page_data['page_name'] = 'lexvault';
        $page_data['page_title'] = "Lexvault";
        $this->load->view('backend/index', $page_data);

    }

    public function lexvault_templates($param1 = '', $param2 = '')
    {

        $this->is_login();

        if ($param1 == 'edit') {
            $data = array(
                'name' => $this->input->post('name'),
                'description' => $this->input->post('description'),
                'is_public'                  => $this->input->post('is_public') == 1 ? 1 : 0,
            );

            $this->db->where('lexvault_template_id', base64_decode($param2));
            $this->db->update('lexvault_template', $data);
            $this->session->set_flashdata('success', 'Actualizado');
            $refer = $this->agent->referrer();
            redirect($refer, 'refresh');
        }


        if ($param1 == 'add') {
            $data = array(
                'name'          => $this->input->post('name'),
                'description'   => $this->input->post('description'),
                'agency_id'     => $this->session->userdata('current_agency')
            );

            $this->db->insert('lexvault_template', $data);
            $lexvault_template_id = $this->db->insert_id();
            $this->session->set_flashdata('success', 'Agregado');
            redirect(base_url() . 'portal/lexvault_template_edit/' . base64_encode($lexvault_template_id), 'refresh');
        }


        if ($param1 == 'delete') {
            $data = array(
                'status' => 0
            );
            $this->db->where('lexvault_template_id', base64_decode($param2));
            $this->db->update('lexvault_template', $data);
            $this->session->set_flashdata('success', 'Agregado');
            $refer = $this->agent->referrer();
            redirect($refer, 'refresh');

        }


        $page_data['page_name'] = 'lexvault_templates';
        $page_data['page_title'] = "Lexvault";
        $this->load->view('backend/index', $page_data);

    }

    public function lexvault_edit($param1 = '', $param2 = '')
    {
        $this->is_login();

        if ($param1 == 'save_content') {
            $data = array(
                'content' => $this->input->post('content'),
            );

            log_message('error', ' lexvault_id ' . $this->input->post('lexvault_id'));
            $this->db->where('lexvault_id', $this->input->post('lexvault_id'));
            $this->db->update('lexvault', $data);
            exit();

        }


        if ($param1 == 'downloadWord') {

                $this->db->where('lexvault_id', $param2);
                $lexvault = $this->db->get('lexvault')->row();
                $html = $lexvault->content;
                $name = $lexvault->name;
    
    
                log_message('error', $html);
                $fields = json_decode($lexvault->fields, true);
                $claves = array_keys($fields);
                $nclaves = array();
                foreach ($claves as $clave) {
                    array_push($nclaves, '[' . str_replace('_', ' ', $clave) . ']');
                }
                $values = array_values($fields);
                $html = str_replace($nclaves, $values, $html);
    
    
                $this->load->library('word_generator');
                $wordGenerator = new Word_generator();
    
                $html = explode('<br>', $html);
                $html2 = '';
    
    
                for ($i = 0; $i < count($html); $i++) {
                    # code...
                    if ($html[$i] == '') {
                        $html2 .= $html[$i] . '<p></p>';
                    } else {
                        $html2 .= $html[$i] . '<br/>';
                    }
    
                }
    
                $result = $wordGenerator->HtmltoWord($html2, $name . '.docx');
    
            }
    
    
            if ($param1 == 'downloadPDF') {
    
                $this->db->where('lexvault_id', $param2);
                $lexvault = $this->db->get('lexvault')->row();
                $html = $lexvault->content;
                $name = $lexvault->name;
    
                $fields = json_decode($lexvault->fields, true);
                $claves = array_keys($fields);
                $nclaves = array();
                foreach ($claves as $clave) {
                    array_push($nclaves, '[' . str_replace('_', ' ', $clave) . ']');
                }
                $values = array_values($fields);
                $html = str_replace($nclaves, $values, $html);
    
                $sheet_docs = $this->db->get_where('settings', array('type' => 'sheet_docs'))->row()->description;
                $sheet_docs_of = $this->db->get_where('settings', array('type' => 'sheet_docs_of'))->row()->description;
                $stylesheet = "<style>
                .sheet {
                    font-family: Arial; 
                    font-size:16px;
                }
        
                        @page {
                               
                                margin :0px;
                                
                            }
                            
                            .sheet ul {
                                display: block;
                                list-style-type: disc;
                                margin-block-start: 1em;
                                margin-block-end: 1em;
                                margin-inline-start: 0px;
                                margin-inline-end: 0px;
                                padding-inline-start: 40px;
                            }
                          
                          
                            .carta {
                            
                                    width: 210mm;
                                    height: 297mm;
                                    padding: 2.5cm 3cm 2.5cm 3cm;
                            }
        
                                
                                                    
                                .oficio {
                                
                                     width: 210mm;
                                    height: 297mm;
                                    padding: 2.5cm 3cm 2.5cm 3cm;
                                }
                                
                         
                                .withBackgroundCarta {
                                  background-image: url('" . base_url() . "public/assets/images/" . $sheet_docs . "');
                                    background-size: contain;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                }
                                
                                .withBackgroundOficio {
                                    background-image: url('" . base_url() . "public/assets/images/" . $sheet_docs_of . "');
                                    background-size: contain;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                }
                                
                                
                                .withOutBackground {
                                    background-image: none;
                                }
                                
                                .sheet div {
                                    margin: 0;
                                    line-height: 18.4px;
                                    word-spacing: -1px;
                                }
                        </style>
                ";
                $this->load->library('M_pdf');
    
                $mpdf = new mPDF('c');
                // Agrega el estilo CSS al documento
                $mpdf->default_available_fonts = ['Arial'];
                $mpdf->WriteHTML($stylesheet, 1);
                $mpdf->WriteHTML($html, 2);
                $mpdf->Output($name . '.pdf', "D");
    
            }
    
    
            if ($param1 == 'printPDF') {
    
                $this->db->where('lexvault_id', $param2);
                $lexvault = $this->db->get('lexvault')->row();
                $html = $lexvault->content;
                $name = $lexvault->name;
    
                $fields = json_decode($lexvault->fields, true);
                $claves = array_keys($fields);
                $nclaves = array();
                foreach ($claves as $clave) {
                    array_push($nclaves, '[' . str_replace('_', ' ', $clave) . ']');
                }
                $values = array_values($fields);
                $html = str_replace($nclaves, $values, $html);
    
                $sheet_docs = $this->db->get_where('settings', array('type' => 'sheet_docs'))->row()->description;
                $sheet_docs_of = $this->db->get_where('settings', array('type' => 'sheet_docs_of'))->row()->description;
                $stylesheet = "<style>
                .sheet {
                    font-family: Arial; 
                }
        
                        @page {
                               
                                margin :0px;
                                
                            }
                            
                            .sheet ul {
                                display: block;
                                list-style-type: disc;
                                margin-block-start: 1em;
                                margin-block-end: 1em;
                                margin-inline-start: 0px;
                                margin-inline-end: 0px;
                                padding-inline-start: 40px;
                            }
                          
                          
                            .carta {
                            
                                    width: 210mm;
                                    height: 297mm;
                                    padding: 2.5cm 3cm 2.5cm 3cm;
                            }
        
                                
                                                    
                                .oficio {
                                
                                  
                                    width: 210mm;
                                    height: 297mm;
                                    padding: 2.5cm 3cm 2.5cm 3cm;
                                }
                                
                         
                                .withBackgroundCarta {
                                  background-image: url('" . base_url() . "public/assets/images/" . $sheet_docs . "');
                                    background-size: contain;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                }
                                
                                .withBackgroundOficio {
                                    background-image: url('" . base_url() . "public/assets/images/" . $sheet_docs_of . "');
                                    background-size: contain;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                }
                                
                                
                                .withOutBackground {
                                    background-image: none;
                                }
                                
                                .sheet div {
                                    margin: 0;
                                    line-height: 18.4px;
                                    word-spacing: -1px;
                                }
                        </style>
                ";
                $this->load->library('M_pdf');
    
                $mpdf = new mPDF('letter');
                // Agrega el estilo CSS al documento
                $mpdf->default_available_fonts = ['Arial'];
                $mpdf->WriteHTML($stylesheet, 1);
                $mpdf->WriteHTML($html, 2);
                $mpdf->Output($name . '.pdf', "I");
    
            }
    
            if ($param1 == 'add_fiels') {
    
                $fields = $this->db->get_where('lexvault', array('lexvault_id' => $param2))->row()->fields;
                log_message('error', is_null($fields));
                if ($fields == '' || $fields == 'null') {
                    log_message('error', ' lexvault_id ' . $param2 . ' campos ' . $fields);
                    $fields = array();
    
                } else {
    
                    $fields = json_decode($fields, true);
                }
    
                array_push($fields, $this->input->post('field'));
    
                $data = array(
                    'fields' => json_encode($fields)
                );
    
    
                $this->db->where('lexvault_id', $param2);
                $this->db->update('lexvault', $data);
    
                $cont = 0;
                $field_list = ' <ul id="todo-list fields_list">';
    
                foreach ($fields as $field):
                    $field_list .= '<li class="task m-b-10">
                                <span class="task-label ">[' . $field . ']</span><span class="task-action-btn" style="color: red;margin-left: 10px;"><span class="action-box large delete-btn" title="Delete Task" onclick="deleteField(\'' . $cont++ . '\')"><i class="icon"><i class="ti ti-trash"></i></i></span></span>
                            </li>';
                endforeach;
    
                $field_list .= ' </ul>';
                echo $field_list;
                exit();
    
            }
    
            if ($param1 == 'save_fiels') {
    
                log_message('error', json_encode($this->input->post()));
                $miArray = $this->input->post();
                foreach ($miArray as $clave => $valor) {
                    if ($clave === 0) {
                        unset($miArray[$clave]);
                    }
                }
    
                $data = array(
                    'fields' => json_encode($miArray),
                );
    
                $this->db->where('lexvault_id', $param2);
                $this->db->update('lexvault', $data);
    
                exit();
    
            }
    
            if ($param1 == 'delete_field') {
    
                $fields = $this->db->get_where('lexvault', array('lexvault_id' => $param2))->row()->fields;
    
                $fields = json_decode($fields, true);
    
                log_message('error', ' lexvault_id ' . $param2 . ' Campos ' . $fields);
                if (isset($fields[$this->input->post('field')])) {
                    unset($fields[$this->input->post('field')]);
                }
    
                $data = array('fields' => json_encode($fields));
    
    
                $this->db->where('lexvault_id', $param2);
                $this->db->update('lexvault', $data);
    
    
                $field_list = ' <div id="todo-list fields_list">';
    
                foreach ($fields as $key => $field):
                    $field_list .= '<li class="task m-b-10">
                                <span class="task-label ">[' . $field . ']</span><span class="task-action-btn" style="color: red;margin-left: 10px;"><span class="action-box large delete-btn" title="Delete Task" onclick="deleteField(\'' . $key . '\')"><i class="icon"><i class="ti ti-trash"></i></i></span></span>
                            </li>';
                endforeach;
    
                $field_list .= ' </ul>';
                echo $field_list;
                exit();
    
            }
    
            $page_data['lexvault_id'] = base64_decode($param1);
            $page_data['page_name'] = 'lexvault_edit';
            $page_data['page_title'] = "Editar archivos ";
            $this->load->view('backend/index', $page_data);
        }
        
        
    public function lexvault_template_edit($param1 = '', $param2 = '')
    {
        $this->is_login();

        if ($param1 == 'save_content') {
            $data = array(
                'content' => $this->input->post('content'),
            );

            log_message('error', ' lexvault_template_id ' . $this->input->post('lexvault_template_id'));
            $this->db->where('lexvault_template_id', $this->input->post('lexvault_template_id'));
            $this->db->update('lexvault_template', $data);
            exit();

        }
        
        if ($param1 == 'upload_membrete') {
            
            $plantilla_id = $this->input->post('plantilla_id');

            if (empty($_FILES['membrete']['name'])) {
                echo json_encode(['status' => 'error', 'msg' => 'Archivo no enviado']);
                return;
            }
        
            $ext = pathinfo($_FILES['membrete']['name'], PATHINFO_EXTENSION);
            $permitidos = ['jpg','jpeg','png'];
        
            if (!in_array(strtolower($ext), $permitidos)) {
                echo json_encode(['status' => 'error', 'msg' => 'Tipo de archivo no permitido']);
                return;
            }
        
            $nombre = md5(uniqid(time(), true)) . '.' . $ext;
            $ruta   = FCPATH . 'uploads/membretes/';
            $destino = $ruta . $nombre;
        
            if (!is_dir($ruta)) {
                mkdir($ruta, 0777, true);
            }
        
            if (!move_uploaded_file($_FILES['membrete']['tmp_name'], $destino)) {
                echo json_encode(['status' => 'error', 'msg' => 'Error al subir archivo']);
                return;
            }
        
            $file = 'uploads/membretes/' . $nombre;
        
            $this->db->where('lexvault_template_id', $plantilla_id);
            $this->db->update('lexvault_template', ['membrete' => $file]);
        
            echo json_encode([
                'status' => 'ok',
                'url' => base_url($file)
            ]);
            
            exit();

        }
        
        if ($param1 == 'delete_membrete') {
            
            $plantilla_id = $this->input->post('plantilla_id');

            $row = $this->db->select('membrete')
                            ->from('lexvault_template')
                            ->where('lexvault_template_id', $plantilla_id)
                            ->get()->row();

                if ($row && $row->membrete) {
                    $path = FCPATH . $row->membrete;
            
                    if (file_exists($path)) {
                        unlink($path);
                    }
            
                    $this->db->where('lexvault_template_id', $plantilla_id)
                             ->update('lexvault_template', ['membrete' => null]);
                }
            
                echo json_encode(['status' => 'ok']);
            
            exit();

        }


        if ($param1 == 'downloadWord') {

            $this->db->where('lexvault_template_id', $param2);
            $html = $this->db->get('lexvault_template')->row()->content;


            log_message('error', $html);

            $this->load->library('word_generator');
            $wordGenerator = new Word_generator();

            $html = explode('<br>', $html);
            $html2 = '';


            for ($i = 0; $i < count($html); $i++) {
                # code...
                if ($html[$i] == '') {
                    $html2 .= $html[$i] . '<p></p>';
                } else {
                    $html2 .= $html[$i] . '<br/>';
                }

            }

            $result = $wordGenerator->HtmltoWord($html2, 'test.docx');

        }


        if ($param1 == 'downloadPDF') {

            $this->db->where('lexvault_template_id', $param2);
            $lexvault_template = $this->db->get('lexvault_template')->row();
            $html = $lexvault_template->content;
            $name = $lexvault_template->name;

            $test = 'asdfd';

            $html = str_replace(array('[NAME]'), array($test), $html);
            $stylesheet = "<style>
            .sheet {
                font-family: Arial; 
            }
                        .sheet ul {
                            display: block;
                            list-style-type: disc;
                            margin-block-start: 1em;
                            margin-block-end: 1em;
                            margin-inline-start: 0px;
                            margin-inline-end: 0px;
                            padding-inline-start: 40px;
                        }
                        @page {
                            margin :2.5cm 3cm 2.5cm 2.5cm;
                            
                        }
                    </style>
            ";
            $this->load->library('M_pdf');

            $mpdf = new mPDF('c', 'letter');
            // Agrega el estilo CSS al documento
            $mpdf->default_available_fonts = ['Arial'];
            $mpdf->WriteHTML($stylesheet, 1);
            $mpdf->WriteHTML($html, 0);
            $mpdf->Output($name . '.pdf', "I");

        }

        if ($param1 == 'add_fiels') {

            $fields = $this->db->get_where('lexvault_template', array('lexvault_template_id' => $param2))->row()->fields;
            log_message('error', is_null($fields));
            if ($fields == '' || $fields == 'null') {
                log_message('error', ' lexvault_template_id ' . $param2 . ' campos ' . $fields);
                $fields = array();

            } else {

                $fields = json_decode($fields, true);
            }

            array_push($fields, $this->input->post('field'));

            $data = array(
                'fields' => json_encode($fields)
            );


            $this->db->where('lexvault_template_id', $param2);
            $this->db->update('lexvault_template', $data);

            $cont = 0;
            $field_list = ' <ul id="todo-list fields_list">';

            foreach ($fields as $field):
                $field_list .= '<li class="task m-b-10">
                            <span class="task-label ">[' . $field . ']</span><span class="task-action-btn" style="color: red;margin-left: 10px;"><span class="action-box large delete-btn" title="Delete Task" onclick="deleteField(\'' . $cont++ . '\')"><i class="icon"><i class="ti ti-trash"></i></i></span></span>
                        </li>';
            endforeach;

            $field_list .= ' </ul>';
            echo $field_list;
            exit();

        }


        if ($param1 == 'delete_field') {

            $fields = $this->db->get_where('lexvault_template', array('lexvault_template_id' => $param2))->row()->fields;

            $fields = json_decode($fields, true);

            log_message('error', ' lexvault_template_id ' . $param2 . ' Campos ' . $fields);
            if (isset($fields[$this->input->post('field')])) {
                unset($fields[$this->input->post('field')]);
            }

            $data = array('fields' => json_encode($fields));


            $this->db->where('lexvault_template_id', $param2);
            $this->db->update('lexvault_template', $data);


            $field_list = ' <ul id="todo-list fields_list">';

            foreach ($fields as $key => $field):
                $field_list .= '<li class="task m-b-10">
                            <span class="task-label ">[' . $field . ']</span><span class="task-action-btn" style="color: red;margin-left: 10px;"><span class="action-box large delete-btn" title="Delete Task" onclick="deleteField(\'' . $key . '\')"><i class="icon"><i class="ti ti-trash"></i></i></span></span>
                        </li>';
            endforeach;

            $field_list .= ' </ul>';
            echo $field_list;
            exit();

        }

        $page_data['lexvault_template_id'] = base64_decode($param1);
        $page_data['page_name'] = 'lexvault_template_edit';
        $page_data['page_title'] = "Editar archivos ";
        $this->load->view('backend/index', $page_data);
    }
    
     public function visas_ref($param1 = '', $param2 = '')
        {
    
            $this->is_login();
    
    
    
            if ($param1 == 'add') {
    
                $this->crud_model->add_visa_ref();
                $this->session->set_flashdata('success', 'Agregado');
                redirect($this->agent->referrer(), 'refresh');
    
            }


            if ($param1 == 'update') {
    
                $this->crud_model->update_visa_ref($param2);
                $this->session->set_flashdata('success', 'Actualizado');
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            if ($param1 == 'delete') {
    
                $this->crud_model->delete_visa_ref($param2);
                $this->session->set_flashdata('success', 'Eliminado');
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            
            $page_data['page_name'] = 'visas_ref';
            $page_data['page_title'] = "Visas";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function visas($param1 = '', $param2 = '')
        {
    
            $this->is_login();
    
    
    
            if ($param1 == 'add') {
    
                $this->crud_model->add_visa();
                $this->session->set_flashdata('success', 'Agregado');
                redirect($this->agent->referrer(), 'refresh');
    
            }


            if ($param1 == 'update') {
    
                $this->crud_model->update_visa($param2);
                $this->session->set_flashdata('success', 'Actualizado');
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            if ($param1 == 'delete') {
    
                $this->crud_model->delete_visa($param2);
                $this->session->set_flashdata('success', 'Eliminado');
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            $page_data['visa_ref_id'] = base64_decode($param1);
            $page_data['page_name'] = 'visa';
            $page_data['page_title'] = "Visas";
            $this->load->view('backend/index', $page_data);
    
        }
        
        
        function stories($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            
            $page_data['page_name']  = 'stories';
            $page_data['page_title'] = "Stories";
            $this->load->view('backend/index', $page_data);
        }
        
        public function plans($param1 = '', $param2 = '')
        {
    
            $this->is_login();
    
            if ($param1 == 'savePlan') {
                
                $response = $this->crud_model->savePlan($param2);
                $this->session->set_flashdata('success', $response);
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            if ($param1 == 'delete') {
                $data = array(
                    'status' => 0
                );
                $this->db->where('lexvault_id', $param2);
                $this->db->update('lexvault', $data);
                $this->session->set_flashdata('success', 'Eliminado');
                redirect($this->agent->referrer(), 'refresh');
            }
    
            $page_data['page_name'] = 'plans';
            $page_data['page_title'] = "Planes";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function plan_details($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
    
            if ($param1 == 'savePermissions') {
                
                $response = $this->crud_model->savePlan($param2);
                $this->session->set_flashdata('success', $response);
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            $page_data['plan'] = $this->db->get_where('plans',['id'=>$param1])->row_array();

            $page_data['all_permissions'] = $this->db->get('permissions')->result_array();
            $assigned = $this->db->get_where('plan_permissions',['plan_id'=>$param1])->result_array();
    
            $page_data['plan_permissions'] = array_column($assigned, 'permission_id');
        
            $page_data['page_name'] = 'plan_details';
            $page_data['page_title'] = "Planes";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function permissions($param1 = '', $param2 = '') 
        {
            $this->is_login();
            
            if ($param1 == 'savePermissions') {
                
                $response = $this->crud_model->savePermissions($param2);
                $this->session->set_flashdata('success', $response);
                redirect($this->agent->referrer(), 'refresh');
    
            }
            
            if ($param1 == 'delete') {
                
                $this->db->where('id', $param2);
                $this->db->update('permissions', $data);
                $this->session->set_flashdata('success', 'Eliminado');
                redirect($this->agent->referrer(), 'refresh');
            }
            
            $page_data['page_name'] = 'permissions';
            $page_data['page_title'] = "Permisos";
            $this->load->view('backend/index', $page_data);
        }
        
        public function update_permissions($plan_id) 
        {
            $pid = $this->input->post('permission_id');
            $status = $this->input->post('status');
    
            if ($status == 1) {
                $this->db->insert('plan_permissions', [
                    'plan_id'=>$plan_id,
                    'permission_id'=>$pid
                ]);
            } else {
                $this->db->delete('plan_permissions', [
                    'plan_id'=>$plan_id,
                    'permission_id'=>$pid
                ]);
            }
        }
        
         /* Todos los reportes*/
        function travel_sales($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['status']     = $param1;
            $page_data['page_name']  = 'travel_sales';
            $page_data['page_title'] = "Ventas de viajes";
            $this->load->view('backend/index', $page_data);
        }
        
        
        function new_travel_report($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'saveSale')
            {
                $sale_id = $this->crud_model->saveSale();
                $this->session->set_flashdata('success','Venta guardada.');
                redirect(base_url().'portal/new_travel_report/'.base64_encode($sale_id),'refresh');
            }
            
            if($param1 == 'reportSale')
            {
                $sale_id = $this->crud_model->saveSale();
                $this->session->set_flashdata('success','Venta guardada lista para reporte.');
                redirect(base_url().'portal/new_travel_report/'.base64_encode($sale_id),'refresh');
            }
            
            $page_data['page_name']  = 'new_travel_report';
            $page_data['page_title'] = "Nuevo reporte de venta";
            $this->load->view('backend/index', $page_data);
        }
        
         
         /* subir reporte*/
        function travel_report($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveReport')
            {
                $response = $this->crud_model->saveReport();
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode($response);
                exit;
            }
            
            if($param1 == 'uploadFile')
            {
                $this->crud_model->update_sale_recipe($param2);
                $this->session->set_flashdata('success','Comprobante guardado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'downloadRecipe')
            {
                $this->crud_model->download_file('public/assets/sales/recipes/'.base64_decode($param2));
                $this->session->set_flashdata('success','Archivo guardado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'downloadTemplate')
            {
                $this->crud_model->download_file('public/assets/sales/recipes/plantilla_reporte.xlsx');
                $this->session->set_flashdata('success','Archivo guardado');
                redirect($this->agent->referrer(),'refresh');
            }
            
             if($param1 == 'updateName')
            {
                $this->crud_model->update_sale_name();
                echo 'success';
                exit();
            }
            
            if($param1 == 'updatePrincipal')
            {
                $this->crud_model->update_sale_principal();
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['id']          = base64_decode($param1);
            $page_data['page_name']     = 'travel_report';
            $page_data['page_title']    = "Nuevo reporte de viaje";
            $this->load->view('backend/index', $page_data);
        } 
        
        
        
        
        
         /* Detalle de cada ventas*/
        function travel_report_details($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'auth')
            {
                
                $this->crud_model->auth_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta a sido authorizada.');
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            if($param1 == 'reject')
            {
                
                $this->crud_model->reject_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta a sido rechazada.');
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            if($param1 == 'delete')
            {
                
                $this->crud_model->delete_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta eliminada.');
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            if($param1 == 'preauth_sale')
            {
                
                $this->crud_model->preauth_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta pre aprovada.');
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
           
            $page_data['sale_id']  = base64_decode($param1);
            $page_data['page_name']  = 'travel_report_details';
            $page_data['page_title'] = "Detalle de la venta";
            $this->load->view('backend/index', $page_data);
        }
        
        function getGNT()
        {
            $agency = $this->db->get_where('agency',['id'=>$this->session->userdata('current_agency')])->row_array();
            
            $mgt = $this->input->post('mgt');
            
            $taxes      = $mgt * $agency['taxes'];
            $comition   = $mgt * $agency['comition'];
            
            $gnt = $mgt - ($comition + $taxes);
            
            $vf = $gnt - ($gnt * $agency['fact_value']);
            
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['gnt'=>$gnt,'taxes'=>$taxes,'vf'=>$vf]);
            exit;
        }
        
         /* Detalle de cada ventas*/
        function gifts($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveGift')
            {
                
                $this->crud_model->saveGift(base64_decode($param2));
                $this->session->set_flashdata('success','Ruleta asignada.');
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            if($param1 == 'deleteGift')
            {
                
                $response = $this->crud_model->deleteGift(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            $page_data['page_name']  = 'gifts';
            $page_data['page_title'] = "Regalos";
            $this->load->view('backend/index', $page_data);
        }
        
        
         /* Detalle de cada ventas*/
        function rewards($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveReward')
            {
                
                $response = $this->crud_model->saveReward(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                
            }
            
            if($param1 == 'deleteReward')
            {
                
                $response = $this->crud_model->deleteReward(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            
            $page_data['page_name']  = 'rewards';
            $page_data['page_title'] = "Recompenzas";
            $this->load->view('backend/index', $page_data);
        }

        function agency_rewards($param1 = '', $param2 = '', $param3 = '')
        {
            $this->is_login();
            
            if($param1 == 'save')
            {
                $response = $this->crud_model->saveAgencyReward($param2);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete')
            {
                $response = $this->crud_model->deleteAgencyReward(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }

            if($param1 == 'change_points')
            {
                $response = $this->crud_model->changeAgencyPoints();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
        }

        function agency_rewards_requests($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'approve')
            {
                $response = $this->crud_model->approveAgencyRewardRedemption(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'reject')
            {
                $response = $this->crud_model->rejectAgencyRewardRedemption(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['page_name']  = 'agency_rewards_requests';
            $page_data['page_title'] = "Solicitudes de Canje";
            $this->load->view('backend/index', $page_data);
        }


        /* Detalle de cada ventas*/
        function roulettes($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveRoulette')
            {
                
                $response = $this->crud_model->saveRoulette(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            if($param1 == 'deleteRoulette')
            {
                
                $response = $this->crud_model->deleteRoulette(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                 
            }
            
            
            $page_data['page_name']  = 'roulettes';
            $page_data['page_title'] = "Ruletas";
            $this->load->view('backend/index', $page_data);
        }
        
        
         /* Detalle de cada ventas*/
        function getGifts($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            
            $agency_id = $this->session->userdata('current_agency');
        
            $ruleta = $this->db
                ->where('agency_id', $agency_id)
                ->where('status', 1)
                ->get('agency_roulette')
                ->row();
        
            $page_data['premios'] = [];
        
            if ($ruleta) {
                $page_data['premios'] = $this->db
                    ->where('roulette_id', $ruleta->roulette_id)
                    ->get('roulette_rewards')
                    ->result();
                    
                $page_data['page_name']  = 'getGifts';
                $page_data['page_title'] = "Regalos";
                $this->load->view('backend/index', $page_data);
                
            }else
            {
                
                $page_data['page_name']  = 'gifts';
                $page_data['page_title'] = "Regalos";
                $this->load->view('backend/index', $page_data);
                
            }
            
            
    
           
        }
        
        public function girar_ruleta()
        {
            $agency_id = $this->session->userdata('current_agency');
        
            if (!$agency_id) {
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'Agencia no válida'
                ]);
                return;
            }
        
            // 🔹 Obtener ruleta activa de la agencia
            $ruleta = $this->db
                ->where('agency_id', $agency_id)
                ->where('status', 1)
                ->get('agency_roulette')
                ->row();
        
            if (!$ruleta) {
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'No hay ruleta activa'
                ]);
                return;
            }
        
            // 🔹 Obtener premios activos de la ruleta
            $premios = $this->db
                ->where('roulette_id', $ruleta->roulette_id)
                ->get('roulette_rewards')
                ->result();
        
            $total = count($premios);
        
            if ($total === 0) {
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'La ruleta no tiene premios'
                ]);
                return;
            }
        
            /**
             * 🔒 LÓGICA DE SELECCIÓN DEL PREMIO
             * Aquí puedes cambiar por probabilidades, stock, etc.
             */
            // 🔹 1. Calcular peso total
            $pesoTotal = 0;
            foreach ($premios as $p) {
                $pesoTotal += max(0, (float)$p->probability);
            }
        
            if ($pesoTotal <= 0) {
                echo json_encode(['status' => 'error', 'message' => 'Probabilidades inválidas']);
                return;
            }
        
            // 🔹 2. Número aleatorio seguro
            $random = random_int(0, 1000000) / 1000000 * $pesoTotal;
        
            // 🔹 3. Selección ponderada
            $acumulado = 0;
            $indexGanador = 0;
        
            foreach ($premios as $i => $p) {
                $acumulado += max(0, (float)$p->probability);
                if ($random <= $acumulado) {
                    $indexGanador = $i;
                    break;
                }
            }
        
            $premioRuleta = $premios[$indexGanador];
        
            $reward = $this->db
                ->where('id', $premioRuleta->reward_id)
                ->get('rewards')
                ->row();
                
             // 🔹 (Opcional) Registrar el giro
            $this->db->where('id',$ruleta->id);
            $this->db->update('agency_roulette', [
                'status'    => 2,
                'reward'    => $reward->id,
                'winner_at' => date('Y-m-d H:i:s')
            ]);
            
        
            echo json_encode([
                'status'    => 'success',
                'premio_id' => $reward->id,
                'index'     => $indexGanador,
                'total'     => count($premios),
                'nombre'    => $reward->name
            ]);
            
            exit;
        }


        
        
        
        
        /* Detalle de cada ventas*/
        function roulette_rewards($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveRoulette_rewards')
            {
                
                $data = $this->input->post('rewards');

                $this->db->where('roulette_id', $param2)
                         ->delete('roulette_rewards');
            
                if (is_array($data)) {
                    foreach ($data as $reward_id => $row) {
            
                        if (!isset($row['enabled'])) {
                            continue;
                        }
            
                        $this->db->insert('roulette_rewards', [
                            'roulette_id' => $param2,
                            'reward_id'   => $reward_id,
                            'probability' => isset($row['probability']) ? (float)$row['probability'] : 0
                        ]);
                    }
                }
                
                $this->session->set_flashdata('success','Actualizados');
                redirect($this->agent->referrer(),'refresh');
                
            }
            
            
            
            $page_data['roulette'] = $this->db
                ->get_where('roulettes', ['id' => base64_decode($param1)])
                ->row();
        
            $page_data['rewards'] = $this->db
                ->where('status', 1)
                ->get('rewards')
                ->result();
        
            $assigned = [];
            $rows = $this->db
                ->get_where('roulette_rewards', ['roulette_id' => base64_decode($param1)])
                ->result();
        
            foreach ($rows as $r) {
                $assigned[$r->reward_id] = $r->probability;
            }
        
            $page_data['assigned'] = $assigned;
            $page_data['page_name']  = 'roulette_rewards';
            $page_data['page_title'] = "Premios";
            $this->load->view('backend/index', $page_data);
        }
        
        /* Detalle de cada ventas*/
        function hunter($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveRoulette')
            {
                
                $response = $this->crud_model->saveRoulette(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                 
                
            }
            
            if($param1 == 'deleteRoulette')
            {
                
                $response = $this->crud_model->deleteRoulette(base64_decode($param2));
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                 
            }
            
            
            $page_data['page_name']  = 'hunter';
            $page_data['page_title'] = "Tiendas";
            $this->load->view('backend/index', $page_data);
        }
        
        public function hunter_profile($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            $page_data['user_id']       = base64_decode($param1);
            $page_data['page_name']     = 'hunter_profile';
            $page_data['page_title']    = "Perfil de la tienda";
            $this->load->view('backend/index', $page_data);
    
        }
        
        function requests($param1 = '', $param2 = '', $param3 = '')
        {
            $this->is_login();
           
           if($param1 == 'updateRequestInfo')
            {
                $this->crud_model->updateRequestInfo(base64_decode($param2));
                $this->session->set_flashdata('success','Solicitud actualizada');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'updateRequest')
            {
                $this->crud_model->updateRequest(base64_decode($param2),base64_decode($param3));
                $this->session->set_flashdata('success','Solicitud actualizada');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['form_id']       = base64_decode($param1);
            $page_data['page_name']     = 'requests';
            $page_data['page_title']    = "Registros";
            $this->load->view('backend/index', $page_data);
        }
        
        public function campaign($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            if($param1 == 'saveForm')
            {
            
                $response = $this->crud_model->saveForm();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            if($param1 == 'deleteForm')
            {
            
                $this->crud_model->deleteForm(base64_decode($param2));
                $this->session->set_flashdata('success','Campaña eliminada');
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            $page_data['user_id']       = $this->session->userdata('login_user_id');
            $page_data['page_name']     = 'campaign';
            $page_data['page_title']    = "Campañas";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function agency_requests($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            
            if($param1 == 'approve')
            {
            
                $response = $this->crud_model->approveAgencyRequest($param2);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            if($param1 == 'reject')
            {
            
                $response = $this->crud_model->rejectAgencyRequest($param2);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            $page_data['user_id']       = $this->session->userdata('login_user_id');
            $page_data['page_name']     = 'agency_requests';
            $page_data['page_title']    = "Solicitud de Registro";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function w8($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            
            if($param1 == 'save')
            {
            
                $response = $this->crud_model->saveW8($param2);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            if($param1 == 'updateField')
            {
        
                $id    = $this->input->post('id');
                $field = $this->input->post('field');
                $value = $this->input->post('value');
                
                log_message('error', $id.' '.$field.' '.$value);
                
                $this->db->where('id', $id)->update('w8', [
                    $field => $value
                ]);
        
                // validar si está completo
                $required = [
                    'name_line1','address_line1','country',
                    'tax_id','signature','signed_date'
                ];
        
                $this->db->where('id',$id);
                foreach ($required as $r) {
                    $this->db->where("$r IS NOT NULL", null, false);
                    $this->db->where("$r !=", '');
                }
        
                $complete = $this->db->count_all_results('w8') > 0;
        
                $this->db->where('id',$id)->update('w8', [
                    'status' => $complete ? 1 : 0
                ]);
        
                echo json_encode(['status'=>'ok']);
            }
            
            if($param1 == 'delete')
            {
            
                $response = $this->crud_model->deleteW8($param2);
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            $page_data['page_name']     = 'w8';
            $page_data['page_title']    = "Solicitudes de w8";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function canvas($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
            if($param1 == 'canvas_generate')
            {
                $user   = $this->db->get_where('user',['user_id'=>$this->session->userdata('login_user_id')])->row_array();
                $agency = $this->db->get_where('agency',['id'=>$user['agency_id']])->row_array();
                $canva  = $this->db->get_where('canvas',['id'=>base64_decode($param2)])->row_array();
                
                echo $canva['photo'].' '.$agency['logo'].' '.$agency['degrad'].'<br>';
                
                $response = $this->crud_model->agregarLogoYTexto($canva['photo'],$agency['logo'],$agency['degrad'],'Contacto: 000000000');
                echo $response.'<br>';
                
                $rutaImagen       = 'public/assets/images/canvas/' . $response;
                $responseWhatsapp = $this->whatsapp_model->sendWhatsappFile('983725228','Prueba ',$rutaImagen);
                
                echo $responseWhatsapp;
                
                exit;
                           
            }
            
            if($param1 == 'sendCanvas')
            {
               
                $canva  = $this->db->get_where('canvas',['id'=>base64_decode($param2)])->row_array();
                $agencies = $this->db->get_where('canva_agencies',['canva_id'=>base64_decode($param2)])->result_array();
               
                foreach ($agencies as $agency_canva)
                {
                    $agency = $this->db->get_where('agency',['id'=>$agency_canva['agency_id']])->row_array();
                    $users   = $this->db->get_where('user',['agency_id'=>$agency['id'],'status'=>1,'rol_id !='=>2])->result_array();
                    $code    = $this->db->get_where('pais',['id'=>$agency['pais_id']])->row()->code;
                    foreach ($users as $user)
                    {
                        $number = $user['phone'];
                        if (substr($user['phone'], 0, 1) === '0') {
                            $number = substr($number, 1);
                        }
                      
                        echo 'Agencia: '.$agency['name'].' Usuario: '.$user['name'].' '.$user['last_name'].' Phone: '.$code.$number.'<br>';
                        $response = $this->crud_model->agregarLogoYTexto($canva['photo'],$agency['logo'],$agency['degrad'],'Contacto: '.$number,$user['user_id']);
                       
                        $rutaImagen       = 'public/assets/images/canvas/' . $response;
                        
                        echo $rutaImagen.'<br>';
                        $responseWhatsapp = $this->whatsapp_model->sendWhatsappFile($code.$number,$canva['message'],$rutaImagen);
                        
                        echo $responseWhatsapp['status'].' '.$responseWhatsapp['message'].'<br>';
                        
                    }
                    
                }
               
                
                // $rutaImagen       = 'public/assets/images/canvas/' . $response;
                // $responseWhatsapp = $this->whatsapp_model->sendWhatsappFile('983725228','Prueba ',$rutaImagen);
                exit;
                           
            }
            
            if($param1 == 'saveCanva')
            {
            
                $response = $this->crud_model->saveCanva();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            if($param1 == 'deleteCanva')
            {
            
                $this->crud_model->deleteCanva(base64_decode($param2));
                $this->session->set_flashdata('success','Canva eliminada');
                redirect($this->agent->referrer(),'refresh');
                           
            }
            
            $page_data['page_name']     = 'canvas';
            $page_data['page_title']    = "Canvas";
            $this->load->view('backend/index', $page_data);
    
        }
        
         /* Detalle de cada ventas*/
        function canvas_form($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveCanvas')
            {
                
                
                $response = $this->crud_model->saveCanva();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
                
            }
            
            
            
            $canvas = $this->db
                ->get_where('canvas', ['id' => base64_decode($param1)])
                ->result_array();
            
            $canva = [];
            foreach ($canvas as $r) {
                $canva = $r;
            }
        
            $page_data['paises'] = $this->db
                ->order_by('id','ASC')
                ->get('pais')
                ->result();
        
            $assigned = [];
            if($param1 != '')
            {
               $rows = $this->db
                ->get_where('canva_pais', ['canva_id' => base64_decode($param1)])
                ->result();
        
                foreach ($rows as $r) {
                    $assigned[$r->pais_id] = 1;
                } 
            }
            
         
            $page_data['canva']    = $canva;
            $page_data['assigned'] = $assigned;
            $page_data['page_name']  = 'canvas_form';
            $page_data['page_title'] = "Formulario de canvas";
            $this->load->view('backend/index', $page_data);
        }
        
        public function my_canvas($param1 = '', $param2 = '')
        {
    
            $this->is_login();
            
             if ($param1 == 'descargar') 
             {

                $user   = $this->db->get_where('user', ['user_id' => $this->session->userdata('login_user_id')])->row_array();
                $agency = $this->db->get_where('agency', ['id' => $user['agency_id']])->row_array();
                $canva  = $this->db->get_where('canvas', ['id' => $param2])->row_array();
            
                $number = ltrim($user['phone'], '0');
            
                $file = $this->crud_model->agregarLogoYTexto(
                    $canva['photo'],
                    $agency['logo'],
                    $agency['degrad'],
                    'Contacto: ' . $number,
                    $user['user_id']
                );
            
                if (!$file) show_404();
            
                $path = FCPATH . 'public/assets/images/canvas/' . $file;
                if (!file_exists($path)) show_404();
            
                header('Content-Type: image/png');
                header('Content-Disposition: attachment; filename="Canva_'.$param2.'.png"');
                header('Content-Length: ' . filesize($path));
            
                // limpiar buffers
                ob_clean();
                flush();
            
                readfile($path);
            
                // eliminar archivo temporal
                unlink($path);
            
                exit;
            }

            
            $page_data['page_name']     = 'my_canvas';
            $page_data['page_title']    = 'Mis canvas';
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function report_travel()
        {
            $this->is_login();
        
            $filters = $this->input->get();
        
            $this->db->from('sale');
        
            if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
                $this->db->where('datetime >=', $filters['date_from'].' 00:00:00');
                $this->db->where('datetime <=', $filters['date_to'].' 23:59:59');
            }
        
            if (!empty($filters['code'])) {
                $this->db->like('code', $filters['code']);
            }
        
            if (!empty($filters['status'])) {
                $this->db->where('status', $filters['status']);
            }
        
            if (!empty($filters['user_id'])) {
                $this->db->where('user_id', $filters['user_id']);
            }
        
            if (!empty($filters['client_id'])) {
                $this->db->where('client_id', $filters['client_id']);
            }
        
            if (!empty($filters['pais_id'])) {
                $this->db->where('pais_id', $filters['pais_id']);
            }
        
            $page_data['sales'] = $this->db->get()->result();
        
            $page_data['page_name']  = 'report_travel';
            $page_data['page_title'] = 'Reporte de ventas de viajes';
        
            $this->load->view('backend/index', $page_data);
        }
        
          /* detalle de producto */
        function product_details($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['producto_id'] = base64_decode($param1);
            $page_data['page_name']  = 'product_details';
            $page_data['page_title'] = "Detalles del producto";
            $this->load->view('backend/index', $page_data);
        }
        
        public function comissions($param1 = '', $param2 = '')
        {
    
            $this->is_login();
    
            if ($param1 == 'delete') {
               
               
               
                $response = $this->crud_model->saveComission();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
    
    
            if ($param1 == 'saveComission') {
                
                
                
                $response = $this->crud_model->saveComission();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
    
            }
    
            $page_data['page_name'] = 'comissions';
            $page_data['page_title'] = "Comisiones";
            $this->load->view('backend/index', $page_data);
    
        }
        
        public function points($param1 = '', $param2 = '')
        {
    
            $this->is_login();
    
            if ($param1 == 'delete') {
               
               
               
                $response = $this->crud_model->deletePoints();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
            }
    
    
            if ($param1 == 'savePoints') {
                
                
                
                $response = $this->crud_model->savePoints();
                $this->session->set_flashdata('success',$response);
                redirect($this->agent->referrer(),'refresh');
    
            }
    
            $page_data['page_name'] = 'points';
            $page_data['page_title'] = "Puntos";
            $this->load->view('backend/index', $page_data);
    
        }
        
        // Esta función será llamada por cron cada minuto
        public function sendReminders() {
    
            // Obtener todos los recordatorios pendientes cuya fecha <= ahora
            $now = date('Y-m-d H:i:00');
          
            
           
            $reminders = $this->db
                ->where('reminder_date', $now)
                ->get('tasks')
                ->result();
    
            if(!$reminders) {
                echo "No hay recordatorios pendientes.\n";
               
            }
              
            foreach($reminders as $r) {
                
                
                // Obtener info de la tarea
                $task = $this->db->get_where('tasks', ['id' => $r->id])->row();
                if(!$task) continue;
    
                // Enviar recordatorio (ejemplo por correo)
                
                $user = $this->db->get_where('user', ['user_id' => $task->user_id])->row();
                $patient = $this->db->get_where('client', ['client_id' => $task->patient_id])->row();
                
                /*
                if($user && $user->phone) {
                  $message =  "Hola ".$user->name.' '.$patient->last_name.",\n\nTe recordamos tu tarea: {$task->name} programada para el {$task->date} a las {$task->time}, con el cliente ".$patient->name.' '.$patient->last_name.".\n\nSaludos.";
                  
                  $this->whatsapp_model->sendWhatsapp($patient->phone,$message);
                }
                
               
                if($patient && $patient->phone) 
                {
                  $message =  "Hola ".$patient->name.' '.$patient->last_name.",\n\nTe recordamos la tarea: {$task->name} programada para el {$task->date} a las {$task->time}.\n\nSaludos.";
                  
                  echo $this->whatsapp_model->sendWhatsapp($patient->phone,$message);
                }
                */
                
                if($user && $user->email) {
                  
                 
                   log_message('error','Email '.$user->email);
                   
                   $page_data['task_id'] = $r->id;
                   $message = $this->load->view('backend/emails/task_email.php', $page_data, true);
                  
                   $response = $this->email_model->send_mail_request($user->email,'Notificaciones Ziigo',$message);
                  
                   log_message('error','Recordatorio '.$response);
                }
                
                
                if($patient && $patient->email) {
                  
                 
                   log_message('error','Email '.$patient->email);
                   
                   $page_data['task_id'] = $r->id;
                   $message = $this->load->view('backend/emails/task_email.php', $page_data, true);
                  
                   $response = $this->email_model->send_mail_request($patient->email,'Notificaciones Ziigo',$message);
                  
                   log_message('error','Recordatorio '.$response);
                }
               
               
    
                echo "Recordatorio enviado para tarea ID {$r->id}\n";
            }
            
             return;
        }
        
         /* Todos los reportes*/
        function cards($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'cards';
            $page_data['page_title'] = "Tarjeta publica";
            $this->load->view('backend/index', $page_data);
        }
        
         /* Todos los reportes*/
        function card_edit($param1 = '', $param2 = '')
        {
            $this->is_login();
    
    
            /* CREATE / UPDATE */
            if($param1 == 'save')
            {
                $user_id = $this->input->post('user_id');
                
                $this->db->where('user_id',$user_id);
                $user = $this->db->get('user')->row_array();
                
                $this->db->where('user_id',$user_id);
                $exit = $this->db->get('user_profile')->num_rows();
                    
                log_message('error','user '.$user_id);
                $data = [
                    'full_name' => $this->input->post('full_name'),
                    'title'     => $this->input->post('title'),
                    'email'     => $this->input->post('email'),
                    'phone'     => $this->input->post('phone'),
                    'occupation'=> $this->input->post('occupation'),
                    'location'  => $this->input->post('location'),
                    'bio'       => $this->input->post('bio'),
                    'website'   => $this->input->post('website'),
                    'agency_id' => $user['agency_id'],
                    'status'    => $this->input->post('status')
                ];
        
                if ($exit > 0) {
                    $this->db->where('user_id',$user_id);
                    $this->db->update('user_profile', $data);
                    $profile_id = $user_id;
                    
                     
                    $this->session->set_flashdata('success','Perfil Actualizado');
                        redirect($this->agent->referrer(),'refresh');
                        
                } else {
                    $data['user_id'] = $user_id;
                    $this->db->insert('user_profile', $data);
                   
                     
                    $this->session->set_flashdata('success','Perfil Agregado');
                    redirect($this->agent->referrer(),'refresh');
                }
        
            }

            /* DELETE */
            if($param1 == 'delete')
            {
                $user_id = base64_decode($param2);
                
                log_message('error', $user_id);
                
                $profile = $this->db->get_where('user_profile',['id'=>$user_id])->row();
                if ($profile) {
                    $this->db->delete('user_profile_gallery', [
                        'user_profile_id' => $profile->id
                    ]);
                    
                    $this->db->delete('user_profile', [
                        'id' => $profile->id
                    ]);
                    
                    $this->session->set_flashdata('success','Tarjeta Actualizado');
                    redirect($this->agent->referrer(),'refresh');
                }
        
                $this->session->set_flashdata('success','Tarjeta no se pudo eliminar');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'upload_gallery_ajax')
            {
                $profile_id = $this->input->post('profile_id');
                $names = $this->input->post('names');
            
                $images = $this->crud_model->upload_gallery_ajax($profile_id, $names);
                echo json_encode($images);
                exit;
            }
            
            if($param1 == 'delete_image_ajax')
            {
                $id = $this->input->post('id');
                $this->crud_model->delete_image_ajax($id);
                exit;
            }

    /* GALERÍA */
             $page_data['user_id']  = base64_decode($param1);
            $page_data['page_name']  = 'card_edit';
            $page_data['page_title'] = "Tarjeta publica";
            $this->load->view('backend/index', $page_data);
        }
        
         /* Todos los reportes*/
        function capatitations($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'capatitations';
            $page_data['page_title'] = "Capacitaciones";
            $this->load->view('backend/index', $page_data);
        }
        
        
    function products($param1 = '', $param2 = '')
    {
        $this->is_login();
        
        if($param1 == 'store')
        {
            $data = array(
                'description2' => $this->input->post('description2'),
                );
                
            $this->db->where('id',$this->input->post('product_id'));
            $this->db->update('productos',$data);
            
             
            $this->session->set_flashdata('success','Descripción actualizada');
            redirect($this->agent->referrer(),'refresh');
            
        }
            
            $limit = 40;
            $page = $this->input->get('page');
            $offset = ($page) ? ($page - 1) * $limit : 0;
        
            // Recoger filtros
            $supplier_id = $this->input->get('supplier');
            $company_id = $this->input->get('company');
            $exclude_category_id = $this->input->get('category'); // se excluyen productos con esta categoría
            $search = $this->input->get('search');
            $price_min = $this->input->get('price_min');
            $price_max = $this->input->get('price_max');
        
            // ===================
            // Subconsulta para conteo
            // ===================
            $this->db->from('productos p');
            $this->db->where('p.status', 1);
            $this->db->where('p.pais_id', $this->session->userdata('current_country'));
            
            if ($supplier_id) {
               
                $this->db->where('p.supplier_id', $supplier_id);
            }
            
            if ($company_id) {
                $this->db->join('producto_warehouses pw', 'p.id = pw.product_id', 'left');
                $this->db->where('pw.warehouse_id', $company_id);
            }
            
            
            if ($company_id) {
                $this->db->join('producto_warehouses pw', 'p.id = pw.product_id', 'left');
                $this->db->where('pw.warehouse_id', $company_id);
            }
        
            if ($exclude_category_id) {
                $this->db->join('product_categories pc', 'p.id = pc.product_id', 'left');
                $this->db->where('pc.category_id', $exclude_category_id); // excluir
            }
        
            if ($search) {
                $this->db->like('p.name', $search);
            }
        
            if ($price_min !== null && $price_min !== '') {
                $this->db->where('p.price >=', floatval($price_min));
            }
        
            if ($price_max !== null && $price_max !== '') {
                $this->db->where('p.price <=', floatval($price_max));
            }
        
            $this->db->select('p.id');
            $this->db->group_by('p.id');
            $subquery = $this->db->get_compiled_select(); // arma la subconsulta
        
            // Ejecutar COUNT(*) sobre subconsulta
            $this->db->reset_query();
            $this->db->from("($subquery) as counted");
            $total_rows = $this->db->count_all_results();
        
            // ===================
            // Consulta de productos (paginada)
            // ===================
            $this->db->from('productos p');
            $this->db->where('p.status', 1);
            $this->db->where('p.pais_id', $this->session->userdata('current_country'));
                
            if ($supplier_id) {
               
                $this->db->where('p.supplier_id', $supplier_id);
            }
        
            if ($company_id) {
                $this->db->join('producto_warehouses pw', 'p.id = pw.product_id', 'left');
                $this->db->where('pw.warehouse_id', $company_id);
            }
        
            if ($exclude_category_id) {
                $this->db->join('product_categories pc', 'p.id = pc.product_id', 'left');
                $this->db->where('pc.category_id', $exclude_category_id); // excluir
            }
        
            if ($search) {
                $this->db->like('p.name', $search);
            }
        
            if ($price_min !== null && $price_min !== '') {
                $this->db->where('p.price >=', floatval($price_min));
            }
        
            if ($price_max !== null && $price_max !== '') {
                $this->db->where('p.price <=', floatval($price_max));
            }
        
            $this->db->select('p.*'); // aquí sí puedes usar * porque solo se usa para mostrar
            $this->db->group_by('p.id');
            $this->db->order_by('p.id', 'desc');
            $this->db->limit($limit, $offset);
            $products = $this->db->get()->result_array();
        
            $total_pages = ceil($total_rows / $limit);
        
            // Enviar datos a la vista
            $page_data['products'] = $products;
            $page_data['current_page'] = ($page) ? $page : 1;
            $page_data['total_pages'] = $total_pages;
            $page_data['page_name'] = 'products';
            $page_data['page_title'] = 'Catálogo de productos';
        
            $page_data['filters'] = [
                'supplier' => $supplier_id,
                'company' => $company_id,
                'category' => $exclude_category_id,
                'search' => $search,
                'price_min' => $price_min,
                'price_max' => $price_max
            ];
        
            $this->load->view('backend/index', $page_data);
       
    }
    
    public function email_templates($param1 = '', $param2 = '')
    {

        $this->is_login();
        
        
        if($param1 == 'save')
        {
        
            $response = $this->email_model->save($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
        if($param1 == 'delete')
        {
        
            $response = $this->email_model->delete($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
        $page_data['page_name']     = 'w8';
        $page_data['page_title']    = "Solicitudes de w8";
        $this->load->view('backend/index', $page_data);

    }

    public function specialties($param1 = '', $param2 = '')
    {

        $this->is_login();
        
        
        if($param1 == 'save')
        {
        
            $response = $this->crud_model->saveSpeciality($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
        if($param1 == 'delete')
        {
        
            $response = $this->crud_model->deleteSpeciality($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
    }

    public function clinical_parameters($param1 = '', $param2 = '')
    {

        $this->is_login();
        
        
        if($param1 == 'save')
        {
        
            $response = $this->crud_model->saveClinical_parameters($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
        if($param1 == 'delete')
        {
        
            $response = $this->crud_model->deleteClinical_parameters($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
    }

    public function clinical_records($param1 = '', $param2 = '')
    {

        $this->is_login();
        
        
        if($param1 == 'save')
        {
        
            $response = $this->crud_model->saveClinical_records($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
        if($param1 == 'delete')
        {
        
            $response = $this->crud_model->deleteClinical_parameters($param2);
            $this->session->set_flashdata('success',$response);
            redirect($this->agent->referrer(),'refresh');
                       
        }
        
    }
    
    
    public function updateAcademyUser()
    {
        $agencies = $this->db->get_where('agency',['gerente_id'=>42565])->result_array();
        foreach ($agencies as $agency)
        {
            $users = $this->db->get_where('user',['agency_id'=>$agency['id']])->result_array();
            foreach ($users as $user)
            {
                
                $response = $this->crud_model->saveMoodelUseWhatsapp($user);
                echo $response.'<br>';
                
            }
        }
        
    }
    
    public function syncMoodelUser()
    {
        $agencies = $this->db->get_where('agency',['gerente_id'=>42565])->result_array();
        foreach ($agencies as $agency)
        {
            $users = $this->db->get_where('user',['agency_id'=>$agency['id']])->result_array();
          
            foreach ($users as $user)
            {
                
                $response = $this->crud_model->syncMoodelUser($user);
                echo $response['message'].'<br>';
                
            }
       
        }
    }
    
        function pos_visas($param1 = '', $param2 = '') 
        {
            $this->is_login();
            
            $products = $this->db->get_where('productos',['status'=>1,'type'=>3])->result_array(); 
            // Enviar datos a la vista
            $page_data['products']      = $products;
            $page_data['page_name']     = 'pos_visas';
            $page_data['page_title']    = "Super visas";
        
            $this->load->view('backend/index', $page_data);
        }
        
        function product_visa_details($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['id'] = base64_decode($param1);
            $page_data['page_name']  = 'product_visa_details';
            $page_data['page_title'] = "Detalles del adelante";
            $this->load->view('backend/index', $page_data);
        }
    ////////////////// Antes de la actualizacion
    // Funcion para consultar
    
    function getRUC()
    {
       
        $url_ws      = "https://datosec.com/app/datosfiscales/consultaDeDatos.php?wsdl";// 
        
        require_once('public/soap/lib/nusoap.php');
        $client      = new nusoap_client($url_ws,true);
        $err         = $client->getError();
        if ($err) {
            echo '<h2>Constructor error</h2>' . $err;
            exit();
        }
        try {
             $response = $client->call('consultaDeDatos', array(
                'cedulaRUC'             => $this->input->post('cedula'),
                'variables'             => "9993",
                'accesoNegocio'         => "1001",
                'accesoEstablecimiento' => "6621",
                'operador'              => "152754",
                'usuario'               => "puertoWeb",
                'key'                   => "esreija4b6902g023vtuu7d9bf",
                
            ));
            if ($client->fault) {
                $retornar['Fallo'] = $retornar;
    	        echo json_encode(array('error'=>1));
    	    } else {
                $retornar['Response'] = $response;	
                echo json_encode($response);
    	    }
        }
        catch(Exception $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }
    
       
    
        
        
        
         /* Iframe chat ia */
        function chat_iframe_ia($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'chat_iframe_ia';
            $page_data['page_title'] = "Chat de ia";
            $this->load->view('backend/index', $page_data);
        } 
        
        
        /* Todos los productos de regalo Iframe de un wordpress*/
        function iframe_all_product($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'iframe_all_product';
            $page_data['page_title'] = "Todos los productos";
            $this->load->view('backend/index', $page_data);
        } 
        
        
        
        
        /* Función llamar la vista de companias*/
        function companies($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'create')
            {
                $this->crud_model->company_create();
                $this->session->set_flashdata('success','Equipo creado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'update')
            {
                $this->crud_model->company_update($param2);
                $this->session->set_flashdata('success','Equipo actualizado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'desactivate')
            {
                $this->crud_model->company_desactivate($param2);
                $this->session->set_flashdata('success','Equipo suspendido');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'reactivate')
            {
                $this->crud_model->company_reactivate($param2);
                $this->session->set_flashdata('success','Equipo activo');
                redirect($this->agent->referrer(),'refresh');
            }
              if($param1 == 'delete')
            {
                $this->crud_model->company_delete($param2);
                $this->session->set_flashdata('success','Equipo eliminado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            
            $page_data['companies']  =  $this->crud_model->get_all_companies();
            $page_data['page_name']  = 'companies';
            $page_data['page_title'] = "Equipos";
            $this->load->view('backend/index', $page_data);
        } 
        
        
        /* Función llamar la vista de companias*/
        function company_products($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'create')
            {
                $this->crud_model->company_products_create();
                $this->session->set_flashdata('success','Equipo creado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'update')
            {
                $this->crud_model->company_products_update($param2);
                $this->session->set_flashdata('success','Equipo actualizado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'desactivate')
            {
                $this->crud_model->company_products_desactivate($param2);
                $this->session->set_flashdata('success','Equipo suspendido');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'reactivate')
            {
                $this->crud_model->company_products_reactivate($param2);
                $this->session->set_flashdata('success','Equipo activo');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['companies']  =  $this->db->get_where('company_products',['status'=>1])->result();
            $page_data['page_name']  = 'company_products';
            $page_data['page_title'] = "Equipos";
            $this->load->view('backend/index', $page_data);
        } 
        
        
        /* Función llamar la vista de Equipo*/
        function directors($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'create')
            {
                $response = $this->crud_model->admin_create($param2);
                echo $response;
                exit();
            }
            
            if($param1 == 'update')
            {
                $this->crud_model->admin_update($param2);
                $this->session->set_flashdata('success','Director actualizado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'update_notes')
            {
                $this->crud_model->admin_update_notes($param2);
                $this->session->set_flashdata('success','Notas actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete')
            {
                $this->crud_model->admin_delete($param2);
                $this->session->set_flashdata('success','Director suspendido');
                redirect($this->agent->referrer(),'refresh');
            }
            
             if($param1 == 'desactivate')
            {
                $this->crud_model->admin_desactivate($param2);
                $this->session->set_flashdata('success','Director suspendido');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'reactivate')
            {
                $this->crud_model->admin_reactivate($param2);
                $this->session->set_flashdata('success','Director activo');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['admins']     =  $this->crud_model->get_all_directors();
            $page_data['page_name']  = 'directors';
            $page_data['page_title'] = "Directores";
            $this->load->view('backend/index', $page_data);
        }
        
        
        /* Función llamar la vista de Equipo*/
        function leaders($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'create')
            {
                $this->crud_model->admin_create($param2);
                $this->session->set_flashdata('success','Gerente creado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'update')
            {
                $this->crud_model->admin_update($param2);
                $this->session->set_flashdata('success','Gerente actualizado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete')
            {
                $this->crud_model->admin_delete($param2);
                $this->session->set_flashdata('success','Gerente eliminado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'desactivate')
            {
                $this->crud_model->admin_desactivate($param2);
                $this->session->set_flashdata('success','Gerente suspendido');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'reactivate')
            {
                $this->crud_model->admin_reactivate($param2);
                $this->session->set_flashdata('success','Gerente activo');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['admins']     =  $this->crud_model->get_all_admins();
            $page_data['page_name']  = 'leaders';
            $page_data['page_title'] = "Lideres";
            $this->load->view('backend/index', $page_data);
        }
        
        
        
        
        
           /* Función llamar la vista de panel de perfil*/
        function profileuserview($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'profileviewuser';
            $page_data['page_title'] = "Perfil de usuario";
            $this->load->view('backend/index', $page_data);
        } 
        
          /* Función llamar la vista de panel de perfil*/
        function newsale($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            if($param1 == 'saveSale')
            {
                $sale_id = $this->crud_model->saveSale();
                $this->session->set_flashdata('success','Venta guardada.');
                redirect(base_url().'portal/travel_report/'.base64_encode($sale_id),'refresh');
            }
            
            if($param1 == 'reportSale')
            {
                $sale_id = $this->crud_model->saveSale();
                $this->session->set_flashdata('success','Venta guardada lista para reporte.');
                redirect(base_url().'portal/travel_report/'.base64_encode($sale_id),'refresh');
            }
            
            $page_data['page_name']  = 'newsale';
            $page_data['page_title'] = "inicio de la venta";
            $this->load->view('backend/index', $page_data);
        } 
        
          /* Función llamar la vista de panel de perfil*/
        function newsalecopy($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'newsalecopy';
            $page_data['page_title'] = "inicio de la venta";
            $this->load->view('backend/index', $page_data);
        } 
        
         /* consulta de datos de clientes*/
        function consultsale($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'consultsale';
            $page_data['page_title'] = "consultarventa";
            $this->load->view('backend/index', $page_data);
        } 
        
          /* DEMO NUEVOS CAMPOS*/
        function add_forms($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'add_forms';
            $page_data['page_title'] = "add_forms";
            $this->load->view('backend/index', $page_data);
        } 
        

        
         /* Todos los reportes*/
        function sales($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['status']     = $param1;
            $page_data['page_name']  = 'sales';
            $page_data['page_title'] = "Ventas";
            $this->load->view('backend/index', $page_data);
        }

        
        
          
         function product_sales_details($param1 = '', $param2 = '')
        {
            $this->is_login();
     
            
            if($param1 == 'delete')
            {
                
                $this->crud_model->delete_product_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta eliminada.');
                redirect($this->agent->referrer(),'refresh');
                
            }
             if ($param1 == 'auth') {
                $this->crud_model->auth_product_sale(base64_decode($param2));
                $this->session->set_flashdata('success', 'Venta a sido aprovada.');
                redirect($this->agent->referrer(), 'refresh');
            }
            
             if ($param1 == 'send') {
                $this->crud_model->send_product_sale(base64_decode($param2));
                $this->session->set_flashdata('success', 'Venta a sido enviada.');
                redirect($this->agent->referrer(), 'refresh');
            }
            
             if ($param1 == 'delivered') {
                $this->crud_model->delivered_product_sale(base64_decode($param2));
                $this->session->set_flashdata('success', 'Venta a sido entregada.');
                redirect($this->agent->referrer(), 'refresh');
            }
            
            
             if($param1 == 'preauth_sale')
            {
                
                $this->crud_model->preauth_product_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta pre authorizada.');
                redirect($this->agent->referrer(),'refresh');
                
            }
            
            if($param1 == 'reject')
            {
                
                $this->crud_model->reject_product_sale(base64_decode($param2));
                $this->session->set_flashdata('success','Venta rechazada.');
                redirect($this->agent->referrer(),'refresh');
                
            }
            
             if ($param1 == 'uploadFile') {
                $this->crud_model->update_product_sale_recipe($param2);
                $this->session->set_flashdata('success', 'Comprobante guardado');
                redirect($this->agent->referrer(), 'refresh');
            }
            
                if ($param1 == 'downloadRecipe') {
                $this->crud_model->download_file('public/assets/sales/recipes/' . base64_decode($param2));
                $this->session->set_flashdata('success', 'Archivo descargado');
                redirect($this->agent->referrer(), 'refresh');
            }
           
            $page_data['id']  = base64_decode($param1);
            $page_data['page_name']  = 'product_sales_details';
            $page_data['page_title'] = "Detalle de la venta";
            $this->load->view('backend/index', $page_data);
        }
        
        
   
        
        
        function all_report($param1 = '', $param2 = '')
        {
             $this->is_login();
           
            $page_data['sales'] = $this->crud_model->get_sales_sa('all');
            $page_data['page_name']  = 'all_report';
            $page_data['page_title'] = "Todos los reportes";
            $this->load->view('backend/index', $page_data);
        }
        
        

        
             /* Listado del equipo del lider*/
        function team_leaders($param1 = '', $param2 = '')
        {
             $this->is_login();
            $page_data['page_name']  = 'team_leaders';
            $page_data['page_title'] = "team_leaders";
            $this->load->view('backend/index', $page_data);
        }
        
    
                /* Listado del equipo del lider*/
        function company_teams($param1 = '', $param2 = '')
        {
             $this->is_login();
            $page_data['company_id']   = base64_decode($param1);
            $page_data['page_name']  = 'company_teams';
            $page_data['page_title'] = "Agentes";
            $this->load->view('backend/index', $page_data);
        }
        
            /* Listado del equipo del lider*/
        function director_teams($param1 = '', $param2 = '')
        {
            $this->is_login();
            $page_data['admin_id']   = base64_decode($param1);
            $page_data['page_name']  = 'director_teams';
            $page_data['page_title'] = "director_teams";
            $this->load->view('backend/index', $page_data);
        }
        
        
        /* Listado del equipo del lider*/
        function list_teams($param1 = '', $param2 = '')
        {
             $this->is_login();
            $page_data['page_name']  = 'list_teams';
            $page_data['page_title'] = "list_teams";
            $this->load->view('backend/index', $page_data);
        }
        
        
          /* Reportes Pendientes*/
        function all_report_process($param1 = '', $param2 = '')
        {
            $this->is_login();
            $page_data['sales'] = $this->crud_model->get_sales_sa(0);
            $page_data['page_name']  = 'all_report';
            $page_data['page_title'] = "Todos los reportes";
            $this->load->view('backend/index', $page_data);
        }
        
        
          /* Reportes Pagados*/
        function all_report_paid($param1 = '', $param2 = '')
        {
            $this->is_login();
            $page_data['sales'] = $this->crud_model->get_sales_sa(1);
            $page_data['page_name']  = 'all_report_paid';
            $page_data['page_title'] = "Todos los reportes Pagados";
            $this->load->view('backend/index', $page_data);
        }
        
         /* Reportes Pagados*/
        function all_report_rejected($param1 = '', $param2 = '')
        {
            $this->is_login();
            $page_data['sales'] = $this->crud_model->get_sales_sa(2);
            $page_data['page_name']  = 'all_report_rejected';
            $page_data['page_title'] = "Todos los reportes Rechazados";
            $this->load->view('backend/index', $page_data);
        }
        
        
        
   

        function printSaleDetail($sale_id) 
        {
            $data['sale_id'] = base64_decode($sale_id);
            $data['sale'] = $this->db->get_where('sale', array('sale_id' => base64_decode($sale_id)))->row_array();
        
            $html = $this->load->view('backend/pdf/sale_details', $data, true);
            
            $this->load->library('M_pdf');
            $mpdf = new mPDF('c', 'letter');
            $mpdf->WriteHTML($html);
            $mpdf->Output('sale_details.pdf', 'I');
        }
        
         /* Todos los reportes*/
        function sale_report($param1 = '', $param2 = '')
        {
             $this->is_login();
            
            if($this->input->post('fecha1') == '' && $this->input->post('fecha2') == '' )
            {
                $page_data['status']      =  'all';
                $page_data['fecha1']      =  date('Y-m-01');
                $page_data['fecha2']      =  date('Y-m-t');
                
            }else
            {
                
                $page_data['status']      = $this->input->post('status');
                $page_data['fecha1']      = $this->input->post('fecha1');
                $page_data['fecha2']      = $this->input->post('fecha2');
            }
        
          
            $page_data['page_name']  = 'sale_report';
            $page_data['page_title'] = "Reporte de ventas";
            $this->load->view('backend/index', $page_data);
        }
        
        function getAccess()
        {
            $binacle  = $this->db->order_by('binnacle_id','DESC')->get('binnacle')->result_array();
            foreach($binacle as $row)
            {
                echo $row['description'].'<br>';
            }
        }

           
        function getOrder()
        {
            log_message('error','Webhook');
            $input = file_get_contents('php://input');
            log_message('error',json_encode(json_decode($input,true)).' '.json_encode($this->input->post()));
            
             $data = json_decode($input, true);

                if (!$data) {
                    log_message('error','error al guardar el pedido');
                    return;
                }

                // Buscar ID del vendedor por su código
                $seller_code = $data['seller_code'];
                $seller = $this->db->get_where('user', ['seller_code' => $seller_code])->row();


                // Insertar datos del pedido en la tabla `orders`
                $order_data = [
                    'created_date' => $data['created_date'],
                    'purchase_date' => $data['purchase_date'],
                    'handle' => $data['handle'],
                    'customer' => $data['customer'],
                    'order_status' => $data['order_status'],
                    'payment_provider' => $data['payment_provider'],
                    'payment_status' => $data['payment_status'],
                    'fulfillment_status' => $data['fulfillment_status'],
                    'delivery_method' => $data['delivery_method'],
                    'discount_code' => $data['discount_code'],
                    'discount_value' => $data['discount_value'],
                    'subtotal' => $data['subtotal'],
                    'shipping' => $data['shipping'],
                    'tax' => $data['tax'],
                    'total' => $data['total'],
                    'currency' => $data['currency'],
                    'seller_id' => $seller->user_id,
                    'notes' => $data['notes']
                ];

                $this->db->insert('orders', $order_data);
                $order_id = $this->db->insert_id();
                $profit_margin = 0;
                $percentage_1 =0;
                $percentage_2 =0;
                $percentage_3 =0;
              

                // Insertar detalles del pedido en la tabla `order_details`
                foreach ($data['details'] as $detail) {

                    // Dividir el SKU y obtener el costo
                    list($sku_code, $cost) = explode('=', $detail['sku']);
                    $cost = floatval($cost); // Convertir el costo a número
                    
                    $sku_prefix = substr($sku_code, 0, 5);

                    log_message('error', $sku_prefix);
                    $company = $this->db->get_where('company_products', ['code' => $sku_prefix])->row();
                    // Calcular el margen de ganancia
                    $selling_price = $detail['price']; // Precio de venta
                    $sbprofit_margin = $selling_price - $cost;

                    // Calcular los porcentajes
                    $percentage_1 += $sbprofit_margin * ($company->agent_porcent_comition/100);
                    $percentage_2 += $sbprofit_margin * ($company->porcent_comition/100);
                    $percentage_3 += $sbprofit_margin * ($company->director_porcent_comition/100);
                    $profit_margin += $sbprofit_margin;


                    $detail_data = [
                        'order_id'      => $order_id,
                        'sku'           => $detail['sku'],
                        'product_title' => $detail['product_title'],
                        'quantity'      => $detail['quantity'],
                        'cost'          => $cost,
                        'price'         => $detail['price'],
                        'subtotal'      => $detail['subtotal'],
                        'tax'           => $detail['tax'],
                        'total'         => $detail['total']
                    ];
                    $this->db->insert('order_details', $detail_data);



                }

                $this->db->where('id', $order_id);
                $this->db->update('orders', [
                    'porcentage_1' => $percentage_1,
                    'porcentage_2' => $percentage_2,
                    'porcentage_3' => $percentage_3,
                    'profit_margin' => $profit_margin
                ]);

               log_message('error','Order ID: ' . $order_id);
            }

           /* Todos los reportes*/
        function tikvao_sales($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            
            $page_data['page_name']  = 'tikvao_sales';
            $page_data['page_title'] = "Ventas desde la tienda";
            $this->load->view('backend/index', $page_data);
        }
        
         function view_order_product($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['order_id']   = $param1;
            $page_data['page_name']  = 'tikvao_sales';
            $page_data['page_title'] = "Ventas desde la tienda";
            $this->load->view('backend/index', $page_data);
        }

       /* catalogo de productos */

    
        
          /* detalle de producto */
        function detailproduct($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['producto_id'] = base64_decode($param1);
            $page_data['page_name']  = 'detailproduct';
            $page_data['page_title'] = "detailproduct";
            $this->load->view('backend/index', $page_data);
        }

        
         // Obtener países
        public function obtener_paises() {
            $paises = $this->db->get('pais')->result_array();
            echo json_encode($paises);
        }
    
        // Obtener provincias por país
        public function obtener_provincias($pais_id) {
            $provincias =$this->db->where('pais_id',$pais_id)->get('provincia')->result_array();;
            echo json_encode($provincias);
        }
    
        // Obtener cantones por provincia
        public function obtener_cantones($provincia_id) {
            $cantones = $this->db->where('provincia_id',$provincia_id)->get('canton')->result_array();;
            echo json_encode($cantones);
        }
        
          /* Función llamar la vista de Equipo*/
        function rifa($param1 = '', $param2 = '', $param3 = '')
        {
             $this->is_login();
           
            if($param1 == 'saveRifa')
            {
                $this->crud_model->saveRifa();
                $this->session->set_flashdata('success','Rifa actualizada');
                redirect($this->agent->referrer(),'refresh');
            }

            if($param1 == 'saveNumber')
            {
                $this->crud_model->saveNumber();
                $this->session->set_flashdata('success','Numero actualizado');
                redirect($this->agent->referrer(),'refresh');
            }

            if($param1 == 'updateNumber')
            {
                $this->crud_model->updateNumber(base64_decode($param2),base64_decode($param3));
                $this->session->set_flashdata('success','Numero actualizado');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete')
            {
                $this->crud_model->deleteRifa($param2);
                $this->session->set_flashdata('success','Rifa eliminadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['page_name']  = 'rifa';
            $page_data['page_title'] = "Rifas";
            $this->load->view('backend/index', $page_data);
        }

          
       /* Función llamar la vista de Equipo*/
        function add_edit_product($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveProduct')
            {
                $result = $this->crud_model->saveProduct();
                if($result)
                $this->session->set_flashdata('success','Agregado correctamente');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'delete')
            {
                $result = $this->crud_model->deleteProduct(base64_decode($param2));
                if($result)
                $this->session->set_flashdata('success','Eliminado correctamente');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['id']         = base64_decode($param1);
            $page_data['type']       = $param2;
            $page_data['page_name']  = 'add_edit_product';
            $page_data['page_title'] = "Producto";
            $this->load->view('backend/index', $page_data);
        }

        /* Función llamar la vista de Equipo*/
        function rifa_status($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            $page_data['id']         = $param1;
            $page_data['page_name']  = 'rifa_status';
            $page_data['page_title'] = "Rifas";
            $this->load->view('backend/index', $page_data);
        }

            /* Función llamar la vista de Equipo*/
        function report($param1 = '', $param2 = '', $param3 = '')
        {
             $this->is_login();
           
            if($this->input->post('date_start') && $this->input->post('date_end'))
            {
                $date_start = $this->input->post('date_start');
                $date_end   = $this->input->post('date_end');
                $user_report       = $this->input->post('user');
                $rifa_report       = $this->input->post('rifa_id');
            }else
            {
                $date_start  = date('Y-m-01');
                $date_end    = date('Y-m-t');
                $user_report = '';
                $rifa_report = '';
            }
            
            $page_data['rifa_report']       = $rifa_report;
            $page_data['user_report']       = $user_report;
            $page_data['date_start'] = $date_start;
            $page_data['date_end']   = $date_end;
            $page_data['page_name']  = 'report';
            $page_data['page_title'] = "Reporte";
            $this->load->view('backend/index', $page_data);
        }

        function downloadRifaFile($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            $this->crud_model->download_file( 'public/assets/rifas/'.base64_decode($param1));
            $this->session->set_flashdata('success','Archivo descargado');
            redirect($this->agent->referrer(),'refresh');
        }
        
          /* Cursos */
        function cart($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name'] = 'cart';
            $page_data['page_title'] = "Carrito de compras";
            $this->load->view('backend/index', $page_data);
          
        }

      
        public function subir_imagen_individual()
        {
            // Ruta destino relativa a index.php
            $upload_path = './public/uploads/gallery/';
        
            // Verifica si la carpeta existe
            if (!is_dir($upload_path)) {
                mkdir($upload_path, 0755, true); // Crear carpeta si no existe
            }
        
            if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
                $nombre_original = $_FILES['file']['name'];
                $temp_path = $_FILES['file']['tmp_name'];
        
                // Generar nombre único para evitar colisiones
                $nombre_final = uniqid() . '_' . basename($nombre_original);
                $destino = $upload_path . $nombre_final;
        
                // Mover archivo
                if (move_uploaded_file($temp_path, $destino)) {
                    // Devolver nombre de archivo subido
                    echo json_encode([
                        'status' => 'ok',
                        'filename' => $nombre_final,
                        'url' => base_url('public/uploads/gallery/' . $nombre_final)
                    ]);
                } else {
                    echo json_encode(['status' => 'error', 'mensaje' => 'No se pudo mover el archivo.']);
                }
            } else {
                echo json_encode(['status' => 'error', 'mensaje' => 'No se recibió ningún archivo.']);
            }
        }

      
           
        function getProducts()
        {
            
            log_message('error','Cargando productos');
            $token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcHAuZHJvcGkuZWM6ODAiLCJpYXQiOjE3NDI2NzUwNzIsImV4cCI6NDg5ODM0ODY3MiwibmJmIjoxNzQyNjc1MDcyLCJqdGkiOiJIYXZqdUxXMmZUSkE4Y3ZNIiwic3ViIjozODE5MiwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSIsImF1ZCI6IldPT0NPTUVSQ0UiLCJ0b2tlbl90eXBlIjoiSU5URUdSQVRJT05TIiwid2JfaWQiOjEsImludGVncmF0aW9uX3R5cGUiOiJXT09DT01FUkNFIiwiaW50ZWdyYXRpb25fdHlwZV9pZCI6MSwiaXBfdXJsIjpbXSwiaW50ZWdyYXRpb25fdXJsIjoiaHR0cHM6XC9cL21vdG9yZGVwcm9kdWN0b3MudGlrdmFvLmNvbVwvIn0.0G-JP7bOyyjMGdDJMsEFv6nNfNyZuf-4iHzG98x7A_g';
            
     
                $total_productos = 0;
                $i = 0;
               do{
                    
                    $data = array(
                        'startData'         => $i,
                        'pageSize'          => 10,
                        'active' => true,
                        'no_count' => true,
                        'integration' => true
                    );
                    
                    
                    
                    $curl = curl_init();
                    
                    curl_setopt_array($curl, array(
                        CURLOPT_URL => 'https://api.dropi.ec/integrations/products/index',
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_ENCODING => '',
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 10000,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_CUSTOMREQUEST => 'POST',
                        CURLOPT_POSTFIELDS => json_encode($data), // Convertimos el array a JSON
                        CURLOPT_HTTPHEADER => array(
                            'Content-Type: application/json;charset=UTF-8',
                            'dropi-integration-key: '.$token
                        ),
                    ));
                    
                    $response = curl_exec($curl);
                    
                    curl_close($curl);
                    
                    $products = json_decode($response,true);
                    
                        
                    
                    if (count($products['objects']) > 0) {
                         foreach ($products['objects'] as $product) {
                       
                        
                            $total_productos += $this->crud_model->save_product($product);
                        }
                    } 
                    
                     echo '<pre>';
                    print_r($i.'-Prodcutos '.count($products['objects']));
                    echo '</pre>';
                    
                     $i += 10;

                    // ❗Pausa de 1 segundo entre peticiones
                    sleep(5);
                    
               }while ($i <= 1000);
            
                $this->db->where('type','last_sync');
                $this->db->update('settings',['description'=>date('Y-m-d H:i ')]);
              echo 'Totla de productos insertados '.$total_productos;

        } 
        
             
        function getProducts2()
        {
            
            log_message('error','Cargando productos');
            $token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcHAuZHJvcGkuZWM6ODAiLCJpYXQiOjE3NDI2NzUwNzIsImV4cCI6NDg5ODM0ODY3MiwibmJmIjoxNzQyNjc1MDcyLCJqdGkiOiJIYXZqdUxXMmZUSkE4Y3ZNIiwic3ViIjozODE5MiwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSIsImF1ZCI6IldPT0NPTUVSQ0UiLCJ0b2tlbl90eXBlIjoiSU5URUdSQVRJT05TIiwid2JfaWQiOjEsImludGVncmF0aW9uX3R5cGUiOiJXT09DT01FUkNFIiwiaW50ZWdyYXRpb25fdHlwZV9pZCI6MSwiaXBfdXJsIjpbXSwiaW50ZWdyYXRpb25fdXJsIjoiaHR0cHM6XC9cL21vdG9yZGVwcm9kdWN0b3MudGlrdmFvLmNvbVwvIn0.0G-JP7bOyyjMGdDJMsEFv6nNfNyZuf-4iHzG98x7A_g';
            
     
                $total_productos = 0;
                $i = 0;
                do{
                    
                    $data = array(
                        'favorite'         => false,
                        'get_stock'          => false,
                        'no_count'       => true,
                        'pageSize'         => 40,
                        'privated_product'          => false,
                        'startData'       => $i,
                        'supplier_id'         => 42551,
                        'userVerified'          => false,
                        'with_collection'       => true
                    );
                    
                    
                    
                    
                    
                    $curl = curl_init();
                    
                    curl_setopt_array($curl, array(
                        CURLOPT_URL => 'https://api.dropi.ec/integrations/products/index',
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_ENCODING => '',
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 10000,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_CUSTOMREQUEST => 'POST',
                        CURLOPT_POSTFIELDS => json_encode($data), // Convertimos el array a JSON
                        CURLOPT_HTTPHEADER => array(
                            'Content-Type: application/json;charset=UTF-8',
                            'dropi-integration-key: '.$token
                        ),
                    ));
                    
                    $response = curl_exec($curl);
                    
                    curl_close($curl);
                   
                    
                    $products = json_decode($response,true);
                    
                    echo count($products['objects']);
                    
                    if (count($products['objects']) > 0) {
                         foreach ($products['objects'] as $product) {
                       
                        
                           $total_productos += $this->crud_model->save_product($product);
                        }
                    } 
                    
                     echo '<pre>';
                    print_r($i.'-Prodcutos '.count($products['objects']));
                    echo '</pre>';
                    
                     $i += 40;

                    // ❗Pausa de 1 segundo entre peticiones
                    //sleep(5);
                }while ($i <= 1000);
             
            
                //$this->db->where('type','last_sync');
                //$this->db->update('settings',['description'=>date('Y-m-d H:i ')]);
              echo 'Totla de productos insertados '.$total_productos;

        } 
        
              function categories($param1 = '', $param2 = '')
        {
            $this->is_login();
            
            if($param1 == 'saveCategory')
            {
                $this->crud_model->saveCategories();
                $this->session->set_flashdata('success','Categorias actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            $page_data['page_name']  = 'categories';
            $page_data['page_title'] = "Categorias";
            $this->load->view('backend/index', $page_data);
        }

       function wherehouses($param1 = '', $param2 = '')
        {
            $this->is_login();
            
             if($param1 == 'saveMaps')
            {
                $this->crud_model->admin_maps($param2);
                $this->session->set_flashdata('success','Proveedor actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            
             if($param1 == 'saveWarehouse')
            {
                $this->crud_model->saveWarehouse();
                $this->session->set_flashdata('success','Proveedor actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
             if($param1 == 'delete')
            {
                $this->crud_model->deleteWarehouse($param2);
                $this->session->set_flashdata('success','Proveedor eliminado');
                redirect($this->agent->referrer(),'refresh');
            }
            $page_data['page_name']  = 'wherehouses';
            $page_data['page_title'] = "Proveedores";
            $this->load->view('backend/index', $page_data);
        }
        
        public function ciudades_admin($admin_id) {
            $this->db->select('am.*, p.nombre as provincia, c.nombre as canton');
            $this->db->from('supplier_maps am');
            $this->db->join('provincia p', 'p.id = am.provincia_id');
            $this->db->join('canton c', 'c.id = am.canton_id');
            $this->db->where('am.admin_id', $admin_id);
            echo json_encode($this->db->get()->result());
        }
        
        function settings($param1 = '', $param2 = '')
        {
            $this->is_login();

            if($param1 == 'saveSettings')
            {
                $this->crud_model->saveSettings();
                $this->session->set_flashdata('success','Configuraciones actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            $page_data['page_name']  = 'settings';
            $page_data['page_title'] = "Configuraciones";
            $this->load->view('backend/index', $page_data);
        }
        
        
        
        function tasks($param1 = '', $param2 = '')
        {
            $this->is_login();
            
             if($param1 == 'saveMaps')
            {
                $this->tasks_model->admin_maps($param2);
                $this->session->set_flashdata('success','Proveedor actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            
             if($param1 == 'scheduleTasks')
            {
                $this->tasks_model->scheduleTasks();
                $this->session->set_flashdata('success','Tareas actualizadas');
                redirect($this->agent->referrer(),'refresh');
            }
            
            if($param1 == 'confirmar' )
            {
                
                $this->tasks_model->confirmTask($param2);
                $this->session->set_flashdata('success', 'Tareas finalizada');
                redirect($this->agent->referrer(), 'refresh');
                
                
            }
            
            if($param1 == 'cancelar' )
            {
                
                $this->tasks_model->cancelTask($param2);
                $this->session->set_flashdata('success', 'Tareas cancelada');
                redirect($this->agent->referrer(), 'refresh');
                
                
            }
            
             $page_data['date'] = date('Y-m-d');
            if($this->input->post('date') != '')
            {
                 $page_data['date'] = $this->input->post('date');
            }
            $page_data['page_name']  = 'tasks';
            $page_data['page_title'] = "Agenda";
            $this->load->view('backend/index', $page_data);
        }
        
        
        
        public function testWhassapp($number = '50247358248')
        {
            echo '<pre>';
            echo json_encode($this->whatsapp_model->sendWhatsapp($number,'Api funcionando'));
            echo '</pre>';
        }
        
          function add_edit_canvas($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            
            $page_data['product_id'] = $param1;
            $page_data['page_name']  = 'add_edit_canvas';
            $page_data['page_title'] = "Canvas";
            $this->load->view('backend/index', $page_data);
        }
        
        
        
        
        public function generateQR()
        {
            $url = $this->input->get('url'); // o $this->input->post('url') si lo envías por POST
        
            if (empty($url)) {
                echo 'No hay url'; // valor por defecto
                die();
            }
        
            echo '<img src="'.$this->crud_model->createQR($url).'" />';
        }

        
        public function exportar_excel($supplier_id = '')
        {
            // Carga la librería PHPExcel
            
            if($supplier_id != '')
            {
                $supplier = $this->db->get_where('admin',['admin_id'=>$supplier_id])->row()->name;
                
                $this->db->where('supplier_id',$supplier_id);
                
            }
            
               $result = $this->db->get('productos')->result_array();

                if (count($result) == 0) {
                    // Error al subir el archivo
                    echo 'No se encontraron productos';
                    return;
                } else {
                    // Archivo subido correctamente

                        $objPHPExcel = new PHPExcel();

                        $objPHPExcel->getProperties()->setCreator("Trivali EC")
                                                    ->setLastModifiedBy("Trivali")
                                                    ->setTitle("Product Export")
                                                    ->setSubject("Product Data")
                                                    ->setDescription("Product data exported from trivali.")
                                                    ->setKeywords("office 2007 openxml php")
                                                    ->setCategory("Export");

                        $sheet = $objPHPExcel->getActiveSheet();

                        // Set column headers
                        $columns = array('Proveedor','SKU','Nombre', 'Precio', 'Precio sugerido', 'Descripción');
                        $column = 'A';
                        foreach ($columns as $header) {
                            $sheet->setCellValue($column . '1', $header);
                            $column++;
                        }
                        
                        

                        // Populate data
                        $rowNumber = 2;
                        foreach ($result as $row) {
                            $sheet->setCellValue('A' . $rowNumber, $supplier);
                            $sheet->setCellValue('B' . $rowNumber, $row['sku']);
                            $sheet->setCellValue('C' . $rowNumber, $row['name']);
                            $sheet->setCellValue('D' . $rowNumber, $row['sale_price']);
                            $sheet->setCellValue('E' . $rowNumber, $row['suggested_price']);
                            $sheet->setCellValue('F' . $rowNumber, $row['description']);
                            $rowNumber++;
                        }

                            // Ajustar el ancho de las columnas
                        foreach(range('A', 'F') as $columnID) {
                            $objPHPExcel->getActiveSheet()->getColumnDimension($columnID)->setAutoSize(true);
                        }


                        // Redirect output to a client’s web browser (Excel2007)
                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="products.xlsx"');
                        header('Cache-Control: max-age=0');

                        // Save Excel 2007 file
                        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        exit;
                    
                }
            
        }
        
        public function ckeditor_upload() {
            if (isset($_FILES['upload']['name']) && $_FILES['upload']['error'] == 0) {
                // Carpeta de destino (relativa al index.php)
                $upload_path = './public/uploads/images/';
        
                // Crear la carpeta si no existe
                if (!is_dir($upload_path)) {
                    mkdir($upload_path, 0777, true);
                }
        
                // Obtener extensión del archivo
                $file_ext = pathinfo($_FILES['upload']['name'], PATHINFO_EXTENSION);
        
                // Validar tipo de archivo permitido
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array(strtolower($file_ext), $allowed)) {
                    $funcNum = $this->input->get('CKEditorFuncNum');
                    echo "<script>window.parent.CKEDITOR.tools.callFunction($funcNum, '', 'Tipo de archivo no permitido.');</script>";
                    return;
                }
        
                // Generar nombre único
                $new_filename = uniqid('img_', true) . '.' . $file_ext;
                $target_path = $upload_path . $new_filename;
        
                // Mover el archivo
                if (move_uploaded_file($_FILES['upload']['tmp_name'], $target_path)) {
                    // URL pública del archivo
                    $url = base_url('public/uploads/images/' . $new_filename);
                    $funcNum = $this->input->get('CKEditorFuncNum');
                    echo "<script>window.parent.CKEDITOR.tools.callFunction($funcNum, '$url', 'Imagen subida correctamente.');</script>";
                } else {
                    $funcNum = $this->input->get('CKEditorFuncNum');
                    echo "<script>window.parent.CKEDITOR.tools.callFunction($funcNum, '', 'No se pudo mover el archivo.');</script>";
                }
            } else {
                $funcNum = $this->input->get('CKEditorFuncNum');
                echo "<script>window.parent.CKEDITOR.tools.callFunction($funcNum, '', 'Debe indicar la imagen.');</script>";
            }
        }
        
        

        
        public function setCurrentCountry($param1)
        {
            $this->session->set_userdata('current_country', $param1);
            $this->session->set_flashdata('success', 'Pais actualizado');
            redirect($this->agent->referrer(), 'refresh');
        }
        
        /* Funcion para llamar el ultimo paso de reporte*/
        function send_report($param1 = '', $param2 = '')
        {
            $this->is_login();
           
            $page_data['page_name']  = 'send_report';
            $page_data['page_title'] = "send_report";
            $this->load->view('backend/index', $page_data);
        } 

        
       
        
    }
?>