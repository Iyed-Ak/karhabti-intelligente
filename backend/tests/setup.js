// Ce fichier est chargé AVANT les tests
// Il configure l'environnement de test
require('dotenv').config({ path: '.env.test' });

console.log('✅ Setup tests chargé');
console.log('🧪 Mode:', process.env.NODE_ENV);
console.log('📦 BD:', process.env.MONGO_URI?.split('/')[3]);