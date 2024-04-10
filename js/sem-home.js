$(document).ready(function() {
	$('div.hidden1').fadeIn(1000).removeClass('hidden');
	$('div.hidden2').fadeIn(2000).removeClass('hidden');
	$('div.hidden3').fadeIn(2000).removeClass('hidden');
    setCurrentIssueStats();
    setSpecialIssueStats();

    var textWrapper = document.querySelector('.ml2');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<a href='currentissue.html'><span class='letter'>$&</span></a>");

    anime.timeline({loop: true})
      .add({
        targets: '.ml2 .letter',
        scale: [4,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70*i
      }).add({
        targets: '.ml2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
});

function setSpecialIssueStats(){
    $.getJSON("volume/specialvolinfo.json", function(info){
        $('#sivolname').html(info.name);
        $('#sivolperiod').html(info.period);
    });
}

function setCurrentIssueStats(){
    $.getJSON("volume/currentvolinfo.json", function(info){
        //$('#acivolname').html(info.name + ' ' + info.period);
        $('#civolname').html(info.name);
        $('#civolperiod').html(info.period);
    });
}