<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Treatments_model
 *
 * Modelo para gestionar plantillas de tratamientos (paquetes) y el control
 * de tratamientos activos asignados a pacientes, incluyendo control de sesiones y extras.
 */
class Treatments_model extends CI_Model 
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    // =========================================================================
    // 1. GESTIÓN DE PLANTILLAS DE TRATAMIENTO (CATÁLOGO)
    // =========================================================================

    /**
     * Listar todos los planes/paquetes de tratamientos de una agencia.
     *
     * @param int $agency_id
     * @return array
     */
    public function get_plans($agency_id)
    {
        return $this->db->select('*')
            ->from('treatment_plans')
            ->where('agency_id', $agency_id)
            ->where('status', 1)
            ->order_by('id', 'DESC')
            ->get()
            ->result_array();
    }

    /**
     * Obtener un plan/paquete específico con sus servicios asociados.
     *
     * @param int $id
     * @param int $agency_id
     * @return array|null
     */
    public function get_plan_by_id($id, $agency_id)
    {
        $plan = $this->db->select('*')
            ->from('treatment_plans')
            ->where('id', $id)
            ->where('agency_id', $agency_id)
            ->get()
            ->row_array();

        if (!$plan) {
            return null;
        }

        // Obtener los servicios asignados a este plan
        $plan['services'] = $this->db->select('pts.*, s.name as service_name, s.price as service_price')
            ->from('treatment_plan_services pts')
            ->join('services s', 's.id = pts.service_id', 'left')
            ->where('pts.treatment_plan_id', $id)
            ->get()
            ->result_array();

        return $plan;
    }

    /**
     * Crear una nueva plantilla de tratamiento.
     *
     * @param array $plan_data
     * @param array $services array de arrays con ['service_id', 'sessions_count']
     * @return int|bool ID de la plantilla creada o false en caso de error
     */
    public function create_plan($plan_data, $services = [])
    {
        $this->db->trans_start();

        $this->db->insert('treatment_plans', $plan_data);
        $plan_id = $this->db->insert_id();

        if (!empty($services) && is_array($services)) {
            foreach ($services as $svc) {
                if (empty($svc['service_id']) || empty($svc['sessions_count'])) {
                    continue;
                }
                $this->db->insert('treatment_plan_services', [
                    'treatment_plan_id' => $plan_id,
                    'service_id'        => (int)$svc['service_id'],
                    'sessions_count'    => (int)$svc['sessions_count']
                ]);
            }
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return false;
        }

        return $plan_id;
    }

    /**
     * Actualizar una plantilla de tratamiento.
     *
     * @param int $id
     * @param int $agency_id
     * @param array $plan_data
     * @param array $services
     * @return bool
     */
    public function update_plan($id, $agency_id, $plan_data, $services = null)
    {
        $this->db->trans_start();

        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        $this->db->update('treatment_plans', $plan_data);

        // Si se pasan servicios, reemplazamos los anteriores
        if ($services !== null && is_array($services)) {
            $this->db->where('treatment_plan_id', $id)->delete('treatment_plan_services');

            foreach ($services as $svc) {
                if (empty($svc['service_id']) || empty($svc['sessions_count'])) {
                    continue;
                }
                $this->db->insert('treatment_plan_services', [
                    'treatment_plan_id' => $id,
                    'service_id'        => (int)$svc['service_id'],
                    'sessions_count'    => (int)$svc['sessions_count']
                ]);
            }
        }

        $this->db->trans_complete();
        return $this->db->trans_status();
    }

    /**
     * Realizar borrado lógico de una plantilla de tratamiento.
     *
     * @param int $id
     * @param int $agency_id
     * @return bool
     */
    public function delete_plan($id, $agency_id)
    {
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        return $this->db->update('treatment_plans', ['status' => 0]);
    }

    // =========================================================================
    // 2. GESTIÓN DE ASIGNACIÓN A PACIENTES
    // =========================================================================

    /**
     * Listar tratamientos de pacientes para una agencia.
     *
     * @param int $agency_id
     * @param int|null $patient_id
     * @param string|null $status
     * @return array
     */
    public function get_patient_treatments($agency_id, $patient_id = null, $status = null)
    {
        $this->db->select('pt.*, u.name as patient_name, u.last_name as patient_last_name')
            ->from('patient_treatments pt')
            ->join('user u', 'u.user_id = pt.patient_id', 'left')
            ->where('pt.agency_id', $agency_id);

        if ($patient_id !== null) {
            $this->db->where('pt.patient_id', $patient_id);
        }

        if ($status !== null) {
            $this->db->where('pt.status', $status);
        }

        $this->db->order_by('pt.id', 'DESC');
        return $this->db->get()->result_array();
    }

    /**
     * Obtener detalle completo de un tratamiento asignado a un paciente.
     *
     * @param int $id
     * @param int $agency_id
     * @return array|null
     */
    public function get_patient_treatment_by_id($id, $agency_id)
    {
        // 1. Datos generales del tratamiento del paciente
        $treatment = $this->db->select('pt.*, u.name as patient_name, u.last_name as patient_last_name, u.email as patient_email')
            ->from('patient_treatments pt')
            ->join('user u', 'u.user_id = pt.patient_id', 'left')
            ->where('pt.id', $id)
            ->where('pt.agency_id', $agency_id)
            ->get()
            ->row_array();

        if (!$treatment) {
            return null;
        }

        // 2. Servicios asignados, con conteo de sesiones completadas vs pedidas
        $treatment['services'] = $this->db->select('pts.*, s.name as service_name, s.price as original_service_price')
            ->from('patient_treatment_services pts')
            ->join('services s', 's.id = pts.service_id', 'left')
            ->where('pts.patient_treatment_id', $id)
            ->get()
            ->result_array();

        // 3. Bitácora / Registro histórico de sesiones consumidas
        $treatment['sessions'] = $this->db->select('ps.*, s.name as service_name')
            ->from('patient_treatment_sessions ps')
            ->join('patient_treatment_services pts', 'pts.id = ps.patient_treatment_service_id', 'left')
            ->join('services s', 's.id = pts.service_id', 'left')
            ->where('ps.patient_treatment_id', $id)
            ->order_by('ps.session_date', 'DESC')
            ->get()
            ->result_array();

        // 4. Cargos / Servicios extra añadidos
        $treatment['extras'] = $this->db->select('*')
            ->from('patient_treatment_extras')
            ->where('patient_treatment_id', $id)
            ->order_by('id', 'ASC')
            ->get()
            ->result_array();

        return $treatment;
    }

    /**
     * Asignar un tratamiento (ya sea plantilla o personalizado) a un paciente.
     *
     * @param array $treatment_data
     * @param array $services array de arrays con ['service_id', 'quantity_ordered']
     * @return int|bool ID del tratamiento de paciente creado o false en caso de error
     */
    public function assign_treatment($treatment_data, $services = [])
    {
        $this->db->trans_start();

        // Insertar cabecera de tratamiento asignado
        $this->db->insert('patient_treatments', $treatment_data);
        $patient_treatment_id = $this->db->insert_id();

        // Insertar servicios asignados con sesiones estimadas
        if (!empty($services) && is_array($services)) {
            foreach ($services as $svc) {
                if (empty($svc['service_id']) || empty($svc['quantity_ordered'])) {
                    continue;
                }
                $this->db->insert('patient_treatment_services', [
                    'patient_treatment_id' => $patient_treatment_id,
                    'service_id'           => (int)$svc['service_id'],
                    'quantity_ordered'     => (int)$svc['quantity_ordered'],
                    'quantity_used'        => 0
                ]);
            }
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return false;
        }

        return $patient_treatment_id;
    }

    /**
     * Actualizar cabecera de un tratamiento de paciente (por ejemplo, cambiar su estado, notas o fechas).
     *
     * @param int $id
     * @param int $agency_id
     * @param array $data
     * @return bool
     */
    public function update_patient_treatment($id, $agency_id, $data)
    {
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        return $this->db->update('patient_treatments', $data);
    }

    /**
     * Eliminar/Cancelar tratamiento asignado a un paciente.
     *
     * @param int $id
     * @param int $agency_id
     * @return bool
     */
    public function delete_patient_treatment($id, $agency_id)
    {
        // En lugar de hacer hard delete, podemos cambiar el estado a 'cancelled'
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        return $this->db->update('patient_treatments', [
            'status'     => 'cancelled',
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    // =========================================================================
    // 3. REGISTRO Y REVERSIÓN DE SESIONES
    // =========================================================================

    /**
     * Registrar una sesión consumida.
     *
     * @param int $patient_treatment_id
     * @param int $patient_treatment_service_id ID en la tabla patient_treatment_services
     * @param string $session_date Y-m-d H:i:s
     * @param string|null $notes
     * @return array Estado y mensaje del resultado
     */
    public function register_session($patient_treatment_id, $patient_treatment_service_id, $session_date, $notes = null)
    {
        // 1. Obtener la sesión asignada y verificar que no sobrepase el total ordenado
        $assigned_service = $this->db->select('*')
            ->from('patient_treatment_services')
            ->where('id', $patient_treatment_service_id)
            ->where('patient_treatment_id', $patient_treatment_id)
            ->get()
            ->row_array();

        if (!$assigned_service) {
            return [
                'status'  => 'error',
                'message' => 'El servicio asignado al tratamiento no existe.'
            ];
        }

        if ($assigned_service['quantity_used'] >= $assigned_service['quantity_ordered']) {
            return [
                'status'  => 'error',
                'message' => 'No quedan sesiones disponibles para este servicio en este tratamiento (completadas ' . $assigned_service['quantity_used'] . '/' . $assigned_service['quantity_ordered'] . ').'
            ];
        }

        $this->db->trans_start();

        // 2. Insertar log histórico en patient_treatment_sessions
        $this->db->insert('patient_treatment_sessions', [
            'patient_treatment_id'         => $patient_treatment_id,
            'patient_treatment_service_id' => $patient_treatment_service_id,
            'session_date'                 => $session_date,
            'notes'                        => $notes
        ]);
        $session_id = $this->db->insert_id();

        // 3. Incrementar las sesiones consumidas
        $this->db->where('id', $patient_treatment_service_id);
        $this->db->set('quantity_used', 'quantity_used + 1', FALSE);
        $this->db->update('patient_treatment_services');

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return [
                'status'  => 'error',
                'message' => 'Error al registrar la sesión en la base de datos.'
            ];
        }

        return [
            'status'     => 'success',
            'message'    => 'Sesión registrada correctamente.',
            'session_id' => $session_id
        ];
    }

    /**
     * Eliminar/Revertir una sesión consumida.
     *
     * @param int $session_id
     * @param int $agency_id
     * @return array
     */
    public function delete_session($session_id, $agency_id)
    {
        // 1. Obtener la sesión y validar que pertenece a la agencia solicitante
        $session = $this->db->select('ps.*, pt.agency_id, ps.patient_treatment_service_id')
            ->from('patient_treatment_sessions ps')
            ->join('patient_treatments pt', 'pt.id = ps.patient_treatment_id', 'left')
            ->where('ps.id', $session_id)
            ->where('pt.agency_id', $agency_id)
            ->get()
            ->row_array();

        if (!$session) {
            return [
                'status'  => 'error',
                'message' => 'La sesión no existe o no tiene permisos sobre ella.'
            ];
        }

        $this->db->trans_start();

        // 2. Decrementar el contador en patient_treatment_services
        $this->db->where('id', $session['patient_treatment_service_id']);
        $this->db->set('quantity_used', 'GREATEST(0, quantity_used - 1)', FALSE);
        $this->db->update('patient_treatment_services');

        // 3. Eliminar el log físico de la sesión
        $this->db->where('id', $session_id)->delete('patient_treatment_sessions');

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return [
                'status'  => 'error',
                'message' => 'Error al revertir la sesión de la base de datos.'
            ];
        }

        return [
            'status'  => 'success',
            'message' => 'Sesión eliminada y contador decrementado correctamente.'
        ];
    }

    // =========================================================================
    // 4. GESTIÓN DE EXTRAS
    // =========================================================================

    /**
     * Agregar un cargo o servicio extra a un tratamiento.
     *
     * @param array $extra_data
     * @return int ID del extra insertado
     */
    public function add_extra($extra_data)
    {
        $this->db->insert('patient_treatment_extras', $extra_data);
        return $this->db->insert_id();
    }

    /**
     * Eliminar un cargo o servicio extra de un tratamiento.
     *
     * @param int $extra_id
     * @param int $agency_id
     * @return array
     */
    public function delete_extra($extra_id, $agency_id)
    {
        // Verificar propiedad
        $extra = $this->db->select('e.*, pt.agency_id')
            ->from('patient_treatment_extras e')
            ->join('patient_treatments pt', 'pt.id = e.patient_treatment_id', 'left')
            ->where('e.id', $extra_id)
            ->where('pt.agency_id', $agency_id)
            ->get()
            ->row_array();

        if (!$extra) {
            return [
                'status'  => 'error',
                'message' => 'El cargo extra no existe o no tiene permisos para eliminarlo.'
            ];
        }

        if ($this->db->where('id', $extra_id)->delete('patient_treatment_extras')) {
            return [
                'status'  => 'success',
                'message' => 'Cargo extra eliminado correctamente.'
            ];
        }

        return [
            'status'  => 'error',
            'message' => 'Ocurrió un error al intentar eliminar el cargo extra.'
        ];
    }
}
