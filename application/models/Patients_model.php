<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Patients_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Count patients matching optional search and agency filters.
     *
     * @param string|null $search
     * @param int|null $agency_id
     * @return int
     */
    public function get_patients_count($search = null, $agency_id = null)
    {
        $this->db->from('user');
        $this->db->where('rol_id', 8);
        $this->db->where('status !=', 0);

        if ($agency_id !== null) {
            $this->db->where('agency_id', $agency_id);
        }

        if (!empty($search)) {
            $this->db->group_start();
            $this->db->like('name', $search);
            $this->db->or_like('last_name', $search);
            $this->db->group_end();
        }

        return $this->db->count_all_results();
    }

    /**
     * Get a paginated list of patients with optional search and agency filters.
     *
     * @param int $limit
     * @param int $offset
     * @param string|null $search
     * @param int|null $agency_id
     * @return array
     */
    public function get_patients($limit, $offset, $search = null, $agency_id = null)
    {
        $this->db->from('user');
        $this->db->where('rol_id', 8);
        $this->db->where('status !=', 0);

        if ($agency_id !== null) {
            $this->db->where('agency_id', $agency_id);
        }

        if (!empty($search)) {
            $this->db->group_start();
            $this->db->like('name', $search);
            $this->db->or_like('last_name', $search);
            $this->db->group_end();
        }

        $this->db->order_by('user_id', 'DESC');
        $this->db->limit($limit, $offset);

        return $this->db->get()->result();
    }

    /**
     * Get patient details by ID.
     *
     * @param int $patient_id
     * @param int|null $agency_id
     * @return array|null
     */
    public function get_patient_by_id($patient_id, $agency_id = null)
    {
        $this->db->from('user');
        $this->db->where('user_id', $patient_id);
        $this->db->where('rol_id', 8);
        $this->db->where('status !=', 0);

        if ($agency_id !== null) {
            $this->db->where('agency_id', $agency_id);
        }

        return $this->db->get()->row_array();
    }

    /**
     * Search patients by name (up to $limit results).
     *
     * @param string $search
     * @param int $limit
     * @param int|null $agency_id
     * @return array
     */
    public function search_patients($search, $limit = 10, $agency_id = null)
    {
        $this->db->from('user');
        $this->db->where('rol_id', 8);
        $this->db->where('status !=', 0);

        if ($agency_id !== null) {
            $this->db->where('agency_id', $agency_id);
        }

        if (!empty($search)) {
            $this->db->group_start();
            $this->db->like('name', $search);
            $this->db->or_like('last_name', $search);
            $this->db->group_end();
        }

        $this->db->limit($limit);
        return $this->db->get()->result();
    }

    /**
     * Get paginated medical consultations for a patient.
     *
     * @param int $patient_id
     * @param int $agency_id
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function get_patient_consultations($patient_id, $agency_id, $limit = 5, $offset = 0)
    {
        return $this->db
            ->select("
                medical_consultations.*,
                doctor.name as doctor_name,
                doctor.last_name as doctor_last_name
            ")
            ->from('medical_consultations')
            ->join(
                'user doctor',
                'doctor.user_id = medical_consultations.doctor_id',
                'left'
            )
            ->where('medical_consultations.agency_id', $agency_id)
            ->where('medical_consultations.patient_id', $patient_id)
            ->where('medical_consultations.status', 1)
            ->order_by('medical_consultations.consultation_date', 'DESC')
            ->limit($limit, $offset)
            ->get()
            ->result_array();
    }

        /**
     * Guarda (crea o actualiza) un usuario con rol de paciente.
     * 
     * @return array Estado y mensaje/datos del resultado.
     */
    public function save_patient($agency_id = null)
    {
        $patient_id = $this->input->post('patient_id');
        if ($agency_id === null) {
            $agency_id = $this->session->userdata('current_agency');
        }
        
        $name = $this->input->post('name');
        $last_name = $this->input->post('last_name');
        $email = $this->input->post('email');
        $phone = $this->input->post('phone');
        $code_area = $this->input->post('code_area');
        $birthday = $this->input->post('birthday');
        $address = $this->input->post('address');

        if (empty($name) || empty($last_name)) {
            return [
                'status'  => 'error',
                'message' => 'El nombre y apellido son obligatorios.'
            ];
        }

        // Filtro para eliminar el cero inicial del número de teléfono
        if (!empty($phone)) {
            $phone = trim((string)$phone);
            $phone = ltrim($phone, '0');
        }

        $data = [
            'name'      => $name,
            'last_name' => $last_name,
            'email'     => !empty($email) ? $email : null,
            'phone'     => !empty($phone) ? $phone : null,
            'code_area' => !empty($code_area) ? $code_area : null,
            'birthday'  => !empty($birthday) ? $birthday : null,
            'address'   => !empty($address) ? $address : null,
            'rol_id'    => 8, // Paciente
            'status'    => 1  // Activo
        ];

        if (empty($patient_id)) {
            // Crear paciente
            $data['agency_id'] = $agency_id;
            $data['date_register'] = date('Y-m-d H:i:s');
            
            if ($this->db->insert('user', $data)) {
                return [
                    'status'     => 'success',
                    'message'    => 'Paciente registrado correctamente.',
                    'patient_id' => $this->db->insert_id()
                ];
            }
        } else {
            // Actualizar paciente
            $this->db->where('user_id', $patient_id);
            $this->db->where('rol_id', 8);
            if ($this->db->update('user', $data)) {
                return [
                    'status'     => 'success',
                    'message'    => 'Paciente actualizado correctamente.',
                    'patient_id' => $patient_id
                ];
            }
        }

        return [
            'status'  => 'error',
            'message' => 'Ocurrió un error al guardar el paciente.'
        ];
    }

    /**
     * Get the newest patient records.
     *
     * @param int $limit
     * @param int|null $agency_id
     * @return array
     */
    public function get_newest_patients($limit = 3, $agency_id = null)
    {
        $this->db->from('user');
        $this->db->where('rol_id', 8);
        $this->db->where('status !=', 0);

        if ($agency_id !== null) {
            $this->db->where('agency_id', $agency_id);
        }

        $this->db->order_by('user_id', 'DESC');
        $this->db->limit($limit);

        return $this->db->get()->result();
    }
}
