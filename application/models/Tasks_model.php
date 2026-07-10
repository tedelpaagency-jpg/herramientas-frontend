<?php if (!defined('BASEPATH'))
    exit('No direct script access allowed');


class Tasks_model extends CI_Model 
{
    function __construct() 
    {
      parent::__construct();
    }

    public function getAppointmentsOfDay() {
        $date = date('Y-m-d');
        return $this->db->where('date', $date)->order_by('time', 'ASC')->get('tasks')->result();
    }
    
    public function getServices() {
        return $this->db->get('services')->result();
    }
    
    public function getPatients() {
        return $this->db->get('patients')->result();
    }
    
    public function checkAvailability($doctor_id, $date, $time) {
        $appointment = $this->db->where('doctor_id', $doctor_id)
                         ->where('date', $date)
                         ->where('time', $time)
                         ->get('tasks')
                         ->row();
        return empty($appointment);
    }
    
    public function scheduleTasks() {
        
        if($this->input->post('patient_id') == 'New')
        {
            $data = array(
                'name'      => $this->input->post('name'),
                'last_name' => $this->input->post('last_name'),
                'email'     => $this->input->post('email'),
                'phone'     => $this->input->post('phone'),
                'user_id'       =>$this->session->userdata('login_user_id'),
                'user_type'     =>'user',
                'pais_id'       =>$this->session->userdata('current_country'),
                'agency_id'     =>$this->session->userdata('current_agency'),
                );
                
                $this->db->insert('client', $data);
                $patient_id = $this->db->insert_id();
        }else {
                $patient_id = $this->input->post('patient_id');
        }
        
        $date_event = $this->input->post('date'); // ej: 2025-08-15
        $time_event = $this->input->post('time'); // ej: 14:30
        
        // Combinar fecha y hora en datetime
        $fecha_evento = date('Y-m-d H:i:s', strtotime("$date_event $time_event"));
        
        // ¿El usuario quiere recordatorio?
        $reminder_enabled = $this->input->post('reminder');
        $reminder_offset  = $this->input->post('reminder_offset'); // "-1 hours" o "-2 days"
        
        if ($reminder_enabled && $reminder_offset) {
            // Calcular fecha del recordatorio usando strtotime con el offset
            $fecha_recordatorio = date('Y-m-d H:i:s', strtotime($reminder_offset, strtotime($fecha_evento)));
        } else {
            $fecha_recordatorio = null; // no hay recordatorio
        }
        
        $data = array(
            
                'name'          =>$this->input->post('task_name'),
                'user_id'       =>$this->session->userdata('login_user_id'),
                'user_type'     =>'user',
                'patient_id'    =>$patient_id,
                'date'          =>$this->input->post('date'),
                'reminder'      =>$this->input->post('reminder') != '' ? 1 : 0,
                'reminder_offset' =>$this->input->post('reminder_offset'),
                'reminder_date' =>$fecha_recordatorio,
                'time'          =>$this->input->post('time'),
                'notes'         =>$this->input->post('notes'),
                'status'        =>0
            
            );
        
        if($this->input->post('id') == '')
        {
            return $this->db->insert('tasks', $data);
        }
        else
        {
            $this->db->where('id',$this->input->post('id'));
            return $this->db->update('tasks', $data);
        }
        
        
       
    }
    
       public function save() {
        $appointment_id = $this->input->post('appointment_id');
       
        $details = $this->input->post('details');
        $date = $this->input->post('date');
        $status = 1;

       // Procesar imágenes con move_uploaded_file
        $uploaded_images = [];
        $upload_path = './public/tasks/'; // Ruta de almacenamiento
        
        if (!empty($_FILES['images']['name'][0])) {
            if (!is_dir($upload_path)) {
                mkdir($upload_path, 0777, true); // Crear la carpeta si no existe
            }
        
            foreach ($_FILES['images']['name'] as $key => $image) {
                $file_tmp = $_FILES['images']['tmp_name'][$key];
                $file_ext = pathinfo($image, PATHINFO_EXTENSION);
                $file_name = time() . '_' . uniqid() . '.' . $file_ext; // Nombre único
                $destination = $upload_path . $file_name;
        
                if (move_uploaded_file($file_tmp, $destination)) {
                    $uploaded_images[] = 'public/tasks/' . $file_name;
                }
            }
        }

        // Guardar en la base de datos
        $data = [
            'appointment_id' => $appointment_id,
            'doctor_id' => $this->session->userdata('login_user_id'),
            'details' => $details,
            'patient_id' => $this->input->post('patient_id'),
            'date' => $date,
            'images' => json_encode($uploaded_images),
            'status' => $status
        ];

        return $this->db->insert('appointment_details', $data);
    }
    
       function confirmTask($id)
    {
        $data = array(
            'status'            => 1,
            
        );
        
        /* 
        $appointment = $this->db->get_where('tasks',['id'=>$sale_id])->row_array();
        $service = $this->db->get_where('productos',['id'=>$appointment['service_id']])->row_array();
        $patient = $this->db->get_where('patient',['patient_id'=>$appointment['patient_id']])->row_array();
        $doctor  = $this->db->get_where('user',['user_id'=>$appointment['doctor_id']])->row_array();
        $admin   = $this->db->get_where('user',['user_id'=>1])->row_array();
        
        $msg1 = 'Hola '.$patient['name'].', tu cita para *'.$service['name'].'* a sido confirmada para el día *'.$appointment['date'].'* a las *'.$appointment['time'].'* con '.$doctor['name'].' '.$doctor['last_name'];
        
        $msg2 = 'Hola '.$doctor['name'].', se te ha confirmado una cita para *'.$service['name'].'* el día *'.$appointment['date'].'* a las *'.$appointment['time'].'* con '.$patient['name'].' '.$patient['last_name'];
        
        $msg3 = 'Hola '.$doctor['name'].', se ha confirmado una cita para *'.$service['name'].'* el día *'.$appointment['date'].'* a las *'.$appointment['time'].'* con el Cliente '.$patient['name'].' '.$patient['last_name'].' con el Agente: *'.$doctor['name'].' '.$doctor['last_name'].'*';
        
        $this->whatsapp_model->sendWhatsapp($patient['phone'],$msg1);
        sleep(5);
        $this->whatsapp_model->sendWhatsapp($doctor['phone'], $msg2);
        sleep(5);
        $this->whatsapp_model->sendWhatsapp($admin['phone'],  $msg3);
        */ 
        
        $this->db->where('id', $id);
        $this->db->update('tasks', $data);
        
        return 1;
    }
    
     function cancelTask($id)
    {
        $data = array(
            'status'            => 2,
        );
        
        $this->db->where('id', $id);
        $this->db->update('tasks', $data);
        
        return 1;
    }
    
    
    function countAppointments($date, $status)
    {
        $apps = 0;
       
        if($status == 'T')
            $apps = $this->db->get_where('tasks',['date'=>$date])->num_rows();
        else
         $apps = $this->db->get_where('tasks',['date'=>$date,'status'=>$status])->num_rows();
        
        return $apps;
    }
}
