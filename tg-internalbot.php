<?php
$msgs = [];
if ($_SERVER["REQUEST_METHOD"] == "POST") {
 
    $token = "2008638636:AAEPJSrEN3lAq3hjhewCdJQBN4h3hkC5Qp8";
    $chat_id = "648038746";
 
        $bot_url = "https://api.telegram.org/bot{$token}/";
        $urlForPhoto = $bot_url . "sendPhoto?chat_id=" . $chat_id;
  

            $name = strip_tags($_POST['samplebrand']) . " " .strip_tags($_POST['samplename']). " " . strip_tags($_POST['samplesurface']) . "%0A";

            $price = "Розница " . strip_tags($_POST['retailprice']) ."$ / Ваша цена *". strip_tags($_POST['furnprice']) . "$* %0A";
          
        
 
        // Формируем текст сообщения
        $txt = $name . $price ;
 
        $sendTextToTelegram = file_get_contents("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}");
        if ($output && $sendTextToTelegram) {
            $msgs['okSend'] = 'Спасибо за отправку вашего сообщения!';
            echo json_encode($msgs);
        } elseif ($sendTextToTelegram) {
            $msgs['okSend'] = 'Спасибо за отправку вашего сообщения!';
            echo json_encode($msgs);
          return true;
        } else {
            $msgs['err'] = 'Ошибка. Сообщение не отправлено!';
            echo json_encode($msgs);
            die('Ошибка. Сообщение не отправлено!');
        }
 
} else {
  header ("Location: /");
}
?>