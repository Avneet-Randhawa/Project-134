Status = "";
objects = [];

window.alert("In this Project a danger warning sound will be played if any object, or a person/baby is not found. As soon as the model will found any person, the danger warning sound will stop. Click on start button to test the website...");

function preload() {
    danger = loadSound("danger_warning.mp3");
    console.log(danger);
}

function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
    video.size(380, 380);
}

function start() {
    objectDetector = ml5.objectDetector('cocossd', modeloaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects!!!";
}

function modeloaded() {
    console.log("Model Is Loaded!!!");
    Status = true;
}

function got_results(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        objects = results;

    }
}

function draw() {

    image(video, 0, 0, 380, 380);
    if (objects.length == 0 && Status != "") {
        document.getElementById("presence").innerHTML = "Baby/Person Not Found";
        if (danger.isPlaying() == false) {
            danger.play();
        }
    }
    if (objects.length != 0 && Status != "") {
        danger.stop();
    }

    if (Status != "") {

        r = random(255);
        g = random(255);
        b = random(255);

        objectDetector.detect(video, got_results);
        document.getElementById("status").innerHTML = "Status : Objects Detected";

        for (i = 0; i < objects.length; i++) {
            if (objects[i].label != "person") {
                document.getElementById("presence").innerHTML = "Baby/Person Not Found";
                if (danger.isPlaying() == false) {
                    danger.play();
                }
            }
            if (objects[i].label == "person") {
                danger.stop();
                document.getElementById("presence").innerHTML = "Baby/Person Found";
                stroke(r, g, b);
                noFill();
                textFont("cursive");
                percent = floor(objects[i].confidence * 100);
                text(objects[i].label + "  " + percent + "%", objects[i].x + 15, objects[i].y + 15);
                rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            }
        }
    }
}