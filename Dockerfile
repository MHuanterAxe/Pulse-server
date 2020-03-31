# stage 1 building the node
FROM alpine
RUN apk add npm && npm i -g http-server

VOLUME /home/server
WORKDIR /home/server
COPY ./ /home/server/

EXPOSE 3000

CMD http-server
