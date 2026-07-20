<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Services_model
 *
 * Modelo para la gestión de la tabla `services`.
 * Todos los accesos a la base de datos utilizan CodeIgniter Query Builder.
 */
class Services_model extends CI_Model 
{
    private $table = 'services';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Obtener todos los servicios activos (status = 1) de una agencia con búsqueda opcional.
     *
     * @param int $agency_id
     * @param string|null $search
     * @return array
     */
    public function get_services($agency_id, $search = null)
    {
        $this->db->select('id, agency_id, name, description, price, photo, status, created_at, updated_at');
        $this->db->from($this->table);
        $this->db->where('agency_id', $agency_id);
        $this->db->where('status', 1);

        if (!empty($search)) {
            $this->db->group_start();
            $this->db->like('name', $search);
            $this->db->or_like('description', $search);
            $this->db->group_end();
        }

        $this->db->order_by('id', 'ASC');
        return $this->db->get()->result_array();
    }

    /**
     * Obtener un servicio activo por ID y agencia.
     *
     * @param int $id
     * @param int $agency_id
     * @return array|null
     */
    public function get_by_id($id, $agency_id)
    {
        $this->db->select('id, agency_id, name, description, price, photo, status, created_at, updated_at');
        $this->db->from($this->table);
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        $this->db->where('status', 1);

        $query = $this->db->get();
        return $query->num_rows() > 0 ? $query->row_array() : null;
    }

    /**
     * Obtener un servicio por ID y agencia indistintamente de su estado.
     *
     * @param int $id
     * @param int $agency_id
     * @return array|null
     */
    public function get_by_id_any_status($id, $agency_id)
    {
        $this->db->select('id, agency_id, name, description, price, photo, status, created_at, updated_at');
        $this->db->from($this->table);
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);

        $query = $this->db->get();
        return $query->num_rows() > 0 ? $query->row_array() : null;
    }

    /**
     * Crear un nuevo servicio.
     *
     * @param array $data
     * @return int ID insertado
     */
    public function create($data)
    {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    /**
     * Actualizar un servicio existente de una agencia.
     *
     * @param int $id
     * @param int $agency_id
     * @param array $data
     * @return bool
     */
    public function update($id, $agency_id, $data)
    {
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        return $this->db->update($this->table, $data);
    }

    /**
     * Realizar Soft Delete de un servicio (status = 0).
     *
     * @param int $id
     * @param int $agency_id
     * @return bool
     */
    public function soft_delete($id, $agency_id)
    {
        $this->db->where('id', $id);
        $this->db->where('agency_id', $agency_id);
        return $this->db->update($this->table, [
            'status'     => 0,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }
}
