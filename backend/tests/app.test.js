// tests/app.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

let authToken;
let userId;
let vehicleId;

// ============= SETUP =============
beforeAll(async () => {
  console.log('\n🔧 Configuration des tests...');
  
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('❌ Les tests doivent s\'exécuter en mode TEST');
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connecté à la BD de test');
});

beforeEach(async () => {
  console.log('🧹 BD nettoyée');
  await User.deleteMany({});
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  console.log('\n🔌 Déconnexion de la BD...');
  await User.deleteMany({});
  await Vehicle.deleteMany({});
  await mongoose.disconnect();
});

// ============= HEALTH CHECK =============
describe('Health Check', () => {
  test('✅ GET /api/health - devrait retourner le status du serveur', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});

// ============= 404 HANDLER =============
describe('404 Handler', () => {
  test('✅ Route inexistante - devrait retourner 404', async () => {
    const res = await request(app).get('/api/inexistant');
    expect(res.status).toBe(404);
  });
});

// ============= AUTH ROUTES =============
describe('Auth Routes', () => {

  test('✅ POST /api/auth/register - créer un nouvel utilisateur', async () => {
    const userData = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      phone: `${Date.now() % 10000000}`,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    console.log('📝 Register Response:', res.status, res.body?.message);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email');

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  test('❌ POST /api/auth/register - email déjà utilisé', async () => {
    const email = `duplicate_${Date.now()}@example.com`;
    const phone = `${Date.now() % 10000000}`;
    
    const userData = {
      name: 'Test User',
      email,
      phone,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    // Créer le premier utilisateur
    await request(app)
      .post('/api/auth/register')
      .send(userData);

    // Essayer créer un deuxième avec le même email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        ...userData,
        phone: `${(Date.now() + 1) % 10000000}` // Phone différent
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Email already exists');
  });

  test('✅ POST /api/auth/login - connexion réussie', async () => {
    const userData = {
      name: 'Login Test User',
      email: `login_${Date.now()}@example.com`,
      phone: `${Date.now() % 10000000}`,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    // D'abord créer l'utilisateur
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(registerRes.status).toBe(201);

    // Puis se connecter
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    console.log('📝 Login Response:', loginRes.status, loginRes.body?.message);

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body).toHaveProperty('token');
  });

  test('❌ POST /api/auth/login - email incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(401);
  });

  test('❌ POST /api/auth/login - mot de passe incorrect', async () => {
    const userData = {
      name: 'Wrong Password Test',
      email: `wrong_${Date.now()}@example.com`,
      phone: `${Date.now() % 10000000}`,
      password: 'CorrectPassword123!',
      confirmPassword: 'CorrectPassword123!'
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: 'WrongPassword123!'
      });

    expect(res.status).toBe(401);
  });

  test('✅ GET /api/auth/me - récupérer le profil', async () => {
    // D'abord créer et se connecter
    const userData = {
      name: 'Me Test User',
      email: `me_${Date.now()}@example.com`,
      phone: `${Date.now() % 10000000}`,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(userData);

    const token = registerRes.body.token;

    // Récupérer le profil
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
  });

  test('❌ GET /api/auth/me - sans token', async () => {
    const res = await request(app)
      .get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});

// ============= VEHICLES ROUTES =============
describe('Vehicles Routes', () => {

  beforeEach(async () => {
    // Créer un utilisateur et obtenir le token AVANT chaque test
    const userData = {
      name: 'Vehicle Test User',
      email: `vehicle_${Date.now()}@example.com`,
      phone: `${Date.now() % 10000000}`,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(userData);

    if (registerRes.status === 201) {
      authToken = registerRes.body.token;
      userId = registerRes.body.user.id;
      console.log('✅ Token obtenu pour les tests vehicles');
    } else {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', registerRes.body);
    }
  });

  test('✅ POST /api/vehicles - ajouter un véhicule SANS VIN', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plate: 'ABC123',
        fuel: 'Essence'
      });

    console.log('🚗 Create Vehicle Response:', res.status);

    expect(res.status).toBe(201);
    expect(res.body.vehicle).toBeDefined();
    expect(res.body.vehicle.brand).toBe('Toyota');
    expect(res.body.vehicle.vin).toBeNull();
    vehicleId = res.body.vehicle._id;
  });

  test('✅ POST /api/vehicles - ajouter avec VIN unique', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        plate: 'XYZ789',
        vin: `VIN_${Date.now()}`,
        fuel: 'Diesel'
      });

    expect(res.status).toBe(201);
    expect(res.body.vehicle.vin).toBeDefined();
  });

  test('❌ POST /api/vehicles - VIN déjà utilisé', async () => {
    const vin = `DUPLICATE_${Date.now()}`;

    // Créer un véhicule avec VIN
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Audi',
        model: 'A4',
        year: 2022,
        plate: 'AUD001',
        vin,
        fuel: 'Essence'
      });

    // Essayer créer un autre avec le même VIN
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Mercedes',
        model: 'C-Class',
        year: 2021,
        plate: 'MER001',
        vin,
        fuel: 'Diesel'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  test('✅ GET /api/vehicles - récupérer tous les véhicules', async () => {
    // Créer un véhicule d'abord
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        plate: 'HND001',
        fuel: 'Essence'
      });

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.vehicles).toBeDefined();
    expect(Array.isArray(res.body.vehicles)).toBe(true);
  });

  test('✅ GET /api/vehicles/:id - récupérer UN véhicule', async () => {
    // Créer un véhicule d'abord
    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        plate: 'BMW001',
        fuel: 'Diesel'
      });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.vehicle._id).toBe(vehicleId);
  });

  test('✅ PUT /api/vehicles/:id - mettre à jour', async () => {
    // Créer un véhicule d'abord
    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        plate: 'VW001',
        fuel: 'Essence',
        mileage: 50000
      });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mileage: 75000 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle.mileage).toBe(75000);
  });

  test('✅ DELETE /api/vehicles/:id - supprimer', async () => {
    // Créer un véhicule d'abord
    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Mazda',
        model: 'CX-5',
        year: 2022,
        plate: 'MAZ001',
        fuel: 'Essence'
      });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });

  test('❌ GET /api/vehicles/:id - véhicule inexistant', async () => {
    const fakeId = '000000000000000000000000';
    const res = await request(app)
      .get(`/api/vehicles/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  test('❌ POST /api/vehicles - sans authentification', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plate: 'ABC123',
        fuel: 'Essence'
      });

    expect(res.status).toBe(401);
  });
});