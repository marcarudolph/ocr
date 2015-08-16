"use strict"

var fs = require("fs-extra"),
	path = require("path"),
	shortId = require('shortid'),
	process = require('child_process'),
	Promise = require('es6-promise').Promise;

var queueInterval = 5000,
	queuePath = "/mnt/queue/",
	inProcessPath = queuePath + "in-process/",
	backupPath = queuePath + "bak/",
	targetPath = "/mnt/target/",
	ocrPath = "/tmp/ocr/",
	lang = "deu",
	ocrImageName = "ocrmypdf";

fs.ensureDirSync(inProcessPath);
fs.ensureDirSync(backupPath);

setInterval(processQueue, queueInterval);


function processQueue() {
	fs.readdir(queuePath, function(err, files) {
		if (err) {
			//TODO: Error Handling
			return;
		}

		var pdfs = files.filter(function(f){ return /\.pdf/.test(f); });

		pdfs.forEach(runOcr);
	})
}

function runOcr(pdfPath) {
	var fileName = path.basename(pdfPath),
		id = shortId.generate(),
		inProcessFilePath = inProcessPath + fileName,
		targetFilePath = targetPath + id + ".pdf";

	fs.rename(pdfPath, inProcessFilePath, function(err) {
		if (err) {
			handleError(err);
			return;
		}
		var ocrFilePath = ocrPath + id;
		fs.copy(inProcessFilePath, ocrFilePath, function(err) {
			if (err) {
				handleError(err);
				return;
			}

			var processedFilePath = ocrFilePath + ".pdfa",
				command = buildOcrCommand(ocrFilePath, processedFilePath);

	    	var proc = process.exec(command, function (err, stdout, stderr) {
				if (err) {
					handleError(err);
					return;
				}
	    	});

	    	proc.on("exit", function (exitCode) {
	    		fs.unlink(ocrFilePath, function(err) {
					if (err) {
						handleError(err);
						return;
					}
				});

				if (exitCode !== 0) {
					handleError(err);
					return;
				}				
				fs.rename(processedFilePath, targetFilePath, function(err) {
					if (err) {
						handleError(err);
						return;
					}
					var backupFilePath = backupPath + fileName;
					fs.rename(inProcessFilePath, backupFilePath, function(err) {
						if (err) {
							handleError(err);
							return;
						}
					});
				});				
			});

		});
	})	
}

function buildOcrCommand(inputFilePath, processedFilePath, language) {
	var inputFileName = path.basename(inputFilePath),
		outputFileName = path.basename(processedFilePath);

	var cmd = 'docker run --rm -v /tmp/ocr:/tmp/ocr -e "lang=' + language + '" -e "input=' + inputFileName + '" -e "output=' + outputFileName + '" ' + ocrImageName;
	return cmd;
}

function handleError(err) {
	console.error(err.stack);
}
