import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contrato } from "../../contrato/entities/contrato.entity";

@Entity({ name: "tb_veiculos" })
export class Veiculo {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    marca: string;

    @IsNotEmpty()
    @Column()
    modelo: string;

    @IsNotEmpty()
    @Column()
    ano: number;

    @IsNotEmpty()
    @Column()
    placa: string;

    @IsNotEmpty()
    @Column("decimal", { precision: 10, scale: 2 })
    valor_fipe: number;

    @IsNotEmpty()
    @Column({ type: "date", nullable: true })
    data_fabricacao: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Column()
    data_criacao: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @Column()
    data_atualizacao: Date;

    @ManyToOne(() => Contrato, contrato => contrato.veiculos, {
        onDelete: 'CASCADE'
    })
    contrato: Contrato;
}
