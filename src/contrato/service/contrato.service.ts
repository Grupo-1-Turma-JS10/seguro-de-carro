import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VeiculoService } from '../../veiculo/service/veiculo.service';
import { Contrato } from '../entities/contrato.entity';

@Injectable()
export class ContratoService {
  async update(contrato: Contrato): Promise<Contrato> {

  let buscaContrato = await this.findById(contrato.id);

  if (!buscaContrato || !contrato.id)
  throw new HttpException('Contrato não encontrado!', HttpStatus.NOT_FOUND);

  return await this.contratoRepository.save(contrato);
  }
}
