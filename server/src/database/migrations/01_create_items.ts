import Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('items', (createTableBuilder) => {
    createTableBuilder.increments('id').primary()
    createTableBuilder.string('image').notNullable()
    createTableBuilder.string('title').notNullable()
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('items')
}
