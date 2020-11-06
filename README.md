# bots

## Prerequsites

[Meteor](https://www.meteor.com/) - version `1.4.3`

`curl "https://install.meteor.com/?release=1.4.3.1" | sh`

[NodeJS](https://nodejs.org/en/) - version 4.7.3

```
# Install latest version of NodeJS
https://nodejs.org/en/

# Install n to controll NodeJS Version
npm install -g n

# Switch to v4.7.3
n 4.7.3
```

### Up and Running

## Job server (Job Server should be started before Bots)

- cd ..
- git clone https://github.com/jackiekhuu-work/jobs-server.git jobs-server
- cd jobs-server
- git checkout iCare-bots
- meteor npm install
- meteor npm start

## Bots site

- git clone https://github.com/tankhuu/bots.git bots
- cd bots
- meteor npm install
- meteor npm start
