import { BadGatewayException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { RegisterUserDto, UpdateAuthDto,CreateUserDto, LoginDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel:Model<User>,
    private jwtService: JwtService
  ){}

     async  create(createUserDto: CreateUserDto): Promise <User> {
  

  try {
    
    const {password, ...userData} = createUserDto;

    const newUser = new this.userModel({
      password:bcryptjs.hashSync(password,10),
      ...userData
    });
    
     await newUser.save();
     const {password:_, ...user}= newUser.toJSON();

    return user;

    //1.- Encriptar la contraseña
    
    
    //2.- Guardar el Usuario
    
    //3.- Generar el JWT
    
    
  
  } catch (error) {
      if(error.code === 11000){
        throw new BadGatewayException(`${createUserDto.email} already exists!`)
      }
      throw  new InternalServerErrorException('Something terrible happen!!!');
  }

  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse>{

    const user = await this.create(registerDto);
    console.log({user});
    return{
      user: user,
      token: this.getJwtToken({id: user._id})

    }
  }
  


    async login( loginDto: LoginDto ) {

      const { email, password } = loginDto;
  
      const user = await this.userModel.findOne({ email });
      if ( !user ) {
        throw new UnauthorizedException('Not valid credentials - email');
      }
      if (!bcryptjs.compareSync(password, user.password)){
        throw new UnauthorizedException('Not valid credentials - email');
      }
      
      const {password:_, ...rest }= user.toJSON();

      return{
        user: rest,
        token:this.getJwtToken({id: user.id}),
      }
    // console.log({ loginDto });

    //*user{_id,name,email,roles}
    //*Token => AJBDJD;SNJ/"TGJ"
    //*/
  }
  findAll() { 
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(playload: JwtPayload){
    const token = this.jwtService.sign(playload);
    return token;
  }
}
