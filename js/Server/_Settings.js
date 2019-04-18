module.exports = {
	// Server
	port: 3000,

	// Database
	dbHost: 'localhost', 
	dbUser: 'root', 
	dbPassword: '',
	dbName: 'worldaroundyou',
	dbPoolConnectionLimit: 10,

	// Encryption
	algo: 'aes256',
	key: 'ThisStringNeedsToBe32Characters.',
}