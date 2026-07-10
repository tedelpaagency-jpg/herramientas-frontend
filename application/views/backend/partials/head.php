<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?= $page_title; ?> - <?= $this->crud_model->getInfo('name'); ?> </title>

    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/css/themify-icons.css?v=1.2" type="text/css" media="all">
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/css/feather.css">
    <!-- Favicon icon -->
    <link rel="icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('favicon');?>" type="image/x-icon">
    <link rel="shortcut icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('favicon');?>" type="image/x-icon">
    
    <!-- Custom Stylesheet -->
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/css/style.css">
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/css/custom.css?v=1.4">
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/css/emoji.css">
    
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/css/lightbox.css">
    <!-- CSS -->
    <script src="<?= base_url(); ?>public/assets/js/plugin.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css">
    <script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<?= base_url(); ?>public/assets/css/file-upload-with-preview.min.css">
    <script src="<?= base_url(); ?>public/assets/js/file-upload-with-preview.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
   <!-- Google Fonts: Plus Jakarta Sans -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .modal-content
        {
            border-radius: 26px;
        }
        
    
    .form-control,
    .form-select{
        height:44px;
        background:#f5f7fb;
        border:1px solid #d9e2ef;
        border-radius:14px;
        padding:0 16px;
        font-size:15px;
        color:#334155;
        box-shadow:none;
    }
    
    .form-control::placeholder{
        color:#a0aec0;
    }
    
    .form-control:focus,
    .form-select:focus{
        background:#fff;
        border-color:#6b8cff;
        box-shadow:0 0 0 4px rgba(107,140,255,.10);
    }
    
    .form-label
    {
        font-size: 0.75rem;
    line-height: 1rem;
    }
    
    /* INPUT GROUP */
    
    .input-group>.form-control,
    .input-group>.form-select{
    
        height:44px;
        background:#f5f7fb;
        border:1px solid #d9e2ef;
        color:#334155;
        font-size:15px;
        box-shadow:none;
    
    }
    
    .input-group>.form-control{
    
        border-left:0;
        border-radius:0 14px 14px 0;
    
    }
    
    .input-group>.form-select{
    
        border-left:0;
        border-radius:0 14px 14px 0;
    
    }
    
    .input-group-text{
    
        height:44px;
        background:#f5f7fb;
        border:1px solid #d9e2ef;
        border-right:0;
        color:#94a3b8;
        font-size:15px;
        font-weight:500;
        border-radius:14px 0 0 14px;
        padding:0 16px;
    
    }
    
    /* Hover */
    
    .input-group:hover .input-group-text,
    .input-group:hover .form-control,
    .input-group:hover .form-select{
    
        border-color:#c7d2e3;
    
    }
    
    /* Focus */
    
    .input-group:focus-within .input-group-text,
    .input-group:focus-within .form-control,
    .input-group:focus-within .form-select{
    
        background:#fff;
        border-color:#6b8cff;
        box-shadow:none;
    
    }
    
    .input-group:focus-within{
    
        border-radius:14px;
        box-shadow:0 0 0 4px rgba(107,140,255,.10);
    
    }
    
    /* Botón secundario */

    .btn-soft{
    
        height:44px;
        min-width:96px;
    
        background:#eef2f7;
        color:#475569;
    
        border:1px solid #dbe3ee;
        border-radius:14px;
    
        font-size:15px;
        font-weight:600;
    
        padding:0 24px;
    
        transition:all .25s ease;
        box-shadow:none;
    
    }
    
    .btn-soft:hover{
    
        background:#e2e8f0;
        border-color:#cbd5e1;
        color:#334155;
    
    }
    
    .btn-soft:focus{
    
        box-shadow:0 0 0 .2rem rgba(148,163,184,.15);
    
    }
    
    /* Botón principal */
    
    .btn-gradient{
    
        height:44px;
        min-width:180px;
    
        background:linear-gradient(90deg,#5B5FF6 0%,#9333EA 100%);
        color:#fff;
    
        border:0;
        border-radius:14px;
    
        font-size:15px;
        font-weight:600;
    
        padding:0 24px;
    
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:.5rem;
    
        transition:all .25s ease;
    
        box-shadow:0 8px 20px rgba(123,73,255,.25);
    
    }
    
    .btn-gradient:hover{
    
        background:linear-gradient(90deg,#4F46E5 0%,#7E22CE 100%);
        color:#fff;
    
        transform:translateY(-1px);
    
        box-shadow:0 12px 24px rgba(123,73,255,.35);
    
    }
    
    .btn-gradient:active{
    
        transform:translateY(0);
    
    }
    
    .btn-gradient:focus{
    
        color:#fff;
    
        box-shadow:
            0 0 0 .25rem rgba(123,73,255,.18),
            0 8px 20px rgba(123,73,255,.25);
    
    }
    
    .btn-gradient i,
    .btn-gradient svg{
    
        font-size:12px;
    
    }
  /* --- TOASTS --- */
    .cw-toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 100000; display: flex; flex-direction: column; gap: 10px; }
    .cw-toast {
        background: #0f172a; color: white; padding: 16px 24px; border-radius: 14px;
        box-shadow: 0 15px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; font-weight: 600;
        font-size: 0.9rem; transform: translateY(100px) scale(0.9); opacity: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cw-toast.show { transform: translateY(0) scale(1); opacity: 1; }      
    </style>
</head>
<!-- NOTIFICACIONES TOAST (Visuales, evita usar alert()) -->
<div class="cw-toast-container" id="cw-toast-container"></div>