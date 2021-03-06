/**
 * For selecting multiple blocks at once.
 */
nudgepad.pages.selectBox = {
  on : true
}

/**
 * Fires on mouseup
 */
nudgepad.pages.selectBox.clear = function () {

  if ($('#nudgepadSelectBox').length ==0)
    return
  
  nudgepad.feedback.record('used select box')
  
  var s = $('#nudgepadSelectBox'),
      left = s.left(),
      right = s.right(),
      _top = s.top() + nudgepad.stage.scrollTop(),
      bottom = s.bottom() + nudgepad.stage.scrollTop()
  nudgepad.stage.selection.clear()
  
  // select every visible block thats entirely within the rectangle
  var offsetLeft = $('#nudgepadStageBody').offset().left
  $('#nudgepadStageBody .scrap:visible').each(function () {
    
    var l_left = $(this).left() + offsetLeft,
        l_top = $(this).top(),
        l_right = $(this).right() + offsetLeft,
        l_bottom = $(this).bottom()
    if ( left <= l_left && right >= l_right && _top <= l_top && bottom >= l_bottom) {
      $(this).selectMe()
    }
  })
  $('#nudgepadSelectBox').remove()
  // For now, to prevent bugs, we prevent scrolling while select is happening.
//  $('#nudgepadStage,#nudgepadStageBody').css('overflow', 'auto')
}



/**
 * Draws the blue box that is the workers selection.
 *
 * @param {object} Mouse move event
 */
nudgepad.pages.selectBox.update = function (event) {

  if (!nudgepad.pages.selectBox.on) {
    // Even if off, you can override by holding shift key
    if (!nudgepad.mouse.is_mouse_down || !nudgepad.mouse.down.shiftKey)
      return true
  }
  
  if ($('#nudgepadSelectBox').length == 0) {
    $('#nudgepadStage').append('<div id="nudgepadSelectBox" style="top: ' + nudgepad.mouse.down.pageY + ';left: ' + nudgepad.mouse.down.pageX + ';"></div>')
    nudgepad.pages.selectBox.scrollTop = nudgepad.stage.scrollTop()
    // For now, to prevent bugs, we prevent scrolling while select is happening.
//    $('#nudgepadStage,#nudgepadStageBody').css('overflow', 'hidden')
  }
  var element = $('#nudgepadSelectBox')
  var directions = {"vertical" : nudgepad.mouse.down.pageY + nudgepad.pages.selectBox.scrollTop, "horizontal" : nudgepad.mouse.down.pageX}
  for (var i in directions) {
    
    var direction = i,
        origin = directions[i],
        new_value = (direction == "horizontal" ? nudgepad.mouse.move.pageX : nudgepad.mouse.move.pageY + nudgepad.stage.scrollTop()),
        size = (direction == "horizontal" ? "width" : "height"),
        position = (direction == "horizontal" ? "left" : "top"),
        d = (direction == "horizontal" ? "verticals" : "horizontals"),
        change = new_value - origin
    // if positive change, increase size, keep position
    if (change >= 0)
      element.css(size, change).css(position, origin)
    
    // if negative change, decrease position, increase size.
    else
      element.css(position, new_value).css(size, -change)
  }
  // Prevent default page scrolling
  event.preventDefault()
}

nudgepad.on('main', function () {
  $(document).on("slide", nudgepad.pages.selectBox.update)
  $(document).on("slideend", nudgepad.pages.selectBox.clear)
})




