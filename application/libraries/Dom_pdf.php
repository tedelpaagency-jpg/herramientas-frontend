<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'libraries/dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

class Dom_pdf {

    protected $ci;
    public $dompdf;

    public function __construct()
    {
        $this->ci =& get_instance();

        $options = new Options();

        // 🔥 IMPORTANTE
        $options->set('isRemoteEnabled', true);      // Permite imágenes externas
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('chroot', FCPATH);

        $options->set('defaultFont', 'Arial');

        $this->dompdf = new Dompdf($options);

        // 🔥 Esto ayuda a resolver rutas locales
        $this->dompdf->setBasePath(FCPATH);
    }

    public function load_view($view, $data = array())
    {
        $html = $this->ci->load->view($view, $data, TRUE);
        $this->dompdf->loadHtml($html);
        return $this;
    }

    public function set_paper($size, $orientation)
    {
        $this->dompdf->setPaper($size, $orientation);
        return $this;
    }

    public function render()
    {
        $this->dompdf->render();
        return $this;
    }

    public function stream($filename = 'document.pdf', $options = array())
    {
        $this->dompdf->stream($filename, $options);
    }
    
    public function output()
    {
        return $this->dompdf->output();
    }
}