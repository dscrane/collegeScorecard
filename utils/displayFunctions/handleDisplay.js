import { generateScorecardQureyString } from "../../api/generateScorecardQueryString.js";
import { scorecardApiRequest } from "../../api/scorecardApiRequest.js";
import { handleBasicScorecard } from "../responseHandlers/handleBasicScorecard.js";
import { handleModalScorecard } from "../responseHandlers/handleModalScorecard.js";
import { handleSubsections } from "../responseHandlers/handleSubsections.js";
import { noResultsTemplate } from "../../templates/noResultsTemplate.js";
import { displaySearchError } from "../displayFunctions/displaySearchError.js";

const noResultsDisplay = noResultsTemplate();

export const handleDisplay = (specs) => {
  const { query, currentPage, isBasicQuery, imgUrl, schoolId } = specs;
  console.log("[Specs]: ", query, currentPage, isBasicQuery, imgUrl, schoolId);
  /*--- handle the basic query results ---*/
  if (isBasicQuery) {
    // define the specifications for the current query
    const querySpecs = { query, currentPage, isBasicQuery };
    // create the query string using the current specifications
    const queryString = generateScorecardQureyString(querySpecs);
    console.log("[isBasic queryString]: ", queryString);

    const apiResponses = queryString.map((string) => {
      return scorecardApiRequest(string);
    });
    console.log(apiResponses);
    /*--- handle the response data from the API ---*/
    Promise.allSettled(apiResponses)
      .then((apiResponse) => {
        console.log("[apiResponse]: ", apiResponse);
        let scorecardData = [];
        let totalResults = 0;
        apiResponse.forEach((response) => {
          console.log(response.value.data.results);
          scorecardData = scorecardData.concat(response.value.data.results);
          totalResults += response.value.data.metadata.total;
        });

        console.log("[scorecardData]: ", scorecardData);
        console.log("[totalResults]: ", totalResults);

        return {
          scorecardData,
          totalResults,
        };
      })
      .then((responseData) => {
        const { scorecardData, totalResults } = responseData;
        // display an error message if there are no matches to the query params
        if (scorecardData.length === 0) {
          displaySearchError(noResultsDisplay);
          return;
        }

        handleBasicScorecard(scorecardData, currentPage);

        /*--- Hide the 'load more' button when there are no additional results to display ---*/
        // calculate the number of pages based on the number of cards per page
        const pages = totalResults / 8;
        // if the pages is greater than one set additional pages to that else set to 0
        let additionalPages = pages > 1 ? pages : 0;
        // display a message when there are no more results or display the 'load more button'
        console.log(
          `currentPage: ${currentPage} ___ additionalPages: ${additionalPages}`
        );
        if (currentPage >= additionalPages - 1 || additionalPages < 1) {
          document.querySelector("#page__row-more_id").innerHTML =
            "<div class='page__row-more_notice'>No additional results can be found</div>";
        } else {
          document.querySelector("#page__row-more_id").style.display = "flex";
        }
      });
    return;
  }
  if (query === "defaultQuery") {
    const querySpecs = { query, schoolId };
    const queryString = generateScorecardQureyString(querySpecs);
    console.log("[!isBasic queryString]: ", queryString);

    scorecardApiRequest(queryString).then((response) =>
      handleModalScorecard(response, query, imgUrl)
    );
    return;
  }

  const querySpecs = { query, schoolId };
  const queryString = generateScorecardQureyString(querySpecs);
  scorecardApiRequest(queryString).then((response) => {
    handleSubsections(response, query);
  });
};
