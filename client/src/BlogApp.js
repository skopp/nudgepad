nudgepad.apps.blog = new App('blog')

nudgepad.apps.blog.createPost = function () {
  $('.nudgepad#content,.nudgepad#title').val('')
  $('.nudgepad#advanced').val('timestamp ' + new Date().getTime() + '\ntemplate blog_theme')
  $('.nudgepad#permalink').attr('value', '')
  $('.nudgepad#title').focus()
  nudgepad.apps.blog.activePost = null
}

nudgepad.apps.blog.deletePost = function () {
  nudgepad.apps.blog.activePost = null
  var name = Permalink($('.nudgepad#permalink').attr('value'))
  if (!name)
    return nudgepad.error('No post to delete')
  
  if (!nudgepad.site.get('posts ' + name))
    return nudgepad.error('Post does not exist')

  nudgepad.site.delete('posts ' + name)
  
  // Send Commit to Server
  var patch = new Space()
  patch.set('posts ' + name, '')
  nudgepad.emit('patch', patch.toString())
  nudgepad.apps.blog.restart()
}

nudgepad.apps.blog.editPost = function (name) {
  nudgepad.apps.blog.activePost = name
  var post = nudgepad.site.get('posts ' + name)
  $('.nudgepad#content').val(post.get('content'))
  $('.nudgepad#title').val(post.get('title'))
  var postSettings = new Space(post.toString())
  postSettings.delete('title')
  postSettings.delete('content')
  $('.nudgepad#advanced').val(postSettings.toString())
  // http://{{nudgepad.domain}}/<a class="nudgepad" id="permalink" target="_blog"></a>
  $('.nudgepad#permalink').text('http://' + nudgepad.domain + '/' + name).attr('value', name)
  
  nudgepad.apps.blog.updateLinks()
  
  $('.nudgepad#content').focus()
  
}

nudgepad.apps.blog.activePost = null

nudgepad.apps.blog.onopen = function () {
  $('.nudgepad#posts').html('')
  if (!nudgepad.site.get('posts'))
    return true
  _.each(nudgepad.site.get('posts').keys, function (name) {
    console.log(name)
    var value = nudgepad.site.get('posts').get(name)
    var div = $('<div >' + value.get('title') + '</div>')
      .css({
      'color' : '#777',
      'margin-bottom' : '9px',
      'font-size' : '13px'
      })
      .on('click', function () {
        nudgepad.apps.blog.editPost($(this).attr('value'))
      })
      .attr('value', name)
      .attr('title', name)
    $('.nudgepad#posts').append(div)
  })
  
}

nudgepad.apps.blog.onready = function () {
  
  // Open the last edited post if there is one
  if (nudgepad.apps.blog.activePost)
    nudgepad.apps.blog.editPost(nudgepad.apps.blog.activePost)
  else
    nudgepad.apps.blog.createPost()
}

nudgepad.apps.blog.savePost = function () {

  var name = Permalink($('.nudgepad#permalink').attr('value'))
  
  if (!name)
    return nudgepad.error('Title cannot be blank')
  
  var post = nudgepad.site.get('posts ' + name)
  if (!post)
    post = new Space()

  post.set('content', $('.nudgepad#content').val())
  post.set('title', $('.nudgepad#title').val())
  post.patch($('.nudgepad#advanced').val())
  
  nudgepad.site.set('posts ' + name, post)
  
  // Send Commit to Server
  var patch = new Space()
  patch.set('posts ' + name, post)
  
  // If they are editing a post and the name has changed,
  // make sure to delete old post
  if (nudgepad.apps.blog.activePost && nudgepad.apps.blog.activePost !== name) {
    patch.set('posts ' + nudgepad.apps.blog.activePost, '')
    nudgepad.site.delete('posts ' + nudgepad.apps.blog.activePost)
  }
  
  nudgepad.emit('patch', patch.toString())
  nudgepad.apps.blog.activePost = name
//  nudgepad.apps.blog.updateLinks()
  nudgepad.apps.blog.restart()
  window.open(name, 'published')
}

nudgepad.apps.blog.updateLinks = function () {
  $('.nudgepad#posts div').css('color', '#777')
  // todo: improve this
  $('.nudgepad#posts div').each(function () {
    if ($(this).attr('value') == nudgepad.apps.blog.activePost)
      $(this).css('color', '#333')  
  })
}

nudgepad.apps.blog.updatePermalink = function () {
  var permalink = Permalink($('.nudgepad#title').val())
  $('.nudgepad#permalink').text('http://' + nudgepad.domain + '/' + permalink).attr('value', permalink)
}
