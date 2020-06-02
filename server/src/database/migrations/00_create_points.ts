import Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('points', (createTableBuilder) => {
    createTableBuilder.increments('id').primary()
    createTableBuilder.string('image').notNullable()
    createTableBuilder.string('name').notNullable()
    createTableBuilder.string('email').notNullable()
    createTableBuilder.string('whatsapp').notNullable()
    createTableBuilder.decimal('latitude').notNullable()
    createTableBuilder.decimal('longitude').notNullable()
    createTableBuilder.string('city').notNullable()
    createTableBuilder.string('uf', 2).notNullable()
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('points')
}
