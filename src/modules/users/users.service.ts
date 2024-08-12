import { Inject, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants/providers';
import { Post } from '../posts/posts.entity';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async createUser(user: UserDto): Promise<User> {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const userObject = { ...user, password: hashedPassword };

    const newUser = await this.userRepository.create(userObject);

    return newUser;
  }

  async findOneUser(id: number): Promise<User> {
    const foundUser = await this.userRepository.findByPk(id);

    return foundUser;
  }

  async findOneUserByEmail(email: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({ where: { email } });

    return foundUser;
  }
}
