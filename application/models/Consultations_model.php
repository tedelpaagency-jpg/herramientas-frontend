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
    public function update_clincal_parameters($consultation_id, $patient_id, $values)
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
    
            $this->db->insert('clinical_records', [
                'agency_id'       => $this->session->userdata('current_agency'),
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