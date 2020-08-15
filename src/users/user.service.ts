import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm'
import User from "./user.entity";
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export default class UserService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async getUserByEmail(email: string): Promise<User> {
        const user = this.userRepository.findOne({ email })
        if(user) return user;
        throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND)
    }

    async getUserById(id: number): Promise<User> {
        const user = this.userRepository.findOne({ id: Number(id) })
        if(user) return user;
        throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND)
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(user);
        await this.userRepository.save(newUser)
        return newUser;
    }

}
