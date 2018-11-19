const Sobel = require('sobel');
const math = require('mathjs');
const brain = require('brain.js');



function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function DrawCaptcha(imgSrc = '../captcha3.png') {
	var canvas = document.querySelector('#captcha-img');
	var width = canvas.width;
	var height = canvas.height;
	var ctx = canvas.getContext('2d');
	var img = new Image;
	img.onload = function () {
		canvas.width = img.width;
		canvas.height = img.height;
		width = img.width;
		height = img.height;
		ctx.drawImage(this, 0, 0);
	}
	img.src = imgSrc;
}


var DetectEdges = () => {
	var canvasOri = document.querySelector('#captcha-img');
	var canvas = document.querySelector('#captcha-edge');
	var width = canvasOri.width;
	var height = canvasOri.height;
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext('2d');
	var ctxOri = canvasOri.getContext('2d');
	var imgdata = ctxOri.getImageData(0, 0, width, height);
	var sobelData = Sobel(imgdata);
	var sobelImageData = sobelData.toImageData();
	ctx.putImageData(sobelImageData, 0, 0);
}

var calcBinarize = (limit, dtMin) => {
	var canvasOri = document.querySelector('#captcha-edge');
	var ctxOri = canvasOri.getContext('2d');
	var canvas = document.querySelector('#captcha-binarize');
	var width = canvasOri.width;
	var height = canvasOri.height;
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext('2d');
	var imgdata = ctxOri.getImageData(0, 0, width, height);
	ctx.putImageData(imgdata, 0, 0);

	var t = limit;
	var dt = dtMin;

	/*while (dt >= dtMin) {
		var g1 = [];
		var g2 = [];
		for (var linha = 0; linha < width; linha++) {
			for (var coluna = 0; coluna < height; coluna++) {
				var pixel = ctx.getImageData(linha, coluna, 1, 1);
				var data = pixel.data;
				if (data[0] < t && data[1] < t && data[2] < t) g1.push(data[0]);
				else g2.push(data[0]);
			}
		}
		const m1 = math.mean(g1);
		const m2 = math.mean(g2);
		const nt = (m1 + m2) / 2;

		dt = Math.abs(nt - t);
		t = nt;
	}*/

	for (var linha = 0; linha < width; linha++) {
		for (var coluna = 0; coluna < height; coluna++) {
			var pixel = ctx.getImageData(linha, coluna, 1, 1);
			var data = pixel.data;
			if (data[0] < t && data[1] < t && data[2] < t) {
				data[0] = 255;
				data[1] = 255;
				data[2] = 255;
			} else {
				data[0] = 0;
				data[1] = 0;
				data[2] = 0;
			}

			ctx.putImageData(pixel, linha, coluna);
			ctx.fillStyle = 'rgba(' + data[0] +
				',' + data[1] +
				',' + data[2] +
				',' + (data[3] / 255) + ')';
		}
	}
}

var Binarize = (limit) => {
	const dtMin = 1;
	const min = 0;
	const max = 255;

	limit = limit ? limit : (max + min) / 2;

	calcBinarize(limit, dtMin);
}

var SplitLetters = () => {
	var canvasOri = document.querySelector('#captcha-binarize');
	var ctxOri = canvasOri.getContext('2d');
	var canvas = document.querySelector('#captcha-split');
	var width = canvasOri.width;
	var height = canvasOri.height;
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext('2d');
	var imgdata = ctxOri.getImageData(0, 0, width, height);
	ctx.putImageData(imgdata, 0, 0);
	var fillPix;

	var letters = [];
	console.log(width);

			//var pixel = ctx.getImageData(coluna, linha, 1, 1);
			//var data = pixel.data;
	
					letters.push({initX : 10,
					initY : 5});
	
					letters[0].finalX = 24;
					letters[0].finalY = height - 10;
					var fl = 34;
					var f = 24
		
					for(let i = 1; i < 5; i++) {
						if(i === 1) {
							letters.push({initX : fl,
								initY : 5});
								letters[i].finalX = f;
					letters[i].finalY = height - 10;
						} else {
							fl +=24;
							f +=1;
							letters.push({initX : fl,
								initY : 5});
								letters[i].finalX = f;
							letters[i].finalY = height - 10;
						}
							
	
					
					}

				

			/*
			if(linha <=5 && linha > 3) {
				data[0] = 0;
				data[1] = 0;
				data[2] = 0;
				ctx.putImageData(pixel, coluna, linha);
			}

			if(linha >= height - 2) {
				data[0] = 0;
				data[1] = 0;
				data[2] = 0;
				ctx.putImageData(pixel, coluna, linha);
			}*/

	for (let i = 0; i < letters.length; i++) {
		ctx.strokeRect(letters[i].initX, 5, letters[i].finalX, height - 10);
	console.log('Dimensoes');
	console.log(Math.abs(letters[i].finalX - letters[i].initX));
	console.log('por');
	console.log(letters[i].finalY - letters[i].initY);
	console.log(letters);
	}
	return letters;

}

var runRecognize = (letters) => {
	// provide optional config object (or undefined). Defaults shown.
	const config = {
		inputSize: 20,
		outputSize: 5,
	};

	// create a simple feed forward neural network with backpropagation
	const net = new brain.NeuralNetwork(config);






	//captcha
	var canvasOri = document.querySelector('#captcha-binarize');
	var canvas = document.querySelector('#captcha-recog');
	var width = letters[0].finalX - letters[0].initX;
	var height = letters[0].finalY - letters[0].initY;
	canvas.width = canvasOri.width;
	canvas.height = canvasOri.height;
	var ctxOri = canvasOri.getContext('2d');
	var ctx = canvas.getContext('2d');

	var dataTrain = [];
	for(let i=0; i<letters.length - 1; i++) {
		var lettData = ctxOri.getImageData(letters[i].initX, letters[i].initY, letters[i].finalX, letters[i].finalY);
		let outpt = [];
		for(j = 0; j < 5; j++) {
			outpt.push(0);	
		}
		outpt[i] = 1;
		dataTrain.push({
			input: lettData.data,
			output: outpt
		})
		//ctx.putImageData(lettData, 0, 0);
		

	}

	net.train(dataTrain);
	var runData = ctxOri.getImageData(letters[2].initX, letters[2].initY, letters[2].finalX, letters[2].finalY);
	var output = net.run(runData); 
	console.log(output.toString());
}

module.exports = {
	DrawCaptcha,
	DetectEdges,
	Binarize,
	SplitLetters,
	runRecognize,
}