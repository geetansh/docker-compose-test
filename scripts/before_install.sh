ls -l

yum install -y docker docker-compose

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

cd /home/ec2-user/docker

pwd

ls -l


if [ -d /home/ec2-user/docker ]; then
  sudo rm -R /home/ec2-user/docker
  mkdir /home/ec2-user/docker
fi


