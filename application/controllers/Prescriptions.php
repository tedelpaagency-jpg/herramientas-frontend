<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Prescriptions extends CI_Controller {

    public function __construct()
    {
        parent::__construct();

        // Validar sesión
        if ($this->session->userdata('user_login') != 1)
        {
            redirect(base_url(), 'refresh');
        }
            
   
        $this->load->database();
        $this->load->library('user_agent');
        $this->load->library('session');
    }

    /**
     * List consultations
     * URL: portal/consultations
     */
    public function index()
    {
        $agency_id = $this->session->userdata('current_agency');
    
        $page_data['prescriptions'] = $this->crud_model->get_prescriptions($agency_id,10,0);
    
        $page_data['page_name']  = 'prescriptions/index';
        $page_data['page_title'] = 'Listado de recetas';
    
        $this->load->view('backend/index', $page_data);
    }

    /**
     * Create consultation form
     * URL: portal/consultations/add
     */
    public function add($patient_id = 0)
    {
        $agency_id = $this->session->userdata('current_agency');
    
        $data['page_title'] = 'Nueva receta';
        $data['page_name'] = 'prescriptions/add';
    
        $this->load->view('backend/index', $data);
    }

    /**
     * Save prescription
     */
    function save()
    {
        $json = $this->input->post('data');
        $data = json_decode($json, true);

        if(empty($data['patient_id'])){
            echo json_encode(['status'=>false, 'msg'=>'Paciente requerido']);
            return;
        }
        
        log_message('error',json_encode($data));
        
        
        if($data['consultation_id'] != '')
        {
            
            // Buscar si ya existe una receta para la consulta
            $prescription = $this->db
                ->where('consultation_id', $data['consultation_id'])
                ->get('prescription')
                ->row_array();
            
            if ($prescription) {
            
                $prescription_id = $prescription['id'];
            
                // Actualizar cabecera
                $this->db->where('id', $prescription_id);
                $this->db->update('prescription', [
                    'comment'          => $data['comment'],
                    'next_appointment' => $data['next_appointment']
                ]);
            
                // Eliminar detalle anterior
                $this->db->where('prescription_id', $prescription_id);
                $this->db->delete('prescription_details');
            
            } else {
            
                // Crear cabecera
                $this->db->insert('prescription', [
                    'agency_id'        => $this->session->userdata('current_agency'),
                    'patient_id'       => $data['patient_id'],
                    'consultation_id'  => $data['consultation_id'],
                    'comment'          => $data['comment'],
                    'next_appointment' => $data['next_appointment']
                ]);
            
                $prescription_id = $this->db->insert_id();
            }
            
        }else
        {
                $insert = [
                    'agency_id'       => $this->session->userdata('current_agency'),
                    'patient_id'       => $data['patient_id'],
                    'comment'          => $data['comment'],
                    'next_appointment' => $data['next_appointment'],
                    
                ];
        
                $this->db->insert('prescription', $insert);
                $prescription_id = $this->db->insert_id();
            
        }


        // 2. guardar medicamentos
        if(!empty($data['medications'])){
            foreach($data['medications'] as $med){

                $this->db->insert('prescription_details', [
                    'prescription_id' => $prescription_id,
                    'type' => 'med',
                    'product_id' => $med['id'] ?? null,
                    'name' => $med['n'],
                    'dose' => $med['d'] ?? null,
                    
                ]);
            }
        }

        // 3. guardar laboratorios
        if(!empty($data['labs'])){
            foreach($data['labs'] as $lab){

                $this->db->insert('prescription_details', [
                    'prescription_id' => $prescription_id,
                    'type' => 'lab',
                    'name' => $lab['n'],
                    'dose' => $lab['o'] ?? null,
                    
                ]);
            }
        }

        echo json_encode(['status'=>true,'prescription_id'=>$prescription_id]);
        exit;
    }

    /**
     * View consultation
     */
    public function get_prescription_detail()
    {
        $id = $this->input->post('id');

        $prescription = $this->db
            ->where('id', $id)
            ->get('prescription')
            ->row();

        $patient = $this->db
            ->where('user_id', $prescription->patient_id)
            ->get('user')
            ->row();
        
        if (is_object($patient)) {

            $patient->age = !empty($patient->birthday)
                ? $this->crud_model->calcularEdad($patient->birthday)
                : 'N/A';
        
        }

        $details = $this->db
            ->where('prescription_id', $id)
            ->get('prescription_details')
            ->result();

        $meds = [];
        $labs = [];

        foreach($details as $d){
            if($d->type == 'med'){
                $meds[] = $d;
            }else{
                $labs[] = $d;
            }
        }

        echo json_encode([
            'prescription' => $prescription,
            'patient' => $patient,
            'meds' => $meds,
            'labs' => $labs
        ]);
        exit;
    }

    public function download_pdf($id) 
    {

       
        $this->load->library('dom_pdf');
             
        // encabezado
        $p = $this->db->where('id', $id)->get('prescription')->row();

        // detalles
        $details = $this->db->where('prescription_id', $id)->get('prescription_details')->result();

        $meds = [];
        $labs = [];

        foreach($details as $d){
            if($d->type == 'med'){
                $meds[] = $d;
            } else {
                $labs[] = $d;
            }
        }

        // HTML
        $html = $this->load->view('pdf/prescription', [
            'p' => $p,
            'meds' => $meds,
            'labs' => $labs
        ], true);

        // cargar dompdf
        $this->dom_pdf->load_view('pdf/prescription', [
            'p' => $p,
            'meds' => $meds,
            'labs' => $labs
        ])
        ->set_paper('A4', 'portrait')
        ->render()
        ->stream("receta_{$id}.pdf", ["Attachment" => true]);


    }
    
    public function send_whatsapp($id)
    {

        $this->load->library('dom_pdf');
        
        // Encabezado
        $p = $this->db->where('id', $id)->get('prescription')->row();
        $patient = $this->db->where('user_id', $id)->get('user')->row();
        
        // Detalles
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
        
        // Generar PDF
        $this->dom_pdf
            ->load_view('pdf/prescription', [
                'p' => $p,
                'patient' => $patient,
                'meds' => $meds,
                'labs' => $labs
            ])
            ->set_paper('A4', 'portrait')
            ->render();
        
        $pdf_content = $this->dom_pdf->dompdf->output();
        
        $file_name = 'receta_'.$id.'_'.time().'.pdf';
        
        $folder = FCPATH.'uploads/temp/';
        
        if(!is_dir($folder)){
            mkdir($folder,0777,true);
        }
        
        file_put_contents(
            $folder.$file_name,
            $pdf_content
        );
        
        $pdf_url = base_url('uploads/temp/'.$file_name);
        
        
        log_message('error','id de receta '.$pdf_url);
        
        $responseWhatsapp = $this->whatsapp_model->sendWhatsappFile(
            $patient->phone,
            $file_name,
            $pdf_url,
            $file_name,
            'document'
        );
        
        if($responseWhatsapp['status'])
        {
             echo json_encode(['status'=>'success','message'=>'Receta enviada']);
             exit();
        }
       
       echo json_encode(['status'=>'error','message'=>'Hubo un problema al enviar la receta.']);
        exit();
    }
    
    public function uploadMedicine()
    {
        $json = file_get_contents('medicines.json');
        $medicines = json_decode($json, true);
        
        foreach ($medicines as $med) {
        
            $this->db->insert('medicines', [
                'code'           => $med['ID / Código'],
                'name'           => $med['Nombre_real'],
                'description'    => $med['Descripcion'],
                'provider_price' => $med['Precio Proveedor (PVF)'],
                'sale_price'     => $med['Precio Venta (PVP)'],
                'stock'          => $med['Stock']
            ]);
        }
    }
    
    public function search_medicines()
    {
        $term = trim($this->input->get('term'));
    
        if(strlen($term) < 2){
            echo json_encode([]);
            return;
        }
    
        $this->db->select('id,name');
        $this->db->like('name',$term);
        $this->db->limit(20);
    
        echo json_encode(
            $this->db->get('medicines')->result_array()
        );
    }
    
    public function get_dose_suggestions()
    {
        $product_id = (int)$this->input->get('product_id');
    
        if(!$product_id){
            echo json_encode([]);
            return;
        }
    
        $sql = "
            SELECT
                dose,
                COUNT(*) total
            FROM prescription_details
            WHERE product_id = ?
            AND type='med'
            AND dose IS NOT NULL
            AND dose <> ''
            GROUP BY dose
            ORDER BY total DESC
            LIMIT 5
        ";
    
        echo json_encode(
            $this->db
                ->query($sql,[$product_id])
                ->result_array()
        );
    }
    
    public function ajax_recipe($id)
    {
      
    
        $data['prescription'] = $this->crud_model->getPrescription($id);
    
        if (!$data['prescription']) {
            show_404();
        }
    
        $data['details'] = $this->db
            ->order_by('id', 'ASC')
            ->get_where('prescription_details', [
                'prescription_id' => $id
            ])
            ->result_array();
    
        $this->load->view(
            'backend/partials/modals/ajax_recipe',
            $data
        );
    }

    public function ajax_history($patient_id)
    {
       
    
        $data['patient'] = $this->db
            ->where('user_id', $patient_id)
            ->get('user')
            ->row_array();
    
        if (!$data['patient']) {
            show_404();
        }
    
        $data['prescriptions'] = $this->db
            ->where('patient_id', $patient_id)
            ->order_by('created_at', 'DESC')
            ->get('prescription')
            ->result_array();
    
        foreach ($data['prescriptions'] as &$prescription) {
    
            $prescription['details'] = $this->db
                ->order_by('id', 'ASC')
                ->get_where('prescription_details', [
                    'prescription_id' => $prescription['id']
                ])
                ->result_array();
    
        }
    
        $this->load->view(
            'backend/partials/modals/ajax_history',
            $data
        );
    }

}