FROM ubuntu:trusty

MAINTAINER Marc Rudolph <mr@ingentis.com>

VOLUME /tmp/ocr
CMD ["node", "/ocr/head/server.js"]

ENV DEBIAN_FRONTEND noninteractive

ENV HOME /root
ENV SHELL /bin/sh

RUN apt-get update \
	&& apt-get install -y cifs-utils

ADD http://nodejs.org/dist/v0.11.13/node-v0.11.13-linux-x64.tar.gz /tmp/
RUN tar xzvf /tmp/node*.tar.gz --strip-components=1 -C /usr/local

RUN mkdir /mnt/queue \
	&& mkdir /mnt/target

ADD ./package.json /ocr/head/package.json
RUN cd /ocr/head/ && npm install

ADD . /ocr/head


ADD fstab /etc/fstab

# docker run -d -v /tmp/ocr:/tmp/ocr \
# 		-v /root/.smbcredentials:/root/.smbcredentials
#       -v /usr/bin/docker:/usr/bin/docker \
#		-v /usr/lib/libdevmapper.so.1.02:/usr/lib/libdevmapper.so.1.02 \
#       -v /var/run/docker.sock:/var/run/docker.sock 

#--cap-add=SYS_ADMIN
