import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe(' Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  //! 1st test
  it('handles a signup request', () => {
    const user = {
      name: 'newname',
      email: 'testtingnewemail@gmail.com',
      password: 'newpassword',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });

  //! 2nd test
  it('signup as a new user and get the currently logged in user', async () => {
    const email = 'john123@gmail.com';
    const name = 'john123';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name, email, password: 'john123' })
      .expect(201)

    // First Signup, get the cookie from the response
    const cookie = res.get('Set-Cookie');

    // Attach that cookie to the whoami headers
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
    
    expect(body.email).toEqual(email);
  });
});
