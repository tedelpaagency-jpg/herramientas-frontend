<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<?php 
    if(isset($param2))
    $plan = $this->db->get_where('plans',array('id'=>$param2))->row();
?>

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel"><?php echo isset($row) ? 'Actualizar plan' : 'Nuevo plan'; ?></h4>    
    </div>
    
</div>
<form method="post" action="<?php echo base_url('portal/plans/savePlan/' . (isset($plan) ? $plan->id : '')); ?>" enctype="multipart/form-data">
    <div class="modal-body row">

        <input type="hidden" name="plan_id" value="<?php echo isset($plan) ? $plan->id : ''; ?>">

        <div class="col-md-12">
            <div class="form-group">
                <label for="name">Nombre del plan</label>
                <input type="text"
                       class="form-control"
                       id="name"
                       name="name"
                       required
                       value="<?php echo isset($plan) ? $plan->name : ''; ?>">
            </div>
        </div>

        <div class="col-md-12">
            <div class="form-group">
                <label for="period">Periodo</label>
                <select class="form-control" name="period" id="period" required>
                    <option value="">Seleccionar</option>
                    <option value="Mensual"     <?php echo isset($plan) ? ($plan->period == 'Mensual' ? 'selected' : '') : ''; ?>>Mensual</option>
                    <option value="Trimestral"  <?php echo isset($plan) ? ($plan->period == 'Trimestral' ? 'selected' : '') : ''; ?>>Trimestral</option>
                    <option value="Anual"       <?php echo isset($plan) ? ($plan->period == 'Anual' ? 'selected' : '') : ''; ?>>Anual</option>
                </select>
            </div>
        </div>

        <div class="col-md-12">
            <div class="form-group">
                <label for="price">Precio</label>
                <input type="number"
                       class="form-control"
                       id="price"
                       name="price"
                       required
                       value="<?php echo isset($plan) ? $plan->price : ''; ?>">
            </div>
        </div>

    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-center text-white">
            <?php echo isset($plan) ? 'Actualizar' : 'Agregar'; ?>
        </button>
    </div>
</form>

