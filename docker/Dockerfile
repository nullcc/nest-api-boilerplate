FROM harbor.int.rclabenv.com/library/node:18-alpine AS builder
RUN  mkdir -p /opt/nest-api-boilerplate

COPY ./ /opt/nest-api-boilerplate
WORKDIR /opt/nest-api-boilerplate

RUN npm install -f && npm run build

EXPOSE 3000
CMD ["node", "dist/main"]
