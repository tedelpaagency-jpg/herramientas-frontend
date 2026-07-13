<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Appointments_model extends CI_Model 
{
    function __construct() 
    {
        parent::__construct();
        $this->run_auto_migrations();
    }

    private function run_auto_migrations()
    {
        if (!$this->db->field_exists('cancel_reason', 'appointments')) {
            $this->db->query("ALTER TABLE appointments ADD COLUMN cancel_reason VARCHAR(255) DEFAULT NULL");
        }
        if (!$this->db->field_exists('cancelled_by', 'appointments')) {
            $this->db->query("ALTER TABLE appointments ADD COLUMN cancelled_by INT(11) DEFAULT NULL");
        }
        if (!$this->db->field_exists('cancelled_at', 'appointments')) {
            $this->db->query("ALTER TABLE appointments ADD COLUMN cancelled_at DATETIME DEFAULT NULL");
        }
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
        // Handle backward compatibility for the portal controller passing $filters as the first parameter
        if (is_array($agency_id)) {
            $offset = $limit;
            $limit = $filters;
            $filters = $agency_id;
            $agency_id = $this->session->userdata('current_agency');
        }

        if (empty($agency_id)) {
            $agency_id = $this->session->userdata('current_agency');
        }

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
            appointments.cancel_reason,
            appointments.cancelled_by,
            appointments.cancelled_at,

            patients.name,
            patients.last_name,

            doctors.name AS doctor_name,
            doctors.last_name AS doctor_last_name
        ");

        $this->db->from('appointments');

        $this->db->join('user patients', 'patients.user_id = appointments.patient_id');
        $this->db->join('user doctors', 'doctors.user_id = appointments.doctor_id', 'left');

        $this->db->where('appointments.agency_id', $agency_id);

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
        // NOMBRE (FILTRO AVANZADO)
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

        if (!empty($filters['status']) && $filters['status'] != 'all') {
            $this->db->where('appointments.status', $filters['status']);
        }

        // ===========================
        // DOCTOR / PACIENTE
        // ===========================

        if (!empty($filters['doctor_id'])) {
            $this->db->where('appointments.doctor_id', $filters['doctor_id']);
        }

        if (!empty($filters['patient_id'])) {
            $this->db->where('appointments.patient_id', $filters['patient_id']);
        }

        // ===========================
        // FECHAS
        // ===========================

        if (!empty($filters['date'])) {
            $this->db->where('appointments.appointment_date', $filters['date']);
        }

        if (!empty($filters['date_from'])) {
            $this->db->where('appointments.appointment_date >=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $this->db->where('appointments.appointment_date <=', $filters['date_to']);
        }

        if (!empty($filters['day'])) {
            $this->db->where('DAY(appointments.appointment_date)', $filters['day']);
        }

        if (!empty($filters['month'])) {
            $this->db->where('MONTH(appointments.appointment_date)', $filters['month']);
        }

        if (!empty($filters['year'])) {
            $this->db->where('YEAR(appointments.appointment_date)', $filters['year']);
        }

        // ===========================
        // TOTAL REGISTROS
        // ===========================

        $count_db = clone $this->db;

        $total = $count_db
            ->select('COUNT(DISTINCT appointments.id) AS total', false)
            ->get()
            ->row()
            ->total;

        unset($count_db);

        // ===========================
        // ORDEN
        // ===========================

        $allowed_order_cols = [
            'id' => 'appointments.id',
            'patient_id' => 'appointments.patient_id',
            'doctor_id' => 'appointments.doctor_id',
            'appointment_date' => 'appointments.appointment_date',
            'appointment_time' => 'appointments.appointment_time',
            'duration_minutes' => 'appointments.duration_minutes',
            'status' => 'appointments.status'
        ];

        $order_by = 'appointments.appointment_date';

        if (!empty($filters['order_by']) && isset($allowed_order_cols[$filters['order_by']])) {
            $order_by = $allowed_order_cols[$filters['order_by']];
        }

        $order = 'ASC';

        if (!empty($filters['order']) && in_array(strtoupper($filters['order']), ['ASC', 'DESC'])) {
            $order = strtoupper($filters['order']);
        }

        $this->db->order_by($order_by, $order);

        if ($order_by === 'appointments.appointment_date') {
            $this->db->order_by('appointments.appointment_time', $order);
        }

        // ===========================
        // PAGINACIÓN
        // ===========================

        $mode = isset($filters['mode']) ? $filters['mode'] : 'list';

        if ($mode == 'list' && $limit !== null) {
            $this->db->limit($limit, $offset);
        }

        $rows = $this->db->get()->result_array();

        return [
            'total' => (int)$total,
            'page' => isset($filters['page']) ? (int)$filters['page'] : 1,
            'per_page' => $limit,
            'last_page' => $limit ? ceil($total / $limit) : 1,
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

    public function get_details_by_id($id, $agency_id = null)
    {
        $this->db->select('
            appointments.*,
            patient.name as patient_name,
            patient.last_name as patient_last_name,
            patient.email as patient_email,
            patient.phone as patient_phone,
            doctor.name as doctor_name,
            doctor.last_name as doctor_last_name,
            doctor.email as doctor_email
        ');
        $this->db->from('appointments');
        $this->db->join('user patient', 'patient.user_id = appointments.patient_id', 'left');
        $this->db->join('user doctor', 'doctor.user_id = appointments.doctor_id', 'left');
        $this->db->where('appointments.id', $id);
        if ($agency_id !== null) {
            $this->db->where('appointments.agency_id', $agency_id);
        }
        return $this->db->get()->row_array();
    }

    public function check_conflict($doctor_id, $patient_id, $date, $time, $duration_minutes, $exclude_id = null)
    {
        // Calculate new appointment end time
        $end_time = date('H:i:s', strtotime("$time + $duration_minutes minutes"));

        // 1. Check doctor conflict
        $this->db->group_start();
        $this->db->where('appointment_date', $date);
        $this->db->where('doctor_id', $doctor_id);
        $this->db->where('status !=', 4); // Exclude cancelled appointments
        if ($exclude_id !== null) {
            $this->db->where('id !=', $exclude_id);
        }
        $this->db->where('appointment_time <', $end_time);
        $this->db->where("ADDTIME(appointment_time, SEC_TO_TIME(duration_minutes * 60)) >", $time);
        $this->db->group_end();
        $doctor_conflict = $this->db->count_all_results('appointments') > 0;

        if ($doctor_conflict) {
            return 'doctor';
        }

        // 2. Check patient conflict
        $this->db->group_start();
        $this->db->where('appointment_date', $date);
        $this->db->where('patient_id', $patient_id);
        $this->db->where('status !=', 4); // Exclude cancelled appointments
        if ($exclude_id !== null) {
            $this->db->where('id !=', $exclude_id);
        }
        $this->db->where('appointment_time <', $end_time);
        $this->db->where("ADDTIME(appointment_time, SEC_TO_TIME(duration_minutes * 60)) >", $time);
        $this->db->group_end();
        $patient_conflict = $this->db->count_all_results('appointments') > 0;

        if ($patient_conflict) {
            return 'patient';
        }

        return false;
    }

    public function cancel($id, $data)
    {
        return $this->db
            ->where('id', $id)
            ->update('appointments', [
                'status' => 4,
                'cancel_reason' => $data['cancel_reason'],
                'cancelled_by' => $data['cancelled_by'],
                'cancelled_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
    }
    
}