<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Test_db extends CI_Controller {
    public function index() {
        $this->load->database();
        echo "--- agency_rewards ---\n";
        $fields1 = $this->db->field_data('agency_rewards');
        foreach ($fields1 as $f) {
            echo "{$f->name} ({$f->type})\n";
        }

        echo "\n--- points ---\n";
        $fields2 = $this->db->field_data('points');
        foreach ($fields2 as $f) {
            echo "{$f->name} ({$f->type})\n";
        }
    }
}
