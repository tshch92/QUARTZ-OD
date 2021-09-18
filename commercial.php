<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('info@quartz-stone.od.ua', 'Quartz stone od');
	//Кому отправить
	$mail->addAddress('tshch92@gmail.com');
	//Адрес куда отвечать
	$mail->Subject = 'Скачали коммерческое '.$_POST['name'].' '.$_POST['phone'];

	//Тело письма
	$body = '<h1>Скачали коммерческое</h1>';
	
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Заказчик:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['phone']))){
		$body.='<p><strong>Телефон:</strong> '.$_POST['phone'].'</p>';
	}

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