<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Permisos</h2>
                        <div class="search-form-2 ms-auto">
                            <i class="ti-search font-xss"></i>
                            <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                        </div>
                        <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url() ?>modal/popup/modal_permissions/');"  class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>
                <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">
                    <div class="card-body d-flex align-items-center p-4">
                        <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de permisos</h4>
                    </div>
                    <div class="card-body pt-0 ps-4 pe-4 pb-3">
                        <div class="table-responsive">
                            <table class="table" id="plans_table">
                                <thead>
                                    <tr class="fw-700 font-xssss text-grey-900">
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php  
                                        $this->db->order_by('id','DESC');
                                        $permissions = $this->db->get('permissions')->result_array(); 
                                        foreach($permissions as $permission):
                                    ?>
                                    <tr>
                                        <td><?= $permission['name'] ?></td>
                                        <td>
                
                                            <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url() ?>modal/popup/modal_permissions/<?= $permission['id']; ?>');" class="badge border border-warning text-warning bg-transparent">
                                                <i class="fa-solid fa-pencil fa-fw"></i>
                                            </a>
                
                                            <a href="javascript:void(0)" onclick="delete_element('permissions/delete/<?= $permission['id'] ?>')" class="badge border border-danger text-danger bg-transparent">
                                                <i class="fa-solid fa-trash fa-fw"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <?php endforeach;?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>               
        </div>
    </div>
</div>
