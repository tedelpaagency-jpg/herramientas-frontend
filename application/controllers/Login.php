<?php if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Login extends CI_Controller 
{
    function __construct() 
    {
        parent::__construct();
        $this->load->model('crud_model');
        $this->load->database();
        $this->load->library('session');
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 2010 05:00:00 GMT");
    }

    
    ///////////////////////////
    
    public function index() 
    {
        if($this->session->userdata('login_user_id') == '' )
        {
            $this->load->view('backend/login');
        }else
        {
            
            redirect(base_url().'portal/feed','refresh');
        }
    }
    
    public function reset_password() 
    {
        $this->load->view('backend/reset_password');
    }
    
    public function login() 
    {
        $this->load->view('backend/getRUC');
    }
    
    

    function clear_cache()
    {
        $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate, no-transform, max-age=0, post-check=0, pre-check=0");
        $this->output->set_header("Pragma: no-cache");
    }
    
    function getBrowser() 
    {
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $browser        = "Unknown Browser";
        $browser_array = array(
            '/msie/i'      => 'Internet Explorer',
            '/firefox/i'   => 'Firefox',
            '/safari/i'    => 'Safari',
            '/chrome/i'    => 'Chrome',
            '/edge/i'      => 'Edge',
            '/opera/i'     => 'Opera',
            '/netscape/i'  => 'Netscape',
            '/maxthon/i'   => 'Maxthon',
            '/konqueror/i' => 'Konqueror',
            '/mobile/i'    => 'Handheld Browser'
        );
        foreach ($browser_array as $regex => $value)
            if (preg_match($regex, $user_agent))
                $browser = $value;
                return $browser;
    }
        
    function getOS() 
    { 
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $os_platform  = "Unknown OS Platform";
        $os_array     = array(
            '/windows nt 10/i'      =>  'Windows 10',
            '/windows nt 6.3/i'     =>  'Windows 8.1',
            '/windows nt 6.2/i'     =>  'Windows 8',
            '/windows nt 6.1/i'     =>  'Windows 7',
            '/windows nt 6.0/i'     =>  'Windows Vista',
            '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
            '/windows nt 5.1/i'     =>  'Windows XP',
            '/windows xp/i'         =>  'Windows XP',
            '/windows nt 5.0/i'     =>  'Windows 2000',
            '/windows me/i'         =>  'Windows ME',
            '/win98/i'              =>  'Windows 98',
            '/win95/i'              =>  'Windows 95',
            '/win16/i'              =>  'Windows 3.11',
            '/macintosh|mac os x/i' =>  'Mac OS X',
            '/mac_powerpc/i'        =>  'Mac OS 9',
            '/linux/i'              =>  'Linux',
            '/ubuntu/i'             =>  'Ubuntu',
            '/iphone/i'             =>  'iPhone',
            '/ipod/i'               =>  'iPod',
            '/ipad/i'               =>  'iPad',
            '/android/i'            =>  'Android',
            '/blackberry/i'         =>  'BlackBerry',
            '/webos/i'              =>  'Mobile'
        );
        foreach ($os_array as $regex => $value)
            if (preg_match($regex, $user_agent))
                $os_platform = $value;
            return $os_platform;
    }
    
    function ip_details($ip) {
        $user_ip = getenv('REMOTE_ADDR');
            $geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));
            $country = $geo["geoplugin_countryName"];
            $city = $geo["geoplugin_city"];
            return $city;
    }

    function newpassword($email , $password)
    {
        require("class.phpmailer.php");
        $email_sub  = get_phrase('recover_your_password');
        $email_msg  = get_phrase('success_password')."<br>";
        $email_msg  .= get_phrase('new_password').": <b>". $password ."<b/><br>.";
        $data = array(
            'email_msg' => $email_msg
        );
        $mail = new PHPMailer(); 
        $mail->IsHTML(true);
        $mail->IsMail();
        $mail->SetFrom($this->db->get_where('settings', array('type' => 'system_email'))->row()->description, $this->db->get_where('settings', array('type' => 'system_name'))->row()->description);
        $mail->Subject = $email_sub;
        $mail->Body = $this->load->view('backend/mails/notify.php',$data,TRUE);
        $mail->AddAddress($email);
        if(!$mail->Send()) 
        {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }
    }


    function get_client_ip()
        {
            $ipaddress = '';
            if (isset($_SERVER['HTTP_CLIENT_IP'])) {
                $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
            } else if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else if (isset($_SERVER['HTTP_X_FORWARDED'])) {
                $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
            } else if (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
                $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
            } else if (isset($_SERVER['HTTP_FORWARDED'])) {
                $ipaddress = $_SERVER['HTTP_FORWARDED'];
            } else if (isset($_SERVER['REMOTE_ADDR'])) {
                $ipaddress = $_SERVER['REMOTE_ADDR'];
            } else {
                $ipaddress = 'UNKNOWN';
            }
            return $ipaddress;
        }

    function auth() 
    {
        $username = $this->input->post('username');
        $password = $this->input->post('password');
        
        $auth_result = $this->crud_model->check_login($username, $password);
     
        if ($auth_result) 
        {
                $row = $auth_result['user'];
                $rol = $auth_result['rol'];
                
                $this->session->set_userdata('user_login', 1);
                $this->session->set_userdata('rol_id', $row->rol_id);
                $this->session->set_userdata('login_user_id', $row->user_id);
                $this->session->set_userdata('login_type', $rol->rol);
                $this->session->set_userdata('login_name', $rol->name);
                $this->session->set_userdata('current_company', $row->company_id);
                $this->session->set_userdata('current_country', $row->pais_id);
                $this->session->set_userdata('current_agency', $row->agency_id);
                
                $user_os        = $this->getOS();
                $user_browser   = $this->getBrowser();
                
                $insert_info = '';
                $bitacora['user_id'] = $row->user_id;
                $bitacora['user_type'] = $rol->rol;
                $bitacora['datetime'] = date('Y-m-d H:i:s');
                $bitacora['description'] = $insert_info;
                $this->db->insert('binnacle', $bitacora);
    
                  // Respuesta JSON
                header('Content-Type: application/json');
                echo json_encode([
                        'status'  => 'success',
                        'message' => 'Credenciales correctas',
                        'redirect'=>  $rol->inicio
                    ]);
       
                
                exit();
        }
        
                 header('Content-Type: application/json');
                echo json_encode([
                        'status'  => 'error',
                        'message' => 'Credenciales inválidas'
                    ]);
       
                
                exit();
    }



    function lost_password($param1 = '', $param2 = '')
    {
        if($param1 == 'recovery')
        {
            $email  = $_POST["field"];
            $reset_account_type = '';
            $new_password = substr( md5( rand(100000000,20000000000) ) , 0,7);
            $new_hashed_password    =   sha1($new_password);
            $query = $this->db->get_where('admin' , array('email' => $email));
            if ($query->num_rows() > 0) 
            {
                $this->db->where('email' , $email);
                $this->db->update('admin' , array('password' =>     $new_hashed_password));
                $this->newpassword($email , $new_password);
            }
            $query = $this->db->get_where('teacher' , array('email' => $email));
            if ($query->num_rows() > 0) 
            {
                $this->db->where('email' , $email);
                $this->db->update('teacher' , array('password' => $new_hashed_password));

                $this->newpassword($email , $new_password);
            }
            $query = $this->db->get_where('parent' , array('email' => $email));
            if ($query->num_rows() > 0) 
            {
                $this->db->where('email' , $email);
                $this->db->update('parent' , array('password' => $new_hashed_password));
                $this->newpassword($email , $new_password);
            }
            $query = $this->db->get_where('student' , array('email' => $email));
            if ($query->num_rows() > 0) 
            {
                $this->db->where('email' , $email);
                $this->db->update('student' , array('password' => $new_hashed_password));
                $this->newpassword($email , $new_password);
            }
            $query = $this->db->get_where('accountant' , array('email' => $email));
            if ($query->num_rows() > 0) 
            {
                $this->db->where('email' , $email);
                $this->db->update('accountant' , array('password' => $new_hashed_password));
                $this->newpassword($email , $new_password);
            }
            $query = $this->db->get_where('librarian' , array('email' => $email));
            if ($query->num_rows() > 0) 
            {
                $this->db->where('email' , $email);
                $this->db->update('librarian' , array('password' => $new_hashed_password));
                $this->newpassword($email , $new_password);
            }
            $this->session->set_flashdata('success_recovery', '1');
            redirect(base_url(), 'refresh'); 
        }
        $this->load->view('backend/lost');
    }
     
    function forgot_password() 
    { 
        $this->load->view('backend/forgot_password');

    }

    function logout() 
    { 
        
            
        $this->session->sess_destroy();
        $this->session->set_flashdata('logout_notification', 'logged_out');
        redirect(base_url(), 'refresh');
    }
}