<?php

namespace Warehouse\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Http\Request;
use Plenty\Plugin\Templates\Twig;
use Plenty\Modules\StockManagement\Stock\Contracts\StockRepositoryContract;
use Plenty\Modules\StockManagement\Warehouse\Contracts\WarehouseRepositoryContract;
use Plenty\Modules\Item\Variation\Contracts\VariationLookupRepositoryContract;
use Plenty\Modules\Item\Variation\Contracts\VariationRepositoryContract;

/**
 * Class ContentController
 * @package ToDoList\Controllers
 */
class ContentController extends Controller
{
    /**
    * RENDER TWIG TEMPLATES ROUTING
    */
    public function render_start(Twig $twig, WarehouseRepositoryContract $whRepo)
    {
      $result = $whRepo->all();
      $templateData = array('warehouses' => $result);
      return $twig->render('Warehouse::content.start', $templateData);
    }
    public function render_incoming(Twig $twig, WarehouseRepositoryContract $whRepo)
    {
      $result = $whRepo->all();
      $templateData = array('warehouses' => $result);
      return $twig->render('Warehouse::content.incoming', $templateData);
    }
    public function render_transfer(Twig $twig, WarehouseRepositoryContract $whRepo)
    {
      $result = $whRepo->all();
      $templateData = array('warehouses' => $result);
      return $twig->render('Warehouse::content.transfer', $templateData);
    }
    public function render_inventur(Twig $twig, WarehouseRepositoryContract $whRepo)
    {
      $result = $whRepo->all();
      $templateData = array('warehouses' => $result);
      return $twig->render('Warehouse::content.inventur', $templateData);
    }
    public function listWarehouses(WarehouseRepositoryContract $whRepo)
    {
      $resultx = $whRepo->all();
      return $resultx;
    }

    /**
     * @param int                           $id
     * @param StockRepositoryContract       $stockRepo
     * @return string
     */
    public function findStock(int $id, StockRepositoryContract $stockRepo)
    {

    }
    /**
     * @param int                           $id
     * @param StockRepositoryContract       $stockRepo
     * @return string
     */
    public function stockByVariation(int $id, StockRepositoryContract $stockRepo)
    {

    }

    /**
     * @param  \Plenty\Plugin\Http\Request  $request
     * @param StockRepositoryContract       $stockRepo
     * @return string
     */
    public function bookStock(Request $request, StockRepositoryContract $stockRepo)
    {

    }


    /**
     * @param  \Plenty\Plugin\Http\Request  $request
     * @param StockRepositoryContract       $stockRepo
     * @return string
     */
    public function correctStock(Request $request, StockRepositoryContract $stockrepo)
    {

    }

    public function findArticle(Request $request, VariationLookupRepositoryContract $varRepo, VariationRepositoryContract $varRepoCo)
    {
      $rs = $request->all();

      $varRepo->hasBarcode($rs['barcode']);
      $result = $varRepo->lookup();
      if(empty($result))
      {
        $return['valid'] = false;
      }
      else {
        foreach($result as $item)
        { 
          $resultx = $varRepoCo->findById($item['variationId']);
          $return['variants'][] = $resultx;
        }
        $return['valid'] = true;

      }
      return json_encode($return);

    }
}
