<?php
 $this->db->select('
            a.*, 
            u.name as contact_name,
            u.last_name,
            u.ruc_file as user_ruc_file,
            u.email,
            u.phone,
            u.whatsapp,
            u.agency_id,
            u.user_id
        ');
        $this->db->from('agency a');
        $this->db->join('user u', 'u.agency_id = a.id');
        $this->db->where('a.id', $param2);

$request = $this->db->get()->row_array();

?>
<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Solicitud de agencia</h4>    
    </div>
    
</div>
<div class="modal-body row">
      <div class="max-w-4xl mx-auto p-6 space-y-6">

    <h2 class="text-2xl font-bold">Validación de Solicitud</h2>

    <div class=" space-y-4">
        <h3 class="font-bold text-lg">Identidad Corporativa</h3>
        <p><b>Nombre Comercial:</b> <?= $request['name'] ?></p>
        <p><b>Razón Social:</b> <?= $request['razon'] ?></p>
        <p><b>RUC:</b> <?= $request['ruc'] ?></p>
        <?php if ($request['ruc_file']): ?>
        <p><b>RUC Empresa:</b>  <a target="_blank" href="<?= base_url($request['ruc_file']) ?>" class="text-blue-600 underline" download>
                Descargar RUC Empresa
            </a></p>
           
        <?php endif; ?>
        <p><b>Logo:</b>  <img src="<?php echo base_url(); ?>public/assets/images/logo/<?= $request['logo'] ?>" style="width:100px; height:100px;"></p>
       
    </div>

    <div class=" space-y-4">
        <h3 class="font-bold text-lg">Ubicación</h3>
        <p><b>Dirección:</b> <?= $request['address'] ?></p>
        <p><b>Ciudad:</b> <?= $request['city'] ?></p>
        <p><b>Provincia:</b> <?= $request['province'] ?></p>
        <p><b>País:</b> <?= $request['country_id'] ?></p>
    </div>

    <div class=" space-y-4">
        <h3 class="font-bold text-lg">Contacto</h3>
        <p><b>Nombre:</b> <?= $request['contact_name'].' '.$request['last_name'] ?></p>
        <p><b>Email:</b> <?= $request['email'] ?></p>
        <p><b>Teléfono:</b> <?= $request['phone'] ?></p>
        <p><b>WhatsApp:</b> <?= $request['whatsapp'] ?></p>
        <?php if ($request['user_ruc_file']): ?>
        <p> <b>Identificación Personal:</b> 
            <a target="_blank" href="<?= base_url($request['user_ruc_file']) ?>" class="text-blue-600 underline" download>
                Ver Identificación Personal
            </a>
        </p>
            
        <?php endif; ?>
         <p><b>Foto:</b>  <img src="<?php echo $this->crud_model->getPhoto('user',$request['user_id']); ?>" style="width:100px; height:100px;"></p>
    </div>

</div>

</div>
<div class="modal-footer">
    <a href="<?= base_url('portal/agency_requests/approve/'.$request['id']) ?>"
       class="btn btn-success text-white btn-approve"
       data-id="<?= $request['id'] ?>">
        Aprobar Solicitud
    </a>

    <a href="<?= base_url('portal/agency_requests/reject/'.$request['id']) ?>"
       class="btn btn-danger text-white btn-reject"
       data-id="<?= $request['id'] ?>">
        Rechazar Solicitud
    </a>
</div>

<script>
    // APROBAR
$(document).on('click', '.btn-approve', function (e) {
    e.preventDefault();

    const url = $(this).attr('href');

    Swal.fire({
        title: '¿Aprobar solicitud?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = url;
        }
    });
});

// RECHAZAR CON MOTIVO
$(document).on('click', '.btn-reject', function (e) {
    e.preventDefault();

    const url = $(this).attr('href');
    const id  = $(this).data('id');

    // Cierra el modal primero
    $('#exampleModal').modal('hide');

    setTimeout(() => {
        Swal.fire({
            title: 'Rechazar solicitud',
            input: 'textarea',
            inputLabel: 'Motivo del rechazo',
            inputPlaceholder: 'Escribe el motivo...',
            showCancelButton: true,
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            didOpen: () => Swal.getInput().focus(),
            preConfirm: (reason) => {
                if (!reason) {
                    Swal.showValidationMessage('El motivo es obligatorio');
                }
                return reason;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post(url, {
                    id: id,
                    reason: result.value
                }, function () {
                    location.reload();
                });
            }
        });
    }, 300);
});


</script>