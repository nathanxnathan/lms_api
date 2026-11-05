import typeorm = require('typeorm');

@typeorm.Entity('users')
export class User {
    @typeorm.PrimaryGeneratedColumn('uuid')
  id!: string;

  @typeorm.Column({ name: 'first_name', length: 100 })
  firstName!: string;

  @typeorm.Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @typeorm.Column({ unique: true })
  email!: string;

  @typeorm.Column({ name: 'password_hash', type: 'text' })
  passwordHash!: string;

  @typeorm.Column({ length: 30 })
  role!: string;

  @typeorm.Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @typeorm.CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @typeorm.UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @typeorm.DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt!: Date | null;
}

