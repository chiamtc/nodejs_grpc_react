GRPC_WEB worked with GRPC repo (https://github.com/chiamtc/nodejs_grpc) using react as frontend app

I've only tested on Mac platform, hopefully it works on yours. To windows platform user, you gotta figure out the docker launch setup

## Prerequisite:
1. Docker installed (tested on my Mac High Sierra)


## Steps:
1. `cd nodejs_grpc_react && npm install` 
2. `docker build -t helloworld/envoy -f ./envoy.Dockerfile . && docker run -d -p 8080:8080 helloworld/envoy`
3. `docker ps` to ensure `helloworld/envoy` is up and running
4. `npm run dev`
5. go to `localhost:9000` , login with email: `test@test.com` and password: `1234`. 


Open issue in this repo if you have any questions.
