# GoJumpAmerica-MS-Deployment

### Automated Deployment of MicroServices using Docker-Compose

---
#### Dependencies:
* docker
* docker-compose

#### Configuration File:
* docker-compose.yaml 

###### Environment variables like host, DB name and other microservice URL's can be set using docker-compose.yaml


#### How to:

#### pull the code (including submodules)

```bash
git clone https://github.com/sales-acceleration-incorporated/docker-compose-deploy --recursive
 ```

#### Run all microservices:
```bash
docker-compose up
 ```

###### add "-d" parameter to run all dockers de-attached, Example: docker-compose -d up

---
