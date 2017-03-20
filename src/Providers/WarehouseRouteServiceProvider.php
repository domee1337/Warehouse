<?php

namespace Warehouse\Providers;

use Plenty\Plugin\RouteServiceProvider;
use Plenty\Plugin\Routing\Router;

class WarehouseRouteServiceProvider extends RouteServiceProvider
{
    /**
     * @param Router $router
     */
    public function map(Router $router)
    {

        $router->get('todo/{id}', 'Warehouse\Controllers\ContentController@findStock')->where('id', '\d+');
        /*$router->post('todo', 'ToDoList\Controllers\ContentController@createToDo');
        $router->put('todo/{id}', 'ToDoList\Controllers\ContentController@updateToDo')->where('id', '\d+');
        $router->delete('todo/{id}', 'ToDoList\Controllers\ContentController@deleteToDo')->where('id', '\d+');*/
    }

}

?>
