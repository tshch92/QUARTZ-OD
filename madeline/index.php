<?php
if (!file_exists('madeline.php')) {
    copy('https://phar.madelineproto.xyz/madeline.php', 'madeline.php');
}
include 'madeline.php';
$MP = new \danog\MadelineProto\API('session.madeline');
$MP->start();

if (isset($_POST['phone'])) {
    if (!empty($_POST['phone'])){
      $phone = $_POST['phone'];
    }
  }



$contact = ['_' => 'inputPhoneContact', 'client_id' => 0, 'phone' => $phone, 'first_name' => '', 'last_name' => ''];
$import = $MP->contacts->importContacts(['contacts' => [$contact]]);
// $import['imported'][0]['user_id'] - ID пользователя

$MP->messages->sendMessage(['peer' => $import['imported'][0]['user_id'], 'message' => 'test proschet']);