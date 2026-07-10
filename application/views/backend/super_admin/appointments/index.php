
 <style>
        :root {
            --cw-primary: #6366f1;
            --cw-primary-soft: #f5f3ff;
            --cw-success: #10b981;
            --cw-success-soft: #ecfdf5;
            --cw-pending: #8b5cf6;
            --cw-pending-soft: #f5f3ff;
            --cw-cancel: #f59e0b;
            --cw-cancel-soft: #fffbeb;
            
            --cw-bg: #f8fafc;
            --cw-card-bg: #ffffff;
            --cw-border: #eef2f6;
            --cw-text-main: #0f172a;
            --cw-text-sub: #64748b;
            --cw-text-muted: #94a3b8;
            
            --cw-radius-xl: 24px;
            --cw-radius-lg: 18px;
            --cw-radius-md: 12px;
            --cw-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
            --cw-font: 'Plus Jakarta Sans', sans-serif;
            --cw-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            font-family: var(--cw-font);
            background-color: var(--cw-bg);
            color: var(--cw-text-main);
            margin: 0; padding: 0;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }

        .cw-main-content {
            max-width: 1400px;
            margin: 1.5rem auto;
            padding: 0 1rem;
        }

        @media (min-width: 768px) { .cw-main-content { margin: 2rem auto; padding: 0 2rem; } }

        /* --- HEADER --- */
        .cw-page-header { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
        @media (min-width: 992px) { .cw-page-header { flex-direction: row; justify-content: space-between; align-items: center; } }

        .cw-page-title h1 { font-size: 1.7rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }

        .cw-header-right { display: flex; flex-direction: row; align-items: center; gap: 12px; }

        .cw-search-pill-container { position: relative; width: 100%; max-width: 320px; }
        .cw-search-pill-input {
            width: 100%; background: white; border: 1.5px solid var(--cw-primary); border-radius: 50px;
            padding: 10px 20px 10px 48px; font-size: 0.9rem; font-weight: 500; outline: none; transition: 0.2s;
        }
        .cw-search-pill-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--cw-primary); }

        .cw-btn-add {
            background: var(--cw-success); color: white; border: none; padding: 10px 24px; border-radius: 50px;
            font-weight: 700; display: flex; align-items: center; gap: 10px; transition: 0.3s;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); white-space: nowrap;
        }
        .cw-btn-add:hover { background: #00a344; transform: translateY(-2px); }

        /* --- STATS GRID --- */
        .cw-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 2rem; }
        @media (min-width: 992px) { .cw-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

        .cw-stat-card {
            background: var(--cw-card-bg); border-radius: var(--cw-radius-lg); padding: 1.25rem;
            display: flex; align-items: center; gap: 15px; border: 1px solid var(--cw-border);
            transition: var(--cw-transition);
        }
        .cw-stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .cw-stat-info h2 { font-size: 1.6rem; font-weight: 800; margin: 0; }
        .cw-stat-info p { font-size: 0.75rem; font-weight: 600; color: var(--cw-text-sub); margin: 0; }

        .cw-stat-blue { background: #f0f7ff; } .cw-stat-blue .cw-stat-icon { background: #0061ff; }
        .cw-stat-purple { background: #f5f3ff; } .cw-stat-purple .cw-stat-icon { background: #8b5cf6; }
        .cw-stat-green { background: #ecfdf5; } .cw-stat-green .cw-stat-icon { background: #10b981; }
        .cw-stat-orange { background: #fff7ed; } .cw-stat-orange .cw-stat-icon { background: #f59e0b; }
        .cw-stat-red { background: #f50b0b21; } .cw-stat-red .cw-stat-icon { background: #f50b0b; }

        /* --- CONTROLS --- */
        .cw-controls-bar { 
            display: flex; 
            justify-content: space-between;
            align-items: center;
            background: white; padding: 0.75rem 1.5rem; 
            border-radius: var(--cw-radius-lg); border: 1px solid var(--cw-border); 
            margin-bottom: 1.5rem; 
        }
        
        .cw-mode-toggle { display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; }
        .cw-toggle-btn { border: none; padding: 8px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; color: var(--cw-text-sub); background: transparent; transition: 0.3s; }
        .cw-toggle-btn.active { background: white; color: var(--cw-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .cw-btn-filter-trigger {
            display: flex; align-items: center; gap: 8px;
            background: var(--cw-primary-soft); color: var(--cw-primary);
            border: 1.5px solid transparent; border-radius: 10px;
            padding: 8px 16px; font-weight: 700; font-size: 0.8rem;
            cursor: pointer; transition: 0.2s;
        }
        .cw-btn-filter-trigger:hover { border-color: var(--cw-primary); }
        .cw-btn-filter-trigger.active { background: var(--cw-primary); color: white; }

        /* --- ADVANCED FILTER PANEL --- */
        .cw-advanced-filter-panel {
            background: white; border: 1px solid var(--cw-border); border-radius: var(--cw-radius-lg);
            padding: 0; margin-bottom: 1.5rem; max-height: 0; overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }
        .cw-advanced-filter-panel.show { max-height: 400px; padding: 1.5rem; opacity: 1; margin-bottom: 1.5rem; border-color: var(--cw-primary); }

        .cw-filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .cw-filter-field label { font-size: 0.7rem; font-weight: 800; color: var(--cw-text-muted); text-transform: uppercase; margin-bottom: 6px; display: block; }
        .cw-filter-input {
            width: 100%; padding: 10px 14px; border: 1.5px solid var(--cw-border); border-radius: 10px;
            font-size: 0.85rem; font-weight: 600; outline: none; transition: 0.2s;
        }
        .cw-filter-input:focus { border-color: var(--cw-primary); background: var(--cw-primary-soft); }

        /* --- CALENDAR CAROUSEL --- */
        .cw-calendar-block { background: white; border-radius: var(--cw-radius-xl); padding: 1.5rem 2rem; border: 1px solid var(--cw-border); margin-bottom: 2rem; display: none; animation: fadeIn 0.4s ease; }
        .cw-month-label { font-weight: 800; font-size: 1.1rem; margin-bottom: 1.25rem; display: block; }

        .cw-carousel-container { display: flex; align-items: center; gap: 10px; }
        .cw-carousel-track { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding: 10px 0; flex-grow: 1; scroll-behavior: smooth; }
        .cw-carousel-track::-webkit-scrollbar { display: none; }

        .cw-date-card {
            min-width: 70px; height: 90px; background: white; border: 1.5px solid var(--cw-border); border-radius: 16px;
            display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s;
        }
        .cw-date-card.active { background: var(--cw-primary); border-color: var(--cw-primary); color: white; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2); }
        .cw-date-card .day-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; opacity: 0.6; }
        .cw-date-card .day-num { font-size: 1.3rem; font-weight: 800; }
        .cw-has-appt { width: 5px; height: 5px; border-radius: 50%; background: var(--cw-primary); margin-top: 5px; }
        .cw-date-card.active .cw-has-appt { background: white; }

        .cw-btn-nav { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--cw-border); background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--cw-text-sub); }

        /* --- CARD DESIGN --- */
        .cw-item-card {
            background: white; border: 1px solid var(--cw-border); border-radius: var(--cw-radius-lg);
            padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 12px; transition: 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.01);
        }
        .cw-item-card:hover { border-color: var(--cw-primary); transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0,0,0,0.04); }

        .cw-card-left { display: flex; align-items: center; gap: 20px; flex: 1.3; }
        .cw-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; background: #f0f7ff; }
        .cw-card-info h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--cw-text-main); }
        .cw-card-info span { font-size: 0.8rem; color: var(--cw-text-muted); font-weight: 600; display: block; margin-top: 2px; }

        .cw-card-center { display: flex; gap: 12px; flex: 1; justify-content: center; }
        .cw-pill { padding: 8px 18px; border-radius: 50px; font-size: 0.78rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .cw-pill-purple { background: var(--cw-primary-soft); color: var(--cw-primary); }
        .cw-pill-green { background: var(--cw-success-soft); color: var(--cw-success); }
        .cw-pill-orange { background: var(--cw-reshedule-soft); color: var(--cw-reshedule); }
        .cw-pill-red { background: #f50b0b21; color: #f50b0b; }
        
        .cw-card-right { display: flex; align-items: center; gap: 40px; flex: 1.6; justify-content: flex-end; }
        .cw-meta-group { text-align: right; min-width: 90px; }
        .cw-meta-label { font-size: 0.55rem; font-weight: 800; color: var(--cw-text-muted); text-transform: uppercase; letter-spacing: 0.1em; display: block; }
        .cw-meta-val { font-size: 0.9rem; font-weight: 700; }

        .cw-action-wrap { display: flex; gap: 10px; align-items: center; }
        .cw-btn-circle { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--cw-border); background: white; display: flex; align-items: center; justify-content: center; color: var(--cw-text-sub); cursor: pointer; transition: 0.2s; }
        .cw-btn-profile { border-color: var(--cw-primary); background: var(--cw-primary-light); color: var(--cw-primary); box-shadow: 0 0 0 1px var(--cw-primary); }
        .cw-btn-circle:hover { border-color: var(--cw-primary); color: var(--cw-primary); background: var(--cw-primary-soft); }

        /* --- MONTH VIEW --- */
        .cw-month-grid {
            background: white; border-radius: var(--cw-radius-xl); border: 1px solid var(--cw-border);
            display: grid; grid-template-columns: repeat(7, 1fr); overflow: hidden;
            width: 100%;
        }
        .cw-cal-day-header { padding: 15px; text-align: center; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--cw-text-muted); background: #fcfdfe; border-bottom: 1px solid var(--cw-border); border-right: 1px solid var(--cw-border); }
        .cw-cal-day-header:last-child { border-right: none; }
        .cw-cal-cell { min-height: 120px; padding: 10px; border-right: 1px solid var(--cw-border); border-bottom: 1px solid var(--cw-border); position: relative; background: white; }
        .cw-cal-cell:nth-child(7n) { border-right: none; }
        .cw-day-num { font-size: 0.85rem; font-weight: 700; color: var(--cw-text-main); display: block; margin-bottom: 8px; }
        .cw-cal-cell.today { background: #f0f7ff; }
        .cw-cal-cell.today .cw-day-num { color: var(--cw-primary); font-weight: 900; }
        .cw-ev-p { font-size: 0.65rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: var(--cw-pending-soft); color: var(--cw-pending); border-left: 3px solid var(--cw-pending); }

        /* --- MODALS --- */
        .cw-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; z-index: 2000; opacity: 0; transition: 0.3s; }
        .cw-modal-overlay.active { display: flex; opacity: 1; }
        .cw-modal-card { background: white; width: 90%; max-width: 450px; border-radius: var(--cw-radius-xl); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2); transform: translateY(20px); transition: 0.3s; }
        .cw-modal-overlay.active .cw-modal-card { transform: translateY(0); }
        .cw-modal-header { background: var(--cw-primary); padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; color: white; }
        .cw-modal-header h5 { margin: 0; font-weight: 800; font-size: 1.1rem; }
        .cw-modal-close { background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }
        .cw-modal-body { padding: 2rem; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) { .cw-card-center { display: none; } }
        @media (max-width: 768px) {
            .cw-item-card { flex-direction: column; align-items: flex-start; padding: 1.25rem; }
            .cw-card-right { width: 100%; justify-content: space-between; border-top: 1px solid var(--cw-border); padding-top: 1rem; }
            .cw-advanced-filter-panel.show { max-height: 800px; }
        }
        
        .cw-carousel-track {
            display: flex;
            overflow-x: auto;
            scroll-behavior: auto;
            will-change: scroll-position;
        }
    </style>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        
        <div class="cw-main-content">
            
            <header class="cw-page-header">
                <div class="cw-page-title"><h1>Próximas Citas</h1></div>
                <div class="cw-header-right">
                    <div class="cw-search-pill-container">
                        <i data-lucide="search" class="cw-search-pill-icon"></i>
                        <input type="text" id="patient-search" class="cw-search-pill-input" placeholder="Búsqueda rápida...">
                    </div>
                    <button type="button" onclick="location.href='<?= base_url('portal/appointments/add'); ?>'" class="cw-btn-add"><i data-lucide="plus"></i> Nueva Cita</button>
                </div>
            </header>
        
            <!-- ESTADÍSTICAS -->
            <section class="cw-stats-grid">
                <div class="cw-stat-card cw-stat-blue"><div class="cw-stat-icon"><i data-lucide="home"></i></div><div class="cw-stat-info"><h2 id="st-tot">0</h2><p>Totales</p></div></div>
                <div class="cw-stat-card cw-stat-purple"><div class="cw-stat-icon"><i data-lucide="clock"></i></div><div class="cw-stat-info"><h2 id="st-pen">0</h2><p>Pendientes</p></div></div>
                <div class="cw-stat-card cw-stat-green"><div class="cw-stat-icon"><i data-lucide="check-circle"></i></div><div class="cw-stat-info"><h2 id="st-ate">0</h2><p>Atendidas</p></div></div>
                <div class="cw-stat-card cw-stat-red"><div class="cw-stat-icon"><i data-lucide="x-circle"></i></div><div class="cw-stat-info"><h2 id="st-can">0</h2><p>Canceladas</p></div></div>
            </section>
        
            <!-- BARRA DE CONTROLES -->
            <div class="cw-controls-bar">
                <div class="cw-mode-toggle">
                    <button class="cw-toggle-btn active" id="mode-list" onclick="setMode('list')">Listado</button>
                    <button class="cw-toggle-btn" id="mode-day" onclick="setMode('day')">Modo Día</button>
                    <button class="cw-toggle-btn" id="mode-month" onclick="setMode('month')">Modo Mes</button>
                </div>
        
                <button class="cw-btn-filter-trigger" id="filter-trigger" onclick="toggleAdvancedFilter()">
                    <i data-lucide="sliders-horizontal" size="16"></i> Filtros
                </button>
            </div>
        
            <!-- PANEL DE FILTRO AVANZADO -->
            <div class="cw-advanced-filter-panel" id="advanced-filter-panel">
                <div class="cw-filter-grid">
                    <div class="cw-filter-field">
                        <label>Nombre del Paciente</label>
                        <input type="text" id="filter-name" class="cw-filter-input" placeholder="Ej: Francisco...">
                    </div>
                    <div class="cw-filter-field">
                        <label>Estado de Cita</label>
                        <select id="filter-status" class="cw-filter-input">
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="attended">Atendida</option>
                            <option value="canceled">Reprogramada</option>
                        </select>
                    </div>
                    <div class="cw-filter-field">
                        <label>Día (Número)</label>
                        <input type="number" id="filter-day" class="cw-filter-input" placeholder="Ej: 23" min="1" max="31">
                    </div>
                    <div class="cw-filter-field d-flex align-items-end">
                        <button class="btn btn-primary w-100 rounded-3 fw-700 p-2 text-white" onclick="resetFilters()">Limpiar Filtros</button>
                    </div>
                </div>
            </div>
        
            <!-- CARRUSEL CALENDARIO -->
           <section class="cw-calendar-block" id="calendar-carousel">
                <span class="cw-month-label" id="calendar-month"></span>
            
                <div class="cw-carousel-container">
                    <button class="cw-btn-nav" onclick="scrollCarousel(-1)">
                        <i data-lucide="chevron-left" size="16"></i>
                    </button>
            
                    <div class="cw-carousel-track" id="calendar-track"></div>
            
                    <button class="cw-btn-nav" onclick="scrollCarousel(1)">
                        <i data-lucide="chevron-right" size="16"></i>
                    </button>
                </div>
            </section>
        
            <div id="view-container"></div>
            <div id="pagination" class="mt-4 text-center"></div>
        </div>   
    </div>
</div>
   <!-- MODAL MOTIVO -->
<div id="modal-reason" class="cw-modal-overlay">
    <div class="cw-modal-card">
        <div class="cw-modal-header"><h5>Motivo de la Visita</h5><button class="cw-modal-close" onclick="closeModal('modal-reason')">&times;</button></div>
        <div class="cw-modal-body"><p id="reason-text" style="line-height: 1.6; font-weight: 500; margin: 0;"></p></div>
    </div>
</div>

<!-- MODAL CAMBIO ESTADO -->
<div id="modal-status" class="cw-modal-overlay">
    <div class="cw-modal-card">
        <div class="cw-modal-header"><h5>Cambiar Estado</h5><button class="cw-modal-close" onclick="closeModal('modal-status')">&times;</button></div>
        <div class="cw-modal-body">
            <div class="d-grid gap-2">
                <button class="btn btn-outline-primary rounded-3 p-3 fw-700" onclick="updateStatus('1')">Pendiente</button>
                <button class="btn btn-outline-success rounded-3 p-3 fw-700" onclick="updateStatus('2')">Confirmada</button>
                <button class="btn btn-outline-warning rounded-3 p-3 fw-700" onclick="updateStatus('4')">Cancelada</button>
            </div>
        </div>
    </div>
</div>         
<script>

function confirm_app(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "También se eliminará toda la información asociada..",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = url;
        }
    })
}


function cancel_app(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "También se eliminará toda la información asociada..",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#9fd13b',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = url;
        }
    })
}



      $('#create_ticket_key').on('click', function () {
    $("#ticketModal").modal("show");
  })
 function getNewPatient(type) {
     if (type == 'New') {
         $('#newPatient').show(500);
     } else {
         $('#newPatient').hide(500);
     }
 }
 
 $(function () {

   // Desactiva enforceFocus para permitir escribir en Select2 dentro del modal
$('#ticketModal').on('shown.bs.modal', function() {
    $('.select2').select2({
        dropdownParent: $('#ticketModal'),
        width: '100%'
    });
});
  // Toggle recordatorio
  $('#reminderToggle').on('change', function () {
    const enabled = $(this).is(':checked');
    $('#reminderBlock').toggle(enabled);
    $('#reminderOffset').prop('disabled', !enabled);
  });



});
function getNewPatient(type) {
     if (type == 'New') {
         $('#newPatient').show(500);
     } else {
         $('#newPatient').hide(500);
     }
 }
</script>
<script>
    const today = new Date();

    const state = {
        mode: 'list',
    
        selectedDate: today.getDate(),
        selectedMonth: today.getMonth() + 1,
        selectedYear: today.getFullYear(),
    
        searchTerm: '',
        activeId: null,
    
        filters:{
            name:'',
            status:'all',
            day:''
        }
    };

    

    let appointments = [];

    const pagination = {
        page: 1,
        perPage: 15,
        total: 0,
        lastPage: 1
    };

    function setMode(mode) {
        state.mode = mode;
        document.querySelectorAll('.cw-toggle-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`mode-${mode}`).classList.add('active');
        document.getElementById('calendar-carousel').style.display = mode === 'day' ? 'block' : 'none';
        pagination.page=1;

        loadAppointments();
    }

    function toggleAdvancedFilter() {
        const panel = document.getElementById('advanced-filter-panel');
        const trigger = document.getElementById('filter-trigger');
        panel.classList.toggle('show');
        trigger.classList.toggle('active');
    }

    function generateCalendar(){

            const months = [
                'Enero','Febrero','Marzo','Abril',
                'Mayo','Junio','Julio','Agosto',
                'Septiembre','Octubre','Noviembre','Diciembre'
            ];
        
             
            document.getElementById('calendar-month').innerHTML =
                months[state.selectedMonth-1] + ' ' + state.selectedYear;
        
            const daysInMonth = new Date(
                state.selectedYear,
                state.selectedMonth,
                0
            ).getDate();
            
           
            
            const track = document.getElementById('calendar-track');
        
            track.innerHTML='';
            let activeCard = null;
            
            for(let i=1;i<=daysInMonth;i++){
        
                const card=document.createElement('div');
        
                card.className='cw-date-card';
        
                if(i == state.selectedDate){
                    card.classList.add('active');
                    activeCard = card;
                }
        
                const hasAppt = appointments.some(a=>a.day==i);
        
                card.innerHTML=`
                    <span class="day-label">DÍA</span>
                    <span class="day-num">${i}</span>
                    ${hasAppt ? '<div class="cw-has-appt"></div>' : ''}
                `;
        
                card.onclick=function(){
        
                    state.selectedDate=i;
        
                    state.filters.day=i;
        
                    pagination.page=1;
        
                    loadAppointments();
        
                };
        
                track.appendChild(card);
        
            }
            
            // 🔥 scroll suave optimizado
              
                if(!activeCard) return;

                const centerScroll = () => {
            
                    const offset =
                        activeCard.offsetLeft -
                        (track.clientWidth / 2) +
                        (activeCard.clientWidth / 2);
            
                    track.scrollLeft = offset;
            
                };
            
                requestAnimationFrame(() => {
                    requestAnimationFrame(centerScroll);
                });
                    
        }

    function updateStats(list) {
        document.getElementById('st-tot').innerText = list.length;
        document.getElementById('st-pen').innerText = list.filter(a => a.status === '1').length;
        document.getElementById('st-ate').innerText = list.filter(a => a.status === '2').length;
        document.getElementById('st-can').innerText = list.filter(a => a.status === '4').length;
    }
    
    function loadAppointments() 
    {
    
        $.ajax({
    
            url: "<?= base_url('appointments/getAppointments'); ?>",
            type: "GET",
            dataType: "json",
            data:{
                mode: state.mode,
                page: pagination.page,
                search: state.searchTerm,
                name: state.filters.name,
                status: state.filters.status,
                day: state.filters.day,
                month: state.selectedMonth,
                year:state.selectedYear,
            },
            beforeSend:function(){
                $('#view-container').html(
                    '<div class="text-center p-5">Cargando...</div>'
                );
            },
            success:function(res){
    
                appointments = [];
                res.rows.forEach(function(item){
                    appointments.push({
                        id:item.id,
                        appointment_date: item.appointment_date,
                        day: parseInt(item.appointment_date.substring(8,10)),
                        name:item.name+' '+item.last_name,
                        time:item.appointment_time,
                        status:item.status,
                        avatar:
                            item.name.charAt(0).toUpperCase()+
                            item.last_name.charAt(0).toUpperCase(),
                        color:'#0061ff',
                        bg:'#e0edff',
                        reason:item.reason
                    });
    
                });
    
                pagination.total = res.total;
                pagination.lastPage = res.last_page;
    
             
    
                render();
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        generateCalendar();
                    });
                });
    
                renderPagination();
    
            }
    
        });
    
    }
    
    function renderPagination()
    {

        if(state.mode!='list')
        {
            $('#pagination').html('');
            return;
        }
    
        let html='';
    
        html+='<button class="btn btn-light me-2"';
    
        if(pagination.page==1)
            html+=' disabled';
    
        html+=' onclick="prevPage()">Anterior</button>';
    
        html+=' Página '+pagination.page+' de '+pagination.lastPage+' ';
    
        html+='<button class="btn btn-light ms-2"';
    
        if(pagination.page>=pagination.lastPage)
            html+=' disabled';
    
        html+=' onclick="nextPage()">Siguiente</button>';
    
        $('#pagination').html(html);
    
    }
    
    function prevPage(){

        if(pagination.page>1){
    
            pagination.page--;
    
            loadAppointments();
    
        }
    
    }
    
    function nextPage(){
    
        if(pagination.page<pagination.lastPage){
    
            pagination.page++;
    
            loadAppointments();
    
        }
    
    }
    
    function getStatusInfo(status){

        switch(parseInt(status)){
    
            case 1:
                return {
                    text:'Pendiente',
                    class:'cw-pill-purple',
                    icon:'clock'
                };
    
            case 2:
                return {
                    text:'Confirmada',
                    class:'cw-pill-green',
                    icon:'check-circle'
                };
    
            case 3:
                return {
                    text:'Reprogramada',
                    class:'cw-pill-orange',
                    icon:'calendar-sync'
                };
    
            case 4:
                return {
                    text:'Cancelada',
                    class:'cw-pill-red',
                    icon:'x-circle'
                };
    
            default:
                return {
                    text:'Desconocido',
                    class:'cw-pill-secondary',
                    icon:'help-circle'
                };
    
        }
    
    }

    function resetFilters() {
        document.getElementById('filter-name').value = '';
        document.getElementById('filter-status').value = 'all';
        document.getElementById('filter-day').value = '';
        state.filters = { name: '', status: 'all', day: '' };
        render();
    }

    function render() 
    {
    
        const container = document.getElementById('view-container');
        container.innerHTML = '';
    
        updateStats(appointments);
    
        if (state.mode === 'month') {
    
            let cells = `
                <div class="cw-cal-day-header">Lun</div>
                <div class="cw-cal-day-header">Mar</div>
                <div class="cw-cal-day-header">Mié</div>
                <div class="cw-cal-day-header">Jue</div>
                <div class="cw-cal-day-header">Vie</div>
                <div class="cw-cal-day-header">Sáb</div>
                <div class="cw-cal-day-header">Dom</div>
            `;
    
            for (let i = 1; i <= 31; i++) {
    
                const dayAppts = appointments.filter(a => a.day == i);
    
                cells += `
                    <div class="cw-cal-cell ${i == state.selectedDate ? 'today' : ''}">
                        <span class="cw-day-num">${i}</span>
    
                        ${dayAppts.map(a => `
                            <div class="cw-ev-p">${a.name}</div>
                        `).join('')}
    
                    </div>
                `;
            }
    
            container.innerHTML = `<div class="cw-month-grid">${cells}</div>`;
    
        } else {
    
            const list = state.mode === 'day'
                ? appointments.filter(a => a.day == state.selectedDate)
                : appointments;
    
            if (!list.length) {
    
                container.innerHTML = `
                    <div class="text-center p-5 fw-700 text-muted border bg-white rounded-4">
                        No se encontraron citas.
                    </div>
                `;
    
                lucide.createIcons();
                return;
            }
    
            container.innerHTML = list.map(item => {
    
                const st = getStatusInfo(item.status);
    
                return `
                    <div class="cw-item-card">
    
                        <div class="cw-card-left">
    
                            <div class="cw-avatar"
                                style="color:${item.color};background:${item.bg}">
                                ${item.avatar}
                            </div>
    
                            <div class="cw-card-info">
                                <h3>${item.name}</h3>
                                <span># ${item.id}</span>
                            </div>
    
                        </div>
    
                        <div class="cw-card-center">
    
                            <div class="cw-pill ${st.class}">
                                <i data-lucide="${st.icon}" size="14"></i>
                                ${st.text}
                            </div>
    
                        </div>
    
                        <div class="cw-card-right">
    
                            <div class="cw-meta-group">
    
                                <span class="cw-meta-label">
    
                                    ${state.mode === 'list' ? 'FECHA' : 'HORA'}
    
                                </span>
    
                                <span class="cw-meta-val">
    
                                    ${state.mode === 'list'
                                        ? item.appointment_date
                                        : item.time}
    
                                </span>
    
                            </div>
    
                            <div class="cw-action-wrap">
    
                                <button class="cw-btn-circle"
                                    onclick="showReason('${item.id}')">
                                    <i data-lucide="message-square" size="18"></i>
                                </button>
    
                                <button class="cw-btn-circle" onclick="location.href='<?= base_url('portal/consultations/add'); ?>'">
                                    <i data-lucide="clipboard-list" size="18"></i>
                                </button>
    
                                <button class="cw-btn-circle"
                                    onclick="showStatusModal('${item.id}')">
                                    <i data-lucide="refresh-cw" size="18"></i>
                                </button>
    
                                <button class="cw-btn-circle cw-btn-profile">
                                    <i data-lucide="user" size="18"></i>
                                </button>
    
                            </div>
    
                        </div>
    
                    </div>
                `;
    
            }).join('');
    
        }
    
        lucide.createIcons();
    
    }

    function showReason(id) { document.getElementById('reason-text').innerText = appointments.find(a => a.id === id).reason; document.getElementById('modal-reason').classList.add('active'); }
    function showStatusModal(id) { state.activeId = id; document.getElementById('modal-status').classList.add('active'); }
    function updateStatus(status) {
        console.log(state.activeId);
        console.log(status);
        $.ajax({
    
            url: "<?= base_url('appointments/updateStatus'); ?>",
            type: "POST",
            dataType: "json",
    
            data:{
                id: state.activeId,
                status: status
            },
    
            success:function(res){
    
                if(res.success){
    
                    closeModal('modal-status');
    
                    loadAppointments();
    
                }else{
    
                    alert(res.message);
    
                }
    
            },
    
            error:function(){
    
                alert('Ocurrió un error.');
    
            }
    
        });
    
    }
    
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }
    function scrollCarousel(dir) { document.getElementById('calendar-track').scrollBy({ left: dir * 200, behavior: 'smooth' }); }

       document.addEventListener('DOMContentLoaded', () => {
        
       document.getElementById('patient-search').oninput = (e) => {
        
            state.searchTerm = e.target.value;
            pagination.page=1;
            loadAppointments();
        
        };
        
        // Listeners para filtros avanzados
        document.getElementById('filter-name').oninput = (e) => {
        
            state.filters.name = e.target.value;
            pagination.page = 1;
            loadAppointments();
        
        };
        
        document.getElementById('filter-status').onchange = (e) => {
        
            state.filters.status = e.target.value;
            pagination.page = 1;
            loadAppointments();
        
        };
        
        document.getElementById('filter-day').oninput = (e) => {
        
            state.filters.day = e.target.value;
            pagination.page = 1;
            loadAppointments();
        
        };
        
        loadAppointments();
        window.onclick = (e) => { if (e.target.classList.contains('cw-modal-overlay')) { closeModal('modal-reason'); closeModal('modal-status'); } };
    });
</script>