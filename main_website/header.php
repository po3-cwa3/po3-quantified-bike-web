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
        <h3>about us</h3>
        <p> We are bike of stats. We are a group of 6 young motivated people, dedicated to make your life as easy as possible. That's why we
            created bike of stats, a user-friendly bike device. </p>
    </section>
    <section id="about-device" >
        <div id="detailCloseButton2">×</div>
        <h3>about the device</h3>
        <p>The Boss device is a user-friendly, nice looking device. We believe everyone must be able to use this device,
        that's why we created a device that's easily put on your bike. We made use of the innovative Arduino and Raspberry Pi
        software, to make sure you get the best experience possible while riding your bike.</p>
    </section>
    <section id="settings-user">
        <div id="detailCloseButton3">×</div>
        <h3>Settings</h3>
        <a href="#">account settings</a><br>
        <a href="#">log out</a>
        </section>
</div>