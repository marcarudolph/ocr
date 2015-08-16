FROM ubuntu:trusty

MAINTAINER Marc Rudolph <mr@ingentis.com>

VOLUME /tmp/ocr
WORKDIR /tmp/ocr
CMD /var/lib/OCRmyPDF/OCRmyPDF.sh -d -c -l $lang /tmp/ocr/$input /tmp/ocr/$output

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV SHELL /bin/sh

RUN apt-get update \
	&& apt-get install -y unzip bc python python-lxml python-reportlab poppler-utils ImageMagick parallel unpaper tesseract-ocr tesseract-ocr-deu ghostscript openjdk-6-jre



ADD https://github.com/fritz-hh/OCRmyPDF/archive/v2.x.zip /tmp/

RUN cd /tmp/ \
	&& unzip *.zip -d /var/lib/ \
	&& rm *.zip \
	&& mv /var/lib/OCRmyPDF* /var/lib/OCRmyPDF \
	&& chmod +x /var/lib/OCRmyPDF/OCRmyPDF.sh


# docker run --rm -v /tmp/ocr:/tmp/ocr -e "lang=deu" -e "input=in.pdf" -e "output=out.pdf" ocrmypdf








