$(document).ready( function(){

  $('.findArticle').bind("keydown", function(e)
	{
        if (e.keyCode === 13)
		      {
            var result = findVariant($(this).val());
          }
  });
});
