FROM inboxappco/node:master

ADD ./package.json /tmp/package.json
RUN npm config set registry "http://registry.npmjs.org/"
RUN cd /tmp && npm install --no-optional
RUN cp -a /tmp/node_modules .

ADD . .
RUN npm run build

CMD rm -rf /www/react && cp -a ./build /www/react
