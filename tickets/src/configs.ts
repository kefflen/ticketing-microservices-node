type configs = {
  mongoURI: string
  authUrl: string
}

const localEnvConfigs: configs = {
  mongoURI: 'mongodb://localhost:27017/auth',
  authUrl: 'http://localhost:3000'
}

const kubernetesEnvConfigs: configs = {
  mongoURI: 'mongodb://tickets-mongo-srv:27017/tickets',
  authUrl: 'http://auth-srv:3000'
}

const configs: configs = process.env.ENV == 'KUBERNETES' ? kubernetesEnvConfigs : localEnvConfigs

export default Object.freeze(configs) as configs