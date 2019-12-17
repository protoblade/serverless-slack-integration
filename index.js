'use strict';

const axios = require('axios');
const branchName = require('current-git-branch');


class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.slackhook = this.serverless.service.custom.slackhook;
    this.gitbranch = branchName();
    this.user = this.options.user || "";
    this.stage =  this.options.stage || "dev";
    //console.log(JSON.stringify(this.serverless.service.provider.stage))

    this.initialMessage = "BE Deployment in progress\n"
    + "```Stage: " + this.user + " " + this.stage + "\n"
    + "Branch: " + this.gitbranch + "```";

    this.doneMessage = "BE Deployment on " + this.user + " " + this.stage + " is done"

    this.hooks = {
      'before:deploy:createDeploymentArtifacts': this.sendInitial.bind(this),
      'after:deploy:deploy': this.sendDone.bind(this),
    };
  }

  sendInitial() {
    axios({
      method: 'post',
      url: this.slackhook,
      data: {
        text: this.initialMessage
      }
    });
  }

  sendDone() {
    axios({
      method: 'post',
      url: this.slackhook,
      data: {
        text: this.doneMessage
      }
    });  }
}

module.exports = ServerlessPlugin;
