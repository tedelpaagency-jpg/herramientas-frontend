<?php 
$lexvault = $this->db->get_where('lexvault',array('lexvault_id'=>$lexvault_id))->result_array();
foreach($lexvault as $details):
?>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <style>
.editor {
    max-width: 100%;
    /* Evita que el editor sea más ancho que la pantalla */
    margin: 0 auto;
    box-sizing: border-box;
    background-color: #f4f6fd;
    overflow: auto;
    text-align: center;
    /* Incluye el padding en el ancho total */
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 10px solid white;
}

.inner-wrapper-sticky {
    max-width: 100%;
    /* Evita que el editor sea más ancho que la pantalla */
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f4f6fd;
    text-align: center;
    background-color: #fff;
    margin-bottom: 10px;
    border-bottom: 1px solid #00000029;
}


.sheet {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    box-sizing: border-box;
    /* Incluye el padding en el ancho total */
    background-color: white;
    display: inline-block;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    text-align: left;
    line-height: 124%;
    font-family: Arial;
    font-weight: normal;
    word-spacing: -1px;
    
}


  
.carta {

    width: 216mm;
    height: 279mm;
    padding: 2.5cm 3cm 2.5cm 3cm;
    background-image: url('<?= base_url(); ?>uploads/membretes/<?= $details['membrete']; ?>');
    background-size: 215.9mm 279.4mm;
    background-position: top left;
    background-repeat: no-repeat;
}

<?php 
    $sheet_docs = $this->db->get_where('settings', array('type' => 'sheet_docs'))->row()->description;
    $sheet_docs_of = $this->db->get_where('settings', array('type' => 'sheet_docs_of'))->row()->description;
?>
.oficio {

    width: 21.6cm;
    height: 33cm;
    padding: 2.5cm 3cm 2.5cm 3cm;
    
 
    
}


.withBackgroundCarta {
 background-image: url('<?php echo base_url(); ?>public/assets/images/<?php echo $sheet_docs; ?>');
 background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.withBackgroundOficio {
    background-image: url('<?php echo base_url(); ?>public/assets/images/<?php echo $sheet_docs_of; ?>');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}


.withOutBackground {
    background-image: none;
}


#mydiv {

    z-index: 99;
    text-align: center;
    font-size: 16px;
}

#mydivheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #2196F3;
    color: #fff;
}

.toolbar_icons:hover {
    background: grey;
    border: 1px solid #ccc;
}

@media print {

    body,
    page[size="A4"] {
        margin: 0;
        box-shadow: 0;
    }
}

.sheet ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

.sheet p {
    margin: 0;
}

.sheet div {
    margin: 0;
    
}

.color-picker {
    text-align: center;
}

#colorInput {

    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    position: relative;
    top: 10px;
}

    .triangulo-amarillo {
      position: relative;
      width: 200px; /* Ancho del elemento */
      height: 200px; /* Alto del elemento */
      background: yellow; /* Color de fondo amarillo */
    }
    
    .triangulo-amarillo::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 100px solid transparent; /* Lado izquierdo del triángulo */
      border-bottom: 100px solid yellow; /* Base del triángulo */
    }
  </style>

<div class="page-body">
    <!-- Container-fluid starts-->
    <div class="container-fluid user-card" style="padding-bottom: 50px;padding-top: 15px;">
        <!-- Zero Configuration  Starts-->
        <div class="editor">

            <div id="sticky1" class="acciones">
                <div>
                    <div style="text-align:left;">
                        <h3 class="user-name2 " style="display: inline-flex;">
                            <a href="<?php echo base_url(); ?>portal/lexvault">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                                    <g fill="none" stroke-linejoin="round" stroke-width="4">
                                        <path fill="#000" stroke="#000" d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" />
                                        <path stroke="#fff" stroke-linecap="round" d="M32.4917 24.5H14.4917" />
                                        <path stroke="#fff" stroke-linecap="round" d="M23.4917 15.5L14.4917 24.5L23.4917 33.5" />
                                    </g>
                                </svg>
                            </a>
                            <?php echo $details['name'];?>
                        </h3>
                    </div>
                    <div class="" id="mydiv">
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Undo" onclick="formatDoc('undo');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M11.2721 36.7279C14.5294 39.9853 19.0294 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C19.0294 6 14.5294 8.01472 11.2721 11.2721C9.61407 12.9301 6 17 6 17"%2F%3E%3Cpath d="M6 9V17H14"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Redo" onclick="formatDoc('redo');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M36.7279 36.7279C33.4706 39.9853 28.9706 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C28.9706 6 33.4706 8.01472 36.7279 11.2721C38.3859 12.9301 42 17 42 17"%2F%3E%3Cpath d="M42 8V17H33"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <span style="color: #bcbcbc;font-size: 20px;font-weight: lighter;">|</span>
                        <select class="form-control" style=" width: 75px;display: inline-block;" onchange="formatDoc('fontname',this[this.selectedIndex].value);this.selectedIndex=0;">
                            <option class="heading" selected>Fuente del sistema</option>
                            <option>Arial</option>
                            <option>Arial Black</option>
                            <option>Courier New</option>
                            <option>Times New Roman</option>
                        </select>
                        <select class="form-control" style=" width: 85px;display: inline-block;" onchange="changeLetterSize(this.value);" onblur="changeLetterSize(this.value);">
                            <option class="heading" selected>Tamaño de letra</option>
                            <option value="1">10</option>
                            <option value="2">12</option>
                            <option value="3">14</option>
                            <option value="4">16</option>
                            <option value="5">18</option>
                            <option value="6">20</option>
                            <option value="7">22</option>
                        </select>
                        <select class="form-control" style=" width: 85px;display: inline-block;" onchange="changeBackground(this.value);">
                            <option class="1" selected>Con fondo</option>
                            <option value="2">Sin fondo</option>
                        </select>
                        <input type="color" id="colorInput" value="#000" onchange="formatDoc('forecolor',this.value);" onclick="formatDoc('forecolor',this.value);">
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Bold" onclick="formatDoc('bold');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" fill-rule="evenodd" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" clip-rule="evenodd"%3E%3Cpath d="M24 24C29.5056 24 33.9688 19.5228 33.9688 14C33.9688 8.47715 29.5056 4 24 4H11V24H24Z"%2F%3E%3Cpath d="M28.0312 44C33.5368 44 38 39.5228 38 34C38 28.4772 33.5368 24 28.0312 24H11V44H28.0312Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Italic" onclick="formatDoc('italic');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M20 6H36"%2F%3E%3Cpath d="M12 42H28"%2F%3E%3Cpath d="M29 5.95215L19 41.9998"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Underline" onclick="formatDoc('underline');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-width="4"%3E%3Cpath stroke-linejoin="round" d="M8 44H40"%2F%3E%3Cpath d="M37 6.09717C37 12.7638 37 15.3335 37 22.0002C37 29.1799 31.1797 35.0002 24 35.0002C16.8203 35.0002 11 29.1799 11 22.0002C11 15.3335 11 12.7638 11 6.09717"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <span style="color: #bcbcbc;font-size: 20px;font-weight: lighter;">|</span>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Left align" onclick="formatDoc('justifyleft');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M42 9H6"%2F%3E%3Cpath d="M34 19H6"%2F%3E%3Cpath d="M42 29H6"%2F%3E%3Cpath d="M34 39H6"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Center align" onclick="formatDoc('justifycenter');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M36 19H12"%2F%3E%3Cpath d="M42 9H6"%2F%3E%3Cpath d="M42 29H6"%2F%3E%3Cpath d="M36 39H12"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Right align" onclick="formatDoc('justifyright');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M42 9H6"%2F%3E%3Cpath d="M42 19H14"%2F%3E%3Cpath d="M42 29H6"%2F%3E%3Cpath d="M42 39H14"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="justifyFull align" onclick="formatDoc('justifyFull');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M42 19H6"%2F%3E%3Cpath d="M42 9H6"%2F%3E%3Cpath d="M42 29H6"%2F%3E%3Cpath d="M42 39H6"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <span style="color: #bcbcbc;font-size: 20px;font-weight: lighter;">|</span>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Numbered list" onclick="formatDoc('insertorderedlist');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M9 4V13"%2F%3E%3Cpath d="M12 13H6"%2F%3E%3Cpath d="M12 27H6"%2F%3E%3Cpath d="M6 19.9998C6 19.9998 9 16.9998 11 19.9998C13 22.9999 6 26.9998 6 26.9998"%2F%3E%3Cpath d="M6.00016 34.5001C6.00016 34.5001 8.00016 31.5 11.0002 33.5C14.0002 35.5 11.0002 38 11.0002 38C11.0002 38 14.0002 40.5 11.0002 42.5C8.00015 44.5 6.00015 41.5 6.00015 41.5"%2F%3E%3Cpath d="M11 38H9"%2F%3E%3Cpath d="M9 4L6 6"%2F%3E%3Cpath d="M21 24H43"%2F%3E%3Cpath d="M21 38H43"%2F%3E%3Cpath d="M21 10H43"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Dotted list" onclick="formatDoc('insertUnorderedList');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M9 42C11.2091 42 13 40.2091 13 38C13 35.7909 11.2091 34 9 34C6.79086 34 5 35.7909 5 38C5 40.2091 6.79086 42 9 42Z"%2F%3E%3Cpath d="M9 14C11.2091 14 13 12.2092 13 10C13 7.79086 11.2091 6 9 6C6.79086 6 5 7.79086 5 10C5 12.2092 6.79086 14 9 14Z"%2F%3E%3Cpath d="M9 28C11.2091 28 13 26.2092 13 24C13 21.7908 11.2091 20 9 20C6.79086 20 5 21.7908 5 24C5 26.2092 6.79086 28 9 28Z"%2F%3E%3Cpath stroke-linecap="round" d="M21 24H43"%2F%3E%3Cpath stroke-linecap="round" d="M21 38H43"%2F%3E%3Cpath stroke-linecap="round" d="M21 10H43"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Add indentation" onclick="formatDoc('outdent');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M6 9H42"%2F%3E%3Cpath d="M19 19H42"%2F%3E%3Cpath d="M19 29H42"%2F%3E%3Cpath d="M11 19L6 24L11 29"%2F%3E%3Cpath d="M6 39H42"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Delete indentation" onclick="formatDoc('indent');"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M42 9H6"%2F%3E%3Cpath d="M29 19H6"%2F%3E%3Cpath d="M29 29H6"%2F%3E%3Cpath d="M37 19L42 24L37 29"%2F%3E%3Cpath d="M42 39H6"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <span style="color: #bcbcbc;font-size: 20px;font-weight: lighter;">|</span>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Nueva pagina" onclick="addPages();"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="22" height="22" viewBox="0 0 24 24"%3E%3Cg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"%3E%3Cpath d="M4 21.4V2.6a.6.6 0 0 1 .6-.6h11.652a.6.6 0 0 1 .424.176l3.148 3.148A.6.6 0 0 1 20 5.75V21.4a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6ZM8 10h8m-8 8h8m-8-4h4"%2F%3E%3Cpath d="M16 2v3.4a.6.6 0 0 0 .6.6H20"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <span style="color: #bcbcbc;font-size: 20px;font-weight: lighter;">|</span>
                        <i class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="Save" onclick="saveContent()"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none"%3E%3Cpath fill="%232F88FF" stroke="%23000" stroke-linejoin="round" stroke-width="4" d="M6 9C6 7.34315 7.34315 6 9 6H34.2814L42 13.2065V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9Z"%2F%3E%3Cpath fill="%2343CCF8" fill-rule="evenodd" d="M24.0083 6L24 13.3846C24 13.7245 23.5523 14 23 14H15C14.4477 14 14 13.7245 14 13.3846L14 6" clip-rule="evenodd"%2F%3E%3Cpath stroke="%23fff" stroke-linejoin="round" stroke-width="4" d="M24.0083 6L24 13.3846C24 13.7245 23.5523 14 23 14H15C14.4477 14 14 13.7245 14 13.3846L14 6H24.0083Z"%2F%3E%3Cpath stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 6H34.2814"%2F%3E%3Cpath stroke="%23fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 26H34"%2F%3E%3Cpath stroke="%23fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 34H24.0083"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></i>
                        <a class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" title="PDF" href="<?php echo base_url(); ?>portal/lexvault_edit/downloadPDF/<?php echo $lexvault_id; ?>"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-width="4"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M10 38V44H38V38"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M38 20V14L30 4H10V20"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M28 4V14H38"%2F%3E%3Crect width="40" height="18" x="4" y="20" stroke-linejoin="round" rx="2"%2F%3E%3Cpath stroke-linecap="round" d="M21 25V33"%2F%3E%3Cpath stroke-linecap="round" d="M10 25V33"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M32 33V25H37"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M32 30H37"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M10 25H13.5C14.8807 25 16 26.1193 16 27.5V27.5C16 28.8807 14.8807 30 13.5 30H10"%2F%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M21 25H23C25.2091 25 27 26.7909 27 29V29C27 31.2091 25.2091 33 23 33H21"%2F%3E%3Cpath stroke-linecap="round" d="M16 12H20"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E' /></a>
                        <a class="toolbar_icons" style="cursor:pointer; width: 20px;padding:5px" target="_blank" title="Print" href="<?php echo base_url(); ?>portal/lexvault_edit/printPDF/<?php echo $lexvault_id; ?>"><img src='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 48 48"%3E%3Cg fill="none" stroke="%23000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"%3E%3Cpath d="M32 33H42C43.1046 33 44 32.1046 44 31V15C44 13.8954 43.1046 13 42 13H32"%2F%3E%3Cpath d="M16 33H6C4.89543 33 4 32.1046 4 31V15C4 13.8954 4.89543 13 6 13H16"%2F%3E%3Cpath d="M12 13V19H36V13"%2F%3E%3Cpath d="M16 13V5H32V13"%2F%3E%3Cpath d="M16 29V43H32V29"%2F%3E%3Cpath d="M22 35H26"%2F%3E%3Cline x1="13" x2="35" y1="27" y2="27"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E'></a>
                        <span style="color: #bcbcbc;font-size: 20px;font-weight: lighter;">|</span>
                        <button aria-controls="offcanvasEnd" class="btn btn-light-primary m-2" data-bs-target="#offcanvasEnd" data-bs-toggle="offcanvas" type="button">Campos
                                </button>
                    </div>
                </div>
            </div>

            <!-- Aquí se agregarán las hojas -->
            <div class="sheets">
                <?php 
                    if($details['content'] != ''):
                        echo $details['content']; 
                    else:
                ?>
                <div class="sheet carta" contenteditable="true"></div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<div class="offcanvas offcanvas-end " id="offcanvasEnd" tabindex="-1" aria-modal="true" role="dialog">
    <div class="offcanvas-header">
        <h5 id="offcanvasRightLabel3">CAMPOS</h5><br>
       
        <button aria-label="Close" class="btn-close text-reset fs-5" data-bs-dismiss="offcanvas" type="button"></button>
    </div>
    <div class="offcanvas-body">
         <p class="mb-0">Agrega los campos a sustituir en el documento</p>
        <div class="fields">
            <div>
                <div class="customizer-body custom-scrollbar">
                    <div class="row sticky-header-main">
                        <div class="col-sm-12">
                            <div class="">
                                <div class="card-body">
                                    <div class="todo-list-body" id="fields_list">
                                       <div class="row todo-list">
                                            <?php 
                                                $cont = 0;
                                                $fields = json_decode($details['fields']);
                                                foreach ($fields as $field => $value):
                                            ?>
                                            <div class="col-sm-12 m-b-10">
                                                <lable class="task-label "><b><?php echo str_replace('_',' ',$field); ?></b></span><span class="task-action-btn" style="color: red;margin-left: 10px;"><span class="action-box large delete-btn" title="Delete Task" onclick="deleteField(this)"><i class="icon"><i class="icon-trash"></i></i></span></label>
                                                <input class="field_replace form-control" type="text" data-field="<?php echo $field; ?>" value="<?php echo $value; ?>" class="form-control" />
                                            </div>
                                            <?php endforeach; ?>
        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script>
let MEMBRETE_URL = '<?= ($details['membrete'] != '') ? base_url().$details['membrete'] : 'null'; ?>';
aplicarMembrete();

             
function aplicarMembrete() {
            if (!MEMBRETE_URL) return;
        
            $('.carta').css({
                'background-image': 'url(' + MEMBRETE_URL + ')',
                'background-size': 'cover',
                'background-position': 'top center',
                'background-repeat': 'no-repeat'
            });
        }
        
$(function() {


     // Recorrer los inputs y guardar sus valores en formData cuando se ingrese un valor
  $('#fields_list input').on('keyup', function() {

    const formData = new FormData();

    // Recorrer todos los elementos <input> de tipo "text" con la clase "form-control"
    $('.field_replace').each(function() {

        console.log($(this).attr('data-field'));
      const fieldName = $(this).attr('data-field');
      const fieldValue = $(this).val();
     // Verificar que el campo tenga un nombre antes de agregarlo a formData
     if (fieldName) {
        formData.append(fieldName, fieldValue);
      }

    });

    console.log(formData);
    // Enviar formData al servidor usando AJAX
    guardarDatos(formData);


  });




    const sheetDivs = document.querySelectorAll('.sheet');

    sheetDivs.forEach((sheetDiv) => {
        sheetDiv.addEventListener('paste', (event) => {
            event.preventDefault(); // Evita la acción de pegar predeterminada

            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');

            // Inserta el texto sin formato en el elemento editable
            document.execCommand('insertText', false, pastedText);
        });
    });




    $("#new_field").keyup(function() {
        if ($(this).val() != '') {
            $('#add_field').attr('disabled', false);
        } else {
            $('#add_field').attr('disabled', true);
        }
    });



    $("#add_field").click(function() {
       $('.todo-list').append(`
        <div class="col-sm-12 m-b-10">
                <lable class="task-label ">[${$('#new_field').val()}]</span><span class="task-action-btn" style="color: red;margin-left: 10px;"><span class="action-box large delete-btn" title="Delete Task" onclick="deleteField(this)"><i class="icon"><i class="icon-trash"></i></i></span></label>
                <input class="field_replace form-control" type="text" data-field="${$('#new_field').val().replace(/ /g, '_')}" value="" class="form-control" />
            </div>
       `);

           const formData = new FormData();

            // Recorrer todos los elementos <input> de tipo "text" con la clase "form-control"
            $('.field_replace').each(function() {

                console.log($(this).attr('data-field'));
            const fieldName = $(this).attr('data-field');
            const fieldValue = $(this).val();
            // Verificar que el campo tenga un nombre antes de agregarlo a formData
            if (fieldName) {
                formData.append(fieldName, fieldValue);
            }

            });

            console.log(formData);
            // Enviar formData al servidor usando AJAX
            guardarDatos(formData);
            
            
           // Recorrer los inputs y guardar sus valores en formData cuando se ingrese un valor
            $('#fields_list input').on('keyup', function() {

            const formData = new FormData();

            // Recorrer todos los elementos <input> de tipo "text" con la clase "form-control"
            $('.field_replace').each(function() {

                console.log($(this).attr('data-field'));
            const fieldName = $(this).attr('data-field');
            const fieldValue = $(this).val();
            // Verificar que el campo tenga un nombre antes de agregarlo a formData
            if (fieldName) {
                formData.append(fieldName, fieldValue);
            }

            });

            console.log(formData);
            // Enviar formData al servidor usando AJAX
            guardarDatos(formData);


            });


    });


});

function addPages() {
                $('.sheets').append(`<div class="sheet carta" contenteditable="true" onkeydown="checkPage(this,event)"></div>`);
                new StickySidebar('#sticky1', {
            topSpacing: 72
        });
        }

function deleteField(element) {
  $(element).parent().parent().parent().remove();
           const formData = new FormData();

            // Recorrer todos los elementos <input> de tipo "text" con la clase "form-control"
            $('.field_replace').each(function() {

                console.log($(this).attr('data-field'));
            const fieldName = $(this).attr('data-field');
            const fieldValue = $(this).val();
            // Verificar que el campo tenga un nombre antes de agregarlo a formData
            if (fieldName) {
                formData.append(fieldName, fieldValue);
            }

            });

            console.log(formData);
            // Enviar formData al servidor usando AJAX
            guardarDatos(formData);

}


function formatDoc(sCmd, sValue) {
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(sCmd, false, sValue);


}

function changeSheetSize(size) {
    var sheet = $('.sheet');
    if (size == 2) {
        sheet.removeClass('carta');
        sheet.addClass('oficio');
    } else {
        sheet.removeClass('oficio');
        sheet.addClass('carta');
    }
    
    if (sheet.hasClass('withOutBackground')) {
         
        sheet.removeClass('withBackgroundCarta');
        sheet.removeClass('withBackgroundOficio');
        sheet.addClass('withOutBackground');
          
    } else {
        sheet.removeClass('withOutBackground');
        sheet.removeClass('withBackgroundOficio');
        sheet.removeClass('withBackgroundCarta');
        
        if(sheet.hasClass('carta'))
         sheet.addClass('withBackgroundCarta');
       
        
         if(sheet.hasClass('oficio'))
        sheet.addClass('withBackgroundOficio');
    }

}


function changeBackground(back) {
    var sheet = $('.sheet');
    if (back == 2) {
         
        sheet.removeClass('withBackgroundCarta');
        sheet.removeClass('withBackgroundOficio');
        sheet.addClass('withOutBackground');
          
    } else {
        sheet.removeClass('withOutBackground');
        sheet.removeClass('withBackgroundOficio');
        sheet.removeClass('withBackgroundCarta');
        
        if(sheet.hasClass('carta'))
         sheet.addClass('withBackgroundCarta');
       
        
         if(sheet.hasClass('oficio'))
        sheet.addClass('withBackgroundOficio');
    }

}

function changeLetterSize(fontSize) {
    // Change this to the desired font size
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("fontSize", false, fontSize);
};


function sendComment() {

    console.log('enviando: ' + $('#message-to-send').val());
    $.ajax({
        type: "POST",
        url: '<?php echo base_url(); ?>portal/contract_details/add_comment',
        data: {
            'comment': $('#message-to-send').val(),
            'contract_file_rev_id': '<?php echo $contract_file_rev_id; ?>',
        }, // serializes the form's elements.
        success: function(data) {
            getDetails('files_edit', <?php echo $contract_file_rev_id; ?>);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'colored-toast'
                },
                iconColor: 'white',
            });
            Toast.fire({
                icon: 'success',
                title: 'Agregado'
            })
            // show response from the php script.
        }
    });

}

function saveContent() {
    var contenido = $('.sheets').html();
    console.log('sheets: ' + contenido);
    $.ajax({
        type: "POST",
        url: '<?php echo base_url(); ?>portal/lexvault_edit/save_content',
        data: {
            'content': contenido,
            'lexvault_id': '<?php echo $lexvault_id; ?>',
        }, // serializes the form's elements.
        success: function(data) {

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'colored-toast'
                },
                iconColor: 'white',
            });
            Toast.fire({
                icon: 'success',
                title: 'Guardado'
            })
            // show response from the php script.
        }
    });

}


function checkPage($page, e) {
    var $editor = $('.editor');
    $page1 = $($page);
    $page = $($page);
    var pageHeight = $page.outerHeight() - 100; // altura de una página

    var lastChildPos = 0;
    var extraContent = '';

    $page.children().each(function() {
        lastChildPos += $(this).outerHeight();

        if (lastChildPos >= 1021) {
            extraContent += $(this)[0].outerHTML;
            $(this).remove();
        }

    });


    var page_length = $('.sheet').length;
    console.log(page_length, e.key, $page.html());
    if (e.key == 'Backspace' && ($page.html() == '' || $page.html() == '<br>') && page_length > 1) { // fixed syntax error and added missing && character
        e.preventDefault();
        console.log(page_length);

        var el = $page.prev('.sheet'); // selector para obtener el elemento anterior a $page con clase .page
        var range = document.createRange(); // createRange es una función JavaScript nativa
        var sel = window.getSelection(); // getSelection es una función JavaScript nativa

        range.selectNodeContents(el.get(0)); // establece el rango para seleccionar todo el contenido del elemento HTML
        range.collapse(false); // colapsa el rango en el extremo final del contenido
        sel.removeAllRanges(); // elimina cualquier selección previa
        sel.addRange(range); // establece el nuevo rango de selección

        el.focus();
        $page.remove();

    }

}
  // Función para enviar los datos al servidor
  function guardarDatos(data) {
    console.log('Guardando');
    $.ajax({
      type: 'POST',
      url: '<?php echo base_url(); ?>portal/lexvault_edit/save_fiels/<?php echo $lexvault_id; ?>', // Reemplaza con la URL de tu servidor
      data: data,
      processData: false, // Evita que jQuery procese los datos
      contentType: false, // Evita que jQuery configure el encabezado Content-Type
      success: function(response) {
        // Manejar la respuesta del servidor si es necesario
        console.log(response);
        
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'colored-toast'
                },
                iconColor: 'white',
            });
            Toast.fire({
                icon: 'success',
                title: 'Actualizado'
            })
            
            
      },
      error: function(error) {
        // Manejar errores si ocurrieron durante la solicitud
        console.error(error);
      }
    });
  }
  
  


</script>
    </div>
</div>

<?php endforeach; ?>
