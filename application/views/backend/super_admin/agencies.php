<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Agencias</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/agency_form/')" data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>
                            <div class="row ps-2 pe-1">
                                <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                    <div class="card-body d-flex align-items-center p-4">
                                        <h4 class="fw-700 mb-0 font-xssss text-grey-900"><?= $this->db->get_where('rol',['rol_id'=>$rol_id])->row()->name; ?></h4>
                                    </div>
                                    <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                        <div class="table-responsive">
                                           <table class="table " id="dataTable">
                                                <thead>
                                                    <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                        <th>Nombres</th>
                                                        <th>Gerente</th>
                                                        <th>Insignias</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        <?php  
                                                            $agencies = $this->db->get_where('agency',['status'=>1])->result_array();
                                                            foreach($agencies as $agency):
                                                        ?>
                                                        <tr>
                                                            <td>
                                                                <div class="d-flex align-items-center">
                                                                      <img src="<?= base_url(); ?>public/assets/images/logo/<?= $agency['logo'];?>" alt="" class="avatar-xs rounded-circle me-2">
                                                                      <div>
                                                                          <h5 class="fs-14 m-0 fw-normal"><?= $agency['name'];?></h5>
                                                                      </div>
                                                                  </div>
                                                            </td>
                                                            <td>
                                                                <div class="d-flex align-items-center">
                                                                      <img src="<?= $this->crud_model->getPhoto('user',$agency['gerente_id']); ?>" alt="" class="avatar-xs rounded-circle me-2">
                                                                      <div>
                                                                          <h5 class="fs-14 m-0 fw-normal"><?= $this->crud_model->getName('user',$agency['gerente_id']); ?></h5>
                                                                      </div>
                                                                  </div>
                                                            </td>
                                                            <td>
                                                                <ul class="d-flex align-items-center justify-content-center mt-1">
                                                                    <!-- <li class="m-1"><img src="https://uicobe.com/html/sociala/images/top-student.svg" alt="icon"></li>
                                                                    <li class="m-1"><img src="https://uicobe.com/html/sociala/images/onfire.svg" alt="icon"></li>
                                                                    <li class="m-1"><img src="https://uicobe.com/html/sociala/images/challenge-medal.svg" alt="icon"></li> -->
                                                                    <li class="m-1"><img src="https://uicobe.com/html/sociala/images/fast-graduate.svg" alt="icon"></li>
                                                                </ul>
                                                            </td>
                                                            <td><?php echo $agency['status'] == 1 ? '<span class="badge border border-success text-success bg-transparent">Activo</span>':'<span class="badge border border-danger text-danger bg-transparent">Suspendido</span>'; ?>
                                                            </td>
                                                            <td>
                                                                <a href="<?= base_url(); ?>portal/agency_profile/<?= base64_encode($agency['id']);?>"  class="badge border border-primary text-primary bg-transparent icon-btn b-r-4"><i class="ti ti-user"></i></a>
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