<?php

namespace Warehouse\Providers;

use Plenty\Plugin\ServiceProvider;

class WarehouseServiceProvider extends ServiceProvider
{
    public function register()
    {
      $this->getApplication()->register(WarehouseRouteServiceProvider::class);
    }

}

?>
