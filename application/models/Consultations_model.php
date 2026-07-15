<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Consultations_model  extends CI_Model {

    protected $table = 'medical_consultations	';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Create consultation
     */
    public function save_consultation($data)
    {
        $this->db->insert($this->table, $data);

        return $this->db->insert_id();
    }

    /**
     * Update consultation
     */
    public function update_consultation($consultation_id, $agency_id, $data)
    {
        return $this->db
            ->where('id', $consultation_id)
            ->where('agency_id', $agency_id)
            ->update($this->table, $data);
    }
    
    /**
     * Update consultation
     */
    public function update_clincal_parameters($consultation_id, $patient_id, $values, $agency_id = null)
    {
        $this->db->trans_start();
    
        $record = $this->db
            ->get_where('clinical_records', [
                'consultation_id' => $consultation_id
            ])
            ->row();
    
        if ($record) {
    
            $record_id = $record->id;
    
        } else {
            if ($agency_id === null) {
                $agency_id = $this->session->userdata('current_agency');
            }
    
            $this->db->insert('clinical_records', [
                'agency_id'       => $agency_id,
                'patient_id'      => $patient_id,
                'consultation_id' => $consultation_id,
                'date_record'     => date('Y-m-d')
            ]);
    
            $record_id = $this->db->insert_id();
        }
    
        foreach ($values as $param_id => $val) {
    
            $val = trim($val);
    
            if ($val === '') {
                continue;
            }
    
            $exists = $this->db
                ->get_where('clinical_values', [
                    'record_id'    => $record_id,
                    'parameter_id' => $param_id
                ])
                ->row();
    
            if ($exists) {
    
                $this->db->where('id', $exists->id);
                $this->db->update('clinical_values', [
                    'value' => $val
                ]);
    
            } else {
    
                $this->db->insert('clinical_values', [
                    'record_id'    => $record_id,
                    'parameter_id' => $param_id,
                    'value'        => $val
                ]);
    
            }
    
        }
    
        $this->db->trans_complete();
    
        if ($this->db->trans_status() === FALSE) {
            return 'Error al guardar';
        }
    
        return 'Parámetros clínicos guardados correctamente';
    }

    /**
     * Delete consultation
     */
    public function delete_consultation($id,$agency_id)
    {
        return $this->db->where('id', $id)->where('agency_id', $agency_id)->update('medical_consultations', [
            'status' => 0
        ]);
    
        
    }

    /**
     * Get consultation
     */
    public function get_consultation($consultation_id, $agency_id)
    {
        return $this->db
            ->select("
                medical_consultations.*,

                patient.user_id as patient_id,
                patient.name as patient_name,
                patient.email as patient_email,
                patient.phone as patient_phone,

                doctor.user_id as doctor_id,
                doctor.name as doctor_name
            ")
            ->from('medical_consultations')

            ->join(
                'user patient',
                'patient.user_id = medical_consultations.patient_id',
                'left'
            )

            ->join(
                'user doctor',
                'doctor.user_id = medical_consultations.doctor_id',
                'left'
            )
            ->where('medical_consultations.id', $consultation_id)
            ->where('medical_consultations.agency_id', $agency_id)

            ->get()
            ->row_array();
    }

    /**
     * Get all medical_consultations	
     */
    public function get_consultations($agency_id)
    {
        return $this->db
            ->select("
                medical_consultations.*,
                patient.name as patient_name,
                doctor.name as doctor_name
            ")
            ->from('medical_consultations')
    
            ->join(
                'user patient',
                'patient.user_id = medical_consultations.patient_id',
                'left'
            )
    
            ->join(
                'user doctor',
                'doctor.user_id = medical_consultations.doctor_id',
                'left'
            )
    
            ->where('medical_consultations.agency_id', $agency_id)
            ->where('medical_consultations.status', 1)
            ->order_by(
                'medical_consultations.consultation_date',
                'DESC'
            )
    
            ->get()
            ->result_array();
    }

    /**
     * Patient medical_consultations	
     */
    public function get_patient_medical_consultations	($patient_id, $agency_id)
    {
        return $this->db
            ->select("
                medical_consultations	.*,
                doctor.name as doctor_name
            ")
            ->from('medical_consultations	')

            ->join(
                'user doctor',
                'doctor.id = medical_consultations	.doctor_id',
                'left'
            )

            ->where('medical_consultations	.patient_id', $patient_id)
            ->where('medical_consultations	.agency_id', $agency_id)

            ->order_by('medical_consultations	.consultation_date', 'DESC')

            ->get()
            ->result_array();
    }

    /**
     * Get patient medical history
     */
    public function get_medical_history($patient_id, $agency_id)
    {
        return $this->get_patient_medical_consultations	(
            $patient_id,
            $agency_id
        );
    }

    /**
     * Search medical_consultations	
     */
    public function search_medical_consultations	($agency_id, $keyword)
    {
        return $this->db
            ->select("
                medical_consultations	.*,
                patient.name as patient_name,
                doctor.name as doctor_name
            ")
            ->from('medical_consultations	')

            ->join(
                'user patient',
                'patient.id = medical_consultations	.patient_id',
                'left'
            )

            ->join(
                'user doctor',
                'doctor.id = medical_consultations	.doctor_id',
                'left'
            )

            ->where('medical_consultations	.agency_id', $agency_id)

            ->group_start()

                ->like('patient.name', $keyword)

                ->or_like(
                    'medical_consultations	.chief_complaint',
                    $keyword
                )

                ->or_like(
                    'medical_consultations	.diagnosis',
                    $keyword
                )

                ->or_like(
                    'medical_consultations	.treatment',
                    $keyword
                )

            ->group_end()

            ->order_by('medical_consultations	.consultation_date', 'DESC')

            ->get()
            ->result_array();
    }

    /**
     * Get recent medical_consultations	
     */
    public function get_recent_medical_consultations	(
        $agency_id,
        $limit = 10
    )
    {
        return $this->db
            ->select("
                medical_consultations	.*,
                patient.name as patient_name
            ")
            ->from('medical_consultations	')

            ->join(
                'user patient',
                'patient.id = medical_consultations	.patient_id',
                'left'
            )

            ->where('medical_consultations	.agency_id', $agency_id)

            ->order_by('medical_consultations	.consultation_date', 'DESC')

            ->limit($limit)

            ->get()
            ->result_array();
    }

    /**
     * Count medical_consultations	
     */
    public function count_medical_consultations	($agency_id)
    {
        return $this->db
            ->where('agency_id', $agency_id)
            ->count_all_results('medical_consultations	');
    }

    /**
     * Count medical_consultations	 today
     */
    public function count_today_medical_consultations	($agency_id)
    {
        return $this->db
            ->where('agency_id', $agency_id)
            ->where('DATE(consultation_date)', date('Y-m-d'))
            ->count_all_results('medical_consultations	');
    }

    /**
     * Get medical_consultations	 by date range
     */
    public function get_by_date_range(
        $agency_id,
        $start_date,
        $end_date
    )
    {
        return $this->db
            ->select("
                medical_consultations	.*,
                patient.name as patient_name
            ")
            ->from('medical_consultations	')

            ->join(
                'user patient',
                'patient.id = medical_consultations	.patient_id',
                'left'
            )

            ->where('medical_consultations	.agency_id', $agency_id)

            ->where(
                'DATE(medical_consultations	.consultation_date) >=',
                $start_date
            )

            ->where(
                'DATE(medical_consultations	.consultation_date) <=',
                $end_date
            )

            ->order_by(
                'medical_consultations	.consultation_date',
                'DESC'
            )

            ->get()
            ->result_array();
    }

    /**
     * Get medical_consultations	 by doctor
     */
    public function get_by_doctor(
        $doctor_id,
        $agency_id
    )
    {
        return $this->db
            ->select("
                medical_consultations	.*,
                patient.name as patient_name
            ")
            ->from('medical_consultations	')

            ->join(
                'user patient',
                'patient.id = medical_consultations	.patient_id',
                'left'
            )

            ->where('medical_consultations	.doctor_id', $doctor_id)
            ->where('medical_consultations	.agency_id', $agency_id)

            ->order_by(
                'medical_consultations	.consultation_date',
                'DESC'
            )

            ->get()
            ->result_array();
    }

    /**
     * Verify consultation ownership
     */
    public function exists(
        $consultation_id,
        $agency_id
    )
    {
        return $this->db
            ->where('id', $consultation_id)
            ->where('agency_id', $agency_id)
            ->count_all_results('medical_consultations	') > 0;
    }

    /**
     * Get consultations with advanced filtering, pagination, and patient/doctor details.
     */
    public function get_consultations_filtered($agency_id, $filters = [], $limit = null, $offset = 0)
    {
        $this->db->select("
            medical_consultations.*,
            patient.user_id as patient_id,
            patient.name as patient_name,
            patient.last_name as patient_last_name,
            patient.email as patient_email,
            patient.phone as patient_phone,
            patient.birthday as patient_birthday,
            patient.status as patient_status,
            doctor.user_id as doctor_id,
            doctor.name as doctor_name,
            doctor.last_name as doctor_last_name
        ");
        $this->db->from('medical_consultations');
        $this->db->join('user patient', 'patient.user_id = medical_consultations.patient_id', 'left');
        $this->db->join('user doctor', 'doctor.user_id = medical_consultations.doctor_id', 'left');

        $this->db->where('medical_consultations.agency_id', $agency_id);
        $this->db->where('medical_consultations.status', 1);

        if (!empty($filters['patient_id'])) {
            $this->db->where('medical_consultations.patient_id', $filters['patient_id']);
        }

        if (!empty($filters['doctor_id'])) {
            $this->db->where('medical_consultations.doctor_id', $filters['doctor_id']);
        }

        if (!empty($filters['date_from'])) {
            $this->db->where('DATE(medical_consultations.consultation_date) >=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $this->db->where('DATE(medical_consultations.consultation_date) <=', $filters['date_to']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $this->db->group_start();
            $this->db->like('patient.name', $search);
            $this->db->or_like('patient.last_name', $search);
            $this->db->or_like("CONCAT(patient.name, ' ', patient.last_name)", $search);
            $this->db->or_like('medical_consultations.chief_complaint', $search);
            $this->db->or_like('medical_consultations.diagnosis', $search);
            $this->db->or_like('medical_consultations.treatment', $search);
            $this->db->group_end();
        }

        // Count total results for pagination
        $count_db = clone $this->db;
        $total = $count_db->count_all_results();
        unset($count_db);

        $this->db->order_by('medical_consultations.consultation_date', 'DESC');

        if ($limit !== null) {
            $this->db->limit($limit, $offset);
        }

        $rows = $this->db->get()->result_array();

        return [
            'total' => $total,
            'rows'  => $rows
        ];
    }

    /**
     * Get clinical records associated with a specific consultation.
     */
    public function get_clinical_records_by_consultation($consultation_id, $agency_id)
    {
        $record = $this->db
            ->order_by('id', 'DESC')
            ->get_where('clinical_records', [
                'consultation_id' => $consultation_id,
                'agency_id'       => $agency_id
            ])
            ->row();

        if ($record) {
            $values = $this->db
                ->select('
                    p.id AS parameter_id,
                    p.name,
                    p.icon,
                    p.unit,
                    cv.value
                ')
                ->from('clinical_parameters p')
                ->join(
                    'clinical_values cv',
                    'cv.parameter_id = p.id AND cv.record_id = ' . $this->db->escape($record->id),
                    'left'
                )
                ->where('p.status', 1)
                ->order_by('p.id', 'ASC')
                ->get()
                ->result_array();

            return [
                'has_record'      => true,
                'record_id'       => (int) $record->id,
                'consultation_id' => (int) $record->consultation_id,
                'patient_id'      => (int) $record->patient_id,
                'date_record'     => $record->date_record,
                'data'            => $values
            ];
        } else {
            // Get consultation patient details
            $consultation = $this->db
                ->select('patient_id')
                ->where('id', $consultation_id)
                ->where('agency_id', $agency_id)
                ->get('medical_consultations')
                ->row();

            $patient_id = $consultation ? (int) $consultation->patient_id : null;

            $parameters = $this->db
                ->select('
                    id AS parameter_id,
                    name,
                    icon,
                    unit
                ')
                ->from('clinical_parameters')
                ->where('status', 1)
                ->order_by('id', 'ASC')
                ->get()
                ->result_array();

            foreach ($parameters as &$p) {
                $p['value'] = null;
            }
            unset($p);

            return [
                'has_record'      => false,
                'record_id'       => null,
                'consultation_id' => (int) $consultation_id,
                'patient_id'      => $patient_id,
                'date_record'     => null,
                'data'            => $parameters
            ];
        }
    }

    /**
     * Get patient last consultation
     */
    public function get_last_consultation(
        $patient_id,
        $agency_id
    )
    {
        return $this->db
            ->where('patient_id', $patient_id)
            ->where('agency_id', $agency_id)
            ->order_by('consultation_date', 'DESC')
            ->limit(1)
            ->get('medical_consultations	')
            ->row_array();
    }

}