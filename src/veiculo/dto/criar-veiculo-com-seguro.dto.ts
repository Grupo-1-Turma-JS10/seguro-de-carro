import { Veiculo } from '../entities/veiculo.entity';
import { IsNotEmpty, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarVeiculoComSeguroDTO {
  @ValidateNested()
  @Type(() => Veiculo)
  veiculo: Veiculo;

  @IsOptional()
  @IsArray()
  seguroIds?: number[];
}

export class VinculoSeguroVeiculoDTO {
  @IsNotEmpty()
  veiculoIds: number[];
}
