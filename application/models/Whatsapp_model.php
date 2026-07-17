<?php if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Whatsapp_model extends CI_Model 
{
    function __construct() 
    {
      parent::__construct();
    }
    
    /*   
    function sendWhatsapp($number,$message)
    {
        
            $url = 'https://nuovo.pro/api/qr/rest/send_message';
            $apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJsV3ZqNksweEkwRmxTS0pveVY3YWs5RE4wbXp2S0pLOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc1ODQzMzkwfQ.P05ChMzPqUzBc1hArIm0TCrRjs9eloJLMsCA9uNxlFs';
            
         
            
            $data = [
                'messageType' => 'text',
                'requestType' => 'POST',
                'token'       => $apiKey,
                'from'        => '+50238820241',
                'to'          => $number,
                'text'        => $message
            ];
            
            $headers = [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey
            ];
            
            $ch = curl_init($url);
            
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_TIMEOUT => 30,
            ]);
            
            $response = curl_exec($ch);
            
            if (curl_errno($ch)) {
                $error = curl_error($ch);
                curl_close($ch);
            
                return json_encode([
                    'status'  => false,
                    'message' => $error
                ]);
            }
            
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            curl_close($ch);
            
            $data_response = json_decode($response, true);
            
            if ($httpCode >= 200 && $httpCode < 300 && !empty($data_response['success'])) {
            
                return json_encode([
                    'status'  => true,
                    'message' => $data_response['response']['message'] ?? 'Mensaje enviado correctamente.'
                ]);
            
            }
            
            return json_encode([
                'status'  => false,
                'message' => $data_response['message']
            ]);
                      

    }  
    
    
    function sendWhatsappFile($number, $message, $file, $filename = 'Promo.png',$type='image')
    {
        
            $url = 'https://nuovo.pro/api/qr/rest/send_message';
            $apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJsV3ZqNksweEkwRmxTS0pveVY3YWs5RE4wbXp2S0pLOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc1ODQzMzkwfQ.P05ChMzPqUzBc1hArIm0TCrRjs9eloJLMsCA9uNxlFs';
            
         
            
            $data = [
                'messageType' => 'text',
                'requestType' => 'POST',
                'token'       => $apiKey,
                'from'        => '+50238820241',
                'to'          => $number,
                'text'        => $message
            ];
            
            $headers = [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey
            ];
            
            $ch = curl_init($url);
            
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_TIMEOUT => 30,
            ]);
            
            $response = curl_exec($ch);
            
            if (curl_errno($ch)) {
                $error = curl_error($ch);
                curl_close($ch);
            
                return json_encode([
                    'status'  => false,
                    'message' => $error
                ]);
            }
            
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            curl_close($ch);
            
            $data_response = json_decode($response, true);
            
            if ($httpCode >= 200 && $httpCode < 300 && !empty($data_response['success'])) {
            
                return json_encode([
                    'status'  => true,
                    'message' => $data_response['response']['message'] ?? 'Mensaje enviado correctamente.'
                ]);
            
            }
            
            return json_encode([
                'status'  => false,
                'message' => $data_response['message']
            ]);
                      
    }  
    */
    
    function sendWhatsapp($number,$message,$sender = 'Francisco')
    {
        
            $url = 'https://evolution-api-l1qi.srv1795502.hstgr.cloud/message/sendText/'.$sender;
            $apiKey = '8rZxPmuBaAfXTusKfQIn4P8vC3lrT2qR';
            
            if($number == '47358248')
            {
                $number = '502'.$number;
                
            } 
            
            // Reemplaza estas variables con los valores reales
            $data = [
                'number' => $number,
                'options' => [
                    'delay' => 123,
                    'presence' => 'composing',
                    'linkPreview' => true,
                    'quoted' => [
                        'key' => [
                            'remoteJid' => '<string>',
                            'fromMe' => true,
                            'id' => '<string>',
                            'participant' => '<string>'
                        ],
                        'message' => [
                            'conversation' => '<string>'
                        ]
                    ],
                    'mentions' => [
                        'everyOne' => true,
                        'mentioned' => ['<string>']
                    ]
                ],
                'text' => $message
            ];
            
            $headers = [
                'Content-Type: application/json',
                'apikey: ' . $apiKey
            ];
            
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_POSTFIELDS => json_encode($data),
            ]);
            
            $response = curl_exec($ch);
            
            $data_response = json_decode($response, true);
            
            if ($data_response['status'] != 'PENDING' ) {
                log_message('error','cURL Error: ' . curl_error($ch)); 
                return // --- RESPUESTA JSON ---
                     [
                        'status' => false,
                        'messaje' => $data_response['status'].' '.json_encode($data_response['response']['message'])
                    ];
            } else {
                log_message('error',$response);
                return [
                        'status' => true,
                        'messaje' => $response
                    ];
            }
            curl_close($ch);

    }   
    
    function sendWhatsappFile($number, $message, $file, $filename = 'Promo.png',$type='image')
    {
        $file = $file . '?v=' . time(); // 🔥 rompe cache
    
        $url = 'https://evolution-api-l1qi.srv1795502.hstgr.cloud/message/sendMedia/Francisco';
        $apiKey = '8rZxPmuBaAfXTusKfQIn4P8vC3lrT2qR';
    
        $number = ltrim($number, '0');
    
     
        $data = [
            'number' => $number,
            'mediatype' => $type,
            'caption' => $message,
            'media' => $file,
            'fileName' => $filename
        ];
    
        $headers = [
            "Content-Type: application/json",
            "apikey: $apiKey"
        ];
    
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_SLASHES),
        ]);
    
        $response = curl_exec($ch);
            
        $data_response = json_decode($response, true);
        
        if ($data_response['status'] != 'PENDING' ) {
            log_message('error','cURL Error: ' . $response); 
            return // --- RESPUESTA JSON ---
                 [
                    'status' => false,
                    'messaje' => $data_response['status'].' '.json_encode($data_response['response']['message'])
                ];
        } else {
            log_message('error',$response);
            return [
                    'status' => true,
                    'messaje' => $response
                ];
        }
        curl_close($ch);
    }
    
    
  
 
       
}