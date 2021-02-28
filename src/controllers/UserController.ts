import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppErrors';

class UserController {

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("Nome obrigatório"),
      email: yup.string().email().required("Insira um email válido")
    });

    try{
      await schema.validate(request.body, { abortEarly: false })
    }catch(err){
      throw new AppError(err);
    }
    

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new AppError("User already exists!");
    }

    const user = usersRepository.create({
      name, email
    });

    await usersRepository.save(user);

    return response.json(user);
  }

  async show(request: Request, response: Response) {

    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.find();
    console.log(user);
    return response.status(201).json(user);
  }

}

export { UserController };

