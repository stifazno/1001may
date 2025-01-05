/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
      table.increments('id').primary(); // Идентификатор пользователя
      table.boolean('isactivated').nullable(); // Статус активации
      table.string('password', 255).notNullable(); // Пароль
      table.string('firstname', 100); // Имя (может быть NULL)
      table.string('lastname', 100); // Фамилия (может быть NULL)
      table.string('email', 100).nullable(); // Электронная почта (может быть NULL)
      table.string('phone', 15).nullable(); // Телефон (может быть NULL)
      table.string('company', 100); // Компания (может быть NULL)
      table.string('username', 100).notNullable(); // Имя пользователя
      
      table.timestamps(true, true); // Поля created_at и updated_at
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users'); // Удаление таблицы users
  };
  