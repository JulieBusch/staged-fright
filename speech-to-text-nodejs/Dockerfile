
FROM centos:centos6
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum install -y nodejs  #
# Define working directory.

RUN npm install

EXPOSE 3000 8020
# Define default command.
CMD ["node", "server.js"]
