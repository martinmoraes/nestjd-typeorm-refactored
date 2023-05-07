import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1683311657239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE client (
        id int unsigned NOT NULL AUTO_INCREMENT,
        name varchar(80) NOT NULL,
        email varchar(127) NOT NULL UNIQUE,
        password varchar(127) NOT NULL,
        phone varchar(20) NOT NULL,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id));`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('client');
  }
}
