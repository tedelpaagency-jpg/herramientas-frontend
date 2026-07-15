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
        // Let's get the first active consultation in the database
        $row = $this->db->get_where('medical_consultations', ['status' => 1], 1)->row();
        if (!$row) {
            echo "No consultations found.\n";
            return;
        }

        $consultation_id = $row->id;
        $agency_id = $row->agency_id;

        echo "Testing get_clinical_records_by_consultation for consultation ID: $consultation_id (Agency: $agency_id)\n";

        $records = $this->Consultations_model->get_clinical_records_by_consultation($consultation_id, $agency_id);

        echo "Result:\n";
        print_r($records);

        echo "\nAll clinical records query tests completed successfully!\n";
    }
}
