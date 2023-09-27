import { Test, TestingModule } from '@nestjs/testing';
import { UserRegistrationController } from './user-registration.controller';

describe('UserRegistrationController', () => {
  let controller: UserRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRegistrationController],
    }).compile();

    controller = module.get<UserRegistrationController>(UserRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
