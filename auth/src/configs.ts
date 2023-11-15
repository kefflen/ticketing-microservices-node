type configs = {
  mongoURI: string
}

const localEnvConfigs: configs = {
  mongoURI: 'mongodb://localhost:27017/auth'
}

const kubernetesEnvConfigs: configs = {
  mongoURI: 'mongodb://auth-mongo-srv:27017/auth'
}

const configs: configs = process.env.ENV == 'KUBERNETES' ? kubernetesEnvConfigs : localEnvConfigs

export default Object.freeze(configs) as configs