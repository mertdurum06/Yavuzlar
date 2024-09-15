<?php

try{
    $db = new PDO('sqlite:../quest-app.db');

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e){
    echo $e;
}
