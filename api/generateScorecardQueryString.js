import { queryFieldsGenerator } from "../utils/dataFields/queryFieldsGenerator.js";
import { keyGenerator } from "../api/keys/keys.js";

const queryFields = queryFieldsGenerator();
const SCORECARDKEY = keyGenerator();

export const generateScorecardQureyString = (querySpecs) => {
  const { query, currentPage, isBasicQuery, schoolId } = querySpecs;

  const scorecardUrl =
    "https://api.data.gov/ed/collegescorecard/v1/schools.json";
  const apiKey = `api_key=${SCORECARDKEY}`;
  const fields = `_fields=${queryFields[query].join()}`;
  let params = "";
  /* --- run the query based on the specific information needed for the gallery card display --- */
  if (isBasicQuery) {
    // get the search value from the input form
    const inputValue = document.querySelector(".search__input").value;
    // Reset the gallery view if no search parameters are entered in the search bar
    if (inputValue === "") {
      document.querySelector(".page__row-gallery").innerHTML = "";
      document.querySelector(".page__row-gallery").style.display = "none";
      document.querySelector(".more__results").style.display = "none";
    }

    // Settings for pagination (if neccessary)
    const page = `page=${currentPage}`;
    const perPage = `per_page=${8}`;
    const institutionType = `school.degrees_awarded.predominant=2,3`;
    const searchValues = inputValue.replace(/[,]{1}[\s]?/, ",").split(",");
    let searchParameter;

    console.log("[searchValues]: ", searchValues);
    const cityParams = searchValues.map((searchValue) => {
      const queryCity = searchValue.replace(" ", "%20");
      searchParameter = `school.city=${queryCity}`;
      return `${fields}&${searchParameter}&${page}&${perPage}&${institutionType}&${apiKey}`;
    });

    const nameParams = searchValues.map((searchValue) => {
      const queryName = searchValue.replace(" ", "%20");
      searchParameter = `school.name=${queryName}`;
      return `${fields}&${searchParameter}&${page}&${perPage}&${institutionType}&${apiKey}`;
    });

    const searchParams = cityParams.concat(nameParams);
    console.log("[searchParams]: ", searchParams);

    const queryStrings = searchParams.map((params) => {
      return `${scorecardUrl}?${params}`;
    });
    return queryStrings;

    // params = `${fields}&${searchParameter}&${page}&${perPage}&${institutionType}&${apiKey}`;
    /* --- run the query based on the data needed for the larger modal and subsections --- */
  } else {
    const searchParameter = `id=${schoolId}`;
    params = `${fields}&${searchParameter}&${apiKey}`;
    // create the query string for the current specifications passed in
    const queryString = `${scorecardUrl}?${params}`;
    return queryString;
  }

  // handleApiRequest(query, params, fields, currentPage);
};
