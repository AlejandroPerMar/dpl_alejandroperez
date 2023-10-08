<html>

<head>
    <title>Calculadora</title>
    <link rel="stylesheet" href="./css/calculadora.css">
</head>

<body>
    <h1>Calculadora Dockerizada</h1>
    <form method="post" action="calculadora.php">
        <input type="number" value=0 name="num1">
        <br><br>
        <input type="number" value=0 name="num2">
        <br><br>
        <select name="signo">
            <option value="sumar">Sumar
            </option>
            <option value="restar">Restar
            </option>
            <option value="multiplicar">Multiplicar
            </option>
            <option value="dividir">Dividir
            </option>   
        </select>
        <br><br>
        <img src="/img/calculadora.png">
        <br><br>
        <input type="submit" value="Enviar">
    </form>
    <br>
    
</body>

</html>

<?php
$num1 = $_POST['num1'];
$num2 = $_POST['num2'];
$signo = $_POST['signo'];

if ($signo == "sumar") {
    $res = $num1 + $num2;
} else if ($signo == "restar") {
    $res = $num1 - $num2;
} else if ($signo == "multiplicar") {
    $res = $num1 * $num2;
} else if ($signo == "dividir") {
    $res = $num1 / $num2;
}
echo "La solución es: " . $res;
?>