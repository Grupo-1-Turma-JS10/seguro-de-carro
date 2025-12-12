import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { VeiculoService } from '../service/veiculo.service';
import { Veiculo } from '../entities/veiculo.entity';

@Controller('veiculo')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {
    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() veiculo: Veiculo): Promise<Veiculo> {
      return this.veiculoService.update(veiculo);
    }
  }
}
