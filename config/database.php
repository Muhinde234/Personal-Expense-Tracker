<?php
$servername = "localhost";
$user = "root";
$password = "";
$dbname = "expensedb";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //  echo "Connected successfully";  
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>

