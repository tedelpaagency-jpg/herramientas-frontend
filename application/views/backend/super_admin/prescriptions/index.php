    <style>
        /* ========================================================
           TEMA VISUAL V2: MODERN ELEVATED CARDS & TIMELINE
           ======================================================== */
        :root {
            --cw-bg-body: #f8fafc;           
            --cw-bg-card: #ffffff;
            --cw-border-light: #f1f5f9;
            --cw-border-dark: #e2e8f0;
            
            --cw-text-primary: #0f172a;
            --cw-text-secondary: #475569;
            --cw-text-tertiary: #94a3b8;
            
            --cw-accent-main: #1e293b;       
            --cw-accent-brand: #4f46e5;      
            --cw-accent-brand-soft: #eef2ff; 
            --cw-accent-brand-light: #818cf8; 
            --cw-accent-meds: #10b981;       
            --cw-accent-meds-bg: #ecfdf5;
            --cw-accent-labs: #0ea5e9;       
            --cw-accent-labs-bg: #f0f9ff;
            
            /* Sombras Premium */
            --cw-shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.02);
            --cw-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            --cw-shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            
            --cw-radius-card: 20px;
            --cw-radius-pill: 9999px;
            --cw-font-main: 'Plus Jakarta Sans', sans-serif;
        }

        body {
            font-family: var(--cw-font-main);
            background-color: var(--cw-bg-body);
            color: var(--cw-text-primary);
            min-height: 100vh;
            margin: 0;
            font-size: 0.9rem;
            -webkit-font-smoothing: antialiased;
        }

        body.cw-modal-open { overflow: hidden; }

        /* --- LAYOUT --- */
        .cw-app-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 3rem 1.5rem;
        }

        /* --- HEADER & BOTÓN ANIMADO --- */
        .cw-page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
            gap: 1.5rem;
        }

        .cw-header-title {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .cw-header-icon-wrap {
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            color: var(--cw-accent-brand);
            border: 1px solid var(--cw-border-light);
        }

        .cw-header-title h1 {
            font-size: 1.75rem;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.03em;
            color: var(--cw-accent-main);
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
            70% { box-shadow: 0 0 0 12px rgba(79, 70, 229, 0); }
            100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }

        .cw-btn-animated {
            background: linear-gradient(135deg, var(--cw-accent-brand), var(--cw-accent-brand-light), var(--cw-accent-brand));
            background-size: 200% 200%;
            color: white;
            border: none;
            border-radius: var(--cw-radius-pill);
            padding: 12px 24px;
            font-size: 0.95rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            animation: gradientShift 4s ease infinite, pulseGlow 2.5s infinite;
        }

        .cw-btn-animated:hover { transform: translateY(-3px) scale(1.02); color: white; }

        /* ========================================================
           ANIMACIONES DE ENTRADA (STAGGERED CASCADE)
           ======================================================== */
        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeSlideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .cw-page-header {
            animation: fadeSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cw-toolbar {
            opacity: 0;
            animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        /* --- TOOLBAR / BÚSQUEDA --- */
        .cw-toolbar {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
        }

        .cw-search-wrapper {
            display: flex;
            align-items: center;
            flex-grow: 1;
            max-width: 500px;
            background: white;
            border: 1px solid var(--cw-border-dark);
            border-radius: var(--cw-radius-pill);
            padding: 0 20px;
            box-shadow: var(--cw-shadow-soft);
            transition: all 0.3s ease;
        }

        .cw-search-wrapper:focus-within {
            border-color: var(--cw-accent-brand);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .cw-search-wrapper svg { color: var(--cw-text-tertiary); flex-shrink: 0; transition: color 0.3s ease; }
        .cw-search-wrapper:focus-within svg { color: var(--cw-accent-brand); }

        .cw-input-search {
            width: 100%; border: none; background: transparent; padding: 14px 12px;
            font-size: 0.95rem; font-weight: 500; color: var(--cw-text-primary); outline: none;
        }
        .cw-input-search::placeholder { color: var(--cw-text-tertiary); }

        /* --- TARJETAS DE RECETA --- */
        .cw-recipes-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .cw-recipe-card {
            background: var(--cw-bg-card);
            border-radius: var(--cw-radius-card);
            padding: 1.25rem 1.5rem;
            border: 1px solid rgba(226, 232, 240, 0.6);
            box-shadow: var(--cw-shadow-soft);
            display: grid;
            grid-template-columns: 2fr 1.5fr 0.9fr 1.3fr auto;
            align-items: center;
            gap: 1.25rem;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            
            /* Estado inicial para la animación */
            opacity: 0;
            animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cw-status-select {
            padding: 5px 8px;
            font-size: 0.75rem;
            font-weight: 700;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            cursor: pointer;
            outline: none;
            transition: all 0.2s ease;
        }
        .cw-status-select[data-status="1"] { background-color: #fffbeb; color: #b45309; border-color: #fde68a; }
        .cw-status-select[data-status="2"] { background-color: #f0f9ff; color: #0369a1; border-color: #bae6fd; }
        .cw-status-select[data-status="3"] { background-color: #ecfdf5; color: #047857; border-color: #a7f3d0; }
        .cw-status-select[data-status="4"] { background-color: #fef2f2; color: #b91c1c; border-color: #fecaca; }


        /* Efecto Cascada (Stagger) automático para las tarjetas */
        .cw-recipe-card:nth-child(1) { animation-delay: 0.15s; }
        .cw-recipe-card:nth-child(2) { animation-delay: 0.25s; }
        .cw-recipe-card:nth-child(3) { animation-delay: 0.35s; }
        .cw-recipe-card:nth-child(4) { animation-delay: 0.45s; }
        .cw-recipe-card:nth-child(5) { animation-delay: 0.55s; }

        .cw-recipe-card:hover {
            box-shadow: var(--cw-shadow-hover);
            transform: translateY(-4px);
            border-color: #e0e7ff;
        }

        /* Columna Paciente */
        .cw-patient-col { display: flex; align-items: center; gap: 1.25rem; min-width: 0; }
        .cw-avatar-round {
            width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; font-weight: 800; font-size: 1.1rem; flex-shrink: 0;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
        }
        .cw-av-1 { background: #eff6ff; color: #2563eb; }
        .cw-av-2 { background: #fdf4ff; color: #c026d3; }
        .cw-av-3 { background: #f0fdf4; color: #059669; }
        .cw-av-4 { background: #fffbeb; color: #d97706; }

        .cw-patient-details { min-width: 0; overflow: hidden; }
        .cw-patient-details h3 {
            margin: 0 0 4px 0; font-size: 1.05rem; font-weight: 700; color: var(--cw-text-primary);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cw-patient-details p { margin: 0; font-size: 0.8rem; color: var(--cw-text-tertiary); font-weight: 500; display: flex; align-items: center; gap: 4px; }

        /* Columna Pills */
        .cw-content-col { display: flex; flex-direction: row; gap: 10px; flex-wrap: nowrap; align-items: center; overflow: hidden; }
        .cw-pill {
            display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
            border-radius: var(--cw-radius-pill); font-size: 0.75rem; font-weight: 700; white-space: nowrap;
        }
        .cw-pill-meds { background: var(--cw-accent-meds-bg); color: var(--cw-accent-meds); }
        .cw-pill-labs { background: var(--cw-accent-labs-bg); color: var(--cw-accent-labs); }

        /* Columna Fecha */
        .cw-date-col { text-align: right; display: flex; flex-direction: column; }
        .cw-date-col .cw-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--cw-text-tertiary); margin-bottom: 2px; }
        .cw-date-col .cw-val { font-size: 0.95rem; font-weight: 600; color: var(--cw-text-primary); }

        /* Columna Acciones */
        .cw-actions-col { display: flex; align-items: center; gap: 12px; }
        
        .cw-btn-icon {
            width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--cw-border-dark);
            background: white; color: var(--cw-text-secondary); display: flex; align-items: center;
            justify-content: center; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); outline: none;
        }
        .cw-btn-icon:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        
        /* Botones específicos */
        .cw-btn-icon.history { color: var(--cw-text-secondary); background: #f8fafc; border-color: var(--cw-border-dark); }
        .cw-btn-icon.history:hover { background: #f1f5f9; color: var(--cw-text-primary); border-color: var(--cw-text-primary); }
        
        .cw-btn-icon.view { background: var(--cw-accent-brand-soft); color: var(--cw-accent-brand); border: none; }
        .cw-btn-icon.view:hover { background: var(--cw-accent-brand); color: white; transform: scale(1.05); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
        
        .cw-btn-icon.dl:hover { background: #f1f5f9; color: var(--cw-text-primary); border-color: var(--cw-text-primary); }
        .cw-btn-icon.send:hover { background: var(--cw-accent-meds-bg); color: var(--cw-accent-meds); border-color: var(--cw-accent-meds); }

        /* --- MODALES (BASE) --- */
        .cw-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
            z-index: 10000; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        }
        .cw-modal-overlay.active { display: flex; opacity: 1; }

        .cw-modal-content {
            background: white; border-radius: 16px; width: 90%; max-width: 640px;
            max-height: 85vh; display: flex; flex-direction: column;
            box-shadow: var(--cw-shadow-modal); transform: translateY(20px) scale(0.98);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        
        /* Modificador para Modal de Receta (A4 Sheet aspect) */
        .cw-modal-content.recipe-sheet {
            max-width: 700px;
            border-top: 6px solid var(--cw-accent-main);
            border-radius: 0 0 16px 16px;
        }

        .cw-modal-overlay.active .cw-modal-content { transform: translateY(0) scale(1); }

        .cw-modal-header {
            padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--cw-border-dark);
            display: flex; justify-content: space-between; align-items: center;
        }
        
        .cw-modal-title {
            font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--cw-text-primary);
            display: flex; align-items: center; gap: 8px;
        }
        .cw-modal-title svg { color: var(--cw-accent-brand); }

        .cw-btn-close {
            width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9;
            border: none; display: flex; align-items: center; justify-content: center;
            color: var(--cw-text-secondary); cursor: pointer; transition: 0.2s;
        }
        .cw-btn-close:hover { background: #e2e8f0; color: var(--cw-text-primary); }

        /* Botón cerrar flotante (Para la receta) */
        .cw-btn-close-floating {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #f1f5f9;
            z-index: 10;
        }

        .cw-modal-body { padding: 1.5rem 1.5rem 2rem 1.5rem; overflow-y: auto; }
        
        /* Padding extra para simular hoja en receta */
        .recipe-sheet .cw-modal-body { padding: 3rem 3.5rem; }

        /* --- ESTILOS INTERNOS DE RECETA (Dentro del Modal) --- */
        .cw-sheet-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--cw-text-primary); }
        .cw-sheet-header h2 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 4px 0; color: var(--cw-text-primary); text-transform: uppercase; }
        .cw-sheet-header .cw-subtitle { font-size: 0.8rem; font-weight: 500; color: var(--cw-text-secondary); letter-spacing: 0.05em; }
        .cw-sheet-header .cw-doc-meta { text-align: right; }
        .cw-sheet-header .cw-doc-type { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; color: var(--cw-text-tertiary); text-transform: uppercase; margin-bottom: 4px; }
        
        .cw-patient-inline-bar { display: flex; flex-wrap: wrap; background: #fafafa; border: 1px solid var(--cw-border-light); border-radius: 6px; padding: 12px 16px; gap: 20px; margin-bottom: 2.5rem; align-items: center; }
        .cw-patient-inline-bar .cw-p-item { display: flex; align-items: baseline; gap: 6px; }
        .cw-patient-inline-bar .cw-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--cw-text-tertiary); }
        .cw-patient-inline-bar .cw-val { font-size: 0.9rem; font-weight: 600; color: var(--cw-text-primary); }

        .cw-section-divider { display: flex; align-items: center; gap: 12px; margin: 1.5rem 0 1rem 0; }
        .cw-section-divider span { font-size: 0.65rem; font-weight: 800; color: var(--cw-text-secondary); text-transform: uppercase; letter-spacing: 0.1em; }
        .cw-section-divider::after { content: ''; flex-grow: 1; height: 1px; background: var(--cw-border-light); }

        .cw-list-item-clean { position: relative; padding: 10px 0 10px 16px; margin-bottom: 8px; border-bottom: 1px solid #f9fafb; display: flex; justify-content: space-between; align-items: flex-start; }
        .cw-list-item-clean:last-child { border-bottom: none; }
        .cw-list-item-clean::before { content: ''; position: absolute; left: 0; top: 14px; width: 3px; height: 14px; border-radius: 2px; }
        .cw-type-med::before { background-color: var(--cw-accent-meds); }
        .cw-type-lab::before { background-color: var(--cw-accent-labs); }
        .cw-item-main-text { font-size: 0.95rem; font-weight: 600; color: var(--cw-text-primary); margin-bottom: 2px; }
        .cw-item-sub-text { font-size: 0.8rem; font-weight: 400; color: var(--cw-text-secondary); line-height: 1.4; }

        .cw-clinical-notes-box { margin-top: 1.5rem; padding: 0.75rem 1.25rem; background: transparent; border-left: 3px solid #fbbf24; font-size: 0.85rem; color: var(--cw-text-primary); font-weight: 500; white-space: pre-wrap; line-height: 1.5; }
        .cw-clinical-notes-box .cw-lbl-note { font-size: 0.6rem; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; display: block; }
        .cw-appointment-box { margin-top: 1.5rem; display: inline-block; padding: 10px 16px; background: var(--cw-accent-brand-soft); border-radius: 6px; border-left: 3px solid var(--cw-accent-brand); }
        .cw-appointment-box .cw-lbl-apt { font-size: 0.6rem; font-weight: 800; color: var(--cw-accent-brand); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px; }
        .cw-appointment-box .cw-val-apt { font-size: 0.95rem; font-weight: 700; color: var(--cw-text-primary); text-transform: capitalize; }
        
        .cw-sheet-footer { margin-top: 3rem; text-align: center; padding-top: 2rem; }
        .cw-stamp-line { width: 200px; height: 1px; background: var(--cw-text-primary); margin: 0 auto 8px; }
        .cw-stamp-text { font-size: 0.85rem; font-weight: 700; color: var(--cw-text-primary); text-transform: uppercase; }
        .cw-stamp-sub { font-size: 0.65rem; color: var(--cw-text-tertiary); letter-spacing: 0.05em; }

        /* --- ESTILOS HISTORIAL CLÍNICO (Timeline) --- */
        .cw-modal-patient-info {
            display: flex; flex-wrap: wrap; gap: 1.5rem; padding: 1rem 1.25rem;
            border: 1px solid var(--cw-border-dark); border-radius: 12px;
            margin-bottom: 2rem; align-items: center; background: #fafafa;
        }
        .cw-modal-patient-info .p-item { display: flex; gap: 6px; align-items: baseline; }
        .cw-modal-patient-info .lbl { font-size: 0.65rem; font-weight: 800; color: var(--cw-text-tertiary); text-transform: uppercase; }
        .cw-modal-patient-info .val { font-size: 0.95rem; font-weight: 600; color: var(--cw-text-primary); }

        .cw-timeline { padding-left: 8px;
    overflow: scroll;
    height: 250px;
    font-size: 10px;}
    
    @media (min-width:1400px){

    .cw-timeline{
        height:600px;
    }

}
        .cw-timeline-node { position: relative; padding-left: 28px; padding-bottom: 2rem; border-left: 1px solid var(--cw-border-dark); }
        .cw-timeline-node:last-child { border-left-color: transparent; padding-bottom: 0; }
        .cw-timeline-node::before { content: ''; position: absolute; left: -5px; top: 2px; width: 9px; height: 9px; border-radius: 50%; background: var(--cw-accent-brand); }
        .cw-tl-date { font-size: 0.75rem; font-weight: 800; color: var(--cw-accent-brand); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; line-height: 1; }
        .cw-tl-title { font-size: 1.1rem; font-weight: 700; color: var(--cw-text-primary); margin-bottom: 8px; }
        .cw-tl-desc { font-size: 0.9rem; color: var(--cw-text-secondary); line-height: 1.5; margin-bottom: 1.25rem; }

        .cw-tl-card { background: white; border: 1px solid var(--cw-border-dark); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
        .cw-tl-card:last-child { margin-bottom: 0; }
        .cw-tl-sec-title { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
        .cw-tl-sec-title.meds { color: var(--cw-accent-meds); }
        .cw-tl-sec-title.labs { color: var(--cw-accent-labs); }
        .cw-tl-sec-title.apt { color: var(--cw-accent-brand); }

        .cw-tl-list { margin: 0; padding-left: 0; list-style-type: none; }
        .cw-tl-list li { margin-bottom: 6px; font-size: 0.85rem; line-height: 1.4; position: relative; padding-left: 14px; }
        .cw-tl-list li::before { content: '•'; position: absolute; left: 0; color: var(--cw-text-tertiary); }
        .cw-tl-list li:last-child { margin-bottom: 0; }
        
        .cw-tl-item-name { font-weight: 700; color: var(--cw-text-primary); }
        .cw-tl-item-dose { font-weight: 400; color: var(--cw-text-secondary); }
        .cw-tl-apt-date { font-weight: 700; color: var(--cw-text-primary); font-size: 0.9rem; padding-left: 4px; }

        .cw-modal-signature { text-align: center; margin-top: 3.5rem; padding-top: 1rem; }
        .cw-modal-signature .line { width: 220px; height: 1.5px; background: var(--cw-text-primary); margin: 0 auto 8px; }
        .cw-modal-signature .name { font-size: 0.85rem; font-weight: 800; color: var(--cw-text-primary); }
        .cw-modal-signature .sub { font-size: 0.65rem; color: var(--cw-text-tertiary); letter-spacing: 0.05em; }

        /* --- BOTÓN IMPRIMIR --- */
        .cw-btn-print {
            background: #f4f4f5;
            color: var(--cw-text-primary);
            border: 1px solid var(--cw-text-primary);
            border-radius: var(--cw-radius-pill);
            padding: 10px 24px;
            font-size: 0.95rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .cw-btn-print:hover {
            background: #e4e4e7;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 991px) {
            .cw-recipe-card { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.5rem; }
            .cw-patient-col { border-bottom: 1px solid var(--cw-border-light); padding-bottom: 1rem; }
            .cw-content-col { flex-wrap: wrap; }
            .cw-date-col { text-align: left; flex-direction: row; align-items: center; gap: 8px; }
            .cw-date-col .cw-lbl { margin: 0; }
            .cw-actions-col { justify-content: flex-end; border-top: 1px dashed var(--cw-border-dark); padding-top: 1.25rem; }
            .recipe-sheet .cw-modal-body { padding: 1.5rem; }
        }
        
        /* --- TOASTS --- */
        .cw-toast-container {
            position: fixed; bottom: 24px; right: 24px; z-index: 100000;
            display: flex; flex-direction: column; gap: 10px;
        }
        .cw-toast {
            background: var(--cw-text-primary); color: white; padding: 16px 24px;
            border-radius: 14px; box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem;
            transform: translateY(100px) scale(0.9); opacity: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cw-toast.show { transform: translateY(0) scale(1); opacity: 1; }
        
        @media print {
            body * { visibility: hidden; }
            #cwRecipeModal, #cwRecipeModal * { visibility: visible; }
            #cwRecipeModal { position: absolute; left: 0; top: 0; width: 100%; }
            .cw-btn-close-floating, .no-print { display: none !important; }
            .cw-modal-content { box-shadow: none; border: none; width: 100%; max-width: 100%; }
            .cw-type-med::before { background-color: var(--cw-accent-meds) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .cw-type-lab::before { background-color: var(--cw-accent-labs) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
<!-- Google Fonts: Plus Jakarta Sans -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet">
<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<div class="cw-app-container">
    
    <!-- Encabezado de la página -->
    <div class="cw-page-header">
        <div class="cw-header-title">
            <div class="cw-header-icon-wrap">
                <i data-lucide="layers" size="24"></i>
            </div>
            <h1>Directorio de Recetas</h1>
        </div>
        
        <!-- Botón Animado -->
        <button class="cw-btn-animated" onclick="window.location.href='<?= base_url('portal/prescription');?>'">
            <i data-lucide="plus" size="20"></i>
            Nueva Prescripción
        </button>
    </div>

    <!-- Barra de Búsqueda -->
    <div class="cw-toolbar">
        <div class="cw-search-wrapper">
            <i data-lucide="search" size="20"></i>
            <input type="text" id="cw-search-input" class="cw-input-search" placeholder="Buscar paciente por nombre o ID...">
        </div>
    </div>

    <!-- Grid de Tarjetas de Receta -->
    <div class="cw-recipes-grid" id="cw-recipe-list">

    <?php foreach($prescriptions as $p): ?>
    
    <?php
        $patient = $this->db->get_where('user',['user_id'=>$p['patient_id']])->row_array();
    
        $meds = $this->db
            ->where([
                'prescription_id'=>$p['id'],
                'type'=>'med'
            ])
            ->count_all_results('prescription_details');
    
        $labs = $this->db
            ->where([
                'prescription_id'=>$p['id'],
                'type'=>'lab'
            ])
            ->count_all_results('prescription_details');
    
        $initials = strtoupper(
            substr($patient['name'],0,1).
            substr($patient['last_name'],0,1)
        );
    ?>
    
    <div class="cw-recipe-card" data-id="<?= $p['id']; ?>">
    
        <div class="cw-patient-col">
    
            <div class="cw-avatar-round">
                <?= $initials; ?>
            </div>
    
            <div class="cw-patient-details">
    
                <h3 class="patient-name">
                    <?= $patient['name'].' '.$patient['last_name']; ?>
                </h3>
    
                <p>
                    <i data-lucide="hash" size="12"></i>
    
                    RX-<?= date('Y'); ?>-<?= str_pad($p['id'],5,'0',STR_PAD_LEFT); ?>
                </p>
    
            </div>
    
        </div>
    
        <div class="cw-content-col">
    
            <?php if($meds>0): ?>
    
            <span class="cw-pill cw-pill-meds">
                <i data-lucide="pill" size="14"></i>
    
                <?= $meds; ?>
                <?= $meds==1?'Medicamento':'Medicamentos'; ?>
    
            </span>
    
            <?php endif; ?>
    
            <?php if($labs>0): ?>
    
            <span class="cw-pill cw-pill-labs">
    
                <i data-lucide="microscope" size="14"></i>
    
                <?= $labs; ?>
                <?= $labs==1?'Laboratorio':'Laboratorios'; ?>
    
            </span>
    
            <?php endif; ?>
    
        </div>
    
        <div class="cw-date-col">
    
            <span class="cw-lbl">
                Emisión
            </span>
    
            <span class="cw-val">
                <?= date('d/m/Y',strtotime($p['created_at'])); ?>
            </span>
    
        </div>

        <div class="cw-status-col d-flex flex-column gap-1">
            <span class="cw-lbl">
                Estado
            </span>
            <?php $st = isset($p['status']) ? (int)$p['status'] : 1; ?>
            <select class="form-select form-select-sm cw-status-select" 
                    data-status="<?= $st; ?>"
                    onchange="changePrescriptionStatus(<?= $p['id']; ?>, this.value, this)">
                <option value="1" <?= $st == 1 ? 'selected' : ''; ?>>1. Pendiente</option>
                <option value="2" <?= $st == 2 ? 'selected' : ''; ?>>2. Compra parcial</option>
                <option value="3" <?= $st == 3 ? 'selected' : ''; ?>>3. Compra completa</option>
                <option value="4" <?= $st == 4 ? 'selected' : ''; ?>>4. No completado</option>
            </select>
        </div>

    
        <div class="cw-actions-col">
                <button
                    class="cw-btn-icon history"
                    onclick="openHistory(<?= $p['patient_id']; ?>)">
                    <i data-lucide="clipboard-list"></i>
                </button>
                
                <button
                    class="cw-btn-icon view"
                    onclick="openRecipe(<?= $p['id']; ?>)">
                    <i data-lucide="eye"></i>
                </button>
                <button class="cw-btn-icon dl cw-btn-download" title="Descargar PDF" data-id="<?= $p['id'] ?>" >
                    <i data-lucide="download" size="20"></i>
                </button>
                <button class="cw-btn-icon cw-btn-send" title="Reenviar Correo" data-id="<?= $p['id'] ?>">
                    <i data-lucide="send" size="18"></i>
                </button>
        </div>
    
    </div>
    
    <?php endforeach; ?>
    
    </div>
</div>

<!-- Contenedor para Toasts -->
<div class="cw-toast-container" id="cw-toast-container"></div>
   
<script>
    document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();

        // --- LÓGICA DEL BUSCADOR ---
        const searchInput = document.getElementById('cw-search-input');
        const cards = document.querySelectorAll('.cw-recipe-card');

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            cards.forEach(card => {
                const name = card.querySelector('.patient-name').innerText.toLowerCase();
                const id = card.querySelector('.cw-patient-details p').innerText.toLowerCase();
                
                if(name.includes(term) || id.includes(term)) {
                    card.style.display = 'grid'; 
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // --- CERRAR MODALES CON CLIC AFUERA ---
        document.querySelectorAll('.cw-modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal(overlay.id);
                }
            });
        });
        
        $(document).on('click', '.cw-btn-download', function(){
            let id = $(this).data('id');
            showToast('Preparando descarga del documento PDF...', 'download')
            downloadPDF(id);
          
        });
    
        
            function downloadPDF(id){
            window.open("<?= base_url('portal/prescription/download_pdf/') ?>" + id, '_blank');
        }
        
        $(document).on('click', '.cw-btn-send', function(){
            let id = $(this).data('id');
             showToast('Enviando receta...','send');
            sendRecipe(id);
          
        });
        
    function sendRecipe(id) {
    
       
    
        $.ajax({
            url: '<?= base_url('portal/prescription/send_whatsapp/') ?>' + id,
            type: 'GET',
            dataType: 'json',
    
            success: function(response){
    
                if(response.status){
                    showToast('Receta enviada', 'send');
                }else{
                    showToast(response.msg || 'Hubo un problema al enviar la receta', 'error');
                }
    
            },
    
            error: function(xhr, status, error){
    
                console.error(xhr.responseText);
    
                showToast(
                    
                    'Error de conexión (' + xhr.status + '): ' + error,
                    'error'
                );
    
            }
    
        });
    
    }
    
        
            // --- SISTEMA DE TOASTS (NOTIFICACIONES UI) ---
    function showToast(message, iconType) {
        const container = document.getElementById('cw-toast-container');
        const toast = document.createElement('div');
        toast.className = 'cw-toast';
        
        let iconHtml = '';
        if(iconType === 'download') { iconHtml = '<i data-lucide="download-cloud" size="20"></i>'; }
        if(iconType === 'send') { iconHtml = '<i data-lucide="check-circle-2" size="20" style="color: #34d399;"></i>'; }
        if(iconType === 'error') { iconHtml = '<i data-lucide="x-circle" size="20" style="color: red;"></i>'; }
        
        toast.innerHTML = `
            ${iconHtml}
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();
        
        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remover después de 3.5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
        
        
    });

    function changePrescriptionStatus(id, statusVal, elem) {
        if(elem) {
            elem.setAttribute('data-status', statusVal);
        }
        $.ajax({
            url: '<?= base_url("portal/prescription/update_status"); ?>',
            type: 'POST',
            data: { id: id, status: statusVal },
            dataType: 'json',
            success: function(res) {
                if(res.status) {
                    if(typeof showToast === 'function') {
                        showToast('Estado actualizado a: ' + (statusVal == 1 ? 'Pendiente' : statusVal == 2 ? 'Compra parcial' : statusVal == 3 ? 'Compra completa' : 'No completado'), 'send');
                    } else {
                        alert(res.message);
                    }
                } else {
                    alert(res.message || 'Error al actualizar el estado.');
                }
            },
            error: function(xhr, status, error) {
                alert('Error de conexión al actualizar estado.');
            }
        });
    }

</script>

