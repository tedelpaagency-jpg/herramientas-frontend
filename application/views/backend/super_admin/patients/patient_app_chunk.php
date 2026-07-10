 <style>
 
 .notice-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 26px !important;
    text-align: justify !important;
    width: 100%;
}

/* Ajuste para videos en el feed */
.feed-video {
    width: 100%;
    height: 220px;        /* alto ideal para un feed */
    object-fit: cover;    /* recorta sin deformar */
    border-radius: 8px;
}

.notice-text.expanded{
    -webkit-line-clamp: unset;
    overflow: visible;
}

</style>
<?php if(count($consultations) > 0 ): ?>
<?php foreach($consultations as $consultation): ?>
        <div class="timeline-item">
            <div class="timeline-dot"></div>
        
            <div class="card shadow-xss border-0 rounded-xxl mb-3">
        
                <div class="card-body">
        
                    <div class="d-flex justify-content-between">
        
                        <div>
                            <h4 class="fw-700">
                                <?= date('d M Y', strtotime($consultation['consultation_date'])); ?>
                            </h4>
        
                            <span class="text-primary">
                                <?= $consultation['doctor_name']; ?>
                            </span>
                        </div>
        
                        <span class="badge bg-success" style="position: absolute;right: 10px;">
                            Consulta
                        </span>
        
                    </div>
        
                    <hr>
        
                    <p>
                        <strong>Motivo:</strong><br>
                        <?= $consultation['chief_complaint']; ?>
                    </p>
        
                    <p>
                        <strong>Diagnóstico:</strong><br>
                        <?= $consultation['diagnosis']; ?>
                    </p>
        
                    <a href="<?= base_url(); ?>portal/consultations/view/<?=  $consultation['id']; ?>" class="btn btn-light btn-sm ">
                        Ver Consulta
                    </a>
        
                    
        
                </div>
        
            </div>
        
        </div>
<?php endforeach; ?>
<?php else: ?>                           
        <div class="card border-0 text-center d-block p-0">
            <img src="https://uicobe.com/html/sociala/images/bg-43.png" alt="icon" class="w200 mb-4 ms-auto me-auto pt-md-5">
            <h1 class="fw-700 text-grey-900 display3-size display4-md-size">Oops! No se a registrado ninguna cita para este paciente.</h1>
            <p class="text-grey-500 font-xsss">Agenda una cita o genera una receta aca.</p>
            <a href="<?= base_url(); ?>" class="p-3 w175 bg-current text-white d-inline-block text-center fw-600 font-xssss rounded-3 text-uppercase ls-3">Página de inicio</a>
        </div>
<?php endif; ?>                           
 