// console.log("Hello web!");

$.ajax({
    // url: "https://swapi.dev/api/people",
    url: "https://pokeapi.co/api/v2/pokemon",        
})
    .done((res) =>{
    //    console.log(res.results[0].name);
    // //    console.log(res);
    // text = `<li>${res.results[0].name}</li>`;
    // $("#list-pokemon").html(text);

    text = "";
    $.each(res.results, (key, val) => {
      text += /*html*/ `
        <tr>
          <td>${key + 1}</td>
          <td>${val.name}</td>
          <td>
            <!-- Button trigger modal -->
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onclick = "detail('${val.url}')"
            >
              Detail
            </button>
          </td>
        </tr>
      `;
    });
    $("#list-pokemon").html(text);
  })
  .fail((err) => {
    console.log(err);
  });

function detail(val) {
  console.log(val);
  $.ajax({
    url: val,
  })
    .done((res) => {
      console.log(res);
      text = /*html*/ `<h1>${res.name}</h1>`;
      $("#bodySW").html(text);
    })
    .fail((err) => {
      console.log(err);
    });
}