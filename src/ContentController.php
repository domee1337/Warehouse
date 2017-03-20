<?php

namespace Warehouse\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Http\Request;
use Plenty\Plugin\Templates\Twig;
use Plenty\Modules\StockManagement\Stock\Contracts\StockRepositoryContract

/**
 * Class ContentController
 * @package ToDoList\Controllers
 */
class ContentController extends Controller
{

    public function findStock(int $id, StockRepositoryContract $stockRepo): string
    {
      $result = $stockRepo->listStockByWarehouseId($id, array(), 1, 30);
      return json_decode($result);
    }
}
