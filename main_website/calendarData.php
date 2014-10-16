<?php

$firstDayTimestamp = time() - (date("j")-1)*24*60*60;

$beginDay = date("N", $firstDayTimestamp)-1;
$nrOfDays = date("t");
$endDay = $beginDay + $nrOfDays - 1;
$nrOfRows = ceil($endDay/7.0);

$calendarData = array();

for ($row = 0; $row < $nrOfRows; $row++) {

	$rowData = array();
	
	for ($col = 0; $col < 7; $col++) {
	
		$cellData = array();
		
		$index = $row*7 + $col;
		
		$day = $index - $beginDay + 1;
		
		if ($day <= 0 || $day > $nrOfDays) {
			$day = "";
		}
		
		$cellData["dayNr"] = $day;
		$cellData["avSpeed"] = rand(0,80);
		
		$rowData[$col] = $cellData;
	}
	
	$calendarData[$row] = $rowData;
}

echo json_encode(array("data" => $calendarData));

?>