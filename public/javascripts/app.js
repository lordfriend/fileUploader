/**
 * Created by bob on 11/24/14.
 */

(function($){
  'use strict';
  var alert = $('#listAlert');
  $('#fileList').on('click', '.btn', function(evt) {
    var target = $(evt.target);
    var url = target.next().attr('href');
    $.ajax(url,{
      type: 'DELETE'
    })
      .done(function() {
        window.location.reload();
      })
      .fail(function(){
        alert.addClass('show');
      });
  });

  $('#listAlert .close').on('click', function() {
    alert.removeClass('show');
  });
})(jQuery);