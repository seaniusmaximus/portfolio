const creative = {}; //ad object
const jitterFixProps = {force3D: true, rotationZ: 0.1, z: 0.1}

function init() {
	console.log("Ad Ready");
	creative.viewport = document.getElementById('viewport');
	gsap.set(['#viewport', '#border'], {autoAlpha:1});
	// gsap.set(['#tmp'], {alpha:0.4});
	frameOne();
}


function frameOne() {
	gsap.set([ '.f1','.f1bg','#cta' ], {autoAlpha:1});

	gsap.from([ '#f1-stamp'], 0.6, { autoAlpha:0, scale:0, ease:'back.out(3)', ...jitterFixProps });
	gsap.from([ '.f1bg'], { autoAlpha:0, scale:0, ease:'back.out(1)', ...jitterFixProps });
	gsap.from(['.f1bg'], 3, {rotation:'random(-65, 65)'})
	gsap.fromTo(['.f1bg'], 3, {y:0}, {y:'random(-5, -35)', yoyo:true, repeat: 1, ease:'none'})

	var frameDelay = 2;
	gsap.to(['.f1'], 0.4, {x:'100%', delay:frameDelay-0.2});
	gsap.to(['.f1bg'], 0.2, {autoAlpha:0, delay:frameDelay-0.2});
	gsap.to(['.f1'], 0.4, {autoAlpha:0, delay:frameDelay});
	gsap.delayedCall(frameDelay, frameTwo);	
}

function frameTwo(){
	gsap.set(['.f2', '.f2bg'], {autoAlpha: 1});
	
	gsap.from(['.f2'], 0.4, {x:'-100%', ease:'back.out(1)' });
	gsap.from([ '.f2bg'], { autoAlpha:0, scale:0, ease:'back.out(1)', ...jitterFixProps });
	gsap.from(['.f2bg'], 5, {rotation:'random(-85, 85)', ease:'none'})
	gsap.fromTo(['.f2bg'], 2, {y:0}, {y:'random(-5, -25)', yoyo:true, repeat: 1, ease:'none'})
	
	var frameDelay = 2;
	gsap.to(['#f2-copy'], 0.4, {x:'100%', delay:frameDelay-0.2});
	gsap.delayedCall(frameDelay, frameThree);
}

function frameThree(){
	gsap.set(['.f3'], {autoAlpha: 1});
	
	gsap.from(['.f3'], 0.4, {x:'-100%', ease:'back.out(1)' });
	
	var frameDelay = 2;
	gsap.to(['.f3'], 0.4, {x:'100%', delay:frameDelay-0.2});
	gsap.delayedCall(frameDelay, endFrame);
}

function endFrame(){
	gsap.set(['.ef'], {autoAlpha: 1});
	
	gsap.fromTo(['#cta'], 0.2, {scale:1}, {delay: 0.4, scale:1.1, yoyo: true, repeat: 1, ...jitterFixProps})
	gsap.from(['#ef-copy'], 0.4, {x:'-100%', ease:'back.out(1)',
		// onComplete:addEventListeners
	});
	
}


function addEventListeners() {
	creative.viewport.addEventListener("mouseover", bannerOver)
}

function bannerOver(e){
	creative.viewport.removeEventListener("mouseover", bannerOver)
	gsap.to(['#cta'], {duration:0.2, scale:1.05, repeat:1, yoyo:true, ease:'power2.out', transformOrigin:"center 481px", ...jitterFixProps, onComplete:bannerOut});
}

function bannerOut(e){
	creative.viewport.addEventListener("mouseover", bannerOver)
}