import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Veiculo } from '../entities/veiculo.entity';

@Injectable()
export class VeiculoService {
  async update(veiculo: Veiculo): Promise<Veiculo> {

  let buscaVeiculo = await this.findById(veiculo.id);

  if (!buscaVeiculo || !veiculo.id)
    throw new HttpException('Veículo não encontrado!', HttpStatus.NOT_FOUND);

  return await this.veiculoRepository.save(veiculo);
}
}