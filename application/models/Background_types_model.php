<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Background_types_model extends CI_Model {

    public function get_background_types($agency_id)
    {
        return $this->db
            ->where_in('agency_id', [0, $agency_id])
            ->where('status', 1)
            ->order_by('sort_order', 'ASC')
            ->get('medical_background_types')
            ->result_array();
    }

    public function get_background_type($id)
    {
        return $this->db
            ->where('id', $id)
            ->get('medical_background_types')
            ->row_array();
    }

    public function create($data)
    {
        $this->db->insert(
            'medical_background_types',
            $data
        );

        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        return $this->db
            ->where('id', $id)
            ->update(
                'medical_background_types',
                $data
            );
    }

    public function delete($id)
    {
        return $this->db
            ->where('id', $id)
            ->update(
                'medical_background_types',
                [
                    'status' => 0
                ]
            );
    }

    public function get_patient_backgrounds($agency_id, $patient_id)
    {
        $rows = $this->db
            ->where('agency_id', $agency_id)
            ->where('patient_id', $patient_id)
            ->get('medical_background_values')
            ->result_array();

        $data = [];

        foreach ($rows as $row)
        {
            $data[$row['background_type_id']] = $row['value'];
        }

        return $data;
    }

    public function save_patient_value(
        $agency_id,
        $patient_id,
        $background_type_id,
        $value
    )
    {
        $exists = $this->db
            ->where('agency_id', $agency_id)
            ->where('patient_id', $patient_id)
            ->where('background_type_id', $background_type_id)
            ->get('medical_background_values')
            ->row();

        if ($exists)
        {
            return $this->db
                ->where('id', $exists->id)
                ->update(
                    'medical_background_values',
                    [
                        'value' => $value
                    ]
                );
        }

        return $this->db->insert(
            'medical_background_values',
            [
                'agency_id'          => $agency_id,
                'patient_id'         => $patient_id,
                'background_type_id' => $background_type_id,
                'value'              => $value
            ]
        );
    }

    public function get_patient_background_value(
        $agency_id,
        $patient_id,
        $background_type_id
    )
    {
        return $this->db
            ->where('agency_id', $agency_id)
            ->where('patient_id', $patient_id)
            ->where('background_type_id', $background_type_id)
            ->get('medical_background_values')
            ->row_array();
    }

    public function delete_patient_background(
        $agency_id,
        $patient_id,
        $background_type_id
    )
    {
        return $this->db
            ->where('agency_id', $agency_id)
            ->where('patient_id', $patient_id)
            ->where('background_type_id', $background_type_id)
            ->delete('medical_background_values');
    }
}