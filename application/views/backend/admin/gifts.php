<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Regalos</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    
                                </div>
                            </div>
                            
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de regalos</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table " id="sale_data">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th>No.</th>
                                                    <th>Fecha</th>
                                                    <th>Agencia</th>
                                                    <th>Premio</th>
                                                    <th>Fecha de Canjeado</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php
                                                    $cont = 1;
                                                    
                                                    $this->db->order_by('id','DESC');
                                                    $this->db->where('agency_id',$this->session->userdata('current_agency'));
                                                    $this->db->where('status !=',0);
                                                    $gifts = $this->db->get('agency_roulette')->result_array();
                                                    foreach($gifts as $row):
                                                       $agency = $this->db->get_where('agency',['id'=>$row['agency_id']])->row();
                                                        ?>
                                                        <tr>
                                                            <td><?= $cont++; ?></td>
                                                            <td><?= $row['assigned_at'] ?></td>
                                                            <td>
                                                                <div class="d-flex align-items-center">
                                                                      <img src="<?= base_url(); ?>public/assets/images/logo/<?= $agency->logo;?>" alt="" class="avatar-xs rounded-circle me-2">
                                                                      <div>
                                                                          <h5 class="fs-14 m-0 fw-normal"><?php echo $agency->name; ?></h5>
                                                                      </div>
                                                                </div>
                                                            </td>
                                                              <td>
                                                            
                                                                <?php echo $row['status'] == 1 ? '<span class="badge border border-primary text-primary bg-transparent">Pendiente</span>':$this->db->get_where('rewards',['id'=>$row['reward']])->row()->name; ?>
                                                            </td>
                                                            <td>
                                                                <?php echo $row['status'] == 1 ? '<span class="badge border border-primary text-primary bg-transparent">Pendiente</span>':$row['winner_at']; ?>
                                                            </td>
                                                          
                                                            <td><?php echo $row['status'] == 1 ? '<span class="badge border border-primary text-primary bg-transparent">Pendiente</span>':'<span class="badge border border-warning text-warning bg-transparent">Canjeado</span>'; ?></td>
                                                            
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

