/* global $AD, window */
var boxOpenTL;
var boxSpinTL;
var flickerTL;
var resultsTL;
var pizzaOptions = ['jalapeno', 'mushroom-bacon', 'mushroom-pepperoni', 'pepper', 'sausage-ham'];

function createTimeline() {
    var delay = 0.03;
    var numSpins = 3;

    boxOpenTL = new TimelineMax();

    boxOpenTL.to('#top-closed', delay, {display: 'none'});
    boxOpenTL.to('#top-opening-1', delay, {display: 'block'});
    boxOpenTL.to('#top-opening-2', delay, {display: 'block'});
    boxOpenTL.to('#top-opening-1', delay, {display: 'none'},'-='+delay);
    boxOpenTL.to('#top-opening-3', delay, {display: 'block'});
    boxOpenTL.to('#top-opening-2', delay, {display: 'none'},'-='+delay);
    boxOpenTL.to('#top-open', delay, {display: 'block'});
    boxOpenTL.to('#top-opening-3', delay, {display: 'none'},'-='+delay);

    boxOpenTL.pause(0);

    boxSpinTL = new TimelineMax();
    boxSpinTL.to('#pizza-box', 2,{rotation:360*(numSpins-0.5), ease: Back.easeIn});
    boxSpinTL.to('#pizza-box', 1,{rotation:360*numSpins, ease: Power4.easeOut},'-=0.5');

    boxSpinTL.pause(0);

    resultsTL = new TimelineMax();
    resultsTL.to('#results-box', 0.10,{opacity:1, display:'block'});
    resultsTL.to('#results-box', 0.05,{opacity:0});
    resultsTL.to('#results-box', 0.05,{opacity:1});
    resultsTL.to('#results-box', 0.1,{opacity:0});
    resultsTL.to('#results-box', 0.25,{opacity:1});
    resultsTL.to('#results-headline', 0.25,{opacity:1});
    resultsTL.to('#results', 0.25,{opacity:1});
    resultsTL.pause(0);
}

function boxOpen() {
    boxOpenTL.play();
    document.getElementById('vines').play();
}
function boxClose() {
    boxOpenTL.reverse();
}
function boxSpin() {
    boxSpinTL.play();
}

function showResults() {
    resultsTL.play(0);
}

function resizeElements() {
    TweenMax.set('#pizza-box', {
        scale: 0.75,
        x: 0,
        y: 270
    });
    TweenMax.set('#container', {scale:0.5});
}

function flickerScreen() {
    flickerTL = new TimelineMax({onComplete:flickerScreen});
    flickerTL.to('#flicker', Math.random()*0.25,{
        opacity: 1,
        display: 'block'
    });
    flickerTL.to('#flicker', Math.random()*0.25,{
        opacity: 0,
        display: 'none'
    });
}

function stopFlicker() {
    flickerTL.pause(0);
}

function pickPizza() {
    var randNum = Math.floor(Math.random() * pizzaOptions.length);
    var pizza = pizzaOptions[randNum];

    boxClose();
    setTimeout(boxSpin, 1000);
    setTimeout(function(){
        flickerScreen();
        setTimeout(stopFlicker, 3000);
        TweenMax.set('#try-button', {display: 'none'});
        TweenMax.set('#pizza', {backgroundImage:'url("assets/pizza-' + pizza + '.png"'});
        TweenMax.set('#results', {backgroundImage:'url("assets/results-' + pizza + '.png"'});
    },1200);
    setTimeout(function(){
        TweenMax.to('#focus', 1,{opacity: 0, display: 'none'});
        boxOpen();
        setTimeout(showResults, 1000);
    }, 4000);

}

function handleClick(e) {
   var id = e.target.id;

   switch (id) {
       default:
           $AD.click('clickthrough');
       break;
       case 'main-cta':
           $AD.click('clickthrough.learn more');
       break;
       case 'try-button':
           $AD.event('Select Pizza');
           pickPizza();
       break;
   }
}

function init() {
    createTimeline();
    resizeElements();

    TweenMax.set('#container', {display:'block'});

    setTimeout(boxOpen, 1000);

    document.getElementById('container').onclick = handleClick;
}

$AD.ready(init);
