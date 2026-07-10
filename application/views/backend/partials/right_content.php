<?php if($page_name == 'pos'): ?>
<div class="right-chat nav-wrap mt-2 right-scroll-bar">
            <div class="middle-sidebar-right-content">
                            <div class="card w-100 shadow-xss rounded-xxl border-0 p-0 ">
                                <div class="card-body d-flex align-items-center p-4 mb-0">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Productos</h4>
                                </div>
                                <form action="<?= base_url('cart/procesar_pedido'); ?>" method="post" id="cartForm"  >
                                <div  class="scroll-bar" style="max-height: 425px;">
                                   
                                    <?php 
                                        $total_cost = 0; 
                                        foreach ($this->cart->contents() as $item): 
                                            $total_cost += $item['sale_price'] * $item['qty']; 
                                            $main_image = $this->db->get_where('producto_images',array('product_id'=>$item['id'],'is_main'=>1))->first_row()->image_url;
                                                if (strpos($main_image, 'public') !== false): 
                                                    $cart_img = base_url() . $main_image; 
                                                else: 
                                                    $cart_img = 'http://d39ru7awumhhs2.cloudfront.net/'. $main_image; 
                                                endif; 
                                    ?>
                                                <input type="hidden" name="cart[<?= $item['rowid'] ?>][id]"    value="<?= $item['id'] ?>">
                                                <input type="hidden" name="cart[<?= $item['rowid'] ?>][name]"  value="<?= $item['name'] ?>">
                                                <input type="hidden" name="cart[<?= $item['rowid'] ?>][price]" value="<?= $item['price'] ?>">
                                                
                                                <div class="card-body bg-transparent-card d-flex p-3 bg-greylight m-3 rounded-3 mb-3" style="margin-bottom: 0 !important;" >
                                                    <figure class="avatar me-2 mb-0"><img src="<?= $cart_img; ?>" alt="image" class="shadow-sm rounded-circle w45 h55" onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo');?>';"></figure>
                                                    <h4 class="fw-700 text-grey-900 font-xssss mt-2"><?= $item['options']['nombre_real'] ?><span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">$<?= $item['price'] ?></span></h4>
                                                </div>
                                                <div class="card-body bg-transparent-card d-flex p-3 pt-0 bg-greylight rounded-3 m-3 mt-0 mb-3" style="margin-bottom: 0 !important;" >
                                                     <input class="h-35 w100 ms-1 me-1 border b-r-6 text-center count" required="" type="text" name="cart[<?= $item['rowid'] ?>][qty]" value="<?= $item['qty'] ?>">
                                                     <a href="javascript:void(0)" onclick="delete_item('cart/remove/<?= $item['rowid']; ?>')" class="btn-round-sm bg-danger text-white feather-trash font-xss ms-auto mt-2"></a>
                                                </div>
                                               
                                    <?php endforeach; ?>
                                </div>
                                <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 mb-3">
                                    <a href="javascript:void(0)" onclick="this.closest('form').submit(); return false;" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Actualizar</a>
                                </div>
                                
                                </form>
                            </div>

                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3 p-4">
                                <div class="card-body d-flex align-items-center p-4 mb-0">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Realizar Orden</h4>
                                </div>
                                <form method="post" id="saveSale"  action="<?php echo base_url('portal/product_sales/store_2'); ?>" enctype="multipart/form-data">
                                                <div class="form-group">
                                                    <label for="name">Nombres</label>
                                                    <input type="text" class="form-control" id="name" name="name" value="" required="">
                                                </div>
                                          
                                                <div class="form-group">
                                                    <label for="last_name">Apellidos</label>
                                                    <input type="text" class="form-control" id="last_name" name="last_name" value="" required="">
                                                </div>
                                                <div class="form-group">
                                                    <label for="phone">Teléfono</label>
                                                    <input type="number" class="form-control" id="phone" name="phone" value="" required="">
                                                </div>
                                                <div class="form-group">
                                                    <label for="email">Correo Electronico</label>
                                                    <input type="email" class="form-control" id="email" name="email" value="">
                                                </div>
                                                <div class="form-group">
                                                    <label for="email">Dirección</label>
                                                    <select id="pais" class="form-control" name="pais">
                                                        <option value="">Selecciona un país</option>
                                                    </select>
                                                    <br>
                                                    <select id="provincia" disabled class="form-control" name="provincia">
                                                        <option value="" class="form-control">Selecciona una provincia</option>
                                                    </select>
                                                    <br>
                                                    <select id="canton" disabled class="form-control" name="canton">
                                                        <option value="" class="form-control">Selecciona un cantón</option>
                                                    </select>
                                                    <br>
                                                    <textarea class="form-control" id="email" name="address" rows="3" ></textarea>
                                                </div>
                                                <div  class="form-check">
                                                     <label>
                                                        <input class="form-check-input" type="radio" name="recaudo" value="1" > Con Recaudo
                                                    </label>
                                                </div>
                                                <div  class="form-check">
                                                    <label>
                                                        <input class="form-check-input" type="radio" name="recaudo" value="0" checked> Sin Recaudo
                                                    </label>
                                                </div>
                                                
                                                <div  class="form-group" id="transferenciaInfo" style="display: block;">
                                                    <label for="numero_transferencia">Número de Transferencia:</label>
                                                    <input  class="form-control" type="text" id="numero_transferencia" name="numero_transferencia" placeholder="Ingrese el número">
                                                    <br>
                                                    <label for="foto_transferencia">Foto de Transferencia:</label>
                                                    <input  class="form-control" type="file" id="foto_transferencia" name="foto_transferencia" accept="image/*">
                                                </div>
                                            </form>
                            </div>

                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 p-4">
                                <div class="table-responsive">
                                    <table class="table cart-side-table mb-0">
                                        <tbody>
                                        <tr >
                                            <th class="">Sub Total :</th>
                                            <th class="text-end">
                                                  <span >
                                                    $<?php echo number_format($this->cart->total(),2,'.',','); ?>
                                                  </span>
                                            </th>
                                        </tr>
                                        <tr class="">
                                            <th>Costo adicional (USD) :</th>
                                            <th class="text-end">
                                                <span >
                                                  $<?= $this->session->userdata('cart_aditional') != '' ? number_format($this->session->userdata('cart_aditional'),2,'.',',') : number_format(0,2,'.',','); ?>
                                                </span>
                                            </th>
                                        </tr>
                                         <tr class="">
                                            <th>Costo de envío (USD) :</th>
                                            <th class="text-end">
                                                <span >
                                                  $<?= number_format($this->crud_model->getInfo('cost_delivery'),2,'.',','); ?>
                                                </span>
                                            </th>
                                        </tr>
                                         <tr class="cost_delivery_aditional " style="display:none">
                                            <th>Costo adicional de envío (USD) :</th>
                                            <th class="text-end">
                                                <span >
                                                  $<?= number_format($this->crud_model->getInfo('cost_delivery_aditional'),2,'.',','); ?>
                                                </span>
                                            </th>
                                        </tr>
                                        <tr class="total-price" style="border-top:1px solid black"  >
                                            <th>Total de la venta(USD) :</th>
                                            <th class="text-end">
                                                <span id="cart-total" data-base="<?php echo $this->cart->total()+ $this->session->userdata('cart_aditional')+ $this->crud_model->getInfo('cost_delivery'); ?>">
                                                  $<?php echo  number_format($this->cart->total()+ $this->session->userdata('cart_aditional')+ $this->crud_model->getInfo('cost_delivery'),2,'.',',');?>
                                                </span>
                                            </th>
                                        </tr>
                                        <tr class="total-price" >
                                            <th>Costo del producto (USD) :</th>
                                            <th class="text-end">
                                                <span >
                                                -  $<?php echo  number_format($total_cost,2,'.',',');?>
                                                </span>
                                            </th>
                                        </tr>
                                        <tr class="">
                                            <th>Costo de envío (USD) :</th>
                                            <th class="text-end">
                                                <span >
                                                 - $<?= number_format($this->crud_model->getInfo('cost_delivery'),2,'.',','); ?>
                                                </span>
                                            </th>
                                        </tr>
                                        <tr class="cost_delivery_aditional" style="display:none">
                                            <th>Costo adicional de envío (USD) :</th>
                                            <th class="text-end">
                                                <span >
                                                 - $<?= number_format($this->crud_model->getInfo('cost_delivery_aditional'),2,'.',','); ?>
                                                </span>
                                            </th>
                                        </tr>
                                        <tr class="total-price" style="border-top:1px solid black">
                                          <th>Beneficio estimado(USD) :</th>
                                          <th class="text-end">
                                            <span >
                                              $<?php echo number_format($this->cart->total() + $this->session->userdata('cart_aditional') - $total_cost, 2, '.', ','); ?>
                                            </span>
                                          </th>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="form-group mt-2">
                                    <a href="#"
                                       onclick="
                                           const f = document.getElementById('saveSale');
                                           if (f.checkValidity()) f.submit();
                                           else f.reportValidity();
                                           return false;
                                       "
                                       class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">
                                       Guardar
                                    </a>
                                </div>
                            </div>

            </div>
        </div>
<?php elseif($page_name == 'pos_visas'): ?>
<div class="right-chat nav-wrap mt-2 right-scroll-bar">
    <div class="middle-sidebar-right-content">
        <div class="card w-100 shadow-xss rounded-xxl border-0 p-0 ">
            <div class="card-body d-flex align-items-center p-4 mb-0">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Super Visas</h4>
            </div>
            <form action="<?= base_url('cart/procesar_pedido'); ?>" method="post" id="cartForm"  >
            <div  class="scroll-bar" style="max-height: 425px;">
               
                <?php 
                    $total_cost = 0; 
                    foreach ($this->cart->contents() as $item): 
                        $total_cost += $item['sale_price'] * $item['qty']; 
                        $main_image = $this->db->get_where('producto_images',array('product_id'=>$item['id'],'is_main'=>1))->first_row()->image_url;
                            if (strpos($main_image, 'public') !== false): 
                                $cart_img = base_url() . $main_image; 
                            else: 
                                $cart_img = 'http://d39ru7awumhhs2.cloudfront.net/'. $main_image; 
                            endif; 
                ?>
                            <input type="hidden" name="cart[<?= $item['rowid'] ?>][id]"    value="<?= $item['id'] ?>">
                            <input type="hidden" name="cart[<?= $item['rowid'] ?>][name]"  value="<?= $item['name'] ?>">
                            <input type="hidden" name="cart[<?= $item['rowid'] ?>][price]" value="<?= $item['price'] ?>">
                            
                            <div class="card-body bg-transparent-card d-flex p-3 bg-greylight m-3 rounded-3 mb-3" style="margin-bottom: 0 !important;" >
                                <figure class="avatar me-2 mb-0"><img src="<?= $cart_img; ?>" alt="image" class="shadow-sm rounded-circle w45 h55" onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo');?>';"></figure>
                                <h4 class="fw-700 text-grey-900 font-xssss mt-2"><?= $item['options']['nombre_real'] ?><span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">$<?= $item['price'] ?></span></h4>
                            </div>
                            <div class="card-body bg-transparent-card d-flex p-3 pt-0 bg-greylight rounded-3 m-3 mt-0 mb-3" style="margin-bottom: 0 !important;" >
                                 <input class="h-35 w100 ms-1 me-1 border b-r-6 text-center count" required="" type="text" name="cart[<?= $item['rowid'] ?>][qty]" value="<?= $item['qty'] ?>">
                                 <a href="javascript:void(0)" onclick="delete_item('cart/remove/<?= $item['rowid']; ?>')" class="btn-round-sm bg-danger text-white feather-trash font-xss ms-auto mt-2"></a>
                            </div>
                           
                <?php endforeach; ?>
            </div>
            <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 mb-3">
                <a href="javascript:void(0)" onclick="this.closest('form').submit(); return false;" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Actualizar</a>
            </div>
            
            </form>
        </div>

        <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3 p-4">
            <div class="card-body d-flex align-items-center p-4 mb-0">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Realizar Orden</h4>
            </div>
            <form method="post" id="saveSale"  action="<?php echo base_url('portal/product_sales/store_2'); ?>" enctype="multipart/form-data">
                <input type="hidden" value="3" name="type" />
                <div class="form-group">
                    <label for="name">Nombres</label>
                    <input type="text" class="form-control" id="name" name="name" value="" required="">
                </div>
          
                <div class="form-group">
                    <label for="last_name">Apellidos</label>
                    <input type="text" class="form-control" id="last_name" name="last_name" value="" required="">
                </div>
                <div class="form-group">
                    <label for="phone">Teléfono</label>
                    <input type="number" class="form-control" id="phone" name="phone" value="" required="">
                </div>
                <div class="form-group">
                    <label for="email">Correo Electronico</label>
                    <input type="email" class="form-control" id="email" name="email" value="">
                </div>
                <div class="form-group">
                    <label for="email">Dirección</label>
                    <textarea class="form-control" id="email" name="address" rows="3" ></textarea>
                </div>
                
                <div  class="form-group">
                    <input  type="hidden" name="recaudo" value="0" >
                    <label for="numero_transferencia">Número de Transferencia:</label>
                    <input  class="form-control" type="text" id="numero_transferencia" name="numero_transferencia" placeholder="Ingrese el número">
                    <br>
                    <label for="foto_transferencia">Foto de Transferencia:</label>
                    <input  class="form-control" type="file" id="foto_transferencia" name="foto_transferencia" accept="image/*">
                </div>
            </form>
        </div>

        <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 p-4">
            <div class="table-responsive">
                <table class="table cart-side-table mb-0">
                    <tbody>
                        <tr >
                            <th class="">Sub Total :</th>
                            <th class="text-end">
                                  <span >
                                    $<?php echo number_format($this->cart->total(),2,'.',','); ?>
                                  </span>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="form-group mt-2">
                <a href="#"
                   onclick="
                       const f = document.getElementById('saveSale');
                       if (f.checkValidity()) f.submit();
                       else f.reportValidity();
                       return false;
                   "
                   class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">
                   Guardar
                </a>
            </div>
        </div>

    </div>
</div>
<?php elseif($page_name == 'patients/patient_profile'): ?>
<div class="right-chat nav-wrap mt-2 right-scroll-bar">
    <div class="middle-sidebar-right-content">
        <div class="card w-100 shadow-xss rounded-xxl border-0  ">
            <div class="card-body d-flex align-items-center p-4 pb-0 mb-0">
                <h4 class="fw-700 mb-0 ">Antecedentes</h4>
            </div>
           
            <div  class="scroll-bar mt-0 pt-0" >
               
               <?php if(empty($background_types)): ?>
                        
                    <div class="col-12">
                        <div class="alert alert-warning">
                            No existen tipos de antecedentes.
                        </div>
                    </div>
        
                <?php else: ?>
                    <div class="card-body   ps-4 pe-4 pb-0 mb-3">
                    <?php foreach($background_types as $field): ?>
        
                        <?php
                            $value = '';
        
                            if(isset($values[$field['id']]))
                            {
                                $value = $values[$field['id']];
                            }
                        ?>
                            
                        <div class="mb-3">
        
                            <strong class="fw-700 mb-3">
                                <?= $field['name']; ?>
                            </strong>
    
                            <?php if(trim($value) != ''): ?>
    
                                <div class="text-grey-700">
                                    <?= nl2br(htmlspecialchars($value)); ?>
                                </div>
    
                            <?php else: ?>
    
                                <div class="text-muted">
                                    Sin información registrada.
                                </div>
    
                            <?php endif; ?>
        
                        </div>    
        
                    <?php endforeach; ?>
        
                <?php endif; ?>
                </div>   
            </div>
            <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 mb-3">
                <a href="<?= base_url(); ?>portal/patient_backgrounds/<?= $user_id; ?>"  class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Editar</a>
            </div>
            
        </div>
    </div>
</div>
<?php else:?>
<div class="right-chat nav-wrap mt-2 right-scroll-bar">
            <div class="middle-sidebar-right-content">
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 d-none">
                                <div class="card-body d-flex align-items-center p-4">
                                    <ul class="d-flex align-items-center justify-content-center mt-1">
                                        <li class="m-1"><img src="https://uicobe.com/html/sociala/images/top-student.svg" alt="icon"></li>
                                        <li class="m-1"><img src="https://uicobe.com/html/sociala/images/onfire.svg" alt="icon"></li>
                                        <li class="m-1"><img src="https://uicobe.com/html/sociala/images/challenge-medal.svg" alt="icon"></li>
                                        <li class="m-1"><img src="https://uicobe.com/html/sociala/images/fast-graduate.svg" alt="icon"></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                                <div class="card-body d-block">
                                    <!-- Tarjeta Ziigo (Superior) - Naranja -->
                                    <div class="card-wrapper">
                                        <div class="card-container payoneer-card">
                                            <!-- 1. Encabezado: Logo Ziigo (Superior Derecha) -->
                                            <div class="card-header">
                                                <div class="ziigo-logo">
                                                    <img src="https://red.ziigo.pro/public/assets/images/logo/ziigo.png" 
                                                         alt="Ziigo Logo" 
                                                         onerror="this.src='https://placehold.co/80x30/FFFFFF/000000?text=Ziigo'">
                                                </div>
                                            </div>
                                            
                                            <!-- 2. Medio: Número de Tarjeta -->
                                            <div class="card-number-row">
                                                <div class="card-number-style">$<?= $this->crud_model->getUserBalanceTotal('user',$this->session->userdata('login_user_id')); ?> dolares</div>
                                            </div>
                                
                                            <!-- 3. Pie de página: Nombre, Expiración, y Logo Red -->
                                            <div class="card-footer">
                                                <!-- Nombre del Titular -->
                                                <div class="holder-info">
                                                    <div class="card-label">Titular</div>
                                                    <div class="holder-name font-xsssss"><?php echo $this->crud_model->getName('user',$this->session->userdata('login_user_id')); ?></div>
                                                </div>
                                
                                                <!-- Fecha y Logo de Red -->
                                               
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                    <!-- Tarjeta Ziigo (Inferior) - Azul -->
                                    <div class="card-wrapper">
                                        <div class="card-container blue-card">
                                            <!-- 1. Encabezado: Logo Ziigo (Superior Derecha) -->
                                            <div class="card-header">
                                                <div class="ziigo-logo">
                                                    <img src="https://red.ziigo.pro/public/assets/images/logo/ziigo.png" 
                                                         alt="Ziigo Logo" 
                                                         onerror="this.src='https://placehold.co/80x30/FFFFFF/000000?text=Ziigo'">
                                                </div>
                                            </div>
                                
                                            <!-- 2. Medio: Número de Tarjeta -->
                                            <div class="card-number-row">
                                                <div class="card-number-style"><?= $this->crud_model->getUserPointsTotal('user',$this->session->userdata('login_user_id')); ?> puntos</div>
                                            </div>
                                
                                            <!-- 3. Pie de página: Nombre, Expiración, y Logo Red -->
                                            <div class="card-footer">
                                                <!-- Nombre del Titular -->
                                                <div class="holder-info">
                                                    <div class="card-label">Titular</div>
                                                    <div class="holder-name font-xsssss"><?php echo $this->crud_model->getName('user',$this->session->userdata('login_user_id')); ?></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </div>
                            </div>
                            <?php $gerente_id = $this->db->get_where('agency',['id'=>$this->session->userdata('current_agency')])->row()->gerente_id;?>
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                                <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 border-top-xs bor-0">
                                    <figure class="avatar me-3"><img src="<?= $this->crud_model->getPhoto('user',$gerente_id);?>" alt="image" class="shadow-sm rounded-circle w45"></figure>
                                    <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?= $this->crud_model->getName('user',$gerente_id);?><span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">Gerente Comercial</span></h4>
                                </div>
                                <div class="pt-0 ps-4 pe-4 pb-4">
                                    <a href="https://wa.me/502XXXXXXXX" target="_blank" style="float:right"
                                       class="p-2 lh-20 w100 bg-success me-2 text-white font-xssss fw-600 ls-1 rounded-xl d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" class="me-1"><path fill="#fff" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" stroke-width="1" stroke="#fff"/></svg>
                                        Whatsapp
                                    </a>
                                </div>
                            </div>
                            
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 h90px">
                                <div class="card-body d-flex align-items-center p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Notas</h4>
                                </div>
                                <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 border-top-xs bor-0 " style="height:230px !important">
                                    <div class="card w-100 h90px p-3 border-0 mb-3 rounded-xxl bg-lightblue2 shadow-none overflow-hidden">
                                        <p><?= $this->db->get_where('user',['user_id'=>$this->session->userdata('login_user_id')])->row()->notes; ?></p>
                                    </div>
                                </div>
                                
                            </div>

                           
                            <?php 
                                    
                                $this->db->limit(3);
                                $this->db->where('user_id',   $this->session->userdata('login_user_id'));
                                $this->db->where('status', 0);
                                $query = $this->db->get('tasks');
                                $tasks = $query->result();
                                if(count($tasks) > 0):
                                 
                            ?>
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 ">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Tareas</h4>
                                    <a href="<?= base_url(); ?>portal/tasks" class="fw-600 ms-auto font-xssss text-primary">Ver todas</a>
                                </div>
                                
                                <?php 
                                      foreach ($tasks as $task):
                                          
                                          if($task->status == 0){
                                                    $st     = 'bg-primary';
                                                    $st_txt = '<span class="badge text-light-info"> Pendiente </span>';
                                            }else if($task->status == 1){
                                                    $st     = 'bg-success';
                                                    $st_txt = '<span class="badge text-light-success"> Finalizada </span>';
                                            }else if($task->status == 2){
                                                    $st     = 'bg-danger';
                                                    $st_txt = '<span class="badge text-light-danger"> Cancelada </span>';
                                            }else{
                                                    $st     = 'bg-primary';
                                                    $st_txt = '<span class="badge text-light-info"> Pendiente </span>';
                                            }
                                ?>
                                <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                                     <div class="<?= $st; ?> me-2 p-3 rounded-xxl text-center">
                                        <h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0">
                                            <span class="d-block font-xsss fw-600 uppercase">
                                                <?= date('M', strtotime($task->date)); ?>
                                            </span>
                                            <?= date('d', strtotime($task->date)); ?>
                                            <br>
                                            <span class="d-block font-xsss fw-600 uppercase">
                                                <?= date('H:i', strtotime($task->time)); ?>
                                            </span>
                                        </h4>
                                    </div>
                                    <h4 class="fw-700 text-grey-900 font-xssss mt-2 flex-grow-1">
                                                                        <?= $task->name ?>
                                                                        <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">
                                                                            <?php if($task->patient_id != '0') echo "Cliente: ".$this->crud_model->getName('client',$task->patient_id); ?>
                                                                        </span>
                                                                    </h4>
                                </div>
                                <?php endforeach; ?>
                            </div>
                            <?php endif; ?>

            </div>
        </div>
<?php endif;?>