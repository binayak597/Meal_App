

let mealInput = document.querySelector("#meal-input");
let mealCardSection = document.querySelector("#main");
let favMealListSection = document.querySelector("#favourite-meals");

// storing an array of favourite meal lists in localStorage
if(localStorage.getItem("favouriteMealLists") == null) localStorage.setItem("favouriteMealLists", JSON.stringify([]));

//fetch all meals using an api

const fetchMeals = async (url, userInput) => {

    const response = await fetch(`${url+userInput}`);
    const data = await response.json();
    return data;
}

const showAllMeals = async () => {
    mealCardSection.innerHTML = "";

    let userInput = mealInput.value; 

    //using this api we can retrieve all meals by adding the starting character of any meal
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let arr = JSON.parse(localStorage.getItem("favouriteMealLists"));
    let content = "";

    const result = await fetchMeals(url, userInput);
    const meals = result.meals;
    if(meals){

        meals.forEach(mealObj => {
            let isFav=false;
            for (let index = 0; index < arr.length; index++) {
                if(arr[index]==mealObj.idMeal){
                    isFav=true;
                }
            }
            if (isFav) {
                content += `
            <div id="card" class="card mb-3" style="width: 20rem;">
                <img src="${mealObj.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${mealObj.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                        <button type="button" class="btn btn-outline-light" onclick="fullMealDetails(${mealObj.idMeal})">More Details</button>
                        <button id="main${mealObj.idMeal}" class="btn btn-outline-light active" onclick="addRemoveFavMeal(${mealObj.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            </div>
            `;
            } else {
                content += `
            <div id="card" class="card mb-3" style="width: 20rem;">
                <img src="${mealObj.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${mealObj.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                        <button type="button" class="btn btn-outline-light" onclick="fullMealDetails(${mealObj.idMeal})">More Details</button>
                        <button id="main${mealObj.idMeal}" class="btn btn-outline-light" onclick="addRemoveFavMeal(${mealObj.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            </div>
            `;
            }
        });
    }else{
        content += `
        <div class="page-wrap d-flex flex-row justify-content-center align-items-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                        <span class="display-1 d-block">Sorry</span>
                        <div class="mb-4 lead">
                            The meal you are looking for was not found.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    mealCardSection.innerHTML = content;
}

const fullMealDetails = async (id) => {
    mealCardSection.innerHTML = "";

    //using this api we can retrieve full details of any specific meal by adding the id of that meal
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let content = "";

    const result = await fetchMeals(url, id);
    const [meal] = result.meals;

    content += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${meal.strMealThumb}" alt="" srcset="">
              </div>
              <div id="details" class="d-flex flex-column justify-content-center align-items-center text-center">
                <h3>${meal.strMeal}</h3>
                <h6>Category : ${meal.strCategory}</h6>
                <h6>Area : ${meal.strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3 text-center">
              <h5 class="text-center fs-4">Instruction :</h5>
              <p class="fs-5">${meal.strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${meal.strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;

        mealCardSection.innerHTML = content;
}

const showFavMealLists = async () => {
    let arr = JSON.parse(localStorage.getItem("favouriteMealLists"));

    //using this api we can retrieve full details of any specific meal by adding the id of that meal
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let content = "";

    if(arr.length == 0){
        content += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">Sorry</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }else{
        for (let index = 0; index < arr.length; index++) {
            const result = await fetchMeals(url, arr[index]);
            const [meal] = result.meals;

            content += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="fullMealDetails(${meal.idMeal})">More Details</button>
                            <button id="main${meal.idMeal}" class="btn btn-outline-light active" onclick="addRemoveFavMeal(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
        }
    }
    
    favMealListSection.innerHTML = content;
}

const addRemoveFavMeal = (id) => {
    let arr = JSON.parse(localStorage.getItem("favouriteMealLists"));
    let isRemoveMeal = false;

    for(let idx = 0; idx < arr.length; idx++){

        if(arr[idx] == id) isRemoveMeal = true;
    }

    if(isRemoveMeal){
        let index = arr.indexOf(id);
        arr.splice(index, 1);
        alert("Your meal has successfully removed from the favourite meal list")
    }else{
        arr.push(id);
        alert("Your meal has added successfully to the favourite meal list");
    }

    localStorage.setItem("favouriteMealLists", JSON.stringify(arr));
    showAllMeals();
    showFavMealLists();
}
