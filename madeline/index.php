<?php
if (!file_exists('madeline.php')) {
    copy('https://phar.madelineproto.xyz/madeline.php', 'madeline.php');
}
include 'madeline.php';
$MP = new \danog\MadelineProto\API('session.madeline');
$MP->start();

/* if (isset($_POST['phone'])) {
    if (!empty($_POST['phone'])){
      $phone = $_POST['phone'];
    }
  } */



//$contact = ['_' => 'inputPhoneContact', 'client_id' => 0, 'phone' => '+380956568480', 'first_name' => '', 'last_name' => ''];
//$import = $MP->contacts->importContacts(['contacts' => [$contact]]);
// $import['imported'][0]['user_id'] - ID пользователя


/* if (isset($_POST['file'])) {
  if (!empty($_POST['file'])){
    $filePath = $_POST['file'];
    $MP->messages->sendMessage(['peer' => $import['imported'][0]['user_id'], 'message' => $_POST['message'], 'photo' => new CURLFile(realpath($filePath))]);
  } else {
    $MP->messages->sendMessage(['peer' => $import['imported'][0]['user_id'], 'message' => $_POST['message']]);
  }
  $MP->messages->sendMessage(['peer' => $import['imported'][0]['user_id'], 'message' => $_POST['message']]);
} */

$MP->messages->sendMessage(['peer' => '648038746', 'message' => 'olala']);

//Отправляем
/* if (!$MP->messages->sendMessage(['peer' => $import['imported'][0]['user_id'], 'message' => 'olala'])) {
  $message = 'Ой, что-то пошло не так! Попробуйте ещё раз';
}  */


/* $message = 'Спасибо! Мы свяжемся с вами как только просчитаем заказ (в течение 2х дней)';


$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
 */