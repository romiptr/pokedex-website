$(document).ready(function () {
  getPokedex();
});

function getPokedex() {
  $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0.",
  })
    .done((pokemon) => {
      showPokedexMenu(pokemon);
  })
    .fail((err) => {
      console.log(err);
    });
}

function showPokedexMenu(pokemon) {
  text = "";
  index = "";
  $.each(pokemon.results, function (key, val) { 
    index = "#" + (key + 1).toString().padStart(4,'0');
    text += /*html*/ `
      <div class="col-xl-2 col-md-3  col-6 mb-3 mt-3">

        <div class="card" data-bs-toggle="modal" data-bs-target="#pokemon-modal" 
              id="pokemon-card-${key+1}">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${key+1}.png"
                class="card-img-top " style="background-color:#F2F2F2;">

            <div class="card-body">
              <h4 class="card-subtitle text-start p-2 border-gradient" 
                  id="pokedex-menu-index"> ${index} </h4>
              <h4 class="card-title text-center text-capitalize mt-3"
                  id="pokedex-menu-name"> ${val.name} </h4>
            </div>
          </div>
        </div>
      `;
      $("#pokedex-menu").on("click","#pokemon-card-"+(key + 1),() => { 
        getPokemonDetails(key+1)
      });
    })
    $("#pokedex-menu").html(text);
}

function getPokemonDetails(pressedIndex){
  pokemonModalDetails = []
  $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon/" + pressedIndex,
  })
    .done((details) => {
      pokemonModalDetails = getSpeciesDetails(details.species.url)
      showPokemonModal(details, pokemonModalDetails)
      $('#pokemon-modal-image').attr('src', details.sprites.other['official-artwork'].front_default);
  })
    .fail((err) => {
      console.log(err);
    });
}

function getSpeciesDetails(speciesUrl){
  speciesDetails = []
  $.ajax({
    url: speciesUrl,
    async: false,
  })
  .done((species) => {
    
    $.each(species.flavor_text_entries, function (idx, val) { 
      if (val.language.name === "en") {
        speciesDetails.push(species.habitat.name,val.flavor_text);
        return false;
      }
    });
      speciesDetails[1] = speciesDetails[1].replace(/\n|\f/g," " );
  })
  .fail((err) => {
    console.log(err);
  });
  return speciesDetails;
}

function showPokemonModal(details, speciesDetails){
  typeText = ""
  $.each(details.types, function (key, val){
    typeText += `<h6 class="text-capitalize" style="text-align: center;">${val.type.name}</h6>`;
  });

  abilityText = ""
  $.each(details.abilities, function (key, val){
    abilityText += `<h6 class="text-capitalize" style="text-align: center;">${val.ability.name}</h6>`;
  });

  modalText = ""
  modalText = /*html*/ `
  <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header" >
                        <h1 class="modal-title fs-3 text-capitalize" id="staticBackdropLabel"> ${details.name} </h1>
                    </div>
                    
                    <!-- Modal Body-->
                    <div class="modal-body mb-3">
                        <div class="container-fluid">
                            <div class="row">

                                <!-- Image -->
                                <div class="col-lg-5">
                                <img src="" id="pokemon-modal-image" alt="Pokemon Modal Image" 
                                    class="img-fluid rounded d-block border border-2" style="background-color: #908484;" >
                                </div>

                                <!-- Main Content -->
                                <div class="col-lg-7">
                                    <!-- Description -->
                                    <div class="row">
                                        <div class="col-sm-12 mt-3">
                                        <p>${speciesDetails[1]}</p>
                                        </div>
                                    </div>

                                    <!-- Details -->
                                    <div class="row gx-1 p-1">
                                        <div class="col-sm-12" id="border-modal-stat-costum">
                                            <div class="row">
                                                <div class="col-sm-6">
                                                    <h5> Height: </h5>
                                                    <h6 style="text-align: center;"> ${details.height + "\""} </h6>
                                                </div>
                                                <div class="col-sm-6">
                                                    <h5> Weight: </h5>
                                                    <h6 style="text-align: center;"> ${details.weight + " lbs"} </h6>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <h5> Habitat: </h5>
                                                    <h6 class="text-capitalize" style="text-align: center;"> ${speciesDetails[0]} </h6>
                                                    </div>
                                                    </div>
                                                    <div class="row">
                                                    <div class="col-sm-12">
                                                    <h5> Type: </h5>
                                                        ${typeText}
                                                    <div id="type-container" style="text-align: center;"></div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <h5> Ability: </h5>
                                                        ${abilityText}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <!-- Stats Bar -->
                                <div class="row mt-3 gx-3" id="border-modal-statbar-costum">
                                    <div class="col-sm-6">
                                        HP
                                        <div class="progress" role="progressbar">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" aria-valuemax="255" 
                                            id="pokemon-progress-stat" style="width: ${((details.stats[0].base_stat/255)*100)}%">${details.stats[0].base_stat}</div>
                                        </div>

                                        Att
                                        <div class="progress" role="progressbar">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" aria-valuemax="255" 
                                            id="pokemon-progress-stat" style="width: ${((details.stats[1].base_stat/255)*100)}%">${details.stats[1].base_stat}</div>
                                        </div>

                                        Def
                                        <div class="progress" role="progressbar">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" aria-valuemax="255"
                                            id="pokemon-progress-stat" style="width: ${((details.stats[2].base_stat/255)*100)}%">${details.stats[1].base_stat}</div>
                                        </div>
                                    </div>

                                    <div class="col-sm-6">
                                        Speed
                                        <div class="progress" role="progressbar">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated" aria-valuemax="255"
                                            id="pokemon-progress-stat" style="width: ${((details.stats[5].base_stat/255)*100)}%">${details.stats[5].base_stat}</div>
                                        </div>

                                        Special Attack
                                        <div class="progress" role="progressbar">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-secondary" aria-valuemax="255"
                                            id="pokemon-progress-stat" style="width: ${((details.stats[3].base_stat/255)*100)}%">${details.stats[3].base_stat}</div>
                                        </div>

                                        Special Defense
                                        <div class="progress" role="progressbar">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" aria-valuemax="255"
                                            id="pokemon-progress-stat" style="width: ${((details.stats[4].base_stat/255)*100)}%">${details.stats[4].base_stat}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <!-- Modal Footer-->
                        <div class="modal-footer">
                            <div class="d-grid gap-2 col-10 mx-auto">
                                <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Back to Pokedex</button>
                            </div>
                        </div>
                    </div>
  `;
  $("#pokemon-modal .modal-dialog").html(modalText);
}