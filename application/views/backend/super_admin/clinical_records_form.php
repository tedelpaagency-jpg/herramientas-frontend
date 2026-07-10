<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Parámetros clínicos</h4>    
    </div>
    
</div>
<?php $row = $this->db->get_where('email_templates',['id'=>$param2])->row_array(); ?>
<form action="<?php echo base_url(); ?>portal/clinical_records/save" method="post" id="idForm" enctype="multipart/form-data">
<div class="modal-body row">
    <input type="hidden" name="patient_id" value="<?= $param2; ?>">
    <input type="hidden" name="record_id" id="">

    <div class="mb-2">
        <label>Fecha</label>
        <input type="date" value="<?= date('Y-m-d'); ?>" name="date_record" class="form-control" required>
    </div>
    <?php 
        $parameters = $this->db->get_where('clinical_parameters',['status'=>1])->result_array();
    ?>
    <?php foreach($parameters as $p): ?>
        <div class="mb-2">
            <i class="<?= $p['icon']; ?> text-grey-500 me-3 font-lg"></i>
            <label><?= $p['name']; ?> (<?= $p['unit']; ?>)</label>
            <input 
                type="text" 
                step="any"
                name="values[<?= $p['id']; ?>]" 
                class="form-control">
        </div>
    <?php endforeach; ?>
</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-center  text-white"><?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?></button>
    </div>
</form>
