
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<style>
     .input-group-text {
    min-width: 120px;
  }
</style>
<style>
        .input-group {
            display: flex;
            align-items: center;
        }

        .btn-full-width {
            width: 100%;
        }

        .btn-rounded-left {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .btn-rounded-right {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .input-group-append {
            margin-left: 5px; /* Espacio entre los botones */
        }

        .form-row {
            display: flex;
            justify-content: center; /* Centra los botones en la celda */
            align-items: center;
            gap: 5px; /* Espacio entre los botones */
        }
    </style>
<?php
$sales = $this->db->get_where('sale',array('sale_id'=>$sale_id))->result_array();

foreach($sales as $sale):


?>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <!-- Start Container Fluid -->

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <!-- Logo & title -->
                        <div class="clearfix">  
                                                                          
                            <div class="float-sm-start">
                                <div class="auth-logo">
                                    
                                    <img class="logo-dark me-1"  src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo');?>" alt="logo-dark" height="60px"/>
                                    
                                    <br>
                                    
                                    
                                </div>
                                <br>
                                
                                <h5 class="card-title mb-2"><?= $this->crud_model->getName('user',$sale['user_id']);?></h5>
                                <h5 class="card-title mb-2">Codigo de venta : <?= $sale['code']; ?></h5>
                                <h5 class="card-title mb-2">Fecha del reporte : <?= $sale['datetime']?></h5>
                                <br>
                                
                            </div>                                      
                        </div>
                        
                        <!-- end col
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <h6 class="fw-normal text-muted">Customer</h6>
                                <h6 class="fs-16"> Glenn H Smith</h6>
                                <address>
                                    135 White Cemetery Rd,<br>
                                    Perryville, KY, 40468<br>
                                    <abbr title="Phone">P:</abbr> (304) 584-4345
                                </address>
                            </div>
                        </div>
                          -->
                        <!-- end row -->

                        <div class="row">
                            <div class="col-12">
                                <div class="table-responsive table-borderless text-nowrap mt-3 table-centered">
                                    <table class="table mb-0">
                                        <thead class="bg-light bg-opacity-50">
                                            
                                            <tr>
                                                <th class="border-0 py-2">Nombre del cliente</th>
                                                <th class="border-0 py-2">Margen Total</th>
                                                <th class="border-0 py-2">Ganancia Neta</th>
                                                <th class="border-0 py-2">IVA</th>
                                                <th class="text-end border-0 py-2">Total a Facturar</th>
                                            </tr>
                                        </thead> <!-- end thead -->
                                        <tbody style="height:200px;">
                                            <tr>
                                                <td><?=  $this->crud_model->getName('client',$sale['client_id']); ?></td>
                                                <td>$<?= $sale['mgt'];?></td>
                                                <td>$<?= $sale['gnt'];?></td>
                                                <td>$<?= $sale['taxes'];?></td>
                                                <td class="text-end py-2"><?= $sale['fact_value'];?></td>
                                            </tr>
                                        </tbody> <!-- end tbody -->
                                        
                                    </table> <!-- end table -->
                                </div> <!-- end table responsive -->
                            </div> <!-- end col -->
                        </div> <!-- end row -->                                        
                    </div> <!-- end card body -->
                </div> <!-- end card -->
            </div> <!-- end col -->
        </div> <!-- end row -->
                
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="footerbutton ">
                        <h6 class="text-muted">Descargar respaldos o aceptar o rechazar reporte:</h6>
                        <table class="table form-row">
                            <tr>
                                <td class="form-row">
                                 <?php
                                     if($sale['excel'] == ''):
                                     ?>
                                    <!-- Botón para subir el comprobante de pago -->
                                    <button class="btn btn-secondary btn-full-width btn-rounded" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/up_document_pay/<?= $sale['sale_id'] ?>/2')" data-toggle="modal">
                                        Subir excel
                                    </button>
                                    <?php
                                    else:
                                    ?>
                                    <!-- Botón para actualizar el reporte -->
                                    <a class="btn btn-secondary btn-rounded" type="button" style="width:100%;margin-right:10px;" href="<?= base_url(); ?>portal/travel_report/downloadRecipe/<?= base64_encode($sale['excel']); ?>">
                                        Descargar excel  <i class="fas fa-download"></i>
                                    </a>
                                    <?php endif; ?>
            
                                </td>
                                <td>
                                     <?php
                                     if($sale['pay_document'] == ''):
                                     ?>
                                    <!-- Botón para subir el comprobante de pago -->
                                    <button class="btn btn-secondary btn-full-width btn-rounded text-white" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/up_document_pay/<?= $sale['sale_id'] ?>/1')">
                                        Subir comprobante
                                    </button>
                                    <?php
                                    else:
                                    ?>
                                    <!-- Botón para actualizar el reporte -->
                                    <a class="btn btn-info btn-rounded text-white" type="button" style="width:100%;margin-right:10px;" href="<?= base_url(); ?>portal/travel_report/downloadRecipe/<?= base64_encode($sale['pay_document']); ?>">
                                        Descargar comprobante  <i class="fas fa-download"></i>
                                    </a>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <a href="<?= base_url(); ?>portal/travel_report/<?= base64_encode($sale['sale_id']); ?>" class="btn btn-primary text-white">Editar</a>
                                </td>
                                <td>
                                    <?php if($sale['status'] == 0 ):?>
                                    <span href="javascript:void(0);"   class="badge badge-warning ">Venta pendiente</span>
                                    <?php elseif($sale['status'] == 1):?>
                                    <span href="javascript:void(0);"   class="badge badge-success ">Venta ya autorizada</span>
                                    <?php elseif($sale['status'] == 2):?>
                                    <span href="javascript:void(0);"  class="badge badge-danger">Venta rechazada</span>
                                    <?php elseif($sale['status'] == 4):?>
                                    <span href="javascript:void(0);"  class="badge badge-info">Venta pre autorizada</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endforeach; ?>    