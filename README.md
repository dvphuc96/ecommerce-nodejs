khởi tạo dự án

npm init -y
npm i express --save
start server: node server.js
watch server(nodemon): node --watch server.js
// install package (quan trọng của 1 trang web)

// kiểm tra trang web sử dụng công nghệ gì
curl http://localhost:3055 --include
// thư viện in ra log khi người dùng request, 
morgan có 5 chế độ: 
app.use(morgan("dev"))
morgan("compile"): dc bật khi chạy product
morgan("common")
morgan("short")
morgan("tiny")

npm i @aws-sdk/client-s3
https://www.npmjs.com/package/@aws-sdk/client-s3

npm install @aws-sdk/s3-request-presigner --save
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-s3-request-presigner/

create key private, public
openssl genrsa -out private_key.pem  2048
openssl rsa -in private_key.pem -pubout -out public_key.pem

### add signer for url cloudfront
npm i @aws-sdk/cloudfront-signer --save
https://www.npmjs.com/package/@aws-sdk/cloudfront-signer

npm i cloundinary --save
npm i multer --save
npm i morgan --save-dev
npm i helmet --save-dev (ngăn chặn hacker có thể kiểm tra xem website đang sử dụng công nghệ gì)
npm i compression --save-dev
npm i mongoose --save-dev 
npm i bcrypt --save
npm i crypto --save
npm i jsonwebtoken --save
npm i lodash --save
npm i slugify --save

extension vscode: Mongo Snippets for Node-js, Tabnine, REST Client