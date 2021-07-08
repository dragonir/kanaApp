var petalPlayers = [];
    function animatePetals() {
      var petals = document.querySelectorAll('.petal');
      if (!petals[0].animate) {
        var petalsContainer = document.getElementById('petals-container');
        petalsContainer.prepend("Uh oh, it seems like your browser doesn't support Web Animations API yet. Have you tried this in Firefox or Chrome?");
        return false;
      }
      for (var i = 0, len = petals.length; i < len; ++i) {
        var petal = petals[i];
        petal.innerHTML = '<div class="rotate"><img src="data:image/png;base64,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" class="askew"></div>';
        var scale = Math.random() * .8 + .2;
        var player = petal.animate([
          { transform: 'translate3d(' + (i / len * 100) + 'vw,0,0) scale(' + scale + ')', opacity: scale },
          { transform: 'translate3d(' + (i / len * 100 + 10) + 'vw,150vh,0) scale(' + scale + ')', opacity: 1 }
        ], {
          duration: Math.random() * 90000 + 3000,
          iterations: Infinity,
          delay: -(Math.random() * 5000)
        });
        petalPlayers.push(player);
      }
    }
    animatePetals();