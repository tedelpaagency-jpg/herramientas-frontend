<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Ventas</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="<?= base_url(); ?>portal/new_travel_report"  data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>

                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de ventas</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table text-nowrap" id="dataTable">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th class="border-0 py-2">Usuario</th>
                                                    <th class="border-0 py-2">Codigo de venta</th>
                                                    <th class="border-0 py-2">Nombre de la venta</th>
                                                    <th class="border-0 py-2">Equipo</th>
                                                    <th class="border-0 py-2">Fecha de la venta</th>
                                                    <th class="border-0 py-2">Total</th>
                                                    <th class="border-0 py-2">Tu Ganancia</th>
                                                    <th class="border-0 py-2">Estado</th>
                                                    <th class="border-0 py-2">Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php 
                                                           
                                                   $this->db->order_by('sale_id','DESC');
                                                   
                                                   if($status != '')
                                                   $this->db->where('status',$status);
                                                    $this->db->where('user_id',$this->session->userdata('login_user_id'));
                                                   $this->db->where('pais_id',$this->session->userdata('current_country'));
                                                   $this->db->where('status !=',3);
                                                   $sales = $this->db->get('sale')->result();
                                                   
                                                   foreach($sales as $sale): 
                                                      ?> 
                                                  <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <img src="<?= $this->crud_model->getPhoto('user',$sale->user_id); ?>" alt="" class="avatar-xs rounded-circle me-2">
                                                            <div>
                                                                <h5 class="fs-14 m-0 fw-normal"><?= $this->crud_model->getName('user',$sale->user_id); ?></h5>
                                                            </div>
                                                        </div>
                                                        
                                                    </td>
                                                        <td><?php echo $sale->code; ?></td>    
                                                        <td><?php echo $sale->name; ?></td>
                                                        <td><?php echo $this->crud_model->getCompanyName($sale->company_id); ?></td>
                                                        <td><?php echo $sale->datetime; ?></td>
                                                        <td>
                                                             <?php if($sale->gnt == ''): ?><span class="badge border border-warning text-warning bg-transparent">Pendiente</span><?php else: ?><span class="badge border border-success text-success bg-transparent">$<?php  echo number_format($sale->gnt,2,'.',',');?></span><?php endif; ?>
                                                        </td>
                                                        <td>
                                                             <?php if($sale->commition_percent == ''): ?><span class="badge border border-warning text-warning bg-transparent">Pendiente</span><?php else: ?><span class="badge border border-success text-success bg-transparent">$<?php  echo number_format($sale->commition_percent,2,'.',',');?></span><?php endif; ?>
                                                        </td>
                                                        
                                                         <td>
                                                             <?php if($sale->status == 0): ?><span class="badge border border-warning text-warning bg-transparent">Pendiente</span>
                                                             <?php elseif($sale->status == 1): ?><span class="badge border border-success text-success bg-transparent">Aprobado</span>
                                                             <?php elseif($sale->status == 2): ?><span class="badge border border-danger text-success bg-transparent">Rechazado</span>
                                                             <?php elseif($sale->status == 4): ?><span class="badge border border-warning text-warning bg-transparent">Pre aprobado</span>
                                                             <?php endif; ?>
                                                        </td>
                                                        
                                                        <td >
                                                            <a  href="<?= base_url(); ?>portal/travel_report_details/<?= base64_encode($sale->sale_id); ?>" class="badge border border-info text-info bg-transparent"><i class="fa-solid fa-file-lines"></i></a>
                                                            <a  href="<?= base_url(); ?>portal/travel_report/<?= base64_encode($sale->sale_id); ?>" class="badge border border-success text-success bg-transparent"><i class="fa-solid fa-pencil"></i></a>
                                                             <a  class="badge border border-danger text-danger bg-transparent" onclick="delete_element('portal/travel_report_details/delete/<?= base64_encode($sale->sale_id); ?>')"><i class="fa-solid fa-trash"></i></a>
                                                             
                                                        </td>
                                                  
                                                        
                                                        
                                                        
                                                    </tr>
                                                    <?php 
                                                    endforeach;
                                                    ?> 
                                                 
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>               
                    </div>
                </div>
                 
            </div>

