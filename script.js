const video = document.getElementById('video')

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'), //face detector but smaller and quicker
	faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //Register different parts of face like nose, mouth, etc.
	faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //Recognise where face is using box
	faceapi.nets.faceExpressionNet.loadFromUri('/models') //Recognise expression like happy, sad, etc
]).then(startVideo)

function startVideo() {
	navigator.getUserMedia(
		{ video: {} },
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

video.addEventListener('play', () => {
	const canvas = faceapi.createCanvasFromMedia(video)
	document.body.append(canvas)
	const displaySize = { width: video.width, height: video.height }
	faceapi.matchDimensions(canvas, displaySize)
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
		const resizedDetections = faceapi.resizeResults(detections, displaySize)
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		faceapi.draw.drawDetections(canvas, resizedDetections)
		faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
		faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
	}, 100)	//detectAllFaces => get all faces inside webcam image, every time called, here 100 milliseconds
})