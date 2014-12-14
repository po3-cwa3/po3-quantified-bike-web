<?php

require('login/session.php');

$username = "";

if (isset($user)) {

    $username = $user->username;

}

?>

<header class="clearfix">
    <span>The Boss</span>
    <h1>Bike of StatS</h1>
    <nav>
        <a href="index.php" class="bp-icon bp-icon-home" data-info="home"><span>home</span></a>
        <a id="device"  class="bp-icon bp-icon-bicycle" data-info="about the device"><span>about the device</span></a>
        <a id="about"   class="bp-icon bp-icon-about" data-info="help"><span>help</span></a>
        <a id="settings"  class="bp-icon bp-icon-conf" data-info="log out"><span>log out</span></a>
        <h1 id="username"><?php echo $username ?></h1>
    </nav>
</header>

<div id="content" class="content">

    <section id="about-us" >
        <div id="detailCloseButton">×</div>
        <h3>HELP</h3>
        <p> The Boss website has been designed to give you all the information about your trips in an easy way. To achieve this, the
         website has been divided into three parts: the <i> calendar view </i>, the <i> compare view </i> and the <i> photo viewer </i>.</p>
         <p> Each of these pages has its own goal, which we will shortly explain below. </p> <br>


         <img class="HelpFrontPage" id="calendarview" src="Images/calendarview.png"></img>


         <p>
         <img class="Questionmark" src="Images/question.png"></img>
          The Calendar view has been designed to give you an easy overview of all the trips you made in a month, and, if you want, to get more detailed
         information about specific days. This will most likely be your starting point when looking at trips </p>


         <p>
         <img  class="HelpQuestion1" src="Images/calendar.png"></img>
         When you arrive on the calendar view, you will see a calendar, set on the current month. The page will automatically load all
         the trips you made in that particular month. If you want to choose another month, you can change the month in the upper right corner of the
         calendar. </p>


         <p>
         <img class="HelpQuestion" src="Images/CalendarChoose.png"></img>
         The calendar shows blocks. These blocks are filled, depending on the value for that day. You can choose for different values to be displayed:
         the number of trips, the average speed, the total distance, the total biking time, the average Temperature and the average Humidity. </p>


         <p>
         <img class="HelpQuestion1"  src="Images/detailssection.png"></img>
         Once you have clicked on a specific day, you will see the details section in front of you. This section contains more detailed information about
         all the trips made that day. If you want to go even more specific, you can always switch to the Compare view. </p>
         <br>




         <img class="HelpFrontPage" id="compareview" src="Images/compareview.png"></img>
         <p>
         <img class="Questionmark" src="Images/question.png"></img>
         The Compare view is a page designed to let you compare very specific information of specific trips. This is a very useful tool
         if you know which trips you want to compare and want to get a detailed comparison to quickly draw conclusions. </p>

         <p>
         <img class="HelpQuestion1" src="Images/smallcalendar.png"></img>
         When you arrive on the compare view page, you will also see a calendar, loading up trips made on that particular month. You will see that all
         the days with trips have colored blue and have become clickable. </p>

         <p>
         <img class="HelpQuestion" src="Images/tripslister.png"></img>
         If you click on a particular day, a list with all the trips made on that day will be
         displayed right of the calendar. if you click on them, the number of the trip will be displayed below. Once you have chosen all the trips
         you want the compare, click on the compare button. </p>

         <p>
         <img class="HelpQuestion1" src="Images/tablecircles.png"></img>
         You now see a quick comparison appearing on your screen. The circles let you see in an instant how long each trips has taken and how far
         you have gone. To make all of this extra clear, each trip has its own color. </p>

         <p>
         <img class="HelpQuestion" src="Images/graphs.png"></img>
         If you click on one of the blue buttons, a graph displaying the right values will appear below. As you see, each trip still has the same color,
         so it's very easy to know which line belongs to which trip. </p>

         <img class="HelpFrontPage"  src="Images/photoviewer.png"></img>

         <p>
         <img class="Questionmark" src="Images/question.png"></img>
         The photo viewer has been designed to let you relive all the beautiful memories you made during your trip. If you want a quick reminder of
         what you did during your trip, this page is the perfect one. </p>

         <p>
          <img class="HelpQuestion1" src="Images/smallcalendar.png"></img>
          When you arrive on the photo view page, you will also see a calendar, loading up trips made on that particular month. You will see that all
          the days with trips have colored blue and have become clickable. If you click on a day, the photos you made that day will automatically
           be loaded on the site. You will see a red mark on each place where a photo was taken</p>

         <p>
         <img class="HelpQuestion" src="Images/photo.png"></img>
         If you click on one of these marks, a small pop-up venster will appear and show you a quick preview of the photo you have taken. If you want
         to keep the photo, you can click on 'view full size' and then save the picture in a folder containing all the nice pictures you have taken during
         your biking adventures. </p>

         <button class="helpbutton" id="CloseAboutUs">close</button>

    </section>

    <section id="about-device" >
        <div id="detailCloseButton2">×</div>
        <h3>about the device</h3>
        <p>The Boss device is a user-friendly, nice looking device. We believe everyone must be able to use this device,
        that's why we created a device that's easily put on your bike. We made use of the innovative Arduino and Raspberry Pi
        software, to make sure you get the best experience possible while riding your bike.</p><br>
        <p> The device is easy to use. When looking at it, you will see a wooden plate containing a lot of buttons.
        each of these buttons has its own use. Below you can find a more detailed explanation. </p>
        <p> when you start the device, it will take a few seconds for the device to start up. </p>
        <p> Button "Take Picture": When pressed during an active trip, a picture is taken (Picture LED should be blue). When finished, the Picture LED should be green for some time.</p>
        <p> Button "Live/Batch": Toggle wether the data should be sent directly to the remote server or stored in the local database. When you're making a trip, this button should be switched to 'batch upload', since you won't have an internet connection during your trip. </p>
        <p>Button "Batch upload": When pressed (if an active internet connection is available), all the data you stored during your trip will be sent to the server, meaning you are now able to look at your trips on this site. </p>
        <p> Button "Start Trip" (this is the only blue button, attached to the breadboard, this button should be pressed twice for every action): When pressed (twice), it starts or stops a trip (The "Trip LED" indicates wether a trip is active or not).</p>
        <p> LED "Active Trip": Red if a trip is active. Off if no trip is active. </p>
        <p> LED "Picture": Blue if a picture is being taken. Green if taking a picture and storing it succeeded. Red if taking the picture or storing it failed. Off if no picture action is taking place. </p>
        <p> LED "Batch upload": Blue if a batch upload is going on. Green if the batch upload succeeded. Red if the batch upload failed. Off if no batch upload is taking place. </p>
        <p> LED "Connection": Green if an internet connection is available (needed for batch uploads and live trips). Off if no internet connection is available. </p>
        <p> LED "Live/Batch": Red if new trips will be started in live mode. Off if new trips will be started in batch mode (all data will be collected on the device and sent to the remote server using the batch upload button). </p>

        <button class="helpbutton" id="CloseAboutDevice">close</button>

    </section>

    <section id="settings-user">
        <div id="detailCloseButton3">×</div>
        <h3>Settings</h3>
        <a href="#">account settings</a><br>
        <a href="#">log out</a>
        </section>
</div>