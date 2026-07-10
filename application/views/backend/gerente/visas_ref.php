<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Visas</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/modal_visaref_form/0')" data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>

                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de visas</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table " id="sale_data">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th>No.</th>
                                                    <th>Nombre</th>
                                                    <th class="text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php
                                                    $this->db->order_by('id','ASC');
                                                    $this->db->where('status !=' ,0);
                                                    $this->db->where('user_id',$this->session->userdata('login_user_id'));
                                                    $lexvault = $this->db->get('visa_ref')->result_array();
                                                    foreach($lexvault as $row):
                                                        ?>
                                                        <tr>
                                                            <td><?= $row['id'] ?></td>
                                                            <td><?= htmlspecialchars($row['name']) ?></td>
                                                            <td class="text-center">
                                                                <!-- Botón Copiar -->
                                                                
                                                                <a href="<?= base_url('portal/visas/'.base64_encode($row['id'])) ?>"
                                                                   class="badge border border-info text-info bg-transparent"
                                                                   title="Ver detalles">
                                                                    <i class="fa-solid fa-file-lines fa-fw"></i>
                                                                </a>
                        
                                                                <!-- Botón Editar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-warning text-warning bg-transparent"
                                                                   title="Editar"
                                                                   onclick="showAjaxModal('<?= base_url('modal/popup/modal_visaref_form/'.$row['id']) ?>')">
                                                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                                                </a>
                        
                                                                <!-- Botón Eliminar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-danger text-danger bg-transparent"
                                                                   title="Eliminar"
                                                                   onclick="confirmDelete('portal/visas_ref/delete/<?= $row['id'] ?>')">
                                                                    <i class="fa-solid fa-trash fa-fw"></i>
                                                                </a>
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

