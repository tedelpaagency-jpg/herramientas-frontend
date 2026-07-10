<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <a href="javascript:history.back()" class="me-3 text-grey-900">
                                        <i class="fa-solid fa-arrow-left font-md"></i>
                                    </a>
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">
                                        Premios para la Ruleta
                                    </h2>
                                </div>
                            </div>
                           
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de ruletas</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <form method="post" action="<?php echo base_url('portal/roulette_rewards/saveRoulette_rewards/'.$roulette->id); ?>">
                                    <?php foreach($rewards as $r): ?>
                                        <div class="col-md-12 mb-2 border-bottom pb-2">
                                            <div class="form-check">
                                                <input class="form-check-input"
                                                       type="checkbox"
                                                       name="rewards[<?php echo $r->id; ?>][enabled]"
                                                       value="1"
                                                       <?php echo isset($assigned[$r->id]) ? 'checked':''; ?>>
                            
                                                <label class="form-check-label fw-600">
                                                    <?php echo $r->name; ?>
                                                </label>
                                            </div>
                            
                                            <div class="mt-2">
                                                <label>Probabilidad (0 - 1)</label>
                                                <input type="number"
                                                       step="0.0001"
                                                       class="form-control"
                                                       name="rewards[<?php echo $r->id; ?>][probability]"
                                                       value="<?php echo isset($assigned[$r->id]) ? $assigned[$r->id] : ''; ?>">
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                     <button type="submit" class="btn btn-primary text-white">Guardar</button>
                                     </form>
                                </div>
                            </div>
                        </div>               
                    </div>
                </div>
                 
            </div>

