<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('uk', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('info@quartz-stone.od.ua', 'Quartz stone od');
	//Кому отправить
	$mail->addAddress($_POST['email']);
	//Адрес куда отвечать
	$mail->addReplyTo('tshch92@gmail.com');
	//копия
	$mail->addCC("tshch92@gmail.com");
	//Тема письма
	$mail->Subject = 'Стільниця '.$_POST['samplebrand'].' '.$_POST['samplename'].' '.$_POST['samplesurface'].' '.$_POST['sampleprice'];

	//Рука
/* 	$respond = "Правая";
	if($_POST['respond'] == "left"){
		$respond = "Левая";
	} */

	//Тело письма
	$body = '<h1>'.$_POST['samplebrand'].' '.$_POST['samplename'].' '.$_POST['samplesurface'].'</h1></br>';

	$body .= '<h2>'.$_POST['sampleprice'].'</h2></br>';

	$body .= 'Витрати матеріалу, сл.: '.$_POST['sampleslabs'];

	$body .= '<hr>';

	$body .= '<strong>Параметри виробу</strong><br>';

	$body .= $_POST['message'];

	$body .= $_POST['sampleimage'];

	$body .= $_POST['signature'];
	
/* 	//Прикрепить файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//путь загрузки файла
		$filePath = __DIR__ . "/files/" . $_FILES['image']['name']; 
		//грузим файл
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $_POST['file'];
			$mail->addAttachment($fileAttach);
		}
	} */

/* 	$fileAttach = $_POST['file'];
	$mail->addAttachment($fileAttach); */

	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'Ой, что-то пошло не так! Попробуйте ещё раз';
	} else {
		$message = 'Спасибо! Мы свяжемся с вами как только просчитаем заказ (в течение 2х дней)';
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
?>