exports.seed = function (knex) {
  // Clear the 'categories' table
  return knex('categories')
    .del()
    .then(function () {
      // Insert default categories
      return knex('categories').insert([
        { name: 'נסיעות', user_id: 'all' },
        { name: 'אוכל', user_id: 'all' },
        { name: 'בידור', user_id: 'all' },
        { name: 'אטרקציות', user_id: 'all' },
      ]);
    });
};
