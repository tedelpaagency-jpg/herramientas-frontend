
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
$sales = $this->db->get_where('product_sales',array('id'=>$id))->result_array();

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
                                                    
                                                    <h5 class="card-title mb-2"><b>Agente:</b> <?= $this->crud_model->getName('user',$sale['seller_id']);?></h5>
                                                    <h5 class="card-title mb-2"><b>Codigo de venta:</b> <?= $sale['id']; ?></h5>
                                                    <h5 class="card-title mb-2"><b>Fecha del reporte:</b> <?= $sale['created_at']?></h5>
                                                    <h5 class="card-title mb-2"><b>Dirección:</b> <?= $sale['address'] ?>  </h5>
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
                                                            <thead class="bg bg-opacity-50">
                                                                
                                                                <tr>
                                                                    <th class="border-0 py-2">Nombre del cliente</th>
                                                                    <th class="border-0 py-2">Producto</th>
                                                                    <th class="border-0 py-2">Cantidad</th>
                                                                    <th class="border-0 py-2">Precio</th>
                                                                    <th class="text-end border-0 py-2">Total a Facturar</th>
                                                                </tr>
                                                            </thead> <!-- end thead -->
                                                                <tbody style="height:200px;">
                                                                      <?php
                                                                    $details = json_decode($sale['products'],true);
                                                                    foreach($details as $detail):
                                                                        $total_value          +=  $detail['subtotal'];
                                                                        
                                                                        
                                                                          $main_image = $this->db->get_where('producto_images', array('product_id' => $detail['id'], 'is_main' => 1))->first_row()->image_url;
                                                                
                                                                            if (strpos($main_image, 'public') !== false): 
                                                                               $src = base_url() . $main_image; 
                                                                            else: 
                                                                               $src ='http://d39ru7awumhhs2.cloudfront.net/'.$main_image; 
                                                                            endif; 
                                                                            
                                                                            
                                                                ?>
                                                                <tr>
                                                                    <td>
                                                                        <div class="d-flex align-items-center gap-2">
                                                                            <img alt="" class="w-50 h-50"
                                                                                 src="<?= $src; ?>">
                                                                            <div class="cart-details">
                                                                                <p><?= $detail['options']['nombre_real'] ?></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td><?= $detail['qty'];?></td>
                                                                    <td>$<?= $detail['sale_price'];?></td>
                                                                    <td>$<?= $detail['price'];?></td>
                                                                    
                                                                    <td>$<?= $detail['subtotal'];?></td>
                                                                </tr>
                                                                 <?php endforeach;?>
                                                            </tbody> <!-- end tbody -->
                                                            <tfooter>
                                                                <tr style="border-top:1px solid black">
                                                                     <th colspan="4" class="text-end">Total </th>
                                                                     <th class="">$<?= number_format($total_value,2,'.',','); ?></th>
                                                                  </tr>
                                                            </tfooter>
                                                        </table> <!-- end table -->
                                                    </div> <!-- end table responsive -->
                                                </div> <!-- end col -->
                                            </div> <!-- end row -->                                        
                                        </div> <!-- end card body -->
                                    </div> <!-- end card -->
                                </div> <!-- end col -->
                            </div> <!-- end row -->
                            
                             <div class="col-12 mt-3">
                                    <div class="card">
                                        <div class="card-body">
                                            
                                            
                                             
                                                <div class="footerbutton ">
                                                       
                                                    <h6 class="text-muted">Descargar respaldos o aceptar o rechazar reporte:</h6>
                                                    <table class="table form-row">
                                                        <tr>
                                                            <td style="display: flex;">
                                                                 <?php
                                                                 if($sale['foto_transferencia'] == '' ):
                                                                     if( $sale['status'] != 2):
                                                                 ?>
                                                                <!-- Botón para subir el comprobante de pago -->
                                                                <button class="btn btn-secondary btn-full-width btn-rounded" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/up_document_product_pay/<?= $sale['id'] ?>/1')">
                                                                    Subir comprobante
                                                                </button>
                                                                <?php
                                                                endif;
                                                                else:
                                                                ?>
                                                                <button class="btn btn-secondary btn-full-width btn-rounded" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/up_document_product_pay/<?= $sale['id'] ?>/1')">
                                                                    Ver comprobante
                                                                </button>
                                                                <!-- Botón para actualizar el reporte -->
                                                                <a class="btn btn-info btn-rounded" type="button" style="margin-right:10px;" href="<?= base_url(); ?>portal/product_sales_details/downloadRecipe/<?= base64_encode($sale['foto_transferencia']); ?>">
                                                                     <i class="fas fa-download"></i>
                                                                </a>
                                                                <?php endif; ?>
                                                            </td>
                                                            <td>
                                                                <?php if($sale['status'] == 0 || $sale['status'] == 4 ):?>
                                                                <a href="javascript:void(0);" onclick="reject_element('portal/product_sales_details/reject/<?= base64_encode($sale['id']); ?>')" class="btn btn-danger b-r-4">Rechazar</a>
                                                                <a href="javascript:void(0);" onclick="auth_element('portal/product_sales_details/auth/<?= base64_encode($sale['id']); ?>')" class="btn btn-info b-r-4">Aprovar</a>
                                                                
                                                                <?php elseif($sale['status'] == 1):?>
                                                                <a href="javascript:void(0);" onclick="auth_element('portal/product_sales_details/send/<?= base64_encode($sale['id']); ?>')" class="btn btn-warning b-r-4">Enviar</a>
                                                                <?php elseif($sale['status'] == 5):?>
                                                                <a href="javascript:void(0);" onclick="auth_element('portal/product_sales_details/delivered/<?= base64_encode($sale['id']); ?>')" class="btn btn-success b-r-4">Entregar</a>
                                                                <?php endif; ?>
                                                                
                                                                <?php if($sale['status'] == 0 ):?>
                                                                 <a href="javascript:void(0);"   class="text-warning b-r-4">Venta pendiente</a>
                                                                <?php elseif($sale['status'] == 1):?>
                                                                <a href="javascript:void(0);"   class="text-info b-r-4">Venta aprobada</a>
                                                                <?php elseif($sale['status'] == 2):?>
                                                                <a href="javascript:void(0);"  ><h3 class="text-danger b-r-4">Venta rechazada</h3></a>
                                                                <span class="badge text-info" style="font-size:18px;">Motivo: <?= $sale['reject_description']; ?></span>
                                                                <?php elseif($sale['status'] == 4):?>
                                                                <a href="javascript:void(0);"  class="text-primary b-r-4">Venta verificada</a>
                                                                <?php elseif($sale['status'] == 5):?>
                                                                <a href="javascript:void(0);"  class="text-warning b-r-4">Venta enviada</a>
                                                                <?php elseif($sale['status'] == 6):?>
                                                                <a href="javascript:void(0);"  class="text-success b-r-4">Venta entregada</a>
                                                                <?php endif; ?>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                   
                                                    
                                                
                                            </div>
                                            
                            
                                
                                        </div>
                                    
                            </div>
                        
                        
                        
<?php endforeach; ?>    
                        
            <style>
            .footerbutton {
    text-align: center;
}
            </style>
            
    </div>
</div>
</div>
             <script>
     
function auth_element(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se autorizara esta venta y solo un administrador podra actualizar la información asociada..",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#9fd13b',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, autorizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = '<?= base_url(); ?>'+url;
        }
    })
}

function reject_element(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se rechazara esta venta y solo un administrador podra actualizar la información asociada..",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#9fd13b',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = '<?= base_url(); ?>'+url;
        }
    })
}

                       
   function preaprove_element(url)
    {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "La venta se marcara como pre aprobada.",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#9fd13b',
            cancelButtonColor: '#fd4f57',
            confirmButtonText: 'Sí, pre aprovar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) 
            {
                location.href = '<?= base_url(); ?>'+url;
            }
        })
    }
 </script>