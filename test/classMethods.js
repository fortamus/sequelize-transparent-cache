const t = require('tap')
const sequelize = require('./helpers/sequelize')

const User = sequelize.models.User
const Article = sequelize.models.Article
const Comment = sequelize.models.Comment
const cacheStore = User.cache().client().store

t.test('Class methods', async t => {
  await sequelize.sync()

  t.deepEqual(cacheStore, {}, 'Cache is empty on start')

  const user = await User.cache().create({
    id: 1,
    name: 'Daniel'
  })

  const user2 = await User.cache().create({
    id: 4,
    name: 'Mark'
  })

  const user3 = await User.cache().create({
    id: 5,
    name: 'Bob'
  })

  const article = await Article.cache().create({
    uuid: '2086c06e-9dd9-4ee3-84b9-9e415dfd9c4c',
    title: 'New article'
  })

  const comment = await Comment.cache().create({
    userId: user.id,
    articleUuid: article.uuid,
    body: 'New comment'
  })
  t.test('Create', async t => {
    t.deepEqual(
      cacheStore.User[1],
      user.get(),
      'User with default primary key cached after create'
    )
    t.deepEqual(
      cacheStore.Article[article.uuid],
      article.get(),
      'Entity with custom primary key cached after create'
    )
    t.deepEqual(
      cacheStore.Comment[`${comment.userId},${comment.articleUuid}`],
      comment.get(),
      'Entity with composite primary keys cached after create'
    )
    t.deepEqual(
      (await User.cache().findById(1)).get(),
      user.get(),
      'Cached user with primary key correctly loaded'
    )

    t.deepEqual(
      (await Article.cache().findById(article.uuid)).get(),
      article.get(),
      'Cached entity correctly loaded using custom primary key'
    )
  })

  t.test('Upsert', async t => {
    await User.cache().upsert({
      id: 1,
      name: 'Ivan'
    })

    // TODO: Fix this issue
    t.deepEqual(
      (await User.cache().findById(1)).get(),
      (await User.findById(1)).get(),
      'Timestamps synced after upsert', { skip: true }
    )

    await user.cache().reload()

    t.is(user.name, 'Ivan', 'User name was updated')

    t.deepEqual(
      cacheStore.User[1],
      user.get(),
      'User cached afrer upsert'
    )
  })

  t.test('FindById', async t => {
    t.is(await User.cache().findById(2), null, 'Cache miss not causing any problem')
  })

  t.test('FindAllById', async t => {
    let users = User.cache().findAllById([1, 4, 5]);
    console.log(typeof users);
    users.then(tmp => {
      //console.log(tmp[0]);
    });


    await t.test('check result', async(t) => {
      //await users;
      users.then(tmp => {

      });
      t.end();
    })

    await t.equal(
      await User.cache().findAllById([1, 4, 5]), await Promise.all([User.findById(1), User.findById(4), User.findById(5)]),
      'FindAllById returns expected', { skip: true }
    )
    //t.is(await User.cache().findAllById([1, 4, 5]), null, 'Cache miss not causing any problem')
  })

})
