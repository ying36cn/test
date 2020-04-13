module.exports = {
    publicPath : '/miaomiao',
    devServer : {
        proxy : {
            '/api2' :　{
                target : 'http://47.115.186.243:3000',
                changeOrigin : true
            },
            '/api' :　{
                target : 'http://39.97.33.178',
                changeOrigin : true
            }
        }
    }
}