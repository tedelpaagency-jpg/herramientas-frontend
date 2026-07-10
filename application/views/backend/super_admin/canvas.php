
 
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Canvas</h2>
                        <div class="search-form-2 ms-auto">
                            <i class="ti-search font-xss"></i>
                            <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                        </div>
                        <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                        <a href="<?= base_url(); ?>portal/canvas_form/"  data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>

                <div class="row ps-2 pe-1">
                    <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de canvas</h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombres</th>
                                                <th>Imagen</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           <?php $canvas = $this->db->get_where('canvas',['status'=>1])->result(); ?>
                                            <?php foreach($canvas as $canva): ?>
                                                <tr>
                                                    <td>
                                                        <h5 class="fs-14 m-0 fw-normal"><?php echo $canva->name; ?></h5>
                                                    </td>
                                                    <td>
                                                        <a href="<?php echo $this->crud_model->getPhotoCanvas('canvas',$canva->id); ?>"><img src="<?php echo $this->crud_model->getPhotoCanvas('canvas',$canva->id); ?>" width="50px;"></a>
                                                    </td>
                                                    
                                                  
                                                    <td><?php echo $canva->status == 1 ? '<span class="badge border border-success text-success bg-transparent">Activo</span>':'<span class="badge border border-danger text-danger bg-transparentr">Cerrado</span>'; ?></td>
                                                    <td>
                                                        <a href="<?= base_url().'portal/canvas_form/'.base64_encode($canva->id); ?>"  class="badge border border-success text-success bg-transparent icon-btn b-r-4"><i class="ti ti-file "></i></a>
                                                         <a href="javascript:void(0)"  onclick="confirm_element('<?= 'portal/canvas/sendCanvas/'.base64_encode($canva->id); ?>')" class="badge border border-info text-info bg-transparent icon-btn b-r-4"><i class="fa-solid fa-plane-departure"></i></a>
                                                        <a href="javascript:void(0)" class="badge border border-danger text-danger bg-transparent icon-btn b-r-4" onclick="delete_element('portal/canvas/deleteCanva/<?= base64_encode($canva->id); ?>')"><i class="ti ti-trash"></i></a>
                                                       
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

