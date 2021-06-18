import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

@Entity('memes')
export class Meme extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  sourcePath!: string;

  @Column()
  sourceId!: number;

  @Column()
  pathToMeme!: string;

  @Column()
  imageId!: number;

  @Column()
  text!: string;

  @CreateDateColumn()
  createdTime?: string;
}
