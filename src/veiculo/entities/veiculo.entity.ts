import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contrato } from "../../contrato/entities/contrato.entity";

@Entity({ name: "tb_veiculos" })
export class Veiculo {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: "A marca não pode estar vazia." })
    @Column({ length: 100, nullable: false })
    marca: string;

    @IsNotEmpty({ message: "O modelo não pode estar vazio." })
    @Column({ length: 100, nullable: false })
    modelo: string;

    @IsNotEmpty({ message: "O ano não pode estar vazio." })
    @Column({ type: "smallint", length: 4, nullable: false })
    ano: number;

    @IsNotEmpty({ message: "A placa não pode estar vazia." })
    @Column({ length: 15, nullable: false })
    placa: string;

    @IsNotEmpty({ message: "O valor FIPE não pode estar vazio." })
    @Column("decimal", { precision: 10, scale: 2, nullable: false })
    valor_fipe: number;

    @IsNotEmpty({ message: "A data de fabricação não pode estar vazia." })
    @Column({ type: "date", nullable: false })
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
