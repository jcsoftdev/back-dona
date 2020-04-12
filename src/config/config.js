//PORT

process.env.PORT = process.env.PORT || 5000

//URI MONGO

const URI_MONGO = 'mongodb://PeruSoftware:y5MsaFdkeOWpcF7K@perusoftware-shard-00-00-c73aw.gcp.mongodb.net:27017,perusoftware-shard-00-01-c73aw.gcp.mongodb.net:27017,perusoftware-shard-00-02-c73aw.gcp.mongodb.net:27017/test?ssl=true&replicaSet=PeruSoftware-shard-0&authSource=admin&retryWrites=true&w=majority'

process.env.URI_MONGO = URI_MONGO

//JWT SECRET

const JWT_TOKEN = 'abcdefghijklmnopqrstuv'

process.env.JWT_TOKEN = JWT_TOKEN

