 <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
<style>
    .gradient-brand {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        }

        .photo-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .photo-card:hover {
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.2);
        }

        /* Efecto de Escaneo Holográfico */
        @keyframes holographic {
            0% { transform: translateY(-100%) skewY(-5deg); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(100%) skewY(5deg); opacity: 0; }
        }

        .scanner-hologram {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to bottom,
                transparent 0%,
                rgba(99, 102, 241, 0.2) 45%,
                rgba(168, 85, 247, 0.6) 50%,
                rgba(99, 102, 241, 0.2) 55%,
                transparent 100%
            );
            filter: blur(4px);
            z-index: 20;
            animation: holographic 2s ease-in-out infinite;
        }

        .btn-loading {
            position: relative;
            overflow: hidden;
            pointer-events: none;
            opacity: 0.8;
        }

        .btn-loading::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: loading-shimmer 1s infinite;
        }

        @keyframes loading-shimmer {
            100% { left: 100%; }
        }

        .hidden-canvas { display: none; }

        .glass-button {
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .reveal-card {
            animation: reveal 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            opacity: 0;
            transform: translateY(15px);
        }

        @keyframes reveal {
            to { opacity: 1; transform: translateY(0); }
        }
</style>
 
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
                    <div class="max-w-lg">
                        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">MARKETING </h1>
                        <p class="text-slate-500 mt-2 text-sm font-medium">Contenido compacto listo para descargar.</p>
                    </div>
                </div>
                
                <?php $paises = $this->db->get('pais')->result_array(); ?>
                <?php foreach($paises as $pais): ?>
                <?php 
                    $canvas = $this->db->get_where('canva_pais',['pais_id'=>$pais['id'], "status"=>1])->result_array(); 
                    if(count($canvas) > 0 ):
                ?>
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-3">
                    <div class="max-w-lg">
                        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight"><?= $pais['nombre']; ?></h1>
                    </div>
                </div>
                
                <!-- Grid de Fotos: Tarjetas más pequeñas -->
                <div id="photo-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-5">
                    <?php foreach($canvas as $item): ?>
                    <?php  $canva = $this->db->get_where('canvas',['id'=>$item['canva_id']])->row_array(); ?>
                    <div class="photo-card reveal-card bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col" style="animation-delay: 0ms;">
                        <div class="relative aspect-[4/5] overflow-hidden bg-slate-50">
                            <img src="<?= base_url(); ?>public/assets/images/canvas/<?= $canva['photo']; ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                            <div id="loader-<?= $canva['id']; ?>" class="absolute inset-0 bg-indigo-900/50 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center text-white hidden">
                                <div class="scanner-hologram"></div>
                                <div class="relative z-40 flex flex-col items-center">
                                    <div class="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-2"></div>
                                    <p class="font-black tracking-widest text-[8px] uppercase">Branding...</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 md:p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-1.5">
                                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                    <span class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Asset</span>
                                </div>
                                <span class="text-[8px] font-bold text-slate-300">#101</span>
                            </div>
                            <button onclick="startEpicDownload('<?= $canva['id']; ?>', this)" class="w-full glass-button text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                                <i class="fas fa-download"></i>
                                <span>Bajar</span>
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                <?php endforeach; ?>
               
            </div>               
        </div>
    </div>
</div>   
 <canvas id="process-canvas" class="hidden-canvas"></canvas>
<script>
    
function startEpicDownload(id, btn) {
    const loader = document.getElementById(`loader-${id}`);
    loader.classList.remove('hidden');
    btn.classList.add('btn-loading');

    confetti({
        particleCount: 25,
        velocity: 25,
        spread: 360,
        origin: {
            x: btn.getBoundingClientRect().left / window.innerWidth + 0.05,
            y: btn.getBoundingClientRect().top / window.innerHeight + 0.02
        },
        colors: ['#6366f1', '#ffffff']
    });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `<?= base_url(); ?>portal/my_canvas/descargar/${id}`, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        if (xhr.status !== 200) {
            finishError();
            return;
        }

        const blob = xhr.response;
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `STUDIO_${id}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
        finishOk();
    };

    xhr.onerror = finishError;
    xhr.send();

    function finishOk() {
        loader.classList.add('hidden');
        btn.classList.remove('btn-loading');
        showMessage('✨ ¡Hecho!');
    }

    function finishError() {
        loader.classList.add('hidden');
        btn.classList.remove('btn-loading');
        showMessage('❌ Error al descargar');
    }
}

 function showMessage(text) {
            const msg = document.createElement('div');
            msg.className = "fixed top-6 left-1/2 -translate-x-1/2 gradient-brand text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] font-black text-[10px] tracking-widest animate-in slide-in-from-top-4 duration-400 border border-white/20";
            msg.innerHTML = text;
            document.body.appendChild(msg);
            setTimeout(() => {
                msg.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4');
                setTimeout(() => msg.remove(), 400);
            }, 2500);
        }

      
</script>

