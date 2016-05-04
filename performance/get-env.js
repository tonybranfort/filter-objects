
var env = {
  date: new Date(),
  process: {
    env: {}
  }
}; 

env.process.title = process.title; 
env.process.version = process.version;
env.process.platform = process.platform;
env.process.arch = process.arch;
env.process.versions = process.versions;
env.process.env.NUMBER_OF_PROCESSORS = process.env.NUMBER_OF_PROCESSORS;
env.process.env.OS = process.env.OS;
env.process.env.PROCESSOR_ARCHITECTURE = process.env.PROCESSOR_ARCHITECTURE;
env.process.env.PROCESSOR_IDENTIFIER = process.env.PROCESSOR_IDENTIFIER;
env.process.env.PROCESSOR_LEVEL = process.env.PROCESSOR_LEVEL;
env.process.env.PROCESSOR_REVISION = process.env.PROCESSOR_REVISION;

env.process.memoryUsage = process.memoryUsage();
env.process.uptime = process.uptime();

var getEnv = function(cb) {
  env.process.memoryUsage = process.memoryUsage();
  env.process.uptime = process.uptime();
  if(cb) {
    return cb(null, env); 
  } else {
    return env; 
  }
};

var getPlatform = function() {
  return env.process.platform; 
}; 

var getNodeVersion = function() {
  return env.process.version; 
}; 

module.exports = {
  env: env,
  getEnv: getEnv,
  getPlatform: getPlatform,
  getNodeVersion : getNodeVersion
};
