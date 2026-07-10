<?php
 $form_id = 0;
?>
 
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Solicitudes de Agencias</h2>
                    </div>
                </div>

                <div class="row ps-2 pe-1">
                    <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Formulario</h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombre</th>
                                                <th>QR</th>
                                                <th>Link</th>
                                                <th>Solicitudes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           <?php $forms = $this->db->get_where('forms',['forms_id'=>8])->result(); ?>
                                            <?php foreach($forms as $form): ?>
                                                <tr>
                                                    <td>
                                                        <h5 class="fs-14 m-0 fw-normal"><?php echo $form->name; ?></h5>
                                                    </td>
                                                    <td>
                                                        <a href="<?= base_url('public/form_qr/'.$form->qr)?>"><img src="<?= base_url('public/form_qr/'.$form->qr)?>" width="50px;"></a>
                                                    </td>
                                                    <td>
                                                      <div class="input-group">
                                                        <input type="text" class="form-control" value="<?= base_url('form?campaign='.base64_encode($form->forms_id)); ?>">
                                                        <button class="btn btn-outline-secondary copy-btn" type="button" title="Copiar">
                                                          <i class="fa fa-clipboard"></i>
                                                        </button>
                                                      </div>
                                                    </td>
                                                    <td>
                                                        <span class="badge border border-info text-info bg-transparent"><?= $this->db->get_where('requests',['forms_id'=>$form->forms_id])->num_rows(); ?></span>
                                                    </td>
                                                </tr>
                                                
                                            <?php endforeach; ?>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>                             
                </div>
                
                <div class="row ps-2 pe-1">
                    <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de regsitros <?=   $form_id; ?></h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Razon</th>
                                                <th>Ruc</th>
                                                <th>Estado</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php  $agencies = $this->db->order_by('id','DESC')->get_where('agency',['from_form'=>1])->result(); ?>
                                            <?php 
                                                foreach($agencies as $agency): 
                                            ?>
                                                <tr>
                                                    <td><?php echo $agency->name; ?></td>
                                                    <td><?php echo $agency->address; ?></td>
                                                    <td><?php echo $agency->razon; ?></td>
                                                    <td><?php echo $agency->ruc; ?></td>
                                                     <td>
                                                            <?php echo $agency->status == 2 ? '<span class="badge border border-warning text-warning bg-transparent">Pendiente</span>':''; ?>
                                                            <?php echo $agency->status == 1 ? '<span class="badge border border-success text-success bg-transparent">Aprovado</span>':''; ?>
                                                            <?php echo $agency->status == 0 ? '<span class="badge border border-danger text-danger bg-transparent">Rechazado</span>':''; ?>
                                                        </td>
                                                    <td>
                                                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/agency_requests_info/<?= $agency->id; ?>')" class="badge border border-info text-info bg-transparent icon-btn b-r-4"><i class="ti ti-pencil text-info"></i></a>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>                             
                </div>
                
            </div>               
        </div>
    </div>
     
</div>    
<script>
  $(document).on('click', '.copy-btn', function() {
    // Buscar el input más cercano
    var input = $(this).closest('.input-group').find('input');
    
    // Seleccionar y copiar
    input.select();
    document.execCommand('copy');

    // Opcional: mostrar alerta
    alert("¡Enlace copiado!");
  });
</script>
