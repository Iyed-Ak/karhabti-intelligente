require('dotenv').config({ path: '.env.test' });

console.log('🧪 Tests en mode:', process.env.NODE_ENV);
console.log('📦 BD de test:', process.env.MONGO_URI?.split('/')[3]);