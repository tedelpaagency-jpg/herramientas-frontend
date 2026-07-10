<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Appointments_model extends CI_Model 
{
    function __construct() 
    {
      parent::__construct();
    }
    
    public function get_all($agency_id)
    {
        return $this->db
            ->select('
                appointments.*,
                patient.name as patient_name,
                patient.last_name as patient_last_name,
                doctor.name as doctor_name,
                doctor.last_name as doctor_last_name
            ')
            ->from('appointments')
            ->join('user patient','patient.user_id = appointments.patient_id','left')
            ->join('user doctor','doctor.user_id = appointments.doctor_id','left')
            ->where('appointments.agency_id',$agency_id)
            ->order_by('appointment_date','DESC')
            ->order_by('appointment_time','DESC')
            ->get()
            ->result_array();
    }
    
    public function getAppointments($agency_id, $filters = [], $limit = null, $offset = 0)
    {
        $this->db->select("
            appointments.id,
            appointments.patient_id,
            appointments.doctor_id,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.duration_minutes,
            appointments.reason,
            appointments.status,
            appointments.notes,
    
            patients.name,
            patients.last_name,
    
            doctors.name AS doctor_name,
            doctors.last_name AS doctor_last_name
        ");
    
        $this->db->from('appointments');
    
        $this->db->join('user patients', 'patients.user_id = appointments.patient_id');
        $this->db->join('user doctors', 'doctors.user_id = appointments.doctor_id', 'left');
    
        $this->db->where('appointments.agency_id', $this->session->userdata('current_agency'));
    
        // ===========================
        // BÚSQUEDA
        // ===========================
    
        if (!empty($filters['search'])) {
    
            $search = trim($filters['search']);
    
            $this->db->group_start();
    
            $this->db->like('patients.name', $search);
            $this->db->or_like('patients.last_name', $search);
            $this->db->or_like("CONCAT(patients.name,' ',patients.last_name)", $search);
    
            $this->db->group_end();
        }
    
        // ===========================
        // NOMBRE
        // ===========================
    
        if (!empty($filters['name'])) {
    
            $name = trim($filters['name']);
    
            $this->db->group_start();
    
            $this->db->like('patients.name', $name);
            $this->db->or_like('patients.last_name', $name);
            $this->db->or_like("CONCAT(patients.name,' ',patients.last_name)", $name);
    
            $this->db->group_end();
        }
    
        // ===========================
        // ESTADO
        // ===========================
    
        if (!empty($filters['status']) && $filters['status'] != 'all')
        {
            $this->db->where('appointments.status', $filters['status']);
        }
    
        // ===========================
        // DÍA
        // ===========================
    
        if (!empty($filters['day'])) {
    
            $this->db->where('DAY(appointments.appointment_date)', $filters['day']);
    
        }
    
        // ===========================
        // MES
        // ===========================
    
        if (!empty($filters['month'])) {
    
            $this->db->where('MONTH(appointments.appointment_date)', $filters['month']);
    
        }
    
        // ===========================
        // AÑO
        // ===========================
    
        if (!empty($filters['year'])) {
    
            $this->db->where('YEAR(appointments.appointment_date)', $filters['year']);
    
        }
    
        // ===========================
        // TOTAL REGISTROS
        // ===========================
    
        $total = $this->db->count_all_results('', FALSE);
    
        // ===========================
        // ORDEN
        // ===========================
    
        $this->db->order_by('appointments.appointment_date', 'ASC');
        $this->db->order_by('appointments.appointment_time', 'ASC');
    
        // ===========================
        // PAGINACIÓN SOLO EN LISTA
        // ===========================
    
        if ($filters['mode'] == 'list' && $limit !== null) {
    
            $this->db->limit($limit, $offset);
    
        }
    
        $rows = $this->db->get()->result_array();
        
        return [
            'total' => $total,
            'page' => isset($filters['page']) ? (int)$filters['page'] : 1,
            'per_page' => $limit,
            'last_page' => ($limit) ? ceil($total / $limit) : 1,
            'rows' => $rows
        ];
    }
        

    public function get_by_id($id)
    {
        return $this->db
            ->where('id',$id)
            ->get('appointments')
            ->row_array();
    }

    public function create($data)
    {
        $this->db->insert('appointments',$data);
        return $this->db->insert_id();
    }

    public function update($id,$data)
    {
        return $this->db
            ->where('id',$id)
            ->update('appointments',$data);
    }

    public function delete($id)
    {
        return $this->db
            ->where('id',$id)
            ->update('appointments',[
                'status' => 4
            ]);
    }
    
    public function updateStatus($id, $status)
    {
        $this->db->where('id', $id);
        $this->db->where('status !=', 0); // evita eliminados
    
        return $this->db->update('appointments', [
            'status' => $status,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }
    
}