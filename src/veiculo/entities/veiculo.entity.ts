import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tb_veiculos' })
export class Veiculo {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 50 })
    marca: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 50 })
    modelo: string;

    @IsNotEmpty()
    @Column({ type: 'smallint', width: 4 })
    ano: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 20 })
    placa: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 17 })
    chassi: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 30 })
    cor: string;

    @IsNotEmpty()
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor_fipe: number;
}