<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Email_model extends CI_Model 
{
    function __construct() 
    {
      parent::__construct();
    }




    function send_mail_request($to, $subject, $message, $files = [])
    {
        $this->load->library('email');
    
        $config = [
            'protocol'    => 'smtp',
            'smtp_host'   => 'smtp.hostinger.com',
            'smtp_port'   => 465,
            'smtp_user'   => 'notificaciones@ziigo.pro',
            'smtp_pass'   => '?I9v:]!^#/r',
            'smtp_crypto' => 'ssl',
            'mailtype'    => 'html',
            'charset'     => 'utf-8',
            'newline'     => "\r\n",
            'wordwrap'    => TRUE
        ];
    
        $this->email->initialize($config);
    
        $this->email->from('notificaciones@ziigo.pro', 'Notificaciones Ziigo Pro');
        $this->email->to($to);
        $this->email->subject($subject);
        $this->email->message($message);
    
        // ADJUNTOS
        if (!empty($files)) {
            if (is_string($files)) {
                $files = json_decode($files, true);
            }
    
            foreach ($files as $file) {
                $path = FCPATH.'public/email_templates/'.$file;
                if (file_exists($path)) {
                    $this->email->attach($path);
                }
            }
        }
    
        if ($this->email->send()) {
            return true;
        }
    
        log_message('error', $this->email->print_debugger());
        return false;
    }

    
    private function upload_files()
    {
        $uploaded = [];
        $path = FCPATH.'uploads/email_templates/';
    
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
    
        if (!empty($_FILES['files']['name'][0])) {
            $count = count($_FILES['files']['name']);
    
            for ($i = 0; $i < $count; $i++) {
    
                if ($_FILES['files']['error'][$i] !== UPLOAD_ERR_OK) {
                    continue;
                }
    
                $ext = pathinfo($_FILES['files']['name'][$i], PATHINFO_EXTENSION);
                $newName = uniqid('mail_', true).'.'.$ext;
    
                $tmp  = $_FILES['files']['tmp_name'][$i];
                $dest = $path.$newName;
    
                if (move_uploaded_file($tmp, $dest)) {
                    $uploaded[] = $newName;
                }
            }
        }
    
        return $uploaded;
    }


    public function save() {
        $uploaded = $this->upload_files();
        $id = $this->input->post('id');
        $data = [
            'name'      => $this->input->post('name',true),
            'plantilla' => $this->input->post('plantilla'),
            'files'     => json_encode($uploaded)
        ];
        
        if($id == '')
        {
            $this->db->insert('email_templates',$data);
            return 'Agregado correctamente.';
        }else
        {
            $this->db->where('id',$id);
            $this->db->update('email_templates',$data);
            return 'Actualizado correctamente.';
        }
        
    }
    
    public function delete($id) {
      
        
            $this->db->where('id',$id);
            $this->db->delete('email_templates');
            return 'eliminado correctamente.';
        
        
    }
    
    
    




    
}