<div class="cw-modal-header">

    <h3 class="cw-modal-title">
        <i data-lucide="clipboard-list"></i>
        Historial Clínico
    </h3>

    <button class="cw-btn-close" onclick="closeModal('cwHistoryModal')">
        <i data-lucide="x"></i>
    </button>

</div>

<div class="cw-modal-body">

    <div class="cw-modal-patient-info">

        <div class="p-item">
            <span class="lbl">PACIENTE</span>
            <span class="val">
                <?= $patient['name'].' '.$patient['last_name']; ?>
            </span>
        </div>

        <div class="p-item">
            <span class="lbl">TELÉFONO</span>
            <span class="val">
                <?= $patient['phone']; ?>
            </span>
        </div>

        <?php
        $edad='-';

        if(!empty($patient['birthday'])){
            $edad = date_diff(
                date_create($patient['birthday']),
                date_create(date('Y-m-d'))
            )->y.' años';
        }
        ?>

        <div class="p-item ms-md-auto">
            <span class="lbl">EDAD</span>
            <span class="val"><?= $edad; ?></span>
        </div>

    </div>


    <div class="cw-timeline">

        <?php if(count($prescriptions)): ?>

        <?php foreach($prescriptions as $p): ?>

        <?php

            $meds=[];
            $labs=[];

            foreach($p['details'] as $d){

                if($d['type']=='med'){
                    $meds[]=$d;
                }else{
                    $labs[]=$d;
                }

            }

        ?>

        <div class="cw-timeline-node">

            <div class="cw-tl-date">
                <?= strtoupper(strftime('%d %B %Y',strtotime($p['created_at']))); ?>
            </div>

            <div class="cw-tl-title">
                <?= $p['comment'] ?: 'Consulta médica'; ?>
            </div>

            <?php if(!empty($p['diagnosis'])): ?>

            <div class="cw-tl-desc">
                <?= nl2br($p['diagnosis']); ?>
            </div>

            <?php endif; ?>


            <?php if(count($meds)): ?>

            <div class="cw-tl-card">

                <div class="cw-tl-sec-title meds">
                    <i data-lucide="pill"></i>
                    MEDICAMENTOS
                </div>

                <ul class="cw-tl-list">

                    <?php foreach($meds as $m): ?>

                    <li>

                        <span class="cw-tl-item-name">
                            <?= $m['name']; ?>
                        </span>

                        <?php if($m['description']!=''): ?>

                        <span class="cw-tl-item-dose">
                            <?= $m['description']; ?>
                        </span>

                        <?php endif; ?>

                    </li>

                    <?php endforeach; ?>

                </ul>

            </div>

            <?php endif; ?>


            <?php if(count($labs)): ?>

            <div class="cw-tl-card">

                <div class="cw-tl-sec-title labs">
                    <i data-lucide="microscope"></i>
                    EXÁMENES SOLICITADOS
                </div>

                <ul class="cw-tl-list">

                    <?php foreach($labs as $l): ?>

                    <li>

                        <span class="cw-tl-item-name">
                            <?= $l['name']; ?>
                        </span>

                        <?php if($l['description']!=''): ?>

                        <span class="cw-tl-item-dose">
                            <?= $l['description']; ?>
                        </span>

                        <?php endif; ?>

                    </li>

                    <?php endforeach; ?>

                </ul>

            </div>

            <?php endif; ?>


            <?php if(!empty($p['next_appointment'])): ?>

            <div class="cw-tl-card">

                <div class="cw-tl-sec-title apt">
                    <i data-lucide="calendar"></i>
                    PRÓXIMA CITA
                </div>

                <div class="cw-tl-apt-date">
                    <?= date('d/m/Y',strtotime($p['next_appointment'])); ?>
                </div>

            </div>

            <?php endif; ?>


            <div class="d-flex mt-3">

                <button
                    class="btn btn-sm btn-primary me-2 " style="color:white"
                    onclick="closeModal('cwHistoryModal');openRecipe(<?= $p['id']; ?>);">

                    <i data-lucide="eye"></i>
                    Ver receta

                </button>

                <a
                    class="btn btn-sm btn-outline-secondary"
                    target="_blank"
                    href="<?= base_url('portal/prescriptions/download/'.$p['id']); ?>">

                    <i data-lucide="download"></i>
                    PDF

                </a>

            </div>

        </div>

        <?php endforeach; ?>

        <?php else: ?>

        <div class="text-center py-5">

            <i data-lucide="clipboard-x" style="width:70px;height:70px;color:#bdbdbd;"></i>

            <h5 class="mt-3">
                No existen registros clínicos.
            </h5>

        </div>

        <?php endif; ?>

    </div>

</div>

<script>
lucide.createIcons();
</script>