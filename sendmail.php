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
	$mail->addReplyTo($_POST['email'], $_POST['name']);
	//Тема письма
	$mail->Subject = 'Новый просчет от '.$_POST['name'].' '.$_POST['phone'].' '.$_POST['email'];

	//Рука
/* 	$respond = "Правая";
	if($_POST['respond'] == "left"){
		$respond = "Левая";
	} */

	//Тело письма
	$body = '<h1>Изделие на просчёт</h1>';
	
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Заказчик:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['phone']))){
		$body.='<p><strong>Телефон:</strong> '.$_POST['phone'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['respond']))){
		$body.='<p><strong>Желаемый способ связи:</strong> '.$_POST['respond'].'</p>';
	}
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Комментарий:</strong> '.$_POST['message'].'</p>';
	}
	
	//Прикрепить файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//путь загрузки файла
		$filePath = __DIR__ . "/files/" . $_FILES['image']['name']; 
		//грузим файл
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			$body.='<p><strong>Эскиз во вложении</strong>';
			$mail->addAttachment($fileAttach);
		}
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