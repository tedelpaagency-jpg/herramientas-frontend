<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<?php $filas = $this->db->get_where('requests', array('id' => $param2))->row(); ?>
<div class="modal-header">
    <h5 class="modal-title">Información de la solicitud</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
</div>
<div class="modal-body">
    <form action="<?= base_url(); ?>portal/requests/updateRequestInfo/<?= base64_encode($param2); ?>" method="POST" />
        <div class="mb-3">
            <label for="informacion" class="form-label">Nombre:</label>
            <input type="text" class="form-control" id="informacion" name="name" value="<?php echo $filas->name; ?>" readonly>
        </div>
        <div class="mb-3">
            <label for="last_name" class="form-label">Apellido:</label>
            <input type="text" class="form-control" id="last_name" name="last_name" value="<?php echo $filas->last_name; ?>" readonly>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Teléfono:</label>
            <input type="text" class="form-control" id="phone" name="phone" value="<?php echo $filas->phone; ?>" readonly>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Correo:</label>
            <input type="email" class="form-control" id="email" name="email" value="<?php echo $filas->email; ?>" readonly>                        
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Tienda:</label>
            <input type="email" class="form-control" id="email" name="email" value="<?php echo $filas->user_id != '' ? $this->crud_model->getName('user',$filas->user_id):'Sin Comisionista'; ?>" readonly>
        </div>
        <?php if($filas->status == 1): ?>
          <div class="mb-3">
            <button type="submit" class="btn btn-info">Actualizar</button>
        </div>
         <?php endif; ?>
    </form>
</div>
 <div class="modal-footer">
   
    <?php echo $filas->status == 0 ? '<span class="badge border border-danger  text-danger bg-transparent">Solicitud Rechazada</span>':''; ?>
    <?php echo $filas->status == 1 ? '<span class="badge border border-warning text-warning bg-transparent">Solicitud Pendientes</span>':''; ?>
    <?php echo $filas->status == 2 ? '<span class="badge border border-success text-success bg-transparent">Solicitud Aprobada</span>':''; ?>
</div> 

