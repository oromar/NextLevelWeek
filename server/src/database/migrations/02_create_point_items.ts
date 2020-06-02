import Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('point_items', (createTableBuilder) => {
    createTableBuilder
      .integer('point_id')
      .notNullable()
      .references('id')
      .inTable('points')
    createTableBuilder
      .integer('items_id')
      .notNullable()
      .references('id')
      .inTable('items')
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('point_items')
}
