const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Item = require('../lib/models/Item');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};
const mockUser2 = {
  firstName: 'Test',
  lastName: 'User 2',
  email: 'test2@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('items', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('POST /api/v1/items creates a new shopping item with the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const newItem = { description: 'eggs', qty: 12 };
    const resp = await agent.post('/api/v1/items').send(newItem);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      description: newItem.description,
      qty: newItem.qty,
      userId: user.id,
      bought: false,
    });
  });

  it('GET /api/v1/items returns all items associated with the authenticated User', async () => {
    // create a user
    const [agent, user] = await registerAndLogin();
    // add a second user with items
    const user2 = await UserService.create(mockUser2);
    const user1Item = await Item.insert({
      description: 'apples',
      qty: 6,
      userId: user.id,
    });
    await Item.insert({
      description: 'eggs',
      qty: 12,
      userId: user2.id,
    });
    const resp = await agent.get('/api/v1/items');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([user1Item]);
  });

  it('GET /api/v1/items should return a 401 if not authenticated', async () => {
    const resp = await request(app).get('/api/v1/items');
    expect(resp.status).toEqual(401);
  });

  it('UPDATE /api/v1/items/:id should update an item', async () => {
    // create a user
    const [agent, user] = await registerAndLogin();
    const item = await Item.insert({
      description: 'apples',
      qty: 6,
      userId: user.id,
    });
    const resp = await agent
      .put(`/api/v1/items/${item.id}`)
      .send({ bought: true });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ ...item, bought: true });
  });

  it('UPDATE /api/v1/items/:id should 403 for invalid users', async () => {
    // create a user
    const [agent] = await registerAndLogin();
    // create a second user
    const user2 = await UserService.create(mockUser2);
    const item = await Item.insert({
      description: 'apples',
      qty: 6,
      userId: user2.id,
    });
    const resp = await agent
      .put(`/api/v1/items/${item.id}`)
      .send({ bought: true });
    expect(resp.status).toBe(403);
  });

  it('DELETE /api/v1/items/:id should delete items for valid user', async () => {
    const [agent, user] = await registerAndLogin();
    const item = await Item.insert({
      description: 'apples',
      qty: 6,
      userId: user.id,
    });
    const resp = await agent.delete(`/api/v1/items/${item.id}`);
    expect(resp.status).toBe(200);

    const check = await Item.getById(item.id);
    expect(check).toBeNull();
  });
});
