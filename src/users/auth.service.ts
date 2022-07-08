import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        // if email in use

        const users = await this.usersService.find(email);

        if (users.length > 0) {
            throw new BadRequestException('Email is used already');
        }
        // password encrypt
        // generate salt , hash salt and password
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;


        // join hashed result and store

        const result = salt + '.' + hash.toString('hex');


        // create user
        const user = await this.usersService.create(email, result);


        return user;
    }

    async signin(email: string, password: string) {

        //find user 
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('wrong password');
        }

        return user;

    }
}