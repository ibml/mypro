# 运行阶段
FROM nginx:alpine
# 从编译阶段的中拷贝编译结果到当前镜像中
COPY ./dist /var/www/html
COPY ./custom.conf /etc/nginx/conf.d/default.conf
#RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]