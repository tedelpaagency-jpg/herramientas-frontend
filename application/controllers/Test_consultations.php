<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Test_consultations extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Consultations_model');
        $this->load->database();
    }

    public function test()
    {
        // Let's get the first agency_id in the database to run our tests with
        $row = $this->db->get('medical_consultations', 1)->row();
        if (!$row) {
            echo "No consultations found in the database. Creating one for testing...\n";
            // Create a test consultation
            $agency = $this->db->get('user')->row();
            if (!$agency) {
                echo "No users found in user table either.\n";
                return;
            }
            $agency_id = $agency->agency_id;
            // Let's check if there is an active patient
            $patient = $this->db->get_where('user', ['rol_id' => 8], 1)->row();
            if (!$patient) {
                echo "No patient (rol_id = 8) found in user table. Creating user...\n";
                $this->db->insert('user', [
                    'agency_id' => $agency_id,
                    'rol_id' => 8,
                    'name' => 'Test',
                    'last_name' => 'Patient',
                    'status' => 1
                ]);
                $patient_id = $this->db->insert_id();
            } else {
                $patient_id = $patient->user_id;
            }
            
            $this->db->insert('medical_consultations', [
                'agency_id' => $agency_id,
                'patient_id' => $patient_id,
                'consultation_date' => date('Y-m-d H:i:s'),
                'chief_complaint' => 'Dolor de cabeza severo',
                'diagnosis' => 'Migraña',
                'treatment' => 'Ibuprofeno 400mg',
                'status' => 1
            ]);
            $row = $this->db->get('medical_consultations', 1)->row();
        }

        $agency_id = $row->agency_id;
        echo "Testing with Agency ID: $agency_id\n";

        echo "\n1. Test without filters:\n";
        $res = $this->Consultations_model->get_consultations_filtered($agency_id, [], 5, 0);
        echo "Total: " . $res['total'] . "\n";
        print_r($res['rows']);

        echo "\n2. Test with search (Migraña):\n";
        $res_search = $this->Consultations_model->get_consultations_filtered($agency_id, ['search' => 'Migraña'], 5, 0);
        echo "Total search results: " . $res_search['total'] . "\n";
        print_r($res_search['rows']);

        echo "\n3. Test with non-matching search:\n";
        $res_empty = $this->Consultations_model->get_consultations_filtered($agency_id, ['search' => 'XYZ999'], 5, 0);
        echo "Total non-matching search results: " . $res_empty['total'] . "\n";

        echo "\nAll query tests completed successfully!\n";
    }
}
