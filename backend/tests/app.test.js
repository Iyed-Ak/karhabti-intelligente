// tests/app.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
// ============= HOOKS DE TEST =============
beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('❌ Tests doivent s\'exécuter en mode TEST !');
  }
  
  console.log('\n📦 Connexion à la BD de test...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connecté à:', process.env.MONGO_URI?.split('/')[3]);
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  console.log('🧹 BD nettoyée');
});

afterAll(async () => {
  console.log('🔌 Déconnexion de la BD...\n');
  await mongoose.disconnect();
});

describe('Health Check', () => {
  test('GET /api/health - devrait retourner le status du serveur', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toContain('running');
  });
});

describe('404 Handler', () => {
  test('Route inexistante - devrait retourner 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

// ==================== AUTH ROUTES ====================
describe('Auth Routes', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!'
  };

  test('POST /api/auth/register - créer un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(userData.email);
  });

  test('POST /api/auth/register - email déjà utilisé', async () => {
    await request(app).post('/api/auth/register').send(userData);
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/login - connexion réussie', async () => {
    await request(app).post('/api/auth/register').send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - email incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login - mot de passe incorrect', async () => {
    await request(app).post('/api/auth/register').send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: 'WrongPassword123!'
      });

    expect(res.status).toBe(401);
  });
});

// ==================== USERS ROUTES ====================
describe('Users Routes', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User Test',
        email: 'user@example.com',
        password: 'Password123!'
      });
    authToken = registerRes.body.token;
    userId = registerRes.body.user._id;
  });

  test('GET /api/users - récupérer tous les utilisateurs', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/:id - récupérer un utilisateur spécifique', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  test('PUT /api/users/:id - mettre à jour un utilisateur', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Name', phone: '123456789' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  test('DELETE /api/users/:id - supprimer un utilisateur', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });

  test('GET /api/users - sans token d\'authentification', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(401);
  });
});

// ==================== VEHICLES ROUTES ====================
describe('Vehicles Routes', () => {
  let authToken;
  let vehicleId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Vehicle Owner',
        email: 'owner@example.com',
        password: 'Password123!'
      });
    authToken = res.body.token;
  });

  test('POST /api/vehicles - ajouter un véhicule', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        licensePlate: 'TN-1234-ABC',
        vin: 'VIN123456789'
      });

    expect(res.status).toBe(201);
    expect(res.body.brand).toBe('Toyota');
    vehicleId = res.body._id;
  });

  test('GET /api/vehicles - récupérer les véhicules de l\'utilisateur', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/vehicles/:id - récupérer un véhicule spécifique', async () => {
    const res = await request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(vehicleId);
  });

  test('PUT /api/vehicles/:id - mettre à jour un véhicule', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mileage: 50000 });

    expect(res.status).toBe(200);
  });

  test('DELETE /api/vehicles/:id - supprimer un véhicule', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});

// ==================== MAINTENANCE ROUTES ====================
describe('Maintenance Routes', () => {
  let authToken;
  let vehicleId;
  let maintenanceId;

  beforeAll(async () => {
    const authRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Maintenance Owner',
        email: 'maintenance@example.com',
        password: 'Password123!'
      });
    authToken = authRes.body.token;

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        licensePlate: 'TN-5678-XYZ'
      });
    vehicleId = vehicleRes.body._id;
  });

  test('POST /api/maintenance - ajouter une maintenance', async () => {
    const res = await request(app)
      .post('/api/maintenance')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        vehicle: vehicleId,
        type: 'Oil Change',
        description: 'Regular oil change',
        cost: 50,
        date: new Date()
      });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('Oil Change');
    maintenanceId = res.body._id;
  });

  test('GET /api/maintenance - récupérer les maintenances', async () => {
    const res = await request(app)
      .get('/api/maintenance')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/maintenance/:id - mettre à jour une maintenance', async () => {
    const res = await request(app)
      .put(`/api/maintenance/${maintenanceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ cost: 60 });

    expect(res.status).toBe(200);
  });

  test('DELETE /api/maintenance/:id - supprimer une maintenance', async () => {
    const res = await request(app)
      .delete(`/api/maintenance/${maintenanceId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});

// ==================== INFRACTIONS ROUTES ====================
describe('Infractions Routes', () => {
  let authToken;
  let vehicleId;
  let infractionId;

  beforeAll(async () => {
    const authRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Infraction Owner',
        email: 'infraction@example.com',
        password: 'Password123!'
      });
    authToken = authRes.body.token;

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        brand: 'BMW',
        model: 'X5',
        year: 2020,
        licensePlate: 'TN-9999-BMW'
      });
    vehicleId = vehicleRes.body._id;
  });

  test('POST /api/infractions - ajouter une infraction', async () => {
    const res = await request(app)
      .post('/api/infractions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        vehicle: vehicleId,
        type: 'Speed Violation',
        description: 'Exceeded speed limit',
        amount: 200,
        date: new Date()
      });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('Speed Violation');
    infractionId = res.body._id;
  });

  test('GET /api/infractions - récupérer les infractions', async () => {
    const res = await request(app)
      .get('/api/infractions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/infractions/:id - mettre à jour une infraction', async () => {
    const res = await request(app)
      .put(`/api/infractions/${infractionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 250 });

    expect(res.status).toBe(200);
  });

  test('DELETE /api/infractions/:id - supprimer une infraction', async () => {
    const res = await request(app)
      .delete(`/api/infractions/${infractionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});

// ==================== GARAGES ROUTES ====================
describe('Garages Routes', () => {
  let authToken;
  let garageId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Garage Admin',
        email: 'garage@example.com',
        password: 'Password123!'
      });
    authToken = res.body.token;
  });

  test('POST /api/garages - ajouter un garage', async () => {
    const res = await request(app)
      .post('/api/garages')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Best Garage',
        location: 'Tunis',
        phone: '71123456',
        email: 'info@garage.com',
        services: ['Oil Change', 'Tire Replacement']
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Best Garage');
    garageId = res.body._id;
  });

  test('GET /api/garages - récupérer les garages', async () => {
    const res = await request(app)
      .get('/api/garages')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/garages/:id - récupérer un garage spécifique', async () => {
    const res = await request(app)
      .get(`/api/garages/${garageId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });

  test('PUT /api/garages/:id - mettre à jour un garage', async () => {
    const res = await request(app)
      .put(`/api/garages/${garageId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ phone: '71999999' });

    expect(res.status).toBe(200);
  });

  test('DELETE /api/garages/:id - supprimer un garage', async () => {
    const res = await request(app)
      .delete(`/api/garages/${garageId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});